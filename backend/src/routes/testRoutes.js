const express = require('express');
const { body } = require('express-validator');
const {
  createTest,
  sendTestEmail,
  getAllTests,
  getPublicTest,
  submitPublicTest,
  getTestSubmissions,
  checkAttempts
} = require('../controllers/testController');
const { authenticateToken } = require('../middleware/auth');
const { validateRequest } = require('../middleware/validationMiddleware');

const router = express.Router();

// Auth required endpoints
router.get('/',
  authenticateToken,
  getAllTests
);

router.post('/generate',
  authenticateToken,
  [
    body('jobPostingId').isUUID().withMessage('Geçerli job posting ID gereklidir'),
    body('analysisId').optional().isUUID().withMessage('Geçerli analysis ID gereklidir')
  ],
  validateRequest,
  createTest
);

router.post('/:testId/send-email',
  authenticateToken,
  [
    body('recipientEmail').isEmail().withMessage('Geçerli email gereklidir')
  ],
  validateRequest,
  sendTestEmail
);

// Get submissions by candidate email (query param) - MUST BE BEFORE /:testId/submissions
router.get('/submissions',
  authenticateToken,
  getTestSubmissions
);

router.get('/:testId/submissions',
  authenticateToken,
  getTestSubmissions
);

// Public endpoints (no auth)
router.get('/public/:token', getPublicTest);

router.post('/public/:token/check-attempts',
  [
    body('candidateEmail').isEmail().withMessage('Geçerli email gereklidir')
  ],
  validateRequest,
  checkAttempts
);

router.post('/public/:token/submit',
  [
    body('candidateEmail').isEmail().withMessage('Geçerli email gereklidir'),
    body('answers').isArray({ min: 10, max: 10 }).withMessage('10 cevap gereklidir'),
    body('startedAt').isISO8601().withMessage('Geçerli tarih gereklidir')
  ],
  validateRequest,
  submitPublicTest
);

module.exports = router;
