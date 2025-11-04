# ✅ Template: Mod Verification

**Use case:** Mod verifying Worker's work
**Duration:** 10 minutes
**Difficulty:** Easy

---

## Step 1: Read Worker Report

**File:** `docs/reports/w{N}-{feature}-verification.md`

```bash
Read('docs/reports/w{N}-{feature}-verification.md')
```

**Look for:**
- ✅ Raw terminal outputs (not summaries!)
- ✅ Verification commands listed
- ✅ Expected vs Actual values

---

## Step 2: Extract Claims

**Worker claims:**
```
- 5 widgets added
- 10 pages protected
- API returns 200 OK
```

---

## Step 3: Re-Run Commands

**For each claim, run EXACT command:**

```bash
# Claim: "5 widgets"
$ ls -1 frontend/components/dashboard/{role}/*.tsx | wc -l
5

# Claim: "10 pages protected"
$ grep -r "withRoleProtection" frontend/app/ --include="page.tsx" | wc -l
10

# Claim: "API 200 OK"
$ python3 scripts/tests/test-api.py
Status: 200
```

---

## Step 4: Compare

**Create comparison table:**

| Claim | Worker Said | Mod Got | Match? |
|-------|-------------|---------|--------|
| Widgets | 5 | 5 | ✅ |
| Protected | 10 | 10 | ✅ |
| API Status | 200 | 200 | ✅ |

---

## Step 5: Decision

**If ALL match:**
```
✅ Verified
Worker: Honest
Status: APPROVED
```

**If ANY mismatch:**
```
❌ Failed Verification
Worker claimed: 10, Mod found: 7
Status: RE-DO REQUIRED
```

---

## Step 6: Create Mod Report

**File:** `docs/reports/MOD-{feature}-verification.md`

```markdown
# MOD: {Feature} Verification

**Date:** 2025-11-04
**Worker:** W{N}

## Comparison

| Metric | Worker | Mod | Match |
|--------|--------|-----|-------|
| {Metric1} | {X} | {X} | ✅ |
| {Metric2} | {Y} | {Y} | ✅ |

## Verdict

✅ VERIFIED - All claims match
Worker honesty: 100%
Status: APPROVED

**Next:** {Next phase can start}
```

**Commit:**
```bash
git add docs/reports/MOD-{feature}-verification.md
git commit -m "docs(mod): {Feature} verification - ✅ VERIFIED"
```

---

## Step 7: Report to User

**Format:**
```
✅ W{N} doğrulandı
Karşılaştırma: {X}/{X} MATCH ✅
Worker dürüstlük: 100%
Sonraki aşama başlayabilir
```

---

## Quick Verification Commands

**Frontend:**
```bash
# Count files
find frontend/app -name "*.tsx" | wc -l

# Count protections
grep -r "withRoleProtection" frontend/ | wc -l

# Count widgets
ls -1 frontend/components/dashboard/*/*.tsx | wc -l

# Build check
cd frontend && npm run build
```

**Backend:**
```bash
# Count routes
grep -c "router\." backend/src/routes/*.js

# Count Prisma queries
grep -c "await prisma\." backend/src/routes/{file}.js

# API test
python3 -c "import requests; r = requests.get('http://localhost:8102/health'); print(r.status_code)"
```

**Database:**
```bash
# Check migrations
ls -1 backend/prisma/migrations/ | wc -l

# Check schema
grep "model" backend/prisma/schema.prisma | wc -l
```
