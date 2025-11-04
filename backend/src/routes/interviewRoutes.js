const express = require('express');
const router = express.Router();
const interviewController = require('../controllers/interviewController');
const { authenticateToken } = require('../middleware/auth');
const { enforceOrganizationIsolation } = require('../middleware/organizationIsolation');
const { authorize } = require('../middleware/authorize');
const { ROLE_GROUPS } = require('../constants/roles');

// HR Managers middleware (HR operations)
const hrManagers = [authenticateToken, enforceOrganizationIsolation, authorize(ROLE_GROUPS.HR_MANAGERS)];

// Manager+ middleware (for delete operations)
const managerPlus = [authenticateToken, enforceOrganizationIsolation, authorize(ROLE_GROUPS.MANAGERS_PLUS)];

// ============================================
// WIZARD ENDPOINTS
// ============================================

// Step 1: Get recent candidates for selection
router.get('/candidates/recent', hrManagers, interviewController.getRecentCandidates);

// Step 2: Check scheduling conflicts
router.post('/check-conflicts', hrManagers, interviewController.checkConflicts);

// ============================================
// CRUD ENDPOINTS
// ============================================

// Get interview statistics
router.get('/stats', hrManagers, interviewController.getStats);

// Get all interviews (with filters)
router.get('/', hrManagers, interviewController.getInterviews);

// Get single interview
router.get('/:id', hrManagers, interviewController.getInterviewById);

// Create new interview
router.post('/', hrManagers, interviewController.createInterview);

// Update interview status
router.patch('/:id/status', hrManagers, interviewController.updateStatus);

// Delete interview
router.delete('/:id', managerPlus, interviewController.deleteInterview);

module.exports = router;
