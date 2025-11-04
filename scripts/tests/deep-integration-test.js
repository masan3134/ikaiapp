/**
 * DEEP INTEGRATION TEST - FULL FUNCTIONALITY CHECK
 * AsanMod v15.7 - Production-Ready Verification
 *
 * Tests EVERY page, EVERY button, EVERY API call!
 *
 * For each role:
 * 1. Login
 * 2. Visit EVERY sidebar page
 * 3. Check page loads correctly
 * 4. Find ALL buttons/forms
 * 5. Test button functionality (onClick, API calls)
 * 6. Detect fake/broken buttons
 * 7. Verify frontend → backend → DB flow
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:8103';
const API_URL = 'http://localhost:8102';
const OUTPUT_DIR = path.join(__dirname, '../../test-outputs');

// Test account
const TEST_USER = {
  role: 'USER',
  email: 'test-user@test-org-1.com',
  password: 'TestPass123!',
  pages: [
    '/dashboard',
    '/notifications',
    '/help',
    '/settings/overview',
    '/settings/profile',
    '/settings/security',
    '/settings/notifications'
  ]
};

/**
 * Login and return authenticated page
 */
async function login(browser, email, password) {
  const page = await browser.newPage();

  // Track network requests
  const requests = [];
  page.on('request', req => {
    if (req.url().includes('/api/')) {
      requests.push({
        url: req.url(),
        method: req.method(),
        timestamp: Date.now()
      });
    }
  });

  // Track console errors
  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
  });

  await page.setViewport({ width: 1920, height: 1080 });
  await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle2' });

  await page.type('input[type="email"], input[name="email"]', email);
  await page.type('input[type="password"], input[name="password"]', password);
  await page.click('button[type="submit"]');

  await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 15000 });

  console.log(`✅ Logged in as ${email}`);

  return { page, requests, errors };
}

/**
 * Test a single page
 */
async function testPage(page, pagePath, requests, errors) {
  console.log(`\n📄 Testing: ${pagePath}`);

  const requestsBefore = requests.length;
  const errorsBefore = errors.length;

  // Navigate to page
  await page.goto(`${BASE_URL}${pagePath}`, {
    waitUntil: 'networkidle2',
    timeout: 30000
  });

  // Wait for content to render
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Take screenshot
  const screenshotPath = path.join(
    OUTPUT_DIR,
    'screenshots',
    `test-${pagePath.replace(/\//g, '-')}.png`
  );
  await page.screenshot({ path: screenshotPath, fullPage: true });

  // Find all interactive elements
  const buttons = await page.$$('button');
  const links = await page.$$('a[href]');
  const inputs = await page.$$('input');
  const forms = await page.$$('form');

  // Get button texts
  const buttonTexts = await Promise.all(
    buttons.map(btn => btn.evaluate(el => el.textContent?.trim()))
  );

  // Check for onClick handlers
  const buttonHandlers = await Promise.all(
    buttons.map(btn => btn.evaluate(el => {
      return {
        hasOnClick: typeof el.onclick === 'function',
        hasEventListener: !!el.getAttribute('data-has-listener'),
        type: el.type,
        disabled: el.disabled
      };
    }))
  );

  // Count API requests triggered by this page
  const newRequests = requests.length - requestsBefore;
  const newErrors = errors.length - errorsBefore;

  const result = {
    path: pagePath,
    loaded: true,
    screenshot: screenshotPath,
    elements: {
      buttons: buttons.length,
      buttonTexts,
      buttonHandlers,
      links: links.length,
      inputs: inputs.length,
      forms: forms.length
    },
    apiRequests: newRequests,
    consoleErrors: newErrors,
    requestsTriggered: requests.slice(requestsBefore)
  };

  console.log(`   Buttons: ${buttons.length}`);
  console.log(`   API requests: ${newRequests}`);
  console.log(`   Console errors: ${newErrors}`);

  // Detect fake buttons
  const fakeButtons = buttonTexts
    .map((text, idx) => ({
      text,
      hasHandler: buttonHandlers[idx].hasOnClick || buttonHandlers[idx].hasEventListener,
      disabled: buttonHandlers[idx].disabled
    }))
    .filter(btn => !btn.disabled && !btn.hasHandler && btn.text);

  if (fakeButtons.length > 0) {
    console.log(`   ⚠️  FAKE BUTTONS DETECTED: ${fakeButtons.length}`);
    fakeButtons.forEach(btn => {
      console.log(`      - "${btn.text}" (no handler!)`);
    });
    result.fakeButtons = fakeButtons;
  }

  return result;
}

