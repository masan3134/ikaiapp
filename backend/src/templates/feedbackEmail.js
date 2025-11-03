/**
 * Generate HTML email template for candidate feedback
 *
 * @param {object} feedback - Generated feedback object
 * @param {string} candidateName
 * @param {string} jobTitle
 * @param {string} companyName
 * @returns {string} HTML email content
 */
function generateFeedbackEmailHTML(feedback, candidateName, jobTitle, companyName = 'IKAI') {
  return `
<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Başvuru Geri Bildirimi</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f5f5f5;
    }
    .container {
      background-color: white;
      border-radius: 10px;
      padding: 30px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 20px;
      border-radius: 8px 8px 0 0;
      margin: -30px -30px 20px -30px;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
    }
    .section {
      margin: 25px 0;
    }
    .section-title {
      font-size: 18px;
      font-weight: 600;
      color: #667eea;
      margin-bottom: 10px;
      border-left: 4px solid #667eea;
      padding-left: 10px;
    }
    .strength-item {
      background-color: #e8f5e9;
      padding: 12px;
      margin: 8px 0;
      border-radius: 6px;
      border-left: 4px solid #4caf50;
    }
    .development-item {
      background-color: #fff3e0;
      padding: 12px;
      margin: 8px 0;
      border-radius: 6px;
      border-left: 4px solid #ff9800;
    }
    .development-item .area {
      font-weight: 600;
      color: #f57c00;
    }
    .development-item .suggestion {
      margin-top: 8px;
      padding-left: 15px;
      font-style: italic;
    }
    .action-item {
      background-color: #e3f2fd;
      padding: 12px;
      margin: 8px 0;
      border-radius: 6px;
      border-left: 4px solid #2196f3;
    }
    .closing {
      background-color: #f3e5f5;
      padding: 20px;
      border-radius: 8px;
      margin-top: 30px;
      border-left: 4px solid #9c27b0;
    }
    .footer {
      text-align: center;
      margin-top: 30px;
      padding-top: 20px;
      border-top: 2px solid #eee;
      color: #777;
      font-size: 14px;
    }
    .emoji {
      font-size: 20px;
      margin-right: 8px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎯 Başvuru Değerlendirme Geri Bildirimi</h1>
      <p style="margin: 5px 0 0 0;">Merhaba ${candidateName},</p>
    </div>

    <div class="section">
      <p>${feedback.openingMessage || `${jobTitle} pozisyonu için başvurunuzu değerlendirdik. Size kişiselleştirilmiş geri bildirim sunmaktan mutluluk duyuyoruz.`}</p>
    </div>

    <div class="section">
      <div class="section-title">💪 Güçlü Yönleriniz</div>
      ${feedback.strengths?.map(strength => `
        <div class="strength-item">
          <span class="emoji">✅</span> ${strength}
        </div>
      `).join('') || '<p>Değerlendirme yapılırken hata oluştu.</p>'}
    </div>

    <div class="section">
      <div class="section-title">📈 Gelişim Fırsatları</div>
      ${feedback.developmentAreas?.map(dev => `
        <div class="development-item">
          <div class="area"><span class="emoji">🎯</span> ${dev.area}</div>
          <div style="margin-top: 5px; color: #666;">Mevcut: ${dev.currentLevel}</div>
          <div class="suggestion">
            <strong>Öneri:</strong> ${dev.suggestion}
          </div>
        </div>
      `).join('') || '<p>Gelişim önerisi bulunamadı.</p>'}
    </div>

    <div class="section">
      <div class="section-title">🚀 Önerilen Aksiyonlar</div>
      ${feedback.recommendedActions?.map(action => `
        <div class="action-item">
          ${action}
        </div>
      `).join('') || '<p>Öneri bulunamadı.</p>'}
    </div>

    <div class="closing">
      <p style="font-size: 16px; margin: 0;">
        <strong>💡 ${feedback.motivationalClosing || 'Gelişim yolculuğunuzda başarılar dileriz!'}</strong>
      </p>
      <p style="margin: 15px 0 0 0;">
        ${feedback.futureOpportunity || 'Gelişim gösterdiğinizde tekrar başvurmanızı memnuniyetle bekleriz!'}
      </p>
    </div>

    <div class="footer">
      <p><strong>${companyName} İnsan Kaynakları Ekibi</strong></p>
      <p style="font-size: 12px; color: #999; margin-top: 10px;">
        🤖 Bu geri bildirim yapay zeka destekli analiz ile oluşturulmuştur.
      </p>
    </div>
  </div>
</body>
</html>
  `;
}

/**
 * Generate plain text version of feedback email
 */
function generateFeedbackEmailText(feedback, candidateName, jobTitle) {
  return `
Merhaba ${candidateName},

${feedback.openingMessage || `${jobTitle} pozisyonu için başvurunuzu değerlendirdik.`}

GÜÇLÜ YÖNLER:
${feedback.strengths?.map((s, i) => `${i + 1}. ${s}`).join('\n') || 'Belirtilmemiş'}

GELİŞİM FIRSATLARI:
${feedback.developmentAreas?.map((d, i) => `
${i + 1}. ${d.area}
   Mevcut: ${d.currentLevel}
   Öneri: ${d.suggestion}
`).join('\n') || 'Belirtilmemiş'}

ÖNERİLEN AKSİYONLAR:
${feedback.recommendedActions?.join('\n') || 'Belirtilmemiş'}

${feedback.motivationalClosing || 'Gelişim yolculuğunuzda başarılar dileriz!'}

${feedback.futureOpportunity || 'Gelişim gösterdiğinizde tekrar başvurmanızı memnuniyetle bekleriz!'}

---
IKAI İnsan Kaynakları Ekibi
🤖 Bu geri bildirim yapay zeka destekli analiz ile oluşturulmuştur.
  `;
}

module.exports = {
  generateFeedbackEmailHTML,
  generateFeedbackEmailText
};
