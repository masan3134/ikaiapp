const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { authorize } = require('../middleware/authorize');
const { enforceOrganizationIsolation } = require('../middleware/organizationIsolation');
const { ROLE_GROUPS } = require('../constants/roles');
const { getComprehensiveDashboard } = require('../controllers/comprehensiveDashboardController');

/**
 * Comprehensive Dashboard Routes
 * Single endpoint for all platform metrics
 * Requires HR_MANAGERS role (ADMIN, MANAGER, RECRUITER)
 */

// HR_MANAGERS middleware chain
const hrManagers = [authenticateToken, enforceOrganizationIsolation, authorize(ROLE_GROUPS.HR_MANAGERS)];

router.get('/', hrManagers, getComprehensiveDashboard);

module.exports = router;
