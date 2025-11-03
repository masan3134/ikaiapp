/**
 * Chat Rate Limiter
 * Prevents abuse: 10 messages per minute per user
 */

const rateLimit = require('express-rate-limit');

const chatRateLimiter = rateLimit({
  windowMs: 60000,  // 1 minute
  max: 10,          // 10 requests
  message: {
    error: 'Rate limit exceeded',
    message: 'Dakikada maksimum 10 sohbet mesajı gönderebilirsiniz. Lütfen bekleyin.',
    retryAfter: 60
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.user?.userId || req.ip,
  skip: (req) => process.env.RATE_LIMITER_ENABLED !== 'true'
});

module.exports = { chatRateLimiter };
