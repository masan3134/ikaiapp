const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const minioService = require('./minioService'); // Assuming minioService is set up

const BUCKET_NAME = 'offer-attachments';

/**
 * Uploads an attachment for a job offer and saves metadata to the database.
 * @param {string} offerId - The ID of the job offer.
 * @param {object} file - The file object (from multer or similar).
 * @param {string} userId - The ID of the user uploading the file.
 * @returns {Promise<object>} The created attachment record.
 */
async function uploadAttachment(offerId, file, userId) {
  // Ensure the bucket exists
  await minioService.ensureBucketExists(BUCKET_NAME);

  const { originalname, mimetype, buffer, size } = file;
  const filename = `${offerId}-${Date.now()}-${originalname}`;

  // Upload to MinIO
  const fileUrl = await minioService.uploadFile(BUCKET_NAME, filename, buffer, mimetype);

  // Save metadata to DB
  const attachment = await prisma.offerAttachment.create({
    data: {
      offerId,
      uploadedBy: userId,
      filename,
      originalName: originalname,
      mimeType: mimetype,
      size,
      fileUrl, // URL from MinIO
      bucket: BUCKET_NAME,
    },
  });

  return attachment;
}

/**
 * Gets all attachments for a specific job offer.
 * @param {string} offerId - The ID of the job offer.
 * @returns {Promise<object[]>} A list of attachments.
 */
async function getAttachments(offerId) {
  return prisma.offerAttachment.findMany({
    where: { offerId },
    orderBy: { createdAt: 'desc' },
    include: {
      uploader: { select: { id: true, email: true } },
    },
  });
}

/**
 * Deletes an attachment from MinIO and the database.
 * @param {string} attachmentId - The ID of the attachment.
 * @returns {Promise<void>}
 */
async function deleteAttachment(attachmentId) {
  const attachment = await prisma.offerAttachment.findUnique({ where: { id: attachmentId } });
  if (!attachment) throw new Error('Attachment not found');

  // Delete from MinIO
  await minioService.deleteFile(attachment.bucket, attachment.filename);

  // Delete from DB
  await prisma.offerAttachment.delete({ where: { id: attachmentId } });
}

module.exports = {
  uploadAttachment,
  getAttachments,
  deleteAttachment,
};
