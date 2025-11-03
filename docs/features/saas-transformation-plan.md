# IKAI SaaS Transformation - Complete Implementation Plan

**Version:** 1.0
**Created:** 2025-11-03
**Estimated Duration:** 14-20 hours (2-3 days)
**Status:** Planning Phase

---

## 🎯 Executive Summary

Transform IKAI from single-tenant HR platform to **multi-tenant SaaS** with:
- Organization isolation (B2B ready)
- Seamless onboarding experience
- Usage-based pricing tiers
- Admin control panel
- Marketing landing page

**Business Value:** Production-ready SaaS in 2-3 days!

---

## 📋 Implementation Phases

### **PHASE 1: Multi-Tenant Architecture** 🔴 CRITICAL
**Duration:** 4-6 hours
**Priority:** P0 (Must have)
**Dependencies:** None

### **PHASE 2: Onboarding Wizard** 🟠 HIGH
**Duration:** 3-4 hours
**Priority:** P1 (Should have)
**Dependencies:** Phase 1

### **PHASE 3: Usage Limits & Plans** 🟠 HIGH
**Duration:** 2-3 hours
**Priority:** P1 (Should have)
**Dependencies:** Phase 1

### **PHASE 4: Super Admin Dashboard** 🟡 MEDIUM
**Duration:** 2-3 hours
**Priority:** P2 (Nice to have)
**Dependencies:** Phase 1

### **PHASE 5: Public Landing Page** 🟡 MEDIUM
**Duration:** 3-4 hours
**Priority:** P2 (Nice to have)
**Dependencies:** None (parallel)

---

## 🏗️ PHASE 1: Multi-Tenant Architecture

### **1.1 Database Schema Changes**

#### **New Table: Organization**
```prisma
model Organization {
  id          String   @id @default(uuid())

  // Company Info
  name        String
  slug        String   @unique  // URL-friendly identifier
  domain      String?  @unique  // Custom domain (future: acme.ikaihr.com)

  // Branding
  logo        String?
  primaryColor String? @default("#3B82F6")

  // Settings
  industry    String?  // "Technology", "Healthcare", etc.
  size        String?  // "1-10", "11-50", "51-200", etc.
  country     String?  @default("TR")
  timezone    String?  @default("Europe/Istanbul")

  // Subscription (Phase 3)
  plan        SubscriptionPlan @default(FREE)
  planStartedAt DateTime       @default(now())
  planExpiresAt DateTime?

  // Usage Tracking (Phase 3)
  monthlyAnalysisCount Int @default(0)
  monthlyCvCount       Int @default(0)
  totalUsers           Int @default(1)

  // Limits (based on plan)
  maxAnalysisPerMonth  Int @default(10)
  maxCvPerMonth        Int @default(50)
  maxUsers             Int @default(2)

  // Onboarding (Phase 2)
  onboardingCompleted Boolean @default(false)
  onboardingStep      Int     @default(0)

  // Status
  isActive    Boolean  @default(true)
  isTrial     Boolean  @default(true)
  trialEndsAt DateTime?

  // Relations
  users       User[]

  // Metadata
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([slug])
  @@index([isActive])
  @@index([plan])
  @@map("organizations")
}

enum SubscriptionPlan {
  FREE
  PRO
  ENTERPRISE
}
```

#### **Modified Table: User**
```prisma
model User {
  id             String   @id @default(uuid())
  email          String   @unique
  password       String
  role           Role     @default(USER)

  // NEW: Multi-tenant
  organizationId String
  organization   Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)

  // NEW: User profile
  firstName      String?
  lastName       String?
  avatar         String?
  position       String?

  // NEW: Onboarding
  isOnboarded    Boolean  @default(false)

  createdAt      DateTime @default(now())

  // Existing relations...
  jobPostings           JobPosting[]
  candidates            Candidate[]
  // ... (keep all existing)

  @@index([organizationId])
  @@index([email])
  @@map("users")
}
```

#### **Add organizationId to ALL data tables:**
```prisma
// Example for JobPosting (apply to all models)
model JobPosting {
  id             String   @id @default(uuid())

  // NEW: Organization isolation
  organizationId String

  // Existing fields...
  title          String
  department     String
  // ...

  @@index([organizationId])
  @@index([organizationId, isDeleted]) // Composite for filtering
  @@map("job_postings")
}
```

**Tables to modify (add organizationId):**
- ✅ User (already planned)
- JobPosting
- Candidate
- Analysis
- AnalysisResult
- AssessmentTest
- BulkUploadSession
- Interview
- JobOffer
- OfferTemplate
- OfferTemplateCategory

---

### **1.2 Prisma Migration**

**File:** `backend/prisma/migrations/YYYYMMDDHHMMSS_add_multi_tenant/migration.sql`

