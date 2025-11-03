const { getCacheStats, clearAllCache, invalidateJobCache } = require('../services/cacheService');

/**
 * Get cache statistics
 * GET /api/v1/cache/stats
 */
async function getCacheStatistics(req, res) {
  try {
    const stats = await getCacheStats();

    res.json({
      success: true,
      data: stats,
      message: 'Cache istatistikleri başarıyla alındı'
    });
  } catch (error) {
    console.error('Cache stats error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Cache istatistikleri alınırken hata oluştu'
    });
  }
}

/**
 * Clear all cache (ADMIN only)
 * DELETE /api/v1/cache/clear
 */
async function clearCache(req, res) {
  try {
    const deleted = await clearAllCache();

    res.json({
      success: true,
      message: `${deleted} cache kaydı temizlendi`,
      deletedCount: deleted
    });
  } catch (error) {
    console.error('Cache clear error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Cache temizlenirken hata oluştu'
    });
  }
}

/**
 * Invalidate cache for specific job posting
 * DELETE /api/v1/cache/job/:jobPostingId
 */
async function invalidateJobPostingCache(req, res) {
  try {
    const { jobPostingId } = req.params;

    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();
    const jobPosting = await prisma.jobPosting.findFirst({
      where: { id: jobPostingId, organizationId: req.organizationId }
    });

    if (!jobPosting) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'İş ilanı bulunamadı'
      });
    }

    const deleted = await invalidateJobCache(jobPostingId);

    res.json({
      success: true,
      message: `${deleted} cache kaydı temizlendi`,
      deletedCount: deleted,
      jobPostingId
    });
  } catch (error) {
    console.error('Cache invalidate error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Cache invalidate edilirken hata oluştu'
    });
  }
}

module.exports = {
  getCacheStatistics,
  clearCache,
  invalidateJobPostingCache
};
