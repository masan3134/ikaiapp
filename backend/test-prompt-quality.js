/**
 * TEST: New Formula-Based Prompt Quality
 * Tests the improved prompt against old prompt
 * Generates questions and compares quality metrics
 */

const axios = require('axios');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'AIzaSyBGWvYrIjfpRSwUFbNUzUrAJto_1qHVmYQ';
const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent';

// Test job posting (same as before)
const testJobPosting = {
  title: 'Lojistik Operasyon Elemanı',
  department: 'Lojistik',
  details: `Lojistik departmanımızda çalışmak üzere Lojistik Operasyon Elemanı arıyoruz.

Görevler:
- Posta ve telefon yoluyla gelen siparişlerin takibi
- Müşterilerle iletişim ve bilgilendirme
- Microsoft Office programlarını (Excel, Outlook, Word) kullanarak günlük raporlama
- Sipariş kayıtlarının sisteme girilmesi
- Müşteri şikayetlerinin çözümü

Aranan Özellikler:
- Lise mezunu
- Yaklaşık 1 yıl deneyim
- İyi iletişim becerileri
- MS Office bilgisi`
};

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

// ═══════════════════════════════════════════════════════════════════════
// GPT SOLUTION v2025-10-27 - Pozitif Framing + Dahili Çalışma
// ═══════════════════════════════════════════════════════════════════════
const newSystemInstruction = `Rolün: İşe alım değerlendirme yazarı.
Hedefin: Verilen iş ilanına %100 ilgili, gerçekçi senaryolara dayalı **10** adet çoktan seçmeli soru üretmek.
Dil: Türkçe (doğal, akıcı, kurallı). Yazım ve noktalama tutarlı olsun.
Çıktı: Yalnızca belirtilen JSON şemasına birebir uyan veri.

Üretim İlkeleri:
1) İlan Odaklılık – Sorular ilan metnindeki görev ve gereksinimlerden türesin; konu dışına çıkma.
2) İş Günü Gerçekçiliği – Günlük iş akışında yaşanabilir durumlar: sipariş takibi, müşteri iletişimi, temel ofis/araç kullanımı gibi.
3) Profesyonel Seçenekler – Tüm seçenekler makul ve iş ortamına uygun; yanlışlar da mantıklı yanılgılar veya eksik uygulamalar olsun.
4) Çeşitlilik – Teknik/senaryo/deneyim temalarının dengeli karışımı; cümle kalıpları ve fiillerde tekrar yok.
5) Netlik – Her soruda **tek** doğru cevap; açıklama doğru cevabı kısa, neden-sonuç ilişkisiyle açıklar.
6) Uyum – Seçeneklerin uzunluğu ve üslubu birbirine yakın.

Dahili çalışma (çıktıya yazma):
- İlan metninden görev/araç/iş adımı anahtarlarını çıkar.
- Bunlardan 10 özgün soru tohumu türet.
- Her tohum için 1 soru + 4 seçenek + kısa açıklama planı yap.
- Yalnızca son JSON çıktısını ver.`;

const newPrompt = `Görev: Aşağıdaki iş ilanına **tam uyumlu** 10 adet çoktan seçmeli soru üret.

İŞ İLANI (ham metin):
"""
Pozisyon: ${testJobPosting.title}
Departman: ${testJobPosting.department}

Gereksinimler:
${testJobPosting.details}
"""

Kapsam ve Dağılım Hedefi:
- Temalar: teknik (≥3), senaryo/durum (≥4), deneyim/iş alışkanlığı (≥2)
- Odak: İlan metninde geçen görevler, araçlar, iş adımları

Çıktı şeması: JSON only, matching responseSchema exactly.`;

// ═══════════════════════════════════════════════════════════════════════
// QUALITY VALIDATION FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════

function validateQuestion(question, jobDetails) {
  const errors = [];
  const warnings = [];

  // 1. Check for "sadece" pattern
  const questionText = question.question.toLowerCase();
  const allOptions = question.options.join(' ').toLowerCase();
  const fullText = questionText + ' ' + allOptions;

  const sadeceCount = (fullText.match(/sadece/g) || []).length;
  if (sadeceCount >= 3) {
    errors.push(`"Sadece" pattern detected ${sadeceCount} times`);
  }

  // 2. Check for silly options
  const sillyKeywords = [
    'hiçbir şey yapmam',
    'görmezden gelirim',
    'önemsemem',
    'rastgele',
    'unutmak',
    'kapatmak'
  ];

  question.options.forEach((opt, idx) => {
    const optLower = opt.toLowerCase();
    sillyKeywords.forEach(silly => {
      if (optLower.includes(silly)) {
        warnings.push(`Q${question.id} Option ${String.fromCharCode(65+idx)}: Silly - "${silly}"`);
      }
    });
  });

  // 3. Check job relevance (keyword matching)
  const keywords = jobDetails.toLowerCase()
    .split(/[,.\s\n]+/)
    .filter(w => w.length > 3);

  let matchCount = 0;
  keywords.forEach(keyword => {
    if (fullText.includes(keyword)) {
      matchCount++;
    }
  });

  const relevanceScore = Math.min(1, matchCount / Math.max(keywords.length * 0.3, 5));

  if (relevanceScore < 0.3) {
    errors.push(`Q${question.id}: Low job relevance (${Math.round(relevanceScore * 100)}%)`);
  }

  // 4. Check advanced topics for entry-level
  const advancedTopics = [
    'access', 'crm', 'kpi rapor', 'adr', 'gümrük beyannamesi',
    'menşe şahadetnamesi', 'wms', 'edi', 'erp', 'incoterms'
  ];

  const hasAdvanced = advancedTopics.some(topic => fullText.includes(topic));
  if (hasAdvanced) {
    warnings.push(`Q${question.id}: Advanced topic for entry-level position`);
  }

  return {
    errors,
    warnings,
    relevanceScore,
    sadeceCount
  };
}

