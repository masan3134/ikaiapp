# 🧪 E2E Test Task - W1: USER Role

**Worker:** W1
**Role to Test:** USER (Basic Employee)
**Test Account:** test-user@test-org-1.com / TestPass123!
**Organization:** Test Org 1 (FREE plan)
**Duration:** ~3 hours
**Report Location:** `docs/reports/e2e-test-w1-user-report.md`

---

## 🎯 YOUR MISSION

Test the **USER role** experience comprehensively. USER is the most restricted role - basic employee with minimal permissions. Your job is to:

1. **Verify RBAC** - Ensure USER can ONLY access what they should
2. **Test Features** - Every feature accessible to USER
3. **Find Bugs** - Console errors, UI issues, logic errors
4. **Design Audit** - Inconsistencies, broken layouts, poor UX
5. **Document Everything** - Ultra-detailed report with screenshots

---

## 🔐 USER ROLE PERMISSIONS (EXPECTED)

### ✅ SHOULD ACCESS
- **Dashboard** - USER variant (limited widgets)
- **CV Analysis Results** - Read-only view of analyses
- **AI Chat** - Ask questions about candidates
- **Profile Settings** - Own profile only
- **Notifications** - View own notifications
- **Help/Documentation** - Public resources

### ❌ SHOULD NOT ACCESS
- **Job Postings** - Create/edit/delete (read-only at most)
- **CV Upload** - Cannot upload CVs
- **Analysis Wizard** - Cannot create analyses
- **Team Management** - Cannot manage users
- **Reports** - No access to org analytics
- **Admin Settings** - No org configuration
- **Billing/Subscription** - No access
- **System Settings** - No system config

### 🔍 MUST VERIFY
- **Org Isolation** - Cannot see other org's data
- **UI Restrictions** - Admin buttons/links hidden
- **API Restrictions** - API calls fail with 403 for unauthorized actions
- **Data Filtering** - Only sees data relevant to USER role

---

## 📋 TESTING CHECKLIST

### 1. Login & Authentication
- [ ] Login with test-user@test-org-1.com
- [ ] Password: TestPass123!
- [ ] Verify redirected to USER dashboard
- [ ] Check console errors (should be 0)
- [ ] Verify session token in localStorage/cookies

**Console Error Check:**
```typescript
// Open browser console (F12)
// Count errors
playwright.console_errors() → errorCount MUST = 0
```

