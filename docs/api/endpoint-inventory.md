# API Endpoint Inventory

**Total Endpoints:** 141
**Last Updated:** 2025-11-04
**Worker:** Claude (Sonnet 4.5)

---

## Summary by Category

| Category | File | Endpoints | Auth Required | Admin Only |
|----------|------|-----------|---------------|------------|
| Analysis Chat | analysisChatRoutes.js | 2 | Yes | 0 |
| Analysis | analysisRoutes.js | 10 | Yes | 2 |
| Analytics (Offers) | analyticsOfferRoutes.js | 4 | Yes | 1 |
| Analytics | analyticsRoutes.js | 5 | Yes | 2 |
| Attachments | attachmentRoutes.js | 3 | Yes | 0 |
| **Authentication** | authRoutes.js | **5** | Partial | 0 |
| Cache | cacheRoutes.js | 3 | Yes | 3 |
| **Candidates** | candidateRoutes.js | **7** | Yes | 2 |
| Categories | categoryRoutes.js | 6 | Yes | 2 |
| Dashboard (Comprehensive) | comprehensiveDashboardRoutes.js | 1 | Yes | 0 |
| Dashboard | dashboardRoutes.js | 1 | Yes | 0 |
| Error Logging | errorLoggingRoutes.js | 4 | Yes | 4 |
| **Interviews** | interviewRoutes.js | **8** | Yes | 2 |
| **Job Postings** | jobPostingRoutes.js | **7** | Yes | 2 |
| Metrics | metricsRoutes.js | 1 | Yes | 1 |
| Milvus Sync | milvusSyncRoutes.js | 2 | Yes | 2 |
| Negotiations | negotiationRoutes.js | 3 | Yes | 1 |
| **Offers** | offerRoutes.js | **15** | Yes | 3 |
| Onboarding | onboardingRoutes.js | 3 | Partial | 0 |
| Organizations | organizationRoutes.js | 3 | Yes | 1 |
| Public Offers | publicOfferRoutes.js | 3 | No | 0 |
| Queue | queueRoutes.js | 3 | Yes | 3 |
| Revisions | revisionRoutes.js | 1 | Yes | 0 |
| Smart Search | smartSearchRoutes.js | 2 | Yes | 0 |
| Super Admin | superAdminRoutes.js | 5 | Yes | 5 |
| **Team** | teamRoutes.js | **7** | Yes | 2 |
| Templates | templateRoutes.js | 8 | Yes | 2 |
| Tests | testRoutes.js | 8 | Yes | 2 |
| Users | userRoutes.js | 11 | Yes | 3 |

**Total:** 141 endpoints

---

## Core Categories (Primary Features)

These are the main HR recruitment workflow endpoints:

1. **Authentication (5)** - Login, register, refresh, logout, verify
2. **Job Postings (7)** - CRUD + search + statistics
3. **Candidates (7)** - CRUD + upload CV + search
4. **Analysis (10)** - CV analysis + results + filtering
5. **Offers (15)** - CRUD + status updates + negotiations
6. **Interviews (8)** - CRUD + scheduling + feedback
7. **Team (7)** - Invite, accept, remove, list members

**Core Total:** 59 endpoints (42% of all endpoints)

---

## SaaS & Admin Features

8. **Organizations (3)** - Get info, update settings, usage stats
9. **Users (11)** - Profile, update, list, role management
10. **Onboarding (3)** - Multi-step wizard for new users
11. **Super Admin (5)** - System-wide management (SUPER_ADMIN only)
12. **Dashboard (2)** - Analytics and stats (comprehensive + basic)

**SaaS Total:** 24 endpoints (17% of all endpoints)

---

## Supporting Features

13. **Analytics (5)** - Dashboard stats, reports, insights
14. **Analytics Offers (4)** - Offer-specific analytics
15. **Templates (8)** - Email templates, document templates
16. **Categories (6)** - Job categories, skill categories
17. **Attachments (3)** - File upload/download
18. **Negotiations (3)** - Salary negotiations

