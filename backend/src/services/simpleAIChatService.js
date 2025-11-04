/**
 * Simple AI Chat Service - Gemini Önerisi
 * Vector search YOK - Full context Gemini'ye gönderilir
 * %100 tutarlı yanıtlar
 */

const axios = require('axios');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent';

const SYSTEM_PROMPT = `Sen, IKAI İK platformunun bir parçası olan, özelleşmiş bir yapay zeka asistanısın. Görevin, kullanıcının sağladığı bağlam (context) içindeki CV analiz sonuçlarına dayalı olarak soruları yanıtlamak.

**ÖNEMLİ:** Bağlam dışındaki hiçbir soruyu yanıtlamayacaksın. Eğer bir soru bağlamla ilgili değilse, kesinlikle "Bu analizle ilgili bir soru değil, cevaplayamam." şeklinde cevap vermelisin.

**Davranış:**
- Net, öz ve doğru cevaplar ver
- Adayların isimlerini kullanarak cevapları kişiselleştir
- Karşılaştırma sorularında, güçlü ve zayıf yönleri objektif karşılaştır
- Filtreleme sorularında, kriterlere uyan adayların listesini ver
- Detay sorularında, bağlamdaki bilgilere dayanarak cevap ver

**Cevap Formatı:** Kısa ve anlaşılır. Gerekirse maddeleme kullan.

**Güvenlik:** Sadece bu analiz verileriyle sınırlısın.`;

/**
 * Analiz verisini context olarak hazırla
 */
async function prepareAnalysisContext(analysisId) {
  const analysis = await prisma.analysis.findUnique({
    where: { id: analysisId },
    include: {
      jobPosting: {
        select: {
          title: true,
          department: true,
          details: true
        }
      },
      analysisResults: {
        include: {
          candidate: {
            select: {
              firstName: true,
              lastName: true,
              email: true,
              phone: true,
              experience: true,
              education: true
            }
          }
        }
      }
    }
  });

  if (!analysis) {
    throw new Error('Analiz bulunamadı');
  }

  // Context oluştur
  const context = {
    pozisyon: analysis.jobPosting?.title || 'Belirtilmemiş',
    departman: analysis.jobPosting?.department || 'Belirtilmemiş',
    aday_sayisi: analysis.analysisResults.length,
    adaylar: analysis.analysisResults.map(result => ({
      isim: `${result.candidate.firstName} ${result.candidate.lastName}`,
      skor: Math.round(result.compatibilityScore),
      deneyim_skoru: result.experienceScore,
      egitim_skoru: result.educationScore,
      teknik_skor: result.technicalScore,
      soft_skills_skor: result.softSkillsScore,
      deneyim_ozet: result.experienceSummary || result.candidate.experience || 'Belirtilmemiş',
      egitim_ozet: result.educationSummary || result.candidate.education || 'Belirtilmemiş',
      kariyer: result.careerTrajectory || 'Belirtilmemiş',
      guclu_yonler: result.positiveComments || [],
      gelistirme_alanlari: result.negativeComments || [],
      oneri: result.strategicSummary?.finalRecommendation || result.matchLabel || 'İyi Eşleşme'
    }))
  };

  return context;
}

/**
 * AI Chat - With History Persistence
 */
async function chat(analysisId, userMessage, userId, organizationId) {
  const startTime = Date.now();

  try {
    // 1. Analiz context'ini hazırla
    const context = await prepareAnalysisContext(analysisId);

    // 2. Gemini prompt oluştur
    const fullPrompt = `${SYSTEM_PROMPT}

Kullanıcının Sorusu: ${userMessage}

Bağlam (Analiz Verileri):
${JSON.stringify(context, null, 2)}

Cevap:`;

    // 3. Gemini'ye gönder
    const response = await axios.post(
      `${GEMINI_URL}?key=${GEMINI_API_KEY}`,
      {
        contents: [{
          parts: [{ text: fullPrompt }]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2048
        }
      },
      { timeout: 30000 }
    );

    // 4. Yanıtı çıkar
    const reply = response.data.candidates[0].content.parts[0].text;
    const responseTime = Date.now() - startTime;

    // 5. SAVE TO DATABASE (Chat History)
    const chatMessage = await prisma.analysisChatMessage.create({
      data: {
        message: userMessage,
        response: reply,
        candidateCount: context.aday_sayisi,
        responseTime,
        usedSemanticSearch: false, // Will be true when Milvus is integrated
        contextTokens: Math.ceil((fullPrompt.length + reply.length) / 4), // Rough estimate
        organizationId,
        analysis: {
          connect: { id: analysisId }
        },
        user: {
          connect: { id: userId }
        }
      }
    });

    return {
      messageId: chatMessage.id,
      reply,
      contextUsed: true,
      candidateCount: context.aday_sayisi,
      responseTime
    };

  } catch (error) {
    console.error('Simple AI Chat error:', error.message);
    throw new Error('AI Chat hatası: ' + error.message);
  }
}

module.exports = {
  chat,
  prepareAnalysisContext
};
