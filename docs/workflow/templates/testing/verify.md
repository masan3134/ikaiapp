# 🔍 Verification Template (MOD) - MCP-Based

**Use case:** Mod verifying Worker's work using MCP
**Duration:** 5-10 minutes
**Tools:** PostgreSQL MCP, Docker MCP, Playwright MCP, Code Analysis MCP
**Version:** 2.0 (MCP Integration)

---

## Pre-Verification

**Read worker's report:**
```
Read: docs/reports/w{N}-task-report.md
```

**Identify MCP claims:**
- [ ] Database: postgres.count() results
- [ ] Frontend: playwright.console_errors() results
- [ ] Build: code_analysis.build_check() results
- [ ] Health: docker.health() results

---

## MCP Verification Workflow

### Step 1: Health Check

```
docker.health()
```

**Worker claimed:** `{overall: "healthy"}`
**You verify:** Re-run same command
- ✅ Match = System stable
- ❌ No match = Investigate

---

### Step 2: Database Verification

**If worker added/modified data:**

```
postgres.count({table: "users", where: "organizationId = $1", params: ["..."]})
```

**Worker claimed:** `{count: 24}`
**You verify:** Re-run same command

**If match:** ✅ Database changes verified
**If no match:** ❌ Worker lied or made mistake

**⚠️ CRITICAL:** Use lowercase table names (`"users"` not `"User"`)

---

### Step 3: Code Quality

```
code_analysis.typescript_check()
code_analysis.build_check()
```

**Worker claimed:** `{exitCode: 0}`
**You verify:** Re-run same commands

**If exitCode: 0** → ✅ Quality verified
**If exitCode: 1** → ❌ REJECT TASK

---

### Step 4: Frontend Testing

```
playwright.navigate({url: "http://localhost:8103/..."})
playwright.console_errors({url: "..."})
```

**Worker claimed:** `{errorCount: 0}`
**You verify:** Re-run same commands

**If errorCount: 0** → ✅ Frontend clean
**If errorCount > 0** → ❌ REJECT TASK

**⚠️ CRITICAL:** Use localhost URLs (not Docker hostnames)

---

## Spot-Check Sampling

**Pick 2-3 critical MCPs:**

**Example:**
1. `postgres.count()` → Match?
2. `playwright.console_errors()` → Match?
3. `code_analysis.build_check()` → Match?

**If 3/3 match** → 100% confidence → ✅ VERIFIED
**If 2/3 match** → 66% confidence → ⚠️ Investigate
**If 1/3 match** → 33% confidence → ❌ REJECT

---

## Decision

### APPROVED ✅

```
✅ Docker: Healthy (match)
✅ Database: Count 24/24 (match)
✅ TypeScript: 0 errors (match)
✅ Build: exitCode 0 (match)
✅ Console: 0 errors (match)

Decision: ✅ TASK VERIFIED
Confidence: 100%
```

**Report to user:**
```
W{N} task doğrulandı ✅
- {X} verified (postgres.count)
- Build başarılı (exitCode: 0)
- Console temiz (0 error)

Sıradaki task başlayabilir.
```

---

### REJECTED ❌

```
✅ Docker: Healthy (match)
❌ Database: 24 ≠ 5 (NO MATCH)
✅ TypeScript: 0 errors (match)
❌ Build: exitCode 1 (FAILED)
❌ Console: 3 errors (FAILED)

Decision: ❌ TASK REJECTED (3 blockers)
Confidence: 0%
```

**Report to user:**
```
W{N} task reddedildi ❌

Sorunlar:
1. Database count mismatch (24 ≠ 5)
2. Build failed (exitCode: 1)
3. Console 3 error var

Action: Düzeltme task'i ver
```

---

## MCP Commands Reference

### PostgreSQL MCP
```
postgres.count({table: "users"})
postgres.verify_exists({table: "users", where: "email = $1", params: [...]})
postgres.query({sql: "SELECT...", params: [...]})
```

### Docker MCP
```
docker.health()
docker.logs({container: "ikai-backend", tail: 50})
docker.stats({container: "ikai-backend"})
```

### Playwright MCP
```
playwright.navigate({url: "http://localhost:8103/...", screenshot: true})
playwright.console_errors({url: "..."})
playwright.check_element({url: "...", selector: "..."})
```

### Code Analysis MCP
```
code_analysis.typescript_check()
code_analysis.eslint_check()
code_analysis.build_check()
```

---

## Critical Warnings

### PostgreSQL
❌ `table: "User"` → ERROR
✅ `table: "users"` → SUCCESS

### Playwright
❌ `url: "http://ikai-frontend:3000"` → ERROR
✅ `url: "http://localhost:8103"` → SUCCESS

### Exit Codes
- exitCode: 0 = SUCCESS
- exitCode: 1 = FAILED

---

## Verification Report Template

**Create:** `docs/reports/mod-verification-w{N}.md`

```markdown
# MOD Verification - W{N} Task

**Date:** 2025-11-05
**Task:** {Task description}
**Worker:** W{N}
**Status:** ✅ VERIFIED / ❌ REJECTED

---

## MCP Verification Results

### 1. Docker Health
docker.health()
Worker: {output}
Mod: {output}
✅ MATCH / ❌ MISMATCH

### 2. Database Count
postgres.count({...})
Worker: {count: X}
Mod: {count: X}
✅ MATCH / ❌ MISMATCH

### 3. Build Check
code_analysis.build_check()
Worker: {exitCode: 0}
Mod: {exitCode: 0}
✅ MATCH / ❌ MISMATCH

### 4. Console Errors
playwright.console_errors({...})
Worker: {errorCount: 0}
Mod: {errorCount: 0}
✅ MATCH / ❌ MISMATCH

---

## Decision

✅ **VERIFIED** / ❌ **REJECTED**

Score: X/X checks passed (100%)
Confidence: High/Medium/Low
Action: Approve/Reject

---

## User Report

W{N} task {doğrulandı/reddedildi} {✅/❌}
- {Summary}
```

**Commit:**
```bash
git add docs/reports/mod-verification-w{N}.md
git commit -m "docs(mod): W{N} verification - ✅ VERIFIED"
```

---

**MCP = Tamper-Proof Verification**
**Spot-Check = Resource Efficient**
**Zero Tolerance = Production Quality**
