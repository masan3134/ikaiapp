# 🔍 Worker Task: HR_SPECIALIST Role RBAC Comprehensive Audit & Fix

**Task ID:** W2-HR-SPECIALIST-RBAC-AUDIT
**Assigned To:** Worker #2
**Created:** 2025-11-04
**Estimated Time:** 3-4 hours
**Priority:** HIGH

---

## 🎯 Mission Statement

**Login as HR_SPECIALIST role and audit the ENTIRE application.**

**Your job:**
1. ✅ **Test what HR_SPECIALIST CAN access** → Verify it works properly
2. ❌ **Test what HR_SPECIALIST CANNOT access** → Verify blocked correctly (403/404)
3. 🐛 **Find RBAC bugs** → If HR_SPECIALIST sees things they shouldn't, FIX IT
4. 🐛 **Find missing features** → If HR_SPECIALIST can't see things they SHOULD, FIX IT

**Critical Rule:** USE REAL BROWSER TESTING + API TESTING. NO SIMULATION!

---

## 📋 Test Credentials

**Login as HR_SPECIALIST role:**
- **Email:** test-hr_specialist@test-org-1.com
- **Password:** TestPass123!
- **Organization:** Test Organization Free (Org 1)
- **Role:** HR_SPECIALIST

**Alternative test users (if needed):**
- Org 2 HR_SPECIALIST: test-hr_specialist@test-org-2.com / TestPass123!
- Org 3 HR_SPECIALIST: test-hr_specialist@test-org-3.com / TestPass123!

**Admin access (for comparison):**
- SUPER_ADMIN: info@gaiai.ai / 23235656
- Org 1 ADMIN: test-admin@test-org-1.com / TestPass123!
- Org 1 MANAGER: test-manager@test-org-1.com / TestPass123!

---

## 📊 HR_SPECIALIST Role Overview

**HR_SPECIALIST is part of RoleGroups.HR_MANAGERS:**
- SUPER_ADMIN ✅
- ADMIN ✅
- MANAGER ✅
- HR_SPECIALIST ✅ ← **THIS ROLE**
- USER ❌

**What HR_SPECIALIST SHOULD do:**
- ✅ View job postings (READ access)
- ✅ Create job postings (WRITE access)
- ❌ Delete job postings (ADMIN only)
- ✅ View candidates (READ)
- ✅ Add candidates (WRITE)
- ❌ Delete candidates (ADMIN only)
- ✅ Upload CVs & run analyses (WRITE)
- ❌ Delete analyses (ADMIN only)
- ✅ View offers (READ)
- ✅ Create offers (WRITE)
- ❌ Delete offers (MANAGER/ADMIN only)
- ✅ Schedule interviews (WRITE)
- ❌ Delete interviews (MANAGER/ADMIN only)
- ❌ Manage team (ADMIN only)
- ❌ View analytics (MANAGER+ only)
- ❌ Super admin panel (SUPER_ADMIN only)
- ❌ Organization settings (ADMIN only)
- ❌ Billing (ADMIN only)

**Summary:**
- **HR_SPECIALIST = HR operations specialist**
- **Can:** Create/view HR data (job postings, candidates, CVs, offers, interviews)
- **Cannot:** Delete HR data, manage team, view analytics, org settings

---

## 🧪 Testing Methodology

### Phase 1: Frontend Pages Audit (30 pages)

**For EACH page below:**

1. **Login as HR_SPECIALIST** (test-hr_specialist@test-org-1.com)
2. **Navigate to page** (click sidebar OR type URL manually)
3. **Check result:**
   - ✅ Page loads → Screenshot + describe what you see
   - ❌ Redirected to 403/Dashboard → Expected (document this)
   - 🐛 Page loads but should be blocked → BUG! (fix it)
   - 🐛 Page blocked but should load → BUG! (fix it)
4. **Document findings** in verification report

**Pages to test (30 total):**

#### Core Pages (8)
- `/dashboard` ← HR_SPECIALIST SHOULD ACCESS
- `/job-postings` ← HR_SPECIALIST SHOULD ACCESS (create/view)
- `/candidates` ← HR_SPECIALIST SHOULD ACCESS (create/view)
- `/analyses` ← HR_SPECIALIST SHOULD ACCESS (upload/view)
- `/offers` ← HR_SPECIALIST SHOULD ACCESS (create/view)
- `/interviews` ← HR_SPECIALIST SHOULD ACCESS (schedule/view)
- `/team` ← HR_SPECIALIST SHOULD NOT ACCESS (ADMIN only)
- `/super-admin` ← HR_SPECIALIST SHOULD NOT ACCESS (SUPER_ADMIN only)

#### Offers Sub-Pages (6)
- `/offers/new` ← SHOULD ACCESS (create offer)
- `/offers/wizard` ← SHOULD ACCESS (offer wizard)
- `/offers/analytics` ← SHOULD NOT ACCESS (MANAGER+ only)
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

**Option 1: Using Python Test Helper (RECOMMENDED!)** 🐍
```python
# Start interactive Python shell
python3 -i scripts/test-helper.py

# Create helper and login
>>> helper = IKAITestHelper()
>>> helper.login("test-hr_specialist@test-org-1.com", "TestPass123!")

# Get job postings
>>> result = helper.get("/api/v1/job-postings")
>>> print(result.json())

# Get candidate IDs
>>> result = helper.get("/api/v1/candidates")
>>> candidates = result.json()["data"]
>>> candidate_id = candidates[0]["id"]  # Copy this ID

# Get analysis IDs
>>> result = helper.get("/api/v1/analyses")
>>> print(result.json())
```

