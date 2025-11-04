# 🤖 IKAI HR Platform - Development Guide

**Version:** 13.0 - Production SaaS Ready (Multi-Tenant + Onboarding + Limits)
**Updated:** 2025-11-04
**Environment:** Docker Isolated Development (Hot Reload Enabled)

> **📚 FULL DOCUMENTATION:** [`docs/INDEX.md`](docs/INDEX.md) - 50+ detailed documents
> **📝 LATEST CHANGES:** [`docs/features/saas-transformation-plan.md`](docs/features/saas-transformation-plan.md)
> **🚀 SAAS QUICK START:** [`docs/features/saas-quick-reference.md`](docs/features/saas-quick-reference.md)

---

## 🎯 ASANMOD WORKFLOW (MANDATORY)

**📖 Full Methodology:** [`docs/workflow/ASANMOD-METHODOLOGY.md`](docs/workflow/ASANMOD-METHODOLOGY.md) (20KB)
**⚡ Quick Reference:** [`docs/workflow/ASANMOD-QUICK-REFERENCE.md`](docs/workflow/ASANMOD-QUICK-REFERENCE.md) (5KB)

### 🎭 ASANMOD IDENTITY SYSTEM

**User declares your role at conversation start:**

#### **"sen modsun"** → You are MASTER CLAUDE (Mod)
- 📋 Plan phases → JSON task files
- ✅ Verify work → Read verification MD + RE-RUN commands
- 🔍 Validate → Compare Worker output vs your output (detect fake data!)
- 🤖 Automate tests → Playwright/curl (no manual testing!)

**🚨 CRITICAL:** NEVER trust Worker's MD alone! ALWAYS re-run verification commands and compare outputs.

**📖 Details:** [`docs/workflow/ASANMOD-METHODOLOGY.md`](docs/workflow/ASANMOD-METHODOLOGY.md) - Mod role section

---

#### **"sen workersin"** → You are WORKER CLAUDE (Executor)
- 📖 Read JSON → Execute tasks with REAL tools
- ⚠️ NO SIMULATION → Bash/Read/Edit/Write only
- 📄 Create report → EXACT terminal outputs (no interpretation)

**❌ FORBIDDEN:** Simulation, mocking, "done" without proof
**✅ REQUIRED:** Read JSON completely, run ALL verification commands, paste raw outputs

**📖 Details:** [`docs/workflow/ASANMOD-METHODOLOGY.md`](docs/workflow/ASANMOD-METHODOLOGY.md) - Worker role section

---

### 📜 ASANMOD QUICK COMMANDS

**For Mod:**
```
"p1 hazırla" → Create Phase 1 JSON
"p1 bitti doğrula" → Read MD + re-run commands + verify
"kesin eminmiyiz" → Demand grep/wc proof
```

**For Worker:**
```
"bu jsonu yap" → Execute all tasks
"verification md yi kaydet" → Write report
```

**📖 Full commands:** [`docs/workflow/ASANMOD-QUICK-REFERENCE.md`](docs/workflow/ASANMOD-QUICK-REFERENCE.md)

---

### 🔑 ASANMOD PRINCIPLES

- **Paralel:** Phases run in different tabs simultaneously
- **Doğrulanabilir:** RAW terminal outputs (no interpretation)
- **Ham Veri:** Mod verifies with grep/wc/build outputs
- **Ultra-Detaylı JSON:** Exact commands, code patterns, file paths
- **Identity-Aware:** Mod coordinates, Worker executes

**📖 Methodology:** [`docs/workflow/ASANMOD-METHODOLOGY.md`](docs/workflow/ASANMOD-METHODOLOGY.md)

---

### ⚡ PARALLEL SERVICE MANAGEMENT

**Max 30 parallel tool calls** (Read/Edit/Write/Bash/Grep/Glob)

**✅ Use:** 5-10 parallel Reads for verification, multiple grep simultaneously
**❌ Avoid:** 30+ parallel operations, dependent tasks in parallel

**📖 Details + Examples:** [`docs/workflow/ASANMOD-METHODOLOGY.md`](docs/workflow/ASANMOD-METHODOLOGY.md) - Parallel section

---

### 💬 COMMUNICATION STYLE

