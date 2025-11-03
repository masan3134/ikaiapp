/**
 * Milvus Sync Worker
 * BullMQ worker to process Milvus synchronization jobs
 */

const { Worker } = require('bullmq');
const { getMilvusSyncService } = require('../services/milvusSyncService');

const milvusSyncWorker = new Worker(
  'milvus-sync',
  async (job) => {
    const { type, payload } = job.data;

    console.log(`🔄 Processing Milvus sync job: ${type}`);

    try {
      const milvus = await getMilvusSyncService();

      switch (type) {
        case 'SYNC_CANDIDATE':
          return await syncCandidate(milvus, payload);

        case 'SYNC_JOB':
          return await syncJob(milvus, payload);

        case 'SYNC_ANALYSIS_RESULT':
          return await syncAnalysisResult(milvus, payload);

        case 'BATCH_SYNC_CANDIDATES':
          return await batchSyncCandidates(milvus);

        case 'BATCH_SYNC_JOBS':
          return await batchSyncJobs(milvus);

        case 'FULL_SYNC':
          return await fullSync(milvus);

        case 'DELETE_CANDIDATE':
          return await deleteCandidate(milvus, payload);

        case 'DELETE_JOB':
          return await deleteJob(milvus, payload);

        default:
          throw new Error(`Unknown sync type: ${type}`);
      }
    } catch (error) {
      console.error(`❌ Error processing ${type}:`, error);
      throw error; // BullMQ will handle retry
    }
  },
  {
    connection: {
      host: process.env.REDIS_HOST || 'redis',
      port: parseInt(process.env.REDIS_PORT) || 6379
    },
    concurrency: parseInt(process.env.MILVUS_SYNC_CONCURRENCY) || 5,
    limiter: {
      max: 10, // Max 10 jobs
      duration: 1000 // per second
    }
  }
);

/**
 * Sync single candidate
 */
async function syncCandidate(milvus, payload) {
  const { candidateId } = payload;
  const result = await milvus.syncCandidate(candidateId);

  return {
    success: result.success,
    candidateId,
    message: result.success ? 'Candidate synced' : 'Candidate sync failed'
  };
}

/**
 * Sync single job posting
 */
async function syncJob(milvus, payload) {
  const { jobId } = payload;
  const result = await milvus.syncJobPosting(jobId);

  return {
    success: result.success,
    jobId,
    message: result.success ? 'Job synced' : 'Job sync failed'
  };
}

/**
 * Sync analysis result
 */
async function syncAnalysisResult(milvus, payload) {
  const { resultId } = payload;

  // Analysis result sync logic buraya eklenecek
  console.log(`📊 Analysis result sync: ${resultId}`);

  return {
    success: true,
    resultId,
    message: 'Analysis result sync (placeholder)'
  };
}

/**
 * Batch sync all candidates
 */
async function batchSyncCandidates(milvus) {
  console.log('🔄 Starting batch candidate sync...');

  const result = await milvus.syncAllCandidates();

  console.log(`✅ Batch candidate sync completed: ${result.synced}/${result.total}`);

  return {
    success: true,
    synced: result.synced,
    errors: result.errors,
    total: result.total,
    message: `Synced ${result.synced} candidates`
  };
}

/**
 * Batch sync all job postings
 */
async function batchSyncJobs(milvus) {
  console.log('🔄 Starting batch job sync...');

  const result = await milvus.syncAllJobPostings();

  console.log(`✅ Batch job sync completed: ${result.synced}/${result.total}`);

  return {
    success: true,
    synced: result.synced,
    errors: result.errors,
    total: result.total,
    message: `Synced ${result.synced} jobs`
  };
}

/**
 * Full sync (candidates + jobs)
 */
async function fullSync(milvus) {
  console.log('🔄 Starting full sync...');

  const candidatesResult = await milvus.syncAllCandidates();
  const jobsResult = await milvus.syncAllJobPostings();

  const total = candidatesResult.total + jobsResult.total;
  const synced = candidatesResult.synced + jobsResult.synced;
  const errors = candidatesResult.errors + jobsResult.errors;

  console.log(`✅ Full sync completed: ${synced}/${total} (${errors} errors)`);

  return {
    success: true,
    candidates: candidatesResult,
    jobs: jobsResult,
    total: { synced, errors, total },
    message: `Full sync completed: ${synced}/${total}`
  };
}

/**
 * Delete candidate from Milvus
 */
async function deleteCandidate(milvus, payload) {
  const { candidateId } = payload;
  await milvus.deleteCandidateEmbedding(candidateId);

  return {
    success: true,
    candidateId,
    message: 'Candidate deleted from Milvus'
  };
}

/**
 * Delete job from Milvus
 */
async function deleteJob(milvus, payload) {
  const { jobId } = payload;
  await milvus.deleteJobEmbedding(jobId);

  return {
    success: true,
    jobId,
    message: 'Job deleted from Milvus'
  };
}

/**
 * Worker event handlers
 */
milvusSyncWorker.on('completed', (job, returnValue) => {
  console.log(`✅ Milvus sync job completed: ${job.data.type}`, returnValue);
});

milvusSyncWorker.on('failed', (job, err) => {
  console.error(`❌ Milvus sync job failed: ${job.data.type}`, err.message);
});

milvusSyncWorker.on('error', (err) => {
  console.error('❌ Milvus sync worker error:', err);
});

milvusSyncWorker.on('stalled', (jobId) => {
  console.warn(`⚠️ Job stalled: ${jobId}`);
});

console.log('✅ Milvus sync worker started');

module.exports = milvusSyncWorker;
