const analyticsService = require('../services/analyticsOfferService');

class AnalyticsOfferController {
  async getOverview(req, res) {
    try {
      const overview = await analyticsService.getOverview(req.query);
      res.json({ success: true, data: overview });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  async getAcceptanceRate(req, res) {
    try {
      const rate = await analyticsService.getAcceptanceRate(req.query);
      res.json({ success: true, data: rate });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  async getAverageResponseTime(req, res) {
    try {
      const time = await analyticsService.getAverageResponseTime(req.query);
      res.json({ success: true, data: time });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  async getByDepartment(req, res) {
    try {
      const stats = await analyticsService.getByDepartment(req.query);
      res.json({ success: true, data: stats });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
}

module.exports = new AnalyticsOfferController();
