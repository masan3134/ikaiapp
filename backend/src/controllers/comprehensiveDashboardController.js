const { PrismaClient } = require('@prisma/client');
const { getSystemHealth } = require('../utils/queueMonitor');

const prisma = new PrismaClient();

/**
 * Comprehensive Dashboard Controller
 * Returns ALL platform metrics in one response
 * Optimized for admin overview
 */

async function getComprehensiveDashboard(req, res) {
  try {
    const userId = req.user.id;
    const isAdmin = req.user.role === 'ADMIN';

    // Parallel queries for performance
    const [
      users,
      candidates,
      jobPostings,
      analyses,
      tests,
      interviews,
      offers,
      queueHealth
    ] = await Promise.all([
      // 1. Users
      isAdmin ? prisma.user.groupBy({
        by: ['role'],
        _count: { role: true }
      }) : Promise.resolve([]),

      // 2. Candidates
      prisma.candidate.aggregate({
        where: isAdmin ? {} : { userId },
        _count: true
      }),

      // 3. Job Postings
      prisma.jobPosting.groupBy({
        by: ['status'],
        where: isAdmin ? {} : { createdBy: userId },
        _count: { status: true }
      }),

      // 4. Analyses
      prisma.analysis.groupBy({
        by: ['status'],
        where: isAdmin ? {} : { createdBy: userId },
        _count: { status: true }
      }),

      // 5. Assessment Tests
      prisma.assessmentTest.aggregate({
        where: isAdmin ? {} : { createdBy: userId },
        _count: true,
        _avg: { maxAttempts: true }
      }),

      // 6. Interviews
      prisma.interview.groupBy({
        by: ['status'],
        where: isAdmin ? {} : { createdBy: userId },
        _count: { status: true }
      }),

      // 7. Job Offers
      prisma.jobOffer.groupBy({
        by: ['status'],
        where: isAdmin ? {} : { createdBy: userId },
        _count: { status: true }
      }),

      // 8. Queue Health (Admin only)
      isAdmin ? getSystemHealth().catch(() => null) : Promise.resolve(null)
    ]);

    // Additional stats
    const [newCandidates, recentTests, todayInterviews] = await Promise.all([
      // New candidates (last 7 days)
      prisma.candidate.count({
        where: {
          ...(isAdmin ? {} : { userId }),
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          }
        }
      }),

      // Recent tests (last 30 days)
      prisma.assessmentTest.count({
        where: {
          ...(isAdmin ? {} : { createdBy: userId }),
          createdAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
          }
        }
      }),

      // Today's interviews
      prisma.interview.count({
        where: {
          ...(isAdmin ? {} : { createdBy: userId }),
          scheduledAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
            lt: new Date(new Date().setHours(23, 59, 59, 999))
          }
        }
      })
    ]);

    // Format response
    const dashboard = {
      timestamp: new Date().toISOString(),
      userRole: req.user.role,

      // 1. Users (Admin only)
      users: isAdmin ? {
        total: users.reduce((sum, u) => sum + u._count.role, 0),
        byRole: users.reduce((acc, u) => {
          acc[u.role] = u._count.role;
          return acc;
        }, {})
      } : null,

      // 2. Candidates
      candidates: {
        total: candidates._count,
        new: newCandidates,
        growth: newCandidates > 0 ? '+' + newCandidates : '0'
      },

      // 3. Job Postings
      jobPostings: {
        total: jobPostings.reduce((sum, j) => sum + j._count.status, 0),
        active: jobPostings.find(j => j.status === 'active')?._count.status || 0,
        closed: jobPostings.find(j => j.status === 'closed')?._count.status || 0,
        draft: jobPostings.find(j => j.status === 'draft')?._count.status || 0
      },

      // 4. Analyses
      analyses: {
        total: analyses.reduce((sum, a) => sum + a._count.status, 0),
        completed: analyses.find(a => a.status === 'COMPLETED')?._count.status || 0,
        processing: analyses.find(a => a.status === 'PROCESSING')?._count.status || 0,
        pending: analyses.find(a => a.status === 'PENDING')?._count.status || 0,
        failed: analyses.find(a => a.status === 'FAILED')?._count.status || 0
      },

      // 5. Tests
      tests: {
        total: tests._count,
        recent: recentTests,
        avgAttempts: Math.round(tests._avg.maxAttempts || 3)
      },

      // 6. Interviews
      interviews: {
        total: interviews.reduce((sum, i) => sum + i._count.status, 0),
        scheduled: interviews.find(i => i.status === 'scheduled')?._count.status || 0,
        completed: interviews.find(i => i.status === 'completed')?._count.status || 0,
        cancelled: interviews.find(i => i.status === 'cancelled')?._count.status || 0,
        today: todayInterviews
      },

      // 7. Offers
      offers: {
        total: offers.reduce((sum, o) => sum + o._count.status, 0),
        sent: offers.find(o => o.status === 'sent')?._count.status || 0,
        accepted: offers.find(o => o.status === 'accepted')?._count.status || 0,
        rejected: offers.find(o => o.status === 'rejected')?._count.status || 0,
        pending: offers.find(o => o.status === 'pending')?._count.status || 0
      },

      // 8. System Health (Admin only)
      systemHealth: queueHealth ? {
        status: queueHealth.health.status,
        activeJobs: queueHealth.health.activeJobs,
        failedJobs: queueHealth.health.failedJobs,
        gemini: {
          available: queueHealth.gemini.availableSlots,
          max: queueHealth.gemini.maxRequests,
          percentage: Math.round((queueHealth.gemini.availableSlots / queueHealth.gemini.maxRequests) * 100)
        },
        queues: queueHealth.queues.map(q => ({
          name: q.name,
          active: q.active,
          waiting: q.waiting,
          failed: q.failed,
          completed: q.completed
        }))
      } : null
    };

    res.json({
      success: true,
      ...dashboard
    });

  } catch (error) {
    console.error('Comprehensive dashboard error:', error);
    res.status(500).json({
      error: 'Dashboard Error',
      message: error.message
    });
  }
}

module.exports = {
  getComprehensiveDashboard
};
