const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

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
router.get('/organizations', async (req, res) => {
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
router.get('/stats', async (req, res) => {
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
router.patch('/:id/toggle', async (req, res) => {
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
router.patch('/:id/plan', async (req, res) => {
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
router.delete('/:id', async (req, res) => {
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

module.exports = router;
