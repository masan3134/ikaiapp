const { PrismaClient } = require('@prisma/client');
const { analysisQueue } = require('../queues/analysisQueue');
const { setCachedAnalysis } = require('../services/cacheService');

const prisma = new PrismaClient();

/**
 * Create new analysis
 * POST /api/analyses
 * Body: { jobPostingId, candidateIds[] }
 */
async function createAnalysis(req, res) {
  try {
    const { jobPostingId, candidateIds } = req.body;
    const userId = req.user.id;

    // Validation
    if (!jobPostingId) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'İş ilanı ID zorunludur'
      });
    }

    if (!candidateIds || !Array.isArray(candidateIds) || candidateIds.length === 0) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'En az bir aday seçilmelidir'
      });
    }

    const organizationId = req.organizationId;

    // Verify job posting exists and user owns it
    const jobPosting = await prisma.jobPosting.findUnique({
      where: { id: jobPostingId }
    });

    if (!jobPosting) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'İş ilanı bulunamadı'
      });
    }

    if (jobPosting.userId !== userId) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Bu iş ilanına erişim yetkiniz yok'
      });
    }

    // Verify candidates exist and user owns them
    const candidates = await prisma.candidate.findMany({
      where: {
        id: { in: candidateIds },
        userId,
        organizationId
      }
    });

    if (candidates.length !== candidateIds.length) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Bir veya daha fazla aday bulunamadı'
      });
    }

    // Create analysis record
    const analysis = await prisma.analysis.create({
      data: {
        jobPostingId,
        userId,
        organizationId,
        status: 'PENDING'
      },
      include: {
        jobPosting: {
          select: {
            id: true,
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
    });

    // Add job to the queue instead of triggering n8n directly
    try {
      await analysisQueue.add('process-analysis', {
        analysisId: analysis.id,
        jobPostingId,
        candidateIds
      });
      console.log(`✅ Job for analysis ${analysis.id} added to the queue.`);
    } catch (queueError) {
      console.error('Failed to add job to queue:', queueError);
      // Mark as failed if queueing fails
      await prisma.analysis.update({
        where: { id: analysis.id },
        data: {
          status: 'FAILED',
          errorMessage: 'Analysis job could not be queued: ' + queueError.message
        }
      });
    }

    res.status(201).json({
      message: 'Analiz oluşturuldu ve işleme alındı',
      analysis
    });
  } catch (error) {
    console.error('Create analysis error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Analiz oluşturulamadı'
    });
  }
}

/**
 * Get all analyses for current user
 * GET /api/analyses
 * Query params: ?candidateId={id}&page=1&limit=20 (optional)
 * Regular users see only their own, admins see all
 */
async function getAllAnalyses(req, res) {
  try {
    const userId = req.user.id;
    const isAdmin = req.user.role === 'ADMIN' || req.user.role === 'SUPER_ADMIN';
    const organizationId = req.organizationId;
    const { candidateId, page = 1, limit = 20 } = req.query;

    // Pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Build query based on user role
    const where = isAdmin ? { organizationId } : { userId, organizationId };

    // If candidateId filter is provided, add it to where clause
    if (candidateId) {
      where.analysisResults = {
        some: {
          candidateId: candidateId
        }
      };
    }

    // Get total count for pagination
    const totalCount = await prisma.analysis.count({ where });

    const analyses = await prisma.analysis.findMany({
      where,
      skip,
      take: limitNum,
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        jobPosting: {
          select: {
            id: true,
            title: true,
            department: true,
            createdAt: true
          }
        },
        user: {
          select: {
            id: true,
            email: true,
            role: true
          }
        },
        analysisResults: candidateId ? {
          where: {
            candidateId: candidateId
          },
          select: {
            id: true,
            candidateId: true,
            compatibilityScore: true,
            experienceScore: true,
            educationScore: true,
            technicalScore: true,
            softSkillsScore: true,
            extraScore: true,
            matchLabel: true,
            experienceSummary: true,
            educationSummary: true,
            careerTrajectory: true,
            scoringProfile: true,
            strategicSummary: true,
            positiveComments: true,
            negativeComments: true,
            createdAt: true,
            candidate: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true
              }
            }
          }
        } : false,  // Don't include results if no candidateId filter
        _count: {
          select: {
            analysisResults: true
          }
        }
      }
    });

    res.json({
      analyses,
      count: analyses.length,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limitNum)
      }
    });
  } catch (error) {
    console.error('Get analyses error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch analyses'
    });
  }
}

/**
 * Get analysis by ID with full results
 * GET /api/analyses/:id
 */
