# Frontend - IKAI HR Platform

**Version:** 12.0
**Updated:** 2025-11-03
**Runtime:** Docker Container (Port 8103)

Next.js 14 frontend with TypeScript, Tailwind CSS, and comprehensive HR recruitment UI.

---

## 🚀 Quick Start (Docker)

**Recommended:** Use Docker Compose from root directory

```bash
# From root: /home/asan/Desktop/ikai
docker compose up -d

# Frontend runs automatically on:
http://localhost:8103

# Hot reload is ACTIVE
# Edit files in frontend/ → Auto-reload in container!
```

**Manual Start (Not Recommended):**
```bash
npm install
npm run dev  # Port 3000
```

**Login:**
- Email: `info@gaiai.ai`
- Password: `23235656`

---

## 🏗️ Architecture

### Technology Stack
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State:** Zustand
- **API Client:** Axios
- **Forms:** React Hook Form
- **UI Components:** Custom + Shadcn-inspired

### Key Features
- Server-side rendering (SSR)
- Client-side navigation
- Protected routes with JWT
- Real-time updates
- Responsive design
- Error boundaries
- Toast notifications

## 📂 Project Structure

The project uses the Next.js 14 App Router.

```
app/
├── (authenticated)/  # Authenticated routes and layout
│   ├── dashboard/
│   ├── offers/
│   └── ...
├── login/            # Login page
├── layout.tsx        # Root layout
└── page.tsx          # Home page
components/
├── ui/               # Reusable UI components (buttons, inputs, etc.)
├── offers/           # Components related to the offer system
└── ...
lib/
├── services/         # API service clients
├── store/            # State management (Zustand)
├── types/            # TypeScript type definitions
└── utils/            # Utility functions
services/             # API service clients (legacy)
```

## ⚙️ Environment Variables

The primary environment variable for the frontend is:

- `NEXT_PUBLIC_API_URL`: The URL of the backend API (e.g., `http://localhost:5000/api/v1`).

## 🛠️ Building for Production

To create a production build, run:

```bash
npm run build
```

This will generate an optimized production build in the `.next` directory.
