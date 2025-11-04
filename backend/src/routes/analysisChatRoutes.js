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
      select: { userId: true, organizationId: true, status: true }
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

    // IMPROVED: Simple AI Chat (Gemini full context) + History persistence
    const result = await simpleChat.chat(
      analysisId,
      message,
      req.user.id,  // FIX: req.user.id not req.user.userId
      analysis.organizationId // Use organizationId from analysis
    );

    res.json({
      success: true,
      messageId: result.messageId, // Chat history ID
      reply: result.reply,
      candidateCount: result.candidateCount,
      responseTime: result.responseTime,
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
 * GET /api/v1/analyses/:id/history
 * Get chat history for an analysis
 */
router.get('/:id/history', hrManagers, async (req, res) => {
  try {
    const { id: analysisId } = req.params;
    const { limit = 50, offset = 0 } = req.query;

    // Analiz kontrolü
    const analysis = await prisma.analysis.findUnique({
      where: { id: analysisId },
      select: { userId: true, organizationId: true }
    });

    if (!analysis) {
      return res.status(404).json({ error: 'Analysis not found' });
    }

    // Access control
    if (analysis.userId !== req.user.userId &&
        !['ADMIN', 'SUPER_ADMIN'].includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    // Get chat history (ordered by createdAt DESC - most recent first)
    const messages = await prisma.analysisChatMessage.findMany({
      where: { analysisId },
      select: {
        id: true,
        message: true,
        response: true,
        candidateCount: true,
        responseTime: true,
        usedSemanticSearch: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' },
      take: parseInt(limit),
      skip: parseInt(offset)
    });

    // Get total count
    const totalCount = await prisma.analysisChatMessage.count({
      where: { analysisId }
    });

    res.json({
      success: true,
      messages: messages.reverse(), // Reverse to chronological order (oldest first)
      total: totalCount,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

  } catch (error) {
    console.error('Get chat history error:', error);
    res.status(500).json({
      error: 'Failed to get chat history',
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
