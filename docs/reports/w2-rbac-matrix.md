# W2 RBAC Permission Matrix - HR_SPECIALIST

**Generated:** 2025-11-04
**Role:** HR_SPECIALIST
**Test:** Comprehensive permission verification

---

## 📊 PERMISSION MATRIX

### ✅ ALLOWED (18 permissions)

| Permission | Endpoint/Feature | Status | Verified |
|------------|------------------|--------|----------|
| View job postings | GET /job-postings | ✅ | Test PASS |
| Create job postings | POST /job-postings | ❓ | Button missing |
| Edit job postings | PATCH /job-postings/:id | ⚠️ | Not tested |
| Delete job postings | DELETE /job-postings/:id | ⚠️ | Not tested |
| Publish job postings | POST /job-postings/:id/publish | ⚠️ | Not tested |
| View candidates | GET /candidates | ✅ | Test PASS |
| Upload CVs | POST /candidates/upload | ✅ | Feature exists |
| Edit candidates | PATCH /candidates/:id | ⚠️ | Not tested |
| Delete candidates | DELETE /candidates/:id | ⚠️ | Not tested |
| Create analyses | POST /analyses/wizard | ❓ | No file input |
| View analyses | GET /analyses | ✅ | Test PASS |
| Delete analyses | DELETE /analyses/:id | ⚠️ | Not tested |
| View offers | GET /offers | ✅ | Test PASS |
| Create offers | POST /offers/wizard | ❓ | RBAC unclear |
| View interviews | GET /interviews | ✅ | Test PASS |
| Schedule interviews | POST /interviews/schedule | ⚠️ | Not tested |
| View notifications | GET /notifications | ✅ | Test PASS |
| View HR dashboard | GET /dashboard/hr-specialist | ✅ | Test PASS |

**Summary:** 8 verified ✅, 6 not tested ⚠️, 4 unclear ❓

---

### ❌ DENIED (12 permissions)

| Permission | Endpoint/Feature | Expected | Verified |
|------------|------------------|----------|----------|
| Team management | GET /teams | ❌ | Not tested |
| Add team members | POST /teams/:id/members | ❌ | Not tested |
| Organization settings | GET /organization/settings | ❌ | Not tested |
| Update org settings | PATCH /organization/settings | ❌ | Not tested |
| View all analytics | GET /analytics | ❌ | Test expected 403 |
| Billing | GET /billing | ❌ | Not tested |
| Usage limits config | PATCH /organization/limits | ❌ | Not tested |
| User management (non-candidates) | GET /users | ❌ | Not tested |
| Audit logs | GET /audit-logs | ❌ | Not tested |
| Super admin dashboard | GET /dashboard/super-admin | ❌ | Not tested |
| Cross-org data access | N/A | ❌ | Middleware enforced |
| System settings | N/A | ❌ | Not tested |

**Summary:** 1 verified ❌, 11 not tested

---

## 🔍 RBAC RULES (from code)

### Job Postings
```typescript
// frontend/lib/utils/rbac.ts
canCreateJobPosting: SUPER_ADMIN, ADMIN, MANAGER, HR_SPECIALIST
canEditJobPosting: SUPER_ADMIN, ADMIN, MANAGER, HR_SPECIALIST
canDeleteJobPosting: SUPER_ADMIN, ADMIN, MANAGER, HR_SPECIALIST
```

**Result:** HR_SPECIALIST SHOULD be able to do all job posting operations ✅

### Candidates
```typescript
canViewCandidates: HR_MANAGERS (includes HR_SPECIALIST)
canEditCandidate: SUPER_ADMIN, ADMIN, MANAGER, HR_SPECIALIST
canDeleteCandidate: SUPER_ADMIN, ADMIN, MANAGER
```

**Result:** HR_SPECIALIST can view/edit but NOT delete ⚠️

### Offers
```typescript
canCreateOffer: SUPER_ADMIN, ADMIN, MANAGER
canEditOffer: SUPER_ADMIN, ADMIN, MANAGER
canDeleteOffer: SUPER_ADMIN, ADMIN, MANAGER
```

**Result:** HR_SPECIALIST CANNOT create/edit/delete offers ❌

### Analytics
```typescript
canViewAnalytics: SUPER_ADMIN, ADMIN, MANAGER
```

**Result:** HR_SPECIALIST CANNOT view org-wide analytics ❌

---

## 🐛 RBAC BUGS FOUND

### Bug 1: Job Posting Creation Button Missing
**Expected:** HR_SPECIALIST can create (RBAC allows)
**Actual:** "Yeni İlan" button not visible
**Code:** `canCreateJobPosting` returns true for HR_SPECIALIST
**Impact:** Feature exists but not accessible
**Status:** ❌ BUG

### Bug 2: Offer Creation RBAC Inconsistency
**Expected:** Unclear (business decision needed)
**Actual:** HR_SPECIALIST blocked from creating offers
**Code:** `canCreateOffer` returns false for HR_SPECIALIST
**Impact:** HR can view but not create offers
**Status:** 🤔 Business decision needed

### Bug 3: Candidate Deletion Blocked
**Expected:** HR_SPECIALIST might need to delete spam/duplicate CVs
**Actual:** `canDeleteCandidate` returns false for HR_SPECIALIST
**Code:** Only ADMIN/MANAGER can delete
**Impact:** HR must ask manager to delete bad candidates
**Status:** ⚠️ Might be intentional

---

## 📋 RBAC VERIFICATION CHECKLIST

### Positive Tests (HR_SPECIALIST CAN) - 8/18 tested

- [x] View job postings
- [ ] Create job posting (button missing)
- [ ] Edit job posting
- [ ] Delete job posting
- [ ] Publish job posting
- [x] View candidates
- [x] Upload CVs
- [ ] Edit candidate
- [ ] Delete candidate (blocked by RBAC)
- [ ] Create analysis (no file input)
- [x] View analyses
- [ ] Delete analysis
- [x] View offers
- [ ] Create offer (blocked by RBAC)
- [x] View interviews
- [ ] Schedule interview
- [x] View notifications
- [x] View HR dashboard

### Negative Tests (HR_SPECIALIST CANNOT) - 1/12 tested

- [ ] Team management
- [ ] Add team members
- [ ] Organization settings
- [ ] Update org settings
- [x] View all analytics (403 confirmed)
- [ ] Billing
- [ ] Usage limits config
- [ ] User management
- [ ] Audit logs
- [ ] Super admin dashboard
- [ ] Cross-org data access
- [ ] System settings

---

## ✅ RBAC COVERAGE

**Positive tests:** 44% (8/18)
**Negative tests:** 8% (1/12)
**Overall:** 30% (9/30)

---

**Status:** PARTIAL VERIFICATION

**Recommendation:** Need to test all 30 permissions for complete RBAC audit
