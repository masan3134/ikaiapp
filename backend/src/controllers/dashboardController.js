const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Get dashboard statistics
 * Returns aggregated data for dashboard display
 *
 * @route GET /api/v1/dashboard/stats
 * @access Private (ADMIN, MANAGER)
 */
async function getDashboardStats(req, res) {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;
    const organizationId = req.organizationId;

    const userFilter = userRole === 'ADMIN' ? { organizationId } : { userId, organizationId };

    const [
      totalUsers,
      totalCandidates,
      userCandidates,
      totalJobPostings,
      userJobPostings,
      totalAnalyses,
      userAnalyses,
      analysesByStatus,
      recentAnalyses
    ] = await Promise.all([
      userRole === 'ADMIN' ? prisma.user.count({ where: { organizationId } }) : Promise.resolve(null),

      prisma.candidate.count({ where: userFilter }),

      prisma.candidate.count({ where: { userId, organizationId } }),

      prisma.jobPosting.count({ where: userFilter }),

      prisma.jobPosting.count({ where: { userId, organizationId } }),

      prisma.analysis.count({ where: userFilter }),

      prisma.analysis.count({ where: { userId, organizationId } }),

      prisma.analysis.groupBy({
        by: ['status'],
        where: userFilter,
        _count: {
          id: true
        }
      }),

      prisma.analysis.findMany({
        where: userFilter,
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          jobPosting: {
            select: {
              title: true,
              department: true
            }
          },
          _count: {
            select: {
              analysisResults: true
            }
          }
        }
      })
    ]);

    // Format status counts for easier frontend consumption
    const statusCounts = {
      PENDING: 0,
      PROCESSING: 0,
      COMPLETED: 0,
      FAILED: 0
    };

    analysesByStatus.forEach(item => {
      statusCounts[item.status] = item._count.id;
    });

    const stats = {
      overview: {
        totalUsers: totalUsers, // null for non-admin
        totalCandidates,
        totalJobPostings,
        totalAnalyses,
        userCandidates, // User's own count
        userJobPostings,
        userAnalyses
      },
      analysisByStatus: statusCounts,
      recentAnalyses: recentAnalyses.map(analysis => ({
        id: analysis.id,
        status: analysis.status,
        jobPostingTitle: analysis.jobPosting.title,
        department: analysis.jobPosting.department,
        candidateCount: analysis._count.analysisResults,
        createdAt: analysis.createdAt,
        completedAt: analysis.completedAt
      })),
      userRole,
      timestamp: new Date().toISOString()
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'İstatistikler yüklenirken hata oluştu'
    });
  }
}

/**
 * Get MANAGER dashboard data
 * Returns manager-specific metrics and analytics
 *
 * @route GET /api/v1/dashboard/manager
 * @access Private (MANAGER role only)
 */
