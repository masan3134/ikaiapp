const { PrismaClient, NotificationType } = require('@prisma/client');
const prisma = new PrismaClient();
const emailService = require('./emailService');

/**
 * Comprehensive Notification Service
 *
 * Features:
 * - Multi-tenant aware (organizationId filtering)
 * - Role-based access (SUPER_ADMIN sees all)
 * - User preferences (enable/disable per notification type)
 * - Email integration (optional per preference)
 * - 15 notification types covering all user actions
 *
 * Created by: Worker #2
 * Date: 2025-11-04
 */

// ============================================
// CORE NOTIFICATION FUNCTIONS
// ============================================

/**
 * Create a new notification
 * Checks user preferences before creating
 */
async function createNotification(userId, organizationId, type, title, message, data = {}) {
  try {
    // Check if user has this notification type enabled
    const preference = await prisma.notificationPreference.findUnique({
      where: {
        userId_type: {
          userId,
          type
        }
      }
    });

    // If preference exists and is disabled, skip
    if (preference && !preference.enabled) {
      console.log(`⏭️  Notification skipped (user preference): ${type} for ${userId.substring(0, 8)}`);
      return null;
    }

    // Create notification
    const notification = await prisma.notification.create({
      data: {
        userId,
        organizationId,
        type,
        title,
        message,
        data
      }
    });

    console.log(`🔔 Notification created: ${type} for ${userId.substring(0, 8)}...`);

    // Send email if preference enabled
    if (preference && preference.emailEnabled) {
      try {
        const user = await prisma.user.findUnique({
          where: { id: userId },
          select: { email: true, firstName: true, lastName: true }
        });

        if (user && user.email) {
          const userName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Kullanıcı';

          await emailService.sendGenericEmail(
            user.email,
            `[IKAI] ${title}`,
            `
              <p>Merhaba ${userName},</p>
              <p>${message}</p>
              <p><a href="http://localhost:8103/notifications">Bildirimleri Görüntüle</a></p>
            `
          );

          console.log(`📧 Notification email sent to ${user.email}`);
        }
      } catch (emailError) {
        console.error(`❌ Email notification failed:`, emailError.message);
        // Don't fail the notification creation if email fails
      }
    }

    return notification;

  } catch (error) {
    console.error(`❌ Create notification error:`, error.message);
    throw error;
  }
}

/**
 * Get user notifications with pagination and filters
 * SUPER_ADMIN can see all notifications from all organizations
 */
async function getUserNotifications(userId, organizationId, userRole, filters = {}) {
  const { read, type, page = 1, limit = 20 } = filters;
  const skip = (page - 1) * limit;

  // Build where clause
  let where = {};

  // Role-based filtering
  if (userRole === 'SUPER_ADMIN') {
    // SUPER_ADMIN: See ALL notifications from ALL organizations
    where = {};
  } else {
    // Others: Only their own notifications from their organization
    where = {
      userId,
      organizationId
    };
  }

  // Additional filters
  if (read !== undefined) {
    where.read = read === 'true' || read === true;
  }

  if (type) {
    where.type = type;
  }

  const [notifications, total] = await Promise.all([
    prisma.notification.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true
          }
        },
        organization: {
          select: {
            id: true,
            name: true
          }
        }
      },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' }
    }),
    prisma.notification.count({ where })
  ]);

  return {
    notifications,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  };
}

/**
 * Mark notification as read
 */
async function markAsRead(notificationId, userId, userRole) {
  // Get notification
  const notification = await prisma.notification.findUnique({
    where: { id: notificationId }
  });

  if (!notification) {
    throw new Error('Bildirim bulunamadı');
  }

  // Authorization check
  if (userRole !== 'SUPER_ADMIN' && notification.userId !== userId) {
    throw new Error('Bu bildirimi okuma yetkiniz yok');
  }

  // Mark as read
  return await prisma.notification.update({
    where: { id: notificationId },
    data: {
      read: true,
      readAt: new Date()
    }
  });
}

