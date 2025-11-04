const userService = require('../services/userService');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * User Management Controller
 * Admin-only endpoints for managing users
 */
class UserController {

  /**
   * Get all users with pagination
   * GET /api/v1/users?page=1&limit=20&role=USER
   */
  async getAllUsers(req, res) {
    try {
      const { page = 1, limit = 20, role } = req.query;

      const result = await userService.getAllUsers({
        page: parseInt(page),
        limit: parseInt(limit),
        role,
        organizationId: req.organizationId
      });

      res.json({
        success: true,
        data: result.users,
        pagination: result.pagination
      });
    } catch (error) {
      console.error('❌ Get all users error:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Kullanıcılar yüklenirken hata oluştu'
      });
    }
  }

  /**
   * Get user by ID
   * GET /api/v1/users/:id
   */
  async getUserById(req, res) {
    try {
      const { id } = req.params;
      const user = await userService.getUserById(id, req.organizationId);

      res.json({
        success: true,
        data: user
      });
    } catch (error) {
      console.error('❌ Get user by ID error:', error);
      res.status(404).json({
        success: false,
        error: error.message || 'Kullanıcı bulunamadı'
      });
    }
  }

  /**
   * Create new user
   * POST /api/v1/users
   */
  async createUser(req, res) {
    try {
      const user = await userService.createUser(req.body);

      res.status(201).json({
        success: true,
        message: 'Kullanıcı başarıyla oluşturuldu',
        data: user
      });
    } catch (error) {
      console.error('❌ Create user error:', error);
      res.status(400).json({
        success: false,
        error: error.message || 'Kullanıcı oluşturulurken hata oluştu'
      });
    }
  }

  /**
   * Update user
   * PUT /api/v1/users/:id
   */
  async updateUser(req, res) {
    try {
      const { id } = req.params;
      const user = await userService.updateUser(id, req.body, req.organizationId);

      res.json({
        success: true,
        message: 'Kullanıcı güncellendi',
        data: user
      });
    } catch (error) {
      console.error('❌ Update user error:', error);
      res.status(400).json({
        success: false,
        error: error.message || 'Kullanıcı güncellenirken hata oluştu'
      });
    }
  }

  /**
   * Delete user (soft delete)
   * DELETE /api/v1/users/:id
   */
  async deleteUser(req, res) {
    try {
      const { id } = req.params;
      await userService.deleteUser(id, req.organizationId);

      res.json({
        success: true,
        message: 'Kullanıcı silindi'
      });
    } catch (error) {
      console.error('❌ Delete user error:', error);
      res.status(400).json({
        success: false,
        error: error.message || 'Kullanıcı silinirken hata oluştu'
      });
    }
  }

  /**
   * Change user password (admin only)
   * PATCH /api/v1/users/:id/password
   */
  async changePassword(req, res) {
    try {
      const { id } = req.params;
      const { newPassword } = req.body;

      if (!newPassword || newPassword.length < 6) {
        return res.status(400).json({
          success: false,
          error: 'Yeni şifre en az 6 karakter olmalıdır'
        });
      }

      await userService.changePassword(id, newPassword, req.organizationId);

      res.json({
        success: true,
        message: 'Şifre başarıyla değiştirildi'
      });
    } catch (error) {
      console.error('❌ Change password error:', error);
      res.status(400).json({
        success: false,
        error: error.message || 'Şifre değiştirilemedi'
      });
    }
  }

  /**
   * Get current user profile
   */
  async getCurrentUser(req, res) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: req.user.id },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          avatar: true,
          position: true,
          role: true,
          isActive: true,
          createdAt: true
        }
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Kullanıcı bulunamadı'
        });
      }

      res.json({
        success: true,
        data: user
      });
    } catch (error) {
      console.error('❌ Get current user error:', error);
      res.status(500).json({
        success: false,
        message: 'Kullanıcı bilgileri alınamadı'
      });
    }
  }

  /**
   * Get current user activity stats
   */
  async getUserStats(req, res) {
    try {
      const userId = req.user.id;

      const [
        analysisCount,
        candidateCount,
        jobPostingCount,
        interviewCount,
        offerCount,
        recentAnalyses
      ] = await Promise.all([
        prisma.analysis.count({ where: { userId } }),
        prisma.candidate.count({ where: { userId, isDeleted: false } }),
        prisma.jobPosting.count({ where: { userId, isDeleted: false } }),
        prisma.interview.count({ where: { createdBy: userId } }),
        prisma.jobOffer.count({ where: { createdBy: userId } }),
        prisma.analysis.findMany({
          where: { userId },
          take: 5,
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            createdAt: true,
            status: true,
            jobPosting: {
              select: { title: true }
            }
          }
        })
      ]);

      res.json({
        success: true,
        data: {
          totalAnalyses: analysisCount,
          totalCandidates: candidateCount,
          totalJobPostings: jobPostingCount,
          totalInterviews: interviewCount,
          totalOffers: offerCount,
          recentAnalyses
        }
      });
    } catch (error) {
      console.error('❌ Get user stats error:', error);
      res.status(500).json({
        success: false,
        message: 'İstatistikler alınamadı'
      });
    }
  }

  /**
   * Update current user profile
   */
  async updateCurrentUser(req, res) {
    try {
      const { firstName, lastName, avatar, position } = req.body;

      const updated = await prisma.user.update({
        where: { id: req.user.id },
        data: {
          ...(firstName !== undefined && { firstName }),
          ...(lastName !== undefined && { lastName }),
          ...(avatar !== undefined && { avatar }),
          ...(position !== undefined && { position })
        },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          avatar: true,
          position: true,
          role: true
        }
      });

      res.json({
        success: true,
        data: updated,
        message: 'Profil başarıyla güncellendi'
      });
    } catch (error) {
      console.error('❌ Update current user error:', error);
      res.status(500).json({
        success: false,
        message: 'Profil güncellenemedi'
      });
    }
  }

  /**
   * Get user notification preferences
   */
  async getNotificationPreferences(req, res) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: req.user.id },
        select: {
          emailNotifications: true,
          analysisNotifications: true,
          teamNotifications: true,
          offerNotifications: true
        }
      });

      res.json({
        success: true,
        data: user || {
          emailNotifications: true,
          analysisNotifications: true,
          teamNotifications: true,
          offerNotifications: true
        }
      });
    } catch (error) {
      console.error('❌ Get notifications error:', error);
      res.status(500).json({
        success: false,
        message: 'Bildirim ayarları alınamadı'
      });
    }
  }

  /**
   * Update user notification preferences
   */
  async updateNotificationPreferences(req, res) {
    try {
      const { emailNotifications, analysisNotifications, teamNotifications, offerNotifications } = req.body;

      const updated = await prisma.user.update({
        where: { id: req.user.id },
        data: {
          ...(emailNotifications !== undefined && { emailNotifications }),
          ...(analysisNotifications !== undefined && { analysisNotifications }),
          ...(teamNotifications !== undefined && { teamNotifications }),
          ...(offerNotifications !== undefined && { offerNotifications })
        },
        select: {
          emailNotifications: true,
          analysisNotifications: true,
          teamNotifications: true,
          offerNotifications: true
        }
      });

      res.json({
        success: true,
        data: updated,
        message: 'Bildirim ayarları güncellendi'
      });
    } catch (error) {
      console.error('❌ Update notifications error:', error);
      res.status(500).json({
        success: false,
        message: 'Bildirim ayarları güncellenemedi'
      });
    }
  }

  /**
   * Change own password
   * PATCH /api/v1/users/me/password
   */
  async changeOwnPassword(req, res) {
    try {
      const { currentPassword, newPassword } = req.body;

      if (!currentPassword || !newPassword) {
        return res.status(400).json({
          success: false,
          message: 'Mevcut şifre ve yeni şifre gereklidir'
        });
      }

      await userService.changeOwnPassword(req.user.id, currentPassword, newPassword);

      res.json({
        success: true,
        message: 'Şifre başarıyla değiştirildi'
      });
    } catch (error) {
      console.error('❌ Change own password error:', error);

      const statusCode = error.message === 'Mevcut şifre hatalı' ? 401 : 400;

      res.status(statusCode).json({
        success: false,
        message: error.message || 'Şifre değiştirilemedi'
      });
    }
  }

  /**
   * Get current user active sessions
   * GET /api/v1/users/me/sessions
   */
  async getCurrentUserSessions(req, res) {
    try {
      // Extract session info from request
      const userAgent = req.headers['user-agent'] || 'Unknown Device';
      const ip = req.ip || req.connection.remoteAddress || 'Unknown IP';

      // Parse user agent to get device info
      const getDeviceInfo = (ua) => {
        if (ua.includes('Chrome')) return 'Chrome';
        if (ua.includes('Firefox')) return 'Firefox';
        if (ua.includes('Safari')) return 'Safari';
        if (ua.includes('Edge')) return 'Edge';
        return 'Unknown Browser';
      };

      const getOSInfo = (ua) => {
        if (ua.includes('Windows')) return 'Windows';
        if (ua.includes('Mac OS')) return 'macOS';
        if (ua.includes('Linux')) return 'Linux';
        if (ua.includes('Android')) return 'Android';
        if (ua.includes('iOS')) return 'iOS';
        return 'Unknown OS';
      };

      const browser = getDeviceInfo(userAgent);
      const os = getOSInfo(userAgent);

      // Return current session (JWT-based, so only one active session)
      const sessions = [
        {
          id: req.user.id,
          device: `${browser} on ${os}`,
          location: 'Turkey', // Could be enhanced with IP geolocation
          ip: ip,
          lastActive: new Date(),
          current: true
        }
      ];

      res.json({
        success: true,
        data: sessions
      });
    } catch (error) {
      console.error('❌ Get current user sessions error:', error);
      res.status(500).json({
        success: false,
        message: 'Oturum bilgileri alınamadı'
      });
    }
  }
}

module.exports = new UserController();
