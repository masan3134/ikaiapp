const { PrismaClient, OfferStatus, ApprovalStatus } = require('@prisma/client');
const { v4: uuidv4 } = require('uuid');
const prisma = new PrismaClient();
const revisionService = require('./revisionService');
const notificationService = require('./notificationService');
const { NotFoundError, AuthorizationError, ValidationError } = require('../errors/customErrors');

const DEFAULT_OFFER_EXPIRATION_DAYS = 7; // Default 7 days for offer expiration

async function createOffer(data, userId, organizationId) {
  // Validate salary
  if (data.salary !== undefined && (typeof data.salary !== 'number' || data.salary <= 0)) {
    throw new ValidationError('Geçerli bir maaş giriniz');
  }

  // Validate startDate
  if (data.startDate) {
    const date = new Date(data.startDate);
    if (isNaN(date.getTime())) {
      throw new ValidationError('Geçerli bir başlangıç tarihi giriniz');
    }
    data.startDate = date.toISOString(); // Ensure it's ISO string if valid
  } else {
    throw new ValidationError('Başlangıç tarihi zorunludur');
  }

  const offerData = {
    ...data,
    startDate: data.startDate, // Use the validated/converted startDate
    createdBy: userId,
    organizationId,
    status: OfferStatus.draft,
    approvalStatus: ApprovalStatus.pending,
    acceptanceToken: uuidv4(),
    expiresAt: new Date(Date.now() + DEFAULT_OFFER_EXPIRATION_DAYS * 24 * 60 * 60 * 1000), // Default 7 days
  };

  return await prisma.$transaction(async (tx) => {
    const offer = await tx.jobOffer.create({
      data: offerData,
    });

    await revisionService.createRevision(offer.id, 'created', userId, {}, tx);
    return offer;
  });
}

async function updateOffer(id, data, userId, organizationId, userRole) {
  const existing = await prisma.jobOffer.findUnique({ where: { id } });
  if (!existing) throw new NotFoundError('Teklif bulunamadı');

  // Role-based access control
  if (userRole === 'SUPER_ADMIN') {
    // SUPER_ADMIN can update any offer
    // No restriction
  } else if (['ADMIN', 'MANAGER', 'HR_SPECIALIST'].includes(userRole)) {
    // ADMIN/MANAGER/HR can update offers from their organization
    if (existing.organizationId !== organizationId) {
      throw new AuthorizationError('Bu teklifi güncelleme yetkiniz yok');
    }
  } else {
    // USER: Check ownership
    if (existing.createdBy !== userId || existing.organizationId !== organizationId) {
      throw new AuthorizationError('Bu teklifi güncelleme yetkiniz yok');
    }
  }

  // Validate salary if present
  if (data.salary !== undefined) {
    if (typeof data.salary !== 'number' || data.salary <= 0) {
      throw new ValidationError('Geçerli bir maaş giriniz');
    }
  }

  // Validate startDate if present
  if (data.startDate !== undefined) {
    const date = new Date(data.startDate);
    if (isNaN(date.getTime())) {
      throw new ValidationError('Geçerli bir başlangıç tarihi giriniz');
    }
    data.startDate = date.toISOString(); // Ensure it's ISO string if valid
  }

  return await prisma.$transaction(async (tx) => {
    const updated = await tx.jobOffer.update({
      where: { id },
      data,
    });

    const changes = {};
    Object.keys(data).forEach(key => {
      if (existing[key] !== updated[key]) {
        changes[key] = { old: existing[key], new: updated[key] };
      }
    });
    await revisionService.createRevision(updated.id, 'updated', userId, changes, tx);
    return updated;
  });
}

async function deleteOffer(id, userId, organizationId, userRole) {
    const offer = await prisma.jobOffer.findUnique({ where: { id } });
    if (!offer) throw new NotFoundError('Teklif bulunamadı');

    // Role-based access control
    if (userRole === 'SUPER_ADMIN') {
        // SUPER_ADMIN can delete any offer
        // No restriction
    } else if (['ADMIN', 'MANAGER', 'HR_SPECIALIST'].includes(userRole)) {
        // ADMIN/MANAGER/HR can delete offers from their organization
        if (offer.organizationId !== organizationId) {
            throw new AuthorizationError('Bu teklifi silme yetkiniz yok');
        }
    } else {
        // USER: Check ownership
        if (offer.createdBy !== userId || offer.organizationId !== organizationId) {
            throw new AuthorizationError('Bu teklifi silme yetkiniz yok');
        }
    }

    await prisma.jobOffer.delete({ where: { id } });
}

