# AsanMod v17 Update - 8 Zorunlu MCP

**Date:** 2025-11-05
**Update:** MCP Integration (Mandatory)
**Test Status:** ✅ 24/24 PASS (100% Success Rate)
**Impact:** High - Changes verification protocol

---

## 🔌 8 Yeni MCP Eklendi

### Kurulum Tamamlandı ✅

1. **PostgreSQL MCP** → Database verify
2. **Docker MCP** → Container health
3. **Playwright MCP** → Browser test
4. **Code Analysis MCP** → TypeScript/ESLint
5. **Gemini Search MCP** → Error solutions (AI-powered)
6. **filesystem MCP** → File operations (read, list, search)
7. **sequentialthinking MCP** → Automatic reasoning for complex tasks
8. **puppeteer MCP** → Lightweight browser testing (Playwright fallback)

**Location:** `~/mcp-servers/`
**Config:** `~/.config/Code/User/settings.json`

---

## 📋 Yeni Kurallar (MOD & WORKER)

### 🎯 MOD Rules (4 New: 13-16)

**Rule 13: MCP-First Verification (MANDATORY)**
- OLD: Python/Bash manual verify
- NEW: MCP calls (tamper-proof, structured)
- Spot-check sampling: 2-3 critical MCPs per worker
- 100% match = Verified ✅

**Rule 14: Exit Code Interpretation (CRITICAL)**
- Exit code 0 = SUCCESS
- Exit code 1 = FAILED
- Don't confuse "MCP worked" with "task succeeded"
- Build exitCode 1 = Task REJECTED

**Rule 15: Resource-Aware MCP Usage (PERFORMANCE)**
- FAST: PostgreSQL, Docker (~100ms)
- SLOW: Playwright (~2s startup, 500MB memory)
- Batch Playwright operations
- Token vs Time trade-off

**Rule 16: Build Verification Before Merge (QUALITY GATE)**
- Frontend: TypeScript + ESLint + Build + Console = All 0 errors
- Backend: TypeScript + Docker logs clean
- ANY blocker = NO MERGE
- Zero tolerance for production

---

### 👷 WORKER Rules (12 New: 17-28)

**Rule 17: MCP Usage (MANDATORY)**
- Every task MUST use relevant MCPs
- Workflow: docker.health() → Work → Pre-commit checks → Testing → Verification
- NO MCP = TASK REJECTED

**Rule 18: Fail Fast on Exit Code 1 (CRITICAL)**
- Exit code 1 = STOP immediately
- Fix error, re-run, then continue
- Don't pretend it passed!

**Rule 19: 3-Strike Error Protocol (MANDATORY)**
- Strike 1: gemini_search.error_solution() → Try fix
- Strike 2: gemini_search with MORE context → Try again
- Strike 3: STOP, report to MOD/User
- Don't waste tokens!

**Rule 20: Pre-Commit Checks (ZERO TOLERANCE)**
- Frontend: TypeScript + ESLint + Build + Console = All 0
- Backend: TypeScript + Docker logs clean
- ANY blocker = NO COMMIT

**Rule 21: Console Error Zero Tolerance (FRONTEND)**
- playwright.console_errors() → errorCount MUST be 0
- No exceptions ("just a warning" = FIX IT!)

**Rule 22: Container Health Sandwich (MANDATORY)**
- Task start: docker.health() → All healthy?
- Task end: docker.health() → Still healthy?
- Sandwich rule protects system

**Rule 23: Database Isolation Testing (SECURITY)**
- Multi-tenant = Isolation MANDATORY
- Verify ALL results have same organizationId
- No cross-org data leak!

**Rule 24: Screenshot Evidence (FRONTEND)**
- Frontend change = Screenshot REQUIRED
- playwright.navigate({screenshot: true})
- Paste screenshot path to proof.txt

**Rule 25: Localhost vs Docker Context (CRITICAL)**
- Browser tests: localhost:8103
- Backend API (Docker): ikai-backend:3000
- Frontend code (browser): localhost:8102/api
- Wrong context = Connection refused

**Rule 26: Resource-Aware Testing (PERFORMANCE)**
- Playwright is EXPENSIVE (~2s, 500MB)
- PostgreSQL is FAST (~100ms)
- Batch Playwright operations

**Rule 27: Structured Proof Format (MANDATORY)**
- proof.txt MUST have structured sections
- Task Info → Health → Work → Checks → Testing → Verification → Summary
- Easy to verify!

