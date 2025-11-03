const cron = require('node-cron');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Monthly Usage Reset Cron Job
 * Runs on the 1st of each month at 00:00 (midnight)
 * Resets monthlyAnalysisCount and monthlyCvCount to 0 for all organizations
 */
const resetMonthlyUsage = () => {
  // Cron expression: "0 0 1 * *"
  // Min Hour Day Month DayOfWeek
  // 0   0    1   *     *
  // = Every month on the 1st at 00:00
  const task = cron.schedule('0 0 1 * *', async () => {
    try {
      console.log('[CRON] Starting monthly usage reset...');
      const startTime = Date.now();

      // Reset all organizations
      const result = await prisma.organization.updateMany({
        data: {
          monthlyAnalysisCount: 0,
          monthlyCvCount: 0
        }
      });

      const duration = Date.now() - startTime;
      console.log(`[CRON] Monthly usage reset completed: ${result.count} organizations updated in ${duration}ms`);

      // Optional: Log to database for audit trail
      // You could create a separate AuditLog model if needed
    } catch (error) {
      console.error('[CRON] Error resetting monthly usage:', error);
      // Consider implementing alerting here (email, Slack, etc.)
    }
  }, {
    scheduled: true,
    timezone: 'Europe/Istanbul' // Turkey timezone
  });

  console.log('[CRON] Monthly usage reset job registered (runs 1st of each month at 00:00 Istanbul time)');

  return task;
};

module.exports = { resetMonthlyUsage };
