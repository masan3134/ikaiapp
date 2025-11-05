# 🤖 İKAI HR Platform

**AI-Powered Multi-Tenant SaaS for Recruitment**

**Version:** 17.1 | **Status:** Production Ready ✅

---

## 🚀 Quick Start

```bash
# Start all services (Docker)
docker compose up -d

# Access
Frontend: http://localhost:8103
Backend:  http://localhost:8102

# Login
SUPER_ADMIN: info@gaiai.ai / 23235656
```

**For Claude Sessions:**
```bash
# MOD
cat prompts/PROMPT-MOD-COMPACT.txt

# WORKER
cat prompts/PROMPT-WORKER-COMPACT.txt
```

---

## 📁 Clean Architecture

```
ikai/
├── backend/              # Node.js API (8102)
├── frontend/             # Next.js (8103)
├── docs/                 # Complete documentation
│   ├── INDEX.md          # Master index
│   ├── workflow/         # MOD/WORKER guides
│   ├── features/         # Specs
│   └── reports/          # Test reports
├── prompts/              # Claude start prompts
├── scripts/              # Test helpers
├── CLAUDE.md             # Main guide (10KB)
└── README.md             # This file
```

---

## 📚 Documentation

**Start:** [`docs/INDEX.md`](docs/INDEX.md)

**Key:**
- [`CLAUDE.md`](CLAUDE.md) - Developer guide
- [`prompts/`](prompts/) - Session prompts
- [`docs/CREDENTIALS.md`](docs/CREDENTIALS.md) - All credentials
- [`docs/workflow/`](docs/workflow/) - Playbooks

---

## 🔧 Tech Stack

**Backend:** Node.js, Express, Prisma, PostgreSQL
**Frontend:** Next.js 14, TypeScript, Tailwind
**AI:** Gemini 2.0 Flash, Milvus
**Queue:** BullMQ + Redis
**Storage:** MinIO
**Deploy:** Docker Compose (11 services)

---

## 🎯 Features

✅ Multi-tenant (org isolation)
✅ AI CV analysis (Gemini)
✅ 5-step onboarding
✅ Usage limits (FREE/PRO/ENTERPRISE)
✅ RBAC (5 roles)
✅ Queue system (BullMQ)
✅ AI chat
✅ Notifications
✅ Hot reload

---

## 🔐 Test Accounts

- USER: test-user@test-org-1.com / TestPass123!
- HR: test-hr_specialist@test-org-2.com / TestPass123!
- MANAGER: test-manager@test-org-1.com / TestPass123!
- ADMIN: test-admin@test-org-2.com / TestPass123!
- SUPER_ADMIN: info@gaiai.ai / 23235656

**All credentials:** [`docs/CREDENTIALS.md`](docs/CREDENTIALS.md)

---

## 🐳 Services

| Service | Port | Description |
|---------|------|-------------|
| Frontend | 8103 | Next.js |
| Backend | 8102 | Express API |
| PostgreSQL | 8132 | Database |
| Redis | 8179 | Queue + Cache |
| MinIO | 8101 | Storage Admin |
| Milvus | 8130 | Vector DB |

**Commands:**
```bash
docker compose up -d      # Start
docker compose down       # Stop
docker logs ikai-backend  # Logs
```

---

## 🔄 Development

**Hot Reload:** Active (edit → auto-reload)
**Git Policy:** 1 file = 1 commit (auto-push)
**Identity:** [MOD]/[W1-W6] in commits

---

## 🧪 Testing

**E2E:** [`docs/workflow/tasks/`](docs/workflow/tasks/)
**Scripts:** [`scripts/`](scripts/)
**Reports:** [`docs/reports/`](docs/reports/)

---

## 🌐 Production

**URL:** https://gaiai.ai/ik
**GitHub:** https://github.com/masan3134/ikaiapp (private)

---

## 📊 Stats

**Version:** 17.1
**Files:** 388
**Lines:** 112,571
**Documentation:** 50+ files
**Test Coverage:** E2E comprehensive

---

**For details:** [`docs/INDEX.md`](docs/INDEX.md) | [`CLAUDE.md`](CLAUDE.md)
