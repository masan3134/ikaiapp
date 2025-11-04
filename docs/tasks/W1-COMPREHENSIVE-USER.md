# W1: USER Role - Comprehensive Full-Stack Test

**Worker:** W1
**Role:** USER
**Duration:** 45 minutes
**Scope:** Basic employee features (minimal permissions)

---

## 🎯 YOUR MISSION

Test **EVERYTHING** for USER role:
- Frontend: 7 pages
- Backend: 5 endpoints
- Database: 8 queries
- RBAC: 15 permission checks
- CRUD: Read-only verification

---

## 📋 TASK TEMPLATE: testing/comprehensive.md

**Follow this pattern for EACH test:**
1. Read code file
2. Extract API calls/queries
3. Test with Python
4. Verify multi-tenant isolation
5. Check RBAC permissions
6. Document results

---

## 🖥️ FRONTEND TEST (7 Pages)

**Check each page:**
```
1. /user-dashboard → Read user-dashboard.tsx
   - API: /dashboard/user
   - Widgets: 8 expected
   - Console: No errors

2. /notifications → Read notifications page
   - API: /notifications
   - Functions: Mark as read
   - Console: No errors

3. /help → Read help page
   - Content: FAQ, contact form
   - No API calls expected

4. /settings/overview → Profile summary
5. /settings/profile → Update name/email
6. /settings/security → Change password
7. /settings/notifications → Notification preferences
```

**Per page:**
```python
# Browser test
python3 scripts/tests/w1-page-test.py

# Verify:
- Page loads ✅
- No console errors ✅
- API calls successful ✅
```

---

## ⚙️ BACKEND TEST (5 Endpoints)

**Test with Python:**

```python
import requests

BASE = 'http://localhost:8102'

# Login as USER
r = requests.post(f'{BASE}/api/v1/auth/login',
                  json={'email': 'test-user@test-org-1.com',
                        'password': 'TestPass123!'})
token = r.json()['token']
headers = {'Authorization': f'Bearer {token}'}

# Test 1: Dashboard
r = requests.get(f'{BASE}/api/v1/dashboard/user', headers=headers)
assert r.status_code == 200
assert 'profile' in r.json()['data']
print('✅ Dashboard API works')

# Test 2: Notifications
r = requests.get(f'{BASE}/api/v1/notifications', headers=headers)
assert r.status_code == 200
print('✅ Notifications API works')

# Test 3: Profile (READ)
r = requests.get(f'{BASE}/api/v1/auth/me', headers=headers)
assert r.status_code == 200
assert r.json()['role'] == 'USER'
print('✅ Profile API works')

# Test 4: Update Profile (should work - own data)
r = requests.patch(f'{BASE}/api/v1/auth/profile',
                   headers=headers,
                   json={'firstName': 'Test User'})
assert r.status_code == 200
print('✅ Profile update works')

# Test 5: Change Password (should work - own)
r = requests.patch(f'{BASE}/api/v1/auth/password',
                   headers=headers,
                   json={'currentPassword': 'TestPass123!',
                         'newPassword': 'TestPass123!'})
assert r.status_code == 200
print('✅ Password change works')
```

---

## 🗄️ DATABASE TEST (8 Queries)

**Extract from backend code:**

```bash
# Find USER dashboard endpoint
grep -A50 "router.get('/user'" backend/src/routes/dashboardRoutes.js

# Extract Prisma queries
# Count: Should be 8 queries for USER dashboard
```

**Verify each query:**
```
Query 1: User profile
✅ Returns only USER's own data
✅ organizationId filter present

Query 2: Organization data
✅ Returns USER's organization
✅ Multi-tenant isolated

Query 3: Unread notifications
✅ Only USER's notifications
✅ No other users' notifications

[... 5 more queries ...]
```

---

## 🔒 RBAC TEST (15 Checks)

**Matrix:**

| Endpoint | USER Should | Result |
|----------|-------------|--------|
| GET /dashboard/user | ✅ 200 OK | |
| GET /notifications | ✅ 200 OK | |
| GET /job-postings | ❌ 403 Forbidden | |
| POST /job-postings | ❌ 403 Forbidden | |
| GET /candidates | ❌ 403 Forbidden | |
| POST /candidates | ❌ 403 Forbidden | |
| GET /team | ❌ 403 Forbidden | |
| GET /analytics | ❌ 403 Forbidden | |
| GET /organizations/me | ✅ 200 OK | |
| PATCH /organizations | ❌ 403 Forbidden | |
| GET /super-admin/organizations | ❌ 403 Forbidden | |
| ... | ... | |

**Test script:**
```python
# Test allowed endpoints (should work)
allowed = ['/dashboard/user', '/notifications', '/auth/me', '/organizations/me']
for endpoint in allowed:
    r = requests.get(f'{BASE}/api/v1{endpoint}', headers=headers)
    assert r.status_code == 200, f'{endpoint} should be 200, got {r.status_code}'

# Test forbidden endpoints (should fail)
forbidden = ['/job-postings', '/candidates', '/team', '/analytics', '/super-admin/organizations']
for endpoint in forbidden:
    r = requests.get(f'{BASE}/api/v1{endpoint}', headers=headers)
    assert r.status_code == 403, f'{endpoint} should be 403, got {r.status_code}'

print('✅ All RBAC checks passed!')
```

---

## ✏️ CRUD TEST (Read-Only Role)

**USER can only READ own data:**

```python
# CREATE: Should fail (USER can't create jobs/candidates)
r = requests.post(f'{BASE}/api/v1/job-postings',
                  headers=headers,
                  json={'title': 'Test Job'})
assert r.status_code == 403
print('✅ CREATE blocked correctly')

# READ: Should work (own data)
r = requests.get(f'{BASE}/api/v1/auth/me', headers=headers)
assert r.status_code == 200
print('✅ READ works')

# UPDATE: Should work (own profile only)
r = requests.patch(f'{BASE}/api/v1/auth/profile',
                   headers=headers,
                   json={'firstName': 'Updated'})
assert r.status_code == 200
print('✅ UPDATE own profile works')

# UPDATE: Should fail (other users)
r = requests.patch(f'{BASE}/api/v1/users/other-user-id',
                   headers=headers,
                   json={'role': 'ADMIN'})
assert r.status_code == 403
print('✅ UPDATE others blocked')

# DELETE: Should fail (no delete permissions)
r = requests.delete(f'{BASE}/api/v1/job-postings/any-id', headers=headers)
assert r.status_code == 403
print('✅ DELETE blocked correctly')
```

---

## 📝 REPORT FORMAT

**File:** `docs/reports/w1-comprehensive-user.md`

```markdown
# W1: USER Comprehensive Test Report

**Summary:**
- Frontend: 7/7 pages ✅
- Backend: 5/5 endpoints ✅
- Database: 8/8 queries ✅
- RBAC: 15/15 checks ✅
- CRUD: 5/5 tests ✅

**Total: 40/40 PASS** ✅

[Detailed results for each category...]

**Issues Found:** [List any bugs]
**Recommendations:** [Suggestions]
```

---

## ⏱️ ESTIMATED TIME

- Frontend: 15 min (7 pages × 2 min)
- Backend: 15 min (5 endpoints × 3 min)
- Database: 10 min (8 queries)
- RBAC: 10 min (15 checks)
- CRUD: 5 min (5 tests)
- Report: 10 min

**Total: 45 minutes**

---

**W1, başla! Use template: testing/comprehensive.md** 🚀
