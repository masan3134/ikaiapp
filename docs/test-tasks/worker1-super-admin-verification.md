# 🔐 Worker #1 - SUPER_ADMIN Cross-Organization Access Verification

**Task ID:** worker1-super-admin-verification
**Assigned To:** Worker #1
**Created By:** Master Claude (Mod)
**Date:** 2025-11-04
**Priority:** HIGH
**Estimated Time:** 45-60 minutes

---

## 🎯 Objective

Verify that **SUPER_ADMIN** (info@gaiai.ai) can see **ALL organizations' data** without organizationId filtering issues. Test middleware, token handling, and cross-org access across 5 controllers.

---

## 📋 Background

### Context
- RBAC Layer 2 was fixed in commit `00397af`
- SUPER_ADMIN should now bypass organizationId filters
- Must see data from all 3 test organizations

### Previous Work
- ✅ 5 controllers fixed (candidate, jobPosting, analysis, offer, interview)
- ✅ 2 services fixed (offerService, interviewService)
- ✅ organizationIsolation middleware updated (req.userRole extraction)
- ✅ Test data created: 3 orgs, 12 users, 6 job postings, 30 CVs

### Test Environment
- **Backend:** http://localhost:8102
- **Frontend:** http://localhost:8103
- **Database:** PostgreSQL (ikai-postgres container)
- **Test Helper:** `scripts/test-helper.py`

---

## 🔑 Test Accounts

| Role | Email | Password | Expected Behavior |
|------|-------|----------|-------------------|
| **SUPER_ADMIN** | info@gaiai.ai | 23235656 | See ALL data from all 3 organizations |
| **Org 1 Admin** | test-admin@test-org-1.com | TestPass123! | See ONLY Org 1 data (2 job postings) |
| **Org 2 Admin** | test-admin@test-org-2.com | TestPass123! | See ONLY Org 2 data (2 job postings) |
| **Org 3 Admin** | test-admin@test-org-3.com | TestPass123! | See ONLY Org 3 data (2 job postings) |

---

## ✅ Tasks Checklist

### Task 1: Backend Health Check

**Goal:** Verify backend is running and accessible

```bash
# Check backend health
curl -s http://localhost:8102/health | jq

# Check Docker container status
docker ps --filter name=ikai-backend --format '{{.Status}}'
```

**Expected Output:**
- Health check: `{"status":"ok"}`
- Container: `Up X minutes/hours`

**Verification:** ✅ Backend must be healthy before testing

---

### Task 2: SUPER_ADMIN Login & Token Extraction

**Goal:** Login as SUPER_ADMIN and verify token structure

```bash
# Login and get token
curl -s -X POST http://localhost:8102/api/v1/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"info@gaiai.ai","password":"23235656"}' | jq

# Save token to variable
TOKEN="<paste-token-here>"
```

**Expected Output:**
- JWT token exists
- Token has `role: "SUPER_ADMIN"`
- Token has `userId` matching info@gaiai.ai

**Critical Check:** Decode JWT (use jwt.io or base64) and verify `"role": "SUPER_ADMIN"` field exists

**Save token for next tests!**

---

### Task 3: Job Postings - Cross-Org Access ⭐ CRITICAL

**Goal:** SUPER_ADMIN should see ALL 6 job postings (2 from each org)

```python
# Use Python test helper
python3 -i scripts/test-helper.py

# Login as SUPER_ADMIN
helper = IKAITestHelper()
helper.login('info@gaiai.ai', '23235656')

# Get all job postings
response = helper.get('/api/v1/job-postings')

# Count and analyze
print(f'Total job postings: {len(response)}')
print(f'Expected: 6 (not 0, not 2!)')
print()

# Show org distribution
for jp in response:
    print(f'  - {jp["title"]} (Org: {jp["organizationId"][:8]}...)')

# Count unique organizations
org_ids = set(jp['organizationId'] for jp in response)
print(f'\nUnique organizations: {len(org_ids)} (expected: 3)')
```

**Expected Results:**
- ✅ **Total count: 6** (not 0, not 2)
- ✅ **Unique org IDs: 3**
- ✅ No 403 error
- ✅ Distribution:
  - Org 1 (test-org-free): 2 job postings
  - Org 2 (test-org-pro): 2 job postings
  - Org 3 (test-org-enterprise): 2 job postings

**Failure Scenarios:**

| Count | Diagnosis | Likely Cause |
|-------|-----------|--------------|
| **0** | organizationIsolation middleware blocking | req.userRole not set or checked |
| **2** | SUPER_ADMIN treated as normal user | organizationId filter applied |
| **403** | authorize middleware blocking | SUPER_ADMIN not in allowed roles |

**🚨 If count != 6, STOP and investigate immediately!**

---

### Task 4: Candidates - Cross-Org Access

**Goal:** SUPER_ADMIN should see ALL candidates from all orgs

```python
# Get all candidates
response = helper.get('/api/v1/candidates')
print(f'Total candidates: {len(response)}')

# Analyze organization distribution
org_ids = set(c['organizationId'] for c in response)
print(f'Unique organizations: {len(org_ids)}')

# Count per org
for org_id in org_ids:
    count = sum(1 for c in response if c['organizationId'] == org_id)
    print(f'  - Org {org_id[:8]}...: {count} candidates')
```

