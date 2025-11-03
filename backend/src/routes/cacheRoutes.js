const express = require('express');
const {
  getCacheStatistics,
  clearCache,
  invalidateJobPostingCache
} = require('../controllers/cacheController');
const { authenticateToken, requireRole } = require('../middleware/auth');

const router = express.Router();

// Get cache statistics (all authenticated users can see)
router.get('/stats', authenticateToken, getCacheStatistics);

// Clear all cache (ADMIN only)
router.delete('/clear',
  authenticateToken,
  requireRole(['ADMIN']),
  clearCache
);

// Invalidate job posting cache (ADMIN/MANAGER)
router.delete('/job/:jobPostingId',
  authenticateToken,
  requireRole(['ADMIN', 'MANAGER']),
  invalidateJobPostingCache
);

module.exports = router;
