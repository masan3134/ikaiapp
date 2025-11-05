# 🧪 E2E Test Task - W6: Cross-Role Coordinator & Design Auditor

**Worker:** W6
**Role to Test:** ALL ROLES (Cross-Role Integration & Design)
**Test Accounts:** All 5 roles
**Organization:** All test orgs
**Duration:** ~3 hours
**Report Location:** `docs/reports/e2e-test-w6-cross-role-report.md`

---

## 🎯 YOUR MISSION

You are the **Integration & Design Specialist**. While W1-W5 test individual roles, YOU test:

1. **Design Consistency** - Compare all 5 dashboards, identify design inconsistencies
2. **Integration Testing** - Full workflows across roles (HR creates → MANAGER reviews → ADMIN approves)
3. **Performance Testing** - Load times, API benchmarks across all pages
4. **Public Pages** - Landing, pricing, features (non-authenticated)
5. **Error Aggregation** - Collect console errors from all roles
6. **Design Unification Plan** - Recommend which pages should adopt which design

---

## 📋 PHASE 1: DESIGN CONSISTENCY AUDIT (90 min)

### Task: Compare 5 Dashboards Side-by-Side

**Methodology:**
1. Login as each role
2. Take full-page screenshot of dashboard
3. Compare screenshots side-by-side
4. Document differences

#### 1.1 Screenshot Collection

**Use Puppeteer for high-quality screenshots:**

```javascript
// Login as USER
puppeteer.goto('http://localhost:8103/login')
puppeteer.fill('email', 'test-user@test-org-1.com')
puppeteer.fill('password', 'TestPass123!')
puppeteer.click('Login')
puppeteer.wait(2000)
puppeteer.screenshot({path: 'screenshots/dashboard-user.png', fullPage: true})

// Repeat for each role:
// - HR_SPECIALIST: test-hr_specialist@test-org-2.com
// - MANAGER: test-manager@test-org-1.com
// - ADMIN: test-admin@test-org-2.com
// - SUPER_ADMIN: info@gaiai.ai
```

**Save screenshots as:**
- `screenshots/dashboard-user.png`
- `screenshots/dashboard-hr.png`
- `screenshots/dashboard-manager.png`
- `screenshots/dashboard-admin.png`
- `screenshots/dashboard-superadmin.png`

#### 1.2 Design Comparison Matrix

Create a comparison table:

| Element | USER | HR | MANAGER | ADMIN | SUPER_ADMIN | Consistent? |
|---------|------|----|---------| ------|-------------|-------------|
| **Color Scheme** | Slate | Emerald | Blue | Purple | Red | Yes/No |
| **Widget Style** | [describe] | [describe] | [describe] | [describe] | [describe] | Yes/No |
| **Typography** | [font/size] | [font/size] | [font/size] | [font/size] | [font/size] | Yes/No |
| **Button Style** | [describe] | [describe] | [describe] | [describe] | [describe] | Yes/No |
| **Card Shadow** | [describe] | [describe] | [describe] | [describe] | [describe] | Yes/No |
| **Spacing** | [describe] | [describe] | [describe] | [describe] | [describe] | Yes/No |
| **Icons** | [style] | [style] | [style] | [style] | [style] | Yes/No |
| **Layout** | [describe] | [describe] | [describe] | [describe] | [describe] | Yes/No |

#### 1.3 Identify Design Patterns

**Document existing design patterns:**

**Pattern A:** [Describe - e.g., "Modern card-based layout with shadows, rounded corners, Emerald accent"]
- **Used in:** HR Dashboard, Analysis Wizard
- **Characteristics:** [List visual characteristics]

**Pattern B:** [Describe - e.g., "Compact list-based layout, no shadows, sharp corners, Blue accent"]
- **Used in:** MANAGER Dashboard, Reports
- **Characteristics:** [List visual characteristics]

**Pattern C:** [Describe - e.g., "Old design - gradient backgrounds, bold colors, inconsistent spacing"]
- **Used in:** [List pages]
- **Characteristics:** [List visual characteristics]

#### 1.4 Design Inconsistencies Report

**List ALL inconsistencies:**

