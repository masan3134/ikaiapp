/**
 * Winston Logger Configuration
 *
 * IMPROVEMENT #1: Comprehensive Error Logging
 * Replaces console.log/error with structured logging
 *
 * Features:
 * - Structured JSON logging
 * - Separate files for errors/combined logs
 * - Console output in development
 * - Log rotation (daily, max 14 days)
 * - Request ID tracking
 * - Error stack traces
 *
 * Created: 2025-10-27
 */

const winston = require('winston');
const path = require('path');

// Log format configuration
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
);

// Console format for development (human-readable)
const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: 'HH:mm:ss' }),
  winston.format.printf(({ timestamp, level, message, requestId, ...meta }) => {
    let log = `${timestamp} [${level}]`;

    if (requestId) {
      log += ` [${requestId}]`;
    }

    log += `: ${message}`;

    // Add metadata if exists
    if (Object.keys(meta).length > 0) {
      log += ` ${JSON.stringify(meta)}`;
    }

    return log;
  })
);

// Create logs directory if not exists
const logsDir = path.join(__dirname, '../../logs');
const fs = require('fs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Create logger instance
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: logFormat,
  defaultMeta: { service: 'ikai-backend' },
  transports: [
    // Error log file (only errors)
    new winston.transports.File({
      filename: path.join(logsDir, 'error.log'),
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),

    // Combined log file (all levels)
    new winston.transports.File({
      filename: path.join(logsDir, 'combined.log'),
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
  ],
});

// Add console transport in development
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: consoleFormat,
  }));
}

// Helper methods for common log patterns
logger.logRequest = (req, message, meta = {}) => {
  logger.info(message, {
    requestId: req.id,
    method: req.method,
    path: req.path,
    userId: req.user?.id,
    ...meta
  });
};

logger.logError = (error, req = null, meta = {}) => {
  const errorLog = {
    message: error.message,
    stack: error.stack,
    ...meta
  };

  if (req) {
    errorLog.requestId = req.id;
    errorLog.method = req.method;
    errorLog.path = req.path;
    errorLog.userId = req.user?.id;
  }

  logger.error('Error occurred', errorLog);
};

logger.logAnalysis = (analysisId, status, meta = {}) => {
  logger.info('Analysis update', {
    analysisId,
    status,
    ...meta
  });
};

logger.logAuth = (action, email, success, meta = {}) => {
  logger.info('Auth event', {
    action,
    email,
    success,
    ...meta
  });
};

// Export logger
module.exports = logger;
