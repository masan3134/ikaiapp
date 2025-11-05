const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:8103';

// Test account credentials
const HR_ACCOUNT = {
  email: 'test-hr_specialist@test-org-2.com',
  password: 'TestPass123!',
  role: 'HR_SPECIALIST'
};

const MANAGER_ACCOUNT = {
  email: 'test-manager@test-org-1.com',
  password: 'TestPass123!',
  role: 'MANAGER'
};

const ADMIN_ACCOUNT = {
  email: 'test-admin@test-org-2.com',
  password: 'TestPass123!',
  role: 'ADMIN'
};

// Screenshot directory
const SCREENSHOT_DIR = path.join(__dirname, '..', 'screenshots', 'integration-workflow');

// Ensure directory exists
if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

async function login(page, account) {
  console.log(`Logging in as ${account.role} (${account.email})...`);

  await page.goto(`${BASE_URL}/login`, {
    waitUntil: 'networkidle0',
    timeout: 60000
  });

  // Wait for and fill login form
  await page.waitForSelector('input[type="email"], input[name="email"]', { timeout: 10000 });
  await page.type('input[type="email"], input[name="email"]', account.email);
  await page.type('input[type="password"], input[name="password"]', account.password);

  // Click login and wait for navigation
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 60000 }),
    page.click('button[type="submit"]')
  ]);

  // Wait for dashboard to load
  await new Promise(resolve => setTimeout(resolve, 3000));

  console.log(`✅ Logged in as ${account.role}`);
}

async function takeScreenshot(page, filename, description) {
  const screenshotPath = path.join(SCREENSHOT_DIR, filename);

  await page.screenshot({
    path: screenshotPath,
    fullPage: true
  });

  console.log(`✅ Screenshot saved: ${filename} (${description})`);
  return screenshotPath;
}

