const express = require('express');
const router = express.Router();
const publicOfferController = require('../controllers/publicOfferController');

router.get('/:token', publicOfferController.getOfferByToken);
router.patch('/:token/accept', publicOfferController.acceptOffer);
router.patch('/:token/reject', publicOfferController.rejectOffer);

module.exports = router;