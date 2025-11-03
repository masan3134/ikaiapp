/**
 * Analysis Chat Service
 * Her analize özel scope-isolated AI chat
 */

const { MilvusClient } = require('@zilliz/milvus2-sdk-node');
const axios = require('axios');
const { AnalysisContextBuilder } = require('../utils/analysisContextBuilder');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

class AnalysisChatService {
  constructor() {
    this.milvusClient = null;
    this.prisma = prisma;  // Prisma instance
    this.contextBuilder = new AnalysisContextBuilder();
    this.ollamaUrl = process.env.OLLAMA_URL || 'http://ollama:11434';
    this.ollamaModel = process.env.OLLAMA_MODEL || 'nomic-embed-text';
    this.geminiApiKey = process.env.GEMINI_API_KEY;
    this.collectionName = 'analysis_chat_contexts';
  }

  /**
   * Initialize Milvus connection
   */
  async initialize() {
    if (this.milvusClient) return;

    try {
      const { DataType } = require('@zilliz/milvus2-sdk-node');

      this.milvusClient = new MilvusClient({
        address: process.env.MILVUS_URL || 'milvus:19530',
        ssl: process.env.MILVUS_SSL === 'true' || false
      });

      // Create collection if it doesn't exist
      const hasCollection = await this.milvusClient.hasCollection({
        collection_name: this.collectionName
      });

      if (!hasCollection.value) {
        console.log(`📦 Creating collection: ${this.collectionName}`);

        await this.milvusClient.createCollection({
          collection_name: this.collectionName,
          fields: [
            {
              name: 'id',
              description: 'Primary key',
              data_type: DataType.Int64,
              is_primary_key: true,
              autoID: true
            },
            {
              name: 'analysis_id',
              description: 'Analysis ID',
              data_type: DataType.VarChar,
              max_length: 36
            },
            {
              name: 'analysis_version',
              description: 'Analysis version number',
              data_type: DataType.Int64
            },
            {
              name: 'chunk_type',
              description: 'Type of chunk (summary, job, candidate, top_candidates)',
              data_type: DataType.VarChar,
              max_length: 50
            },
            {
              name: 'chunk_index',
              description: 'Chunk index',
              data_type: DataType.Int64
            },
            {
              name: 'candidate_id',
              description: 'Candidate ID (if applicable)',
              data_type: DataType.VarChar,
              max_length: 36
            },
            {
              name: 'chunk_text',
              description: 'Text content of chunk',
              data_type: DataType.VarChar,
              max_length: 8000
            },
            {
              name: 'chunk_embedding',
              description: 'Vector embedding (768-dim)',
              data_type: DataType.FloatVector,
              dim: 768
            },
            {
              name: 'metadata',
              description: 'JSON metadata',
              data_type: DataType.VarChar,
              max_length: 2000
            },
            {
              name: 'created_at',
              description: 'Creation timestamp',
              data_type: DataType.Int64
            }
          ]
        });

        // Create HNSW index for vector search
        await this.milvusClient.createIndex({
          collection_name: this.collectionName,
          field_name: 'chunk_embedding',
          index_type: 'HNSW',
          metric_type: 'COSINE',
          params: {
            M: 30,
            efConstruction: 200
          }
        });

        // Load collection into memory
        await this.milvusClient.loadCollection({
          collection_name: this.collectionName
        });

        console.log(`✅ Collection created: ${this.collectionName}`);
      } else {
        // Make sure collection is loaded
        await this.milvusClient.loadCollection({
          collection_name: this.collectionName
        });
        console.log(`✅ Collection loaded: ${this.collectionName}`);
      }

      console.log('✅ Analysis Chat Service initialized');
    } catch (error) {
      console.warn('⚠️ Milvus connection failed (chat features will be unavailable):', error.message);
      this.milvusClient = null;
    }
  }

  /**
   * Embedding oluştur (Ollama)
   */
  async generateEmbedding(text) {
    try {
      if (!text || text.trim().length === 0) {
        throw new Error('Text cannot be empty');
      }

      const response = await axios.post(`${this.ollamaUrl}/api/embed`, {
        model: this.ollamaModel,
        input: text.substring(0, 2000)
      }, { timeout: 30000 });

      if (!response.data || !response.data.embeddings || response.data.embeddings.length === 0) {
        throw new Error('Invalid Ollama response');
      }

      return response.data.embeddings[0];
    } catch (error) {
      console.error('Embedding generation error:', error.message);
      throw error;
    }
  }

