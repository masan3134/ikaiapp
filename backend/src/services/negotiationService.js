const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Creates a new negotiation message for an offer.
 * Can be initiated by the candidate or a company user.
 * @param {string} offerId - The ID of the job offer.
 * @param {object} data - The negotiation data (message, counterSalary, etc.).
 * @param {string} initiator - 'candidate' or 'company'.
 * @param {string} userId - The ID of the user initiating (if company).
 * @returns {Promise<object>} The created negotiation.
 */
async function createNegotiation(offerId, data, initiator, userId = null) {
  const negotiation = await prisma.offerNegotiation.create({
    data: {
      offerId,
      initiatedBy: initiator,
      message: data.message,
      counterSalary: data.counterSalary,
      counterBenefits: data.counterBenefits,
      // If initiator is company, link to user
      ...(initiator === 'company' && { responder: { connect: { id: userId } } }),
    },
  });
  return negotiation;
}

/**
 * Responds to a negotiation.
 * @param {string} negotiationId - The ID of the negotiation.
 * @param {object} responseData - The response data (response message, status).
 * @param {string} userId - The ID of the user responding.
 * @returns {Promise<object>} The updated negotiation.
 */
async function respondToNegotiation(negotiationId, responseData, userId) {
  const negotiation = await prisma.offerNegotiation.update({
    where: { id: negotiationId },
    data: {
      status: responseData.status, // 'accepted', 'rejected'
      response: responseData.response,
      respondedAt: new Date(),
      respondedBy: userId,
    },
  });
  return negotiation;
}

/**
 * Gets all negotiation history for an offer.
 * @param {string} offerId - The ID of the job offer.
 * @returns {Promise<object[]>} A list of negotiations.
 */
async function getNegotiations(offerId) {
  return prisma.offerNegotiation.findMany({
    where: { offerId },
    orderBy: { createdAt: 'asc' },
    include: {
      responder: { select: { id: true, email: true } },
    },
  });
}

module.exports = {
  createNegotiation,
  respondToNegotiation,
  getNegotiations,
};
