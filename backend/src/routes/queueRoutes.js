const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { authorize } = require('../middleware/authorize');
const { ROLES } = require('../constants/roles');
const { getAllQueueStats, getSystemHealth, cleanupOldJobs } = require('../utils/queueMonitor');

/**
 * Queue Monitoring Routes
 * SUPER_ADMIN-only endpoints for monitoring BullMQ queues
 */

// SUPER_ADMIN-only middleware
const superAdminOnly = [authenticateToken, authorize([ROLES.SUPER_ADMIN])];

// Get all queue statistics
router.get('/stats', superAdminOnly, async (req, res) => {
  try {
    const stats = await getAllQueueStats();
    res.json({ success: true, stats });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get queue stats', message: error.message });
  }
});

// Get comprehensive system health
router.get('/health', superAdminOnly, async (req, res) => {
  try {
    const health = await getSystemHealth();
    res.json({ success: true, ...health });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get system health', message: error.message });
  }
});

// Clean old jobs (maintenance)
router.post('/cleanup', superAdminOnly, async (req, res) => {
  try {
    const results = await cleanupOldJobs();
    res.json({ success: true, results });
  } catch (error) {
    res.status(500).json({ error: 'Failed to cleanup jobs', message: error.message });
  }
});

// Pause a specific queue
router.post('/:queueName/pause', superAdminOnly, async (req, res) => {
  try {
    const { queueName } = req.params;
    const { Queue } = require('bullmq');

    const connection = {
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '8179')
    };

    const queue = new Queue(queueName, { connection });
    await queue.pause();
    await queue.close();

    res.json({
      success: true,
      message: `Queue ${queueName} has been paused`
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to pause queue',
      message: error.message
    });
  }
});

// Resume a specific queue
router.post('/:queueName/resume', superAdminOnly, async (req, res) => {
  try {
    const { queueName } = req.params;
    const { Queue } = require('bullmq');

    const connection = {
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '8179')
    };

    const queue = new Queue(queueName, { connection });
    await queue.resume();
    await queue.close();

    res.json({
      success: true,
      message: `Queue ${queueName} has been resumed`
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to resume queue',
      message: error.message
    });
  }
});

// Clean a specific queue (remove completed/failed jobs)
router.delete('/:queueName/clean', superAdminOnly, async (req, res) => {
  try {
    const { queueName } = req.params;
    const { grace = 3600 } = req.query; // Default: 1 hour
    const { Queue } = require('bullmq');

    const connection = {
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '8179')
    };

    const queue = new Queue(queueName, { connection });

    // Clean completed jobs older than grace period
    const completedCount = await queue.clean(parseInt(grace) * 1000, 0, 'completed');
    // Clean failed jobs older than grace period
    const failedCount = await queue.clean(parseInt(grace) * 1000, 0, 'failed');

    await queue.close();

    res.json({
      success: true,
      message: `Queue ${queueName} cleaned`,
      cleaned: {
        completed: completedCount.length,
        failed: failedCount.length
      }
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to clean queue',
      message: error.message
    });
  }
});

// Get failed jobs from a specific queue
router.get('/:queueName/failed', superAdminOnly, async (req, res) => {
  try {
    const { queueName } = req.params;
    const { limit = 10 } = req.query;
    const { Queue } = require('bullmq');

    const connection = {
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '8179')
    };

    const queue = new Queue(queueName, { connection });

    // Get failed jobs
    const failedJobs = await queue.getFailed(0, parseInt(limit) - 1);

    const formattedJobs = failedJobs.map(job => ({
      id: job.id,
      name: job.name,
      data: job.data,
      failedReason: job.failedReason,
      stacktrace: job.stacktrace ? job.stacktrace.slice(0, 500) : null,
      timestamp: job.timestamp,
      attemptsMade: job.attemptsMade
    }));

    await queue.close();

    res.json({
      success: true,
      queue: queueName,
      failed: formattedJobs,
      total: formattedJobs.length
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to get failed jobs',
      message: error.message
    });
  }
});

module.exports = router;
