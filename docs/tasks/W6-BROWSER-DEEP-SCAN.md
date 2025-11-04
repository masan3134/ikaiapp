# W6: Browser Deep Scan - FIND ALL REAL ERRORS

**Worker:** W6 (Debugger & Build Master)
**Role:** ALL roles (USER, HR, MANAGER, ADMIN, SUPER_ADMIN)
**Duration:** 120 minutes
**Type:** REAL USER TESTING (Puppeteer browser automation)

---

## 🎯 GOAL

**Find REAL errors that API tests miss:**
- ❌ Console errors
- ❌ Broken buttons
- ❌ Failed API calls (in browser)
- ❌ Loading stuck
- ❌ Form submission errors
- ❌ Navigation issues
- ❌ UI glitches

**Method:** Open EVERY page in browser, click EVERY button, check console

---

## 🔧 TEST METHOD

**Tool:** Puppeteer (headless Chrome)

**Per Page:**
1. Navigate to page
2. Wait for load
3. Capture console errors
4. Take screenshot
5. Click ALL buttons
6. Fill ALL forms
7. Check API calls (Network tab)
8. Verify no stuck loading

---

## 📋 PAGES TO TEST (ALL 50+ pages!)

### USER Role (7 pages)
- /dashboard
- /notifications
- /help
- /settings/overview
- /settings/profile
- /settings/security
- /settings/notifications

### HR_SPECIALIST Role (+9 pages)
- /job-postings
- /job-postings/new
- /job-postings/:id
- /candidates
- /candidates/:id
- /wizard
- /analyses
- /analyses/:id
- /offers

### MANAGER Role (+3 pages)
- /team
- /analytics
- /analytics/reports

### ADMIN Role (+5 pages)
- /settings/organization
- /settings/billing
- /settings/team
- /settings/integrations
- /settings/security

### SUPER_ADMIN Role (+10 pages)
- /super-admin
- /super-admin/organizations
- /super-admin/users
- /super-admin/queues
- /super-admin/security
- /super-admin/analytics
- /super-admin/logs
- /super-admin/system
- /super-admin/milvus
- /super-admin/settings

**TOTAL: ~50 pages**

---

## ✅ TEST CHECKLIST (Per Page)

```javascript
// 1. Navigation
await page.goto(url);
await page.waitForSelector('main'); // Or timeout?

// 2. Console errors
const errors = [];
page.on('console', msg => {
  if (msg.type() === 'error') errors.push(msg.text());
});

// 3. Network failures
const failed_requests = [];
page.on('requestfailed', req => {
  failed_requests.push(req.url());
});

// 4. Click all buttons
const buttons = await page.$$('button');
for (const btn of buttons) {
  try {
    await btn.click();
    await page.waitForTimeout(500);
  } catch (e) {
    // Button click failed
  }
}

// 5. Take screenshot
await page.screenshot({ path: `screenshots/${role}-${page}.png` });

// 6. Check loading states
const spinners = await page.$$('[data-loading="true"]');
// If spinners.length > 0 after 5s → STUCK!

// 7. Verify page content
const isEmpty = await page.$('.empty-state');
const hasError = await page.$('.error-message');
```

---

## 📊 REPORT FORMAT

**File:** `docs/reports/w6-browser-deep-scan.md`

```markdown
# W6: Browser Deep Scan Report

## Summary
- Pages tested: 50
- Console errors: 15
- Broken buttons: 3
- Failed API calls: 8
- Stuck loading: 2
- Total issues: 28

## Critical Issues

### 1. Job Postings List - Console Error
**Page:** /job-postings
**Role:** HR_SPECIALIST
**Error:** `Uncaught TypeError: Cannot read property 'map' of undefined`
**File:** job-postings/page.tsx:45
**Severity:** HIGH
**Impact:** Page crashes on empty data

### 2. Candidate Detail - API 404
**Page:** /candidates/:id
**Role:** HR_SPECIALIST
**Error:** `GET /api/v1/candidates/123 → 404`
**Severity:** MEDIUM
**Impact:** Detail page not loading

[... all issues ...]
```

---

## 🚨 SEVERITY LEVELS

**CRITICAL:** Page crash, data loss
**HIGH:** Feature broken, user blocked
**MEDIUM:** UI glitch, degraded UX
**LOW:** Console warning, cosmetic issue

---

## 🤖 AUTOMATION SCRIPT

