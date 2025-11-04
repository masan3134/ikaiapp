const axios = require('axios');
const { PrismaClient } = require('@prisma/client');
const { v4: uuidv4 } = require('uuid');
const geminiRateLimiter = require('../utils/geminiRateLimiter');

const prisma = new PrismaClient();
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent';

if (!GEMINI_API_KEY) {
  console.error('⚠️  GEMINI_API_KEY is not configured in environment variables');
}

/**
 * Generate assessment test for a job posting
 *
 * ANALYSIS-BASED MASTER TEST STRATEGY:
 * 1. Find/create MASTER test for this ANALYSIS (AI-generated questions, ONCE per analysis)
 * 2. Create new test instance with UNIQUE ID (copy questions from master)
 * 3. Result: Low AI cost + Unique test ID per send + No completion conflicts
 *
 * KEY: Same job posting, different analysis → Different questions!
 */
async function generateTest(jobPostingId, userId, analysisId = null, organizationId = null) {
  // Get job posting
  const jobPosting = await prisma.jobPosting.findUnique({
    where: { id: jobPostingId }
  });

  if (!jobPosting) {
    throw new Error('Job posting not found');
  }

  // STEP 1: Find or create MASTER test (AI questions source)
  let masterTest = null;
  let questions;

  if (analysisId) {
    // NEW: Analysis-based lookup (RECOMMENDED)
    masterTest = await prisma.assessmentTest.findFirst({
      where: {
        analysisId,
        maxAttempts: 999, // Master test marker
        expiresAt: {
          gt: new Date() // Not expired
        }
      },
      orderBy: {
        createdAt: 'asc' // Get first master test
      }
    });

    if (masterTest) {
      console.log(`📋 Using MASTER test for analysis ${analysisId} (ID: ${masterTest.id})`);
      questions = masterTest.questions;
    } else {
      console.log(`🤖 Creating NEW MASTER test for analysis ${analysisId} with Gemini AI`);

      // Generate questions with Gemini (ONLY ONCE per analysis)
      questions = await generateQuestions(jobPosting);

      // Create master test with LONG expiry (30 days)
      const masterToken = uuidv4();
      const masterExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

      masterTest = await prisma.assessmentTest.create({
        data: {
          jobPostingId,
          createdBy: userId,
          analysisId, // NEW: Link to analysis
          organizationId, // REQUIRED by Prisma
          token: masterToken,
          questions,
          expiresAt: masterExpiresAt,
          maxAttempts: 999 // Marker: this is master test (not for candidates)
        }
      });

      console.log(`✅ MASTER test created for analysis ${analysisId} (ID: ${masterTest.id})`);
    }
  } else {
    // LEGACY: Job posting-based lookup (backwards compatibility)
    console.log(`⚠️  No analysisId provided, using legacy job-based lookup`);

    masterTest = await prisma.assessmentTest.findFirst({
      where: {
        jobPostingId,
        analysisId: null, // Legacy tests have null analysisId
        maxAttempts: 999,
        expiresAt: {
          gt: new Date()
        }
      },
      orderBy: {
        createdAt: 'asc'
      }
    });

    if (masterTest) {
      console.log(`📋 Using legacy MASTER test for job ${jobPostingId} (ID: ${masterTest.id})`);
      questions = masterTest.questions;
    } else {
      console.log(`🤖 Creating NEW legacy MASTER test for job ${jobPostingId} with Gemini AI`);

      questions = await generateQuestions(jobPosting);

      const masterToken = uuidv4();
      const masterExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

      masterTest = await prisma.assessmentTest.create({
        data: {
          jobPostingId,
          createdBy: userId,
          analysisId: null, // Legacy mode
          organizationId, // REQUIRED by Prisma
          token: masterToken,
          questions,
          expiresAt: masterExpiresAt,
          maxAttempts: 999
        }
      });

      console.log(`✅ Legacy MASTER test created (ID: ${masterTest.id})`);
    }
  }

  // STEP 2: Create NEW test instance with UNIQUE ID
  console.log(`🆕 Creating test instance with unique ID (copy from master)`);

  const token = uuidv4();
  const expiresAt = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000); // 2 days

  const test = await prisma.assessmentTest.create({
    data: {
      jobPostingId,
      createdBy: userId,
      analysisId, // Link instance to analysis
      organizationId, // REQUIRED by Prisma
      token,
      questions, // Copy from master
      expiresAt,
      maxAttempts: 3
    }
  });

  const testUrl = `${process.env.FRONTEND_URL}/test/${token}`;

  console.log(`✅ Test instance created (ID: ${test.id}, Token: ${token.substring(0, 8)}...)`);

  return {
    testId: test.id,
    token: test.token,
    testUrl,
    questions,
    expiresAt: test.expiresAt,
    reused: !!masterTest && masterTest.questions === questions
  };
}

// ════════════════════════════════════════════════════════════════════════════
// PHASE 2: TURKISH NLP HELPERS (GPT Solution - No External Library)
// ════════════════════════════════════════════════════════════════════════════

/**
 * GPT PHASE 2: Extract 2-3 word phrases from Turkish text
 * Uses bigram extraction with stopword filtering
 */
