const { Worker } = require('bullmq');
const { connection } = require('../queues/testGenerationQueue');
const { generateTest } = require('../services/testGenerationService');

/**
 * Test Generation Worker
 * Processes AI-powered test question generation using Gemini API
 *
 * Job Data:
 * {
 *   jobPostingId: string,
 *   userId: string,
 *   analysisId: string (optional)
 * }
 */

const processor = async (job) => {
  const { jobPostingId, userId, analysisId, organizationId } = job.data;
  console.log(`🤖 Generating test for job ${jobPostingId} (analysis: ${analysisId || 'N/A'})`);

  try {
    // Generate test with AI (Gemini API call)
    const test = await generateTest(jobPostingId, userId, analysisId, organizationId);

    console.log(`✅ Test generated: ${test.id} (10 questions)`);
    return {
      success: true,
      testId: test.id,
      questionCount: test.questions?.length || 0,
      jobPostingId,
      analysisId
    };

  } catch (error) {
    console.error(`❌ Test generation failed for job ${jobPostingId}:`, error.message);
    throw error;
  }
};

const worker = new Worker('test-generation', processor, {
  connection,
  concurrency: 2, // Max 2 parallel test generations (Gemini API protection)
  limiter: {
    max: 10,        // Max 10 test generations
    duration: 60000 // per minute (Gemini RPM protection)
  },
  removeOnComplete: { count: 200 },
  removeOnFail: { count: 500 },
  attempts: 2,    // Retry once on Gemini failure
  backoff: {
    type: 'exponential',
    delay: 8000   // Start with 8s delay
  }
});

worker.on('completed', (job) => {
  console.log(`✅ Test generation job ${job.id} completed`);
});

worker.on('failed', (job, err) => {
  console.error(`❌ Test generation job ${job?.id} failed:`, err.message);
});

worker.on('error', (err) => {
  console.error('❌ Test generation worker error:', err);
});

console.log('🚀 Test generation worker started (concurrency: 2, rate limit: 10/min)');

module.exports = worker;
