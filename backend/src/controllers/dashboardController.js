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

    // Manager Dashboard Data (Mock + Real Data Mix)
    const dashboardData = {
      overview: {
        teamSize: 12,
        activeProjects: 5,
        performance: 87,
        budgetUsed: 65
      },
      teamPerformance: {
        teamScore: 87,
        activeMembers: 10,
        totalMembers: 12,
        completedTasks: 45,
        satisfaction: 92
      },
      departmentAnalytics: {
        monthHires: 8,
        hiresChange: 15,
        avgTimeToHire: 18,
        timeChange: -5,
        acceptanceRate: 85,
        acceptanceChange: 10,
        costPerHire: 5200,
        costChange: -8
      },
      actionItems: {
        urgentCount: 3,
        approvalCount: 7,
        todayTasksCount: 12
      },
      performanceTrend: {
        trend: [],
        currentProductivity: 88,
        currentQuality: 92,
        currentDelivery: 85
      },
      approvalQueue: {
        queue: [
          {
            id: '1',
            type: 'OFFER',
            title: 'Senior Developer pozisyonu teklifi',
            createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
          },
          {
            id: '2',
            type: 'BUDGET',
            title: 'Q4 İşe Alım Bütçesi Artışı',
            createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString()
          },
          {
            id: '3',
            type: 'LEAVE',
            title: 'Ahmet Yılmaz - 5 gün yıllık izin',
            createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
          }
        ]
      },
      interviews: {
        upcomingInterviews: [
          {
            id: '1',
            scheduledAt: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(),
            candidate: { name: 'Zeynep Kaya' },
            jobPosting: { title: 'Frontend Developer' }
          },
          {
            id: '2',
            scheduledAt: new Date(Date.now() + 25 * 60 * 60 * 1000).toISOString(),
            candidate: { name: 'Mehmet Demir' },
            jobPosting: { title: 'Backend Developer' }
          }
        ]
      },
      kpis: {
        kpis: [
          { name: 'İşe Alım Hedefi', current: 8, target: 10, percentage: 80 },
          { name: 'Mülakat Sayısı', current: 18, target: 20, percentage: 90 },
          { name: 'Pozisyon Doldurma', current: 6, target: 8, percentage: 75 },
          { name: 'Takım Memnuniyeti', current: 92, target: 100, percentage: 92 }
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