function extractPhrasesTR(text) {
  const stopwords = new Set([
    've', 'ile', 'bir', 'olan', 'gibi', 'için', 'iletişim', 'olarak',
    'göre', 'vb', 'vs', 'olan', 'olanlar', 'bu', 'şu', 'her', 'bazı',
    'diğer', 'kendi', 'hem', 'ya', 'veya', 'ancak', 'ama', 'fakat'
  ]);

  // Clean text
  const cleaned = text.toLowerCase().replace(/[()"'`,.:;!?]/g, ' ');
  const tokens = cleaned.split(/\s+/).filter(t => t.length > 1);

  // Extract bigrams
  const bigrams = [];
  for (let i = 0; i < tokens.length - 1; i++) {
    const a = tokens[i], b = tokens[i + 1];
    if (!stopwords.has(a) && !stopwords.has(b)) {
      bigrams.push(`${a} ${b}`);
    }
  }

  // Count frequency
  const freq = new Map();
  for (const gram of bigrams) {
    freq.set(gram, (freq.get(gram) || 0) + 1);
  }

  // Sort by frequency, filter by length, return top 24
  return [...freq.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([gram]) => gram)
    .filter(gram => gram.length >= 7) // Min 7 chars
    .slice(0, 24);
}

/**
 * GPT PHASE 2: Light Turkish stemming (heuristic suffix stripping)
 * Handles common Turkish suffixes without full morphological analysis
 */
function lightStemTR(word) {
  return word
    .replace(/(lar|ler)$/, '')              // Plural
    .replace(/(ın|in|un|ün|nın|nin|nun|nün)$/, '') // Genitive
    .replace(/(dan|den|tan|ten)$/, '')      // Ablative
    .replace(/(e|a|i|ı|u|ü|o|ö)n?$/, '')    // Dative
    .replace(/(de|da|te|ta)n?$/, '')        // Locative
    .replace(/(yi|yı|yu|yü)$/, '')          // Accusative
    .replace(/(si|sı|su|sü)$/,'')           // Possessive
    .replace(/[^a-zçğıöşü]/g, '');          // Keep only Turkish chars
}

/**
 * GPT PHASE 2: N-gram based similarity using Jaccard index
 */
function ngrams(s, n) {
  const result = [];
  for (let i = 0; i <= s.length - n; i++) {
    result.push(s.slice(i, i + n));
  }
  return new Set(result);
}

function jaccard(setA, setB) {
  const intersection = new Set([...setA].filter(x => setB.has(x)));
  const union = setA.size + setB.size - intersection.size;
  return union > 0 ? intersection.size / union : 0;
}

function similarTR(a, b) {
  const stemA = lightStemTR(a);
  const stemB = lightStemTR(b);
  const ngramsA = ngrams(stemA, 3);
  const ngramsB = ngrams(stemB, 3);
  return jaccard(ngramsA, ngramsB) >= 0.38; // Threshold from GPT
}

/**
 * GPT PHASE 2: Calculate relevance score with phrase matching + similarity
 * Returns score 0.15-0.85 based on how many allowed phrases are matched
 */
function relevanceTR(questionText, allowedPhrases) {
  const lowerText = questionText.toLowerCase();
  let hits = 0;
  const uniqueMatches = new Set();

  for (const phrase of allowedPhrases) {
    // Direct inclusion OR similarity match
    if (lowerText.includes(phrase) || similarTR(lowerText, phrase)) {
      if (!uniqueMatches.has(phrase)) {
        uniqueMatches.add(phrase);
        hits++;
      }
    }
  }

  // GPT scoring: 2→60%, 3→75%, 4+→85%
  const score = hits >= 4 ? 0.85 : hits === 3 ? 0.75 : hits === 2 ? 0.60 : 0.15;

  return { score, hits, matchedPhrases: [...uniqueMatches] };
}

/**
 * Detect position level from title
 */
function detectPositionLevel(title) {
  const titleLower = title.toLowerCase();

  if (titleLower.includes('junior') || titleLower.includes('stajyer') || titleLower.includes('intern')) {
    return 'JUNIOR';
  }
  if (titleLower.includes('senior') || titleLower.includes('lead') || titleLower.includes('principal')) {
    return 'SENIOR';
  }
  if (titleLower.includes('manager') || titleLower.includes('müdür') || titleLower.includes('director') || titleLower.includes('head')) {
    return 'MANAGER';
  }
  return 'MID'; // Default
}

/**
 * Extract typical tasks from job details for better relevance matching
 * Identifies entry-level appropriate tasks vs advanced/managerial ones
 */
function extractTypicalTasks(jobDetails, positionLevel) {
  const details = jobDetails.toLowerCase();

  // Entry-level task indicators
  const entryLevelTasks = [];
  const taskPatterns = {
    'communication': ['müşteri', 'telefon', 'mail', 'iletişim', 'bildirim'],
    'data_entry': ['kayıt', 'gir', 'takip', 'excel', 'word', 'office'],
    'order_processing': ['sipariş', 'talep', 'işlem', 'hazırla'],
    'basic_reporting': ['rapor', 'liste', 'çıktı'],
    'support': ['destek', 'yardım', 'çözüm', 'şikayet']
  };

  for (const [category, keywords] of Object.entries(taskPatterns)) {
    const matched = keywords.filter(kw => details.includes(kw));
    if (matched.length > 0) {
      entryLevelTasks.push({ category, keywords: matched });
    }
  }

  // Advanced task indicators to AVOID for entry-level
  const advancedTaskIndicators = [
    'yönetim', 'liderlik', 'stratej', 'planlama', 'koordinasyon',
    'karar', 'bütçe', 'proje yönetimi', 'ekip yönetimi',
    'access', 'crm', 'erp', 'kpi', 'adr', 'gümrük'
  ];

  const hasAdvancedTasks = advancedTaskIndicators.some(indicator => details.includes(indicator));

  return {
    entryLevelTasks,
    hasAdvancedTasks,
    taskSummary: entryLevelTasks.map(t => t.category).join(', ')
  };
}

/**
 * QUALITY CONTROL: FORCE balanced distribution
 * GEMINI RECOMMENDATION: Don't trust AI - FORCE it in code!
 * Target: A=2-3, B=2-3, C=2-3, D=2-3
 */
function forceBalancedDistribution(questions) {
  console.log('⚡ FORCING balanced distribution (Gemini recommendation)...');

  // Target distribution for 10 questions - PERFECT BALANCE
  // Each option appears 2-3 times (varies randomly)
  const variants = [
    [0, 0, 1, 1, 1, 2, 2, 2, 3, 3],     // A=2, B=3, C=3, D=2
    [0, 0, 0, 1, 1, 2, 2, 2, 3, 3],     // A=3, B=2, C=3, D=2
    [0, 0, 1, 1, 2, 2, 2, 3, 3, 3],     // A=2, B=2, C=3, D=3
    [0, 0, 0, 1, 1, 1, 2, 2, 3, 3]      // A=3, B=3, C=2, D=2
  ];

  // Pick random variant
  const targetDistribution = variants[Math.floor(Math.random() * variants.length)];

  // Shuffle target to randomize order
  const shuffled = [...targetDistribution].sort(() => Math.random() - 0.5);

  console.log('🎲 Target distribution:', {
    A: shuffled.filter(x => x === 0).length,
    B: shuffled.filter(x => x === 1).length,
    C: shuffled.filter(x => x === 2).length,
    D: shuffled.filter(x => x === 3).length
  });

  // Assign each question the forced correct answer
  questions.forEach((q, idx) => {
    const oldCorrect = q.correctAnswer;
    const newCorrect = shuffled[idx];

    if (oldCorrect !== newCorrect) {
      // Swap options to make newCorrect the right answer
      const temp = q.options[oldCorrect];
      q.options[oldCorrect] = q.options[newCorrect];
      q.options[newCorrect] = temp;
      q.correctAnswer = newCorrect;
    }
  });

  return questions;
}

/**
 * GPT PHASE 2: Reject generic workplace questions (not job-specific)
 */
function rejectGeneric(question) {
  const forbiddenPatterns = [
    /genel.*iş/i,
    /iş ortamında.*ne yaparsın/i,
    /ekip.*nasıl/i,
    /bir.*problem.*yaşadığınızda/i,
    /çalışma.*ortamında/i
  ];

  return forbiddenPatterns.some(pattern => pattern.test(question.question));
}

/**
 * GPT PHASE 2: Strip/replace advanced topics with entry-level equivalents
 */
function stripAdvanced(question) {
  const advancedBlock = /(\bCRM\b|\bKPI\b|\bERP\b|\bADR\b|\bIncoterms?\b|stratejik|planlama|performans göstergesi)/gi;

  if (advancedBlock.test(question.question)) {
    question.question = question.question.replace(advancedBlock, 'temel kayıt');
  }

  question.options = question.options.map(opt =>
    opt.replace(advancedBlock, 'temel kayıt')
  );

  return question;
}

/**
 * GPT SOLUTION: Replace silly/unprofessional options with plausible wrong answers
 * Heuristic detection + smart replacement templates
 */
function replaceSillyOptions(questions) {
  console.log('🔄 Replacing silly options with professional alternatives...');

  const sillyPatterns = [
    'görmezden', 'hiçbir şey yapmam', 'hiçbirşey', 'umursamam', 'önemsemem',
    'rastgele', 'sallayarak', 'oyalanırım', 'boşver', 'kapatırım',
    'unuturum', 'dalga geçerim', 'bakmam', 'silerim'
  ];

  const replacementTemplates = [
    "İlk önce farklı bir işi tamamlayıp sonra bu göreve geçerim",
    "Doğrulamadan işleme alırım",
    "E-posta ile dönüş yapmayı beklerim",
    "Sisteme kayıt düşmeden sözlü bilgilendiririm",
    "Tahmini bir süre vererek işlemi ertelemeyi denerim"
  ];

  let totalReplaced = 0;

  questions.forEach((q, qIdx) => {
    q.options.forEach((opt, optIdx) => {
      const optLower = opt.toLowerCase();
      const hasSilly = sillyPatterns.some(pattern => optLower.includes(pattern));

      if (hasSilly) {
        const replacement = replacementTemplates[Math.floor(Math.random() * replacementTemplates.length)];
        console.log(`   Q${qIdx + 1} Option ${String.fromCharCode(65 + optIdx)}: Replaced silly option`);
        q.options[optIdx] = replacement;
        totalReplaced++;
      }
    });
  });

  console.log(`   Total silly options replaced: ${totalReplaced}`);
  return questions;
}

/**
 * QUALITY CONTROL: Randomize correct answer positions (DEPRECATED - use forceBalancedDistribution)
 * Kept for backward compatibility
 */
function randomizeCorrectAnswers(questions) {
  console.log('🔀 Randomizing correct answer distribution...');

  for (const question of questions) {
    const correctIndex = question.correctAnswer;
    const correctValue = question.options[correctIndex];

    // Remove correct answer from current position
    question.options.splice(correctIndex, 1);

    // Insert at random position (0-3)
    const newIndex = Math.floor(Math.random() * 4);
    question.options.splice(newIndex, 0, correctValue);

    // Update correctAnswer index
    question.correctAnswer = newIndex;
  }

  return questions;
}

/**
 * QUALITY CONTROL: Validate answer distribution
 * Checks if A/B/C/D are balanced and no obvious patterns
 */
function validateDistribution(questions) {
  const distribution = { 0: 0, 1: 0, 2: 0, 3: 0 };
  questions.forEach(q => distribution[q.correctAnswer]++);

  // Check balance (each should be 2-3 times)
  const counts = Object.values(distribution);
  const isBalanced = counts.every(count => count >= 2 && count <= 3);

  // Check for consecutive patterns (max 2 in a row)
  let maxConsecutive = 1;
  let currentConsecutive = 1;

  for (let i = 1; i < questions.length; i++) {
    if (questions[i].correctAnswer === questions[i-1].correctAnswer) {
      currentConsecutive++;
      maxConsecutive = Math.max(maxConsecutive, currentConsecutive);
    } else {
      currentConsecutive = 1;
    }
  }

  const hasPattern = maxConsecutive > 2; // More than 2 consecutive is a pattern

  return {
    isValid: isBalanced && !hasPattern,
    distribution: {
      A: distribution[0],
      B: distribution[1],
      C: distribution[2],
      D: distribution[3]
    },
    maxConsecutive,
    hasPattern
  };
}

/**
 * QUALITY CONTROL: Score job relevance for a question
 * Returns 0-1 score based on keyword matching with job tasks
 */
function scoreJobRelevance(question, jobDetails, positionLevel) {
  const questionText = question.question.toLowerCase();
  const allOptions = question.options.join(' ').toLowerCase();
  const fullText = questionText + ' ' + allOptions;

  // Extract keywords from job details
  const keywords = jobDetails.toLowerCase()
    .split(/[,.\s\n]+/)
    .filter(w => w.length > 3); // Only words > 3 chars

  // Count matches
  let matchCount = 0;
  keywords.forEach(keyword => {
    if (fullText.includes(keyword)) {
      matchCount++;
    }
  });

  const relevanceScore = Math.min(1, matchCount / Math.max(keywords.length * 0.3, 5));

  // Penalty for advanced topics in entry-level questions
  if (positionLevel === 'MID' || positionLevel === 'JUNIOR') {
    const advancedTopics = [
      'access', 'crm', 'kpi rapor', 'adr', 'gümrük beyannamesi',
      'menşe şahadetnamesi', 'depo güvenliği yönetimi', 'stratejik planlama'
    ];

    const hasAdvanced = advancedTopics.some(topic => fullText.includes(topic));
    if (hasAdvanced) {
      return relevanceScore * 0.5; // 50% penalty
    }
  }

  return relevanceScore;
}

/**
 * QUALITY CONTROL: Validate individual question quality
 * Checks for common issues: silly options, patterns, relevance
 */
function validateQuestion(question, jobDetails, positionLevel) {
  const errors = [];
  const warnings = [];

  // 1. Check for repetitive phrases
  const badPhrases = [
    'sadece x yeterlidir',
    'sadece',
    'yeterlidir',
    'yeterli'
  ];

  let phraseCount = {};
  question.options.forEach((opt, idx) => {
    const optLower = opt.toLowerCase();
    badPhrases.forEach(phrase => {
      if (optLower.includes(phrase)) {
        phraseCount[phrase] = (phraseCount[phrase] || 0) + 1;
      }
    });
  });

  Object.entries(phraseCount).forEach(([phrase, count]) => {
    if (count > 2) {
      errors.push(`Repetitive phrase "${phrase}" used ${count} times`);
    }
  });

  // 2. Check for silly/obviously wrong options
  const sillyKeywords = [
    'hiçbir şey yapmam',
    'hiç birşey',
    'rastgele sıralama',
    'rastgele',
    'unutmak',
    'kapatmak',
    'önemsemem'
  ];

  question.options.forEach((opt, idx) => {
    const optLower = opt.toLowerCase();
    sillyKeywords.forEach(silly => {
      if (optLower.includes(silly)) {
        warnings.push(`Option ${String.fromCharCode(65+idx)}: Potentially silly - "${silly}"`);
      }
    });
  });

  // 3. Check option length balance (avoid obviously long correct answer)
  const lengths = question.options.map(opt => opt.length);
  const avgLength = lengths.reduce((a, b) => a + b, 0) / lengths.length;
  const correctLength = lengths[question.correctAnswer];

  if (correctLength > avgLength * 1.5) {
    warnings.push(`Correct answer is ${Math.round((correctLength/avgLength - 1) * 100)}% longer than average`);
  }

  // 4. Score relevance
  const relevance = scoreJobRelevance(question, jobDetails, positionLevel);

  if (relevance < 0.3) {
    errors.push(`Low job relevance: ${Math.round(relevance * 100)}%`);
  } else if (relevance < 0.5) {
    warnings.push(`Medium job relevance: ${Math.round(relevance * 100)}%`);
  }

  return {
    errors,
    warnings,
    relevanceScore: relevance
  };
}

/**
 * Generate 10 questions using Gemini API
 */
async function generateQuestions(jobPosting) {
  const positionLevel = detectPositionLevel(jobPosting.title);

  const levelDifficulty = {
    'JUNIOR': 'Orta zorluk - temel deneyim ve bilgi gerektiren',
    'MID': 'Orta-İleri zorluk - 2-3 yıl deneyim gerektiren',
    'SENIOR': 'İleri zorluk - derin uzmanlık ve liderlik deneyimi gerektiren',
    'MANAGER': 'Çok ileri zorluk - yönetim deneyimi ve stratejik düşünme gerektiren'
  };

  // ════════════════════════════════════════════════════════════════════════════
  // PHASE 2: Extract Allowed Terms from Job Posting (GPT Solution)
  // ════════════════════════════════════════════════════════════════════════════
  console.log('\n🔍 PHASE 2: Extracting allowed terms from job posting...');
  const allowedTerms = extractPhrasesTR(jobPosting.details);
  console.log(`   Extracted ${allowedTerms.length} key phrases:`, allowedTerms.slice(0, 10));

  // ════════════════════════════════════════════════════════════════════════════
  // GPT PHASE 3 - Enhanced Quality Rules (v2025-10-31)
  // Target: 8.5/10 quality, 85% relevance, Production-ready
  // Changes: Added explicit quality rules, option balance, quote removal
  // ════════════════════════════════════════════════════════════════════════════
  const systemInstruction = `Rolün: İşe alım değerlendirme uzmanı.
Hedefin: İş ilanına özel, kaliteli 10 çoktan seçmeli soru üretmek.

ÖNEMLİ KALİTE KURALLARI:
1. YAZIM - Türkçe karakter kullan (ç, ğ, ı, ö, ş, ü). Tırnak işareti KULLANMA.
2. ŞIK DENGESİ - Tüm şıklar 40-65 karakter arası. ZORUNLU: Doğru şık ASLA 70 karakterden uzun olmamalı!
3. DOĞRU ŞIK GİZLİLİĞİ - Doğru şık çok detaylı/uzun OLMAYACAK. A/B/C/D dengeli dağılım. ZORUNLU: Tüm şıklar benzer uzunlukta.
4. İLAN UYUMU - İlandaki SPESIFIK görev/araç/süreçlerden sor. Genel sorular YASAK.
5. NET SORU - Her soru TEK bir konuya odaklan. Karmaşık/çok bileşenli sorular YASAK.
6. SAÇMA ŞIK YOK - "Sadece X yeterli", "Hiçbir şey yapmam", "Standart prosedür" gibi saçma şıklar YASAK.
7. OLUMSUZ ŞIK YASAK - "dikkate almamak", "göz ardı etmek", "yapmamak" gibi aşırı olumsuz şıklar YASAK.

SORU YAPISI:
- Görev Kapsaması: Her soru İLAN_TERİMLERİ listesinden en az 2 farklı kavram içermeli.
- Seviye: Entry-level (CRM/KPI/ERP/ADR gibi ileri kavramlar YASAK).
- Çeşitlilik: technical ≥3, situational ≥4, experience ≥2.
- Doğru Cevap Dağılımı: A/B/C/D her biri 2-3 kez.

FORMAT:
- Şıklar: 40-80 karakter, noktasız, tırnak YOK
- Açıklamalar: Noktalı cümle, 20-60 kelime
- Çıktı: Sadece geçerli JSON

ÖRNEK KÖTÜ SORU:
Soru: "Depoların temel kayıt değerlerinin takip edilmesi..."
Şıklar:
A) genel giderlerin takibi (28 char) ← ÇOK KISA
B) Sipariş karşılama oranı, envanter devir hızı ve depolama maliyetleri gibi metriklerin takibi (98 char) ← DOĞRU ama AŞIRI UZUN! YASAK!
C) çalışan memnuniyetinin ölçülmesi (37 char) ← KISA
D) enerji tüketiminin izlenmesi (32 char) ← KISA

PROBLEM: Doğru şık %165 daha uzun → PAT DİYE BELLİ!

ÖRNEK İYİ SORU:
Soru: "Depolama KPI'larının takibinde hangi raporlama sıklığı en etkilidir?"
Şıklar:
A) Aylık özet raporlar (45 char)
B) Anlık dashboard'lar ile sürekli takip (48 char)
C) Haftalık detaylı performans raporları (50 char) ← DOĞRU, dengeli!
D) Üç aylık stratejik değerlendirme raporları (52 char)

Dahili çalışma (çıktıya yazma):
- İLAN metninden 2–3 kelimelik öbekleri çıkar – İLAN_TERİMLERİ.
- Bu öbeklerden soru tohumları kur; her tohum 2+ öbek kapsasın.
- Genel/klişe soruları eler; yalnızca görev-spesifik olanları tut.
- Şık uzunluklarını kontrol et (40-80 char), doğru şık belirgin olmasın.
- JSON'u üret.`;

  // ════════════════════════════════════════════════════════════════════════════
  // PHASE 2 PROMPT: Explicit Allowed Terms Injection
  // ════════════════════════════════════════════════════════════════════════════
  const prompt = `Görev: Aşağıdaki iş ilanına **tam uyumlu** 10 adet çoktan seçmeli soru üret.

İŞ İLANI (ham metin):
"""
Pozisyon: ${jobPosting.title}
Departman: ${jobPosting.department}

Gereksinimler:
${jobPosting.details}
"""

SADECE şu görev/araç öbeklerinden sor (Zorunlu: Her soruda bu listeden en az 2 farklı öbek geçecek):
${allowedTerms.slice(0, 15).map((term, i) => `${i + 1}. "${term}"`).join('\n')}

Kapsam Hedefi:
- Temalar: technical ≥3, situational ≥4, experience ≥2
- Odak: İlan metninde geçen görevler, araçlar, iş adımları
- Yasak: Genel işyeri soruları, ileri kavramlar (CRM/KPI/ERP)

Çıktı şeması: JSON only, matching responseSchema exactly.`;


  const responseSchema = {
    type: 'object',
    required: ['questions'],
    properties: {
      questions: {
        type: 'array',
        minItems: 10,
        maxItems: 10,
        items: {
          type: 'object',
          required: ['id', 'category', 'question', 'options', 'correctAnswer', 'explanation'],
          properties: {
            id: { type: 'integer', minimum: 1, maximum: 10 },
            category: { type: 'string', enum: ['technical', 'situational', 'experience'] },
            question: { type: 'string', minLength: 20 },
            options: {
              type: 'array',
              minItems: 4,
              maxItems: 4,
              items: { type: 'string', minLength: 5 }
            },
            correctAnswer: { type: 'integer', minimum: 0, maximum: 3 },
            explanation: { type: 'string', minLength: 20 }
          }
        }
      }
    }
  };

  const payload = {
    systemInstruction: {
      parts: [{ text: systemInstruction }]
    },
    contents: [
      {
        parts: [{ text: prompt }]
      }
    ],
    generationConfig: {
      temperature: 0.45,  // GPT recommendation: 0.45 (was 0.7) - balance consistency + creativity
      topK: 30,           // GPT recommendation: 30 (was 40) - reduce outliers
      topP: 0.90,         // GPT recommendation: 0.90 (was 0.95) - tighter sampling
      maxOutputTokens: 4096,
      responseMimeType: 'application/json',
      responseSchema
    }
  };

  const response = await geminiRateLimiter.execute(async () => {
    return await axios.post(`${GEMINI_URL}?key=${GEMINI_API_KEY}`, payload, {
      timeout: 60000
    });
  });

  const text = response.data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    throw new Error('No response from Gemini');
  }

  const parsed = JSON.parse(text);
  let questions = parsed.questions;

  console.log(`\n📋 Generated ${questions.length} questions from Gemini`);

  // ===============================================
  // QUALITY CONTROL PIPELINE - POST-PROCESSING
  // ===============================================

  // STEP 1: Validate BEFORE randomization (check Gemini's original output)
  console.log('\n🔍 STEP 1: Validating Gemini output...');
  const originalDistribution = validateDistribution(questions);

  console.log('📊 Original distribution:', originalDistribution.distribution);
  console.log('   Balance:', originalDistribution.isBalanced ? '✅' : '❌');
  console.log('   Max consecutive:', originalDistribution.maxConsecutive);
  console.log('   Pattern detected:', originalDistribution.hasPattern ? '⚠️ YES' : '✅ NO');

  // STEP 2: PHASE 2 Validation - New relevance algorithm + filters
  console.log('\n🔍 STEP 2: PHASE 2 validation (relevanceTR + filters)...');
  let totalErrors = [];
  let totalWarnings = [];
  let totalRelevanceScore = 0;
  let genericCount = 0;
  let advancedCount = 0;

  questions.forEach((q, idx) => {
    // Phase 2: New relevance algorithm
    const fullText = (q.question + ' ' + q.options.join(' ')).toLowerCase();
    const relevanceResult = relevanceTR(fullText, allowedTerms);
    totalRelevanceScore += relevanceResult.score;

    const relevancePercent = Math.round(relevanceResult.score * 100);
    const relevanceEmoji = relevanceResult.score >= 0.7 ? '✅' :
                          relevanceResult.score >= 0.6 ? '🟡' : '❌';

    console.log(`   Q${idx + 1} relevance: ${relevanceEmoji} ${relevancePercent}% (${relevanceResult.hits} phrases matched)`);

    if (relevanceResult.score < 0.75) {
      totalErrors.push(`Q${idx + 1}: Low relevance (${relevancePercent}%, need ≥75%)`);
    }

    // Phase 2: Check for generic questions
    if (rejectGeneric(q)) {
      genericCount++;
      totalWarnings.push(`Q${idx + 1}: Generic workplace question detected`);
    }

    // Phase 2: Check for advanced topics
    const advancedPattern = /(\bCRM\b|\bKPI\b|\bERP\b|\bADR\b|\bIncoterms?\b|stratejik|planlama)/i;
    if (advancedPattern.test(q.question + ' ' + q.options.join(' '))) {
      advancedCount++;
      totalWarnings.push(`Q${idx + 1}: Advanced topic detected`);
    }

    // Phase 3: Check for duplicate/similar options (copy-paste error detection)
    for (let i = 0; i < q.options.length; i++) {
      for (let j = i + 1; j < q.options.length; j++) {
        const optA = q.options[i].toLowerCase();
        const optB = q.options[j].toLowerCase();

        // Check if options are >80% similar using Jaccard similarity
        const ngramsA = ngrams(optA, 3);
        const ngramsB = ngrams(optB, 3);
        const similarity = jaccard(ngramsA, ngramsB);

        if (similarity > 0.8) {
          totalErrors.push(`Q${idx + 1}: Options ${String.fromCharCode(65+i)} and ${String.fromCharCode(65+j)} are ${Math.round(similarity*100)}% similar (possible copy-paste)`);
        }
      }
    }

    // Legacy validation (keep for silly options check)
    const validation = validateQuestion(q, jobPosting.details, positionLevel);
    if (validation.errors.length > 0) {
      totalErrors = totalErrors.concat(validation.errors.map(e => `Q${idx + 1}: ${e}`));
    }
    if (validation.warnings.length > 0) {
      totalWarnings = totalWarnings.concat(validation.warnings.map(w => `Q${idx + 1}: ${w}`));
    }
  });

  const avgRelevance = totalRelevanceScore / questions.length;
  console.log(`\n📊 PHASE 3 Summary (Enhanced Quality):`);
  console.log(`   Average relevance: ${Math.round(avgRelevance * 100)}% (target: ≥75%)`);
  console.log(`   Generic questions: ${genericCount}/10`);
  console.log(`   Advanced topics: ${advancedCount}/10`);
  console.log(`   Total errors: ${totalErrors.length}`);
  console.log(`   Total warnings: ${totalWarnings.length}`);

  // STEP 3: CLEAN options - Remove "Sadece/Yalnızca/Tek başına" patterns (GPT enhanced)
  console.log('\n🧹 STEP 3: Cleaning absolutist language patterns...');
  questions.forEach((q, idx) => {
    let cleaned = 0;
    q.options = q.options.map(opt => {
      const original = opt;
      let clean = opt;

      // Remove "Sadece" at start of sentence
      clean = clean.replace(/^Sadece\s+/i, '');
      // Remove "sadece X yeterlidir" pattern
      clean = clean.replace(/sadece\s+\w+\s+yeterlidir?/gi, 'Bu yeterlidir');
      // Remove all "sadece" occurrences
      clean = clean.replace(/sadece\s+/gi, '');

      // GPT enhancement: Remove synonyms
      clean = clean.replace(/\b(yalnızca|tek başına|sırf)\b/gi, '');

      // Clean up double spaces
      clean = clean.replace(/\s{2,}/g, ' ').trim();

      if (clean !== original) cleaned++;
      return clean;
    });
    if (cleaned > 0) {
      console.log(`   Q${idx + 1}: Cleaned ${cleaned} options (absolutist language)`);
    }
  });

  // STEP 3.5: STRIP advanced topics (PHASE 2)
  console.log('\n🔧 STEP 3.5: Stripping advanced topics...');
  let strippedCount = 0;
  questions = questions.map(q => {
    const original = q.question;
    const stripped = stripAdvanced(q);
    if (stripped.question !== original) strippedCount++;
    return stripped;
  });
  console.log(`   Advanced topics stripped from ${strippedCount} questions`);

  // STEP 3.55: BALANCE option lengths (40-80 chars, correct answer not obvious)
  console.log('\n⚖️  STEP 3.55: Balancing option lengths...');
  questions.forEach((q, idx) => {
    const lengths = q.options.map(opt => opt.length);
    const avgLength = lengths.reduce((a, b) => a + b, 0) / lengths.length;
    const correctLength = lengths[q.correctAnswer];

    // PHASE 3.1 FIX: Tightened threshold from 1.5× to 1.2× (stricter balance)
    // Check if correct answer is TOO LONG (20% longer than average)
    if (correctLength > avgLength * 1.2) {
      console.log(`   ⚠️  Q${idx + 1}: Correct answer too long (${correctLength} vs avg ${Math.round(avgLength)})`);

      // Shorten correct answer by removing filler words
      const correctOpt = q.options[q.correctAnswer];
      let shortened = correctOpt
        .replace(/\s+(ve|ile|olarak|gibi|şekilde|için|ise|ancak)\s+/gi, ' ')
        .replace(/\s{2,}/g, ' ')
        .trim();

      // PHASE 3.1 FIX: Aggressive shortening for options over 60 chars
      if (shortened.length > 60) {
        // Remove "gibi", "benzeri" patterns
        shortened = shortened
          .replace(/\s+gibi\s+\w+/gi, '')
          .replace(/\s+ve benzeri\s+\w+/gi, '')
          .replace(/\s{2,}/g, ' ')
          .trim();
      }

      // If still too long, truncate intelligently
      if (shortened.length > avgLength * 1.15) {
        const words = shortened.split(' ');
        const targetWords = Math.floor(words.length * 0.7);
        shortened = words.slice(0, targetWords).join(' ');
      }

      q.options[q.correctAnswer] = shortened;
      console.log(`   ✅ Shortened: "${correctOpt.substring(0, 40)}..." → "${shortened.substring(0, 40)}..."`);
    }

    // Check if ANY option is too short (50% shorter than average)
    lengths.forEach((len, optIdx) => {
      if (len < avgLength * 0.5 && len < 30) {
        console.log(`   ⚠️  Q${idx + 1} Option ${String.fromCharCode(65 + optIdx)}: Too short (${len} vs avg ${Math.round(avgLength)})`);

        // PHASE 3.1 FIX: Diversified padding phrases (avoid repetitive patterns)
        const paddingPhrases = [
          ' ve uygun yöntemlerle devam ederim',
          ' ile ilgili gerekli aksiyonu alırım',
          ' konusunda planlama yaparım',
          ' yönünde çalışmalar gerçekleştiririm',
          ' ile süreci desteklerim'
        ];

        // Select padding based on question index (pseudo-random but consistent)
        const paddingIndex = (idx + optIdx) % paddingPhrases.length;
        const opt = q.options[optIdx];
        q.options[optIdx] = opt + paddingPhrases[paddingIndex];
        console.log(`   ✅ Padded: "${opt}" → "${q.options[optIdx].substring(0, 40)}..."`);
      }
    });
  });

  // STEP 3.58: REMOVE all quote marks (Turkish grammar fix)
  console.log('\n🧹 STEP 3.58: Removing quote marks...');
  let totalQuotesRemoved = 0;
  questions.forEach((q, idx) => {
    let quotesRemoved = 0;

    // Remove from question text
    const originalQ = q.question;
    q.question = q.question.replace(/['"'"„]/g, '');
    if (q.question !== originalQ) quotesRemoved++;

    // Remove from options
    q.options = q.options.map(opt => {
      const original = opt;
      const clean = opt.replace(/['"'"„]/g, '');
      if (clean !== original) quotesRemoved++;
      return clean;
    });

    // Remove from explanation
    const originalExpl = q.explanation;
    q.explanation = q.explanation.replace(/['"'"„]/g, '');
    if (q.explanation !== originalExpl) quotesRemoved++;

    if (quotesRemoved > 0) {
      console.log(`   Q${idx + 1}: Removed ${quotesRemoved} quote marks`);
      totalQuotesRemoved += quotesRemoved;
    }
  });
  console.log(`   Total quote marks removed: ${totalQuotesRemoved}`);

  // STEP 3.59: VALIDATE correctAnswer indices (CRITICAL FIX)
  console.log('\n🔍 STEP 3.59: Validating correctAnswer indices...');
  let correctAnswerFixed = 0;
  questions.forEach((q, idx) => {
    const explanation = q.explanation.toLowerCase();
    const correctOpt = q.options[q.correctAnswer].toLowerCase();

    // Extract key words from explanation (remove stopwords)
    const explWords = explanation
      .replace(/[^\wüğşıöç\s]/gi, '')
      .split(/\s+/)
      .filter(w => w.length > 3 && !['için', 'gibi', 'ancak', 'çünkü', 'veya', 'olarak'].includes(w));

    // Calculate word overlap for each option
    const scores = q.options.map(opt => {
      const optWords = opt.toLowerCase()
        .replace(/[^\wüğşıöç\s]/gi, '')
        .split(/\s+/)
        .filter(w => w.length > 3);

      // Count matching words
      const matches = optWords.filter(w => explWords.includes(w)).length;
      return matches;
    });

    // Find option with highest overlap
    const maxScore = Math.max(...scores);
    const bestIndex = scores.indexOf(maxScore);

    // If current correctAnswer has low overlap and another has high overlap, fix it
    const currentScore = scores[q.correctAnswer];
    if (maxScore > currentScore && maxScore >= 2) {
      console.log(`   ⚠️  Q${idx + 1}: correctAnswer=${q.correctAnswer} (${currentScore} matches) → ${bestIndex} (${maxScore} matches)`);
      console.log(`       Explanation: "${explanation.substring(0, 60)}..."`);
      console.log(`       Old correct: "${q.options[q.correctAnswer].substring(0, 50)}"`);
      console.log(`       New correct: "${q.options[bestIndex].substring(0, 50)}"`);
      q.correctAnswer = bestIndex;
      correctAnswerFixed++;
    }
  });
  console.log(`   ✅ Fixed ${correctAnswerFixed} incorrect correctAnswer indices`);

  // STEP 3.60: CAPITALIZE first letter of all options (user request)
  console.log('\n✨ STEP 3.60: Enforcing capitalization rules...');
  let capitalizationFixed = 0;
  questions.forEach((q, idx) => {
    q.options = q.options.map((opt, optIdx) => {
      const original = opt;
      // Capitalize first letter, rest unchanged
      const capitalized = opt.charAt(0).toUpperCase() + opt.slice(1);
      if (capitalized !== original) {
        capitalizationFixed++;
      }
      return capitalized;
    });
  });
  console.log(`   ✅ Capitalized ${capitalizationFixed} options`);

  // STEP 3.61: ENFORCE equal option lengths (±10% variance max)
  console.log('\n📏 STEP 3.61: Enforcing equal option lengths...');
  let lengthAdjustments = 0;
  questions.forEach((q, idx) => {
    const lengths = q.options.map(opt => opt.length);
    const avgLength = lengths.reduce((a, b) => a + b, 0) / lengths.length;
    const targetMin = Math.floor(avgLength * 0.9);
    const targetMax = Math.ceil(avgLength * 1.1);

    q.options = q.options.map((opt, optIdx) => {
      const len = opt.length;

      // Too long? Shorten aggressively
      if (len > targetMax) {
        let shortened = opt
          .replace(/\s+(ve|ile|olarak|gibi|için)\s+/gi, ' ')
          .replace(/\s{2,}/g, ' ')
          .trim();

        // Still too long? Truncate words
        if (shortened.length > targetMax) {
          const words = shortened.split(' ');
          const targetWords = Math.floor(words.length * (targetMax / shortened.length));
          shortened = words.slice(0, targetWords).join(' ');
        }

        console.log(`   Q${idx + 1}[${String.fromCharCode(65 + optIdx)}]: ${len} → ${shortened.length} chars`);
        lengthAdjustments++;
        return shortened;
      }

      // Too short? Pad with diverse phrases
      if (len < targetMin) {
        const paddingPhrases = [
          ' ve uygun yöntemlerle devam ederim',
          ' ile ilgili gerekli aksiyonu alırım',
          ' konusunda planlama yaparım',
          ' yönünde çalışmalar gerçekleştiririm',
          ' ile süreci desteklerim',
          ' için gerekli adımları atarım',
          ' noktasında inisiyatif alırım'
        ];
        const paddingIndex = (idx + optIdx) % paddingPhrases.length;
        const padded = opt + paddingPhrases[paddingIndex];

        // Don't exceed targetMax
        const finalPadded = padded.length > targetMax ? opt : padded;
        if (finalPadded !== opt) {
          console.log(`   Q${idx + 1}[${String.fromCharCode(65 + optIdx)}]: ${len} → ${finalPadded.length} chars (padded)`);
          lengthAdjustments++;
        }
        return finalPadded;
      }

      return opt;
    });
  });
  console.log(`   ✅ Adjusted ${lengthAdjustments} option lengths to ±10% variance`);

  // STEP 3.6: REPLACE silly options with professional alternatives (GPT Solution)
  console.log('\n🔄 STEP 3.6: Replacing silly options...');
  questions = replaceSillyOptions(questions);

  // STEP 4: FORCE balanced distribution (Gemini's recommendation)
  console.log('\n⚡ STEP 4: FORCING balanced distribution...');
  questions = forceBalancedDistribution(questions);

  // STEP 5: Validate AFTER randomization
  console.log('\n🔍 STEP 5: Validating post-randomization...');
  const finalDistribution = validateDistribution(questions);

  console.log('📊 Final distribution:', finalDistribution.distribution);
  console.log('   Balance:', finalDistribution.isValid ? '✅ VALID' : '❌ INVALID');
  console.log('   Max consecutive:', finalDistribution.maxConsecutive);
  console.log('   Pattern detected:', finalDistribution.hasPattern ? '⚠️ YES' : '✅ NO');

  // STEP 6: RE-VALIDATE after cleaning
  console.log('\n🔍 STEP 6: Re-validating after cleaning...');
  let cleanedErrors = 0;
  let cleanedRelevance = 0;

  questions.forEach((q, idx) => {
    const revalidation = validateQuestion(q, jobPosting.details, positionLevel);
    cleanedErrors += revalidation.errors.length;
    cleanedRelevance += revalidation.relevanceScore;
  });

  const cleanedAvgRelevance = cleanedRelevance / questions.length;
  console.log(`   Errors after cleaning: ${cleanedErrors} (was ${totalErrors.length})`);
  console.log(`   Avg relevance: ${Math.round(cleanedAvgRelevance * 100)}% (was ${Math.round(avgRelevance * 100)}%)`);

  // STEP 7: Calculate overall quality score (after cleaning)
  const qualityScore = Math.max(0, 100 - (cleanedErrors * 10));
  console.log(`\n🎯 OVERALL QUALITY SCORE: ${qualityScore}/100`);

  if (qualityScore < 60) {
    console.warn(`⚠️ Quality score below threshold (${qualityScore}%). Consider regeneration.`);
  }

  // STEP 6: Log final summary
  console.log('\n✅ Quality control completed!');
  console.log('═══════════════════════════════════════════════════════════\n');

  return questions;
}

/**
 * Get test by token
 */
async function getTestByToken(token) {
  const test = await prisma.assessmentTest.findUnique({
    where: { token },
    include: {
      jobPosting: {
        select: {
          title: true,
          department: true
        }
      },
      _count: {
        select: { submissions: true }
      }
    }
  });

  if (!test) {
    return null;
  }

  // Check if expired
  const now = new Date();
  const isExpired = now > test.expiresAt;

  return {
    ...test,
    isExpired,
    isValid: !isExpired
  };
}

/**
 * Check attempt count for an email
 */
async function getAttemptCount(testId, candidateEmail) {
  const count = await prisma.testSubmission.count({
    where: {
      testId,
      candidateEmail
    }
  });

  return count;
}

/**
 * Submit test answers
 */
async function submitTest(token, candidateEmail, candidateName, answers, startedAt, metadata = null) {
  const test = await getTestByToken(token);

  if (!test || !test.isValid) {
    throw new Error('Invalid or expired test');
  }

  // Check attempt limit
  const attemptCount = await getAttemptCount(test.id, candidateEmail);
  if (attemptCount >= test.maxAttempts) {
    throw new Error('Maximum attempts exceeded');
  }

  // Calculate score
  const questions = test.questions;
  let correctCount = 0;

  answers.forEach((answer) => {
    const question = questions.find(q => q.id === answer.questionId);
    if (question && question.correctAnswer === answer.selectedOption) {
      correctCount++;
    }
  });

  const score = correctCount * 10; // 10 points per question

  // Try to find candidate by email
  const candidate = await prisma.candidate.findFirst({
    where: { email: candidateEmail }
  });

  // IMPROVEMENT: Auto-populate candidateName from database if not provided
  const finalCandidateName = candidateName ||
    (candidate ? `${candidate.firstName} ${candidate.lastName}` : null);

  // Log anti-cheat warnings if exists
  if (metadata) {
    const warnings = [];
    if (metadata.tabSwitchCount > 0) warnings.push(`${metadata.tabSwitchCount} sekme değişimi`);
    if (metadata.copyAttempts > 0) warnings.push(`${metadata.copyAttempts} kopyalama`);
    if (metadata.screenshotAttempts > 0) warnings.push(`${metadata.screenshotAttempts} ekran görüntüsü`);

    if (warnings.length > 0) {
      console.warn(`⚠️ Anti-cheat uyarıları (${candidateEmail}): ${warnings.join(', ')}`);
    }
  }

  // IMPROVEMENT: Detect answer patterns (consecutive same answers)
  if (answers.length >= 5) {
    let maxConsecutive = 1;
    let currentConsecutive = 1;

    for (let i = 1; i < answers.length; i++) {
      if (answers[i].selectedOption === answers[i-1].selectedOption) {
        currentConsecutive++;
        maxConsecutive = Math.max(maxConsecutive, currentConsecutive);
      } else {
        currentConsecutive = 1;
      }
    }

    if (maxConsecutive >= 5) {
      console.warn(`⚠️ Answer pattern detected (${candidateEmail}): ${maxConsecutive} consecutive same answers!`);
      if (!metadata) metadata = {};
      metadata.answerPatternDetected = true;
      metadata.maxConsecutiveSameAnswer = maxConsecutive;
    }
  }

  // Create submission
  const submission = await prisma.testSubmission.create({
    data: {
      testId: test.id,
      candidateId: candidate?.id || null,
      candidateEmail,
      candidateName: finalCandidateName,  // IMPROVED: Auto-populated
      answers,
      score,
      correctCount,
      attemptNumber: attemptCount + 1,
      startedAt: new Date(startedAt),
      metadata: metadata || null
    }
  });

  // Log submission with quality indicators
  const scoreEmoji = score >= 80 ? '🟢' : score >= 60 ? '🟡' : '🔴';
  console.log(`${scoreEmoji} Test submitted: ${finalCandidateName || candidateEmail} - Score: ${score}/100 (${correctCount}/10 correct)`);

  if (metadata?.answerPatternDetected) {
    console.warn(`   ⚠️ Pattern warning: ${metadata.maxConsecutiveSameAnswer} consecutive same answers`);
  }

  return {
    submissionId: submission.id,
    score: submission.score,
    correctCount: submission.correctCount,
    totalQuestions: questions.length
  };
}

module.exports = {
  generateTest,
  getTestByToken,
  submitTest,
  getAttemptCount
};
