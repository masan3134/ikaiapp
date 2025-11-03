/**
 * Error Logging Controller
 *
 * MANDATORY FEATURE: Error Logging API
 * Handles error submissions from frontend and provides error dashboard
 *
 * Created: 2025-10-27
 */

const logger = require('../utils/logger');
const errorLoggingService = require('../services/errorLoggingService');

/**
 * Log error from frontend
 * POST /api/v1/errors/log
 * Public endpoint (no auth required) - for capturing user errors
 */
async function logFrontendError(req, res) {
  try {
    const { message, stack, url, componentStack, userAgent, metadata } = req.body;

    // Validate
    if (!message) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Error message is required'
      });
    }

    // Log error
    const errorId = await errorLoggingService.logError({
      source: 'frontend',
      level: metadata?.level || 'error',
      message,
      stack,
      url,
      componentStack,
      userAgent: userAgent || req.headers['user-agent'],
      userId: req.user?.id || null,
      organizationId: req.organizationId || null,
      requestId: req.id,
      metadata
    });

    logger.info('Frontend error logged', {
      errorId,
      message: message.substring(0, 100)
    });

    res.json({
      success: true,
      errorId,
      message: 'Error logged successfully'
    });
  } catch (error) {
    logger.error('Failed to log frontend error', { error: error.message });
    res.status(500).json({
      error: 'Failed to log error',
      requestId: req.id
    });
  }
}

/**
 * Get recent errors
 * GET /api/v1/errors/recent?limit=50
 * Requires ADMIN role
 */
async function getRecentErrors(req, res) {
  try {
    const limit = parseInt(req.query.limit) || 50;

    const errors = await errorLoggingService.getRecentErrors(limit);

    res.json({
      errors,
      total: errors.length
    });
  } catch (error) {
    logger.logError(error, req, { controller: 'errorLogging', action: 'getRecent' });
    res.status(500).json({
      error: 'Failed to fetch errors',
      requestId: req.id
    });
  }
}

/**
 * Get error statistics
 * GET /api/v1/errors/stats
 * Requires ADMIN role
 */
async function getErrorStats(req, res) {
  try {
    const { startDate, endDate } = req.query;

    const stats = await errorLoggingService.getErrorStats(startDate, endDate);

    res.json(stats);
  } catch (error) {
    logger.logError(error, req, { controller: 'errorLogging', action: 'getStats' });
    res.status(500).json({
      error: 'Failed to fetch error stats',
      requestId: req.id
    });
  }
}

/**
 * Clean old error logs
 * POST /api/v1/errors/cleanup
 * Requires ADMIN role
 */
async function cleanupOldLogs(req, res) {
  try {
    const cleaned = await errorLoggingService.cleanOldLogs();

    res.json({
      success: true,
      filesDeleted: cleaned,
      message: `Cleaned ${cleaned} old log files (>30 days)`
    });
  } catch (error) {
    logger.logError(error, req, { controller: 'errorLogging', action: 'cleanup' });
    res.status(500).json({
      error: 'Failed to cleanup logs',
      requestId: req.id
    });
  }
}

module.exports = {
  logFrontendError,
  getRecentErrors,
  getErrorStats,
  cleanupOldLogs
};
