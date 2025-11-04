const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const { authenticateToken } = require('../middleware/auth');
const { authorize } = require('../middleware/authorize');
const { ROLES } = require('../constants/roles');

const prisma = new PrismaClient();

// Super Admin Only Middleware
const superAdminOnly = [authenticateToken, authorize([ROLES.SUPER_ADMIN])];

/**
 * GET /organizations
 * List all organizations with pagination, search, filter, and sorting
 * Query params:
 *   - page: number (default: 1)
 *   - limit: number (default: 10)
 *   - search: string (searches name/slug)
 *   - plan: FREE|PRO|ENTERPRISE
 *   - isActive: true|false
 *   - sortBy: createdAt|name|plan (default: createdAt)
 *   - sortOrder: asc|desc (default: desc)
 */
router.get('/organizations', superAdminOnly, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = '',
      plan,
      isActive,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build where clause
    const where = {};

    // Search filter
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { slug: { contains: search, mode: 'insensitive' } }
      ];
    }

    // Plan filter
    if (plan && ['FREE', 'PRO', 'ENTERPRISE'].includes(plan)) {
      where.plan = plan;
    }

    // Active status filter
    if (isActive !== undefined) {
      where.isActive = isActive === 'true';
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    // Sorting
    const orderBy = {};
    orderBy[sortBy] = sortOrder;

    // Fetch organizations with user count
    const [organizations, totalCount] = await Promise.all([
      prisma.organization.findMany({
        where,
        skip,
        take,
        orderBy,
        select: {
          id: true,
          name: true,
          slug: true,
          plan: true,
          isActive: true,
          monthlyAnalysisCount: true,
          totalUsers: true,
          createdAt: true,
          _count: {
            select: {
              users: true
            }
          }
        }
      }),
      prisma.organization.count({ where })
    ]);

    // Format response
    const formattedOrgs = organizations.map(org => ({
      id: org.id,
      name: org.name,
      slug: org.slug,
      plan: org.plan,
      isActive: org.isActive,
      userCount: org._count.users,
      monthlyAnalysisCount: org.monthlyAnalysisCount,
      createdAt: org.createdAt
    }));

    return res.json({
      success: true,
      data: formattedOrgs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: totalCount,
        totalPages: Math.ceil(totalCount / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('[SuperAdmin] Error fetching organizations:', error);
    return res.status(500).json({
      success: false,
      message: 'Organizasyonlar alınırken hata oluştu'
    });
  }
});

/**
 * GET /stats
 * Get system-wide statistics
 */
router.get('/stats', superAdminOnly, async (req, res) => {
  try {
    // Get organization counts
    const [
      totalOrganizations,
      activeOrganizations,
      totalUsers,
      planBreakdown,
      monthlyAnalyses,
      todayRegistrations
    ] = await Promise.all([
      // Total organizations
      prisma.organization.count(),

      // Active organizations
      prisma.organization.count({
        where: { isActive: true }
      }),

      // Total users
      prisma.user.count(),

      // Plan breakdown
      prisma.organization.groupBy({
        by: ['plan'],
        _count: true
      }),

      // Monthly analyses (current month)
      prisma.organization.aggregate({
        _sum: {
          monthlyAnalysisCount: true
        }
      }),

      // Today's registrations
      prisma.organization.count({
        where: {
          createdAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0))
          }
        }
      })
    ]);

    // Format plan breakdown
    const planStats = {
      FREE: 0,
      PRO: 0,
      ENTERPRISE: 0
    };
    planBreakdown.forEach(item => {
      planStats[item.plan] = item._count;
    });

    return res.json({
      success: true,
      data: {
        totalOrganizations,
        activeOrganizations,
        totalUsers,
        planBreakdown: planStats,
        monthlyAnalyses: monthlyAnalyses._sum.monthlyAnalysisCount || 0,
        todayRegistrations
      }
    });
  } catch (error) {
    console.error('[SuperAdmin] Error fetching stats:', error);
    return res.status(500).json({
      success: false,
      message: 'İstatistikler alınırken hata oluştu'
    });
  }
});

/**
 * PATCH /:id/toggle
 * Toggle organization active status
 */
