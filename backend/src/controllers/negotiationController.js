const negotiationService = require('../services/negotiationService');

class NegotiationController {
  async createNegotiation(req, res) {
    try {
      const { offerId } = req.params;
      const negotiation = await negotiationService.createNegotiation(offerId, req.body, 'company', req.user.id);
      res.status(201).json({ success: true, data: negotiation });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  async getNegotiations(req, res) {
    try {
      const { offerId } = req.params;
      const negotiations = await negotiationService.getNegotiations(offerId);
      res.json({ success: true, data: negotiations });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  async respondToNegotiation(req, res) {
    try {
      const { id } = req.params;
      const negotiation = await negotiationService.respondToNegotiation(id, req.body, req.user.id);
      res.json({ success: true, data: negotiation });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
}

module.exports = new NegotiationController();