  /**
   * Analiz context'ini Milvus'a yükle
   */
  async loadAnalysisContext(analysisId) {
    try {
      console.log(`🔄 Loading context for analysis ${analysisId}...`);

      await this.initialize();

      if (!this.milvusClient) {
        throw new Error('Milvus is not available');
      }

      // Analysis version al ÖNCE
      const analysis = await this.prisma.analysis.findUnique({
        where: { id: analysisId },
        select: { version: true }
      });

      const currentVersion = analysis?.version || 1;

      // Context zaten var mı kontrol et (VERSION-AWARE!)
      const existing = await this.milvusClient.query({
        collection_name: this.collectionName,
        expr: `analysis_id == "${analysisId}" && analysis_version == ${currentVersion}`,  // ← Version check!
        output_fields: ['id'],
        limit: 1
      });

      if (existing.data && existing.data.length > 0) {
        console.log(`⚠️ Context v${currentVersion} already exists, skipping...`);
        return { success: true, message: 'Context already loaded', version: currentVersion };
      }

      console.log(`📦 Loading fresh context for version ${currentVersion}...`);

      // Chunk'ları oluştur
      const chunks = await this.contextBuilder.buildChunks(analysisId);

      console.log(`📦 Created ${chunks.length} chunks`);
      console.log(`🏷️ Tagging chunks with version: ${currentVersion}`);

      // Her chunk için embedding oluştur ve Milvus'a ekle
      const insertData = [];

      for (let i = 0; i < chunks.length; i++) {
        const chunk = chunks[i];

        console.log(`⏳ Processing chunk ${i + 1}/${chunks.length} (${chunk.chunk_type})...`);

        const embedding = await this.generateEmbedding(chunk.chunk_text);

        insertData.push({
          analysis_id: analysisId,
          analysis_version: currentVersion,  // ← VERSION TAG!
          chunk_type: chunk.chunk_type,
          chunk_index: chunk.chunk_index,
          candidate_id: chunk.candidate_id || '',
          chunk_text: chunk.chunk_text.substring(0, 8000),
          chunk_embedding: embedding,
          metadata: JSON.stringify(chunk.metadata || {}),
          created_at: Date.now()
        });
      }

      // Batch insert
      await this.milvusClient.insert({
        collection_name: this.collectionName,
        fields_data: insertData
      });

      console.log(`✅ Loaded ${chunks.length} chunks for analysis ${analysisId}`);

      return { success: true, chunks: chunks.length };
    } catch (error) {
      console.error('Load context error:', error);
      throw error;
    }
  }

  /**
   * Yeni eklenen adaylar için chunk ekle
   */
  async addCandidateChunks(analysisId, candidateIds) {
    try {
      console.log(`🔄 Adding ${candidateIds.length} new candidate chunks...`);

      await this.initialize();

      for (const candidateId of candidateIds) {
        // Analiz sonucunu al
        const result = await prisma.analysisResult.findFirst({
          where: { analysisId, candidateId },
          include: { candidate: true }
        });

        if (!result) {
          console.warn(`⚠️ Result not found for candidate ${candidateId}`);
          continue;
        }

        // Chunk index belirle (mevcut en yüksek + 1)
        const maxIndex = await this.getMaxChunkIndex(analysisId);

        // Analysis version al
        const analysis = await this.prisma.analysis.findUnique({
          where: { id: analysisId },
          select: { version: true }
        });

        // Chunk oluştur
        const chunk = this.contextBuilder.createCandidateChunk(result, maxIndex + 1);

        // Embedding
        const embedding = await this.generateEmbedding(chunk.chunk_text);

        // Milvus'a ekle (VERSION TAG ile)
        await this.milvusClient.insert({
          collection_name: this.collectionName,
          fields_data: [{
            analysis_id: analysisId,
            analysis_version: analysis?.version || 1,  // ← VERSION TAG!
            chunk_type: chunk.chunk_type,
            chunk_index: chunk.chunk_index,
            candidate_id: chunk.candidate_id,
            chunk_text: chunk.chunk_text.substring(0, 8000),
            chunk_embedding: embedding,
            metadata: JSON.stringify(chunk.metadata),
            created_at: Date.now()
          }]
        });

        console.log(`✅ Added chunk for candidate ${candidateId}`);
      }

      // Summary chunk'ı güncelle
      await this.updateSummaryChunk(analysisId);

      return { success: true, added: candidateIds.length };
    } catch (error) {
      console.error('Add candidate chunks error:', error);
      throw error;
    }
  }

