const cron = require('node-cron');
const expirationService = require('../services/expirationService');

/**
 * Schedule a cron job to check for expired offers every hour
 */
function setupExpirationCron() {
  cron.schedule('0 * * * *', () => {
    console.log('Running expired offer check...');
    expirationService.checkExpiredOffers();
  });
}

module.exports = { setupExpirationCron };