const express = require('express');
const router = express.Router();
const revisionController = require('../controllers/revisionController');
const { authenticateToken } = require('../middleware/auth');
const { authorize } = require('../middleware/authorize');
const { enforceOrganizationIsolation } = require('../middleware/organizationIsolation');
const { ROLE_GROUPS } = require('../constants/roles');

// HR_MANAGERS middleware chain
const hrManagers = [authenticateToken, enforceOrganizationIsolation, authorize(ROLE_GROUPS.HR_MANAGERS)];

router.get('/:offerId/revisions', hrManagers, revisionController.getRevisions);

module.exports = router;