async function getOffers(filters = {}, pagination = {}) {
    const { status, candidateId, createdBy, organizationId, userRole } = filters;
    const { page = 1, limit = 20 } = pagination;

    const where = {};
    if (status) where.status = status;
    if (candidateId) where.candidateId = candidateId;
    if (createdBy) where.createdBy = createdBy;

    // Role-based filtering
    if (userRole === 'SUPER_ADMIN') {
      // SUPER_ADMIN: ALL offers from ALL organizations
      // No organizationId filter
    } else {
      // Others: Filter by organization
      if (organizationId) where.organizationId = organizationId;
    }

    const [offers, total] = await Promise.all([
        prisma.jobOffer.findMany({
            where,
            include: { candidate: true, jobPosting: true },
            skip: (page - 1) * limit,
            take: limit,
            orderBy: { createdAt: 'desc' },
        }),
        prisma.jobOffer.count({ where }),
    ]);

    return {
        offers,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        },
    };
}

async function getOfferById(id, organizationId, userRole) {
    // First check if offer exists and has jobPostingId
    const basicOffer = await prisma.jobOffer.findUnique({
        where: { id },
        select: { id: true, jobPostingId: true, organizationId: true }
    });

    if (!basicOffer) {
        throw new NotFoundError('Teklif bulunamadı');
    }

    // Role-based access control
    if (userRole === 'SUPER_ADMIN') {
        // SUPER_ADMIN can view any offer
        // No restriction
    } else if (['ADMIN', 'MANAGER', 'HR_SPECIALIST'].includes(userRole)) {
        // ADMIN/MANAGER/HR can view offers from their organization
        if (basicOffer.organizationId !== organizationId) {
            throw new AuthorizationError('Bu teklife erişim yetkiniz yok');
        }
    } else {
        // USER: Organization offers only
        if (basicOffer.organizationId !== organizationId) {
            throw new AuthorizationError('Bu teklife erişim yetkiniz yok');
        }
    }

    // Then fetch with includes, conditionally including jobPosting
    const offer = await prisma.jobOffer.findUnique({
        where: { id },
        include: {
            candidate: true,
            jobPosting: basicOffer.jobPostingId ? true : false, // Only include if jobPostingId exists
            creator: true,
            approver: true,
            template: true,
            negotiations: true,
            attachments: true,
            revisions: { orderBy: { version: 'desc' } },
        },
    });

    return offer;
}

async function requestApproval(offerId, userId) {
  const offer = await prisma.jobOffer.findUnique({
    where: { id: offerId },
    include: { creator: true, candidate: true },
  });

  if (!offer) throw new NotFoundError('Teklif bulunamadı');
  if (offer.createdBy !== userId) throw new AuthorizationError('Sadece teklifi oluşturan kişi onay talebinde bulunabilir');
  if (offer.status !== OfferStatus.draft) throw new ValidationError('Sadece taslak halindeki teklifler onaya gönderilebilir');

  const updatedOffer = await prisma.jobOffer.update({
    where: { id: offerId },
    data: { approvalStatus: ApprovalStatus.pending },
  });

  notificationService.notifyManagerOfApprovalRequest(offer);
  await revisionService.createRevision(offerId, 'approval_requested', userId);
  return updatedOffer;
}

async function approveOffer(offerId, userId, notes = '') {
  const offer = await prisma.jobOffer.findUnique({
    where: { id: offerId },
    include: { creator: true },
  });

  if (!offer) throw new NotFoundError('Teklif bulunamadı');
  if (offer.approvalStatus !== ApprovalStatus.pending) throw new ValidationError('Sadece onay bekleyen teklifler onaylanabilir');

  const approver = await prisma.user.findUnique({ where: { id: userId } });
  if (!['ADMIN', 'MANAGER'].includes(approver.role)) throw new AuthorizationError('Bu işlemi yapmaya yetkiniz yok');

  const updatedOffer = await prisma.jobOffer.update({
    where: { id: offerId },
    data: {
      approvalStatus: ApprovalStatus.approved,
      status: OfferStatus.approved,
      approvedBy: userId,
      approvedAt: new Date(),
    },
    include: { creator: true },
  });

  notificationService.notifyCreatorOfApprovalDecision(updatedOffer, 'approved', notes);
  await revisionService.createRevision(offerId, 'approved', userId, { notes });
  return updatedOffer;
}

