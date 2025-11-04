# 🔍 Worker Task: MANAGER Role RBAC Comprehensive Audit & Fix

**Task ID:** W3-MANAGER-RBAC-AUDIT
**Assigned To:** Worker #3
**Created:** 2025-11-04
**Estimated Time:** 3-4 hours
**Priority:** HIGH

---

## 🎯 Mission Statement

**Login as MANAGER role and audit the ENTIRE application.**

**Your job:**
1. ✅ **Test what MANAGER CAN access** → Verify it works properly
2. ❌ **Test what MANAGER CANNOT access** → Verify blocked correctly (403/404)
3. 🐛 **Find RBAC bugs** → If MANAGER sees things they shouldn't, FIX IT
4. 🐛 **Find missing features** → If MANAGER can't see things they SHOULD, FIX IT

**Critical Rule:** USE REAL BROWSER TESTING + API TESTING. NO SIMULATION!

---

## 📋 Test Credentials

**Login as MANAGER role:**
- **Email:** test-manager@test-org-1.com
- **Password:** TestPass123!
- **Organization:** Test Organization Free (Org 1)
- **Role:** MANAGER

**Alternative test users (if needed):**
- Org 2 MANAGER: test-manager@test-org-2.com / TestPass123!
- Org 3 MANAGER: test-manager@test-org-3.com / TestPass123!

**Admin access (for comparison):**
- SUPER_ADMIN: info@gaiai.ai / 23235656
- Org 1 ADMIN: test-admin@test-org-1.com / TestPass123!
- Org 1 HR_SPECIALIST: test-hr_specialist@test-org-1.com / TestPass123!

---

## 📊 MANAGER Role Overview

**MANAGER is in multiple role groups:**

**1. RoleGroups.HR_MANAGERS** (can do HR operations):
- SUPER_ADMIN ✅
- ADMIN ✅
- MANAGER ✅ ← **THIS ROLE**
- HR_SPECIALIST ✅

**2. RoleGroups.ANALYTICS_VIEWERS** (can view analytics):
- SUPER_ADMIN ✅
- ADMIN ✅
- MANAGER ✅ ← **THIS ROLE**

**MANAGER = HR_SPECIALIST + Analytics + Some Delete Permissions**

---

## 🎯 What MANAGER SHOULD Do

**All HR_SPECIALIST permissions PLUS:**

### ✅ MANAGER CAN (Full HR + Analytics + Partial Delete):
- ✅ All HR_SPECIALIST permissions:
  - View/create/edit job postings
  - View/create/edit candidates
  - Upload CVs & run analyses
  - View/create/edit offers
  - Schedule/edit interviews
- ✅ **View Analytics** (MANAGER+ only):
  - Offers analytics
  - HR pipeline metrics
  - Recruitment stats
- ✅ **Delete some items** (MANAGER+ level):
  - Delete offers (MANAGER/ADMIN)
  - Delete interviews (MANAGER/ADMIN)
- ✅ **View team** (read-only):
  - See team members
  - View team stats

### ❌ MANAGER CANNOT (ADMIN only):
- ❌ Delete job postings (ADMIN only)
- ❌ Delete candidates (ADMIN only)
- ❌ Delete analyses (ADMIN only)
- ❌ Invite team members (ADMIN only)
- ❌ Edit team member roles (ADMIN only)
- ❌ Access organization settings (ADMIN only)
- ❌ Access billing (ADMIN only)
- ❌ Super admin panel (SUPER_ADMIN only)

---

## 🆚 Role Comparison

| Permission | USER | HR_SPECIALIST | MANAGER | ADMIN |
|------------|------|---------------|---------|-------|
| **View HR Data** | ❌ | ✅ | ✅ | ✅ |
| **Create HR Data** | ❌ | ✅ | ✅ | ✅ |
| **Edit HR Data** | ❌ | ✅ | ✅ | ✅ |
| **Delete Job Postings** | ❌ | ❌ | ❌ | ✅ |
| **Delete Candidates** | ❌ | ❌ | ❌ | ✅ |
| **Delete Analyses** | ❌ | ❌ | ❌ | ✅ |
| **Delete Offers** | ❌ | ❌ | ✅ | ✅ |
| **Delete Interviews** | ❌ | ❌ | ✅ | ✅ |
| **View Analytics** | ❌ | ❌ | ✅ | ✅ |
| **View Team** | ❌ | ❌ | ✅ (read) | ✅ (full) |
| **Invite Team** | ❌ | ❌ | ❌ | ✅ |
| **Org Settings** | ❌ | ❌ | ❌ | ✅ |
| **Billing** | ❌ | ❌ | ❌ | ✅ |

**MANAGER = HR_SPECIALIST + Analytics + (Delete offers/interviews) + (View team)**

---

## 🧪 Testing Methodology

### Phase 1: Frontend Pages Audit (30 pages)

**For EACH page below:**

1. **Login as MANAGER** (test-manager@test-org-1.com)
2. **Navigate to page** (click sidebar OR type URL manually)
3. **Check result:**
   - ✅ Page loads → Screenshot + describe what you see
   - ❌ Redirected to 403/Dashboard → Expected (document this)
   - 🐛 Page loads but should be blocked → BUG! (fix it)
   - 🐛 Page blocked but should load → BUG! (fix it)
4. **Document findings** in verification report

**Pages to test (30 total):**

