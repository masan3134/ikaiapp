const { Queue } = require('bullmq');

const connection = {
  host: process.env.REDIS_HOST || 'redis',
  port: process.env.REDIS_PORT || 6379,
};

const analysisQueue = new Queue('analysis-processing', { connection });

module.exports = {
  analysisQueue,
  connection,
};
