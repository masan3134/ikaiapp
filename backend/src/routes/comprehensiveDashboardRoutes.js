const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { getComprehensiveDashboard } = require('../controllers/comprehensiveDashboardController');

/**
 * Comprehensive Dashboard Routes
 * Single endpoint for all platform metrics
 */

router.get('/', authenticateToken, getComprehensiveDashboard);

module.exports = router;