```sql
-- Create Organization table
CREATE TABLE "organizations" (
  "id" TEXT PRIMARY KEY,
  "name" TEXT NOT NULL,
  "slug" TEXT UNIQUE NOT NULL,
  "domain" TEXT UNIQUE,
  "logo" TEXT,
  "primaryColor" TEXT DEFAULT '#3B82F6',
  "industry" TEXT,
  "size" TEXT,
  "country" TEXT DEFAULT 'TR',
  "timezone" TEXT DEFAULT 'Europe/Istanbul',
  "plan" TEXT DEFAULT 'FREE',
  "planStartedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "planExpiresAt" TIMESTAMP,
  "monthlyAnalysisCount" INTEGER DEFAULT 0,
  "monthlyCvCount" INTEGER DEFAULT 0,
  "totalUsers" INTEGER DEFAULT 1,
  "maxAnalysisPerMonth" INTEGER DEFAULT 10,
  "maxCvPerMonth" INTEGER DEFAULT 50,
  "maxUsers" INTEGER DEFAULT 2,
  "onboardingCompleted" BOOLEAN DEFAULT FALSE,
  "onboardingStep" INTEGER DEFAULT 0,
  "isActive" BOOLEAN DEFAULT TRUE,
  "isTrial" BOOLEAN DEFAULT TRUE,
  "trialEndsAt" TIMESTAMP,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create default organization for existing users
INSERT INTO "organizations" ("id", "name", "slug", "plan", "onboardingCompleted", "maxAnalysisPerMonth", "maxCvPerMonth", "maxUsers")
VALUES ('default-org-id', 'Default Organization', 'default', 'ENTERPRISE', TRUE, 999999, 999999, 999999);

-- Add organizationId to users
ALTER TABLE "users" ADD COLUMN "organizationId" TEXT;
ALTER TABLE "users" ADD COLUMN "firstName" TEXT;
ALTER TABLE "users" ADD COLUMN "lastName" TEXT;
ALTER TABLE "users" ADD COLUMN "avatar" TEXT;
ALTER TABLE "users" ADD COLUMN "position" TEXT;
ALTER TABLE "users" ADD COLUMN "isOnboarded" BOOLEAN DEFAULT FALSE;

-- Set all existing users to default organization
UPDATE "users" SET "organizationId" = 'default-org-id' WHERE "organizationId" IS NULL;

-- Make organizationId NOT NULL
ALTER TABLE "users" ALTER COLUMN "organizationId" SET NOT NULL;

-- Add foreign key
ALTER TABLE "users" ADD CONSTRAINT "users_organizationId_fkey"
  FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE;

-- Add organizationId to all data tables (repeat for each table)
ALTER TABLE "job_postings" ADD COLUMN "organizationId" TEXT;
UPDATE "job_postings" jp SET "organizationId" = (
  SELECT "organizationId" FROM "users" WHERE "id" = jp."userId"
);
ALTER TABLE "job_postings" ALTER COLUMN "organizationId" SET NOT NULL;
CREATE INDEX "job_postings_organizationId_idx" ON "job_postings"("organizationId");

-- Repeat for: candidates, analyses, assessment_tests, interviews, job_offers, etc.
```

---

### **1.3 Middleware: Organization Isolation**

**File:** `backend/src/middleware/organizationIsolation.js`

```javascript
/**
 * Middleware to inject organizationId into all queries
 * Ensures users only see their organization's data
 */
async function enforceOrganizationIsolation(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  // Fetch user with organization
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    include: { organization: true }
  });

  if (!user || !user.organization) {
    return res.status(403).json({ error: 'No organization assigned' });
  }

  if (!user.organization.isActive) {
    return res.status(403).json({
      error: 'Organization suspended',
      message: 'Your organization account has been suspended. Contact support.'
    });
  }

  // Attach organization to request
  req.organizationId = user.organizationId;
  req.organization = user.organization;

  next();
}

module.exports = { enforceOrganizationIsolation };
```

**Usage in routes:**
```javascript
// backend/src/routes/jobPostingRoutes.js
const { enforceOrganizationIsolation } = require('../middleware/organizationIsolation');

router.get('/',
  authenticateToken,
  enforceOrganizationIsolation, // NEW
  jobPostingController.getAllJobPostings
);
```

---

### **1.4 Update ALL Controllers**

**Pattern:** Add `organizationId` filter to all queries

**Example:** `backend/src/controllers/jobPostingController.js`

```javascript
// BEFORE:
async getAllJobPostings(req, res) {
  const jobPostings = await prisma.jobPosting.findMany({
    where: {
      userId: req.user.id,
      isDeleted: false
    }
  });
}

// AFTER:
async getAllJobPostings(req, res) {
  const jobPostings = await prisma.jobPosting.findMany({
    where: {
      organizationId: req.organizationId, // NEW: Organization filter
      isDeleted: false
    }
  });
}
```

**Controllers to update (23 files):**
- analysisController.js ✅
- candidateController.js ✅
- jobPostingController.js ✅
- offerController.js ✅
- templateController.js ✅
- interviewController.js ✅
- testController.js ✅
- dashboardController.js ✅
- analyticsController.js ✅
- (14 more controllers...)

**Automation script:**
```bash
# Find all Prisma queries without organizationId
grep -r "prisma\." backend/src/controllers/ | grep -v "organizationId"
```

---

### **1.5 Organization API Endpoints**

**File:** `backend/src/routes/organizationRoutes.js`

