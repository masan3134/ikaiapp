/**
 * Error Monitoring Middleware - WebSocket Broadcasting
 * Captures all backend errors and broadcasts to local monitoring dashboard
 */

const WebSocket = require('ws');
const fs = require('fs').promises;
const path = require('path');

class ErrorMonitoringMiddleware {
  constructor() {
    this.wss = null;
    this.port = process.env.ERROR_MONITOR_PORT || 9999;
    this.logDir = path.join(__dirname, '../../logs/errors');
    this.dailyLogFile = null;
    this.errorCount = 0;
  }

  /**
   * Initialize WebSocket server
   */
  async initialize() {
    try {
      // Create log directory
      await fs.mkdir(this.logDir, { recursive: true });

      // Initialize WebSocket server
      this.wss = new WebSocket.Server({ port: this.port });

      this.wss.on('connection', (ws) => {
        console.log(`[Error Monitor] Client connected. Total clients: ${this.wss.clients.size}`);

        // Send welcome message
        ws.send(JSON.stringify({
          type: 'connected',
          message: 'Connected to IKAI Error Monitor',
          timestamp: new Date().toISOString(),
          environment: process.env.NODE_ENV || 'development'
        }));

        ws.on('close', () => {
          console.log(`[Error Monitor] Client disconnected. Total clients: ${this.wss.clients.size}`);
        });
      });

      console.log(`[Error Monitor] WebSocket server running on port ${this.port}`);

      // Update daily log file path
      this.updateDailyLogFile();

      // Schedule daily log rotation
      setInterval(() => this.updateDailyLogFile(), 60000); // Check every minute

    } catch (error) {
      console.error('[Error Monitor] Failed to initialize:', error);
    }
  }

  /**
   * Update daily log file path
   */
  updateDailyLogFile() {
    const date = new Date().toISOString().split('T')[0];
    this.dailyLogFile = path.join(this.logDir, `errors-${date}.jsonl`);
  }

  /**
   * Broadcast error to all connected clients
   */
  broadcast(errorData) {
    if (!this.wss) return;

    const message = JSON.stringify(errorData);

    this.wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  }

  /**
   * Log error to file
   */
  async logToFile(errorData) {
    try {
      const logEntry = JSON.stringify(errorData) + '\n';
      await fs.appendFile(this.dailyLogFile, logEntry, 'utf8');
    } catch (error) {
      console.error('[Error Monitor] Failed to write log:', error);
    }
  }

  /**
   * Capture and process error
   */
  async captureError(error, req = null, type = 'UNHANDLED') {
    this.errorCount++;

    const errorData = {
      id: `ERR-${Date.now()}-${this.errorCount}`,
      timestamp: new Date().toISOString(),
      type,
      severity: this.getSeverity(error),
      source: 'backend',
      message: error.message || 'Unknown error',
      stack: error.stack || '',
      name: error.name || 'Error',
      code: error.code || null,

      // Request context (if available)
      request: req ? {
        method: req.method,
        url: req.originalUrl || req.url,
        ip: req.ip,
        userAgent: req.get('user-agent'),
        userId: req.user?.id || null
      } : null,

      // Environment info
      environment: {
        nodeEnv: process.env.NODE_ENV,
        nodeVersion: process.version,
        platform: process.platform,
        memory: process.memoryUsage(),
        uptime: process.uptime()
      }
    };

    // Broadcast to WebSocket clients
    this.broadcast(errorData);

    // Log to file
    await this.logToFile(errorData);

    // Log to console
    console.error(`[Error Monitor] ${errorData.severity} | ${errorData.id}:`, error.message);

    return errorData;
  }

  /**
   * Determine error severity
   */
  getSeverity(error) {
    if (error.name === 'ValidationError') return 'WARNING';
    if (error.code === 'ECONNREFUSED') return 'CRITICAL';
    if (error.status >= 500) return 'ERROR';
    if (error.status >= 400) return 'WARNING';
    return 'ERROR';
  }

  /**
   * Express middleware for catching errors
   */
  middleware() {
    return async (err, req, res, next) => {
      // Capture error
      await this.captureError(err, req, 'EXPRESS');

      // Pass to next error handler
      next(err);
    };
  }

  /**
   * Process-level error handlers
   */
  setupProcessHandlers() {
    // Uncaught exceptions
    process.on('uncaughtException', async (error) => {
      await this.captureError(error, null, 'UNCAUGHT_EXCEPTION');
      console.error('[Error Monitor] Uncaught Exception - Server will exit');
      process.exit(1);
    });

    // Unhandled promise rejections
    process.on('unhandledRejection', async (reason, promise) => {
      const error = reason instanceof Error ? reason : new Error(String(reason));
      await this.captureError(error, null, 'UNHANDLED_REJECTION');
    });

    console.log('[Error Monitor] Process-level error handlers registered');
  }

  /**
   * Get monitoring statistics
   */
  getStats() {
    return {
      totalErrors: this.errorCount,
      connectedClients: this.wss ? this.wss.clients.size : 0,
      uptime: process.uptime(),
      logFile: this.dailyLogFile
    };
  }
}

// Singleton instance
const errorMonitor = new ErrorMonitoringMiddleware();

module.exports = errorMonitor;
