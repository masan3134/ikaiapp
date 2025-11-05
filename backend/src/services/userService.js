const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

/**
 * User Management Service
 * Business logic for user CRUD operations
 */
class UserService {

  /**
   * Get all users with pagination and filters
   */
  async getAllUsers({ page = 1, limit = 20, role, organizationId }) {
    const skip = (page - 1) * limit;

    const where = { organizationId };
    if (role) {
      where.role = role;
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc'
        },
        select: {
          id: true,
          email: true,
          role: true,
          organizationId: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: {
              jobPostings: true,
              candidates: true,
              analyses: true,
              offersCreated: true
            }
          }
        }
      }),
      prisma.user.count({ where })
    ]);

    return {
      users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  /**
   * Get user by ID with full details
   */
  async getUserById(id, organizationId) {
    const user = await prisma.user.findFirst({
      where: { id, organizationId },
      select: {
        id: true,
        email: true,
        role: true,
        organizationId: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            jobPostings: true,
            candidates: true,
            analyses: true,
            offersCreated: true
          }
        }
      }
    });

    if (!user) {
      throw new Error('Kullanıcı bulunamadı');
    }

    return user;
  }

  /**
   * Create new user
   */
  async createUser({ email, password, role = 'USER', organizationId, firstName, lastName, department }) {
    // Validate
    if (!email || !password) {
      throw new Error('Email ve şifre zorunludur');
    }

    if (!organizationId) {
      throw new Error('Organization ID zorunludur');
    }

    if (password.length < 6) {
      throw new Error('Şifre en az 6 karakter olmalıdır');
    }

    if (!['USER', 'ADMIN', 'HR_SPECIALIST', 'MANAGER'].includes(role)) {
      throw new Error('Geçersiz rol');
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() }
    });

    if (existingUser) {
      throw new Error('Bu email adresi zaten kullanılıyor');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        role,
        organizationId,
        ...(firstName && { firstName }),
        ...(lastName && { lastName })
      },
      select: {
        id: true,
        email: true,
        role: true,
        organizationId: true,
        createdAt: true
      }
    });

    return user;
  }

  /**
   * Update user
   */
  async updateUser(id, { email, role }, organizationId) {
    const user = await prisma.user.findFirst({
      where: { id, organizationId }
    });

    if (!user) {
      throw new Error('Kullanıcı bulunamadı');
    }

    const updateData = {};

    if (email) {
      // Check if new email is taken
      const emailExists = await prisma.user.findFirst({
        where: {
          email: email.toLowerCase().trim(),
          id: { not: id }
        }
      });

      if (emailExists) {
        throw new Error('Bu email adresi zaten kullanılıyor');
      }

      updateData.email = email.toLowerCase().trim();
    }

    if (role) {
      if (!['USER', 'ADMIN'].includes(role)) {
        throw new Error('Geçersiz rol');
      }
      updateData.role = role;
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        email: true,
        role: true,
        updatedAt: true
      }
    });

    return updatedUser;
  }

  /**
   * Delete user (for now, hard delete - could be soft delete if needed)
   */
  async deleteUser(id, organizationId) {
    const user = await prisma.user.findFirst({
      where: { id, organizationId },
      include: {
        _count: {
          select: {
            jobPostings: true,
            candidates: true,
            analyses: true
          }
        }
      }
    });

    if (!user) {
      throw new Error('Kullanıcı bulunamadı');
    }

    // Check if user has data
    const hasData = user._count.jobPostings > 0 ||
                    user._count.candidates > 0 ||
                    user._count.analyses > 0;

    if (hasData) {
      throw new Error('Bu kullanıcıya ait veri bulunuyor. Önce ilgili verileri silmelisiniz.');
    }

    await prisma.user.delete({
      where: { id }
    });

    return { message: 'Kullanıcı silindi' };
  }

  /**
   * Change user password (admin only)
   */
  async changePassword(id, newPassword, organizationId) {
    const user = await prisma.user.findFirst({
      where: { id, organizationId }
    });

    if (!user) {
      throw new Error('Kullanıcı bulunamadı');
    }

    if (!newPassword || newPassword.length < 6) {
      throw new Error('Yeni şifre en az 6 karakter olmalıdır');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id },
      data: { password: hashedPassword }
    });

    return { message: 'Şifre değiştirildi' };
  }

  /**
   * Change own password (authenticated user)
   * Validates current password before changing
   */
  async changeOwnPassword(userId, currentPassword, newPassword) {
    // Get user with password
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      throw new Error('Kullanıcı bulunamadı');
    }

    // Validate current password
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      throw new Error('Mevcut şifre hatalı');
    }

    // Validate new password
    if (!newPassword || newPassword.length < 8) {
      throw new Error('Yeni şifre en az 8 karakter olmalıdır');
    }

    // Check if new password is same as current
    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      throw new Error('Yeni şifre mevcut şifre ile aynı olamaz');
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword }
    });

    return { message: 'Şifre başarıyla değiştirildi' };
  }
}

module.exports = new UserService();