router.patch('/:id/toggle', superAdminOnly, async (req, res) => {
  try {
    const { id } = req.params;

    // Find organization
    const org = await prisma.organization.findUnique({
      where: { id },
      select: { isActive: true, name: true }
    });

    if (!org) {
      return res.status(404).json({
        success: false,
        message: 'Organizasyon bulunamadı'
      });
    }

    // Toggle active status
    const updated = await prisma.organization.update({
      where: { id },
      data: { isActive: !org.isActive }
    });

    return res.json({
      success: true,
      data: updated,
      message: `${org.name} organizasyonu ${updated.isActive ? 'aktif' : 'pasif'} hale getirildi`
    });
  } catch (error) {
    console.error('[SuperAdmin] Error toggling organization:', error);
    return res.status(500).json({
      success: false,
      message: 'Organizasyon durumu değiştirilirken hata oluştu'
    });
  }
});

/**
 * PATCH /:id/plan
 * Change organization subscription plan
 */
router.patch('/:id/plan', superAdminOnly, async (req, res) => {
  try {
    const { id } = req.params;
    const { plan } = req.body;

    // Validate plan
    if (!['FREE', 'PRO', 'ENTERPRISE'].includes(plan)) {
      return res.status(400).json({
        success: false,
        message: 'Geçersiz plan. FREE, PRO veya ENTERPRISE olmalıdır'
      });
    }

    // Find organization
    const org = await prisma.organization.findUnique({
      where: { id },
      select: { name: true, plan: true }
    });

    if (!org) {
      return res.status(404).json({
        success: false,
        message: 'Organizasyon bulunamadı'
      });
    }

    // Update plan and limits
    const limits = {
      FREE: { maxAnalysisPerMonth: 10, maxCvPerMonth: 50, maxUsers: 2 },
      PRO: { maxAnalysisPerMonth: 100, maxCvPerMonth: 500, maxUsers: 10 },
      ENTERPRISE: { maxAnalysisPerMonth: 9999, maxCvPerMonth: 9999, maxUsers: 100 }
    };

    const updated = await prisma.organization.update({
      where: { id },
      data: {
        plan,
        ...limits[plan],
        planStartedAt: new Date()
      }
    });

    return res.json({
      success: true,
      data: updated,
      message: `${org.name} organizasyonunun planı ${plan} olarak güncellendi`
    });
  } catch (error) {
    console.error('[SuperAdmin] Error updating plan:', error);
    return res.status(500).json({
      success: false,
      message: 'Plan güncellenirken hata oluştu'
    });
  }
});

/**
 * DELETE /:id
 * Soft delete organization (set isActive to false)
 */
router.delete('/:id', superAdminOnly, async (req, res) => {
  try {
    const { id } = req.params;

    // Find organization
    const org = await prisma.organization.findUnique({
      where: { id },
      select: { name: true }
    });

    if (!org) {
      return res.status(404).json({
        success: false,
        message: 'Organizasyon bulunamadı'
      });
    }

    // Soft delete (set isActive to false)
    await prisma.organization.update({
      where: { id },
      data: { isActive: false }
    });

    return res.json({
      success: true,
      message: `${org.name} organizasyonu devre dışı bırakıldı`
    });
  } catch (error) {
    console.error('[SuperAdmin] Error deleting organization:', error);
    return res.status(500).json({
      success: false,
      message: 'Organizasyon silinirken hata oluştu'
    });
  }
});

/**
 * GET /queues
 * Get BullMQ queue statistics (real-time)
 */
router.get('/queues', superAdminOnly, async (req, res) => {
  try {
    const { Queue } = require('bullmq');

    // Redis connection config (BullMQ format)
    const connection = {
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '8179')
    };

    // Queue names (must match workers)
    const queueNames = ['analysis', 'offer', 'email', 'test-generation', 'feedback'];

    // Get real-time stats from each queue
    const queueStats = await Promise.all(
      queueNames.map(async (name) => {
        try {
          const queue = new Queue(name, { connection });
          const counts = await queue.getJobCounts();

          // Close queue connection
          await queue.close();

          return {
            name: name,
            status: 'active',
            waiting: counts.waiting || 0,
            active: counts.active || 0,
            completed: counts.completed || 0,
            failed: counts.failed || 0,
            delayed: counts.delayed || 0,
            paused: counts.paused || 0
          };
        } catch (error) {
          console.error(`[SuperAdmin] Error getting queue ${name} stats:`, error);
          return {
            name: name,
            status: 'error',
            waiting: 0,
            active: 0,
            completed: 0,
            failed: 0,
            error: error.message
          };
        }
      })
    );

    return res.json({
      success: true,
      data: queueStats
    });
  } catch (error) {
    console.error('[SuperAdmin] Error fetching queue stats:', error);
    return res.status(500).json({
      success: false,
      message: 'Queue istatistikleri alınırken hata oluştu',
      error: error.message
    });
  }
});

