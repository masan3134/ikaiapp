# 🧪 E2E Test Task - W4: ADMIN Role

**Worker:** W4
**Role to Test:** ADMIN (Organization Administrator)
**Test Account:** test-admin@test-org-2.com / TestPass123!
**Organization:** Test Org 2 (PRO plan)
**Duration:** ~4 hours
**Report Location:** `docs/reports/e2e-test-w4-admin-report.md`

---

## 🎯 YOUR MISSION

Test the **ADMIN role** - full organization management. ADMIN has the highest org-level permissions (except SUPER_ADMIN). Critical areas: user management, billing, org settings, full analytics.

### Key Focus
1. **Full Org Access** - All departments, all data within org
2. **User/Role Management** - Create, edit, delete users + assign roles
3. **Billing & Subscription** - View usage, manage plan
4. **Organization Settings** - Configure org-wide settings
5. **RBAC** - Cannot access SUPER_ADMIN features (multi-org, system health)

---

## 🔐 ADMIN ROLE PERMISSIONS

### ✅ SHOULD ACCESS
- Dashboard (ADMIN variant - org-wide metrics)
- Full job posting management (all departments)
- Full candidate management (all departments)
- User Management (create, edit, delete, assign roles)
- Team Management (full access)
- Organization Settings
- Billing & Subscription (view/manage plan)
- Usage Analytics (org-level)
- All Reports (org-wide)
- Onboarding configuration

### ❌ SHOULD NOT ACCESS
- Other organizations' data (org isolation)
- System Health (SUPER_ADMIN only)
- Global Analytics (SUPER_ADMIN only)
- Multi-org management (SUPER_ADMIN only)
- Queue Management (SUPER_ADMIN only)

---

## 📋 TESTING CHECKLIST

### 1. Dashboard (ADMIN)
- [ ] Login: test-admin@test-org-2.com / TestPass123!
- [ ] Console errors: 0
- [ ] **Widgets:**
  - [ ] Org Overview (all departments)
  - [ ] Total Users (org-wide)
  - [ ] Usage Limits (50 analyses, 200 CVs for PRO)
  - [ ] Active Job Postings (all depts)
  - [ ] Hiring Pipeline (org-wide)
  - [ ] Recent Activity
- [ ] **Screenshot:** Dashboard

### 2. User Management (CRITICAL)

#### View Users
- [ ] Navigate to Users/Team Management
- [ ] **Verify:** All Test Org 2 users visible
- [ ] **Verify:** Cannot see Test Org 1 users (org isolation)
- [ ] **Columns:** Name, Email, Role, Department, Status

#### Create User
- [ ] Click "Invite User" or "Create User"
- [ ] **Form:**
  ```
  Email: new-test-user@test-org-2.com
  Name: Test New User
  Role: USER
  Department: Engineering
  ```
- [ ] Submit
- [ ] **Expected:** User created, invite email sent (?)
- [ ] **Verify:** New user in list
- [ ] Console errors: 0
- [ ] **Screenshot:** Create user form

#### Edit User Role
- [ ] Select a USER
- [ ] Click "Edit" or "Change Role"
- [ ] Change role: USER → HR_SPECIALIST
- [ ] Save
- [ ] **Expected:** Role updated
- [ ] **Verify:** User now has HR_SPECIALIST role
- [ ] Console errors: 0

#### Delete User
- [ ] Select the user you just created
- [ ] Click "Delete"
- [ ] **Expected:** Confirmation dialog
- [ ] Confirm
- [ ] **Expected:** User removed
- [ ] Console errors: 0

#### RBAC Test: Cross-Org User Management
```python
# Try to edit Test Org 1 user (should fail)
response = helper.patch('/api/v1/users/test-org-1-user-id', {
    "role": "ADMIN"
})
# Expected: 403 or 404
```

### 3. Organization Settings