  /**
   * Summary chunk'ı güncelle
   */
  async updateSummaryChunk(analysisId) {
    try {
      await this.initialize();

      // Eski summary'yi sil
      await this.milvusClient.delete({
        collection_name: this.collectionName,
        expr: `analysis_id == "${analysisId}" && chunk_type == "summary"`
      });

      // Güncel summary oluştur
      const analysis = await prisma.analysis.findUnique({
        where: { id: analysisId },
        include: {
          jobPosting: true,
          analysisResults: {
            include: { candidate: true },
            orderBy: { compatibilityScore: 'desc' }
          }
        }
      });

      const summaryChunk = this.contextBuilder.createSummaryChunk(analysis);
      const embedding = await this.generateEmbedding(summaryChunk.chunk_text);

      // Yeni summary ekle (VERSION TAG ile)
      await this.milvusClient.insert({
        collection_name: this.collectionName,
        fields_data: [{
          analysis_id: analysisId,
          analysis_version: analysis.version,  // ← VERSION TAG!
          chunk_type: summaryChunk.chunk_type,
          chunk_index: summaryChunk.chunk_index,
          candidate_id: '',
          chunk_text: summaryChunk.chunk_text,
          chunk_embedding: embedding,
          metadata: JSON.stringify(summaryChunk.metadata),
          created_at: Date.now()
        }]
      });

      console.log('✅ Summary chunk updated');
    } catch (error) {
      console.error('Update summary error:', error);
      throw error;
    }
  }

  /**
   * Max chunk index al
   */
  async getMaxChunkIndex(analysisId) {
    const results = await this.milvusClient.query({
      collection_name: this.collectionName,
      expr: `analysis_id == "${analysisId}"`,
      output_fields: ['chunk_index'],
      limit: 1000
    });

    if (!results.data || results.data.length === 0) return 0;

    return Math.max(...results.data.map(r => r.chunk_index));
  }

