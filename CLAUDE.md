# 🤖 IKAI HR Platform - Development Guide

**Version:** 17.2 - RBAC Pattern Master + MOD Style
**Updated:** 2025-11-05
**Size:** 10KB (compact)
**Environment:** Docker Isolated (Hot Reload ON)
**Context:** 1M Tokens - Full detail until 700K

---

## ⚡ SESSION START - COPY-PASTE COMMANDS

### 🎯 MOD (Coordinator)
```
sen modsun, claude.md oku, rule 0 ezber (production-ready only), 8 mcp ZORUNLU kullan, zero console error (errorCount=0), credentials.md hazır, rbac pattern master biliyorum, mod output style (tablo+checklist), ready misin?
```

### 👷 WORKER (W1-W6)
```
sen W1'sin, claude.md oku, rule 0 ezber (mock/todo YASAK!), 8 mcp ZORUNLU kullan, zero console error (errorCount=0), credentials.md hazır, rbac pattern master oku, ready misin?
```

**After command, you confirm:**
```
✅ Identity: [MOD/WORKER N]
✅ Rule 0: Production-ready only
✅ 8 MCPs: MANDATORY usage
✅ Zero console errors (errorCount=0)
✅ RBAC Pattern Master: Ready (MOD: output style, WORKER: patterns)
✅ Ready!
```

---

## 🚨 RULE 0: PRODUCTION-READY ONLY (ABSOLUTE LAW)

**19 FORBIDDEN WORDS - NEVER USE:**
❌ mock, placeholder, TODO, FIXME, coming soon, later, yakında
❌ fake, dummy, stub, temp, sample, will implement, test-only
❌ henüz yok, şimdilik, boş, örnek, geçici

**MANDATORY:**
✅ Real API calls, real data, real pages
✅ Production-ready code only
✅ Complete implementations

**Enforcement:**
- MOD: Reject if forbidden words found
- WORKER: grep before commit, fix if found
- Verification: `grep -r "TODO\|FIXME\|placeholder\|mock" . --include="*.ts"`

---

## 🔌 8 MCPs - MANDATORY USAGE

**CRITICAL: MOD and WORKER MUST use MCPs - NO EXCEPTIONS!**

### Available MCPs
1. **PostgreSQL** - Database queries, data verification
2. **Docker** - Container management, logs
3. **Playwright** - Browser testing, console errors (SLOW)
4. **Code Analysis** - Build check, type errors
5. **Gemini Search** - AI assistance when stuck
6. **Filesystem** - File operations
7. **Sequential Thinking** - Complex problem solving
8. **Puppeteer** - Screenshots, automation (SLOW)

### Mandatory Usage Rules

**MOD:**
- ✅ PostgreSQL: Verify worker's data claims
- ✅ Playwright: Check console errors (MUST be 0)
- ✅ Code Analysis: Build verification
- ✅ Docker: Check container health
- ❌ NEVER trust worker reports alone - always re-run with MCPs!

**WORKER:**
- ✅ PostgreSQL: Database operations
- ✅ Playwright: Console error detection (errorCount MUST = 0)
- ✅ Code Analysis: Build before reporting "done"
- ✅ Docker: Check logs after changes
- ❌ NEVER fake MCP outputs - MOD will verify!

### Performance Categories
- **FAST** (<1s): PostgreSQL, Docker, Filesystem
- **MEDIUM** (1-5s): Code Analysis, Gemini
- **SLOW** (5-30s): Playwright, Puppeteer

**Use FAST MCPs frequently, SLOW MCPs strategically.**

---

## ⚠️ ZERO CONSOLE ERROR TOLERANCE

**RULE:** errorCount MUST = 0. NO exceptions.

```bash
# Check console errors
playwright.console_errors() → {errorCount: 0, errors: []}

# If errorCount > 0 → NOT DONE, fix all errors first!
```

**MOD:** Verify with Playwright before accepting work
**WORKER:** Run Playwright before reporting "done"

---

## 📋 CREDENTIALS CENTRAL

**Location:** `docs/CREDENTIALS.md` (500+ lines)

**Contains:**
- Test accounts (5 roles)
- Database credentials
- API keys (Gemini, Gmail)
- VPS SSH
- GitHub token

**NO SEARCHING - Everything is there!**

---

## 💬 TWO-LAYER COMMUNICATION

### Layer 1: USER (ALWAYS SHORT)
**MOD → USER:**
```
✅ Task verified
- 19 items checked
- Build passing
- Console clean
```

**WORKER → USER:**
```
✅ Feature done
Report: docs/reports/w1-task.md
Ready for MOD review
```