- [ ] Navigate to Settings → Organization
- [ ] **Editable Fields:**
  - [ ] Organization Name
  - [ ] Logo
  - [ ] Timezone
  - [ ] Default Language
  - [ ] Email Templates
  - [ ] Notification Preferences
- [ ] **Test:** Change org name
  - [ ] Change to "Test Org 2 - Updated"
  - [ ] Save
  - [ ] **Verify:** Name updated in dashboard
- [ ] Console errors: 0
- [ ] **Screenshot:** Org settings page

### 4. Billing & Subscription (PRO Plan)

- [ ] Navigate to Billing (or Subscription)
- [ ] **Current Plan:** PRO
- [ ] **Display:**
  - [ ] Plan name: PRO
  - [ ] Price: ₺99/ay
  - [ ] Limits: 50 analyses, 200 CVs, 10 users
  - [ ] Current usage: X/50 analyses, Y/200 CVs, Z/10 users
  - [ ] Billing cycle
  - [ ] Payment method (if applicable)
- [ ] **Test:** View upgrade options
  - [ ] Click "Upgrade to ENTERPRISE"
  - [ ] **Expected:** Shows ENTERPRISE features + contact form
- [ ] **Test:** View invoices (if any)
  - [ ] Navigate to Invoices
  - [ ] **Expected:** List of past invoices
- [ ] Console errors: 0
- [ ] **Screenshot:** Billing page

### 5. Usage Limits Verification (PRO Plan)

**Critical: Verify PRO plan limits enforced**

- [ ] Navigate to Dashboard → Usage Widget
- [ ] **Verify Display:**
  - Analyses: X / 50
  - CVs: Y / 200
  - Users: Z / 10
- [ ] **Test (if possible):** Try to exceed limit
  - Try to create 51st analysis → Error message
  - Try to upload 201st CV → Error message
  - Try to add 11th user → Error message
- [ ] **API Test:**
  ```python
  # Check usage via API
  response = helper.get('/api/v1/usage')
  usage = response.json()
  print(f"Analyses: {usage['analysesUsed']}/{usage['analysesLimit']}")
  print(f"CVs: {usage['cvsUsed']}/{usage['cvsLimit']}")
  ```
- [ ] Console errors: 0
- [ ] **Screenshot:** Usage limits widget

### 6. Full Org Analytics

- [ ] Navigate to Reports/Analytics
- [ ] **Available Reports (ADMIN):**
  - [ ] Org-wide Hiring Pipeline
  - [ ] Time to Hire (org average)
  - [ ] Cost per Hire (if applicable)
  - [ ] Department Comparison
  - [ ] User Activity
  - [ ] Usage Trends (analyses/CVs over time)
- [ ] **Generate Report:**
  - [ ] Select "Org-wide Hiring Pipeline"
  - [ ] Date range: Last 3 months
  - [ ] **Expected:** Chart showing all departments' candidates
  - [ ] **Verify:** All departments included (Engineering, Sales, Marketing, HR)
- [ ] **Performance:** Report generation < 5s
- [ ] Console errors: 0
- [ ] **Screenshot:** Analytics dashboard

### 7. Job Postings (Full CRUD, All Departments)

- [ ] Navigate to Job Postings
- [ ] **Verify:** Can see all departments' job postings
- [ ] **Test:** Create job posting for different department
  - [ ] Title: "Sales Manager"
  - [ ] Department: Sales
  - [ ] Save
  - [ ] **Verify:** Job created for Sales dept
- [ ] **Test:** Edit another department's job
  - [ ] Select an Engineering job
  - [ ] Edit description
  - [ ] Save
  - [ ] **Verify:** Changes saved
- [ ] **Test:** Delete job posting
  - [ ] Delete the Sales Manager job
  - [ ] **Verify:** Job removed
- [ ] Console errors: 0

### 8. Candidate Management (All Departments)

- [ ] Navigate to Candidates
- [ ] **Verify:** Can see ALL departments' candidates
- [ ] **Filter Test:**
  - [ ] Filter by Department: Engineering → Only Engineering candidates
  - [ ] Filter by Department: Sales → Only Sales candidates
  - [ ] Filter by Status: Interview → Only interview-stage candidates
