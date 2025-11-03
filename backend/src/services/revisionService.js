const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createRevision(offerId, changeType, userId, changes = {}, tx = prisma) {
  const offer = await tx.jobOffer.findUnique({ where: { id: offerId } });
  if (!offer) throw new Error('Offer not found');

  const latestRevision = await tx.offerRevision.findFirst({
    where: { offerId },
    orderBy: { version: 'desc' },
  });

  const newVersion = latestRevision ? latestRevision.version + 1 : 1;

  const revision = await tx.offerRevision.create({
    data: {
      offerId,
      version: newVersion,
      changeType,
      changedBy: userId,
      snapshot: offer,
      changes,
    },
  });

  return revision;
}

async function getRevisions(offerId, organizationId) {
  const offer = await prisma.jobOffer.findFirst({
    where: { id: offerId, organizationId }
  });

  if (!offer) {
    throw new Error('Offer not found or access denied');
  }

  const revisions = await prisma.offerRevision.findMany({
    where: { offerId },
    orderBy: { version: 'desc' },
    include: {
      changer: { select: { id: true, email: true } },
    },
  });

  return revisions.map(revision => ({
    ...revision,
    changer: revision.changer || { id: null, email: 'Aday (Public)' }
  }));
}

module.exports = {
  createRevision,
  getRevisions,
};
