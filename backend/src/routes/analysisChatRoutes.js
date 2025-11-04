/**
 * Analysis Chat Routes
 * Her analize özel AI chat endpoints
 */

const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { enforceOrganizationIsolation } = require('../middleware/organizationIsolation');
const { authorize } = require('../middleware/authorize');
const { ROLE_GROUPS } = require('../constants/roles');
const { chatRateLimiter } = require('../middleware/chatRateLimiter');
const { trackRequest, trackIntentBypass } = require('./metricsRoutes');
// IMPROVED: Simple AI Chat (Gemini'nin önerisi - vector search yok, full context)
const simpleChat = require('../services/simpleAIChatService');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// HR Managers middleware (chat operations require HR access)
const hrManagers = [authenticateToken, enforceOrganizationIsolation, authorize(ROLE_GROUPS.HR_MANAGERS)];

/**
 * POST /api/v1/analyses/:id/chat
 * Analize özel chat mesajı gönder
 */
router.post('/:id/chat', trackRequest, chatRateLimiter, hrManagers, async (req, res) => {
  try {
    const { id: analysisId } = req.params;
    const { message, conversationHistory = [], clientVersion } = req.body;  // clientVersion eklendi

    // Validation
    if (!message || message.trim().length === 0) {
      return res.status(400).json({
        error: 'Message cannot be empty'
      });
    }

    // Analiz var mı ve kullanıcı sahibi mi kontrol et
    const analysis = await prisma.analysis.findUnique({
      where: { id: analysisId },
      select: { userId: true, status: true }
    });

    if (!analysis) {
      return res.status(404).json({
        error: 'Analysis not found'
      });
    }

    // SUPER_ADMIN and ADMIN can access all analyses, others only their own
    if (analysis.userId !== req.user.userId &&
        !['ADMIN', 'SUPER_ADMIN'].includes(req.user.role)) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Bu analize erişim yetkiniz yok'
      });
    }

    // IMPROVED: Simple AI Chat (Gemini full context)
    const result = await simpleChat.chat(analysisId, message);

    res.json({
      success: true,
      reply: result.reply,
      candidateCount: result.candidateCount,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({
      error: 'Chat failed',
      details: error.message
    });
  }
});

/**
 * GET /api/v1/analyses/:id/chat-stats
 * Chat context istatistikleri
 */
router.get('/:id/chat-stats', hrManagers, async (req, res) => {
  try {
    const { id: analysisId } = req.params;

    // Analiz kontrolü
    const analysis = await prisma.analysis.findUnique({
      where: { id: analysisId },
      select: { userId: true, status: true }
    });

    if (!analysis) {
      return res.status(404).json({ error: 'Analysis not found' });
    }

    // SUPER_ADMIN and ADMIN can access all analyses, others only their own
    if (analysis.userId !== req.user.userId &&
        !['ADMIN', 'SUPER_ADMIN'].includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    // IMPROVED: Simple stats - context always ready for completed analyses
    if (analysis.status !== 'COMPLETED') {
      return res.json({
        success: true,
        contextLoaded: false,
        message: 'Analysis not completed yet'
      });
    }

    // Get candidate count
    const context = await simpleChat.prepareAnalysisContext(analysisId);

    res.json({
      success: true,
      contextLoaded: true,
      candidateCount: context.candidateCount || 0,
      ready: true
    });
  } catch (error) {
    console.error('Get chat stats error:', error);

    res.status(500).json({
      error: 'Failed to get stats',
      details: error.message
    });
  }
});

module.exports = router;
