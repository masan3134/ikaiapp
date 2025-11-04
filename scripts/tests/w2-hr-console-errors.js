const puppeteer = require('puppeteer');
const fs = require('fs');

async function captureErrors() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  const allErrors = [];
  const pageErrors = {};

  page.on('console', msg => {
    if (msg.type() === 'error') {
      allErrors.push({
        type: 'console.error',
        text: msg.text(),
        timestamp: new Date().toISOString()
      });
    }
  });

  page.on('pageerror', error => {
    allErrors.push({
      type: 'page.error',
      text: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });
  });

  page.on('requestfailed', request => {
    allErrors.push({
      type: 'request.failed',
      url: request.url(),
      failure: request.failure().errorText,
      timestamp: new Date().toISOString()
    });
  });

  try {
    // Login
    console.log('Logging in...');
    await page.goto('http://localhost:8103/login', { waitUntil: 'networkidle2' });
    await page.type('input[type="email"]', 'test-hr_specialist@test-org-2.com');
    await page.type('input[type="password"]', 'TestPass123!');
    await page.click('button[type="submit"]');
    await page.waitForNavigation({ timeout: 15000 });
    console.log('Login successful!');

    // Test critical pages
    const testPages = [
      '/offers',
      '/job-postings/new'
    ];

    for (const pagePath of testPages) {
      console.log(`\nTesting: ${pagePath}`);
      const startErrors = allErrors.length;

      try {
        await page.goto(`http://localhost:8103${pagePath}`, {
          waitUntil: 'networkidle2',
          timeout: 15000
        });
        await new Promise(r => setTimeout(r, 3000));

        const buttons = await page.$$('button');
        const text = await page.evaluate(() => document.body.innerText);

        pageErrors[pagePath] = {
          success: true,
          buttons: buttons.length,
          newErrors: allErrors.slice(startErrors),
          hasText: {
            '404': text.includes('404'),
            'not found': text.toLowerCase().includes('not found'),
            'teklif': text.toLowerCase().includes('teklif'),
            'yükleniyor': text.toLowerCase().includes('yükleniyor')
          },
          textPreview: text.substring(0, 300)
        };

        console.log(`  ✅ Loaded - Buttons: ${buttons.length}`);
        console.log(`  Errors on this page: ${allErrors.slice(startErrors).length}`);
      } catch (error) {
        pageErrors[pagePath] = {
          success: false,
          error: error.message,
          newErrors: allErrors.slice(startErrors)
        };
        console.log(`  ❌ FAILED: ${error.message}`);
      }
    }

  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    await browser.close();
  }

  // Save results
  const report = {
    timestamp: new Date().toISOString(),
    totalErrors: allErrors.length,
    uniqueErrors: [...new Set(allErrors.map(e => e.text))],
    pageErrors,
    allErrors: allErrors.slice(0, 20)  // First 20 errors
  };

  fs.writeFileSync('test-outputs/w2-console-errors.json', JSON.stringify(report, null, 2));

  console.log('\n=== SUMMARY ===');
  console.log('Total errors:', allErrors.length);
  console.log('Unique errors:', report.uniqueErrors.length);
  console.log('\nTop 5 errors:');
  report.uniqueErrors.slice(0, 5).forEach((err, i) => {
    console.log(`${i + 1}. ${err}`);
  });
}

captureErrors().catch(console.error);
