const attachmentService = require('../services/attachmentService');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

class AttachmentController {
  async uploadAttachment(req, res) {
    try {
      const { offerId } = req.params;
      const attachment = await attachmentService.uploadAttachment(offerId, req.file, req.user.id, req.organizationId);
      res.status(201).json({ success: true, data: attachment });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  async getAttachments(req, res) {
    try {
      const { offerId } = req.params;
      const attachments = await attachmentService.getAttachments(offerId, req.organizationId);
      res.json({ success: true, data: attachments });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  async deleteAttachment(req, res) {
    try {
      const { id } = req.params;
      await attachmentService.deleteAttachment(id, req.organizationId);
      res.json({ success: true, message: 'Attachment deleted' });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
}

module.exports = new AttachmentController();
