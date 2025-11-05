# 🌐 E2E Testing - Browser Optimization Addendum

**FOR ALL WORKERS (W1-W6)**
**READ THIS BEFORE STARTING BROWSER TESTS!**

---

## 🚨 CRITICAL: HEADLESS MODE + AUTO-CLEANUP

### 1. ALWAYS Use Headless Mode

**❌ WRONG (Opens visible windows):**
```javascript
playwright.launch({headless: false})
```

**✅ RIGHT (Background only):**
```javascript
playwright.launch({headless: true})
// OR just:
playwright.launch() // headless: true is default
```

**Why:** No screen popups, 30-50% faster, less memory!

---

### 2. ALWAYS Close Browser After Test

**❌ WRONG (Browser left open):**
```javascript
const browser = await playwright.launch();
// ... do testing ...
// Browser never closed! ❌
```

**✅ RIGHT (Auto-cleanup):**
```javascript
const browser = await playwright.launch({headless: true});
try {
    // Do testing
    const page = await browser.newPage();
    await page.goto('http://localhost:8103');
    // ... test steps ...
} finally {
    await browser.close(); // ✅ ALWAYS close!
}
```

---

### 3. Resource Pool Management (30 Parallel Limit)

**System capacity:** 30 parallel Chromium instances

**Setup (Run once, before starting):**
```bash
cat > /tmp/browser-resource-pool.json << 'EOF'
{
  "max_parallel_browsers": 30,
  "active_browsers": {},
  "current_usage": 0
}
EOF
```

**Before each browser launch:**
```bash
# Check current usage
USAGE=$(cat /tmp/browser-resource-pool.json | jq '.current_usage')

# If < 30, proceed
# If = 30, wait 10s and retry
```

**Python helper (recommended):**
```python
import json
import time

def check_browser_pool():
    with open('/tmp/browser-resource-pool.json', 'r') as f:
        pool = json.load(f)
    return pool['current_usage'] < 30

# Before launching browser
while not check_browser_pool():
    print("⏳ Browser pool full, waiting...")
    time.sleep(10)

# Now safe to launch
```

---

## 🎯 TESTING STRATEGY

### Sequential, Not Parallel (Per Worker)

**❌ WRONG: Launch all browsers at once**
```javascript
// Don't do this - opens 5 browsers simultaneously!
const browsers = await Promise.all([
    playwright.launch(),
    playwright.launch(),
    playwright.launch(),
    playwright.launch(),
    playwright.launch()
]);
```

**✅ RIGHT: One browser at a time**
```javascript
// Do this - test sequentially
for (const test of tests) {
    const browser = await playwright.launch({headless: true});
    await runTest(browser, test);
    await browser.close(); // Close before next test
}
```

**Why:** More stable, less memory, easier debugging

---

## 📋 UPDATED TESTING CHECKLIST

**Before ANY Playwright/Puppeteer test:**
- [ ] Browser pool file exists (`/tmp/browser-resource-pool.json`)
- [ ] Using headless mode (`headless: true`)
- [ ] Auto-cleanup implemented (`try-finally`)
- [ ] Sequential testing (not parallel within worker)

**During test:**
- [ ] Check pool capacity before launch
- [ ] Launch headless browser
- [ ] Do testing
- [ ] Close browser immediately
- [ ] Release pool slot

**After all tests:**
- [ ] All browsers closed (no orphans)
- [ ] Pool usage = 0
- [ ] Screenshots saved (if taken)

---

## 🔧 QUICK SETUP SCRIPT

**Run this ONCE before starting tests:**

```bash
#!/bin/bash
# Setup browser resource pool

# Create pool file
cat > /tmp/browser-resource-pool.json << 'EOF'
{
  "max_parallel_browsers": 30,
  "active_browsers": {},
  "current_usage": 0,
  "peak_usage": 0,
  "total_launched": 0,
  "total_closed": 0
}
EOF

chmod 666 /tmp/browser-resource-pool.json

echo "✅ Browser resource pool created"
echo "Max parallel browsers: 30"
echo "Current usage: 0"
```

---

## 📊 MONITORING (Optional)

**Watch browser usage in real-time:**

```bash
watch -n 2 'cat /tmp/browser-resource-pool.json | jq "{
  usage: .current_usage,
  max: .max_parallel_browsers,
  available: (.max_parallel_browsers - .current_usage)
}"'
```

**Output:**
```json
{
  "usage": 12,
  "max": 30,
  "available": 18
}
```

---

## 🐛 TROUBLESHOOTING

**Problem: Browser launch timeout**
→ Pool full (30/30), wait for slot

**Problem: Browser left open after test**
→ Add `try-finally` block with `browser.close()`

**Problem: "Out of memory"**
→ Too many browsers, check pool usage

**Cleanup orphan browsers:**
```bash
pkill -f "chromium.*--headless"
```

---

## 🎯 EXAMPLE: Complete Test with Optimization

```javascript
// W1 - Dashboard Test (Optimized)

const browser = await playwright.launch({
    headless: true,  // ✅ Background only
    args: [
        '--no-sandbox',
        '--disable-dev-shm-usage'
    ]
});

try {
    const page = await browser.newPage();

    // Login
    await page.goto('http://localhost:8103/login');
    await page.fill('input[name="email"]', 'test-user@test-org-1.com');
    await page.fill('input[name="password"]', 'TestPass123!');
    await page.click('button[type="submit"]');
    await page.waitForNavigation();

    // Test dashboard
    await page.waitForSelector('.dashboard-widget');

    // Check console errors
    const errors = await playwright.console_errors();
    console.log(`Console errors: ${errors.errorCount}`); // Must be 0!

    // Screenshot
    await page.screenshot({
        path: 'screenshots/w1-dashboard.png',
        fullPage: true
    });

} finally {
    await browser.close(); // ✅ ALWAYS close!
}
```

---

## ✅ SUMMARY

**3 Critical Rules:**
1. **Headless Mode:** `headless: true` → No popups ✅
2. **Auto-Cleanup:** `try-finally` + `browser.close()` → No leaks ✅
3. **Sequential Testing:** One browser at a time → Stable ✅

**Capacity:** 30 parallel browsers across all workers

**Benefits:**
- 🚫 No screen popups
- ⚡ 30-50% faster
- 💾 1.5GB less memory
- 🧹 Auto-cleanup

---

**Full guide:** [`docs/workflow/BROWSER-TESTING-OPTIMIZATION.md`](BROWSER-TESTING-OPTIMIZATION.md)

**APPLY THESE RULES IN ALL E2E TESTS! 🚀**
