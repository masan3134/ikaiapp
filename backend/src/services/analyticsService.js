/**
 * Analytics Service
 *
 * NEW FEATURE #1: Advanced Analytics Dashboard
 * Data aggregation and calculations for HR metrics
 *
 * Created: 2025-10-27
 */

const { PrismaClient } = require('@prisma/client');
const logger = require('../utils/logger');

const prisma = new PrismaClient();

/**
 * Calculate summary analytics
 * @param {string} userId
 * @param {string} userRole
 * @returns {Promise<object>}
 */
async function calculateSummary(userId, userRole) {
  try {
    // Build where clause based on role
    const whereClause = ['ADMIN', 'MANAGER'].includes(userRole) ? {} : { userId };

    // Parallel queries for performance
    const [
      totalCandidates,
      totalAnalyses,
      completedAnalyses,
      totalTests,
      avgScore,
      highScorers
    ] = await Promise.all([
      // Total candidates
      prisma.candidate.count({ where: { ...whereClause, isDeleted: false } }),

      // Total analyses
      prisma.analysis.count({ where: whereClause }),

      // Completed analyses
      prisma.analysis.count({ where: { ...whereClause, status: 'COMPLETED' } }),

      // Total tests
      prisma.assessmentTest.count({ where: whereClause }),

      // Average compatibility score
      prisma.analysisResult.aggregate({
        where: {
          analysis: whereClause.userId ? { userId: whereClause.userId } : {}
        },
        _avg: {
          compatibilityScore: true
        }
      }),

      // High scorers (score >= 80)
      prisma.analysisResult.count({
        where: {
          compatibilityScore: { gte: 80 },
          analysis: whereClause.userId ? { userId: whereClause.userId } : {}
        }
      })
    ]);

    // Calculate time-to-hire average (completed analyses only)
    const completedAnalysesWithDuration = await prisma.analysis.findMany({
      where: {
        ...whereClause,
        status: 'COMPLETED',
        completedAt: { not: null }
      },
      select: {
        createdAt: true,
        completedAt: true
      }
    });

    const durations = completedAnalysesWithDuration.map(a => {
      const diff = new Date(a.completedAt) - new Date(a.createdAt);
      return diff / (1000 * 60 * 60 * 24); // Convert to days
    });

    const avgTimeToHire = durations.length > 0
      ? durations.reduce((a, b) => a + b, 0) / durations.length
      : 0;

    return {
      totalCandidates,
      totalAnalyses,
      completedAnalyses,
      pendingAnalyses: totalAnalyses - completedAnalyses,
      totalTests,
      avgCompatibilityScore: Math.round(avgScore._avg.compatibilityScore || 0),
      highScorers,
      avgTimeToHireDays: Math.round(avgTimeToHire * 10) / 10, // 1 decimal
      successRate: totalAnalyses > 0 ? Math.round((completedAnalyses / totalAnalyses) * 100) : 0
    };
  } catch (error) {
    logger.error('Analytics summary calculation error', { error: error.message });
    throw error;
  }
}

/**
 * Calculate time-to-hire metrics
 * @param {string} userId
 * @param {string} userRole
 * @param {object} filters
 * @returns {Promise<object>}
 */
async function calculateTimeToHire(userId, userRole, filters = {}) {
  try {
    const whereClause = ['ADMIN', 'MANAGER'].includes(userRole) ? {} : { userId };

    // Add date filters
    if (filters.startDate || filters.endDate) {
      whereClause.createdAt = {};
      if (filters.startDate) whereClause.createdAt.gte = filters.startDate;
      if (filters.endDate) whereClause.createdAt.lte = filters.endDate;
    }

    // Get completed analyses with job posting info
    const analyses = await prisma.analysis.findMany({
      where: {
        ...whereClause,
        status: 'COMPLETED',
        completedAt: { not: null }
      },
      include: {
        jobPosting: {
          select: {
            id: true,
            title: true,
            department: true
          }
        }
      }
    });

    // Filter by department if specified
    let filteredAnalyses = analyses;
    if (filters.department) {
      filteredAnalyses = analyses.filter(a => a.jobPosting.department === filters.department);
    }

    // Group by department
    const byDepartment = {};
    filteredAnalyses.forEach(analysis => {
      const dept = analysis.jobPosting.department;
      const duration = (new Date(analysis.completedAt) - new Date(analysis.createdAt)) / (1000 * 60 * 60 * 24);

      if (!byDepartment[dept]) {
        byDepartment[dept] = { durations: [], count: 0 };
      }
      byDepartment[dept].durations.push(duration);
      byDepartment[dept].count++;
    });

    // Calculate stats per department
    const departmentStats = Object.entries(byDepartment).map(([dept, data]) => {
      const avg = data.durations.reduce((a, b) => a + b, 0) / data.durations.length;
      const min = Math.min(...data.durations);
      const max = Math.max(...data.durations);

      return {
        department: dept,
        avgDays: Math.round(avg * 10) / 10,
        minDays: Math.round(min * 10) / 10,
        maxDays: Math.round(max * 10) / 10,
        totalAnalyses: data.count
      };
    });

    // Overall stats
    const allDurations = filteredAnalyses.map(a =>
      (new Date(a.completedAt) - new Date(a.createdAt)) / (1000 * 60 * 60 * 24)
    );

    const overall = {
      avgDays: allDurations.length > 0
        ? Math.round((allDurations.reduce((a, b) => a + b, 0) / allDurations.length) * 10) / 10
        : 0,
      minDays: allDurations.length > 0 ? Math.round(Math.min(...allDurations) * 10) / 10 : 0,
      maxDays: allDurations.length > 0 ? Math.round(Math.max(...allDurations) * 10) / 10 : 0,
      totalAnalyses: filteredAnalyses.length
    };

    return {
      overall,
      byDepartment: departmentStats.sort((a, b) => b.totalAnalyses - a.totalAnalyses)
    };
  } catch (error) {
    logger.error('Time-to-hire calculation error', { error: error.message });
    throw error;
  }
}