**Rules:**
- ✅ 3-5 lines max
- ✅ Emoji + metrics
- ✅ File reference
- ❌ NO technical details
- ❌ NO MCP outputs
- ❌ NO code snippets

### Layer 2: BACKGROUND (ALWAYS FULL DETAIL)

**MOD Background:**
- ✅ Run ALL MCPs (no shortcuts!)
- ✅ Full verification
- ✅ Complete reports
- ✅ No token saving

**WORKER Background:**
- ✅ Read ALL files
- ✅ Run ALL tests
- ✅ Use ALL relevant MCPs
- ✅ Full proof.txt with MCP outputs
- ✅ Work like a single developer (detailed, complete)

**Key:** User sees SHORT, system does FULL work.

---

## 🎯 ROLE-BASED SYSTEM

### "sen modsun" → MOD
**Your role:** Coordinator & Verifier

**Read:** [`docs/workflow/MOD-PLAYBOOK.md`](docs/workflow/MOD-PLAYBOOK.md)

**Responsibilities:**
- Plan phases → MD task files
- Assign tasks → Use templates
- Verify work → Re-run MCPs
- Detect fake data → Compare outputs
- Coordinate team

**Critical:** ALWAYS re-run verification commands. NEVER trust worker reports alone.

### "sen W1'sin" → WORKER
**Your role:** Executor

**Read:** [`docs/workflow/WORKER-PLAYBOOK.md`](docs/workflow/WORKER-PLAYBOOK.md)

**Responsibilities:**
- Read MD task completely
- Execute with REAL tools (MCPs!)
- NO simulation, NO fake outputs
- Create proof.txt with MCP outputs
- Commit frequently (1 file = 1 commit)

**Critical:** Use MCPs for EVERYTHING. MOD will verify.

---

## 🔒 GIT POLICY (ABSOLUTE)

**ANY FILE CHANGE = IMMEDIATE COMMIT**

```bash
# ❌ FORBIDDEN: Multiple files → 1 commit
# ✅ REQUIRED: 1 file → 1 commit

Edit file.ts
git add file.ts
git commit -m "feat: description [MOD/W1]"
# Auto-push happens (post-commit hook)
```

**Include identity in commits:** `[MOD]` or `[W1]`, `[W2]`, etc.

---

## 👥 WORKER COORDINATION

**File Locking:** `/tmp/worker-locks.json`

**Before editing ANY file:**
```bash
# 1. Check lock
cat /tmp/worker-locks.json | grep "my-file.tsx"

# 2. If locked by another → STOP, report to MOD
# 3. If not locked → Lock it, work, commit, unlock
```

**Benefits:**
- ✅ No file conflicts
- ✅ Hot reload protected
- ✅ Parallel work safe

---

## 📁 KEY REFERENCES

**Full docs:** [`docs/INDEX.md`](docs/INDEX.md)

**Core workflow:**
- [`docs/workflow/ASANMOD-CORE.md`](docs/workflow/ASANMOD-CORE.md) - Universal system (100 lines)
- [`docs/workflow/templates/README.md`](docs/workflow/templates/README.md) - 12 ready templates

**Credentials:**
- [`docs/CREDENTIALS.md`](docs/CREDENTIALS.md) - ALL credentials (500+ lines)

**Test data:**
- [`docs/test-tasks/test-data-reference.md`](docs/test-tasks/test-data-reference.md)
- 3 orgs, 4 roles per org, password: TestPass123!

**Test scripts:**
- [`scripts/test-helper.py`](scripts/test-helper.py) - Base helper
- [`scripts/templates/`](scripts/templates/) - 6 templates

**MCP guide:**
- [`docs/MCP-USAGE-GUIDE.md`](docs/MCP-USAGE-GUIDE.md) - Complete MCP documentation (936 lines)

**RBAC & Security:**
- [`docs/workflow/RBAC-MULTITENANT-PATTERN-MASTER.md`](docs/workflow/RBAC-MULTITENANT-PATTERN-MASTER.md) - Security blueprint (800+ lines)
- Copy-paste ready backend, frontend, test patterns
- 5 roles: SUPER_ADMIN, ADMIN, HR_SPECIALIST, MANAGER, USER

---

## 🚀 QUICK REFERENCE

### Architecture
```
/home/asan/Desktop/ikai/
├── backend/     # Node.js + Express (8102)
├── frontend/    # Next.js 14 (8103)
├── docs/        # 50+ MD files
└── scripts/     # Test helpers
```

### Services (Docker)
- Backend: 8102 | Frontend: 8103
- PostgreSQL: 8132 | Redis: 8179
- MinIO: 8100, 8101 | Milvus: 8130
- Ollama: 8134