**Option 2: Using curl**
```bash
# Login as HR_SPECIALIST
curl -X POST http://localhost:8102/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test-hr_specialist@test-org-1.com","password":"TestPass123!"}'

# Get job posting IDs
curl -X GET http://localhost:8102/api/v1/job-postings \
  -H "Authorization: Bearer $HR_TOKEN"

# Get candidate IDs
curl -X GET http://localhost:8102/api/v1/candidates \
  -H "Authorization: Bearer $HR_TOKEN"

# Get analysis IDs
curl -X GET http://localhost:8102/api/v1/analyses \
  -H "Authorization: Bearer $HR_TOKEN"
```

---

### Phase 2: Backend API Audit (25 key endpoints)

**For EACH endpoint below:**

1. **Get HR_SPECIALIST token:**
   ```bash
   curl -X POST http://localhost:8102/api/v1/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"test-hr_specialist@test-org-1.com","password":"TestPass123!"}'
   ```

2. **Test endpoint with HR_SPECIALIST token:**
   ```bash
   curl -X GET http://localhost:8102/api/v1/[endpoint] \
     -H "Authorization: Bearer $HR_TOKEN"
   ```

3. **Check HTTP status code:**
   - ✅ 200 (Success) → HR_SPECIALIST allowed correctly
   - ✅ 403 (Forbidden) → HR_SPECIALIST blocked correctly
   - 🐛 403 but should be 200 → BUG! (fix backend authorize)
   - 🐛 200 but should be 403 → BUG! (fix backend authorize)

**Endpoints to test:**

#### Job Postings (5) - SHOULD WORK
- `GET /api/v1/job-postings` ← SHOULD BE 200
- `POST /api/v1/job-postings` ← SHOULD BE 200 (create)
- `GET /api/v1/job-postings/:id` ← SHOULD BE 200
- `PATCH /api/v1/job-postings/:id` ← SHOULD BE 200 (edit)
- `DELETE /api/v1/job-postings/:id` ← SHOULD BE 403 (ADMIN only)

#### Candidates (5) - SHOULD WORK (except delete)
- `GET /api/v1/candidates` ← SHOULD BE 200
- `POST /api/v1/candidates` ← SHOULD BE 200 (create)
- `GET /api/v1/candidates/:id` ← SHOULD BE 200
- `PATCH /api/v1/candidates/:id` ← SHOULD BE 200
- `DELETE /api/v1/candidates/:id` ← SHOULD BE 403 (ADMIN only)

#### Analyses (4) - SHOULD WORK
- `GET /api/v1/analyses` ← SHOULD BE 200
- `POST /api/v1/analyses` ← SHOULD BE 200 (upload CV)
- `GET /api/v1/analyses/:id` ← SHOULD BE 200
- `DELETE /api/v1/analyses/:id` ← SHOULD BE 403 (ADMIN only)

#### Offers (5) - SHOULD WORK (except delete)
- `GET /api/v1/offers` ← SHOULD BE 200
- `POST /api/v1/offers` ← SHOULD BE 200 (create)
- `GET /api/v1/offers/:id` ← SHOULD BE 200
- `PATCH /api/v1/offers/:id` ← SHOULD BE 200
- `DELETE /api/v1/offers/:id` ← SHOULD BE 403 (MANAGER/ADMIN)

#### Interviews (4) - SHOULD WORK
- `GET /api/v1/interviews` ← SHOULD BE 200
- `POST /api/v1/interviews` ← SHOULD BE 200 (schedule)
- `GET /api/v1/interviews/:id` ← SHOULD BE 200
- `DELETE /api/v1/interviews/:id` ← SHOULD BE 403 (MANAGER/ADMIN)

#### Team & Analytics (5) - SHOULD BE BLOCKED
- `GET /api/v1/team` ← SHOULD BE 403 (ADMIN only)
- `POST /api/v1/team/invite` ← SHOULD BE 403 (ADMIN only)
- `GET /api/v1/analytics/offers` ← SHOULD BE 403 (MANAGER+ only)
- `GET /api/v1/organization` ← SHOULD BE 403 (ADMIN only)
- `GET /api/v1/queue/health` ← SHOULD BE 403 (ADMIN only)

#### User's Own Data (2) - SHOULD WORK
- `GET /api/v1/user/profile` ← SHOULD BE 200
- `PATCH /api/v1/user/profile` ← SHOULD BE 200

---

### Phase 3: UI Element Visibility Audit

**Login as HR_SPECIALIST and check these UI elements:**

#### Sidebar Menu Items
**Expected for HR_SPECIALIST:**
- ✅ Dashboard (visible)
- ✅ Job Postings (visible)
- ✅ Candidates (visible)
- ✅ Analyses (visible)
- ✅ Offers (visible)
- ✅ Interviews (visible)
- ❌ Team (hidden - ADMIN only)
- ❌ Analytics (hidden - MANAGER+ only)
- ❌ Super Admin (hidden)
- ✅ Notifications (visible)
- ✅ Settings (visible)

**How to check:**
1. Open http://localhost:8103/dashboard
2. Look at left sidebar
3. Count visible menu items (should be ~8)
4. Screenshot the sidebar
5. Compare with USER sidebar (fewer items) and ADMIN sidebar (more items)

---

