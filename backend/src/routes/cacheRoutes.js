const express = require('express');
const {
  getCacheStatistics,
  clearCache,
  invalidateJobPostingCache
} = require('../controllers/cacheController');
const { authenticateToken } = require('../middleware/auth');
const { authorize } = require('../middleware/authorize');
const { enforceOrganizationIsolation } = require('../middleware/organizationIsolation');
const { ROLES, ROLE_GROUPS } = require('../constants/roles');

const router = express.Router();

// ADMIN+ middleware chain
const adminOnly = [authenticateToken, enforceOrganizationIsolation, authorize([ROLES.ADMIN, ROLES.SUPER_ADMIN])];

// HR_MANAGERS middleware chain (for job posting invalidation)
const hrManagers = [authenticateToken, enforceOrganizationIsolation, authorize(ROLE_GROUPS.HR_MANAGERS)];

// Get cache statistics (ADMIN+ only - system metrics)
router.get('/stats', adminOnly, getCacheStatistics);

// Clear all cache (ADMIN+ only)
router.delete('/clear', adminOnly, clearCache);

// Invalidate job posting cache (HR_MANAGERS - includes ADMIN/MANAGER/RECRUITER)
router.delete('/job/:jobPostingId', hrManagers, invalidateJobPostingCache);

module.exports = router;
