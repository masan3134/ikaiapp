const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsOfferController');
const { authenticateToken } = require('../middleware/auth');

// All analytics routes require authentication
router.use(authenticateToken);

router.get('/overview', analyticsController.getOverview);
router.get('/acceptance-rate', analyticsController.getAcceptanceRate);
router.get('/response-time', analyticsController.getAverageResponseTime);
router.get('/by-department', analyticsController.getByDepartment);

module.exports = router;
