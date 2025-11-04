# W1: USER Role - Comprehensive E2E Testing

**Worker:** W1
**Role:** USER (Basic Employee)
**Method:** Puppeteer + Auto-Fix
**Duration:** 60 minutes
**Goal:** Test ALL USER features as REAL user + FIX issues immediately

---

## 🎯 MISSION

**Test like a real USER employee:**
1. ✅ Login to system
2. ✅ Navigate all accessible pages
3. ✅ Click all buttons
4. ✅ Fill all forms
5. ✅ Submit data
6. ✅ Verify results
7. ❌ If error → FIX immediately → Continue
8. ✅ Final report

**CRITICAL:** Don't just report bugs - FIX THEM! Then continue testing.

---

## 🔧 SETUP

**Puppeteer Script Template:**
```javascript
// scripts/tests/w1-e2e-user.js
const puppeteer = require('puppeteer');

const USER_CREDS = {
  email: 'test-user@test-org-2.com',
  password: 'TestPass123!'
};

async function runE2E() {
  const browser = await puppeteer.launch({
    headless: false,  // Visual debugging
    slowMo: 50
  });
  const page = await browser.newPage();

  // Error tracking
  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push({ type: 'console', text: msg.text() });
    }
  });

  page.on('pageerror', error => {
    errors.push({ type: 'page', text: error.toString() });
  });

  page.on('requestfailed', req => {
    errors.push({ type: 'network', url: req.url() });
  });

  // Start testing...
  await testLogin(page);
  await testDashboard(page);
  await testNotifications(page);
  await testSettings(page);

  // Report
  console.log(`Total errors found: ${errors.length}`);
  console.log(`Issues fixed: TBD`);

  await browser.close();
}

runE2E();
```

---

## 📋 TEST SCENARIOS (7 Core Flows)

### 1️⃣ Login Flow
**Steps:**
1. Navigate to `/login`
2. Fill email: `test-user@test-org-2.com`
3. Fill password: `TestPass123!`
4. Click "Giriş Yap" button
5. Wait for redirect to `/dashboard`
6. Verify user name appears in header

**Success Criteria:**
- ✅ Login form submits without errors
- ✅ Redirect to dashboard
- ✅ User authenticated (token stored)

**If Error:**
- Console error → Check form validation
- 401/403 → Check credentials
- Redirect fails → Check auth middleware

---

### 2️⃣ Dashboard View
**Steps:**
1. Navigate to `/dashboard`
2. Wait for all widgets to load
3. Verify 8 widgets present:
   - Welcome Header
   - Profile Completion
   - Notification Center
   - Activity Today
   - Recent Notifications
   - Quick Actions
   - Activity Timeline
   - System Status
4. Click each widget (if interactive)
5. Screenshot dashboard

**Success Criteria:**
- ✅ All widgets render
- ✅ No console errors
- ✅ API calls succeed (200)
- ✅ Data displays correctly

**If Error:**
- Widget missing → Check component import
- API 403 → Fix RBAC permissions
- Console error → Fix React component

---

### 3️⃣ Notifications
**Steps:**
1. Navigate to `/notifications`
2. Check notification list renders
3. Click "Mark as read" on notification
4. Verify notification marked as read
5. Test filter dropdown
6. Test pagination (if > 10 notifications)

**Success Criteria:**
- ✅ Notification list loads
- ✅ Mark as read works
- ✅ Filters work
- ✅ Pagination works

**If Error:**
- Empty state → Check if test data exists
- Mark as read fails → Check API endpoint
- Filter broken → Check client-side logic

---

### 4️⃣ Help Center
**Steps:**
1. Navigate to `/help`
2. Verify FAQ sections render
3. Click FAQ item to expand
4. Fill contact form
5. Submit contact form
6. Verify success message

**Success Criteria:**
- ✅ FAQ list renders
- ✅ Accordion works
- ✅ Contact form submits
- ✅ Success feedback shown

**If Error:**
- FAQ not expanding → Check accordion state
- Form fails → Check validation
- Submit error → Check API endpoint

---

### 5️⃣ Settings: Profile
**Steps:**
1. Navigate to `/settings/profile`
2. Update first name
3. Update last name
4. Update position
5. Click "Save" button
6. Verify success message
7. Refresh page
8. Verify changes persisted

**Success Criteria:**
- ✅ Profile form loads with current data
- ✅ Form submits successfully
- ✅ Changes saved to database
- ✅ UI updates reflect changes

**If Error:**
- Form not loading → Check API call
- Save fails → Check validation
- Not persisted → Check backend update logic

---

### 6️⃣ Settings: Security
**Steps:**
1. Navigate to `/settings/security`
2. Fill "Current Password"
3. Fill "New Password"
4. Fill "Confirm Password"
5. Click "Change Password"
6. Verify success message
7. Logout
8. Login with NEW password
9. Verify login succeeds

**Success Criteria:**
- ✅ Password form renders
- ✅ Password change succeeds
- ✅ Can login with new password
- ✅ Session management works

**If Error:**
- Validation fails → Check password rules
- Change fails → Check backend logic
- Login fails → Password not updated correctly

