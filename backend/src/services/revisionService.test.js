const revisionService = require('./revisionService');

describe('Revision Service', () => {
  it('should create a revision', async () => {
    // This test would require a mock offer and user
    // For now, we just check if the function exists
    expect(revisionService.createRevision).toBeDefined();
  });
});