  /**
   * Analize özel chat
   */
  async chat(analysisId, userMessage, conversationHistory = [], clientVersion = null) {
    try {
      await this.initialize();

      if (!this.milvusClient) {
        throw new Error('AI Chat service is temporarily unavailable. Please try again later.');
      }

      console.log(`💬 Chat request for analysis ${analysisId}`);

      // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      // PHASE 3: FACTS System (DB-First Authority)
      // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

      const analysis = await this.prisma.analysis.findUnique({
        where: { id: analysisId },
        include: {
          jobPosting: { select: { title: true } },
          _count: { select: { analysisResults: true } }
        }
      });

      if (!analysis) {
        throw new Error('Analysis not found');
      }

      const FACTS = {
        analysisId: analysisId,
        version: analysis.version,
        candidateCount: analysis._count.analysisResults,
        jobTitle: analysis.jobPosting.title,
        updatedAt: analysis.updatedAt ? analysis.updatedAt.toISOString() : new Date().toISOString(),
        status: analysis.status
      };

      console.log('📊 FACTS:', FACTS);

      // Conversation reset on version change + history limit
      let history = conversationHistory.slice(-10);  // ← Max 10 messages (memory limit)
      let versionChanged = false;

      if (clientVersion && clientVersion !== FACTS.version) {
        console.log(`🔄 Version changed: v${clientVersion} → v${FACTS.version}, resetting conversation`);
        history = [];
        versionChanged = true;
      }

      // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      // PHASE 4: Intent Router - EXPANDED (GPT-5 Top-5)
      // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

      const INTENT_PATTERNS = {
        average: /(ortalama\s*(skor|puan))/i,
        bottom3: /(en düşük|en kötü|son 3)/i,
        top3: /(en iyi 3|ilk 3|top 3)/i,
        list: /(liste|isim.*yaz|tüm.*isim|adayların.*isim)/i,
        exists: /(var\s*mı|mevcut\s*mu)/i,
        lastUpdate: /(son.*güncell|ne\s*zaman)/i,
        count: /(kaç|toplam)/i
      };

      function detectIntent(msg) {
        if (process.env.INTENT_ROUTER_EXPANDED !== 'true') {
          // Old: only count
          return /(kaç|toplam)/.test(msg) ? 'count' : 'rag';
        }
        for (const [intent, pattern] of Object.entries(INTENT_PATTERNS)) {
          if (pattern.test(msg)) return intent;
        }
        return 'rag';
      }

      const intent = detectIntent(userMessage);

      // COUNT
      if (intent === 'count') {
        const { trackIntentBypass } = require('../routes/metricsRoutes');
        trackIntentBypass();

        return {
          reply: `Bu analizde toplam **${FACTS.candidateCount} aday** değerlendirilmiştir.\n\n✅ Doğrulandı: ${new Date(FACTS.updatedAt).toLocaleString('tr-TR')}\n📌 Analiz Versiyonu: ${FACTS.version}`,
          sources: [{ type: 'db_direct', score: 100 }],
          facts: FACTS,
          version: FACTS.version,
          bypassedLLM: true,
          intent: 'count'
        };
      }

      // TOP3
      if (intent === 'top3') {
        const { trackIntentBypass } = require('../routes/metricsRoutes');
        trackIntentBypass();
        const top3 = await this.prisma.analysisResult.findMany({
          where: { analysisId },
          orderBy: { compatibilityScore: 'desc' },
          take: 3,
          include: { candidate: { select: { firstName: true, lastName: true } } }
        });

        return {
          reply: `En iyi 3 aday:\n\n${top3.map((r, i) => `${i + 1}. ${r.candidate.firstName} ${r.candidate.lastName} - ${r.compatibilityScore} puan`).join('\n')}`,
          facts: FACTS,
          version: FACTS.version,
          bypassedLLM: true,
          intent: 'top3',
          sources: [{ type: 'db_direct', score: 100 }]
        };
      }

      // LIST
      if (intent === 'list') {
        const { trackIntentBypass } = require('../routes/metricsRoutes');
        trackIntentBypass();
        const all = await this.prisma.analysisResult.findMany({
          where: { analysisId },
          orderBy: { compatibilityScore: 'desc' },
          include: { candidate: { select: { firstName: true, lastName: true } } }
        });

        return {
          reply: `Tüm adaylar (${all.length}):\n\n${all.map((r, i) => `${i + 1}. ${r.candidate.firstName} ${r.candidate.lastName} - ${r.compatibilityScore} puan`).join('\n')}`,
          facts: FACTS,
          version: FACTS.version,
          bypassedLLM: true,
          intent: 'list',
          sources: [{ type: 'db_direct', score: 100 }]
        };
      }

      // EXISTS
      if (intent === 'exists') {
        const { trackIntentBypass } = require('../routes/metricsRoutes');
        trackIntentBypass();
        const nameMatch = userMessage.match(/(\w+)\s+(var|mevcut)/i);
        if (nameMatch) {
          const name = nameMatch[1];
          const found = await this.prisma.analysisResult.findFirst({
            where: {
              analysisId,
              candidate: {
                OR: [
                  { firstName: { contains: name, mode: 'insensitive' } },
                  { lastName: { contains: name, mode: 'insensitive' } }
                ]
              }
            },
            include: { candidate: true }
          });

          return {
            reply: found ? `✅ Evet, ${found.candidate.firstName} ${found.candidate.lastName} bu analizde mevcut (${found.compatibilityScore} puan).` : `❌ "${name}" bulunamadı.`,
            facts: FACTS,
            version: FACTS.version,
            bypassedLLM: true,
            intent: 'exists',
            sources: [{ type: 'db_direct', score: 100 }]
          };
        }
      }

      // LAST UPDATE
      if (intent === 'lastUpdate') {
        const { trackIntentBypass } = require('../routes/metricsRoutes');
        trackIntentBypass();
        return {
          reply: `Son güncelleme: **${new Date(FACTS.updatedAt).toLocaleString('tr-TR')}**\n\nVersiyon: ${FACTS.version}`,
          facts: FACTS,
          version: FACTS.version,
          bypassedLLM: true,
          intent: 'lastUpdate',
          sources: [{ type: 'db_direct', score: 100 }]
        };
      }

      // AVERAGE
      if (intent === 'average') {
        const { trackIntentBypass } = require('../routes/metricsRoutes');
        trackIntentBypass();

        const result = await this.prisma.analysisResult.aggregate({
          where: { analysisId },
          _avg: { compatibilityScore: true }
        });

        const avg = Math.round(result._avg.compatibilityScore || 0);

        return {
          reply: 'Bu analizdeki ' + FACTS.candidateCount + ' adayın ortalama skoru: **' + avg + ' puan**',
          facts: FACTS,
          version: FACTS.version,
          bypassedLLM: true,
          intent: 'average',
          sources: [{ type: 'db_direct', score: 100 }]
        };
      }

      // BOTTOM3
      if (intent === 'bottom3') {
        const { trackIntentBypass } = require('../routes/metricsRoutes');
        trackIntentBypass();

        const bottom3 = await this.prisma.analysisResult.findMany({
          where: { analysisId },
          orderBy: { compatibilityScore: 'asc' },
          take: 3,
          include: { candidate: { select: { firstName: true, lastName: true } } }
        });

        return {
          reply: 'En düşük skorlu 3 aday:\n\n' + bottom3.map((r, i) => (i + 1) + '. ' + r.candidate.firstName + ' ' + r.candidate.lastName + ' - ' + r.compatibilityScore + ' puan').join('\n'),
          facts: FACTS,
          version: FACTS.version,
          bypassedLLM: true,
          intent: 'bottom3',
          sources: [{ type: 'db_direct', score: 100 }]
        };
      }

      // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      // PHASE 5: Fetch Base Knowledge for System Prompt
      // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

      // HER ZAMAN summary + TÜM candidate özetlerini al (VERSION FILTERED!)
      const baseChunks = await this.milvusClient.query({
        collection_name: this.collectionName,
        expr: `analysis_id == "${analysisId}" && analysis_version == ${FACTS.version}`,  // ← VERSION FILTER!
        output_fields: ['chunk_type', 'chunk_text', 'chunk_index'],
        limit: 40  // Increased for 25-50 CV support
      });

      const summaryText = baseChunks.data?.find(c => c.chunk_type === 'summary')?.chunk_text || '';
      const allCandidatesShort = baseChunks.data
        ?.filter(c => c.chunk_type === 'candidate')
        .sort((a, b) => a.chunk_index - b.chunk_index)
        .map(c => c.chunk_text.split('\n').slice(0, 15).join('\n'))
        .join('\n\n') || '';

      // Genel/liste soruları tespit et
      const isGeneralQuery = /hepsi|tüm|liste|say|isim|aday.*kim|her.*aday|tümü/i.test(userMessage);
      const needsAllCandidates = /her.*aday|tüm.*aday|hepsi.*için/i.test(userMessage);

      let relevantChunks = [];

      if (needsAllCandidates) {
        // TÜM adayların detaylarını iste
        console.log('📋 ALL CANDIDATES query - fetching all chunks');

        const allChunks = await this.milvusClient.query({
          collection_name: this.collectionName,
          expr: `analysis_id == "${analysisId}" && analysis_version == ${FACTS.version}`,  // ← VERSION FILTER!
          output_fields: ['chunk_type', 'chunk_text', 'chunk_index', 'metadata'],
          limit: 100  // Increased for 50+ CV support (all candidates)
        });

        // Summary + TÜM candidate chunk'ları (kısaltılmış)
        relevantChunks = (allChunks.data || [])
          .sort((a, b) => a.chunk_index - b.chunk_index)
          .map(c => ({
            type: c.chunk_type,
            text: c.chunk_text.substring(0, 1000), // Her chunk max 1000 char
            score: 1.0,
            metadata: JSON.parse(c.metadata || '{}')
          }));

      } else if (isGeneralQuery) {
        // Genel soru - sadece özet chunk'lar
        console.log('📋 General query detected, fetching summary chunks');

        const allChunks = await this.milvusClient.query({
          collection_name: this.collectionName,
          expr: `analysis_id == "${analysisId}" && analysis_version == ${FACTS.version} && (chunk_type == "summary" || chunk_type == "job" || chunk_type == "top_candidates")`,  // ← VERSION FILTER!
          output_fields: ['chunk_type', 'chunk_text', 'chunk_index', 'metadata'],
          limit: 15  // Increased for better context coverage
        });

        relevantChunks = (allChunks.data || [])
          .sort((a, b) => a.chunk_index - b.chunk_index)
          .map(c => ({
            type: c.chunk_type,
            text: c.chunk_text,
            score: 1.0,
            metadata: JSON.parse(c.metadata || '{}')
          }));

      } else {
        // Spesifik soru: Semantic search yap
        console.log('🔍 Specific query, using semantic search');

        const queryEmbedding = await this.generateEmbedding(userMessage);

        const searchResults = await this.milvusClient.search({
          collection_name: this.collectionName,
          data: [queryEmbedding],
          anns_field: 'chunk_embedding',
          limit: 8,  // Increased from 5 to 8 for better recall
          metric_type: 'COSINE',
          filter: `analysis_id == "${analysisId}" && analysis_version == ${FACTS.version}`,  // ← VERSION FILTER!
          params: { nprobe: 10 },
          output_fields: ['chunk_type', 'chunk_text', 'candidate_id', 'metadata']
        });

        relevantChunks = (searchResults.results || [])
          .filter(r => r.score > 0.5)
          .slice(0, 3)
          .map(r => ({
            type: r.chunk_type,
            text: r.chunk_text,
            score: r.score,
            metadata: JSON.parse(r.metadata || '{}')
          }));
      }

      console.log(`🔍 Found ${relevantChunks.length} relevant chunks`);

      if (relevantChunks.length === 0) {
        return {
          reply: 'Bu soruya cevap verebilmek için yeterli bilgi bulamadım. Lütfen daha spesifik bir soru sorun.',
          sources: []
        };
      }

      // 4. Context hazırla (her chunk'ı 800 karakterle sınırla)
      const contextText = relevantChunks
        .map(c => c.text.substring(0, 800))
        .join('\n\n---\n\n');

      // 5. Gemini'ye gönder
      if (!this.geminiApiKey) {
        throw new Error('GEMINI_API_KEY not configured');
      }

      // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      // PHASE 6: System Prompt with FACTS Authority
      // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

      const versionChangeNote = versionChanged
        ? `\n\n⚠️ ANALİZ GÜNCELLENDİ (Versiyon Değişti)
ÖNCEKİ SAYILAR VE BİLGİLER GEÇERSİZDİR.
SADECE AŞAĞIDAKİ FACTS VE VERİLERİ KULLAN.`
        : '';

      const systemPrompt = `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
AUTHORITATIVE FACTS (DATABASE - REAL-TIME)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Analysis ID: ${FACTS.analysisId}
Analysis Version: ${FACTS.version}
Candidate Count: ${FACTS.candidateCount}
Job Position: ${FACTS.jobTitle}
Last Updated: ${FACTS.updatedAt}
Status: ${FACTS.status}

${versionChangeNote}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PRIORITY RULES (CRITICAL)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. FACTS > RAG Data > Conversation History
2. If conflict: USE FACTS, discard old numbers
3. Candidate count = ${FACTS.candidateCount} (verified ${FACTS.updatedAt})
4. Never say old/different numbers

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SEN KİMSİN:
Elite HR Analiz Asistanısın. İnsan kaynakları uzmanlarına CV analiz sonuçlarını anlamalarında ve en iyi işe alım kararlarını vermelerinde yardımcı olursun.

UZMANLIKLARIN:
- Aday profili analizi ve karşılaştırma
- Güçlü/zayıf yön değerlendirmesi
- Pozisyon-aday uyum skorlaması
- Stratejik işe alım önerileri
- Veri tabanlı karar desteği
- Objektif ve profesyonel değerlendirme

GÖREVIN:
Bu analiz hakkında kullanıcıya (HR uzmanı/müdür/yönetici) yardımcı olmak.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
VERİ KATMANLARI (3 Seviye - Hiyerarşik)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

KATMAN 1: ANALİZ ÖZETİ (Her zaman bil)
${summaryText}

KATMAN 2: TÜM ADAYLAR ÖZET (${FACTS.candidateCount} aday - İsim + Skorlar)
${allCandidatesShort || 'Yükleniyor...'}

KATMAN 3: DETAY BİLGİLER (Sorguya özel semantik arama sonuçları)
${contextText}

NASIL CEVAP VERMELİSİN:

✅ YAPILACAKLAR:
- Türkçe, profesyonel ve anlaşılır dil kullan
- Verilerle desteklenmiş objektif cevaplar ver
- Karşılaştırmalarda sayısal verileri kullan (skorlar, yüzdeler)
- Stratejik öneriler sun (işe alım, mülakat soruları, risk/fırsat)
- Tüm ${FACTS.candidateCount} adayın bilgilerine erişimin var - hepsini değerlendirebilirsin
- Mantıksal çıkarımlar yapabilirsin (örn: "Esra'nın deneyim skoru yüksek, bu pozisyon için güçlü bir aday")
- Kullanıcının gerçek ihtiyacını anla ve yardımcı ol

❌ YAPILMAYACAKLAR:
- "Bilgi eksik" veya "Detay yok" ASLA DEME - yukarıda tüm veriler var!
- Başka analiz/aday verisi KULLANMA (scope violation)
- Uydurma, spekülasyon yapma
- Başka sistemlerden bilgi çekme
- Kişisel görüş belirtme (verilerle konuş)

CEVAP FORMATI:
- Kısa sorular → kısa cevaplar
- Karmaşık sorular → yapılandırılmış, maddeli cevaplar
- Karşılaştırma → tablo veya madde formatı
- Liste istemi → numaralı liste

ÖRNEKTüRKÇE CEVAPLAR:
"En iyi 3 aday kim?" → "Esra Zengin (83 puan), Sevgi Gülerer (82 puan), Eylül Yıldıran (78 puan)"
"Esra'nın zayıf yönleri?" → "Eğitim skoru 65/100 ile düşük. Teknik beceriler 70/100..."
"Kimler işe alınmalı?" → "Öncelikle Esra ve Sevgi değerlendirilmeli. İkisi de 80+ skorla..."

ŞİMDİ KULLANICININ SORUSUNA CEVAP VER:`;

      // Combine system prompt with user message
      const fullPrompt = `${systemPrompt}\n\nKullanıcı Sorusu: ${userMessage}`;

      const response = await axios.post(
        'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent',
        {
          contents: [
            ...conversationHistory.map(msg => ({
              role: msg.role === 'user' ? 'user' : 'model',
              parts: [{ text: msg.content }]
            })),
            {
              role: 'user',
              parts: [{ text: fullPrompt }]
            }
          ],
          generationConfig: {
            temperature: 0.3,
            topK: 20,
            topP: 0.8,
            maxOutputTokens: 2048
          }
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-goog-api-key': this.geminiApiKey  // Capital X!
          },
          timeout: 30000
        }
      );

      const aiReply = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || 'Üzgünüm, cevap oluşturamadım.';

      // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      // PHASE 7: Return with FACTS and Version
      // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

      return {
        reply: aiReply,
        sources: relevantChunks.map(c => ({
          type: c.type,
          score: Math.round(c.score * 100),
          metadata: c.metadata
        })),
        facts: FACTS,           // Authoritative data
        version: FACTS.version, // Current version
        versionChanged: versionChanged
      };
    } catch (error) {
      console.error('Chat error:', error);
      throw error;
    }
  }

  /**
   * Analiz context'ini sil
   */
  async deleteAnalysisContext(analysisId) {
    try {
      await this.initialize();

      await this.milvusClient.delete({
        collection_name: this.collectionName,
        expr: `analysis_id == "${analysisId}"`
      });

      console.log(`✅ Deleted context for analysis ${analysisId}`);
    } catch (error) {
      console.error('Delete context error:', error);
      throw error;
    }
  }

  /**
   * Analiz context istatistikleri
   */
  async getContextStats(analysisId) {
    try {
      await this.initialize();

      if (!this.milvusClient) {
        return null;  // Return null if Milvus not available
      }

      const results = await this.milvusClient.query({
        collection_name: this.collectionName,
        expr: `analysis_id == "${analysisId}"`,
        output_fields: ['chunk_type', 'chunk_index'],
        limit: 1000
      });

      const chunks = results.data || [];

      return {
        analysisId,
        totalChunks: chunks.length,
        chunkTypes: {
          summary: chunks.filter(c => c.chunk_type === 'summary').length,
          job: chunks.filter(c => c.chunk_type === 'job').length,
          candidate: chunks.filter(c => c.chunk_type === 'candidate').length,
          top_candidates: chunks.filter(c => c.chunk_type === 'top_candidates').length
        },
        lastUpdate: new Date()
      };
    } catch (error) {
      console.error('Get stats error:', error);
      return null;
    }
  }
}

// Singleton instance
let analysisChatService = null;

async function getAnalysisChatService() {
  // Check if AI Chat is disabled
  if (process.env.AI_CHAT_ENABLED === 'false') {
    throw new Error('AI Chat service is disabled');
  }

  if (!analysisChatService) {
    analysisChatService = new AnalysisChatService();
    try {
      await analysisChatService.initialize();
    } catch (error) {
      console.warn('⚠️ Chat service initialization failed (non-critical):', error.message);
      // Don't throw - allow backend to continue without chat features
    }
  }
  return analysisChatService;
}

module.exports = {
  getAnalysisChatService,
  AnalysisChatService
};
