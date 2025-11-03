const express = require('express');
const router = express.Router();
const revisionController = require('../controllers/revisionController');
const { authenticateToken } = require('../middleware/auth');

router.use(authenticateToken);

router.get('/:offerId/revisions', revisionController.getRevisions);

module.exports = router;
