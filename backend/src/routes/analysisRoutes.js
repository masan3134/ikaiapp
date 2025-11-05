const express = require('express');
const { body } = require('express-validator');
const {
  createAnalysis,
  getAllAnalyses,
  getAnalysisById,
  deleteAnalysis,
  addCandidatesToAnalysis,
  sendCandidateFeedback
} = require('../controllers/analysisController');
const {
  exportAnalysisToExcel,
  exportAnalysisToCSV,
  exportAnalysisToHTML
} = require('../controllers/exportController');
const {
  sendAnalysisEmail
} = require('../controllers/emailController');
const { authenticateToken } = require('../middleware/auth');
const { enforceOrganizationIsolation } = require('../middleware/organizationIsolation');
const { authorize } = require('../middleware/authorize');
const { ROLE_GROUPS } = require('../constants/roles');
const { validateRequest } = require('../middleware/validationMiddleware');
const { trackAnalysisUsage } = require('../middleware/usageTracking');

const router = express.Router();

// HR Managers middleware (HR operations)
const hrManagers = [authenticateToken, enforceOrganizationIsolation, authorize(ROLE_GROUPS.HR_MANAGERS)];

// Admin only middleware
const adminOnly = [authenticateToken, enforceOrganizationIsolation, authorize(ROLE_GROUPS.ADMINS)];

// Create new analysis
router.post('/',
  authenticateToken,
  enforceOrganizationIsolation,
  authorize(ROLE_GROUPS.HR_MANAGERS),
  trackAnalysisUsage,
  [
    body('jobPostingId').isUUID().withMessage('Gecerli bir is ilani IDsi gereklidir.'),
    body('candidateIds').isArray({ min: 1 }).withMessage('En az bir aday secilmelidir.'),
    body('candidateIds.*').isUUID().withMessage('Aday IDleri gecerli bir formatta olmalidir.')
  ],
  validateRequest,
  createAnalysis
);

// Get all analyses for current user (ALL users can view, read-only for USER role)
router.get('/', [authenticateToken, enforceOrganizationIsolation], getAllAnalyses);

// Get analysis by ID with results (ALL users can view)
router.get('/:id', [authenticateToken, enforceOrganizationIsolation], getAnalysisById);

router.delete('/:id', adminOnly, deleteAnalysis);

router.post('/:id/add-candidates',
  hrManagers,
  [
    body('candidateIds').isArray({ min: 1 }).withMessage('En az bir aday secilmelidir.'),
    body('candidateIds.*').isUUID().withMessage('Aday IDleri gecerli bir formatta olmalidir.')
  ],
  validateRequest,
  addCandidatesToAnalysis
);

router.get('/:id/export/xlsx', hrManagers, exportAnalysisToExcel);
router.get('/:id/export/csv', hrManagers, exportAnalysisToCSV);
router.get('/:id/export/html', hrManagers, exportAnalysisToHTML);

router.post('/:id/send-email',
  hrManagers,
  [
    body('recipientEmail').isEmail().withMessage('Geçerli bir email adresi giriniz'),
    body('formats').isArray({ min: 1 }).withMessage('En az bir format seçilmelidir')
  ],
  validateRequest,
  sendAnalysisEmail
);

router.post('/:id/send-feedback',
  hrManagers,
  [
    body('scoreThreshold').optional().isInt({ min: 0, max: 100 }).withMessage('Puan eşiği 0-100 arasında olmalıdır'),
    body('candidateIds').optional().isArray().withMessage('Aday IDleri dizi formatında olmalıdır'),
    body('candidateIds.*').optional().isUUID().withMessage('Aday IDleri geçerli UUID formatında olmalıdır')
  ],
  validateRequest,
  sendCandidateFeedback
);

// AI Chat routes (analysis-specific)
const analysisChatRoutes = require('./analysisChatRoutes');
router.use('/', analysisChatRoutes);

module.exports = router;
