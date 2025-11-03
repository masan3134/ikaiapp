/**
 * Milvus Sync Service
 * PostgreSQL → Milvus otomatik senkronizasyon
 *
 * Bu servis tüm veritabanı değişikliklerini Milvus'a senkronize eder
 */

const { MilvusClient, DataType } = require('@zilliz/milvus2-sdk-node');
const axios = require('axios');
const { PrismaClient } = require('@prisma/client');

class MilvusSyncService {
  constructor() {
    this.client = null;
    this.prisma = new PrismaClient();
    this.ollamaUrl = process.env.OLLAMA_URL || 'http://localhost:11434';
    this.ollamaModel = process.env.OLLAMA_MODEL || 'nomic-embed-text';
    this.milvusUrl = process.env.MILVUS_URL || 'http://localhost:19530';
    this.embeddingDim = 768; // nomic-embed-text dimension
  }

  /**
   * Milvus bağlantısını başlat
   */
  async initialize() {
    try {
      this.client = new MilvusClient({
        address: this.milvusUrl,
        ssl: process.env.MILVUS_SSL === 'true' || false
      });

      console.log('✅ Milvus Sync Service initialized');

      // Collections oluştur
      await this.createCollections();

      return true;
    } catch (error) {
      console.error('❌ Milvus Sync Service initialization error:', error);
      throw error;
    }
  }

  /**
   * Tüm collections'ları oluştur
   */
  async createCollections() {
    await this.createCVCollection();
    await this.createJobCollection();
    await this.createAnalysisResultCollection();
  }

  /**
   * CV Embeddings Collection
   */
  async createCVCollection() {
    const collectionName = 'cv_embeddings';

    try {
      const hasCollection = await this.client.hasCollection({
        collection_name: collectionName
      });

      if (hasCollection.value) {
        console.log(`✅ Collection '${collectionName}' already exists`);
        return;
      }

      await this.client.createCollection({
        collection_name: collectionName,
        fields: [
          {
            name: 'id',
            description: 'Primary key',
            data_type: DataType.Int64,
            is_primary_key: true,
            autoID: true
          },
          {
            name: 'candidate_id',
            description: 'PostgreSQL Candidate ID',
            data_type: DataType.VarChar,
            max_length: 36
          },
          {
            name: 'candidate_name',
            description: 'Candidate full name',
            data_type: DataType.VarChar,
            max_length: 200
          },
          {
            name: 'candidate_email',
            description: 'Candidate email',
            data_type: DataType.VarChar,
            max_length: 200
          },
          {
            name: 'cv_text',
            description: 'Extracted CV text',
            data_type: DataType.VarChar,
            max_length: 8000
          },
          {
            name: 'cv_embedding',
            description: 'CV vector embedding (768-dim)',
            data_type: DataType.FloatVector,
            dim: this.embeddingDim
          },
          {
            name: 'skills',
            description: 'JSON array of skills',
            data_type: DataType.VarChar,
            max_length: 2000
          },
          {
            name: 'experience_years',
            description: 'Years of experience',
            data_type: DataType.Float
          },
          {
            name: 'created_at',
            description: 'Timestamp',
            data_type: DataType.Int64
          },
          {
            name: 'updated_at',
            description: 'Last update timestamp',
            data_type: DataType.Int64
          },
          {
            name: 'sync_status',
            description: 'Sync status (synced/pending/error)',
            data_type: DataType.VarChar,
            max_length: 20
          }
        ]
      });

      // Create HNSW index
      await this.client.createIndex({
        collection_name: collectionName,
        field_name: 'cv_embedding',
        index_type: 'HNSW',
        metric_type: 'COSINE',
        params: {
          M: 30,
          efConstruction: 200
        }
      });

      console.log(`✅ Collection '${collectionName}' created with HNSW index`);
    } catch (error) {
      console.error(`Error creating ${collectionName}:`, error);
    }
  }