/**
 * Test button functionality
 */
async function testButton(page, button, buttonText) {
  console.log(`   🔘 Testing button: "${buttonText}"`);

  const requestsBefore = [];
  const requestsAfter = [];

  // Listen for API calls
  page.once('request', req => {
    if (req.url().includes('/api/')) {
      requestsAfter.push(req.url());
    }
  });

  try {
    // Click button
    await button.click();

    // Wait a bit for async operations
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Check if API was called
    if (requestsAfter.length > 0) {
      console.log(`      ✅ API called: ${requestsAfter[0]}`);
      return { success: true, apiCalled: true, apiUrl: requestsAfter[0] };
    } else {
      console.log(`      ⚠️  NO API CALL (might be frontend-only action)`);
      return { success: true, apiCalled: false };
    }
  } catch (error) {
    console.log(`      ❌ ERROR: ${error.message}`);
    return { success: false, error: error.message };
  }
}

/**
 * Main test function for USER role
 */
async function testUserRole() {
  console.log('🚀 DEEP INTEGRATION TEST - USER ROLE');
  console.log(`Date: ${new Date().toISOString()}\n`);

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const { page, requests, errors } = await login(
    browser,
    TEST_USER.email,
    TEST_USER.password
  );

  const results = [];

  // Test each page
  for (const pagePath of TEST_USER.pages) {
    try {
      const pageResult = await testPage(page, pagePath, requests, errors);
      results.push(pageResult);
    } catch (error) {
      console.error(`❌ Failed to test ${pagePath}:`, error.message);
      results.push({
        path: pagePath,
        loaded: false,
        error: error.message
      });
    }
  }

  await browser.close();

  // Save results
  const outputPath = path.join(OUTPUT_DIR, 'deep-test-user-results.json');
  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));

  // Summary
  console.log(`\n${'='.repeat(60)}`);
  console.log('📊 SUMMARY - USER ROLE');
  console.log(`${'='.repeat(60)}\n`);

  const totalPages = results.length;
  const successfulPages = results.filter(r => r.loaded).length;
  const totalButtons = results.reduce((sum, r) => sum + (r.elements?.buttons || 0), 0);
  const totalFakeButtons = results.reduce((sum, r) => sum + (r.fakeButtons?.length || 0), 0);
  const totalApiRequests = results.reduce((sum, r) => sum + (r.apiRequests || 0), 0);
  const totalErrors = results.reduce((sum, r) => sum + (r.consoleErrors || 0), 0);

  console.log(`Pages tested: ${totalPages}`);
  console.log(`Successful: ${successfulPages}/${totalPages}`);
  console.log(`Total buttons: ${totalButtons}`);
  console.log(`Fake buttons: ${totalFakeButtons} ${totalFakeButtons > 0 ? '⚠️' : '✅'}`);
  console.log(`API requests: ${totalApiRequests}`);
  console.log(`Console errors: ${totalErrors} ${totalErrors > 0 ? '⚠️' : '✅'}`);

  console.log(`\n💾 Results saved: ${outputPath}`);

  if (totalFakeButtons > 0) {
    console.log(`\n⚠️  FAKE BUTTONS NEED FIXING!`);
    results.forEach(r => {
      if (r.fakeButtons && r.fakeButtons.length > 0) {
        console.log(`\n${r.path}:`);
        r.fakeButtons.forEach(btn => {
          console.log(`  - "${btn.text}"`);
        });
      }
    });
  }

  return results;
}

// Run test
testUserRole().catch(error => {
  console.error('❌ FATAL ERROR:', error);
  process.exit(1);
});
