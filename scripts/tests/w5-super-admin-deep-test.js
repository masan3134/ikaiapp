const puppeteer = require('puppeteer');
const fs = require('fs');

// All 22 pages for SUPER_ADMIN
const pages = [
  // Common pages (18)
  '/dashboard',
  '/notifications',
  '/job-postings',
  '/job-postings/new',
  '/candidates',
  '/wizard',
  '/analyses',
  '/offers',
  '/offers/wizard',
  '/interviews',
  '/team',
  '/analytics',
  '/offers/analytics',
  '/settings/overview',
  '/settings/profile',
  '/settings/security',
  '/settings/notifications',
  '/settings/organization',
  '/settings/billing',
  '/help',
  // SUPER_ADMIN specific pages (4)
  '/super-admin',
  '/super-admin/organizations',
  '/super-admin/queues',
  '/super-admin/security-logs',
  '/super-admin/system-health'
];

async function testSuperAdminRole() {
  console.log('='.repeat(80));
  console.log('🎯 W5: SUPER_ADMIN DEEP INTEGRATION TEST');
  console.log('='.repeat(80));
  console.log(`Testing ${pages.length} pages for SUPER_ADMIN role`);
  console.log('');

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();

  const results = [];
  const errors = [];
  const consoleErrors = [];

  // Capture console errors
  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(`[${msg.location().url}] ${msg.text()}`);
    }
  });

  // Capture page errors
  page.on('pageerror', error => {
    errors.push(`Page error: ${error.message}`);
  });

  try {
    // Step 1: Login
    console.log('📋 Step 1: Login as SUPER_ADMIN');
    console.log('-'.repeat(80));
    await page.goto('http://localhost:8103/login', { waitUntil: 'networkidle2', timeout: 30000 });

    // Wait for and fill email
    await page.waitForSelector('input[type="email"]', { timeout: 5000 });
    await page.type('input[type="email"]', 'info@gaiai.ai');
    await page.type('input[type="password"]', '23235656');

    // Click submit and wait for navigation
    await Promise.all([
      page.click('button[type="submit"]'),
      page.waitForNavigation({ timeout: 15000 })
    ]);

    console.log('✅ Login successful');
    console.log('   Email: info@gaiai.ai');
    console.log('   Role: SUPER_ADMIN');
    console.log('');

    // Step 2: Test each page
    console.log('📋 Step 2: Test All Pages');
    console.log('-'.repeat(80));

    for (let i = 0; i < pages.length; i++) {
      const pagePath = pages[i];
      const pageNum = i + 1;

      console.log(`[${pageNum}/${pages.length}] Testing: ${pagePath}`);

      try {
        const startTime = Date.now();

        await page.goto(`http://localhost:8103${pagePath}`, {
          waitUntil: 'networkidle2',
          timeout: 30000
        });

        // Wait for content to render
        await new Promise(r => setTimeout(r, 2000));

        const loadTime = Date.now() - startTime;

        // Check page title
        const title = await page.title();

        // Check for error messages
        const errorText = await page.evaluate(() => {
          const errorEl = document.querySelector('[class*="error"]') ||
                          document.querySelector('[class*="Error"]') ||
                          document.querySelector('h1, h2, h3');
          return errorEl ? errorEl.textContent : null;
        });

        // Check if redirected (e.g., access denied)
        const currentUrl = page.url();
        const wasRedirected = !currentUrl.includes(pagePath);

        const result = {
          page: pagePath,
          status: wasRedirected ? 'REDIRECTED' : 'OK',
          loadTime: `${loadTime}ms`,
          title: title,
          url: currentUrl,
          error: wasRedirected ? `Redirected to ${currentUrl}` : null
        };

        results.push(result);

        if (wasRedirected) {
          console.log(`   ⚠️  REDIRECTED to ${currentUrl}`);
        } else {
          console.log(`   ✅ OK (${loadTime}ms) - ${title}`);
        }

      } catch (error) {
        console.log(`   ❌ FAILED: ${error.message}`);
        results.push({
          page: pagePath,
          status: 'FAILED',
          error: error.message
        });
        errors.push(`${pagePath}: ${error.message}`);
      }
    }

    console.log('');

    // Step 3: Summary
    console.log('='.repeat(80));
    console.log('📊 TEST SUMMARY');
    console.log('='.repeat(80));
    console.log('');

    const okPages = results.filter(r => r.status === 'OK').length;
    const redirectedPages = results.filter(r => r.status === 'REDIRECTED').length;
    const failedPages = results.filter(r => r.status === 'FAILED').length;

    console.log(`Total Pages: ${pages.length}`);
    console.log(`✅ OK: ${okPages}`);
    console.log(`⚠️  REDIRECTED: ${redirectedPages}`);
    console.log(`❌ FAILED: ${failedPages}`);
    console.log('');

    if (redirectedPages > 0) {
      console.log('⚠️  REDIRECTED PAGES:');
      results.filter(r => r.status === 'REDIRECTED').forEach(r => {
        console.log(`   - ${r.page} → ${r.url}`);
      });
      console.log('');
    }

    if (failedPages > 0) {
      console.log('❌ FAILED PAGES:');
      results.filter(r => r.status === 'FAILED').forEach(r => {
        console.log(`   - ${r.page}: ${r.error}`);
      });
      console.log('');
    }

    if (consoleErrors.length > 0) {
      console.log(`⚠️  Console Errors Found: ${consoleErrors.length}`);
      console.log('   (First 10 shown)');
      consoleErrors.slice(0, 10).forEach(err => {
        console.log(`   - ${err}`);
      });
      console.log('');
    }

    // Step 4: SUPER_ADMIN Specific Checks
    console.log('='.repeat(80));
    console.log('🔐 SUPER_ADMIN SPECIFIC CHECKS');
    console.log('='.repeat(80));
    console.log('');

    // Check Organizations page
    console.log('📋 Organizations Page:');
    await page.goto('http://localhost:8103/super-admin/organizations', { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 2000));

    const orgPageContent = await page.evaluate(() => {
      // Check for organization list elements
      const hasTable = document.querySelector('table') !== null;
      const hasCards = document.querySelectorAll('[class*="card"]').length > 0;
      const hasOrgs = document.querySelectorAll('[class*="organization"]').length > 0;

      return {
        hasTable,
        hasCards,
        hasOrgs,
        text: document.body.innerText.substring(0, 200)
      };
    });

    if (orgPageContent.hasTable || orgPageContent.hasCards || orgPageContent.hasOrgs) {
      console.log('   ✅ Organization elements found');
    } else {
      console.log('   ⚠️  No organization elements detected');
      console.log(`   Preview: ${orgPageContent.text}`);
    }
    console.log('');

    // Check Queues page
    console.log('📋 Queues Page:');
    await page.goto('http://localhost:8103/super-admin/queues', { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 2000));

    const queuesPageContent = await page.evaluate(() => {
      const text = document.body.innerText;
      const hasAnalysis = text.includes('analysis') || text.includes('Analysis');
      const hasOffer = text.includes('offer') || text.includes('Offer');
      const hasEmail = text.includes('email') || text.includes('Email');

      return {
        hasAnalysis,
        hasOffer,
        hasEmail,
        text: text.substring(0, 200)
      };
    });

    if (queuesPageContent.hasAnalysis && queuesPageContent.hasOffer) {
      console.log('   ✅ Queue information found');
    } else {
      console.log('   ⚠️  Queue information not detected');
      console.log(`   Preview: ${queuesPageContent.text}`);
    }
    console.log('');

    // Final result
    console.log('='.repeat(80));
    if (failedPages === 0 && redirectedPages === 0) {
      console.log('🎉 ALL TESTS PASSED!');
      console.log(`   ${okPages}/${pages.length} pages accessible`);
      console.log('   No redirects, no failures');
    } else if (failedPages === 0) {
      console.log('✅ TESTS PASSED (with warnings)');
      console.log(`   ${okPages}/${pages.length} pages OK`);
      console.log(`   ${redirectedPages} pages redirected (check RBAC)`);
    } else {
      console.log('❌ TESTS FAILED');
      console.log(`   ${failedPages} pages failed to load`);
    }
    console.log('='.repeat(80));
    console.log('');

    // Save detailed results to file
    const reportData = {
      date: new Date().toISOString(),
      role: 'SUPER_ADMIN',
      totalPages: pages.length,
      okPages,
      redirectedPages,
      failedPages,
      consoleErrorCount: consoleErrors.length,
      results,
      consoleErrors: consoleErrors.slice(0, 20), // Save first 20 errors
      errors
    };

    fs.writeFileSync(
      '/home/asan/Desktop/ikai/scripts/test-outputs/w5-results.json',
      JSON.stringify(reportData, null, 2)
    );

    console.log('📄 Detailed results saved to: scripts/test-outputs/w5-results.json');
    console.log('');

  } catch (error) {
    console.log('');
    console.log('❌ CRITICAL ERROR:');
    console.log(error.message);
    console.log(error.stack);
  } finally {
    await browser.close();
  }
}

// Run the test
testSuperAdminRole().catch(console.error);
