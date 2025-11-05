# 🧪 E2E Test Task - W3: MANAGER Role

**Worker:** W3
**Role to Test:** MANAGER (Department Manager)
**Test Account:** test-manager@test-org-1.com / TestPass123!
**Organization:** Test Org 1 (FREE plan)
**Duration:** ~3 hours
**Report Location:** `docs/reports/e2e-test-w3-manager-report.md`

---

## 🎯 YOUR MISSION

Test the **MANAGER role** comprehensively. MANAGER has department-level access - reviews candidates, approves offers, views department analytics. Critical: **Data isolation to own department only!**

### Key Focus Areas
1. **Department Data Isolation** - MUST only see own department data
2. **Candidate Review** - Department candidates only
3. **Offer Approval** - Can approve/reject offers for department
4. **Department Analytics** - Performance metrics for department
5. **RBAC** - Cannot access other departments or admin features

---

## 🔐 MANAGER ROLE PERMISSIONS (EXPECTED)

### ✅ SHOULD ACCESS
- Dashboard (MANAGER variant - department metrics)
- Candidate Review (department candidates only)
- Offer Approval/Rejection (department offers only)
- Department Analytics (team performance, hiring metrics)
- Job Postings (view, comment - limited edit)
- Team View (department members only)

### ❌ SHOULD NOT ACCESS
- Other departments' data
- Organization-wide settings
- User role management
- Billing/subscription
- System configuration
- HR-only features (CV upload, create job postings)

### 🔍 CRITICAL VERIFICATION
- **Department Isolation:** Can ONLY see Engineering department data (test-manager belongs to Engineering)
- **Cross-Department Block:** Cannot see Sales, Marketing, HR department data
- **Offer Approval Scope:** Only offers for Engineering candidates

---

## 📋 TESTING CHECKLIST

### 1. Login & Dashboard
- [ ] Login: test-manager@test-org-1.com / TestPass123!
- [ ] Console errors: 0 (playwright.console_errors())
- [ ] **Widgets (MANAGER):**
  - [ ] Department Overview (Engineering only)
  - [ ] Active Candidates (department-only)
  - [ ] Pending Approvals (offers waiting for manager)
  - [ ] Hiring Pipeline (department stages)
  - [ ] Team Performance
- [ ] **Hidden Widgets:**
  - [ ] Org-wide analytics (ADMIN only)
  - [ ] System health
  - [ ] Usage limits
- [ ] **Screenshot:** Dashboard full view

### 2. Department Data Isolation (CRITICAL)

**Test: Can ONLY see Engineering department**

#### Python API Test
```python
from test_helper import IKAITestHelper

helper = IKAITestHelper()
helper.login('test-manager@test-org-1.com', 'TestPass123!')

# Get candidates - should only return Engineering dept
response = helper.get('/api/v1/candidates')
candidates = response.json()

for candidate in candidates:
    print(f"{candidate['name']} - Department: {candidate['department']}")
    # ALL should be "Engineering" - NONE should be "Sales", "Marketing", etc.

# Test: Try to access Sales dept candidate (should fail)
response = helper.get('/api/v1/candidates/sales-candidate-id')
print(f"Cross-dept access: {response.status_code}")  # Expected: 403 or 404
```

#### UI Test
- [ ] Navigate to Candidates
- [ ] **Verify:** Only Engineering candidates visible
- [ ] **Verify:** No Sales, Marketing, HR candidates
- [ ] Check filter options: Department dropdown should be disabled or only show "Engineering"
- [ ] **Screenshot:** Candidate list

#### Database Verification (MOD will verify)
```python
# You document what you see, MOD will re-run this
response = helper.get('/api/v1/candidates?department=Sales')
# Expected: Empty or 403
```

### 3. Candidate Review

- [ ] Navigate to Candidates (Engineering dept)
- [ ] **Candidate List:**
  - [ ] Name, Position, Score, Status
  - [ ] All belong to Engineering jobs
- [ ] Click on a candidate
- [ ] **Candidate Detail Page:**
  - [ ] CV preview
  - [ ] Interview scores
  - [ ] Manager notes section
  - [ ] Status timeline
  - [ ] Actions: Approve, Reject, Request Info
- [ ] **Test:** Add manager note
  - [ ] Write: "Great technical skills, schedule interview"
  - [ ] Save
  - [ ] **Verify:** Note appears in timeline
