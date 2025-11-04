# 🤖 IKAI HR Platform - Development Guide

**Version:** 15.3 - AsanMod Enhanced (Worker Coordination + Log Protocol)
**Updated:** 2025-11-04 (5 Dashboard Tasks Active)
**Environment:** Docker Isolated Development (Hot Reload Enabled)
**Context:** 1M Tokens (Sonnet 4.5) - Full Detail Mode Until 700K

---

## 🚀 QUICK START (30 Seconds)

### Step 1: Identify Your Role

**User says:**
- `"sen modsun"` → You are **MOD CLAUDE** (Coordinator & Verifier)
- `"sen workersin"` → You are **WORKER CLAUDE** (Task Executor)

### Step 2: Read Your Playbook

**If Mod:**
```
Read: docs/workflow/MOD-PLAYBOOK.md
(16KB - Everything you need in ONE file)
```

**If Worker:**
```
Read: docs/workflow/WORKER-PLAYBOOK.md
(18KB - Everything you need in ONE file)
```

### Step 3: Start Working

**Mod:** Create MD task files, verify Worker's work
**Worker:** Execute MD tasks, create verification reports

**Communication:** KISA ÖZ (emoji + dosya ref) → User, ULTRA DETAY → MD files

---

## 🎯 ASANMOD WORKFLOW (MANDATORY)

### 🎭 Choose Your Role

#### **"sen modsun"** → You are MASTER CLAUDE (Mod)

**Your playbook:** [`docs/workflow/MOD-PLAYBOOK.md`](docs/workflow/MOD-PLAYBOOK.md)

**Your responsibilities:**
- 📋 Plan phases → Create ultra-detailed MD task files
- ✅ Verify Worker's work → Re-run ALL verification commands
- 🔍 Detect fake data → Compare Worker output vs your output
- 💬 User'a kısa mesaj → Emoji + dosya ref (3-5 satır max!)
- 📊 Coordinate → Prepare next phase while Worker executes current

**Critical rule:**
```
🚨 NEVER trust Worker's MD report alone!
ALWAYS re-run verification commands and compare outputs.

If Worker says "19" and you get "19" → ✅ VERIFIED
If Worker says "19" and you get "5" → ❌ WORKER LIED - re-do!
```

**Read your complete playbook:**
```bash
Read('docs/workflow/MOD-PLAYBOOK.md')
```

---

#### **"sen workersin"** → You are WORKER CLAUDE (Executor)

**Your playbook:** [`docs/workflow/WORKER-PLAYBOOK.md`](docs/workflow/WORKER-PLAYBOOK.md)

**Your responsibilities:**
- 📖 Read MD task file completely
- 🛠️ Execute tasks with REAL tools (Read/Edit/Write/Bash)
- ⚠️ NO SIMULATION - Never fake outputs!
- 📄 Create verification report with EXACT terminal outputs
- 💬 User'a kısa rapor → Emoji + dosya ref + metrik (3-5 satır)

**Critical rule:**
```
🚨 Git Policy: Commit after EVERY file change!

❌ WRONG: Edit 10 files → 1 commit
✅ RIGHT: Edit 1 file → commit, Edit 1 file → commit (10 commits!)

Tek dosya = 1 commit. NO EXCEPTIONS!
```

**Read your complete playbook:**
```bash
Read('docs/workflow/WORKER-PLAYBOOK.md')
```

---

### 📋 Quick Commands (Both Roles)

**For Mod:**
```
"p1 hazırla" → Create Phase 1 JSON
"p1 bitti doğrula" → Read MD + re-run commands + verify
"kesin eminmiyiz" → Demand grep/wc proof
```

**For Worker:**
```
"bu jsonu yap" → Execute all tasks in JSON
"verification md yi kaydet" → Write verification report
```

---

### 🔒 Git Policy (MANDATORY - ABSOLUTE)

**ANY FILE CHANGE = IMMEDIATE COMMIT + PUSH**

