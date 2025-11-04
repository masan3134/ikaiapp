const puppeteer = require('puppeteer');
const fs = require('fs');

const pages = [
  '/dashboard',
  '/notifications',
  '/help',
  '/settings/overview',
  '/settings/profile',
  '/settings/security',
  '/settings/notifications'
];

async function testUserRole() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  const results = [];
  const errors = [];
  const errorMessages = [];

  // Console error tracking
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
      errorMessages.push({
        text: msg.text(),
        location: msg.location()
      });
    }
  });

  // Login
  await page.goto('http://localhost:8103/login');
  await page.type('input[type="email"]', 'test-user@test-org-1.com');
  await page.type('input[type="password"]', 'TestPass123!');
  await page.click('button[type="submit"]');
  await page.waitForNavigation({ timeout: 15000 });

  // Test each page
  for (const pagePath of pages) {
    console.log(`Testing: ${pagePath}`);

    await page.goto(`http://localhost:8103${pagePath}`, {
      waitUntil: 'networkidle2',
      timeout: 30000
    });

    await new Promise(r => setTimeout(r, 2000));

    // Screenshot
    await page.screenshot({
      path: `test-outputs/w1-user${pagePath.replace(/\//g, '-')}.png`,
      fullPage: true
    });

    // Count elements
    const buttons = await page.$$('button');
    const inputs = await page.$$('input');
    const forms = await page.$$('form');

    results.push({
      path: pagePath,
      buttons: buttons.length,
      inputs: inputs.length,
      forms: forms.length,
      errors: errors.length
    });

    console.log(`  Buttons: ${buttons.length}, Inputs: ${inputs.length}, Errors: ${errors.length}`);
  }

  await browser.close();

  // Save results
  fs.writeFileSync('test-outputs/w1-user-results.json', JSON.stringify(results, null, 2));
  fs.writeFileSync('test-outputs/w1-user-errors.json', JSON.stringify(errorMessages, null, 2));

  console.log(`\n✅ W1 (USER) Test Complete!`);
  console.log(`Pages tested: ${results.length}`);
  console.log(`Total errors: ${errors.length}`);

  // Print unique errors
  console.log(`\n🔍 Console Errors:`);
  const uniqueErrors = [...new Set(errors)];
  uniqueErrors.forEach((err, i) => {
    console.log(`${i+1}. ${err.substring(0, 100)}...`);
  });
}

testUserRole().catch(console.error);
