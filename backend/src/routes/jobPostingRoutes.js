const express = require('express');
const { body } = require('express-validator');
const {
  getAllJobPostings,
  createJobPosting,
  getJobPostingById,
  updateJobPosting,
  deleteJobPosting
} = require('../controllers/jobPostingController');
const {
  exportJobPostingsXLSX,
  exportJobPostingsCSV
} = require('../controllers/bulkExportController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Validation rules for creating/updating job postings
const jobPostingValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('İş ilanı başlığı zorunludur')
    .isLength({ min: 3, max: 200 })
    .withMessage('Başlık 3-200 karakter arasında olmalıdır'),
  body('department')
    .trim()
    .notEmpty()
    .withMessage('Departman zorunludur')
    .isLength({ min: 2, max: 100 })
    .withMessage('Departman 2-100 karakter arasında olmalıdır'),
  body('details')
    .trim()
    .notEmpty()
    .withMessage('İş ilanı detayları zorunludur')
    .isLength({ min: 10 })
    .withMessage('Detaylar en az 10 karakter olmalıdır'),
  body('notes')
    .optional()
    .trim()
];

// Get all job postings (user's own or all if admin)
router.get('/', authenticateToken, getAllJobPostings);

// Create new job posting
router.post('/', authenticateToken, jobPostingValidation, createJobPosting);

// Get job posting by ID
router.get('/:id', authenticateToken, getJobPostingById);

// Update job posting (with validation)
router.put('/:id', authenticateToken, jobPostingValidation, updateJobPosting);

// Delete job posting
router.delete('/:id', authenticateToken, deleteJobPosting);

// Export routes
router.get('/export/xlsx', authenticateToken, exportJobPostingsXLSX);
router.get('/export/csv', authenticateToken, exportJobPostingsCSV);

module.exports = router;