**Both Mod & Worker:**
- ⚡ Brief (3-4 lines max)
- 📊 Status-focused ("Verified ✅", "Found 12 unprotected")
- 🎯 Action-oriented (what you're doing NOW)
- 🚫 No essays

**Communication Depth Policy:**
- **To User:** Brief updates (3 lines)
- **Background:** Ultra-detailed (silent)
- **Reports:** Comprehensive with RAW data

**📖 Full policy + examples:** [`docs/workflow/ASANMOD-METHODOLOGY.md`](docs/workflow/ASANMOD-METHODOLOGY.md) - Communication section

---

### 🔴 LIVE PROGRESS UPDATES (Terminal Style)

**When executing 5+ tasks, show progress:**
```
[ASANMOD AUDIT - EXECUTING]
[1/4] ✏️ Endpoint Testing → VERIFICATION-PROTOCOL.md
[2/4] 🔍 CLAUDE.md order check & update
[3/4] ✅ Live Progress style → Communication Depth
[4/4] ✅ Final consistency check
```

**Icons:** ✅ Completed | 🔍 Checking | ✏️ Writing | ⚠️ Warning | ❌ Error | 🔧 Fixing

**📖 Full guidelines:** [`docs/workflow/ASANMOD-METHODOLOGY.md`](docs/workflow/ASANMOD-METHODOLOGY.md) - Live Progress section

---

### 🗣️ İLETİŞİM DİLİ: TÜRKÇE ZORUNLU

**KURAL:** Mod ve Worker, Mustafa Asan ile **SADECE TÜRKÇE** konuşur.

**Format:**
- ✅ Teknik terimler İngilizce (withRoleProtection, commit, grep)
- ✅ Açıklama Türkçe
- ✅ **"Ne yaptım?" + "Gerçek dünyada ne çözüldü?"**

**📖 Örnekler:** [`docs/workflow/ASANMOD-GIT-WORKFLOW.md`](docs/workflow/ASANMOD-GIT-WORKFLOW.md) - İletişim Kuralları

---

### 🔒 ASANMOD GIT POLICY (MANDATORY - ABSOLUTE)

**🚨 CRITICAL RULE FOR BOTH MOD & WORKER:**

**ANY FILE CHANGE = IMMEDIATE COMMIT + PUSH**

```
❌ FORBIDDEN:
- Working without committing (even 1 character change!)
- Delaying commits ("I'll commit later")
- Batching changes (multiple edits before commit)
- "Forgot to commit" excuse

✅ REQUIRED AFTER EVERY CHANGE:
1. git add .
2. git commit -m "descriptive message"
3. Auto-push happens (post-commit hook active)

🎯 REASON:
- Güvenlik (security) - Changes tracked instantly
- Akış (flow) - Clear progress trail
- Doğrulama (verification) - Mod can verify commit history
- Geri alma (rollback) - Easy to revert bad changes
```

**Examples:**

**Mod creates Phase 3 JSON:**
```bash
# After creating role-access-phase3.json
git add docs/features/role-access-phase3.json
git commit -m "feat(asanmod): Add Phase 3 JSON - Frontend RBAC (19 pages)"
# Auto-push happens
```

**Worker edits 1 file:**
```bash
# After editing job-postings/page.tsx (added 2 lines)
git add frontend/app/\(authenticated\)/job-postings/page.tsx
git commit -m "feat(rbac): Protect job-postings page with HR_MANAGERS role"
# Auto-push happens
```

**Worker creates verification MD:**
```bash
# After creating phase3-verification.md
git add docs/reports/phase3-verification.md
git commit -m "docs(asanmod): Add Phase 3 verification report (RAW outputs)"
# Auto-push happens
```

**🎯 Verification by Mod:**
```bash
# Mod checks Worker's commits
git log --oneline -10
# Should see EVERY file change as separate commit!
```

**Tek harf değişikliği bile = COMMIT!**
**No exceptions. No delays. IMMEDIATE commit after ANY change.**

**📖 Full git workflow:** [`docs/workflow/ASANMOD-GIT-WORKFLOW.md`](docs/workflow/ASANMOD-GIT-WORKFLOW.md)

---

**5N Methodology (Standard Non-AsanMod Tasks):**
1. **NE:** What? | 2. **NEREDE:** Where? | 3. **NE LAZIM:** What's needed?
4. **NEDEN:** Why? | 5. **NASIL:** How?

---

## ⚠️ STRICT RULES

**Rule 1: NEVER GIVE UP** - 3 errors → Ask Gemini (curl below)
**Rule 2: VALIDATE FIRST** - Check paths, test, then execute
**Rule 3: GEMINI ASSISTANT** - Get suggestion → Validate → Apply
**Rule 4: HOT RELOAD ON** - Backend (nodemon), Frontend (Next.js dev)
**Rule 5: NO ROOT FILES** - Use `docs/` for documentation

**Gemini Helper:**
```bash
curl -s -X POST "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=AIzaSyAT-KFuJ_GWaotsep3xtETJex8-gMEAc4g" \
  -H "Content-Type: application/json" \
  -d '{"contents":[{"parts":[{"text":"IKAI error: [ERROR]. Solution?"}]}]}'
```

---

## 🚀 QUICK START

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
│   ├── workflow/         # AsanMod methodology
│   ├── features/         # Phase JSONs + SaaS plans
│   └── reports/          # Session summaries
├── scripts/              # Utility scripts (auto-commit, test-helper)
└── docker-compose.yml    # 11 services
```

**📖 Full architecture:** [`docs/architecture/`](docs/architecture/) + [`docs/INDEX.md`](docs/INDEX.md)

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

**📖 Full test data table:** [`docs/test-tasks/test-data-reference.md`](docs/test-tasks/test-data-reference.md)
**🐍 API Testing:** [`scripts/test-helper.py`](scripts/test-helper.py) - Python helper for API calls

**Recreate test data:**
```bash
docker exec ikai-backend node /usr/src/app/create-test-data.js
```

---

## 🚀 SAAS FEATURES (v13.0)

**Complete multi-tenant transformation - Production ready in 13.5 hours**

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
- **Plan:** [`docs/features/saas-transformation-plan.md`](docs/features/saas-transformation-plan.md) (1,794 lines)
- **Quick Ref:** [`docs/features/saas-quick-reference.md`](docs/features/saas-quick-reference.md) (346 lines)
- **Phase Reports:** [`docs/features/phase1-completion-report.md`](docs/features/phase1-completion-report.md) (5 phase reports)

---

## 🤖 AI FEATURES (Gemini)

**Key:** AIzaSyAT-KFuJ_GWaotsep3xtETJex8-gMEAc4g | **Model:** gemini-2.0-flash

### **CV Analysis with Chunking**
- BATCH_SIZE: 6 | Capacity: 50 CVs
- 25 CVs → 5 batches (~70s)

### **AI Chat (Milvus)**
- Collection: `analysis_chat_contexts`
- Limits: 40 base, 100 all candidates, 8 semantic

### **Queue System**
- 5 workers: analysis, offer, email, test generation, feedback
- Concurrency limits (Gemini protection!)

**📖 AI docs:**
- [`docs/reports/2025-11-02-chunking-implementation.md`](docs/reports/2025-11-02-chunking-implementation.md)
- [`docs/reports/2025-11-02-queue-system-implementation.md`](docs/reports/2025-11-02-queue-system-implementation.md) (47KB)
- [`docs/reports/2025-11-02-ai-chat-optimization-for-large-analysis.md`](docs/reports/2025-11-02-ai-chat-optimization-for-large-analysis.md)

---

## 🧙 WIZARD SYSTEMS

### **Analysis Wizard (v2.0)**
- Upload: 2s (10 files) - 10x faster
- CV Limit: 50 | State: Persistent (localStorage)

### **Onboarding Wizard (v1.0)**
- 5 steps: Company → Job → CVs → Team → Success
- OnboardingGuard blocks access until complete

**📖 Wizard docs:**
- [`docs/reports/2025-11-01-analysis-wizard-evaluation.md`](docs/reports/2025-11-01-analysis-wizard-evaluation.md)
- [`docs/features/phase2-completion-report.md`](docs/features/phase2-completion-report.md) (Onboarding)

---

## 🎯 CRITICAL CONFIGS

### **Queue Workers:**
```javascript
// analysisWorker.js - concurrency: 3
// offerWorker.js - concurrency: 2
// emailWorker.js - concurrency: 5
```

### **Gemini Rate Limiter:**
```javascript
// utils/geminiRateLimiter.js
maxRequests: 15  // RPM limit (free tier)
```

### **Gemini Batch:**
```javascript
BATCH_SIZE = 6   // Token-safe limit
```

**📖 Full configs:** [`docs/reports/2025-11-02-queue-system-implementation.md`](docs/reports/2025-11-02-queue-system-implementation.md)

---

## 🆘 TROUBLESHOOTING

**Backend won't start:** `docker logs ikai-postgres` + `npx prisma migrate deploy`
**Queue stuck:** `docker logs ikai-backend | grep "worker started"`
**Gemini rate limit:** `GET /api/v1/queue/health` (admin only)
**Gemini 25+ CV error:** Check BATCH_SIZE=6
**AI Chat broken:** Check Milvus collection

**📖 Full troubleshooting:** [`docs/INDEX.md`](docs/INDEX.md) - Troubleshooting section

---

## 🔄 WORKFLOW

```bash
# 1. Code (hot reload in Docker)
# Edit backend/src/ or frontend/app/ → Auto reload!

# 2. Git Auto-Commit (3 ways)
./scripts/auto-commit.sh "feat: New feature"  # Script
git commit -m "message"                        # Hook auto-pushes
# OR in VS Code: Ctrl+Shift+S                 # Keyboard shortcut

# 3. Test
curl http://localhost:8102/health              # Backend health
docker logs ikai-backend -f                    # Backend logs
```

**📖 Git automation:** [`AUTO_COMMIT_GUIDE.md`](AUTO_COMMIT_GUIDE.md)

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

## 📚 FILE REFERENCE MAP (IKAI-Specific)

### 🎯 RBAC Files (Current Work)

**Phase JSONs:**
- [`docs/features/role-access-phase1-infrastructure.json`](docs/features/role-access-phase1-infrastructure.json)
- [`docs/features/role-access-phase2-backend-routes.json`](docs/features/role-access-phase2-backend-routes.json)
- [`docs/features/role-access-phase3-frontend-pages.json`](docs/features/role-access-phase3-frontend-pages.json)
- [`docs/features/role-access-phase4-sidebar-navigation.json`](docs/features/role-access-phase4-sidebar-navigation.json)

**Backend RBAC:**
- [`backend/src/constants/roles.js`](backend/src/constants/roles.js) - ROLES, ROLE_GROUPS
- [`backend/src/middleware/authorize.js`](backend/src/middleware/authorize.js) - authorize()

**Frontend RBAC:**
- [`frontend/lib/constants/roles.ts`](frontend/lib/constants/roles.ts) - UserRole, RoleGroups
- [`frontend/lib/hooks/useHasRole.ts`](frontend/lib/hooks/useHasRole.ts) - useHasRole hook
- [`frontend/lib/hoc/withRoleProtection.tsx`](frontend/lib/hoc/withRoleProtection.tsx) - Page HOC
- [`frontend/components/AppLayout.tsx`](frontend/components/AppLayout.tsx) - Sidebar

**📖 Complete file map:** [`docs/INDEX.md`](docs/INDEX.md) - All 50+ files indexed

---

## 📖 DOCUMENTATION PHILOSOPHY

**CLAUDE.md:** Quick reference (~25k chars)
**docs/ folder:** Deep dive (50+ files, 18,000+ lines)

### **Navigation Hub:**
- **Start here:** [`docs/INDEX.md`](docs/INDEX.md) - Complete navigation
- **AsanMod:** [`docs/workflow/ASANMOD-METHODOLOGY.md`](docs/workflow/ASANMOD-METHODOLOGY.md) (20KB full guide)
- **SaaS:** [`docs/features/saas-transformation-plan.md`](docs/features/saas-transformation-plan.md) (1,794 lines)
- **Latest:** [`docs/reports/2025-11-02-session-summary.md`](docs/reports/2025-11-02-session-summary.md)

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

**Setup Date:** 2025-11-03
**Location:** /home/asan/Desktop/ikai
**GitHub:** https://github.com/masan3134/ikaiapp (private)
**SaaS Status:** 🚀 Production Ready

---

## 📋 VERSION HISTORY

**v13.0 (2025-11-03):** 🚀 **COMPLETE SAAS TRANSFORMATION**
- Multi-tenant architecture + Onboarding wizard + Usage limits + Super admin + Landing page
- 5 phases completed in 13.5 hours
- **See:** [`docs/features/saas-transformation-plan.md`](docs/features/saas-transformation-plan.md)

**v12.0 (2025-11-03):** 🎉 **COMPLETE LOCAL DEV SETUP**
- Docker isolated + Git auto-commit + MCP integration
- 388 files committed (112,571 lines)

**📖 Full version history:** [`docs/reports/2025-11-02-session-summary.md`](docs/reports/2025-11-02-session-summary.md)

---

## 🔍 HOW TO USE

**New developer?**
1. Read CLAUDE.md (this file - overview)
2. Open [`docs/INDEX.md`](docs/INDEX.md) (complete navigation)
3. Check [`docs/reports/2025-11-02-session-summary.md`](docs/reports/2025-11-02-session-summary.md) (latest)

**Need specific info?**
- Search in [`docs/INDEX.md`](docs/INDEX.md)
- Or: `grep -r "keyword" docs/ --include="*.md"`

**Troubleshooting?**
- Check "TROUBLESHOOTING" section above
- Search in `docs/reports/` for related issues

---

**🎯 Compact Guide (CLAUDE.md) + Detailed Docs (docs/) = Zero Information Loss**

**CLAUDE.md: ~25k chars | Full docs: 18,000+ lines | Navigate via docs/INDEX.md**
