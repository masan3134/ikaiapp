# 🤖 IKAI HR Platform - Development Guide

**Version:** 17.0 - MCP-Powered + Two-Layer Communication
**Updated:** 2025-11-05
**Environment:** Docker Isolated Development (Hot Reload Enabled)
**Context:** 1M Tokens (Sonnet 4.5) - Full Detail Mode Until 700K

---

## 🚀 QUICK START (5 Minutes!)

### Step 1: Read Core (2 minutes)

```
Read: docs/workflow/ASANMOD-CORE.md (100 lines)
```

**Learn:**
- 5 core rules
- Template system
- Communication format

### Step 2: Check Templates (2 minutes)

```
Read: docs/workflow/templates/README.md
```

**12 templates available:**
- frontend/widget.md - Add dashboard widget
- frontend/protect.md - RBAC protection
- backend/api.md - API endpoint
- testing/verify.md - Mod verification
- [8 more...]

### Step 3: Start Working (1 minute)

**Mod:** Assign template + details (3 lines)
**Worker:** Follow template, report (3 lines)

**Communication:** ULTRA KISA! (emoji + 3 satır)

---

## 🎯 ASANMOD WORKFLOW (MANDATORY)

### 🎭 Choose Your Role

#### **"sen modsun"** → You are MASTER CLAUDE (Mod)

**Your playbook:** [`docs/workflow/MOD-PLAYBOOK.md`](docs/workflow/MOD-PLAYBOOK.md)

**Your responsibilities:**
- 📋 Plan phases → Create ultra-detailed MD task files
- 🎯 Assign tasks → Use ready templates! ([`MOD-TASK-ASSIGNMENT-TEMPLATES.md`](docs/workflow/MOD-TASK-ASSIGNMENT-TEMPLATES.md))
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

**Read system core:**
```bash
Read('docs/workflow/ASANMOD-CORE.md')
Read('docs/workflow/templates/README.md')
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

**Read system core:**
```bash
Read('docs/workflow/ASANMOD-CORE.md')
Read('docs/workflow/templates/README.md')
```

---

### 📋 Quick Commands (Both Roles)

**For Mod:**
```
"p1 hazırla" → Create Phase 1 JSON
"p1 bitti doğrula" → Read MD + re-run commands + verify
"kesin eminmiyiz" → Demand grep/wc proof
"worker'lara görev ver" → Use MOD-TASK-ASSIGNMENT-TEMPLATES.md (copy-paste!)
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

## 🎯 TWO-LAYER COMMUNICATION SYSTEM (CRITICAL!)

**System Architecture:** MOD ↔ USER ↔ WORKER

**🚨 MANDATORY: Separate communication layer from work layer!**

### Layer 1: USER Communication (ALWAYS SHORT)

**MOD → USER:**
```
✅ W1 görevi doğrulandı
- 19 sayfa korumalı
- Build başarılı
- Console temiz
```

**WORKER → USER:**
```
✅ RecentActivity widget bitti
Rapor: docs/reports/w1-task.md
MOD'a ilet lütfen
```

**Rules:**
- ✅ 3-5 satır max
- ✅ Emoji kullan
- ✅ Dosya referansı ver
- ❌ Teknik detay YOK
- ❌ MCP output YOK
- ❌ Kod snippet YOK

### Layer 2: Background Work (ALWAYS FULL DETAIL)

**MOD → Background:**
- ✅ TÜM MCP'leri çalıştır (hiç atlama!)
- ✅ TÜM verification'ları yap
- ✅ FULL rapor yaz (proof.txt, MD reports)
- ✅ Hiçbir adım kısaltma
- ✅ Token tasarrufu yapma!

**WORKER → Background:**
- ✅ TÜM dosyaları oku (lazy loading yok!)
- ✅ TÜM testleri yap (hiç atlama!)
- ✅ TÜM MCP'leri kullan (mandatory!)
- ✅ FULL proof.txt hazırla (tüm MCP outputs)
- ✅ Tek developer gibi çalış (detaylı, eksiksiz)