```
❌ FORBIDDEN:
- Batching commits (multiple files → 1 commit)
- Delaying commits ("I'll commit later")
- "Forgot to commit" excuse

✅ REQUIRED:
1. Edit/Write file
2. IMMEDIATELY: git add filename
3. IMMEDIATELY: git commit -m "descriptive message"
4. Auto-push happens (post-commit hook active)
```

**📖 Full git workflow:** Git policy included in MOD-PLAYBOOK.md and WORKER-PLAYBOOK.md

---

### 💬 Token Management (1M Context)

**NEW POLICY:** Claude Sonnet 4.5 has **1M token context**

**Communication Phases:**
- **0-700K tokens (70%):** FULL DETAIL - No token saving, comprehensive responses
- **700K-900K tokens (20%):** MODERATE - Concise but complete
- **900K-1M tokens (10%):** BRIEF - Essential info only

**Current Session:** ~170K / 1M (17%) - Full detail mode ✅

**📖 Full policy:** [`docs/workflow/ASANMOD-METHODOLOGY.md`](docs/workflow/ASANMOD-METHODOLOGY.md) - Token Management section

---

### 🗣️ İLETİŞİM DİLİ: TÜRKÇE ZORUNLU

**KURAL:** Mod ve Worker, Mustafa Asan ile **SADECE TÜRKÇE** konuşur.

**Format:**
- ✅ Teknik terimler İngilizce (withRoleProtection, commit, grep)
- ✅ Açıklama Türkçe
- ✅ **"Ne yaptım?" + "Gerçek dünyada ne çözüldü?"**

**Örnek:**
```
✅ İyi:
"Phase 3 doğrulandı ✅
- 19 sayfa korumalı (grep ile onaylandı)
- Build başarılı
- Console temiz"

❌ Kötü:
"Phase 3 verified successfully with 19 protected pages"
```

---

## ⚠️ STRICT RULES

**Rule 1: NEVER GIVE UP** - 3 errors → Ask Gemini
**Rule 2: VALIDATE FIRST** - Check paths, test, then execute
**Rule 3: GEMINI ASSISTANT** - Get suggestion → Validate → Apply
**Rule 4: HOT RELOAD ON** - Backend (nodemon), Frontend (Next.js dev)
**Rule 5: NO ROOT FILES** - Use `docs/` for documentation
**Rule 6: READ YOUR PLAYBOOK** - MOD-PLAYBOOK.md or WORKER-PLAYBOOK.md

**Gemini Helper:**
```bash
curl -s -X POST "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=AIzaSyAT-KFuJ_GWaotsep3xtETJex8-gMEAc4g" \
  -H "Content-Type: application/json" \
  -d '{"contents":[{"parts":[{"text":"IKAI error: [ERROR]. Solution?"}]}]}'
```

---

## 🚀 DOCKER QUICK START

```bash
# Location: /home/asan/Desktop/ikai

# Start ALL services
docker compose up -d

# Access
Frontend: http://localhost:8103
Backend:  http://localhost:8102
Login:    info@gaiai.ai / 23235656

# Hot reload AUTOMATIC! Edit files → Auto reload in Docker
```

**Services:** Backend (8102) | Frontend (8103) | PostgreSQL (8132) | Redis (8179) | MinIO (8100, 8101) | Milvus (8130, 8191) | Ollama (8134) | Etcd

---

## 🏗️ ARCHITECTURE

**High-Level Structure:**
```
/home/asan/Desktop/ikai/
├── backend/              # Node.js + Express + Prisma
│   ├── src/middleware/   # organizationIsolation, usageTracking, authorize
│   ├── src/routes/       # 120+ endpoints (10 new for SaaS)
│   ├── src/workers/      # BullMQ workers (5 workers)
│   └── prisma/           # schema.prisma (Organization model)
├── frontend/             # Next.js 14 + TypeScript
│   ├── app/(public)/     # Landing pages (marketing)
│   ├── app/(authenticated)/ # Protected pages (RBAC)
│   ├── lib/hooks/        # useHasRole (RBAC)
│   └── components/       # AppLayout, OnboardingGuard, UsageWidget
├── docs/                 # 50+ documentation files
│   ├── INDEX.md          # Navigation hub
│   ├── workflow/
│   │   ├── MOD-PLAYBOOK.md      # 🎯 Mod's complete guide
│   │   ├── WORKER-PLAYBOOK.md   # 👷 Worker's complete guide
│   │   └── ASANMOD-REFERENCE.md # 📚 Deep dive (optional)
│   ├── features/         # Phase JSONs + SaaS plans
│   └── reports/          # Verification reports
├── scripts/              # Utility scripts (auto-commit, test-helper)
└── docker-compose.yml    # 11 services
```