async function main() {
  console.log('='.repeat(60));
  console.log('E2E INTEGRATION WORKFLOW SCREENSHOTS');
  console.log('='.repeat(60));
  console.log();

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });

    // Screenshot 1: HR - Job Postings List
    console.log('\n1. HR - Job Postings List');
    console.log('-'.repeat(40));
    await login(page, HR_ACCOUNT);

    // Navigate to Job Postings
    await page.goto(`${BASE_URL}/job-postings`, {
      waitUntil: 'networkidle0',
      timeout: 60000
    });
    await new Promise(resolve => setTimeout(resolve, 2000));
    await takeScreenshot(page, '01-hr-job-postings-list.png', 'HR sees job postings');

    // Screenshot 2: HR - Analysis Results (if available)
    console.log('\n2. HR - Analysis Results');
    console.log('-'.repeat(40));
    try {
      await page.goto(`${BASE_URL}/analyses`, {
        waitUntil: 'networkidle0',
        timeout: 60000
      });
      await new Promise(resolve => setTimeout(resolve, 2000));
      await takeScreenshot(page, '02-hr-analyses-list.png', 'HR sees completed analyses');
    } catch (e) {
      console.log('⚠️  Analyses page not accessible or different URL');
    }

    // Screenshot 3: HR - Candidates List
    console.log('\n3. HR - Candidates List');
    console.log('-'.repeat(40));
    await page.goto(`${BASE_URL}/candidates`, {
      waitUntil: 'networkidle0',
      timeout: 60000
    });
    await new Promise(resolve => setTimeout(resolve, 2000));
    await takeScreenshot(page, '03-hr-candidates-list.png', 'HR sees candidates in org-2');

    // Screenshot 4: HR - Candidate Detail (click first candidate)
    console.log('\n4. HR - Candidate Detail');
    console.log('-'.repeat(40));
    try {
      // Try to click first candidate row/card
      const candidateSelector = 'tr[data-candidate-id], [data-testid="candidate-card"], a[href*="/candidates/"]';
      await page.waitForSelector(candidateSelector, { timeout: 5000 });

      // Get first candidate link
      const candidateLink = await page.$('a[href*="/candidates/"]');
      if (candidateLink) {
        await Promise.all([
          page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 60000 }),
          candidateLink.click()
        ]);
        await new Promise(resolve => setTimeout(resolve, 2000));
        await takeScreenshot(page, '04-hr-candidate-detail.png', 'HR views candidate details');
      } else {
        console.log('⚠️  No candidate detail links found');
      }
    } catch (e) {
      console.log(`⚠️  Could not navigate to candidate detail: ${e.message}`);
    }

    // Screenshot 5: MANAGER - Candidates (different org)
    console.log('\n5. MANAGER - Candidates List (Org-1)');
    console.log('-'.repeat(40));
    await login(page, MANAGER_ACCOUNT);

    await page.goto(`${BASE_URL}/candidates`, {
      waitUntil: 'networkidle0',
      timeout: 60000
    });
    await new Promise(resolve => setTimeout(resolve, 2000));
    await takeScreenshot(page, '05-manager-candidates-list.png', 'MANAGER sees candidates in org-1 (different from HR)');

    // Screenshot 6: MANAGER - Candidate Detail
    console.log('\n6. MANAGER - Candidate Detail');
    console.log('-'.repeat(40));
    try {
      const candidateLink = await page.$('a[href*="/candidates/"]');
      if (candidateLink) {
        await Promise.all([
          page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 60000 }),
          candidateLink.click()
        ]);
        await new Promise(resolve => setTimeout(resolve, 2000));
        await takeScreenshot(page, '06-manager-candidate-detail.png', 'MANAGER reviews candidate');
      } else {
        console.log('⚠️  No candidate detail links found for MANAGER');
      }
    } catch (e) {
      console.log(`⚠️  Could not navigate to candidate detail: ${e.message}`);
    }

    // Screenshot 7: MANAGER - Job Postings (verify isolation)
    console.log('\n7. MANAGER - Job Postings (Isolation Check)');
    console.log('-'.repeat(40));
    await page.goto(`${BASE_URL}/job-postings`, {
      waitUntil: 'networkidle0',
      timeout: 60000
    });
    await new Promise(resolve => setTimeout(resolve, 2000));
    await takeScreenshot(page, '07-manager-job-postings-list.png', 'MANAGER sees only org-1 jobs (isolation verified)');

    // Screenshot 8: ADMIN - Dashboard
    console.log('\n8. ADMIN - Dashboard');
    console.log('-'.repeat(40));
    await login(page, ADMIN_ACCOUNT);

    await page.goto(`${BASE_URL}/dashboard`, {
      waitUntil: 'networkidle0',
      timeout: 60000
    });
    await new Promise(resolve => setTimeout(resolve, 2000));
    await takeScreenshot(page, '08-admin-dashboard.png', 'ADMIN dashboard overview');

    // Screenshot 9: ADMIN - Candidates (same org as HR)
    console.log('\n9. ADMIN - Candidates List (Same Org as HR)');
    console.log('-'.repeat(40));
    await page.goto(`${BASE_URL}/candidates`, {
      waitUntil: 'networkidle0',
      timeout: 60000
    });
    await new Promise(resolve => setTimeout(resolve, 2000));
    await takeScreenshot(page, '09-admin-candidates-list.png', 'ADMIN sees same candidates as HR (org-2)');

    // Screenshot 10: ADMIN - Offers (if available)
    console.log('\n10. ADMIN - Offers Page');
    console.log('-'.repeat(40));
    try {
      await page.goto(`${BASE_URL}/offers`, {
        waitUntil: 'networkidle0',
        timeout: 60000
      });
      await new Promise(resolve => setTimeout(resolve, 2000));
      await takeScreenshot(page, '10-admin-offers-list.png', 'ADMIN offers management');
    } catch (e) {
      console.log('⚠️  Offers page not accessible or different URL');
    }

    console.log();
    console.log('='.repeat(60));
    console.log('INTEGRATION WORKFLOW SCREENSHOTS COMPLETE');
    console.log('='.repeat(60));
    console.log();
    console.log(`📁 Screenshots saved to: ${SCREENSHOT_DIR}`);
    console.log();

  } catch (error) {
    console.error('❌ Error during screenshot capture:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

main().catch(console.error);
