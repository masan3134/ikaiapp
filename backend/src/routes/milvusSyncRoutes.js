const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { getMilvusSyncService } = require('../services/milvusSyncService');

router.get('/health', authenticateToken, async (req, res) => {
  try {
    const milvus = await getMilvusSyncService();
    const stats = await milvus.getSyncStats();
    res.json({ success: true, status: 'connected', stats });
  } catch (error) {
    res.status(503).json({ success: false, error: error.message });
  }
});

router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const milvus = await getMilvusSyncService();
    const stats = await milvus.getSyncStats();
    res.json({ success: true, stats });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
