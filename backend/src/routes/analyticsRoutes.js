/**
 * Analytics Routes
 *
 * NEW FEATURE #1: Advanced Analytics Dashboard
 * Provides HR metrics and visualizations
 *
 * Endpoints:
 * - GET /api/v1/analytics/summary - Overall statistics
 * - GET /api/v1/analytics/time-to-hire - Time-to-hire metrics
 * - GET /api/v1/analytics/funnel - Candidate funnel data
 * - GET /api/v1/analytics/score-distribution - Score histogram
 * - GET /api/v1/analytics/top-jobs - Top performing job postings
 *
 * Created: 2025-10-27
 */

const express = require('express');
const {
  getSummary,
  getTimeToHire,
  getFunnel,
  getScoreDistribution,
  getTopJobs
} = require('../controllers/analyticsController');
const { authenticateToken } = require('../middleware/auth');
const { authorize } = require('../middleware/authorize');

const router = express.Router();

// All analytics endpoints require authentication
// Some require ADMIN/MANAGER roles

// Summary (all roles)
router.get('/summary', authenticateToken, getSummary);

// Time-to-hire analytics (ADMIN/MANAGER only)
router.get('/time-to-hire', authenticateToken, authorize(['ADMIN', 'MANAGER']), getTimeToHire);

// Funnel analytics (ADMIN/MANAGER only)
router.get('/funnel', authenticateToken, authorize(['ADMIN', 'MANAGER']), getFunnel);

// Score distribution (all roles)
router.get('/score-distribution', authenticateToken, getScoreDistribution);

// Top performing jobs (all roles)
router.get('/top-jobs', authenticateToken, getTopJobs);

module.exports = router;
