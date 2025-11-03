/**
 * Error Logging Routes
 *
 * MANDATORY FEATURE: Error Logging API
 * Routes for error submission and dashboard
 *
 * Created: 2025-10-27
 */

const express = require('express');
const { body } = require('express-validator');
const {
  logFrontendError,
  getRecentErrors,
  getErrorStats,
  cleanupOldLogs
} = require('../controllers/errorLoggingController');
const { authenticateToken } = require('../middleware/auth');
const { authorize } = require('../middleware/authorize');
const { validateRequest } = require('../middleware/validationMiddleware');

const router = express.Router();

// Public endpoint - log errors from frontend (no auth required)
router.post('/log',
  [
    body('message').notEmpty().withMessage('Error message is required'),
    body('stack').optional().isString(),
    body('url').optional().isString(),
    body('componentStack').optional().isString(),
    body('userAgent').optional().isString(),
    body('metadata').optional().isObject()
  ],
  validateRequest,
  logFrontendError
);

// ADMIN-only endpoints for error dashboard
router.get('/recent',
  authenticateToken,
  authorize(['ADMIN']),
  getRecentErrors
);

router.get('/stats',
  authenticateToken,
  authorize(['ADMIN']),
  getErrorStats
);

router.post('/cleanup',
  authenticateToken,
  authorize(['ADMIN']),
  cleanupOldLogs
);

module.exports = router;
