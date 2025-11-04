const express = require('express');
const { getDashboardStats } = require('../controllers/dashboardController');
const { authenticateToken } = require('../middleware/auth');
const { enforceOrganizationIsolation } = require('../middleware/organizationIsolation');
const { authorize } = require('../middleware/authorize');
const prisma = require('../config/database');

const router = express.Router();

router.get(
  '/stats',
  authenticateToken,
  enforceOrganizationIsolation,
  authorize(['ADMIN', 'MANAGER', 'SUPER_ADMIN']),
  getDashboardStats
);

// GET /api/v1/dashboard/user
// Get USER dashboard data
router.get('/user', [
  authenticateToken,
  enforceOrganizationIsolation,
  authorize(['USER', 'HR_SPECIALIST', 'MANAGER', 'ADMIN', 'SUPER_ADMIN'])
], async (req, res) => {
  try {
    const userId = req.user.userId;

    // Profile completion
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        bio: true,
        avatar: true,
      }
    });

    const fields = ['firstName', 'lastName', 'email', 'phone', 'bio', 'avatar'];
    const completedFields = fields.filter(f => user[f]).length;
    const profileCompletion = Math.round((completedFields / fields.length) * 100);

    // Notifications
    const unreadNotifications = await prisma.notification.count({
      where: { userId, read: false }
    });

    const recentNotifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 5
    });

    // Activity (mock for now - implement session tracking later)
    const activity = {
      loginTime: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
      onlineTime: '2sa 15dk',
      pageViews: 12
    };

    // Activity timeline (last 7 days - mock data)
    const activityTimeline = [
      { date: 'Pzt', duration: 45, logins: 2 },
      { date: 'Sal', duration: 120, logins: 5 },
      { date: 'Çar', duration: 90, logins: 3 },
      { date: 'Per', duration: 150, logins: 6 },
      { date: 'Cum', duration: 60, logins: 2 },
      { date: 'Cmt', duration: 30, logins: 1 },
      { date: 'Paz', duration: 20, logins: 1 },
    ];

    res.json({
      success: true,
      data: {
        profile: {
          completion: profileCompletion,
          missingFields: fields.length - completedFields
        },
        notifications: {
          unread: unreadNotifications,
          latest: recentNotifications[0] || null
        },
        activity,
        recentNotifications,
        activityTimeline
      }
    });
  } catch (error) {
    console.error('[DASHBOARD] USER error:', error);
    res.status(500).json({
      success: false,
      message: 'Dashboard verileri alınırken hata oluştu'
    });
  }
});

module.exports = router;