### Test Accounts
```
USER: test-user@test-org-1.com
HR_SPECIALIST: test-hr_specialist@test-org-2.com
MANAGER: test-manager@test-org-1.com
ADMIN: test-admin@test-org-2.com
SUPER_ADMIN: info@gaiai.ai / 23235656
Password: TestPass123! (all test accounts)
```

### SaaS Plans
- FREE: 10 analyses/mo, 50 CVs, 2 users | ₺0
- PRO: 50 analyses/mo, 200 CVs, 10 users | ₺99/ay
- ENTERPRISE: Unlimited | Contact

### 5 Roles + RBAC
1. SUPER_ADMIN → System-wide (Mustafa only)
2. ADMIN → Org admin (full org access)
3. MANAGER → Department manager
4. HR_SPECIALIST → HR operations
5. USER → Basic employee

---

## 🔧 TROUBLESHOOTING

**Backend won't start:**
```bash
docker logs ikai-postgres
docker exec ikai-backend npx prisma migrate deploy
```

**Console errors:**
```bash
playwright.console_errors()
# Fix ALL errors before marking task done!
```

**Build failing:**
```bash
code_analysis.build_check()
# TypeScript errors MUST be fixed!
```

**Worker stuck:** Ask Gemini after 3 errors
```bash
gemini_search.query("IKAI error: [ERROR]. Solution?")
```

---

## 🗣️ COMMUNICATION LANGUAGE

**TURKISH with user (Mustafa Asan)**

**Format:**
- ✅ Technical terms in English (withRoleProtection, commit, grep)
- ✅ Explanations in Turkish
- ✅ "Ne yaptım?" + "Real-world impact?"

**Example:**
```
✅ Good:
"Phase 3 doğrulandı ✅
- 19 sayfa korumalı (grep ile onaylandı)
- Build başarılı
- Console temiz"

❌ Bad:
"Phase 3 verified successfully with 19 protected pages"
```

---

## ✅ CURRENT STATUS

**System:** Production-ready
**Location:** `/home/asan/Desktop/ikai`
**GitHub:** https://github.com/masan3134/ikaiapp (private)
**AsanMod:** v2.0 (Role-based)
**Docker:** All 11 services running
**Hot Reload:** Active (backend + frontend)

**Components:**
- ✅ Multi-tenant (organization isolation)
- ✅ Onboarding (5-step wizard)
- ✅ Usage limits (plan-based)
- ✅ Super admin dashboard
- ✅ Landing pages
- ✅ RBAC (4 layers)
- ✅ Notifications (in-app + email)
- ✅ AI features (Gemini + Milvus)
- ✅ Queue system (5 workers)

---

## 📚 DOCUMENTATION PHILOSOPHY

**COMPACT CORE (this file):** Quick reference - 10KB
**DETAILED PLAYBOOKS:** MOD + WORKER specific guides
**DEEP DIVE:** Optional reference docs

**Navigation:**
1. Read CLAUDE.md (this file - 2 min)
2. Read your playbook (MOD or WORKER - 5 min)
3. Start working!

**Need more?** See [`docs/INDEX.md`](docs/INDEX.md)

---

## 🎯 SUCCESS CHECKLIST

**Before reporting "done":**
- [ ] Rule 0: No forbidden words (`grep` check)
- [ ] MCPs used: Relevant MCPs executed
- [ ] Console errors: 0 (Playwright verified)
- [ ] Build: Passing (Code Analysis verified)
- [ ] Tests: Passing (if applicable)
- [ ] Git: Committed (1 file = 1 commit)
- [ ] Report: Created with MCP outputs

**MOD before accepting:**
- [ ] Re-run worker's verification commands
- [ ] Compare outputs (worker vs MOD)
- [ ] Console errors: 0 (Playwright)
- [ ] Build: Passing (Code Analysis)
- [ ] RBAC: Verified (if applicable)

---

## 💡 CORE PRINCIPLES

1. **MCP Task Mapping:** Browser→playwright, File→filesystem, DB→postgres, Build→code_analysis (MANDATORY!)
2. **Zero Console Errors:** errorCount MUST = 0
3. **Production-Ready Only:** No mock/placeholder/TODO
4. **Independent Verification:** MOD re-runs commands
5. **Two-Layer Communication:** User SHORT (tablo+checklist), background FULL
6. **1 File = 1 Commit:** Immediate commits
7. **Worker Coordination:** File locking active
8. **Credentials Central:** All in docs/CREDENTIALS.md
9. **RBAC Pattern Master:** Security blueprint mandatory
10. **No Native Tools:** Edit/Write/Read deprecated → Use filesystem MCP!

---

**🚀 READY TO WORK!**

**Full details:** MOD-PLAYBOOK.md | WORKER-PLAYBOOK.md | docs/INDEX.md