async function rejectApproval(offerId, userId, reason = '') {
  const offer = await prisma.jobOffer.findUnique({
    where: { id: offerId },
    include: { creator: true },
  });

  if (!offer) throw new NotFoundError('Teklif bulunamadı');
  if (offer.approvalStatus !== ApprovalStatus.pending) throw new ValidationError('Sadece onay bekleyen teklifler reddedilebilir');

  const approver = await prisma.user.findUnique({ where: { id: userId } });
  if (!['ADMIN', 'MANAGER'].includes(approver.role)) throw new AuthorizationError('Bu işlemi yapmaya yetkiniz yok');

  const updatedOffer = await prisma.jobOffer.update({
    where: { id: offerId },
    data: { approvalStatus: ApprovalStatus.rejected },
    include: { creator: true },
  });

  notificationService.notifyCreatorOfApprovalDecision(updatedOffer, 'rejected', reason);
  await revisionService.createRevision(offerId, 'rejected_approval', userId, { reason });
  return updatedOffer;
}

/**
 * Create offer via wizard (simplified flow)
 * Handles both draft and direct send modes
 */

function _validateWizardData(data) {
  const { candidateId, position, department, salary, startDate } = data;
  if (!candidateId) throw new ValidationError('Aday seçimi zorunludur');
  if (!position || position.trim().length < 3) {
    throw new ValidationError('Pozisyon en az 3 karakter olmalıdır');
  }
  if (!department || department.trim().length < 2) {
    throw new ValidationError('Departman en az 2 karakter olmalıdır');
  }
  if (!salary || salary <= 0) {
    throw new ValidationError('Geçerli bir maaş giriniz');
  }
  if (!startDate) throw new ValidationError('Başlangıç tarihi zorunludur');
}

async function _determineWizardStatus(sendMode, userId) {
  let status = OfferStatus.draft;
  let approvalStatus = ApprovalStatus.pending;
  let approvedBy = null;
  let approvedAt = null;

  if (sendMode === 'direct') {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundError('Kullanıcı bulunamadı');
    if (user.role !== 'ADMIN') {
      throw new AuthorizationError('Direkt gönderim için ADMIN yetkisi gereklidir');
    }
    status = OfferStatus.sent;
    approvalStatus = ApprovalStatus.approved;
    approvedBy = userId;
    approvedAt = new Date();
  }

  return { status, approvalStatus, approvedBy, approvedAt };
}

async function _sendOfferNotification(offer, sendMode) {
  if (sendMode === 'direct') {
    try {
      const emailService = require('./emailService');
      await emailService.sendOfferEmail(offer.id);
      console.log(`✅ Offer ${offer.id} sent directly to candidate`);
      return { emailSent: true };
    } catch (emailError) {
      console.error('❌ Error sending offer email:', emailError);
      return { emailSent: false, emailError };
    }
  } else {
    // Notify managers that a new draft offer needs approval
    try {
      await notificationService.notifyManagerOfApprovalRequest(offer);
      console.log(`✅ Managers notified of new offer draft for approval`);
    } catch (notifError) {
      console.error('❌ Error notifying managers:', notifError);
      // Don't fail the whole operation if notification fails
    }
    return { emailSent: null };
  }
}

async function createOfferFromWizard(data, userId, organizationId) {
  const { candidateId, jobPostingId, templateId, sendMode, ...formData } = data;

  _validateWizardData({ candidateId, ...formData });

  const { status, approvalStatus, approvedBy, approvedAt } = await _determineWizardStatus(sendMode, userId);

  const offerData = {
    candidateId,
    jobPostingId: jobPostingId || null,
    templateId: templateId || null,
    ...formData,
    startDate: new Date(formData.startDate), // Convert string to Date
    status,
    approvalStatus,
    approvedBy,
    approvedAt,
    createdBy: userId,
    organizationId,
    acceptanceToken: uuidv4(),
    expiresAt: new Date(Date.now() + DEFAULT_OFFER_EXPIRATION_DAYS * 24 * 60 * 60 * 1000),
  };

  const offer = await prisma.$transaction(async (tx) => {
    const createdOffer = await tx.jobOffer.create({
      data: offerData,
      include: {
        candidate: true,
        jobPosting: true,
        template: true,
        creator: true,
      },
    });

    await revisionService.createRevision(
      createdOffer.id,
      sendMode === 'direct' ? 'created_and_sent' : 'created',
      userId,
      { sendMode },
      tx
    );

    return createdOffer;
  });

  const { emailSent, emailError } = await _sendOfferNotification(offer, sendMode);

  return { ...offer, emailSent, emailError };
}

module.exports = {
  createOffer,
  createOfferFromWizard,
  updateOffer,
  deleteOffer,
  getOffers,
  getOfferById,
  requestApproval,
  approveOffer,
  rejectApproval,
};