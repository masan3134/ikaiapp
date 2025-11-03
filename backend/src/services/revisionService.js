const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Creates a new revision for a job offer.
 * This is called automatically when an offer is created, updated, or its status changes.
 * @param {string} offerId - The ID of the job offer.
 * @param {string} changeType - The type of change (e.g., 'created', 'updated', 'approved').
 * @param {string} userId - The ID of the user who made the change.
 * @param {object} changes - A diff of what changed.
 * @returns {Promise<object>} The created revision.
 */
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
      snapshot: offer, // Store the entire offer object at this point in time
      changes, // Store the diff
    },
  });

  return revision;
}

/**
 * Gets all revisions for a specific job offer.
 * @param {string} offerId - The ID of the job offer.
 * @returns {Promise<object[]>} A list of revisions.
 */
async function getRevisions(offerId) {
  const revisions = await prisma.offerRevision.findMany({
    where: { offerId },
    orderBy: { version: 'desc' },
    include: {
      changer: { select: { id: true, email: true } },
    },
  });

  // Transform revisions to handle public actions (null changer)
  return revisions.map(revision => ({
    ...revision,
    changer: revision.changer || { id: null, email: 'Aday (Public)' }
  }));
}

module.exports = {
  createRevision,
  getRevisions,
};