```javascript
const express = require('express');
const router = express.Router();
const { authenticateToken, requireRole } = require('../middleware/auth');
const { enforceOrganizationIsolation } = require('../middleware/organizationIsolation');

// GET /api/v1/organizations/me - Get current organization
router.get('/me', authenticateToken, enforceOrganizationIsolation, async (req, res) => {
  res.json(req.organization);
});

// PATCH /api/v1/organizations/me - Update organization settings
router.patch('/me',
  authenticateToken,
  enforceOrganizationIsolation,
  requireRole(['ADMIN']), // Only org admins
  async (req, res) => {
    const { name, logo, primaryColor, industry, size } = req.body;

    const updated = await prisma.organization.update({
      where: { id: req.organizationId },
      data: { name, logo, primaryColor, industry, size }
    });

    res.json(updated);
  }
);

// GET /api/v1/organizations/me/usage - Get usage stats
router.get('/me/usage', authenticateToken, enforceOrganizationIsolation, async (req, res) => {
  const org = req.organization;

  res.json({
    plan: org.plan,
    usage: {
      analyses: org.monthlyAnalysisCount,
      cvs: org.monthlyCvCount,
      users: org.totalUsers
    },
    limits: {
      analyses: org.maxAnalysisPerMonth,
      cvs: org.maxCvPerMonth,
      users: org.maxUsers
    },
    remaining: {
      analyses: org.maxAnalysisPerMonth - org.monthlyAnalysisCount,
      cvs: org.maxCvPerMonth - org.monthlyCvCount,
      users: org.maxUsers - org.totalUsers
    }
  });
});

module.exports = router;
```

---

### **1.6 Frontend: Organization Context**

**File:** `frontend/contexts/OrganizationContext.tsx`

```typescript
'use client';

import { createContext, useContext, useEffect, useState } from 'react';

interface Organization {
  id: string;
  name: string;
  slug: string;
  logo?: string;
  primaryColor?: string;
  plan: 'FREE' | 'PRO' | 'ENTERPRISE';
  onboardingCompleted: boolean;
}

interface Usage {
  analyses: number;
  cvs: number;
  users: number;
}

interface Limits {
  analyses: number;
  cvs: number;
  users: number;
}

interface OrganizationContextType {
  organization: Organization | null;
  usage: Usage | null;
  limits: Limits | null;
  refreshOrganization: () => Promise<void>;
}

const OrganizationContext = createContext<OrganizationContextType | undefined>(undefined);

export function OrganizationProvider({ children }: { children: React.ReactNode }) {
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [usage, setUsage] = useState<Usage | null>(null);
  const [limits, setLimits] = useState<Limits | null>(null);

  const fetchOrganization = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const [orgRes, usageRes] = await Promise.all([
      fetch('http://localhost:8102/api/v1/organizations/me', {
        headers: { Authorization: `Bearer ${token}` }
      }),
      fetch('http://localhost:8102/api/v1/organizations/me/usage', {
        headers: { Authorization: `Bearer ${token}` }
      })
    ]);

    if (orgRes.ok) {
      const data = await orgRes.json();
      setOrganization(data);
    }

    if (usageRes.ok) {
      const data = await usageRes.json();
      setUsage(data.usage);
      setLimits(data.limits);
    }
  };

  useEffect(() => {
    fetchOrganization();
  }, []);

  return (
    <OrganizationContext.Provider value={{
      organization,
      usage,
      limits,
      refreshOrganization: fetchOrganization
    }}>
      {children}
    </OrganizationContext.Provider>
  );
}

export const useOrganization = () => {
  const context = useContext(OrganizationContext);
  if (!context) throw new Error('useOrganization must be used within OrganizationProvider');
  return context;
};
```

---

### **1.7 Frontend: Organization Settings Page**

**File:** `frontend/app/(authenticated)/settings/organization/page.tsx`

```typescript
'use client';

import { useState } from 'react';
import { useOrganization } from '@/contexts/OrganizationContext';

export default function OrganizationSettings() {
  const { organization, refreshOrganization } = useOrganization();
  const [name, setName] = useState(organization?.name || '');
  const [logo, setLogo] = useState(organization?.logo || '');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    const token = localStorage.getItem('token');

    const res = await fetch('http://localhost:8102/api/v1/organizations/me', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ name, logo })
    });

    if (res.ok) {
      await refreshOrganization();
      alert('Kaydedildi!');
    }
    setSaving(false);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Organizasyon Ayarları</h1>

      <div className="bg-white rounded-lg shadow p-6 max-w-2xl">
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Şirket Adı</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Logo URL</label>
          <input
            type="text"
            value={logo}
            onChange={(e) => setLogo(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? 'Kaydediliyor...' : 'Kaydet'}
        </button>
      </div>

      {/* Plan info */}
      <div className="mt-6 bg-blue-50 rounded-lg p-6 max-w-2xl">
        <h2 className="text-lg font-semibold mb-2">Mevcut Plan</h2>
        <p className="text-3xl font-bold text-blue-600">{organization?.plan}</p>
      </div>
    </div>
  );
}
```

---

### **Phase 1 Checklist**

- [ ] Create `Organization` model in Prisma schema
- [ ] Add `organizationId` to User model
- [ ] Add `organizationId` to all 11 data models
- [ ] Create and run migration
- [ ] Create `organizationIsolation.js` middleware
- [ ] Update all 23 controllers with `organizationId` filters
- [ ] Create `organizationRoutes.js` (3 endpoints)
- [ ] Create `OrganizationContext.tsx`
- [ ] Create organization settings page
- [ ] Test: Users can only see their own org data
- [ ] Test: Cross-organization access blocked

**Estimated Time:** 4-6 hours

---

## 🎨 PHASE 2: Onboarding Wizard

### **2.1 Onboarding Flow**

**Steps:**
1. Welcome screen
2. Company details (name, logo, industry)
3. Create first job posting
4. Upload demo CVs (optional)
5. Start first analysis
6. Complete - redirect to dashboard

---

### **2.2 Backend: Onboarding Endpoints**

**File:** `backend/src/routes/onboardingRoutes.js`