/**
 * Mark all notifications as read for a user
 */
async function markAllAsRead(userId) {
  const result = await prisma.notification.updateMany({
    where: {
      userId,
      read: false
    },
    data: {
      read: true,
      readAt: new Date()
    }
  });

  return result.count;
}

/**
 * Get unread notification count
 */
async function getUnreadCount(userId) {
  return await prisma.notification.count({
    where: {
      userId,
      read: false
    }
  });
}

/**
 * Get user notification preferences
 * If no preferences exist, return defaults (all enabled)
 */
async function getPreferences(userId) {
  const preferences = await prisma.notificationPreference.findMany({
    where: { userId }
  });

  // If no preferences, return defaults for all types
  if (preferences.length === 0) {
    const allTypes = Object.values(NotificationType);
    return allTypes.map(type => ({
      type,
      enabled: true,
      emailEnabled: false
    }));
  }

  return preferences;
}

/**
 * Update single notification preference
 */
async function updatePreference(userId, type, enabled, emailEnabled) {
  return await prisma.notificationPreference.upsert({
    where: {
      userId_type: {
        userId,
        type
      }
    },
    create: {
      userId,
      type,
      enabled,
      emailEnabled: emailEnabled || false
    },
    update: {
      enabled,
      emailEnabled: emailEnabled !== undefined ? emailEnabled : false
    }
  });
}

/**
 * Batch update preferences
 */
async function updatePreferences(userId, preferences) {
  const updates = preferences.map(pref =>
    prisma.notificationPreference.upsert({
      where: {
        userId_type: {
          userId,
          type: pref.type
        }
      },
      create: {
        userId,
        type: pref.type,
        enabled: pref.enabled,
        emailEnabled: pref.emailEnabled || false
      },
      update: {
        enabled: pref.enabled,
        emailEnabled: pref.emailEnabled || false
      }
    })
  );

  return await Promise.all(updates);
}

/**
 * Delete old notifications (cleanup)
 * Keep last 90 days
 */
async function cleanupOldNotifications(days = 90) {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  const result = await prisma.notification.deleteMany({
    where: {
      createdAt: {
        lt: cutoffDate
      },
      read: true // Only delete read notifications
    }
  });

  console.log(`🧹 Cleaned up ${result.count} old notifications (older than ${days} days)`);
  return result.count;
}

// ============================================
// EVENT-SPECIFIC NOTIFICATION HELPERS
// ============================================

/**
 * Notify when analysis starts
 */
async function notifyAnalysisStarted(analysisId, userId, organizationId, candidateCount) {
  const title = `CV Analizi Başlatıldı`;
  const message = `${candidateCount} adayın CV analizi başlatıldı. Sonuçlar hazır olduğunda bildirim alacaksınız.`;

  return await createNotification(
    userId,
    organizationId,
    NotificationType.ANALYSIS_STARTED,
    title,
    message,
    { analysisId, candidateCount }
  );
}

/**
 * Notify when analysis is completed
 */
async function notifyAnalysisCompleted(analysisId, userId, organizationId, candidateCount, topMatchScore) {
  const title = `CV Analizi Tamamlandı`;
  const message = `${candidateCount} adayın analizi tamamlandı. En iyi eşleşme: %${topMatchScore}`;

  return await createNotification(
    userId,
    organizationId,
    NotificationType.ANALYSIS_COMPLETED,
    title,
    message,
    { analysisId, candidateCount, topMatchScore }
  );
}

/**
 * Notify when analysis fails
 */
async function notifyAnalysisFailed(analysisId, userId, organizationId, errorMessage) {
  const title = `CV Analizi Başarısız`;
  const message = `CV analizi başarısız oldu: ${errorMessage}`;

  return await createNotification(
    userId,
    organizationId,
    NotificationType.ANALYSIS_FAILED,
    title,
    message,
    { analysisId, errorMessage }
  );
}

/**
 * Notify when new candidate is uploaded
 */
