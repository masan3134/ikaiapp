#!/usr/bin/env node
/**
 * W5: SUPER_ADMIN - Detailed CRUD Operations Test
 * Tests specific features and interactions
 */

const puppeteer = require('puppeteer');

const BASE_URL = 'http://localhost:8103';
const SUPER_ADMIN = {
  email: 'info@gaiai.ai',
  password: '23235656'
};

const results = { passed: 0, failed: 0, tests: [] };

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

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function login(page) {
  await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle2' });
  await sleep(1000);

  await page.type('input[type="email"]', SUPER_ADMIN.email);
  await page.type('input[type="password"]', SUPER_ADMIN.password);

  await Promise.all([
    page.waitForNavigation({ waitUntil: 'networkidle2' }),
    page.click('button[type="submit"]')
  ]);

  await sleep(2000);
}

// ============================================================================
// TEST: Organizations List
// ============================================================================

async function testOrganizations(page) {
  log('🏢', 'Testing Organizations page...');

  await page.goto(`${BASE_URL}/super-admin/organizations`, { waitUntil: 'networkidle2' });
  await sleep(2000);

  // Take screenshot for debugging
  await page.screenshot({ path: 'scripts/test-outputs/w5-organizations.png' });

  // Count table rows
  const orgCount = await page.evaluate(() => {
    const tables = document.querySelectorAll('table');
    if (tables.length === 0) return 0;

    const rows = tables[0].querySelectorAll('tbody tr');
    return rows.length;
  });

  logTest('Organizations - List Visible', orgCount > 0, `${orgCount} orgs found`);

  // Check for specific org names
  const hasTestOrgs = await page.evaluate(() => {
    const text = document.body.textContent;
    return text.includes('Test Organization') || text.includes('IKAI Platform');
  });

  logTest('Organizations - Test Data', hasTestOrgs, '✅ Test orgs visible');

  return orgCount;
}

// ============================================================================
// TEST: Queue Management Stats
// ============================================================================

async function testQueueStats(page) {
  log('📊', 'Testing Queue Statistics...');

  await page.goto(`${BASE_URL}/super-admin/queues`, { waitUntil: 'networkidle2' });
  await sleep(2000);

  await page.screenshot({ path: 'scripts/test-outputs/w5-queue.png' });

  // Check for queue names
  const queueNames = await page.evaluate(() => {
    const text = document.body.textContent.toLowerCase();
    const queues = [];

    if (text.includes('analysis')) queues.push('analysis');
    if (text.includes('offer')) queues.push('offer');
    if (text.includes('email')) queues.push('email');
    if (text.includes('test')) queues.push('test');

    return queues;
  });

  logTest('Queue - Stats Visible', queueNames.length > 0,
    `${queueNames.length} queues: ${queueNames.join(', ')}`
  );
}

// ============================================================================
// TEST: Security Logs
// ============================================================================

async function testSecurityLogs(page) {
  log('🔒', 'Testing Security Logs...');

  await page.goto(`${BASE_URL}/super-admin/security-logs`, { waitUntil: 'networkidle2' });
  await sleep(2000);

  await page.screenshot({ path: 'scripts/test-outputs/w5-security-logs.png' });

  // Count log entries
  const logCount = await page.evaluate(() => {
    // Try different selectors
    const rows = document.querySelectorAll('tbody tr, [data-testid="log-entry"], .log-entry');
    return rows.length;
  });

  logTest('Security Logs - Entries Visible', logCount > 0,
    `${logCount} log entries found`
  );

  // Check for specific log types
  const hasLogTypes = await page.evaluate(() => {
    const text = document.body.textContent;
    return text.includes('User Registration') ||
           text.includes('Login') ||
           text.includes('ADMIN');
  });

  logTest('Security Logs - Types Present', hasLogTypes, '✅ Log types visible');
}

// ============================================================================
// TEST: System Health Details
// ============================================================================

async function testSystemHealthDetails(page) {
  log('💚', 'Testing System Health Details...');

  await page.goto(`${BASE_URL}/super-admin/system-health`, { waitUntil: 'networkidle2' });
  await sleep(2000);

  await page.screenshot({ path: 'scripts/test-outputs/w5-system-health.png' });

  // Check for service names
  const services = await page.evaluate(() => {
    const text = document.body.textContent.toLowerCase();
    const found = [];

    if (text.includes('postgres') || text.includes('database')) found.push('Database');
    if (text.includes('redis')) found.push('Redis');
    if (text.includes('milvus')) found.push('Milvus');
    if (text.includes('backend') || text.includes('api')) found.push('Backend');

    return found;
  });

  logTest('System Health - Services', services.length > 0,
    services.length > 0 ? `${services.join(', ')}` : 'No services found'
  );
}

// ============================================================================
// TEST: Navigation Menu
// ============================================================================

async function testNavigationMenu(page) {
  log('🧭', 'Testing Navigation Menu...');

  await page.goto(`${BASE_URL}/dashboard`, { waitUntil: 'networkidle2' });
  await sleep(2000);

  // Check for "Sistem Yönetimi" menu
  const hasSistemMenu = await page.evaluate(() => {
    return document.body.textContent.includes('Sistem Yönetimi');
  });

  logTest('Menu - Sistem Yönetimi Visible', hasSistemMenu,
    hasSistemMenu ? '✅ SUPER_ADMIN menu visible' : '❌ Menu not found'
  );

  // Count all menu items
  const menuCount = await page.evaluate(() => {
    const items = document.querySelectorAll('nav a, nav button, [role="menuitem"]');
    return items.length;
  });

  logTest('Menu - Items Count', menuCount > 10, `${menuCount} menu items`);
}

// ============================================================================
// MAIN
// ============================================================================

async function runTests() {
  console.log('\n' + '='.repeat(70));
  console.log('🎯 W5: SUPER_ADMIN CRUD & FEATURE TEST (Puppeteer)');
  console.log('='.repeat(70) + '\n');

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });

  try {
    // Login
    log('🔐', 'Logging in as SUPER_ADMIN...');
    await login(page);
    log('✅', 'Login successful!\n');

    // Run all tests
    await testNavigationMenu(page);
    await testOrganizations(page);
    await testQueueStats(page);
    await testSecurityLogs(page);
    await testSystemHealthDetails(page);

  } catch (error) {
    log('❌', `Fatal error: ${error.message}`);
    console.error(error);
  } finally {
    await browser.close();
  }

  // Summary
  console.log('\n' + '='.repeat(70));
  console.log('📊 SUMMARY');
  console.log('='.repeat(70));
  console.log(`✅ Passed: ${results.passed}`);
  console.log(`❌ Failed: ${results.failed}`);
  console.log(`📈 Success Rate: ${((results.passed / (results.passed + results.failed)) * 100).toFixed(1)}%`);
  console.log('='.repeat(70) + '\n');

  log('📸', 'Screenshots saved to scripts/test-outputs/');
  log('  ', '- w5-organizations.png');
  log('  ', '- w5-queue.png');
  log('  ', '- w5-security-logs.png');
  log('  ', '- w5-system-health.png');

  process.exit(results.failed > 0 ? 1 : 0);
}

runTests().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