/**
 * Generate candidate funnel data
 * @param {string} userId
 * @param {string} userRole
 * @param {object} filters
 * @returns {Promise<object>}
 */
async function generateFunnelData(userId, userRole, filters = {}) {
  try {
    const whereClause = ['ADMIN', 'MANAGER'].includes(userRole) ? {} : { userId };

    // Add date filters
    if (filters.startDate || filters.endDate) {
      whereClause.createdAt = {};
      if (filters.startDate) whereClause.createdAt.gte = filters.startDate;
      if (filters.endDate) whereClause.createdAt.lte = filters.endDate;
    }

    // Stage 1: Total Candidates
    const totalCandidates = await prisma.candidate.count({
      where: { ...whereClause, isDeleted: false }
    });

    // Stage 2: Analyzed Candidates (have at least one analysis result)
    const analyzedCandidates = await prisma.candidate.count({
      where: {
        ...whereClause,
        isDeleted: false,
        analysisResults: {
          some: {}
        }
      }
    });

    // Stage 3: Tested Candidates (received assessment test)
    const testedCandidates = await prisma.testSubmission.groupBy({
      by: ['candidateEmail'],
      where: {
        candidate: whereClause.userId ? { userId: whereClause.userId } : undefined
      }
    });

    // Stage 4: High Scorers (compatibilityScore >= 70)
    const highScorers = await prisma.analysisResult.count({
      where: {
        compatibilityScore: { gte: 70 },
        analysis: whereClause.userId ? { userId: whereClause.userId } : {}
      }
    });

    // Stage 5: Top Performers (compatibilityScore >= 80)
    const topPerformers = await prisma.analysisResult.count({
      where: {
        compatibilityScore: { gte: 80 },
        analysis: whereClause.userId ? { userId: whereClause.userId } : {}
      }
    });

    return {
      stages: [
        {
          name: 'Total Candidates',
          count: totalCandidates,
          percentage: 100
        },
        {
          name: 'Analyzed',
          count: analyzedCandidates,
          percentage: totalCandidates > 0 ? Math.round((analyzedCandidates / totalCandidates) * 100) : 0
        },
        {
          name: 'Tested',
          count: testedCandidates.length,
          percentage: totalCandidates > 0 ? Math.round((testedCandidates.length / totalCandidates) * 100) : 0
        },
        {
          name: 'High Scorers (70+)',
          count: highScorers,
          percentage: totalCandidates > 0 ? Math.round((highScorers / totalCandidates) * 100) : 0
        },
        {
          name: 'Top Performers (80+)',
          count: topPerformers,
          percentage: totalCandidates > 0 ? Math.round((topPerformers / totalCandidates) * 100) : 0
        }
      ],
      conversionRate: {
        candidateToAnalyzed: analyzedCandidates > 0 ? Math.round((analyzedCandidates / totalCandidates) * 100) : 0,
        analyzedToHighScore: highScorers > 0 ? Math.round((highScorers / analyzedCandidates) * 100) : 0,
        overallQuality: topPerformers > 0 ? Math.round((topPerformers / totalCandidates) * 100) : 0
      }
    };
  } catch (error) {
    logger.error('Funnel data generation error', { error: error.message });
    throw error;
  }
}

/**
 * Get score distribution (histogram)
 * @param {string} userId
 * @param {string} userRole
 * @param {string} jobPostingId - Optional filter
 * @returns {Promise<object>}
 */