async function notifyCandidateUploaded(userId, organizationId, candidateName, candidateId) {
  const title = `Yeni Aday Eklendi`;
  const message = `${candidateName} sisteme başarıyla eklendi`;

  return await createNotification(
    userId,
    organizationId,
    NotificationType.CANDIDATE_UPLOADED,
    title,
    message,
    { candidateId, candidateName }
  );
}

/**
 * Notify when offer is created
 */
async function notifyOfferCreated(offerId, userId, organizationId, candidateName, position, salary) {
  const title = `Teklif Oluşturuldu`;
  const message = `${candidateName} için ${position} pozisyonu - ${salary.toLocaleString()} TRY teklif oluşturuldu`;

  return await createNotification(
    userId,
    organizationId,
    NotificationType.OFFER_CREATED,
    title,
    message,
    { offerId, candidateName, position, salary }
  );
}

/**
 * Notify when offer is sent to candidate
 */
async function notifyOfferSent(offerId, userId, organizationId, candidateName) {
  const title = `Teklif Gönderildi`;
  const message = `${candidateName} adayına teklif e-posta ile gönderildi`;

  return await createNotification(
    userId,
    organizationId,
    NotificationType.OFFER_SENT,
    title,
    message,
    { offerId, candidateName }
  );
}

/**
 * Notify when offer is accepted
 */
async function notifyOfferAccepted(offerId, userId, organizationId, candidateName, position) {
  const title = `✅ Teklif Kabul Edildi!`;
  const message = `${candidateName} ${position} pozisyonu için teklifi kabul etti!`;

  return await createNotification(
    userId,
    organizationId,
    NotificationType.OFFER_ACCEPTED,
    title,
    message,
    { offerId, candidateName, position }
  );
}

/**
 * Notify when offer is rejected
 */
async function notifyOfferRejected(offerId, userId, organizationId, candidateName, rejectionReason) {
  const title = `❌ Teklif Reddedildi`;
  const message = `${candidateName} teklifi reddetti${rejectionReason ? `: ${rejectionReason}` : ''}`;

  return await createNotification(
    userId,
    organizationId,
    NotificationType.OFFER_REJECTED,
    title,
    message,
    { offerId, candidateName, rejectionReason }
  );
}

/**
 * Notify when offer expires
 */
async function notifyOfferExpired(offerId, userId, organizationId, candidateName, position) {
  const title = `Teklif Süresi Doldu`;
  const message = `${candidateName} için ${position} teklifinin süresi doldu (7 gün)`;

  return await createNotification(
    userId,
    organizationId,
    NotificationType.OFFER_EXPIRED,
    title,
    message,
    { offerId, candidateName, position }
  );
}

/**
 * Notify when interview is scheduled
 */
async function notifyInterviewScheduled(interviewId, userId, organizationId, candidateName, date, time, type) {
  const title = `Mülakat Planlandı`;
  const message = `${candidateName} ile ${type} mülakatı planlandı - ${date} ${time}`;

  return await createNotification(
    userId,
    organizationId,
    NotificationType.INTERVIEW_SCHEDULED,
    title,
    message,
    { interviewId, candidateName, date, time, type }
  );
}

/**
 * Notify when interview is completed
 */
async function notifyInterviewCompleted(interviewId, userId, organizationId, candidateName, rating) {
  const title = `Mülakat Tamamlandı`;
  const message = `${candidateName} ile mülakat tamamlandı${rating ? ` - Değerlendirme: ${rating}/10` : ''}`;

  return await createNotification(
    userId,
    organizationId,
    NotificationType.INTERVIEW_COMPLETED,
    title,
    message,
    { interviewId, candidateName, rating }
  );
}

/**
 * Notify when interview is cancelled
 */
async function notifyInterviewCancelled(interviewId, userId, organizationId, candidateName, reason) {
  const title = `Mülakat İptal Edildi`;
  const message = `${candidateName} ile mülakat iptal edildi${reason ? `: ${reason}` : ''}`;

  return await createNotification(
    userId,
    organizationId,
    NotificationType.INTERVIEW_CANCELLED,
    title,
    message,
    { interviewId, candidateName, reason }
  );
}

