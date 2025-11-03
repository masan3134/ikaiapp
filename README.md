# IKAI HR Platform

**Version:** 9.0
**Production:** [https://gaiai.ai/ik](https://gaiai.ai/ik)

---

**IKAI HR** is a comprehensive, AI-powered recruitment platform designed to streamline the entire hiring process, from candidate sourcing to job offer management. It leverages Google Gemini for advanced CV analysis and provides a rich feature set for HR professionals.

## ✨ Key Features

- **🤖 AI-Powered CV Analysis:** Automatically parses and analyzes resumes using Google Gemini, extracting key information and providing insights.
- **🗓️ Interview Wizard:** Simplifies interview scheduling with Google Meet integration.
- **📝 Test Management:** Allows for the creation, distribution, and management of candidate assessments.
- **📄 Job Offer System:** A complete end-to-end offer management system:
    - **Template & Category Management:** Create and organize reusable offer templates.
    - **PDF Generation & Emailing:** Automatically generate and send professional offer letters.
    - **Public Acceptance Page:** Provides a simple, public link for candidates to accept or reject offers.
    - **Bulk Sending & Analytics:** Send offers in bulk and track key metrics.
    - **Version History & Negotiations:** Manages offer revisions and candidate negotiations.
- **👥 Candidate Management:** A centralized database for all candidate information.
- **📊 Analytics Dashboard:** Provides a comprehensive overview of recruitment metrics.
- **📧 Email Notifications:** Keeps both the hiring team and candidates informed throughout the process.

## 🔧 Tech Stack

| Category      | Technology                                       |
|---------------|--------------------------------------------------|
| **Backend**   | Node.js, Express, Prisma, PostgreSQL             |
| **Frontend**  | Next.js 14, React, TypeScript, Tailwind CSS      |
| **AI**        | Google Gemini API                                |
| **Storage**   | MinIO (S3-compatible)                            |
| **Cache**     | Redis                                            |
| **Email**     | Gmail SMTP + Google Meet API                     |
| **Deployment**| Docker                                           |

## 🚀 Getting Started

### Prerequisites

- Docker and Docker Compose
- Node.js (v18 or later)
- `pnpm` (or `npm`/`yarn`)

### 1. Clone the Repository

```bash
git clone https://github.com/masan3134/ikaiapp.git
cd ikaiapp
```

### 2. Setup Environment Variables

Create `.env.local` from `.env.example` and fill in the required values for the database, storage, and other services.

### 3. Launch Services

Start the required services (PostgreSQL, Redis, MinIO) using Docker Compose:

```bash
docker-compose up -d
```

### 4. Backend Setup

Navigate to the backend directory, install dependencies, and run database migrations:

```bash
cd backend
npm install
npx prisma migrate deploy
npm run dev
```

The backend server will be running on `http://localhost:5000`.

### 5. Frontend Setup

In a separate terminal, navigate to the frontend directory, install dependencies, and start the development server:

```bash
cd frontend
npm install
npm run dev
```

The frontend application will be accessible at `http://localhost:3000`.

### 6. Default Login

- **Username:** `info@gaiai.ai`
- **Password:** `23235656`

## 📂 Project Structure

```
.
├── backend/        # Node.js/Express Backend
│   ├── prisma/     # Prisma schema and migrations
│   └── src/        # Source code
├── frontend/       # Next.js Frontend
│   ├── app/        # Next.js 14 app router
│   ├── components/ # React components
│   └── services/   # API service clients
├── docker/         # Docker configurations
└── docs/           # Project documentation
```

## 📖 Detailed Documentation

For more in-depth information, please refer to the documents in the `docs` directory:

- **`docs/CLAUDE.md`**: Complete development guide.
- **`docs/SETUP.md`**: Detailed setup instructions.
- **`docs/VPS_DEPLOY.md`**: Guide for deploying to a VPS.

## 🤝 Contributing

Contributions are welcome! Please follow the standard Git workflow:

1.  Create a new branch for your feature or bug fix.
2.  Make your changes.
3.  Commit your changes with a descriptive commit message.
4.  Push your branch and create a pull request.

### Git Aliases

For convenience, you can use the following aliases:

- `git ac`: Auto-commit all changes with a default message.
- `git st`: Show the current git status.
- `git lg`: Display the last 10 commits in a compact format.