#### Dashboard Widgets
**Expected for HR_SPECIALIST:**
- ✅ Welcome message
- ✅ HR pipeline stats (job postings, candidates, analyses)
- ✅ Recent activity (latest analyses, offers)
- ✅ "Upload CV" button / quick action
- ✅ "Create Job Posting" button
- ❌ No admin widgets (team management, billing)
- ❌ No analytics charts (MANAGER+ only)

**How to check:**
1. Login as HR_SPECIALIST → /dashboard
2. Screenshot entire dashboard
3. List all visible buttons/widgets
4. Compare with ADMIN dashboard (more widgets) and USER dashboard (minimal)

---

#### Action Buttons (6 pages to check)

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
- ❌ "Delete" buttons (hidden - MANAGER/ADMIN)
- ❌ "Analytics" button (hidden - MANAGER+ only)

**5. Interviews page:**
- ✅ "Schedule Interview" button (visible)
- ✅ "Edit" buttons (visible)
- ❌ "Delete" buttons (hidden - MANAGER/ADMIN)

**6. Team page (if accessible - should NOT be):**
- ❌ Should get 403 (entire page blocked)
- If somehow accessible: NO buttons should be visible

---

### Phase 4: CRUD Operations Testing

**Test actual CRUD operations to verify permissions:**

#### Test 1: Create Job Posting
```bash
curl -X POST http://localhost:8102/api/v1/job-postings \
  -H "Authorization: Bearer $HR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Job by HR_SPECIALIST",
    "description": "Testing HR_SPECIALIST create permission",
    "location": "Istanbul",
    "employmentType": "FULL_TIME"
  }'
```

**Expected:** 201 Created (success)

**Verify:**
- GET /api/v1/job-postings should include new job
- Frontend /job-postings should show new job

---

#### Test 2: Edit Job Posting
```bash
# Get a job posting ID first
JOB_ID="[from GET /api/v1/job-postings]"

curl -X PATCH http://localhost:8102/api/v1/job-postings/$JOB_ID \
  -H "Authorization: Bearer $HR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated by HR_SPECIALIST"
  }'
```

**Expected:** 200 OK (success)

---

#### Test 3: Delete Job Posting (SHOULD FAIL)
```bash
curl -X DELETE http://localhost:8102/api/v1/job-postings/$JOB_ID \
  -H "Authorization: Bearer $HR_TOKEN"
```

**Expected:** 403 Forbidden (HR_SPECIALIST cannot delete)

---

#### Test 4: Upload CV & Run Analysis
```bash
curl -X POST http://localhost:8102/api/v1/analyses \
  -H "Authorization: Bearer $HR_TOKEN" \
  -F "jobPostingId=$JOB_ID" \
  -F "file=@test-data/cvs/org1-junior-frontend-developer/cv-01-high-match.txt"
```

**Expected:** 201 Created (analysis queued)

**Verify:**
- Queue should process the CV
- GET /api/v1/analyses should show the analysis
- Frontend /analyses should show result

---

#### Test 5: Create Offer
```bash
# Get a candidate ID first
CANDIDATE_ID="[from GET /api/v1/candidates]"

curl -X POST http://localhost:8102/api/v1/offers \
  -H "Authorization: Bearer $HR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "candidateId": "'$CANDIDATE_ID'",
    "position": "Test Position",
    "salary": 50000,
    "currency": "TRY",
    "startDate": "2025-12-01"
  }'
```

**Expected:** 201 Created

---

#### Test 6: Schedule Interview
```bash
curl -X POST http://localhost:8102/api/v1/interviews \
  -H "Authorization: Bearer $HR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "candidateId": "'$CANDIDATE_ID'",
    "scheduledAt": "2025-11-10T10:00:00Z",
    "type": "TECHNICAL",
    "location": "Office"
  }'
```

**Expected:** 201 Created

---

#### Test 7: Delete Candidate (SHOULD FAIL)
```bash
curl -X DELETE http://localhost:8102/api/v1/candidates/$CANDIDATE_ID \
  -H "Authorization: Bearer $HR_TOKEN"
```

**Expected:** 403 Forbidden (ADMIN only)

---

#### Test 8: Invite Team Member (SHOULD FAIL)
```bash
curl -X POST http://localhost:8102/api/v1/team/invite \
  -H "Authorization: Bearer $HR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newhr@test-org-1.com",
    "role": "HR_SPECIALIST"
  }'
```

**Expected:** 403 Forbidden (ADMIN only)

---

### Phase 5: Data Isolation Testing

**Verify HR_SPECIALIST can only see own organization data:**

#### Test 1: Multi-Tenant Job Postings
```bash
# Login as Org 1 HR_SPECIALIST
curl -X POST http://localhost:8102/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test-hr_specialist@test-org-1.com","password":"TestPass123!"}'

# Get job postings
curl -X GET http://localhost:8102/api/v1/job-postings \
  -H "Authorization: Bearer $HR_ORG1_TOKEN"
```

**Expected:** Only Org 1 job postings (2 total)

**Verify:**
- Should NOT see Org 2 or Org 3 job postings
- Count should be 2 (not 6)

---

#### Test 2: Cross-Org Data Access (SHOULD FAIL)
```bash
# Try to access Org 2's candidate (get ID from SUPER_ADMIN first)
ORG2_CANDIDATE_ID="[org 2 candidate id]"

curl -X GET http://localhost:8102/api/v1/candidates/$ORG2_CANDIDATE_ID \
  -H "Authorization: Bearer $HR_ORG1_TOKEN"
```

**Expected:** 404 Not Found OR 403 Forbidden

