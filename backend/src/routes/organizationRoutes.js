const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const { authenticateToken } = require('../middleware/auth');
const { enforceOrganizationIsolation } = require('../middleware/organizationIsolation');
const { authorize } = require('../middleware/authorize');
const { ROLES } = require('../constants/roles');

const prisma = new PrismaClient();

// Middleware arrays for different permission levels
const allAuthenticated = [authenticateToken, enforceOrganizationIsolation];
const adminOnly = [authenticateToken, enforceOrganizationIsolation, authorize([ROLES.ADMIN, ROLES.SUPER_ADMIN])];

router.get('/me', allAuthenticated, async (req, res) => {
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

router.patch('/me', adminOnly, async (req, res) => {
  try {

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

router.get('/me/usage', allAuthenticated, async (req, res) => {
  try {
    const org = req.organization;

    // Calculate percentages
    const analysisPercentage = Math.min(100, Math.round((org.monthlyAnalysisCount / org.maxAnalysisPerMonth) * 100));
    const cvPercentage = Math.min(100, Math.round((org.monthlyCvCount / org.maxCvPerMonth) * 100));
    const userPercentage = Math.min(100, Math.round((org.totalUsers / org.maxUsers) * 100));

    // Generate warnings (>80% usage)
    const warnings = [];
    if (analysisPercentage >= 80) {
      warnings.push({
        type: 'analysis',
        message: `Aylık analiz limitinizin %${analysisPercentage}'ine ulaştınız`,
        severity: analysisPercentage >= 100 ? 'critical' : 'warning'
      });
    }
    if (cvPercentage >= 80) {
      warnings.push({
        type: 'cv',
        message: `Aylık CV yükleme limitinizin %${cvPercentage}'ine ulaştınız`,
        severity: cvPercentage >= 100 ? 'critical' : 'warning'
      });
    }
    if (userPercentage >= 80) {
      warnings.push({
        type: 'user',
        message: `Kullanıcı limitinizin %${userPercentage}'ine ulaştınız`,
        severity: userPercentage >= 100 ? 'critical' : 'warning'
      });
    }

    const usage = {
      // Raw counts
      monthlyAnalysisCount: org.monthlyAnalysisCount,
      maxAnalysisPerMonth: org.maxAnalysisPerMonth,
      monthlyCvCount: org.monthlyCvCount,
      maxCvPerMonth: org.maxCvPerMonth,
      totalUsers: org.totalUsers,
      maxUsers: org.maxUsers,

      // Detailed breakdown (backward compatibility)
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
      },

      // Percentages
      percentages: {
        analysis: analysisPercentage,
        cv: cvPercentage,
        user: userPercentage
      },

      // Warnings
      warnings,

      // Plan info
      plan: org.plan
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