**📖 Full architecture:** [`docs/INDEX.md`](docs/INDEX.md)

---

## 🔐 CREDENTIALS

**Admin:** info@gaiai.ai / 23235656
**DB:** postgresql://ikaiuser:ikaipass2025@localhost:8132/ikaidb
**GitHub:** https://github.com/masan3134/ikaiapp (private)

**Other:** Gemini API, Gmail SMTP, VPS SSH → `.env.local`

---

## 🧪 TEST DATA

**Created:** 2025-11-04 | **Location:** DEV database

**3 Organizations:** FREE, PRO, ENTERPRISE
**4 Roles per org:** ADMIN, MANAGER, HR_SPECIALIST, USER
**Password:** TestPass123! (all test accounts)

**Example:**
- test-admin@test-org-1.com (FREE plan, ADMIN role)
- test-hr_specialist@test-org-2.com (PRO plan, HR_SPECIALIST role)

**5 Total Roles:**
1. **SUPER_ADMIN** → Mustafa Asan only (info@gaiai.ai)
2. **ADMIN** → Org admin (full access)
3. **MANAGER** → Department manager
4. **HR_SPECIALIST** → HR staff
5. **USER** → Basic employee (Dashboard only)

**📖 Full test data:** [`docs/test-tasks/test-data-reference.md`](docs/test-tasks/test-data-reference.md)
**🐍 API Testing:** [`scripts/test-helper.py`](scripts/test-helper.py)

**Recreate:**
```bash
docker exec ikai-backend node /usr/src/app/create-test-data.js
```

---

## 🚀 SAAS FEATURES (v13.0)

**Complete multi-tenant transformation - Production ready**

**5 Major Features:**
1. **Multi-Tenant Architecture** - Organization model + data isolation
2. **Onboarding System** - 5-step wizard for new users
3. **Usage Limits & Tracking** - Plan-based enforcement (FREE/PRO/ENTERPRISE)
4. **Super Admin Dashboard** - System-wide management (SUPER_ADMIN role)
5. **Public Landing Page** - Marketing homepage + features + pricing

**Plans:**
- **FREE:** 10 analyses/mo, 50 CVs/mo, 2 users | ₺0
- **PRO:** 50 analyses/mo, 200 CVs/mo, 10 users | ₺99/ay
- **ENTERPRISE:** ∞ analyses, ∞ CVs, ∞ users | İletişim

**📖 Full SaaS docs:**
- [`docs/features/saas-transformation-plan.md`](docs/features/saas-transformation-plan.md) (1,794 lines)
- [`docs/features/saas-quick-reference.md`](docs/features/saas-quick-reference.md) (346 lines)

---

## 🤖 AI FEATURES (Gemini)

**Key:** AIzaSyAT-KFuJ_GWaotsep3xtETJex8-gMEAc4g | **Model:** gemini-2.0-flash

### Quick Overview

- **CV Analysis:** BATCH_SIZE: 6 | Capacity: 50 CVs | 25 CVs → ~70s
- **AI Chat:** Milvus collection | Limits: 40 base, 100 all, 8 semantic
- **Queue System:** 5 workers (analysis, offer, email, test, feedback)

**📖 AI docs:**
- [`docs/reports/2025-11-02-chunking-implementation.md`](docs/reports/2025-11-02-chunking-implementation.md)
- [`docs/reports/2025-11-02-queue-system-implementation.md`](docs/reports/2025-11-02-queue-system-implementation.md)

