const revisionService = require('../services/revisionService');

class RevisionController {
  async getRevisions(req, res) {
    try {
      const { offerId } = req.params;
      const revisions = await revisionService.getRevisions(offerId, req.organizationId);
      res.json({ success: true, data: revisions });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
}

module.exports = new RevisionController();
