const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Get offer analytics overview
 * Feature #24: Teklif Analitikleri
 */
async function getOverview(filters = {}) {
  const { startDate, endDate } = filters;

  const where = {};
  if (startDate || endDate) {
    where.createdAt = {};
    if (startDate) where.createdAt.gte = new Date(startDate);
    if (endDate) where.createdAt.lte = new Date(endDate);
  }

  const counts = await prisma.jobOffer.groupBy({
    by: ['status'],
    where,
    _count: {
      id: true,
    },
  });

  const overview = counts.reduce((acc, curr) => {
    acc[curr.status] = curr._count.id;
    return acc;
  }, {});

  const total = Object.values(overview).reduce((sum, count) => sum + count, 0);
  const sent = (overview.sent || 0) + (overview.accepted || 0) + (overview.rejected || 0) + (overview.expired || 0);

  return {
    total,
    sent,
    accepted: overview.accepted || 0,
    rejected: overview.rejected || 0,
    expired: overview.expired || 0,
    draft: overview.draft || 0,
    pending_approval: overview.pending_approval || 0,
    approved: overview.approved || 0,
    cancelled: overview.cancelled || 0,
    acceptanceRate: sent > 0 ? (((overview.accepted || 0) / sent) * 100).toFixed(1) : 0,
  };
}

/**
 * Get acceptance rate over time
 * Feature #25: Kabul Oranı Raporları
 */
async function getAcceptanceRate(filters = {}) {
  // This can be expanded to group by week/month
  return getOverview(filters); // For now, returns the general acceptance rate
}

/**
 * Get average response time
 * Feature #26: Ortalama Yanıt Süresi
 */
async function getAverageResponseTime(filters = {}) {
  const { startDate, endDate } = filters;

  const where = {
    status: { in: ['accepted', 'rejected'] },
    respondedAt: { not: null },
    sentAt: { not: null },
  };

  if (startDate || endDate) {
    where.sentAt = {};
    if (startDate) where.sentAt.gte = new Date(startDate);
    if (endDate) where.sentAt.lte = new Date(endDate);
  }

  const offers = await prisma.jobOffer.findMany({
    where,
    select: {
      sentAt: true,
      respondedAt: true,
    },
  });

  if (offers.length === 0) {
    return { averageDays: 0, total: 0 };
  }

  const totalDiff = offers.reduce((sum, offer) => {
    const diff = new Date(offer.respondedAt).getTime() - new Date(offer.sentAt).getTime();
    return sum + diff;
  }, 0);

  const avgMs = totalDiff / offers.length;
  const avgDays = avgMs / (1000 * 60 * 60 * 24);

  return {
    averageDays: avgDays.toFixed(1),
    total: offers.length,
  };
}

/**
 * Get statistics by department
 * Feature #27: Departman Bazlı İstatistik
 */
async function getByDepartment(filters = {}) {
  const { startDate, endDate } = filters;

  const where = {};
  if (startDate || endDate) {
    where.createdAt = {};
    if (startDate) where.createdAt.gte = new Date(startDate);
    if (endDate) where.createdAt.lte = new Date(endDate);
  }

  const result = await prisma.jobOffer.groupBy({
    by: ['department', 'status'],
    where,
    _count: {
      id: true,
    },
  });

  const departmentStats = result.reduce((acc, item) => {
    if (!acc[item.department]) {
      acc[item.department] = {
        department: item.department,
        total: 0,
        accepted: 0,
        rejected: 0,
        sent: 0,
      };
    }
    acc[item.department].total += item._count.id;
    if ([ 'accepted', 'rejected', 'sent', 'expired'].includes(item.status)) {
        acc[item.department].sent += item._count.id;
    }
    if (item.status === 'accepted') {
      acc[item.department].accepted += item._count.id;
    }
    if (item.status === 'rejected') {
        acc[item.department].rejected += item._count.id;
    }
    return acc;
  }, {});

  Object.values(departmentStats).forEach(dept => {
    dept.acceptanceRate = dept.sent > 0 ? ((dept.accepted / dept.sent) * 100).toFixed(1) : 0;
  });

  return Object.values(departmentStats);
}

module.exports = {
  getOverview,
  getAcceptanceRate,
  getAverageResponseTime,
  getByDepartment,
};