---

## 🧙 WIZARD SYSTEMS

- **Analysis Wizard:** Upload 2s (10 files), CV Limit: 50
- **Onboarding Wizard:** 5 steps (Company → Job → CVs → Team → Success)

**📖 Wizard docs:**
- [`docs/reports/2025-11-01-analysis-wizard-evaluation.md`](docs/reports/2025-11-01-analysis-wizard-evaluation.md)
- [`docs/features/phase2-completion-report.md`](docs/features/phase2-completion-report.md)

---

## 🆘 TROUBLESHOOTING

**Backend won't start:** `docker logs ikai-postgres` + `npx prisma migrate deploy`
**Queue stuck:** `docker logs ikai-backend | grep "worker started"`
**Gemini rate limit:** `GET /api/v1/queue/health` (admin only)

**📖 Full troubleshooting:** [`docs/INDEX.md`](docs/INDEX.md) - Troubleshooting section

---

## 🔄 WORKFLOW

```bash
# 1. Code (hot reload in Docker)
# Edit backend/src/ or frontend/app/ → Auto reload!

# 2. Git Auto-Commit (MANDATORY!)
git add filename
git commit -m "message"  # Auto-push happens

# 3. Test
curl http://localhost:8102/health
docker logs ikai-backend -f
```

**📖 Git automation:** [`AUTO_COMMIT_GUIDE.md`](AUTO_COMMIT_GUIDE.md)

---

## 🐍 TEST SCRIPTS (Workers)

**6 Ready-to-Use Templates** - Copy, customize, run!

**Quick Start:**
```bash
# 1. Copy template
cp scripts/templates/api-test-template.py scripts/tests/w1-my-test.py

# 2. Customize
nano scripts/tests/w1-my-test.py

# 3. Run
python3 scripts/tests/w1-my-test.py > test-outputs/w1-output.txt
```

**Available Templates:**
- `api-test-template.py` - Basic CRUD testing
- `rbac-test-template.py` - Role permission testing
- `workflow-test-template.py` - Full hiring workflow
- `performance-test-template.py` - Response time measurement
- `ai-chat-test-template.py` - AI chat testing
- `cleanup-test-template.py` - Cleanup test data

**Base Helper:**
```python
from test_helper import IKAITestHelper, TEST_USERS

helper = IKAITestHelper()
helper.login("test-admin@test-org-1.com", "TestPass123!")
helper.get("/api/v1/job-postings")
```

**📚 Complete Guide:**
- **Workers:** [`docs/test-tasks/WORKER-SCRIPT-GUIDE.md`](docs/test-tasks/WORKER-SCRIPT-GUIDE.md) (9KB)
- **Templates:** [`scripts/templates/README.md`](scripts/templates/README.md)
- **Base Helper:** [`scripts/test-helper.py`](scripts/test-helper.py)

**Directory Structure:**
```
scripts/
├── test-helper.py         # Base helper (READONLY)
├── templates/             # 6 templates (READONLY)
├── tests/                 # Worker scripts (write here)
└── test-outputs/          # Test results (ignored by git)
```

**⚠️ Rules:**
- ✅ Copy templates to `tests/`
- ✅ Save outputs to `test-outputs/`
- ❌ NEVER modify `test-helper.py`
- ❌ NEVER modify templates
- ❌ NEVER modify `test-data/`

---

## ☁️ VPS DEPLOY

```bash
rsync -avz --exclude 'node_modules' . root@62.169.25.186:/var/www/ik/
ssh root@62.169.25.186 "cd /var/www/ik && docker compose -f docker-compose.server.yml restart backend frontend"
```

**URL:** https://gaiai.ai/ik

---

## 🔌 MCP INTEGRATION

**6 Active Servers:** filesystem, git, fetch, memory, time, sequentialthinking

**Config:** `~/.config/Code/User/settings.json`
**Servers:** `~/mcp-servers/mcp-official/`

---

## 📚 DOCUMENTATION PHILOSOPHY

