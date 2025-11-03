/**
 * Analysis Context Builder
 * Analiz verilerini AI-ready chunk'lara böler
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class AnalysisContextBuilder {
  /**
   * Tam analiz context'ini chunk'lara böl
   */
  async buildChunks(analysisId) {
    // Tüm verileri al
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

    if (!analysis) {
      throw new Error(`Analysis ${analysisId} not found`);
    }

    const chunks = [];

    // Chunk 0: Summary
    chunks.push(this.createSummaryChunk(analysis));

    // Chunk 1: Job Posting
    chunks.push(this.createJobChunk(analysis.jobPosting));

    // Chunk 2-N: Her aday
    analysis.analysisResults.forEach((result, index) => {
      chunks.push(this.createCandidateChunk(result, index));
    });

    // Chunk N+1: Top 3 comparison
    if (analysis.analysisResults.length >= 3) {
      chunks.push(this.createTopCandidatesChunk(analysis.analysisResults.slice(0, 3)));
    }

    return chunks;
  }

  /**
   * Summary chunk
   */
  createSummaryChunk(analysis) {
    const results = analysis.analysisResults;
    const scores = results.map(r => r.compatibilityScore);
    const avgScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
    const topCandidate = results[0];

    return {
      chunk_type: 'summary',
      chunk_index: 0,
      candidate_id: '',
      chunk_text: `
ANALİZ ÖZETİ

Analiz ID: ${analysis.id}
İş Pozisyonu: ${analysis.jobPosting.title}
Şirket/Departman: ${analysis.jobPosting.department}
Toplam Aday Sayısı: ${results.length}

Skorlar:
- En Yüksek: ${Math.max(...scores)} puan (${topCandidate.candidate.firstName} ${topCandidate.candidate.lastName})
- Ortalama: ${avgScore} puan
- En Düşük: ${Math.min(...scores)} puan

Durum: ${analysis.status}
Tamamlanma: ${analysis.completedAt ? new Date(analysis.completedAt).toLocaleString('tr-TR') : 'Devam ediyor'}

TÜM ADAYLAR (Skor Sırasına Göre):
${results.map((r, i) =>
  `${i + 1}. ${r.candidate.firstName} ${r.candidate.lastName} - ${r.compatibilityScore} puan`
).join('\n')}

En İyi 3 Aday:
${results.slice(0, 3).map((r, i) =>
  `${i + 1}. ${r.candidate.firstName} ${r.candidate.lastName} (${r.compatibilityScore} puan)`
).join('\n')}
      `.trim(),
      metadata: {
        total_candidates: results.length,
        avg_score: avgScore,
        top_score: Math.max(...scores),
        job_title: analysis.jobPosting.title
      }
    };
  }

  /**
   * Job posting chunk
   */
  createJobChunk(jobPosting) {
    return {
      chunk_type: 'job',
      chunk_index: 1,
      candidate_id: '',
      chunk_text: `
İŞ İLANI DETAYLARI

Pozisyon: ${jobPosting.title}
Departman: ${jobPosting.department}

İş Tanımı ve Gereksinimler:
${jobPosting.details}

${jobPosting.notes ? `Ek Notlar:\n${jobPosting.notes}` : ''}
      `.trim(),
      metadata: {
        job_id: jobPosting.id,
        job_title: jobPosting.title,
        department: jobPosting.department
      }
    };
  }

  /**
   * Candidate chunk (detaylı)
   */
  createCandidateChunk(result, index) {
    const candidate = result.candidate;
    const scoringProfile = result.scoringProfile || {};

    return {
      chunk_type: 'candidate',
      chunk_index: index + 2,
      candidate_id: result.candidateId,
      chunk_text: `
ADAY #${index + 1}: ${candidate.firstName} ${candidate.lastName}

İletişim:
- Email: ${candidate.email}
- Telefon: ${candidate.phone}
- Adres: ${candidate.address}

SKORLAR (0-100):
Final Uygunluk Skoru: ${result.compatibilityScore}/100

Alt Skorlar:
- Deneyim: ${result.experienceScore || 0}/100
- Eğitim: ${result.educationScore || 0}/100
- Teknik: ${result.technicalScore || 0}/100
- Soft Skills: ${result.softSkillsScore || 0}/100
- Ekstra: ${result.extraScore || 0}/100

Skor Ağırlıkları:
${scoringProfile.rationale || 'Standart ağırlıklar kullanıldı'}

DENEYİM ÖZETİ:
${result.experienceSummary || 'Bilgi yok'}

EĞİTİM ÖZETİ:
${result.educationSummary || 'Bilgi yok'}

KARİYER ROTASI:
${result.careerTrajectory || 'Bilgi yok'}

POZİTİF YORUMLAR:
${Array.isArray(result.positiveComments)
  ? result.positiveComments.map((c, i) => `${i + 1}. ${c}`).join('\n')
  : JSON.stringify(result.positiveComments)}

NEGATİF YORUMLAR / GELİŞİM ALANLARI:
${Array.isArray(result.negativeComments)
  ? result.negativeComments.map((c, i) => `${i + 1}. ${c}`).join('\n')
  : JSON.stringify(result.negativeComments)}

STRATEJİK ÖZET:
${result.strategicSummary ? JSON.stringify(result.strategicSummary, null, 2) : 'Bilgi yok'}

CV BİLGİLERİ:
- Deneyim: ${candidate.experience}
- Eğitim: ${candidate.education}
- Genel Yorum: ${candidate.generalComment}
      `.trim(),
      metadata: {
        candidate_id: candidate.id,
        candidate_name: `${candidate.firstName} ${candidate.lastName}`,
        score: result.compatibilityScore,
        rank: index + 1,
        email: candidate.email
      }
    };
  }

  /**
   * Top 3 comparison chunk
   */
  createTopCandidatesChunk(topResults) {
    return {
      chunk_type: 'top_candidates',
      chunk_index: 999,
      candidate_id: '',
      chunk_text: `
EN İYİ 3 ADAY KARŞILAŞTIRMASI

${topResults.map((result, i) => `
${i + 1}. ${result.candidate.firstName} ${result.candidate.lastName} - ${result.compatibilityScore} PUAN

Güçlü Yönler:
${Array.isArray(result.positiveComments)
  ? result.positiveComments.slice(0, 3).join(', ')
  : 'Bilgi yok'}

Gelişim Alanları:
${Array.isArray(result.negativeComments)
  ? result.negativeComments.slice(0, 2).join(', ')
  : 'Bilgi yok'}

Alt Skorlar: Deneyim ${result.experienceScore}, Eğitim ${result.educationScore}, Teknik ${result.technicalScore}
`).join('\n---\n')}
      `.trim(),
      metadata: {
        candidate_count: topResults.length,
        top_scores: topResults.map(r => r.compatibilityScore)
      }
    };
  }
}

module.exports = { AnalysisContextBuilder };