- [ ] **Test:** Change candidate status
  - [ ] Move to "Interview Scheduled"
  - [ ] **Verify:** Status updated
- [ ] Console errors: 0
- [ ] **Screenshot:** Candidate detail with note

### 4. Offer Approval Workflow

**Test: Approve/Reject offers for department candidates**

#### Find Pending Offers
- [ ] Navigate to Dashboard → Pending Approvals widget
- [ ] OR navigate to Offers page
- [ ] **Verify:** Only Engineering dept offers visible
- [ ] **Expected:** List of offers waiting for manager approval

#### Approve Offer
- [ ] Select an offer
- [ ] Click "Approve"
- [ ] **Expected:** Confirmation dialog
- [ ] Add approval note: "Approved - strong candidate"
- [ ] Confirm
- [ ] **Expected:** Offer status → "Manager Approved"
- [ ] **Verify:** Notification sent (to HR/ADMIN)
- [ ] Console errors: 0
- [ ] **Screenshot:** Approval confirmation

#### Reject Offer
- [ ] Select another offer
- [ ] Click "Reject"
- [ ] **Expected:** Reason required
- [ ] Enter reason: "Overqualified for this position"
- [ ] Confirm
- [ ] **Expected:** Offer status → "Manager Rejected"
- [ ] Console errors: 0
- [ ] **Screenshot:** Rejection form

#### RBAC Test: Cross-Department Offer
```python
# Try to approve Sales dept offer (should fail)
response = helper.post('/api/v1/offers/sales-offer-id/approve', {
    "note": "Trying to approve other dept"
})
print(f"Cross-dept offer approval: {response.status_code}")  # Expected: 403
```

### 5. Department Analytics

- [ ] Navigate to Analytics (or Reports)
- [ ] **Available Reports (MANAGER):**
  - [ ] Department Hiring Pipeline
  - [ ] Time to Hire (department average)
  - [ ] Interview to Offer Ratio
  - [ ] Team Performance (if applicable)
  - [ ] Candidate Source Effectiveness (department)
- [ ] **Hidden Reports:**
  - [ ] Org-wide analytics (ADMIN only)
  - [ ] Financial reports
  - [ ] Usage limits
- [ ] **Generate Report:**
  - [ ] Select "Department Hiring Pipeline"
  - [ ] Date range: Last 30 days
  - [ ] **Expected:** Chart/table showing Engineering candidates by stage
  - [ ] **Verify:** Only Engineering dept data
- [ ] **Performance:** Report generation < 5s
- [ ] **Export Test:** Download CSV
- [ ] **Verify CSV:** Only Engineering data
- [ ] Console errors: 0
- [ ] **Screenshot:** Report view

### 6. Job Postings (Limited Access)

**MANAGER can VIEW and COMMENT, but NOT create/delete**

- [ ] Navigate to Job Postings
- [ ] **Expected:** List of all org job postings (view access)
- [ ] **Verify:** "Create Job Posting" button HIDDEN or DISABLED
- [ ] Click on a job posting
- [ ] **Expected:** View job details
- [ ] **Test:** Try to edit job posting
  - [ ] Expected: Edit button HIDDEN or clicking shows "No permission"
- [ ] **Test:** Add comment/feedback to job posting
  - [ ] Write: "We should emphasize team leadership skills"
  - [ ] Save
  - [ ] **Verify:** Comment appears
- [ ] **RBAC Test (API):**
  ```python
  # Try to create job posting (should fail)
  response = helper.post('/api/v1/job-postings', {
      "title": "Trying to create",
      "description": "Should fail"
  })
  # Expected: 403
  ```
- [ ] Console errors: 0
- [ ] **Screenshot:** Job posting view (no edit button visible)

### 7. Team View (Department Only)

- [ ] Navigate to Team
- [ ] **Expected:** List of Engineering department members only
- [ ] **Columns:** Name, Role, Email, Status
- [ ] **Verify:** Cannot see other department members
- [ ] **Verify:** Cannot change roles (ADMIN only)
- [ ] **Verify:** Cannot delete users (ADMIN only)
- [ ] **Test:** View team member profile (if clickable)
  - [ ] Expected: Basic info only, no edit access
