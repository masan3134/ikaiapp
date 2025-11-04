# 🔬 Comprehensive Full-Stack Integration Test

**Date:** 2025-11-04
**Mod:** Master Claude
**Workers:** 5 (W1-W5)
**Duration:** 2-3 hours total
**Type:** FULL COVERAGE (Frontend + Backend + DB + RBAC + CRUD)

---

## 🎯 GOAL

**Complete system verification:**
- ✅ Frontend: Her component çalışıyor mu?
- ✅ Backend: Her endpoint doğru response veriyor mu?
- ✅ Database: Queries doğru data döndürüyor mu?
- ✅ RBAC: Roller doğru yetkilendirilmiş mi?
- ✅ CRUD: Create, Read, Update, Delete operations çalışıyor mu?

---

## 👥 WORKER ASSIGNMENT (NO OVERLAP!)

### W1: USER Role (Minimal Permissions)
**Domain:** Basic employee features
**Files:**
- Frontend: `frontend/app/(authenticated)/user-dashboard/`
- Frontend: `frontend/components/dashboard/user/`
- Backend: `backend/src/routes/dashboardRoutes.js` (USER section)
- DB: User, Organization, Notification tables

**Test:**
1. Frontend: 7 pages (dashboard, notifications, settings, help)
2. Backend: 3 endpoints (dashboard/user, notifications, profile)
3. DB: 5 queries (user data, org data, notifications)
4. RBAC: Blocked from HR/MANAGER features
5. CRUD: Read-only (no create/update/delete)

**NO OVERLAP:** W1 only touches USER-specific code

---

### W2: HR_SPECIALIST Role (Job & Candidate Management)
**Domain:** Recruitment operations
**Files:**
- Frontend: `frontend/app/(authenticated)/job-postings/`
- Frontend: `frontend/app/(authenticated)/candidates/`
- Frontend: `frontend/app/(authenticated)/wizard/`
- Frontend: `frontend/app/(authenticated)/analyses/`
- Frontend: `frontend/components/dashboard/hr-specialist/`
- Backend: `backend/src/routes/jobPostingRoutes.js`
- Backend: `backend/src/routes/candidateRoutes.js`
- Backend: `backend/src/routes/analysisRoutes.js`
- DB: JobPosting, Candidate, Analysis tables

**Test:**
1. Frontend: 16 pages (HR dashboard, job postings, candidates, wizard, analyses, settings)
2. Backend: 25+ endpoints (CRUD for jobs, candidates, analyses)
3. DB: 15 queries (multi-tenant isolation check!)
4. RBAC: Full HR access, blocked from MANAGER/ADMIN
5. CRUD: Full CRUD on jobs/candidates

**NO OVERLAP:** W2 only HR domain

---

### W3: MANAGER Role (Team & Analytics)
**Domain:** Team management & analytics
**Files:**
- Frontend: `frontend/app/(authenticated)/team/`
- Frontend: `frontend/app/(authenticated)/analytics/`
- Frontend: `frontend/components/dashboard/manager/`
- Backend: `backend/src/routes/teamRoutes.js`
- Backend: `backend/src/routes/analyticsRoutes.js`
- DB: User (team members), Activity, Analytics tables

**Test:**
1. Frontend: 18 pages (MANAGER dashboard, team, analytics, all HR features, settings)
2. Backend: 10 endpoints (team CRUD, analytics data)
3. DB: 8 queries (team data, analytics aggregations)
4. RBAC: HR + MANAGER features, blocked from ADMIN
5. CRUD: Team member management, analytics read-only

**NO OVERLAP:** W3 only MANAGER domain

---

### W4: ADMIN Role (Organization Management)
**Domain:** Org-level administration
**Files:**
- Frontend: `frontend/app/(authenticated)/settings/organization/`
- Frontend: `frontend/app/(authenticated)/settings/billing/`
- Frontend: `frontend/components/dashboard/admin/`
- Backend: `backend/src/routes/organizationRoutes.js`
- Backend: `backend/src/routes/billingRoutes.js` (if exists)
- DB: Organization, User (role management), Billing tables

**Test:**
1. Frontend: 18 pages (ADMIN dashboard, org settings, billing, all lower features)
2. Backend: 12 endpoints (org update, user invite, billing)
3. DB: 10 queries (org data, user roles, billing info)
4. RBAC: Full org access, blocked from SUPER_ADMIN
5. CRUD: Org update, user management (within org)

**NO OVERLAP:** W4 only ADMIN domain

---

### W5: SUPER_ADMIN Role (System-Wide)
**Domain:** Cross-organization system administration
**Files:**
- Frontend: `frontend/app/(authenticated)/super-admin/`
- Frontend: `frontend/components/dashboard/super-admin/`
- Backend: `backend/src/routes/superAdminRoutes.js` (if exists)
- Backend: `backend/src/routes/queueRoutes.js`
- DB: ALL tables (cross-org queries!)