function validateDistribution(questions) {
  const distribution = { 0: 0, 1: 0, 2: 0, 3: 0 };
  questions.forEach(q => distribution[q.correctAnswer]++);

  const counts = Object.values(distribution);
  const isBalanced = counts.every(count => count >= 2 && count <= 3);

  return {
    distribution: {
      A: distribution[0],
      B: distribution[1],
      C: distribution[2],
      D: distribution[3]
    },
    isBalanced,
    percentages: {
      A: Math.round((distribution[0] / 10) * 100),
      B: Math.round((distribution[1] / 10) * 100),
      C: Math.round((distribution[2] / 10) * 100),
      D: Math.round((distribution[3] / 10) * 100)
    }
  };
}

async function generateQuestionsWithPrompt(systemInstruction, prompt) {
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
      temperature: 0.45,  // GPT recommendation
      topK: 30,           // GPT recommendation
      topP: 0.90,         // GPT recommendation
      maxOutputTokens: 4096,
      responseMimeType: 'application/json',
      responseSchema
    }
  };

  const response = await axios.post(`${GEMINI_URL}?key=${GEMINI_API_KEY}`, payload, {
    timeout: 60000
  });

  const text = response.data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    throw new Error('No response from Gemini');
  }

  return JSON.parse(text).questions;
}

// ═══════════════════════════════════════════════════════════════════════
// MAIN TEST
// ═══════════════════════════════════════════════════════════════════════

async function runTest() {
  console.log('\n' + '═'.repeat(80));
  console.log('🧪 PROMPT QUALITY TEST: Formula-Based vs Old Prompt');
  console.log('═'.repeat(80));

  console.log('\n📋 Test Job Posting:');
  console.log(`   Position: ${testJobPosting.title}`);
  console.log(`   Department: ${testJobPosting.department}`);
  console.log(`   Details: ${testJobPosting.details.substring(0, 100)}...`);

  console.log('\n🤖 Generating questions with NEW formula-based prompt...');
  const newQuestions = await generateQuestionsWithPrompt(newSystemInstruction, newPrompt);

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📊 QUALITY METRICS');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  // Distribution analysis
  const dist = validateDistribution(newQuestions);
  console.log('\n1️⃣  DISTRIBUTION (Correct Answers):');
  console.log(`   A: ${dist.distribution.A} (${dist.percentages.A}%)`);
  console.log(`   B: ${dist.distribution.B} (${dist.percentages.B}%)`);
  console.log(`   C: ${dist.distribution.C} (${dist.percentages.C}%)`);
  console.log(`   D: ${dist.distribution.D} (${dist.percentages.D}%)`);
  console.log(`   Balanced: ${dist.isBalanced ? '✅ YES' : '❌ NO'}`);

  // Question quality analysis
  console.log('\n2️⃣  QUESTION QUALITY:');
  let totalErrors = 0;
  let totalWarnings = 0;
  let totalRelevance = 0;
  let totalSadece = 0;

  newQuestions.forEach((q, idx) => {
    const validation = validateQuestion(q, testJobPosting.details);
    totalErrors += validation.errors.length;
    totalWarnings += validation.warnings.length;
    totalRelevance += validation.relevanceScore;
    totalSadece += validation.sadeceCount;

    const relevanceEmoji = validation.relevanceScore >= 0.7 ? '✅' :
                          validation.relevanceScore >= 0.5 ? '🟡' : '❌';

    console.log(`   Q${idx + 1}: ${relevanceEmoji} Relevance ${Math.round(validation.relevanceScore * 100)}% | ` +
                `Sadece: ${validation.sadeceCount} | ` +
                `Errors: ${validation.errors.length} | ` +
                `Warnings: ${validation.warnings.length}`);

    if (validation.errors.length > 0) {
      validation.errors.forEach(err => console.log(`      ❌ ${err}`));
    }
    if (validation.warnings.length > 0) {
      validation.warnings.forEach(warn => console.log(`      ⚠️  ${warn}`));
    }
  });

  const avgRelevance = totalRelevance / newQuestions.length;

  console.log('\n3️⃣  SUMMARY:');
  console.log(`   Total Errors: ${totalErrors}`);
  console.log(`   Total Warnings: ${totalWarnings}`);
  console.log(`   Average Relevance: ${Math.round(avgRelevance * 100)}%`);
  console.log(`   Total "Sadece" Count: ${totalSadece}`);
  console.log(`   Quality Score: ${Math.max(0, 100 - (totalErrors * 10))} /100`);

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📝 SAMPLE QUESTIONS');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  // Show first 3 questions
  newQuestions.slice(0, 3).forEach((q, idx) => {
    console.log(`\n${idx + 1}. ${q.question}`);
    q.options.forEach((opt, optIdx) => {
      const marker = optIdx === q.correctAnswer ? '✓' : ' ';
      console.log(`   ${String.fromCharCode(65 + optIdx)}) [${marker}] ${opt}`);
    });
  });

  console.log('\n' + '═'.repeat(80));
  console.log('✅ TEST COMPLETE!');
  console.log('═'.repeat(80) + '\n');
}

// Run test
runTest().catch(err => {
  console.error('\n❌ Test failed:', err.message);
  process.exit(1);
});