```javascript
const express = require('express');
const router = express.Router();

// POST /api/v1/onboarding/complete-step
router.post('/complete-step', authenticateToken, async (req, res) => {
  const { step } = req.body;

  await prisma.organization.update({
    where: { id: req.organizationId },
    data: { onboardingStep: step }
  });

  res.json({ success: true });
});

// POST /api/v1/onboarding/complete
router.post('/complete', authenticateToken, async (req, res) => {
  await prisma.organization.update({
    where: { id: req.organizationId },
    data: {
      onboardingCompleted: true,
      onboardingStep: 99
    }
  });

  await prisma.user.update({
    where: { id: req.user.id },
    data: { isOnboarded: true }
  });

  res.json({ success: true });
});

// GET /api/v1/onboarding/demo-cvs - Download sample CVs
router.get('/demo-cvs', authenticateToken, async (req, res) => {
  const demoCvs = [
    { name: 'Ahmet Yılmaz - Senior Developer.pdf', url: '/demo/cv1.pdf' },
    { name: 'Ayşe Kaya - Product Manager.pdf', url: '/demo/cv2.pdf' },
    // ... 3 more
  ];
  res.json(demoCvs);
});

module.exports = router;
```

---

### **2.3 Frontend: Onboarding Wizard Component**

**File:** `frontend/app/(authenticated)/onboarding/page.tsx`

```typescript
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function OnboardingWizard() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [companyName, setCompanyName] = useState('');
  const [industry, setIndustry] = useState('');

  const completeOnboarding = async () => {
    const token = localStorage.getItem('token');
    await fetch('http://localhost:8102/api/v1/onboarding/complete', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` }
    });
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl w-full">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {[1, 2, 3, 4, 5].map((s) => (
              <div
                key={s}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  s <= step ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
                }`}
              >
                {s}
              </div>
            ))}
          </div>
          <div className="h-2 bg-gray-200 rounded-full">
            <div
              className="h-2 bg-blue-600 rounded-full transition-all"
              style={{ width: `${(step / 5) * 100}%` }}
            />
          </div>
        </div>

        {/* Step 1: Welcome */}
        {step === 1 && (
          <div>
            <h1 className="text-3xl font-bold mb-4">IKAI'ye Hoş Geldiniz! 🎉</h1>
            <p className="text-gray-600 mb-6">
              Yapay zeka destekli işe alım platformunuza hoş geldiniz.
              Hemen başlayalım!
            </p>
            <button
              onClick={() => setStep(2)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg w-full font-medium"
            >
              Başlayalım →
            </button>
          </div>
        )}

        {/* Step 2: Company Details */}
        {step === 2 && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Şirket Bilgileriniz</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Şirket Adı</label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full border rounded-lg px-4 py-2"
                placeholder="Örn: Acme Corporation"
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Sektör</label>
              <select
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="w-full border rounded-lg px-4 py-2"
              >
                <option value="">Seçiniz</option>
                <option value="technology">Teknoloji</option>
                <option value="healthcare">Sağlık</option>
                <option value="finance">Finans</option>
                <option value="education">Eğitim</option>
                <option value="retail">Perakende</option>
              </select>
            </div>
            <button
              onClick={() => setStep(3)}
              disabled={!companyName || !industry}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg w-full font-medium disabled:opacity-50"
            >
              Devam Et →
            </button>
          </div>
        )}

        {/* Step 3: Create Job Posting */}
        {step === 3 && (
          <div>
            <h2 className="text-2xl font-bold mb-4">İlk İş İlanınız</h2>
            <p className="text-gray-600 mb-4">
              Demo için basit bir iş ilanı oluşturalım
            </p>
            {/* Mini job posting form */}
            <button
              onClick={() => setStep(4)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg w-full font-medium"
            >
              İlanı Oluştur →
            </button>
          </div>
        )}

        {/* Step 4: Upload Demo CVs */}
        {step === 4 && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Demo CV'ler</h2>
            <p className="text-gray-600 mb-4">
              Platformu test etmek için demo CV'ler yükleyelim mi?
            </p>
            <button
              onClick={() => setStep(5)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg w-full font-medium mb-2"
            >
              Evet, Demo CV'leri Yükle
            </button>
            <button
              onClick={() => setStep(5)}
              className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg w-full font-medium"
            >
              Hayır, Kendi CV'lerimi Yükleyeceğim
            </button>
          </div>
        )}

        {/* Step 5: Complete */}
        {step === 5 && (
          <div className="text-center">
            <div className="text-6xl mb-4">✅</div>
            <h2 className="text-2xl font-bold mb-4">Tamamlandı!</h2>
            <p className="text-gray-600 mb-6">
              Artık IKAI platformunu kullanmaya hazırsınız!
            </p>
            <button
              onClick={completeOnboarding}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium"
            >
              Dashboard'a Git →
            </button>
          </div>
        )}

        {/* Back button */}
        {step > 1 && step < 5 && (
          <button
            onClick={() => setStep(step - 1)}
            className="mt-4 text-gray-600 hover:text-gray-800"
          >
            ← Geri
          </button>
        )}
      </div>
    </div>
  );
}
```

---

### **2.4 Onboarding Guard Middleware**

**File:** `frontend/components/OnboardingGuard.tsx`

```typescript
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useOrganization } from '@/contexts/OrganizationContext';

export function OnboardingGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { organization } = useOrganization();

  useEffect(() => {
    if (organization && !organization.onboardingCompleted) {
      router.push('/onboarding');
    }
  }, [organization, router]);

  if (!organization?.onboardingCompleted) {
    return null; // Or loading spinner
  }

  return <>{children}</>;
}
```