**Rules:**
- ✅ Her dosyayı okuyup anla
- ✅ Her MCP'yi çalıştır
- ✅ Her adımı dokümante et
- ❌ Token tasarrufu YOK
- ❌ Kısayol YOK
- ❌ "Assumes" YOK (varsayım yapma, oku!)

### Example

**WRONG Approach (Mixing layers):**
```
User: "W1 görevi nasıl gitti?"
MOD: "W1 görevi doğrulandı. postgres.count({table: "users"}) → {count: 19} sonucunu aldım, Worker'ın raporuyla eşleşiyor. code_analysis.build_check() da exitCode: 0 döndü, TypeScript hatası yok. playwright.console_errors() ile 0 console error tespit ettim..."
❌ User teknik detaylarla boğuldu!
```

**RIGHT Approach (Separated layers):**
```
User: "W1 görevi nasıl gitti?"
MOD → Background (silent):
  - postgres.count({table: "users"}) → {count: 19} ✅
  - Worker claimed: 19 → MATCH ✅
  - code_analysis.build_check() → {exitCode: 0} ✅
  - playwright.console_errors() → {errorCount: 0} ✅
  - Writes full verification to docs/reports/mod-verification-w1.md

MOD → USER (short):
  "✅ W1 doğrulandı
   - 19 user verified
   - Build + console temiz
   - Rapor: docs/reports/mod-verification-w1.md"
✅ User kısa özet aldı, detaylar raporda!
```

**Key Principle:**
- **User görür:** Emoji + 3 satır özet
- **Sistem yapar:** Full detaylı çalışma (hiçbir kısaltma yok!)

---

## 👥 WORKER COORDINATION SYSTEM (MULTI-DEVELOPER MODE)

**Senaryo:** 6 worker paralel çalışıyor (W1-W6), tıpkı gerçek bir development team gibi!

**🚨 CRITICAL: Prevent file conflicts, maintain hot reload, everyone knows their identity!**

### Identity System

**Every session starts with identity:**
```
User: "sen modsun"
MOD: ✅ Identity: MASTER CLAUDE (Coordinator)

User: "sen W1'sin"
W1: ✅ Identity: WORKER 1 (Executor)
    Working on: [task assigned by MOD]
    Files locked: [list]

User: "sen W3'sün"
W3: ✅ Identity: WORKER 3 (Executor)
    Working on: [task assigned by MOD]
    Files locked: [list]
```

**Identity Rules:**
- ✅ ALWAYS know your identity (MOD or W1-W6)
- ✅ State identity in first message
- ✅ Reference identity in commits
- ✅ Track which files you're editing

### File Locking Protocol (Conflict Prevention)

**Location:** `/tmp/worker-locks.json`

**Format:**
```json
{
  "locks": {
    "frontend/components/dashboard/user/RecentActivity.tsx": {
      "worker": "W1",
      "locked_at": "2025-11-05T10:30:00Z",
      "task": "Add RecentActivity widget",
      "status": "in_progress"
    },
    "backend/src/routes/userRoutes.js": {
      "worker": "W3",
      "locked_at": "2025-11-05T10:31:00Z",
      "task": "Add user stats endpoint",
      "status": "in_progress"
    }
  }
}
```

**Worker Workflow:**

**Step 1: Before editing ANY file**
```bash
# Check if file is locked
cat /tmp/worker-locks.json | grep "my-file.tsx"

# If locked by another worker → STOP, report to MOD
# If not locked → Proceed to Step 2
```

**Step 2: Lock the file**
```bash
# Add lock to worker-locks.json
# Include: worker ID, timestamp, task, file path
```

**Step 3: Work on file**
```bash
# Edit, test, commit (1 file = 1 commit)
# Hot reload still works (nodemon/Next.js watching)
```

**Step 4: Release lock after commit**
```bash
# Remove lock from worker-locks.json
# File now available for others
```

**MOD Workflow:**

**Task Assignment:**
```
MOD checks worker-locks.json
MOD assigns W1: "frontend/components/dashboard/user/RecentActivity.tsx"
MOD assigns W2: "frontend/components/dashboard/admin/SystemHealth.tsx"
MOD assigns W3: "backend/src/routes/userRoutes.js"

✅ NO OVERLAP = NO CONFLICTS
```