/**
 * Notify when new user is invited
 */
async function notifyUserInvited(userId, organizationId, invitedEmail, invitedRole) {
  const title = `Yeni Kullanıcı Davet Edildi`;
  const message = `${invitedEmail} (${invitedRole}) organizasyona davet edildi`;

  return await createNotification(
    userId,
    organizationId,
    NotificationType.USER_INVITED,
    title,
    message,
    { invitedEmail, invitedRole }
  );
}

/**
 * Notify when usage limit warning (80%)
 */
async function notifyUsageLimitWarning(userId, organizationId, limitType, current, max) {
  const percentage = Math.round((current / max) * 100);
  const title = `⚠️ Limit Uyarısı`;
  const message = `Aylık ${limitType} limitinin %${percentage}'ine ulaştınız (${current}/${max})`;

  return await createNotification(
    userId,
    organizationId,
    NotificationType.USAGE_LIMIT_WARNING,
    title,
    message,
    { limitType, current, max, percentage }
  );
}

/**
 * Notify when usage limit is reached (100%)
 */
async function notifyUsageLimitReached(userId, organizationId, limitType, max) {
  const title = `🚨 Limit Doldu`;
  const message = `Aylık ${limitType} limitine ulaştınız (${max}). PRO plana yükselterek sınırsız kullanım sağlayabilirsiniz.`;

  return await createNotification(
    userId,
    organizationId,
    NotificationType.USAGE_LIMIT_REACHED,
    title,
    message,
    { limitType, max }
  );
}

/**
 * Notify all organization admins (ADMIN + MANAGER)
 * Useful for system-wide notifications
 */
async function notifyOrganizationAdmins(organizationId, type, title, message, data = {}) {
  // Get all ADMIN and MANAGER users in the organization
  const admins = await prisma.user.findMany({
    where: {
      organizationId,
      role: {
        in: ['ADMIN', 'MANAGER']
      },
      isActive: true
    },
    select: { id: true }
  });

  const notifications = await Promise.all(
    admins.map(admin =>
      createNotification(admin.id, organizationId, type, title, message, data)
    )
  );

  console.log(`🔔 Notified ${admins.length} organization admins`);
  return notifications.filter(n => n !== null);
}

/**
 * Notify all HR staff (HR_SPECIALIST + MANAGER + ADMIN)
 * For candidate/analysis related notifications
 */
async function notifyHRStaff(organizationId, type, title, message, data = {}) {
  const hrUsers = await prisma.user.findMany({
    where: {
      organizationId,
      role: {
        in: ['ADMIN', 'MANAGER', 'HR_SPECIALIST']
      },
      isActive: true
    },
    select: { id: true }
  });

  const notifications = await Promise.all(
    hrUsers.map(user =>
      createNotification(user.id, organizationId, type, title, message, data)
    )
  );

  console.log(`🔔 Notified ${hrUsers.length} HR staff members`);
  return notifications.filter(n => n !== null);
}

module.exports = {
  // Core functions
  createNotification,
  getUserNotifications,
  markAsRead,
  markAllAsRead,
  getUnreadCount,
  getPreferences,
  updatePreference,
  updatePreferences,
  cleanupOldNotifications,

  // Event-specific helpers
  notifyAnalysisStarted,
  notifyAnalysisCompleted,
  notifyAnalysisFailed,
  notifyCandidateUploaded,
  notifyOfferCreated,
  notifyOfferSent,
  notifyOfferAccepted,
  notifyOfferRejected,
  notifyOfferExpired,
  notifyInterviewScheduled,
  notifyInterviewCompleted,
  notifyInterviewCancelled,
  notifyUserInvited,
  notifyUsageLimitWarning,
  notifyUsageLimitReached,
  notifyOrganizationAdmins,
  notifyHRStaff
};