### New Architecture (v14.0)

**CLAUDE.md (This file):** Quick reference + role selection hub (~300 lines)

**Role-Based Playbooks:**
- **MOD-PLAYBOOK.md** → Everything Mod needs (16KB, 500+ lines)
- **WORKER-PLAYBOOK.md** → Everything Worker needs (18KB, 900+ lines)

**Deep Dive Reference:**
- **ASANMOD-REFERENCE.md** → Methodology, examples, advanced topics

### Navigation

**Start here:**
1. Read CLAUDE.md (this file - 30 seconds)
2. Identify your role (Mod or Worker)
3. Read your playbook (MOD or WORKER)
4. Start working!

**Need more?**
- **Everything:** [`docs/INDEX.md`](docs/INDEX.md) - 50+ files
- **Deep dive:** [`docs/workflow/ASANMOD-REFERENCE.md`](docs/workflow/ASANMOD-REFERENCE.md)

**Search docs:**
```bash
grep -r "keyword" docs/ --include="*.md"
```

---

## ✅ CURRENT STATUS (2025-11-04)

| Component | Status | Note |
|-----------|--------|------|
| **Docker Setup** | ✅ | All services isolated, hot reload active |
| **Backend** | ✅ | Running on port 8102 (Docker) |
| **Frontend** | ✅ | Running on port 8103 (Docker) |
| **Database** | ✅ | PostgreSQL + Milvus + Redis ready |
| **Queue System** | ✅ | 5 queues + 5 workers operational |
| **Multi-Tenant** | ✅ | Organization-level data isolation |
| **Onboarding** | ✅ | 5-step wizard for new users |
| **Usage Limits** | ✅ | Plan-based enforcement active |
| **Super Admin** | ✅ | System-wide management dashboard |
| **Landing Page** | ✅ | Public marketing pages live |
| **Git Auto-Commit** | ✅ | Post-commit hook + scripts |
| **GitHub Repo** | ✅ | Clean repo with full project |
| **MCP Integration** | ✅ | 6 MCPs in VS Code extension |
| **🆕 AsanMod v2** | ✅ | **Role-based architecture (MOD/WORKER playbooks)** |
| **🆕 API Documentation** | ✅ | **142 endpoints (OpenAPI + Postman + SDK guide)** |
| **🆕 Notification System** | ✅ | **In-app + email + 15 types + preferences** |
| **🆕 Frontend RBAC Layer 4** | ✅ | **UI visibility + 5 role dashboards + FAB** |
| **🆕 AI Chat Verified** | ✅ | **Gemini + Milvus tested (response time < 5s)** |

**Location:** /home/asan/Desktop/ikai
**GitHub:** https://github.com/masan3134/ikaiapp (private)
**AsanMod:** v2.0 - Role-based single source of truth
**Status:** 🚀 **PRODUCTION READY**

---

## 📋 VERSION HISTORY

**v15.3 (2025-11-04):** 🎯 **ASANMOD ENHANCED - WORKER COORDINATION + LOG PROTOCOL**
- ✅ **Rule 6: Worker Coordination** - Prevent file conflicts in parallel tasks
- ✅ **Rule 7: Log Reading Protocol** - Mandatory error checking after every task
- ✅ **Scope Awareness** - Workers only fix their own files, report others' errors
- ✅ **5 Dashboard Tasks Created:** USER, HR_SPECIALIST, MANAGER, ADMIN, SUPER_ADMIN
- ✅ **Task Files:** 4,768 lines of ultra-detailed design specs
- ✅ **Color Themes:** 5 role-specific palettes (Slate, Emerald, Blue, Purple, Red)
- ✅ **42 Widgets Planned:** 8-9 widgets per role dashboard
- **MOD-PLAYBOOK:** Added coordination strategy
- **WORKER-PLAYBOOK:** Added log protocol + scope rules
- **Impact:** Zero file conflicts, clean error handling, better worker discipline