#### Core Pages (8)
- `/dashboard` ← MANAGER SHOULD ACCESS
- `/job-postings` ← MANAGER SHOULD ACCESS (HR_MANAGERS)
- `/candidates` ← MANAGER SHOULD ACCESS (HR_MANAGERS)
- `/analyses` ← MANAGER SHOULD ACCESS (HR_MANAGERS)
- `/offers` ← MANAGER SHOULD ACCESS (HR_MANAGERS)
- `/interviews` ← MANAGER SHOULD ACCESS (HR_MANAGERS)
- `/team` ← MANAGER SHOULD ACCESS (read-only view)
- `/super-admin` ← MANAGER SHOULD NOT ACCESS (SUPER_ADMIN only)

#### Offers Sub-Pages (6)
- `/offers/new` ← SHOULD ACCESS (create offer)
- `/offers/wizard` ← SHOULD ACCESS (offer wizard)
- `/offers/analytics` ← SHOULD ACCESS (ANALYTICS_VIEWERS - MANAGER included!)
- `/offers/templates` ← SHOULD ACCESS (view templates)
- `/offers/templates/new` ← SHOULD ACCESS (create template)
- `/offers/templates/categories` ← SHOULD ACCESS (manage categories)

#### Settings Pages (6)
- `/settings/overview` ← SHOULD ACCESS (own settings)
- `/settings/profile` ← SHOULD ACCESS (edit own profile)
- `/settings/notifications` ← SHOULD ACCESS (own preferences)
- `/settings/security` ← SHOULD ACCESS (change password)
- `/settings/organization` ← SHOULD NOT ACCESS (ADMIN only)
- `/settings/billing` ← SHOULD NOT ACCESS (ADMIN only)

#### Notifications (2)
- `/notifications` ← SHOULD ACCESS (own notifications)
- `/notifications/notifications` ← SHOULD ACCESS (alternative route)

#### Wizard Pages (2)
- `/wizard` ← SHOULD ACCESS (HR analysis wizard)
- `/onboarding` ← SHOULD ACCESS (first-time setup)

#### Dynamic Pages (6) - Test with real IDs
- `/candidates/[id]` ← SHOULD ACCESS (view candidate details)
- `/analyses/[id]` ← SHOULD ACCESS (view analysis results)
- `/offers/[id]` ← SHOULD ACCESS (view offer details)
- `/offers/[id]/revisions` ← SHOULD ACCESS (view offer history)
- `/offers/templates/[id]` ← SHOULD ACCESS (view template)
- `/offers/templates/[id]/edit` ← SHOULD ACCESS (edit template)

**How to get real IDs:**

**Using Python Test Helper (RECOMMENDED!)** 🐍
```python
python3 -i scripts/test-helper.py

>>> helper = IKAITestHelper()
>>> helper.login("test-manager@test-org-1.com", "TestPass123!")

>>> result = helper.get("/api/v1/job-postings")
>>> job_id = result.json()["data"][0]["id"]

>>> result = helper.get("/api/v1/candidates")
>>> candidate_id = result.json()["data"][0]["id"]

>>> result = helper.get("/api/v1/offers")
>>> offer_id = result.json()["data"][0]["id"]
```

---

### Phase 2: Backend API Audit (30 key endpoints)

**Test MANAGER's API access with emphasis on DELETE operations.**

**Get MANAGER token:**
```bash
curl -X POST http://localhost:8102/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test-manager@test-org-1.com","password":"TestPass123!"}'
```

**Endpoints to test:**

#### Job Postings (5) - All except DELETE
- `GET /api/v1/job-postings` ← SHOULD BE 200
- `POST /api/v1/job-postings` ← SHOULD BE 200 (create)
- `GET /api/v1/job-postings/:id` ← SHOULD BE 200
- `PATCH /api/v1/job-postings/:id` ← SHOULD BE 200 (edit)
- `DELETE /api/v1/job-postings/:id` ← SHOULD BE 403 (ADMIN only)

#### Candidates (5) - All except DELETE
- `GET /api/v1/candidates` ← SHOULD BE 200
- `POST /api/v1/candidates` ← SHOULD BE 200 (create)
- `GET /api/v1/candidates/:id` ← SHOULD BE 200
- `PATCH /api/v1/candidates/:id` ← SHOULD BE 200
- `DELETE /api/v1/candidates/:id` ← SHOULD BE 403 (ADMIN only)

#### Analyses (4) - All except DELETE
- `GET /api/v1/analyses` ← SHOULD BE 200
- `POST /api/v1/analyses` ← SHOULD BE 200 (upload CV)
- `GET /api/v1/analyses/:id` ← SHOULD BE 200
- `DELETE /api/v1/analyses/:id` ← SHOULD BE 403 (ADMIN only)

#### Offers (5) - INCLUDING DELETE! 🎯
- `GET /api/v1/offers` ← SHOULD BE 200
- `POST /api/v1/offers` ← SHOULD BE 200 (create)
- `GET /api/v1/offers/:id` ← SHOULD BE 200
- `PATCH /api/v1/offers/:id` ← SHOULD BE 200
- `DELETE /api/v1/offers/:id` ← SHOULD BE 200 (MANAGER CAN DELETE!)

#### Interviews (4) - INCLUDING DELETE! 🎯
- `GET /api/v1/interviews` ← SHOULD BE 200
- `POST /api/v1/interviews` ← SHOULD BE 200 (schedule)
- `GET /api/v1/interviews/:id` ← SHOULD BE 200
- `DELETE /api/v1/interviews/:id` ← SHOULD BE 200 (MANAGER CAN DELETE!)

#### Analytics (3) - MANAGER CAN VIEW! 🎯
- `GET /api/v1/analytics/offers` ← SHOULD BE 200 (ANALYTICS_VIEWERS)
- `GET /api/v1/analytics/pipeline` ← SHOULD BE 200 (if exists)
- `GET /api/v1/analytics/recruitment` ← SHOULD BE 200 (if exists)

