const express = require('express');
const router = express.Router();
const templateController = require('../controllers/templateController');
const { authenticateToken } = require('../middleware/auth');
const { enforceOrganizationIsolation } = require('../middleware/organizationIsolation');

router.use(authenticateToken);
router.use(enforceOrganizationIsolation);

// CRUD operations
router.post('/', templateController.createTemplate);
router.get('/', templateController.getTemplates);
router.get('/:id', templateController.getTemplateById);
router.put('/:id', templateController.updateTemplate);
router.delete('/:id', templateController.deleteTemplate);

// Actions
router.patch('/:id/activate', templateController.activateTemplate);
router.patch('/:id/deactivate', templateController.deactivateTemplate);
router.post('/:id/create-offer', templateController.createOfferFromTemplate);

module.exports = router;
