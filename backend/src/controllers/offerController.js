const offerService = require('../services/offerService');
const offerPdfService = require('../services/offerPdfService');
const emailService = require('../services/emailService');
const expirationService = require('../services/expirationService');
const bulkOfferService = require('../services/bulkOfferService'); // Added for Phase 4

/**
 * Offer Controller
 * Handles all job offer HTTP requests
 */
class OfferController {

  /**
   * Create new offer
   * POST /api/v1/offers
   * Feature #1: Teklif Oluşturma
   */
  async createOffer(req, res) {
    try {
      const userId = req.user.id;
      const offer = await offerService.createOffer(req.body, userId);

      res.status(201).json({
        success: true,
        message: 'Teklif başarıyla oluşturuldu',
        data: offer
      });
    } catch (error) {
      console.error('❌ Create offer error:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Teklif oluşturulurken hata oluştu'
      });
    }
  }

  /**
   * Create offer via wizard (simplified flow)
   * POST /api/v1/offers/wizard
   * Handles draft and direct send modes
   */
  async createOfferFromWizard(req, res) {
    try {
      const userId = req.user.id;
      const { emailSent, emailError, ...offer } = await offerService.createOfferFromWizard(req.body, userId);

      const { sendMode } = req.body;
      let successMessage = 'Teklif taslak olarak kaydedildi ve onaya gönderildi';

      if (sendMode === 'direct') {
        if (emailSent) {
          successMessage = 'Teklif başarıyla oluşturuldu ve adaya gönderildi';
        } else {
          successMessage = `Teklif oluşturuldu ancak e-posta gönderilemedi: ${emailError.message}`;
        }
      }

      res.status(201).json({
        success: true,
        message: successMessage,
        data: offer,
        emailSent,
      });
    } catch (error) {
      console.error('❌ Create offer from wizard error:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Teklif oluşturulurken hata oluştu'
      });
    }
  }

  /**
   * Get all offers with filters
   * GET /api/v1/offers?status=draft&page=1&limit=20
   * Feature #5: Teklif Listeleme
   */
  async getOffers(req, res) {
    try {
      const { status, candidateId, createdBy, page, limit } = req.query;
      const userId = req.user.id;

      const result = await offerService.getOffers(
        {
          status,
          candidateId,
          createdBy: createdBy || userId
        },
        {
          page: parseInt(page) || 1,
          limit: parseInt(limit) || 20
        }
      );

      res.json({
        success: true,
        data: result.offers,
        pagination: result.pagination
      });
    } catch (error) {
      console.error('❌ Get offers error:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Teklifler yüklenirken hata oluştu'
      });
    }
  }

  /**
   * Get offer by ID
   * GET /api/v1/offers/:id
   * Feature #6: Teklif Detay Görüntüleme
   */
  async getOfferById(req, res) {
    try {
      const { id } = req.params;
      const offer = await offerService.getOfferById(id);

      res.json({
        success: true,
        data: offer
      });
    } catch (error) {
      console.error('❌ Get offer by ID error:', error);
      res.status(404).json({
        success: false,
        error: error.message || 'Teklif bulunamadı'
      });
    }
  }

  /**
   * Update offer
   * PUT /api/v1/offers/:id
   */
  async updateOffer(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const offer = await offerService.updateOffer(id, req.body, userId);

      res.json({
        success: true,
        message: 'Teklif güncellendi',
        data: offer
      });
    } catch (error) {
      console.error('❌ Update offer error:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Teklif güncellenirken hata oluştu'
      });
    }
  }

  /**
   * Delete offer
   * DELETE /api/v1/offers/:id
   */
  async deleteOffer(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      await offerService.deleteOffer(id, userId);

      res.json({
        success: true,
        message: 'Teklif silindi'
      });
    } catch (error) {
      console.error('❌ Delete offer error:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Teklif silinirken hata oluştu'
      });
    }
  }

  /**
   * Send offer email with PDF
   * PATCH /api/v1/offers/:id/send
   * Features #2 + #3: PDF + Email
   */
  async sendOffer(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const revisionService = require('../services/revisionService');

      const result = await emailService.sendOfferEmail(id);

      // Create revision entry for sending the offer
      await revisionService.createRevision(
        id,
        'sent',
        userId,
        { emailSent: true, sentAt: new Date() }
      );

      res.json({
        success: true,
        message: 'Teklif başarıyla gönderildi',
        data: result
      });
    } catch (error) {
      console.error('❌ Send offer error:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Teklif gönderilirken hata oluştu'
      });
    }
  }

  /**
   * Bulk send offers
   * POST /api/v1/offers/bulk-send
   * Feature #19: Toplu Teklif Gönderme
   */
  async bulkSend(req, res) {
    try {
      const { offerIds } = req.body;
      const userId = req.user.id;

      if (!offerIds || !Array.isArray(offerIds) || offerIds.length === 0) {
        return res.status(400).json({ success: false, error: 'Teklif IDleri listesi gereklidir.' });
      }

      const result = await bulkOfferService.bulkSendOffers(offerIds, userId);

      res.status(202).json({
        success: true,
        message: 'Teklifler gönderim kuyruğuna eklendi.',
        data: result,
      });
    } catch (error) {
      console.error('❌ Bulk send error:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Toplu gönderme sırasında bir hata oluştu.',
      });
    }
  }

  /**
   * Preview PDF
   * GET /api/v1/offers/:id/preview-pdf
   * Feature #2: PDF Oluşturma
   */
  async previewPdf(req, res) {
    try {
      const { id } = req.params;
      const { buffer } = await offerPdfService.generateOfferPdf(id);

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `inline; filename=offer-${id}.pdf`);
      res.send(buffer);
    } catch (error) {
      console.error('❌ Preview PDF error:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'PDF oluşturulurken hata oluştu'
      });
    }
  }

  /**
   * Download PDF
   * GET /api/v1/offers/:id/download-pdf
   */
  async downloadPdf(req, res) {
    try {
      const { id } = req.params;
      const { buffer, filename } = await offerPdfService.generateOfferPdf(id);

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
      res.send(buffer);
    } catch (error) {
      console.error('❌ Download PDF error:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'PDF indirilirken hata oluştu'
      });
    }
  }

  /**
   * Request approval
   * PATCH /api/v1/offers/:id/request-approval
   * Feature #11: Onay Sistemi
   */
  async requestApproval(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const offer = await offerService.requestApproval(id, userId);

      res.json({
        success: true,
        message: 'Onay talebi gönderildi',
        data: offer
      });
    } catch (error) {
      console.error('❌ Request approval error:', error);
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * Approve offer
   * PATCH /api/v1/offers/:id/approve
   * Feature #11: Onay Sistemi
   */
  async approveOffer(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const { notes } = req.body || {};
      const offer = await offerService.approveOffer(id, userId, notes);

      res.json({
        success: true,
        message: 'Teklif onaylandı',
        data: offer
      });
    } catch (error) {
      console.error('❌ Approve offer error:', error);
      res.status(403).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * Reject approval
   * PATCH /api/v1/offers/:id/reject-approval
   * Feature #11: Onay Sistemi
   */
  async rejectApproval(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const { reason } = req.body || {};
      const offer = await offerService.rejectApproval(id, userId, reason);

      res.json({
        success: true,
        message: 'Teklif onayı reddedildi',
        data: offer
      });
    } catch (error) {
      console.error('❌ Reject approval error:', error);
      res.status(403).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * Manually expire offer
   * PATCH /api/v1/offers/:id/expire
   * Feature #12: Geçerlilik Süresi
   */
  async expireOffer(req, res) {
    try {
      const { id } = req.params;
      const offer = await expirationService.expireOffer(id);

      res.json({
        success: true,
        message: 'Teklif süresi doldu olarak işaretlendi',
        data: offer
      });
    } catch (error) {
      console.error('❌ Expire offer error:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * Extend offer expiration
   * PATCH /api/v1/offers/:id/extend
   * Feature #12: Geçerlilik Süresi
   */
  async extendExpiration(req, res) {
    try {
      const { id } = req.params;
      const { days } = req.body || {};
      const offer = await expirationService.extendOfferExpiration(id, days || 7);

      res.json({
        success: true,
        message: `Teklif geçerlilik süresi ${days || 7} gün uzatıldı`,
        data: offer
      });
    } catch (error) {
      console.error('❌ Extend offer expiration error:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
}

module.exports = new OfferController();