#### Team (3) - READ-ONLY ACCESS
- `GET /api/v1/team` ← SHOULD BE 200 (view team members)
- `POST /api/v1/team/invite` ← SHOULD BE 403 (ADMIN only)
- `DELETE /api/v1/team/:id` ← SHOULD BE 403 (ADMIN only)

#### Organization & Billing (3) - BLOCKED
- `GET /api/v1/organization` ← SHOULD BE 403 (ADMIN only)
- `PATCH /api/v1/organization` ← SHOULD BE 403 (ADMIN only)
- `GET /api/v1/queue/health` ← SHOULD BE 403 (ADMIN only)

---

### Phase 3: UI Element Visibility Audit

**Login as MANAGER and check these UI elements:**

#### Sidebar Menu Items
**Expected for MANAGER:**
- ✅ Dashboard (visible)
- ✅ Job Postings (visible)
- ✅ Candidates (visible)
- ✅ Analyses (visible)
- ✅ Offers (visible)
- ✅ Interviews (visible)
- ✅ Team (visible - read-only) 🆕
- ✅ Analytics (visible) 🆕
- ❌ Super Admin (hidden)
- ✅ Notifications (visible)
- ✅ Settings (visible)

**Expected count:** ~10 sidebar items (2 more than HR_SPECIALIST!)

**Compare:**
- USER: 3 items
- HR_SPECIALIST: 8 items
- MANAGER: 10 items 🆕
- ADMIN: 11+ items (has org settings, billing)

---

#### Dashboard Widgets
**Expected for MANAGER:**
- ✅ Welcome message
- ✅ HR pipeline stats (job postings, candidates, analyses)
- ✅ Recent activity
- ✅ "Upload CV" / "Create Job Posting" buttons
- ✅ **Analytics charts** (team performance, recruitment metrics) 🆕
- ✅ **Team overview widget** (team members count, roles distribution) 🆕
- ❌ No admin-only widgets (billing, org settings)

---

#### Action Buttons - DELETE BUTTONS! 🎯

**Key difference from HR_SPECIALIST: MANAGER can see delete buttons on offers/interviews!**

**1. Job Postings page:**
- ✅ "Create Job Posting" button (visible)
- ✅ "Edit" buttons (visible)
- ❌ "Delete" buttons (hidden - ADMIN only)

**2. Candidates page:**
- ✅ "Add Candidate" button (visible)
- ✅ "Upload CV" button (visible)
- ✅ "Edit" buttons (visible)
- ❌ "Delete" buttons (hidden - ADMIN only)

**3. Analyses page:**
- ✅ "New Analysis" button (visible)
- ✅ "Upload CVs" button (visible)
- ❌ "Delete" buttons (hidden - ADMIN only)

**4. Offers page:**
- ✅ "Create Offer" button (visible)
- ✅ "Edit" buttons (visible)
- ✅ **"Delete" buttons (visible - MANAGER CAN DELETE!)** 🆕
- ✅ **"Analytics" button (visible - ANALYTICS_VIEWERS)** 🆕

**5. Interviews page:**
- ✅ "Schedule Interview" button (visible)
- ✅ "Edit" buttons (visible)
- ✅ **"Delete" buttons (visible - MANAGER CAN DELETE!)** 🆕

**6. Team page:**
- ✅ Page accessible (view team)
- ✅ Team member list visible
- ❌ "Invite User" button (hidden - ADMIN only)
- ❌ "Edit Role" buttons (hidden - ADMIN only)
- ❌ "Remove User" buttons (hidden - ADMIN only)

**7. Analytics pages:**
- ✅ `/offers/analytics` accessible
- ✅ Charts/graphs visible
- ✅ Export buttons (if any)

---

### Phase 4: DELETE Operations Testing (CRITICAL!)

**MANAGER's unique permission: Can delete offers & interviews (but NOT job postings/candidates/analyses)**

#### Test 1: Delete Offer (SHOULD SUCCEED) 🎯
```python
# Using Python helper
python3 -i scripts/test-helper.py

>>> helper = IKAITestHelper()
>>> helper.login("test-manager@test-org-1.com", "TestPass123!")

# Create an offer first (or get existing ID)
>>> result = helper.post("/api/v1/offers", json={
...   "candidateId": "candidate-id-here",
...   "position": "Test Position",
...   "salary": 50000,
...   "currency": "TRY"
... })
>>> offer_id = result.json()["id"]

# Try to DELETE (should succeed for MANAGER!)
>>> result = helper.delete(f"/api/v1/offers/{offer_id}")
>>> print(result.status_code)  # Expected: 200 or 204
>>> print(result.json())
```

**Expected:** 200/204 Success (MANAGER CAN delete offers!)

---

#### Test 2: Delete Interview (SHOULD SUCCEED) 🎯
```python
# Create an interview first
>>> result = helper.post("/api/v1/interviews", json={
...   "candidateId": "candidate-id-here",
...   "scheduledAt": "2025-11-15T10:00:00Z",
...   "type": "TECHNICAL"
... })
>>> interview_id = result.json()["id"]

# Try to DELETE (should succeed for MANAGER!)
>>> result = helper.delete(f"/api/v1/interviews/{interview_id}")
>>> print(result.status_code)  # Expected: 200 or 204
```

**Expected:** 200/204 Success

---

