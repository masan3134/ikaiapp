
const { PrismaClient, OfferStatus } = require('@prisma/client');
const prisma = new PrismaClient();
const notificationService = require('./notificationService');

class ExpirationService {

  /**
   * Check for expired offers and update their status
   */
  async checkExpiredOffers() {
    const expiredOffers = await prisma.jobOffer.findMany({
      where: {
        status: OfferStatus.sent,
        expiresAt: {
          lt: new Date()
        }
      }
    });

    for (const offer of expiredOffers) {
      await this.expireOffer(offer.id);
    }

    console.log(`Checked for expired offers: ${expiredOffers.length} found and expired.`);
  }

  /**
   * Mark an offer as expired
   * @param {string} offerId - The ID of the offer to expire
   * @returns {Promise<object>} - The updated offer
   */
  async expireOffer(offerId) {
    const updatedOffer = await prisma.jobOffer.update({
      where: { id: offerId },
      data: { status: OfferStatus.expired },
      include: { creator: true, candidate: true }
    });

    notificationService.notifyCreatorOfOfferExpiration(updatedOffer);

    return updatedOffer;
  }

  /**
   * Extend the expiration date of an offer
   * @param {string} offerId - The ID of the offer
   * @param {number} days - The number of days to extend
   * @returns {Promise<object>} - The updated offer
   */
  async extendOfferExpiration(offerId, days) {
    const offer = await prisma.jobOffer.findUnique({ where: { id: offerId } });
    if (!offer) {
      throw new Error('Teklif bulunamadı');
    }

    const newExpirationDate = new Date(offer.expiresAt);
    newExpirationDate.setDate(newExpirationDate.getDate() + days);

    return prisma.jobOffer.update({
      where: { id: offerId },
      data: { expiresAt: newExpirationDate }
    });
  }
}

module.exports = new ExpirationService();
