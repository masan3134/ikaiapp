const axios = require('axios');
const mammoth = require('mammoth');
const geminiRateLimiter = require('../utils/geminiRateLimiter');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_API_KEY) {
  throw new Error('GEMINI_API_KEY ortam değişkeni ayarlanmamış!');
}

// Google'ın önerdiği güncel ve stabil Flash modeli
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

/**
 * BATCH SIZE CONFIGURATION
 *
 * Calculation (Gemini 2.0 Flash):
 * - maxOutputTokens: 8192
 * - Safety margin: 20%
 * - Tokens per CV: ~1000 (average JSON output)
 * - Formula: (8192 * 0.8) / 1000 = 6.5
 *
 * BATCH_SIZE = 6 (safe limit for token constraints)
 *
 * Examples:
 * - 25 CVs → 5 batches (6+6+6+6+1)
 * - 50 CVs → 9 batches (6+6+6+6+6+6+6+6+2)
 */
const BATCH_SIZE = 6;

/**
 * Delay between batches (milliseconds)
 * Prevents rate limiting
 */
const BATCH_DELAY_MS = 2000;

/**
 * Birden fazla CV'yi tek bir Gemini API çağrısıyla toplu olarak analiz eder.
 * Bu yöntem, tek tek çağrılara göre daha hızlı ve maliyet etkindir.
 *
 * @param {string} analysisId - Analiz işleminin kimliği (loglama için).
 * @param {object} jobPosting - İş ilanı detayları: {title, department, details, notes}.
 * @param {Array<object>} candidatesData - Aday verileri dizisi: [{id, cvBuffer, fileName}].
 * @returns {Promise<Array<object>>} Tüm adaylar için analiz sonuçlarını içeren bir Promise.
 */
