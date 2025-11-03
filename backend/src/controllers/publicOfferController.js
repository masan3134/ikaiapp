const publicOfferService = require('../services/publicOfferService');

class PublicOfferController {

  /**
   * Get offer details by public token
   * GET /api/v1/offers/public/:token
   */
  async getOfferByToken(req, res) {
    try {
      const { token } = req.params;
      const offer = await publicOfferService.getOfferByToken(token);
      res.json({ success: true, data: offer });
    } catch (error) {
      console.error('❌ Get offer by token error:', error);
      res.status(404).json({ success: false, error: error.message });
    }
  }

  /**
   * Accept an offer
   * PATCH /api/v1/offers/public/:token/accept
   */
  async acceptOffer(req, res) {
    try {
      const { token } = req.params;
      await publicOfferService.acceptOffer(token, {}); // Can add IP, user agent etc.
      res.json({ success: true, message: 'Teklif başarıyla kabul edildi' });
    } catch (error) {
      console.error('❌ Accept offer error:', error);
      res.status(400).json({ success: false, error: error.message });
    }
  }

  /**
   * Reject an offer
   * PATCH /api/v1/offers/public/:token/reject
   */
  async rejectOffer(req, res) {
    try {
      const { token } = req.params;
      const { reason } = req.body;

      if (!reason) {
        return res.status(400).json({ success: false, error: 'Reddetme nedeni zorunludur' });
      }

      await publicOfferService.rejectOffer(token, reason);
      res.json({ success: true, message: 'Teklif reddedildi' });
    } catch (error) {
      console.error('❌ Reject offer error:', error);
      res.status(400).json({ success: false, error: error.message });
    }
  }
}

module.exports = new PublicOfferController();