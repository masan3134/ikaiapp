const { Worker } = require('bullmq');
const { connection } = require('../queues/emailQueue');
const {
  sendAnalysisEmail,
  sendInterviewInvitation,
  sendInterviewRescheduleNotification,
  sendEmail
} = require('../services/emailService');

/**
 * Generic Email Worker
 * Processes all email types from the queue
 *
 * Job Data Structure:
 * {
 *   type: 'analysis-report' | 'interview-invitation' | 'interview-reschedule' | 'generic',
 *   data: { ... type-specific data ... }
 * }
 */

const processor = async (job) => {
  const { type, data } = job.data;
  console.log(`📧 Processing ${type} email (job ${job.id})`);

  try {
    let result;

    switch (type) {
      case 'analysis-report':
        // data: { analysisId, recipientEmail, formats }
        result = await sendAnalysisEmail(
          data.analysisId,
          data.recipientEmail,
          data.formats || ['html']
        );
        console.log(`✅ Analysis report sent to ${data.recipientEmail}`);
        break;

      case 'interview-invitation':
        // data: { candidate, interview }
        result = await sendInterviewInvitation(data.candidate, data.interview);
        console.log(`✅ Interview invitation sent to ${data.candidate.email}`);
        break;

      case 'interview-reschedule':
        // data: { candidate, interview }
        result = await sendInterviewRescheduleNotification(data.candidate, data.interview);
        console.log(`✅ Interview reschedule notification sent to ${data.candidate.email}`);
        break;

      case 'generic':
        // data: { to, subject, html }
        result = await sendEmail(data);
        console.log(`✅ Generic email sent to ${data.to}`);
        break;

      default:
        throw new Error(`Unknown email type: ${type}`);
    }

    return {
      success: true,
      type,
      result
    };

  } catch (error) {
    console.error(`❌ Failed to send ${type} email:`, error.message);
    throw error;
  }
};

const worker = new Worker('generic-email', processor, {
  connection,
  concurrency: 5, // Max 5 parallel emails
  limiter: {
    max: 100,       // 100 emails
    duration: 60000 // per minute (Gmail safe limit)
  },
  removeOnComplete: { count: 500 },
  removeOnFail: { count: 1000 },
  attempts: 3,    // Retry 3 times on SMTP failures
  backoff: {
    type: 'exponential',
    delay: 5000   // Start with 5s, then 10s, 20s
  }
});

worker.on('completed', (job) => {
  console.log(`✅ Email job ${job.id} completed (${job.data.type})`);
});

worker.on('failed', (job, err) => {
  console.error(`❌ Email job ${job?.id} failed:`, err.message);
});

worker.on('error', (err) => {
  console.error('❌ Email worker error:', err);
});

console.log('🚀 Generic email worker started (concurrency: 5, rate limit: 100/min)');

module.exports = worker;
