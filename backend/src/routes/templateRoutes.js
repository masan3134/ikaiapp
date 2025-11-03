const express = require('express');
const router = express.Router();
const templateController = require('../controllers/templateController');
const { authenticateToken } = require('../middleware/auth');
const { enforceOrganizationIsolation } = require('../middleware/organizationIsolation');
const { authorize } = require('../middleware/authorize');
const { ROLES } = require('../constants/roles');

// Manager+ middleware (template management requires manager level or higher)
const managersPlus = [authenticateToken, enforceOrganizationIsolation, authorize([ROLES.MANAGER, ROLES.ADMIN, ROLES.SUPER_ADMIN])];

// CRUD operations
router.post('/', managersPlus, templateController.createTemplate);
router.get('/', managersPlus, templateController.getTemplates);
router.get('/:id', managersPlus, templateController.getTemplateById);
router.put('/:id', managersPlus, templateController.updateTemplate);
router.delete('/:id', managersPlus, templateController.deleteTemplate);

// Actions
router.patch('/:id/activate', managersPlus, templateController.activateTemplate);
router.patch('/:id/deactivate', managersPlus, templateController.deactivateTemplate);
router.post('/:id/create-offer', managersPlus, templateController.createOfferFromTemplate);

module.exports = router;
