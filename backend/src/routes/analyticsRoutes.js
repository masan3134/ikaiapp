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
const { enforceOrganizationIsolation } = require('../middleware/organizationIsolation');
const { authorize } = require('../middleware/authorize');

const router = express.Router();

router.get('/summary', authenticateToken, enforceOrganizationIsolation, getSummary);

router.get('/time-to-hire', authenticateToken, enforceOrganizationIsolation, authorize(['ADMIN', 'MANAGER']), getTimeToHire);

router.get('/funnel', authenticateToken, enforceOrganizationIsolation, authorize(['ADMIN', 'MANAGER']), getFunnel);

router.get('/score-distribution', authenticateToken, enforceOrganizationIsolation, getScoreDistribution);

router.get('/top-jobs', authenticateToken, enforceOrganizationIsolation, getTopJobs);

module.exports = router;
