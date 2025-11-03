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
const { enforceOrganizationIsolation } = require('../middleware/organizationIsolation');

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
router.get('/', authenticateToken, enforceOrganizationIsolation, getAllJobPostings);

router.post('/', authenticateToken, enforceOrganizationIsolation, jobPostingValidation, createJobPosting);

router.get('/:id', authenticateToken, enforceOrganizationIsolation, getJobPostingById);

router.put('/:id', authenticateToken, enforceOrganizationIsolation, jobPostingValidation, updateJobPosting);

router.delete('/:id', authenticateToken, enforceOrganizationIsolation, deleteJobPosting);

router.get('/export/xlsx', authenticateToken, enforceOrganizationIsolation, exportJobPostingsXLSX);
router.get('/export/csv', authenticateToken, enforceOrganizationIsolation, exportJobPostingsCSV);

module.exports = router;
