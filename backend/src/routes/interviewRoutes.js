const express = require('express');
const router = express.Router();
const interviewController = require('../controllers/interviewController');
const { authenticateToken } = require('../middleware/auth');
const { enforceOrganizationIsolation } = require('../middleware/organizationIsolation');

router.use(authenticateToken);
router.use(enforceOrganizationIsolation);

// ============================================
// WIZARD ENDPOINTS
// ============================================

// Step 1: Get recent candidates for selection
router.get('/candidates/recent', interviewController.getRecentCandidates);

// Step 2: Check scheduling conflicts
router.post('/check-conflicts', interviewController.checkConflicts);

// ============================================
// CRUD ENDPOINTS
// ============================================

// Get interview statistics
router.get('/stats', interviewController.getStats);

// Get all interviews (with filters)
router.get('/', interviewController.getInterviews);

// Get single interview
router.get('/:id', interviewController.getInterviewById);

// Create new interview
router.post('/', interviewController.createInterview);

// Update interview status
router.patch('/:id/status', interviewController.updateStatus);

// Delete interview
router.delete('/:id', interviewController.deleteInterview);

module.exports = router;
