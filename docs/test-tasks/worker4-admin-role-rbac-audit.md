# 🔍 Worker Task: ADMIN Role RBAC Comprehensive Audit & Fix

**Task ID:** W4-ADMIN-RBAC-AUDIT
**Assigned To:** Worker #4
**Created:** 2025-11-04
**Estimated Time:** 3-4 hours
**Priority:** HIGH

---

## 🎯 Mission Statement

**Login as ADMIN role and audit the ENTIRE application.**

**Your job:**
1. ✅ **Test what ADMIN CAN access** → Verify it works properly (nearly everything in own org!)
2. ❌ **Test what ADMIN CANNOT access** → Verify blocked correctly (SUPER_ADMIN only features)
3. 🐛 **Find RBAC bugs** → If ADMIN sees SUPER_ADMIN stuff OR can't access org admin features, FIX IT
4. 🐛 **Find missing features** → If ADMIN can't do org management, FIX IT

**Critical Rule:** USE REAL BROWSER TESTING + API TESTING. NO SIMULATION!

---

## 📋 Test Credentials

**Login as ADMIN role:**
- **Email:** test-admin@test-org-1.com
- **Password:** TestPass123!
- **Organization:** Test Organization Free (Org 1)
- **Role:** ADMIN

**Alternative test users (if needed):**
- Org 2 ADMIN: test-admin@test-org-2.com / TestPass123!
- Org 3 ADMIN: test-admin@test-org-3.com / TestPass123!

**SUPER_ADMIN access (for comparison):**
- SUPER_ADMIN: info@gaiai.ai / 23235656

**Lower roles (for comparison):**
- Org 1 MANAGER: test-manager@test-org-1.com / TestPass123!
- Org 1 HR_SPECIALIST: test-hr_specialist@test-org-1.com / TestPass123!

---

## 📊 ADMIN Role Overview

**ADMIN is in multiple role groups:**

**1. RoleGroups.ADMINS** (admin privileges):
- SUPER_ADMIN ✅
- ADMIN ✅ ← **THIS ROLE**

**2. RoleGroups.MANAGERS_PLUS** (delete operations):
- SUPER_ADMIN ✅
- ADMIN ✅ ← **THIS ROLE**
- MANAGER ✅

**3. RoleGroups.HR_MANAGERS** (HR operations):
- SUPER_ADMIN ✅
- ADMIN ✅ ← **THIS ROLE**
- MANAGER ✅
- HR_SPECIALIST ✅

**4. RoleGroups.ANALYTICS_VIEWERS** (view analytics):
- SUPER_ADMIN ✅
- ADMIN ✅ ← **THIS ROLE**
- MANAGER ✅

**ADMIN = MANAGER + Full Delete + Team Management + Org Settings + Billing**

---

## 🎯 What ADMIN SHOULD Do

**All MANAGER permissions PLUS:**

### ✅ ADMIN CAN (Full Org Control):
- ✅ **All MANAGER permissions:**
  - All HR operations (create/edit/view)
  - View analytics
  - Delete offers/interviews
  - View team
- ✅ **Full DELETE permissions (ALL HR data):**
  - Delete job postings ✅ (ADMIN only, MANAGER cannot)
  - Delete candidates ✅ (ADMIN only)
  - Delete analyses ✅ (ADMIN only)
  - Delete offers ✅ (MANAGER can too)
  - Delete interviews ✅ (MANAGER can too)
- ✅ **Team Management (full control):**
  - Invite team members ✅
  - Edit team member roles ✅
  - Remove team members ✅
- ✅ **Organization Settings:**
  - View/edit org profile ✅
  - Update org info (name, industry, etc.) ✅
- ✅ **Billing (plan management):**
  - View current plan ✅
  - View usage stats ✅
  - Upgrade/downgrade plan ✅ (if feature exists)

### ❌ ADMIN CANNOT (SUPER_ADMIN only):
- ❌ Access other organizations' data (multi-tenant isolation)
- ❌ Access super admin panel (`/super-admin`)
- ❌ Switch between organizations (SUPER_ADMIN only)
- ❌ System-wide settings (SUPER_ADMIN only)
- ❌ View queue health across all orgs (SUPER_ADMIN only)

---

## 🆚 Role Comparison (Full Matrix)

| Permission | USER | HR_SPECIALIST | MANAGER | ADMIN | SUPER_ADMIN |
|------------|------|---------------|---------|-------|-------------|
| **HR Operations** |
| View HR data | ❌ | ✅ | ✅ | ✅ | ✅ |
| Create HR data | ❌ | ✅ | ✅ | ✅ | ✅ |
| Edit HR data | ❌ | ✅ | ✅ | ✅ | ✅ |
| **Delete Operations** |
| Delete job postings | ❌ | ❌ | ❌ | ✅ | ✅ |
| Delete candidates | ❌ | ❌ | ❌ | ✅ | ✅ |
| Delete analyses | ❌ | ❌ | ❌ | ✅ | ✅ |
| Delete offers | ❌ | ❌ | ✅ | ✅ | ✅ |
| Delete interviews | ❌ | ❌ | ✅ | ✅ | ✅ |
| **Analytics** |
| View analytics | ❌ | ❌ | ✅ | ✅ | ✅ |
| **Team Management** |
| View team | ❌ | ❌ | ✅ (read) | ✅ (full) | ✅ (all orgs) |
| Invite team | ❌ | ❌ | ❌ | ✅ | ✅ |
| Edit team roles | ❌ | ❌ | ❌ | ✅ | ✅ |
| Remove team | ❌ | ❌ | ❌ | ✅ | ✅ |
| **Organization** |
| View org settings | ❌ | ❌ | ❌ | ✅ | ✅ (all orgs) |
| Edit org settings | ❌ | ❌ | ❌ | ✅ | ✅ (all orgs) |
| View billing | ❌ | ❌ | ❌ | ✅ | ✅ (all orgs) |
| Manage billing | ❌ | ❌ | ❌ | ✅ | ✅ (all orgs) |
| **System** |
| Super admin panel | ❌ | ❌ | ❌ | ❌ | ✅ |
| Cross-org access | ❌ | ❌ | ❌ | ❌ | ✅ |
| Queue health | ❌ | ❌ | ❌ | ❌ | ✅ |

