const { Queue } = require('bullmq');

const connection = {
  host: process.env.REDIS_HOST || 'redis',
  port: process.env.REDIS_PORT || 6379,
};

/**
 * Generic Email Queue
 * Handles all email types: analysis reports, interview invitations, etc.
 *
 * Email Types:
 * - 'analysis-report': Send analysis report with attachments
 * - 'interview-invitation': Send interview invitation
 * - 'interview-reschedule': Send interview reschedule notification
 * - 'generic': Send generic HTML email
 */
const emailQueue = new Queue('generic-email', { connection });

module.exports = {
  emailQueue,
  connection,
};
