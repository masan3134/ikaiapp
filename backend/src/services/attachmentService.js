const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const minioService = require('./minioService');

const BUCKET_NAME = 'offer-attachments';

async function uploadAttachment(offerId, file, userId, organizationId) {
  const offer = await prisma.jobOffer.findFirst({
    where: { id: offerId, organizationId }
  });

  if (!offer) {
    throw new Error('Offer not found or access denied');
  }

  await minioService.ensureBucketExists(BUCKET_NAME);

  const { originalname, mimetype, buffer, size } = file;
  const filename = `${offerId}-${Date.now()}-${originalname}`;

  const fileUrl = await minioService.uploadFile(BUCKET_NAME, filename, buffer, mimetype);

  const attachment = await prisma.offerAttachment.create({
    data: {
      offerId,
      uploadedBy: userId,
      filename,
      originalName: originalname,
      mimeType: mimetype,
      size,
      fileUrl,
      bucket: BUCKET_NAME,
    },
  });

  return attachment;
}

async function getAttachments(offerId, organizationId) {
  const offer = await prisma.jobOffer.findFirst({
    where: { id: offerId, organizationId }
  });

  if (!offer) {
    throw new Error('Offer not found or access denied');
  }

  return prisma.offerAttachment.findMany({
    where: { offerId },
    orderBy: { createdAt: 'desc' },
    include: {
      uploader: { select: { id: true, email: true } },
    },
  });
}

async function deleteAttachment(attachmentId, organizationId) {
  const attachment = await prisma.offerAttachment.findUnique({
    where: { id: attachmentId },
    include: { offer: true }
  });

  if (!attachment) throw new Error('Attachment not found');

  if (attachment.offer.organizationId !== organizationId) {
    throw new Error('Access denied');
  }

  await minioService.deleteFile(attachment.bucket, attachment.filename);

  await prisma.offerAttachment.delete({ where: { id: attachmentId } });
}

module.exports = {
  uploadAttachment,
  getAttachments,
  deleteAttachment,
};