**ADMIN = Full control within own organization (cannot access other orgs)**

---

## 🧪 Testing Methodology

### Phase 1: Frontend Pages Audit (30 pages)

**For EACH page below:**

1. **Login as ADMIN** (test-admin@test-org-1.com)
2. **Navigate to page**
3. **Check result:**
   - ✅ Page loads → Document
   - ❌ Blocked → BUG if ADMIN should access
4. **Document findings**

**Pages to test (30 total):**

#### Core Pages (8)
- `/dashboard` ← ADMIN SHOULD ACCESS (full dashboard)
- `/job-postings` ← ADMIN SHOULD ACCESS (full CRUD)
- `/candidates` ← ADMIN SHOULD ACCESS (full CRUD)
- `/analyses` ← ADMIN SHOULD ACCESS (full CRUD)
- `/offers` ← ADMIN SHOULD ACCESS (full CRUD)
- `/interviews` ← ADMIN SHOULD ACCESS (full CRUD)
- `/team` ← ADMIN SHOULD ACCESS (full management) 🆕
- `/super-admin` ← ADMIN SHOULD NOT ACCESS (SUPER_ADMIN only)

#### Offers Sub-Pages (6)
- `/offers/new` ← SHOULD ACCESS
- `/offers/wizard` ← SHOULD ACCESS
- `/offers/analytics` ← SHOULD ACCESS (ANALYTICS_VIEWERS)
- `/offers/templates` ← SHOULD ACCESS
- `/offers/templates/new` ← SHOULD ACCESS
- `/offers/templates/categories` ← SHOULD ACCESS

#### Settings Pages (6)
- `/settings/overview` ← SHOULD ACCESS
- `/settings/profile` ← SHOULD ACCESS
- `/settings/notifications` ← SHOULD ACCESS
- `/settings/security` ← SHOULD ACCESS
- `/settings/organization` ← SHOULD ACCESS (ADMIN only!) 🆕
- `/settings/billing` ← SHOULD ACCESS (ADMIN only!) 🆕

#### Notifications (2)
- `/notifications` ← SHOULD ACCESS
- `/notifications/notifications` ← SHOULD ACCESS

#### Wizard Pages (2)
- `/wizard` ← SHOULD ACCESS
- `/onboarding` ← SHOULD ACCESS

#### Dynamic Pages (6)
- `/candidates/[id]` ← SHOULD ACCESS
- `/analyses/[id]` ← SHOULD ACCESS
- `/offers/[id]` ← SHOULD ACCESS
- `/offers/[id]/revisions` ← SHOULD ACCESS
- `/offers/templates/[id]` ← SHOULD ACCESS
- `/offers/templates/[id]/edit` ← SHOULD ACCESS

---

### Phase 2: Backend API Audit (35 key endpoints)

**Get ADMIN token:**
```bash
curl -X POST http://localhost:8102/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test-admin@test-org-1.com","password":"TestPass123!"}'
```

**Endpoints to test:**

#### Job Postings (5) - FULL CRUD INCLUDING DELETE! 🎯
- `GET /api/v1/job-postings` ← SHOULD BE 200
- `POST /api/v1/job-postings` ← SHOULD BE 200
- `GET /api/v1/job-postings/:id` ← SHOULD BE 200
- `PATCH /api/v1/job-postings/:id` ← SHOULD BE 200
- `DELETE /api/v1/job-postings/:id` ← SHOULD BE 200 (ADMIN CAN DELETE!)

#### Candidates (5) - FULL CRUD INCLUDING DELETE! 🎯
- `GET /api/v1/candidates` ← SHOULD BE 200
- `POST /api/v1/candidates` ← SHOULD BE 200
- `GET /api/v1/candidates/:id` ← SHOULD BE 200
- `PATCH /api/v1/candidates/:id` ← SHOULD BE 200
- `DELETE /api/v1/candidates/:id` ← SHOULD BE 200 (ADMIN CAN DELETE!)

#### Analyses (4) - FULL CRUD INCLUDING DELETE! 🎯
- `GET /api/v1/analyses` ← SHOULD BE 200
- `POST /api/v1/analyses` ← SHOULD BE 200
- `GET /api/v1/analyses/:id` ← SHOULD BE 200
- `DELETE /api/v1/analyses/:id` ← SHOULD BE 200 (ADMIN CAN DELETE!)

#### Offers (5) - FULL CRUD
- `GET /api/v1/offers` ← SHOULD BE 200
- `POST /api/v1/offers` ← SHOULD BE 200
- `GET /api/v1/offers/:id` ← SHOULD BE 200
- `PATCH /api/v1/offers/:id` ← SHOULD BE 200
- `DELETE /api/v1/offers/:id` ← SHOULD BE 200

#### Interviews (4) - FULL CRUD
- `GET /api/v1/interviews` ← SHOULD BE 200
- `POST /api/v1/interviews` ← SHOULD BE 200
- `GET /api/v1/interviews/:id` ← SHOULD BE 200
- `DELETE /api/v1/interviews/:id` ← SHOULD BE 200

#### Analytics (3)
- `GET /api/v1/analytics/offers` ← SHOULD BE 200
- `GET /api/v1/analytics/pipeline` ← SHOULD BE 200
- `GET /api/v1/analytics/recruitment` ← SHOULD BE 200

#### Team (5) - FULL MANAGEMENT! 🎯
- `GET /api/v1/team` ← SHOULD BE 200
- `POST /api/v1/team/invite` ← SHOULD BE 200 (ADMIN CAN INVITE!)
- `PATCH /api/v1/team/:id` ← SHOULD BE 200 (ADMIN CAN EDIT ROLES!)
- `DELETE /api/v1/team/:id` ← SHOULD BE 200 (ADMIN CAN REMOVE!)
- `GET /api/v1/team/:id` ← SHOULD BE 200

