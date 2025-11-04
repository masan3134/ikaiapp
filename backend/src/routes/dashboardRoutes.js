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
    const userId = req.user.userId;

    // Profile completion
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        bio: true,
        avatar: true,
      }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Kullanıcı bulunamadı'
      });
    }

    const fields = ['firstName', 'lastName', 'email', 'phone', 'bio', 'avatar'];
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

module.exports = router;
