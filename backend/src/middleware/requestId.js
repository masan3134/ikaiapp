/**
 * Request ID Middleware
 *
 * IMPROVEMENT #3: Request ID Tracking
 * Adds unique ID to every request for better debugging and tracing
 *
 * Features:
 * - UUID v4 for each request
 * - X-Request-ID response header
 * - Available as req.id for logging
 * - Helps trace errors across microservices
 *
 * Created: 2025-10-27
 */

const { v4: uuidv4 } = require('uuid');

function requestIdMiddleware(req, res, next) {
  // Generate unique request ID
  req.id = uuidv4();

  // Add to response headers (useful for frontend debugging)
  res.setHeader('X-Request-ID', req.id);

  // Continue to next middleware
  next();
}

module.exports = requestIdMiddleware;