async function batchAnalyzeCVs(analysisId, jobPosting, candidatesData) {
  try {
    console.log(`🚀 Gemini Direct Batch: ${candidatesData.length} CVs in 1 API call`);

    // Build the master prompt
    const systemPrompt = buildBatchPrompt(jobPosting, candidatesData.length);

    // Prepare multi-part request with all CV files
    const parts = [
      { text: systemPrompt }
    ];

    // Add each CV as inline data (format-aware: PDF/DOCX/TXT)
    for (let i = 0; i < candidatesData.length; i++) {
      const candidate = candidatesData[i];
      const fileExt = candidate.fileName.toLowerCase().split('.').pop();

      // CV header
      parts.push({
        text: `\n\n--- CV ${i + 1} (Candidate ID: ${candidate.id}, Format: ${fileExt.toUpperCase()}) ---\n`
      });

      // Format-specific processing
      if (fileExt === 'txt') {
        // TXT: Direct text (fastest & most reliable)
        const cvText = candidate.cvBuffer.toString('utf-8');
        parts.push({
          text: cvText
        });
        console.log(`  📄 CV ${i + 1}: TXT (${cvText.length} chars)`);

      } else if (fileExt === 'docx') {
        // DOCX: Extract text using mammoth
        try {
          const result = await mammoth.extractRawText({ buffer: candidate.cvBuffer });
          parts.push({
            text: result.value
          });
          console.log(`  📄 CV ${i + 1}: DOCX (extracted ${result.value.length} chars)`);
        } catch (docxError) {
          console.error(`  ❌ CV ${i + 1}: DOCX extraction failed:`, docxError.message);
          parts.push({
            text: '[DOCX extraction failed - unable to analyze this CV]'
          });
        }

      } else if (fileExt === 'pdf') {
        // PDF: Use Gemini File API (supports complex layouts)
        const base64PDF = candidate.cvBuffer.toString('base64');
        parts.push({
          inline_data: {
            mime_type: 'application/pdf',
            data: base64PDF
          }
        });
        console.log(`  📄 CV ${i + 1}: PDF (${Math.round(base64PDF.length / 1024)} KB)`);

      } else {
        // Unsupported format - try as text fallback
        console.warn(`  ⚠️  CV ${i + 1}: Unknown format '${fileExt}', trying as text`);
        const cvText = candidate.cvBuffer.toString('utf-8');
        parts.push({
          text: cvText
        });
      }
    }

    parts.push({
      text: '\n\nPlease analyze ALL CVs above and return a JSON array with one object per CV, in the same order.'
    });

    // Call Gemini API with rate limiting
    const response = await geminiRateLimiter.execute(async () => {
      return await axios.post(
        `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
        {
          contents: [{
            parts
          }],
          generationConfig: {
            temperature: 0.4,
            topK: 32,
            topP: 1,
            maxOutputTokens: 8192,
            responseMimeType: 'application/json'
          }
        },
        {
          headers: {
            'Content-Type': 'application/json'
          },
          timeout: 120000 // 2 minutes for batch
        }
      );
    });

    // Parse response
    const responseText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!responseText) {
      throw new Error('Empty response from Gemini API');
    }

    let results;
    try {
      results = JSON.parse(responseText);
    } catch (parseError) {
      console.error('❌ Gemini JSON Parse Error:', parseError.message);
      console.error('📄 Raw Gemini Response:', responseText); // Ham yanıtı logla
      // Gemini'dan gelen yanıtın neden JSON'a çevrilemediğini anlamak için ham yanıtı loglamak çok önemlidir.
      throw new Error('Gemini API\'sinden geçersiz JSON formatında yanıt alındı.');
    }

    // Validate we got results for all CVs
    if (!Array.isArray(results) || results.length !== candidatesData.length) {
      console.warn(`⚠️  Expected ${candidatesData.length} results, got ${results?.length || 0}`);
    }

    // Map results to candidate IDs
    const mappedResults = results.map((result, index) => ({
      ...result,
      candidateId: candidatesData[index].id,
      fileName: candidatesData[index].fileName
    }));

    console.log(`✅ Gemini Direct Batch completed: ${mappedResults.length} results`);
    return mappedResults;

  } catch (error) {
    // Axios hatalarını daha detaylı loglama
    if (error.response) {
      // API'den bir hata yanıtı geldiyse (örn: 4xx, 5xx)
      console.error('❌ Gemini API Error:', error.response.status, JSON.stringify(error.response.data, null, 2));
    } else if (error.request) {
      // İstek yapıldı ama yanıt alınamadıysa (örn: ağ hatası, timeout)
      console.error('❌ Gemini Network Error:', error.message);
    }
    throw new Error(`Toplu CV analizi başarısız oldu: ${error.message}`);
  }
}

/**
 * Build the master prompt for batch analysis
 */
function buildBatchPrompt(jobPosting, cvCount) {
  return `Sen uzman bir İK yöneticisisin ve ${cvCount} adet adayın CV'sini tek bir istekte analiz edeceksin.

İŞ İLANI:
Pozisyon: ${jobPosting.title}
Departman: ${jobPosting.department}
Detaylar: ${jobPosting.details}
${jobPosting.notes ? `Notlar: ${jobPosting.notes}` : ''}

GÖREVİN:
Aşağıda sana verilen her bir CV için, belirtilen formatta bir JSON nesnesi oluştur. Sonuç olarak, ${cvCount} adet CV için ${cvCount} adet nesne içeren TEK BİR JSON dizisi döndürmelisin.

V7.1 ÇERÇEVESİ - STRATEJİK DEĞERLENDİRME:

**1. 5 BOYUTLU PUANLAMA (Her boyut 0-100):**
- experienceScore: İş deneyimi değerlendirmesi
- educationScore: Eğitim değerlendirmesi
- technicalScore: Teknik beceriler
- softSkillsScore: Liderlik, iletişim, problem çözme (CV dilinden çıkarım)
- extraScore: Dil, lokasyon, sertifikalar vb.

**2. DİNAMİK AĞIRLIKLANDIRMA:**
Pozisyona göre ağırlıkları ayarla (toplam 1.0):
Ağırlıklandırma profilini şu formatta oluştur: {
  "experienceWeight": 0.0-0.5,
  "educationWeight": 0.0-0.4,
  "technicalWeight": 0.0-0.4,
  "softSkillsWeight": 0.0-0.3,
  "extraWeight": 0.0-0.2,
  "rationale": "Neden bu ağırlıkları seçtin?"
}

**3. KANıT TİPLERİ:**
Her yorum için kanıt tipini belirt:
- "Doğrudan": CV'de açıkça yazan bir bilgi.
- "Çıkarım": CV'deki ifadelerden, projelerden veya kariyer yolculuğundan yapılan mantıksal çıkarım.

**4. STRATEJİK ÖZET:**
{
  "executiveSummary": "2-3 cümlelik yönetici özeti",
  "keyStrengths": ["Güçlü yön 1", "Güçlü yön 2"],
  "keyRisks": ["Risk 1 (hafifletme önerisi ile)"],
  "interviewQuestions": ["Derinlemesine soru 1", "Soru 2"],
  "finalRecommendation": "İlerlet / Beklet / Reddet",
  "hiringTimeline": "Önerilen sonraki adımlar"
}

**5. KARİYER TRAJEKTÖRÜ:**
Adayın kariyer büyüme desenini analiz et (terfi, sorumluluk artışı, sektör değişimi).

**ZORUNLU ÇIKTI FORMATI:**

  {
    "candidateId": "PLACEHOLDER", // Backend tarafından doldurulacak
    "personalInfo": {
      "firstName": "...",
      "lastName": "...",
      "email": "...",
      "phone": "...",
      "address": "..."
    },
    "scores": {
      "experienceScore": 0-100,
      "educationScore": 0-100,
      "technicalScore": 0-100,
      "softSkillsScore": 0-100,
      "extraScore": 0-100,
      "finalCompatibilityScore": 0-100  // Ağırlıklı ortalama
    },
    "scoringProfile": {
      "experienceWeight": 0.3,
      "educationWeight": 0.25,
      "technicalWeight": 0.25,
      "softSkillsWeight": 0.15,
      "extraWeight": 0.05,
      "rationale": "Junior pozisyon için potansiyel ve eğitim ön planda"
    },
    "analysisSummaries": {
      "experienceSummary": "Detaylı deneyim öyküsü...",
      "educationSummary": "Detaylı eğitim öyküsü...",
      "careerTrajectory": "Kariyer büyüme analizi...",
      "positiveComments": [
        "(Doğrudan) 5 yıl React deneyimi var",
        "(Çıkarım) CV'deki proje çeşitliliğinden problem çözme yeteneği güçlü"
      ],
      "negativeComments": [
        "(Doğrudan) Backend deneyimi eksik - Hafifletme: Mikro-servis kursu alabilir"
      ]
    },
    "strategicSummary": {
      "executiveSummary": "...",
      "keyStrengths": ["...", "..."],
      "keyRisks": ["..."],
      "interviewQuestions": ["...", "..."],
      "finalRecommendation": "İlerlet",
      "hiringTimeline": "1 hafta içinde teknik mülakat"
    },
    "matchLabel": "Güçlü Eşleşme"
  }
  // ... ${cvCount - 1} adet daha
]

DİKKAT:
- Sadece JSON array döndür, başka metin ekleme!
- ${cvCount} adet object olmalı!
- Türkçe karakter encoding doğru olmalı (İ, ı, ş, ğ, ç, ö, ü)
- Her CV için ayrı stratejik değerlendirme yap!
`;
}

/**
 * Chunk large CV batches into smaller batches to avoid token limits
 * Processes all CVs across multiple API calls
 *
 * @param {string} analysisId - Analysis ID for logging
 * @param {object} jobPosting - Job posting details
 * @param {Array<object>} candidatesData - All candidates data
 * @returns {Promise<Array<object>>} All analysis results combined
 */
async function batchAnalyzeCVsWithChunking(analysisId, jobPosting, candidatesData) {
  const totalCVs = candidatesData.length;

  // If within batch size limit, use direct batch
  if (totalCVs <= BATCH_SIZE) {
    console.log(`📦 Direct batch: ${totalCVs} CVs (within limit)`);
    return await batchAnalyzeCVs(analysisId, jobPosting, candidatesData);
  }

  // Split into chunks
  const chunks = [];
  for (let i = 0; i < totalCVs; i += BATCH_SIZE) {
    chunks.push(candidatesData.slice(i, i + BATCH_SIZE));
  }

  console.log(`📦 Chunking enabled: ${totalCVs} CVs → ${chunks.length} batches (${BATCH_SIZE} per batch)`);

  const allResults = [];
  let processedCount = 0;
  let failedCount = 0;

  // Process each chunk
  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    const chunkNumber = i + 1;

    try {
      console.log(`⏳ Processing batch ${chunkNumber}/${chunks.length} (${chunk.length} CVs)...`);

      const chunkResults = await batchAnalyzeCVs(analysisId, jobPosting, chunk);

      if (chunkResults && Array.isArray(chunkResults)) {
        allResults.push(...chunkResults);
        processedCount += chunkResults.length;
        console.log(`✅ Batch ${chunkNumber}/${chunks.length} completed: ${chunkResults.length} results`);
      } else {
        failedCount += chunk.length;
        console.error(`❌ Batch ${chunkNumber}/${chunks.length} returned invalid results`);
      }

    } catch (error) {
      failedCount += chunk.length;
      console.error(`❌ Batch ${chunkNumber}/${chunks.length} failed:`, error.message);

      // Continue with next batch (partial failure tolerance)
      // Add placeholder results for failed chunk
      for (const candidate of chunk) {
        allResults.push({
          candidateId: candidate.id,
          error: true,
          errorMessage: `Batch ${chunkNumber} failed: ${error.message}`,
          scores: {
            experienceScore: 0,
            educationScore: 0,
            technicalScore: 0,
            softSkillsScore: 0,
            extraScore: 0,
            finalCompatibilityScore: 0
          },
          matchLabel: 'Analiz Başarısız'
        });
      }
    }

    // Delay between batches (except last one)
    if (i < chunks.length - 1) {
      console.log(`⏸️  Waiting ${BATCH_DELAY_MS}ms before next batch...`);
      await new Promise(resolve => setTimeout(resolve, BATCH_DELAY_MS));
    }
  }

  console.log(`📊 Chunking summary: ${processedCount} successful, ${failedCount} failed (total ${totalCVs})`);

  if (allResults.length === 0) {
    throw new Error('All batches failed - no results generated');
  }

  return allResults;
}

module.exports = {
  batchAnalyzeCVs,
  batchAnalyzeCVsWithChunking
};