#### Organization (3) - ADMIN ACCESS! 🎯
- `GET /api/v1/organization` ← SHOULD BE 200 (ADMIN can view own org)
- `PATCH /api/v1/organization` ← SHOULD BE 200 (ADMIN can edit own org)
- `GET /api/v1/organization/usage` ← SHOULD BE 200 (view usage stats)

#### Billing (2) - ADMIN ACCESS! 🎯
- `GET /api/v1/billing` ← SHOULD BE 200 (view plan & billing)
- `POST /api/v1/billing/upgrade` ← SHOULD BE 200 (if feature exists)

#### System (2) - SHOULD BE BLOCKED! ❌
- `GET /api/v1/queue/health` ← SHOULD BE 403 (SUPER_ADMIN only)
- `GET /api/v1/system/config` ← SHOULD BE 403 (if exists, SUPER_ADMIN only)

---

### Phase 3: UI Element Visibility Audit

**Login as ADMIN and check UI elements:**

#### Sidebar Menu Items
**Expected for ADMIN:**
- ✅ Dashboard
- ✅ Job Postings
- ✅ Candidates
- ✅ Analyses
- ✅ Offers
- ✅ Interviews
- ✅ Team
- ✅ Analytics
- ✅ Notifications
- ✅ Settings (with Organization + Billing tabs!) 🆕
- ❌ Super Admin (hidden, SUPER_ADMIN only)

**Expected count:** ~10 sidebar items (same as MANAGER)

**BUT: Settings has MORE tabs (Organization, Billing)**

---

#### Dashboard Widgets
**Expected for ADMIN:**
- ✅ Full HR pipeline stats
- ✅ Analytics charts
- ✅ Team overview
- ✅ **Organization stats** (plan, usage limits, team size) 🆕
- ✅ **Billing alerts** (if usage approaching limits) 🆕
- ✅ All action buttons

---

#### Action Buttons - ALL DELETE BUTTONS VISIBLE! 🎯

**ADMIN sees DELETE on EVERYTHING:**

**1. Job Postings page:**
- ✅ "Create" button
- ✅ "Edit" buttons
- ✅ **"Delete" buttons (ADMIN can delete!)** 🆕

**2. Candidates page:**
- ✅ "Add Candidate" button
- ✅ "Edit" buttons
- ✅ **"Delete" buttons (ADMIN can delete!)** 🆕

**3. Analyses page:**
- ✅ "New Analysis" button
- ✅ **"Delete" buttons (ADMIN can delete!)** 🆕

**4. Offers page:**
- ✅ "Create Offer" button
- ✅ "Edit" buttons
- ✅ "Delete" buttons (ADMIN + MANAGER)
- ✅ "Analytics" link

**5. Interviews page:**
- ✅ "Schedule Interview" button
- ✅ "Edit" buttons
- ✅ "Delete" buttons (ADMIN + MANAGER)

**6. Team page:**
- ✅ **"Invite User" button (ADMIN only!)** 🆕
- ✅ **"Edit Role" buttons (ADMIN only!)** 🆕
- ✅ **"Remove" buttons (ADMIN only!)** 🆕

---

### Phase 4: DELETE Operations Testing (ALL 5!) 🎯

**ADMIN can delete EVERYTHING in own org!**

#### Test 1: Delete Job Posting (SHOULD SUCCEED) 🎯
```python
python3 -i scripts/test-helper.py

>>> helper = IKAITestHelper()
>>> helper.login("test-admin@test-org-1.com", "TestPass123!")

# Get a job posting ID
>>> result = helper.get("/api/v1/job-postings")
>>> job_id = result.json()["data"][0]["id"]

# DELETE (should succeed for ADMIN!)
>>> result = helper.delete(f"/api/v1/job-postings/{job_id}")
>>> print(result.status_code)  # Expected: 200 or 204
```

**Expected:** 200/204 Success

**Compare with MANAGER (should get 403):**
```python
>>> helper.login("test-manager@test-org-1.com", "TestPass123!")
>>> result = helper.delete(f"/api/v1/job-postings/{job_id}")
>>> print(result.status_code)  # Expected: 403
```

---

#### Test 2: Delete Candidate (SHOULD SUCCEED) 🎯
```python
>>> helper.login("test-admin@test-org-1.com", "TestPass123!")
>>> result = helper.get("/api/v1/candidates")
>>> candidate_id = result.json()["data"][0]["id"]

>>> result = helper.delete(f"/api/v1/candidates/{candidate_id}")
>>> print(result.status_code)  # Expected: 200/204
```

**Expected:** 200/204 Success

---

#### Test 3: Delete Analysis (SHOULD SUCCEED) 🎯
```python
>>> result = helper.get("/api/v1/analyses")
>>> analysis_id = result.json()["data"][0]["id"]

>>> result = helper.delete(f"/api/v1/analyses/{analysis_id}")
>>> print(result.status_code)  # Expected: 200/204
```

**Expected:** 200/204 Success

---

#### Test 4: Delete Offer (SHOULD SUCCEED)
```python
>>> result = helper.get("/api/v1/offers")
>>> offer_id = result.json()["data"][0]["id"]

>>> result = helper.delete(f"/api/v1/offers/{offer_id}")
>>> print(result.status_code)  # Expected: 200/204
```

**Expected:** 200/204 Success (ADMIN + MANAGER can both delete)

---

#### Test 5: Delete Interview (SHOULD SUCCEED)
```python
>>> result = helper.get("/api/v1/interviews")
>>> interview_id = result.json()["data"][0]["id"]

>>> result = helper.delete(f"/api/v1/interviews/{interview_id}")
>>> print(result.status_code)  # Expected: 200/204
```

**Expected:** 200/204 Success

---

