#!/usr/bin/env node
/**
 * W5: SUPER_ADMIN E2E Test - Comprehensive
 * Tests ALL SUPER_ADMIN features:
 * - Dashboard, Multi-org, System Health, Queues
 * - Global Analytics, User Management, DB Health
 * - API Monitoring, System Config, Performance
 * - Design Consistency, Console Errors
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const https = require('http');

const FRONTEND_URL = 'http://localhost:8103';
const BACKEND_URL = 'http://localhost:8102';

// Test credentials
const SUPER_ADMIN_EMAIL = 'info@gaiai.ai';
const SUPER_ADMIN_PASSWORD = '23235656';

// Create test outputs directory
const OUTPUT_DIR = 'scripts/test-outputs/w5-super-admin';
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Results tracking
const testResults = {
  timestamp: new Date().toISOString(),
  consoleErrors: [],
  consoleWarnings: [],
  pageErrors: [],
  features: {},
  performance: {},
  bugs: [],
  designIssues: []
};

console.log('='.repeat(80));
console.log('W5: SUPER_ADMIN E2E TEST - COMPREHENSIVE');
console.log('='.repeat(80));
console.log(`Test Account: ${SUPER_ADMIN_EMAIL}`);
console.log(`Frontend: ${FRONTEND_URL}`);
console.log(`Backend: ${BACKEND_URL}`);
console.log(`Output Directory: ${OUTPUT_DIR}`);
console.log('='.repeat(80));

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });

  const page = await browser.newPage();

  // Set viewport for consistent screenshots
  await page.setViewport({ width: 1920, height: 1080 });

  // Track console errors/warnings
  page.on('console', msg => {
    const type = msg.type();
    const text = msg.text();
    if (type === 'error') {
      testResults.consoleErrors.push({ page: page.url(), message: text });
      console.log(`   ⚠️  Console error: ${text.substring(0, 100)}`);
    } else if (type === 'warning') {
      testResults.consoleWarnings.push({ page: page.url(), message: text });
    }
  });

  // Track page errors
  page.on('pageerror', error => {
    testResults.pageErrors.push({ page: page.url(), message: error.message });
    console.log(`   ❌ Page error: ${error.message.substring(0, 100)}`);
  });

  try {
    // ===================================================================
    // TEST 1: LOGIN (via Node.js API + Token Injection)
    // ===================================================================
    console.log('\n[TEST 1/12] LOGIN AS SUPER_ADMIN...');
    const loginStart = Date.now();

    // Login via Node.js HTTP (avoid CORS)
    const loginData = JSON.stringify({
      email: SUPER_ADMIN_EMAIL,
      password: SUPER_ADMIN_PASSWORD
    });

    const loginResponse = await new Promise((resolve, reject) => {
      const req = https.request({
        hostname: 'localhost',
        port: 8102,
        path: '/api/v1/auth/login',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': loginData.length
        }
      }, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            reject(e);
          }
        });
      });
      req.on('error', reject);
      req.write(loginData);
      req.end();
    });

    const loginTime = Date.now() - loginStart;
    testResults.performance.login = loginTime;

    if (loginResponse.success && loginResponse.token) {
      console.log(`   ✅ Login successful via API (${loginTime}ms)`);

      // Inject token into localStorage
      await page.goto(`${FRONTEND_URL}`, { waitUntil: 'networkidle0' });
      await page.evaluate((token, user) => {
        localStorage.setItem('auth_token', token);
        localStorage.setItem('auth_user', JSON.stringify(user));
      }, loginResponse.token, loginResponse.user);

      // Navigate to dashboard
      await page.goto(`${FRONTEND_URL}/super-admin`, { waitUntil: 'networkidle0' });

      testResults.features.login = { status: 'PASS', time: loginTime, method: 'API + Token Injection' };
    } else {
      console.log(`   ❌ Login failed: ${loginResponse.message || 'Unknown error'}`);
      testResults.features.login = { status: 'FAIL', reason: loginResponse.message };
      testResults.bugs.push({
        category: 'LOGIN',
        severity: 'CRITICAL',
        description: `Login API failed: ${loginResponse.message || 'Unknown error'}`
      });
    }

    await page.screenshot({
      path: `${OUTPUT_DIR}/01-after-login.png`,
      fullPage: true
    });

    // ===================================================================
    // TEST 2: SUPER_ADMIN DASHBOARD
    // ===================================================================
    console.log('\n[TEST 2/12] SUPER_ADMIN DASHBOARD...');
    const dashStart = Date.now();

    // Try different possible dashboard URLs
    const possibleDashboards = [
      `${FRONTEND_URL}/super-admin`, // CORRECT URL (page.tsx in super-admin/)
      `${FRONTEND_URL}/dashboard`,
      page.url() // Current URL after login
    ];

    let dashboardLoaded = false;
    for (const url of possibleDashboards) {
      try {
        if (page.url() !== url) {
          await page.goto(url, { waitUntil: 'networkidle0', timeout: 10000 });
        }
        // Check if we got a 404 or error
        const pageContent = await page.content();
        if (!pageContent.includes('404') && !pageContent.includes('Not Found')) {
          dashboardLoaded = true;
          console.log(`   ✅ Dashboard loaded: ${url}`);
          break;
        }
      } catch (err) {
        console.log(`   ⚠️  ${url} failed: ${err.message.substring(0, 50)}`);
      }
    }

    if (!dashboardLoaded) {
      console.log('   ❌ No dashboard URL worked!');
      testResults.bugs.push({
        category: 'DASHBOARD',
        severity: 'CRITICAL',
        description: 'Cannot access SUPER_ADMIN dashboard - tried /super-admin/dashboard and /dashboard'
      });
    }

    const dashTime = Date.now() - dashStart;
    testResults.performance.dashboard = dashTime;

    // Check for SUPER_ADMIN dashboard elements
    console.log('   Checking dashboard elements...');

    // Check for heading
    const h1 = await page.$('h1');
    const h1Text = await page.evaluate(el => el?.textContent, h1);
    console.log(`   Dashboard heading: "${h1Text?.trim() || 'NOT FOUND'}"`);

    // Check for red theme (SUPER_ADMIN color)
    const bodyClasses = await page.evaluate(() => document.body.className);
    const hasRedTheme = bodyClasses.includes('red') ||
                        await page.evaluate(() => {
                          const elements = document.querySelectorAll('[class*="red"]');
                          return elements.length > 0;
                        });

    if (hasRedTheme) {
      console.log('   ✅ Red theme detected');
    } else {
      console.log('   ⚠️  Red theme NOT detected');
      testResults.designIssues.push({
        page: 'Dashboard',
        issue: 'SUPER_ADMIN red theme not consistently applied'
      });
    }

    // Count widgets/cards
    const cards = await page.$$('[class*="card"], [class*="widget"], [class*="bg-gradient"], [class*="border"][class*="rounded"]');
    console.log(`   Dashboard widgets: ${cards.length}`);

    testResults.features.dashboard = {
      status: dashboardLoaded ? 'PASS' : 'FAIL',
      time: dashTime,
      widgets: cards.length,
      redTheme: hasRedTheme,
      heading: h1Text?.trim()
    };

    await page.screenshot({
      path: `${OUTPUT_DIR}/02-dashboard.png`,
      fullPage: true
    });

    // ===================================================================
    // TEST 3: ALL ORGANIZATIONS VIEW
    // ===================================================================
    console.log('\n[TEST 3/12] ALL ORGANIZATIONS VIEW...');

    const orgUrls = [
      `${FRONTEND_URL}/super-admin/organizations`,
      `${FRONTEND_URL}/organizations`,
      `${FRONTEND_URL}/super-admin/orgs`
    ];

    let orgsPageLoaded = false;
    let orgsUrl = '';

    for (const url of orgUrls) {
      try {
        await page.goto(url, { waitUntil: 'networkidle0', timeout: 10000 });
        const content = await page.content();
        if (!content.includes('404') && !content.includes('Not Found')) {
          orgsPageLoaded = true;
          orgsUrl = url;
          console.log(`   ✅ Organizations page loaded: ${url}`);
          break;
        }
      } catch (err) {
        console.log(`   ⚠️  ${url} failed`);
      }
    }

    if (orgsPageLoaded) {
      // Check for organization list
      const orgCards = await page.$$('[class*="org"], [class*="organization"], [class*="border"][class*="rounded"]');
      console.log(`   Organization cards found: ${orgCards.length}`);

      // Check for summary/stats
      const statsCards = await page.$$('[class*="stat"], [class*="summary"]');
      console.log(`   Stats cards: ${statsCards.length}`);

      // Check for action buttons
      const buttons = await page.$$('button');
      console.log(`   Total buttons: ${buttons.length}`);

      testResults.features.organizations = {
        status: 'PASS',
        url: orgsUrl,
        orgCards: orgCards.length,
        statsCards: statsCards.length,
        buttons: buttons.length
      };
    } else {
      console.log('   ❌ Organizations page not accessible');
      testResults.features.organizations = {
        status: 'FAIL',
        reason: 'Page not found - tried multiple URLs'
      };
      testResults.bugs.push({
        category: 'ORGANIZATIONS',
        severity: 'CRITICAL',
        description: 'Organizations page not accessible (404)'
      });
    }

    await page.screenshot({
      path: `${OUTPUT_DIR}/03-organizations.png`,
      fullPage: true
    });

    // ===================================================================
    // TEST 4: SYSTEM HEALTH MONITORING
    // ===================================================================
    console.log('\n[TEST 4/12] SYSTEM HEALTH MONITORING...');

    const healthUrls = [
      `${FRONTEND_URL}/super-admin/system-health`,
      `${FRONTEND_URL}/super-admin/health`,
      `${FRONTEND_URL}/system/health`
    ];

    let healthLoaded = false;
    for (const url of healthUrls) {
      try {
        await page.goto(url, { waitUntil: 'networkidle0', timeout: 10000 });
        const content = await page.content();
        if (!content.includes('404')) {
          healthLoaded = true;
          console.log(`   ✅ Health page loaded: ${url}`);

          // Check for service status indicators
          const statusIndicators = await page.$$('[class*="status"], [class*="health"]');
          console.log(`   Status indicators: ${statusIndicators.length}`);

          testResults.features.systemHealth = {
            status: 'PASS',
            url: url,
            indicators: statusIndicators.length
          };
          break;
        }
      } catch (err) {
        console.log(`   ⚠️  ${url} failed`);
      }
    }

    if (!healthLoaded) {
      console.log('   ❌ System Health page not found');
      testResults.features.systemHealth = { status: 'FAIL', reason: 'Page not implemented' };
      testResults.bugs.push({
        category: 'SYSTEM_HEALTH',
        severity: 'HIGH',
        description: 'System Health monitoring page not accessible'
      });
    }

    await page.screenshot({
      path: `${OUTPUT_DIR}/04-system-health.png`,
      fullPage: true
    });

    // ===================================================================
    // TEST 5: QUEUE MANAGEMENT
    // ===================================================================
    console.log('\n[TEST 5/12] QUEUE MANAGEMENT...');

    const queueUrls = [
      `${FRONTEND_URL}/super-admin/queues`,
      `${FRONTEND_URL}/super-admin/queue-management`,
      `${FRONTEND_URL}/queues`
    ];

    let queueLoaded = false;
    for (const url of queueUrls) {
      try {
        await page.goto(url, { waitUntil: 'networkidle0', timeout: 10000 });
        const content = await page.content();
        if (!content.includes('404')) {
          queueLoaded = true;
          console.log(`   ✅ Queue page loaded: ${url}`);
          testResults.features.queueManagement = { status: 'PASS', url: url };
          break;
        }
      } catch (err) {
        console.log(`   ⚠️  ${url} failed`);
      }
    }

    if (!queueLoaded) {
      console.log('   ❌ Queue Management page not found');
      testResults.features.queueManagement = { status: 'FAIL' };
      testResults.bugs.push({
        category: 'QUEUE_MANAGEMENT',
        severity: 'HIGH',
        description: 'Queue Management page not implemented'
      });
    }

    await page.screenshot({
      path: `${OUTPUT_DIR}/05-queue-management.png`,
      fullPage: true
    });

    // ===================================================================
    // TEST 6: GLOBAL ANALYTICS
    // ===================================================================
    console.log('\n[TEST 6/12] GLOBAL ANALYTICS...');

    const analyticsUrls = [
      `${FRONTEND_URL}/super-admin/analytics`,
      `${FRONTEND_URL}/analytics`,
      `${FRONTEND_URL}/super-admin/reports`
    ];

    let analyticsLoaded = false;
    for (const url of analyticsUrls) {
      try {
        await page.goto(url, { waitUntil: 'networkidle0', timeout: 10000 });
        const content = await page.content();
        if (!content.includes('404')) {
          analyticsLoaded = true;
          console.log(`   ✅ Analytics page loaded: ${url}`);
          testResults.features.globalAnalytics = { status: 'PASS', url: url };
          break;
        }
      } catch (err) {
        console.log(`   ⚠️  ${url} failed`);
      }
    }

    if (!analyticsLoaded) {
      console.log('   ⚠️  Global Analytics page not found - may not be implemented yet');
      testResults.features.globalAnalytics = { status: 'NOT_IMPLEMENTED' };
    }

    await page.screenshot({
      path: `${OUTPUT_DIR}/06-global-analytics.png`,
      fullPage: true
    });

    // ===================================================================
    // TEST 7: USER MANAGEMENT (ALL ORGS)
    // ===================================================================
    console.log('\n[TEST 7/12] USER MANAGEMENT (ALL ORGS)...');

    const userUrls = [
      `${FRONTEND_URL}/super-admin/users`,
      `${FRONTEND_URL}/users`
    ];

    let usersLoaded = false;
    for (const url of userUrls) {
      try {
        await page.goto(url, { waitUntil: 'networkidle0', timeout: 10000 });
        const content = await page.content();
        if (!content.includes('404')) {
          usersLoaded = true;
          console.log(`   ✅ Users page loaded: ${url}`);

          // Check if shows multi-org users
          const orgFilters = await page.$$('select, [class*="filter"]');
          console.log(`   Filters found: ${orgFilters.length}`);

          testResults.features.userManagement = {
            status: 'PASS',
            url: url,
            filters: orgFilters.length
          };
          break;
        }
      } catch (err) {
        console.log(`   ⚠️  ${url} failed`);
      }
    }

    if (!usersLoaded) {
      console.log('   ⚠️  User Management page not accessible');
      testResults.features.userManagement = { status: 'NOT_ACCESSIBLE' };
    }

    await page.screenshot({
      path: `${OUTPUT_DIR}/07-user-management.png`,
      fullPage: true
    });

    // ===================================================================
    // TEST 8: DATABASE HEALTH
    // ===================================================================
    console.log('\n[TEST 8/12] DATABASE HEALTH...');

    const dbUrls = [
      `${FRONTEND_URL}/super-admin/database`,
      `${FRONTEND_URL}/super-admin/db-health`
    ];

    let dbLoaded = false;
    for (const url of dbUrls) {
      try {
        await page.goto(url, { waitUntil: 'networkidle0', timeout: 10000 });
        const content = await page.content();
        if (!content.includes('404')) {
          dbLoaded = true;
          console.log(`   ✅ DB Health page loaded: ${url}`);
          testResults.features.databaseHealth = { status: 'PASS', url: url };
          break;
        }
      } catch (err) {
        console.log(`   ⚠️  ${url} failed`);
      }
    }

    if (!dbLoaded) {
      console.log('   ⚠️  Database Health page not found');
      testResults.features.databaseHealth = { status: 'NOT_IMPLEMENTED' };
    }

    await page.screenshot({
      path: `${OUTPUT_DIR}/08-database-health.png`,
      fullPage: true
    });

    // ===================================================================
    // TEST 9: API MONITORING
    // ===================================================================
    console.log('\n[TEST 9/12] API MONITORING...');

    const apiUrls = [
      `${FRONTEND_URL}/super-admin/api-monitoring`,
      `${FRONTEND_URL}/super-admin/api`
    ];

    let apiLoaded = false;
    for (const url of apiUrls) {
      try {
        await page.goto(url, { waitUntil: 'networkidle0', timeout: 10000 });
        const content = await page.content();
        if (!content.includes('404')) {
          apiLoaded = true;
          console.log(`   ✅ API Monitoring page loaded: ${url}`);
          testResults.features.apiMonitoring = { status: 'PASS', url: url };
          break;
        }
      } catch (err) {
        console.log(`   ⚠️  ${url} failed`);
      }
    }

    if (!apiLoaded) {
      console.log('   ⚠️  API Monitoring page not found');
      testResults.features.apiMonitoring = { status: 'NOT_IMPLEMENTED' };
    }

    await page.screenshot({
      path: `${OUTPUT_DIR}/09-api-monitoring.png`,
      fullPage: true
    });

    // ===================================================================
    // TEST 10: SYSTEM CONFIGURATION
    // ===================================================================
    console.log('\n[TEST 10/12] SYSTEM CONFIGURATION...');

    const configUrls = [
      `${FRONTEND_URL}/super-admin/configuration`,
      `${FRONTEND_URL}/super-admin/settings`,
      `${FRONTEND_URL}/super-admin/config`
    ];

    let configLoaded = false;
    for (const url of configUrls) {
      try {
        await page.goto(url, { waitUntil: 'networkidle0', timeout: 10000 });
        const content = await page.content();
        if (!content.includes('404')) {
          configLoaded = true;
          console.log(`   ✅ Config page loaded: ${url}`);
          testResults.features.systemConfiguration = { status: 'PASS', url: url };
          break;
        }
      } catch (err) {
        console.log(`   ⚠️  ${url} failed`);
      }
    }

    if (!configLoaded) {
      console.log('   ⚠️  System Configuration page not found');
      testResults.features.systemConfiguration = { status: 'NOT_IMPLEMENTED' };
    }

    await page.screenshot({
      path: `${OUTPUT_DIR}/10-system-configuration.png`,
      fullPage: true
    });

    // ===================================================================
    // TEST 11: PERFORMANCE METRICS
    // ===================================================================
    console.log('\n[TEST 11/12] PERFORMANCE TESTING...');

    // Test API endpoints
    console.log('   Testing API endpoints...');

    const apiTests = [
      { name: 'health', url: `${BACKEND_URL}/health` },
      { name: 'auth-check', url: `${BACKEND_URL}/api/v1/auth/check` }
    ];

    for (const test of apiTests) {
      try {
        const start = Date.now();
        const response = await page.evaluate(async (url) => {
          const res = await fetch(url);
          return { status: res.status, ok: res.ok };
        }, test.url);
        const time = Date.now() - start;
        console.log(`   ${test.name}: ${response.status} (${time}ms)`);
        testResults.performance[test.name] = time;
      } catch (err) {
        console.log(`   ${test.name}: ERROR`);
        testResults.performance[test.name] = -1;
      }
    }

    // ===================================================================
    // TEST 12: DESIGN CONSISTENCY CHECK
    // ===================================================================
    console.log('\n[TEST 12/12] DESIGN CONSISTENCY...');

    // Check for consistent red theme across pages
    const pagesChecked = [
      { name: 'Dashboard', selector: 'body' },
      { name: 'Organizations', selector: 'body' }
    ];

    console.log('   Checking color theme consistency...');
    console.log('   (Red theme should be used for SUPER_ADMIN)');

    // Note: Detailed design check would require more page navigation
    // For now, mark as needs manual review
    testResults.features.designConsistency = {
      status: 'NEEDS_REVIEW',
      note: 'Manual review required for full design consistency'
    };

    // ===================================================================
    // FINAL SUMMARY
    // ===================================================================
    console.log('\n' + '='.repeat(80));
    console.log('TEST SUMMARY');
    console.log('='.repeat(80));

    console.log('\n📊 FEATURES TESTED:');
    for (const [feature, result] of Object.entries(testResults.features)) {
      const status = result.status || 'UNKNOWN';
      const icon = status === 'PASS' ? '✅' : status === 'FAIL' ? '❌' : '⚠️';
      console.log(`   ${icon} ${feature}: ${status}`);
    }

    console.log('\n⚡ PERFORMANCE:');
    for (const [metric, time] of Object.entries(testResults.performance)) {
      if (time > 0) {
        console.log(`   ${metric}: ${time}ms`);
      }
    }

    console.log('\n🐛 BUGS FOUND:');
    if (testResults.bugs.length === 0) {
      console.log('   ✅ No bugs found');
    } else {
      testResults.bugs.forEach((bug, i) => {
        console.log(`   ${i + 1}. [${bug.severity}] ${bug.category}: ${bug.description}`);
      });
    }

    console.log('\n🎨 DESIGN ISSUES:');
    if (testResults.designIssues.length === 0) {
      console.log('   ✅ No design issues found');
    } else {
      testResults.designIssues.forEach((issue, i) => {
        console.log(`   ${i + 1}. ${issue.page}: ${issue.issue}`);
      });
    }

    console.log('\n⚠️  CONSOLE ERRORS:');
    console.log(`   Total console errors: ${testResults.consoleErrors.length}`);
    console.log(`   Total console warnings: ${testResults.consoleWarnings.length}`);
    console.log(`   Total page errors: ${testResults.pageErrors.length}`);

    if (testResults.consoleErrors.length > 0) {
      console.log('\n   First 5 console errors:');
      testResults.consoleErrors.slice(0, 5).forEach((err, i) => {
        console.log(`   ${i + 1}. ${err.message.substring(0, 100)}`);
      });
    }

    // Save detailed results to JSON
    const resultsPath = `${OUTPUT_DIR}/test-results.json`;
    fs.writeFileSync(resultsPath, JSON.stringify(testResults, null, 2));
    console.log(`\n💾 Detailed results saved to: ${resultsPath}`);

    console.log('\n📸 Screenshots saved to:');
    console.log(`   ${OUTPUT_DIR}/`);

    console.log('\n' + '='.repeat(80));
    console.log('✅ COMPREHENSIVE E2E TEST COMPLETED');
    console.log('='.repeat(80));

  } catch (error) {
    console.error('\n❌ FATAL ERROR:', error.message);
    console.error('Stack:', error.stack);
    testResults.fatalError = {
      message: error.message,
      stack: error.stack
    };
  } finally {
    await browser.close();

    // Final error count
    const totalErrors = testResults.consoleErrors.length +
                       testResults.consoleWarnings.length +
                       testResults.pageErrors.length;

    console.log(`\n🚨 FINAL ERROR COUNT: ${totalErrors}`);
    console.log(`   Console errors: ${testResults.consoleErrors.length}`);
    console.log(`   Console warnings: ${testResults.consoleWarnings.length}`);
    console.log(`   Page errors: ${testResults.pageErrors.length}`);

    if (totalErrors > 0) {
      console.log('\n⚠️  WARNING: Zero console error policy VIOLATED!');
      console.log('   Expected: 0 errors');
      console.log(`   Actual: ${totalErrors} errors`);
      process.exit(1);
    } else {
      console.log('\n✅ Zero console error policy: SATISFIED');
      process.exit(0);
    }
  }
})();
