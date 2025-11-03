const { Queue } = require('bullmq');

const connection = {
  host: process.env.REDIS_HOST || 'redis',
  port: process.env.REDIS_PORT || 6379,
};

/**
 * Test Generation Queue
 * Handles AI-powered test question generation (Gemini API)
 *
 * Job Data:
 * {
 *   jobPostingId: string,
 *   userId: string,
 *   analysisId: string (optional)
 * }
 */
const testGenerationQueue = new Queue('test-generation', { connection });

module.exports = {
  testGenerationQueue,
  connection,
};
