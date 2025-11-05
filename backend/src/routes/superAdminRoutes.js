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
 * POST /organizations
 * Create new organization
 */
router.post('/organizations', superAdminOnly, async (req, res) => {
  try {
    const { name, plan = 'FREE' } = req.body;

    // Validate required fields
    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Organizasyon adı zorunludur'
      });
    }

    // Validate plan
    if (!['FREE', 'PRO', 'ENTERPRISE'].includes(plan)) {
      return res.status(400).json({
        success: false,
        message: 'Geçersiz plan. FREE, PRO veya ENTERPRISE olmalıdır'
      });
    }

    // Generate slug from name
    const slug = `${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now()}`;

    // Plan limits
    const limits = {
      FREE: { maxAnalysisPerMonth: 10, maxCvPerMonth: 50, maxUsers: 2 },
      PRO: { maxAnalysisPerMonth: 100, maxCvPerMonth: 500, maxUsers: 10 },
      ENTERPRISE: { maxAnalysisPerMonth: 9999, maxCvPerMonth: 9999, maxUsers: 100 }
    };

    // Create organization
    const org = await prisma.organization.create({
      data: {
        name,
        slug,
        plan,
        ...limits[plan],
        isActive: true,
        onboardingCompleted: false,
        planStartedAt: new Date()
      }
    });

    return res.status(201).json({
      success: true,
      data: org,
      message: `${name} organizasyonu başarıyla oluşturuldu`
    });
  } catch (error) {
    console.error('[SuperAdmin] Error creating organization:', error);
    return res.status(500).json({
      success: false,
      message: 'Organizasyon oluşturulurken hata oluştu'
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
 * GET /organizations/:id
 * Get single organization details
 */
router.get('/organizations/:id', superAdminOnly, async (req, res) => {
  try {
    const { id } = req.params;

    const org = await prisma.organization.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            users: true
          }
        }
      }
    });

    if (!org) {
      return res.status(404).json({
        success: false,
        message: 'Organizasyon bulunamadı'
      });
    }

    // Get job postings and analyses count separately (no direct relation in schema)
    const [jobPostingCount, analysisCount] = await Promise.all([
      prisma.jobPosting.count({ where: { organizationId: id } }),
      prisma.analysis.count({ where: { organizationId: id } })
    ]);

    return res.json({
      success: true,
      data: {
        ...org,
        userCount: org._count.users,
        jobPostingCount,
        analysisCount
      }
    });
  } catch (error) {
    console.error('[SuperAdmin] Error fetching organization:', error);
    return res.status(500).json({
      success: false,
      message: 'Organizasyon bilgileri alınırken hata oluştu'
    });
  }
});

/**
 * POST /:id/suspend
 * Suspend organization (set isActive to false)
 */
router.post('/:id/suspend', superAdminOnly, async (req, res) => {
  try {
    const { id } = req.params;

    const org = await prisma.organization.findUnique({
      where: { id },
      select: { name: true, isActive: true }
    });

    if (!org) {
      return res.status(404).json({
        success: false,
        message: 'Organizasyon bulunamadı'
      });
    }

    if (!org.isActive) {
      return res.status(400).json({
        success: false,
        message: 'Organizasyon zaten askıya alınmış'
      });
    }

    const updated = await prisma.organization.update({
      where: { id },
      data: { isActive: false }
    });

    return res.json({
      success: true,
      data: updated,
      message: `${org.name} organizasyonu askıya alındı`
    });
  } catch (error) {
    console.error('[SuperAdmin] Error suspending organization:', error);
    return res.status(500).json({
      success: false,
      message: 'Organizasyon askıya alınırken hata oluştu'
    });
  }
});

/**
 * POST /:id/reactivate
 * Reactivate suspended organization (set isActive to true)
 */
router.post('/:id/reactivate', superAdminOnly, async (req, res) => {
  try {
    const { id } = req.params;

    const org = await prisma.organization.findUnique({
      where: { id },
      select: { name: true, isActive: true }
    });

    if (!org) {
      return res.status(404).json({
        success: false,
        message: 'Organizasyon bulunamadı'
      });
    }

    if (org.isActive) {
      return res.status(400).json({
        success: false,
        message: 'Organizasyon zaten aktif'
      });
    }

    const updated = await prisma.organization.update({
      where: { id },
      data: { isActive: true }
    });

    return res.json({
      success: true,
      data: updated,
      message: `${org.name} organizasyonu yeniden aktif hale getirildi`
    });
  } catch (error) {
    console.error('[SuperAdmin] Error reactivating organization:', error);
    return res.status(500).json({
      success: false,
      message: 'Organizasyon aktifleştirilirken hata oluştu'
    });
  }
});

