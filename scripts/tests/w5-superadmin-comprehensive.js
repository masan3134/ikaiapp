/**
 * W5: SUPER_ADMIN Comprehensive Deep Test
 * Tests ALL 22+ pages
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const PAGES = [
  // Main pages
  '/dashboard',
  '/notifications',

  // HR features
  '/job-postings',
  '/job-postings/new',
  '/candidates',
  '/wizard',
  '/analyses',
  '/offers',
  '/offers/wizard',
  '/offers/templates',
  '/interviews',

  // Manager features
  '/team',
  '/analytics',
  '/offers/analytics',

  // Super Admin features
  '/super-admin/organizations',
  '/super-admin/queues',
  '/super-admin/security-logs',
  '/super-admin/system-health',

  // Settings
  '/settings/overview',
  '/settings/profile',
  '/settings/security',
  '/settings/notifications',
  '/settings/organization',
  '/settings/billing',

  // Help
  '/help'
];

async function comprehensiveTest() {
  console.log('🚀 W5: SUPER_ADMIN COMPREHENSIVE TEST');
  console.log(`Pages to test: ${PAGES.length}\n`);

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });

  const results = [];
  const allErrors = [];

  // Console error tracking
  page.on('console', msg => {
    if (msg.type() === 'error') {
      allErrors.push({
        type: 'console',
        text: msg.text(),
        timestamp: Date.now()
      });
    }
  });

  page.on('pageerror', error => {
    allErrors.push({
      type: 'page',
      text: error.message,
      timestamp: Date.now()
    });
  });

  // Login
  console.log('Logging in as SUPER_ADMIN...');
  await page.goto('http://localhost:8103/login');
  await page.type('input[type="email"]', 'info@gaiai.ai');
  await page.type('input[type="password"]', '23235656');
  await page.click('button[type="submit"]');
  await page.waitForNavigation({ timeout: 15000 });
  console.log('✅ Logged in\n');

  // Test each page
  for (let i = 0; i < PAGES.length; i++) {
    const pagePath = PAGES[i];
    console.log(`[${i + 1}/${PAGES.length}] Testing: ${pagePath}`);

    const errorsBefore = allErrors.length;

    try {
      await page.goto(`http://localhost:8103${pagePath}`, {
        waitUntil: 'networkidle2',
        timeout: 30000
      });

      await new Promise(r => setTimeout(r, 2000));

      // Screenshot
      const screenshotPath = path.join(
        __dirname,
        '../../test-outputs/screenshots',
        `w5-sa${pagePath.replace(/\//g, '-')}.png`
      );
      await page.screenshot({ path: screenshotPath, fullPage: true });

      // Count elements
      const buttons = await page.$$('button');
      const inputs = await page.$$('input');
      const forms = await page.$$('form');
      const links = await page.$$('a[href]');
      const tables = await page.$$('table');

      // Get button texts
      const buttonTexts = await Promise.all(
        buttons.slice(0, 20).map(btn =>
          btn.evaluate(el => el.textContent?.trim() || '')
        )
      );

      // Check for specific indicators
      const hasHeading = await page.$('h1, h2');
      const hasCards = await page.$$('[class*="card"], [class*="Card"]');
      const hasCharts = await page.$$('canvas, svg[class*="chart"]');

      const errorsNow = allErrors.length - errorsBefore;

      results.push({
        path: pagePath,
        loaded: true,
        screenshot: screenshotPath,
        elements: {
          buttons: buttons.length,
          buttonTexts: buttonTexts.filter(t => t),
          inputs: inputs.length,
          forms: forms.length,
          links: links.length,
          tables: tables.length,
          cards: hasCards.length,
          charts: hasCharts.length,
          hasHeading: !!hasHeading
        },
        newErrors: errorsNow
      });

      console.log(`  ✅ Loaded | Buttons: ${buttons.length}, Forms: ${forms.length}, Errors: ${errorsNow}`);

    } catch (error) {
      console.log(`  ❌ FAILED: ${error.message}`);
      results.push({
        path: pagePath,
        loaded: false,
        error: error.message,
        newErrors: allErrors.length - errorsBefore
      });
    }
  }

  await browser.close();

  // Save results
  const outputPath = path.join(__dirname, '../../test-outputs/w5-comprehensive-results.json');
  fs.writeFileSync(outputPath, JSON.stringify({
    timestamp: new Date().toISOString(),
    totalPages: PAGES.length,
    results,
    allErrors
  }, null, 2));

  // Summary
  console.log(`\n${'='.repeat(60)}`);
  console.log('📊 SUMMARY');
  console.log(`${'='.repeat(60)}\n`);

  const successful = results.filter(r => r.loaded).length;
  const failed = results.filter(r => !r.loaded).length;
  const totalErrors = allErrors.length;

  console.log(`Pages tested: ${PAGES.length}`);
  console.log(`Successful: ${successful}/${PAGES.length}`);
  console.log(`Failed: ${failed}`);
  console.log(`Console errors: ${totalErrors}`);
  console.log(`\n💾 Results: ${outputPath}`);

  if (failed > 0) {
    console.log(`\n❌ FAILED PAGES:`);
    results.filter(r => !r.loaded).forEach(r => {
      console.log(`  - ${r.path}: ${r.error}`);
    });
  }

  if (totalErrors > 0) {
    console.log(`\n⚠️  CONSOLE ERRORS: ${totalErrors} total`);
    console.log('Check JSON for details');
  }

  console.log(`\n✅ W5 COMPREHENSIVE TEST COMPLETE!`);
}

comprehensiveTest().catch(error => {
  console.error('FATAL ERROR:', error);
  process.exit(1);
});