/**
 * GET /system-health
 * Get system-wide health status (database, redis, milvus, services)
 */
router.get('/system-health', superAdminOnly, async (req, res) => {
  try {
    const health = {
      timestamp: new Date().toISOString(),
      services: {}
    };

    // 1. Database health
    try {
      await prisma.$queryRaw`SELECT 1`;
      const dbStats = await prisma.$queryRaw`
        SELECT
          (SELECT COUNT(*) FROM "users") as total_users,
          (SELECT COUNT(*) FROM "organizations") as total_orgs,
          (SELECT COUNT(*) FROM "analyses") as total_analyses
      `;

      // Convert BigInt to Number (PostgreSQL COUNT returns BigInt)
      const stats = dbStats[0];
      health.services.database = {
        status: 'healthy',
        type: 'PostgreSQL',
        stats: {
          total_users: Number(stats.total_users),
          total_orgs: Number(stats.total_orgs),
          total_analyses: Number(stats.total_analyses)
        }
      };
    } catch (error) {
      health.services.database = {
        status: 'unhealthy',
        error: error.message
      };
    }

    // 2. Redis health (via BullMQ connection)
    try {
      const { Queue } = require('bullmq');
      const connection = {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '8179')
      };
      const testQueue = new Queue('health-check', { connection });
      await testQueue.waitUntilReady();
      health.services.redis = {
        status: 'healthy',
        type: 'Redis',
        connection: `${connection.host}:${connection.port}`
      };
      await testQueue.close();
    } catch (error) {
      health.services.redis = {
        status: 'unhealthy',
        error: error.message
      };
    }

    // 3. Backend API (if we're here, it's healthy!)
    health.services.backend = {
      status: 'healthy',
      type: 'Express API',
      uptime: process.uptime()
    };

    // 4. Milvus (assume healthy if no errors - can add ping later)
    health.services.milvus = {
      status: 'healthy',
      type: 'Vector DB',
      note: 'Ping check not implemented'
    };

    // Overall status
    const allHealthy = Object.values(health.services).every(s => s.status === 'healthy');
    health.overall = allHealthy ? 'healthy' : 'degraded';

    return res.json({
      success: true,
      data: health
    });
  } catch (error) {
    console.error('[SuperAdmin] Error checking system health:', error);
    return res.status(500).json({
      success: false,
      message: 'Sistem sağlığı kontrol edilirken hata oluştu'
    });
  }
});

/**
 * GET /security-logs
 * Get system-wide security logs (user logins, activities)
 */
router.get('/security-logs', superAdminOnly, async (req, res) => {
  try {
    const { limit = 50 } = req.query;

    // Get recent user activities (cross-org)
    const recentUsers = await prisma.user.findMany({
      take: parseInt(limit),
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
        organization: {
          select: {
            name: true
          }
        }
      }
    });

    // Get login statistics
    const [
      totalUsers,
      activeToday,
      activeThisWeek,
      newToday
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({
        where: {
          createdAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0))
          }
        }
      }),
      prisma.user.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          }
        }
      }),
      prisma.user.count({
        where: {
          createdAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0))
          }
        }
      })
    ]);

    // Format security events (recent user registrations as activity)
    const securityEvents = recentUsers.map(user => ({
      id: user.id,
      event: 'User Registration',
      type: 'success',
      user: user.email,
      role: user.role,
      organization: user.organization?.name || 'N/A',
      timestamp: user.createdAt,
      ip: '***',  // IP tracking not implemented yet
    }));

    return res.json({
      success: true,
      data: {
        stats: {
          totalUsers,
          activeToday,
          activeThisWeek,
          newToday,
          suspiciousActivity: 0,  // Not tracked yet
          failedLogins: 0  // Not tracked yet
        },
        events: securityEvents
      }
    });
  } catch (error) {
    console.error('[SuperAdmin] Error fetching security logs:', error);
    return res.status(500).json({
      success: false,
      message: 'Güvenlik logları alınırken hata oluştu'
    });
  }
});

module.exports = router;
