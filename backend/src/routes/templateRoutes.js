const express = require('express');
const router = express.Router();
const templateController = require('../controllers/templateController');
const { authenticateToken } = require('../middleware/auth');
const { enforceOrganizationIsolation } = require('../middleware/organizationIsolation');
const { authorize } = require('../middleware/authorize');
const { ROLES } = require('../constants/roles');

// HR Managers+ middleware (template management for HR and above)
const hrManagersPlus = [authenticateToken, enforceOrganizationIsolation, authorize([ROLES.HR_SPECIALIST, ROLES.MANAGER, ROLES.ADMIN, ROLES.SUPER_ADMIN])];

// CRUD operations
router.post('/', hrManagersPlus, templateController.createTemplate);
router.get('/', hrManagersPlus, templateController.getTemplates);
router.get('/:id', hrManagersPlus, templateController.getTemplateById);
router.put('/:id', hrManagersPlus, templateController.updateTemplate);
router.delete('/:id', hrManagersPlus, templateController.deleteTemplate);

// Actions
router.patch('/:id/activate', hrManagersPlus, templateController.activateTemplate);
router.patch('/:id/deactivate', hrManagersPlus, templateController.deactivateTemplate);
router.post('/:id/create-offer', hrManagersPlus, templateController.createOfferFromTemplate);

module.exports = router;
