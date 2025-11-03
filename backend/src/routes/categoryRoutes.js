const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { authenticateToken } = require('../middleware/auth');
const { enforceOrganizationIsolation } = require('../middleware/organizationIsolation');
const { authorize } = require('../middleware/authorize');
const { ROLES } = require('../constants/roles');

// Manager+ middleware (category management requires manager level or higher)
const managersPlus = [authenticateToken, enforceOrganizationIsolation, authorize([ROLES.MANAGER, ROLES.ADMIN, ROLES.SUPER_ADMIN])];

// Reorder (must be before /:id routes)
router.patch('/reorder', managersPlus, categoryController.reorderCategories);

// CRUD operations
router.post('/', managersPlus, categoryController.createCategory);
router.get('/', managersPlus, categoryController.getCategories);
router.get('/:id', managersPlus, categoryController.getCategoryById);
router.put('/:id', managersPlus, categoryController.updateCategory);
router.delete('/:id', managersPlus, categoryController.deleteCategory);

module.exports = router;
