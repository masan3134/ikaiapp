# Backend - IKAI HR Platform

**Version:** 12.0
**Updated:** 2025-11-03
**Runtime:** Docker Container (Port 8102)

Node.js backend for IKAI HR Platform with Express, Prisma, BullMQ queues, and AI integration.

---

## 🚀 Quick Start (Docker)

**Recommended:** Use Docker Compose from root directory

```bash
# From root: /home/asan/Desktop/ikai
docker compose up -d

# Backend runs automatically on:
http://localhost:8102

# Hot reload is ACTIVE
# Edit files in backend/src/ → Auto-reload in container!
```

**Manual Start (Not Recommended):**
```bash
npm install
npx prisma migrate deploy
npm run dev  # Port 3001
```

---

## 🏗️ Architecture

### Technology Stack
- **Runtime:** Node.js 20
- **Framework:** Express.js
- **ORM:** Prisma
- **Database:** PostgreSQL 16
- **Cache:** Redis 7
- **Queue:** BullMQ
- **Storage:** MinIO (S3-compatible)
- **AI:** Google Gemini 2.0 Flash
- **Vector DB:** Milvus 2.3.3
- **Embeddings:** Ollama

## 📂 Project Structure

```
backend/
├── src/
│   ├── controllers/    # 20+ API controllers
│   ├── services/       # 25+ business logic services
│   ├── queues/         # 5 BullMQ queue definitions
│   ├── workers/        # 5 background workers
│   ├── routes/         # 20+ API route modules
│   ├── middleware/     # Auth, validation, rate limiting
│   ├── utils/          # Helpers, loggers, rate limiters
│   ├── templates/      # Email templates
│   ├── errors/         # Custom error classes
│   └── index.js        # Main entry point
├── prisma/
│   ├── schema.prisma   # Database schema (20+ models)
│   └── migrations/     # 20+ migration files
├── scripts/            # Utility scripts
├── error-logs/         # Error log files (JSONL)
├── package.json        # Dependencies
├── Dockerfile          # Docker build config
└── .env                # Environment variables
```

## 🌐 API Endpoints

The API is versioned under `/api/v1`. Below is a summary of the main resource endpoints. For a complete list, please refer to the route definitions in `src/routes/`.

- **Auth:** `/api/v1/auth`
- **Users:** `/api/v1/users`
- **Candidates:** `/api/v1/candidates`
- **Job Postings:** `/api/v1/job-postings`
- **Analyses:** `/api/v1/analyses`
- **Interviews:** `/api/v1/interviews`
- **Offers:** `/api/v1/offers`
- **Offer Templates:** `/api/v1/offer-templates`
- **Attachments:** `/api/v1/attachments`
- **Negotiations:** `/api/v1/negotiations`
- **Revisions:** `/api/v1/revisions`

## ⚙️ Environment Variables

The following are some of the key environment variables required for the backend to run. Please refer to `.env.example` for a complete list.

- `DATABASE_URL`: PostgreSQL connection string.
- `REDIS_URL`: Redis connection string.
- `MINIO_ENDPOINT`, `MINIO_PORT`, `MINIO_ACCESS_KEY`, `MINIO_SECRET_KEY`: MinIO configuration.
- `JWT_SECRET`: Secret key for JWT signing.
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REDIRECT_URI`: Google API credentials.
- `GEMINI_API_KEY`: Google Gemini API key.

## 🧪 Running Tests

To run the test suite, use the following command:

```bash
npm test
```

Make sure you have a separate test database configured and the relevant environment variables are set.
