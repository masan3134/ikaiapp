const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsOfferController');
const { authenticateToken } = require('../middleware/auth');
const { enforceOrganizationIsolation } = require('../middleware/organizationIsolation');
const { authorize } = require('../middleware/authorize');
const { ROLE_GROUPS } = require('../constants/roles');

// Analytics viewers middleware (analytics require manager level or higher)
const analyticsViewers = [authenticateToken, enforceOrganizationIsolation, authorize(ROLE_GROUPS.ANALYTICS_VIEWERS)];

router.get('/overview', analyticsViewers, analyticsController.getOverview);
router.get('/acceptance-rate', analyticsViewers, analyticsController.getAcceptanceRate);
router.get('/response-time', analyticsViewers, analyticsController.getAverageResponseTime);
router.get('/by-department', analyticsViewers, analyticsController.getByDepartment);

module.exports = router;