### Phase 5: Team Management Testing (CRITICAL!) 🎯

**ADMIN has FULL team control (vs MANAGER read-only).**

#### Test 1: Invite Team Member (SHOULD SUCCEED) 🎯
```python
>>> helper.login("test-admin@test-org-1.com", "TestPass123!")

>>> result = helper.post("/api/v1/team/invite", json={
...   "email": "newmember@test-org-1.com",
...   "role": "HR_SPECIALIST",
...   "name": "New HR Specialist"
... })
>>> print(result.status_code)  # Expected: 200 or 201
>>> print(result.json())
```

**Expected:** 200/201 Success

**Compare with MANAGER (should get 403):**
```python
>>> helper.login("test-manager@test-org-1.com", "TestPass123!")
>>> result = helper.post("/api/v1/team/invite", json={"email": "test@test.com", "role": "USER"})
>>> print(result.status_code)  # Expected: 403
```

---

#### Test 2: Edit Team Member Role (SHOULD SUCCEED) 🎯
```python
>>> helper.login("test-admin@test-org-1.com", "TestPass123!")

# Get a team member
>>> result = helper.get("/api/v1/team")
>>> member = result.json()["data"][0]
>>> member_id = member["id"]

# Change role (e.g., USER → HR_SPECIALIST)
>>> result = helper.patch(f"/api/v1/team/{member_id}", json={
...   "role": "HR_SPECIALIST"
... })
>>> print(result.status_code)  # Expected: 200
```

**Expected:** 200 Success

---

#### Test 3: Remove Team Member (SHOULD SUCCEED) 🎯
```python
# Remove the invited member
>>> result = helper.get("/api/v1/team")
>>> invited_member = [m for m in result.json()["data"] if m["email"] == "newmember@test-org-1.com"][0]
>>> member_id = invited_member["id"]

>>> result = helper.delete(f"/api/v1/team/{member_id}")
>>> print(result.status_code)  # Expected: 200 or 204
```

**Expected:** 200/204 Success

---

### Phase 6: Organization Settings Testing (CRITICAL!) 🎯

**ADMIN can view/edit own organization settings.**

#### Test 1: View Organization (SHOULD SUCCEED) 🎯
```python
>>> helper.login("test-admin@test-org-1.com", "TestPass123!")

>>> result = helper.get("/api/v1/organization")
>>> print(result.status_code)  # Expected: 200
>>> org_data = result.json()
>>> print(org_data)
```

**Expected:** 200 Success

**Data should include:**
- Organization name
- Slug
- Industry
- Plan (FREE/PRO/ENTERPRISE)
- Usage limits
- Team size

---

#### Test 2: Edit Organization (SHOULD SUCCEED) 🎯
```python
>>> result = helper.patch("/api/v1/organization", json={
...   "name": "Updated Org Name",
...   "industry": "Finance"
... })
>>> print(result.status_code)  # Expected: 200
```

**Expected:** 200 Success

**Verify change:**
```python
>>> result = helper.get("/api/v1/organization")
>>> print(result.json()["name"])  # Should be "Updated Org Name"
```

---

#### Test 3: View Usage Stats (SHOULD SUCCEED) 🎯
```python
>>> result = helper.get("/api/v1/organization/usage")
>>> print(result.status_code)  # Expected: 200
>>> usage = result.json()
>>> print(usage)
```

**Expected:** 200 Success

**Data should include:**
- Analyses this month / limit
- CVs uploaded this month / limit
- Team members / limit

---

#### Test 4: Frontend Settings Page
**Navigate to:** `/settings/organization`

**Expected:**
- ✅ Page loads (ADMIN only access)
- ✅ Organization name editable
- ✅ Industry dropdown
- ✅ Current plan displayed
- ✅ "Save Changes" button

**Compare with MANAGER (should get 403):**
```
Login as MANAGER → Try /settings/organization → Should redirect to 403
```

---

### Phase 7: Billing Testing (CRITICAL!) 🎯

**ADMIN can view billing info and current plan.**

#### Test 1: View Billing (SHOULD SUCCEED) 🎯
```python
>>> result = helper.get("/api/v1/billing")
>>> print(result.status_code)  # Expected: 200
>>> billing = result.json()
>>> print(billing)
```

**Expected:** 200 Success

**Data should include:**
- Current plan (FREE/PRO/ENTERPRISE)
- Price (₺0, ₺99/mo, Custom)
- Limits (analyses, CVs, users)
- Next billing date (if applicable)

---

#### Test 2: Frontend Billing Page
**Navigate to:** `/settings/billing`

**Expected:**
- ✅ Page loads (ADMIN only)
- ✅ Current plan displayed
- ✅ Usage stats visible
- ✅ "Upgrade Plan" button (if on FREE/PRO)
- ❌ "Downgrade" button (if on ENTERPRISE)

**Compare with MANAGER (should get 403):**
```
Login as MANAGER → Try /settings/billing → 403
```

---

### Phase 8: Multi-Tenant Isolation Testing

**ADMIN can ONLY access own organization (not other orgs).**

#### Test 1: ADMIN Cannot Access Other Org Data
```python
# Login as SUPER_ADMIN to get Org 2 data
>>> helper.login("info@gaiai.ai", "23235656")
>>> result = helper.get("/api/v1/job-postings")
>>> org2_jobs = [j for j in result.json()["data"] if "Org 2" in j["title"] or j["organizationId"] != "org-1-id"]
>>> org2_job_id = org2_jobs[0]["id"]

# Try to access as Org 1 ADMIN
>>> helper.login("test-admin@test-org-1.com", "TestPass123!")
>>> result = helper.get(f"/api/v1/job-postings/{org2_job_id}")
>>> print(result.status_code)  # Expected: 404 or 403
```