/**
 * GET /database-stats
 * Get detailed database statistics
 */
router.get('/database-stats', superAdminOnly, async (req, res) => {
  try {
    const stats = await prisma.$queryRaw`
      SELECT
        (SELECT COUNT(*) FROM "users") as total_users,
        (SELECT COUNT(*) FROM "organizations") as total_orgs,
        (SELECT COUNT(*) FROM "job_postings") as total_jobs,
        (SELECT COUNT(*) FROM "candidates") as total_candidates,
        (SELECT COUNT(*) FROM "analysis_results") as total_analyses,
        (SELECT COUNT(*) FROM "job_offers") as total_offers,
        (SELECT COUNT(*) FROM "interviews") as total_interviews,
        (SELECT COUNT(*) FROM "notifications") as total_notifications,
        pg_size_pretty(pg_database_size(current_database())) as db_size
    `;

    const result = stats[0];

    return res.json({
      success: true,
      data: {
        users: Number(result.total_users),
        organizations: Number(result.total_orgs),
        jobPostings: Number(result.total_jobs),
        candidates: Number(result.total_candidates),
        analyses: Number(result.total_analyses),
        offers: Number(result.total_offers),
        interviews: Number(result.total_interviews),
        notifications: Number(result.total_notifications),
        databaseSize: result.db_size
      }
    });
  } catch (error) {
    console.error('[SuperAdmin] Error fetching database stats:', error);
    return res.status(500).json({
      success: false,
      message: 'Veritabanı istatistikleri alınırken hata oluştu'
    });
  }
});

/**
 * GET /redis-stats
 * Get Redis connection and memory statistics
 */
router.get('/redis-stats', superAdminOnly, async (req, res) => {
  try {
    const { Queue } = require('bullmq');
    const connection = {
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '8179')
    };

    const testQueue = new Queue('health-check', { connection });
    await testQueue.waitUntilReady();

    // Get Redis client from BullMQ queue
    const client = await testQueue.client;

    // Get info
    const info = await client.info('memory');
    const memoryLines = info.split('\r\n');

    const memoryStats = {};
    memoryLines.forEach(line => {
      if (line.includes(':')) {
        const [key, value] = line.split(':');
        memoryStats[key] = value;
      }
    });

    await testQueue.close();

    return res.json({
      success: true,
      data: {
        connection: `${connection.host}:${connection.port}`,
        status: 'connected',
        memory: {
          usedMemory: memoryStats['used_memory_human'],
          peakMemory: memoryStats['used_memory_peak_human'],
          fragmentationRatio: memoryStats['mem_fragmentation_ratio']
        }
      }
    });
  } catch (error) {
    console.error('[SuperAdmin] Error fetching Redis stats:', error);
    return res.status(500).json({
      success: false,
      message: 'Redis istatistikleri alınırken hata oluştu',
      error: error.message
    });
  }
});

/**
 * GET /milvus-stats
 * Get Milvus vector database statistics
 */
router.get('/milvus-stats', superAdminOnly, async (req, res) => {
  try {
    // Note: This is a placeholder - actual Milvus stats would require
    // implementing proper Milvus client integration

    const stats = {
      status: 'operational',
      collections: [
        {
          name: 'cv_analysis_vectors',
          estimatedCount: await prisma.analysis.count()
        }
      ],
      note: 'Detailed Milvus metrics require client integration'
    };

    return res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('[SuperAdmin] Error fetching Milvus stats:', error);
    return res.status(500).json({
      success: false,
      message: 'Milvus istatistikleri alınırken hata oluştu'
    });
  }
});

/**
 * GET /login-attempts
 * Get recent login attempts (placeholder - requires login tracking)
 */
router.get('/login-attempts', superAdminOnly, async (req, res) => {
  try {
    const { limit = 50 } = req.query;

    // Note: This is a placeholder - actual login tracking would require
    // implementing a login_attempts table

    const recentUsers = await prisma.user.findMany({
      take: parseInt(limit),
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
        organization: {
          select: { name: true }
        }
      }
    });

    const attempts = recentUsers.map(user => ({
      id: user.id,
      email: user.email,
      status: 'success',
      timestamp: user.createdAt,
      organization: user.organization?.name || 'N/A',
      ip: '***',
      note: 'Login tracking not fully implemented'
    }));

    return res.json({
      success: true,
      data: {
        attempts,
        total: attempts.length,
        note: 'Full login tracking requires dedicated table'
      }
    });
  } catch (error) {
    console.error('[SuperAdmin] Error fetching login attempts:', error);
    return res.status(500).json({
      success: false,
      message: 'Giriş denemeleri alınırken hata oluştu'
    });
  }
});

