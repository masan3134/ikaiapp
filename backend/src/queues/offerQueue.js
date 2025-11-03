const { Queue } = require('bullmq');

const connection = {
  host: process.env.REDIS_HOST || 'redis',
  port: process.env.REDIS_PORT || 6379,
};

const offerQueue = new Queue('offer-processing', { connection });

module.exports = {
  offerQueue,
  connection,
};
