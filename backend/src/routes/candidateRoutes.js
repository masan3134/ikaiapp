const express = require('express');
const {
  getAllCandidates,
  checkDuplicateFile,
  uploadCV,
  getCandidateById,
  deleteCandidate
} = require('../controllers/candidateController');
const {
  exportCandidatesXLSX,
  exportCandidatesCSV
} = require('../controllers/bulkExportController');
const { authenticateToken } = require('../middleware/auth');
const { enforceOrganizationIsolation } = require('../middleware/organizationIsolation');
const { authorize } = require('../middleware/authorize');
const { ROLE_GROUPS } = require('../constants/roles');
const { upload, handleMulterError } = require('../middleware/upload');
const { trackCvUpload } = require('../middleware/usageTracking');

const router = express.Router();

// HR Managers middleware (HR operations)
const hrManagers = [authenticateToken, enforceOrganizationIsolation, authorize(ROLE_GROUPS.HR_MANAGERS)];

// Admin only middleware
const adminOnly = [authenticateToken, enforceOrganizationIsolation, authorize(ROLE_GROUPS.ADMINS)];

// Get all candidates for current user
router.get('/', hrManagers, getAllCandidates);

router.post('/check-duplicate', hrManagers, checkDuplicateFile);

router.post(
  '/upload',
  authenticateToken,
  enforceOrganizationIsolation,
  authorize(ROLE_GROUPS.HR_MANAGERS),
  trackCvUpload,
  upload.single('cv'),
  handleMulterError,
  uploadCV
);

router.get('/:id', hrManagers, getCandidateById);

router.delete('/:id', adminOnly, deleteCandidate);

router.get('/export/xlsx', hrManagers, exportCandidatesXLSX);
router.get('/export/csv', hrManagers, exportCandidatesCSV);

module.exports = router;
