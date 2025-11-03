const axios = require('axios');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'YOUR_GEMINI_API_KEY';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent';

/**
 * Generate personalized feedback for low-scoring candidates
 * Helps candidates improve for future opportunities
 *
 * @param {object} analysisResult - Full analysis result object
 * @param {object} jobPosting - Job posting details
 * @returns {Promise<object>} - {feedback, improvementSuggestions[], nextSteps[]}
 */
async function generateCandidateFeedback(analysisResult, jobPosting) {
  try {
    console.log(`🤖 Generating personalized feedback for candidate ${analysisResult.candidateId}...`);

    const prompt = buildFeedbackPrompt(analysisResult, jobPosting);

    const response = await axios.post(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      {
        contents: [{
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          temperature: 0.7, // More creative for personalized feedback
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
          responseMimeType: 'application/json'
        }
      },
      {
        headers: { 'Content-Type': 'application/json' },
        timeout: 30000
      }
    );

    const responseText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!responseText) {
      throw new Error('Empty response from Gemini API');
    }

    const feedback = JSON.parse(responseText);

    console.log(`✅ Feedback generated for candidate ${analysisResult.candidateId}`);
    return feedback;

  } catch (error) {
    console.error('❌ Feedback generation error:', error.message);
    throw new Error('Failed to generate feedback: ' + error.message);
  }
}

/**
 * Build the feedback generation prompt
 */
function buildFeedbackPrompt(analysisResult, jobPosting) {
  const candidate = analysisResult.candidate || {};
  const scores = {
    experience: analysisResult.experienceScore || 0,
    education: analysisResult.educationScore || 0,
    technical: analysisResult.technicalScore || 0,
    softSkills: analysisResult.softSkillsScore || 0,
    extra: analysisResult.extraScore || 0,
    final: analysisResult.compatibilityScore || 0
  };

  return `Sen bir HR mentorüsün. Bir adaya YAPICI ve MOTİVE EDİCİ geri bildirim vereceksin.

ADAY BİLGİSİ:
İsim: ${candidate.firstName} ${candidate.lastName}
Email: ${candidate.email}

BAŞVURDUĞU POZİSYON:
Pozisyon: ${jobPosting.title}
Departman: ${jobPosting.department}

DEĞERLENDİRME SKORLARI (0-100):
- Deneyim: ${scores.experience}/100
- Eğitim: ${scores.education}/100
- Teknik Beceriler: ${scores.technical}/100
- Soft Skills: ${scores.softSkills}/100
- Diğer: ${scores.extra}/100
- **GENEL UYUM: ${scores.final}/100**

ANALİZ ÖZETİ:
Deneyim: ${analysisResult.experienceSummary || 'Belirtilmemiş'}
Eğitim: ${analysisResult.educationSummary || 'Belirtilmemiş'}

GÜÇLÜ YÖNLER:
${JSON.stringify(analysisResult.positiveComments || [], null, 2)}

GELİŞİM ALANLARI:
${JSON.stringify(analysisResult.negativeComments || [], null, 2)}

GÖREVİN:
Bu adaya **EMPATIK, YAPIUCI ve MOTİVE EDICI** bir geri bildirim oluştur.

1. **Pozitif Başla:** Güçlü yönlerini vurgula
2. **Gelişim Fırsatları:** Hangi alanlarda gelişmesi gerektiğini nazikçe açıkla
3. **Somut Öneriler:** Nasıl gelişebileceğine dair ACTIONABLE öneriler ver
4. **Motivasyon:** Gelecek için umut ver

ÇIKTI FORMATI (JSON):
{
  "openingMessage": "Merhaba [İsim], başvurunuz için teşekkür ederiz...",
  "strengths": [
    "Güçlü yön 1 (pozitif dil kullan)",
    "Güçlü yön 2"
  ],
  "developmentAreas": [
    {
      "area": "Gelişim alanı (örn: Backend deneyimi)",
      "currentLevel": "Mevcut durum",
      "suggestion": "Nasıl gelişebilir? (somut adımlar)"
    }
  ],
  "recommendedActions": [
    "📚 Öneri 1: [Somut aksiyon] (örn: React Advanced Patterns kursu)",
    "🎯 Öneri 2: [Somut aksiyon]",
    "💼 Öneri 3: [Somut aksiyon]"
  ],
  "motivationalClosing": "Potansiyelinizi görüyoruz! Gelişim önerilerimizi takip ederseniz...",
  "futureOpportunity": "6 ay sonra tekrar başvurmanızı bekleriz! / Benzer pozisyonlar için takipte kalın.",
  "tone": "supportive" // or "encouraging" or "professional"
}

ÖNEMLI:
- Türkçe yaz!
- **ASLA** olumsuz veya yargılayıcı dil kullanma!
- Her eleştiriyi bir çözüm önerisi ile dengele!
- Adayın GELİŞİM POTANSİYELİNE odaklan, eksikliklerine değil!
- İnsan kaynakları best practices'e uy (GDPR, etik iletişim)!
`;
}

/**
 * Generate feedback for multiple candidates
 * @param {array} analysisResults - Array of analysis result objects
 * @param {object} jobPosting
 * @returns {Promise<array>} Array of feedback objects with candidateId
 */
async function generateBulkFeedback(analysisResults, jobPosting) {
  const feedbacks = [];

  for (const result of analysisResults) {
    try {
      const feedback = await generateCandidateFeedback(result, jobPosting);
      feedbacks.push({
        candidateId: result.candidateId,
        candidateEmail: result.candidate?.email,
        candidateName: `${result.candidate?.firstName} ${result.candidate?.lastName}`,
        feedback
      });
    } catch (error) {
      console.error(`❌ Failed to generate feedback for ${result.candidateId}:`, error.message);
      // Continue with other candidates
      feedbacks.push({
        candidateId: result.candidateId,
        error: error.message
      });
    }
  }

  return feedbacks;
}

module.exports = {
  generateCandidateFeedback,
  generateBulkFeedback
};
