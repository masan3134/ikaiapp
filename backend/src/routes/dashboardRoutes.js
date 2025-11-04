const express = require('express');
const { getDashboardStats, getManagerDashboard } = require('../controllers/dashboardController');
const { authenticateToken } = require('../middleware/auth');
const { enforceOrganizationIsolation } = require('../middleware/organizationIsolation');
const { authorize } = require('../middleware/authorize');
const { ROLE_GROUPS } = require('../constants/roles');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const router = express.Router();

router.get(
  '/stats',
  authenticateToken,
  enforceOrganizationIsolation,
  authorize(['ADMIN', 'MANAGER', 'SUPER_ADMIN']),
  getDashboardStats
);

// GET /api/v1/dashboard/user
// Get USER dashboard data
router.get('/user', [
  authenticateToken,
  enforceOrganizationIsolation,
  authorize(['USER', 'HR_SPECIALIST', 'MANAGER', 'ADMIN', 'SUPER_ADMIN'])
], async (req, res) => {
  try {
    const userId = req.user.id;

    // Profile completion
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        firstName: true,
        lastName: true,
        email: true,
        avatar: true,
        position: true,
      }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Kullanıcı bulunamadı'
      });
    }

    const fields = ['firstName', 'lastName', 'email', 'avatar', 'position'];
    const completedFields = fields.filter(f => user[f]).length;
    const profileCompletion = Math.round((completedFields / fields.length) * 100);

    // Notifications
    const unreadNotifications = await prisma.notification.count({
      where: { userId, read: false }
    });

    const recentNotifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 5
    });

    // Activity (mock for now - implement session tracking later)
    const activity = {
      loginTime: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
      onlineTime: '2sa 15dk',
      pageViews: 12
    };

    // Activity timeline (last 7 days - mock data)
    const activityTimeline = [
      { date: 'Pzt', duration: 45, logins: 2 },
      { date: 'Sal', duration: 120, logins: 5 },
      { date: 'Çar', duration: 90, logins: 3 },
      { date: 'Per', duration: 150, logins: 6 },
      { date: 'Cum', duration: 60, logins: 2 },
      { date: 'Cmt', duration: 30, logins: 1 },
      { date: 'Paz', duration: 20, logins: 1 },
    ];

    res.json({
      success: true,
      data: {
        profile: {
          completion: profileCompletion,
          missingFields: fields.length - completedFields
        },
        notifications: {
          unread: unreadNotifications,
          latest: recentNotifications[0] || null
        },
        activity,
        recentNotifications,
        activityTimeline
      }
    });
  } catch (error) {
    console.error('[DASHBOARD] USER error:', error);
    res.status(500).json({
      success: false,
      message: 'Dashboard verileri alınırken hata oluştu'
    });
  }
});

