const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateToken } = require('../middleware/auth');
const { authorize } = require('../middleware/authorize');
const { enforceOrganizationIsolation } = require('../middleware/organizationIsolation');
const { ROLES } = require('../constants/roles');

/**
 * User Management Routes (Admin Only)
 * All routes require ADMIN+ role with organization isolation
 */

// ADMIN+ middleware chain
const adminOnly = [authenticateToken, enforceOrganizationIsolation, authorize([ROLES.ADMIN, ROLES.SUPER_ADMIN])];

// All authenticated users middleware
const allAuthenticated = [authenticateToken, enforceOrganizationIsolation];

// Current user endpoints (any authenticated user)
router.get('/me', allAuthenticated, userController.getCurrentUser);
router.patch('/me', allAuthenticated, userController.updateCurrentUser);
router.get('/me/notifications', allAuthenticated, userController.getNotificationPreferences);
router.patch('/me/notifications', allAuthenticated, userController.updateNotificationPreferences);

// Get all users with pagination
router.get('/', adminOnly, userController.getAllUsers);

// Get user by ID
router.get('/:id', adminOnly, userController.getUserById);

// Create new user
router.post('/', adminOnly, userController.createUser);

// Update user
router.put('/:id', adminOnly, userController.updateUser);

// Delete user
router.delete('/:id', adminOnly, userController.deleteUser);

// Change user password
router.patch('/:id/password', adminOnly, userController.changePassword);

module.exports = router;
