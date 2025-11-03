const express = require('express');
const { getDashboardStats } = require('../controllers/dashboardController');
const { authenticateToken } = require('../middleware/auth');
const { enforceOrganizationIsolation } = require('../middleware/organizationIsolation');
const { authorize } = require('../middleware/authorize');

const router = express.Router();

router.get(
  '/stats',
  authenticateToken,
  enforceOrganizationIsolation,
  authorize(['ADMIN', 'MANAGER']),
  getDashboardStats
);

module.exports = router;
