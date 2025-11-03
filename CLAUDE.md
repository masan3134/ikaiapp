# 🤖 IKAI HR Platform - Development Guide

**Version:** 12.0 - Complete Local Dev Setup + Auto-Commit
**Updated:** 2025-11-03
**Environment:** Docker Isolated Development (Hot Reload Enabled)

> **📚 FULL DOCUMENTATION:** [`docs/INDEX.md`](docs/INDEX.md) - 44 detailed documents
> **📝 LATEST CHANGES:** [`docs/reports/2025-11-02-session-summary.md`](docs/reports/2025-11-02-session-summary.md)

---

## 🎯 5N METHODOLOGY (MANDATORY)

**BEFORE every task:**
1. **NE:** What? | 2. **NEREDE:** Where? | 3. **NE LAZIM:** What's needed?
4. **NEDEN:** Why? | 5. **NASIL:** How?

**Working Style:** Parallel execution, TodoWrite always, brief responses

---

## ⚠️ STRICT RULES

**Rule 1: NEVER GIVE UP** - 3 errors → Ask Gemini (curl below)
**Rule 2: VALIDATE FIRST** - Check paths, test, then execute
**Rule 3: GEMINI ASSISTANT** - Get suggestion → Validate → Apply
**Rule 4: HOT RELOAD ON** - Backend (nodemon), Frontend (Next.js dev)
**Rule 5: NO ROOT FILES** - Use `docs/` for documentation

**Gemini Helper:**
```bash
curl -s -X POST "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=AIzaSyC3G-0JS_iS0SjX5MPS3CA2HxLosYu8Q_0" \
  -H "Content-Type: application/json" \
  -d '{"contents":[{"parts":[{"text":"IKAI error: [ERROR]. Solution?"}]}]}'
```

---

## 🚀 QUICK START

```bash
# Location: /home/asan/Desktop/ikai

# Start ALL services (Docker isolated)
docker compose up -d

# Access
Frontend: http://localhost:8103
Backend:  http://localhost:8102
Login:    info@gaiai.ai / 23235656

# Hot reload is AUTOMATIC (no manual npm run dev needed!)
# Edit files → Auto reload in Docker containers
```

**Services Running in Docker:**
- Backend (Port 8102) - Express API with nodemon
- Frontend (Port 8103) - Next.js with hot reload
- PostgreSQL (8132) | Redis (8179) | MinIO (8100, 8101)
- Milvus (8130, 8191) | Ollama (8134) | Etcd

---

## 🏗️ ARCHITECTURE

```
/home/asan/Desktop/ikai/
├── backend/              # Node.js + Express + Prisma
├── frontend/             # Next.js 14 + TypeScript
├── docker/               # Docker configs
├── docs/                 # 📚 44 documentation files
│   ├── INDEX.md          # ← START HERE
│   ├── api/              # API docs
│   ├── features/         # Feature specs
│   ├── reports/          # Status reports
│   └── architecture/     # System design
├── scripts/              # Utility scripts
│   └── auto-commit.sh    # Auto git commit & push
├── .vscode/              # VS Code + MCP configs
├── _archive/             # Backup files (gitignored)
├── CLAUDE.md             # This file (compact guide)
├── AUTO_COMMIT_GUIDE.md  # Git automation guide
└── docker-compose.yml    # Main Docker config
```

**API:** 110+ endpoints | **Docker:** All services isolated

---

## 🤖 AI FEATURES (Gemini)

**Key:** AIzaSyC3G-0JS_iS0SjX5MPS3CA2HxLosYu8Q_0 | **Model:** gemini-2.0-flash

### **CV Analysis with Chunking** 🔥
- **BATCH_SIZE:** 6 (formula: `8192 * 0.8 / 1000`)
- **Capacity:** Up to 50 CVs
- **Examples:** 25 CVs → 5 batches (~70s) | 50 CVs → 9 batches (~120s)
- **Status:** ✅ Production tested (25 CVs successful)
- **Docs:** [`chunking-implementation.md`](docs/reports/2025-11-02-chunking-implementation.md)

