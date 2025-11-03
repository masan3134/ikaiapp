const userService = require('../services/userService');

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
        role
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
      const user = await userService.getUserById(id);

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
      const user = await userService.updateUser(id, req.body);

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
      await userService.deleteUser(id);

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

      await userService.changePassword(id, newPassword);

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
}

module.exports = new UserController();