**Inconsistency 1: Button Styles**
- **Location:** Analysis page (Step 1) vs Dashboard
- **Issue:** Analysis uses rounded-full buttons, Dashboard uses rounded-md
- **Screenshot:** [Ref]
- **Recommendation:** Standardize on rounded-md

**Inconsistency 2: Widget Card Design**
- **Location:** USER dashboard vs ADMIN dashboard
- **Issue:** USER has shadow-lg, ADMIN has shadow-sm
- **Screenshot:** [Ref]
- **Recommendation:** Use shadow-md consistently

[Continue for ALL inconsistencies...]

---

## 📋 PHASE 2: INTEGRATION TESTING (60 min)

### Test: Full Hiring Workflow Across Roles

**Scenario:** HR creates job → HR uploads CVs → HR runs analysis → MANAGER reviews → ADMIN approves offer

#### Step 1: HR Creates Job Posting
- [ ] Login as HR (test-hr_specialist@test-org-2.com)
- [ ] Navigate to Job Postings
- [ ] Create new job: "QA Engineer - Integration Test"
- [ ] Department: Engineering
- [ ] Save
- [ ] **Document:** Job ID = _____
- [ ] Logout

#### Step 2: HR Uploads CVs
- [ ] Login as HR
- [ ] Navigate to CV Upload
- [ ] Upload 5 test CVs
- [ ] **Document:** CV IDs = _____
- [ ] Logout

#### Step 3: HR Runs Analysis
- [ ] Login as HR
- [ ] Navigate to Analysis Wizard
- [ ] Select job: "QA Engineer - Integration Test"
- [ ] Select the 5 CVs uploaded
- [ ] Configure analysis
- [ ] Submit
- [ ] **Wait:** Analysis completes (~70s for 5 CVs)
- [ ] **Document:** Analysis ID = _____
- [ ] Top candidate = _____
- [ ] Logout

#### Step 4: MANAGER Reviews Candidates
- [ ] Login as MANAGER (test-manager@test-org-1.com)
- [ ] Navigate to Candidates
- [ ] **Verify:** Can see Engineering dept candidates (including new ones from Step 3)
- [ ] Select top candidate
- [ ] Add manager note: "Integration test - approved for interview"
- [ ] Change status to "Interview Scheduled"
- [ ] Logout

#### Step 5: ADMIN Creates & Approves Offer (or MANAGER if applicable)
- [ ] Login as ADMIN (test-admin@test-org-2.com)
- [ ] Navigate to Candidates
- [ ] Select the candidate
- [ ] **Verify:** Can see manager's note
- [ ] Create offer (if implemented):
  - Salary: $70,000
  - Start date: 2025-12-01
- [ ] OR Approve existing offer (if workflow different)
- [ ] **Document:** Offer ID = _____
- [ ] Logout

#### Integration Test Evaluation

- [ ] **Did workflow work end-to-end?** Yes/No
- [ ] **Any data loss between steps?** Yes/No (e.g., manager note disappeared)
- [ ] **Any role blocked unexpectedly?** Yes/No
- [ ] **Any console errors during workflow?** List all
- [ ] **Performance:** Total workflow time = _____ min

**Screenshot:** Key steps (job created, analysis results, manager note, offer)

---

## 📋 PHASE 3: PERFORMANCE TESTING (30 min)

### 3.1 Page Load Time Benchmarks

**Test each page as different roles, record load times:**

```python
import time
from test_helper import IKAITestHelper

helper = IKAITestHelper()

# Test as each role
roles = [
    ('test-user@test-org-1.com', 'USER'),
    ('test-hr_specialist@test-org-2.com', 'HR'),
    ('test-manager@test-org-1.com', 'MANAGER'),
    ('test-admin@test-org-2.com', 'ADMIN'),
    ('info@gaiai.ai', 'SUPER_ADMIN')
]

for email, role in roles:
    helper.login(email, 'TestPass123!')
    
    start = time.time()
    response = helper.get('/api/v1/dashboard')
    elapsed = time.time() - start
    
    print(f"{role} Dashboard: {elapsed*1000:.0f} ms")
```

**Create Performance Matrix:**