**Test:**
1. Frontend: 22 pages (SUPER_ADMIN dashboard, org management, queues, security logs, system health)
2. Backend: 15 endpoints (all orgs, queue management, system)
3. DB: 20 queries (cross-org verification!)
4. RBAC: System-wide access (no restrictions)
5. CRUD: Cross-org operations, system management

**NO OVERLAP:** W5 only SUPER_ADMIN domain

---

## 🔒 NO OVERLAP GUARANTEE

**File-level separation:**
```
W1: user/ folder only
W2: job-postings/, candidates/, wizard/, analyses/ folders
W3: team/, analytics/ folders
W4: settings/organization/, settings/billing/ folders
W5: super-admin/ folder only
```

**Backend route separation:**
```
W1: dashboardRoutes.js (USER section only)
W2: jobPostingRoutes, candidateRoutes, analysisRoutes
W3: teamRoutes, analyticsRoutes
W4: organizationRoutes, user management endpoints
W5: superAdminRoutes, queueRoutes
```

**DB table separation:**
```
W1: User (own data), Notification (own)
W2: JobPosting, Candidate, Analysis
W3: User (team view), Activity, Analytics
W4: Organization, User (management), Billing
W5: ALL (cross-org!)
```

**PARALLEL SAFE:** ✅ No file conflicts!

---

## 📋 TEST CHECKLIST (Per Worker)

### 1. Frontend Component Test
```
For each page/component:
□ Read component file
□ Check imports (apiClient used?)
□ Check hooks (useState, useEffect)
□ Check API calls (correct endpoint?)
□ Check error handling
□ Check loading states
□ Browser test: Visit page, check console
```

### 2. Backend Endpoint Test
```
For each endpoint:
□ Find in routes file
□ Check middleware (authorize, organizationIsolation)
□ Check Prisma queries
□ Test with Python (correct role)
□ Test 403 forbidden (wrong role)
□ Test 200 OK (correct role)
□ Verify multi-tenant isolation
```

### 3. Database Query Test
```
For each Prisma query:
□ Extract query from backend code
□ Check organizationId filter present
□ Test returns only own org data
□ Test doesn't return other org data
□ Check indexes used (performance)
```

### 4. RBAC Test Matrix
```
For each operation:
□ Test USER → Should fail
□ Test HR_SPECIALIST → Should work/fail (depends)
□ Test MANAGER → Should work/fail (depends)
□ Test ADMIN → Should work (within org)
□ Test SUPER_ADMIN → Should work (all orgs)
```

### 5. CRUD Operations Test
```
For each entity:
□ CREATE: Can create? Multi-tenant check?
□ READ: Returns only own org data?
□ UPDATE: Can update only own org?
□ DELETE: Can delete only own org?
□ LIST: Pagination? Filtering?
```

---

## 📊 EXPECTED DELIVERABLES (Per Worker)

**Report file:** `docs/reports/w{N}-comprehensive-test-{ROLE}.md`

**Report structure:**
```markdown
# W{N}: {ROLE} Comprehensive Test Report

## Executive Summary
- Pages tested: X
- Endpoints tested: Y
- DB queries tested: Z
- RBAC tests: A
- CRUD tests: B
- PASS: XX
- FAIL: YY

## 1. Frontend Test Results
[Detailed per-page results]

## 2. Backend Test Results
[Detailed per-endpoint results]

## 3. Database Test Results
[Detailed per-query results]

## 4. RBAC Test Results
[Permission matrix]

## 5. CRUD Test Results
[Operation test results]

## 6. Issues Found
[Bug reports]

## 7. Recommendations
[Suggestions]
```

---

## ⏱️ TIMELINE

**Total:** 2-3 hours (parallel execution)

| Worker | Duration | Start | End |
|--------|----------|-------|-----|
| W1 (USER) | 45 min | 16:00 | 16:45 |
| W2 (HR) | 90 min | 16:00 | 17:30 |
| W3 (MANAGER) | 75 min | 16:00 | 17:15 |
| W4 (ADMIN) | 75 min | 16:00 | 17:15 |
| W5 (SUPER_ADMIN) | 120 min | 16:00 | 18:00 |

**Parallel execution → Finish by 18:00!**

---

## 🚀 LAUNCH COMMAND

**To User (when ready):**
```
5 Worker'a comprehensive test görevi hazır!

W1: USER role (45 min)
W2: HR_SPECIALIST role (90 min)
W3: MANAGER role (75 min)
W4: ADMIN role (75 min)
W5: SUPER_ADMIN role (120 min)

Paralel çalışabilir (file çakışması YOK!)
Tahmini bitiş: 2 saat

Görev dosyaları hazırlayayım mı?
```

---

## 🎯 SUCCESS CRITERIA

**Green light:**
- ✅ All pages load without console errors
- ✅ All endpoints return 200 (correct role) or 403 (wrong role)
- ✅ All DB queries return org-isolated data
- ✅ All RBAC rules enforced
- ✅ All CRUD operations work correctly

**Red flag:**
- ❌ Console errors
- ❌ 500 server errors
- ❌ Cross-org data leaks
- ❌ RBAC bypass
- ❌ Broken CRUD

---

**Plan ready! Create detailed task files?** 🚀