**Verify:** HR_SPECIALIST cannot access other organizations' data

---

### Phase 6: Browser Console & Network Audit

**Check for frontend errors:**

1. **Open browser DevTools** (F12)
2. **Login as HR_SPECIALIST** (test-hr_specialist@test-org-1.com)
3. **Navigate to /dashboard**
4. **Check Console tab:**
   - ❌ No role-related errors
   - ❌ No "undefined role" errors
   - ❌ No 403 errors for allowed resources

5. **Check Network tab:**
   - Filter by "api/v1"
   - Look for red (failed) requests
   - Check if HR_SPECIALIST is making unauthorized API calls
   - Document any 403s (expected or unexpected)

6. **Test all HR pages:**
   - /job-postings → No errors
   - /candidates → No errors
   - /analyses → No errors
   - /offers → No errors
   - /interviews → No errors

**Example console errors to look for:**
```
❌ BAD: "User role 'HR_SPECIALIST' not recognized"
❌ BAD: "403 Forbidden: /api/v1/job-postings" (should be 200!)
❌ BAD: "Cannot access team page" (on dashboard - if auto-fetching)
✅ GOOD: No errors
```

---

## 🐛 Bug Fixing Protocol

**When you find a bug:**

### Frontend Bug (Page blocked but shouldn't be)

**Example:** HR_SPECIALIST gets 403 on /job-postings (should be accessible)

**Fix:**
1. **Read the page file:**
   ```
   Read('frontend/app/(authenticated)/job-postings/page.tsx')
   ```

2. **Check withRoleProtection:**
   ```typescript
   // WRONG (too restrictive):
   export default withRoleProtection(JobPostingsPage, {
     allowedRoles: [UserRole.SUPER_ADMIN, UserRole.ADMIN] // Missing HR_SPECIALIST!
   });

   // RIGHT:
   export default withRoleProtection(JobPostingsPage, {
     allowedRoles: RoleGroups.HR_MANAGERS // Includes HR_SPECIALIST ✅
   });
   ```

3. **Fix using Edit tool:**
   ```
   Edit(
     file_path: 'frontend/app/(authenticated)/job-postings/page.tsx',
     old_string: 'allowedRoles: [UserRole.SUPER_ADMIN, UserRole.ADMIN]',
     new_string: 'allowedRoles: RoleGroups.HR_MANAGERS'
   )
   ```

4. **IMMEDIATELY commit:**
   ```bash
   git add frontend/app/(authenticated)/job-postings/page.tsx
   git commit -m "fix(rbac): Allow HR_SPECIALIST to access job-postings page

   Bug: HR_SPECIALIST got 403 on /job-postings (should be accessible)
   Fix: Changed allowedRoles from [SUPER_ADMIN, ADMIN] to RoleGroups.HR_MANAGERS

   RoleGroups.HR_MANAGERS includes: SUPER_ADMIN, ADMIN, MANAGER, HR_SPECIALIST

   Test: Login as test-hr_specialist@test-org-1.com → /job-postings → 200 ✅"
   ```

5. **Test the fix:**
   ```bash
   # Rebuild frontend
   cd frontend && npm run build

   # Test with HR_SPECIALIST login
   # Navigate to /job-postings → Should load successfully
   ```

---

### Backend Bug (Endpoint returns 403 but should be 200)

**Example:** POST /api/v1/job-postings returns 403 for HR_SPECIALIST

**Fix:**
1. **Find the route file:**
   ```
   Grep(pattern: 'router.post.*job-postings', path: 'backend/src/routes/')
   ```

2. **Read the routes file:**
   ```
   Read('backend/src/routes/jobPostingRoutes.js')
   ```

3. **Check authorize middleware:**
   ```javascript
   // WRONG (missing HR_SPECIALIST):
   router.post('/', authorize(['ADMIN', 'MANAGER']), jobPostingController.create);

   // RIGHT:
   router.post('/', authorize(['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'HR_SPECIALIST']), jobPostingController.create);
   ```

4. **Fix using Edit tool:**
   ```
   Edit(
     file_path: 'backend/src/routes/jobPostingRoutes.js',
     old_string: "router.post('/', authorize(['ADMIN', 'MANAGER']), jobPostingController.create);",
     new_string: "router.post('/', authorize(['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'HR_SPECIALIST']), jobPostingController.create);"
   )
   ```

5. **IMMEDIATELY commit:**
   ```bash
   git add backend/src/routes/jobPostingRoutes.js
   git commit -m "fix(rbac): Allow HR_SPECIALIST to create job postings

   Bug: POST /api/v1/job-postings returned 403 for HR_SPECIALIST
   Fix: Added 'HR_SPECIALIST' to authorize middleware

   Test: curl with HR_SPECIALIST token → 201 Created ✅"
   ```

6. **Test the fix:**
   ```bash
   # Backend restarts automatically (nodemon)
   # Wait 2 seconds, then test:
   curl -X POST http://localhost:8102/api/v1/job-postings \
     -H "Authorization: Bearer $HR_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"title":"Test Job"}'
   # Should return 201
   ```

---

### UI Element Bug (Button hidden but should be visible)

**Example:** HR_SPECIALIST cannot see "Create Job Posting" button

**Fix:**
1. **Read the component:**
   ```
   Read('frontend/app/(authenticated)/job-postings/page.tsx')
   ```

