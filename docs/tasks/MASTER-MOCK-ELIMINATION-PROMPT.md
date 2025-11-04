# 🎯 MASTER PROMPT - Mock/TODO/Placeholder Elimination

**Mission:** Eliminate ALL mock data, TODO comments, placeholders from ENTIRE system
**Date:** 2025-11-04
**AsanMod:** v15.6 (Python First + Production-Ready)
**Mode:** 5 Parallel Workers (Full System Audit)

---

## 🚨 CRITICAL MANDATE

**ZERO TOLERANCE:**
- ❌ NO mock data
- ❌ NO TODO comments
- ❌ NO placeholder text
- ❌ NO "sonra eklenecek"
- ❌ NO hardcoded arrays
- ❌ NO disabled features

**100% REAL:**
- ✅ ALL data from Prisma/API
- ✅ ALL buttons functional
- ✅ ALL links working
- ✅ ALL forms submitting
- ✅ ALL features complete

---

## 📊 SYSTEM AUDIT CHECKLIST

### Phase 1: Deep Scan (30 min)

**Each Worker scans their scope:**

```bash
# Find all mock references
grep -r "mock\|Mock\|MOCK\|mockData\|dummy" YOUR_SCOPE --include="*.tsx" --include="*.ts" -n | wc -l

# Find all TODOs
grep -r "TODO\|FIXME\|XXX\|HACK" YOUR_SCOPE --include="*.tsx" --include="*.ts" -n | wc -l

# Find hardcoded data
grep -r "const data = \[" YOUR_SCOPE --include="*.tsx" -n | wc -l

# Find placeholders
grep -r "🚧\|yapım aşamasında\|sonra eklenecek" YOUR_SCOPE --include="*.tsx" -n | wc -l
```

**Create audit report:**
- File path
- Line number
- Issue type (mock/todo/hardcode)
- Severity (CRITICAL/HIGH/MEDIUM)

---

## 🎯 WORKER SCOPE ASSIGNMENTS

### W1: USER Role Scope
**Responsibility:** USER dashboard + basic employee pages

**Files to audit:**
```
frontend/app/(authenticated)/dashboard/page.tsx
frontend/components/dashboard/user/*.tsx
frontend/app/(authenticated)/settings/**/*
frontend/app/(authenticated)/profile/**/*
```

**Expected issues:** 5-10 mock references
**Estimated time:** 2 hours
**Priority:** HIGH

---

### W2: HR_SPECIALIST Role Scope
**Responsibility:** HR dashboard + recruitment pages

**Files to audit:**
```
frontend/components/dashboard/hr-specialist/*.tsx
frontend/app/(authenticated)/candidates/**/*
frontend/app/(authenticated)/analyses/**/*
frontend/app/(authenticated)/interviews/**/*
frontend/components/analyses/**/*
frontend/components/candidates/**/*
```

**Expected issues:** 15-25 mock references
**Estimated time:** 3 hours
**Priority:** CRITICAL (most complex)

---

### W3: MANAGER Role Scope
**Responsibility:** MANAGER dashboard + team management

**Files to audit:**
```
frontend/components/dashboard/manager/*.tsx
frontend/app/(authenticated)/teams/**/*
frontend/app/(authenticated)/departments/**/*
frontend/app/(authenticated)/reports/**/*
```

**Expected issues:** 10-15 mock references
**Estimated time:** 2.5 hours
**Priority:** HIGH

---

### W4: ADMIN Role Scope
**Responsibility:** ADMIN dashboard + organization settings

**Files to audit:**
```
frontend/components/dashboard/admin/*.tsx
frontend/app/(authenticated)/organization/**/*
frontend/app/(authenticated)/users/**/*
frontend/app/(authenticated)/roles/**/*
frontend/app/(authenticated)/billing/**/*
```

**Expected issues:** 10-15 mock references
**Estimated time:** 2.5 hours
**Priority:** HIGH

---

### W5: SUPER_ADMIN Role Scope
**Responsibility:** SUPER_ADMIN dashboard + system pages

**Files to audit:**
```
frontend/components/dashboard/super-admin/*.tsx
frontend/app/(authenticated)/super-admin/**/*
```

**Expected issues:** 5-10 mock references
**Estimated time:** 2 hours
**Priority:** MEDIUM

---

## 🛠️ ELIMINATION PROTOCOL

