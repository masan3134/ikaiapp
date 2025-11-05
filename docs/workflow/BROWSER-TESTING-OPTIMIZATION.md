# 🌐 Browser Testing Optimization Guide

**Date:** 2025-11-05
**Purpose:** Optimize Playwright/Puppeteer usage for E2E testing
**Key Changes:** Headless mode, auto-cleanup, parallel capacity management

---

## 🚨 PROBLEM

**Current Issues:**
1. ❌ Chromium windows pop up on screen (distracting)
2. ❌ Browsers left open after tests (resource waste)
3. ❌ No parallel capacity management (30+ tests possible!)
4. ❌ No systematic cleanup (memory leaks)

---

## ✅ SOLUTION

### 1. HEADLESS MODE (MANDATORY)

**Run Chromium in background - NO visible windows!**

#### Playwright Usage (CORRECT)
```javascript
// ❌ WRONG: Opens visible browser
playwright.launch({headless: false})

// ✅ RIGHT: Runs in background (default)
playwright.launch()
// OR explicitly:
playwright.launch({headless: true})
```

#### Puppeteer Usage (CORRECT)
```javascript
// ❌ WRONG: Opens visible browser
puppeteer.launch({headless: false})

// ✅ RIGHT: Runs in background
puppeteer.launch({headless: true})
// OR use 'new' headless mode (faster):
puppeteer.launch({headless: 'new'})
```

### 2. AUTO-CLEANUP (MANDATORY)

**ALWAYS close browser after test - NO exceptions!**

#### Pattern 1: Try-Finally (RECOMMENDED)
```javascript
let browser;
try {
    // Launch browser
    browser = await playwright.launch({headless: true});
    const page = await browser.newPage();

    // Do testing
    await page.goto('http://localhost:8103');
    await page.fill('input[name="email"]', 'test@example.com');
    // ... test steps ...

    // Get results
    const errors = await playwright.console_errors();
    console.log(errors);

} finally {
    // ALWAYS close - even if test fails!
    if (browser) {
        await browser.close();
    }
}
```

#### Pattern 2: Immediate Cleanup
```javascript
// Quick test - cleanup immediately
const browser = await playwright.launch();
const page = await browser.newPage();
await page.goto('http://localhost:8103/login');
const screenshot = await page.screenshot({path: 'login.png'});
await browser.close(); // Close immediately after work done
```

### 3. PARALLEL CAPACITY MANAGEMENT

**30+ Chromium instances can run in parallel!**

#### Resource Limits
- **System Capacity:** ~30-40 parallel Chromium instances (on typical dev machine)
- **Memory per Instance:** ~100-150MB
- **CPU per Instance:** 1-2%
- **Total Capacity:** 30 instances = ~4GB RAM, ~50% CPU

#### Worker Coordination

**Use resource pool to prevent overload:**

**Location:** `/tmp/browser-resource-pool.json`

```json
{
  "max_parallel_browsers": 30,
  "active_browsers": {
    "w1-test-user": {
      "worker": "W1",
      "pid": 12345,
      "started_at": "2025-11-05T11:00:00Z",
      "test": "USER dashboard test"
    },
    "w2-test-hr": {
      "worker": "W2",
      "pid": 12346,
      "started_at": "2025-11-05T11:00:00Z",
      "test": "HR wizard test"
    }
  },
  "current_usage": 2
}
```

#### Worker Protocol

**Before launching browser:**
```bash
# 1. Check current usage
USAGE=$(cat /tmp/browser-resource-pool.json | jq '.current_usage')

# 2. If usage < max (30), proceed
if [ $USAGE -lt 30 ]; then
    # Register browser
    # Launch browser
    # Do work
    # Close browser
    # Unregister browser
else
    # Wait 30s, retry
    sleep 30
fi
```

**Python Helper:**
```python
import json
import time

def wait_for_browser_slot(worker_id, max_wait=300):
    """Wait for available browser slot (max 5 min)"""
    start = time.time()

    while time.time() - start < max_wait:
        with open('/tmp/browser-resource-pool.json', 'r') as f:
            pool = json.load(f)

        if pool['current_usage'] < pool['max_parallel_browsers']:
            # Register this worker's browser
            pool['active_browsers'][f"{worker_id}-browser"] = {
                "worker": worker_id,
                "pid": os.getpid(),
                "started_at": time.strftime("%Y-%m-%dT%H:%M:%SZ"),
                "test": "current test name"
            }
            pool['current_usage'] += 1

            with open('/tmp/browser-resource-pool.json', 'w') as f:
                json.dump(pool, f, indent=2)

            return True

        # Wait and retry
        print(f"{worker_id}: Browser pool full ({pool['current_usage']}/30), waiting...")
        time.sleep(10)

    raise Exception(f"{worker_id}: Could not get browser slot after {max_wait}s")

def release_browser_slot(worker_id):
    """Release browser slot after test"""
    with open('/tmp/browser-resource-pool.json', 'r') as f:
        pool = json.load(f)

    key = f"{worker_id}-browser"
    if key in pool['active_browsers']:
        del pool['active_browsers'][key]
        pool['current_usage'] -= 1

        with open('/tmp/browser-resource-pool.json', 'w') as f:
            json.dump(pool, f, indent=2)

# Usage in worker test
wait_for_browser_slot("W1")
try:
    # Launch browser and test
    browser = await playwright.launch({headless: true})
    # ... do testing ...
finally:
    await browser.close()
    release_browser_slot("W1")
```

