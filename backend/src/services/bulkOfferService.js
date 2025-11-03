const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const emailService = require('./emailService');
const offerQueue = require('../queues/offerQueue');

/**
 * Bulk send job offers by adding them to a queue.
 * Feature #19: Toplu Teklif Gönderme
 */
async function bulkSendOffers(offerIds, userId) {
  console.log(`📧 Bulk sending ${offerIds.length} offers...`);

  // 1. Validate that offers are in a valid state to be sent (e.g., 'approved')
  const offers = await prisma.jobOffer.findMany({
    where: {
      id: { in: offerIds },
      // Assuming offers must be approved before sending.
      // The schema now supports this status.
      status: 'approved',
      createdBy: userId, // Security check: only the creator can send them.
    },
    include: {
      candidate: true,
    },
  });

  const validOfferIds = offers.map(o => o.id);
  const invalidOfferIds = offerIds.filter(id => !validOfferIds.includes(id));

  if (offers.length === 0) {
    throw new Error('Gönderilecek geçerli teklif bulunamadı. Tekliflerin "onaylandı" durumunda olması gerekir.');
  }

  // 2. Add each valid offer to the queue for processing
  const jobs = [];
  for (const offer of offers) {
    const job = await offerQueue.add('send-offer', {
      offerId: offer.id,
    });
    jobs.push(job.id);
  }

  

  return {
    success: true,
    message: `${offers.length} teklif gönderim kuyruğuna eklendi.`,
    queuedJobs: jobs.length,
    invalidOffers: invalidOfferIds,
  };
}

module.exports = {
  bulkSendOffers,
};

