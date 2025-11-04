# 👤 W1: USER Scope - Mock Elimination

**Worker:** W1 (USER Dashboard + Employee Pages)
**Priority:** HIGH
**Estimated Time:** 2 hours
**AsanMod:** v15.6 (Python First)

---

## 🎯 YOUR MISSION

Eliminate ALL mock/TODO/placeholder from USER role scope:
- USER dashboard
- Settings pages
- Profile pages
- Basic employee features

---

## 📁 YOUR SCOPE (Files to Check)

```
frontend/app/(authenticated)/dashboard/page.tsx
frontend/components/dashboard/user/*.tsx
frontend/app/(authenticated)/settings/**/*.tsx
frontend/app/(authenticated)/profile/**/*.tsx
```

---

## 🔍 PHASE 1: Deep Scan (15 min)

### Scan Commands

```bash
# Your scope
SCOPE="frontend/app/(authenticated)/dashboard frontend/components/dashboard/user frontend/app/(authenticated)/settings frontend/app/(authenticated)/profile"

# 1. Mock data scan
echo "=== MOCK DATA SCAN ==="
grep -r "mock\|Mock\|MOCK\|mockData\|dummy" $SCOPE --include="*.tsx" --include="*.ts" -n

# 2. TODO scan
echo "=== TODO SCAN ==="
grep -r "TODO\|FIXME\|XXX\|HACK" $SCOPE --include="*.tsx" --include="*.ts" -n

# 3. Hardcoded arrays scan
echo "=== HARDCODE SCAN ==="
grep -r "const data = \[" $SCOPE --include="*.tsx" -n

# 4. Placeholder scan
echo "=== PLACEHOLDER SCAN ==="
grep -r "🚧\|yapım aşamasında\|sonra eklenecek" $SCOPE --include="*.tsx" -n
```

**Document findings:**
- File path
- Line number
- Issue type
- Severity

---

## 🛠️ PHASE 2: Elimination (1 hour)

### Known Issue 1: Security Page Mock

**File:** `frontend/app/(authenticated)/settings/security/page.tsx`
**Line:** ~44
**Issue:** Mock API URL

**Current code:**
```typescript
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
```

**FIX:**
```typescript
// Get API URL with browser-side override
const getAPIURL = () => {
  const envURL = process.env.NEXT_PUBLIC_API_URL;

  if (typeof window !== 'undefined' && envURL?.includes('ikai-backend')) {
    return 'http://localhost:8102';
  }

  return envURL || 'http://localhost:8102';
};

const API_URL = getAPIURL();
```

**Commit:**
```bash
git add frontend/app/\(authenticated\)/settings/security/page.tsx
git commit -m "fix(w1): Fix security page API URL - Remove mock fallback"
```

### Check Dashboard Page

**File:** `frontend/app/(authenticated)/dashboard/page.tsx`

**Verify:**
1. No hardcoded data
2. Real API calls (useAuth, dashboard endpoint)
3. No TODO comments

**If issues found:** Fix immediately!

### Check USER Dashboard Widgets

**Files:** `frontend/components/dashboard/user/*.tsx`

**For each widget:**

```bash
# Scan widget
FILE="frontend/components/dashboard/user/ProfileWidget.tsx"

# Check for mock
grep -n "mock\|const data =" $FILE

# Check for real API
grep -n "apiClient\|fetch\|useEffect" $FILE
```

**If mock found:**
1. Identify what data is needed
2. Check if backend API exists
3. If missing → Create backend endpoint
4. Integrate real API
5. Test
6. Commit

---

## 🔧 PHASE 3: API Integration (30 min)

### USER Dashboard API

**Endpoint:** `/api/v1/dashboard/user`

**Test:**
```python
import requests

BASE = 'http://localhost:8102'

# Login as USER
login = requests.post(f'{BASE}/api/v1/auth/login',
                     json={'email': 'test-user@test-org-1.com',
                           'password': 'TestPass123!'})
token = login.json()['token']

# Test dashboard
dash = requests.get(f'{BASE}/api/v1/dashboard/user',
                   headers={'Authorization': f'Bearer {token}'})

print(f"Status: {dash.status_code}")
print(f"Success: {dash.json().get('success')}")
print(f"Data keys: {list(dash.json().get('data', {}).keys())}")
```

**Expected:**
```
Status: 200
Success: True
Data keys: ['profile', 'notifications', 'stats', ...]
```

### Settings APIs

**Check if these exist:**
- `GET /api/v1/me` - User profile
- `PATCH /api/v1/me` - Update profile
- `PATCH /api/v1/me/password` - Change password
- `GET /api/v1/notifications` - Get notifications