2. **Find the button:**
   ```typescript
   // WRONG (too restrictive):
   import { useHasRole } from '@/lib/hooks/useHasRole';

   const canCreate = useHasRole([UserRole.ADMIN]); // Missing HR_SPECIALIST!

   {canCreate && (
     <button>Create Job Posting</button>
   )}

   // RIGHT:
   import { RoleGroups } from '@/lib/constants/roles';

   const canCreate = useHasRole(RoleGroups.HR_MANAGERS);

   {canCreate && (
     <button>Create Job Posting</button>
   )}
   ```

3. **Fix the hook call:**
   ```
   Edit(
     file_path: '...',
     old_string: 'const canCreate = useHasRole([UserRole.ADMIN]);',
     new_string: 'const canCreate = useHasRole(RoleGroups.HR_MANAGERS);'
   )
   ```

4. **Commit + test**

---

## 📝 Verification Report Template

**Create:** `docs/reports/worker2-hr-specialist-rbac-audit-report.md`

```markdown
# 🔍 Worker 2 - HR_SPECIALIST Role RBAC Audit Report

**Worker:** Worker #2
**Date:** 2025-11-04
**Task:** HR_SPECIALIST role comprehensive RBAC audit & fix
**Test User:** test-hr_specialist@test-org-1.com / TestPass123!
**Duration:** X hours

---

## Executive Summary

**Status:** ✅ PASS / ❌ FAIL

**Bugs Found:** X
**Bugs Fixed:** X
**Tests Performed:** X

**Key Findings:**
- [Summary of major bugs]
- [Overall RBAC health]
- [HR_SPECIALIST role permissions accuracy]

---

## Phase 1: Frontend Pages Audit (30 pages)

### Core Pages (8)

#### 1. /dashboard
**Expected:** ✅ HR_SPECIALIST can access
**Result:** ✅ PASS
**Screenshot:** [paste or describe]
**Details:**
- Page loads correctly
- HR dashboard visible (job postings, candidates, analyses stats)
- "Upload CV" quick action visible
- No errors in console

#### 2. /job-postings
**Expected:** ✅ HR_SPECIALIST can access
**Result:** ✅ PASS / ❌ FAIL
**Details:**
[If PASS: "Page loads, can see job postings, 'Create' button visible"]
[If FAIL: "BUG - 403 error! Fixed in commit abc123"]

#### 3. /candidates
**Expected:** ✅ HR_SPECIALIST can access
**Result:** [...]

#### 4. /team
**Expected:** ❌ HR_SPECIALIST blocked (ADMIN only)
**Result:** ✅ PASS / ❌ FAIL
**Details:**
[If PASS: "403 error as expected"]
[If FAIL: "BUG - Can access team page! Fixed in commit def456"]

[... Continue for all 30 pages ...]

---

## Phase 2: Backend API Audit (25 endpoints)

### Job Postings (5)

#### GET /api/v1/job-postings
**Expected:** 200 (Success)
**Command:**
```bash
curl -X GET http://localhost:8102/api/v1/job-postings \
  -H "Authorization: Bearer eyJhbGc..."
```

**Output:**
```json
{
  "data": [
    {
      "id": "...",
      "title": "Junior Frontend Developer",
      "organizationId": "7ccc7b62-af0c-4161-9231-c36aa06ac6dc"
    },
    {
      "id": "...",
      "title": "Software Test Engineer",
      "organizationId": "7ccc7b62-af0c-4161-9231-c36aa06ac6dc"
    }
  ],
  "total": 2
}
```

**Result:** ✅ PASS
**Verification:** Only Org 1 job postings visible (2 total, not 6)

---

#### POST /api/v1/job-postings
**Expected:** 201 (Created)
**Command:**
```bash
curl -X POST http://localhost:8102/api/v1/job-postings \
  -H "Authorization: Bearer $HR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Job by HR_SPECIALIST",
    "description": "Testing create permission",
    "location": "Istanbul",
    "employmentType": "FULL_TIME"
  }'
```

**Output:**
```json
{
  "id": "new-job-id-123",
  "title": "Test Job by HR_SPECIALIST",
  "createdBy": "hr-specialist-user-id",
  "organizationId": "7ccc7b62-af0c-4161-9231-c36aa06ac6dc"
}
```

**Result:** ✅ PASS
**Verification:** Job created successfully, organizationId matches Org 1

---

#### DELETE /api/v1/job-postings/:id
**Expected:** 403 (Forbidden - ADMIN only)
**Command:**
```bash
curl -X DELETE http://localhost:8102/api/v1/job-postings/new-job-id-123 \
  -H "Authorization: Bearer $HR_TOKEN"
