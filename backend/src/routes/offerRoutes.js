const express = require('express');
const router = express.Router();
const offerController = require('../controllers/offerController');
const { authenticateToken } = require('../middleware/auth');
const { enforceOrganizationIsolation } = require('../middleware/organizationIsolation');
const { authorize } = require('../middleware/authorize');
const { ROLE_GROUPS } = require('../constants/roles');

// HR Managers middleware (HR operations)
const hrManagers = [authenticateToken, enforceOrganizationIsolation, authorize(ROLE_GROUPS.HR_MANAGERS)];

// Manager+ middleware (for delete operations)
const managerPlus = [authenticateToken, enforceOrganizationIsolation, authorize(ROLE_GROUPS.MANAGERS_PLUS)];

// Wizard endpoint (must be before '/' to avoid conflict)
router.post('/wizard', hrManagers, offerController.createOfferFromWizard);

// CRUD operations
router.post('/', hrManagers, offerController.createOffer);
router.get('/', hrManagers, offerController.getOffers);

// Bulk actions (must be before routes with /:id)
router.post('/bulk-send', hrManagers, offerController.bulkSend); // Feature #19

router.get('/:id', hrManagers, offerController.getOfferById);
router.put('/:id', hrManagers, offerController.updateOffer);
router.delete('/:id', managerPlus, offerController.deleteOffer);

// Single-offer actions
router.patch('/:id/send', hrManagers, offerController.sendOffer);
router.get('/:id/preview-pdf', hrManagers, offerController.previewPdf);
router.get('/:id/download-pdf', hrManagers, offerController.downloadPdf);

// Approval workflow (Feature #11)
router.patch('/:id/request-approval', hrManagers, offerController.requestApproval);
router.patch('/:id/approve', hrManagers, offerController.approveOffer);
router.patch('/:id/reject-approval', hrManagers, offerController.rejectApproval);

// Expiration management (Feature #12)
router.patch('/:id/expire', hrManagers, offerController.expireOffer);
router.patch('/:id/extend', hrManagers, offerController.extendExpiration);

module.exports = router;
