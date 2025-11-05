const { PrismaClient } = require('@prisma/client');
const minioService = require('../services/minioService');

const prisma = new PrismaClient();

/**
 * Get all candidates for current user
 * GET /api/candidates?page=1&limit=20
 */
async function getAllCandidates(req, res) {
  try {
    const userId = req.user.id;
    const organizationId = req.organizationId;
    const userRole = req.userRole;
    const { page = 1, limit = 20 } = req.query;

    // Pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Role-based data filtering
    let where = { isDeleted: false };

    if (userRole === 'SUPER_ADMIN') {
      // SUPER_ADMIN: ALL candidates from ALL organizations
      where = { isDeleted: false };

    } else if (userRole === 'MANAGER') {
      // MANAGER: Only candidates from their department (department isolation)
      const userDepartment = req.user.department;
      where = {
        organizationId,
        department: userDepartment, // Department filtering
        isDeleted: false
      };

    } else if (['ADMIN', 'HR_SPECIALIST'].includes(userRole)) {
      // ADMIN/HR: ALL candidates from their organization
      where = {
        organizationId,
        isDeleted: false
      };

    } else {
      // USER: Only their own uploaded candidates
      where = {
        userId,
        organizationId,
        isDeleted: false
      };
    }

    // Get total count for pagination
    const totalCount = await prisma.candidate.count({ where });

    const candidates = await prisma.candidate.findMany({
      where,
      skip,
      take: limitNum,
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        _count: {
          select: {
            analysisResults: true
          }
        }
      }
    });

    res.json({
      candidates,
      count: candidates.length,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limitNum)
      }
    });
  } catch (error) {
    console.error('Get candidates error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch candidates'
    });
  }
}

/**
 * Check if file with same name already exists for user
 * POST /api/candidates/check-duplicate
 */
async function checkDuplicateFile(req, res) {
  try {
    const { fileName } = req.body;
    const userId = req.user.id;
    const organizationId = req.organizationId;
    const userRole = req.userRole;

    if (!fileName) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Dosya adı zorunludur'
      });
    }

    // Role-based duplicate check scope
    let where = {
      sourceFileName: fileName,
      isDeleted: false
    };

    if (userRole === 'SUPER_ADMIN') {
      // SUPER_ADMIN: Check across ALL organizations
      where = {
        sourceFileName: fileName,
        isDeleted: false
      };

    } else if (['ADMIN', 'MANAGER', 'HR_SPECIALIST'].includes(userRole)) {
      // ADMIN/MANAGER/HR: Check within organization
      where = {
        organizationId,
        sourceFileName: fileName,
        isDeleted: false
      };

    } else {
      // USER: Check only their own uploads
      where = {
        userId,
        organizationId,
        sourceFileName: fileName,
        isDeleted: false
      };
    }

    const existingCandidate = await prisma.candidate.findFirst({ where });

    if (existingCandidate) {
      return res.json({
        exists: true,
        candidate: existingCandidate
      });
    }

    res.json({
      exists: false
    });
  } catch (error) {
    console.error('Check duplicate error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to check duplicate'
    });
  }
}

const { sanitizeFileName } = require('../utils/fileName');

/**
 * Upload CV file and create candidate record
 * POST /api/candidates/upload
 */
async function uploadCV(req, res) {
  try {
    const userId = req.user.id;
    const organizationId = req.organizationId;

    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Dosya yüklenmedi'
      });
    }

    const file = req.file;
    const originalFileName = file.originalname;
    const sanitizedFileName = sanitizeFileName(originalFileName);

    // Check for duplicate file (using original filename, exclude deleted)
    const existingCandidate = await prisma.candidate.findFirst({
      where: {
        userId,
        organizationId,
        sourceFileName: originalFileName,
        isDeleted: false
      }
    });

    if (existingCandidate) {
      return res.status(409).json({
        error: 'Duplicate File',
        message: 'Bu dosya daha önce yüklendi',
        exists: true,
        candidate: existingCandidate
      });
    }

    // Upload file to MinIO with sanitized filename
    await minioService.uploadFile(
      userId,
      sanitizedFileName,
      file.buffer,
      file.mimetype
    );

    // Get presigned URL for file access
    const fileUrl = await minioService.getFileUrl(userId, sanitizedFileName);

    // Get uploader's department for department isolation
    const uploaderDepartment = req.user.department;

    // Create candidate record (fields will be filled by AI in Phase 4)
    const candidate = await prisma.candidate.create({
      data: {
        userId,
        organizationId,
        department: uploaderDepartment, // Assign uploader's department
        sourceFileName: originalFileName, // Store original for duplicate check
        fileUrl,
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        address: '',
        experience: '',
        education: '',
        generalComment: ''
      }
    });

    res.status(201).json({
      message: 'CV başarıyla yüklendi',
      candidate
    });
  } catch (error) {
    console.error('Upload CV error:', error);

    // If error occurred after MinIO upload, try to clean up
    if (req.file && req.user) {
      try {
        await minioService.deleteFile(req.user.id, req.file.originalname);
      } catch (cleanupError) {
        console.error('Cleanup error:', cleanupError);
      }
    }

    res.status(500).json({
      error: 'Internal Server Error',
      message: 'CV yüklenemedi'
    });
  }
}