**Usage in layout:**
```typescript
// frontend/app/(authenticated)/layout.tsx
export default function AuthenticatedLayout({ children }) {
  return (
    <OrganizationProvider>
      <OnboardingGuard>
        {children}
      </OnboardingGuard>
    </OrganizationProvider>
  );
}
```

---

### **Phase 2 Checklist**

- [ ] Create onboarding routes (3 endpoints)
- [ ] Create OnboardingWizard component (5 steps)
- [ ] Create OnboardingGuard middleware
- [ ] Prepare 5 demo CVs
- [ ] Update authenticated layout with guard
- [ ] Test: New user sees onboarding
- [ ] Test: Completed user skips onboarding

**Estimated Time:** 3-4 hours

---

## 💰 PHASE 3: Usage Limits & Plans

### **3.1 Plan Definitions**

```typescript
// shared/constants/plans.ts
export const PLANS = {
  FREE: {
    name: 'Ücretsiz',
    price: 0,
    limits: {
      analysisPerMonth: 10,
      cvPerMonth: 50,
      users: 2,
      storage: 1, // GB
    },
    features: [
      'Aylık 10 analiz',
      '50 CV yükleme',
      '2 kullanıcı',
      'Temel destek'
    ]
  },
  PRO: {
    name: 'Pro',
    price: 99, // USD/month
    limits: {
      analysisPerMonth: 100,
      cvPerMonth: 500,
      users: 10,
      storage: 10,
    },
    features: [
      'Aylık 100 analiz',
      '500 CV yükleme',
      '10 kullanıcı',
      'Öncelikli destek',
      'API erişimi'
    ]
  },
  ENTERPRISE: {
    name: 'Enterprise',
    price: null, // Contact sales
    limits: {
      analysisPerMonth: 999999,
      cvPerMonth: 999999,
      users: 999999,
      storage: 999999,
    },
    features: [
      'Sınırsız analiz',
      'Sınırsız CV',
      'Sınırsız kullanıcı',
      '7/24 destek',
      'Özel entegrasyon',
      'SLA garantisi'
    ]
  }
};
```

---

### **3.2 Usage Tracking Middleware**

**File:** `backend/src/middleware/usageTracking.js`

```javascript
/**
 * Tracks usage for billing/limits
 */
async function trackAnalysisUsage(req, res, next) {
  const organization = req.organization;

  // Check if limit exceeded
  if (organization.monthlyAnalysisCount >= organization.maxAnalysisPerMonth) {
    return res.status(403).json({
      error: 'Limit exceeded',
      message: `Aylık analiz limitine ulaştınız (${organization.maxAnalysisPerMonth}). Planınızı yükseltin.`,
      upgradeUrl: '/settings/billing'
    });
  }

  // Increment counter
  await prisma.organization.update({
    where: { id: req.organizationId },
    data: {
      monthlyAnalysisCount: { increment: 1 }
    }
  });

  next();
}

async function trackCvUpload(req, res, next) {
  const organization = req.organization;

  if (organization.monthlyCvCount >= organization.maxCvPerMonth) {
    return res.status(403).json({
      error: 'Limit exceeded',
      message: `Aylık CV yükleme limitine ulaştınız (${organization.maxCvPerMonth}).`
    });
  }

  await prisma.organization.update({
    where: { id: req.organizationId },
    data: {
      monthlyCvCount: { increment: 1 }
    }
  });

  next();
}

module.exports = { trackAnalysisUsage, trackCvUpload };
```

**Usage:**
```javascript
// backend/src/routes/analysisRoutes.js
router.post('/',
  authenticateToken,
  enforceOrganizationIsolation,
  trackAnalysisUsage, // NEW
  analysisController.createAnalysis
);
```

---

### **3.3 Monthly Reset Cron Job**

**File:** `backend/src/jobs/resetMonthlyUsage.js`

```javascript
const cron = require('node-cron');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Reset usage counters on 1st of each month at 00:00
cron.schedule('0 0 1 * *', async () => {
  console.log('[CRON] Resetting monthly usage counters...');

  await prisma.organization.updateMany({
    data: {
      monthlyAnalysisCount: 0,
      monthlyCvCount: 0
    }
  });

  console.log('[CRON] Monthly usage reset complete');
});
```

---

### **3.4 Frontend: Usage Display**

**File:** `frontend/components/UsageWidget.tsx`

```typescript
'use client';

import { useOrganization } from '@/contexts/OrganizationContext';

export function UsageWidget() {
  const { usage, limits } = useOrganization();

  if (!usage || !limits) return null;

  const analysisPercent = (usage.analyses / limits.analyses) * 100;
  const cvPercent = (usage.cvs / limits.cvs) * 100;

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-4">
      <h3 className="font-semibold mb-3">Kullanım Durumu</h3>

      {/* Analyses */}
      <div className="mb-3">
        <div className="flex justify-between text-sm mb-1">
          <span>Analizler</span>
          <span className="font-medium">{usage.analyses} / {limits.analyses}</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full ${analysisPercent > 90 ? 'bg-red-500' : 'bg-blue-600'}`}
            style={{ width: `${analysisPercent}%` }}
          />
        </div>
      </div>

      {/* CVs */}
      <div>
        <div className="flex justify-between text-sm mb-1">
          <span>CV Yükleme</span>
          <span className="font-medium">{usage.cvs} / {limits.cvs}</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full ${cvPercent > 90 ? 'bg-red-500' : 'bg-blue-600'}`}
            style={{ width: `${cvPercent}%` }}
          />
        </div>
      </div>

      {(analysisPercent > 80 || cvPercent > 80) && (
        <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm">
          ⚠️ Limitinize yaklaşıyorsunuz. <a href="/settings/billing" className="text-blue-600 underline">Planı yükseltin</a>
        </div>
      )}
    </div>
  );
}
```

