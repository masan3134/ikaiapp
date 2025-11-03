const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createNegotiation(offerId, data, initiator, userId = null, organizationId) {
  const offer = await prisma.jobOffer.findFirst({
    where: { id: offerId, organizationId }
  });

  if (!offer) {
    throw new Error('Offer not found or access denied');
  }

  const negotiation = await prisma.offerNegotiation.create({
    data: {
      offerId,
      initiatedBy: initiator,
      message: data.message,
      counterSalary: data.counterSalary,
      counterBenefits: data.counterBenefits,
      ...(initiator === 'company' && { responder: { connect: { id: userId } } }),
    },
  });
  return negotiation;
}

async function respondToNegotiation(negotiationId, responseData, userId, organizationId) {
  const negotiation = await prisma.offerNegotiation.findUnique({
    where: { id: negotiationId },
    include: { offer: true }
  });

  if (!negotiation || negotiation.offer.organizationId !== organizationId) {
    throw new Error('Negotiation not found or access denied');
  }

  const updated = await prisma.offerNegotiation.update({
    where: { id: negotiationId },
    data: {
      status: responseData.status,
      response: responseData.response,
      respondedAt: new Date(),
      respondedBy: userId,
    },
  });
  return updated;
}

async function getNegotiations(offerId, organizationId) {
  const offer = await prisma.jobOffer.findFirst({
    where: { id: offerId, organizationId }
  });

  if (!offer) {
    throw new Error('Offer not found or access denied');
  }

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