/**
 * Get candidate by ID
 * GET /api/candidates/:id
 */
async function getCandidateById(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const organizationId = req.organizationId;
    const userRole = req.userRole;

    const candidate = await prisma.candidate.findUnique({
      where: { id },
      include: {
        analysisResults: {
          include: {
            analysis: {
              include: {
                jobPosting: {
                  select: {
                    id: true,
                    title: true,
                    department: true
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!candidate) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Aday bulunamadı'
      });
    }

    // Role-based access control
    if (userRole === 'SUPER_ADMIN') {
      // SUPER_ADMIN can view any candidate
      // No restriction

    } else if (userRole === 'MANAGER') {
      // MANAGER can only view candidates from their department
      const userDepartment = req.user.department;
      if (candidate.organizationId !== organizationId || candidate.department !== userDepartment) {
        return res.status(403).json({
          error: 'Forbidden',
          message: 'Bu adaya erişim yetkiniz yok (department isolation)'
        });
      }

    } else if (['ADMIN', 'HR_SPECIALIST'].includes(userRole)) {
      // ADMIN/HR can view candidates from their organization
      if (candidate.organizationId !== organizationId) {
        return res.status(403).json({
          error: 'Forbidden',
          message: 'Bu adaya erişim yetkiniz yok'
        });
      }

    } else {
      // USER can only view their own uploaded candidates
      if (candidate.userId !== userId || candidate.organizationId !== organizationId) {
        return res.status(403).json({
          error: 'Forbidden',
          message: 'Bu adaya erişim yetkiniz yok'
        });
      }
    }

    res.json({ candidate });
  } catch (error) {
    console.error('Get candidate by ID error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Aday getirilemedi'
    });
  }
}

/**
 * Soft delete candidate (mark as deleted, keep in database)
 * DELETE /api/candidates/:id
 */
async function deleteCandidate(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const organizationId = req.organizationId;
    const userRole = req.userRole;

    // Get candidate
    const candidate = await prisma.candidate.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            analysisResults: true
          }
        }
      }
    });

    if (!candidate) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Aday bulunamadı'
      });
    }

    // Role-based delete permission
    if (userRole === 'SUPER_ADMIN') {
      // SUPER_ADMIN can delete any candidate
      // No restriction

    } else if (userRole === 'MANAGER') {
      // MANAGER can only delete candidates from their department
      const userDepartment = req.user.department;
      if (candidate.organizationId !== organizationId || candidate.department !== userDepartment) {
        return res.status(403).json({
          error: 'Forbidden',
          message: 'Bu adayı silme yetkiniz yok (department isolation)'
        });
      }

    } else if (['ADMIN', 'HR_SPECIALIST'].includes(userRole)) {
      // ADMIN/HR can delete candidates from their organization
      if (candidate.organizationId !== organizationId) {
        return res.status(403).json({
          error: 'Forbidden',
          message: 'Bu adayı silme yetkiniz yok'
        });
      }

    } else {
      // USER cannot delete candidates
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Aday silme yetkiniz yok'
      });
    }

    // Check if already deleted
    if (candidate.isDeleted) {
      return res.status(400).json({
        error: 'Already Deleted',
        message: 'Bu aday zaten silinmiş'
      });
    }

    // Soft delete: Mark as deleted (keep file in MinIO for analysis references)
    await prisma.candidate.update({
      where: { id },
      data: {
        isDeleted: true,
        deletedAt: new Date()
      }
    });

    console.log(`🗑️  Soft deleted candidate: ${candidate.firstName} ${candidate.lastName} (${id})`);

    res.json({
      message: 'Aday arşivlendi',
      deletedAnalysisResultsCount: candidate._count.analysisResults
    });
  } catch (error) {
    console.error('Delete candidate error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Aday silinemedi'
    });
  }
}

module.exports = {
  getAllCandidates,
  checkDuplicateFile,
  uploadCV,
  getCandidateById,
  deleteCandidate
};
