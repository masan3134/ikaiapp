/**
 * Analytics Controller
 *
 * NEW FEATURE #1: Advanced Analytics Dashboard
 * Business logic for HR metrics and analytics
 *
 * Created: 2025-10-27
 */

const logger = require('../utils/logger');
const analyticsService = require('../services/analyticsService');

/**
 * Get summary analytics
 * GET /api/v1/analytics/summary
 */
async function getSummary(req, res) {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;
    const organizationId = req.organizationId;

    logger.logRequest(req, 'Analytics summary requested');

    const summary = await analyticsService.calculateSummary(userId, userRole, organizationId);

    res.json(summary);
  } catch (error) {
    logger.logError(error, req, { controller: 'analytics', action: 'getSummary' });
    res.status(500).json({
      error: 'Failed to fetch analytics summary',
      requestId: req.id
    });
  }
}

/**
 * Get time-to-hire analytics
 * GET /api/v1/analytics/time-to-hire?startDate=&endDate=&department=
 */
async function getTimeToHire(req, res) {
  try {
    const { startDate, endDate, department } = req.query;
    const userId = req.user.id;
    const userRole = req.user.role;
    const organizationId = req.organizationId;

    logger.logRequest(req, 'Time-to-hire analytics requested', { department });

    const filters = {
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      department,
      organizationId
    };

    const data = await analyticsService.calculateTimeToHire(userId, userRole, filters);

    res.json(data);
  } catch (error) {
    logger.logError(error, req, { controller: 'analytics', action: 'getTimeToHire' });
    res.status(500).json({
      error: 'Failed to fetch time-to-hire analytics',
      requestId: req.id
    });
  }
}

/**
 * Get candidate funnel data
 * GET /api/v1/analytics/funnel?startDate=&endDate=
 */
async function getFunnel(req, res) {
  try {
    const { startDate, endDate } = req.query;
    const userId = req.user.id;
    const userRole = req.user.role;
    const organizationId = req.organizationId;

    logger.logRequest(req, 'Funnel analytics requested');

    const filters = {
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      organizationId
    };

    const funnel = await analyticsService.generateFunnelData(userId, userRole, filters);

    res.json(funnel);
  } catch (error) {
    logger.logError(error, req, { controller: 'analytics', action: 'getFunnel' });
    res.status(500).json({
      error: 'Failed to fetch funnel data',
      requestId: req.id
    });
  }
}

/**
 * Get score distribution histogram
 * GET /api/v1/analytics/score-distribution?jobPostingId=
 */
async function getScoreDistribution(req, res) {
  try {
    const { jobPostingId } = req.query;
    const userId = req.user.id;
    const userRole = req.user.role;
    const organizationId = req.organizationId;

    logger.logRequest(req, 'Score distribution requested', { jobPostingId });

    const distribution = await analyticsService.getScoreStats(userId, userRole, jobPostingId, organizationId);

    res.json(distribution);
  } catch (error) {
    logger.logError(error, req, { controller: 'analytics', action: 'getScoreDistribution' });
    res.status(500).json({
      error: 'Failed to fetch score distribution',
      requestId: req.id
    });
  }
}

/**
 * Get top performing job postings
 * GET /api/v1/analytics/top-jobs?limit=10
 */
async function getTopJobs(req, res) {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const userId = req.user.id;
    const userRole = req.user.role;
    const organizationId = req.organizationId;

    logger.logRequest(req, 'Top jobs requested', { limit });

    const topJobs = await analyticsService.getTopPerformingJobs(userId, userRole, limit, organizationId);

    res.json(topJobs);
  } catch (error) {
    logger.logError(error, req, { controller: 'analytics', action: 'getTopJobs' });
    res.status(500).json({
      error: 'Failed to fetch top jobs',
      requestId: req.id
    });
  }
}

module.exports = {
  getSummary,
  getTimeToHire,
  getFunnel,
  getScoreDistribution,
  getTopJobs
};
