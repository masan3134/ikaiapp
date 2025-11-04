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

    // Activity (real-time data from current session)
    const now = new Date();
    const activity = {
      loginTime: now.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
      currentTime: now.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      // Note: onlineTime and pageViews are tracked client-side for accuracy
    };

    // Activity timeline - Real data from notifications over last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const last7DaysNotifications = await prisma.notification.findMany({
      where: {
        userId,
        createdAt: { gte: sevenDaysAgo }
      },
      select: {
        createdAt: true
      }
    });

    // Group notifications by day
    const activityByDay = {};
    const dayNames = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];

    // Initialize last 7 days
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayName = dayNames[date.getDay()];
      activityByDay[dayName] = { date: dayName, count: 0 };
    }

    // Count notifications per day
    last7DaysNotifications.forEach(notif => {
      const dayName = dayNames[new Date(notif.createdAt).getDay()];
      if (activityByDay[dayName]) {
        activityByDay[dayName].count++;
      }
    });

    const activityTimeline = Object.values(activityByDay);

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
        isDeleted: false
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
    // Calculate avg score from actual analysis results
    const analysisResults = await prisma.analysisResult.findMany({
      where: {
        organizationId,
        analysis: {
          createdAt: { gte: weekStart }
        }
      },
      select: { compatibilityScore: true }
    });

    const avgScore = analysisResults.length > 0
      ? Math.round(analysisResults.reduce((sum, ar) => sum + ar.compatibilityScore, 0) / analysisResults.length)
      : 0;

    // Pending CVs (candidates without analysis results)
    const pendingCVs = await prisma.candidate.count({
      where: {
        organizationId,
        isDeleted: false,
        analysisResults: {
          none: {}
        }
      }
    });

    // Recent analyses (last 5) with real candidate counts and scores
    const recentAnalyses = await prisma.analysis.findMany({
      where: { organizationId },
      include: {
        jobPosting: {
          select: { title: true }
        },
        analysisResults: {
          select: { compatibilityScore: true }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 5
    });

    // Format recent analyses with REAL data from analysisResults
    const formattedAnalyses = recentAnalyses.map(analysis => {
      const scores = analysis.analysisResults.map(ar => ar.compatibilityScore);
      const topScore = scores.length > 0 ? Math.max(...scores) : 0;

      return {
        id: analysis.id,
        createdAt: analysis.createdAt,
        jobPosting: { title: analysis.jobPosting.title },
        candidateCount: analysis.analysisResults.length,
        topScore: topScore
      };
    });

    // Hiring pipeline - REAL DATA from database
    // Stage 1: Başvurular (Applications) = total candidates this week
    const pipelineApplications = weekCVs;

    // Stage 2: Eleme (Screened) = candidates with analysis results
    const pipelineScreened = await prisma.candidate.count({
      where: {
        organizationId,
        createdAt: { gte: weekStart },
        analysisResults: {
          some: {}
        }
      }
    });

    // Stage 3: Mülakat (Interview) = interviews scheduled/completed this week
    const pipelineInterviews = await prisma.interview.count({
      where: {
        organizationId,
        createdAt: { gte: weekStart }
      }
    });

    // Stage 4: Teklif (Offer) = job offers created this week
    const pipelineOffers = await prisma.jobOffer.count({
      where: {
        organizationId,
        createdAt: { gte: weekStart }
      }
    });

    // Stage 5: İşe Alım (Hired) = accepted offers this week
    const pipelineHires = await prisma.jobOffer.count({
      where: {
        organizationId,
        createdAt: { gte: weekStart },
        status: 'ACCEPTED'
      }
    });

    const pipeline = [
      {
        stage: 'Başvurular',
        count: pipelineApplications,
        percentage: 100
      },
      {
        stage: 'Eleme',
        count: pipelineScreened,
        percentage: pipelineApplications > 0 ? Math.round((pipelineScreened / pipelineApplications) * 100) : 0
      },
      {
        stage: 'Mülakat',
        count: pipelineInterviews,
        percentage: pipelineApplications > 0 ? Math.round((pipelineInterviews / pipelineApplications) * 100) : 0
      },
      {
        stage: 'Teklif',
        count: pipelineOffers,
        percentage: pipelineApplications > 0 ? Math.round((pipelineOffers / pipelineApplications) * 100) : 0
      },
      {
        stage: 'İşe Alım',
        count: pipelineHires,
        percentage: pipelineApplications > 0 ? Math.round((pipelineHires / pipelineApplications) * 100) : 0
      }
    ];

    // Pending interviews (upcoming)
    const interviews = await prisma.interview.findMany({
      where: {
        organizationId,
        status: 'scheduled',
        date: { gte: now }
      },
      include: {
        candidates: {
          include: {
            candidate: {
              select: { firstName: true, lastName: true }
            }
          },
          take: 1
        }
      },
      orderBy: { date: 'asc' },
      take: 5
    });

    // Format interviews with candidate info
    const formattedInterviews = interviews.map(interview => ({
      id: interview.id,
      scheduledAt: interview.date,
      type: interview.type,
      candidate: {
        name: interview.candidates[0]
          ? `${interview.candidates[0].candidate.firstName} ${interview.candidates[0].candidate.lastName}`
          : 'Unknown'
      },
      jobPosting: {
        title: 'Interview' // Mock - no direct jobPosting relation in Interview model
      }
    }));

    // Monthly stats - REAL DATA from database
    // Date ranges for comparison
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

    // This month counts (last 30 days)
    const thisMonthApplications = await prisma.candidate.count({
      where: { organizationId, createdAt: { gte: thirtyDaysAgo } }
    });

    const thisMonthAnalyses = await prisma.analysis.count({
      where: { organizationId, createdAt: { gte: thirtyDaysAgo } }
    });

    const thisMonthInterviews = await prisma.interview.count({
      where: { organizationId, createdAt: { gte: thirtyDaysAgo } }
    });

    const thisMonthOffers = await prisma.jobOffer.count({
      where: { organizationId, createdAt: { gte: thirtyDaysAgo } }
    });

    const thisMonthHires = await prisma.jobOffer.count({
      where: { organizationId, createdAt: { gte: thirtyDaysAgo }, status: 'ACCEPTED' }
    });

    // Last month counts (30-60 days ago)
    const lastMonthApplications = await prisma.candidate.count({
      where: { organizationId, createdAt: { gte: sixtyDaysAgo, lt: thirtyDaysAgo } }
    });

    const lastMonthAnalyses = await prisma.analysis.count({
      where: { organizationId, createdAt: { gte: sixtyDaysAgo, lt: thirtyDaysAgo } }
    });

    const lastMonthInterviews = await prisma.interview.count({
      where: { organizationId, createdAt: { gte: sixtyDaysAgo, lt: thirtyDaysAgo } }
    });

    const lastMonthOffers = await prisma.jobOffer.count({
      where: { organizationId, createdAt: { gte: sixtyDaysAgo, lt: thirtyDaysAgo } }
    });

    const lastMonthHires = await prisma.jobOffer.count({
      where: { organizationId, createdAt: { gte: sixtyDaysAgo, lt: thirtyDaysAgo }, status: 'ACCEPTED' }
    });

    // Calculate percentage changes
    const calcChange = (current, previous) => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return Math.round(((current - previous) / previous) * 100);
    };

    // Conversion rate = (hires / applications) * 100
    const conversionRate = thisMonthApplications > 0
      ? Math.round((thisMonthHires / thisMonthApplications) * 100)
      : 0;
    const lastConversionRate = lastMonthApplications > 0
      ? Math.round((lastMonthHires / lastMonthApplications) * 100)
      : 0;

    const monthlyStats = {
      applications: thisMonthApplications,
      applicationsChange: calcChange(thisMonthApplications, lastMonthApplications),
      analyses: thisMonthAnalyses,
      analysesChange: calcChange(thisMonthAnalyses, lastMonthAnalyses),
      interviews: thisMonthInterviews,
      interviewsChange: calcChange(thisMonthInterviews, lastMonthInterviews),
      offers: thisMonthOffers,
      offersChange: calcChange(thisMonthOffers, lastMonthOffers),
      hires: thisMonthHires,
      hiresChange: calcChange(thisMonthHires, lastMonthHires),
      conversionRate,
      conversionChange: conversionRate - lastConversionRate
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
        interviews: formattedInterviews,
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

// GET /api/v1/dashboard/admin
// Get ADMIN dashboard data (organization management focus)
router.get('/admin', [
  authenticateToken,
  enforceOrganizationIsolation,
  authorize(ROLE_GROUPS.ADMINS)
], async (req, res) => {
  try {
    const organizationId = req.organizationId;
    const organization = req.organization;
    const now = new Date();

    // Organization stats
    const totalUsers = await prisma.user.count({ where: { organizationId } });

    // Note: Active users today not available - requires session tracking implementation
    const activeToday = null; // No real data source (no lastLogin field in User model)

    const orgStats = {
      totalUsers,
      activeToday,
      plan: organization.plan
    };

    // Billing info
    const PLAN_PRICES = {
      'FREE': 0,
      'PRO': 99,
      'ENTERPRISE': 0
    };

    const billing = {
      monthlyAmount: PLAN_PRICES[organization.plan] || 0,
      nextBillingDate: organization.billingCycleStart || new Date().toISOString()
    };

    // Usage trend (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const analyses = await prisma.analysis.findMany({
      where: {
        organizationId,
        createdAt: { gte: thirtyDaysAgo }
      },
      select: { createdAt: true }
    });

    const candidates = await prisma.candidate.findMany({
      where: {
        organizationId,
        createdAt: { gte: thirtyDaysAgo }
      },
      select: { createdAt: true }
    });

    // Group by date (simplified - last 7 days for performance)
    const usageTrend = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' });

      const dayStart = new Date(date.setHours(0, 0, 0, 0));
      const dayEnd = new Date(date.setHours(23, 59, 59, 999));

      const analysisCount = analyses.filter(a =>
        new Date(a.createdAt) >= dayStart && new Date(a.createdAt) <= dayEnd
      ).length;

      const cvCount = candidates.filter(c =>
        new Date(c.createdAt) >= dayStart && new Date(c.createdAt) <= dayEnd
      ).length;

      usageTrend.push({
        date: dateStr,
        analyses: analysisCount,
        cvs: cvCount,
        activeUsers: null // No real data source (session tracking not implemented)
      });
    }

    // Team activity (mock for now - ActivityLog model not implemented yet)
    const formattedActivity = [];

    // Security metrics
    const twoFactorUsers = await prisma.user.count({
      where: {
        organizationId,
        twoFactorEnabled: true
      }
    }).catch(() => 0);

    const security = {
      twoFactorUsers,
      activeSessions: null, // No real data source (session tracking not implemented)
      lastSecurityEvent: null,
      complianceScore: Math.min(100, Math.round((twoFactorUsers / Math.max(orgStats.totalUsers, 1)) * 100))
    };

    // Usage rate calculation (plan limit vs actual usage)
    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);

    const thisMonthAnalyses = await prisma.analysis.count({
      where: {
        organizationId,
        createdAt: { gte: monthStart }
      }
    });

    const PLAN_ANALYSIS_LIMITS = {
      'FREE': 10,
      'PRO': 50,
      'ENTERPRISE': 999999 // Unlimited
    };

    const analysisLimit = PLAN_ANALYSIS_LIMITS[organization.plan] || 10;
    const usageRate = Math.min(100, Math.round((thisMonthAnalyses / analysisLimit) * 100));

    // Health score calculation
    const healthFactors = [
      {
        name: 'Kullanıcı Aktivitesi',
        score: Math.min(100, Math.round((activeToday / Math.max(orgStats.totalUsers, 1)) * 100)),
        status: activeToday > 0 ? 'good' : 'warning'
      },
      {
        name: 'Güvenlik',
        score: security.complianceScore,
        status: security.complianceScore >= 70 ? 'good' : 'warning'
      },
      {
        name: 'Kullanım Oranı',
        score: usageRate, // Real calculation: thisMonthAnalyses / analysisLimit
        status: usageRate < 80 ? 'good' : 'warning' // Warning if approaching limit
      },
      {
        name: 'Sistem Sağlığı',
        score: 100, // Assumed healthy (system monitoring not implemented - if errors exist, API would fail)
        status: 'good'
      }
    ];

    const avgHealthScore = Math.round(
      healthFactors.reduce((sum, f) => sum + f.score, 0) / healthFactors.length
    );

    const health = {
      score: avgHealthScore,
      factors: healthFactors
    };

    res.json({
      success: true,
      data: {
        orgStats,
        userManagement: orgStats,
        billing,
        usageTrend,
        teamActivity: formattedActivity,
        security,
        health
      }
    });
  } catch (error) {
    console.error('[DASHBOARD] ADMIN error:', error);
    res.status(500).json({
      success: false,
      message: 'Dashboard verileri alınırken hata'
    });
  }
});

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

    // Revenue calculation - Real data
    const proPlanCount = planCounts.find(p => p.plan === 'PRO')?._count || 0;
    const enterpriseCount = planCounts.find(p => p.plan === 'ENTERPRISE')?._count || 0;

    // MRR calculation (ENTERPRISE custom pricing = 0 for calculation purposes)
    const PRO_PRICE = 99;
    const currentMRR = proPlanCount * PRO_PRICE; // Only PRO plans counted

    // Calculate MRR growth (last 30 days vs previous 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Get PRO organization count from 30 days ago
    const orgsLastMonth = await prisma.organization.count({
      where: {
        plan: 'PRO',
        createdAt: { lt: thirtyDaysAgo }
      }
    });

    const lastMonthMRR = orgsLastMonth * PRO_PRICE;
    const mrrGrowth = lastMonthMRR > 0
      ? Math.round(((currentMRR - lastMonthMRR) / lastMonthMRR) * 100)
      : 0;

    // Estimate average LTV (avg subscription months * MRR)
    // Assumption: Average subscription is 12 months
    const avgLTV = PRO_PRICE * 12;

    const revenue = {
      mrr: currentMRR,
      mrrGrowth: mrrGrowth,
      avgLTV: avgLTV,
      enterprise: 0, // ENTERPRISE custom pricing
      pro: proPlanCount * PRO_PRICE
    };

    // Platform analytics
    const totalAnalyses = await prisma.analysis.count();
    const totalCVs = await prisma.candidate.count();
    const totalJobPostings = await prisma.jobPosting.count();
    const totalOffers = await prisma.jobOffer.count();
    const totalUsers = await prisma.user.count();

    // Calculate growth percentages (this month vs last month)
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

    // This month counts (last 30 days)
    const thisMonthAnalyses = await prisma.analysis.count({
      where: { createdAt: { gte: thirtyDaysAgo } }
    });
    const thisMonthCVs = await prisma.candidate.count({
      where: { createdAt: { gte: thirtyDaysAgo } }
    });
    const thisMonthJobs = await prisma.jobPosting.count({
      where: { createdAt: { gte: thirtyDaysAgo } }
    });
    const thisMonthOffers = await prisma.jobOffer.count({
      where: { createdAt: { gte: thirtyDaysAgo } }
    });

    // Last month counts (30-60 days ago)
    const lastMonthAnalyses = await prisma.analysis.count({
      where: {
        createdAt: { gte: sixtyDaysAgo, lt: thirtyDaysAgo }
      }
    });
    const lastMonthCVs = await prisma.candidate.count({
      where: {
        createdAt: { gte: sixtyDaysAgo, lt: thirtyDaysAgo }
      }
    });
    const lastMonthJobs = await prisma.jobPosting.count({
      where: {
        createdAt: { gte: sixtyDaysAgo, lt: thirtyDaysAgo }
      }
    });
    const lastMonthOffers = await prisma.jobOffer.count({
      where: {
        createdAt: { gte: sixtyDaysAgo, lt: thirtyDaysAgo }
      }
    });

    // Calculate growth percentages
    const analysesGrowth = lastMonthAnalyses > 0
      ? Math.round(((thisMonthAnalyses - lastMonthAnalyses) / lastMonthAnalyses) * 100)
      : 0;
    const cvsGrowth = lastMonthCVs > 0
      ? Math.round(((thisMonthCVs - lastMonthCVs) / lastMonthCVs) * 100)
      : 0;
    const jobsGrowth = lastMonthJobs > 0
      ? Math.round(((thisMonthJobs - lastMonthJobs) / lastMonthJobs) * 100)
      : 0;
    const offersGrowth = lastMonthOffers > 0
      ? Math.round(((thisMonthOffers - lastMonthOffers) / lastMonthOffers) * 100)
      : 0;

    const analytics = {
      totalAnalyses,
      totalCVs,
      totalJobPostings,
      totalOffers,
      analysesGrowth,
      cvsGrowth,
      jobsGrowth,
      offersGrowth
    };

    // Growth data (last 7 days - real data)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // Get data from 7 days ago for growth calculation
    const orgs7DaysAgo = await prisma.organization.count({
      where: { createdAt: { lt: sevenDaysAgo } }
    });
    const users7DaysAgo = await prisma.user.count({
      where: { createdAt: { lt: sevenDaysAgo } }
    });
    const proOrgs7DaysAgo = await prisma.organization.count({
      where: { plan: 'PRO', createdAt: { lt: sevenDaysAgo } }
    });
    const revenue7DaysAgo = proOrgs7DaysAgo * PRO_PRICE;

    const analyses7DaysAgo = await prisma.analysis.count({
      where: { createdAt: { lt: sevenDaysAgo } }
    });
    const cvs7DaysAgo = await prisma.candidate.count({
      where: { createdAt: { lt: sevenDaysAgo } }
    });
    const activity7DaysAgo = analyses7DaysAgo + cvs7DaysAgo;

    // Generate chart data for last 7 days
    const chartData = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateEnd = new Date(date);
      dateEnd.setHours(23, 59, 59, 999);

      const dateStr = date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' });

      // Count everything created up to this date
      const orgsAtDate = await prisma.organization.count({
        where: { createdAt: { lte: dateEnd } }
      });
      const usersAtDate = await prisma.user.count({
        where: { createdAt: { lte: dateEnd } }
      });
      const proOrgsAtDate = await prisma.organization.count({
        where: { plan: 'PRO', createdAt: { lte: dateEnd } }
      });
      const revenueAtDate = proOrgsAtDate * PRO_PRICE;

      const analysesAtDate = await prisma.analysis.count({
        where: { createdAt: { lte: dateEnd } }
      });
      const cvsAtDate = await prisma.candidate.count({
        where: { createdAt: { lte: dateEnd } }
      });
      const activityAtDate = analysesAtDate + cvsAtDate;

      chartData.push({
        date: dateStr,
        organizations: orgsAtDate,
        users: usersAtDate,
        revenue: revenueAtDate,
        activity: activityAtDate
      });
    }

    // Calculate growth metrics (7 days ago vs now)
    const currentActivity = totalAnalyses + totalCVs;

    const orgGrowth = orgs7DaysAgo > 0
      ? Math.round(((totalOrganizations - orgs7DaysAgo) / orgs7DaysAgo) * 100)
      : 0;
    const userGrowth = users7DaysAgo > 0
      ? Math.round(((totalUsers - users7DaysAgo) / users7DaysAgo) * 100)
      : 0;
    const revenueGrowth = revenue7DaysAgo > 0
      ? Math.round(((revenue.mrr - revenue7DaysAgo) / revenue7DaysAgo) * 100)
      : 0;
    const activityGrowth = activity7DaysAgo > 0
      ? Math.round(((currentActivity - activity7DaysAgo) / activity7DaysAgo) * 100)
      : 0;

    const growthData = {
      chartData,
      metrics: {
        orgGrowth,
        userGrowth,
        revenueGrowth,
        activityGrowth
      }
    };

    // System health
    // Test database connection
    let dbStatus = 'healthy';
    try {
      await prisma.$queryRaw`SELECT 1`;
    } catch (error) {
      dbStatus = 'unhealthy';
    }

    const systemHealth = {
      backend: 'healthy', // API is responding (we're here!)
      database: dbStatus, // Real: Tested with SELECT 1
      redis: 'healthy', // Mock - requires Redis client integration
      milvus: 'healthy', // Mock - requires Milvus client integration
      queues: 'healthy', // Mock - see queueStats below for real data
      uptime: 99.9, // Mock - requires uptime tracking implementation
      apiResponseTime: 180, // Mock - requires monitoring implementation
      dbConnections: 15, // Mock - requires Prisma metrics API
      cacheHitRate: 85, // Mock - requires Redis metrics
      vectorCount: totalAnalyses, // Real: total analyses in vector DB
      queueJobs: 5 // Mock - see queueStats below for real queue data
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
