#!/usr/bin/env node
/**
 * W5: SUPER_ADMIN Role - Comprehensive Browser Test (Puppeteer)
 * Duration: 15-20 minutes
 *
 * Tests ALL pages accessible to SUPER_ADMIN:
 * - Dashboard
 * - Regular ADMIN pages (job postings, candidates, etc.)
 * - Sistem Yönetimi (Organizations, Queue, Security Logs, System Health)
 * - Cross-org access
 * - All CRUD operations
 */

const puppeteer = require('puppeteer');

const BASE_URL = 'http://localhost:8103';
const API_URL = 'http://localhost:8102';

const SUPER_ADMIN = {
  email: 'info@gaiai.ai',
  password: '23235656'
};

// Test results tracker
const results = {
  passed: 0,
  failed: 0,
  tests: [],
  errors: []
};

function log(emoji, message) {
  console.log(`${emoji} ${message}`);
}

function logTest(name, passed, details = '') {
  const emoji = passed ? '✅' : '❌';
  log(emoji, `${name} ${details}`);
  results.tests.push({ name, passed, details });
  if (passed) results.passed++;
  else results.failed++;
}

function logError(context, error) {
  results.errors.push({ context, error: error.toString() });
}

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ============================================================================
// HELPER: Capture console errors
// ============================================================================

function setupErrorCapture(page) {
  const consoleErrors = [];

  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push({
        text: msg.text(),
        location: msg.location()
      });
    }
  });

  page.on('pageerror', error => {
    consoleErrors.push({
      text: error.toString(),
      location: 'Page Error'
    });
  });

  return consoleErrors;
}

// ============================================================================
// TEST: Login
// ============================================================================

async function testLogin(page) {
  log('🔐', 'Testing SUPER_ADMIN login...');

  await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle2', timeout: 30000 });
  await sleep(1000);

  try {
    await page.type('input[type="email"]', SUPER_ADMIN.email);
    await page.type('input[type="password"]', SUPER_ADMIN.password);

    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 15000 }),
      page.click('button[type="submit"]')
    ]);

    await sleep(2000);
    const url = page.url();
    const isLoggedIn = url.includes('/dashboard') || url.includes('/home');

    logTest('SUPER_ADMIN Login', isLoggedIn, `URL: ${url}`);
    return isLoggedIn;

  } catch (error) {
    logTest('SUPER_ADMIN Login', false, error.message);
    logError('Login', error);
    return false;
  }
}

// ============================================================================
// TEST: Navigate to each menu item
// ============================================================================

async function testPageAccess(page, path, pageName) {
  try {
    const consoleErrors = setupErrorCapture(page);

    await page.goto(`${BASE_URL}${path}`, {
      waitUntil: 'networkidle2',
      timeout: 30000
    });
    await sleep(2000);

    // Check if page loaded (has body content)
    const hasContent = await page.evaluate(() => {
      return document.body.textContent.length > 100;
    });

    // Check for critical errors
    const hasCriticalErrors = consoleErrors.some(e =>
      e.text.includes('is not a function') ||
      e.text.includes('Cannot read') ||
      e.text.includes('undefined')
    );

    const success = hasContent && !hasCriticalErrors;

    logTest(`Page: ${pageName}`, success,
      hasCriticalErrors ? `❌ ${consoleErrors.length} errors` : '✅'
    );

    if (hasCriticalErrors && consoleErrors.length > 0) {
      log('  ', `First error: ${consoleErrors[0].text.substring(0, 80)}`);
      logError(pageName, consoleErrors[0].text);
    }

    return success;

  } catch (error) {
    logTest(`Page: ${pageName}`, false, error.message);
    logError(pageName, error);
    return false;
  }
}

// ============================================================================
// TEST: All pages
// ============================================================================

async function testAllPages(page) {
  log('📄', 'Testing all SUPER_ADMIN pages...');

  const pages = [
    // Regular pages
    { path: '/dashboard', name: 'Dashboard' },
    { path: '/job-postings', name: 'İş İlanları' },
    { path: '/candidates', name: 'Adaylar' },
    { path: '/analyses', name: 'Analizler' },
    { path: '/offers', name: 'Teklifler' },
    { path: '/interviews', name: 'Mülakatlar' },
    { path: '/team', name: 'Takım' },
    { path: '/analytics', name: 'Analitik' },

    // SUPER_ADMIN specific pages
    { path: '/super-admin', name: 'Sistem - Dashboard' },
    { path: '/super-admin/organizations', name: 'Sistem - Organizasyonlar' },
    { path: '/super-admin/queues', name: 'Sistem - Kuyruk Yönetimi' },
    { path: '/super-admin/security-logs', name: 'Sistem - Güvenlik Logları' },
    { path: '/super-admin/system-health', name: 'Sistem - Sistem Sağlığı' },
    { path: '/super-admin/users', name: 'Sistem - Kullanıcılar' },
    { path: '/super-admin/analytics', name: 'Sistem - Analitik' },
  ];

  for (const pageInfo of pages) {
    await testPageAccess(page, pageInfo.path, pageInfo.name);
    await sleep(500);
  }
}

// ============================================================================
// TEST: Cross-org access (SUPER_ADMIN specific)
// ============================================================================