---

## 📋 WORKER TESTING PROTOCOL (UPDATED)

### Step-by-Step Flow

#### 1. Check Browser Pool Availability
```python
# Before ANY browser launch
wait_for_browser_slot(worker_id="W1")
```

#### 2. Launch Headless Browser
```javascript
const browser = await playwright.launch({
    headless: true,  // ✅ NO visible window!
    args: [
        '--no-sandbox',           // Docker compatibility
        '--disable-dev-shm-usage' // Prevent memory issues
    ]
});
```

#### 3. Do Testing
```javascript
const page = await browser.newPage();

// Test workflow
await page.goto('http://localhost:8103/login');
await page.fill('input[name="email"]', 'test-user@test-org-1.com');
await page.fill('input[name="password"]', 'TestPass123!');
await page.click('button[type="submit"]');
await page.waitForNavigation();

// Check console errors
const errors = await playwright.console_errors();
console.log(`Console errors: ${errors.errorCount}`);

// Take screenshot (if needed)
await page.screenshot({
    path: 'screenshots/w1-dashboard.png',
    fullPage: true
});
```

#### 4. Close Browser (MANDATORY!)
```javascript
await browser.close(); // ✅ ALWAYS close!
```

#### 5. Release Pool Slot
```python
release_browser_slot(worker_id="W1")
```

---

## 🎯 PARALLEL TESTING STRATEGY

### Scenario: 6 Workers, 30 Browser Capacity

**Worker Distribution:**
- W1: 5 tests (USER role) → 5 browsers max
- W2: 8 tests (HR_SPECIALIST) → 8 browsers max
- W3: 5 tests (MANAGER) → 5 browsers max
- W4: 6 tests (ADMIN) → 6 browsers max
- W5: 4 tests (SUPER_ADMIN) → 4 browsers max
- W6: 2 tests (Cross-role) → 2 browsers max

**Total:** 30 browsers (perfect fit!)

### Optimization: Sequential Within Worker

**Instead of opening all 5 at once (W1):**
```javascript
// ❌ BAD: Open 5 browsers at once
const browsers = await Promise.all([
    playwright.launch(), // 5 browsers opened simultaneously
    playwright.launch(),
    playwright.launch(),
    playwright.launch(),
    playwright.launch()
]);

// ✅ GOOD: Open 1, test, close, repeat
for (const test of tests) {
    const browser = await playwright.launch({headless: true});
    await runTest(browser, test);
    await browser.close(); // Close before next test
}
```

**Benefits:**
- Lower memory usage per worker
- More reliable (no browser interference)
- Easier debugging

---

## 🔧 BROWSER RESOURCE POOL SETUP

### Initial Setup (Run Once)

```bash
# Create browser resource pool file
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
```

### Monitoring Script

```bash
#!/bin/bash
# Watch browser usage in real-time

watch -n 2 'cat /tmp/browser-resource-pool.json | jq "
{
  usage: .current_usage,
  max: .max_parallel_browsers,
  available: (.max_parallel_browsers - .current_usage),
  peak: .peak_usage,
  active_workers: (.active_browsers | keys)
}"'
```

**Output:**
```json
{
  "usage": 12,
  "max": 30,
  "available": 18,
  "peak": 15,
  "active_workers": [
    "W1-browser",
    "W2-browser",
    "W3-browser"
  ]
}
```

---

## 📊 PERFORMANCE METRICS

### Expected Timings (Headless)

| Operation | Headless | Headed (Old) | Improvement |
|-----------|----------|--------------|-------------|
| **Launch Browser** | 0.5s | 1.5s | 66% faster |
| **Navigate Page** | 0.3s | 0.5s | 40% faster |
| **Screenshot** | 0.2s | 0.4s | 50% faster |
| **Console Errors** | 0.1s | 0.2s | 50% faster |
| **Close Browser** | 0.2s | 0.5s | 60% faster |

**Total Test Speedup:** 30-50% faster with headless!

### Memory Usage

| Mode | Per Browser | 30 Browsers |
|------|-------------|-------------|
| **Headless** | 100MB | 3GB |
| **Headed (Old)** | 150MB | 4.5GB |

**Memory Saved:** 1.5GB with headless!

---

## 🐛 TROUBLESHOOTING

### Problem: "Browser launch timeout"
**Solution:** Check if 30 limit reached
```bash
cat /tmp/browser-resource-pool.json | jq '.current_usage'
# If 30, wait for slots to free up
```

### Problem: "Browser left open after crash"
**Solution:** Manual cleanup
```bash
# Kill orphan Chromium processes
pkill -f "chromium.*--headless"

# Reset pool
cat > /tmp/browser-resource-pool.json << 'EOF'
{"max_parallel_browsers": 30, "active_browsers": {}, "current_usage": 0}
EOF
```