```

**Output:**
```json
{
  "error": "Forbidden",
  "message": "You do not have permission to delete job postings",
  "statusCode": 403
}
```

**Result:** ✅ PASS

[... Continue for all 25 endpoints ...]

---

## Phase 3: UI Element Visibility Audit

### Sidebar Menu Items

**Login as HR_SPECIALIST:**
**Screenshot:** [describe or paste]

**Visible items:**
- ✅ Dashboard
- ✅ Job Postings
- ✅ Candidates
- ✅ Analyses
- ✅ Offers
- ✅ Interviews
- ✅ Notifications
- ✅ Settings

**Hidden items (expected):**
- ❌ Team (correctly hidden - ADMIN only)
- ❌ Analytics (correctly hidden - MANAGER+ only)
- ❌ Super Admin (correctly hidden)

**Result:** ✅ PASS / ❌ FAIL

**Comparison:**
- USER sidebar: 3 items (Dashboard, Notifications, Settings)
- HR_SPECIALIST sidebar: 8 items ✅
- ADMIN sidebar: 10+ items (has Team, Analytics)

---

### Dashboard Widgets

**Screenshot:** [describe]

**Visible widgets:**
- Welcome message: "Welcome, Test HR SPECIALIST 1"
- Job Postings count: 2
- Candidates count: X
- Analyses count: X
- Recent activity feed
- "Upload CV" button ✅
- "Create Job Posting" button ✅

**Hidden widgets (expected):**
- ❌ No "Manage Team" widget (ADMIN only) ✅
- ❌ No analytics charts (MANAGER+ only) ✅
- ❌ No billing info (ADMIN only) ✅

**Result:** ✅ PASS

---

### Action Buttons - Job Postings Page

**URL:** http://localhost:8103/job-postings

**Visible buttons:**
- ✅ "Create Job Posting" (top right)
- ✅ "Edit" buttons (per job)
- ❌ "Delete" buttons NOT visible (ADMIN only) ✅

**Result:** ✅ PASS / ❌ FAIL

**Screenshot:** [describe button layout]

---

### Action Buttons - Candidates Page

**Visible buttons:**
- ✅ "Add Candidate" (top right)
- ✅ "Upload CV" (top right)
- ✅ "Edit" buttons (per candidate)
- ❌ "Delete" buttons NOT visible (ADMIN only) ✅

**Result:** ✅ PASS

---

### Action Buttons - Analyses Page

**Visible buttons:**
- ✅ "New Analysis" (top right)
- ✅ "Upload CVs" (wizard button)
- ❌ "Delete" buttons NOT visible (ADMIN only) ✅

**Result:** ✅ PASS

---

## Phase 4: CRUD Operations Testing

### Test 1: Create Job Posting
**Command:**
```bash
curl -X POST http://localhost:8102/api/v1/job-postings \
  -H "Authorization: Bearer $HR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "HR Test Job",
    "description": "Created by HR_SPECIALIST for testing",
    "location": "Istanbul",
    "employmentType": "FULL_TIME"
  }'
```

**Output:**
```json
{
  "id": "test-job-hr-123",
  "title": "HR Test Job",
  "createdBy": "hr-user-id",
  "organizationId": "org-1-id"
}
```

**Result:** ✅ PASS (201 Created)

**Verification:**
```bash
# Check if job appears in GET /api/v1/job-postings
curl -X GET http://localhost:8102/api/v1/job-postings \
  -H "Authorization: Bearer $HR_TOKEN"
# Output includes "HR Test Job" ✅
```

---

### Test 2: Edit Job Posting
**Command:**
```bash
curl -X PATCH http://localhost:8102/api/v1/job-postings/test-job-hr-123 \
  -H "Authorization: Bearer $HR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title": "Updated by HR_SPECIALIST"}'
```

**Output:**
```json
{
  "id": "test-job-hr-123",
  "title": "Updated by HR_SPECIALIST"
}
```

**Result:** ✅ PASS (200 OK)

---

### Test 3: Delete Job Posting (SHOULD FAIL)
**Command:**
```bash
curl -X DELETE http://localhost:8102/api/v1/job-postings/test-job-hr-123 \
  -H "Authorization: Bearer $HR_TOKEN"
```

**Output:**
```json
{
  "error": "Forbidden",
  "statusCode": 403
}
```

**Result:** ✅ PASS (403 Forbidden - ADMIN only)

---

### Test 4: Upload CV & Run Analysis
**Command:**
```bash
curl -X POST http://localhost:8102/api/v1/analyses \
  -H "Authorization: Bearer $HR_TOKEN" \
  -F "jobPostingId=existing-job-id" \
  -F "file=@test-data/cvs/org1-junior-frontend-developer/cv-01-high-match.txt"
```

**Output:**
```json
{
  "id": "analysis-123",
  "status": "PENDING",
  "message": "CV uploaded successfully, analysis queued"
}
```

**Result:** ✅ PASS (201 Created)

**Verification:**
```bash
# Wait 30 seconds for queue processing
sleep 30

# Check analysis result
curl -X GET http://localhost:8102/api/v1/analyses/analysis-123 \
  -H "Authorization: Bearer $HR_TOKEN"

# Output should show COMPLETED status with match score
```

**Final Status:** ✅ Analysis completed with 95% match score

---

### Test 5: Create Offer
**Command:**
```bash
curl -X POST http://localhost:8102/api/v1/offers \
  -H "Authorization: Bearer $HR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "candidateId": "candidate-123",
    "position": "Test Position",
    "salary": 50000,
    "currency": "TRY",
    "startDate": "2025-12-01"
  }'
```

**Output:**
```json
{
  "id": "offer-123",
  "candidateId": "candidate-123",
  "position": "Test Position",
  "createdBy": "hr-user-id"
}
```

**Result:** ✅ PASS (201 Created)

---

### Test 6: Delete Offer (SHOULD FAIL)
**Command:**
```bash
curl -X DELETE http://localhost:8102/api/v1/offers/offer-123 \
  -H "Authorization: Bearer $HR_TOKEN"
```

**Output:**
```json
{
  "error": "Forbidden",
  "statusCode": 403
}
```

**Result:** ✅ PASS (403 Forbidden - MANAGER/ADMIN only)

---

### Test 7: Schedule Interview
**Command:**
```bash
curl -X POST http://localhost:8102/api/v1/interviews \
  -H "Authorization: Bearer $HR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "candidateId": "candidate-123",
    "scheduledAt": "2025-11-10T10:00:00Z",
    "type": "TECHNICAL",
    "location": "Office"
  }'
