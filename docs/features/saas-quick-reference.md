# IKAI SaaS Transformation - Quick Reference

**Version:** 1.0
**For:** Quick implementation guidance
**See Full Plan:** [saas-transformation-plan.md](saas-transformation-plan.md)

---

## 🎯 TL;DR

Transform IKAI to multi-tenant SaaS in **2-3 days (14-20 hours)**

**5 Phases:**
1. 🔴 Multi-Tenant (4-6h) - CRITICAL
2. 🟠 Onboarding (3-4h) - High priority
3. 🟠 Usage Limits (2-3h) - High priority
4. 🟡 Super Admin (2-3h) - Medium
5. 🟡 Landing Page (3-4h) - Medium

---

## 📋 QUICK CHECKLIST

### **Phase 1: Multi-Tenant** ✅
```bash
# 1. Update schema
# Add Organization model + organizationId to all tables

# 2. Run migration
npx prisma migrate dev --name add_multi_tenant
npx prisma generate

# 3. Create middleware
# backend/src/middleware/organizationIsolation.js

# 4. Update ALL controllers (23 files)
# Add: where: { organizationId: req.organizationId }

# 5. Create org routes
# GET /api/v1/organizations/me
# PATCH /api/v1/organizations/me
# GET /api/v1/organizations/me/usage

# 6. Frontend context + settings page
```

### **Phase 2: Onboarding** ✅
```bash
# 1. Create onboarding routes
# POST /api/v1/onboarding/complete-step
# POST /api/v1/onboarding/complete

# 2. Create wizard UI (5 steps)
# frontend/app/(authenticated)/onboarding/page.tsx

# 3. Add OnboardingGuard
# Redirect to /onboarding if not completed
```

### **Phase 3: Usage Limits** ✅
```bash
# 1. Add plan limits to Organization model
# maxAnalysisPerMonth, maxCvPerMonth, maxUsers

# 2. Create tracking middleware
# trackAnalysisUsage, trackCvUpload

# 3. Add to routes
# Use middleware in analysis/candidate routes

# 4. Create cron job (monthly reset)
# backend/src/jobs/resetMonthlyUsage.js

# 5. Create billing page
# frontend/app/(authenticated)/settings/billing/page.tsx
```

### **Phase 4: Super Admin** ✅
```bash
# 1. Add SUPER_ADMIN role
# Update enum in schema

# 2. Create super admin routes
# GET /api/v1/super-admin/organizations
# GET /api/v1/super-admin/stats
# PATCH /api/v1/super-admin/organizations/:id/toggle

# 3. Create dashboard UI
# frontend/app/(authenticated)/super-admin/page.tsx
```

### **Phase 5: Landing Page** ✅
```bash
# 1. Create (public) route group
# frontend/app/(public)/

# 2. Create pages
# page.tsx (landing)
# pricing/page.tsx
# features/page.tsx

# 3. Add navbar with login/register
```

---

## 🗂️ KEY FILES TO CREATE

### **Backend (15 new files)**
```
backend/
├── prisma/
│   └── migrations/.../migration.sql ✅
├── src/
│   ├── middleware/
│   │   ├── organizationIsolation.js ✅
│   │   └── usageTracking.js ✅
│   ├── routes/
│   │   ├── organizationRoutes.js ✅
│   │   ├── onboardingRoutes.js ✅
│   │   └── superAdminRoutes.js ✅
│   └── jobs/
│       └── resetMonthlyUsage.js ✅
```

### **Frontend (13 new files)**
```
frontend/
├── contexts/
│   └── OrganizationContext.tsx ✅
├── app/
│   ├── (public)/
│   │   ├── page.tsx ✅
│   │   └── pricing/page.tsx ✅
│   └── (authenticated)/
│       ├── onboarding/page.tsx ✅
│       ├── settings/
│       │   ├── organization/page.tsx ✅
│       │   └── billing/page.tsx ✅
│       └── super-admin/page.tsx ✅
├── components/
│   ├── OnboardingGuard.tsx ✅
│   └── UsageWidget.tsx ✅
└── constants/
    └── plans.ts ✅
```

---

## 🔥 CRITICAL CODE SNIPPETS

### **1. Organization Schema**
```prisma
model Organization {
  id    String @id @default(uuid())
  name  String
  slug  String @unique
  plan  SubscriptionPlan @default(FREE)

  maxAnalysisPerMonth Int @default(10)
  monthlyAnalysisCount Int @default(0)

  onboardingCompleted Boolean @default(false)
  isActive Boolean @default(true)

  users User[]
  createdAt DateTime @default(now())
}

enum SubscriptionPlan {
  FREE
  PRO
  ENTERPRISE
}
```

