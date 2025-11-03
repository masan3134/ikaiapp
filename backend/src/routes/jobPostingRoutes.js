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
const { authorize } = require('../middleware/authorize');
const { ROLE_GROUPS } = require('../constants/roles');

const router = express.Router();

// HR Managers middleware (HR operations)
const hrManagers = [authenticateToken, enforceOrganizationIsolation, authorize(ROLE_GROUPS.HR_MANAGERS)];

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
router.get('/', hrManagers, getAllJobPostings);

router.post('/', hrManagers, jobPostingValidation, createJobPosting);

router.get('/:id', hrManagers, getJobPostingById);

router.put('/:id', hrManagers, jobPostingValidation, updateJobPosting);

router.delete('/:id', hrManagers, deleteJobPosting);

router.get('/export/xlsx', hrManagers, exportJobPostingsXLSX);
router.get('/export/csv', hrManagers, exportJobPostingsCSV);

module.exports = router;
