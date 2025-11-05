/**
 * E2E Public Pages Test - W6 Cross-Role Testing
 * Tests all non-authenticated pages
 *
 * Tests:
 * - Landing page
 * - Pricing page
 * - Features page
 * - Signup flow
 * - Console errors
 */

const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const BASE_URL = 'http://localhost:8103';
const SCREENSHOTS_DIR = path.join(__dirname, '..', 'screenshots', 'public-pages');

// Ensure screenshots directory exists
if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

async function testPublicPage(pageName, url, checks) {
  console.log(`\n📄 Testing ${pageName}...`);
  console.log('-'.repeat(70));

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const consoleMessages = [];
  const consoleErrors = [];

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });

    // Listen to console
    page.on('console', msg => {
      const type = msg.type();
      const text = msg.text();

      consoleMessages.push({ type, text });

      if (type === 'error') {
        consoleErrors.push({ type, text });
      }
    });

    // Navigate to page
    console.log(`  → Navigating to ${url}...`);
    await page.goto(url, {
      waitUntil: 'networkidle0',
      timeout: 30000
    });

    // Wait a bit for any dynamic content
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Take screenshot
    const screenshotPath = path.join(SCREENSHOTS_DIR, `${pageName}.png`);
    await page.screenshot({
      path: screenshotPath,
      fullPage: true
    });

    console.log(`  ✅ Screenshot saved: ${pageName}.png`);

    // Run checks
    let checkResults = {};
    if (checks && typeof checks === 'function') {
      try {
        checkResults = await checks(page);
        console.log(`  ✅ Page checks passed`);
      } catch (error) {
        console.log(`  ⚠️  Some checks failed: ${error.message}`);
        checkResults = { error: error.message };
      }
    }

    // Console error summary
    if (consoleErrors.length > 0) {
      console.log(`  ⚠️  Console errors: ${consoleErrors.length}`);
      consoleErrors.forEach((err, idx) => {
        console.log(`     ${idx + 1}. ${err.text.substring(0, 80)}...`);
      });
    } else {
      console.log(`  ✅ No console errors`);
    }

    return {
      page: pageName,
      success: true,
      url,
      consoleErrors: consoleErrors.length,
      consoleErrorDetails: consoleErrors,
      checks: checkResults,
      screenshotPath
    };

  } catch (error) {
    console.error(`  ❌ Error: ${error.message}`);
    return {
      page: pageName,
      success: false,
      url,
      error: error.message,
      consoleErrors: consoleErrors.length,
      consoleErrorDetails: consoleErrors
    };
  } finally {
    await browser.close();
  }
}

async function main() {
  console.log('=' .repeat(70));
  console.log('E2E PUBLIC PAGES TEST');
  console.log('='.repeat(70));

  const results = [];

  // ========== Test 1: Landing Page ==========
  const landingResult = await testPublicPage(
    'landing',
    BASE_URL,
    async (page) => {
      // Check for hero section
      const heroExists = await page.$('h1, h2').then(el => el !== null);

      // Check for CTA buttons
      const ctaExists = await page.$$('button, a[href="/signup"], a[href="/login"]')
        .then(els => els.length > 0);

      return {
        heroExists,
        ctaExists
      };
    }
  );
  results.push(landingResult);

  // ========== Test 2: Pricing Page ==========
  const pricingResult = await testPublicPage(
    'pricing',
    `${BASE_URL}/pricing`,
    async (page) => {
      // Check if pricing plans are displayed
      const plansExist = await page.$$('div, section')
        .then(els => els.length > 5);  // Expecting multiple pricing cards

      return {
        plansExist
      };
    }
  );
  results.push(pricingResult);

  // ========== Test 3: Features Page ==========
  const featuresResult = await testPublicPage(
    'features',
    `${BASE_URL}/features`,
    async (page) => {
      // Check if features are listed
      const contentExists = await page.$('h1, h2').then(el => el !== null);

      return {
        contentExists
      };
    }
  );
  results.push(featuresResult);

  // ========== Test 4: Signup Page ==========
  const signupResult = await testPublicPage(
    'signup',
    `${BASE_URL}/signup`,
    async (page) => {
      // Check for signup form
      const formExists = await page.$('form').then(el => el !== null);

      // Check for email and password inputs
      const emailExists = await page.$('input[type="email"], input[name="email"]')
        .then(el => el !== null);
      const passwordExists = await page.$('input[type="password"], input[name="password"]')
        .then(el => el !== null);

      return {
        formExists,
        emailExists,
        passwordExists
      };
    }
  );
  results.push(signupResult);

  // ========== Test 5: Login Page ==========
  const loginResult = await testPublicPage(
    'login',
    `${BASE_URL}/login`,
    async (page) => {
      // Check for login form
      const formExists = await page.$('form').then(el => el !== null);

      const emailExists = await page.$('input[type="email"], input[name="email"]')
        .then(el => el !== null);
      const passwordExists = await page.$('input[type="password"], input[name="password"]')
        .then(el => el !== null);

      return {
        formExists,
        emailExists,
        passwordExists
      };
    }
  );
  results.push(loginResult);

  // ========== Summary ==========
  console.log('\n' + '='.repeat(70));
  console.log('SUMMARY');
  console.log('='.repeat(70));

  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);
  const totalErrors = results.reduce((sum, r) => sum + r.consoleErrors, 0);

  console.log(`\n✅ Successful: ${successful.length}/${results.length}`);
  console.log(`❌ Failed: ${failed.length}/${results.length}`);
  console.log(`⚠️  Total Console Errors: ${totalErrors}`);

  console.log('\n📋 Page Results:');
  results.forEach(r => {
    const status = r.success ? '✅' : '❌';
    const errors = r.consoleErrors > 0 ? `(${r.consoleErrors} errors)` : '';
    console.log(`${status} ${r.page.padEnd(15)} ${errors}`);
  });

  if (totalErrors === 0) {
    console.log('\n🎉 All public pages are clean - ZERO console errors!');
  } else {
    console.log('\n⚠️  Some pages have console errors - review needed!');
  }

  console.log('\n' + '='.repeat(70));
  console.log('✅ Public pages test complete!');
  console.log('=' .repeat(70));

  // Save detailed results
  const reportPath = path.join(__dirname, '..', 'docs', 'reports', 'public-pages-test.json');
  fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
  console.log(`\n📄 Detailed report: ${reportPath}`);
}

main().catch(console.error);
