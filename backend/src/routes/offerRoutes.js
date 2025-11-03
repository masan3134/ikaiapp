const express = require('express');
const router = express.Router();
const offerController = require('../controllers/offerController');
const { authenticateToken } = require('../middleware/auth');

// All routes require authentication
router.use(authenticateToken);

// Wizard endpoint (must be before '/' to avoid conflict)
router.post('/wizard', offerController.createOfferFromWizard);

// CRUD operations
router.post('/', offerController.createOffer);
router.get('/', offerController.getOffers);

// Bulk actions (must be before routes with /:id)
router.post('/bulk-send', offerController.bulkSend); // Feature #19

router.get('/:id', offerController.getOfferById);
router.put('/:id', offerController.updateOffer);
router.delete('/:id', offerController.deleteOffer);

// Single-offer actions
router.patch('/:id/send', offerController.sendOffer);
router.get('/:id/preview-pdf', offerController.previewPdf);
router.get('/:id/download-pdf', offerController.downloadPdf);

// Approval workflow (Feature #11)
router.patch('/:id/request-approval', offerController.requestApproval);
router.patch('/:id/approve', offerController.approveOffer);
router.patch('/:id/reject-approval', offerController.rejectApproval);

// Expiration management (Feature #12)
router.patch('/:id/expire', offerController.expireOffer);
router.patch('/:id/extend', offerController.extendExpiration);

module.exports = router;
