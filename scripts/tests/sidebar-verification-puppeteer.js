/**
 * SIDEBAR VERIFICATION - PUPPETEER AUTOMATION
 * AsanMod v15.7 - W1-W5 Sidebar Test
 *
 * Tests all 5 roles:
 * - USER (4 items expected)
 * - HR_SPECIALIST (10 items)
 * - MANAGER (12 items)
 * - ADMIN (12 items)
 * - SUPER_ADMIN (13 items)
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:8103';
const SCREENSHOT_DIR = path.join(__dirname, '../../test-outputs/screenshots');

// Ensure screenshot directory exists
if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

// Test accounts
const TEST_ACCOUNTS = [
  {
    role: 'USER',
    email: 'test-user@test-org-1.com',
    password: 'TestPass123!',
    expectedMainItems: 4,
    expectedVisible: ['Dashboard', 'Bildirimler', 'Yardım', 'Ayarlar'],
    expectedHidden: ['İş İlanları', 'Adaylar', 'Takım', 'Analitik', 'Sistem Yönetimi']
  },
  {
    role: 'HR_SPECIALIST',
    email: 'test-hr_specialist@test-org-2.com',
    password: 'TestPass123!',
    expectedMainItems: 10,
    expectedVisible: ['Dashboard', 'İş İlanları', 'Adaylar', 'Analiz Sihirbazı', 'Teklifler', 'Mülakatlar'],
    expectedHidden: ['Takım', 'Analitik', 'Sistem Yönetimi']
  },
  {
    role: 'MANAGER',
    email: 'test-manager@test-org-2.com',
    password: 'TestPass123!',
    expectedMainItems: 12,
    expectedVisible: ['Dashboard', 'İş İlanları', 'Takım', 'Analitik'],
    expectedHidden: ['Sistem Yönetimi']
  },
  {
    role: 'ADMIN',
    email: 'test-admin@test-org-1.com',
    password: 'TestPass123!',
    expectedMainItems: 12,
    expectedVisible: ['Dashboard', 'İş İlanları', 'Takım', 'Analitik'],
    expectedHidden: ['Sistem Yönetimi']
  },
  {
    role: 'SUPER_ADMIN',
    email: 'info@gaiai.ai',
    password: '23235656',
    expectedMainItems: 13,
    expectedVisible: ['Dashboard', 'İş İlanları', 'Takım', 'Analitik', 'Sistem Yönetimi'],
    expectedHidden: []
  }
];

/**
 * Login to IKAI platform
 */
async function login(page, email, password) {
  console.log(`   Login: ${email}`);

  await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle2', timeout: 30000 });

  // Wait for login form
  await page.waitForSelector('input[type="email"], input[name="email"]', { timeout: 10000 });

  // Fill login form
  await page.type('input[type="email"], input[name="email"]', email);
  await page.type('input[type="password"], input[name="password"]', password);

  // Click login button
  await page.click('button[type="submit"]');

  // Wait for redirect to dashboard
  await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 15000 });

  console.log(`   ✅ Logged in successfully`);
}

/**
 * Count sidebar items
 */
async function countSidebarItems(page) {
  // Wait for sidebar to render
  await page.waitForSelector('nav, aside, [class*="sidebar"]', { timeout: 10000 });

  // Try multiple selectors for sidebar items
  const possibleSelectors = [
    'nav a[href^="/"]',
    'aside a[href^="/"]',
    '[class*="sidebar"] a[href^="/"]',
    'nav button',
    'aside button'
  ];

  let items = [];
  for (const selector of possibleSelectors) {
    try {
      items = await page.$$(selector);
      if (items.length > 0) {
        console.log(`   Found ${items.length} items with selector: ${selector}`);
        break;
      }
    } catch (e) {
      // Try next selector
    }
  }

  // Get visible text of sidebar items
  const itemTexts = await page.evaluate(() => {
    const sidebarElements = [
      ...document.querySelectorAll('nav a[href^="/"]'),
      ...document.querySelectorAll('aside a[href^="/"]'),
      ...document.querySelectorAll('[class*="sidebar"] a[href^="/"]'),
      ...document.querySelectorAll('nav button'),
      ...document.querySelectorAll('aside button')
    ];

    return [...new Set(sidebarElements
      .map(el => el.textContent?.trim())
      .filter(text => text && text.length > 0))];
  });

  return {
    count: items.length,
    items: itemTexts
  };
}

/**
 * Check for console errors
 */
async function captureConsoleErrors(page) {
  const errors = [];

  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
  });

  page.on('pageerror', error => {
    errors.push(error.message);
  });

  return errors;
}

/**
 * Test a single role
 */
async function testRole(browser, account) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`Testing: ${account.role}`);
  console.log(`${'='.repeat(60)}`);

  const page = await browser.newPage();

  // Set viewport
  await page.setViewport({ width: 1920, height: 1080 });

  // Capture console errors
  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
  });

  try {
    // Login
    await login(page, account.email, account.password);

    // Wait a bit for sidebar to fully render
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Take screenshot
    const screenshotPath = path.join(SCREENSHOT_DIR, `sidebar-${account.role.toLowerCase()}.png`);
    await page.screenshot({
      path: screenshotPath,
      fullPage: true
    });
    console.log(`   📸 Screenshot: ${screenshotPath}`);

    // Count sidebar items
    const sidebarData = await countSidebarItems(page);
    console.log(`   📊 Sidebar items: ${sidebarData.count}`);
    console.log(`   📋 Items found:`, sidebarData.items.slice(0, 10));

    // Check for errors
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log(`   🐛 Console errors: ${errors.length}`);
    if (errors.length > 0) {
      console.log(`      ${errors.slice(0, 3).join('\n      ')}`);
    }

    await page.close();

    return {
      role: account.role,
      success: true,
      sidebarCount: sidebarData.count,
      sidebarItems: sidebarData.items,
      expectedCount: account.expectedMainItems,
      consoleErrors: errors,
      screenshot: screenshotPath
    };

  } catch (error) {
    console.error(`   ❌ ERROR: ${error.message}`);
    await page.close();

    return {
      role: account.role,
      success: false,
      error: error.message,
      consoleErrors: errors
    };
  }
}

/**
 * Main test function
 */
async function runTests() {
  console.log('🚀 SIDEBAR VERIFICATION - PUPPETEER');
  console.log(`Date: ${new Date().toISOString()}`);
  console.log(`Target: ${BASE_URL}\n`);

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const results = [];

  for (const account of TEST_ACCOUNTS) {
    const result = await testRole(browser, account);
    results.push(result);
  }

  await browser.close();

  // Summary
  console.log(`\n${'='.repeat(60)}`);
  console.log('📊 SUMMARY');
  console.log(`${'='.repeat(60)}\n`);

  results.forEach(result => {
    const status = result.success ? '✅' : '❌';
    console.log(`${status} ${result.role.padEnd(15)} | Items: ${result.sidebarCount || 'N/A'} (expected: ${result.expectedCount || 'N/A'})`);
  });

  // Save results to JSON
  const outputPath = path.join(__dirname, '../../test-outputs/sidebar-verification-results.json');
  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
  console.log(`\n💾 Results saved: ${outputPath}`);

  console.log('\n✅ All tests completed!');

  return results;
}

// Run tests
runTests().catch(error => {
  console.error('❌ FATAL ERROR:', error);
  process.exit(1);
});
