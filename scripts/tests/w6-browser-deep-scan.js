#!/usr/bin/env node

/**
 * W6: Browser Deep Scan - Find ALL real errors
 * Tests all 50+ pages across 5 roles
 * Detects: Console errors, API failures, stuck loading, broken buttons
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// Test configuration
const BASE_URL = 'http://localhost:8103';

const ROLES = [
  { email: 'test-user@test-org-2.com', password: 'TestPass123!', role: 'USER' },
  { email: 'test-hr_specialist@test-org-2.com', password: 'TestPass123!', role: 'HR_SPECIALIST' },
  { email: 'test-manager@test-org-2.com', password: 'TestPass123!', role: 'MANAGER' },
  { email: 'test-admin@test-org-1.com', password: 'TestPass123!', role: 'ADMIN' },
  { email: 'info@gaiai.ai', password: '23235656', role: 'SUPER_ADMIN' },
];

const PAGES = {
  USER: [
    '/dashboard',
    '/notifications',
    '/help',
    '/settings/overview',
    '/settings/profile',
    '/settings/security',
    '/settings/notifications',
  ],
  HR_SPECIALIST: [
    '/dashboard',
    '/job-postings',
    '/job-postings/new',
    '/candidates',
    '/wizard',
    '/analyses',
    '/offers',
    '/interviews',
    '/notifications',
    '/help',
  ],
  MANAGER: [
    '/dashboard',
    '/team',
    '/analytics',
    '/analytics/reports',
    '/notifications',
  ],
  ADMIN: [
    '/dashboard',
    '/settings/organization',
    '/settings/billing',
    '/settings/team',
    '/settings/integrations',
    '/settings/security',
  ],
  SUPER_ADMIN: [
    '/super-admin',
    '/super-admin/organizations',
    '/super-admin/users',
    '/super-admin/queues',
    '/super-admin/security',
    '/super-admin/analytics',
    '/super-admin/logs',
    '/super-admin/system',
    '/super-admin/milvus',
    '/super-admin/settings',
  ],
};

class BrowserTester {
  constructor() {
    this.allIssues = [];
    this.stats = {
      pagesTestedTotal: 0,
      consoleErrors: 0,
      networkFailures: 0,
      navigationErrors: 0,
      loadingStuck: 0,
      unexpectedErrors: 0,
    };
  }

  async testPage(page, url, role) {
    const pageIssues = [];
    const consoleMessages = [];
    const networkFailures = [];

    console.log(`  Testing: ${url}`);

    // Capture console errors
    const consoleHandler = (msg) => {
      if (msg.type() === 'error') {
        const text = msg.text();
        consoleMessages.push(text);
        pageIssues.push({
          type: 'console',
          severity: 'HIGH',
          error: text,
          url,
          role,
        });
      }
    };
    page.on('console', consoleHandler);

    // Capture network failures
    const requestFailedHandler = (req) => {
      const reqUrl = req.url();
      networkFailures.push(reqUrl);
      pageIssues.push({
        type: 'network',
        severity: 'MEDIUM',
        error: `Failed request: ${reqUrl}`,
        url,
        role,
      });
    };
    page.on('requestfailed', requestFailedHandler);

    try {
      // Navigate to page
      const response = await page.goto(`${BASE_URL}${url}`, {
        waitUntil: 'networkidle2',
        timeout: 15000,
      });

      // Check HTTP status
      if (response && !response.ok()) {
        pageIssues.push({
          type: 'navigation',
          severity: 'CRITICAL',
          error: `HTTP ${response.status()} - ${response.statusText()}`,
          url,
          role,
        });
      }

      // Wait a bit for dynamic content
      await page.waitForTimeout(2000);

      // Take screenshot
      const screenshotPath = `screenshots/${role}${url.replace(/\//g, '-')}.png`;
      await page.screenshot({ path: screenshotPath, fullPage: false });

      // Check for stuck loading spinners
      const spinners = await page.$$('[data-testid="loading"], .animate-spin, [role="progressbar"]');
      if (spinners.length > 0) {
        pageIssues.push({
          type: 'loading',
          severity: 'MEDIUM',
          error: `Stuck loading detected (${spinners.length} spinners)`,
          url,
          role,
        });
      }

      // Check for error messages in DOM
      const errorElements = await page.$$('.error, [role="alert"], .text-red-500');
      if (errorElements.length > 0) {
        for (const el of errorElements) {
          const text = await page.evaluate(e => e.textContent, el);
          if (text && text.trim()) {
            pageIssues.push({
              type: 'ui_error',
              severity: 'LOW',
              error: `Error message in DOM: ${text.trim().substring(0, 100)}`,
              url,
              role,
            });
          }
        }
      }

    } catch (error) {
      pageIssues.push({
        type: 'navigation',
        severity: 'CRITICAL',
        error: error.message,
        url,
        role,
      });
    } finally {
      // Remove listeners
      page.off('console', consoleHandler);
      page.off('requestfailed', requestFailedHandler);
    }

    return pageIssues;
  }

  async login(page, email, password) {
    console.log(`Logging in as ${email}...`);

    try {
      await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle2' });

      // Fill login form
      await page.waitForSelector('input[name="email"], input[type="email"]', { timeout: 5000 });
      await page.type('input[name="email"], input[type="email"]', email);
      await page.type('input[name="password"], input[type="password"]', password);

      // Submit
      await Promise.all([
        page.click('button[type="submit"]'),
        page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 10000 }),
      ]);

      console.log(`  ✅ Logged in successfully`);
      return true;
    } catch (error) {
      console.log(`  ❌ Login failed: ${error.message}`);
      return false;
    }
  }

  async testRole(browser, roleConfig) {
    console.log(`\n=== Testing ${roleConfig.role} Role ===`);

    const page = await browser.newPage();

    // Set viewport
    await page.setViewport({ width: 1920, height: 1080 });

    // Login
    const loginSuccess = await this.login(page, roleConfig.email, roleConfig.password);
    if (!loginSuccess) {
      await page.close();
      return;
    }

    // Test all pages for this role
    const pages = PAGES[roleConfig.role] || [];
    console.log(`Testing ${pages.length} pages...`);

    for (const url of pages) {
      const issues = await this.testPage(page, url, roleConfig.role);
      this.allIssues.push(...issues);
      this.stats.pagesTestedTotal++;

      // Update stats
      issues.forEach(issue => {
        if (issue.type === 'console') this.stats.consoleErrors++;
        if (issue.type === 'network') this.stats.networkFailures++;
        if (issue.type === 'navigation') this.stats.navigationErrors++;
        if (issue.type === 'loading') this.stats.loadingStuck++;
        if (issue.type === 'ui_error') this.stats.unexpectedErrors++;
      });

      // Small delay between pages
      await page.waitForTimeout(500);
    }

    await page.close();
    console.log(`✅ ${roleConfig.role} testing complete`);
  }

  async run() {
    console.log('🔍 W6: Browser Deep Scan Starting...\n');
    console.log(`Base URL: ${BASE_URL}`);
    console.log(`Roles to test: ${ROLES.length}`);
    console.log(`Total pages: ${Object.values(PAGES).flat().length}\n`);

    const browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
      ],
    });

    try {
      for (const roleConfig of ROLES) {
        await this.testRole(browser, roleConfig);
      }
    } finally {
      await browser.close();
    }

    this.generateReport();
  }

  generateReport() {
    console.log('\n\n=== BROWSER DEEP SCAN RESULTS ===');
    console.log(`Pages tested: ${this.stats.pagesTestedTotal}`);
    console.log(`Console errors: ${this.stats.consoleErrors}`);
    console.log(`Network failures: ${this.stats.networkFailures}`);
    console.log(`Navigation errors: ${this.stats.navigationErrors}`);
    console.log(`Loading stuck: ${this.stats.loadingStuck}`);
    console.log(`UI errors: ${this.stats.unexpectedErrors}`);
    console.log(`Total issues: ${this.allIssues.length}`);

    // Group issues by severity
    const critical = this.allIssues.filter(i => i.severity === 'CRITICAL');
    const high = this.allIssues.filter(i => i.severity === 'HIGH');
    const medium = this.allIssues.filter(i => i.severity === 'MEDIUM');
    const low = this.allIssues.filter(i => i.severity === 'LOW');

    console.log(`\nBy Severity:`);
    console.log(`  CRITICAL: ${critical.length}`);
    console.log(`  HIGH: ${high.length}`);
    console.log(`  MEDIUM: ${medium.length}`);
    console.log(`  LOW: ${low.length}`);

    // Save detailed report
    const reportData = {
      timestamp: new Date().toISOString(),
      stats: this.stats,
      issues: this.allIssues,
      summary: {
        critical: critical.length,
        high: high.length,
        medium: medium.length,
        low: low.length,
      },
    };

    fs.writeFileSync(
      'test-outputs/w6-browser-issues.json',
      JSON.stringify(reportData, null, 2)
    );

    console.log('\n✅ Report saved to: test-outputs/w6-browser-issues.json');

    // Show critical issues
    if (critical.length > 0) {
      console.log('\n🚨 CRITICAL ISSUES:');
      critical.forEach((issue, idx) => {
        console.log(`\n${idx + 1}. ${issue.role} - ${issue.url}`);
        console.log(`   ${issue.error}`);
      });
    }
  }
}

// Run tests
const tester = new BrowserTester();
tester.run().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