**Test each:**
```python
import requests

BASE = 'http://localhost:8102'

# Get token (same as above)
token = ...

# Test profile
r = requests.get(f'{BASE}/api/v1/me',
                 headers={'Authorization': f'Bearer {token}'})
assert r.status_code == 200, "Profile API missing!"

# Test password change
r = requests.patch(f'{BASE}/api/v1/me/password',
                   headers={'Authorization': f'Bearer {token}'},
                   json={'currentPassword': 'old', 'newPassword': 'new'})
# Expected: 400 (wrong password) or 200 (success)
assert r.status_code in [200, 400], "Password API missing!"

print("✅ All USER APIs exist!")
```

---

## ✅ PHASE 4: Verification (15 min)

### 1. Zero Mock Data

```bash
SCOPE="frontend/app/(authenticated)/dashboard frontend/components/dashboard/user frontend/app/(authenticated)/settings frontend/app/(authenticated)/profile"

grep -r "mock\|Mock\|MOCK" $SCOPE --include="*.tsx" | wc -l
```

**Expected:** 0

### 2. Zero TODOs

```bash
grep -r "TODO\|FIXME" $SCOPE --include="*.tsx" | wc -l
```

**Expected:** 0

### 3. All APIs Working

```python
import requests

BASE = 'http://localhost:8102'

# Login
login = requests.post(f'{BASE}/api/v1/auth/login',
                     json={'email': 'test-user@test-org-1.com',
                           'password': 'TestPass123!'})
token = login.json()['token']

# Test all USER endpoints
endpoints = [
    '/api/v1/dashboard/user',
    '/api/v1/me',
    '/api/v1/notifications',
]

for endpoint in endpoints:
    r = requests.get(f'{BASE}{endpoint}',
                     headers={'Authorization': f'Bearer {token}'})
    status = '✅' if r.status_code == 200 else '❌'
    print(f'{status} {endpoint}: {r.status_code}')
```

**Expected:** All ✅

### 4. Build Clean

```bash
cd frontend && npm run build 2>&1 | grep -i "error" | wc -l
```

**Expected:** 0

### 5. Console Clean

```bash
docker logs ikai-frontend --tail 50 | grep -i "error.*user\|error.*dashboard" | wc -l
```

**Expected:** 0

---

## 📊 VERIFICATION REPORT

**Create:** `docs/reports/w1-user-mock-elimination-verification.md`

```markdown
# W1: USER Scope - Mock Elimination Verification

**Date:** 2025-11-04
**Duration:** X hours
**Status:** ✅ COMPLETE

## 1. Audit Results

### Mock Data Scan
```bash
grep -r "mock" frontend/app/\(authenticated\)/dashboard frontend/components/dashboard/user --include="*.tsx" | wc -l
```
**Before:** X
**After:** 0
**Status:** ✅ ELIMINATED

### TODO Scan
```bash
grep -r "TODO" ... | wc -l
```
**Before:** X
**After:** 0
**Status:** ✅ ELIMINATED

## 2. Files Fixed

| File | Issue | Fix | Commit |
|------|-------|-----|--------|
| settings/security/page.tsx | Mock API URL | Browser-safe URL | abc123 |
| ... | ... | ... | ... |

**Total:** X files fixed

## 3. API Testing

```python
# (Your Python test code here)
```

**Output:**
```
✅ /api/v1/dashboard/user: 200
✅ /api/v1/me: 200
✅ /api/v1/notifications: 200
```

**All APIs:** ✅ WORKING

## 4. Git Commits

```bash
git log --oneline --author="W1" --since="2 hours ago"
```

**Output:**
```
abc123 fix(w1): Fix security page API URL
def456 fix(w1): Remove TODO from profile page
...
```

**Total:** X commits

## Summary

✅ Mock data: 0
✅ TODO comments: 0
✅ APIs: All working
✅ Build: Clean
✅ Git: X commits

**Status:** 🎉 USER SCOPE COMPLETE
```

---

## 🚨 CRITICAL RULES

1. **Git:** 1 file = 1 commit
2. **Testing:** Python ONLY (no curl!)
3. **Scope:** ONLY your files (don't touch others!)
4. **Quality:** 100% real data (zero tolerance!)

---

## 📞 REPORTING

**When done, tell Mod:**

```
W1 tamamlandı! ✅

Sonuçlar:
- Mock: 0 (X dosya temizlendi)
- TODO: 0 (X yorum silindi)
- API: 3/3 çalışıyor
- Build: Temiz
- Git: X commit

Rapor: docs/reports/w1-user-mock-elimination-verification.md
```

**Then WAIT for Mod verification before touching anything else!**
