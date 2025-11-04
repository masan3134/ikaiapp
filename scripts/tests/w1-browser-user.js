#!/usr/bin/env node
/**
 * W1: USER Role - Browser Test (Puppeteer)
 * Tests all 7 USER pages in real browser
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const FRONTEND_URL = 'http://localhost:8103';
const TEST_USER = 'test-user@test-org-1.com';
const TEST_PASS = 'TestPass123!';

const PAGES = [
  { name: 'Dashboard', path: '/dashboard' },
  { name: 'Notifications', path: '/notifications' },
  { name: 'Help', path: '/help' },
  { name: 'Settings Overview', path: '/settings/overview' },
  { name: 'Settings Profile', path: '/settings/profile' },
  { name: 'Settings Security', path: '/settings/security' },
  { name: 'Settings Notifications', path: '/settings/notifications' },
];

const OUTPUT_DIR = 'test-outputs';

class Colors {
  static GREEN = '\x1b[92m';
  static RED = '\x1b[91m';
  static BLUE = '\x1b[94m';
  static YELLOW = '\x1b[93m';
  static RESET = '\x1b[0m';
  static BOLD = '\x1b[1m';
}

function printHeader(text) {
  console.log(`\n${Colors.BOLD}${Colors.BLUE}${'='.repeat(60)}${Colors.RESET}`);
  console.log(`${Colors.BOLD}${Colors.BLUE}${text.padStart((60 + text.length) / 2).padEnd(60)}${Colors.RESET}`);
  console.log(`${Colors.BOLD}${Colors.BLUE}${'='.repeat(60)}${Colors.RESET}\n`);
}

function printTest(name, passed, details = '') {
  const status = passed
    ? `${Colors.GREEN}✅ PASS${Colors.RESET}`
    : `${Colors.RED}❌ FAIL${Colors.RESET}`;
  console.log(`${status} ${name}`);
  if (details) {
    console.log(`     ${details}`);
  }
}

async function login(page) {
  printHeader('🔐 LOGIN');

  await page.goto(`${FRONTEND_URL}/login`, { waitUntil: 'networkidle2', timeout: 30000 });

  // Wait for page to be fully loaded
  await page.waitForSelector('input[type="email"]', { timeout: 10000 });

  // Fill login form
  await page.type('input[type="email"]', TEST_USER);
  await page.type('input[type="password"]', TEST_PASS);

  // Click login button
  await page.click('button[type="submit"]');

  // Wait for navigation
  await page.waitForNavigation({ timeout: 30000 });

  const currentUrl = page.url();
  const success = !currentUrl.includes('/login');

  printTest('Login', success, `URL: ${currentUrl}`);

  return success;
}

async function testPage(page, pageInfo, consoleErrors) {
  const { name, path: pagePath } = pageInfo;

  console.log(`\n📄 Testing: ${name}`);

  try {
    // Navigate to page
    await page.goto(`${FRONTEND_URL}${pagePath}`, {
      waitUntil: 'networkidle2',
      timeout: 30000,
    });

    // Wait for content to load
    await new Promise((r) => setTimeout(r, 2000));

    // Take screenshot
    const screenshotPath = `${OUTPUT_DIR}/w1-browser-${name.toLowerCase().replace(/\s+/g, '-')}.png`;
    await page.screenshot({
      path: screenshotPath,
      fullPage: true,
    });

    // Count elements
    const buttons = await page.$$('button');
    const inputs = await page.$$('input');
    const forms = await page.$$('form');
    const links = await page.$$('a');

    // Check for loading indicators (should be gone)
    const loadingElements = await page.$$('[data-loading="true"]');
    const hasLoading = loadingElements.length > 0;

    // Get page title
    const title = await page.title();

    printTest(name, true, `Buttons: ${buttons.length}, Inputs: ${inputs.length}, Forms: ${forms.length}, Links: ${links.length}`);

    return {
      name,
      path: pagePath,
      success: true,
      buttons: buttons.length,
      inputs: inputs.length,
      forms: forms.length,
      links: links.length,
      hasLoading,
      title,
      screenshot: screenshotPath,
    };
  } catch (error) {
    printTest(name, false, error.message);
    return {
      name,
      path: pagePath,
      success: false,
      error: error.message,
    };
  }
}

async function main() {
  console.log(`${Colors.BOLD}${Colors.BLUE}`);
  console.log('╔' + '═'.repeat(58) + '╗');
  console.log('║' + 'W1: USER BROWSER TEST (Puppeteer)'.padStart(45).padEnd(58) + '║');
  console.log('║' + `Date: ${new Date().toLocaleString()}`.padStart(42).padEnd(58) + '║');
  console.log('╚' + '═'.repeat(58) + '╝');
  console.log(Colors.RESET);

  // Create output directory
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR);
  }

  // Launch browser
  console.log('\n🚀 Launching browser...');
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();

  // Track console errors
  const consoleErrors = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      consoleErrors.push({
        text: msg.text(),
        location: msg.location(),
      });
    }
  });

  try {
    // Login
    const loginSuccess = await login(page);
    if (!loginSuccess) {
      console.error(`${Colors.RED}❌ Login failed. Exiting.${Colors.RESET}`);
      await browser.close();
      return 1;
    }

    // Test all pages
    printHeader('📱 PAGE TESTS');

    const results = [];
    for (const pageInfo of PAGES) {
      const result = await testPage(page, pageInfo, consoleErrors);
      results.push(result);
    }

    // Save results
    const resultsPath = `${OUTPUT_DIR}/w1-browser-results.json`;
    fs.writeFileSync(resultsPath, JSON.stringify(results, null, 2));

    // Console errors analysis
    printHeader('🐛 CONSOLE ERRORS');

    if (consoleErrors.length === 0) {
      console.log(`${Colors.GREEN}✅ No console errors detected!${Colors.RESET}`);
    } else {
      const uniqueErrors = [...new Set(consoleErrors.map((e) => e.text))];
      console.log(`${Colors.YELLOW}⚠️  ${consoleErrors.length} console errors (${uniqueErrors.length} unique)${Colors.RESET}\n`);

      uniqueErrors.slice(0, 5).forEach((err, i) => {
        console.log(`${i + 1}. ${err.substring(0, 100)}${err.length > 100 ? '...' : ''}`);
      });

      if (uniqueErrors.length > 5) {
        console.log(`\n... and ${uniqueErrors.length - 5} more errors`);
      }
    }

    // Final summary
    printHeader('📊 SUMMARY');

    const successCount = results.filter((r) => r.success).length;
    const totalPages = results.length;
    const totalButtons = results.reduce((sum, r) => sum + (r.buttons || 0), 0);
    const totalInputs = results.reduce((sum, r) => sum + (r.inputs || 0), 0);
    const totalForms = results.reduce((sum, r) => sum + (r.forms || 0), 0);

    console.log(`Pages tested:      ${successCount}/${totalPages}`);
    console.log(`Screenshots:       ${successCount}/${totalPages}`);
    console.log(`Total buttons:     ${totalButtons}`);
    console.log(`Total inputs:      ${totalInputs}`);
    console.log(`Total forms:       ${totalForms}`);
    console.log(`Console errors:    ${consoleErrors.length}`);

    console.log(`\nResults saved:     ${resultsPath}`);
    console.log(`Screenshots:       ${OUTPUT_DIR}/w1-browser-*.png`);

    console.log(`\n${Colors.BOLD}${'─'.repeat(60)}${Colors.RESET}`);

    if (successCount === totalPages) {
      console.log(`${Colors.GREEN}${Colors.BOLD}🎉 ALL PAGES LOADED SUCCESSFULLY!${Colors.RESET}\n`);
      await browser.close();
      return 0;
    } else {
      console.log(`${Colors.RED}${Colors.BOLD}⚠️  ${totalPages - successCount} pages failed to load.${Colors.RESET}\n`);
      await browser.close();
      return 1;
    }
  } catch (error) {
    console.error(`${Colors.RED}❌ Test failed: ${error.message}${Colors.RESET}`);
    await browser.close();
    return 1;
  }
}

main()
  .then((code) => process.exit(code))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