  /**
   * Job Embeddings Collection
   */
  async createJobCollection() {
    const collectionName = 'job_embeddings';

    try {
      const hasCollection = await this.client.hasCollection({
        collection_name: collectionName
      });

      if (hasCollection.value) {
        console.log(`✅ Collection '${collectionName}' already exists`);
        return;
      }

      await this.client.createCollection({
        collection_name: collectionName,
        fields: [
          {
            name: 'id',
            data_type: DataType.Int64,
            is_primary_key: true,
            autoID: true
          },
          {
            name: 'job_id',
            data_type: DataType.VarChar,
            max_length: 36
          },
          {
            name: 'title',
            data_type: DataType.VarChar,
            max_length: 500
          },
          {
            name: 'description',
            data_type: DataType.VarChar,
            max_length: 8000
          },
          {
            name: 'requirements',
            data_type: DataType.VarChar,
            max_length: 4000
          },
          {
            name: 'job_embedding',
            data_type: DataType.FloatVector,
            dim: this.embeddingDim
          },
          {
            name: 'required_skills',
            data_type: DataType.VarChar,
            max_length: 2000
          },
          {
            name: 'salary_min',
            data_type: DataType.Float
          },
          {
            name: 'salary_max',
            data_type: DataType.Float
          },
          {
            name: 'created_at',
            data_type: DataType.Int64
          },
          {
            name: 'updated_at',
            data_type: DataType.Int64
          }
        ]
      });

      await this.client.createIndex({
        collection_name: collectionName,
        field_name: 'job_embedding',
        index_type: 'HNSW',
        metric_type: 'COSINE',
        params: {
          M: 30,
          efConstruction: 200
        }
      });

      console.log(`✅ Collection '${collectionName}' created with HNSW index`);
    } catch (error) {
      console.error(`Error creating ${collectionName}:`, error);
    }
  }

  /**
   * Analysis Results Collection
   */
  async createAnalysisResultCollection() {
    const collectionName = 'analysis_results';

    try {
      const hasCollection = await this.client.hasCollection({
        collection_name: collectionName
      });

      if (hasCollection.value) {
        console.log(`✅ Collection '${collectionName}' already exists`);
        return;
      }

      await this.client.createCollection({
        collection_name: collectionName,
        fields: [
          {
            name: 'id',
            data_type: DataType.Int64,
            is_primary_key: true,
            autoID: true
          },
          {
            name: 'result_id',
            data_type: DataType.VarChar,
            max_length: 36
          },
          {
            name: 'candidate_id',
            data_type: DataType.VarChar,
            max_length: 36
          },
          {
            name: 'job_id',
            data_type: DataType.VarChar,
            max_length: 36
          },
          {
            name: 'compatibility_score',
            data_type: DataType.Float
          },
          {
            name: 'summary_text',
            data_type: DataType.VarChar,
            max_length: 4000
          },
          {
            name: 'summary_embedding',
            data_type: DataType.FloatVector,
            dim: this.embeddingDim
          },
          {
            name: 'positive_points',
            data_type: DataType.VarChar,
            max_length: 2000
          },
          {
            name: 'negative_points',
            data_type: DataType.VarChar,
            max_length: 2000
          },
          {
            name: 'tags',
            data_type: DataType.VarChar,
            max_length: 1000
          },
          {
            name: 'created_at',
            data_type: DataType.Int64
          }
        ]
      });

      await this.client.createIndex({
        collection_name: collectionName,
        field_name: 'summary_embedding',
        index_type: 'HNSW',
        metric_type: 'COSINE',
        params: {
          M: 30,
          efConstruction: 200
        }
      });

      console.log(`✅ Collection '${collectionName}' created with HNSW index`);
    } catch (error) {
      console.error(`Error creating ${collectionName}:`, error);
    }
  }

  /**
   * Ollama ile embedding oluştur
   */
  async generateEmbedding(text) {
    try {
      if (!text || text.trim().length === 0) {
        throw new Error('Text cannot be empty');
      }

      const response = await axios.post(`${this.ollamaUrl}/api/embed`, {
        model: this.ollamaModel,
        input: text.substring(0, 2000) // Limit input
      }, {
        timeout: 30000
      });

      if (!response.data || !response.data.embeddings || response.data.embeddings.length === 0) {
        throw new Error('Invalid Ollama response');
      }

      return response.data.embeddings[0];
    } catch (error) {
      console.error('Ollama embedding error:', error.message);
      throw new Error(`Failed to generate embedding: ${error.message}`);
    }
  }