**v15.2 (2025-11-04):** 🔒 **RBAC AUDIT COMPLETE - MERGED TO MAIN**
- ✅ **18 Security Bugs Fixed:** 1 CRITICAL (analytics unprotected) + 17 HIGH/MEDIUM
- ✅ **4 Roles Audited:** USER, HR_SPECIALIST, MANAGER, ADMIN (100% verified)
- ✅ **4 RBAC Layers:** Page access + Data filtering + CRUD permissions + UI visibility
- ✅ **Worker Reports:** 4 comprehensive audits (2,656 lines)
- ✅ **Mod Verification:** 100% honest (14/14 tests MATCH)
- ✅ **Test Infrastructure:** 6 templates + 9 worker scripts + WORKER-SCRIPT-GUIDE
- ✅ **Documentation Cleanup:** 3 redundant files deleted (-2,878 lines)
- ✅ **AsanMod v15.1:** Communication protocol + streamlined docs (3 core files)
- **Commits:** 22 (17 bug fixes + 5 verifications)
- **Changes:** 59 files, +13,000 insertions, -2,894 deletions
- **Duration:** ~3 hours (Mod) + 7.5 hours (4 parallel workers)
- **📖 Handoff:** [`docs/reports/session-handoff-2025-11-04-rbac-audit.md`](docs/reports/session-handoff-2025-11-04-rbac-audit.md)
- **📊 Summary:** [`docs/reports/rbac-audit-session-summary-2025-11-04.md`](docs/reports/rbac-audit-session-summary-2025-11-04.md)

**v15.0 (2025-11-04):** 🎉 **PRODUCTION READY - COMPLETE DOCUMENTATION**
- ✅ **API Documentation:** 142 endpoints (OpenAPI + Postman) - 8,627 lines
- ✅ **Notification System:** In-app + email + preferences (15 types)
- ✅ **Frontend RBAC Layer 4:** UI visibility complete (40+ helpers)
- ✅ **Visual Identity:** 5 role colors + dashboards + FAB
- ✅ **AI Chat Test:** Gemini + Milvus verified working
- ✅ **Session Handoff:** Comprehensive template added
- ✅ **Token Policy:** 1M context optimized (700K threshold)
- **Workers:** 4 parallel (100% completion)
- **Commits:** 117 (perfect git discipline)
- **Changes:** +15,135 lines
- **Reports:** 10 files (6,859 lines)
- **Duration:** 8 hours
- **📖 Handoff:** [`docs/reports/session-handoff-2025-11-04-final.md`](docs/reports/session-handoff-2025-11-04-final.md)

**v14.0 (2025-11-04):** 🎯 **ASANMOD V2 - ROLE-BASED ARCHITECTURE**
- MOD/WORKER playbooks (single source of truth)
- Role-based architecture
- Simplified onboarding

**v13.0 (2025-11-03):** 🚀 **SAAS TRANSFORMATION**
- Multi-tenant + Onboarding + Usage limits

**v12.0 (2025-11-03):** 🎉 **LOCAL DEV SETUP**
- Docker isolated + Git auto-commit

**📖 Full history:** [`docs/reports/2025-11-02-session-summary.md`](docs/reports/2025-11-02-session-summary.md)

---

## 🔍 HOW TO USE

**New developer?**
1. Read CLAUDE.md (this file - overview)
2. Choose role: Mod or Worker
3. Read your playbook (MOD-PLAYBOOK or WORKER-PLAYBOOK)
4. Start working!

**Need specific info?**
- Search in [`docs/INDEX.md`](docs/INDEX.md)
- Or: `grep -r "keyword" docs/ --include="*.md"`

**Troubleshooting?**
- Check playbooks (MOD/WORKER)
- Search in `docs/reports/` for related issues

---

**🎯 Role-Based Architecture = Maximum Efficiency**

**CLAUDE.md: Hub (30s) → Your Playbook (1 read) → Start working!**

**Mod:** Read MOD-PLAYBOOK.md only
**Worker:** Read WORKER-PLAYBOOK.md only
**Both:** Everything in ONE file. No link jumping. Self-contained.
