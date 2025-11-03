# Frontend - IKAI HR Platform

This directory contains the frontend for the IKAI HR Platform, a Next.js 14 application built with React, TypeScript, and Tailwind CSS.

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or later)
- `pnpm` (or `npm`/`yarn`)

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Environment Variables

Create a `.env.local` file from the example in the root directory and provide the necessary configuration, primarily the backend API URL.

### 3. Start the Development Server

```bash
npm run dev
```

The frontend application will be accessible at `http://localhost:3000`.

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
