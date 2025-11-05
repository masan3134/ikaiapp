# 🔐 IKAI - Central Credentials Repository

**Purpose:** TÜM credentials tek yerde - Kimse hiçbir şey aramasın!
**Updated:** 2025-11-05
**Scope:** Development, Testing, Production

**🚨 CRITICAL:** Bu dosya `.gitignore`'da YOK - Sadece development için!

---

## 🌐 Environment & Ports

**Project Location:**
```
/home/asan/Desktop/ikai
```

**Docker Ports:**
| Service | Port | URL | Status |
|---------|------|-----|--------|
| Frontend | 8103 | http://localhost:8103 | ✅ Running |
| Backend | 8102 | http://localhost:8102 | ✅ Running |
| PostgreSQL | 8132 | localhost:8132 | ✅ Running |
| Redis | 8179 | localhost:8179 | ✅ Running |
| MinIO Console | 8101 | http://localhost:8101 | ✅ Running |
| MinIO API | 8100 | http://localhost:8100 | ✅ Running |
| Milvus | 8130 | localhost:8130 | ✅ Running |
| Attu (Milvus UI) | 8191 | http://localhost:8191 | ✅ Running |
| Ollama | 8134 | http://localhost:8134 | ✅ Running |

---

## 💾 Database Credentials

### PostgreSQL (Development)

**Connection String:**
```
postgresql://ikaiuser:ikaipass2025@localhost:8132/ikaidb
```

**Details:**
- Host: `localhost`
- Port: `8132`
- Database: `ikaidb`
- Username: `ikaiuser`
- Password: `ikaipass2025`

**Docker Connection (from containers):**
```
postgresql://ikaiuser:ikaipass2025@ikai-postgres:5432/ikaidb
```

**Prisma CLI:**
```bash
DATABASE_URL="postgresql://ikaiuser:ikaipass2025@localhost:8132/ikaidb"
```

**Direct psql:**
```bash
psql postgresql://ikaiuser:ikaipass2025@localhost:8132/ikaidb
```

---

## 👤 Test Users (All Organizations)

**Password for ALL test users:** `TestPass123!`

### Organization 1: FREE Plan (test-org-1)

| Email | Role | Name | Organization |
|-------|------|------|--------------|
| test-admin@test-org-1.com | ADMIN | Test Admin 1 | test-org-1 |
| test-manager@test-org-1.com | MANAGER | Test Manager 1 | test-org-1 |
| test-hr_specialist@test-org-1.com | HR_SPECIALIST | Test HR 1 | test-org-1 |
| test-user@test-org-1.com | USER | Test User 1 | test-org-1 |

### Organization 2: PRO Plan (test-org-2)

| Email | Role | Name | Organization |
|-------|------|------|--------------|
| test-admin@test-org-2.com | ADMIN | Test Admin 2 | test-org-2 |
| test-manager@test-org-2.com | MANAGER | Test Manager 2 | test-org-2 |
| test-hr_specialist@test-org-2.com | HR_SPECIALIST | Test HR 2 | test-org-2 |
| test-user@test-org-2.com | USER | Test User 2 | test-org-2 |

### Organization 3: ENTERPRISE Plan (test-org-3)

| Email | Role | Name | Organization |
|-------|------|------|--------------|
| test-admin@test-org-3.com | ADMIN | Test Admin 3 | test-org-3 |
| test-manager@test-org-3.com | MANAGER | Test Manager 3 | test-org-3 |
| test-hr_specialist@test-org-3.com | HR_SPECIALIST | Test HR 3 | test-org-3 |
| test-user@test-org-3.com | USER | Test User 3 | test-org-3 |

### SUPER_ADMIN (System-wide)

| Email | Role | Password | Name |
|-------|------|----------|------|
| info@gaiai.ai | SUPER_ADMIN | 23235656 | Mustafa Asan |

**Note:** SUPER_ADMIN is NOT multi-tenant - has access to entire system!

---

## 🔑 API Keys & Secrets

### Gemini AI (Google)

**API Key:**
```
AIzaSyAT-KFuJ_GWaotsep3xtETJex8-gMEAc4g
```

**Model:**
- Primary: `gemini-2.0-flash-exp`
- Fallback: `gemini-1.5-flash`

**Usage:**
- CV Analysis
- AI Chat
- Error Solutions (via Gemini Search MCP)

**Test Command:**
```bash
curl -s -X POST "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=AIzaSyAT-KFuJ_GWaotsep3xtETJex8-gMEAc4g" \
  -H "Content-Type: application/json" \
  -d '{"contents":[{"parts":[{"text":"Hello, Gemini!"}]}]}'
```

---

### Gmail SMTP (Email Sending)

**Configuration:**
```
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-16-char-app-password
```

**Setup:**
1. Go to Google Account → Security
2. Enable 2-Step Verification
3. App Passwords → Generate for "Mail"
4. Use 16-character password in `.env.local`

---

### MinIO (S3-compatible Storage)

**Console Access:**
- URL: http://localhost:8101
- Username: `minioadmin`
- Password: `minioadmin`

**S3 API:**
- Endpoint: http://localhost:8100
- Access Key: `minioadmin`
- Secret Key: `minioadmin`

**Buckets:**
- `ikai-uploads` - User uploaded files
- `ikai-cvs` - CV documents
- `ikai-exports` - Export files

---

### Redis

**Connection:**
```
redis://localhost:8179
```

**No password required (development)**

**Usage:**
- Session storage
- Queue management (BullMQ)
- Cache

---

### Milvus (Vector Database)

**Connection:**
```
host: localhost
port: 8130
```

**Attu UI:**
- URL: http://localhost:8191
- No authentication required

**Collections:**
- `ikai_knowledge_base` - AI chat vectors

---