**Monitoring:**
```bash
# MOD periodically checks locks
cat /tmp/worker-locks.json

# If lock > 30 minutes → Check worker progress
# If worker stuck → Reassign or help
```

### Hot Reload Protection

**Rules:**
- ✅ Dev servers ALWAYS running (backend:8102, frontend:8103)
- ✅ Workers NEVER restart servers
- ✅ Workers commit frequently → Hot reload picks up changes
- ❌ NO manual server restarts (kills hot reload!)
- ❌ NO simultaneous edits to same file

**Build Policy:**
```
Production build: ONLY when MOD explicitly requests
Test runs: Each worker in their own test scope
Hot reload: ALWAYS active, NEVER interrupted
```

### Parallel Work Example

**MOD assigns 3 parallel tasks:**

**W1 Task:**
```
File: frontend/components/dashboard/user/RecentActivity.tsx
Task: Add RecentActivity widget
Lock: W1 locks file in worker-locks.json
Work: Edit → Test → Commit → Release lock
Hot reload: Frontend auto-reloads after commit ✅
```

**W2 Task:**
```
File: frontend/components/dashboard/admin/SystemHealth.tsx
Task: Add SystemHealth widget
Lock: W2 locks file in worker-locks.json
Work: Edit → Test → Commit → Release lock
Hot reload: Frontend auto-reloads after commit ✅
```

**W3 Task:**
```
File: backend/src/routes/userRoutes.js
Task: Add /api/v1/users/stats endpoint
Lock: W3 locks file in worker-locks.json
Work: Edit → Test → Commit → Release lock
Hot reload: Backend (nodemon) auto-reloads after commit ✅
```

**Result:**
- ✅ 3 workers work simultaneously
- ✅ NO file conflicts (different files)
- ✅ Hot reload works for all
- ✅ Each commit triggers auto-reload
- ✅ User sees progress in real-time

### Conflict Resolution

**Scenario: W2 wants to edit file locked by W1**

```
W2: Checks worker-locks.json
W2: Sees "RecentActivity.tsx locked by W1"
W2 → USER: "❌ File locked by W1, waiting or need reassignment?"
USER → MOD: "W1'in görevi ne durumda?"
MOD: Checks W1 progress
MOD → USER: "W1 5 dakikada bitiyor" OR "W1'e yardım gerekiyor"
USER decides: Wait or reassign
```

**Auto-unlock Policy:**
- Lock > 60 minutes → Considered stale
- MOD can force-unlock if worker is stuck
- Worker must update lock timestamp periodically

### Communication Examples

**Worker Starting Work:**
```
W1 → USER (via MOD):
"🔒 RecentActivity.tsx lock aldım
Başlıyorum, ~15 dakika"
```

**Worker Finishing Work:**
```
W1 → USER (via MOD):
"✅ RecentActivity.tsx bitti
🔓 Lock release edildi
Commit: abc123"
```

**MOD Coordinating:**
```
MOD → USER:
"📊 Worker status:
- W1: RecentActivity.tsx (in progress, 10 min)
- W2: SystemHealth.tsx (in progress, 5 min)
- W3: userRoutes.js (completed ✅)"
```

### Identity Verification (Commit Messages)

**Every commit MUST include worker identity:**

```bash
# W1 commits
git commit -m "feat(dashboard): Add RecentActivity widget [W1]"

# W3 commits
git commit -m "feat(api): Add user stats endpoint [W3]"

# MOD commits
git commit -m "docs(workflow): Update task assignments [MOD]"
```

**Benefits:**
- ✅ Git history shows who did what
- ✅ Easy to track worker contributions
- ✅ Conflict resolution easier (know who to ask)

### Real-World Developer Simulation

**This system makes workers behave like real developers:**

1. **Check availability** → Read worker-locks.json
2. **Reserve resource** → Lock file
3. **Do work** → Edit, test, verify
4. **Commit** → 1 file = 1 commit (with identity)
5. **Release** → Unlock file
6. **Coordinate** → Report to MOD, get new task