async function getManagerDashboard(req, res) {
  try {
    const userId = req.user.id;
    const organizationId = req.organizationId;
    const now = new Date();

    // Date ranges
    const today = new Date(now.setHours(0, 0, 0, 0));
    const last30Days = new Date();
    last30Days.setDate(last30Days.getDate() - 30);
    const last60Days = new Date();
    last60Days.setDate(last60Days.getDate() - 60);

    // REAL DATA QUERIES
    const [
      teamSize,
      activeProjects,
      completedAnalyses,
      monthCandidates,
      previousMonthCandidates,
      totalOffers,
      acceptedOffers,
      pendingOffers,
      upcomingInterviews,
      todayInterviews,
      monthlyInterviews,
      candidatesWithOffers,
      completedInterviews,
      totalInterviewsMonth,
      dailyAnalyses
    ] = await Promise.all([
      // Team size (organization users)
      prisma.user.count({ where: { organizationId } }),

      // Active projects (active job postings)
      prisma.jobPosting.count({
        where: { organizationId, isDeleted: false }
      }),

      // Completed analyses (last 30 days)
      prisma.analysis.count({
        where: {
          organizationId,
          status: 'COMPLETED',
          createdAt: { gte: last30Days }
        }
      }),

      // Month hires (candidates created in last 30 days)
      prisma.candidate.count({
        where: { organizationId, createdAt: { gte: last30Days } }
      }),

      // Previous month candidates (for change percentage)
      prisma.candidate.count({
        where: {
          organizationId,
          createdAt: { gte: last60Days, lt: last30Days }
        }
      }),

      // Total offers (last 30 days)
      prisma.jobOffer.count({
        where: { organizationId, createdAt: { gte: last30Days } }
      }),

      // Accepted offers
      prisma.jobOffer.count({
        where: {
          organizationId,
          status: 'ACCEPTED',
          createdAt: { gte: last30Days }
        }
      }),

      // Pending offers (approval queue)
      prisma.jobOffer.findMany({
        where: {
          organizationId,
          status: 'PENDING'
        },
        include: {
          candidate: { select: { name: true } },
          jobPosting: { select: { title: true } }
        },
        orderBy: { createdAt: 'desc' },
        take: 10
      }),

      // Upcoming interviews
      prisma.interview.findMany({
        where: {
          organizationId,
          status: 'SCHEDULED',
          scheduledAt: { gte: now }
        },
        include: {
          candidate: { select: { name: true } },
          jobPosting: { select: { title: true } }
        },
        orderBy: { scheduledAt: 'asc' },
        take: 10
      }),

      // Today's interviews
      prisma.interview.count({
        where: {
          organizationId,
          status: 'SCHEDULED',
          scheduledAt: {
            gte: today,
            lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
          }
        }
      }),

      // Monthly interviews count
      prisma.interview.count({
        where: {
          organizationId,
          createdAt: { gte: last30Days }
        }
      }),

      // Candidates with offers (for avgTimeToHire calculation)
      prisma.candidate.findMany({
        where: {
          organizationId,
          createdAt: { gte: last60Days },
          jobOffers: {
            some: {
              status: { in: ['ACCEPTED', 'PENDING', 'SENT'] }
            }
          }
        },
        include: {
          jobOffers: {
            where: {
              status: { in: ['ACCEPTED', 'PENDING', 'SENT'] }
            },
            orderBy: { createdAt: 'asc' },
            take: 1
          }
        },
        take: 100
      }),

      // Completed interviews (for satisfaction proxy)
      prisma.interview.count({
        where: {
          organizationId,
          status: 'COMPLETED',
          createdAt: { gte: last30Days }
        }
      }),

      // Total interviews in month (for satisfaction calculation)
      prisma.interview.count({
        where: {
          organizationId,
          status: { in: ['COMPLETED', 'CANCELLED', 'NO_SHOW'] },
          createdAt: { gte: last30Days }
        }
      }),

      // Daily analyses for trend (last 30 days)
      prisma.$queryRaw`
        SELECT
          DATE(created_at) as date,
          COUNT(*) as count
        FROM analyses
        WHERE organization_id = ${organizationId}
          AND created_at >= ${last30Days}
          AND status = 'COMPLETED'
        GROUP BY DATE(created_at)
        ORDER BY date ASC
      `
    ]);

    // Calculate metrics
    const hiresChange = previousMonthCandidates > 0
      ? Math.round(((monthCandidates - previousMonthCandidates) / previousMonthCandidates) * 100)
      : 0;

    const acceptanceRate = totalOffers > 0
      ? Math.round((acceptedOffers / totalOffers) * 100)
      : 0;

    const urgentCount = pendingOffers.filter(o => {
      const age = Date.now() - new Date(o.createdAt).getTime();
      return age > 48 * 60 * 60 * 1000; // Older than 48 hours
    }).length;

    // Performance score (based on completed analyses)
    const performance = completedAnalyses > 0
      ? Math.min(Math.round((completedAnalyses / activeProjects) * 100), 100)
      : 0;

    // Average time to hire (candidate created → offer created)
    let avgTimeToHire = 0;
    if (candidatesWithOffers.length > 0) {
      const timeDiffs = candidatesWithOffers
        .filter(c => c.jobOffers && c.jobOffers.length > 0)
        .map(c => {
          const candidateDate = new Date(c.createdAt);
          const offerDate = new Date(c.jobOffers[0].createdAt);
          const diffTime = Math.abs(offerDate - candidateDate);
          return Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Convert to days
        });

      if (timeDiffs.length > 0) {
        avgTimeToHire = Math.round(timeDiffs.reduce((a, b) => a + b, 0) / timeDiffs.length);
      }
    }

    // Satisfaction proxy (interview completion rate)
    const satisfaction = totalInterviewsMonth > 0
      ? Math.round((completedInterviews / totalInterviewsMonth) * 100)
      : 0;

    // Process daily trend data (last 30 days)
    const trendData = [];
    if (dailyAnalyses && dailyAnalyses.length > 0) {
      // Fill in missing days with 0
      const last30 = [];
      for (let i = 29; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];

        const dataPoint = dailyAnalyses.find(item => {
          const itemDate = new Date(item.date).toISOString().split('T')[0];
          return itemDate === dateStr;
        });

        last30.push({
          date: dateStr,
          productivity: dataPoint ? Number(dataPoint.count) : 0,
          quality: dataPoint ? Math.min(Number(dataPoint.count) * 10, 100) : 0,
          delivery: dataPoint ? Math.min(Number(dataPoint.count) * 8, 100) : 0
        });
      }
      trendData.push(...last30);
    }

    // KPIs
    const hiringTarget = 10;
    const interviewTarget = 20;
    const positionFillTarget = activeProjects;

    // Manager Dashboard Data (REAL DATA from Database)
    const dashboardData = {
      overview: {
        teamSize,
        activeProjects,
        performance,
        budgetUsed: 0 // No budget tracking yet
      },
      teamPerformance: {
        teamScore: performance,
        activeMembers: teamSize,
        totalMembers: teamSize,
        completedTasks: completedAnalyses,
        satisfaction // Interview completion rate (proxy metric)
      },
      departmentAnalytics: {
        monthHires: monthCandidates,
        hiresChange,
        avgTimeToHire, // Real: candidate.createdAt → offer.createdAt (in days)
        timeChange: 0, // Would need previous period comparison
        acceptanceRate,
        acceptanceChange: 0, // Would need previous period data
        costPerHire: 0, // No budget tracking yet
        costChange: 0
      },
      actionItems: {
        urgentCount,
        approvalCount: pendingOffers.length,
        todayTasksCount: todayInterviews
      },
      performanceTrend: {
        trend: trendData, // Real: Daily analysis counts (last 30 days)
        currentProductivity: performance,
        currentQuality: acceptanceRate,
        currentDelivery: completedAnalyses
      },
      approvalQueue: {
        queue: pendingOffers.map(offer => ({
          id: offer.id,
          type: 'OFFER',
          title: `${offer.jobPosting?.title || 'Pozisyon'} - ${offer.candidate?.name || 'Aday'}`,
          createdAt: offer.createdAt
        }))
      },
      interviews: {
        upcomingInterviews: upcomingInterviews.map(interview => ({
          id: interview.id,
          scheduledAt: interview.scheduledAt,
          candidate: { name: interview.candidate?.name || 'Aday' },
          jobPosting: { title: interview.jobPosting?.title || 'Pozisyon' }
        }))
      },
      kpis: {
        kpis: [
          {
            name: 'İşe Alım Hedefi',
            current: monthCandidates,
            target: hiringTarget,
            percentage: Math.round((monthCandidates / hiringTarget) * 100)
          },
          {
            name: 'Mülakat Sayısı',
            current: monthlyInterviews,
            target: interviewTarget,
            percentage: Math.round((monthlyInterviews / interviewTarget) * 100)
          },
          {
            name: 'Pozisyon Doldurma',
            current: monthCandidates,
            target: positionFillTarget,
            percentage: positionFillTarget > 0 ? Math.round((monthCandidates / positionFillTarget) * 100) : 0
          },
          {
            name: 'Teklif Kabul Oranı',
            current: acceptanceRate,
            target: 100,
            percentage: acceptanceRate
          }
        ]
      }
    };

    res.json({
      success: true,
      data: dashboardData,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('[MANAGER DASHBOARD] Error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: 'Manager dashboard verileri yüklenirken hata oluştu'
    });
  }
}

module.exports = {
  getDashboardStats,
  getManagerDashboard
};
