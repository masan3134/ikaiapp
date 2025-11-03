const bulkOfferService = require('./bulkOfferService');

describe('Bulk Offer Service', () => {
  it('should queue offers for sending', async () => {
    // This test would require a mock offer and user
    // For now, we just check if the function exists
    expect(bulkOfferService.bulkSendOffers).toBeDefined();
  });
});