### **AI Chat (Milvus)** 🧠
- **Collection:** `analysis_chat_contexts` (created)
- **Limits:** 40 base, 100 all candidates, 8 semantic
- **Supports:** 25-50 CV analyses
- **Docs:** [`ai-chat-optimization.md`](docs/reports/2025-11-02-ai-chat-optimization-for-large-analysis.md)

### **Other:**
- Test generation (10 AI questions)
- Feedback generation
- Offer content analysis

---

## 🧙 WIZARD SYSTEM (v2.0 - Optimized)

**Latest:** 2025-11-02 - 9 improvements

### **Performance:**
- Upload: **2s** (10 files) - **10x faster** ⚡
- CV Limit: **50** (was 10)
- State: Persistent (localStorage)
- Errors: Turkish (40+ translations)

### **Features:**
- Error Boundary | Parallel upload | Progress bar | Smart defaults

**Full Analysis:** [`wizard-evaluation.md`](docs/reports/2025-11-01-analysis-wizard-evaluation.md) (625 lines)
**Implementation:** [`wizard-improvements.md`](docs/reports/2025-11-01-wizard-improvements-summary.md)

---

## 🐳 DOCKER SERVICES

**All Services Isolated in Docker (Hot Reload Enabled):**
- **Backend** (`8102`) - Express + Prisma + BullMQ workers
- **Frontend** (`8103`) - Next.js 14 with hot reload
- **PostgreSQL** (`8132`) - Main database
- **Redis** (`8179`) - Queue + cache
- **MinIO** (`8100`, `8101`) - File storage
- **Milvus** (`8130`, `8191`) - Vector DB for AI chat
- **Ollama** (`8134`) - Embedding generation
- **Etcd** - Milvus coordinator

**Commands:**
```bash
docker compose up -d                    # Start all
docker compose down                     # Stop all
docker ps --filter "name=ikai"          # Check status
docker compose logs -f backend          # Backend logs
docker compose logs -f frontend         # Frontend logs
```

---

## 🔐 CREDENTIALS

**See:** `.env.local` for all credentials (gitignored but checked in as example)

```
Admin: info@gaiai.ai / 23235656
DB: postgresql://ikaiuser:ikaipass2025@localhost:8132/ikaidb
GitHub: https://github.com/masan3134/ikaiapp (private)
```

**Other credentials:** Gemini API, Gmail SMTP, VPS SSH, Google OAuth → `.env.local`

---

## 🔌 MCP INTEGRATION (VS Code Claude Extension)

**6 Active MCP Servers:**
- **filesystem** - File operations
- **git** - Git management
- **fetch** - Web content fetching
- **memory** - Persistent memory
- **time** - Time operations
- **sequentialthinking** - Step-by-step reasoning

**Config:** `~/.config/Code/User/settings.json`
**Servers:** `~/mcp-servers/mcp-official/`

**Usage:** MCPs work automatically when Claude Code extension needs them.

---

## 🔄 GIT AUTO-COMMIT SYSTEM

**3 Ways to Auto-Commit & Push:**

### 1. Post-Commit Hook (Automatic)
```bash
git add .
git commit -m "feat: New feature"
# 🚀 Auto-pushes to GitHub!
```

### 2. Script
```bash
./scripts/auto-commit.sh "Your message"
```

### 3. VS Code Shortcuts
- **Ctrl+Shift+S** - Quick save (auto message)
- **Ctrl+Shift+G** - Custom message

**Features:**
- Auto-push after every commit
- Colored terminal output
- Error handling
- No push if no changes

**Guide:** [`AUTO_COMMIT_GUIDE.md`](AUTO_COMMIT_GUIDE.md)

---

## 🆘 TROUBLESHOOTING

