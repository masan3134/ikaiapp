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

    // Admins see all data, others see only their own
    const userFilter = userRole === 'ADMIN' ? {} : { userId };

    // Run all queries in parallel for better performance
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
      // Total users (admin only)
      userRole === 'ADMIN' ? prisma.user.count() : Promise.resolve(null),

      // Total candidates (all users for admin, user's own for others)
      prisma.candidate.count({ where: userFilter }),

      // User's own candidates count
      prisma.candidate.count({ where: { userId } }),

      // Total job postings
      prisma.jobPosting.count({ where: userFilter }),

      // User's own job postings count
      prisma.jobPosting.count({ where: { userId } }),

      // Total analyses
      prisma.analysis.count({ where: userFilter }),

      // User's own analyses count
      prisma.analysis.count({ where: { userId } }),

      // Analyses grouped by status
      prisma.analysis.groupBy({
        by: ['status'],
        where: userFilter,
        _count: {
          id: true
        }
      }),

      // Recent analyses (last 5)
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
    console.error('Dashboard stats error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'İstatistikler yüklenirken hata oluştu'
    });
  }
}

module.exports = {
  getDashboardStats
};
