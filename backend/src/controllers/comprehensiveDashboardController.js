const { PrismaClient } = require('@prisma/client');
const { getSystemHealth } = require('../utils/queueMonitor');

const prisma = new PrismaClient();

async function getComprehensiveDashboard(req, res) {
  try {
    const userId = req.user.id;
    const isAdmin = req.user.role === 'ADMIN';
    const organizationId = req.organizationId;

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
      isAdmin ? prisma.user.groupBy({
        by: ['role'],
        where: { organizationId },
        _count: { role: true }
      }) : Promise.resolve([]),

      prisma.candidate.aggregate({
        where: isAdmin ? { organizationId } : { userId, organizationId },
        _count: true
      }),

      prisma.jobPosting.groupBy({
        by: ['status'],
        where: isAdmin ? { organizationId } : { createdBy: userId, organizationId },
        _count: { status: true }
      }),

      prisma.analysis.groupBy({
        by: ['status'],
        where: isAdmin ? { organizationId } : { createdBy: userId, organizationId },
        _count: { status: true }
      }),

      prisma.assessmentTest.aggregate({
        where: isAdmin ? { organizationId } : { createdBy: userId, organizationId },
        _count: true,
        _avg: { maxAttempts: true }
      }),

      prisma.interview.groupBy({
        by: ['status'],
        where: isAdmin ? { organizationId } : { createdBy: userId, organizationId },
        _count: { status: true }
      }),

      prisma.jobOffer.groupBy({
        by: ['status'],
        where: isAdmin ? { organizationId } : { createdBy: userId, organizationId },
        _count: { status: true }
      }),

      isAdmin ? getSystemHealth().catch(() => null) : Promise.resolve(null)
    ]);

    const [newCandidates, recentTests, todayInterviews] = await Promise.all([
      prisma.candidate.count({
        where: {
          ...(isAdmin ? { organizationId } : { userId, organizationId }),
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          }
        }
      }),

      prisma.assessmentTest.count({
        where: {
          ...(isAdmin ? { organizationId } : { createdBy: userId, organizationId }),
          createdAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
          }
        }
      }),

      prisma.interview.count({
        where: {
          ...(isAdmin ? { organizationId } : { createdBy: userId, organizationId }),
          scheduledAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
            lt: new Date(new Date().setHours(23, 59, 59, 999))
          }
        }
      })
    ]);

    const dashboard = {
      timestamp: new Date().toISOString(),
      userRole: req.user.role,

      users: isAdmin ? {
        total: users.reduce((sum, u) => sum + u._count.role, 0),
        byRole: users.reduce((acc, u) => {
          acc[u.role] = u._count.role;
          return acc;
        }, {})
      } : null,

      candidates: {
        total: candidates._count,
        new: newCandidates,
        growth: newCandidates > 0 ? '+' + newCandidates : '0'
      },

      jobPostings: {
        total: jobPostings.reduce((sum, j) => sum + j._count.status, 0),
        active: jobPostings.find(j => j.status === 'active')?._count.status || 0,
        closed: jobPostings.find(j => j.status === 'closed')?._count.status || 0,
        draft: jobPostings.find(j => j.status === 'draft')?._count.status || 0
      },

      analyses: {
        total: analyses.reduce((sum, a) => sum + a._count.status, 0),
        completed: analyses.find(a => a.status === 'COMPLETED')?._count.status || 0,
        processing: analyses.find(a => a.status === 'PROCESSING')?._count.status || 0,
        pending: analyses.find(a => a.status === 'PENDING')?._count.status || 0,
        failed: analyses.find(a => a.status === 'FAILED')?._count.status || 0
      },

      tests: {
        total: tests._count,
        recent: recentTests,
        avgAttempts: Math.round(tests._avg.maxAttempts || 3)
      },

      interviews: {
        total: interviews.reduce((sum, i) => sum + i._count.status, 0),
        scheduled: interviews.find(i => i.status === 'scheduled')?._count.status || 0,
        completed: interviews.find(i => i.status === 'completed')?._count.status || 0,
        cancelled: interviews.find(i => i.status === 'cancelled')?._count.status || 0,
        today: todayInterviews
      },

      offers: {
        total: offers.reduce((sum, o) => sum + o._count.status, 0),
        sent: offers.find(o => o.status === 'sent')?._count.status || 0,
        accepted: offers.find(o => o.status === 'accepted')?._count.status || 0,
        rejected: offers.find(o => o.status === 'rejected')?._count.status || 0,
        pending: offers.find(o => o.status === 'pending')?._count.status || 0
      },

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
    res.status(500).json({
      error: 'Dashboard Error',
      message: error.message
    });
  }
}

module.exports = {
  getComprehensiveDashboard
};
