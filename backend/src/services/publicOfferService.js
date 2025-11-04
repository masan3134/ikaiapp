const { PrismaClient, OfferStatus } = require('@prisma/client');
const prisma = new PrismaClient();
const { v4: uuidv4 } = require('uuid');
const notificationService = require('./notificationService');

class PublicOfferService {

  /**
   * Validate acceptance token
   * @param {string} token - The acceptance token
   * @returns {Promise<object>} - The offer object if valid
   */
  async validateToken(token) {
    const offer = await prisma.jobOffer.findFirst({
      where: { acceptanceToken: token }
    });

    if (!offer) {
      throw new Error('Geçersiz teklif tokenı');
    }

    if (offer.status !== OfferStatus.sent) {
      throw new Error('Bu teklif artık geçerli değil');
    }

    if (new Date(offer.expiresAt) < new Date()) {
      throw new Error('Bu teklifin süresi dolmuş');
    }

    return offer;
  }

  /**
   * Get offer details by token
   * @param {string} token - The acceptance token
   * @returns {Promise<object>} - The full offer details
   */
  async getOfferByToken(token) {
    const offer = await this.validateToken(token);

    // Fire-and-forget update for view count - non-blocking
    (async () => {
      try {
        await prisma.jobOffer.update({
          where: { id: offer.id },
          data: {
            viewCount: { increment: 1 },
            lastViewedAt: new Date()
          }
        });
      } catch (e) {
        console.error('Failed to update view count', e);
      }
    })();

    return prisma.jobOffer.findUnique({
      where: { acceptanceToken: token },
      include: {
        candidate: true,
        jobPosting: true
      }
    });
  }

  /**
   * Accept an offer
   * @param {string} token - The acceptance token
   * @param {object} data - Additional data (e.g., IP address)
   * @returns {Promise<object>} - The updated offer
   */
  async acceptOffer(token, data) {
    const offer = await this.validateToken(token);
    const revisionService = require('./revisionService');

    const updatedOffer = await prisma.jobOffer.update({
      where: { id: offer.id },
      data: {
        status: OfferStatus.accepted,
        respondedAt: new Date(),
        acceptedAt: new Date(),
        ...data
      },
      include: {
        candidate: true
      }
    });

    // Create revision entry for acceptance
    await revisionService.createRevision(
      offer.id,
      'accepted',
      null, // No user ID for public acceptance
      { acceptedAt: new Date(), candidateResponse: 'accepted' }
    );

    // Notification: Offer accepted
    try {
      const candidateName = `${updatedOffer.candidate.firstName} ${updatedOffer.candidate.lastName}`.trim() || 'Aday';
      await notificationService.notifyOfferAccepted(
        offer.id,
        offer.createdBy,
        offer.organizationId,
        candidateName,
        offer.position
      );
    } catch (notifError) {
      console.error('⚠️  Notification failed (non-critical):', notifError.message);
    }

    return updatedOffer;
  }

  /**
   * Reject an offer
   * @param {string} token - The acceptance token
   * @param {string} reason - The reason for rejection
   * @returns {Promise<object>} - The updated offer
   */
  async rejectOffer(token, reason) {
    const offer = await this.validateToken(token);
    const revisionService = require('./revisionService');

    const updatedOffer = await prisma.jobOffer.update({
      where: { id: offer.id },
      data: {
        status: OfferStatus.rejected,
        respondedAt: new Date(),
        rejectedAt: new Date(),
        rejectionReason: reason
      },
      include: {
        candidate: true
      }
    });

    // Create revision entry for rejection
    await revisionService.createRevision(
      offer.id,
      'rejected',
      null, // No user ID for public rejection
      { rejectedAt: new Date(), rejectionReason: reason, candidateResponse: 'rejected' }
    );

    // Notification: Offer rejected
    try {
      const candidateName = `${updatedOffer.candidate.firstName} ${updatedOffer.candidate.lastName}`.trim() || 'Aday';
      await notificationService.notifyOfferRejected(
        offer.id,
        offer.createdBy,
        offer.organizationId,
        candidateName,
        reason
      );
    } catch (notifError) {
      console.error('⚠️  Notification failed (non-critical):', notifError.message);
    }

    return updatedOffer;
  }
}

module.exports = new PublicOfferService();