- [ ] **Test:** View cross-department candidate
  - [ ] Click on a Sales candidate (even though you're in different dept)
  - [ ] **Expected:** Can view full details (ADMIN privilege)
- [ ] Console errors: 0

### 9. RBAC Violation Attempts

**Try SUPER_ADMIN features:**

#### URL Tests
- [ ] `/super-admin` → 403 or redirect
- [ ] `/system-health` → 403 or redirect
- [ ] `/organizations` → 403 or redirect (multi-org view)
- [ ] `/queue-management` → 403 or redirect

#### API Tests
```python
# Try to access other org's data
response = helper.get('/api/v1/organizations')  # Should fail or only show own org
response = helper.get('/api/v1/system/health')  # 403
response = helper.get('/api/v1/queue/stats')  # 403

# Try to access Test Org 1 data
response = helper.get('/api/v1/candidates?organizationId=test-org-1')  # Empty or 403
```

- [ ] **Screenshot:** 403 errors

### 10. Onboarding Configuration (ADMIN Feature)

- [ ] Navigate to Settings → Onboarding
- [ ] **Expected:** Onboarding wizard configuration
- [ ] **Settings:**
  - [ ] Enable/disable onboarding for new users
  - [ ] Customize onboarding steps
  - [ ] Default department
  - [ ] Welcome message
- [ ] **Test:** Update onboarding settings
  - [ ] Change welcome message
  - [ ] Save
  - [ ] **Verify:** Settings updated
- [ ] Console errors: 0
- [ ] **Screenshot:** Onboarding config

### 11. Performance Testing

- [ ] **Page Load Times:**
  - Dashboard: _____ s
  - User Management: _____ s
  - Analytics: _____ s
  - Billing: _____ s
- [ ] **API Response Times:**
  - GET /api/v1/users: _____ ms
  - GET /api/v1/usage: _____ ms
  - GET /api/v1/analytics/org: _____ ms

### 12. Design Consistency

- [ ] **Color Scheme:** _____ (expected: Purple for ADMIN)
- [ ] Consistent? Yes/No
- [ ] **Identify Inconsistencies:** [List]
- [ ] **Screenshot:** Inconsistent pages

### 13. Console Errors

```bash
playwright.console_errors() → errorCount = ?
```

- [ ] If > 0, list ALL errors with screenshots

---

## 🐛 CRITICAL BUGS TO CHECK

1. **User Role Change:** Can ADMIN assign SUPER_ADMIN role? (Should NOT be possible!)
2. **Cross-Org Access:** Can see/edit Test Org 1 data? (Should be blocked!)
3. **Usage Limits:** PRO limits enforced correctly?
4. **Billing:** Can access/modify billing? (Should have full access)

---

## 📊 REPORT TEMPLATE

```markdown
# E2E Test Report - ADMIN Role

**Worker:** W4
**Role:** ADMIN
**Account:** test-admin@test-org-2.com
**Organization:** Test Org 2
**Plan:** PRO
**Date:** 2025-11-05

## 🎯 Executive Summary
- Total Issues: [N]
- Critical: [N]
- User Management: PASS/FAIL
- Org Isolation: PASS/FAIL
- Usage Limits: PASS/FAIL
- Console Errors: [N]

## 🐛 Issues Found
[Standard format]

## ✅ RBAC Verification
| Feature | Should Access | Can Access | Status |
|---------|---------------|------------|--------|
| User Management (Own Org) | ✅ | ? | ? |
| User Management (Other Org) | ❌ | ? | ? |
| Billing (Own Org) | ✅ | ? | ? |
| System Health | ❌ | ? | ? |
| Multi-Org View | ❌ | ? | ? |

## 📸 Screenshots
[All screenshots]

## 💡 Recommendations
[Priority fixes]
```

---

**START TESTING! Focus on user management and org isolation!**
