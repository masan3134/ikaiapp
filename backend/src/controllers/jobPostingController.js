const { PrismaClient } = require('@prisma/client');
const { validationResult } = require('express-validator');

const prisma = new PrismaClient();

/**
 * Get all job postings
 * GET /api/job-postings?page=1&limit=20
 * Regular users see only their own, admins see all
 */
async function getAllJobPostings(req, res) {
  try {
    const userId = req.user.id;
    const isAdmin = req.user.role === 'ADMIN';
    const organizationId = req.organizationId;
    const { page = 1, limit = 20 } = req.query;

    // Pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Build query based on user role (exclude deleted)
    const where = isAdmin ? { isDeleted: false } : { userId, organizationId, isDeleted: false };

    // Get total count for pagination
    const totalCount = await prisma.jobPosting.count({ where });

    const jobPostings = await prisma.jobPosting.findMany({
      where,
      skip,
      take: limitNum,
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            role: true
          }
        },
        _count: {
          select: {
            analyses: true
          }
        }
      }
    });

    res.json({
      jobPostings,
      count: jobPostings.length,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limitNum)
      }
    });
  } catch (error) {
    console.error('Get job postings error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch job postings'
    });
  }
}

/**
 * Create new job posting
 * POST /api/job-postings
 */
async function createJobPosting(req, res) {
  try {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Geçersiz giriş verileri',
        details: errors.array()
      });
    }

    const { title, department, details, notes } = req.body;
    const userId = req.user.id;
    const organizationId = req.organizationId;

    // Create job posting
    const jobPosting = await prisma.jobPosting.create({
      data: {
        title: title.trim(),
        department: department.trim(),
        details: details.trim(),
        notes: notes ? notes.trim() : null,
        userId,
        organizationId
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            role: true
          }
        }
      }
    });

    res.status(201).json({
      message: 'İş ilanı başarıyla oluşturuldu',
      jobPosting
    });
  } catch (error) {
    console.error('Create job posting error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'İş ilanı oluşturulamadı'
    });
  }
}

/**
 * Get job posting by ID
 * GET /api/job-postings/:id
 */
async function getJobPostingById(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const isAdmin = req.user.role === 'ADMIN';
    const organizationId = req.organizationId;

    const jobPosting = await prisma.jobPosting.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            role: true
          }
        },
        analyses: {
          include: {
            _count: {
              select: {
                analysisResults: true
              }
            }
          }
        }
      }
    });

    if (!jobPosting) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'İş ilanı bulunamadı'
      });
    }

    // Check ownership
    if ((jobPosting.userId !== userId || jobPosting.organizationId !== organizationId) && !isAdmin) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Bu ilana erişim yetkiniz yok'
      });
    }

    res.json({ jobPosting });
  } catch (error) {
    console.error('Get job posting by ID error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'İş ilanı getirilemedi'
    });
  }
}

/**
 * Update job posting
 * PUT /api/job-postings/:id
 */
async function updateJobPosting(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const isAdmin = req.user.role === 'ADMIN';
    const organizationId = req.organizationId;
    const { title, department, details, notes } = req.body;

    // Check if job posting exists
    const existingJobPosting = await prisma.jobPosting.findUnique({
      where: { id }
    });

    if (!existingJobPosting) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'İş ilanı bulunamadı'
      });
    }

    // Check ownership
    if ((existingJobPosting.userId !== userId || existingJobPosting.organizationId !== organizationId) && !isAdmin) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Bu ilanı düzenleme yetkiniz yok'
      });
    }

    // Update job posting
    const updatedJobPosting = await prisma.jobPosting.update({
      where: { id },
      data: {
        title: title ? title.trim() : existingJobPosting.title,
        department: department ? department.trim() : existingJobPosting.department,
        details: details ? details.trim() : existingJobPosting.details,
        notes: notes !== undefined ? (notes ? notes.trim() : null) : existingJobPosting.notes
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            role: true
          }
        }
      }
    });

    res.json({
      message: 'İş ilanı güncellendi',
      jobPosting: updatedJobPosting
    });
  } catch (error) {
    console.error('Update job posting error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'İş ilanı güncellenemedi'
    });
  }
}

/**
 * Soft delete job posting (mark as deleted, keep in database)
 * DELETE /api/job-postings/:id
 */
async function deleteJobPosting(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const isAdmin = req.user.role === 'ADMIN';
    const organizationId = req.organizationId;

    // Check if job posting exists
    const jobPosting = await prisma.jobPosting.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            analyses: true
          }
        }
      }
    });

    if (!jobPosting) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'İş ilanı bulunamadı'
      });
    }

    // Check ownership
    if ((jobPosting.userId !== userId || jobPosting.organizationId !== organizationId) && !isAdmin) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Bu ilanı silme yetkiniz yok'
      });
    }

    // Check if already deleted
    if (jobPosting.isDeleted) {
      return res.status(400).json({
        error: 'Already Deleted',
        message: 'Bu iş ilanı zaten silinmiş'
      });
    }

    // Soft delete: Mark as deleted (analyses remain intact)
    await prisma.jobPosting.update({
      where: { id },
      data: {
        isDeleted: true,
        deletedAt: new Date()
      }
    });

    console.log(`🗑️  Soft deleted job posting: ${jobPosting.title} (${id})`);

    res.json({
      message: 'İş ilanı arşivlendi',
      deletedAnalysesCount: jobPosting._count.analyses
    });
  } catch (error) {
    console.error('Delete job posting error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'İş ilanı silinemedi'
    });
  }
}

module.exports = {
  getAllJobPostings,
  createJobPosting,
  getJobPostingById,
  updateJobPosting,
  deleteJobPosting
};