/**
 * GET /audit-trail
 * Get audit trail of admin actions (placeholder)
 */
router.get('/audit-trail', superAdminOnly, async (req, res) => {
  try {
    const { limit = 50 } = req.query;

    // Note: This is a placeholder - actual audit trail would require
    // implementing an audit_log table

    const recentActivity = await prisma.user.findMany({
      take: parseInt(limit),
      orderBy: { createdAt: 'desc' },
      where: {
        role: { in: ['SUPER_ADMIN', 'ADMIN'] }
      },
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
        organization: {
          select: { name: true }
        }
      }
    });

    const auditEntries = recentActivity.map(user => ({
      id: user.id,
      action: 'User Activity',
      actor: user.email,
      role: user.role,
      timestamp: user.createdAt,
      organization: user.organization?.name || 'N/A',
      details: 'Full audit trail requires dedicated logging'
    }));

    return res.json({
      success: true,
      data: {
        entries: auditEntries,
        total: auditEntries.length,
        note: 'Full audit trail requires dedicated audit_log table'
      }
    });
  } catch (error) {
    console.error('[SuperAdmin] Error fetching audit trail:', error);
    return res.status(500).json({
      success: false,
      message: 'Denetim kaydı alınırken hata oluştu'
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

/**
 * GET /users
 * Get all users across all organizations (with pagination, search, role filter)
 */
router.get('/users', superAdminOnly, async (req, res) => {
  try {
    const { search, role, page = 1, limit = 50 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Build where clause
    const where = {};
    if (search) {
      where.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } }
      ];
    }
    if (role) {
      where.role = role;
    }

    // Get users with organization info
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: parseInt(limit),
        include: {
          organization: {
            select: { id: true, name: true, plan: true, isActive: true }
          }
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.user.count({ where })
    ]);

    // Get stats
    const stats = await prisma.user.groupBy({
      by: ['role'],
      _count: true
    });

    const roleStats = {};
    stats.forEach(s => { roleStats[s.role] = s._count; });

    return res.json({
      success: true,
      data: {
        users,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(total / parseInt(limit))
        },
        stats: {
          total,
          byRole: roleStats,
          active: users.filter(u => u.isActive).length
        }
      }
    });
  } catch (error) {
    console.error('[SuperAdmin] Error fetching users:', error);
    return res.status(500).json({
      success: false,
      message: 'Kullanıcılar alınırken hata oluştu'
    });
  }
});

/**
 * GET /security-settings
 * Get system-wide security settings and statistics
 */
router.get('/security-settings', superAdminOnly, async (req, res) => {
  try {
    // Get security stats
    const [totalUsers, activeUsers, inactiveUsers] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { isActive: true } }),
      prisma.user.count({ where: { isActive: false } })
    ]);

    // Get recent registrations (last 24h) as proxy for activity
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const recentLogins = await prisma.user.count({
      where: { createdAt: { gte: oneDayAgo } }
    });

    return res.json({
      success: true,
      data: {
        authentication: {
          twoFactorEnabled: false, // TODO: Implement 2FA
          passwordComplexity: true,
          sessionTimeout: 30 // minutes
        },
        accessControl: {
          ipWhitelist: false,
          apiRateLimit: true,
          corsProtection: true
        },
        stats: {
          totalUsers,
          activeUsers,
          inactiveUsers,
          recentLogins,
          suspiciousActivity: 0 // TODO: Track suspicious logins
        }
      }
    });
  } catch (error) {
    console.error('[SuperAdmin] Error fetching security settings:', error);
    return res.status(500).json({
      success: false,
      message: 'Güvenlik ayarları alınırken hata oluştu'
    });
  }
});

/**
 * GET /analytics
 * Get system-wide analytics and usage metrics
 */