**Expected Results:**
- ✅ Total count: >= 30 (exact count may vary)
- ✅ Unique org IDs: 3
- ✅ Candidates from all 3 test organizations

---

### Task 5: Analyses - Cross-Org Access

**Goal:** SUPER_ADMIN should see ALL analyses from all orgs

```python
# Get all analyses
response = helper.get('/api/v1/analyses')
print(f'Total analyses: {len(response)}')

if len(response) > 0:
    org_ids = set(a['organizationId'] for a in response if 'organizationId' in a)
    print(f'Unique organizations: {len(org_ids)}')
else:
    print('No analyses found (this is OK if no analyses created yet)')
```

**Expected Results:**
- ✅ Total count: >= 0 (may be empty if no analyses run)
- ✅ Unique org IDs: >= 1 (if analyses exist)
- ✅ No 403 error
- ✅ Query should NOT include `WHERE organizationId = X`

---

### Task 6: Offers - Cross-Org Access

**Goal:** SUPER_ADMIN should see ALL offers from all orgs

```python
# Get all offers
response = helper.get('/api/v1/offers')
print(f'Total offers: {len(response)}')

if len(response) > 0:
    org_ids = set(o.get('organizationId') or o.get('candidate', {}).get('organizationId') for o in response)
    print(f'Unique organizations: {len(org_ids)}')
```

**Expected Results:**
- ✅ Total count: >= 0
- ✅ Unique org IDs: >= 1 (if offers exist)
- ✅ offerService.js should NOT filter by organizationId for SUPER_ADMIN

---

### Task 7: Interviews - Cross-Org Access

**Goal:** SUPER_ADMIN should see ALL interviews from all orgs

```python
# Get all interviews
response = helper.get('/api/v1/interviews')
print(f'Total interviews: {len(response)}')

if len(response) > 0:
    org_ids = set(i.get('organizationId') or i.get('candidate', {}).get('organizationId') for i in response)
    print(f'Unique organizations: {len(org_ids)}')
```

**Expected Results:**
- ✅ Total count: >= 0
- ✅ Unique org IDs: >= 1 (if interviews exist)

---

### Task 8: Compare with Org Admin (Isolation Check) ⭐ CRITICAL

**Goal:** Verify org admin ONLY sees their org's data (not cross-org)

```python
# Test Org 1 Admin
helper.login('test-admin@test-org-1.com', 'TestPass123!')
org1_jobs = helper.get('/api/v1/job-postings')
print(f'Org 1 Admin sees {len(org1_jobs)} job postings')
org1_org_ids = set(j['organizationId'] for j in org1_jobs)
print(f'Unique org IDs: {len(org1_org_ids)}')
print()

# Test Org 2 Admin
helper.login('test-admin@test-org-2.com', 'TestPass123!')
org2_jobs = helper.get('/api/v1/job-postings')
print(f'Org 2 Admin sees {len(org2_jobs)} job postings')
org2_org_ids = set(j['organizationId'] for j in org2_jobs)
print(f'Unique org IDs: {len(org2_org_ids)}')
print()

# Test SUPER_ADMIN again
helper.login('info@gaiai.ai', '23235656')
super_jobs = helper.get('/api/v1/job-postings')
print(f'SUPER_ADMIN sees {len(super_jobs)} job postings')
super_org_ids = set(j['organizationId'] for j in super_jobs)
print(f'Unique org IDs: {len(super_org_ids)}')
```

**Expected Results:**

| User | Count | Unique Org IDs | Status |
|------|-------|----------------|--------|
| Org 1 Admin | 2 | 1 | ✅ Isolated |
| Org 2 Admin | 2 | 1 | ✅ Isolated |
| SUPER_ADMIN | 6 | 3 | ✅ Cross-org access |

**Verification:**
- ✅ Org admins isolated (count=2, uniqueOrgIds=1)
- ✅ SUPER_ADMIN cross-org (count=6, uniqueOrgIds=3)
- ✅ No data leakage between orgs

---

### Task 9: Middleware Token Inspection

**Goal:** Check if organizationIsolation middleware correctly extracts userRole from token

```bash
# Check req.userRole extraction
grep -A 10 'req.userRole' backend/src/middleware/organizationIsolation.js

# Check SUPER_ADMIN bypass logic
grep -B 5 -A 15 'SUPER_ADMIN' backend/src/middleware/organizationIsolation.js
```

**Expected Output:**
- ✅ `req.userRole = req.user?.role` extraction exists
- ✅ `if (req.userRole === 'SUPER_ADMIN') return next();` exists
- ✅ SUPER_ADMIN check happens BEFORE organizationId filter

---

### Task 10: Controller SUPER_ADMIN Checks

**Goal:** Verify all 5 controllers have SUPER_ADMIN bypass logic

