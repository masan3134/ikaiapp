const puppeteer = require('puppeteer');
const fs = require('fs');

const pages = [
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
  '/settings/overview',
  '/settings/profile',
  '/settings/security',
  '/settings/notifications',
  '/help'
];

async function testHRRole() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  const results = [];
  const errors = [];

  page.on('console', msg => {
    if (msg.type() === 'error') errors.push(msg.text());
  });

  // Login
  await page.goto('http://localhost:8103/login');
  await page.type('input[type="email"]', 'test-hr_specialist@test-org-2.com');
  await page.type('input[type="password"]', 'TestPass123!');
  await page.click('button[type="submit"]');
  await page.waitForNavigation({ timeout: 15000 });

  // Test each page
  for (const pagePath of pages) {
    console.log(`Testing: ${pagePath}`);

    try {
      await page.goto(`http://localhost:8103${pagePath}`, {
        waitUntil: 'networkidle2',
        timeout: 30000
      });

      await new Promise(r => setTimeout(r, 2000));

      // Screenshot
      await page.screenshot({
        path: `test-outputs/w2-hr${pagePath.replace(/\//g, '-')}.png`,
        fullPage: true
      });

      // Count elements
      const buttons = await page.$$('button');
      const inputs = await page.$$('input');
      const forms = await page.$$('form');
      const tables = await page.$$('table');

      results.push({
        path: pagePath,
        loaded: true,
        buttons: buttons.length,
        inputs: inputs.length,
        forms: forms.length,
        tables: tables.length,
        errors: errors.length
      });

      console.log(`  ✅ Loaded - Buttons: ${buttons.length}, Forms: ${forms.length}`);
    } catch (error) {
      console.log(`  ❌ FAILED: ${error.message}`);
      results.push({
        path: pagePath,
        loaded: false,
        error: error.message
      });
    }
  }

  await browser.close();

  // Save
  fs.writeFileSync('test-outputs/w2-hr-results.json', JSON.stringify(results, null, 2));

  console.log(`\n✅ W2 (HR_SPECIALIST) Test Complete!`);
  console.log(`Pages tested: ${results.length}`);
  console.log(`Failed: ${results.filter(r => !r.loaded).length}`);
  console.log(`Total errors: ${errors.length}`);
}

testHRRole().catch(console.error);
