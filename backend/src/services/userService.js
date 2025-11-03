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
  async getAllUsers({ page = 1, limit = 20, role }) {
    const skip = (page - 1) * limit;

    const where = {};
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
          createdAt: true,
          updatedAt: true,
          _count: {
            select: {
              jobPostings: true,
              candidates: true,
              analyses: true,
              createdOffers: true
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
  async getUserById(id) {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            jobPostings: true,
            candidates: true,
            analyses: true,
            createdOffers: true
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
  async createUser({ email, password, role = 'USER' }) {
    // Validate
    if (!email || !password) {
      throw new Error('Email ve şifre zorunludur');
    }

    if (password.length < 6) {
      throw new Error('Şifre en az 6 karakter olmalıdır');
    }

    if (!['USER', 'ADMIN'].includes(role)) {
      throw new Error('Geçersiz rol. USER veya ADMIN olmalıdır');
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
        role
      },
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true
      }
    });

    return user;
  }

  /**
   * Update user
   */
  async updateUser(id, { email, role }) {
    const user = await prisma.user.findUnique({
      where: { id }
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
  async deleteUser(id) {
    const user = await prisma.user.findUnique({
      where: { id },
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
  async changePassword(id, newPassword) {
    const user = await prisma.user.findUnique({
      where: { id }
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
}

module.exports = new UserService();
