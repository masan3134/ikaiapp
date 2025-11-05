#!/usr/bin/env node
/**
 * SUPER_ADMIN: Console Error Scanner (Detailed)
 * Capture FULL console error messages with stack traces
 */

const puppeteer = require('puppeteer');
const fs = require('fs');

const FRONTEND_URL = 'http://localhost:8103';
const SUPER_ADMIN_EMAIL = 'info@gaiai.ai';
const SUPER_ADMIN_PASSWORD = '23235656';

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
console.log('SUPER_ADMIN: DETAILED CONSOLE ERROR SCANNER');
console.log('='.repeat(80));

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  const allErrors = {};

  // Capture ALL console messages
  page.on('console', async msg => {
    const type = msg.type();
    const location = msg.location();

    if (type === 'error' || type === 'warning') {
      const args = msg.args();
      const textParts = [];

      for (const arg of args) {
        try {
          const jsonValue = await arg.jsonValue();
          textParts.push(JSON.stringify(jsonValue, null, 2));
        } catch (e) {
          textParts.push(arg.toString());
        }
      }

      const currentPage = page.url();
      if (!allErrors[currentPage]) {
        allErrors[currentPage] = [];
      }

      allErrors[currentPage].push({
        type,
        message: textParts.join(' '),
        location: location.url ? `${location.url}:${location.lineNumber}` : 'unknown',
        timestamp: new Date().toISOString()
      });
    }
  });

  // Capture page errors
  page.on('pageerror', error => {
    const currentPage = page.url();
    if (!allErrors[currentPage]) {
      allErrors[currentPage] = [];
    }
    allErrors[currentPage].push({
      type: 'pageerror',
      message: error.toString(),
      stack: error.stack,
      timestamp: new Date().toISOString()
    });
  });

  try {
    // Login
    console.log('\n[1/2] Login as SUPER_ADMIN...');
    await page.goto(`${FRONTEND_URL}/login`, { waitUntil: 'networkidle0', timeout: 15000 });
    await page.type('input[type="email"]', SUPER_ADMIN_EMAIL);
    await page.type('input[type="password"]', SUPER_ADMIN_PASSWORD);
    await page.click('button[type="submit"]');
    await page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 15000 });
    console.log('✅ Login successful');

    // Scan all pages
    console.log('\n[2/2] Scanning pages for console errors...\n');

    for (const pagePath of SUPER_ADMIN_PAGES) {
      console.log(`Scanning: ${pagePath}`);

      // Clear previous page errors
      const currentUrl = `${FRONTEND_URL}${pagePath}`;
      allErrors[currentUrl] = [];

      await page.goto(currentUrl, { waitUntil: 'networkidle0', timeout: 10000 });

      // Wait for errors to appear
      await new Promise(resolve => setTimeout(resolve, 2000));

      const errorCount = allErrors[currentUrl]?.length || 0;
      console.log(`  → ${errorCount} errors/warnings captured`);
    }

    // Generate report
    console.log('\n' + '='.repeat(80));
    console.log('DETAILED ERROR REPORT');
    console.log('='.repeat(80));

    let totalErrors = 0;
    let totalWarnings = 0;

    Object.keys(allErrors).forEach(url => {
      const errors = allErrors[url];
      if (errors.length > 0) {
        const pageErrors = errors.filter(e => e.type === 'error' || e.type === 'pageerror');
        const pageWarnings = errors.filter(e => e.type === 'warning');

        totalErrors += pageErrors.length;
        totalWarnings += pageWarnings.length;

        console.log(`\n📄 ${url}`);
        console.log(`   Errors: ${pageErrors.length} | Warnings: ${pageWarnings.length}`);

        // Show first 3 errors
        errors.slice(0, 3).forEach((err, i) => {
          console.log(`\n   [${i+1}] ${err.type.toUpperCase()}`);
          console.log(`       ${err.message.substring(0, 150)}`);
          if (err.location !== 'unknown') {
            console.log(`       @ ${err.location}`);
          }
        });

        if (errors.length > 3) {
          console.log(`\n   ... +${errors.length - 3} more (see JSON report)`);
        }
      }
    });

    console.log('\n' + '='.repeat(80));
    console.log(`Total Errors: ${totalErrors}`);
    console.log(`Total Warnings: ${totalWarnings}`);
    console.log('='.repeat(80));

    // Save JSON report
    const jsonPath = 'scripts/test-outputs/superadmin-console-errors-detailed.json';
    fs.writeFileSync(jsonPath, JSON.stringify(allErrors, null, 2));
    console.log(`\n📄 Detailed JSON report: ${jsonPath}`);

    // Save summary MD
    const mdReport = `# SUPER_ADMIN Console Errors - Detailed Report

**Date:** ${new Date().toISOString()}

## Summary

- **Total Errors:** ${totalErrors}
- **Total Warnings:** ${totalWarnings}
- **Pages Scanned:** ${SUPER_ADMIN_PAGES.length}

## Errors by Page

${Object.keys(allErrors).map(url => {
  const errors = allErrors[url];
  if (errors.length === 0) return `### ${url}\n\n✅ No errors`;

  const pageErrors = errors.filter(e => e.type === 'error' || e.type === 'pageerror');
  const pageWarnings = errors.filter(e => e.type === 'warning');

  return `### ${url}

**Errors:** ${pageErrors.length} | **Warnings:** ${pageWarnings.length}

${errors.slice(0, 5).map((err, i) => `
#### ${i+1}. [${err.type.toUpperCase()}]

\`\`\`
${err.message}
\`\`\`

${err.location !== 'unknown' ? `**Location:** \`${err.location}\`` : ''}
`).join('\n')}

${errors.length > 5 ? `\n*... +${errors.length - 5} more errors (see JSON report)*` : ''}
`;
}).join('\n\n')}

---

*Generated by: superadmin-console-errors-scan.js*
`;

    const mdPath = 'scripts/test-outputs/superadmin-console-errors-detailed.md';
    fs.writeFileSync(mdPath, mdReport);
    console.log(`📄 Markdown report: ${mdPath}`);

    console.log('\n✅ Error scan completed!');

  } catch (error) {
    console.error('\n❌ Fatal error:', error.message);
    console.error(error.stack);
  } finally {
    await browser.close();
  }
})();
