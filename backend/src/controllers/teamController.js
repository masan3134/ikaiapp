const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { sendInvitationEmail } = require('../services/emailService');
const crypto = require('crypto');
const bcrypt = require('bcrypt');

/**
 * GET /api/v1/team
 * Get all team members for current organization
 * Query params: page, limit, search, role
 */
exports.getTeamMembers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', role } = req.query;
    const skip = (page - 1) * limit;

    const where = {
      organizationId: req.organizationId,
      ...(search && {
        OR: [
          { email: { contains: search, mode: 'insensitive' } },
          { name: { contains: search, mode: 'insensitive' } }
        ]
      }),
      ...(role && { role })
    };

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip: parseInt(skip),
        take: parseInt(limit),
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          isActive: true,
          isOnboarded: true,
          createdAt: true,
          updatedAt: true
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.user.count({ where })
    ]);

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get team members error:', error);
    res.status(500).json({
      success: false,
      message: 'Takım üyeleri alınırken hata oluştu'
    });
  }
};

/**
 * GET /api/v1/team/:id
 * Get single team member details
 */
exports.getTeamMember = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findFirst({
      where: {
        id,
        organizationId: req.organizationId
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        isOnboarded: true,
        createdAt: true,
        updatedAt: true
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
    console.error('Get team member error:', error);
    res.status(500).json({
      success: false,
      message: 'Kullanıcı bilgileri alınırken hata oluştu'
    });
  }
};

/**
 * POST /api/v1/team/invite
 * Invite new team member via email
 * Body: { email, role, name? }
 */
exports.inviteTeamMember = async (req, res) => {
  try {
    const { email, role, name } = req.body;

    // Validation
    if (!email || !role) {
      return res.status(400).json({
        success: false,
        message: 'Email ve rol gereklidir'
      });
    }

    // Check if user already exists in this organization
    const existingUser = await prisma.user.findFirst({
      where: {
        email,
        organizationId: req.organizationId
      }
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Bu email adresi zaten organizasyonda kayıtlı'
      });
    }

    // Check user limit based on plan
    const organization = await prisma.organization.findUnique({
      where: { id: req.organizationId },
      include: { users: true }
    });

    const userCount = organization.users.length;
    const maxUsers = organization.maxUsers || 999999;

    if (userCount >= maxUsers) {
      return res.status(403).json({
        success: false,
        message: `Kullanıcı limiti aşıldı (Maksimum: ${maxUsers})`
      });
    }

    // Generate invitation token
    const invitationToken = crypto.randomBytes(32).toString('hex');
    const invitationExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    // Create user with pending status
    const newUser = await prisma.user.create({
      data: {
        email,
        name: name || email.split('@')[0],
        role,
        organizationId: req.organizationId,
        isActive: true,
        isOnboarded: false,
        invitationToken,
        invitationExpiry,
        password: crypto.randomBytes(32).toString('hex') // Temporary password
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        createdAt: true
      }
    });

    // Send invitation email
    const invitationLink = `${process.env.FRONTEND_URL}/accept-invitation?token=${invitationToken}`;
    await sendInvitationEmail(email, {
      inviterName: req.user.name || req.user.email,
      organizationName: organization.name,
      invitationLink,
      role
    });

    res.status(201).json({
      success: true,
      message: 'Davetiye başarıyla gönderildi',
      data: newUser
    });
  } catch (error) {
    console.error('Invite team member error:', error);
    res.status(500).json({
      success: false,
      message: 'Davet gönderilirken hata oluştu'
    });
  }
};

/**
 * PATCH /api/v1/team/:id
 * Update team member (role, name)
 * Body: { role?, name?, isActive? }
 */
