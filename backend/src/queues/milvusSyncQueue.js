/**
 * Milvus Sync Queue
 * BullMQ queue for async Milvus synchronization
 */

const { Queue } = require('bullmq');

const milvusSyncQueue = new Queue('milvus-sync', {
  connection: {
    host: process.env.REDIS_HOST || 'redis',
    port: parseInt(process.env.REDIS_PORT) || 6379
  },
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000
    },
    removeOnComplete: {
      count: 100 // Keep last 100 completed jobs
    },
    removeOnFail: {
      count: 500 // Keep last 500 failed jobs
    }
  }
});

/**
 * Tek bir candidate'i sync kuyruğuna ekle
 */
async function queueCandidateSync(candidateId) {
  return await milvusSyncQueue.add(
    'SYNC_CANDIDATE',
    {
      type: 'SYNC_CANDIDATE',
      payload: { candidateId },
      timestamp: new Date().toISOString()
    },
    {
      jobId: `candidate-${candidateId}-${Date.now()}`
    }
  );
}

/**
 * Tek bir job posting'i sync kuyruğuna ekle
 */
async function queueJobSync(jobId) {
  return await milvusSyncQueue.add(
    'SYNC_JOB',
    {
      type: 'SYNC_JOB',
      payload: { jobId },
      timestamp: new Date().toISOString()
    },
    {
      jobId: `job-${jobId}-${Date.now()}`
    }
  );
}

/**
 * Tek bir analysis result'ı sync kuyruğuna ekle
 */
async function queueAnalysisResultSync(resultId) {
  return await milvusSyncQueue.add(
    'SYNC_ANALYSIS_RESULT',
    {
      type: 'SYNC_ANALYSIS_RESULT',
      payload: { resultId },
      timestamp: new Date().toISOString()
    },
    {
      jobId: `analysis-${resultId}-${Date.now()}`
    }
  );
}

/**
 * Tüm candidate'ları sync et (batch)
 */
async function queueBatchCandidateSync() {
  return await milvusSyncQueue.add(
    'BATCH_SYNC_CANDIDATES',
    {
      type: 'BATCH_SYNC_CANDIDATES',
      payload: {},
      timestamp: new Date().toISOString()
    },
    {
      jobId: `batch-candidates-${Date.now()}`
    }
  );
}

/**
 * Tüm job postings'i sync et (batch)
 */
async function queueBatchJobSync() {
  return await milvusSyncQueue.add(
    'BATCH_SYNC_JOBS',
    {
      type: 'BATCH_SYNC_JOBS',
      payload: {},
      timestamp: new Date().toISOString()
    },
    {
      jobId: `batch-jobs-${Date.now()}`
    }
  );
}

/**
 * Tüm verileri sync et (full batch)
 */
async function queueFullSync() {
  return await milvusSyncQueue.add(
    'FULL_SYNC',
    {
      type: 'FULL_SYNC',
      payload: {},
      timestamp: new Date().toISOString()
    },
    {
      jobId: `full-sync-${Date.now()}`,
      priority: 1 // High priority
    }
  );
}

/**
 * Günlük batch sync'i zamanla (cron)
 */
async function scheduleDailySync() {
  return await milvusSyncQueue.add(
    'SCHEDULED_FULL_SYNC',
    {
      type: 'FULL_SYNC',
      payload: {},
      timestamp: new Date().toISOString()
    },
    {
      repeat: {
        pattern: process.env.MILVUS_SYNC_CRON || '0 2 * * *' // Daily at 2 AM
      }
    }
  );
}

/**
 * Candidate silme işlemini kuyruğa ekle
 */
async function queueCandidateDelete(candidateId) {
  return await milvusSyncQueue.add(
    'DELETE_CANDIDATE',
    {
      type: 'DELETE_CANDIDATE',
      payload: { candidateId },
      timestamp: new Date().toISOString()
    },
    {
      jobId: `delete-candidate-${candidateId}-${Date.now()}`
    }
  );
}

/**
 * Job silme işlemini kuyruğa ekle
 */
async function queueJobDelete(jobId) {
  return await milvusSyncQueue.add(
    'DELETE_JOB',
    {
      type: 'DELETE_JOB',
      payload: { jobId },
      timestamp: new Date().toISOString()
    },
    {
      jobId: `delete-job-${jobId}-${Date.now()}`
    }
  );
}

/**
 * Queue event listeners
 */
milvusSyncQueue.on('error', (error) => {
  console.error('❌ Milvus sync queue error:', error);
});

milvusSyncQueue.on('waiting', ({ jobId }) => {
  console.log(`⏳ Job waiting: ${jobId}`);
});

milvusSyncQueue.on('active', ({ jobId }) => {
  console.log(`🔄 Job active: ${jobId}`);
});

milvusSyncQueue.on('completed', ({ jobId, returnvalue }) => {
  console.log(`✅ Job completed: ${jobId}`);
});

milvusSyncQueue.on('failed', ({ jobId, failedReason }) => {
  console.error(`❌ Job failed: ${jobId}`, failedReason);
});

module.exports = {
  milvusSyncQueue,
  queueCandidateSync,
  queueJobSync,
  queueAnalysisResultSync,
  queueBatchCandidateSync,
  queueBatchJobSync,
  queueFullSync,
  scheduleDailySync,
  queueCandidateDelete,
  queueJobDelete
};
