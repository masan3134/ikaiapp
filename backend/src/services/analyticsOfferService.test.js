const analyticsService = require('./analyticsOfferService');

describe('Analytics Offer Service', () => {
  it('should return an overview', async () => {
    const overview = await analyticsService.getOverview();
    expect(overview).toBeDefined();
    expect(overview).toHaveProperty('total');
    expect(overview).toHaveProperty('acceptanceRate');
  });
});