```bash
# Count SUPER_ADMIN checks in each controller
echo "=== candidateController.js ==="
grep -c "req.user.role === 'SUPER_ADMIN'" backend/src/controllers/candidateController.js
# Expected: 4 (getAll, getById, update, delete)

echo "=== jobPostingController.js ==="
grep -c "req.user.role === 'SUPER_ADMIN'" backend/src/controllers/jobPostingController.js
# Expected: 4

echo "=== analysisController.js ==="
grep -c "req.user.role === 'SUPER_ADMIN'" backend/src/controllers/analysisController.js
# Expected: 3 (getAll, getById, delete)

echo "=== offerService.js ==="
grep -c "userRole === 'SUPER_ADMIN'" backend/src/services/offerService.js
# Expected: 4

echo "=== interviewService.js ==="
grep -c "userRole === 'SUPER_ADMIN'" backend/src/services/interviewService.js
# Expected: 2

# Total expected: 4+4+3+4+2 = 17
```

**Verification:**
- ✅ All 5 controllers/services have SUPER_ADMIN checks
- ✅ Total checks: 17

---

### Task 11: Database Query Inspection (Optional)

**Goal:** Check actual SQL queries sent to Prisma (if needed)

**Only run if issues found in previous tests!**

```bash
# Check Prisma query logs
docker logs ikai-backend --tail 100 | grep -i 'prisma:query' || echo 'Query logging not enabled'
```

**Expected:** Queries should NOT have `organizationId` filter for SUPER_ADMIN

---

## 📊 Success Criteria

### Critical (Must Pass)
- ✅ SUPER_ADMIN sees **6 job postings** (not 0, not 2)
- ✅ SUPER_ADMIN sees candidates from **3 different orgs**
- ✅ Org admins **isolated** (only see their org's data)
- ✅ **No 403 errors** for SUPER_ADMIN
- ✅ organizationIsolation middleware has **req.userRole extraction**

### Optional (Nice to Have)
- ✅ Analyses/offers/interviews cross-org (if data exists)
- ✅ All 17 SUPER_ADMIN checks found in code

---

## 🚨 Failure Scenarios & Fixes

### Scenario 1: SUPER_ADMIN sees 0 job postings

**Symptom:** Count = 0
**Likely Cause:** organizationIsolation middleware blocking (req.userRole not set or checked)
**Fix:** Check if `req.userRole = req.user?.role` exists in organizationIsolation.js

### Scenario 2: SUPER_ADMIN sees 2 job postings

**Symptom:** Count = 2 (same as org admin)
**Likely Cause:** SUPER_ADMIN treated as normal user (organizationId filter applied)
**Fix:** Check if `if (req.userRole === 'SUPER_ADMIN') return next();` exists BEFORE filter

### Scenario 3: 403 Forbidden error

**Symptom:** 403 error
**Likely Cause:** authorize middleware doesn't allow SUPER_ADMIN on route
**Fix:** Add SUPER_ADMIN to allowed roles in route definition

### Scenario 4: Token missing 'role' field

**Symptom:** Token doesn't have 'role' field
**Likely Cause:** JWT generation missing role field
**Fix:** Check backend/src/controllers/authController.js login function

---

## 📝 Deliverables

### Required: Verification Report

**Filename:** `docs/reports/worker1-super-admin-verification-report.md`

**Required Sections:**
1. **Executive Summary** (Pass/Fail per endpoint)
2. **Test Results** (RAW terminal outputs - copy/paste everything!)
3. **Issues Found** (if any)
4. **Middleware Verification** (grep outputs)
5. **Controller Checks** (grep counts)
6. **Comparison Table** (SUPER_ADMIN vs Org Admin)
7. **Recommendations** (if issues exist)

### Optional: Screenshots

- Python test helper output showing cross-org access
- Terminal screenshots of grep outputs

---

## 🎯 AsanMod Rules

**STRICT_MODE Enabled:**
- ❌ **NO simulation** - Run REAL commands
- ❌ **NO placeholder data** - Use ACTUAL outputs
- ✅ **RAW terminal outputs** - Copy/paste everything
- ✅ **Real API tests** - Use Python helper or curl

**After Task:**
- ✅ Write verification report with RAW outputs
- ✅ Git commit the report immediately
- ✅ Report to Mod (paste summary in chat)

---

## 📚 Reference Documents

- **Test Data Reference:** [`docs/test-tasks/COMPLETE-TEST-DATA-REFERENCE.md`](COMPLETE-TEST-DATA-REFERENCE.md)
- **Python Test Helper:** [`scripts/test-helper.py`](../../scripts/test-helper.py)
- **RBAC Strategy:** [`docs/architecture/RBAC-COMPLETE-STRATEGY.md`](../architecture/RBAC-COMPLETE-STRATEGY.md)
- **Previous Fix Commit:** `00397af` (RBAC Layer 2 fix)

---

## ⏱️ Estimated Time

**45-60 minutes**

- Backend health: 2 min
- Login & token: 5 min
- Task 3-8 (API tests): 20-30 min
- Task 9-10 (code checks): 10 min
- Report writing: 10-15 min

---

**🚀 START HERE: Task 1 (Backend Health Check)**

**Need help?** Check `scripts/test-helper.py` usage in COMPLETE-TEST-DATA-REFERENCE.md
