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
const { enforceOrganizationIsolation } = require('../middleware/organizationIsolation');
const { authorize } = require('../middleware/authorize');
const { ROLE_GROUPS } = require('../constants/roles');
const { validateRequest } = require('../middleware/validationMiddleware');

const router = express.Router();

// HR Managers middleware (test operations)
const hrManagers = [authenticateToken, enforceOrganizationIsolation, authorize(ROLE_GROUPS.HR_MANAGERS)];

// Auth required endpoints
router.get('/',
  hrManagers,
  getAllTests
);

router.post('/generate',
  hrManagers,
  [
    body('jobPostingId').isUUID().withMessage('Geçerli job posting ID gereklidir'),
    body('analysisId').optional().isUUID().withMessage('Geçerli analysis ID gereklidir')
  ],
  validateRequest,
  createTest
);

router.post('/:testId/send-email',
  hrManagers,
  [
    body('recipientEmail').isEmail().withMessage('Geçerli email gereklidir')
  ],
  validateRequest,
  sendTestEmail
);

router.get('/submissions',
  hrManagers,
  getTestSubmissions
);

router.get('/:testId/submissions',
  hrManagers,
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
