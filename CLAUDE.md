# 🤖 IKAI HR Platform - Development Guide

**Version:** 11.0 - Queue System Optimized + Production Ready
**Updated:** 2025-11-02 (Evening)
**Environment:** Local Development + VPS Production

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
docker compose up -d
cd backend && npm install && npx prisma migrate deploy
cd ../frontend && npm install

# Run (2 terminals)
cd backend && npm run dev    # Port 5000
cd frontend && npm run dev   # Port 3000

# Login: http://localhost:3000
# Email: info@gaiai.ai | Pass: 23235656
```

---

## 🏗️ ARCHITECTURE

```
vps_ikai_workspace/
├── backend/         # Node.js + Express + Prisma
├── frontend/        # Next.js 14 + React + TS
├── docs/            # 📚 44 documentation files
│   ├── INDEX.md     # ← START HERE for details
│   ├── api/         # API docs
│   ├── features/    # Feature specs
│   ├── reports/     # Status reports (32 files)
│   └── architecture/# System design
└── CLAUDE.md        # This file (compact guide)
```

**API:** 110+ endpoints | **Details:** [`docs/api/`](docs/api/)

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

**Running:**
- PostgreSQL (`8132`) | Redis (`8179`) | MinIO (`8100`)
- **Milvus (`8130`)** - AI Chat ready
- **Ollama (`8134`)** - Embeddings

**Check:** `docker ps --filter "name=ikai"`

---

## 🔐 CREDENTIALS

```
Admin: info@gaiai.ai / 23235656
Gmail: info@gaiai.ai / igqt cvao lmea uonj
Gemini: AIzaSyC3G-0JS_iS0SjX5MPS3CA2HxLosYu8Q_0
VPS: root@62.169.25.186 / @78mu2zaqAaVpTpt
DB: postgresql://ikaiuser:ikaipass2025@localhost:8132/ikaidb
```

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
# 1. Code (hot reload active)
nano backend/src/... | nano frontend/app/...

# 2. Git
git add -A && git commit -m "message"

# 3. Test
curl http://localhost:5000/health
docker logs ikai-backend -f
```

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

## ✅ CURRENT STATUS (2025-11-02 Evening)

| Component | Status | Note |
|-----------|--------|------|
| **Backend** | ✅ | 5 queues + 5 workers + rate limiters |
| **Frontend** | ✅ | Wizard optimized, 50 CV limit |
| **Database** | ✅ | PostgreSQL, Milvus collection ready |
| **Gemini** | ✅ | Global rate limiter (15 RPM safe) |
| **Queue System** | ✅ | **NEW: Production-ready queues** |
| **Monitoring** | ✅ | **NEW: Admin queue dashboard** |
| **Email** | ✅ | **FIXED: All emails queued** |
| **Offer Worker** | ✅ | **FIXED: Was missing, now active** |

**Last Test:** 2025-11-02 19:07 - 25 CV analysis → All passed ✅
**Queue Test:** 2025-11-02 21:30 - All workers started ✅

---

## 📋 VERSION HISTORY

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