### 2. Dashboard Testing
- [ ] **Widgets Present:**
  - [ ] Welcome widget (with USER name)
  - [ ] Recent Activity (limited to USER's actions)
  - [ ] Assigned Tasks (if any)
  - [ ] Notifications widget
  - [ ] Quick Actions (USER-appropriate only)
- [ ] **Widgets ABSENT (should be hidden):**
  - [ ] Analytics widget (admin-only)
  - [ ] Team Overview (manager-only)
  - [ ] Usage Limits (admin-only)
  - [ ] System Health (super_admin-only)
- [ ] **Navigation:**
  - [ ] Sidebar menu items correct for USER
  - [ ] No admin/manager menu items visible
  - [ ] Logo click → Dashboard
  - [ ] Breadcrumbs working
- [ ] **Design:**
  - [ ] Color scheme consistent (Slate theme for USER)
  - [ ] Typography consistent
  - [ ] Spacing/padding consistent
  - [ ] Mobile responsive (if applicable)
- [ ] **Performance:**
  - [ ] Dashboard load time < 2s
  - [ ] No flickering/layout shifts
  - [ ] Smooth animations

**Take Screenshot:** Full dashboard view

### 3. CV Analysis (Read-Only)
- [ ] Navigate to CV Analysis page (if accessible)
- [ ] **Expected:** Read-only view of analyses created by others
- [ ] **Cannot:** Upload CVs, create analyses, delete analyses
- [ ] **Can:** View analysis results, scores, comparisons
- [ ] **RBAC Test:** Try to click "Upload CV" → Should fail or be hidden
- [ ] **RBAC Test:** Try to access `/analysis/create` → Should redirect or 403
- [ ] Check console errors

**Take Screenshot:** Analysis results view

### 4. AI Chat
- [ ] Navigate to AI Chat
- [ ] Send test message: "What are the top candidates?"
- [ ] **Expected:** Response from Gemini + Milvus
- [ ] **Response time:** < 5 seconds
- [ ] **Verify:** Chat history saved
- [ ] **Verify:** Cannot see other users' chats (org isolation)
- [ ] **RBAC Test:** Try to access admin chat features (if any)
- [ ] Check console errors

**Take Screenshot:** AI Chat interface with response

### 5. Profile Settings
- [ ] Navigate to Profile
- [ ] **Can Edit:**
  - [ ] Name
  - [ ] Email (maybe)
  - [ ] Password
  - [ ] Preferences
  - [ ] Notification settings
- [ ] **Cannot Edit:**
  - [ ] Role
  - [ ] Organization
  - [ ] Permissions
- [ ] **Test:** Change name → Save → Verify in UI
- [ ] **Test:** Change password → Logout → Login with new password
- [ ] Check console errors

**Take Screenshot:** Profile page

### 6. Notifications
- [ ] Navigate to Notifications
- [ ] **Verify:** Only USER's notifications visible
- [ ] **Verify:** Notification types relevant to USER role
- [ ] **Test:** Mark as read → Verify UI update
- [ ] **Test:** Clear notification → Verify removal
- [ ] **RBAC Test:** Cannot see other users' notifications
- [ ] Check console errors

**Take Screenshot:** Notifications list

### 7. Navigation & Sidebar
- [ ] **Visible Menu Items (USER):**
  - [ ] Dashboard
  - [ ] CV Analysis (read-only)
  - [ ] AI Chat
  - [ ] Profile
  - [ ] Notifications
  - [ ] Help
- [ ] **Hidden Menu Items (should NOT see):**
  - [ ] Job Postings (create/manage)
  - [ ] Team Management
  - [ ] Reports
  - [ ] Admin Panel
  - [ ] Settings (org-level)
  - [ ] Billing
- [ ] **Test:** Click all visible items → Verify access
- [ ] **Test:** Try to manually navigate to `/admin` → Should redirect or 403
- [ ] Check console errors

**Take Screenshot:** Sidebar menu

### 8. RBAC Violation Attempts
**CRITICAL: Try to access restricted features!**

- [ ] **Manual URL Tests:**
  - [ ] `/admin` → Should redirect or show 403
  - [ ] `/job-postings/create` → Should redirect or 403
  - [ ] `/team` → Should redirect or 403
  - [ ] `/reports` → Should redirect or 403
  - [ ] `/settings` → Should redirect or 403
- [ ] **API Tests (Python):**
  ```python
  # Try to create job posting (should fail)
  response = helper.post('/api/v1/job-postings', {
      "title": "Test Job",
      "description": "Test"
  })
  # Expected: 403 Forbidden
  ```
- [ ] **UI Tests:**
  - [ ] Try to access admin buttons (should be hidden)
  - [ ] Try to edit other users' data (should fail)
  - [ ] Try to see other org's data (should fail)

**Take Screenshot:** 403 error page (if shown)

### 9. Performance Testing
- [ ] **Page Load Times:**
  - Dashboard: _____ seconds
  - CV Analysis: _____ seconds
  - AI Chat: _____ seconds
  - Profile: _____ seconds
- [ ] **API Response Times:**
  - GET /api/v1/dashboard: _____ ms
  - GET /api/v1/analyses: _____ ms
  - POST /api/v1/chat: _____ ms
- [ ] **Large Data Handling:**
  - View 50+ analyses (if available)
  - Scroll performance
  - Search/filter performance

**Record:** All timings in report

### 10. Error Discovery
- [ ] **Console Errors (Playwright):**
  ```bash
  playwright.console_errors() → errorCount = ?
  ```
  - [ ] List all errors
  - [ ] Screenshot each error
  - [ ] Provide reproduction steps
- [ ] **Network Errors:**
  - [ ] Check Network tab (F12 → Network)
  - [ ] Any failed API calls? (red status codes)
  - [ ] Any 500 errors?
- [ ] **UI Bugs:**
  - [ ] Broken layouts
  - [ ] Overlapping elements
  - [ ] Missing images
  - [ ] Unclickable buttons
- [ ] **Logic Errors:**
  - [ ] Wrong data displayed
  - [ ] Incorrect calculations
  - [ ] Broken links

**Take Screenshot:** Every error found

### 11. Design Consistency Audit
- [ ] **Color Scheme:**
  - Primary color: _____ (expected: Slate for USER)
  - Consistent across pages? Yes/No
  - Any pages with different colors?
- [ ] **Typography:**
  - Font family consistent? Yes/No
  - Font sizes consistent? Yes/No
  - Any pages with different fonts?
- [ ] **Spacing:**
  - Padding/margins consistent? Yes/No
  - Any pages with odd spacing?
- [ ] **Components:**
  - Buttons styled consistently? Yes/No
  - Forms styled consistently? Yes/No
  - Cards/widgets styled consistently? Yes/No
- [ ] **Layouts:**
  - All pages use same layout pattern? Yes/No
  - Any pages with different structure?

**Take Screenshot:** Pages with design inconsistencies

### 12. UX Evaluation
- [ ] **Intuitive?**
  - Easy to find features? Yes/No
  - Clear navigation? Yes/No
  - Obvious button labels? Yes/No
- [ ] **Confusing Elements:**
  - Any unclear UI elements? List them
  - Any missing feedback (loading states, success messages)?
  - Any dead-end pages?
- [ ] **User Flow:**
  - Dashboard → AI Chat → smooth?
  - Dashboard → Profile → smooth?
  - Any broken flows?

---

## 🐛 ISSUE REPORTING FORMAT

**For EVERY issue found, document:**

```markdown
### [Issue Title]

**Severity:** [CRITICAL/HIGH/MEDIUM/LOW]
**Category:** [Functionality/Security/Design/UX/Performance]

**Description:**
[Detailed description of the issue]

**Reproduction Steps:**
1. Login as USER (test-user@test-org-1.com)
2. Navigate to [page]
3. Click [button]
4. Observe [issue]

**Expected Behavior:**
[What should happen]

**Actual Behavior:**
[What actually happens]

**Screenshot:**
[Path to screenshot or describe visual issue]

**Console Output:**
```
[Paste console errors here]
```

**Impact:**
[How does this affect users? Critical/High/Medium/Low]

**Suggested Fix:**
[Your recommendation for how to fix this]
```

---

## 🧪 PLAYWRIGHT USAGE

**Console Error Detection:**
```bash
# Start Playwright browser
playwright.launch({headless: false})

# Navigate to page
page.goto('http://localhost:8103')

# Login
page.fill('input[name="email"]', 'test-user@test-org-1.com')
page.fill('input[name="password"]', 'TestPass123!')
page.click('button[type="submit"]')

# Check console errors
playwright.console_errors() → {errorCount: 0, errors: []}
```

**Screenshot Capture:**
```bash
page.screenshot({path: 'screenshots/w1-dashboard.png', fullPage: true})
```

---

## 🐍 PYTHON API TESTING

**Helper Script:** `scripts/test-helper.py`

```python
from test_helper import IKAITestHelper

helper = IKAITestHelper()

# Login as USER
helper.login('test-user@test-org-1.com', 'TestPass123!')

# Test authorized endpoints
response = helper.get('/api/v1/dashboard')
print(f"Dashboard: {response.status_code}")  # Expected: 200

# Test unauthorized endpoints (should fail)
response = helper.post('/api/v1/job-postings', {
    "title": "Test Job"
})
print(f"Create Job: {response.status_code}")  # Expected: 403

# Test org isolation
response = helper.get('/api/v1/users')  # Should only return org 1 users
print(f"Users: {len(response.json())}")
```

---

## 📊 REPORT TEMPLATE

**Use this exact structure:**

```markdown
# E2E Test Report - USER Role

**Worker:** W1
**Role:** USER
**Account:** test-user@test-org-1.com
**Organization:** Test Org 1
**Plan:** FREE
**Date:** 2025-11-05
**Duration:** [X hours]

---

## 🎯 Executive Summary

- **Total Issues Found:** [N]
- **Critical:** [N]
- **High:** [N]
- **Medium:** [N]
- **Low:** [N]
- **Console Errors:** [N]
- **RBAC Violations:** [N]
- **Design Inconsistencies:** [N]
- **UX Issues:** [N]

---

## 🧪 Testing Scope

[Checkmarks for all tested features]

---

## 🐛 Issues Found

### CRITICAL Issues
[List each critical issue using the format above]

### HIGH Priority Issues
[List each high priority issue]

### MEDIUM Priority Issues
[List each medium priority issue]

### LOW Priority Issues
[List each low priority issue]

### Design Inconsistencies
[List design issues]

---

## 🎨 UX Evaluation

[Positive aspects and improvement areas]

---

## ⚡ Performance Observations

[Load times, API response times, bottlenecks]

---

## ✅ RBAC Verification Results

| Feature | Should Access | Can Access | Status |
|---------|---------------|------------|--------|
| Dashboard | ✅ | ✅ | PASS |
| CV Analysis (read) | ✅ | ✅ | PASS |
| CV Upload | ❌ | ❌ | PASS |
| Job Postings (create) | ❌ | ❌ | PASS |
| Admin Panel | ❌ | ❌ | PASS |
[Add all features...]

---

## 📸 Screenshots

[Include all relevant screenshots with descriptions]

---

## 💡 Recommendations

[Your suggestions for improvements]

---

## 📝 Notes

[Any additional observations]
```

---

## ⚠️ CRITICAL REMINDERS

1. **RULE 0:** NO mock data, NO placeholders, NO "TODO" - Test on REAL system!
2. **Zero Console Errors:** errorCount MUST = 0. If not, document ALL errors.
3. **RBAC Verification:** Try to access restricted features! Document if you CAN access (violation).
4. **Screenshots:** Take screenshots for EVERY visual issue.
5. **Reproduction Steps:** MUST be detailed enough for MOD to reproduce.
6. **Honest Reporting:** Do NOT fake test results. MOD will verify independently.

---

## 🎯 SUCCESS CRITERIA

- ✅ All features tested (checklist complete)
- ✅ All RBAC scenarios verified
- ✅ All console errors documented (or confirmed 0)
- ✅ All bugs have reproduction steps
- ✅ All screenshots saved
- ✅ Report uses correct template
- ✅ Performance metrics recorded
- ✅ Design audit complete

---

**START TESTING! Report when done.**