// GET /api/v1/dashboard/hr-specialist
// Get HR_SPECIALIST dashboard data (recruitment focus)
router.get('/hr-specialist', [
  authenticateToken,
  enforceOrganizationIsolation,
  authorize(ROLE_GROUPS.HR_MANAGERS)
], async (req, res) => {
  try {
    const organizationId = req.organizationId;
    const now = new Date();

    // Date ranges
    const todayStart = new Date(now.setHours(0, 0, 0, 0));
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - 7);
    const monthStart = new Date();
    monthStart.setMonth(monthStart.getMonth() - 1);

    // Active job postings
    const activePostings = await prisma.jobPosting.count({
      where: {
        organizationId,
        status: 'ACTIVE'
      }
    });

    // Today's CV uploads (candidates)
    const todayCVs = await prisma.candidate.count({
      where: {
        organizationId,
        createdAt: { gte: todayStart }
      }
    });

    // Today's applications
    const todayApplications = await prisma.candidate.count({
      where: {
        organizationId,
        createdAt: { gte: todayStart }
      }
    });

    // This week's CVs and analyses
    const weekCVs = await prisma.candidate.count({
      where: {
        organizationId,
        createdAt: { gte: weekStart }
      }
    });

    const weekAnalyses = await prisma.analysis.count({
      where: {
        organizationId,
        createdAt: { gte: weekStart }
      }
    });

    // This week analyses for overview
    const thisWeekAnalyses = weekAnalyses;

    // CV Analytics
    const avgScore = 75; // Mock - calculate from actual analyses
    const pendingCVs = await prisma.candidate.count({
      where: {
        organizationId,
        status: 'PENDING'
      }
    });

    // Recent analyses (last 5)
    const recentAnalyses = await prisma.analysis.findMany({
      where: { organizationId },
      include: {
        jobPosting: {
          select: { title: true }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 5
    });

    // Format recent analyses
    const formattedAnalyses = recentAnalyses.map(analysis => ({
      id: analysis.id,
      createdAt: analysis.createdAt,
      jobPosting: { title: analysis.jobPosting.title },
      candidateCount: analysis.candidateCount || 0,
      topScore: analysis.topScore || 0
    }));

    // Hiring pipeline (mock data - implement with candidate statuses later)
    const pipeline = [
      { stage: 'Başvurular', count: weekCVs, percentage: 100 },
      { stage: 'Eleme', count: Math.floor(weekCVs * 0.7), percentage: 70 },
      { stage: 'Mülakat', count: Math.floor(weekCVs * 0.4), percentage: 40 },
      { stage: 'Teklif', count: Math.floor(weekCVs * 0.2), percentage: 20 },
      { stage: 'İşe Alım', count: Math.floor(weekCVs * 0.15), percentage: 15 }
    ];

    // Pending interviews
    const interviews = await prisma.interview.findMany({
      where: {
        organizationId,
        status: 'SCHEDULED',
        scheduledAt: { gte: now }
      },
      include: {
        candidate: {
          select: { name: true }
        },
        jobPosting: {
          select: { title: true }
        }
      },
      orderBy: { scheduledAt: 'asc' },
      take: 5
    });

    // Monthly stats
    const monthlyStats = {
      applications: weekCVs * 4, // Approximate
      applicationsChange: 12,
      analyses: weekAnalyses * 4,
      analysesChange: 8,
      interviews: interviews.length * 4,
      interviewsChange: 15,
      offers: Math.floor(weekCVs * 0.2 * 4),
      offersChange: 10,
      hires: Math.floor(weekCVs * 0.15 * 4),
      hiresChange: 5,
      conversionRate: 15,
      conversionChange: 3
    };

    res.json({
      success: true,
      data: {
        overview: {
          activePostings,
          todayCVs,
          thisWeekAnalyses
        },
        jobPostings: {
          activePostings,
          todayApplications
        },
        cvAnalytics: {
          weekCVs,
          weekAnalyses,
          avgScore,
          pendingCVs
        },
        recentAnalyses: formattedAnalyses,
        pipeline,
        interviews,
        monthlyStats
      }
    });
  } catch (error) {
    console.error('[DASHBOARD] HR_SPECIALIST error:', error);
    res.status(500).json({
      success: false,
      message: 'Dashboard verileri alınırken hata oluştu'
    });
  }
});

// GET /api/v1/dashboard/manager
// Get MANAGER dashboard data (team & department analytics focus)
router.get('/manager', [
  authenticateToken,
  enforceOrganizationIsolation,
  authorize(ROLE_GROUPS.MANAGERS_PLUS)
], getManagerDashboard);

// GET /api/v1/dashboard/super-admin
// Get SUPER_ADMIN dashboard data (platform-wide analytics)
// NOTE: No organizationIsolation - SUPER_ADMIN sees ALL organizations
router.get('/super-admin', [
  authenticateToken,
  authorize(['SUPER_ADMIN'])
], async (req, res) => {
  try {
    // Multi-org overview
    const totalOrganizations = await prisma.organization.count();
    const planCounts = await prisma.organization.groupBy({
      by: ['plan'],
      _count: true
    });

    // Active organizations
    const activeOrganizations = await prisma.organization.count({
      where: { isActive: true }
    });

    // Revenue calculation (mock - implement actual pricing later)
    const proPlanCount = planCounts.find(p => p.plan === 'PRO')?._count || 0;
    const enterpriseCount = planCounts.find(p => p.plan === 'ENTERPRISE')?._count || 0;

    const revenue = {
      mrr: (proPlanCount * 99) + (enterpriseCount * 999), // Mock pricing
      mrrGrowth: 12,
      avgLTV: 5000,
      enterprise: enterpriseCount * 999,
      pro: proPlanCount * 99
    };

    // Platform analytics
    const totalAnalyses = await prisma.analysis.count();
    const totalCVs = await prisma.candidate.count();
    const totalJobPostings = await prisma.jobPosting.count();
    const totalOffers = await prisma.offer.count();
    const totalUsers = await prisma.user.count();

    const analytics = {
      totalAnalyses,
      totalCVs,
      totalJobPostings,
      totalOffers,
      analysesGrowth: 15,
      cvsGrowth: 20,
      jobsGrowth: 10,
      offersGrowth: 8
    };

    // Growth data (90 days - mock data for now)
    const growthData = {
      chartData: [
        { date: '01-08', organizations: 10, users: 50, revenue: 5000, activity: 100 },
        { date: '15-08', organizations: 12, users: 65, revenue: 6500, activity: 150 },
        { date: '01-09', organizations: 15, users: 80, revenue: 8000, activity: 200 },
        { date: '15-09', organizations: 18, users: 95, revenue: 9500, activity: 250 },
        { date: '01-10', organizations: 20, users: 110, revenue: 11000, activity: 300 },
        { date: '15-10', organizations: 22, users: 125, revenue: 12500, activity: 350 },
        { date: '01-11', organizations: totalOrganizations, users: totalUsers, revenue: revenue.mrr, activity: 400 }
      ],
      metrics: {
        orgGrowth: 15,
        userGrowth: 25,
        revenueGrowth: 12,
        activityGrowth: 30
      }
    };

    // System health
    const systemHealth = {
      backend: 'healthy',
      database: 'healthy',
      redis: 'healthy',
      milvus: 'healthy',
      queues: 'healthy',
      uptime: 99.9,
      apiResponseTime: 180,
      dbConnections: 15,
      cacheHitRate: 85,
      vectorCount: totalAnalyses,
      queueJobs: 5
    };

    // Organization list
    const orgList = await prisma.organization.findMany({
      select: {
        id: true,
        name: true,
        plan: true,
        isActive: true,
        createdAt: true,
        _count: {
          select: {
            users: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 10
    });

    // Format org list
    const formattedOrgList = orgList.map(org => ({
      id: org.id,
      name: org.name,
      plan: org.plan,
      totalUsers: org._count.users,
      createdAt: org.createdAt,
      isActive: org.isActive
    }));

    // Queue stats (mock - implement BullMQ monitoring later)
    const queueStats = [
      { name: 'CV Analysis', status: 'active', waiting: 3, active: 2, completed: 150, failed: 1 },
      { name: 'Email Sending', status: 'active', waiting: 5, active: 1, completed: 200, failed: 0 },
      { name: 'Offer Generation', status: 'active', waiting: 0, active: 0, completed: 50, failed: 0 },
      { name: 'AI Test Creation', status: 'active', waiting: 1, active: 1, completed: 75, failed: 2 },
      { name: 'Feedback Processing', status: 'active', waiting: 2, active: 0, completed: 100, failed: 0 }
    ];

    // Security monitoring (mock - implement actual security logging later)
    const security = {
      securityScore: 95,
      failedLogins: 3,
      suspiciousActivity: 0,
      rateLimitHits: 12,
      lastEvent: '2 failed login attempts from 192.168.1.100 (30m ago)'
    };

    res.json({
      success: true,
      data: {
        overview: {
          totalOrganizations,
          monthlyRevenue: revenue.mrr,
          totalUsers,
          uptime: systemHealth.uptime,
          activeAnalyses: totalAnalyses
        },
        organizations: {
          total: totalOrganizations,
          planCounts,
          activeOrgs: activeOrganizations,
          churnedOrgs: totalOrganizations - activeOrganizations
        },
        revenue,
        analytics,
        growth: growthData,
        systemHealth,
        orgList: formattedOrgList,
        queues: queueStats,
        security
      }
    });
  } catch (error) {
    console.error('[DASHBOARD] SUPER_ADMIN error:', error);
    res.status(500).json({
      success: false,
      message: 'Dashboard verileri alınırken hata'
    });
  }
});

module.exports = router;
