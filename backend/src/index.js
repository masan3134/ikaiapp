require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const { PrismaClient } = require('@prisma/client');
const Redis = require('redis');
const Minio = require('minio');

// IMPROVEMENT #1: Winston Logger
const logger = require('./utils/logger');

// IMPROVEMENT #3: Request ID Middleware
const requestIdMiddleware = require('./middleware/requestId');

// NEW: Error Monitoring WebSocket (Real-time error broadcasting)
const errorMonitor = require('../middleware/errorMonitoringMiddleware');

const authRoutes = require('./routes/authRoutes');
const jobPostingRoutes = require('./routes/jobPostingRoutes');
const candidateRoutes = require('./routes/candidateRoutes');
const analysisRoutes = require('./routes/analysisRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const testRoutes = require('./routes/testRoutes');
const interviewRoutes = require('./routes/interviewRoutes');
const userRoutes = require('./routes/userRoutes'); // User management (admin only)
const { setRedisClient } = require('./controllers/authController');

// Milvus routes (opsiyonel - dependency varsa yükle)
let milvusSyncRoutes = null;
let smartSearchRoutes = null;
try {
  milvusSyncRoutes = require('./routes/milvusSyncRoutes');
  smartSearchRoutes = require('./routes/smartSearchRoutes');
  logger.info('✅ Milvus routes loaded');
} catch (error) {
  logger.warn('⚠️ Milvus routes not available:', { error: error.message });
}

const app = express();
const prisma = new PrismaClient();

// Trust proxy for nginx reverse proxy (disable for local dev)
app.set('trust proxy', process.env.NODE_ENV === 'production');

// IMPROVEMENT #2: Helmet.js Security Headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", process.env.FRONTEND_URL],
    }
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));

// IMPROVEMENT #3: Request ID Tracking
app.use(requestIdMiddleware);

// Middleware
const allowedOrigins = [
  'https://gaiai.ai',
  'https://www.gaiai.ai',
  'http://localhost:3000',
  'http://localhost:8103',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Global request tracking for chat
const { trackRequest } = require('./routes/metricsRoutes');
app.use('/api/v1/analyses', trackRequest);

// Redis Client
let redisClient;
(async () => {
  try {
    redisClient = Redis.createClient({
      url: process.env.REDIS_URL || 'redis://redis:6379'
    });
    await redisClient.connect();
    logger.info('✅ Redis connected');

    // Pass Redis client to auth controller
    setRedisClient(redisClient);
  } catch (error) {
    logger.error('❌ Redis connection error:', { error: error.message });
  }
})();

// MinIO Client
const minioClient = new Minio.Client({
  endPoint: process.env.MINIO_ENDPOINT || 'localhost',
  port: parseInt(process.env.MINIO_PORT) || 9000,
  useSSL: process.env.MINIO_USE_SSL === 'true',
  accessKey: process.env.MINIO_ACCESS_KEY || 'minioadmin',
  secretKey: process.env.MINIO_SECRET_KEY || 'minioadmin'
});

// Health Check Endpoint
app.get('/health', async (req, res) => {
  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    services: {
      database: 'checking',
      redis: 'checking',
      minio: 'checking'
    }
  };

  // Check Database
  try {
    await prisma.$queryRaw`SELECT 1`;
    health.services.database = 'connected';
  } catch (error) {
    health.services.database = `error: ${error.message}`;
    health.status = 'degraded';
  }

  // Check Redis
  try {
    if (redisClient && redisClient.isOpen) {
      await redisClient.ping();
      health.services.redis = 'connected';
    } else {
      health.services.redis = 'not connected';
      health.status = 'degraded';
    }
  } catch (error) {
    health.services.redis = `error: ${error.message}`;
    health.status = 'degraded';
  }

  // Check MinIO
  try {
    const bucketName = process.env.MINIO_BUCKET || 'ikai-cv-files';
    const exists = await minioClient.bucketExists(bucketName);
    if (exists) {
      health.services.minio = `connected (bucket: ${bucketName})`;
    } else {
      health.services.minio = `bucket '${bucketName}' not found`;
      health.status = 'degraded';
    }
  } catch (error) {
    health.services.minio = `error: ${error.message}`;
    health.status = 'degraded';
  }

  const statusCode = health.status === 'ok' ? 200 : 503;
  res.status(statusCode).json(health);
});