**Supporting Total:** 29 endpoints (21% of all endpoints)

---

## AI & Advanced Features

19. **Analysis Chat (2)** - AI chat for candidate questions
20. **Smart Search (2)** - Semantic search with Milvus
21. **Milvus Sync (2)** - Vector database synchronization (admin)

**AI Total:** 6 endpoints (4% of all endpoints)

---

## System & Infrastructure

22. **Queue (3)** - BullMQ job queue health/stats (admin)
23. **Cache (3)** - Redis cache management (admin)
24. **Error Logging (4)** - Error tracking and logs (admin)
25. **Metrics (1)** - System metrics (admin)
26. **Tests (8)** - Testing utilities (development)
27. **Revisions (1)** - Document revisions

**System Total:** 20 endpoints (14% of all endpoints)

---

## Public Endpoints (No Auth)

28. **Public Offers (3)** - Public job offer pages (no login required)

**Public Total:** 3 endpoints (2% of all endpoints)

---

## Endpoint Breakdown by Method

| Method | Count | Percentage |
|--------|-------|------------|
| GET | ~65 | 46% |
| POST | ~40 | 28% |
| PUT/PATCH | ~25 | 18% |
| DELETE | ~11 | 8% |

**Note:** Exact counts require detailed file analysis (estimated from patterns)

---

## Authentication Requirements

| Access Level | Endpoints | Percentage |
|--------------|-----------|------------|
| Public (No Auth) | 3 | 2% |
| Authenticated (All Roles) | ~50 | 35% |
| RBAC Protected (HR Roles) | ~70 | 50% |
| Admin Only (SUPER_ADMIN/ADMIN) | ~18 | 13% |

---

## Role-Based Access Summary

| Role | Accessible Endpoints | Notes |
|------|---------------------|-------|
| **SUPER_ADMIN** | 141 (100%) | All endpoints, cross-org access |
| **ADMIN** | ~120 (85%) | All org endpoints, no system admin |
| **MANAGER** | ~90 (64%) | Can create/edit, cannot delete |
| **HR_SPECIALIST** | ~80 (57%) | Candidates, interviews, limited |
| **USER** | ~20 (14%) | Dashboard, profile only |

---

## Critical Endpoints (High Usage)

1. `POST /api/v1/auth/login` - Authentication
2. `GET /api/v1/job-postings` - List job postings
3. `POST /api/v1/analyses` - Upload CV for analysis
4. `GET /api/v1/candidates` - List candidates
5. `GET /api/v1/dashboard` - Dashboard data
6. `POST /api/v1/offers` - Create job offers
7. `GET /api/v1/team` - List team members

---

## Recent Additions (SaaS Transformation)

These endpoints were added during the multi-tenant SaaS transformation (v13.0):

- `GET /api/v1/organization/usage` - Usage statistics
- `POST /api/v1/team/invite` - Team invitations
- `POST /api/v1/onboarding/*` - Onboarding wizard (3 endpoints)
- `GET /api/v1/super-admin/*` - Super admin dashboard (5 endpoints)

---

## File Locations

All route files are in: `/home/asan/Desktop/ikai/backend/src/routes/`

Controllers are in: `/home/asan/Desktop/ikai/backend/src/controllers/`

Middleware (RBAC): `/home/asan/Desktop/ikai/backend/src/middleware/authorize.js`

---

## Next Steps

1. ✅ Document in OpenAPI 3.0 format (`openapi.json`)
2. ✅ Create Markdown documentation (`README.md`)
3. ✅ Generate Postman collection (`postman-collection.json`)
4. ✅ Add request/response examples for each endpoint
5. ✅ Document RBAC permissions per endpoint
6. ✅ Add error response schemas

---

**Generated by:** Worker Claude (Sonnet 4.5)
**Date:** 2025-11-04
**Task:** W1 - API Documentation (Phase 1/4)
