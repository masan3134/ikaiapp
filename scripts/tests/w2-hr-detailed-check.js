const puppeteer = require('puppeteer');

async function detailedCheck() {
  const browser = await puppeteer.launch({
    headless: false,  // Visual mode
    slowMo: 100
  });
  const page = await browser.newPage();

  // Collect all console messages
  const consoleMessages = [];
  page.on('console', msg => {
    consoleMessages.push({
      type: msg.type(),
      text: msg.text()
    });
  });

  // Login
  await page.goto('http://localhost:8103/login');
  await page.type('input[type="email"]', 'test-hr_specialist@test-org-2.com');
  await page.type('input[type="password"]', 'TestPass123!');
  await page.click('button[type="submit"]');
  await page.waitForNavigation({ timeout: 15000 });

  // Test 1: /job-postings/new
  console.log('\n=== Testing /job-postings/new ===');
  await page.goto('http://localhost:8103/job-postings/new', {
    waitUntil: 'networkidle2',
    timeout: 30000
  });
  await new Promise(r => setTimeout(r, 3000));

  const html1 = await page.content();
  const buttons1 = await page.$$('button');
  const text1 = await page.evaluate(() => document.body.innerText);

  console.log('Buttons found:', buttons1.length);
  console.log('Page text preview:', text1.substring(0, 200));
  console.log('Has "404"?', text1.includes('404'));
  console.log('Has "not found"?', text1.toLowerCase().includes('not found'));

  // Test 2: /offers
  console.log('\n=== Testing /offers ===');
  await page.goto('http://localhost:8103/offers', {
    waitUntil: 'networkidle2',
    timeout: 30000
  });
  await new Promise(r => setTimeout(r, 3000));

  const buttons2 = await page.$$('button');
  const text2 = await page.evaluate(() => document.body.innerText);
  const links = await page.$$('a');

  console.log('Buttons found:', buttons2.length);
  console.log('Links found:', links.length);
  console.log('Page text preview:', text2.substring(0, 300));
  console.log('Has "Henüz teklif"?', text2.includes('Henüz teklif'));
  console.log('Has "İlk Teklifi"?', text2.includes('İlk Teklifi'));

  // Console errors
  const errors = consoleMessages.filter(m => m.type === 'error');
  console.log('\n=== Console Errors ===');
  console.log('Total errors:', errors.length);
  errors.slice(0, 5).forEach((err, i) => {
    console.log(`${i + 1}. ${err.text}`);
  });

  console.log('\n=== Waiting 30 seconds for manual inspection ===');
  await new Promise(r => setTimeout(r, 30000));

  await browser.close();
}

detailedCheck().catch(console.error);
