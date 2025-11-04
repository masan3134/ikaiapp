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
const { ROLE_GROUPS } = require('../constants/roles');

const router = express.Router();

// All analytics routes require ANALYTICS_VIEWERS role (SUPER_ADMIN, ADMIN, MANAGER)
const analyticsViewers = [authenticateToken, enforceOrganizationIsolation, authorize(ROLE_GROUPS.ANALYTICS_VIEWERS)];

router.get('/summary', ...analyticsViewers, getSummary);

router.get('/time-to-hire', ...analyticsViewers, getTimeToHire);

router.get('/funnel', ...analyticsViewers, getFunnel);

router.get('/score-distribution', ...analyticsViewers, getScoreDistribution);

router.get('/top-jobs', ...analyticsViewers, getTopJobs);

module.exports = router;