async function getScoreStats(userId, userRole, jobPostingId = null) {
  try {
    const whereClause = {
      analysis: ['ADMIN', 'MANAGER'].includes(userRole) ? {} : { userId }
    };

    if (jobPostingId) {
      whereClause.analysis.jobPostingId = jobPostingId;
    }

    // Get all scores
    const results = await prisma.analysisResult.findMany({
      where: whereClause,
      select: {
        compatibilityScore: true,
        experienceScore: true,
        educationScore: true,
        technicalScore: true,
        softSkillsScore: true,
        extraScore: true
      }
    });

    // Create histogram buckets (0-10, 10-20, ..., 90-100)
    const buckets = Array(10).fill(0).map((_, i) => ({
      range: `${i * 10}-${(i + 1) * 10}`,
      minScore: i * 10,
      maxScore: (i + 1) * 10,
      count: 0
    }));

    // Fill buckets
    results.forEach(r => {
      const score = r.compatibilityScore;
      const bucketIndex = Math.min(Math.floor(score / 10), 9);
      buckets[bucketIndex].count++;
    });

    // Calculate statistics
    const scores = results.map(r => r.compatibilityScore);
    const sortedScores = [...scores].sort((a, b) => a - b);

    const stats = {
      total: scores.length,
      avg: scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0,
      min: scores.length > 0 ? Math.min(...scores) : 0,
      max: scores.length > 0 ? Math.max(...scores) : 0,
      median: scores.length > 0 ? sortedScores[Math.floor(sortedScores.length / 2)] : 0,
      stdDev: scores.length > 0 ? calculateStdDev(scores) : 0
    };

    // Sub-score averages (V7.1 feature)
    const subScoreAvgs = {
      experience: Math.round(results.reduce((sum, r) => sum + (r.experienceScore || 0), 0) / results.length) || 0,
      education: Math.round(results.reduce((sum, r) => sum + (r.educationScore || 0), 0) / results.length) || 0,
      technical: Math.round(results.reduce((sum, r) => sum + (r.technicalScore || 0), 0) / results.length) || 0,
      softSkills: Math.round(results.reduce((sum, r) => sum + (r.softSkillsScore || 0), 0) / results.length) || 0,
      extra: Math.round(results.reduce((sum, r) => sum + (r.extraScore || 0), 0) / results.length) || 0
    };

    return {
      histogram: buckets,
      statistics: stats,
      subScores: subScoreAvgs
    };
  } catch (error) {
    logger.error('Score stats calculation error', { error: error.message });
    throw error;
  }
}

/**
 * Get top performing job postings
 * @param {string} userId
 * @param {string} userRole
 * @param {number} limit
 * @returns {Promise<Array>}
 */
async function getTopPerformingJobs(userId, userRole, limit = 10) {
  try {
    const whereClause = ['ADMIN', 'MANAGER'].includes(userRole) ? {} : { userId };

    // Get job postings with analysis count and avg score
    const jobs = await prisma.jobPosting.findMany({
      where: {
        ...whereClause,
        isDeleted: false,
        analyses: {
          some: {
            status: 'COMPLETED'
          }
        }
      },
      include: {
        analyses: {
          where: {
            status: 'COMPLETED'
          },
          include: {
            analysisResults: {
              select: {
                compatibilityScore: true
              }
            },
            _count: {
              select: {
                analysisResults: true
              }
            }
          }
        },
        _count: {
          select: {
            analyses: true
          }
        }
      },
      take: limit * 3 // Get more for filtering
    });

    // Calculate metrics for each job
    const jobMetrics = jobs.map(job => {
      const allScores = [];
      let totalCandidates = 0;
      let highScorers = 0;

      job.analyses.forEach(analysis => {
        analysis.analysisResults.forEach(result => {
          allScores.push(result.compatibilityScore);
          totalCandidates++;
          if (result.compatibilityScore >= 80) {
            highScorers++;
          }
        });
      });

      const avgScore = allScores.length > 0
        ? Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length)
        : 0;

      return {
        id: job.id,
        title: job.title,
        department: job.department,
        totalAnalyses: job._count.analyses,
        totalCandidates,
        avgScore,
        highScorersCount: highScorers,
        highScorersPercentage: totalCandidates > 0 ? Math.round((highScorers / totalCandidates) * 100) : 0,
        qualityScore: avgScore // Used for sorting
      };
    });

    // Sort by quality score (avg compatibility) and take top N
    return jobMetrics
      .sort((a, b) => b.qualityScore - a.qualityScore)
      .slice(0, limit);
  } catch (error) {
    logger.error('Top jobs calculation error', { error: error.message });
    throw error;
  }
}

/**
 * Calculate standard deviation
 * @param {number[]} values
 * @returns {number}
 */
function calculateStdDev(values) {
  if (values.length === 0) return 0;

  const avg = values.reduce((a, b) => a + b, 0) / values.length;
  const squareDiffs = values.map(value => Math.pow(value - avg, 2));
  const avgSquareDiff = squareDiffs.reduce((a, b) => a + b, 0) / squareDiffs.length;

  return Math.round(Math.sqrt(avgSquareDiff) * 10) / 10; // 1 decimal
}

module.exports = {
  calculateSummary,
  calculateTimeToHire,
  generateFunnelData,
  getScoreStats,
  getTopPerformingJobs
};
