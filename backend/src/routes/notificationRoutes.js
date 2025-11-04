const express = require('express');
const notificationController = require('../controllers/notificationController');
const { authenticateToken } = require('../middleware/auth');
const { enforceOrganizationIsolation } = require('../middleware/organizationIsolation');

const router = express.Router();

/**
 * Notification Routes
 *
 * All routes require authentication
 * SUPER_ADMIN can see all notifications
 * Others see only their own notifications
 *
 * Created by: Worker #2
 * Date: 2025-11-04
 */

// Middleware: All notification routes require authentication
router.use(authenticateToken);
router.use(enforceOrganizationIsolation);

// ============================================
// NOTIFICATION ENDPOINTS
// ============================================

/**
 * GET /api/v1/notifications
 * Get user notifications with pagination and filters
 * Query params: read, type, page, limit
 */
router.get('/', notificationController.getNotifications);

/**
 * GET /api/v1/notifications/unread-count
 * Get unread notification count for current user
 */
router.get('/unread-count', notificationController.getUnreadCount);

/**
 * PATCH /api/v1/notifications/read-all
 * Mark all notifications as read for current user
 */
router.patch('/read-all', notificationController.markAllAsRead);

/**
 * PATCH /api/v1/notifications/:id/read
 * Mark specific notification as read
 */
router.patch('/:id/read', notificationController.markAsRead);

// ============================================
// PREFERENCE ENDPOINTS
// ============================================

/**
 * GET /api/v1/notifications/preferences
 * Get user notification preferences
 */
router.get('/preferences', notificationController.getPreferences);

/**
 * PUT /api/v1/notifications/preferences
 * Update all notification preferences (batch)
 * Body: { preferences: [{ type, enabled, emailEnabled }, ...] }
 */
router.put('/preferences', notificationController.updatePreferences);

/**
 * PUT /api/v1/notifications/preferences/:type
 * Update single notification preference
 * Body: { enabled, emailEnabled }
 */
router.put('/preferences/:type', notificationController.updateSinglePreference);

module.exports = router;