async function getAnalysisById(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const isAdmin = req.user.role === 'ADMIN';
    const organizationId = req.organizationId;

    const analysis = await prisma.analysis.findUnique({
      where: { id },
      include: {
        jobPosting: {
          select: {
            id: true,
            title: true,
            department: true,
            details: true,
            createdAt: true
          }
        },
        user: {
          select: {
            id: true,
            email: true,
            role: true
          }
        },
        analysisResults: {
          include: {
            candidate: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                phone: true,
                email: true,
                address: true,
                experience: true,
                education: true,
                generalComment: true,
                sourceFileName: true,
                fileUrl: true,
                createdAt: true
              }
            }
          },
          orderBy: {
            compatibilityScore: 'desc'
          }
        },
        _count: {
          select: {
            analysisResults: true
          }
        }
      }
    });

    if (!analysis) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Analiz bulunamadı'
      });
    }

    // Check ownership
    if ((analysis.userId !== userId || analysis.organizationId !== organizationId) && !isAdmin) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Bu analize erişim yetkiniz yok'
      });
    }

    res.json({ analysis });
  } catch (error) {
    console.error('Get analysis by ID error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Analiz getirilemedi'
    });
  }
}

/**
 * Delete analysis
 * DELETE /api/analyses/:id
 * Cascade delete will automatically remove analysis results
 */
async function deleteAnalysis(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const isAdmin = req.user.role === 'ADMIN';
    const organizationId = req.organizationId;

    // Check if analysis exists
    const analysis = await prisma.analysis.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            analysisResults: true
          }
        }
      }
    });

    if (!analysis) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Analiz bulunamadı'
      });
    }

    // Check ownership
    if ((analysis.userId !== userId || analysis.organizationId !== organizationId) && !isAdmin) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Bu analizi silme yetkiniz yok'
      });
    }

    // Delete analysis (cascade will handle results)
    await prisma.analysis.delete({
      where: { id }
    });

    res.json({
      message: 'Analiz silindi',
      deletedResultsCount: analysis._count.analysisResults
    });
  } catch (error) {
    console.error('Delete analysis error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Analiz silinemedi'
    });
  }
}

/**
 * Add new candidates to an existing completed analysis
 * POST /api/v1/analyses/:id/add-candidates
 * Body: { candidateIds[] }
 */
async function addCandidatesToAnalysis(req, res) {
  try {
    const { id: analysisId } = req.params;
    const { candidateIds } = req.body;
    const userId = req.user.id;
    const organizationId = req.organizationId;

    // 1. Validation
    if (!candidateIds || !Array.isArray(candidateIds) || candidateIds.length === 0) {
      return res.status(400).json({ message: 'En az bir aday IDsi gönderilmelidir.' });
    }

    // 2. Find the analysis and check ownership/status
    const analysis = await prisma.analysis.findUnique({
      where: { id: analysisId },
      include: {
        analysisResults: { select: { candidateId: true } },
        jobPosting: { select: { id: true } }
      }
    });

    if (!analysis) {
      return res.status(404).json({ message: 'Analiz bulunamadı.' });
    }
    if (analysis.userId !== userId || analysis.organizationId !== organizationId) {
      return res.status(403).json({ message: 'Bu analizi güncelleme yetkiniz yok.' });
    }
    if (analysis.status !== 'COMPLETED') {
      return res.status(400).json({ message: 'Sadece tamamlanmış analizlere aday eklenebilir.' });
    }

    // 3. Filter out candidates that are already in the analysis
    const existingCandidateIds = new Set(analysis.analysisResults.map(r => r.candidateId));
    const newCandidateIds = candidateIds.filter(id => !existingCandidateIds.has(id));

    if (newCandidateIds.length === 0) {
      return res.status(400).json({ message: 'Gönderilen tüm adaylar zaten bu analizde mevcut.' });
    }

    // 4. Verify new candidates exist and are owned by the user
    const candidates = await prisma.candidate.findMany({
      where: { id: { in: newCandidateIds }, userId, organizationId }
    });

    if (candidates.length !== newCandidateIds.length) {
      return res.status(404).json({ message: 'Eklenmek istenen adaylardan bazıları bulunamadı veya size ait değil.' });
    }

    // 5. Update analysis status to PENDING and add job to queue
    const updatedAnalysis = await prisma.analysis.update({
      where: { id: analysisId },
      data: {
        status: 'PENDING', // Worker will set to PROCESSING
        completedAt: null, // Reset completion date
        version: { increment: 1 }  // Version tracking for AI chat
      }
    });

    try {
      // Add job to the queue for the new candidates
      await analysisQueue.add('process-analysis', {
        analysisId,
        jobPostingId: analysis.jobPosting.id,
        candidateIds: newCandidateIds
      });
      console.log(`✅ Job for updating analysis ${analysisId} with ${newCandidateIds.length} new candidates added to the queue.`);
    } catch (queueError) {
      console.error('Failed to add update-job to queue:', queueError);
      // Revert status if queueing fails
      await prisma.analysis.update({
        where: { id: analysisId },
        data: {
          status: 'FAILED',
          errorMessage: 'New candidates could not be queued for analysis: ' + queueError.message
        }
      });
    }

    res.status(200).json({
      message: `${newCandidateIds.length} yeni aday analize eklendi ve işlemeye alındı.`,
      analysis: updatedAnalysis
    });

  } catch (error) {
    console.error('Add candidates to analysis error:', error);
    res.status(500).json({ message: 'Adaylar analize eklenirken bir sunucu hatası oluştu.' });
  }
}

