const express = require('express');
const { getDashboardStats } = require('../controllers/dashboardController');
const { authenticateToken } = require('../middleware/auth');
const { authorize } = require('../middleware/authorize');

const router = express.Router();

/**
 * GET /api/v1/dashboard/stats
 * Get dashboard statistics
 * Access: ADMIN, MANAGER
 */
router.get(
  '/stats',
  authenticateToken,
  authorize(['ADMIN', 'MANAGER']),
  getDashboardStats
);

module.exports = router;