exports.updateTeamMember = async (req, res) => {
  try {
    const { id } = req.params;
    const { role, name, isActive } = req.body;

    // Check if user exists in organization
    const user = await prisma.user.findFirst({
      where: {
        id,
        organizationId: req.organizationId
      }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Kullanıcı bulunamadı'
      });
    }

    // Prevent updating SUPER_ADMIN role
    if (user.role === 'SUPER_ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'SUPER_ADMIN kullanıcıları düzenlenemez'
      });
    }

    // Prevent self-demotion from ADMIN
    if (user.id === req.user.id && role && role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Kendi admin yetkilerinizi kaldıramazsınız'
      });
    }

    const updateData = {};
    if (role) updateData.role = role;
    if (name) updateData.name = name;
    if (typeof isActive === 'boolean') updateData.isActive = isActive;

    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        updatedAt: true
      }
    });

    res.json({
      success: true,
      message: 'Kullanıcı başarıyla güncellendi',
      data: updatedUser
    });
  } catch (error) {
    console.error('Update team member error:', error);
    res.status(500).json({
      success: false,
      message: 'Kullanıcı güncellenirken hata oluştu'
    });
  }
};

/**
 * PATCH /api/v1/team/:id/toggle
 * Toggle team member active status
 */
exports.toggleTeamMember = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findFirst({
      where: {
        id,
        organizationId: req.organizationId
      }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Kullanıcı bulunamadı'
      });
    }

    // Prevent toggling SUPER_ADMIN
    if (user.role === 'SUPER_ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'SUPER_ADMIN kullanıcıları devre dışı bırakılamaz'
      });
    }

    // Prevent self-toggle
    if (user.id === req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Kendi hesabınızı devre dışı bırakamazsınız'
      });
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { isActive: !user.isActive },
      select: {
        id: true,
        email: true,
        name: true,
        isActive: true
      }
    });

    res.json({
      success: true,
      message: `Kullanıcı ${updatedUser.isActive ? 'aktif' : 'pasif'} hale getirildi`,
      data: updatedUser
    });
  } catch (error) {
    console.error('Toggle team member error:', error);
    res.status(500).json({
      success: false,
      message: 'Kullanıcı durumu değiştirilirken hata oluştu'
    });
  }
};

/**
 * DELETE /api/v1/team/:id
 * Soft delete team member (set isActive = false + deletedAt)
 */
exports.deleteTeamMember = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findFirst({
      where: {
        id,
        organizationId: req.organizationId
      }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Kullanıcı bulunamadı'
      });
    }

    // Prevent deleting SUPER_ADMIN
    if (user.role === 'SUPER_ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'SUPER_ADMIN kullanıcıları silinemez'
      });
    }

    // Prevent self-delete
    if (user.id === req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Kendi hesabınızı silemezsiniz'
      });
    }

    // Soft delete (keep user in DB but mark as deleted)
    await prisma.user.update({
      where: { id },
      data: {
        isActive: false,
        deletedAt: new Date(),
        email: `deleted_${Date.now()}_${user.email}` // Unique email for soft delete
      }
    });

    res.json({
      success: true,
      message: 'Kullanıcı başarıyla silindi'
    });
  } catch (error) {
    console.error('Delete team member error:', error);
    res.status(500).json({
      success: false,
      message: 'Kullanıcı silinirken hata oluştu'
    });
  }
};

/**
 * POST /api/v1/team/accept-invitation
 * Accept team invitation and set password
 * Public endpoint (no auth required)
 */
exports.acceptInvitation = async (req, res) => {
  try {
    const { token, password, name } = req.body;

    // Validation
    if (!token || !password) {
      return res.status(400).json({
        success: false,
        message: 'Token ve şifre gereklidir'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Şifre en az 6 karakter olmalıdır'
      });
    }

    // Find user with token
    const user = await prisma.user.findFirst({
      where: {
        invitationToken: token,
        invitationExpiry: {
          gt: new Date() // Token not expired
        }
      },
      include: {
        organization: true
      }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Geçersiz veya süresi dolmuş davet linki'
      });
    }

    // Check if already onboarded
    if (user.isOnboarded) {
      return res.status(400).json({
        success: false,
        message: 'Bu davet linki zaten kullanılmış'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        name: name || user.name,
        isOnboarded: true,
        invitationToken: null,
        invitationExpiry: null
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        organizationId: true,
        organization: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    res.json({
      success: true,
      message: 'Hesabınız başarıyla oluşturuldu',
      data: updatedUser
    });
  } catch (error) {
    console.error('Accept invitation error:', error);
    res.status(500).json({
      success: false,
      message: 'Davet kabul edilirken hata oluştu'
    });
  }
};
