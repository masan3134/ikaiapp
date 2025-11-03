const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

/**
 * User Management Routes (Admin Only)
 * All routes require ADMIN role
 */

// Get all users with pagination
router.get('/', authenticateToken, requireAdmin, userController.getAllUsers);

// Get user by ID
router.get('/:id', authenticateToken, requireAdmin, userController.getUserById);

// Create new user
router.post('/', authenticateToken, requireAdmin, userController.createUser);

// Update user
router.put('/:id', authenticateToken, requireAdmin, userController.updateUser);

// Delete user
router.delete('/:id', authenticateToken, requireAdmin, userController.deleteUser);

// Change user password
router.patch('/:id/password', authenticateToken, requireAdmin, userController.changePassword);

module.exports = router;
