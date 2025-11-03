const { Queue, Worker } = require('bullmq');
const nodemailer = require('nodemailer');

const connection = {
  host: process.env.REDIS_HOST || 'redis',
  port: process.env.REDIS_PORT || 6379,
};

// Email queue for test notifications
const testEmailQueue = new Queue('test-email', { connection });

// Worker to process email sending
const emailWorker = new Worker(
  'test-email',
  async (job) => {
    const { testId, recipientEmail, recipientName, testUrl, jobTitle } = job.data;

    console.log(`📧 Processing test email for ${recipientEmail}...`);

    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_APP_PASSWORD
        }
      });

      const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #F3F4F6;">
  <div style="max-width: 600px; margin: 0 auto; background: white;">
    <div style="background: linear-gradient(135deg, #3B82F6 0%, #6366F1 100%); padding: 40px 20px; text-align: center;">
      <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">Değerlendirme Testi</h1>
      <p style="color: #E0E7FF; margin: 10px 0 0; font-size: 16px;">IKAI HR Platform</p>
    </div>

    <div style="padding: 40px 20px;">
      <p style="margin: 0 0 20px; font-size: 16px; color: #374151;">
        Merhaba <strong>${recipientName || ''}</strong>,
      </p>

      <p style="margin: 0 0 20px; font-size: 16px; color: #374151; line-height: 1.6;">
        <strong>${jobTitle}</strong> pozisyonu için değerlendirme testine davet edildiniz.
      </p>

      <div style="background: #EFF6FF; border-left: 4px solid #3B82F6; padding: 20px; margin: 20px 0; border-radius: 4px;">
        <h3 style="margin: 0 0 15px; font-size: 16px; color: #1E40AF;">Test Bilgileri:</h3>
        <ul style="margin: 0; padding-left: 20px; color: #374151; line-height: 1.8;">
          <li><strong>Soru Sayısı:</strong> 10 (Çoktan seçmeli)</li>
          <li><strong>Süre:</strong> 30 dakika</li>
          <li><strong>Deneme Hakkı:</strong> 3 deneme</li>
          <li><strong>Kategoriler:</strong> Teknik, Durumsal, Deneyim</li>
        </ul>
      </div>

      <div style="text-align: center; margin: 30px 0;">
        <a href="${testUrl}" style="display: inline-block; background: #3B82F6; color: white; padding: 16px 40px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
          Teste Başla
        </a>
      </div>

      <p style="margin: 20px 0; font-size: 14px; color: #6B7280; text-align: center;">
        veya bu linki kullanın: <a href="${testUrl}" style="color: #3B82F6; word-break: break-all;">${testUrl}</a>
      </p>

      <p style="margin: 20px 0 0; font-size: 14px; color: #6B7280;">
        <strong>Not:</strong> Testi yarım bırakıp daha sonra devam edebilirsiniz (3 deneme hakkınız bulunmaktadır).
      </p>
    </div>

    <div style="padding: 20px; background: #F9FAFB; border-top: 1px solid #E5E7EB; text-align: center;">
      <p style="margin: 0; font-size: 12px; color: #6B7280;">
        © 2025 IKAI HR Platform - Bu email otomatik gönderilmiştir.
      </p>
    </div>
  </div>
</body>
</html>
      `;

      await transporter.sendMail({
        from: process.env.GMAIL_USER,
        to: recipientEmail,
        subject: `Değerlendirme Testi - ${jobTitle}`,
        html: emailHtml
      });

      console.log(`✅ Test email sent to ${recipientEmail}`);
      return { success: true, email: recipientEmail };

    } catch (error) {
      console.error(`❌ Failed to send email to ${recipientEmail}:`, error);
      throw error;
    }
  },
  { connection }
);

emailWorker.on('completed', (job) => {
  console.log(`✅ Email job ${job.id} completed`);
});

emailWorker.on('failed', (job, err) => {
  console.error(`❌ Email job ${job.id} failed:`, err.message);
});

module.exports = {
  testEmailQueue,
  connection
};