#### Test 3: Delete Job Posting (SHOULD FAIL) ❌
```python
# Get a job posting ID
>>> result = helper.get("/api/v1/job-postings")
>>> job_id = result.json()["data"][0]["id"]

# Try to DELETE (should fail - ADMIN only!)
>>> result = helper.delete(f"/api/v1/job-postings/{job_id}")
>>> print(result.status_code)  # Expected: 403
>>> print(result.json())
```

**Expected:** 403 Forbidden (ADMIN only)

---

#### Test 4: Delete Candidate (SHOULD FAIL) ❌
```python
# Get a candidate ID
>>> result = helper.get("/api/v1/candidates")
>>> candidate_id = result.json()["data"][0]["id"]

# Try to DELETE (should fail - ADMIN only!)
>>> result = helper.delete(f"/api/v1/candidates/{candidate_id}")
>>> print(result.status_code)  # Expected: 403
```

**Expected:** 403 Forbidden

---

#### Test 5: Delete Analysis (SHOULD FAIL) ❌
```python
# Get an analysis ID
>>> result = helper.get("/api/v1/analyses")
>>> analysis_id = result.json()["data"][0]["id"]

# Try to DELETE (should fail - ADMIN only!)
>>> result = helper.delete(f"/api/v1/analyses/{analysis_id}")
>>> print(result.status_code)  # Expected: 403
```

**Expected:** 403 Forbidden

---

### Phase 5: Analytics Access Testing (CRITICAL!)

**MANAGER is in RoleGroups.ANALYTICS_VIEWERS - must verify analytics access!**

#### Test 1: Offers Analytics Page
**Frontend:**
```
1. Login as MANAGER
2. Navigate to /offers/analytics
3. Expected: Page loads with charts/graphs
4. Screenshot the analytics dashboard
```

**Backend API:**
```python
>>> helper.login("test-manager@test-org-1.com", "TestPass123!")
>>> result = helper.get("/api/v1/analytics/offers")
>>> print(result.status_code)  # Expected: 200
>>> print(result.json())  # Should contain analytics data
```

**Expected:** 200 Success

**Compare with HR_SPECIALIST (should get 403):**
```python
>>> helper.login("test-hr_specialist@test-org-1.com", "TestPass123!")
>>> result = helper.get("/api/v1/analytics/offers")
>>> print(result.status_code)  # Expected: 403 (HR cannot access analytics)
```

---

#### Test 2: Other Analytics Endpoints
```python
# Test all analytics endpoints as MANAGER
>>> helper.login("test-manager@test-org-1.com", "TestPass123!")

>>> helper.get("/api/v1/analytics/pipeline")  # Should be 200
>>> helper.get("/api/v1/analytics/recruitment")  # Should be 200
>>> helper.get("/api/v1/analytics/candidates")  # Should be 200 (if exists)
```

**Expected:** All analytics endpoints accessible (200)

---

### Phase 6: Team Page Testing

**MANAGER can VIEW team but cannot MANAGE team.**

#### Test 1: View Team Page
**Frontend:**
```
1. Login as MANAGER
2. Navigate to /team
3. Expected: Page loads, team member list visible
4. Check sidebar: "Team" menu item should be visible
```

**Backend:**
```python
>>> helper.login("test-manager@test-org-1.com", "TestPass123!")
>>> result = helper.get("/api/v1/team")
>>> print(result.status_code)  # Expected: 200
>>> print(result.json())  # Should list team members
```

**Expected:** 200 Success (can view team)

---

#### Test 2: Invite Team Member (SHOULD FAIL)
```python
>>> result = helper.post("/api/v1/team/invite", json={
...   "email": "newmember@test-org-1.com",
...   "role": "HR_SPECIALIST"
... })
>>> print(result.status_code)  # Expected: 403
```

**Expected:** 403 Forbidden (ADMIN only)

---

#### Test 3: Edit Team Member Role (SHOULD FAIL)
```python
# Get a team member ID
>>> result = helper.get("/api/v1/team")
>>> member_id = result.json()["data"][0]["id"]

# Try to change role
>>> result = helper.patch(f"/api/v1/team/{member_id}", json={
...   "role": "ADMIN"
... })
>>> print(result.status_code)  # Expected: 403
```

**Expected:** 403 Forbidden

---

#### Test 4: Remove Team Member (SHOULD FAIL)
```python
>>> result = helper.delete(f"/api/v1/team/{member_id}")
>>> print(result.status_code)  # Expected: 403
```

**Expected:** 403 Forbidden

---

### Phase 7: Data Isolation Testing

**Verify MANAGER can only see own organization data (same as HR_SPECIALIST).**

#### Test 1: Multi-Tenant Job Postings
```python
# Login as Org 1 MANAGER
>>> helper.login("test-manager@test-org-1.com", "TestPass123!")
>>> result = helper.get("/api/v1/job-postings")
>>> print(len(result.json()["data"]))  # Expected: 2 (Org 1 only)
```

**Expected:** Only Org 1 job postings (2 total, not 6)

---

#### Test 2: Cross-Org Data Access (SHOULD FAIL)
```python
# Get Org 2 candidate ID (login as SUPER_ADMIN first)
>>> helper.login("info@gaiai.ai", "23235656")
>>> result = helper.get("/api/v1/candidates")
>>> org2_candidates = [c for c in result.json()["data"] if c["organizationId"] != "org-1-id"]
>>> org2_candidate_id = org2_candidates[0]["id"]

# Try to access as Org 1 MANAGER
>>> helper.login("test-manager@test-org-1.com", "TestPass123!")
>>> result = helper.get(f"/api/v1/candidates/{org2_candidate_id}")
>>> print(result.status_code)  # Expected: 404 or 403
```

