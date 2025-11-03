const { analysisQueue } = require('../queues/analysisQueue');
const { offerQueue } = require('../queues/offerQueue');
const { emailQueue } = require('../queues/emailQueue');
const { testEmailQueue } = require('../queues/testQueue');
const { testGenerationQueue } = require('../queues/testGenerationQueue');
const geminiRateLimiter = require('./geminiRateLimiter');

/**
 * Queue Monitoring Utility
 * Get health status and metrics for all BullMQ queues
 */

async function getQueueStats(queue, queueName) {
  try {
    const [waiting, active, completed, failed, delayed] = await Promise.all([
      queue.getWaitingCount(),
      queue.getActiveCount(),
      queue.getCompletedCount(),
      queue.getFailedCount(),
      queue.getDelayedCount()
    ]);

    return {
      name: queueName,
      waiting,
      active,
      completed,
      failed,
      delayed,
      total: waiting + active + completed + failed + delayed
    };
  } catch (error) {
    return {
      name: queueName,
      error: error.message
    };
  }
}

/**
 * Get all queue statistics
 */
async function getAllQueueStats() {
  const stats = await Promise.all([
    getQueueStats(analysisQueue, 'analysis-processing'),
    getQueueStats(offerQueue, 'offer-processing'),
    getQueueStats(emailQueue, 'generic-email'),
    getQueueStats(testEmailQueue, 'test-email'),
    getQueueStats(testGenerationQueue, 'test-generation')
  ]);

  return stats;
}

/**
 * Get Gemini API rate limiter stats
 */
function getGeminiStats() {
  return geminiRateLimiter.getStats();
}

/**
 * Get comprehensive system health
 */
async function getSystemHealth() {
  const queues = await getAllQueueStats();
  const gemini = getGeminiStats();

  // Calculate totals
  const totals = queues.reduce((acc, q) => {
    if (!q.error) {
      acc.waiting += q.waiting;
      acc.active += q.active;
      acc.completed += q.completed;
      acc.failed += q.failed;
      acc.delayed += q.delayed;
    }
    return acc;
  }, { waiting: 0, active: 0, completed: 0, failed: 0, delayed: 0 });

  return {
    timestamp: new Date().toISOString(),
    queues,
    totals,
    gemini,
    health: {
      status: totals.failed > 100 ? 'degraded' : 'healthy',
      activeJobs: totals.active,
      pendingJobs: totals.waiting,
      failedJobs: totals.failed
    }
  };
}

/**
 * Clean old completed/failed jobs
 */
async function cleanupOldJobs() {
  const results = [];

  for (const { queue, name, keepCompleted, keepFailed } of [
    { queue: analysisQueue, name: 'analysis-processing', keepCompleted: 100, keepFailed: 200 },
    { queue: offerQueue, name: 'offer-processing', keepCompleted: 50, keepFailed: 100 },
    { queue: emailQueue, name: 'generic-email', keepCompleted: 100, keepFailed: 200 },
    { queue: testEmailQueue, name: 'test-email', keepCompleted: 50, keepFailed: 100 },
    { queue: testGenerationQueue, name: 'test-generation', keepCompleted: 50, keepFailed: 100 }
  ]) {
    try {
      await queue.clean(3600000, keepCompleted, 'completed'); // Keep last 1 hour
      await queue.clean(86400000, keepFailed, 'failed');      // Keep last 24 hours

      results.push({ queue: name, status: 'cleaned' });
    } catch (error) {
      results.push({ queue: name, status: 'error', error: error.message });
    }
  }

  return results;
}

module.exports = {
  getAllQueueStats,
  getQueueStats,
  getGeminiStats,
  getSystemHealth,
  cleanupOldJobs
};