```

**Output:**
```json
{
  "id": "interview-123",
  "candidateId": "candidate-123",
  "scheduledAt": "2025-11-10T10:00:00.000Z"
}
```

**Result:** ✅ PASS (201 Created)

---

### Test 8: Invite Team Member (SHOULD FAIL)
**Command:**
```bash
curl -X POST http://localhost:8102/api/v1/team/invite \
  -H "Authorization: Bearer $HR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newhr@test-org-1.com",
    "role": "HR_SPECIALIST"
  }'
```

**Output:**
```json
{
  "error": "Forbidden",
  "statusCode": 403
}
```

**Result:** ✅ PASS (403 Forbidden - ADMIN only)

---

## Phase 5: Data Isolation Testing

### Test 1: Multi-Tenant Job Postings
**Command:**
```bash
# Login as Org 1 HR_SPECIALIST
curl -X POST http://localhost:8102/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test-hr_specialist@test-org-1.com","password":"TestPass123!"}'

# Get job postings
curl -X GET http://localhost:8102/api/v1/job-postings \
  -H "Authorization: Bearer $HR_ORG1_TOKEN"
```

**Output:**
```json
{
  "data": [
    {"id": "...", "title": "Junior Frontend Developer", "organizationId": "org-1-id"},
    {"id": "...", "title": "Software Test Engineer", "organizationId": "org-1-id"}
  ],
  "total": 2
}
```

**Result:** ✅ PASS
**Verification:** Only Org 1 job postings (2 total, not 6)

---

### Test 2: Cross-Org Data Access (SHOULD FAIL)
**Setup:**
```bash
# Login as SUPER_ADMIN to get Org 2 candidate ID
curl -X POST http://localhost:8102/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"info@gaiai.ai","password":"23235656"}'

# Get Org 2 candidates
curl -X GET http://localhost:8102/api/v1/candidates \
  -H "Authorization: Bearer $SUPER_ADMIN_TOKEN"

# Copy an Org 2 candidate ID: "org2-candidate-abc123"
```

**Test:**
```bash
# Try to access Org 2 candidate with Org 1 HR_SPECIALIST token
curl -X GET http://localhost:8102/api/v1/candidates/org2-candidate-abc123 \
  -H "Authorization: Bearer $HR_ORG1_TOKEN"
