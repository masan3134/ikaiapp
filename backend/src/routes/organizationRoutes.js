const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const { authenticateToken } = require('../middleware/auth');
const { enforceOrganizationIsolation } = require('../middleware/organizationIsolation');

const prisma = new PrismaClient();

router.use(authenticateToken);
router.use(enforceOrganizationIsolation);

router.get('/me', async (req, res) => {
  try {
    return res.json({
      success: true,
      data: req.organization
    });
  } catch (error) {
    console.error('[Organization] Error fetching organization:', error);
    return res.status(500).json({
      success: false,
      message: 'Organizasyon bilgileri alınırken hata oluştu'
    });
  }
});

router.patch('/me', async (req, res) => {
  try {
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Bu işlem için admin yetkisi gereklidir'
      });
    }

    const { name, logo, primaryColor, industry, size, country, timezone } = req.body;

    const updated = await prisma.organization.update({
      where: { id: req.organizationId },
      data: {
        ...(name && { name }),
        ...(logo && { logo }),
        ...(primaryColor && { primaryColor }),
        ...(industry && { industry }),
        ...(size && { size }),
        ...(country && { country }),
        ...(timezone && { timezone })
      }
    });

    return res.json({
      success: true,
      data: updated,
      message: 'Organizasyon bilgileri güncellendi'
    });
  } catch (error) {
    console.error('[Organization] Error updating organization:', error);
    return res.status(500).json({
      success: false,
      message: 'Organizasyon güncellenirken hata oluştu'
    });
  }
});

router.get('/me/usage', async (req, res) => {
  try {
    const org = req.organization;

    const usage = {
      analyses: {
        used: org.monthlyAnalysisCount,
        limit: org.maxAnalysisPerMonth,
        remaining: Math.max(0, org.maxAnalysisPerMonth - org.monthlyAnalysisCount)
      },
      cvs: {
        used: org.monthlyCvCount,
        limit: org.maxCvPerMonth,
        remaining: Math.max(0, org.maxCvPerMonth - org.monthlyCvCount)
      },
      users: {
        used: org.totalUsers,
        limit: org.maxUsers,
        remaining: Math.max(0, org.maxUsers - org.totalUsers)
      }
    };

    return res.json({
      success: true,
      data: usage
    });
  } catch (error) {
    console.error('[Organization] Error fetching usage:', error);
    return res.status(500).json({
      success: false,
      message: 'Kullanım bilgileri alınırken hata oluştu'
    });
  }
});

module.exports = router;
