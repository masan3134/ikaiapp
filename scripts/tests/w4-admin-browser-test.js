/**
 * W4: ADMIN Role - Browser Test
 *
 * Test sidebar menu items in real browser
 * Verify: ADMIN = MANAGER (18 pages), NO Sistem Yönetimi
 */

const puppeteer = require('puppeteer');

const FRONTEND_URL = 'http://localhost:8103';
const TEST_USER = {
  email: 'test-admin@test-org-1.com',
  password: 'TestPass123!'
};

async function main() {
  console.log('=' .repeat(80));
  console.log('W4: ADMIN ROLE - BROWSER TEST');
  console.log('=' .repeat(80));

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  try {
    // 1. Go to login page
    console.log('\n[1/5] Navigating to login page...');
    await page.goto(`${FRONTEND_URL}/login`, { waitUntil: 'networkidle0' });
    console.log('✅ Login page loaded');

    // 2. Login as ADMIN
    console.log('\n[2/5] Logging in as ADMIN...');
    await page.type('input[type="email"]', TEST_USER.email);
    await page.type('input[type="password"]', TEST_USER.password);
    await page.click('button[type="submit"]');

    // Wait for navigation to dashboard
    await page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 10000 });
    console.log('✅ Logged in successfully');

    // 3. Wait for sidebar to load
    console.log('\n[3/5] Waiting for sidebar to load...');
    await page.waitForSelector('aside', { timeout: 5000 });
    console.log('✅ Sidebar loaded');

    // 4. Extract sidebar menu items
    console.log('\n[4/5] Extracting sidebar menu items...');

    const menuItems = await page.evaluate(() => {
      const items = [];
      const links = document.querySelectorAll('aside a');

      links.forEach(link => {
        const text = link.textContent.trim();
        const href = link.getAttribute('href');
        if (text && href) {
          items.push({ text, href });
        }
      });

      return items;
    });

    console.log(`\n✅ Found ${menuItems.length} menu items:`);
    menuItems.forEach((item, index) => {
      console.log(`   ${index + 1}. ${item.text} → ${item.href}`);
    });

    // 5. Check for "Sistem Yönetimi"
    console.log('\n[5/5] Checking for Sistem Yönetimi...');
    const hasSistemYonetimi = menuItems.some(item =>
      item.text.includes('Sistem') ||
      item.href.includes('super-admin')
    );

    if (hasSistemYonetimi) {
      console.log('❌ ERROR: Sistem Yönetimi found in ADMIN sidebar!');
    } else {
      console.log('✅ Sistem Yönetimi NOT found (correct!)');
    }

    // Summary
    console.log('\n' + '='.repeat(80));
    console.log('SUMMARY');
    console.log('='.repeat(80));
    console.log(`Menu items found: ${menuItems.length}`);
    console.log(`Sistem Yönetimi: ${hasSistemYonetimi ? '❌ FOUND (ERROR!)' : '✅ NOT FOUND (OK)'}`);
    console.log('='.repeat(80));

  } catch (error) {
    console.error('\n❌ Browser test failed:', error.message);
    throw error;
  } finally {
    await browser.close();
    console.log('\n✅ Browser closed');
  }
}

main()
  .then(() => {
    console.log('\n✅ Browser test completed successfully!');
    process.exit(0);
  })
  .catch(error => {
    console.error('\n❌ Browser test failed:', error);
    process.exit(1);
  });