- [ ] Console errors: 0
- [ ] **Screenshot:** Team list

### 8. RBAC Violation Attempts

**Try to access restricted features:**

#### URL Tests
- [ ] `/admin` → 403 or redirect
- [ ] `/settings/organization` → 403 or redirect
- [ ] `/billing` → 403 or redirect
- [ ] `/users/manage` → 403 or redirect
- [ ] `/departments/sales` → 403 or redirect (cross-dept)

#### API Tests
```python
# Try admin actions
response = helper.get('/api/v1/organization')  # 403
response = helper.post('/api/v1/users', {"name": "New User"})  # 403
response = helper.patch('/api/v1/users/123', {"role": "ADMIN"})  # 403

# Try cross-department access
response = helper.get('/api/v1/candidates?department=Sales')  # Empty or 403
response = helper.get('/api/v1/analytics?department=Marketing')  # Empty or 403
```

- [ ] **Screenshot:** 403 error pages

### 9. Performance Testing

- [ ] **Page Load Times:**
  - Dashboard: _____ s
  - Candidates: _____ s
  - Analytics: _____ s
- [ ] **API Response Times:**
  - GET /api/v1/candidates: _____ ms
  - GET /api/v1/offers: _____ ms
  - GET /api/v1/analytics/department: _____ ms
- [ ] **Large Data:**
  - View 50+ candidates (if available)
  - Scroll performance: Smooth? Yes/No

### 10. Design Consistency Audit

- [ ] **Color Scheme:** _____ (expected: Blue for MANAGER)
- [ ] Consistent across pages? Yes/No
- [ ] **Typography:** Consistent? Yes/No
- [ ] **Buttons:** Consistent style? Yes/No
- [ ] **Forms:** Consistent layout? Yes/No
- [ ] **Identify Inconsistencies:** [List any differences]
- [ ] **Screenshot:** Any inconsistent pages

### 11. UX Evaluation

**Positive:**
- [ ] [What works well for MANAGER role]

**Needs Improvement:**
- [ ] [Confusing elements]
- [ ] [Missing features]
- [ ] [Unclear workflows]

### 12. Console Errors

```bash
playwright.console_errors() → errorCount = ?
```

- [ ] If > 0, list ALL errors with screenshots
- [ ] Network errors? (F12 → Network tab)
- [ ] UI bugs? (broken layouts, overlaps)

---

## 🐛 ISSUE REPORTING

Use standard format (see master plan):
- Severity: CRITICAL/HIGH/MEDIUM/LOW
- Description + Repro steps
- Expected vs Actual behavior
- Screenshot + Console output
- Suggested fix

---

## ⚠️ CRITICAL REMINDERS

1. **Department Isolation:** MOST IMPORTANT! Verify can ONLY see Engineering dept
2. **Zero Console Errors:** errorCount MUST = 0
3. **Offer Approval:** Test both approve and reject flows
4. **RBAC:** Try to access other departments (should fail)
5. **Honest Reporting:** Do NOT fake results

---

## 📊 REPORT TEMPLATE

```markdown
# E2E Test Report - MANAGER Role

**Worker:** W3
**Role:** MANAGER
**Account:** test-manager@test-org-1.com
**Organization:** Test Org 1
**Department:** Engineering
**Plan:** FREE
**Date:** 2025-11-05
**Duration:** [X hours]

## 🎯 Executive Summary
- Total Issues: [N]
- Critical: [N] (esp. cross-department access violations!)
- Department Isolation: PASS/FAIL
- Console Errors: [N]

## 🐛 Issues Found
[Use standard format]

## 🎨 UX Evaluation
[Positive + Improvements]

## ⚡ Performance
[Load times, API response times]

## ✅ RBAC Verification
| Feature | Should Access | Can Access | Status |
|---------|---------------|------------|--------|
| Engineering Candidates | ✅ | ? | ? |
| Sales Candidates | ❌ | ? | ? |
| Offer Approval (Engineering) | ✅ | ? | ? |
| Offer Approval (Sales) | ❌ | ? | ? |
| Admin Panel | ❌ | ? | ? |

## 📸 Screenshots
[All relevant screenshots]

## 💡 Recommendations
[Priority fixes]
```

---

**START TESTING! Focus on department isolation - this is CRITICAL for MANAGER role!**
