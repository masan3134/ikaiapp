const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { authenticateToken } = require('../middleware/auth');
const { enforceOrganizationIsolation } = require('../middleware/organizationIsolation');

router.use(authenticateToken);
router.use(enforceOrganizationIsolation);

// Reorder (must be before /:id routes)
router.patch('/reorder', categoryController.reorderCategories);

// CRUD operations
router.post('/', categoryController.createCategory);
router.get('/', categoryController.getCategories);
router.get('/:id', categoryController.getCategoryById);
router.put('/:id', categoryController.updateCategory);
router.delete('/:id', categoryController.deleteCategory);

module.exports = router;
