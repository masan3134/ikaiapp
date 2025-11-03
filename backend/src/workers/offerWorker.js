const { Worker } = require('bullmq');
const { connection } = require('../queues/offerQueue');
const { sendOfferEmail } = require('../services/emailService');

/**
 * Offer Worker
 * Processes job offer emails from the queue
 * Feature #19: Toplu Teklif Gönderme
 */

const processor = async (job) => {
  const { offerId } = job.data;
  console.log(`📧 Processing offer email for offer ${offerId}`);

  try {
    // Send offer email
    const result = await sendOfferEmail(offerId);

    console.log(`✅ Offer email sent: ${offerId} (${result.messageId})`);
    return {
      success: true,
      offerId,
      messageId: result.messageId,
      acceptanceUrl: result.acceptanceUrl
    };

  } catch (error) {
    console.error(`❌ Failed to send offer ${offerId}:`, error.message);
    throw error;
  }
};

const worker = new Worker('offer-processing', processor, {
  connection,
  concurrency: 2, // Max 2 parallel emails (Gmail protection)
  limiter: {
    max: 50,        // 50 emails
    duration: 60000 // per minute (Gmail safe limit)
  },
  removeOnComplete: { count: 100 },
  removeOnFail: { count: 500 },
  attempts: 3,    // Retry 3 times on failure
  backoff: {
    type: 'exponential',
    delay: 5000   // Start with 5s, then 10s, 20s
  }
});

worker.on('completed', (job) => {
  console.log(`✅ Offer job ${job.id} completed for offer ${job.data.offerId}`);
});

worker.on('failed', (job, err) => {
  console.error(`❌ Offer job ${job?.id} failed:`, err.message);
});

worker.on('error', (err) => {
  console.error('❌ Offer worker error:', err);
});

console.log('🚀 Offer worker started (concurrency: 2, rate limit: 50/min)');

module.exports = worker;
