const express = require('express');
const router = express.Router();
const attachmentController = require('../controllers/attachmentController');
const { authenticateToken } = require('../middleware/auth');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

router.use(authenticateToken);

router.get('/:offerId/attachments', attachmentController.getAttachments);
router.post('/:offerId/attachments', upload.single('file'), attachmentController.uploadAttachment);
router.delete('/attachments/:id', attachmentController.deleteAttachment);

module.exports = router;
