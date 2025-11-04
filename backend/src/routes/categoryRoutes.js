const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { authenticateToken } = require('../middleware/auth');
const { enforceOrganizationIsolation } = require('../middleware/organizationIsolation');
const { authorize } = require('../middleware/authorize');
const { ROLES } = require('../constants/roles');

// HR Managers+ middleware (category management for HR and above)
const hrManagersPlus = [authenticateToken, enforceOrganizationIsolation, authorize([ROLES.HR_SPECIALIST, ROLES.MANAGER, ROLES.ADMIN, ROLES.SUPER_ADMIN])];

// Reorder (must be before /:id routes)
router.patch('/reorder', hrManagersPlus, categoryController.reorderCategories);

// CRUD operations
router.post('/', hrManagersPlus, categoryController.createCategory);
router.get('/', hrManagersPlus, categoryController.getCategories);
router.get('/:id', hrManagersPlus, categoryController.getCategoryById);
router.put('/:id', hrManagersPlus, categoryController.updateCategory);
router.delete('/:id', hrManagersPlus, categoryController.deleteCategory);

module.exports = router;