**Expected:** 404/403 (cannot access other org's data)

---

### Phase 8: Browser Console & Network Audit

**Check for frontend errors:**

1. **Open browser DevTools** (F12)
2. **Login as MANAGER**
3. **Test all MANAGER pages:**
   - /dashboard → No errors
   - /job-postings → No errors
   - /candidates → No errors
   - /analyses → No errors
   - /offers → No errors
   - /offers/analytics → No errors 🆕
   - /interviews → No errors
   - /team → No errors 🆕

4. **Check Network tab:**
   - All HR endpoints: 200 ✅
   - Analytics endpoints: 200 ✅
   - Team endpoint: 200 ✅
   - Team invite/delete: 403 (expected)
   - Org settings: 403 (expected)

---

## 🐛 Bug Fixing Protocol

**When you find a bug:**

### Bug Type 1: MANAGER blocked from analytics

**Example:** GET /api/v1/analytics/offers returns 403 for MANAGER

**Fix:**
```javascript
// backend/src/routes/analyticsRoutes.js

// WRONG (missing MANAGER):
router.get('/offers', authorize(['SUPER_ADMIN', 'ADMIN']), analyticsController.getOffers);

// RIGHT:
router.get('/offers', authorize(['SUPER_ADMIN', 'ADMIN', 'MANAGER']), analyticsController.getOffers);
```

**Or use ROLE_GROUPS:**
```javascript
// BEST:
const { ROLE_GROUPS } = require('../constants/roles');
router.get('/offers', authorize(ROLE_GROUPS.ANALYTICS_VIEWERS), analyticsController.getOffers);
```

**Commit:**
```bash
git add backend/src/routes/analyticsRoutes.js
git commit -m "fix(rbac): Allow MANAGER to access offers analytics

Bug: GET /api/v1/analytics/offers returned 403 for MANAGER
Fix: Added MANAGER to ANALYTICS_VIEWERS group authorization

ANALYTICS_VIEWERS = SUPER_ADMIN, ADMIN, MANAGER

Test: curl with MANAGER token → 200 ✅"
```

---

### Bug Type 2: Delete button hidden on offers page

**Example:** MANAGER cannot see "Delete" button on offers (should be visible!)

**Fix:**
```typescript
// frontend/app/(authenticated)/offers/page.tsx

// WRONG (too restrictive - only ADMIN can delete):
import { useHasRole } from '@/lib/hooks/useHasRole';
const canDelete = useHasRole([UserRole.ADMIN]);

// RIGHT (MANAGER can also delete offers):
const canDelete = useHasRole([UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.MANAGER]);

{canDelete && <button>Delete</button>}
```

**Commit:**
```bash
git add frontend/app/(authenticated)/offers/page.tsx
git commit -m "fix(rbac): Show delete button on offers for MANAGER

Bug: MANAGER could not see 'Delete' button on offers page
Fix: Added UserRole.MANAGER to canDelete permission check

MANAGER can delete offers (not job postings/candidates/analyses)

Test: Login as MANAGER → Offers page → Delete button visible ✅"
```

---

### Bug Type 3: Analytics page blocked

**Example:** /offers/analytics redirects MANAGER to 403

**Fix:**
```typescript
// frontend/app/(authenticated)/offers/analytics/page.tsx

// WRONG (missing MANAGER):
export default withRoleProtection(OffersAnalyticsPage, {
  allowedRoles: [UserRole.SUPER_ADMIN, UserRole.ADMIN]
});

// RIGHT:
import { RoleGroups } from '@/lib/constants/roles';
export default withRoleProtection(OffersAnalyticsPage, {
  allowedRoles: RoleGroups.ANALYTICS_VIEWERS  // Includes MANAGER ✅
});
```

---

### Bug Type 4: Team page blocked

**Example:** /team returns 403 for MANAGER

**Fix:**
```typescript
// frontend/app/(authenticated)/team/page.tsx

// Check if page is protected with correct roles
export default withRoleProtection(TeamPage, {
  allowedRoles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.MANAGER]
});
```

```javascript
// backend/src/routes/teamRoutes.js

// GET /team should allow MANAGER (read-only)
router.get('/', authorize(['SUPER_ADMIN', 'ADMIN', 'MANAGER']), teamController.getAll);

// POST /invite should be ADMIN only
router.post('/invite', authorize(['SUPER_ADMIN', 'ADMIN']), teamController.invite);
```

---

## 📝 Verification Report Template

**Create:** `docs/reports/worker3-manager-rbac-audit-report.md`

```markdown
# 🔍 Worker 3 - MANAGER Role RBAC Audit Report

**Worker:** Worker #3
**Date:** 2025-11-04
**Task:** MANAGER role comprehensive RBAC audit & fix
**Test User:** test-manager@test-org-1.com / TestPass123!
**Duration:** X hours

---

## Executive Summary

**Status:** ✅ PASS / ❌ FAIL

**Bugs Found:** X
**Bugs Fixed:** X
**Tests Performed:** X

**Key Findings:**
- [MANAGER-specific permissions (analytics, delete offers/interviews, view team)]
- [Bugs related to ANALYTICS_VIEWERS access]
- [Delete button visibility issues]

---

## Phase 1: Frontend Pages Audit (30 pages)

### Core Pages (8)

#### 1. /dashboard
**Expected:** ✅ MANAGER can access
**Result:** ✅ PASS
**Details:**
- MANAGER dashboard visible
- Analytics widgets present (vs HR_SPECIALIST dashboard)
- Team overview widget visible

#### 2. /offers/analytics (CRITICAL!)
**Expected:** ✅ MANAGER can access (ANALYTICS_VIEWERS)
**Result:** ✅ PASS / ❌ FAIL
**Details:**
[If PASS: "Analytics page loads, charts visible"]
[If FAIL: "BUG - 403 error! Fixed in commit abc123"]

#### 3. /team (CRITICAL!)
**Expected:** ✅ MANAGER can access (read-only)
**Result:** ✅ PASS / ❌ FAIL
**Details:**
[If PASS: "Team page loads, member list visible, no invite button (correct)"]
[If FAIL: "BUG - blocked or invite button visible! Fixed in commit def456"]

[... Continue for all 30 pages ...]

---

## Phase 2: Backend API Audit (30 endpoints)

### Offers (5) - DELETE TEST CRITICAL! 🎯

#### DELETE /api/v1/offers/:id
**Expected:** 200/204 (MANAGER CAN DELETE!)
**Command:**
```python
>>> helper.login("test-manager@test-org-1.com", "TestPass123!")
>>> result = helper.delete("/api/v1/offers/offer-id-123")
>>> print(result.status_code)
```

**Output:**
```
200
```

**Result:** ✅ PASS / ❌ FAIL

[If FAIL: "BUG - got 403! MANAGER should be able to delete offers. Fixed in commit xyz789"]

---

### Interviews (4) - DELETE TEST CRITICAL! 🎯

#### DELETE /api/v1/interviews/:id
**Expected:** 200/204 (MANAGER CAN DELETE!)
**Command:**
```python
>>> result = helper.delete("/api/v1/interviews/interview-id-456")
>>> print(result.status_code)
```

**Output:**
```
200
```

**Result:** ✅ PASS

---

### Analytics (3) - ACCESS TEST CRITICAL! 🎯

#### GET /api/v1/analytics/offers
**Expected:** 200 (ANALYTICS_VIEWERS includes MANAGER!)
**Command:**
```python
>>> result = helper.get("/api/v1/analytics/offers")
>>> print(result.status_code)
>>> print(result.json())
```

**Output:**
```json
{
  "totalOffers": 25,
  "acceptedOffers": 18,
  "pendingOffers": 7,
  "averageAcceptanceTime": "5.2 days"
}
```

**Result:** ✅ PASS / ❌ FAIL

---

### Team (3) - READ-ONLY TEST 🎯

#### GET /api/v1/team
**Expected:** 200 (MANAGER can view)
**Command:**
```python
>>> result = helper.get("/api/v1/team")
>>> print(result.status_code)
```

**Output:**
```
200
```

**Result:** ✅ PASS

---

#### POST /api/v1/team/invite
**Expected:** 403 (ADMIN only)
**Command:**
```python
>>> result = helper.post("/api/v1/team/invite", json={
...   "email": "test@example.com",
...   "role": "HR_SPECIALIST"
... })
>>> print(result.status_code)
```

**Output:**
```
403
```

**Result:** ✅ PASS

---

### Job Postings - DELETE TEST (SHOULD FAIL) ❌

#### DELETE /api/v1/job-postings/:id
**Expected:** 403 (ADMIN only - MANAGER CANNOT delete job postings!)
**Command:**
```python
>>> result = helper.delete("/api/v1/job-postings/job-id-789")
>>> print(result.status_code)
```

**Output:**
```
403
```

**Result:** ✅ PASS

[... Continue for all 30 endpoints ...]

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
- ✅ Team 🆕 (vs HR_SPECIALIST)
- ✅ Analytics 🆕 (vs HR_SPECIALIST)
- ✅ Notifications
- ✅ Settings

**Total:** 10 items ✅

**Hidden items (expected):**
- ❌ Super Admin (correctly hidden)

**Comparison:**
- HR_SPECIALIST: 8 items
- MANAGER: 10 items (+Team, +Analytics) ✅
- ADMIN: 11+ items (+Org Settings, +Billing)

**Result:** ✅ PASS

---

### Action Buttons - DELETE BUTTONS CRITICAL! 🎯

#### Offers Page
- ✅ "Create Offer" button (visible)
- ✅ "Edit" buttons (visible)
- ✅ **"Delete" buttons (visible - MANAGER can delete!)** 🆕
- ✅ **"Analytics" link (visible - ANALYTICS_VIEWERS)** 🆕

**Result:** ✅ PASS / ❌ FAIL

[If FAIL: "BUG - Delete button hidden! Fixed in commit abc123"]

---

#### Interviews Page
- ✅ "Schedule Interview" button (visible)
- ✅ "Edit" buttons (visible)
- ✅ **"Delete" buttons (visible - MANAGER can delete!)** 🆕

**Result:** ✅ PASS

---

#### Job Postings Page
- ✅ "Create Job Posting" button (visible)
- ✅ "Edit" buttons (visible)
- ❌ "Delete" buttons NOT visible (ADMIN only) ✅

**Result:** ✅ PASS

---

#### Team Page
- ✅ Team member list (visible)
- ❌ "Invite User" button NOT visible (ADMIN only) ✅
- ❌ "Edit Role" buttons NOT visible (ADMIN only) ✅
- ❌ "Remove" buttons NOT visible (ADMIN only) ✅

**Result:** ✅ PASS

---

## Phase 4: DELETE Operations Testing

### Summary Table

| Item | MANAGER Can Delete? | Test Result |
|------|---------------------|-------------|
| Offers | ✅ YES | ✅ PASS (200) |
| Interviews | ✅ YES | ✅ PASS (200) |
| Job Postings | ❌ NO | ✅ PASS (403) |
| Candidates | ❌ NO | ✅ PASS (403) |
| Analyses | ❌ NO | ✅ PASS (403) |

**All delete permissions correct ✅**

---

## Phase 5: Analytics Access Testing

### Frontend Analytics Page
**URL:** /offers/analytics
**Result:** ✅ Page loads, charts visible

**Charts visible:**
- Total offers over time (line chart)
- Offer acceptance rate (pie chart)
- Average salary by position (bar chart)
- Time to accept (histogram)

**Result:** ✅ PASS

---

### Backend Analytics API
**Endpoint:** GET /api/v1/analytics/offers
**Status Code:** 200 ✅

**Data received:**
```json
{
  "totalOffers": 25,
  "acceptedOffers": 18,
  "pendingOffers": 5,
  "rejectedOffers": 2,
  "averageAcceptanceTime": "5.2 days",
  "topPositions": ["Frontend Developer", "Backend Developer"]
}
```

**Result:** ✅ PASS

---

### Comparison with HR_SPECIALIST (should be blocked)
**Login as HR_SPECIALIST:**
```python
>>> helper.login("test-hr_specialist@test-org-1.com", "TestPass123!")
>>> result = helper.get("/api/v1/analytics/offers")
>>> print(result.status_code)
```

**Output:** 403 ✅ (HR_SPECIALIST correctly blocked from analytics)

**Result:** ✅ PASS (MANAGER has analytics, HR doesn't)

---

## Phase 6: Team Page Testing

### View Team
**GET /api/v1/team:** 200 ✅
**Team members visible:** 4 (ADMIN, MANAGER, HR_SPECIALIST, USER)

**Result:** ✅ PASS

---

### Invite Team Member (should fail)
**POST /api/v1/team/invite:** 403 ✅

**Result:** ✅ PASS (ADMIN only)

---

### Edit Team Member (should fail)
**PATCH /api/v1/team/:id:** 403 ✅

**Result:** ✅ PASS

---

### Remove Team Member (should fail)
**DELETE /api/v1/team/:id:** 403 ✅

**Result:** ✅ PASS

**Summary:** MANAGER can VIEW team but cannot MANAGE team ✅

---

## Phase 7: Data Isolation Testing

### Multi-Tenant Verification
**Org 1 MANAGER sees:** 2 job postings (Org 1 only) ✅
**Cannot access:** Org 2/3 candidates (404) ✅

**Result:** ✅ PASS (data isolation working)

---

## Phase 8: Browser Console & Network Audit

### Console Errors
**All pages tested:** No errors ✅

**Pages:**
- /dashboard → No errors
- /offers/analytics → No errors
- /team → No errors
- All other HR pages → No errors

**Result:** ✅ PASS

---

### Network Tab
**Successful requests:**
- All HR endpoints: 200 ✅
- Analytics endpoints: 200 ✅
- Team GET: 200 ✅

**Expected 403s:**
- Team POST/DELETE: 403 ✅
- Org settings: 403 ✅

**Result:** ✅ PASS

---

## 🐛 Bugs Found & Fixed

### Bug #1: MANAGER blocked from /offers/analytics

**Severity:** HIGH
**File:** frontend/app/(authenticated)/offers/analytics/page.tsx
**Issue:** withRoleProtection missing MANAGER

**Fix:**
```typescript
// Before:
export default withRoleProtection(OffersAnalyticsPage, {
  allowedRoles: [UserRole.SUPER_ADMIN, UserRole.ADMIN]
});

// After:
import { RoleGroups } from '@/lib/constants/roles';
export default withRoleProtection(OffersAnalyticsPage, {
  allowedRoles: RoleGroups.ANALYTICS_VIEWERS  // Includes MANAGER
});
```

**Commit:** abc123
**Test:** /offers/analytics → Page loads ✅

---

### Bug #2: Delete button hidden on offers page

**Severity:** HIGH
**File:** frontend/app/(authenticated)/offers/page.tsx
**Issue:** canDelete missing MANAGER role

**Fix:**
```typescript
// Before:
const canDelete = useHasRole([UserRole.SUPER_ADMIN, UserRole.ADMIN]);

// After:
const canDelete = useHasRole([UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.MANAGER]);
```

**Commit:** def456
**Test:** Login as MANAGER → Delete button visible ✅

---

### Bug #3: DELETE /api/v1/offers/:id returns 403

**Severity:** CRITICAL
**File:** backend/src/routes/offerRoutes.js
**Issue:** MANAGER missing from delete authorization

**Fix:**
```javascript
// Before:
router.delete('/:id', authorize(['SUPER_ADMIN', 'ADMIN']), offerController.delete);

// After:
router.delete('/:id', authorize(['SUPER_ADMIN', 'ADMIN', 'MANAGER']), offerController.delete);
```

**Commit:** ghi789
**Test:** curl DELETE with MANAGER token → 200 ✅

---

[... Continue for all bugs ...]

---

## 📊 Summary Statistics

| Category | Total | Pass | Fail | Fixed |
|----------|-------|------|------|-------|
| **Frontend Pages** | 30 | 28 | 2 | 2 |
| **Backend APIs** | 30 | 27 | 3 | 3 |
| **DELETE Operations** | 5 | 5 | 0 | 0 |
| **Analytics Access** | 3 | 2 | 1 | 1 |
| **Team Page Tests** | 4 | 4 | 0 | 0 |
| **UI Elements** | 12 | 11 | 1 | 1 |
| **Data Isolation** | 2 | 2 | 0 | 0 |
| **Console/Network** | 1 | 1 | 0 | 0 |
| **TOTAL** | 87 | 80 | 7 | 7 |

**Bug Severity:**
- CRITICAL: 1 (Cannot delete offers via API)
- HIGH: 3 (Analytics blocked, delete buttons hidden)
- MEDIUM: 3 (UI/UX issues)

**All bugs fixed and verified ✅**

---

## 🎯 Recommendations

1. **Standardize delete permissions**
   - Document which roles can delete what
   - Create DELETE_PERMISSIONS constant

2. **Analytics access helper**
   - Create `useCanViewAnalytics()` hook
   - Use RoleGroups.ANALYTICS_VIEWERS consistently

3. **Team page clarification**
   - Add tooltip: "View only - Contact admin to manage team"
   - Clear UI indication of read-only access

---

## ✅ Final Verdict

**MANAGER Role RBAC Status:** ✅ PASS (after fixes)

**MANAGER unique permissions verified:**
- ✅ View analytics (ANALYTICS_VIEWERS) 🆕
- ✅ Delete offers (MANAGER+) 🆕
- ✅ Delete interviews (MANAGER+) 🆕
- ✅ View team (read-only) 🆕

**MANAGER correct restrictions:**
- ❌ Cannot delete job postings (ADMIN only)
- ❌ Cannot delete candidates (ADMIN only)
- ❌ Cannot delete analyses (ADMIN only)
- ❌ Cannot invite team members (ADMIN only)
- ❌ Cannot access org settings (ADMIN only)

**Data Isolation:** ✅ Working

**All 7 bugs fixed and verified ✅**

---

**Prepared by:** Worker #3
**Date:** 2025-11-04
**Commits:** 7 (1 per bug fix)
**Files Changed:** 7
**Test Duration:** X hours
```

---

## 🚀 Execution Checklist

Before starting:
- [ ] Read this entire task (20 minutes)
- [ ] Login as MANAGER to verify credentials work
- [ ] Understand MANAGER-specific permissions (analytics, delete offers/interviews, view team)
- [ ] Open browser DevTools (F12)
- [ ] Start Python helper (`python3 -i scripts/test-helper.py`)

During execution:
- [ ] Phase 1: Test all 30 frontend pages (1.5 hours)
- [ ] Phase 2: Test all 30 backend endpoints (1 hour)
- [ ] Phase 3: Check UI elements (focus on delete buttons!) (30 minutes)
- [ ] Phase 4: DELETE operations (5 tests) (30 minutes)
- [ ] Phase 5: Analytics access (critical!) (30 minutes)
- [ ] Phase 6: Team page (read-only) (30 minutes)
- [ ] Phase 7: Data isolation (30 minutes)
- [ ] Phase 8: Console/network audit (30 minutes)
- [ ] Fix bugs immediately when found
- [ ] Commit after each bug fix (individual commits!)

After completion:
- [ ] Create verification report
- [ ] Commit report to docs/reports/
- [ ] Test all fixes one more time
- [ ] Report to Mod: "W3 done - X bugs found and fixed"

---

## 🎯 Success Criteria

**Task is complete when:**
1. ✅ All 30 frontend pages tested
2. ✅ All 30 backend endpoints tested
3. ✅ DELETE operations verified (can delete offers/interviews, cannot delete job postings/candidates/analyses)
4. ✅ Analytics access verified (ANALYTICS_VIEWERS)
5. ✅ Team page access verified (read-only)
6. ✅ All bugs found are FIXED
7. ✅ All fixes are COMMITTED (individual commits)
8. ✅ Verification report created with RAW outputs
9. ✅ Final test: MANAGER has 10 sidebar items, can delete offers/interviews, can view analytics/team

**Mod will verify by:**
1. Reading your report
2. Re-running critical tests (delete operations, analytics access)
3. Checking git commits (7+ commits expected)
4. Login as MANAGER and test key features

---

## 🆘 If You Get Stuck

**Problem 1: Don't know which delete operations MANAGER can do**
```
MANAGER CAN delete:
- Offers ✅
- Interviews ✅

MANAGER CANNOT delete:
- Job Postings ❌ (ADMIN only)
- Candidates ❌ (ADMIN only)
- Analyses ❌ (ADMIN only)
```

**Problem 2: Analytics endpoints don't exist**
```
If analytics endpoints are missing:
1. Check if /offers/analytics page exists (frontend)
2. Search for analyticsRoutes.js in backend
3. Document in report: "Analytics endpoints not implemented yet"
4. Test with what exists
```

**Problem 3: Team page doesn't exist**
```
If /team page doesn't exist:
1. Document in report
2. Test GET /api/v1/team endpoint instead
3. Note in recommendations: "Team page should be implemented"
```

---

## 📚 Reference Files

**Role Groups:**
```javascript
// backend/src/constants/roles.js
ROLE_GROUPS = {
  HR_MANAGERS: [SUPER_ADMIN, ADMIN, MANAGER, HR_SPECIALIST],
  ANALYTICS_VIEWERS: [SUPER_ADMIN, ADMIN, MANAGER],  // ← MANAGER included!
  ADMINS: [SUPER_ADMIN, ADMIN]
}
```

**MANAGER in both groups:**
- HR_MANAGERS → Can do HR operations
- ANALYTICS_VIEWERS → Can view analytics

**Unique MANAGER permissions:**
- Delete offers/interviews (not all HR data)
- View analytics
- View team (read-only)

---

**🚀 Ready to start! Good luck Worker #3!**

**Remember:** MANAGER = HR_SPECIALIST + Analytics + (Delete offers/interviews) + (View team)
