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
const { upload, handleMulterError } = require('../middleware/upload');

const router = express.Router();

// Get all candidates for current user
router.get('/', authenticateToken, getAllCandidates);

// Check if file is duplicate
router.post('/check-duplicate', authenticateToken, checkDuplicateFile);

// Upload CV file
router.post(
  '/upload',
  authenticateToken,
  upload.single('cv'),
  handleMulterError,
  uploadCV
);

// Get candidate by ID
router.get('/:id', authenticateToken, getCandidateById);

// Delete candidate
router.delete('/:id', authenticateToken, deleteCandidate);

// Export routes
router.get('/export/xlsx', authenticateToken, exportCandidatesXLSX);
router.get('/export/csv', authenticateToken, exportCandidatesCSV);

module.exports = router;