/**
 * 🆕 TASK #6: AI Candidate Feedback Generator
 * Send personalized feedback emails to low-scoring candidates
 * POST /api/v1/analyses/:id/send-feedback
 * Body: { scoreThreshold?: number, candidateIds?: string[] }
 */
async function sendCandidateFeedback(req, res) {
  try {
    const { id: analysisId } = req.params;
    const { scoreThreshold = 60, candidateIds } = req.body;
    const userId = req.user.id;
    const organizationId = req.organizationId;

    // Verify analysis exists and user owns it
    const analysis = await prisma.analysis.findUnique({
      where: { id: analysisId },
      include: {
        jobPosting: {
          select: {
            id: true,
            title: true,
            department: true,
            details: true
          }
        },
        analysisResults: {
          include: {
            candidate: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true
              }
            }
          }
        }
      }
    });

    if (!analysis) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Analiz bulunamadı'
      });
    }

    if (analysis.userId !== userId || analysis.organizationId !== organizationId) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Bu analize erişim yetkiniz yok'
      });
    }

    // Filter candidates
    let targetResults = analysis.analysisResults;

    if (candidateIds && candidateIds.length > 0) {
      // Specific candidates
      targetResults = targetResults.filter(r => candidateIds.includes(r.candidateId));
    } else {
      // Auto-filter by score threshold
      targetResults = targetResults.filter(r => r.compatibilityScore < scoreThreshold);
    }

    if (targetResults.length === 0) {
      return res.status(400).json({
        error: 'No Candidates',
        message: `${scoreThreshold} puan altında veya seçilmiş aday bulunamadı`
      });
    }

    // Generate feedback for each candidate
    const { generateBulkFeedback } = require('../services/feedbackGeneratorService');
    const { sendEmail } = require('../services/emailService');
    const { generateFeedbackEmailHTML, generateFeedbackEmailText } = require('../templates/feedbackEmail');

    const feedbackResults = await generateBulkFeedback(targetResults, analysis.jobPosting);

    // Send emails
    const emailResults = [];
    for (const feedback of feedbackResults) {
      if (feedback.error) {
        emailResults.push({
          candidateId: feedback.candidateId,
          success: false,
          error: feedback.error
        });
        continue;
      }

      try {
        const htmlContent = generateFeedbackEmailHTML(
          feedback.feedback,
          feedback.candidateName,
          analysis.jobPosting.title
        );

        const textContent = generateFeedbackEmailText(
          feedback.feedback,
          feedback.candidateName,
          analysis.jobPosting.title
        );

        await sendEmail({
          to: feedback.candidateEmail,
          subject: `${analysis.jobPosting.title} Başvuru Geri Bildirimi - ${feedback.candidateName}`,
          text: textContent,
          html: htmlContent
        });

        emailResults.push({
          candidateId: feedback.candidateId,
          candidateEmail: feedback.candidateEmail,
          success: true
        });

        console.log(`✅ Feedback email sent to ${feedback.candidateEmail}`);
      } catch (emailError) {
        console.error(`❌ Failed to send feedback to ${feedback.candidateEmail}:`, emailError.message);
        emailResults.push({
          candidateId: feedback.candidateId,
          candidateEmail: feedback.candidateEmail,
          success: false,
          error: emailError.message
        });
      }
    }

    const successCount = emailResults.filter(r => r.success).length;
    const failureCount = emailResults.filter(r => !r.success).length;

    res.json({
      success: true,
      message: `Geri bildirim e-postaları gönderildi`,
      stats: {
        total: targetResults.length,
        successful: successCount,
        failed: failureCount,
        scoreThreshold: scoreThreshold
      },
      results: emailResults
    });

  } catch (error) {
    console.error('Send candidate feedback error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Geri bildirim gönderilirken bir hata oluştu',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}

module.exports = {
  createAnalysis,
  getAllAnalyses,
  getAnalysisById,
  deleteAnalysis,
  addCandidatesToAnalysis,
  sendCandidateFeedback
};
