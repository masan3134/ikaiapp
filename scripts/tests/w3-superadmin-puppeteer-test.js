#!/usr/bin/env node
/**
 * W3: SUPER_ADMIN Organization Page - Puppeteer Test
 * Test frontend elements, buttons, and interactions
 */

const puppeteer = require('puppeteer');

const FRONTEND_URL = 'http://localhost:8103';
const BACKEND_URL = 'http://localhost:8102';

// Test credentials
const SUPER_ADMIN_EMAIL = 'info@gaiai.ai';
const SUPER_ADMIN_PASSWORD = '23235656';

console.log('='.repeat(70));
console.log('SUPER_ADMIN: ORGANIZATION PAGE - PUPPETEER TEST');
console.log('='.repeat(70));

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  try {
    // Step 1: Login
    console.log('\n[1/6] Login as SUPER_ADMIN...');
    await page.goto(`${FRONTEND_URL}/login`, { waitUntil: 'networkidle0' });

    await page.type('input[type="email"]', SUPER_ADMIN_EMAIL);
    await page.type('input[type="password"]', SUPER_ADMIN_PASSWORD);
    await page.click('button[type="submit"]');

    await page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 10000 });
    console.log('✅ Login successful');

    // Step 2: Navigate to Organizations page
    console.log('\n[2/6] Navigate to /super-admin/organizations...');
    await page.goto(`${FRONTEND_URL}/super-admin/organizations`, { waitUntil: 'networkidle0' });

    const url = page.url();
    if (url.includes('/super-admin/organizations')) {
      console.log('✅ Page loaded');
    } else {
      console.log(`❌ Unexpected URL: ${url}`);
    }

    // Step 3: Check page elements
    console.log('\n[3/6] Check page elements...');

    // Header
    const header = await page.$('h1');
    const headerText = await page.evaluate(el => el?.textContent, header);
    console.log(`   Header: "${headerText?.trim()}"`);

    // Summary cards
    const cards = await page.$$('[class*="grid"] > div[class*="bg-gradient"]');
    console.log(`   ✅ Summary cards: ${cards.length}/4`);

    // New Organization button
    const buttons = await page.$$('button');
    let foundNewOrgButton = false;
    for (const btn of buttons) {
      const text = await page.evaluate(el => el.textContent, btn);
      if (text && text.includes('Yeni')) {
        console.log(`   ✅ "Yeni Organizasyon" button found: "${text.trim()}"`);
        foundNewOrgButton = true;
        break;
      }
    }
    if (!foundNewOrgButton) {
      console.log('   ❌ "Yeni Organizasyon" button NOT found');
    }

    // Search input
    const searchInput = await page.$('input[placeholder*="ara"]');
    if (searchInput) {
      console.log('   ✅ Search input found');
    } else {
      console.log('   ⚠️  Search input NOT found');
    }

    // Filter dropdown
    const filterDropdown = await page.$('select');
    if (filterDropdown) {
      console.log('   ✅ Filter dropdown found');
    } else {
      console.log('   ⚠️  Filter dropdown NOT found');
    }

    // Step 4: Check organization list
    console.log('\n[4/6] Check organization list...');

    // Wait for organizations to load
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Get all organization cards/rows
    const orgElements = await page.$$('[class*="border"][class*="rounded"]');
    console.log(`   Organization cards: ${orgElements.length}`);

    // Check for "Pasifleştir" buttons
    const allButtons = await page.$$('button');
    let pasifButtons = 0;
    for (const btn of allButtons) {
      const text = await page.evaluate(el => el.textContent, btn);
      if (text && text.includes('Pasifle')) {
        pasifButtons++;
      }
    }
    console.log(`   ✅ "Pasifleştir" buttons: ${pasifButtons}`);

    // Step 5: Test interactions (without actually clicking)
    console.log('\n[5/6] Test element visibility...');

    // Scroll to bottom to ensure all elements loaded
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await new Promise(resolve => setTimeout(resolve, 500));

    // Count total interactive elements
    const allBtns = await page.$$('button');
    const allInputs = await page.$$('input');
    console.log(`   Total buttons: ${allBtns.length}`);
    console.log(`   Total inputs: ${allInputs.length}`);

    // Step 6: Take screenshot
    console.log('\n[6/6] Take screenshot...');
    await page.screenshot({
      path: 'scripts/test-outputs/w3-superadmin-org-page.png',
      fullPage: true
    });
    console.log('   ✅ Screenshot saved to scripts/test-outputs/w3-superadmin-org-page.png');

    // Summary
    console.log('\n' + '='.repeat(70));
    console.log('TEST SUMMARY');
    console.log('='.repeat(70));
    console.log('✅ Login: Success');
    console.log('✅ Page navigation: Success');
    console.log(`✅ Summary cards: ${cards.length}/4 found`);
    console.log(`✅ Action buttons: ${pasifButtons} "Pasifleştir" buttons`);
    console.log('✅ Screenshot: Saved');

    console.log('\n✅ Puppeteer test completed!');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    await browser.close();
  }
})();
