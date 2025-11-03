const express = require('express');
const router = express.Router();

// Metrics storage
let requestCount = 0;
let errorCount = 0;
let intentBypassCount = 0;
const latencies = [];
const startTime = Date.now();

// Middleware to track requests
function trackRequest(req, res, next) {
  requestCount++;
  req._startTime = Date.now();

  const originalSend = res.send;
  res.send = function(data) {
    const latency = Date.now() - req._startTime;
    latencies.push(latency);
    if (latencies.length > 1000) latencies.shift();
    return originalSend.call(this, data);
  };

  next();
}

function trackError(err, req, res, next) {
  errorCount++;
  next(err);
}

function trackIntentBypass() {
  intentBypassCount++;
}

function percentile(arr, p) {
  if (arr.length === 0) return 0;
  const sorted = [...arr].sort((a, b) => a - b);
  const index = Math.ceil((p / 100) * sorted.length) - 1;
  return sorted[Math.max(0, index)];
}

router.get('/system', (req, res) => {
  if (process.env.METRICS_ENABLED !== 'true') {
    return res.status(404).json({ error: 'Metrics disabled' });
  }

  res.json({
    timestamp: new Date().toISOString(),
    uptime_seconds: Math.round((Date.now() - startTime) / 1000),
    requests: {
      total: requestCount,
      errors: errorCount,
      success: requestCount - errorCount,
      error_rate_pct: requestCount > 0 ? ((errorCount / requestCount) * 100).toFixed(2) : 0
    },
    performance: {
      intent_bypass_count: intentBypassCount,
      intent_bypass_rate_pct: requestCount > 0 ? ((intentBypassCount / requestCount) * 100).toFixed(2) : 0,
      latency_ms: {
        p50: percentile(latencies, 50),
        p95: percentile(latencies, 95),
        p99: percentile(latencies, 99),
        avg: latencies.length > 0 ? Math.round(latencies.reduce((a, b) => a + b, 0) / latencies.length) : 0,
        sample_size: latencies.length
      }
    },
    process: {
      memory: process.memoryUsage(),
      uptime: process.uptime()
    }
  });
});

module.exports = {
  metricsRoutes: router,
  trackRequest,
  trackError,
  trackIntentBypass
};
