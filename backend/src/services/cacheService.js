const Redis = require('ioredis');
const crypto = require('crypto');
const logger = require('../utils/logger'); // IMPROVEMENT #5: Use Winston logger

// Redis client
const redis = new Redis({
  host: process.env.REDIS_HOST || 'redis',
  port: process.env.REDIS_PORT || 6379,
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  }
});

redis.on('connect', () => {
  logger.info('✅ Redis cache service connected');
});

redis.on('error', (err) => {
  logger.error('❌ Redis cache error:', { error: err.message });
});

/**
 * Generate cache key for Gemini analysis
 * @param {string} jobPostingId
 * @param {string[]} candidateIds
 * @returns {string}
 */
function generateCacheKey(jobPostingId, candidateIds) {
  // Sort candidate IDs for consistent hashing
  const sortedIds = [...candidateIds].sort();
  const idsHash = crypto
    .createHash('md5')
    .update(sortedIds.join(','))
    .digest('hex')
    .substring(0, 8);

  return `gemini:analysis:${jobPostingId}:${idsHash}`;
}

/**
 * Get cached analysis results
 * @param {string} jobPostingId
 * @param {string[]} candidateIds
 * @returns {Promise<object|null>}
 */
async function getCachedAnalysis(jobPostingId, candidateIds) {
  try {
    const cacheKey = generateCacheKey(jobPostingId, candidateIds);
    const cached = await redis.get(cacheKey);

    if (cached) {
      logger.info(`🎯 Cache HIT`, { cacheKey });
      return JSON.parse(cached);
    }

    logger.info(`❌ Cache MISS`, { cacheKey });
    return null;
  } catch (error) {
    logger.warn('⚠️  Cache read error', { error: error.message });
    return null; // Fail gracefully
  }
}

/**
 * Store analysis results in cache
 * @param {string} jobPostingId
 * @param {string[]} candidateIds
 * @param {object} results
 * @param {number} ttl - Time to live in seconds (default: 7 days)
 * @returns {Promise<void>}
 */
async function setCachedAnalysis(jobPostingId, candidateIds, results, ttl = 7 * 24 * 60 * 60) {
  try {
    const cacheKey = generateCacheKey(jobPostingId, candidateIds);
    await redis.setex(cacheKey, ttl, JSON.stringify(results));
    logger.info(`💾 Cache SET`, { cacheKey, ttl });
  } catch (error) {
    logger.warn('⚠️  Cache write error', { error: error.message });
    // Don't throw - cache failure shouldn't break the flow
  }
}

/**
 * Invalidate cache for a specific job posting
 * @param {string} jobPostingId
 * @returns {Promise<number>} Number of keys deleted
 */
async function invalidateJobCache(jobPostingId) {
  try {
    const pattern = `gemini:analysis:${jobPostingId}:*`;
    const keys = await redis.keys(pattern);

    if (keys.length > 0) {
      const deleted = await redis.del(...keys);
      logger.info(`🗑️  Invalidated cache entries`, { jobPostingId, deleted });
      return deleted;
    }

    return 0;
  } catch (error) {
    logger.warn('⚠️  Cache invalidation error', { error: error.message });
    return 0;
  }
}

/**
 * Get cache statistics
 * @returns {Promise<object>}
 */
async function getCacheStats() {
  try {
    const keys = await redis.keys('gemini:analysis:*');
    const info = await redis.info('memory');

    // Parse memory usage
    const memoryMatch = info.match(/used_memory_human:(\S+)/);
    const memoryUsed = memoryMatch ? memoryMatch[1] : 'N/A';

    return {
      totalKeys: keys.length,
      memoryUsed,
      keys: keys.slice(0, 10) // First 10 keys
    };
  } catch (error) {
    logger.warn('⚠️  Cache stats error', { error: error.message });
    return { totalKeys: 0, memoryUsed: 'N/A', keys: [] };
  }
}

/**
 * Clear all analysis cache (use with caution!)
 * @returns {Promise<number>}
 */
async function clearAllCache() {
  try {
    const keys = await redis.keys('gemini:analysis:*');
    if (keys.length > 0) {
      const deleted = await redis.del(...keys);
      logger.info(`🗑️  Cleared cache entries`, { deleted });
      return deleted;
    }
    return 0;
  } catch (error) {
    logger.warn('⚠️  Cache clear error', { error: error.message });
    return 0;
  }
}

module.exports = {
  redis,
  getCachedAnalysis,
  setCachedAnalysis,
  invalidateJobCache,
  getCacheStats,
  clearAllCache,
  generateCacheKey
};
