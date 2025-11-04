# 👑 W4: ADMIN Scope - Mock Elimination

**Worker:** W4 (ADMIN Dashboard + Organization Settings)
**Priority:** HIGH
**Estimated Time:** 2.5 hours

---

## 🎯 MISSION

Admin features: org settings, users, roles, billing

---

## 📁 SCOPE

```
frontend/components/dashboard/admin/*.tsx
frontend/app/(authenticated)/organization/**/*.tsx
frontend/app/(authenticated)/users/**/*.tsx
frontend/app/(authenticated)/roles/**/*.tsx
frontend/app/(authenticated)/billing/**/*.tsx
frontend/app/(authenticated)/team/**/*.tsx
```

---

## 🔍 SCAN

```bash
SCOPE="frontend/components/dashboard/admin frontend/app/\(authenticated\)/organization frontend/app/\(authenticated\)/users frontend/app/\(authenticated\)/team"

grep -r "mock\|Mock\|MOCK" $SCOPE --include="*.tsx" -n
grep -r "TODO\|FIXME" $SCOPE --include="*.tsx" -n
grep -r "const.*= \[{" $SCOPE --include="*.tsx" -n
```

---

## 🛠️ FIX

### ADMIN Dashboard

**Backend:** `backend/src/routes/dashboardRoutes.js` lines 653-825

**Verify 8 Prisma queries!**

**Test:**
```python
import requests

BASE = 'http://localhost:8102'

login = requests.post(f'{BASE}/api/v1/auth/login',
                     json={'email': 'test-admin@test-org-1.com',
                           'password': 'TestPass123!'})
token = login.json()['token']

dash = requests.get(f'{BASE}/api/v1/dashboard/admin',
                   headers={'Authorization': f'Bearer {token}'})

data = dash.json()['data']
print(f"Total users: {data.get('totalUsers', 'MISSING!')}")
print(f"Active users: {data.get('activeUsers', 'MISSING!')}")
print(f"Storage used: {data.get('storageUsed', 'MISSING!')}")
```

### Organization Settings

**Check `/api/v1/organization` endpoint:**

```python
r = requests.get(f'{BASE}/api/v1/organization',
                 headers={'Authorization': f'Bearer {token}'})
print(f"Organization API: {r.status_code}")
print(f"Org name: {r.json().get('data', {}).get('name', 'MISSING!')}")
```

### User Management

**Check `/api/v1/users` endpoint:**

```python
r = requests.get(f'{BASE}/api/v1/users',
                 headers={'Authorization': f'Bearer {token}'})
print(f"Users API: {r.status_code}")
print(f"User count: {len(r.json().get('data', []))}")
```

### Team Management

**Check `/api/v1/team` endpoints:**

```python
# List members
r = requests.get(f'{BASE}/api/v1/team',
                 headers={'Authorization': f'Bearer {token}'})
print(f"Team members: {len(r.json().get('data', []))}")

# Pending invitations
r = requests.get(f'{BASE}/api/v1/team/invitations',
                 headers={'Authorization': f'Bearer {token}'})
print(f"Invitations: {len(r.json().get('data', []))}")
```

---

## ✅ VERIFY

```bash
# Zero mock
grep -r "mock" frontend/components/dashboard/admin --include="*.tsx" | wc -l
# Expected: 0

# All APIs
# (Python test - all endpoints - see above)
```

---

## 📊 REPORT

**File:** `docs/reports/w4-admin-mock-elimination-verification.md`

**Include:**
- Dashboard: 8 Prisma verified
- Organization API: ✅
- Users API: ✅
- Team API: ✅
- Git: X commits

**Report to Mod!**
