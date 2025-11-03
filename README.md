# 🤖 IKAI HR Platform

**Version:** 12.0 - Complete Local Dev Setup
**Updated:** 2025-11-03
**Production:** [https://gaiai.ai/ik](https://gaiai.ai/ik)
**GitHub:** https://github.com/masan3134/ikaiapp (Private)

---

## 📖 Overview

**IKAI HR** is a comprehensive, AI-powered recruitment platform that streamlines the entire hiring process from CV analysis to job offer management. Built with cutting-edge technologies including Google Gemini AI, vector search with Milvus, and production-ready queue systems.

---

## ✨ Key Features

### 🤖 AI-Powered CV Analysis
- **Batch Processing:** Handle up to 50 CVs simultaneously
- **Gemini 2.0 Integration:** Advanced parsing and insights
- **Smart Chunking:** Token-optimized processing (BATCH_SIZE=6)
- **Queue System:** BullMQ with rate limiting (15 RPM safe)
- **Vector Search:** Milvus-powered semantic search

### 🧠 AI Chat Assistant
- **Context-Aware:** Analyzes all candidates in a job posting
- **Hybrid Search:** Base context (40) + semantic search (8)
- **Supports Large Analyses:** 25-50 CVs optimized

### 📝 Complete Recruitment Workflow
- **Interview Wizard:** Google Meet integration
- **Test Management:** AI-generated questions (10 per test)
- **Job Offer System:** Templates, bulk sending, analytics
- **Email Automation:** Queue-based email delivery
- **Analytics Dashboard:** Comprehensive metrics

### 🎯 Advanced Features
- **Wizard System:** Optimized upload (2s for 10 files)
- **Hot Reload:** Docker isolated development
- **Auto-Commit:** Git hooks + VS Code shortcuts
- **MCP Integration:** 6 MCP servers for Claude Code

---

## 🔧 Tech Stack

| Category | Technology |
|----------|------------|
| **Backend** | Node.js 20 + Express + Prisma |
| **Frontend** | Next.js 14 + TypeScript + Tailwind |
| **Database** | PostgreSQL 16 + Redis 7 |
| **AI** | Google Gemini 2.0 Flash |
| **Vector DB** | Milvus 2.3.3 + Etcd |
| **Storage** | MinIO (S3-compatible) |
| **Embeddings** | Ollama (nomic-embed-text) |
| **Queue** | BullMQ + Redis |
| **Email** | Gmail SMTP + Google Meet API |
| **Deployment** | Docker Compose |

---

## 🚀 Quick Start (Docker Isolated)

### Prerequisites
- Docker & Docker Compose
- Git
- 5GB free disk space

### One-Command Setup

```bash
# Clone repository
git clone https://github.com/masan3134/ikaiapp.git
cd ikaiapp

# Start all services (Docker isolated, hot reload enabled)
docker compose up -d

# Access the platform
Frontend: http://localhost:8103
Backend:  http://localhost:8102

# Login
Email: info@gaiai.ai
Password: 23235656
```

**That's it!** All services run in Docker with hot reload. Edit code → Auto-reload!

---

## 📁 Project Structure

```
/home/asan/Desktop/ikai/
├── backend/              # Express API + Prisma ORM
│   ├── src/
│   │   ├── controllers/  # API endpoints
│   │   ├── services/     # Business logic
│   │   ├── queues/       # BullMQ job queues
│   │   ├── workers/      # Background workers
│   │   └── middleware/   # Auth, validation, etc.
│   └── prisma/           # Database schema + migrations
├── frontend/             # Next.js 14 App Router
│   ├── app/              # Routes + pages
│   ├── components/       # React components
│   ├── lib/              # Services + utils + stores
│   └── public/           # Static assets
├── docs/                 # 📚 44 documentation files
│   ├── INDEX.md          # Master documentation index
│   ├── api/              # API documentation
│   ├── features/         # Feature specifications
│   ├── reports/          # Session reports (32 files)
│   └── architecture/     # System design docs
├── scripts/              # Automation scripts
│   └── auto-commit.sh    # Git auto-commit & push
├── .vscode/              # VS Code settings + MCP
├── docker-compose.yml    # Main Docker config
├── CLAUDE.md             # Development guide (compact)
└── AUTO_COMMIT_GUIDE.md  # Git automation guide
```

---

## 🐳 Docker Services

All services run in isolated Docker containers with hot reload:

| Service | Port | Purpose |
|---------|------|---------|
| **Backend** | 8102 | Express API + BullMQ workers |
| **Frontend** | 8103 | Next.js app with hot reload |
| **PostgreSQL** | 8132 | Main database |
| **Redis** | 8179 | Queue + cache |
| **MinIO** | 8100, 8101 | File storage (S3-compatible) |
| **Milvus** | 8130, 8191 | Vector database for AI chat |
| **Ollama** | 8134 | Embedding generation |
| **Etcd** | - | Milvus coordinator |

**Commands:**
```bash
docker compose up -d          # Start all
docker compose down           # Stop all
docker compose logs -f backend   # View backend logs
docker compose logs -f frontend  # View frontend logs
docker ps --filter "name=ikai"   # Check status
```

---

## 🔄 Development Workflow

### Hot Reload (Automatic)
```bash
# Edit any file
vim backend/src/controllers/analysisController.js
vim frontend/app/(authenticated)/dashboard/page.tsx

# → Changes auto-reload in Docker containers!
```

### Git Auto-Commit (3 Ways)

**1. Post-Commit Hook (Automatic)**
```bash
git add .
git commit -m "feat: New feature"
# 🚀 Auto-pushes to GitHub!
```

**2. Script**
```bash
./scripts/auto-commit.sh "Your commit message"
```

**3. VS Code Shortcuts**
- `Ctrl+Shift+S` - Quick save (auto message)
- `Ctrl+Shift+G` - Custom commit message

See [AUTO_COMMIT_GUIDE.md](AUTO_COMMIT_GUIDE.md) for details.

---

## 🔌 MCP Integration

**6 Active MCP Servers** for Claude Code VS Code extension:
- filesystem, git, fetch, memory, time, sequentialthinking

See [CLAUDE.md](CLAUDE.md#mcp-integration) for configuration.

---

## 📊 System Architecture

### Queue System (BullMQ)
- **5 Queues:** analysis, offer, email, test-generation, milvus-sync
- **5 Workers:** Concurrent job processing with rate limiting
- **Monitoring:** Admin dashboard at `/api/v1/queue/health`

### AI Integration
- **Gemini 2.0 Flash:** CV analysis + test generation
- **Rate Limiter:** 15 RPM global protection
- **Batch Processing:** BATCH_SIZE=6 (token-safe)
- **Chunking:** Handles 25-50 CVs efficiently

### Data Flow
```
CV Upload → MinIO Storage → Queue → Gemini Analysis →
PostgreSQL + Milvus → AI Chat Ready → Dashboard
```

---

## 📖 Documentation

**Quick Reference:**
- **CLAUDE.md** - Development guide (compact, ~400 lines)
- **AUTO_COMMIT_GUIDE.md** - Git automation guide
- **docs/INDEX.md** - Master documentation index (44 files)

**Detailed Guides:**
- Queue System: [docs/reports/2025-11-02-queue-system-implementation.md](docs/reports/2025-11-02-queue-system-implementation.md)
- Wizard System: [docs/reports/2025-11-01-analysis-wizard-evaluation.md](docs/reports/2025-11-01-analysis-wizard-evaluation.md)
- AI Chat: [docs/reports/2025-11-02-ai-chat-optimization-for-large-analysis.md](docs/reports/2025-11-02-ai-chat-optimization-for-large-analysis.md)

**Total Documentation:** 15,000+ lines across 44 files

---

## 🔐 Security & Credentials

All credentials are in `.env.local` (see `.env.example` for template).

**Default Admin:**
- Email: `info@gaiai.ai`
- Password: `23235656`

**Environment Variables:**
- Gemini API Key
- Gmail SMTP credentials
- Google OAuth (Calendar/Meet)
- Database connection strings
- MinIO access keys

---

## 🏗️ Development Setup Details

### Initial Setup (One-Time)
```bash
# All services start automatically with docker compose
docker compose up -d

# Check all containers are running
docker ps --filter "name=ikai"

# View logs
docker compose logs -f
```

### Database Migrations (If Needed)
```bash
# Run inside backend container
docker exec -it ikai-backend npx prisma migrate deploy

# Or manually
cd backend
npx prisma migrate deploy
```

### Reset Everything
```bash
# Stop all containers
docker compose down -v

# Restart fresh
docker compose up -d
```

---

## 🧪 Testing

### Backend Health Check
```bash
curl http://localhost:8102/health
```

### Queue Monitoring (Admin Only)
```bash
curl -H "Authorization: Bearer YOUR_JWT" \
  http://localhost:8102/api/v1/queue/health
```

### Frontend Access
```
http://localhost:8103
```

---

## 📈 Performance Benchmarks

- **CV Analysis:** 25 CVs in ~70 seconds (5 batches)
- **Upload Speed:** 10 files in 2 seconds (10x improvement)
- **AI Chat:** 40 base contexts + 100 candidate support
- **Queue Processing:** 3 concurrent jobs (Gemini safe)

---

## 🆘 Troubleshooting

**Backend won't start:**
```bash
docker logs ikai-backend
docker logs ikai-postgres
```

**Frontend build errors:**
```bash
docker logs ikai-frontend
docker exec -it ikai-frontend rm -rf .next
docker compose restart frontend
```

**Queue stuck:**
```bash
docker logs ikai-backend | grep "worker started"
# Should see 5 workers
```

**Database connection issues:**
```bash
docker exec -it ikai-backend npx prisma migrate deploy
```

See [CLAUDE.md#troubleshooting](CLAUDE.md#troubleshooting) for more.

---

## 📋 Version History

### v12.0 (2025-11-03) - Complete Local Dev Setup
- Docker isolated development (all services in containers)
- Git auto-commit system (hook + scripts + VS Code)
- MCP integration for Claude Code extension
- Clean project structure (no nesting)
- Hot reload for backend and frontend
- 388 files, 112,571 lines of code

### v11.0 (2025-11-02) - Queue System Complete
- 5 production-ready queues
- Global Gemini rate limiter
- Email queue system
- Admin monitoring dashboard

### v10.0 (2025-11-02) - Performance Optimizations
- Gemini chunking system
- Wizard 10x upload speed improvement
- Milvus AI chat optimization

See [CLAUDE.md#version-history](CLAUDE.md#version-history) for full history.

---

## 🤝 Contributing

### Git Workflow

This project uses **auto-commit hooks**:

```bash
# Make changes
vim backend/src/...

# Commit (auto-pushes to GitHub)
git add .
git commit -m "feat: Your feature"
# 🚀 Automatically pushed!
```

### Code Style
- ESLint + Prettier configured
- Format on save enabled
- TypeScript strict mode

### Testing
```bash
# Backend tests
cd backend && npm test

# Frontend tests
cd frontend && npm test
```

---

## 📞 Support

- **Documentation:** [docs/INDEX.md](docs/INDEX.md)
- **Issues:** GitHub Issues
- **Email:** info@gaiai.ai

---

## 📄 License

Private project. All rights reserved.

---

**Built with ❤️ using Claude Code + MCP Integration**

**Last Updated:** 2025-11-03
**Status:** ✅ Production Ready
**Deployment:** Docker Isolated Development
