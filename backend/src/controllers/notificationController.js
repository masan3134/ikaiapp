const notificationService = require('../services/notificationService');

/**
 * Notification Controller
 * Handles all notification HTTP requests
 *
 * Endpoints:
 * - GET    /api/v1/notifications              Get user notifications
 * - GET    /api/v1/notifications/unread-count Get unread count
 * - PATCH  /api/v1/notifications/:id/read     Mark as read
 * - PATCH  /api/v1/notifications/read-all     Mark all as read
 * - GET    /api/v1/notifications/preferences  Get preferences
 * - PUT    /api/v1/notifications/preferences  Update all preferences
 * - PUT    /api/v1/notifications/preferences/:type Update single preference
 *
 * Created by: Worker #2
 * Date: 2025-11-04
 */

class NotificationController {
  /**
   * Get user notifications
   * GET /api/v1/notifications?read=false&type=OFFER_ACCEPTED&page=1&limit=20
   *
   * SUPER_ADMIN sees all notifications from all orgs
   * Others see only their own notifications
   */
  async getNotifications(req, res) {
    try {
      const userId = req.user.id;
      const organizationId = req.organizationId;
      const userRole = req.userRole;
      const filters = req.query;

      const result = await notificationService.getUserNotifications(
        userId,
        organizationId,
        userRole,
        filters
      );

      res.json({
        success: true,
        notifications: result.notifications,
        pagination: result.pagination
      });
    } catch (error) {
      console.error('❌ Get notifications error:', error);
      res.status(500).json({
        success: false,
        error: 'Bildirimler yüklenirken hata oluştu'
      });
    }
  }

  /**
   * Get unread notification count
   * GET /api/v1/notifications/unread-count
   */
  async getUnreadCount(req, res) {
    try {
      const userId = req.user.id;
      const count = await notificationService.getUnreadCount(userId);

      res.json({
        success: true,
        count
      });
    } catch (error) {
      console.error('❌ Get unread count error:', error);
      res.status(500).json({
        success: false,
        error: 'Okunmamış bildirim sayısı alınamadı'
      });
    }
  }

  /**
   * Mark notification as read
   * PATCH /api/v1/notifications/:id/read
   */
  async markAsRead(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const userRole = req.userRole;

      const notification = await notificationService.markAsRead(id, userId, userRole);

      res.json({
        success: true,
        message: 'Bildirim okundu olarak işaretlendi',
        notification
      });
    } catch (error) {
      console.error('❌ Mark as read error:', error);
      res.status(error.message.includes('yok') ? 403 : 500).json({
        success: false,
        error: error.message || 'Bildirim güncellenemedi'
      });
    }
  }

  /**
   * Mark all notifications as read
   * PATCH /api/v1/notifications/read-all
   */
  async markAllAsRead(req, res) {
    try {
      const userId = req.user.id;
      const count = await notificationService.markAllAsRead(userId);

      res.json({
        success: true,
        message: `${count} bildirim okundu olarak işaretlendi`,
        count
      });
    } catch (error) {
      console.error('❌ Mark all as read error:', error);
      res.status(500).json({
        success: false,
        error: 'Bildirimler güncellenemedi'
      });
    }
  }

  /**
   * Get user notification preferences
   * GET /api/v1/notifications/preferences
   */
  async getPreferences(req, res) {
    try {
      const userId = req.user.id;
      const preferences = await notificationService.getPreferences(userId);

      res.json({
        success: true,
        preferences
      });
    } catch (error) {
      console.error('❌ Get preferences error:', error);
      res.status(500).json({
        success: false,
        error: 'Tercihler yüklenemedi'
      });
    }
  }

  /**
   * Update all notification preferences (batch)
   * PUT /api/v1/notifications/preferences
   * Body: { preferences: [{ type, enabled, emailEnabled }, ...] }
   */
  async updatePreferences(req, res) {
    try {
      const userId = req.user.id;
      const { preferences } = req.body;

      if (!Array.isArray(preferences)) {
        return res.status(400).json({
          success: false,
          error: 'Tercihler array formatında olmalıdır'
        });
      }

      const updated = await notificationService.updatePreferences(userId, preferences);

      res.json({
        success: true,
        message: `${updated.length} tercih güncellendi`,
        preferences: updated
      });
    } catch (error) {
      console.error('❌ Update preferences error:', error);
      res.status(500).json({
        success: false,
        error: 'Tercihler güncellenemedi'
      });
    }
  }

  /**
   * Update single notification preference
   * PUT /api/v1/notifications/preferences/:type
   * Body: { enabled, emailEnabled }
   */
  async updateSinglePreference(req, res) {
    try {
      const userId = req.user.id;
      const { type } = req.params;
      const { enabled, emailEnabled } = req.body;

      const preference = await notificationService.updatePreference(
        userId,
        type,
        enabled,
        emailEnabled
      );

      res.json({
        success: true,
        message: 'Tercih güncellendi',
        preference
      });
    } catch (error) {
      console.error('❌ Update preference error:', error);
      res.status(500).json({
        success: false,
        error: 'Tercih güncellenemedi'
      });
    }
  }
}

module.exports = new NotificationController();
