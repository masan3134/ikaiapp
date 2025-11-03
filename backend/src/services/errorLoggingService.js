/**
 * Error Logging Service
 *
 * MANDATORY FEATURE: Centralized Error Logging System
 * Captures ALL errors from frontend and backend
 * Stores in structured format for debugging and user reporting
 *
 * Created: 2025-10-27
 * Status: MANDATORY - Must be used in all new features
 */

const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const logger = require('../utils/logger');

const prisma = new PrismaClient();

// Error log directory
const ERROR_LOG_DIR = path.join(__dirname, '../../error-logs');

// Ensure directory exists
if (!fs.existsSync(ERROR_LOG_DIR)) {
  fs.mkdirSync(ERROR_LOG_DIR, { recursive: true });
}

/**
 * Log error to file system (JSONL format)
 * Creates daily log files: error-log-YYYY-MM-DD.jsonl
 *
 * @param {object} errorData - Error information
 * @returns {Promise<string>} Error ID
 */
async function logError(errorData) {
  try {
    const errorId = generateErrorId();
    const timestamp = new Date().toISOString();
    const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

    // Prepare error entry
    const entry = {
      errorId,
      timestamp,
      source: errorData.source || 'unknown', // 'backend', 'frontend'
      level: errorData.level || 'error', // 'error', 'warn', 'fatal'
      message: errorData.message,
      stack: errorData.stack,
      userAgent: errorData.userAgent,
      userId: errorData.userId,
      url: errorData.url,
      method: errorData.method,
      statusCode: errorData.statusCode,
      requestId: errorData.requestId,
      componentStack: errorData.componentStack, // React component stack
      metadata: errorData.metadata || {}
    };

    // Log to Winston (for immediate visibility)
    logger.error('Application error captured', entry);

    // Append to daily JSONL file
    const logFile = path.join(ERROR_LOG_DIR, `error-log-${date}.jsonl`);
    const logLine = JSON.stringify(entry) + '\n';

    fs.appendFileSync(logFile, logLine, 'utf8');

    // Also keep last 100 errors in memory for quick dashboard access
    await saveToRecentErrors(entry);

    return errorId;
  } catch (error) {
    // Fallback: If error logging fails, at least log to Winston
    logger.error('Error logging system failed!', {
      originalError: errorData.message,
      loggingError: error.message
    });
    return 'error-logging-failed';
  }
}

/**
 * Save to recent errors cache (Redis)
 * Keeps last 100 errors for quick dashboard access
 */
async function saveToRecentErrors(entry) {
  try {
    const { redis } = require('./cacheService');

    // Add to Redis list (capped at 100)
    await redis.lpush('app:errors:recent', JSON.stringify(entry));
    await redis.ltrim('app:errors:recent', 0, 99); // Keep only last 100
  } catch (error) {
    // Don't fail if Redis unavailable
    logger.warn('Failed to cache error in Redis', { error: error.message });
  }
}

/**
 * Get recent errors from cache
 * @param {number} limit - Max errors to return
 * @returns {Promise<Array>}
 */
async function getRecentErrors(limit = 50) {
  try {
    const { redis } = require('./cacheService');

    const errors = await redis.lrange('app:errors:recent', 0, limit - 1);
    return errors.map(e => JSON.parse(e));
  } catch (error) {
    logger.warn('Failed to fetch recent errors from Redis', { error: error.message });
    return [];
  }
}

/**
 * Get errors from log files
 * @param {string} date - Date in YYYY-MM-DD format
 * @returns {Promise<Array>}
 */
async function getErrorsFromFile(date) {
  try {
    const logFile = path.join(ERROR_LOG_DIR, `error-log-${date}.jsonl`);

    if (!fs.existsSync(logFile)) {
      return [];
    }

    const content = fs.readFileSync(logFile, 'utf8');
    const lines = content.trim().split('\n').filter(Boolean);

    return lines.map(line => JSON.parse(line));
  } catch (error) {
    logger.error('Failed to read error log file', { error: error.message, date });
    return [];
  }
}

/**
 * Get error statistics
 * @param {string} startDate - Optional start date
 * @param {string} endDate - Optional end date
 * @returns {Promise<object>}
 */
async function getErrorStats(startDate = null, endDate = null) {
  try {
    const recent = await getRecentErrors(100);

    // Group by source
    const bySource = {
      frontend: recent.filter(e => e.source === 'frontend').length,
      backend: recent.filter(e => e.source === 'backend').length
    };

    // Group by level
    const byLevel = {
      error: recent.filter(e => e.level === 'error').length,
      warn: recent.filter(e => e.level === 'warn').length,
      fatal: recent.filter(e => e.level === 'fatal').length
    };

    // Most common errors (group by message)
    const errorCounts = {};
    recent.forEach(e => {
      const msg = e.message.substring(0, 100); // First 100 chars
      errorCounts[msg] = (errorCounts[msg] || 0) + 1;
    });

    const topErrors = Object.entries(errorCounts)
      .map(([message, count]) => ({ message, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return {
      total: recent.length,
      bySource,
      byLevel,
      topErrors,
      lastError: recent[0] || null
    };
  } catch (error) {
    logger.error('Failed to calculate error stats', { error: error.message });
    return {
      total: 0,
      bySource: {},
      byLevel: {},
      topErrors: [],
      lastError: null
    };
  }
}

/**
 * Generate unique error ID
 * Format: ERR-YYYYMMDD-HHMMSS-RAND
 */
function generateErrorId() {
  const now = new Date();
  const date = now.toISOString().split('T')[0].replace(/-/g, '');
  const time = now.toTimeString().split(' ')[0].replace(/:/g, '');
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();

  return `ERR-${date}-${time}-${rand}`;
}

/**
 * Clean old error logs (keep last 30 days)
 */
async function cleanOldLogs() {
  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - 30);

    const files = fs.readdirSync(ERROR_LOG_DIR);
    let cleaned = 0;

    files.forEach(file => {
      if (!file.startsWith('error-log-')) return;

      const datePart = file.replace('error-log-', '').replace('.jsonl', '');
      const fileDate = new Date(datePart);

      if (fileDate < cutoffDate) {
        fs.unlinkSync(path.join(ERROR_LOG_DIR, file));
        cleaned++;
      }
    });

    logger.info('Old error logs cleaned', { cleaned });
    return cleaned;
  } catch (error) {
    logger.warn('Failed to clean old logs', { error: error.message });
    return 0;
  }
}

module.exports = {
  logError,
  getRecentErrors,
  getErrorsFromFile,
  getErrorStats,
  cleanOldLogs,
  generateErrorId
};