### **2. Add to ALL Data Models**
```prisma
model JobPosting {
  // ... existing fields
  organizationId String

  @@index([organizationId])
}
```

### **3. Isolation Middleware**
```javascript
async function enforceOrganizationIsolation(req, res, next) {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    include: { organization: true }
  });

  if (!user.organization.isActive) {
    return res.status(403).json({ error: 'Organization suspended' });
  }

  req.organizationId = user.organizationId;
  req.organization = user.organization;
  next();
}
```

### **4. Controller Pattern**
```javascript
// BEFORE:
const jobs = await prisma.jobPosting.findMany({
  where: { userId: req.user.id }
});

// AFTER:
const jobs = await prisma.jobPosting.findMany({
  where: { organizationId: req.organizationId }
});
```

### **5. Usage Tracking**
```javascript
async function trackAnalysisUsage(req, res, next) {
  if (req.organization.monthlyAnalysisCount >= req.organization.maxAnalysisPerMonth) {
    return res.status(403).json({
      error: 'Limit exceeded',
      message: 'Aylık analiz limitine ulaştınız'
    });
  }

  await prisma.organization.update({
    where: { id: req.organizationId },
    data: { monthlyAnalysisCount: { increment: 1 } }
  });

  next();
}
```

---

## 🚀 IMPLEMENTATION ORDER

### **Day 1 Morning (4h) - Database**
1. Update `schema.prisma` (Organization + organizationId)
2. Create migration
3. Run migration
4. Test: Query organization data

### **Day 1 Afternoon (4h) - Backend Isolation**
1. Create `organizationIsolation.js` middleware
2. Update 5 main controllers (jobPosting, candidate, analysis, offer, interview)
3. Create `organizationRoutes.js`
4. Test: API returns only org data

### **Day 2 Morning (4h) - Remaining Controllers + Onboarding**
1. Update remaining 18 controllers
2. Create `onboardingRoutes.js`
3. Test: All APIs isolated

### **Day 2 Afternoon (3h) - Frontend Org + Onboarding**
1. Create `OrganizationContext.tsx`
2. Create onboarding wizard
3. Create org settings page
4. Test: New user onboarding flow

### **Day 3 Morning (3h) - Limits + Super Admin**
1. Create `usageTracking.js` middleware
2. Create billing page
3. Create super admin routes + UI
4. Test: Limits enforcement

### **Day 3 Afternoon (3h) - Landing Page**
1. Create public routes
2. Create landing page
3. Create pricing page
4. Test: Public access

---

## 🧪 TESTING COMMANDS

```bash
# Test organization isolation
curl -H "Authorization: Bearer $TOKEN_ORG_A" http://localhost:8102/api/v1/job-postings
# Should NOT return org B's data

# Test usage limits (as FREE user)
# Create 11 analyses -> 11th should fail with 403

# Test onboarding
# Register new user -> should redirect to /onboarding

# Test super admin
curl -H "Authorization: Bearer $SUPER_ADMIN_TOKEN" \
  http://localhost:8102/api/v1/super-admin/stats
```

---

## ⚠️ GOTCHAS

1. **Migration Data Loss:** Default org needed for existing users
2. **Middleware Order:** `authenticateToken` → `enforceOrganizationIsolation`
3. **Controller Updates:** ALL 23 controllers need `organizationId`
4. **Frontend Auth:** Check onboarding status on every auth route
5. **Cron Job:** Add to `src/index.js` startup
6. **Super Admin:** Create manually in DB first time

---

## 📊 PLAN LIMITS REFERENCE

| Plan | Analysis/mo | CVs/mo | Users | Price |
|------|-------------|--------|-------|-------|
| FREE | 10 | 50 | 2 | $0 |
| PRO | 100 | 500 | 10 | $99 |
| ENTERPRISE | ∞ | ∞ | ∞ | Custom |

---

## 🎯 SUCCESS CRITERIA

- [ ] User A cannot see User B's data (different orgs)
- [ ] User A can see User B's data (same org)
- [ ] New user completes onboarding
- [ ] FREE user blocked at 11 analyses
- [ ] Super admin sees all organizations
- [ ] Landing page accessible without login

---

## 📞 HELP

**Stuck?** Check:
1. Full plan: [saas-transformation-plan.md](saas-transformation-plan.md)
2. CLAUDE.md: Main guide
3. Existing code: Look at similar patterns

**Questions:**
- Organization not saving? Check migration ran
- 403 errors? Check middleware order
- Onboarding loop? Check `onboardingCompleted` flag

---

**Ready to implement? Let's go! 🚀**

**Estimated: 2-3 focused days | Result: Production SaaS**