// API v1 Router
const apiV1Router = express.Router();

// Mount v1 routes
apiV1Router.use('/auth', authRoutes);
apiV1Router.use('/users', userRoutes); // User management (admin only)
apiV1Router.use('/job-postings', jobPostingRoutes);
apiV1Router.use('/candidates', candidateRoutes);
apiV1Router.use('/analyses', analysisRoutes);

// AI Chat routes (nested under analyses)
const analysisChatRoutes = require('./routes/analysisChatRoutes');
apiV1Router.use('/analyses', analysisChatRoutes);
apiV1Router.use('/dashboard', dashboardRoutes);
apiV1Router.use('/tests', testRoutes);
apiV1Router.use('/interviews', interviewRoutes); // Interview wizard system

// NEW FEATURE #1: Analytics Dashboard
const analyticsRoutes = require('./routes/analyticsRoutes');
apiV1Router.use('/analytics', analyticsRoutes);

// NEW FEATURE #8: Bulk CV Upload

// NEW FEATURE: Job Offer System (Phase 1 + 2 + 3)
  const offerRoutes = require('./routes/offerRoutes');
  const templateRoutes = require('./routes/templateRoutes');
  const categoryRoutes = require('./routes/categoryRoutes');
  const publicOfferRoutes = require('./routes/publicOfferRoutes');
  const analyticsOfferRoutes = require('./routes/analyticsOfferRoutes'); // Phase 4
  const revisionRoutes = require('./routes/revisionRoutes'); // Phase 5
  const negotiationRoutes = require('./routes/negotiationRoutes'); // Phase 5
  const attachmentRoutes = require('./routes/attachmentRoutes'); // Phase 5

  // CRITICAL: Register public routes BEFORE authenticated routes to avoid conflict
  apiV1Router.use('/offers/public', publicOfferRoutes); // Public routes (NO AUTH)

  // Register other offer-related routes
  apiV1Router.use('/offers/analytics', analyticsOfferRoutes); // Phase 4
  apiV1Router.use('/offers', revisionRoutes); // Phase 5
  apiV1Router.use('/offers', negotiationRoutes); // Phase 5
  apiV1Router.use('/offers', attachmentRoutes); // Phase 5
  apiV1Router.use('/offers', offerRoutes);
  apiV1Router.use('/offer-templates', templateRoutes);
  apiV1Router.use('/offer-template-categories', categoryRoutes);


  logger.info('✅ Offer routes registered (Phases 1-5)');

// MANDATORY FEATURE: Centralized Error Logging
const errorLoggingRoutes = require('./routes/errorLoggingRoutes');
apiV1Router.use('/errors', errorLoggingRoutes);

// 🆕 Cache management routes
const cacheRoutes = require('./routes/cacheRoutes');
apiV1Router.use('/cache', cacheRoutes);

// Metrics route
const { metricsRoutes } = require('./routes/metricsRoutes');
apiV1Router.use('/metrics', metricsRoutes);

// Milvus routes (opsiyonel)
if (milvusSyncRoutes) {
  apiV1Router.use('/milvus-sync', milvusSyncRoutes);
}
if (smartSearchRoutes) {
  apiV1Router.use('/smart-search', smartSearchRoutes);
}

// Queue monitoring routes (Admin only)
const queueRoutes = require('./routes/queueRoutes');
apiV1Router.use('/queue', queueRoutes);

// Comprehensive dashboard route (All users, filtered by role)
const comprehensiveDashboardRoutes = require('./routes/comprehensiveDashboardRoutes');
apiV1Router.use('/comprehensive-dashboard', comprehensiveDashboardRoutes);