| Page | USER | HR | MANAGER | ADMIN | SUPER_ADMIN | Average |
|------|------|----|---------| ------|-------------|---------|
| Dashboard | ___ ms | ___ ms | ___ ms | ___ ms | ___ ms | ___ ms |
| Job Postings | N/A | ___ ms | ___ ms | ___ ms | ___ ms | ___ ms |
| Candidates | N/A | ___ ms | ___ ms | ___ ms | ___ ms | ___ ms |
| Analytics | N/A | ___ ms | ___ ms | ___ ms | ___ ms | ___ ms |

### 3.2 Bottleneck Identification

- [ ] **Slowest Page:** _____ (______ ms)
- [ ] **Why slow?** [Hypothesis - large data, complex query, etc.]
- [ ] **Fastest Page:** _____ (______ ms)
- [ ] **Any pages > 2s?** [List]
- [ ] **Recommendation:** [How to optimize]

---

## 📋 PHASE 4: PUBLIC PAGES TESTING (20 min)

### Test Non-Authenticated Pages

#### 4.1 Landing Page (http://localhost:8103)
- [ ] Navigate to landing page (logout first)
- [ ] **Sections:**
  - [ ] Hero section (headline, CTA)
  - [ ] Features section
  - [ ] Pricing section (inline or link)
  - [ ] Testimonials (if any)
  - [ ] Footer (links, contact)
- [ ] **CTAs Working:**
  - [ ] "Get Started" → Signup page
  - [ ] "Login" → Login page
  - [ ] "View Pricing" → Pricing page
- [ ] Console errors: 0
- [ ] **Screenshot:** Full landing page

#### 4.2 Pricing Page
- [ ] Navigate to /pricing
- [ ] **Plans Display:**
  - [ ] FREE (₺0, 10 analyses, 50 CVs, 2 users)
  - [ ] PRO (₺99/ay, 50 analyses, 200 CVs, 10 users)
  - [ ] ENTERPRISE (Contact, unlimited)
- [ ] **CTA:** "Choose Plan" → Signup page
- [ ] Console errors: 0
- [ ] **Screenshot:** Pricing page

#### 4.3 Features Page (if exists)
- [ ] Navigate to /features
- [ ] **Features Listed:**
  - [ ] CV Analysis
  - [ ] AI Chat
  - [ ] Multi-tenant
  - [ ] Usage Tracking
  - [ ] Etc.
- [ ] Console errors: 0
- [ ] **Screenshot:** Features page

#### 4.4 Signup Flow
- [ ] Navigate to /signup
- [ ] **Form Fields:**
  - [ ] Email
  - [ ] Password
  - [ ] Organization Name
  - [ ] Plan Selection
- [ ] **Test:** Fill form (use dummy email)
  - Email: integration-test@example.com
  - Password: TestPass123!
  - Org: Test Integration Org
  - Plan: FREE
- [ ] Submit
- [ ] **Expected:** Signup success OR onboarding wizard starts
- [ ] Console errors: 0
- [ ] **Screenshot:** Signup form + result

---

## 📋 PHASE 5: ERROR AGGREGATION (20 min)

### Collect Console Errors from All Roles

**Use Playwright to collect errors:**

```javascript
const roles = [
    {email: 'test-user@test-org-1.com', name: 'USER'},
    {email: 'test-hr_specialist@test-org-2.com', name: 'HR'},
    {email: 'test-manager@test-org-1.com', name: 'MANAGER'},
    {email: 'test-admin@test-org-2.com', name: 'ADMIN'},
    {email: 'info@gaiai.ai', name: 'SUPER_ADMIN'}
];

for (const role of roles) {
    // Login
    playwright.goto('http://localhost:8103/login');
    playwright.fill('email', role.email);
    playwright.fill('password', 'TestPass123!');
    playwright.click('Login');
    playwright.wait(2000);
    
    // Check errors
    const errors = playwright.console_errors();
    console.log(`${role.name}: ${errors.errorCount} errors`);
    if (errors.errorCount > 0) {
        console.log(errors.errors);
    }
}
```

**Create Error Summary Table:**

| Role | Page | Error Count | Error Types |
|------|------|-------------|-------------|
| USER | Dashboard | 0 | - |
| HR | Dashboard | 2 | [List error messages] |
| HR | Analysis Wizard | 5 | [List] |
| MANAGER | Candidates | 1 | [List] |
| ... | ... | ... | ... |