**Backend won't start:** `docker logs ikai-postgres` + `npx prisma migrate deploy`
**🔥 Queue stuck:** Check workers: `docker logs ikai-backend | grep "worker started"`
**🔥 Gemini rate limit:** Check: `GET /api/v1/queue/health` (admin only)
**🔥 Offer emails not sending:** Check offer worker logs (was missing, now fixed!)
**Gemini 25+ CV error:** Check BATCH_SIZE=6 → [`chunking-implementation.md`](docs/reports/2025-11-02-chunking-implementation.md)
**AI Chat broken:** Check Milvus collection → [`milvus-ai-chat-setup.md`](docs/reports/2025-11-02-milvus-ai-chat-setup-complete.md)
**Wizard slow upload:** Check parallel upload → [`wizard-improvements.md`](docs/reports/2025-11-01-wizard-improvements-summary.md)

**🔥 NEW: Queue Monitoring:**
```bash
# Admin only - get queue stats
curl -H "Authorization: Bearer $JWT" http://localhost:5000/api/v1/queue/health
```

---

## 🔄 WORKFLOW

```bash
# 1. Code (hot reload active in Docker)
# Edit: backend/src/... or frontend/app/...
# → Changes auto-reload in containers!

# 2. Git Auto-Commit (3 ways)
./scripts/auto-commit.sh "feat: New feature"  # Script
git commit -m "message"                        # Hook auto-pushes
# OR in VS Code: Ctrl+Shift+S                 # Keyboard shortcut

# 3. Test
curl http://localhost:8102/health              # Backend health
docker logs ikai-backend -f                    # Backend logs
docker logs ikai-frontend -f                   # Frontend logs
```

**🎯 Git Auto-Commit System:**
- **Post-Commit Hook:** Auto-push after every commit
- **Script:** `./scripts/auto-commit.sh`
- **VS Code Tasks:** Ctrl+Shift+S (quick) | Ctrl+Shift+G (custom message)
- **Guide:** [`AUTO_COMMIT_GUIDE.md`](AUTO_COMMIT_GUIDE.md)

---

## ☁️ VPS DEPLOY

```bash
rsync -avz --exclude 'node_modules' . root@62.169.25.186:/var/www/ik/
ssh root@62.169.25.186 "cd /var/www/ik && docker compose -f docker-compose.server.yml restart backend frontend"
```

**URL:** https://gaiai.ai/ik

---

## 🎯 CRITICAL CONFIGS

### **🔥 Queue Workers (NEW!):**
```javascript
// analysisWorker.js
concurrency: 3          // DOWN from 10 (Gemini protection!)
limiter: { max: 5, duration: 60000 }

// offerWorker.js (FIXED: Was missing!)
concurrency: 2
limiter: { max: 50, duration: 60000 }

// emailWorker.js (NEW!)
concurrency: 5
limiter: { max: 100, duration: 60000 }

// testGenerationWorker.js (NEW!)
concurrency: 2
limiter: { max: 10, duration: 60000 }
```

### **🛡️ Gemini Rate Limiter (NEW!):**
```javascript
// utils/geminiRateLimiter.js
maxRequests: 15         // RPM limit (free tier)
windowMs: 60000         // 1 minute window
// Protects all Gemini API calls globally!
```

### **Gemini Batch (geminiDirectService.js):**
```javascript
BATCH_SIZE = 6          // Token-safe limit
BATCH_DELAY_MS = 2000   // Rate limiting
maxOutputTokens = 8192
```

### **Wizard (wizardStore.ts):**
```typescript
MAX_CV_LIMIT = 50        // Upload capacity
persist: localStorage    // State recovery
```

### **AI Chat (analysisChatService.js):**
```javascript
baseChunks.limit = 40    // Context coverage
allCandidates.limit = 100 // List all support
semanticSearch.limit = 8  // Specific queries
```

---

## 📖 DOCUMENTATION PHILOSOPHY

**This File:** Quick reference (~280 lines)
**`docs/` Folder:** Deep dive (45 files, 15,000+ lines)