  /**
   * Tek bir candidate'i Milvus'a senkronize et
   */
  async syncCandidate(candidateId) {
    try {
      console.log(`🔄 Syncing candidate: ${candidateId}`);

      // PostgreSQL'den candidate al
      const candidate = await this.prisma.candidate.findUnique({
        where: { id: candidateId },
        include: {
          user: true
        }
      });

      if (!candidate || candidate.isDeleted) {
        console.log(`⚠️ Candidate not found or deleted: ${candidateId}`);
        return { success: false, reason: 'not_found' };
      }

      // CV text extract (burada basit bir örnek, gerçekte MinIO'dan alınacak)
      const cvText = `
        Name: ${candidate.name}
        Email: ${candidate.email}
        Phone: ${candidate.phone || 'N/A'}
        Notes: ${candidate.notes || 'N/A'}
      `.trim();

      // Embedding oluştur
      const embedding = await this.generateEmbedding(cvText);

      // Milvus'a ekle/güncelle
      const entity = {
        candidate_id: candidate.id,
        candidate_name: candidate.name,
        candidate_email: candidate.email,
        cv_text: cvText.substring(0, 8000),
        cv_embedding: embedding,
        skills: JSON.stringify([]), // Burası analiz sonuçlarından alınabilir
        experience_years: 0, // Burası CV parse'dan alınabilir
        created_at: new Date(candidate.createdAt).getTime(),
        updated_at: new Date(candidate.updatedAt).getTime(),
        sync_status: 'synced'
      };

      await this.client.insert({
        collection_name: 'cv_embeddings',
        fields_data: [entity]
      });

      // Sync log kaydet
      await this.trackSync('candidate', candidateId, 'synced');

      console.log(`✅ Candidate synced: ${candidateId}`);
      return { success: true, candidateId };
    } catch (error) {
      console.error(`❌ Error syncing candidate ${candidateId}:`, error);
      await this.trackSync('candidate', candidateId, 'error', error.message);
      return { success: false, error: error.message };
    }
  }

  /**
   * Tek bir job posting'i Milvus'a senkronize et
   */
  async syncJobPosting(jobId) {
    try {
      console.log(`🔄 Syncing job: ${jobId}`);

      const job = await this.prisma.jobPosting.findUnique({
        where: { id: jobId }
      });

      if (!job || job.isDeleted) {
        console.log(`⚠️ Job not found or deleted: ${jobId}`);
        return { success: false, reason: 'not_found' };
      }

      // Job text
      const jobText = `
        Title: ${job.title}
        Description: ${job.description}
        Requirements: ${job.requirements || 'N/A'}
      `.trim();

      // Embedding oluştur
      const embedding = await this.generateEmbedding(jobText);

      // Milvus'a ekle
      const entity = {
        job_id: job.id,
        title: job.title,
        description: job.description.substring(0, 8000),
        requirements: (job.requirements || '').substring(0, 4000),
        job_embedding: embedding,
        required_skills: JSON.stringify([]),
        salary_min: job.salaryMin || 0,
        salary_max: job.salaryMax || 0,
        created_at: new Date(job.createdAt).getTime(),
        updated_at: new Date(job.updatedAt).getTime()
      };

      await this.client.insert({
        collection_name: 'job_embeddings',
        fields_data: [entity]
      });

      await this.trackSync('job', jobId, 'synced');

      console.log(`✅ Job synced: ${jobId}`);
      return { success: true, jobId };
    } catch (error) {
      console.error(`❌ Error syncing job ${jobId}:`, error);
      await this.trackSync('job', jobId, 'error', error.message);
      return { success: false, error: error.message };
    }
  }

  /**
   * Tüm candidates'ı toplu senkronize et
   */
  async syncAllCandidates() {
    try {
      console.log('🔄 Starting batch sync for all candidates...');

      const candidates = await this.prisma.candidate.findMany({
        where: { isDeleted: false }
      });

      let synced = 0;
      let errors = 0;

      for (const candidate of candidates) {
        const result = await this.syncCandidate(candidate.id);
        if (result.success) {
          synced++;
        } else {
          errors++;
        }
      }

      console.log(`✅ Batch sync completed: ${synced} synced, ${errors} errors`);
      return { synced, errors, total: candidates.length };
    } catch (error) {
      console.error('❌ Batch sync error:', error);
      throw error;
    }
  }

