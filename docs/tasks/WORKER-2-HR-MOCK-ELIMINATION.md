# 👔 W2: HR_SPECIALIST Scope - Mock Elimination

**Worker:** W2 (HR Dashboard + Recruitment)
**Priority:** CRITICAL (Most complex!)
**Estimated Time:** 3 hours
**AsanMod:** v15.6 (Python First)

---

## 🎯 YOUR MISSION

HR scope is LARGEST - candidates, analyses, interviews, offers!

---

## 📁 YOUR SCOPE

```
frontend/components/dashboard/hr-specialist/*.tsx
frontend/app/(authenticated)/candidates/**/*.tsx
frontend/app/(authenticated)/analyses/**/*.tsx
frontend/app/(authenticated)/interviews/**/*.tsx
frontend/app/(authenticated)/offers/**/*.tsx
frontend/components/analyses/**/*.tsx
frontend/components/candidates/**/*.tsx
frontend/components/wizard/**/*.tsx
```

---

## 🔍 PHASE 1: Deep Scan (20 min)

```bash
SCOPE="frontend/components/dashboard/hr-specialist frontend/app/\(authenticated\)/candidates frontend/app/\(authenticated\)/analyses frontend/components/analyses frontend/components/wizard"

# Mock scan
grep -r "mock\|Mock\|MOCK" $SCOPE --include="*.tsx" -n | tee scan-mock.txt
wc -l scan-mock.txt

# TODO scan  
grep -r "TODO\|FIXME" $SCOPE --include="*.tsx" -n | tee scan-todo.txt
wc -l scan-todo.txt

# Hardcode scan
grep -r "const.*= \[{" $SCOPE --include="*.tsx" -n | tee scan-hardcode.txt
wc -l scan-hardcode.txt
```

**Document EVERYTHING!**

---

## 🛠️ PHASE 2: Elimination (1.5 hours)

### Priority 1: HR Dashboard Widgets

**Files:** `frontend/components/dashboard/hr-specialist/*.tsx`

**Each widget must:**
- Real Prisma data (check backend: `backend/src/routes/dashboardRoutes.js` lines 136-466)
- No mock arrays
- No hardcoded stats

**Test:**
```python
import requests

BASE = 'http://localhost:8102'

login = requests.post(f'{BASE}/api/v1/auth/login',
                     json={'email': 'test-hr_specialist@test-org-2.com',
                           'password': 'TestPass123!'})
token = login.json()['token']

dash = requests.get(f'{BASE}/api/v1/dashboard/hr-specialist',
                   headers={'Authorization': f'Bearer {token}'})

data = dash.json()['data']
print(f"Dashboard keys: {list(data.keys())}")
print(f"Active postings: {data.get('activePostings', 'MISSING!')}")
print(f"Today CVs: {data.get('todayCVs', 'MISSING!')}")
```

### Priority 2: Candidates Page

**File:** `frontend/app/(authenticated)/candidates/page.tsx`

**Check:**
- Uses real `/api/v1/candidates` endpoint?
- No mock candidate arrays?
- Upload works (MinIO integration)?

**Test:**
```python
# Get candidates
r = requests.get(f'{BASE}/api/v1/candidates',
                 headers={'Authorization': f'Bearer {token}'})
print(f"Candidates: {len(r.json().get('data', []))}")
```

### Priority 3: Analyses Wizard

**Files:** `frontend/components/wizard/*.tsx`

**Critical checks:**
- `CVUploadStep.tsx`: Real MinIO upload?
- `JobPostingStep.tsx`: Real job postings from DB?
- No dummy/mock data?

**Check API URLs:**
```bash
grep -n "API_URL\|apiClient" frontend/components/wizard/*.tsx
```

**All should use apiClient or proper getAPIURL() function!**

### Priority 4: Offer Templates

**Files:** `frontend/components/offers/wizard/*.tsx`

**Check:**
- `Step1_TemplateOrScratch.tsx`: Real templates from DB?
- `Step3_Summary.tsx`: Real API integration?

**Fix if mock found!**

---

## 🔧 PHASE 3: API Integration (45 min)

### HR APIs to Verify

```python
import requests

BASE = 'http://localhost:8102'

# Login
login = requests.post(f'{BASE}/api/v1/auth/login',
                     json={'email': 'test-hr_specialist@test-org-2.com',
                           'password': 'TestPass123!'})
token = login.json()['token']

headers = {'Authorization': f'Bearer {token}'}

# Test ALL HR endpoints
endpoints = [
    '/api/v1/dashboard/hr-specialist',
    '/api/v1/candidates',
    '/api/v1/job-postings',
    '/api/v1/analyses',
    '/api/v1/interviews',
    '/api/v1/offers',
    '/api/v1/offer-templates',
]

print('=' * 60)
print('HR API VERIFICATION')
print('=' * 60)

for endpoint in endpoints:
    r = requests.get(f'{BASE}{endpoint}', headers=headers)
    status = '✅' if r.status_code == 200 else '❌'
    print(f'{status} {endpoint}: {r.status_code}')
```

**ALL must be ✅!**

---

## ✅ PHASE 4: Verification (15 min)

### Zero Mock

```bash
SCOPE="frontend/components/dashboard/hr-specialist frontend/app/\(authenticated\)/candidates frontend/app/\(authenticated\)/analyses frontend/components/analyses"

grep -r "mock\|Mock\|MOCK" $SCOPE --include="*.tsx" | wc -l
# Expected: 0
```

### Zero TODO

```bash
grep -r "TODO\|FIXME" $SCOPE --include="*.tsx" | wc -l
# Expected: 0
```

### Build Clean

```bash
cd frontend && npm run build 2>&1 | grep "error" | wc -l
# Expected: 0
```

---

## 📊 VERIFICATION REPORT

**Create:** `docs/reports/w2-hr-mock-elimination-verification.md`

**Include:**
- Files scanned: ~30-40
- Issues found: X
- Issues fixed: X
- APIs tested: 7
- Python test output (full!)
- Git commits: X

---

## 🚨 CRITICAL

HR scope is HUGE! Break it down:
1. Dashboard first (30 min)
2. Candidates (30 min)
3. Analyses (30 min)
4. Wizard (30 min)

Git commit after EACH file!

---

**Report to Mod when done!**