**Expected:** 404/403 (ADMIN cannot access other org's data)

---

#### Test 2: ADMIN Cannot Access Super Admin Panel
**Navigate to:** `/super-admin`

**Expected:** 403 or redirect to dashboard

**API:**
```python
>>> result = helper.get("/api/v1/queue/health")
>>> print(result.status_code)  # Expected: 403
```

---

### Phase 9: Browser Console & Network Audit

**Check for frontend errors:**

1. **Open browser DevTools (F12)**
2. **Login as ADMIN**
3. **Test ALL pages (30 pages):**
   - All core pages → No errors
   - Settings/Organization → No errors 🆕
   - Settings/Billing → No errors 🆕
   - Team page (with invite button) → No errors 🆕

4. **Check Network tab:**
   - All ADMIN endpoints: 200 ✅
   - Team invite/edit/delete: 200 ✅
   - Organization GET/PATCH: 200 ✅
   - Billing GET: 200 ✅
   - Queue health: 403 (expected) ✅
   - Super admin endpoints: 403 (expected) ✅

---

## 🐛 Bug Fixing Protocol

### Bug Type 1: ADMIN blocked from org settings

**Example:** GET /api/v1/organization returns 403 for ADMIN

**Fix:**
```javascript
// backend/src/routes/organizationRoutes.js

// WRONG (too restrictive):
router.get('/', authorize(['SUPER_ADMIN']), organizationController.get);

// RIGHT (ADMIN can access own org):
const { ROLE_GROUPS } = require('../constants/roles');
router.get('/', authorize(ROLE_GROUPS.ADMINS), organizationController.get);
```

**Commit:**
```bash
git commit -m "fix(rbac): Allow ADMIN to view own organization settings

Bug: GET /api/v1/organization returned 403 for ADMIN
Fix: Added ADMINS role group (SUPER_ADMIN + ADMIN)

ADMIN can view/edit own org (not other orgs)
SUPER_ADMIN can view/edit all orgs

Test: curl with ADMIN token → 200 ✅"
```

---

### Bug Type 2: Delete button hidden on job postings

**Example:** ADMIN cannot see "Delete" button (should be visible!)

**Fix:**
```typescript
// frontend/app/(authenticated)/job-postings/page.tsx

// WRONG (only SUPER_ADMIN can delete):
const canDelete = useHasRole([UserRole.SUPER_ADMIN]);

// RIGHT (ADMIN can also delete):
import { RoleGroups } from '@/lib/constants/roles';
const canDelete = useHasRole(RoleGroups.ADMINS);  // SUPER_ADMIN + ADMIN

{canDelete && <button>Delete</button>}
```

---

### Bug Type 3: Team invite blocked

**Example:** POST /api/v1/team/invite returns 403 for ADMIN

**Fix:**
```javascript
// backend/src/routes/teamRoutes.js

// WRONG:
router.post('/invite', authorize(['SUPER_ADMIN']), teamController.invite);

// RIGHT:
router.post('/invite', authorize(ROLE_GROUPS.ADMINS), teamController.invite);
```

---

### Bug Type 4: Settings tabs missing

**Example:** ADMIN doesn't see "Organization" or "Billing" tabs in settings

**Fix:**
```typescript
// frontend/app/(authenticated)/settings/layout.tsx (or similar)

import { useHasRole } from '@/lib/hooks/useHasRole';
import { RoleGroups } from '@/lib/constants/roles';

const isAdmin = useHasRole(RoleGroups.ADMINS);

const tabs = [
  { label: 'Overview', href: '/settings/overview' },
  { label: 'Profile', href: '/settings/profile' },
  { label: 'Notifications', href: '/settings/notifications' },
  { label: 'Security', href: '/settings/security' },
  // ADMIN-only tabs:
  ...(isAdmin ? [
    { label: 'Organization', href: '/settings/organization' },
    { label: 'Billing', href: '/settings/billing' }
  ] : [])
];
```

---

## 📝 Verification Report Template

**Create:** `docs/reports/worker4-admin-rbac-audit-report.md`

```markdown
# 🔍 Worker 4 - ADMIN Role RBAC Audit Report

**Worker:** Worker #4
**Date:** 2025-11-04
**Task:** ADMIN role comprehensive RBAC audit & fix
**Test User:** test-admin@test-org-1.com / TestPass123!
**Duration:** X hours

---

## Executive Summary

**Status:** ✅ PASS / ❌ FAIL

**Bugs Found:** X
**Bugs Fixed:** X
**Tests Performed:** X

**Key Findings:**
- [ADMIN-specific permissions: full delete, team management, org settings, billing]
- [Multi-tenant isolation (ADMIN cannot access other orgs)]
- [Bugs related to org settings, billing, team management access]

---

## Phase 1: Frontend Pages Audit (30 pages)

### Settings Pages - CRITICAL! 🎯

#### /settings/organization
**Expected:** ✅ ADMIN can access (ADMIN only!)
**Result:** ✅ PASS / ❌ FAIL
**Details:**
[If PASS: "Page loads, org name editable, industry dropdown visible"]
[If FAIL: "BUG - 403 error! Fixed in commit abc123"]

#### /settings/billing
**Expected:** ✅ ADMIN can access (ADMIN only!)
**Result:** ✅ PASS / ❌ FAIL
**Details:**
[If PASS: "Page loads, current plan (FREE) displayed, usage stats visible"]
[If FAIL: "BUG - blocked! Fixed in commit def456"]

[... Continue for all 30 pages ...]

---

## Phase 2: Backend API Audit (35 endpoints)

### Job Postings - DELETE TEST CRITICAL! 🎯

#### DELETE /api/v1/job-postings/:id
**Expected:** 200/204 (ADMIN CAN DELETE!)
**Command:**
```python
>>> helper.login("test-admin@test-org-1.com", "TestPass123!")
>>> result = helper.delete("/api/v1/job-postings/job-id-123")
>>> print(result.status_code)
```

**Output:**
```
200
```

**Result:** ✅ PASS / ❌ FAIL

---

### Candidates - DELETE TEST 🎯

#### DELETE /api/v1/candidates/:id
**Expected:** 200/204 (ADMIN CAN DELETE!)
**Command:**
```python
>>> result = helper.delete("/api/v1/candidates/candidate-id-456")
>>> print(result.status_code)
```

**Output:**
```
200
```

**Result:** ✅ PASS

---

### Analyses - DELETE TEST 🎯

#### DELETE /api/v1/analyses/:id
**Expected:** 200/204 (ADMIN CAN DELETE!)
**Command:**
```python
>>> result = helper.delete("/api/v1/analyses/analysis-id-789")
>>> print(result.status_code)
```

**Output:**
```
200
```

**Result:** ✅ PASS

---

### Team Management - CRITICAL! 🎯

#### POST /api/v1/team/invite
**Expected:** 200/201 (ADMIN CAN INVITE!)
**Command:**
```python
>>> result = helper.post("/api/v1/team/invite", json={
...   "email": "newhr@test-org-1.com",
...   "role": "HR_SPECIALIST",
...   "name": "New HR"
... })
>>> print(result.status_code)
>>> print(result.json())
```

**Output:**
```json
{
  "id": "new-user-id-123",
  "email": "newhr@test-org-1.com",
  "role": "HR_SPECIALIST",
  "inviteStatus": "PENDING"
}
```

**Result:** ✅ PASS / ❌ FAIL

---

#### PATCH /api/v1/team/:id
**Expected:** 200 (ADMIN CAN EDIT ROLES!)
**Command:**
```python
>>> result = helper.patch("/api/v1/team/member-id-123", json={
...   "role": "MANAGER"
... })
>>> print(result.status_code)
```

**Output:**
```
200
```

**Result:** ✅ PASS

---

#### DELETE /api/v1/team/:id
**Expected:** 200/204 (ADMIN CAN REMOVE!)
**Command:**
```python
>>> result = helper.delete("/api/v1/team/new-user-id-123")
>>> print(result.status_code)
```

**Output:**
```
204
```

**Result:** ✅ PASS

---

### Organization - CRITICAL! 🎯

#### GET /api/v1/organization
**Expected:** 200 (ADMIN can view own org)
**Command:**
```python
>>> result = helper.get("/api/v1/organization")
>>> print(result.status_code)
>>> org = result.json()
>>> print(org)
```

**Output:**
```json
{
  "id": "org-1-id",
  "name": "Test Organization Free",
  "slug": "test-org-free",
  "industry": "Technology",
  "plan": "FREE",
  "limits": {
    "maxAnalysesPerMonth": 10,
    "maxCVsPerMonth": 50,
    "maxUsers": 2
  },
  "teamSize": 4
}
```

**Result:** ✅ PASS / ❌ FAIL

---

#### PATCH /api/v1/organization
**Expected:** 200 (ADMIN can edit own org)
**Command:**
```python
>>> result = helper.patch("/api/v1/organization", json={
...   "name": "Updated Org Name",
...   "industry": "Healthcare"
... })
>>> print(result.status_code)
```

**Output:**
```
200
```

**Verification:**
```python
>>> result = helper.get("/api/v1/organization")
>>> print(result.json()["name"])
```

**Output:**
```
Updated Org Name
```

**Result:** ✅ PASS

---

### Billing - CRITICAL! 🎯

#### GET /api/v1/billing
**Expected:** 200 (ADMIN can view billing)
**Command:**
```python
>>> result = helper.get("/api/v1/billing")
>>> print(result.status_code)
>>> billing = result.json()
>>> print(billing)
```

**Output:**
```json
{
  "plan": "FREE",
  "price": 0,
  "currency": "TRY",
  "limits": {
    "analyses": 10,
    "cvs": 50,
    "users": 2
  },
  "usage": {
    "analysesThisMonth": 3,
    "cvsThisMonth": 12,
    "currentUsers": 4
  }
}
```

**Result:** ✅ PASS / ❌ FAIL

---

### System Endpoints - SHOULD BE BLOCKED! ❌

#### GET /api/v1/queue/health
**Expected:** 403 (SUPER_ADMIN only)
**Command:**
```python
>>> result = helper.get("/api/v1/queue/health")
>>> print(result.status_code)
```

**Output:**
```
403
```

**Result:** ✅ PASS (correctly blocked)

---

[... Continue for all 35 endpoints ...]

---

## Phase 3: UI Element Visibility Audit

### Sidebar Menu Items

**Visible items:**
- ✅ Dashboard
- ✅ Job Postings
- ✅ Candidates
- ✅ Analyses
- ✅ Offers
- ✅ Interviews
- ✅ Team
- ✅ Analytics
- ✅ Notifications
- ✅ Settings (with Org + Billing tabs!)

**Total:** 10 items ✅

**Result:** ✅ PASS

---

### Settings Tabs

**ADMIN settings tabs:**
- ✅ Overview
- ✅ Profile
- ✅ Notifications
- ✅ Security
- ✅ **Organization** 🆕
- ✅ **Billing** 🆕

**Total:** 6 tabs (vs 4 for MANAGER)

**Comparison:**
- MANAGER: 4 tabs (no Org/Billing)
- ADMIN: 6 tabs ✅

**Result:** ✅ PASS

---

### Action Buttons - ALL DELETE BUTTONS! 🎯

#### Job Postings Page
- ✅ "Create" button
- ✅ "Edit" buttons
- ✅ **"Delete" buttons (ADMIN can delete!)** 🆕

**Result:** ✅ PASS / ❌ FAIL

---

#### Candidates Page
- ✅ "Add" button
- ✅ "Edit" buttons
- ✅ **"Delete" buttons (ADMIN can delete!)** 🆕

**Result:** ✅ PASS

---

#### Analyses Page
- ✅ "New Analysis" button
- ✅ **"Delete" buttons (ADMIN can delete!)** 🆕

**Result:** ✅ PASS

---

#### Team Page
- ✅ Team member list
- ✅ **"Invite User" button (ADMIN only!)** 🆕
- ✅ **"Edit Role" buttons (ADMIN only!)** 🆕
- ✅ **"Remove" buttons (ADMIN only!)** 🆕

**Result:** ✅ PASS

---

## Phase 4: DELETE Operations Testing (ALL 5!)

### Summary Table

| Item | ADMIN Can Delete? | Test Result | Status Code |
|------|-------------------|-------------|-------------|
| Job Postings | ✅ YES | ✅ PASS | 200 |
| Candidates | ✅ YES | ✅ PASS | 200 |
| Analyses | ✅ YES | ✅ PASS | 200 |
| Offers | ✅ YES | ✅ PASS | 200 |
| Interviews | ✅ YES | ✅ PASS | 200 |

**All delete operations working ✅**

**Comparison with MANAGER:**
- MANAGER can delete: Offers, Interviews only
- ADMIN can delete: EVERYTHING ✅

---

## Phase 5: Team Management Testing

### Test Results Summary

| Operation | Expected | Result | Status Code |
|-----------|----------|--------|-------------|
| Invite team member | 200/201 | ✅ PASS | 201 |
| Edit team role | 200 | ✅ PASS | 200 |
| Remove team member | 200/204 | ✅ PASS | 204 |
| View team | 200 | ✅ PASS | 200 |

**All team management operations working ✅**

**Comparison with MANAGER:**
- MANAGER: View only (GET /team: 200, POST/PATCH/DELETE: 403)
- ADMIN: Full control ✅

---

## Phase 6: Organization Settings Testing

### Test Results

#### View Organization
**GET /api/v1/organization:** 200 ✅

**Data received:**
```json
{
  "name": "Test Organization Free",
  "plan": "FREE",
  "industry": "Technology",
  "teamSize": 4,
  "limits": {...}
}
```

**Result:** ✅ PASS

---

#### Edit Organization
**PATCH /api/v1/organization:** 200 ✅

**Changed:** name, industry
**Verified:** GET returned updated values ✅

**Result:** ✅ PASS

---

#### Frontend Settings Page
**URL:** /settings/organization
**Status:** ✅ Page loads, form editable

**Result:** ✅ PASS

---

## Phase 7: Billing Testing

### Test Results

#### View Billing
**GET /api/v1/billing:** 200 ✅

**Data received:**
```json
{
  "plan": "FREE",
  "price": 0,
  "usage": {
    "analysesThisMonth": 3,
    "cvsThisMonth": 12
  }
}
```

**Result:** ✅ PASS

---

#### Frontend Billing Page
**URL:** /settings/billing
**Status:** ✅ Page loads, plan displayed

**Result:** ✅ PASS

---

## Phase 8: Multi-Tenant Isolation Testing

### Test: ADMIN Cannot Access Other Org Data

**Try to access Org 2 job posting:**
**Status Code:** 404 ✅

**Result:** ✅ PASS (ADMIN correctly isolated to own org)

---

### Test: ADMIN Cannot Access Super Admin Features

**Try /super-admin page:** 403 ✅
**GET /api/v1/queue/health:** 403 ✅

**Result:** ✅ PASS

---

## Phase 9: Browser Console & Network Audit

### Console Errors
**All 30 pages tested:** No errors ✅

**Critical pages:**
- /settings/organization → No errors
- /settings/billing → No errors
- /team (with invite button) → No errors

**Result:** ✅ PASS

---

### Network Tab
**Successful requests:**
- All CRUD endpoints: 200 ✅
- All DELETE endpoints: 200 ✅
- Team management: 200 ✅
- Organization: 200 ✅
- Billing: 200 ✅

**Expected 403s:**
- Queue health: 403 ✅
- Super admin endpoints: 403 ✅

**Result:** ✅ PASS

---

## 🐛 Bugs Found & Fixed

### Bug #1: ADMIN blocked from /settings/organization

**Severity:** HIGH
**File:** frontend/app/(authenticated)/settings/organization/page.tsx
**Issue:** withRoleProtection missing ADMIN

**Fix:**
```typescript
// Before:
export default withRoleProtection(OrganizationSettingsPage, {
  allowedRoles: [UserRole.SUPER_ADMIN]
});

// After:
import { RoleGroups } from '@/lib/constants/roles';
export default withRoleProtection(OrganizationSettingsPage, {
  allowedRoles: RoleGroups.ADMINS  // SUPER_ADMIN + ADMIN
});
```

**Commit:** abc123
**Test:** /settings/organization → Page loads ✅

---

### Bug #2: DELETE /api/v1/candidates/:id returns 403

**Severity:** CRITICAL
**File:** backend/src/routes/candidateRoutes.js
**Issue:** ADMIN missing from delete authorization

**Fix:**
```javascript
// Before:
router.delete('/:id', authorize(['SUPER_ADMIN']), candidateController.delete);

// After:
const { ROLE_GROUPS } = require('../constants/roles');
router.delete('/:id', authorize(ROLE_GROUPS.ADMINS), candidateController.delete);
```

**Commit:** def456
**Test:** curl DELETE with ADMIN token → 200 ✅

---

### Bug #3: Team invite button not visible

**Severity:** MEDIUM
**File:** frontend/app/(authenticated)/team/page.tsx
**Issue:** Button hidden for ADMIN

**Fix:**
```typescript
// Before:
const canInvite = useHasRole([UserRole.SUPER_ADMIN]);

// After:
import { RoleGroups } from '@/lib/constants/roles';
const canInvite = useHasRole(RoleGroups.ADMINS);
```

**Commit:** ghi789
**Test:** Login as ADMIN → Team page → Invite button visible ✅

---

[... Continue for all bugs ...]

---

## 📊 Summary Statistics

| Category | Total | Pass | Fail | Fixed |
|----------|-------|------|------|-------|
| **Frontend Pages** | 30 | 28 | 2 | 2 |
| **Backend APIs** | 35 | 32 | 3 | 3 |
| **DELETE Operations** | 5 | 5 | 0 | 0 |
| **Team Management** | 4 | 4 | 0 | 0 |
| **Organization** | 3 | 2 | 1 | 1 |
| **Billing** | 2 | 2 | 0 | 0 |
| **UI Elements** | 15 | 14 | 1 | 1 |
| **Multi-Tenant** | 2 | 2 | 0 | 0 |
| **Console/Network** | 1 | 1 | 0 | 0 |
| **TOTAL** | 97 | 90 | 7 | 7 |

**Bug Severity:**
- CRITICAL: 2 (Cannot delete candidates/analyses)
- HIGH: 3 (Org settings blocked, billing blocked)
- MEDIUM: 2 (UI elements)

**All bugs fixed and verified ✅**

---

## 🎯 Recommendations

1. **Use ROLE_GROUPS consistently**
   - Use ROLE_GROUPS.ADMINS instead of hardcoding ['SUPER_ADMIN', 'ADMIN']
   - Prevents bugs when adding new admin levels

2. **Settings tab visibility helper**
   - Create useSettingsTabs() hook
   - Centralize tab filtering logic

3. **Delete permission documentation**
   - Document which roles can delete what
   - Create DELETE_PERMISSIONS matrix

---

## ✅ Final Verdict

**ADMIN Role RBAC Status:** ✅ PASS (after fixes)

**ADMIN unique permissions verified:**
- ✅ Delete ALL HR data (job postings, candidates, analyses, offers, interviews) 🆕
- ✅ Full team management (invite, edit roles, remove) 🆕
- ✅ Organization settings (view, edit) 🆕
- ✅ Billing access (view plan, usage) 🆕
- ✅ All MANAGER permissions (analytics, HR operations)

**ADMIN correct restrictions:**
- ❌ Cannot access other organizations (multi-tenant isolation)
- ❌ Cannot access super admin panel
- ❌ Cannot access system-wide settings
- ❌ Cannot view queue health (SUPER_ADMIN only)

**Data Isolation:** ✅ Working (ADMIN sees own org only)

**All 7 bugs fixed and verified ✅**

---

**Prepared by:** Worker #4
**Date:** 2025-11-04
**Commits:** 7 (1 per bug fix)
**Files Changed:** 7
**Test Duration:** X hours
```

---

## 🚀 Execution Checklist

Before starting:
- [ ] Read this entire task (20 minutes)
- [ ] Login as ADMIN to verify credentials work
- [ ] Understand ADMIN-specific permissions (full delete, team mgmt, org settings, billing)
- [ ] Open browser DevTools (F12)
- [ ] Start Python helper

During execution:
- [ ] Phase 1: Test all 30 pages (focus on settings/org/billing) (1.5 hours)
- [ ] Phase 2: Test all 35 endpoints (1 hour)
- [ ] Phase 3: Check UI elements (delete buttons everywhere!) (30 minutes)
- [ ] Phase 4: DELETE operations (all 5!) (30 minutes)
- [ ] Phase 5: Team management (invite/edit/remove) (30 minutes)
- [ ] Phase 6: Org settings (view/edit) (30 minutes)
- [ ] Phase 7: Billing (view plan/usage) (30 minutes)
- [ ] Phase 8: Multi-tenant isolation (30 minutes)
- [ ] Phase 9: Console/network audit (30 minutes)
- [ ] Fix bugs immediately
- [ ] Commit after each bug fix

After completion:
- [ ] Create verification report
- [ ] Commit report
- [ ] Test all fixes
- [ ] Report to Mod: "W4 done - X bugs found and fixed"

---

## 🎯 Success Criteria

**Task is complete when:**
1. ✅ All 30 pages tested
2. ✅ All 35 endpoints tested
3. ✅ All 5 DELETE operations work (200)
4. ✅ Team management works (invite/edit/remove: 200)
5. ✅ Org settings accessible (view/edit: 200)
6. ✅ Billing accessible (view: 200)
7. ✅ Multi-tenant isolation verified (cannot access other orgs)
8. ✅ All bugs FIXED
9. ✅ All fixes COMMITTED
10. ✅ Report created with RAW outputs

**Mod will verify by:**
1. Reading report
2. Re-running critical tests (delete, team mgmt, org settings)
3. Checking commits (7+ expected)
4. Login as ADMIN and test key features

---

## 🆘 If You Get Stuck

**Problem 1: Org settings endpoints don't exist**
```
If /api/v1/organization doesn't exist:
1. Check if there's /api/v1/organizations (plural)
2. Check organizationRoutes.js
3. Document in report: "Endpoint not implemented"
4. Note in recommendations: "Implement org settings API"
```

**Problem 2: Billing endpoints don't exist**
```
Similar to above - document and recommend implementation
```

**Problem 3: Don't know if ADMIN should delete X**
```
ADMIN can delete EVERYTHING in own org:
- Job postings ✅
- Candidates ✅
- Analyses ✅
- Offers ✅
- Interviews ✅

But CANNOT delete:
- Team members in other orgs ❌
- System data ❌
```

---

## 📚 Reference Files

**Role Groups (NEW!):**
```javascript
// backend/src/constants/roles.js
ROLE_GROUPS = {
  ADMINS: [SUPER_ADMIN, ADMIN],  // ← ADMIN included!
  MANAGERS_PLUS: [SUPER_ADMIN, ADMIN, MANAGER],  // For delete ops
  HR_MANAGERS: [SUPER_ADMIN, ADMIN, MANAGER, HR_SPECIALIST],
  ANALYTICS_VIEWERS: [SUPER_ADMIN, ADMIN, MANAGER]
}
```

**ADMIN is in ALL groups** (most permissions)

**Unique ADMIN permissions:**
- Delete job postings/candidates/analyses (ADMINS only)
- Team management (ADMINS only)
- Organization settings (ADMINS only)
- Billing (ADMINS only)

---

**🚀 Ready to start! Good luck Worker #4!**

**Remember:** ADMIN = Full control in own org (but NOT cross-org like SUPER_ADMIN)
