const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { enforceOrganizationIsolation } = require('../middleware/organizationIsolation');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// POST /api/v1/onboarding/update-step - Update current step
router.post('/update-step',
  authenticateToken,
  enforceOrganizationIsolation,
  async (req, res) => {
    try {
      const { step, data } = req.body;

      // Validate step number
      if (typeof step !== 'number' || step < 0 || step > 5) {
        return res.status(400).json({
          success: false,
          message: 'Geçersiz adım numarası (0-5 arası olmalı)'
        });
      }

      // Update organization step
      const updated = await prisma.organization.update({
        where: { id: req.organizationId },
        data: {
          onboardingStep: step,
          // Update fields based on step data
          ...(data?.name && { name: data.name }),
          ...(data?.industry && { industry: data.industry }),
          ...(data?.size && { size: data.size }),
          ...(data?.logo && { logo: data.logo })
        }
      });

      res.json({
        success: true,
        data: {
          currentStep: updated.onboardingStep,
          organization: updated
        }
      });
    } catch (error) {
      console.error('Onboarding update-step error:', error);
      res.status(500).json({
        success: false,
        message: 'Adım güncellenirken hata oluştu'
      });
    }
  }
);

// POST /api/v1/onboarding/complete - Mark onboarding as complete
router.post('/complete',
  authenticateToken,
  enforceOrganizationIsolation,
  async (req, res) => {
    try {
      // Update organization
      const org = await prisma.organization.update({
        where: { id: req.organizationId },
        data: {
          onboardingCompleted: true,
          onboardingStep: 5
        }
      });

      // Update user
      await prisma.user.update({
        where: { id: req.user.id },
        data: { isOnboarded: true }
      });

      res.json({
        success: true,
        message: 'Onboarding tamamlandı! Hoş geldiniz! 🎉',
        data: { organization: org }
      });
    } catch (error) {
      console.error('Onboarding complete error:', error);
      res.status(500).json({
        success: false,
        message: 'Onboarding tamamlanırken hata oluştu'
      });
    }
  }
);

// GET /api/v1/onboarding/status - Get current onboarding status
router.get('/status',
  authenticateToken,
  enforceOrganizationIsolation,
  async (req, res) => {
    try {
      const org = await prisma.organization.findUnique({
        where: { id: req.organizationId },
        select: {
          onboardingCompleted: true,
          onboardingStep: true,
          name: true,
          industry: true,
          size: true
        }
      });

      res.json({
        success: true,
        data: org
      });
    } catch (error) {
      console.error('Onboarding status error:', error);
      res.status(500).json({
        success: false,
        message: 'Onboarding durumu alınırken hata oluştu'
      });
    }
  }
);

module.exports = router;
