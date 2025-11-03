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
const { upload, handleMulterError } = require('../middleware/upload');
const { trackCvUpload } = require('../middleware/usageTracking');

const router = express.Router();

// Get all candidates for current user
router.get('/', authenticateToken, enforceOrganizationIsolation, getAllCandidates);

router.post('/check-duplicate', authenticateToken, enforceOrganizationIsolation, checkDuplicateFile);

router.post(
  '/upload',
  authenticateToken,
  enforceOrganizationIsolation,
  trackCvUpload,
  upload.single('cv'),
  handleMulterError,
  uploadCV
);

router.get('/:id', authenticateToken, enforceOrganizationIsolation, getCandidateById);

router.delete('/:id', authenticateToken, enforceOrganizationIsolation, deleteCandidate);

router.get('/export/xlsx', authenticateToken, enforceOrganizationIsolation, exportCandidatesXLSX);
router.get('/export/csv', authenticateToken, enforceOrganizationIsolation, exportCandidatesCSV);

module.exports = router;
