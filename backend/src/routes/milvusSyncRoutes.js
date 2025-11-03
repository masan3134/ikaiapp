const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { authorize } = require('../middleware/authorize');
const { ROLES } = require('../constants/roles');
const { getMilvusSyncService } = require('../services/milvusSyncService');

// ADMIN+ only middleware chain (no org isolation for system services)
const adminOnly = [authenticateToken, authorize([ROLES.ADMIN, ROLES.SUPER_ADMIN])];

router.get('/health', adminOnly, async (req, res) => {
  try {
    const milvus = await getMilvusSyncService();
    const stats = await milvus.getSyncStats();
    res.json({ success: true, status: 'connected', stats });
  } catch (error) {
    res.status(503).json({ success: false, error: error.message });
  }
});

router.get('/stats', adminOnly, async (req, res) => {
  try {
    const milvus = await getMilvusSyncService();
    const stats = await milvus.getSyncStats();
    res.json({ success: true, stats });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
