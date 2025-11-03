const express = require('express');
const router = express.Router();
const attachmentController = require('../controllers/attachmentController');
const { authenticateToken } = require('../middleware/auth');
const { authorize } = require('../middleware/authorize');
const { enforceOrganizationIsolation } = require('../middleware/organizationIsolation');
const { ROLE_GROUPS } = require('../constants/roles');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

// HR_MANAGERS middleware chain
const hrManagers = [authenticateToken, enforceOrganizationIsolation, authorize(ROLE_GROUPS.HR_MANAGERS)];

router.get('/:offerId/attachments', hrManagers, attachmentController.getAttachments);
router.post('/:offerId/attachments', hrManagers, upload.single('file'), attachmentController.uploadAttachment);
router.delete('/attachments/:id', hrManagers, attachmentController.deleteAttachment);

module.exports = router;
