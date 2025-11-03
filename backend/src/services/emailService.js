const nodemailer = require('nodemailer');
const { exportToExcel, exportToCSV, exportToHTML } = require('./exportService');

// Create transporter (Gmail)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER || 'your-email@gmail.com',
    pass: process.env.GMAIL_APP_PASSWORD || 'your-app-password'
  }
});

/**
 * Send analysis via email with attachments
 */
async function sendAnalysisEmail(analysisId, recipientEmail, formats = ['html']) {
  const attachments = [];

  // Generate requested formats
  for (const format of formats) {
    if (format === 'html') {
      const html = await exportToHTML(analysisId);
      attachments.push({
        filename: `analiz-${analysisId}.html`,
        content: html,
        contentType: 'text/html; charset=utf-8'
      });
    } else if (format === 'xlsx') {
      const workbook = await exportToExcel(analysisId);
      const buffer = await workbook.xlsx.writeBuffer();
      attachments.push({
        filename: `analiz-${analysisId}.xlsx`,
        content: buffer,
        contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });
    } else if (format === 'csv') {
      const csv = await exportToCSV(analysisId);
      attachments.push({
        filename: `analiz-${analysisId}.csv`,
        content: Buffer.from('\uFEFF' + csv, 'utf-8'),
        contentType: 'text/csv; charset=utf-8'
      });
    }
  }

  // Email options
  const mailOptions = {
    from: process.env.GMAIL_USER || 'IKAI HR <noreply@ikai.com>',
    to: recipientEmail,
    subject: 'CV Analiz Raporu - IKAI HR Platform',
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #3B82F6, #2563EB); color: white; padding: 30px; border-radius: 12px; text-align: center; margin-bottom: 30px; }
    .header h1 { margin: 0; font-size: 28px; }
    .header p { margin: 8px 0 0; opacity: 0.9; font-size: 14px; }
    .content { background: #F9FAFB; padding: 30px; border-radius: 12px; margin-bottom: 20px; }
    .info-box { background: white; border-left: 4px solid #3B82F6; padding: 16px; margin: 16px 0; border-radius: 6px; }
    .info-box strong { color: #1F2937; }
    .attachments { background: white; padding: 20px; border-radius: 8px; margin-top: 20px; }
    .attachments h3 { margin: 0 0 12px; color: #374151; font-size: 16px; }
    .attachment-item { padding: 10px; background: #F3F4F6; border-radius: 6px; margin-bottom: 8px; font-size: 14px; }
    .footer { text-align: center; color: #6B7280; font-size: 12px; padding: 20px; border-top: 2px solid #E5E7EB; }
    .button { display: inline-block; background: #3B82F6; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; margin-top: 16px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>📊 CV Analiz Raporu</h1>
      <p>IKAI HR Platform - Yapay Zeka Destekli CV Değerlendirme</p>
    </div>

    <div class="content">
      <h2 style="margin: 0 0 16px; color: #1F2937;">Merhaba,</h2>
      <p>İstemiş olduğunuz CV analiz raporu hazır ve ektedir.</p>

      <div class="info-box">
        <p style="margin: 4px 0;"><strong>📋 Analiz ID:</strong> ${analysisId}</p>
        <p style="margin: 4px 0;"><strong>📅 Tarih:</strong> ${new Date().toLocaleDateString('tr-TR', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })}</p>
        <p style="margin: 4px 0;"><strong>📎 Ek Dosya:</strong> ${attachments.length} adet</p>
      </div>

      <div class="attachments">
        <h3>📎 Ekteki Dosyalar:</h3>
        ${attachments.map(a => `<div class="attachment-item">📄 ${a.filename}</div>`).join('')}
      </div>

      <p style="margin-top: 24px;">Raporları inceleyerek adaylar hakkında detaylı bilgi edinebilirsiniz.</p>
      <p style="margin-top: 16px; color: #6B7280; font-size: 14px;">
        <strong>Not:</strong> HTML dosyasını tarayıcınızda açıp "PDF Yazdır" butonuna basarak PDF olarak kaydedebilirsiniz.
      </p>
    </div>

    <div class="footer">
      <p>Bu e-posta IKAI HR Platform tarafından otomatik olarak gönderilmiştir.</p>
      <p style="margin-top: 8px;">© 2025 IKAI HR Platform - Tüm hakları saklıdır.</p>
    </div>
  </div>
</body>
</html>
    `,
    attachments
  };

  // Send email
  const info = await transporter.sendMail(mailOptions);

  return {
    success: true,
    messageId: info.messageId,
    accepted: info.accepted,
    response: info.response
  };
}

/**
 * Send interview invitation to candidate
 * NEW FEATURE #3: Interview Scheduler
 */
async function sendInterviewInvitation(candidate, interview) {
  const scheduledDate = new Date(interview.scheduledAt);
  const formattedDate = scheduledDate.toLocaleDateString('tr-TR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
  const formattedTime = scheduledDate.toLocaleTimeString('tr-TR', {
    hour: '2-digit',
    minute: '2-digit'
  });

  const mailOptions = {
    from: process.env.GMAIL_USER || 'IKAI HR <noreply@ikai.com>',
    to: candidate.email,
    subject: 'Mülakat Daveti - IKAI HR Platform',
    html: `
<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Mülakat Daveti</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #F3F4F6;">
  <div style="max-width: 600px; margin: 40px auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
    <div style="background: linear-gradient(135deg, #3B82F6 0%, #2563EB 100%); padding: 32px; text-align: center;">
      <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700;">Mülakat Davetiniz</h1>
      <p style="color: rgba(255, 255, 255, 0.9); margin: 8px 0 0 0; font-size: 16px;">IKAI HR Platform</p>
    </div>

    <div style="padding: 32px;">
      <p style="font-size: 16px; color: #1F2937; margin: 0 0 24px 0;">
        Sayın <strong>${candidate.firstName} ${candidate.lastName}</strong>,
      </p>

      <p style="font-size: 15px; color: #4B5563; line-height: 1.6; margin: 0 0 24px 0;">
        Başvurunuz değerlendirilerek mülakata davet edildiniz. Aşağıda mülakat detaylarınızı bulabilirsiniz:
      </p>

      <div style="background: #F9FAFB; border-left: 4px solid #3B82F6; padding: 20px; margin: 24px 0; border-radius: 8px;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; color: #6B7280; font-size: 14px; width: 120px;"><strong>📅 Tarih:</strong></td>
            <td style="padding: 8px 0; color: #1F2937; font-size: 15px;"><strong>${formattedDate}</strong></td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #6B7280; font-size: 14px;"><strong>🕒 Saat:</strong></td>
            <td style="padding: 8px 0; color: #1F2937; font-size: 15px;"><strong>${formattedTime}</strong></td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #6B7280; font-size: 14px;"><strong>⏱️ Süre:</strong></td>
            <td style="padding: 8px 0; color: #1F2937; font-size: 15px;">${interview.duration} dakika</td>
          </tr>
          ${interview.location ? `
          <tr>
            <td style="padding: 8px 0; color: #6B7280; font-size: 14px;"><strong>📍 Konum:</strong></td>
            <td style="padding: 8px 0; color: #1F2937; font-size: 15px;">${interview.location}</td>
          </tr>
          ` : ''}
          ${interview.meetingLink ? `
          <tr>
            <td style="padding: 8px 0; color: #6B7280; font-size: 14px;"><strong>🔗 Toplantı:</strong></td>
            <td style="padding: 8px 0; color: #1F2937; font-size: 15px;">
              <a href="${interview.meetingLink}" style="color: #3B82F6; text-decoration: none;">Toplantıya Katıl</a>
            </td>
          </tr>
          ` : ''}
        </table>
      </div>

      ${interview.notes ? `
      <div style="background: #FEF3C7; border-left: 4px solid #F59E0B; padding: 16px; margin: 24px 0; border-radius: 8px;">
        <p style="margin: 0; color: #92400E; font-size: 14px;"><strong>📝 Not:</strong> ${interview.notes}</p>
      </div>
      ` : ''}

      <p style="font-size: 14px; color: #6B7280; margin: 24px 0 0 0; line-height: 1.5;">
        Lütfen mülakat saatinden <strong>15 dakika önce</strong> hazır olunuz. Herhangi bir sorun yaşarsanız bizimle iletişime geçebilirsiniz.
      </p>
    </div>

    <div style="background: #F9FAFB; padding: 24px; text-align: center; border-top: 1px solid #E5E7EB;">
      <p style="margin: 0; color: #6B7280; font-size: 13px;">Bu e-posta IKAI HR Platform tarafından otomatik olarak gönderilmiştir.</p>
      <p style="margin: 8px 0 0 0; color: #9CA3AF; font-size: 12px;">© 2025 IKAI HR - Tüm hakları saklıdır.</p>
    </div>
  </div>
</body>
</html>
    `
  };

  const info = await transporter.sendMail(mailOptions);

  return {
    success: true,
    messageId: info.messageId
  };
}

/**
 * Send interview reschedule notification
 * NEW FEATURE #3: Interview Scheduler
 */
async function sendInterviewRescheduleNotification(candidate, interview) {
  const scheduledDate = new Date(interview.scheduledAt);
  const formattedDate = scheduledDate.toLocaleDateString('tr-TR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
  const formattedTime = scheduledDate.toLocaleTimeString('tr-TR', {
    hour: '2-digit',
    minute: '2-digit'
  });

  const mailOptions = {
    from: process.env.GMAIL_USER || 'IKAI HR <noreply@ikai.com>',
    to: candidate.email,
    subject: 'Mülakat Saati Değişti - IKAI HR Platform',
    html: `
<!DOCTYPE html>
<html lang="tr">
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #F3F4F6;">
  <div style="max-width: 600px; margin: 40px auto; background: white; border-radius: 12px; padding: 32px;">
    <h1 style="color: #F59E0B; margin: 0 0 16px 0;">⚠️ Mülakat Saati Değişti</h1>
    <p style="font-size: 15px; color: #4B5563; margin: 0 0 24px 0;">
      Sayın <strong>${candidate.firstName} ${candidate.lastName}</strong>,
    </p>
    <p style="font-size: 15px; color: #4B5563; margin: 0 0 24px 0;">
      Mülakatınız yeni bir tarihe taşındı:
    </p>
    <div style="background: #FEF3C7; border-left: 4px solid #F59E0B; padding: 20px; margin: 24px 0; border-radius: 8px;">
      <p style="margin: 0; color: #92400E;"><strong>📅 Yeni Tarih:</strong> ${formattedDate}</p>
      <p style="margin: 8px 0 0 0; color: #92400E;"><strong>🕒 Yeni Saat:</strong> ${formattedTime}</p>
    </div>
    <p style="font-size: 14px; color: #6B7280;">Anlayışınız için teşekkür ederiz.</p>
  </div>
</body>
</html>
    `
  };

  await transporter.sendMail(mailOptions);
}

/**
 * Generic send email function for interviews and other features
 * @param {Object} options - { to, subject, html }
 */
async function sendEmail({ to, subject, html }) {
  const mailOptions = {
    from: `"IKAI HR Platform" <${process.env.GMAIL_USER}>`,
    to,
    subject: subject || 'IKAI HR Platform Notification',
    html
  };

  await transporter.sendMail(mailOptions);
}

/**
 * Send a generic email (wrapper for sendEmail)
 * Used by notificationService for simple HTML emails
 */
async function sendGenericEmail(to, subject, html) {
  return sendEmail({ to, subject, html });
}

/**
 * Send job offer email with PDF attachment
 * Feature #3: Email Gönderimi
 */
async function sendOfferEmail(offerId) {
  try {
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();

    // Get offer with relations
    const offer = await prisma.jobOffer.findUnique({
      where: { id: offerId },
      include: {
        candidate: true,
        jobPosting: true,
        creator: true
      }
    });

    if (!offer) {
      throw new Error('Offer not found');
    }

    // Create acceptance URL
    const acceptanceUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/accept-offer/${offer.acceptanceToken}`;

    // Update offer with acceptance URL
    await prisma.jobOffer.update({
      where: { id: offerId },
      data: { acceptanceUrl }
    });

    // Helper function for work type label
    const getWorkTypeLabel = (workType) => {
      const labels = {
        office: '🏢 Ofis',
        hybrid: '🏠 Hibrit',
        remote: '💻 Uzaktan',
      };
      return labels[workType] || workType;
    };

    // Build benefits HTML
    let benefitsHtml = '';
    if (offer.benefits) {
      const benefits = [];
      if (offer.benefits.insurance) {
        benefits.push('<div style="display: flex; align-items: center; gap: 8px; background: white; border-radius: 8px; padding: 12px; margin-bottom: 8px;"><span style="font-size: 20px;">🏥</span><span style="color: #1F2937; font-weight: 500;">Özel Sağlık Sigortası</span></div>');
      }
      if (offer.benefits.meal > 0) {
        benefits.push(`<div style="display: flex; align-items: center; gap: 8px; background: white; border-radius: 8px; padding: 12px; margin-bottom: 8px;"><span style="font-size: 20px;">🍽️</span><span style="color: #1F2937; font-weight: 500;">Yemek Kartı (${offer.benefits.meal} TL/ay)</span></div>`);
      }
      if (offer.benefits.transportation) {
        benefits.push('<div style="display: flex; align-items: center; gap: 8px; background: white; border-radius: 8px; padding: 12px; margin-bottom: 8px;"><span style="font-size: 20px;">🚌</span><span style="color: #1F2937; font-weight: 500;">Ulaşım Desteği</span></div>');
      }
      if (offer.benefits.gym) {
        benefits.push('<div style="display: flex; align-items: center; gap: 8px; background: white; border-radius: 8px; padding: 12px; margin-bottom: 8px;"><span style="font-size: 20px;">🏋️</span><span style="color: #1F2937; font-weight: 500;">Spor Salonu Üyeliği</span></div>');
      }
      if (offer.benefits.education) {
        benefits.push('<div style="display: flex; align-items: center; gap: 8px; background: white; border-radius: 8px; padding: 12px; margin-bottom: 8px;"><span style="font-size: 20px;">📚</span><span style="color: #1F2937; font-weight: 500;">Eğitim Desteği</span></div>');
      }

      if (benefits.length > 0) {
        benefitsHtml = `
          <div style="background: linear-gradient(135deg, #D1FAE5, #A7F3D0); border: 2px solid #10B981; border-radius: 12px; padding: 24px; margin: 24px 0;">
            <h3 style="margin: 0 0 16px; color: #1F2937; font-size: 20px; font-weight: bold;">🎁 Yan Haklar ve İmkanlar</h3>
            ${benefits.join('')}
          </div>
        `;
      }
    }

    // Build terms HTML
    let termsHtml = '';
    if (offer.terms) {
      termsHtml = `
        <div style="background: #F9FAFB; border: 2px solid #E5E7EB; border-radius: 12px; padding: 24px; margin: 24px 0;">
          <h3 style="margin: 0 0 16px; color: #1F2937; font-size: 18px; font-weight: bold;">📝 Şartlar ve Koşullar</h3>
          <div style="color: #4B5563; line-height: 1.6; white-space: pre-wrap;">${offer.terms}</div>
        </div>
      `;
    }

    // Email content with rich HTML
    const mailOptions = {
      from: `"IKAI HR Platform" <${process.env.GMAIL_USER}>`,
      to: offer.candidate.email,
      subject: `🎉 İş Teklifi - ${offer.position}`,
      html: `
<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>İş Teklifi - ${offer.position}</title>
  <style>
    @media print {
      body { background: white !important; }
      .no-print { display: none !important; }
      .container { box-shadow: none !important; margin: 0 !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; background: linear-gradient(135deg, #EFF6FF, #DBEAFE); line-height: 1.6;">

  <div class="container" style="max-width: 700px; margin: 40px auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.15);">

    <!-- Header -->
    <div style="background: linear-gradient(135deg, #3B82F6, #2563EB); padding: 48px 40px; text-align: center;">
      <div style="width: 80px; height: 80px; background: white; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 16px; box-shadow: 0 8px 20px rgba(0,0,0,0.2);">
        <span style="font-size: 40px;">💼</span>
      </div>
      <h1 style="color: white; margin: 0; font-size: 36px; font-weight: bold;">İş Teklifi</h1>
      <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0; font-size: 18px;">IKAI HR Platform</p>
    </div>

    <!-- Main Content -->
    <div style="padding: 40px;">

      <!-- Greeting -->
      <div style="margin-bottom: 32px;">
        <p style="font-size: 20px; color: #1F2937; margin: 0 0 16px;">
          Sayın <strong style="color: #3B82F6;">${offer.candidate.firstName} ${offer.candidate.lastName}</strong>,
        </p>
        <p style="font-size: 16px; color: #4B5563; line-height: 1.8; margin: 0;">
          Başvurunuz değerlendirilmiş olup, <strong style="color: #1F2937;">${offer.position}</strong> pozisyonu için
          ekibimize katılmanızı büyük bir memnuniyetle bekliyoruz.
        </p>
      </div>

      <!-- Offer Details Card -->
      <div style="background: linear-gradient(135deg, #DBEAFE, #BFDBFE); border: 2px solid #3B82F6; border-radius: 12px; padding: 24px; margin: 24px 0;">
        <h3 style="margin: 0 0 20px; color: #1F2937; font-size: 22px; font-weight: bold;">📋 Teklif Detayları</h3>

        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 12px; background: white; border-radius: 8px; margin-bottom: 8px;" colspan="2">
              <table style="width: 100%;">
                <tr>
                  <td style="color: #6B7280; font-size: 13px; font-weight: 600; width: 140px;">Pozisyon</td>
                  <td style="color: #1F2937; font-size: 16px; font-weight: bold;">${offer.position}</td>
                </tr>
              </table>
            </td>
          </tr>
          <tr><td colspan="2" style="height: 8px;"></td></tr>
          <tr>
            <td style="padding: 12px; background: white; border-radius: 8px;" colspan="2">
              <table style="width: 100%;">
                <tr>
                  <td style="color: #6B7280; font-size: 13px; font-weight: 600; width: 140px;">Departman</td>
                  <td style="color: #1F2937; font-size: 16px; font-weight: bold;">${offer.department}</td>
                </tr>
              </table>
            </td>
          </tr>
          <tr><td colspan="2" style="height: 8px;"></td></tr>
          <tr>
            <td style="padding: 12px; background: white; border-radius: 8px;" colspan="2">
              <table style="width: 100%;">
                <tr>
                  <td style="color: #6B7280; font-size: 13px; font-weight: 600; width: 140px;">Maaş</td>
                  <td style="color: #059669; font-size: 20px; font-weight: bold;">₺${offer.salary.toLocaleString('tr-TR')} <span style="font-size: 14px; color: #6B7280;">${offer.currency}</span></td>
                </tr>
              </table>
            </td>
          </tr>
          <tr><td colspan="2" style="height: 8px;"></td></tr>
          <tr>
            <td style="padding: 12px; background: white; border-radius: 8px;" colspan="2">
              <table style="width: 100%;">
                <tr>
                  <td style="color: #6B7280; font-size: 13px; font-weight: 600; width: 140px;">Başlangıç Tarihi</td>
                  <td style="color: #1F2937; font-size: 16px; font-weight: bold;">${new Date(offer.startDate).toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' })}</td>
                </tr>
              </table>
            </td>
          </tr>
          <tr><td colspan="2" style="height: 8px;"></td></tr>
          <tr>
            <td style="padding: 12px; background: white; border-radius: 8px;" colspan="2">
              <table style="width: 100%;">
                <tr>
                  <td style="color: #6B7280; font-size: 13px; font-weight: 600; width: 140px;">Çalışma Şekli</td>
                  <td style="color: #1F2937; font-size: 16px; font-weight: bold;">${getWorkTypeLabel(offer.workType)}</td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </div>

      ${benefitsHtml}

      ${termsHtml}

      <!-- Expiry Notice -->
      <div style="background: linear-gradient(135deg, #FEF3C7, #FDE68A); border: 2px solid #F59E0B; border-radius: 12px; padding: 20px; margin: 24px 0;">
        <table style="width: 100%;">
          <tr>
            <td style="width: 40px; vertical-align: top;">
              <span style="font-size: 28px;">⏰</span>
            </td>
            <td>
              <p style="margin: 0 0 4px; color: #1F2937; font-weight: bold; font-size: 16px;">Geçerlilik Süresi</p>
              <p style="margin: 0; color: #78350F; font-size: 15px;">
                Bu teklif <strong style="color: #92400E;">${new Date(offer.expiresAt).toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' })}</strong> tarihine kadar geçerlidir.
              </p>
            </td>
          </tr>
        </table>
      </div>

      <!-- CTA Button -->
      <div class="no-print" style="text-align: center; margin: 40px 0;">
        <p style="margin: 0 0 20px; color: #6B7280; font-size: 15px;">
          Teklifi görüntülemek, kabul etmek veya reddetmek için aşağıdaki butona tıklayın:
        </p>
        <a href="${acceptanceUrl}"
           style="display: inline-block; background: linear-gradient(135deg, #10B981, #059669); color: white; padding: 18px 48px; text-decoration: none; border-radius: 12px; font-weight: bold; font-size: 18px; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);">
          ✅ Teklifi Görüntüle ve Yanıtla
        </a>
      </div>

      <!-- Print Button Info -->
      <div style="background: #F0F9FF; border: 2px solid #0EA5E9; border-radius: 12px; padding: 16px; margin: 24px 0; text-align: center;">
        <p style="margin: 0; color: #0C4A6E; font-size: 14px;">
          <strong>💡 İpucu:</strong> Teklifi PDF olarak kaydetmek için sayfayı açtıktan sonra <strong>"PDF Olarak Yazdır"</strong> butonunu kullanabilirsiniz.
        </p>
      </div>

    </div>

    <!-- Footer -->
    <div style="background: #F9FAFB; padding: 32px; text-align: center; border-top: 2px solid #E5E7EB;">
      <p style="margin: 0 0 8px; color: #6B7280; font-size: 14px;">
        Bu e-posta IKAI HR Platform tarafından otomatik olarak gönderilmiştir.
      </p>
      <p style="margin: 0; color: #9CA3AF; font-size: 13px;">
        © 2025 IKAI HR Platform - Tüm hakları saklıdır.
      </p>
    </div>

  </div>

</body>
</html>
      `
    };

    // Send email (NO PDF ATTACHMENT)
    const info = await transporter.sendMail(mailOptions);

    // Update offer status
    await prisma.jobOffer.update({
      where: { id: offerId },
      data: {
        status: 'sent',
        emailSent: true,
        emailSentAt: new Date(),
        sentAt: new Date()
      }
    });

    console.log(`✅ Offer email sent to ${offer.candidate.email} (No PDF, HTML only with print button)`);

    return {
      success: true,
      messageId: info.messageId,
      acceptanceUrl
    };
  } catch (error) {
    console.error('❌ Send offer email error:', error);
    throw error;
  }
}

module.exports = {
  sendAnalysisEmail,
  sendInterviewInvitation,
  sendInterviewRescheduleNotification,
  sendEmail,
  sendGenericEmail,
  sendOfferEmail
};