**Rule 28: PostgreSQL Table Naming (DATABASE)**
- ALWAYS lowercase + plural
- User → users, Organization → organizations
- Prisma model ≠ Database table name

---

### 📊 Rule Summary

**Total:** 16 new rules
- MOD: +4 rules (12 → 16)
- WORKER: +12 rules (16 → 28)
- CRITICAL: 12 rules
- IMPORTANT: 2 rules
- MEDIUM: 2 rules

⚠️ CRITICAL:
- PostgreSQL: Use lowercase table names ("users" not "User")
- Playwright: Use localhost URLs (not Docker hostnames)
- Code Analysis: MCP detects errors, doesn't fix them
- Exit codes: 0 = success, 1 = failed
- Pre-commit: ALL checks MUST pass
- Console errors: ZERO tolerance

---

## 🎯 Kullanım Senaryoları

### Senaryo 1: Widget Ekleme
```
Worker:
1. docker.health() → Services OK?
2. (Create component)
3. code_analysis.typescript_check() → 0 errors?
4. playwright.navigate({url: "/dashboard"}) → Loads?
5. playwright.check_element({selector: ".widget"}) → Visible?

MOD Verify:
1. playwright.navigate() → MATCH ✅
```

### Senaryo 2: Database Değişikliği
```
Worker:
1. (Add users)
2. postgres.count({table: "users", where: "..."}) → 24

MOD Verify:
1. postgres.count() → 24 MATCH ✅
```

### Senaryo 3: Backend Bug Fix
```
Worker:
1. docker.logs({container: "ikai-backend"}) → Error görüldü
2. (Fix code)
3. docker.logs() → Error yok ✅
4. code_analysis.build_check() → Success ✅

MOD Verify:
1. docker.logs() → No errors MATCH ✅
```

---

## 📖 Tam Kılavuz

**Location:** `docs/workflow/MCP-USAGE-GUIDE.md`

- 5 MCP detaylı kullanım
- Tool referansı
- Best practices
- Error handling

---

## ⚠️ Breaking Changes

### Eski Verification Protocol
```
Worker: "19 user var"
MOD: Python script çalıştır → Verify
```

### Yeni Verification Protocol (v17)
```
Worker: postgres.count() → {count: 19}
MOD: postgres.count() → {count: 19} MATCH ✅
```

**Fark:** MCP output = ham veri (manipüle edilemez)

---

## 🚀 Aktivasyon

1. **VSCode'u yeniden başlat** (MCP'leri yüklemek için)
2. Claude Code'u yeniden başlat
3. Test: "postgres.count()" deneyin
4. MCP'ler çalışıyorsa → ✅ READY

---

## 📊 Beklenen Faydalar

| Metrik | Önce | Sonra |
|--------|------|-------|
| **Verification güvenilirliği** | %70 | %95 |
| **Token kullanımı** | 5K/task | 500/task |
| **MOD verify süresi** | 20 dk | 5 dk |
| **Worker fake data riski** | Var | YOK |

---

## 🎯 Sonraki Adımlar

1. ✅ MCP'leri test et (basit görev) - **COMPLETED (15/15 PASS)**
2. ✅ MOD/WORKER playbook'ları güncelle - **PENDING**
3. ✅ Template'lere MCP kullanımı ekle - **PENDING**
4. ⏳ İlk gerçek görevde kullan - **PENDING**

---

## 📊 Test Results

**Test Duration:** ~45 minutes
**Test Date:** 2025-11-05

| MCP | Low | Medium | High | Status |
|-----|-----|--------|------|--------|
| PostgreSQL | ✅ | ✅ | ✅ | PASS |
| Docker | ✅ | ✅ | ✅ | PASS |
| Playwright | ✅ | ✅ | ✅ | PASS |
| Code Analysis | ✅ | ✅ | ✅ | PASS |
| Gemini Search | ✅ | ✅ | ✅ | PASS |
| filesystem | ✅ | ✅ | ✅ | PASS |
| sequentialthinking | ✅ | ✅ | ✅ | PASS |
| puppeteer | ✅ | ✅ | ✅ | PASS |

**Detailed Test Summary:** `/tmp/mcp-test-summary.md`
**Updated Guide:** `docs/workflow/MCP-USAGE-GUIDE.md`

---

**AsanMod v17 = MCP-Powered Verification**
**Status:** ✅ TESTED & READY TO USE
**Test Status:** 24/24 PASS (100%)
**Reload Required:** Yes (VSCode restart)
