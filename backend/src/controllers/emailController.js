const { sendAnalysisEmail: sendEmail } = require('../services/emailService');

/**
 * Send analysis via email
 * POST /api/v1/analyses/:id/send-email
 * Body: { recipientEmail, formats: ['html', 'xlsx', 'csv'] }
 */
async function sendAnalysisEmail(req, res) {
  try {
    const { id } = req.params;
    const { recipientEmail, formats } = req.body;

    const analysis = await require('../services/exportService').getAnalysisData(id, req.organizationId);
    if (!analysis) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Analiz bulunamadı'
      });
    }

    // Validation
    if (!recipientEmail) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Email adresi gereklidir'
      });
    }

    if (!formats || !Array.isArray(formats) || formats.length === 0) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'En az bir format seçilmelidir'
      });
    }

    const validFormats = ['html', 'xlsx', 'csv'];
    const invalidFormats = formats.filter(f => !validFormats.includes(f));
    if (invalidFormats.length > 0) {
      return res.status(400).json({
        error: 'Validation Error',
        message: `Geçersiz format: ${invalidFormats.join(', ')}`
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(recipientEmail)) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Geçersiz email adresi'
      });
    }

    // Send email directly
    const result = await sendEmail(id, recipientEmail, formats);

    console.log(`📧 Email sent for analysis ${id} to ${recipientEmail}`, result);

    return res.json({
      success: true,
      message: 'Email başarıyla gönderildi',
      messageId: result.messageId
    });

  } catch (error) {
    console.error('Email send error:', error);

    if (error.message === 'Analysis not found') {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Analiz bulunamadı'
      });
    }

    res.status(500).json({
      error: 'Email Failed',
      message: error.message || 'Email gönderilemedi'
    });
  }
}

module.exports = {
  sendAnalysisEmail
};
