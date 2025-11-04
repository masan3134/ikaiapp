const express = require('express');
const { body } = require('express-validator');
const rateLimit = require('express-rate-limit');
const {
  register,
  login,
  logout,
  me,
  refreshToken
} = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Rate limiter for auth endpoints to prevent brute-force attacks
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs (increased for testing)
  message: {
    error: 'Too Many Requests',
    message: 'Çok fazla giriş denemesi yapıldı. Lütfen 15 dakika sonra tekrar deneyin.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Validation rules
const registerValidation = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Invalid email format')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
];

const loginValidation = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Invalid email format')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

// Public routes (with rate limiting)
router.post('/register', authLimiter, registerValidation, register);
router.post('/login', authLimiter, loginValidation, login);

// Protected routes (require authentication)
router.post('/logout', authenticateToken, logout);
router.get('/me', authenticateToken, me);
router.post('/refresh', authenticateToken, refreshToken);

module.exports = router;
