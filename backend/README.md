# Backend - IKAI HR Platform

This directory contains the backend for the IKAI HR Platform, a Node.js application built with Express, Prisma, and PostgreSQL.

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or later)
- PostgreSQL
- Redis
- MinIO

It is recommended to run the required services (PostgreSQL, Redis, MinIO) using the Docker Compose setup in the root directory.

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Environment Variables

Create a `.env` file from `.env.example` and provide the necessary configuration for the database, Redis, MinIO, and other services.

### 3. Run Database Migrations

Apply the latest database schema using Prisma Migrate:

```bash
npx prisma migrate deploy
```

### 4. Start the Development Server

```bash
npm run dev
```

The backend server will start on `http://localhost:5000` by default.

## 📂 Project Structure

```
src/
├── controllers/    # Express route handlers
├── errors/         # Custom error classes
├── middleware/     # Express middleware
├── models/         # Data models (if any)
├── routes/         # Express routes
├── services/       # Business logic
├── utils/          # Utility functions
└── index.js        # Application entry point
prisma/
├── schema.prisma   # Prisma schema
└── migrations/     # Database migrations
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