**Total Console Errors:** _____
**Most Problematic Page:** _____
**Most Problematic Role:** _____

---

## 📋 PHASE 6: DESIGN UNIFICATION PLAN (20 min)

### Recommendation: Unified Design System

**Based on your audit, recommend ONE design pattern for the entire platform.**

#### Recommended Design Pattern

**Pattern Name:** [e.g., "Modern Emerald" or "Compact Blue"]

**Visual Characteristics:**
- **Color Scheme:** [Primary, secondary, accent]
- **Typography:** [Font family, sizes]
- **Buttons:** [Style - rounded-md, shadow, hover effects]
- **Cards/Widgets:** [Border radius, shadow, padding]
- **Spacing:** [Consistent margins, padding scale]
- **Icons:** [Icon library, size, style]

**Why This Pattern:**
- [Reason 1 - e.g., "Most modern, used in newest features"]
- [Reason 2 - e.g., "Best accessibility contrast"]
- [Reason 3 - e.g., "Consistent with brand"]

#### Migration Plan

**Phase 1: High-Priority Pages (1 week)**
- [ ] Dashboard (all roles)
- [ ] Job Postings
- [ ] Candidates

**Phase 2: Medium-Priority Pages (1 week)**
- [ ] Analysis Wizard
- [ ] Reports
- [ ] Settings

**Phase 3: Low-Priority Pages (1 week)**
- [ ] Profile
- [ ] Notifications
- [ ] Help/Docs

**Estimated Total Time:** 3 weeks (1 worker full-time)

---

## 🐛 ISSUE REPORTING

Use standard format (severity, description, repro, screenshot, fix).

Focus on:
1. **Design inconsistencies** (HIGH priority)
2. **Integration bugs** (workflow broken)
3. **Performance bottlenecks** (pages > 2s)
4. **Console errors** (aggregate from all roles)

---

## 📊 REPORT TEMPLATE

```markdown
# E2E Test Report - Cross-Role Integration & Design

**Worker:** W6
**Roles Tested:** All 5 roles
**Date:** 2025-11-05
**Duration:** [X hours]

## 🎯 Executive Summary

### Design Audit
- **Design Patterns Found:** [N]
- **Inconsistencies:** [N]
- **Recommended Pattern:** [Name]

### Integration Testing
- **Workflows Tested:** [N]
- **Workflow Success Rate:** [X/Y passed]
- **Integration Bugs:** [N]

### Performance
- **Average Page Load:** [X ms]
- **Slowest Page:** [Page name, X ms]
- **Pages > 2s:** [N]

### Console Errors
- **Total Errors:** [N]
- **Most Problematic:** [Role/Page]

---

## 🎨 Design Consistency Audit

### Comparison Matrix
[Table comparing all 5 dashboards]

### Design Patterns Found
[List patterns A, B, C with descriptions]

### Design Inconsistencies
[List ALL inconsistencies with screenshots]

---

## 🔗 Integration Testing Results

### Full Hiring Workflow
[Step-by-step results]

**Success:** Yes/No
**Issues:** [List any integration bugs]

---

## ⚡ Performance Benchmarks

### Page Load Time Matrix
[Table of load times for all roles/pages]

### Bottlenecks
[Slowest pages, why, how to fix]

---

## 🌐 Public Pages Audit

### Landing Page
[Results, screenshot, issues]

### Pricing Page
[Results, screenshot, issues]

### Signup Flow
[Results, screenshot, issues]

---

## 🐛 Error Aggregation

### Console Errors by Role
[Table summarizing errors]

### Error Details
[Detailed error messages, repro steps]

---

## 💡 Design Unification Plan

### Recommended Design Pattern
[Description, visual characteristics, why]

### Migration Plan
[Phase 1/2/3, estimated time]

---

## 📸 Screenshots

[All screenshots organized by section]

---

## 💡 Recommendations

### Priority 1: Design Unification
[Action items]

### Priority 2: Integration Fixes
[Action items]

### Priority 3: Performance Optimizations
[Action items]
```

---

**START TESTING! You're the design & integration specialist - find ALL inconsistencies!**
