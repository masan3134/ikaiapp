/**
 * Global Gemini API Rate Limiter
 * Prevents exceeding Gemini API rate limits across all services
 *
 * Gemini 2.0 Flash Limits:
 * - Free tier: 15 RPM (requests per minute)
 * - Paid tier: 1000 RPM
 *
 * Strategy: Simple in-memory rate limiter
 * - Track request timestamps
 * - Enforce minimum interval between requests
 * - Reject requests if rate limit exceeded
 */

class GeminiRateLimiter {
  constructor() {
    this.requests = []; // Array of timestamps
    this.maxRequests = parseInt(process.env.GEMINI_MAX_RPM) || 15; // Default to free tier
    this.windowMs = 60000; // 1 minute
    this.minInterval = Math.ceil(this.windowMs / this.maxRequests); // 4000ms for 15 RPM
  }

  /**
   * Check if we can make a request now
   * @returns {boolean}
   */
  canMakeRequest() {
    const now = Date.now();

    // Remove requests older than window
    this.requests = this.requests.filter(timestamp => now - timestamp < this.windowMs);

    // Check if under limit
    return this.requests.length < this.maxRequests;
  }

  /**
   * Wait until we can make a request
   * @returns {Promise<void>}
   */
  async waitForSlot() {
    while (!this.canMakeRequest()) {
      const now = Date.now();
      const oldestRequest = this.requests[0];
      const waitTime = this.windowMs - (now - oldestRequest) + 100; // +100ms buffer

      console.log(`⏳ Gemini rate limit reached. Waiting ${Math.ceil(waitTime / 1000)}s...`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }

    // Record this request
    this.requests.push(Date.now());
  }

  /**
   * Execute a function with rate limiting
   * @param {Function} fn - Async function to execute
   * @returns {Promise<any>}
   */
  async execute(fn) {
    await this.waitForSlot();
    return await fn();
  }

  /**
   * Get current stats
   * @returns {Object}
   */
  getStats() {
    const now = Date.now();
    this.requests = this.requests.filter(timestamp => now - timestamp < this.windowMs);

    return {
      requestsInWindow: this.requests.length,
      maxRequests: this.maxRequests,
      windowMs: this.windowMs,
      minInterval: this.minInterval,
      availableSlots: this.maxRequests - this.requests.length
    };
  }
}

// Singleton instance
const geminiRateLimiter = new GeminiRateLimiter();

module.exports = geminiRateLimiter;