---

### **3.5 Billing/Upgrade Page**

**File:** `frontend/app/(authenticated)/settings/billing/page.tsx`

```typescript
'use client';

import { useOrganization } from '@/contexts/OrganizationContext';
import { PLANS } from '@/constants/plans';

export default function BillingPage() {
  const { organization } = useOrganization();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Plan & Fiyatlandırma</h1>

      <div className="grid md:grid-cols-3 gap-6">
        {Object.entries(PLANS).map(([key, plan]) => (
          <div
            key={key}
            className={`border-2 rounded-lg p-6 ${
              organization?.plan === key ? 'border-blue-600 bg-blue-50' : 'border-gray-200'
            }`}
          >
            <h2 className="text-xl font-bold mb-2">{plan.name}</h2>
            <div className="text-3xl font-bold mb-4">
              {plan.price ? `$${plan.price}` : 'İletişim'}
              {plan.price && <span className="text-sm text-gray-600">/ay</span>}
            </div>

            <ul className="space-y-2 mb-6">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>

            {organization?.plan === key ? (
              <button disabled className="w-full bg-gray-300 text-gray-600 py-2 rounded-lg">
                Mevcut Plan
              </button>
            ) : (
              <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
                {plan.price ? 'Planı Seç' : 'İletişime Geç'}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

### **Phase 3 Checklist**

- [ ] Define plan constants
- [ ] Create usage tracking middleware
- [ ] Add usage tracking to analysis/CV routes
- [ ] Create monthly reset cron job
- [ ] Create UsageWidget component
- [ ] Create billing/upgrade page
- [ ] Test: FREE plan limit enforcement
- [ ] Test: Monthly reset works

**Estimated Time:** 2-3 hours

---

## 🔧 PHASE 4: Super Admin Dashboard

### **4.1 Super Admin Role**

**Update User enum:**
```prisma
enum Role {
  USER
  ADMIN
  MANAGER
  HR_SPECIALIST
  SUPER_ADMIN  // NEW: Cross-organization admin
}
```

---

### **4.2 Super Admin Middleware**

**File:** `backend/src/middleware/auth.js` (add)

```javascript
function requireSuperAdmin(req, res, next) {
  if (req.user.role !== 'SUPER_ADMIN') {
    return res.status(403).json({ error: 'Super admin access required' });
  }
  next();
}
```

---

### **4.3 Super Admin API**

**File:** `backend/src/routes/superAdminRoutes.js`

```javascript
const express = require('express');
const router = express.Router();

