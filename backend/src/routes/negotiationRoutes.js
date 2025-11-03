const express = require('express');
const router = express.Router();
const negotiationController = require('../controllers/negotiationController');
const { authenticateToken } = require('../middleware/auth');

router.use(authenticateToken);

router.get('/:offerId/negotiations', negotiationController.getNegotiations);
router.post('/:offerId/negotiations', negotiationController.createNegotiation);
router.patch('/:id/respond', negotiationController.respondToNegotiation);

module.exports = router;