### Step 1: Identify Mock Data

**Scan patterns:**
```typescript
// ❌ Mock patterns to eliminate:
const mockData = [...];
const dummyUsers = [...];
const fakeResults = [...];
const testData = [...];

// Hardcoded arrays:
const items = [
  { id: 1, name: 'Test' },
  { id: 2, name: 'Test 2' }
];

// Fake state:
const [data, setData] = useState([...mockData]);
```

### Step 2: Create Real API Endpoints

**If API missing:**

1. Check if endpoint exists:
```python
import requests
r = requests.get('http://localhost:8102/api/v1/YOUR_ENDPOINT',
                 headers={'Authorization': f'Bearer {token}'})
print(r.status_code)  # 404 = missing!
```

2. Create backend endpoint:
```javascript
// backend/src/routes/yourRoutes.js
router.get('/your-endpoint', [
  authenticateToken,
  enforceOrganizationIsolation,
  authorize(['USER', 'HR_SPECIALIST'])
], async (req, res) => {
  try {
    const data = await prisma.yourModel.findMany({
      where: { organizationId: req.organizationId }
    });

    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ error: 'InternalServerError' });
  }
});
```

3. Test immediately:
```python
import requests
token = requests.post('http://localhost:8102/api/v1/auth/login',
                      json={'email': 'test@test.com', 'password': 'TestPass123!'}).json()['token']

r = requests.get('http://localhost:8102/api/v1/your-endpoint',
                 headers={'Authorization': f'Bearer {token}'})
print(r.json())
```

### Step 3: Replace Frontend Mock with Real API

**Before (WRONG):**
```typescript
const mockUsers = [
  { id: 1, name: 'John Doe' },
  { id: 2, name: 'Jane Smith' }
];

export default function UsersPage() {
  const [users, setUsers] = useState(mockUsers);  // ❌ MOCK!

  return <div>{users.map(u => <div>{u.name}</div>)}</div>
}
```

**After (RIGHT):**
```typescript
import { useEffect, useState } from 'react';
import apiClient from '@/lib/services/apiClient';

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await apiClient.get('/api/v1/users');
        setUsers(res.data.data);
      } catch (error) {
        console.error('Failed to fetch users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) return <div>Loading...</div>;

  return <div>{users.map(u => <div key={u.id}>{u.name}</div>)}</div>
}
```

### Step 4: Remove TODO Comments

**Find and eliminate:**
```bash
grep -rn "TODO" YOUR_SCOPE --include="*.tsx"
```

**Replace with implementation:**
```typescript
// ❌ WRONG:
// TODO: Add pagination
<div>{users.map(...)}</div>

// ✅ RIGHT:
const [page, setPage] = useState(1);
const [totalPages, setTotalPages] = useState(1);

// ... pagination logic ...

<Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
```

---

## 📋 VERIFICATION CHECKLIST

**Each Worker must verify:**

### 1. Zero Mock Data
```bash
grep -r "mock\|Mock\|MOCK" YOUR_SCOPE --include="*.tsx" | wc -l
# Expected: 0
```

### 2. Zero TODOs
```bash
grep -r "TODO\|FIXME" YOUR_SCOPE --include="*.tsx" | wc -l
# Expected: 0
```

### 3. All APIs Working
```python
import requests

BASE = 'http://localhost:8102'

# Test ALL endpoints in your scope
endpoints = [
    '/api/v1/dashboard/user',
    '/api/v1/users',
    # ... add all your endpoints
]

for endpoint in endpoints:
    r = requests.get(f'{BASE}{endpoint}', headers={'Authorization': f'Bearer {token}'})
    assert r.status_code == 200, f"{endpoint} FAILED!"
    assert r.json().get('success'), f"{endpoint} returned error!"

print("✅ All APIs verified!")
```

### 4. Frontend Build Clean
```bash
cd frontend && npm run build
# Expected: No TypeScript errors
```

### 5. Console Logs Clean
```bash
docker logs ikai-frontend --tail 100 | grep -i "error\|warning" | wc -l
# Expected: 0 errors
```

---

## 📊 VERIFICATION REPORT TEMPLATE