**MOD behaves like Tech Lead:**
- Assigns tasks based on availability
- Monitors progress via locks
- Resolves conflicts
- Verifies completed work
- Coordinates team

**User behaves like Product Owner:**
- Sees short status updates
- Tracks overall progress
- Makes decisions on conflicts
- Reviews final results

---

## ⚠️ STRICT RULES

## 🚨 RULE 0: PRODUCTION-READY ONLY - ABSOLUTE LAW (NEVER FORGET!)

**THE GOLDEN RULE - Bu kural MOD ve WORKER'ın hafızasından ASLA silinmez!**

### FORBIDDEN WORDS - YASAKLI KELİMELER

**Bu kelimeleri ASLA kullanma, ASLA yaz:**

❌ **mock** - YASAK!
❌ **placeholder** - YASAK!
❌ **TODO** - YASAK!
❌ **FIXME** - YASAK!
❌ **coming soon** - YASAK!
❌ **will implement** - YASAK!
❌ **later** - YASAK!
❌ **yakında** - YASAK!
❌ **sonra yapılacak** - YASAK!
❌ **geçici** - YASAK!
❌ **temporary** - YASAK!
❌ **stub** - YASAK!
❌ **fake** - YASAK!
❌ **dummy** - YASAK!
❌ **sample** - YASAK!
❌ **example data** - YASAK!
❌ **test implementation** - YASAK!
❌ **for now** - YASAK!
❌ **hardcoded** - YASAK! (unless explicitly required)

### MANDATORY IMPLEMENTATION

**Her zaman:**
✅ **REAL API calls** - Gerçek backend endpoint'ler
✅ **REAL pages** - Gerçek, çalışan sayfalar
✅ **REAL data** - Database'den gerçek veri
✅ **REAL functionality** - Tam çalışan özellikler
✅ **PRODUCTION-READY code** - Deploy edilebilir kod
✅ **COMPLETE implementation** - Eksik iş yok
✅ **WORKING features** - Test edilmiş, çalışan özellikler

### EXAMPLES

**❌ WRONG (ASLA YAPMA!):**
```typescript
// TODO: Implement real API call
const data = mockData; // Placeholder

// Coming soon: Real authentication
function login() {
  return { success: true }; // Fake response
}

// Will implement later
const users = []; // Empty, yakında doldurulacak
```

**✅ RIGHT (HER ZAMAN BÖYLE!):**
```typescript
// Real API call with error handling
const response = await apiClient.get('/api/v1/users');
const data = response.data;

// Real authentication with database
async function login(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error('User not found');
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new Error('Invalid password');
  return createSession(user);
}

// Real data from database
const users = await prisma.user.findMany({
  where: { organizationId: req.user.organizationId }
});
```

### ENFORCEMENT

**MOD Policy:**
- If MOD sees ANY forbidden word → ❌ REJECT task immediately
- Worker must redo with REAL implementation
- No exceptions, no "just for testing"

**WORKER Policy:**
- Before completing task → grep code for forbidden words
- If found → FIX before reporting
- "Task done" = 100% production-ready, no placeholders

**Verification:**
```bash
# Check for forbidden words before commit
grep -r "TODO\|FIXME\|placeholder\|mock\|fake\|dummy" . --include="*.ts" --include="*.tsx"
# Result MUST be empty!
```

### WHY THIS RULE EXISTS

**Problem:**
- Placeholders pile up → Technical debt
- "Temporary" code becomes permanent
- Mock data hides real bugs
- TODO never gets done

**Solution:**
- Force complete implementation NOW
- Real code = Real testing
- Production-ready from day 1
- No debt accumulation

### REAL-WORLD SCENARIO

**User:** "W1, add user profile page"

**❌ BAD Worker:**
```
W1: "✅ Profile page bitti!"
Code:
  const user = { name: "Mock User" }; // TODO: Get from API
  <div>Coming soon: Real data</div>
```
MOD: ❌ REJECTED - Mock data, TODO found!

