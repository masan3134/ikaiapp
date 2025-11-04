# ⚡ W5: SUPER_ADMIN Scope - Mock Elimination

**Worker:** W5 (SUPER_ADMIN Dashboard + System Pages)
**Priority:** MEDIUM
**Estimated Time:** 2 hours

---

## 🎯 MISSION

System-wide features: all orgs, system logs, security

---

## 📁 SCOPE

```
frontend/components/dashboard/super-admin/*.tsx
frontend/app/(authenticated)/super-admin/**/*.tsx
```

---

## 🔍 SCAN

```bash
SCOPE="frontend/components/dashboard/super-admin frontend/app/\(authenticated\)/super-admin"

grep -r "mock\|Mock\|MOCK" $SCOPE --include="*.tsx" -n
grep -r "TODO\|FIXME" $SCOPE --include="*.tsx" -n
```

---

## 🛠️ FIX

### SUPER_ADMIN Dashboard

**Backend:** `backend/src/routes/dashboardRoutes.js` lines 826-925

**CRITICAL:** Cross-org queries (NO organizationId filter!)

**Test:**
```python
import requests

BASE = 'http://localhost:8102'

login = requests.post(f'{BASE}/api/v1/auth/login',
                     json={'email': 'info@gaiai.ai',
                           'password': '23235656'})
token = login.json()['token']

dash = requests.get(f'{BASE}/api/v1/dashboard/super-admin',
                   headers={'Authorization': f'Bearer {token}'})

data = dash.json()['data']
print(f"Total orgs: {data.get('organizations', {}).get('total', 'MISSING!')}")
print(f"Total users: {data.get('users', {}).get('total', 'MISSING!')}")
print(f"MRR: {data.get('revenue', {}).get('mrr', 'MISSING!')}")
```

**VERIFY:** Organizations > 1 (must see ALL orgs, not just one!)

### Organizations Page

**File:** `frontend/app/(authenticated)/super-admin/organizations/page.tsx`

**Check:**
- Real `/api/v1/super-admin/organizations` endpoint?
- No mock org list?

**Test:**
```python
r = requests.get(f'{BASE}/api/v1/super-admin/organizations',
                 headers={'Authorization': f'Bearer {token}'})
print(f"Orgs: {len(r.json().get('data', []))}")
```

### Security Logs

**File:** `frontend/app/(authenticated)/super-admin/security-logs/page.tsx`

**Check if endpoint exists:**

```python
r = requests.get(f'{BASE}/api/v1/super-admin/security-logs',
                 headers={'Authorization': f'Bearer {token}'})
print(f"Security logs API: {r.status_code}")
```

**If 404:** May need to create!

### System Health

**File:** `frontend/app/(authenticated)/super-admin/system/page.tsx`

**Use existing `/health` endpoint:**

```python
r = requests.get(f'{BASE}/health')
print(f"Health: {r.json()}")
```

---

## ✅ VERIFY

```bash
# Zero mock
grep -r "mock" frontend/components/dashboard/super-admin --include="*.tsx" | wc -l
# Expected: 0

# Cross-org access
# (Python test - verify orgs > 1)
```

---

## 📊 REPORT

**File:** `docs/reports/w5-superadmin-mock-elimination-verification.md`

**CRITICAL CHECK:**
- Cross-org working? (Must see 3+ orgs!)
- No enforceOrganizationIsolation middleware?

**Report to Mod!**
