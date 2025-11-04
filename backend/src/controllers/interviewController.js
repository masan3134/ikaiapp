const interviewService = require('../services/interviewService');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const googleMeetService = require('../services/googleMeetService');

/**
 * Interview Controller
 * Handles all interview-related HTTP requests
 */

class InterviewController {
  
  /**
   * Get recent candidates for wizard Step 1
   * GET /api/interviews/candidates/recent?search=query&limit=10
   */
  async getRecentCandidates(req, res) {
    try {
      const { search, limit } = req.query;
      const userId = req.user.id;
      const userRole = req.user.role;
      const organizationId = req.organizationId;

      // ADMIN/MANAGER/HR_SPECIALIST can see all org candidates
      // USER can only see their own candidates
      const canSeeAllCandidates = ['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'HR_SPECIALIST'].includes(userRole);
      const filterUserId = canSeeAllCandidates ? null : userId;

      const candidates = await interviewService.getRecentCandidates(filterUserId, organizationId, {
        search,
        limit
      });

      res.json({
        success: true,
        data: candidates
      });
    } catch (error) {
      console.error('❌ Get recent candidates error:', error);
      res.status(500).json({
        success: false,
        error: 'Adaylar yüklenirken hata oluştu'
      });
    }
  }

  /**
   * Check scheduling conflicts for wizard Step 2
   * POST /api/interviews/check-conflicts
   */
  async checkConflicts(req, res) {
    try {
      const { date, time } = req.body;
      const interviewerId = req.user.id;
      const organizationId = req.organizationId;

      const result = await interviewService.checkConflicts(date, time, interviewerId, organizationId);

      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      console.error('❌ Check conflicts error:', error);
      res.status(500).json({
        success: false,
        error: 'Çakışma kontrolü yapılamadı'
      });
    }
  }

  /**
   * Create new interview with Google Meet
   * POST /api/interviews
   */
  async createInterview(req, res) {
    try {
      const userId = req.user.id;
      const organizationId = req.organizationId;
      const interviewData = req.body;

      // Set interviewerId to current user if not specified
      if (!interviewData.interviewerId) {
        interviewData.interviewerId = userId;
      }

      const interview = await interviewService.createInterview(interviewData, userId, organizationId);

      res.status(201).json({
        success: true,
        message: 'Mülakat başarıyla oluşturuldu ve e-postalar gönderildi',
        data: interview
      });
    } catch (error) {
      console.error('❌ Create interview error:', error);
      res.status(500).json({
        success: false,
        error: 'Mülakat oluşturulurken hata oluştu: ' + error.message
      });
    }
  }

  /**
   * Get all interviews with pagination and filters
   * GET /api/interviews?status=scheduled&type=online&page=1&limit=20
   */
  async getInterviews(req, res) {
    try {
      const userId = req.user.id;
      const userRole = req.userRole;
      const organizationId = req.organizationId;
      const filters = req.query;

      const result = await interviewService.getInterviews(userId, organizationId, userRole, filters);

      res.json({
        success: true,
        data: result.interviews,
        pagination: result.pagination
      });
    } catch (error) {
      console.error('❌ Get interviews error:', error);
      res.status(500).json({
        success: false,
        error: 'Mülakatlar yüklenirken hata oluştu'
      });
    }
  }

  /**
   * Get interview statistics
   * GET /api/interviews/stats
   */
  async getStats(req, res) {
    try {
      const userId = req.user.id;
      const userRole = req.userRole;
      const organizationId = req.organizationId;
      const stats = await interviewService.getStats(userId, organizationId, userRole);

      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      console.error('❌ Get stats error:', error);
      res.status(500).json({
        success: false,
        error: 'İstatistikler yüklenirken hata oluştu'
      });
    }
  }

  /**
   * Get single interview by ID
   * GET /api/interviews/:id
   */
  async getInterviewById(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const userRole = req.userRole;
      const organizationId = req.organizationId;

      // Role-based filtering
      let where = { id };

      if (userRole === 'SUPER_ADMIN') {
        // SUPER_ADMIN: Can view any interview
        where = { id };
      } else if (['ADMIN', 'MANAGER', 'HR_SPECIALIST'].includes(userRole)) {
        // ADMIN/MANAGER/HR: Can view interviews from their organization
        where = { id, organizationId };
      } else {
        // USER: Can view only their own interviews
        where = { id, createdBy: userId, organizationId };
      }

      const interview = await prisma.interview.findFirst({
        where,
        include: {
          candidates: {
            include: {
              candidate: true
            }
          },
          interviewer: {
            select: { id: true, email: true, role: true }
          }
        }
      });

      if (!interview) {
        return res.status(404).json({
          success: false,
          error: 'Mülakat bulunamadı'
        });
      }

      res.json({
        success: true,
        data: interview
      });
    } catch (error) {
      console.error('❌ Get interview error:', error);
      res.status(500).json({
        success: false,
        error: 'Mülakat yüklenirken hata oluştu'
      });
    }
  }

  /**
   * Update interview status
   * PATCH /api/interviews/:id/status
   */
  async updateStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const userId = req.user.id;
      const userRole = req.userRole;
      const organizationId = req.organizationId;

      // Role-based filtering
      let where = { id };

      if (userRole === 'SUPER_ADMIN') {
        // SUPER_ADMIN: Can update any interview
        where = { id };
      } else if (['ADMIN', 'MANAGER', 'HR_SPECIALIST'].includes(userRole)) {
        // ADMIN/MANAGER/HR: Can update interviews from their organization
        where = { id, organizationId };
      } else {
        // USER: Can update only their own interviews
        where = { id, createdBy: userId, organizationId };
      }

      const interview = await prisma.interview.updateMany({
        where,
        data: { status }
      });

      if (interview.count === 0) {
        return res.status(404).json({
          success: false,
          error: 'Mülakat bulunamadı'
        });
      }

      res.json({
        success: true,
        message: 'Mülakat durumu güncellendi'
      });
    } catch (error) {
      console.error('❌ Update status error:', error);
      res.status(500).json({
        success: false,
        error: 'Durum güncellenirken hata oluştu'
      });
    }
  }

  /**
   * Delete interview
   * DELETE /api/interviews/:id
   */
  async deleteInterview(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const userRole = req.userRole;
      const organizationId = req.organizationId;

      // Role-based filtering
      let where = { id };

      if (userRole === 'SUPER_ADMIN') {
        // SUPER_ADMIN: Can delete any interview
        where = { id };
      } else if (['ADMIN', 'MANAGER', 'HR_SPECIALIST'].includes(userRole)) {
        // ADMIN/MANAGER/HR: Can delete interviews from their organization
        where = { id, organizationId };
      } else {
        // USER: Can delete only their own interviews
        where = { id, createdBy: userId, organizationId };
      }

      // Cancel Google Meet event if exists
      const interview = await prisma.interview.findFirst({
        where
      });

      if (!interview) {
        return res.status(404).json({
          success: false,
          error: 'Mülakat bulunamadı'
        });
      }

      if (interview.meetEventId && googleMeetService.isEnabled) {
        try {
          await googleMeetService.cancelMeetEvent(interview.meetEventId);
        } catch (error) {
          console.error('⚠️ Google Meet cancellation failed:', error.message);
        }
      }

      await prisma.interview.delete({
        where: { id }
      });

      res.json({
        success: true,
        message: 'Mülakat silindi'
      });
    } catch (error) {
      console.error('❌ Delete interview error:', error);
      res.status(500).json({
        success: false,
        error: 'Mülakat silinirken hata oluştu'
      });
    }
  }
}

module.exports = new InterviewController();