  /**
   * Tüm job postings'i toplu senkronize et
   */
  async syncAllJobPostings() {
    try {
      console.log('🔄 Starting batch sync for all jobs...');

      const jobs = await this.prisma.jobPosting.findMany({
        where: { isDeleted: false }
      });

      let synced = 0;
      let errors = 0;

      for (const job of jobs) {
        const result = await this.syncJobPosting(job.id);
        if (result.success) {
          synced++;
        } else {
          errors++;
        }
      }

      console.log(`✅ Batch sync completed: ${synced} synced, ${errors} errors`);
      return { synced, errors, total: jobs.length };
    } catch (error) {
      console.error('❌ Batch sync error:', error);
      throw error;
    }
  }

  /**
   * Candidate'i Milvus'tan sil
   */
  async deleteCandidateEmbedding(candidateId) {
    try {
      const expr = `candidate_id == "${candidateId}"`;

      const result = await this.client.delete({
        collection_name: 'cv_embeddings',
        expr: expr
      });

      console.log(`✅ Candidate deleted from Milvus: ${candidateId}`);
      return result;
    } catch (error) {
      console.error(`❌ Error deleting candidate ${candidateId}:`, error);
      throw error;
    }
  }

  /**
   * Job'ı Milvus'tan sil
   */
  async deleteJobEmbedding(jobId) {
    try {
      const expr = `job_id == "${jobId}"`;

      const result = await this.client.delete({
        collection_name: 'job_embeddings',
        expr: expr
      });

      console.log(`✅ Job deleted from Milvus: ${jobId}`);
      return result;
    } catch (error) {
      console.error(`❌ Error deleting job ${jobId}:`, error);
      throw error;
    }
  }

  /**
   * Sync durumunu takip et (PostgreSQL)
   */
  async trackSync(entityType, entityId, status, errorMessage = null) {
    try {
      // SyncLog tablosu yoksa, hata vermeden devam et
      await this.prisma.syncLog.upsert({
        where: {
          entityType_entityId: {
            entityType,
            entityId
          }
        },
        update: {
          syncStatus: status,
          errorMessage,
          lastSyncAt: new Date(),
          attemptCount: { increment: 1 }
        },
        create: {
          entityType,
          entityId,
          syncStatus: status,
          errorMessage,
          lastSyncAt: new Date(),
          attemptCount: 1
        }
      }).catch(() => {
        // Tablo yoksa sessizce devam et
        console.log('⚠️ SyncLog table not found, skipping tracking');
      });
    } catch (error) {
      // Tracking hatası ana işlemi etkilememelidir
      console.warn('Warning: Sync tracking failed:', error.message);
    }
  }

  /**
   * Sync istatistiklerini al
   */
  async getSyncStats() {
    try {
      const stats = {
        candidates: await this.client.getCollectionStats({
          collection_name: 'cv_embeddings'
        }),
        jobs: await this.client.getCollectionStats({
          collection_name: 'job_embeddings'
        }),
        analysisResults: await this.client.getCollectionStats({
          collection_name: 'analysis_results'
        })
      };

      return {
        candidates: {
          total: stats.candidates.row_count || 0
        },
        jobs: {
          total: stats.jobs.row_count || 0
        },
        analysisResults: {
          total: stats.analysisResults.row_count || 0
        },
        lastSync: new Date()
      };
    } catch (error) {
      console.error('Error getting stats:', error);
      return null;
    }
  }

  /**
   * Bağlantıyı kapat
   */
  async close() {
    try {
      if (this.client) {
        await this.client.closeConnection();
        console.log('✅ Milvus connection closed');
      }
      if (this.prisma) {
        await this.prisma.$disconnect();
      }
    } catch (error) {
      console.error('Error closing connection:', error);
    }
  }
}

// Singleton instance
let milvusSyncService = null;

async function getMilvusSyncService() {
  if (!milvusSyncService) {
    milvusSyncService = new MilvusSyncService();
    await milvusSyncService.initialize();
  }
  return milvusSyncService;
}

module.exports = {
  getMilvusSyncService,
  MilvusSyncService
};