**✅ GOOD Worker:**
```
W1: "✅ Profile page bitti!"
Code:
  const user = await apiClient.get(`/api/v1/users/${userId}`);
  if (!user) return <NotFound />;
  return <ProfileView user={user} />;
Test: playwright.console_errors() → 0 ✅
Proof: Real data from database, no placeholders
```
MOD: ✅ VERIFIED - Production-ready!

---

**THIS IS THE FOUNDATION. NEVER FORGET!**

---

**Rule 1: ZERO CONSOLE ERROR TOLERANCE** 🚨 - SIFIR konsol hatası zorunlu! MOD ve WORKER konsol hatası varken "tamam" diyemez. playwright.console_errors() veya puppeteer.console_errors() → errorCount MUST be 0. Hiç istisna yok!
**Rule 2: CREDENTIALS CENTRAL** 📋 - TÜM credentials tek yerde: `docs/CREDENTIALS.md`. Env vars, test users, API keys, database credentials - hiçbir şey aranmaz, hepsi hazır!
**Rule 3: NEVER GIVE UP** - 3 errors → Ask Gemini
**Rule 4: VALIDATE FIRST** - Check paths, test, then execute
**Rule 5: GEMINI ASSISTANT** - Get suggestion → Validate → Apply
**Rule 6: HOT RELOAD ON** - Backend (nodemon), Frontend (Next.js dev)
**Rule 7: NO ROOT FILES** - Use `docs/` for documentation
**Rule 8: READ YOUR PLAYBOOK** - MOD-PLAYBOOK.md or WORKER-PLAYBOOK.md
**Rule 9: PYTHON FIRST** - NEVER use curl for API testing! Use Python requests (see MOD/WORKER playbooks Rule 11)
**Rule 10: BEWARE DUPLICATE FILES** - Check which file is ACTUALLY used before editing! (Details: docs/DUPLICATE-FILES-WARNING.md)

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