```

**Output:**
```json
{
  "error": "Not Found",
  "statusCode": 404
}
```

**Result:** ✅ PASS (404 - HR_SPECIALIST cannot access other orgs' data)

---

## Phase 6: Browser Console & Network Audit

### Console Errors

**Browser:** Chrome/Firefox
**DevTools Console:**

**Test Pages:**
1. /dashboard → No errors ✅
2. /job-postings → No errors ✅
3. /candidates → No errors ✅
4. /analyses → No errors ✅
5. /offers → No errors ✅
6. /interviews → No errors ✅

**Errors found:**
```
No role-related errors ✅
No undefined errors ✅
No 403 errors for allowed resources ✅
```

**Result:** ✅ PASS

---

### Network Tab Audit

**Filter:** XHR/Fetch (API calls)

**Successful API calls (200):**
- GET /api/v1/job-postings → 200 ✅
- GET /api/v1/candidates → 200 ✅
- GET /api/v1/analyses → 200 ✅
- GET /api/v1/offers → 200 ✅
- GET /api/v1/interviews → 200 ✅
- GET /api/v1/user/profile → 200 ✅

**Blocked API calls (403 - expected):**
- GET /api/v1/team → 403 (if auto-fetched, expected for HR_SPECIALIST)
- GET /api/v1/analytics/offers → 403 (expected, MANAGER+ only)

**Unexpected 403s:**
[None found] ✅

**Result:** ✅ PASS

---

## 🐛 Bugs Found & Fixed

### Bug #1: HR_SPECIALIST could NOT create offers

**Severity:** HIGH
**File:** backend/src/routes/offerRoutes.js
**Issue:** Missing 'HR_SPECIALIST' in authorize middleware

**Original Code:**
```javascript
router.post('/', authorize(['SUPER_ADMIN', 'ADMIN', 'MANAGER']), offerController.create);
```

**Fixed Code:**
```javascript
router.post('/', authorize(['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'HR_SPECIALIST']), offerController.create);
```

**Commit:** abc123def456
**Test:** curl POST /api/v1/offers with HR_TOKEN → 201 Created ✅

---

### Bug #2: "Delete" button visible on candidates page

**Severity:** MEDIUM
**File:** frontend/app/(authenticated)/candidates/page.tsx
**Issue:** Delete button not conditionally hidden for HR_SPECIALIST

**Original Code:**
```typescript
<button>Delete</button>
```

**Fixed Code:**
```typescript
import { useHasRole } from '@/lib/hooks/useHasRole';

const canDelete = useHasRole([UserRole.SUPER_ADMIN, UserRole.ADMIN]);

{canDelete && <button>Delete</button>}
```

**Commit:** def456abc789
**Test:** Login as HR_SPECIALIST → Delete button NOT visible ✅

---

[... Continue for all bugs ...]

---

## 📊 Summary Statistics

| Category | Total | Pass | Fail | Fixed |
|----------|-------|------|------|-------|
| **Frontend Pages** | 30 | 29 | 1 | 1 |
| **Backend APIs** | 25 | 23 | 2 | 2 |
| **UI Elements** | 10 | 9 | 1 | 1 |
| **CRUD Operations** | 8 | 8 | 0 | 0 |
| **Data Isolation** | 2 | 2 | 0 | 0 |
| **Console/Network** | 1 | 1 | 0 | 0 |
| **TOTAL** | 76 | 72 | 4 | 4 |

**Bug Severity:**
- HIGH: 2 (Backend authorization missing)
- MEDIUM: 2 (UI button visibility)

**All bugs fixed and verified ✅**

---

## 🎯 Recommendations

1. **Standardize authorize arrays**
   - Use ROLE_GROUPS.HR_MANAGERS in backend authorize
   - Avoid hardcoded role arrays

2. **UI button helper function**
   - Create canDelete(feature) helper
   - Centralize delete permission logic

3. **Automated RBAC tests**
   - E2E tests for HR_SPECIALIST role
   - Test all CRUD operations automatically

4. **Documentation update**
   - Add HR_SPECIALIST permission matrix
   - Document what HR can/cannot do

---

## ✅ Final Verdict

**HR_SPECIALIST Role RBAC Status:** ✅ PASS (after fixes)

**HR_SPECIALIST can access:**
- ✅ Dashboard (HR-focused)
- ✅ Job Postings (create, edit, view)
- ✅ Candidates (create, edit, view)
- ✅ Analyses (upload, view)
- ✅ Offers (create, edit, view)
- ✅ Interviews (schedule, edit, view)
- ✅ Notifications (own only)
- ✅ Settings (profile, notifications, security)

**HR_SPECIALIST cannot access (correctly blocked):**
- ❌ Delete operations (job postings, candidates, analyses, offers, interviews)
- ❌ Team management (ADMIN only)
- ❌ Analytics (MANAGER+ only)
- ❌ Super Admin panel
- ❌ Organization settings
- ❌ Billing

**Data Isolation:**
- ✅ HR_SPECIALIST can only see own organization data
- ✅ Cannot access other orgs' candidates/job postings
- ✅ Multi-tenant isolation working

**All 4 bugs found were fixed and verified ✅**

---

**Prepared by:** Worker #2
**Date:** 2025-11-04
**Commits:** 4 (1 per bug fix)
**Files Changed:** 4
**Test Duration:** X hours
```

---

## 🚀 Execution Checklist

Before starting:
- [ ] Read this entire task (15 minutes)
- [ ] Login as HR_SPECIALIST to verify credentials work
- [ ] Open browser DevTools (F12)
- [ ] Have curl/Postman ready for API tests

During execution:
- [ ] Phase 1: Test all 30 frontend pages (1.5 hours)
- [ ] Phase 2: Test all 25 backend endpoints (1 hour)
- [ ] Phase 3: Check UI elements (30 minutes)
- [ ] Phase 4: CRUD operations (30 minutes)
- [ ] Phase 5: Data isolation (30 minutes)
- [ ] Phase 6: Console/network audit (30 minutes)
- [ ] Fix bugs immediately when found
- [ ] Commit after each bug fix (individual commits!)

After completion:
- [ ] Create verification report (use template above)
- [ ] Commit report to docs/reports/
- [ ] Test all fixes one more time
- [ ] Report to Mod: "W2 done - X bugs found and fixed"

---

## 🆘 If You Get Stuck

**Problem 1: Can't login as HR_SPECIALIST**
```bash
# Recreate test data
docker exec ikai-backend node /usr/src/app/create-test-data.js

# Try again with test-hr_specialist@test-org-1.com / TestPass123!
```

**Problem 2: Don't know what HR_SPECIALIST SHOULD access**
```
Refer to "HR_SPECIALIST Role Overview" section at top.

General rule:
- HR_SPECIALIST can: Create/view HR data (job postings, candidates, CVs, offers, interviews)
- HR_SPECIALIST cannot: Delete HR data, manage team, view analytics, org settings
```

**Problem 3: Found bug, don't know how to fix**
```
1. Read the "Bug Fixing Protocol" section
2. Check W1's task for similar examples (USER role fixes)
3. Ask Mod for guidance
```

---

## 📚 Reference Files

**RBAC Implementation:**
- Frontend HOC: `frontend/lib/hoc/withRoleProtection.tsx`
- Frontend Hook: `frontend/lib/hooks/useHasRole.ts`
- Backend Middleware: `backend/src/middleware/authorize.js`
- Role Constants: `backend/src/constants/roles.js`
- Role Groups: `frontend/lib/constants/roles.ts`

**RoleGroups.HR_MANAGERS includes:**
- SUPER_ADMIN
- ADMIN
- MANAGER
- HR_SPECIALIST ← **YOUR ROLE**

---

## 🎯 Success Criteria

**Task is complete when:**
1. ✅ All 30 frontend pages tested
2. ✅ All 25 backend endpoints tested
3. ✅ All 8 CRUD operations tested
4. ✅ Data isolation verified (multi-tenant)
5. ✅ All bugs found are FIXED
6. ✅ All fixes are COMMITTED (individual commits)
7. ✅ Verification report created with RAW outputs
8. ✅ Final test: Login as HR_SPECIALIST → Can access HR features, cannot access admin features

**Mod will verify by:**
1. Reading your report
2. Re-running spot checks (some tests)
3. Checking git commits (4+ commits for bug fixes)
4. Login as HR_SPECIALIST and test key features

---

**🚀 Ready to start! Good luck Worker #2!**
