#!/usr/bin/env node
/**
 * SUPER_ADMIN: Complete Page Scan with Puppeteer
 * Login → Test all SUPER_ADMIN pages → Report missing pages
 */

const puppeteer = require('puppeteer');
const fs = require('fs');

const FRONTEND_URL = 'http://localhost:8103';
const SUPER_ADMIN_EMAIL = 'info@gaiai.ai';
const SUPER_ADMIN_PASSWORD = '23235656';

// All expected SUPER_ADMIN pages
const SUPER_ADMIN_PAGES = [
  '/super-admin',
  '/super-admin/organizations',
  '/super-admin/users',
  '/super-admin/security',
  '/super-admin/analytics',
  '/super-admin/logs',
  '/super-admin/system',
  '/super-admin/milvus',
  '/super-admin/settings'
];

console.log('='.repeat(80));
console.log('SUPER_ADMIN: COMPLETE PAGE SCAN (PUPPETEER)');
console.log('='.repeat(80));

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  // Capture console logs and errors
  const consoleMessages = [];
  const networkErrors = [];

  page.on('console', msg => {
    const type = msg.type();
    const text = msg.text();
    if (type === 'error' || type === 'warning') {
      consoleMessages.push({ type, text, url: page.url() });
    }
  });

  page.on('response', response => {
    if (response.status() >= 400) {
      networkErrors.push({
        url: response.url(),
        status: response.status(),
        page: page.url()
      });
    }
  });

  const results = [];

  try {
    // Step 1: Login
    console.log('\n[1/3] Login as SUPER_ADMIN...');
    await page.goto(`${FRONTEND_URL}/login`, { waitUntil: 'networkidle0', timeout: 15000 });

    await page.type('input[type="email"]', SUPER_ADMIN_EMAIL);
    await page.type('input[type="password"]', SUPER_ADMIN_PASSWORD);
    await page.click('button[type="submit"]');

    await page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 15000 });
    const afterLoginUrl = page.url();
    console.log(`✅ Login successful → ${afterLoginUrl}`);

    // Step 2: Test all pages
    console.log('\n[2/3] Testing all SUPER_ADMIN pages...\n');

    for (const pagePath of SUPER_ADMIN_PAGES) {
      console.log(`Testing: ${pagePath}`);

      const pageResult = {
        path: pagePath,
        url: `${FRONTEND_URL}${pagePath}`,
        status: 'UNKNOWN',
        httpStatus: null,
        finalUrl: null,
        hasContent: false,
        pageTitle: null,
        consoleErrors: [],
        networkErrors: []
      };

      try {
        // Clear previous errors
        consoleMessages.length = 0;
        networkErrors.length = 0;

        const response = await page.goto(`${FRONTEND_URL}${pagePath}`, {
          waitUntil: 'networkidle0',
          timeout: 10000
        });

        pageResult.httpStatus = response.status();
        pageResult.finalUrl = page.url();

        // Check if redirected to 404 or login
        if (pageResult.finalUrl.includes('/login')) {
          pageResult.status = '❌ REDIRECTED_TO_LOGIN';
          console.log(`  ❌ REDIRECTED TO LOGIN`);
        } else if (pageResult.finalUrl.includes('/404') || pageResult.httpStatus === 404) {
          pageResult.status = '❌ 404_NOT_FOUND';
          console.log(`  ❌ 404 NOT FOUND`);
        } else if (pageResult.httpStatus === 200) {
          // Check for content
          const bodyText = await page.evaluate(() => document.body.innerText);
          pageResult.hasContent = bodyText.length > 100;
          pageResult.pageTitle = await page.title();

          if (bodyText.includes('404') || bodyText.includes('Not Found')) {
            pageResult.status = '❌ 404_PAGE';
            console.log(`  ❌ 404 PAGE (soft)`);
          } else {
            pageResult.status = '✅ OK';
            console.log(`  ✅ OK (${pageResult.pageTitle})`);
          }
        } else {
          pageResult.status = `❌ HTTP_${pageResult.httpStatus}`;
          console.log(`  ❌ HTTP ${pageResult.httpStatus}`);
        }

        // Capture errors
        pageResult.consoleErrors = [...consoleMessages];
        pageResult.networkErrors = [...networkErrors];

        // Take screenshot for 404/missing pages
        if (pageResult.status.includes('404') || pageResult.status.includes('REDIRECTED')) {
          const screenshotPath = `scripts/test-outputs/missing-page-${pagePath.replace(/\//g, '-')}.png`;
          await page.screenshot({ path: screenshotPath, fullPage: true });
          pageResult.screenshot = screenshotPath;
          console.log(`  📸 Screenshot saved: ${screenshotPath}`);
        }

      } catch (error) {
        pageResult.status = '❌ ERROR';
        pageResult.error = error.message;
        console.log(`  ❌ ERROR: ${error.message}`);
      }

      results.push(pageResult);

      // Small delay between pages
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    // Step 3: Generate report
    console.log('\n[3/3] Generating report...\n');

    const okPages = results.filter(r => r.status === '✅ OK');
    const missingPages = results.filter(r => r.status.includes('404') || r.status.includes('REDIRECTED'));
    const errorPages = results.filter(r => r.status === '❌ ERROR');

    // Console summary
    console.log('='.repeat(80));
    console.log('SCAN RESULTS SUMMARY');
    console.log('='.repeat(80));
    console.log(`Total pages tested: ${SUPER_ADMIN_PAGES.length}`);
    console.log(`✅ Working pages: ${okPages.length}`);
    console.log(`❌ Missing pages: ${missingPages.length}`);
    console.log(`⚠️  Error pages: ${errorPages.length}`);

    console.log('\n--- WORKING PAGES ---');
    okPages.forEach(p => console.log(`✅ ${p.path} → ${p.pageTitle}`));

    console.log('\n--- MISSING PAGES ---');
    missingPages.forEach(p => console.log(`❌ ${p.path} (${p.status})`));

    if (errorPages.length > 0) {
      console.log('\n--- ERROR PAGES ---');
      errorPages.forEach(p => console.log(`⚠️  ${p.path} → ${p.error}`));
    }

    // Save detailed JSON report
    const reportPath = 'scripts/test-outputs/superadmin-pages-scan-report.json';
    fs.writeFileSync(reportPath, JSON.stringify({
      timestamp: new Date().toISOString(),
      summary: {
        total: SUPER_ADMIN_PAGES.length,
        ok: okPages.length,
        missing: missingPages.length,
        errors: errorPages.length
      },
      results
    }, null, 2));

    console.log(`\n📄 Detailed JSON report: ${reportPath}`);

    // Save markdown report
    const mdReport = `# SUPER_ADMIN Page Scan Report

**Date:** ${new Date().toISOString()}

## Summary

- **Total pages:** ${SUPER_ADMIN_PAGES.length}
- **✅ Working:** ${okPages.length}
- **❌ Missing:** ${missingPages.length}
- **⚠️ Errors:** ${errorPages.length}

## Working Pages

${okPages.map(p => `- ✅ [${p.path}](${p.url}) - ${p.pageTitle}`).join('\n')}

## Missing Pages (Need Implementation)

${missingPages.map(p => `- ❌ **${p.path}** - ${p.status}`).join('\n')}

${errorPages.length > 0 ? `## Error Pages

${errorPages.map(p => `- ⚠️ ${p.path} - ${p.error}`).join('\n')}` : ''}

## Next Steps

${missingPages.length > 0 ? `
### Create Missing Pages

${missingPages.map((p, i) => `
#### ${i + 1}. ${p.path}

\`\`\`bash
# Create page file
touch frontend/app${p.path}/page.tsx

# Implement SUPER_ADMIN dashboard page
# Use withRoleProtection(['SUPER_ADMIN'])
\`\`\`
`).join('\n')}
` : '✅ All pages exist!'}

---

*Generated by: superadmin-all-pages-scan.js*
`;

    const mdReportPath = 'scripts/test-outputs/superadmin-pages-scan-report.md';
    fs.writeFileSync(mdReportPath, mdReport);
    console.log(`📄 Markdown report: ${mdReportPath}`);

    console.log('\n✅ Scan completed successfully!');

  } catch (error) {
    console.error('\n❌ Fatal error:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    await browser.close();
  }
})();