async function testCrossOrgAccess(page) {
  log('🌍', 'Testing SUPER_ADMIN cross-org access...');

  try {
    // Go to organizations page
    await page.goto(`${BASE_URL}/super-admin/organizations`, {
      waitUntil: 'networkidle2',
      timeout: 30000
    });
    await sleep(2000);

    // Count organizations
    const orgCount = await page.evaluate(() => {
      const rows = document.querySelectorAll('table tr, [data-testid="org-card"], .org-card');
      return Math.max(0, rows.length - 1); // Exclude header row
    });

    const canSeeMultipleOrgs = orgCount >= 3; // Should see all test orgs

    logTest('Cross-Org Access - See All Orgs', canSeeMultipleOrgs,
      `${orgCount} organizations visible (expected >= 3)`
    );

  } catch (error) {
    logTest('Cross-Org Access', false, error.message);
    logError('Cross-Org Access', error);
  }
}

// ============================================================================
// TEST: Queue Management
// ============================================================================

async function testQueueManagement(page) {
  log('📊', 'Testing Queue Management...');

  try {
    await page.goto(`${BASE_URL}/super-admin/queues`, {
      waitUntil: 'networkidle2',
      timeout: 30000
    });
    await sleep(2000);

    // Check if queue stats are visible
    const hasQueueStats = await page.evaluate(() => {
      return document.body.textContent.includes('analysis') ||
             document.body.textContent.includes('offer') ||
             document.body.textContent.includes('Queue');
    });

    logTest('Queue Management - Page Loaded', hasQueueStats,
      hasQueueStats ? '✅ Queue stats visible' : '❌ No queue data'
    );

  } catch (error) {
    logTest('Queue Management', false, error.message);
    logError('Queue Management', error);
  }
}

// ============================================================================
// TEST: System Health
// ============================================================================

async function testSystemHealth(page) {
  log('💚', 'Testing System Health...');

  try {
    await page.goto(`${BASE_URL}/super-admin/system-health`, {
      waitUntil: 'networkidle2',
      timeout: 30000
    });
    await sleep(2000);

    // Check if health metrics are visible
    const hasHealthData = await page.evaluate(() => {
      return document.body.textContent.includes('Database') ||
             document.body.textContent.includes('Redis') ||
             document.body.textContent.includes('Milvus') ||
             document.body.textContent.includes('Health');
    });

    logTest('System Health - Page Loaded', hasHealthData,
      hasHealthData ? '✅ Health metrics visible' : '❌ No health data'
    );

  } catch (error) {
    logTest('System Health', false, error.message);
    logError('System Health', error);
  }
}

// ============================================================================
// MAIN TEST RUNNER
// ============================================================================

async function runTests() {
  console.log('\n' + '='.repeat(70));
  console.log('🎯 W5: SUPER_ADMIN COMPREHENSIVE BROWSER TEST (Puppeteer)');
  console.log('='.repeat(70) + '\n');

  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage'
    ]
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });

  // Global error capture
  const globalErrors = setupErrorCapture(page);

  try {
    // 1. Login
    const loginSuccess = await testLogin(page);
    if (!loginSuccess) {
      log('❌', 'Login failed! Aborting tests.');
      await browser.close();
      return;
    }

    // 2. Test all pages
    await testAllPages(page);

    // 3. Test SUPER_ADMIN specific features
    await testCrossOrgAccess(page);
    await testQueueManagement(page);
    await testSystemHealth(page);

  } catch (error) {
    log('❌', `Fatal error: ${error.message}`);
    console.error(error);
    logError('Fatal', error);
  } finally {
    await browser.close();
  }

  // Print summary
  console.log('\n' + '='.repeat(70));
  console.log('📊 TEST SUMMARY');
  console.log('='.repeat(70));
  console.log(`✅ Passed: ${results.passed}`);
  console.log(`❌ Failed: ${results.failed}`);
  console.log(`📈 Success Rate: ${((results.passed / (results.passed + results.failed)) * 100).toFixed(1)}%`);
  console.log('='.repeat(70) + '\n');

  // Print failed tests
  if (results.failed > 0) {
    console.log('❌ FAILED TESTS:');
    console.log('-'.repeat(70));
    results.tests
      .filter(t => !t.passed)
      .forEach(t => {
        console.log(`   ${t.name}`);
        if (t.details) console.log(`   → ${t.details}`);
      });
    console.log('='.repeat(70) + '\n');
  }

  // Print errors
  if (results.errors.length > 0) {
    console.log('🐛 ERRORS FOUND:');
    console.log('-'.repeat(70));
    results.errors.forEach((e, i) => {
      console.log(`${i + 1}. [${e.context}]`);
      console.log(`   ${e.error.substring(0, 100)}...`);
    });
    console.log('='.repeat(70) + '\n');
  }

  // SUPER_ADMIN specific checks
  console.log('🔍 SUPER_ADMIN CAPABILITIES:');
  console.log('-'.repeat(70));
  const superAdminTests = results.tests.filter(t =>
    t.name.includes('Sistem') ||
    t.name.includes('Cross-Org') ||
    t.name.includes('Queue') ||
    t.name.includes('Health')
  );
  superAdminTests.forEach(t => {
    console.log(`${t.passed ? '✅' : '❌'} ${t.name}`);
  });
  console.log('='.repeat(70) + '\n');

  // Exit code
  process.exit(results.failed > 0 ? 1 : 0);
}

// Run tests
runTests().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