**v17.0 (2025-11-05):** 🔌 **MCP-POWERED + TWO-LAYER COMMUNICATION + WORKER COORDINATION + RULE 0**
- ✅ **RULE 0: PRODUCTION-READY ONLY** - ABSOLUTE LAW! Mock/placeholder/TODO YASAK! Real API, real pages, real data zorunlu. 19 yasaklı kelime. Hafızadan asla silinmez!
- ✅ **ZERO CONSOLE ERROR TOLERANCE** - errorCount MUST be 0, hiç istisna yok!
- ✅ **CREDENTIALS CENTRAL** - docs/CREDENTIALS.md → Tüm credentials tek yerde (500+ lines)
- ✅ **8 MCP Integration:** PostgreSQL, Docker, Playwright, Code Analysis, Gemini, filesystem, sequentialthinking, puppeteer
- ✅ **24/24 Test Success:** 100% pass rate across all MCPs (3 levels each)
- ✅ **Two-Layer System:** User iletişim (KISA) + Arka plan çalışma (FULL DETAY) ayrıldı
- ✅ **Worker Coordination:** File locking protocol, identity system, conflict prevention
- ✅ **Multi-Developer Mode:** 6 workers paralel çalışabilir (tıpkı gerçek team gibi!)
- ✅ **Hot Reload Protection:** Dev servers always running, workers never restart
- ✅ **Identity System:** Her worker kimliğini bilir (W1-W6), commits include identity
- ✅ **Tamper-Proof Verification:** MCP outputs = structured JSON (manipüle edilemez)
- ✅ **16 New Rules:** MOD (4 rules) + WORKER (12 rules) - MCP mandatory usage
- ✅ **Comprehensive Docs:** MCP-USAGE-GUIDE.md (936 lines), test summary (500+ lines)
- ✅ **Performance Categorized:** FAST (PostgreSQL, Docker), MEDIUM (Code Analysis, Gemini), SLOW (Playwright, puppeteer)
- **Impact:**
  - **CODE QUALITY:** 100% production-ready (NO mock/placeholder/TODO)
  - **CONSOLE ERRORS:** ZERO tolerance (errorCount MUST be 0)
  - **CREDENTIALS:** Tek yerde, hiçbir şey aranmaz
  - Verification reliability: 70% → 95%
  - Token usage: 5K → 500 per task (90% reduction)
  - MOD verify time: 20 min → 5 min (4x faster)
  - Worker honesty: Enforced (MCP outputs can't be faked)
  - User communication: ALWAYS short (3-5 lines), background work: ALWAYS full detail
  - Parallel work: 6 workers can work simultaneously without conflicts
  - Hot reload: NEVER interrupted, always active
  - File conflicts: PREVENTED via worker-locks.json
  - Technical debt: ZERO (no placeholders allowed)
- **Files:**
  - CLAUDE.md: Rule 0 (Production-Ready Only) + Two-Layer + Worker Coordination (+400 lines total)
  - docs/CREDENTIALS.md: Central credentials repository (500+ lines, ALL credentials)
  - MCP-USAGE-GUIDE.md (8 MCPs, 936 lines)
  - MOD-PLAYBOOK.md: v2.3 (+4 MCP rules)
  - WORKER-PLAYBOOK.md: v3.0 (+12 MCP rules)
  - ASANMOD-CORE.md: v17.0 (Rule 6: MCP-First)
  - Test summary: 24/24 PASS documented
  - /tmp/worker-locks.json: File locking coordination file

**v16.0 (2025-11-04):** 🚀 **TEMPLATE-BASED ASANMOD - 50x FASTER COORDINATION**
- ✅ **ASANMOD-CORE.md:** Universal system (100 lines, replaces 8,000!)
- ✅ **Template System:** 12 ready-to-use templates (widget, protect, api, verify, etc)
- ✅ **3-Line Tasks:** "widget.md + details" (eski 500 satır yerine!)
- ✅ **3-Line Reports:** "✅ Done + commit" (eski 800 satır yerine!)
- ✅ **Reference Archive:** Eski playbook'lar optional deep dive olarak taşındı
- ✅ **Puppeteer Integration:** Browser testing template'i sisteme entegre
- ✅ **50x Faster:** User 5 dakika yerine 10 saniye copy-paste!
- **Impact:** Koordinasyon süper hızlı, template'ler tekrar kullanılabilir
- **Files:**
  - ASANMOD-CORE.md (100 lines)
  - templates/ (12 templates × 30-50 lines)
  - reference/ (eski detaylı docs)
  - QUICK-START.md (5 dakika onboarding)

**v15.7 (2025-11-04):** 🔧 **W6 LESSONS LEARNED - Browser Test + apiClient MANDATORY**
- ✅ **Rule 12 (WORKER):** Test in Target Environment (browser test MANDATORY for frontend!)
- ✅ **Rule 13 (WORKER):** ALWAYS use apiClient (NO native fetch!)
- ✅ **Rule 14 (WORKER):** Dependency Installation Protocol (npm install verification)
- ✅ **Rule 15 (WORKER):** Browser vs Docker Context (localhost for browser!)
- ✅ **W4 Feedback:** Critical error - Missing dependency broke build
- ✅ **W5 Feedback:** Critical errors - Docker hostname + missing auth tokens (5+ console errors)
- ✅ **W6 Integration:** Debugger & Build Master role proven essential
- **WORKER-PLAYBOOK:** v2.2 → v2.3 (+289 lines)
- **Feedback docs:** W4 + W5 critical error reports
- **Impact:** Prevent build failures, enforce browser testing, standardize apiClient
- **Lesson:** 2/5 workers failed (W4, W5) - Playbook improvements prevent future failures

**v15.6 (2025-11-04):** 🐍 **PYTHON FIRST - curl BANNED**
- ✅ **Rule 11 (MOD & WORKER):** Python MANDATORY for ALL API testing
- ✅ **curl BANNED:** No more escaping hell, subshell errors, syntax issues
- ✅ **Ready-to-use Templates:** Login, dashboard, multi-role testing (copy-paste!)
- ✅ **Verification Standards:** Python commands Mod can re-run
- ✅ **Why Python:** No JSON escaping, readable, debuggable, consistent
- **MOD-PLAYBOOK:** v2.1 → v2.2 (+103 lines Python templates)
- **WORKER-PLAYBOOK:** v2.1 → v2.2 (+143 lines Python templates)
- **CLAUDE.md:** Rule 7 added (Python First)
- **Total:** +246 lines of Python verification infrastructure
- **Impact:** Zero curl syntax errors, reliable API testing, better verification workflow

**v15.5 (2025-11-04):** 🔄 **ASANMOD UNIVERSAL PRODUCTION-READY DELIVERY**
- ✅ **Rule 8 (UNIVERSAL):** NO Placeholder, NO Mock, NO TODO - Tüm görev türleri için!
- ✅ **Rule 9: API Testing Standard** - Token helper script (get-token.sh) - 1 satır token!
- ✅ **Self-Optimization Protocol:** 4-dimension analysis (Architecture, Content, Usability, Relevance)
- ✅ **Quality Gates:** 8-point checklist before AsanMod updates
- ✅ **Communication Templates:** 7 templates for easy copy-paste (Mod ↔ Worker ↔ User)
- ✅ **Page Completion Prompts:** 5 workers için full-stack examples
- ✅ **Anti-Fraud Integration:** Independent verification + Verifiable claims
- **get-token.sh:** Token helper script (all 5 roles)
- **README-TESTING.md:** Testing guide (Bash vs Python)
- **COMMUNICATION-TEMPLATES.md:** 562 lines (7 copy-paste templates)
- **WORKER-PLAYBOOK:** +298 lines (Rule 8+9 + examples)
- **MOD-PLAYBOOK:** +64 lines (Enforce production-ready)
- **ASANMOD-METHODOLOGY:** +246 lines (Self-optimization protocol)
- **PAGE-COMPLETION-PROMPTS:** 905 lines (Full implementation guides)
- **Impact:** Easy API testing, easy task distribution, zero placeholders, %100 production-ready

**v15.4 (2025-11-04):** 🔒 **ASANMOD ANTI-FRAUD - META-RULE** (merged into v15.5)
- ✅ **4-Dimension Analysis:** Architecture, Content, Usability, Relevance
- ✅ **Quality Gates:** 8-point checklist before any AsanMod update
- ✅ **Optimization Decision Matrix:** 4/4 Good = No update, 1/4 Good = Major overhaul
- ✅ **Depth Balance Test:** Too shallow vs Too deep vs Balanced (sweet spot!)
- ✅ **Self-Optimization Mantra:** "Her güncelleme AsanMod'u daha iyi yapmalı"
- ✅ **Meta-Rule Reference:** MOD & WORKER playbooks başında uyarı
- **ASANMOD-METHODOLOGY:** +246 lines (Self-Optimization Protocol)
- **MOD-PLAYBOOK:** v2.1 (Meta-rule reference added)
- **WORKER-PLAYBOOK:** v2.1 (Meta-rule reference added)
- **Impact:** AsanMod artık kendini optimize edebiliyor, sürekli iyileşiyor

**v15.4 (2025-11-04):** 🔒 **ASANMOD ANTI-FRAUD - INDEPENDENT VERIFICATION**
- ✅ **Rule 8 (Mod): Independent Verification** - Never trust, always verify independently
- ✅ **Rule 8 (Worker): Verifiable Claims** - Make claims Mod can verify
- ✅ **Spot-Check Sampling** - 5 critical metrics per worker (25% sample)
- ✅ **Mathematical Approach** - 4/5 MATCH = 80% confidence threshold
- ✅ **Decision Matrix** - Accept/reject based on match percentage
- ✅ **Ready-to-Use Commands** - Copy-paste verification for all 5 workers
- ✅ **Case Study** - Real example of detecting dishonest worker
- **MOD-PLAYBOOK:** +97 lines (Rule 8 + verification commands)
- **WORKER-PLAYBOOK:** +102 lines (Rule 8 + verifiable claims guide)
- **ASANMOD-METHODOLOGY:** +192 lines (Anti-fraud protocol theory)
- **Impact:** Worker honesty enforced, production quality guaranteed

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