## 🐳 Docker Compose Commands

**Start all services:**
```bash
cd /home/asan/Desktop/ikai
docker compose up -d
```

**Stop all services:**
```bash
docker compose down
```

**View logs:**
```bash
docker compose logs -f backend
docker compose logs -f frontend
```

**Restart specific service:**
```bash
docker compose restart backend
docker compose restart frontend
```

**Check status:**
```bash
docker compose ps
```

---

## 🌍 Environment Variables (.env.local)

**Location:** `/home/asan/Desktop/ikai/backend/.env.local`

**Full Template:**
```bash
# Database
DATABASE_URL="postgresql://ikaiuser:ikaipass2025@ikai-postgres:5432/ikaidb"

# Redis
REDIS_URL="redis://ikai-redis:6379"

# MinIO (S3)
S3_ENDPOINT="http://ikai-minio:9000"
S3_ACCESS_KEY="minioadmin"
S3_SECRET_KEY="minioadmin"
S3_BUCKET="ikai-uploads"

# Gemini AI
GEMINI_API_KEY="AIzaSyAT-KFuJ_GWaotsep3xtETJex8-gMEAc4g"

# Gmail SMTP
GMAIL_USER="your-email@gmail.com"
GMAIL_APP_PASSWORD="your-16-char-app-password"

# Milvus Vector DB
MILVUS_ADDRESS="ikai-milvus:19530"

# Session Secret
SESSION_SECRET="your-random-secret-key-here"

# Node Environment
NODE_ENV="development"

# Port
PORT=3000
```

**Frontend .env.local:** `/home/asan/Desktop/ikai/frontend/.env.local`
```bash
NEXT_PUBLIC_API_URL="http://localhost:8102"
```

---

## 🧪 Testing Credentials

### Python Test Helper

**Location:** `/home/asan/Desktop/ikai/scripts/test-helper.py`

**Usage:**
```python
from test_helper import IKAITestHelper, TEST_USERS

helper = IKAITestHelper()
helper.login("test-admin@test-org-1.com", "TestPass123!")
response = helper.get("/api/v1/job-postings")
```

**Available Test Users (in script):**
```python
TEST_USERS = {
    "super_admin": {"email": "info@gaiai.ai", "password": "23235656"},
    "admin": {"email": "test-admin@test-org-1.com", "password": "TestPass123!"},
    "manager": {"email": "test-manager@test-org-1.com", "password": "TestPass123!"},
    "hr_specialist": {"email": "test-hr_specialist@test-org-1.com", "password": "TestPass123!"},
    "user": {"email": "test-user@test-org-1.com", "password": "TestPass123!"}
}
```

---

## 🌐 VPS Production (gaiai.ai)

**Server:**
```
IP: 62.169.25.186
User: root
SSH: ssh root@62.169.25.186
```

**Location:**
```
/var/www/ik
```

**URL:**
```
https://gaiai.ai/ik
```

**Deploy Command:**
```bash
rsync -avz --exclude 'node_modules' . root@62.169.25.186:/var/www/ik/
ssh root@62.169.25.186 "cd /var/www/ik && docker compose -f docker-compose.server.yml restart backend frontend"
```

---

## 📋 Quick Reference Card

**Copy-Paste Ready Commands:**

### Login as SUPER_ADMIN
```bash
Email: info@gaiai.ai
Password: 23235656
```

### Login as Test ADMIN (Org 1)
```bash
Email: test-admin@test-org-1.com
Password: TestPass123!
```

### Login as Test HR_SPECIALIST (Org 2)
```bash
Email: test-hr_specialist@test-org-2.com
Password: TestPass123!
```

### Database Query (psql)
```bash
psql postgresql://ikaiuser:ikaipass2025@localhost:8132/ikaidb -c "SELECT COUNT(*) FROM users;"
```

### Check Docker Services
```bash
docker compose ps
```

### Get Backend Logs
```bash
docker compose logs -f backend | tail -50
```

### Test Gemini API
```bash
curl -s -X POST "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=AIzaSyAT-KFuJ_GWaotsep3xtETJex8-gMEAc4g" \
  -H "Content-Type: application/json" \
  -d '{"contents":[{"parts":[{"text":"Test"}]}]}' | jq .
```

---

## 🔒 Security Notes

**Development Only:**
- These credentials are for LOCAL DEVELOPMENT
- NEVER commit `.env.local` to git
- Production uses different credentials
- Test users are PUBLIC (safe to share in dev)

**Production:**
- Use environment-specific secrets
- Rotate API keys regularly
- Use strong passwords
- Enable 2FA where possible

---

## 📊 Credential Usage Matrix

| Credential | Used By | Purpose | Location |
|------------|---------|---------|----------|
| PostgreSQL | Backend, Scripts | Database | .env.local |
| Test Users | Frontend, Scripts | Testing | Database |
| Gemini API | Backend | AI features | .env.local |
| Gmail SMTP | Backend | Email sending | .env.local |
| MinIO | Backend | File storage | .env.local |
| Redis | Backend | Queue/Cache | .env.local |
| Milvus | Backend | Vector search | .env.local |

---

## 🚀 Quick Start Checklist

**New Developer Setup:**
1. ✅ Clone repo: `git clone https://github.com/masan3134/ikaiapp.git`
2. ✅ Copy this file: `docs/CREDENTIALS.md`
3. ✅ Create `.env.local` (backend & frontend) - use templates above
4. ✅ Start Docker: `docker compose up -d`
5. ✅ Test login: `info@gaiai.ai / 23235656`
6. ✅ Test API: `curl http://localhost:8102/health`

**Ready to develop! 🎉**

---

**Last Updated:** 2025-11-05
**Maintainer:** Mustafa Asan (info@gaiai.ai)
**Status:** ✅ All credentials tested and working