**Template:**
```javascript
// scripts/tests/w6-browser-deep-scan.js

const puppeteer = require('puppeteer');

const ROLES = [
  { email: 'test-user@test-org-2.com', password: 'TestPass123!', role: 'USER' },
  { email: 'test-hr_specialist@test-org-2.com', password: 'TestPass123!', role: 'HR_SPECIALIST' },
  { email: 'test-manager@test-org-2.com', password: 'TestPass123!', role: 'MANAGER' },
  { email: 'test-admin@test-org-1.com', password: 'TestPass123!', role: 'ADMIN' },
  { email: 'info@gaiai.ai', password: '23235656', role: 'SUPER_ADMIN' },
];

const PAGES = {
  USER: ['/dashboard', '/notifications', '/help', '/settings/overview'],
  HR_SPECIALIST: ['/job-postings', '/candidates', '/wizard', '/analyses'],
  MANAGER: ['/team', '/analytics'],
  ADMIN: ['/settings/organization', '/settings/billing'],
  SUPER_ADMIN: ['/super-admin', '/super-admin/organizations'],
};

async function testPage(page, url, role) {
  const issues = [];
  
  // Console errors
  page.on('console', msg => {
    if (msg.type() === 'error') {
      issues.push({ type: 'console', error: msg.text(), url });
    }
  });
  
  // Network failures
  page.on('requestfailed', req => {
    issues.push({ type: 'network', error: req.url(), url });
  });
  
  // Navigate
  try {
    await page.goto(`http://localhost:8103${url}`, { waitUntil: 'networkidle0', timeout: 10000 });
  } catch (e) {
    issues.push({ type: 'navigation', error: e.message, url });
    return issues;
  }
  
  // Screenshot
  await page.screenshot({ path: `screenshots/${role}-${url.replace(/\//g, '-')}.png` });
  
  // Check loading stuck
  await page.waitForTimeout(2000);
  const spinners = await page.$$('[data-testid="loading"]');
  if (spinners.length > 0) {
    issues.push({ type: 'loading', error: 'Stuck spinner detected', url });
  }
  
  return issues;
}

async function main() {
  const browser = await puppeteer.launch({ headless: true });
  const allIssues = [];
  
  for (const roleConfig of ROLES) {
    const page = await browser.newPage();
    
    // Login
    await page.goto('http://localhost:8103/login');
    await page.type('input[name="email"]', roleConfig.email);
    await page.type('input[name="password"]', roleConfig.password);
    await page.click('button[type="submit"]');
    await page.waitForNavigation();
    
    // Test pages
    const pages = PAGES[roleConfig.role] || [];
    for (const url of pages) {
      const issues = await testPage(page, url, roleConfig.role);
      allIssues.push(...issues);
    }
    
    await page.close();
  }
  
  await browser.close();
  
  // Report
  console.log(`\n=== BROWSER DEEP SCAN RESULTS ===`);
  console.log(`Total issues: ${allIssues.length}`);
  console.log(`Console errors: ${allIssues.filter(i => i.type === 'console').length}`);
  console.log(`Network failures: ${allIssues.filter(i => i.type === 'network').length}`);
  console.log(`Navigation errors: ${allIssues.filter(i => i.type === 'navigation').length}`);
  console.log(`Loading stuck: ${allIssues.filter(i => i.type === 'loading').length}`);
  
  // Write to file
  require('fs').writeFileSync('test-outputs/w6-browser-issues.json', JSON.stringify(allIssues, null, 2));
}

main();
```

---

## ⏱️ TIMELINE

**Total:** 120 minutes

- Setup Puppeteer: 10 min
- Test USER (7 pages): 15 min
- Test HR (16 pages): 30 min
- Test MANAGER (18 pages): 25 min
- Test ADMIN (18 pages): 20 min
- Test SUPER_ADMIN (22 pages): 20 min
- **Total testing:** 110 min
- Report writing: 10 min

---

## 🎯 SUCCESS CRITERIA

**Green light:**
- ✅ All pages load (no navigation errors)
- ✅ No critical console errors
- ✅ All API calls succeed (200/201/204)
- ✅ No stuck loading states
- ✅ All buttons clickable

**Red flag:**
- ❌ Page crash (console error blocks render)
- ❌ API 404/500 (data not loading)
- ❌ Stuck spinner (infinite loading)
- ❌ Navigation broken (404 page)

---

**START COMMAND:**
```bash
npm install puppeteer  # If not installed
node scripts/tests/w6-browser-deep-scan.js
```

---

**W6: REAL USER PERSPECTIVE - Find what API tests miss!** 🔍