### **Quick Navigation:**
- **Everything:** [`docs/INDEX.md`](docs/INDEX.md)
- **🔥 Queue System:** [`queue-system-implementation.md`](docs/reports/2025-11-02-queue-system-implementation.md) **(NEW!)**
- **Latest:** [`session-summary.md`](docs/reports/2025-11-02-session-summary.md)
- **Wizard:** [`wizard-evaluation.md`](docs/reports/2025-11-01-analysis-wizard-evaluation.md)
- **Gemini:** [`chunking-implementation.md`](docs/reports/2025-11-02-chunking-implementation.md)
- **AI Chat:** [`ai-chat-optimization.md`](docs/reports/2025-11-02-ai-chat-optimization-for-large-analysis.md)
- **Milvus:** [`milvus-hybrid-solution.md`](docs/reports/2025-11-02-milvus-hybrid-analysis-solution.md)

---

## ✅ CURRENT STATUS (2025-11-03)

| Component | Status | Note |
|-----------|--------|------|
| **Docker Setup** | ✅ | All services isolated, hot reload active |
| **Backend** | ✅ | Running on port 8102 (Docker) |
| **Frontend** | ✅ | Running on port 8103 (Docker) |
| **Database** | ✅ | PostgreSQL + Milvus + Redis ready |
| **Queue System** | ✅ | 5 queues + 5 workers operational |
| **Git Auto-Commit** | ✅ | **NEW: Post-commit hook + scripts** |
| **GitHub Repo** | ✅ | **NEW: Clean repo with full project** |
| **MCP Integration** | ✅ | **NEW: 6 MCPs in VS Code extension** |
| **Project Structure** | ✅ | **NEW: Clean directory (no nesting)** |

**Setup Date:** 2025-11-03
**Location:** /home/asan/Desktop/ikai
**GitHub:** https://github.com/masan3134/ikaiapp (private)

---

## 📋 VERSION HISTORY

**v12.0 (2025-11-03):** 🎉 **COMPLETE LOCAL DEV SETUP**
- **NEW:** Docker isolated development (all services in containers)
- **NEW:** Git auto-commit system (post-commit hook + scripts)
- **NEW:** VS Code MCP integration (6 servers active)
- **NEW:** Clean GitHub repo (full project uploaded)
- **FIXED:** Project structure (removed vps_ikai_workspace nesting)
- **FIXED:** Port configurations for Docker isolation
- Hot reload active for both backend and frontend
- All 388 files committed (112,571 lines of code)

**v11.0 (2025-11-02 Evening):** 🚀 **QUEUE SYSTEM COMPLETE**
- **FIXED:** Offer worker (was missing!)
- Analysis worker concurrency: 10 → 3 (Gemini safe)
- 5 queues + 5 workers operational
- Global Gemini rate limiter (15 RPM protection)
- Email queue system (Gmail safe)
- Test generation queue (async AI)
- Admin monitoring dashboard
- **See:** [`queue-system-implementation.md`](docs/reports/2025-11-02-queue-system-implementation.md) **(47KB guide)**

**v10.0 (2025-11-02 Morning):**
- Gemini chunking (BATCH_SIZE=6)
- Wizard: 9 optimizations (10x upload speed)
- AI Chat: Milvus setup + limits optimized
- **See:** [`session-summary.md`](docs/reports/2025-11-02-session-summary.md)

**v9.0 (2025-10-31):**
- Offer system stable
- UI fixes (color, types)
- **See:** `docs/reports/2025-10-31-*.md`

---

## 🔍 HOW TO USE

**New developer?**
1. Read this file (overview)
2. Open [`docs/INDEX.md`](docs/INDEX.md) (navigation)
3. Check [`session-summary.md`](docs/reports/2025-11-02-session-summary.md) (latest)

**Need specific info?**
- Search keyword in [`docs/INDEX.md`](docs/INDEX.md)
- Or: `grep -r "keyword" docs/ --include="*.md"`

**Troubleshooting?**
- Check "TROUBLESHOOTING" section above
- Search in `docs/reports/` for related issues

---

**🎯 Compact Guide + Detailed References = Best of Both Worlds**

**This file: 200 lines | Full docs: 10,000+ lines | You choose depth!**
