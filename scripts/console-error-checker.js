/**
 * E2E Console Error Checker - W6 Cross-Role Testing
 * Collects console errors from all 5 role dashboards
 *
 * Usage: node scripts/console-error-checker.js
 */

const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const ROLES = [
  {
    name: 'USER',
    email: 'test-user@test-org-1.com',
    password: 'TestPass123!'
  },
  {
    name: 'HR_SPECIALIST',
    email: 'test-hr_specialist@test-org-2.com',
    password: 'TestPass123!'
  },
  {
    name: 'MANAGER',
    email: 'test-manager@test-org-1.com',
    password: 'TestPass123!'
  },
  {
    name: 'ADMIN',
    email: 'test-admin@test-org-2.com',
    password: 'TestPass123!'
  },
  {
    name: 'SUPER_ADMIN',
    email: 'info@gaiai.ai',
    password: '23235656'
  }
];

const BASE_URL = 'http://localhost:8103';

async function checkConsoleErrors(role) {
  console.log(`\n🔍 Checking console errors for ${role.name}...`);

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const consoleMessages = [];
  const consoleErrors = [];
  const consoleWarnings = [];

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });

    // Listen to all console messages
    page.on('console', msg => {
      const type = msg.type();
      const text = msg.text();
      const location = msg.location();

      const logEntry = {
        type: type,
        text: text,
        url: location.url,
        lineNumber: location.lineNumber
      };

      consoleMessages.push(logEntry);

      if (type === 'error') {
        consoleErrors.push(logEntry);
      } else if (type === 'warning') {
        consoleWarnings.push(logEntry);
      }
    });

    // Listen to page errors (uncaught exceptions)
    page.on('pageerror', error => {
      consoleErrors.push({
        type: 'pageerror',
        text: error.message,
        stack: error.stack,
        url: 'page-level-error'
      });
    });

    // Navigate to login
    console.log(`  → Navigating to login page...`);
    await page.goto(`${BASE_URL}/login`, {
      waitUntil: 'networkidle0',
      timeout: 60000
    });

    // Wait for login form
    await page.waitForSelector('input[type="email"], input[name="email"]', { timeout: 10000 });

    // Fill login form
    console.log(`  → Logging in as ${role.email}...`);
    await page.type('input[type="email"], input[name="email"]', role.email);
    await page.type('input[type="password"], input[name="password"]', role.password);

    // Click login and wait for navigation
    console.log(`  → Submitting login form...`);
    await Promise.all([
      page.waitForNavigation({
        waitUntil: 'networkidle0',
        timeout: 60000
      }),
      page.click('button[type="submit"]')
    ]);

    // Wait for dashboard to fully load
    console.log(`  → Waiting for dashboard to load...`);
    await new Promise(resolve => setTimeout(resolve, 5000)); // Extra time for all API calls

    // Summary
    console.log(`  ✅ Check complete`);
    console.log(`     Total messages: ${consoleMessages.length}`);
    console.log(`     Errors: ${consoleErrors.length}`);
    console.log(`     Warnings: ${consoleWarnings.length}`);

    if (consoleErrors.length > 0) {
      console.log(`     ⚠️  Error details:`);
      consoleErrors.forEach((err, idx) => {
        console.log(`       ${idx + 1}. [${err.type}] ${err.text.substring(0, 80)}...`);
      });
    }

    return {
      role: role.name,
      email: role.email,
      success: true,
      stats: {
        totalMessages: consoleMessages.length,
        errors: consoleErrors.length,
        warnings: consoleWarnings.length
      },
      consoleMessages: consoleMessages,
      consoleErrors: consoleErrors,
      consoleWarnings: consoleWarnings
    };
  } catch (error) {
    console.error(`  ❌ Error checking ${role.name}:`, error.message);
    return {
      role: role.name,
      email: role.email,
      success: false,
      error: error.message,
      stats: {
        totalMessages: consoleMessages.length,
        errors: consoleErrors.length,
        warnings: consoleWarnings.length
      },
      consoleMessages: consoleMessages,
      consoleErrors: consoleErrors,
      consoleWarnings: consoleWarnings
    };
  } finally {
    await browser.close();
  }
}

async function main() {
  console.log('🚀 Starting console error collection...');
  console.log('=' .repeat(60));

  const results = [];

  for (const role of ROLES) {
    const result = await checkConsoleErrors(role);
    results.push(result);
  }

  console.log('\n📊 FINAL SUMMARY:');
  console.log('='.repeat(60));

  let totalErrors = 0;
  let totalWarnings = 0;

  results.forEach(r => {
    const status = r.success ? '✅' : '❌';
    console.log(`${status} ${r.role.padEnd(15)} | Errors: ${r.stats.errors.toString().padStart(3)} | Warnings: ${r.stats.warnings.toString().padStart(3)} | Total: ${r.stats.totalMessages.toString().padStart(3)}`);
    totalErrors += r.stats.errors;
    totalWarnings += r.stats.warnings;
  });

  console.log('='.repeat(60));
  console.log(`📌 TOTAL ERRORS: ${totalErrors}`);
  console.log(`📌 TOTAL WARNINGS: ${totalWarnings}`);

  if (totalErrors === 0) {
    console.log('\n🎉 ZERO CONSOLE ERRORS! Platform is clean! ✅');
  } else {
    console.log(`\n⚠️  ${totalErrors} console errors found - MUST BE FIXED!`);
  }

  // Save detailed report
  const reportPath = path.join(__dirname, '..', 'docs', 'reports', 'console-errors-detailed.json');
  fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
  console.log(`\n📄 Detailed report saved: ${reportPath}`);

  console.log('\n🎉 Console error collection complete!');
}

main().catch(console.error);
