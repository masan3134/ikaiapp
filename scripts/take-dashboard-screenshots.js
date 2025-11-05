/**
 * E2E Screenshot Tool - W6 Cross-Role Testing
 * Takes full-page screenshots of all 5 role dashboards
 *
 * Usage: node scripts/take-dashboard-screenshots.js
 */

const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const ROLES = [
  {
    name: 'USER',
    email: 'test-user@test-org-1.com',
    password: 'TestPass123!',
    filename: 'dashboard-user.png'
  },
  {
    name: 'HR_SPECIALIST',
    email: 'test-hr_specialist@test-org-2.com',
    password: 'TestPass123!',
    filename: 'dashboard-hr.png'
  },
  {
    name: 'MANAGER',
    email: 'test-manager@test-org-1.com',
    password: 'TestPass123!',
    filename: 'dashboard-manager.png'
  },
  {
    name: 'ADMIN',
    email: 'test-admin@test-org-2.com',
    password: 'TestPass123!',
    filename: 'dashboard-admin.png'
  },
  {
    name: 'SUPER_ADMIN',
    email: 'info@gaiai.ai',
    password: '23235656',
    filename: 'dashboard-superadmin.png'
  }
];

const BASE_URL = 'http://localhost:8103';
const SCREENSHOTS_DIR = path.join(__dirname, '..', 'screenshots');

// Ensure screenshots directory exists
if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

async function takeScreenshot(role) {
  console.log(`\n📸 Taking screenshot for ${role.name}...`);

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });

    // Navigate to login
    console.log(`  → Navigating to login page...`);
    await page.goto(`${BASE_URL}/login`, {
      waitUntil: 'networkidle0',
      timeout: 60000
    });

    // Wait for login form to be visible
    await page.waitForSelector('input[type="email"], input[name="email"]', { timeout: 10000 });

    // Fill login form
    console.log(`  → Logging in as ${role.email}...`);
    await page.type('input[type="email"], input[name="email"]', role.email);
    await page.type('input[type="password"], input[name="password"]', role.password);

    // Click login button and wait for navigation
    console.log(`  → Submitting login form...`);
    await Promise.all([
      page.waitForNavigation({
        waitUntil: 'networkidle0',
        timeout: 60000
      }),
      page.click('button[type="submit"]')
    ]);

    // Wait for dashboard to load (using setTimeout wrapped in Promise)
    console.log(`  → Waiting for dashboard to load...`);
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Take full-page screenshot
    const screenshotPath = path.join(SCREENSHOTS_DIR, role.filename);
    console.log(`  → Taking full-page screenshot...`);
    await page.screenshot({
      path: screenshotPath,
      fullPage: true
    });

    console.log(`  ✅ Screenshot saved: ${role.filename}`);

    return {
      role: role.name,
      success: true,
      path: screenshotPath
    };
  } catch (error) {
    console.error(`  ❌ Error taking screenshot for ${role.name}:`, error.message);
    return {
      role: role.name,
      success: false,
      error: error.message
    };
  } finally {
    await browser.close();
  }
}

async function main() {
  console.log('🚀 Starting dashboard screenshot collection...');
  console.log(`📁 Screenshots will be saved to: ${SCREENSHOTS_DIR}`);

  const results = [];

  for (const role of ROLES) {
    const result = await takeScreenshot(role);
    results.push(result);
  }

  console.log('\n📊 SUMMARY:');
  console.log('='.repeat(50));

  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);

  console.log(`✅ Successful: ${successful.length}/${ROLES.length}`);
  if (failed.length > 0) {
    console.log(`❌ Failed: ${failed.length}/${ROLES.length}`);
    failed.forEach(f => {
      console.log(`  - ${f.role}: ${f.error}`);
    });
  }

  console.log('\n🎉 Screenshot collection complete!');
}

main().catch(console.error);