// GET /api/v1/super-admin/organizations - List all orgs
router.get('/organizations', authenticateToken, requireSuperAdmin, async (req, res) => {
  const orgs = await prisma.organization.findMany({
    include: {
      _count: {
        select: { users: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });
  res.json(orgs);
});

// GET /api/v1/super-admin/stats - Platform stats
router.get('/stats', authenticateToken, requireSuperAdmin, async (req, res) => {
  const [
    totalOrgs,
    totalUsers,
    totalAnalyses,
    activeOrgs
  ] = await Promise.all([
    prisma.organization.count(),
    prisma.user.count(),
    prisma.analysis.count(),
    prisma.organization.count({ where: { isActive: true } })
  ]);

  res.json({
    totalOrgs,
    totalUsers,
    totalAnalyses,
    activeOrgs
  });
});

// PATCH /api/v1/super-admin/organizations/:id/toggle - Enable/disable org
router.patch('/organizations/:id/toggle', authenticateToken, requireSuperAdmin, async (req, res) => {
  const org = await prisma.organization.findUnique({ where: { id: req.params.id } });

  const updated = await prisma.organization.update({
    where: { id: req.params.id },
    data: { isActive: !org.isActive }
  });

  res.json(updated);
});

module.exports = router;
```

---

### **4.4 Super Admin Dashboard UI**

**File:** `frontend/app/(authenticated)/super-admin/page.tsx`

```typescript
'use client';

import { useEffect, useState } from 'react';

export default function SuperAdminDashboard() {
  const [stats, setStats] = useState(null);
  const [orgs, setOrgs] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');

    fetch('http://localhost:8102/api/v1/super-admin/stats', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(r => r.json()).then(setStats);

    fetch('http://localhost:8102/api/v1/super-admin/organizations', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(r => r.json()).then(setOrgs);
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Super Admin Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-gray-600 text-sm">Toplam Organizasyon</div>
          <div className="text-3xl font-bold">{stats?.totalOrgs || 0}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-gray-600 text-sm">Toplam Kullanıcı</div>
          <div className="text-3xl font-bold">{stats?.totalUsers || 0}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-gray-600 text-sm">Toplam Analiz</div>
          <div className="text-3xl font-bold">{stats?.totalAnalyses || 0}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-gray-600 text-sm">Aktif Org</div>
          <div className="text-3xl font-bold text-green-600">{stats?.activeOrgs || 0}</div>
        </div>
      </div>

      {/* Organizations Table */}
      <div className="bg-white rounded-lg shadow">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3 text-left">Organizasyon</th>
              <th className="px-4 py-3 text-left">Plan</th>
              <th className="px-4 py-3 text-left">Kullanıcılar</th>
              <th className="px-4 py-3 text-left">Durum</th>
              <th className="px-4 py-3 text-left">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {orgs.map((org) => (
              <tr key={org.id} className="border-b">
                <td className="px-4 py-3">{org.name}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded text-xs ${
                    org.plan === 'FREE' ? 'bg-gray-100' :
                    org.plan === 'PRO' ? 'bg-blue-100 text-blue-700' :
                    'bg-purple-100 text-purple-700'
                  }`}>
                    {org.plan}
                  </span>
                </td>
                <td className="px-4 py-3">{org._count.users}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded text-xs ${
                    org.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {org.isActive ? 'Aktif' : 'Pasif'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button className="text-blue-600 text-sm">Detay</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
```

---

### **Phase 4 Checklist**

- [ ] Add SUPER_ADMIN role to enum
- [ ] Create requireSuperAdmin middleware
- [ ] Create superAdminRoutes (3 endpoints)
- [ ] Create super admin dashboard page
- [ ] Create org detail page
- [ ] Test: Only SUPER_ADMIN can access
- [ ] Test: Org enable/disable works

**Estimated Time:** 2-3 hours

---

## 🌐 PHASE 5: Public Landing Page

### **5.1 Public Routes Structure**

```
frontend/app/
├── (public)/
│   ├── page.tsx              # Landing page (/)
│   ├── pricing/page.tsx      # Pricing (/pricing)
│   ├── features/page.tsx     # Features (/features)
│   └── layout.tsx            # Public layout
├── login/
└── register/
```

---

### **5.2 Landing Page**

**File:** `frontend/app/(public)/page.tsx`

```typescript
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <nav className="border-b bg-white">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-blue-600">IKAI HR</div>
          <div className="space-x-4">
            <Link href="/features" className="text-gray-600 hover:text-gray-900">Özellikler</Link>
            <Link href="/pricing" className="text-gray-600 hover:text-gray-900">Fiyatlandırma</Link>
            <Link href="/login" className="text-gray-600 hover:text-gray-900">Giriş</Link>
            <Link href="/register" className="bg-blue-600 text-white px-4 py-2 rounded-lg">Ücretsiz Başla</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">
            Yapay Zeka ile <span className="text-blue-600">İşe Alım</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            CV analizi, test oluşturma, mülakat planlama ve teklif yönetimi.
            Tüm işe alım süreciniz tek platformda.
          </p>
          <Link
            href="/register"
            className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-medium inline-block hover:bg-blue-700"
          >
            Hemen Başla - Ücretsiz
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Özellikler</h2>
          <div className="grid md:grid-cols-4 gap-8">
            <Feature
              icon="🤖"
              title="AI CV Analizi"
              description="Gemini AI ile otomatik CV değerlendirme"
            />
            <Feature
              icon="📝"
              title="Test Sistemi"
              description="Otomatik soru oluşturma ve değerlendirme"
            />
            <Feature
              icon="📅"
              title="Mülakat Planlama"
              description="Google Meet entegrasyonu"
            />
            <Feature
              icon="💼"
              title="Teklif Yönetimi"
              description="Dijital iş teklifi ve onay süreci"
            />
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-12">Rakamlarla IKAI</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Stat number="10,000+" label="Analiz Edilen CV" />
            <Stat number="500+" label="Mutlu Şirket" />
            <Stat number="95%" label="Memnuniyet Oranı" />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Hemen Başlayın</h2>
          <p className="text-xl mb-8">Ücretsiz plan ile denemeye başlayın</p>
          <Link
            href="/register"
            className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-medium inline-block hover:bg-gray-100"
          >
            Kayıt Ol
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 text-center text-gray-600">
        <p>&copy; 2025 IKAI HR. Tüm hakları saklıdır.</p>
      </footer>
    </div>
  );
}

function Feature({ icon, title, description }) {
  return (
    <div className="text-center">
      <div className="text-5xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

function Stat({ number, label }) {
  return (
    <div>
      <div className="text-4xl font-bold text-blue-600 mb-2">{number}</div>
      <div className="text-gray-600">{label}</div>
    </div>
  );
}
```

---

### **5.3 Pricing Page**

**File:** `frontend/app/(public)/pricing/page.tsx`

```typescript
// Copy billing page content but make it public
// Show plan comparison table without "current plan" status
```

---

### **Phase 5 Checklist**

- [ ] Create (public) route group
- [ ] Create landing page with hero, features, CTA
- [ ] Create pricing page
- [ ] Create features page
- [ ] Add navbar with login/register links
- [ ] Test: Public routes accessible without auth
- [ ] Test: SEO meta tags

**Estimated Time:** 3-4 hours

---

## 🚀 ROLLOUT PLAN

### **Day 1 (8 hours)**
- Morning (4h): Phase 1 - Multi-Tenant Architecture
  - Database schema + migration
  - Middleware + controller updates
- Afternoon (4h): Phase 1 continued
  - Frontend context
  - Organization settings page
  - Testing

### **Day 2 (6-7 hours)**
- Morning (3-4h): Phase 2 - Onboarding Wizard
  - Backend endpoints
  - Frontend wizard UI
  - Guard middleware
- Afternoon (2-3h): Phase 3 - Usage Limits
  - Usage tracking middleware
  - Billing page
  - Cron job

### **Day 3 (5-6 hours)**
- Morning (2-3h): Phase 4 - Super Admin
  - API endpoints
  - Dashboard UI
- Afternoon (3h): Phase 5 - Landing Page
  - Public routes
  - Landing page
  - Pricing page

---

## ✅ TESTING CHECKLIST

### **Multi-Tenant Tests**
- [ ] User A cannot see User B's data (different orgs)
- [ ] User A can see User B's data (same org)
- [ ] Organization settings save correctly
- [ ] Cross-org API calls blocked (403)

### **Onboarding Tests**
- [ ] New user redirected to onboarding
- [ ] Onboarded user skips wizard
- [ ] All 5 steps complete successfully
- [ ] Demo CVs upload correctly

### **Usage Limits Tests**
- [ ] FREE plan blocks after 10 analyses
- [ ] PRO plan allows 100 analyses
- [ ] Monthly reset works (manual trigger test)
- [ ] Usage widget shows correct percentages

### **Super Admin Tests**
- [ ] Only SUPER_ADMIN can access dashboard
- [ ] Org list shows all organizations
- [ ] Enable/disable org works
- [ ] Stats display correctly

### **Landing Page Tests**
- [ ] Public routes accessible without login
- [ ] Register link works
- [ ] Pricing page loads
- [ ] SEO meta tags present

---

## 📄 FILES TO CREATE/MODIFY

### **Backend (36 files)**

**New Files (15):**
- `prisma/migrations/.../migration.sql`
- `src/middleware/organizationIsolation.js`
- `src/middleware/usageTracking.js`
- `src/routes/organizationRoutes.js`
- `src/routes/onboardingRoutes.js`
- `src/routes/superAdminRoutes.js`
- `src/controllers/organizationController.js`
- `src/controllers/onboardingController.js`
- `src/controllers/superAdminController.js`
- `src/jobs/resetMonthlyUsage.js`
- `src/utils/planLimits.js`
- `src/services/organizationService.js`
- `src/validators/organizationValidator.js`
- `src/seeds/demoOrganizations.js`
- `src/seeds/demoCvs.js`

**Modified Files (23 controllers + 2):**
- `prisma/schema.prisma`
- `src/index.js` (add cron job)
- All 23 controllers (add organizationId filters)

---

### **Frontend (18 files)**

**New Files (13):**
- `contexts/OrganizationContext.tsx`
- `app/(public)/layout.tsx`
- `app/(public)/page.tsx`
- `app/(public)/pricing/page.tsx`
- `app/(public)/features/page.tsx`
- `app/(authenticated)/onboarding/page.tsx`
- `app/(authenticated)/settings/organization/page.tsx`
- `app/(authenticated)/settings/billing/page.tsx`
- `app/(authenticated)/super-admin/page.tsx`
- `components/OnboardingGuard.tsx`
- `components/UsageWidget.tsx`
- `constants/plans.ts`
- `hooks/useOrganization.ts`

**Modified Files (5):**
- `app/(authenticated)/layout.tsx`
- `app/(authenticated)/dashboard/page.tsx` (add UsageWidget)
- `components/Sidebar.tsx` (add org name/logo)
- `app/login/page.tsx` (redirect to onboarding if needed)
- `app/register/page.tsx` (create org on signup)

---

### **Documentation (3 files)**
- `docs/features/saas-transformation-plan.md` (this file)
- `docs/api/organization-api.md`
- `docs/features/multi-tenant-guide.md`

---

## 🎯 SUCCESS METRICS

### **After Implementation:**
- ✅ Multiple companies can use the platform independently
- ✅ New users have guided onboarding experience
- ✅ Usage limits prevent API abuse
- ✅ Super admin can monitor all organizations
- ✅ Public landing page attracts new users

### **Business Impact:**
- 🚀 Production-ready SaaS in 2-3 days
- 💰 Freemium model enables upsell
- 📈 Scalable to 100+ organizations
- 🎨 White-label ready (custom domains)
- 🔒 Enterprise-grade isolation

---

## 🔄 FUTURE ENHANCEMENTS (Post-MVP)

### **Payment Integration** (Phase 6)
- Stripe integration
- Subscription management
- Invoice generation
- Auto-upgrade/downgrade

### **Advanced Features** (Phase 7)
- Custom domains (acme.ikaihr.com)
- White-label branding
- SSO (SAML, OAuth)
- API keys for integrations
- Audit logs
- Role-based permissions (RBAC)
- Team management

### **Analytics** (Phase 8)
- Organization analytics dashboard
- Usage trends
- Conversion tracking
- A/B testing framework

---

## 🆘 TROUBLESHOOTING

### **Migration Fails**
```bash
# Rollback
npx prisma migrate reset

# Try again
npx prisma migrate dev --name add_multi_tenant
```

### **organizationId Missing Errors**
- Check middleware order (organizationIsolation after authenticateToken)
- Verify all queries have `where: { organizationId }`

### **Onboarding Loop**
- Check `onboardingCompleted` flag in DB
- Clear localStorage and retry

### **Usage Counter Not Resetting**
- Manually trigger cron: `node src/jobs/resetMonthlyUsage.js`
- Check cron job is running in production

---

## 📞 SUPPORT

**Issues?** Check:
1. CLAUDE.md - Main guide
2. This plan - Implementation details
3. GitHub issues - Bug reports

---

**Ready to transform IKAI into a SaaS platform! 🚀**

**Estimated Total Time:** 14-20 hours (2-3 focused days)

**Let's build! 💪**