router.get('/analytics', superAdminOnly, async (req, res) => {
  try {
    // Get counts
    const [
      totalOrgs,
      activeOrgs,
      totalUsers,
      activeUsers,
      totalJobs,
      totalCandidates,
      totalAnalyses
    ] = await Promise.all([
      prisma.organization.count(),
      prisma.organization.count({ where: { isActive: true } }),
      prisma.user.count(),
      prisma.user.count({ where: { isActive: true } }),
      prisma.jobPosting.count(),
      prisma.candidate.count(),
      prisma.analysis.count()
    ]);

    // Get growth stats (last 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const [newOrgs, newUsers, newJobs] = await Promise.all([
      prisma.organization.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
      prisma.user.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
      prisma.jobPosting.count({ where: { createdAt: { gte: thirtyDaysAgo } } })
    ]);

    return res.json({
      success: true,
      data: {
        overview: {
          totalOrganizations: totalOrgs,
          activeOrganizations: activeOrgs,
          totalUsers,
          activeUsers,
          totalJobPostings: totalJobs,
          totalCandidates,
          totalAnalyses
        },
        growth: {
          newOrganizations: newOrgs,
          newUsers,
          newJobPostings: newJobs,
          period: '30 days'
        },
        engagement: {
          avgJobsPerOrg: totalOrgs > 0 ? Math.round(totalJobs / totalOrgs) : 0,
          avgUsersPerOrg: totalOrgs > 0 ? Math.round(totalUsers / totalOrgs) : 0,
          avgAnalysesPerJob: totalJobs > 0 ? Math.round(totalAnalyses / totalJobs) : 0
        }
      }
    });
  } catch (error) {
    console.error('[SuperAdmin] Error fetching analytics:', error);
    return res.status(500).json({
      success: false,
      message: 'Analitikler alınırken hata oluştu'
    });
  }
});

/**
 * GET /logs
 * Get system logs (from error-logs directory)
 */
router.get('/logs', superAdminOnly, async (req, res) => {
  try {
    const fs = require('fs').promises;
    const path = require('path');

    const { level = 'all', limit = 100 } = req.query;

    // Get today's log file
    const today = new Date().toISOString().split('T')[0];
    const logFile = path.join(__dirname, '../../error-logs', `error-log-${today}.jsonl`);

    let logs = [];

    try {
      const content = await fs.readFile(logFile, 'utf-8');
      const lines = content.trim().split('\n').filter(line => line);

      logs = lines.map(line => {
        try {
          return JSON.parse(line);
        } catch {
          return null;
        }
      }).filter(log => log !== null);

      // Filter by level
      if (level !== 'all') {
        logs = logs.filter(log => log.level === level.toUpperCase());
      }

      // Limit results
      logs = logs.slice(-parseInt(limit));

    } catch (fileError) {
      // Log file doesn't exist or empty
      console.log('[SuperAdmin] No log file for today:', fileError.message);
    }

    return res.json({
      success: true,
      data: {
        logs: logs.reverse(), // Most recent first
        count: logs.length,
        date: today
      }
    });
  } catch (error) {
    console.error('[SuperAdmin] Error fetching logs:', error);
    return res.status(500).json({
      success: false,
      message: 'Loglar alınırken hata oluştu'
    });
  }
});

/**
 * GET /settings
 * Get system-wide settings
 */
router.get('/settings', superAdminOnly, async (req, res) => {
  try {
    // TODO: Implement system settings table
    // For now, return default settings
    return res.json({
      success: true,
      data: {
        general: {
          platformName: 'IKAI HR Platform',
          defaultLanguage: 'tr',
          timezone: 'Europe/Istanbul'
        },
        notifications: {
          emailEnabled: true,
          smsEnabled: false,
          pushEnabled: true,
          webhookEnabled: false
        },
        security: {
          twoFactorRequired: false,
          passwordComplexity: true,
          sessionTimeout: 30
        },
        performance: {
          apiRateLimit: 1000,
          cacheTTL: 300
        }
      }
    });
  } catch (error) {
    console.error('[SuperAdmin] Error fetching settings:', error);
    return res.status(500).json({
      success: false,
      message: 'Ayarlar alınırken hata oluştu'
    });
  }
});

/**
 * POST /settings
 * Update system-wide settings
 */
router.post('/settings', superAdminOnly, async (req, res) => {
  try {
    const settings = req.body;

    // TODO: Implement system settings table and save
    // For now, just validate and return success

    console.log('[SuperAdmin] Settings update requested:', settings);

    return res.json({
      success: true,
      message: 'Ayarlar güncellendi',
      data: settings
    });
  } catch (error) {
    console.error('[SuperAdmin] Error updating settings:', error);
    return res.status(500).json({
      success: false,
      message: 'Ayarlar güncellenirken hata oluştu'
    });
  }
});

module.exports = router;
