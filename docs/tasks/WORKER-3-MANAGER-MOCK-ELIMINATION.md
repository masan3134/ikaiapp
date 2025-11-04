# 📊 W3: MANAGER Scope - Mock Elimination

**Worker:** W3 (MANAGER Dashboard + Team Management)
**Priority:** HIGH
**Estimated Time:** 2.5 hours

---

## 🎯 MISSION

Manager features: dashboards, teams, reports, KPIs

---

## 📁 SCOPE

```
frontend/components/dashboard/manager/*.tsx
frontend/app/(authenticated)/teams/**/*.tsx
frontend/app/(authenticated)/departments/**/*.tsx
frontend/app/(authenticated)/reports/**/*.tsx
```

---

## 🔍 SCAN

```bash
SCOPE="frontend/components/dashboard/manager frontend/app/\(authenticated\)/teams frontend/app/\(authenticated\)/reports"

grep -r "mock\|Mock\|MOCK" $SCOPE --include="*.tsx" -n
grep -r "TODO\|FIXME" $SCOPE --include="*.tsx" -n
```

---

## 🛠️ FIX

### MANAGER Dashboard

**Backend:** `backend/src/routes/dashboardRoutes.js` lines 467-652

**Verify 18 Prisma queries exist!**

**Test:**
```python
import requests

BASE = 'http://localhost:8102'

login = requests.post(f'{BASE}/api/v1/auth/login',
                     json={'email': 'test-manager@test-org-2.com',
                           'password': 'TestPass123!'})
token = login.json()['token']

dash = requests.get(f'{BASE}/api/v1/dashboard/manager',
                   headers={'Authorization': f'Bearer {token}'})

data = dash.json()['data']
print(f"Team size: {data.get('teamSize', 'MISSING!')}")
print(f"Open positions: {data.get('openPositions', 'MISSING!')}")
print(f"Pending interviews: {data.get('pendingInterviews', 'MISSING!')}")
```

### Team Management

**Check if `/api/v1/teams` exists:**

```python
r = requests.get(f'{BASE}/api/v1/teams',
                 headers={'Authorization': f'Bearer {token}'})
print(f"Teams API: {r.status_code}")
```

**If 404:** Create backend endpoint!

---

## ✅ VERIFY

```bash
# Zero mock
grep -r "mock" frontend/components/dashboard/manager --include="*.tsx" | wc -l
# Expected: 0

# APIs work
# (Python test - all endpoints)
```

---

## 📊 REPORT

**File:** `docs/reports/w3-manager-mock-elimination-verification.md`

**Report to Mod when done!**
