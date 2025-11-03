const express = require('express');
const router = express.Router();
const negotiationController = require('../controllers/negotiationController');
const { authenticateToken } = require('../middleware/auth');
const { authorize } = require('../middleware/authorize');
const { enforceOrganizationIsolation } = require('../middleware/organizationIsolation');
const { ROLE_GROUPS } = require('../constants/roles');

// HR_MANAGERS middleware chain
const hrManagers = [authenticateToken, enforceOrganizationIsolation, authorize(ROLE_GROUPS.HR_MANAGERS)];

router.get('/:offerId/negotiations', hrManagers, negotiationController.getNegotiations);
router.post('/:offerId/negotiations', hrManagers, negotiationController.createNegotiation);
router.patch('/:id/respond', hrManagers, negotiationController.respondToNegotiation);

module.exports = router;