// Admin endpoint - Make user admin (DEVELOPMENT ONLY)
// WARNING: This endpoint is disabled in production for security
if (process.env.NODE_ENV !== 'production') {
  apiV1Router.post('/admin/make-admin', async (req, res) => {
    try {
      const { email, secretKey } = req.body;

      // Security check - require secret key from environment
      const requiredKey = process.env.ADMIN_SECRET_KEY;
      if (!requiredKey) {
        return res.status(503).json({
          error: 'Admin endpoint not configured',
          message: 'ADMIN_SECRET_KEY not set in environment'
        });
      }

      if (secretKey !== requiredKey) {
        return res.status(403).json({ error: 'Unauthorized - Invalid secret key' });
      }

      if (!email) {
        return res.status(400).json({ error: 'Email is required' });
      }

      const user = await prisma.user.update({
        where: { email },
        data: { role: 'ADMIN' }
      });

      console.log(`⚠️  Admin role granted to: ${email}`);

      res.json({
        message: 'User is now admin',
        user: {
          id: user.id,
          email: user.email,
          role: user.role
        }
      });
    } catch (error) {
      if (error.code === 'P2025') {
        return res.status(404).json({ error: 'User not found' });
      }
      res.status(500).json({ error: 'Failed to update user role', details: error.message });
    }
  });
}

// Mount API v1 router
app.use('/api/v1', apiV1Router);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'IKAI HR CV Analysis API',
    version: '2.0.0',
    apiVersion: 'v1',
    endpoints: {
      health: '/health',
      auth: '/api/v1/auth',
      jobPostings: '/api/v1/job-postings',
      candidates: '/api/v1/candidates',
      analyses: '/api/v1/analyses',
      dashboard: '/api/v1/dashboard',
      admin: '/api/v1/admin (dev only)',
      docs: '/api-docs (coming soon)'
    }
  });
});

// Error Handler
const errorHandler = require('./middleware/errorHandler');
app.use(errorHandler);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found', path: req.path });
});

// Start BullMQ workers
console.log('🚀 Starting BullMQ workers...');
require('./workers/analysisWorker');    // CV analysis with Gemini API (concurrency: 3)
require('./workers/offerWorker');       // Job offer emails (concurrency: 2)
require('./workers/emailWorker');       // Generic emails (concurrency: 5)
require('./workers/testGenerationWorker'); // Test generation with Gemini API (concurrency: 2)
require('./queues/testQueue');          // Test email worker (inline - legacy, kept for compatibility)
console.log('✅ All BullMQ workers started successfully');

// Milvus Sync System
if (process.env.MILVUS_SYNC_ENABLED !== 'false') {
  try {
    require('./workers/milvusSyncWorker'); // Start Milvus sync worker
    const { scheduleDailySync } = require('./queues/milvusSyncQueue');
    scheduleDailySync().then(() => {
      console.log('✅ Milvus daily sync scheduled (2 AM)');
    }).catch((err) => {
      console.warn('⚠️ Milvus sync scheduling warning:', err.message);
    });
  } catch (error) {
    console.warn('⚠️ Milvus sync system not available:', error.message);
  }
}

// Graceful Shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down gracefully...');
  if (redisClient) await redisClient.quit();
  await prisma.$disconnect();
  process.exit(0);
});

const PORT = process.env.BACKEND_PORT || 3001;
app.listen(PORT, async () => {
  logger.info(`🚀 IKAI Backend API running on http://localhost:${PORT}`);
  logger.info(`📊 Health check: http://localhost:${PORT}/health`);
  logger.info('✅ Security: Helmet enabled');
  logger.info('✅ Logging: Winston configured');
  logger.info('✅ Tracking: Request ID middleware active');

  // Initialize Error Monitoring WebSocket
  try {
    await errorMonitor.initialize();
    errorMonitor.setupProcessHandlers();
    logger.info('✅ Error Monitoring WebSocket: Active on port ' + (process.env.ERROR_MONITOR_PORT || 9999));
  } catch (error) {
    logger.warn('⚠️  Error Monitoring WebSocket failed to start:', { error: error.message });
  }

  // Setup cron jobs (Phase 3: Feature #12 - Expiration)
  try {
    const { setupExpirationCron } = require('./jobs/offerExpirationJob');
    setupExpirationCron();
  } catch (error) {
    logger.error('❌ Cron job setup error:', { error: error.message });
  }
});

module.exports = app;