```markdown
# Worker X - Mock Elimination Verification

**Scope:** [YOUR ROLE] Dashboard + Related Pages
**Date:** 2025-11-04
**Duration:** X hours

## 1. Audit Results

### Mock Data Scan
```bash
grep -r "mock\|Mock\|MOCK" YOUR_SCOPE --include="*.tsx" | wc -l
```
**Before:** XX files
**After:** 0 files
**Status:** ✅ ELIMINATED

### TODO Scan
```bash
grep -r "TODO\|FIXME" YOUR_SCOPE --include="*.tsx" | wc -l
```
**Before:** XX comments
**After:** 0 comments
**Status:** ✅ ELIMINATED

## 2. API Endpoints Created

| Endpoint | Method | Purpose | Status |
|----------|--------|---------|--------|
| /api/v1/... | GET | Fetch ... | ✅ Working |
| /api/v1/... | POST | Create ... | ✅ Working |

**Total:** X new endpoints

## 3. Frontend Integration

| Page | Mock Data Removed | Real API Integrated | Tested |
|------|-------------------|---------------------|--------|
| dashboard/page.tsx | ✅ | ✅ | ✅ |
| users/page.tsx | ✅ | ✅ | ✅ |

**Total:** X pages updated

## 4. API Testing (Python)

```python
import requests

BASE = 'http://localhost:8102'

# Login
login = requests.post(f'{BASE}/api/v1/auth/login',
                     json={'email': 'YOUR_TEST_USER', 'password': 'TestPass123!'})
token = login.json()['token']

# Test all endpoints
endpoints = ['/api/v1/...', '/api/v1/...']

for endpoint in endpoints:
    r = requests.get(f'{BASE}{endpoint}', headers={'Authorization': f'Bearer {token}'})
    print(f'{endpoint}: {r.status_code} {"✅" if r.status_code == 200 else "❌"}')
```

**Output:**
```
/api/v1/dashboard/user: 200 ✅
/api/v1/users: 200 ✅
```

**All endpoints:** ✅ PASSING

## 5. Build Verification

```bash
cd frontend && npm run build
```

**Output:**
```
✓ Compiled successfully
Build completed in 3.2s
```

**Status:** ✅ NO ERRORS

## 6. Git Commits

```bash
git log --oneline --author="Worker X" --since="3 hours ago"
```

**Output:**
```
abc1234 fix(wx): Remove mock data from users page
def5678 feat(wx): Add real users API integration
...
```

**Total:** X commits (1 per file change)

## Summary

✅ Mock data: 0 (100% eliminated)
✅ TODO comments: 0 (100% eliminated)
✅ API endpoints: X created, all working
✅ Frontend pages: X updated, all tested
✅ Build: Clean, no errors
✅ Git: X commits (proper discipline)

**Status:** 🎉 SCOPE COMPLETE - 100% PRODUCTION READY
```

---

## 🚨 CRITICAL RULES

### Rule 1: No Shortcuts
❌ "I'll fix it later"
❌ "Mock is fine for now"
❌ "TODO is just a reminder"

✅ Fix EVERYTHING NOW
✅ Real data ONLY
✅ Complete features ONLY

### Rule 2: Independent Testing
❌ "Frontend looks good" (without API test)
❌ "API works" (without frontend test)

✅ Test BOTH ends
✅ Use Python for API verification
✅ Use browser for UI verification

### Rule 3: Git Discipline
❌ 10 files → 1 commit
❌ "fix: various issues"

✅ 1 file → 1 commit
✅ Descriptive commit messages

### Rule 4: Python First
❌ curl for API testing
✅ Python requests ONLY

---

## ⏱️ TIMELINE

**Total time:** ~12 hours (5 workers parallel = ~2.5 hours real time)

**Phase 1 (30 min):** Audit & scan
**Phase 2 (1.5 hours):** Backend API creation
**Phase 3 (1 hour):** Frontend integration
**Phase 4 (30 min):** Testing & verification
**Phase 5 (30 min):** Git commits & reports

---

## 📞 COORDINATION

**Mod:** Monitors all workers, verifies claims, ensures no overlap

**Workers:**
- Read your individual prompt (WORKER-X-PROMPT.md)
- Scan your scope ONLY
- Report to Mod when complete
- DO NOT touch other workers' files

---

**🎯 MISSION: Transform ENTIRE system to 100% production-ready**
**📅 DEADLINE: End of session**
**💪 COMMITMENT: Zero tolerance for mock/TODO/placeholder**
