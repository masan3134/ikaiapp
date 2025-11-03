const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { authorize } = require('../middleware/authorize');
const { ROLES } = require('../constants/roles');
const { getAllQueueStats, getSystemHealth, cleanupOldJobs } = require('../utils/queueMonitor');

/**
 * Queue Monitoring Routes
 * Admin-only endpoints for monitoring BullMQ queues
 */

// Admin-only middleware
const adminOnly = [authenticateToken, authorize([ROLES.ADMIN, ROLES.SUPER_ADMIN])];

// Get all queue statistics
router.get('/stats', adminOnly, async (req, res) => {
  try {
    const stats = await getAllQueueStats();
    res.json({ success: true, stats });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get queue stats', message: error.message });
  }
});

// Get comprehensive system health
router.get('/health', adminOnly, async (req, res) => {
  try {
    const health = await getSystemHealth();
    res.json({ success: true, ...health });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get system health', message: error.message });
  }
});

// Clean old jobs (maintenance)
router.post('/cleanup', adminOnly, async (req, res) => {
  try {
    const results = await cleanupOldJobs();
    res.json({ success: true, results });
  } catch (error) {
    res.status(500).json({ error: 'Failed to cleanup jobs', message: error.message });
  }
});

module.exports = router;