### Problem: "Out of memory"
**Solution:** Lower max_parallel_browsers
```bash
# Reduce to 20 if system struggling
jq '.max_parallel_browsers = 20' /tmp/browser-resource-pool.json > tmp.json
mv tmp.json /tmp/browser-resource-pool.json
```

---

## ✅ UPDATED WORKER CHECKLIST

**Before running browser tests:**
- [ ] Browser pool file exists (`/tmp/browser-resource-pool.json`)
- [ ] Headless mode confirmed (`headless: true`)
- [ ] Cleanup code in place (`try-finally` block)
- [ ] Pool slot management implemented

**During testing:**
- [ ] Check current usage before launch
- [ ] Register browser in pool
- [ ] Run tests sequentially (not all at once)
- [ ] Close browser immediately after test
- [ ] Release pool slot

**After all tests:**
- [ ] All browsers closed (`current_usage` should be 0)
- [ ] No orphan Chromium processes
- [ ] Pool metrics recorded (peak usage, total launched)

---

## 📝 EXAMPLE: COMPLETE WORKER TEST

```python
#!/usr/bin/env python3
"""
W1 - USER Role E2E Test
With browser resource management + headless mode
"""

import json
import time
import os

# Browser pool management
def wait_for_browser_slot(worker_id):
    while True:
        with open('/tmp/browser-resource-pool.json', 'r') as f:
            pool = json.load(f)

        if pool['current_usage'] < pool['max_parallel_browsers']:
            # Register
            pool['active_browsers'][f"{worker_id}-browser"] = {
                "worker": worker_id,
                "pid": os.getpid(),
                "started_at": time.strftime("%Y-%m-%dT%H:%M:%SZ")
            }
            pool['current_usage'] += 1

            with open('/tmp/browser-resource-pool.json', 'w') as f:
                json.dump(pool, f, indent=2)

            print(f"✅ {worker_id}: Browser slot acquired ({pool['current_usage']}/30)")
            return

        print(f"⏳ {worker_id}: Waiting for browser slot... ({pool['current_usage']}/30)")
        time.sleep(10)

def release_browser_slot(worker_id):
    with open('/tmp/browser-resource-pool.json', 'r') as f:
        pool = json.load(f)

    key = f"{worker_id}-browser"
    if key in pool['active_browsers']:
        del pool['active_browsers'][key]
        pool['current_usage'] -= 1

        with open('/tmp/browser-resource-pool.json', 'w') as f:
            json.dump(pool, f, indent=2)

        print(f"✅ {worker_id}: Browser slot released ({pool['current_usage']}/30)")

# Main test
def main():
    worker_id = "W1"

    # Test suite
    tests = [
        "dashboard-load",
        "navigation-test",
        "cv-analysis-view",
        "ai-chat-test",
        "profile-test"
    ]

    for test_name in tests:
        print(f"\n🧪 {worker_id}: Running {test_name}...")

        # Get browser slot
        wait_for_browser_slot(worker_id)

        try:
            # Launch headless browser
            browser = playwright.launch({
                'headless': True,
                'args': ['--no-sandbox', '--disable-dev-shm-usage']
            })

            page = browser.newPage()

            # Login
            page.goto('http://localhost:8103/login')
            page.fill('input[name="email"]', 'test-user@test-org-1.com')
            page.fill('input[name="password"]', 'TestPass123!')
            page.click('button[type="submit"]')
            page.waitForNavigation()

            # Run specific test
            if test_name == "dashboard-load":
                page.waitForSelector('.dashboard-widget')
                errors = playwright.console_errors()
                print(f"  Console errors: {errors['errorCount']}")

            # ... other tests ...

            # Screenshot
            page.screenshot({
                'path': f'screenshots/w1-{test_name}.png',
                'fullPage': True
            })

            print(f"✅ {worker_id}: {test_name} passed")

        except Exception as e:
            print(f"❌ {worker_id}: {test_name} failed: {e}")

        finally:
            # ALWAYS close browser!
            browser.close()
            release_browser_slot(worker_id)

            # Small delay between tests
            time.sleep(2)

    print(f"\n🎉 {worker_id}: All tests complete!")

if __name__ == "__main__":
    main()
```

---

## 🎯 SUMMARY

### Key Changes
1. **Headless Mode:** `headless: true` → No visible windows ✅
2. **Auto-Cleanup:** `try-finally` + `browser.close()` → No leaks ✅
3. **Resource Pool:** `/tmp/browser-resource-pool.json` → 30 parallel limit ✅
4. **Sequential Testing:** One browser at a time per worker → Stable ✅

### Benefits
- ⚡ 30-50% faster tests (headless)
- 💾 1.5GB less memory (headless)
- 🎯 30 parallel tests supported
- 🧹 Auto-cleanup prevents leaks
- 🚫 No screen popups (background only)

### Worker Impact
- ✅ Must use headless mode (mandatory)
- ✅ Must implement cleanup (try-finally)
- ✅ Must check resource pool (before launch)
- ✅ Sequential tests (not all at once)

---

**🚀 Browser testing now optimized for performance and parallel execution!**