---

### 7️⃣ Settings: Notifications
**Steps:**
1. Navigate to `/settings/notifications`
2. Toggle email notifications
3. Toggle push notifications
4. Select notification types
5. Click "Save Preferences"
6. Verify success message
7. Refresh page
8. Verify preferences persisted

**Success Criteria:**
- ✅ Preference form loads
- ✅ Toggles work
- ✅ Preferences save
- ✅ Changes persist

**If Error:**
- Toggles not working → Check state management
- Save fails → Check API endpoint
- Not persisted → Check backend

---

## 🐛 FIX PROTOCOL

**When you find an error:**

### Step 1: Diagnose
- Read error message carefully
- Check console for stack trace
- Identify file and line number

### Step 2: Fix
**Frontend errors:**
```bash
# Edit the component
nano frontend/app/(authenticated)/dashboard/page.tsx

# Common fixes:
- Add null checks: data?.map()
- Add error boundary: try/catch
- Fix imports: check paths
- Add loading state: if (loading) return <Spinner />
```

**Backend errors:**
```bash
# Edit the route/controller
nano backend/src/routes/dashboardRoutes.js

# Common fixes:
- Fix RBAC: authorize(['USER', ...])
- Add error handling: try/catch
- Fix query: prisma.user.findUnique()
```

### Step 3: Verify Fix
```bash
# Frontend changes auto-reload (Hot Module Replacement)
# Just wait 2 seconds and retry

# Backend changes: nodemon auto-restarts
# Wait for "Server started" message, then retry
```

### Step 4: Commit Fix
```bash
git add <file>
git commit -m "fix(user): Fix dashboard widget loading error"
# Auto-push happens
```

### Step 5: Continue Testing
- Mark issue as fixed in your notes
- Continue to next test scenario
- Don't stop for every bug - fix and move on!

---

## 📊 FINAL REPORT

**File:** `docs/reports/w1-e2e-user.md`

**Structure:**
```markdown
# W1: USER Role E2E Test Report

## Summary
- Scenarios tested: 7
- Scenarios passed: X
- Scenarios failed: Y
- Issues found: Z
- Issues fixed: W
- Success rate: XX%

## Scenarios

### 1. Login Flow ✅
- Status: PASS
- Duration: 5s
- Issues: 0

### 2. Dashboard View ❌ → ✅
- Status: PASS (after fix)
- Duration: 10s
- Issues found: 1
- Issues fixed: 1
- Fix: Added null check for notifications widget

[... all 7 scenarios ...]

## Issues Fixed

### Issue #1: Dashboard Notifications Widget Crash
**Error:** Cannot read property 'map' of undefined
**File:** frontend/app/(authenticated)/dashboard/user-dashboard.tsx:45
**Fix:** Added null check before map()
**Commit:** abc123f
**Verification:** ✅ Widget now renders correctly

[... all fixed issues ...]

## Remaining Issues

[If any issues couldn't be fixed, list here]

## Conclusion

USER role is PRODUCTION READY / NEEDS WORK.

All core user flows tested and verified working.
```

---

## ⏱️ TIME BUDGET

**Total:** 60 minutes

- Setup Puppeteer: 5 min
- Login flow: 5 min
- Dashboard: 10 min
- Notifications: 5 min
- Help: 5 min
- Settings Profile: 5 min
- Settings Security: 10 min
- Settings Notifications: 5 min
- **Testing:** 50 min
- **Report:** 10 min

---

## 🎯 SUCCESS CRITERIA

**Green Light (Ship It!):**
- ✅ All 7 scenarios pass
- ✅ No critical console errors
- ✅ All API calls succeed
- ✅ All forms submit correctly
- ✅ Data persists correctly

**Yellow Light (Needs Work):**
- ⚠️ Minor UI issues (cosmetic)
- ⚠️ Some console warnings (non-blocking)
- ⚠️ 1-2 non-critical features broken

**Red Light (Block Release):**
- ❌ Login broken
- ❌ Dashboard crashes
- ❌ Critical data loss
- ❌ Security vulnerabilities

---

## 🚀 START COMMAND

```bash
# Install Puppeteer (if needed)
npm install puppeteer

# Run E2E test
node scripts/tests/w1-e2e-user.js
```

---

**Worker Instructions:**

1. ✅ Create Puppeteer script
2. ✅ Run all 7 scenarios
3. ✅ Fix issues as you find them (DON'T WAIT!)
4. ✅ Commit each fix immediately
5. ✅ Write comprehensive report
6. ✅ Submit report + script

**Key Principle:** Be AUTONOMOUS! Fix problems, don't just report them.

**Expected Output:**
- ✅ Puppeteer script: `scripts/tests/w1-e2e-user.js` (~400 lines)
- ✅ Report: `docs/reports/w1-e2e-user.md` (~300 lines)
- ✅ Fixes: Multiple commits (1 per fix)
- ✅ Screenshots: `screenshots/w1-*` (optional)

---

**GO! Test like a real user. Fix issues. Ship quality! 🚀**
