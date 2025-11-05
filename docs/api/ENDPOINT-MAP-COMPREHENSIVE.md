# IKAI HR Platform - Comprehensive API Endpoint Map

**Generated:** 2025-11-05  
**Purpose:** Complete API reference for E2E testing  
**Total Route Files:** 29  
**Total Lines of Route Code:** 4,529  

---

## Table of Contents

1. [Authentication](#1-authentication)
2. [Job Postings](#2-job-postings)
3. [Candidates](#3-candidates)
4. [Analysis](#4-analysis)
5. [AI Chat](#5-ai-chat)
6. [Interviews](#6-interviews)
7. [Job Offers](#7-job-offers)
8. [Dashboard](#8-dashboard)
9. [Users](#9-users)
10. [Notifications](#10-notifications)
11. [Onboarding](#11-onboarding)
12. [Team Management](#12-team-management)
13. [Organization](#13-organization)
14. [Super Admin](#14-super-admin)
15. [Queue Management](#15-queue-management)
16. [Analytics](#16-analytics)
17. [Templates](#17-templates)
18. [Categories](#18-categories)
19. [Miscellaneous](#19-miscellaneous)

---

## Role Groups Reference

```javascript
ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  ADMIN: 'ADMIN',
  MANAGER: 'MANAGER',
  HR_SPECIALIST: 'HR_SPECIALIST',
  USER: 'USER'
}

ROLE_GROUPS = {
  ADMINS: [SUPER_ADMIN, ADMIN],
  MANAGERS_PLUS: [SUPER_ADMIN, ADMIN, MANAGER],
  HR_MANAGERS: [SUPER_ADMIN, ADMIN, MANAGER, HR_SPECIALIST],
  ANALYTICS_VIEWERS: [SUPER_ADMIN, ADMIN, MANAGER, HR_SPECIALIST],
  ALL_AUTHENTICATED: [SUPER_ADMIN, ADMIN, MANAGER, HR_SPECIALIST, USER]
}
```

---

## 1. Authentication

**Base Path:** `/api/v1/auth`  
**File:** `authRoutes.js` (60 lines)

### Public Endpoints (No Auth Required)

#### POST /api/v1/auth/register
- **Body:** `{email, password}` (min 8 chars)
- **Response:** `{token, user}`
- **Validation:** Email format, password length
- **Rate Limit:** 100 requests / 15 minutes

#### POST /api/v1/auth/login
- **Body:** `{email, password}`
- **Response:** `{token, user}`
- **Validation:** Email format, password required
- **Rate Limit:** 100 requests / 15 minutes

### Protected Endpoints (Auth Required)

#### POST /api/v1/auth/logout
- **Role:** ALL_AUTHENTICATED
- **Response:** `{success: true}`

#### GET /api/v1/auth/me
- **Role:** ALL_AUTHENTICATED
- **Response:** `{id, email, role, organizationId, ...}`

#### POST /api/v1/auth/refresh
- **Role:** ALL_AUTHENTICATED
- **Response:** `{token}`

---

## 2. Job Postings

**Base Path:** `/api/v1/job-postings`  
**File:** `jobPostingRoutes.js` (67 lines)

#### GET /api/v1/job-postings
- **Role:** HR_MANAGERS (HR_SPECIALIST, MANAGER, ADMIN, SUPER_ADMIN)
- **Response:** `[{id, title, department, details, notes, createdAt, userId}]`
- **Note:** User sees their own, ADMIN sees all in org

#### POST /api/v1/job-postings
- **Role:** HR_MANAGERS
- **Body:** `{title, department, details, notes?}`
- **Validation:**
  - `title`: 3-200 chars
  - `department`: 2-100 chars
  - `details`: min 10 chars
- **Response:** `{id, title, ...}`

#### GET /api/v1/job-postings/:id
- **Role:** HR_MANAGERS
- **Response:** `{id, title, department, details, notes, createdAt, userId}`

#### PUT /api/v1/job-postings/:id
- **Role:** HR_MANAGERS
- **Body:** `{title, department, details, notes?}`
- **Validation:** Same as POST
- **Response:** `{id, title, ...}`

#### DELETE /api/v1/job-postings/:id
- **Role:** ADMINS (ADMIN, SUPER_ADMIN)
- **Response:** `{success: true}`

#### GET /api/v1/job-postings/export/xlsx
- **Role:** HR_MANAGERS
- **Response:** Excel file download

#### GET /api/v1/job-postings/export/csv
- **Role:** HR_MANAGERS
- **Response:** CSV file download

---

## 3. Candidates

**Base Path:** `/api/v1/candidates`  
**File:** `candidateRoutes.js` (52 lines)

#### GET /api/v1/candidates
- **Role:** HR_MANAGERS
- **Response:** `[{id, firstName, lastName, email, cvFileName, createdAt, userId}]`

#### POST /api/v1/candidates/check-duplicate
- **Role:** HR_MANAGERS
- **Body:** `{fileName, fileHash}`
- **Response:** `{isDuplicate: boolean, existingCandidate?}`

#### POST /api/v1/candidates/upload
- **Role:** HR_MANAGERS
- **Body:** `multipart/form-data` (file: cv)
- **Middleware:** `trackCvUpload` (checks monthly limit)
- **Response:** `{id, cvFileName, cvUrl, ...}`

#### GET /api/v1/candidates/:id
- **Role:** HR_MANAGERS
- **Response:** `{id, firstName, lastName, email, cvFileName, cvUrl, ...}`

#### DELETE /api/v1/candidates/:id
- **Role:** ADMINS
- **Response:** `{success: true}`

#### GET /api/v1/candidates/export/xlsx
- **Role:** HR_MANAGERS
- **Response:** Excel file download

#### GET /api/v1/candidates/export/csv
- **Role:** HR_MANAGERS
- **Response:** CSV file download

---

## 4. Analysis

**Base Path:** `/api/v1/analyses`  
**File:** `analysisRoutes.js` (97 lines)

#### POST /api/v1/analyses
- **Role:** HR_MANAGERS
- **Body:** `{jobPostingId: UUID, candidateIds: [UUID]}`
- **Middleware:** `trackAnalysisUsage` (checks monthly limit)
- **Validation:**
  - `jobPostingId`: Valid UUID
  - `candidateIds`: Array, min 1 UUID
- **Response:** `{id, jobPostingId, status: 'PENDING', createdAt, ...}`
- **Note:** Triggers BullMQ analysis job

#### GET /api/v1/analyses
- **Role:** ALL_AUTHENTICATED
- **Response:** `[{id, jobPostingId, status, createdAt, results: [...]}]`
- **Note:** READ-ONLY for USER role

#### GET /api/v1/analyses/:id
- **Role:** ALL_AUTHENTICATED
- **Response:** `{id, jobPosting: {...}, status, results: [{candidate, score, ...}]}`

#### DELETE /api/v1/analyses/:id
- **Role:** ADMINS
- **Response:** `{success: true}`

#### POST /api/v1/analyses/:id/add-candidates
- **Role:** HR_MANAGERS
- **Body:** `{candidateIds: [UUID]}`
- **Response:** `{id, updated results}`

#### GET /api/v1/analyses/:id/export/xlsx
- **Role:** HR_MANAGERS
- **Response:** Excel file with analysis results

#### GET /api/v1/analyses/:id/export/csv
- **Role:** HR_MANAGERS
- **Response:** CSV file with analysis results

#### GET /api/v1/analyses/:id/export/html
- **Role:** HR_MANAGERS
- **Response:** HTML report

#### POST /api/v1/analyses/:id/send-email
- **Role:** HR_MANAGERS
- **Body:** `{recipientEmail, formats: ['xlsx', 'csv', 'html']}`
- **Response:** `{success: true, message}`

#### POST /api/v1/analyses/:id/send-feedback
- **Role:** HR_MANAGERS
- **Body:** `{scoreThreshold?: 0-100, candidateIds?: [UUID]}`
- **Response:** `{success: true, sent: number}`

---

## 5. AI Chat

**Base Path:** `/api/v1/analyses/:id`  
**File:** `analysisChatRoutes.js` (218 lines)

#### POST /api/v1/analyses/:id/chat
- **Role:** HR_MANAGERS
- **Body:** `{message: string, conversationHistory?: [], clientVersion?: string}`
- **Middleware:** `chatRateLimiter`
- **Validation:** Message non-empty
- **Response:** `{success, messageId, reply, candidateCount, responseTime, timestamp}`
- **Note:** Uses Gemini AI + Full context (no vector search)

#### GET /api/v1/analyses/:id/history
- **Role:** HR_MANAGERS
- **Query:** `?limit=50&offset=0`
- **Response:** `{success, messages: [{message, response, candidateCount, responseTime, createdAt}], total, limit, offset}`

#### GET /api/v1/analyses/:id/chat-stats
- **Role:** HR_MANAGERS
- **Response:** `{success, contextLoaded: boolean, candidateCount, ready: boolean}`
- **Note:** Returns stats only if analysis status is COMPLETED

---

## 6. Interviews

**Base Path:** `/api/v1/interviews`  
**File:** `interviewRoutes.js` (48 lines)

### Wizard Endpoints

#### GET /api/v1/interviews/candidates/recent
- **Role:** HR_MANAGERS
- **Response:** `[{id, firstName, lastName, jobPosting, analysisScore}]`

#### POST /api/v1/interviews/check-conflicts
- **Role:** HR_MANAGERS
- **Body:** `{date, time, candidateIds: [UUID]}`
- **Response:** `{conflicts: [{candidateId, existingInterview}]}`

### CRUD Endpoints

#### GET /api/v1/interviews/stats
- **Role:** HR_MANAGERS
- **Response:** `{total, scheduled, completed, cancelled}`

#### GET /api/v1/interviews
- **Role:** HR_MANAGERS
- **Query:** `?status=scheduled&fromDate=...&toDate=...`
- **Response:** `[{id, date, time, type, status, candidates: [...]}]`

#### GET /api/v1/interviews/:id
- **Role:** HR_MANAGERS
- **Response:** `{id, date, time, type, status, location, notes, candidates: [...]}`

#### POST /api/v1/interviews
- **Role:** HR_MANAGERS
- **Body:** `{date, time, type, location?, notes?, candidateIds: [UUID]}`
- **Response:** `{id, date, time, ...}`

#### PATCH /api/v1/interviews/:id/status
- **Role:** HR_MANAGERS
- **Body:** `{status: 'scheduled'|'completed'|'cancelled', notes?}`
- **Response:** `{id, status, ...}`

#### DELETE /api/v1/interviews/:id
- **Role:** MANAGERS_PLUS (MANAGER, ADMIN, SUPER_ADMIN)
- **Response:** `{success: true}`

---

## 7. Job Offers

**Base Path:** `/api/v1/offers`  
**File:** `offerRoutes.js` (44 lines)

#### POST /api/v1/offers/wizard
- **Role:** HR_MANAGERS
- **Body:** `{candidateId, jobPostingId, salary, startDate, benefits?, notes?}`
- **Response:** `{id, candidateId, jobPostingId, ...}`

#### POST /api/v1/offers
- **Role:** HR_MANAGERS
- **Body:** `{candidateId, jobPostingId, title, salary, startDate, ...}`
- **Response:** `{id, status: 'draft', ...}`

#### GET /api/v1/offers
- **Role:** HR_MANAGERS
- **Query:** `?status=pending&fromDate=...&toDate=...`
- **Response:** `[{id, candidate, jobPosting, salary, status, ...}]`

#### POST /api/v1/offers/bulk-send
- **Role:** HR_MANAGERS
- **Body:** `{offerIds: [UUID]}`
- **Response:** `{success: true, sent: number}`

#### GET /api/v1/offers/:id
- **Role:** HR_MANAGERS
- **Response:** `{id, candidate, jobPosting, salary, benefits, status, ...}`

#### PUT /api/v1/offers/:id
- **Role:** HR_MANAGERS
- **Body:** `{salary?, startDate?, benefits?, notes?}`
- **Response:** `{id, updated fields}`

#### DELETE /api/v1/offers/:id
- **Role:** MANAGERS_PLUS
- **Response:** `{success: true}`

#### PATCH /api/v1/offers/:id/send
- **Role:** HR_MANAGERS
- **Response:** `{success: true, status: 'pending'}`

#### GET /api/v1/offers/:id/preview-pdf
- **Role:** HR_MANAGERS
- **Response:** PDF preview

#### GET /api/v1/offers/:id/download-pdf
- **Role:** HR_MANAGERS
- **Response:** PDF download

### Approval Workflow

#### PATCH /api/v1/offers/:id/request-approval
- **Role:** HR_MANAGERS
- **Response:** `{id, status: 'pending_approval', ...}`

#### PATCH /api/v1/offers/:id/approve
- **Role:** HR_MANAGERS
- **Response:** `{id, status: 'approved', ...}`

#### PATCH /api/v1/offers/:id/reject-approval
- **Role:** HR_MANAGERS
- **Body:** `{reason: string}`
- **Response:** `{id, status: 'rejected', ...}`

### Expiration Management

#### PATCH /api/v1/offers/:id/expire
- **Role:** HR_MANAGERS
- **Response:** `{id, status: 'expired', ...}`

#### PATCH /api/v1/offers/:id/extend
- **Role:** HR_MANAGERS
- **Body:** `{newExpiryDate: string}`
- **Response:** `{id, expiryDate, ...}`

---

## 8. Dashboard

**Base Path:** `/api/v1/dashboard`  
**File:** `dashboardRoutes.js` (1,028 lines)

### Generic Dashboard

#### GET /api/v1/dashboard
- **Role:** ALL_AUTHENTICATED
- **Response:** `{role, endpoint: '/api/v1/dashboard/user', message}`
- **Note:** Returns role-specific endpoint URL

#### GET /api/v1/dashboard/stats
- **Role:** ADMINS + MANAGER
- **Response:** `{activePostings, todayCVs, weekAnalyses, ...}`

### USER Dashboard

#### GET /api/v1/dashboard/user
- **Role:** ALL_AUTHENTICATED
- **Response:**
```json
{
  "profile": {
    "completion": 80,
    "missingFields": 1
  },
  "notifications": {
    "unread": 5,
    "latest": {...}
  },
  "activity": {
    "loginTime": "10:30",
    "currentTime": "14:45:30"
  },
  "recentNotifications": [...],
  "activityTimeline": [
    {"date": "Pzt", "count": 3},
    ...
  ]
}
```

### HR_SPECIALIST Dashboard

#### GET /api/v1/dashboard/hr-specialist
- **Role:** HR_MANAGERS
- **Response:**
```json
{
  "overview": {
    "activePostings": 15,
    "todayCVs": 12,
    "thisWeekAnalyses": 8
  },
  "jobPostings": {
    "activePostings": 15,
    "todayApplications": 12
  },
  "cvAnalytics": {
    "weekCVs": 45,
    "weekAnalyses": 8,
    "avgScore": 76,
    "pendingCVs": 23
  },
  "recentAnalyses": [
    {
      "id": "...",
      "jobPosting": {"title": "..."},
      "candidateCount": 10,
      "topScore": 87
    }
  ],
  "pipeline": [
    {"stage": "Başvurular", "count": 100, "percentage": 100},
    {"stage": "Eleme", "count": 60, "percentage": 60},
    {"stage": "Mülakat", "count": 20, "percentage": 20},
    {"stage": "Teklif", "count": 8, "percentage": 8},
    {"stage": "İşe Alım", "count": 3, "percentage": 3}
  ],
  "interviews": [...],
  "monthlyStats": {
    "applications": 120,
    "applicationsChange": 15,
    "analyses": 25,
    "analysesChange": 10,
    "interviews": 18,
    "interviewsChange": 8,
    "offers": 10,
    "offersChange": 5,
    "hires": 4,
    "hiresChange": 2,
    "conversionRate": 3.3,
    "conversionChange": 0.5
  }
}
```

### MANAGER Dashboard

#### GET /api/v1/dashboard/manager
- **Role:** MANAGERS_PLUS
- **Response:** (similar to HR_SPECIALIST with team/department focus)

### ADMIN Dashboard

#### GET /api/v1/dashboard/admin
- **Role:** ADMINS
- **Response:**
```json
{
  "orgStats": {
    "totalUsers": 25,
    "activeToday": null,
    "plan": "PRO"
  },
  "userManagement": {...},
  "billing": {
    "monthlyAmount": 99,
    "nextBillingDate": "2025-12-01"
  },
  "usageTrend": [
    {
      "date": "5 Kas",
      "analyses": 3,
      "cvs": 12,
      "activeUsers": null
    }
  ],
  "teamActivity": [],
  "security": {
    "twoFactorUsers": 0,
    "activeSessions": null,
    "complianceScore": 0
  },
  "health": {
    "score": 75,
    "factors": [
      {"name": "Kullanıcı Aktivitesi", "score": 0, "status": "warning"},
      {"name": "Güvenlik", "score": 0, "status": "warning"},
      {"name": "Kullanım Oranı", "score": 30, "status": "good"},
      {"name": "Sistem Sağlığı", "score": 100, "status": "good"}
    ]
  }
}
```

### SUPER_ADMIN Dashboard

#### GET /api/v1/dashboard/super-admin
- **Role:** SUPER_ADMIN
- **Note:** NO organizationIsolation - sees ALL organizations
- **Response:**
```json
{
  "overview": {
    "totalOrganizations": 10,
    "monthlyRevenue": 990,
    "totalUsers": 150,
    "uptime": 99.9,
    "activeAnalyses": 350
  },
  "organizations": {
    "total": 10,
    "planCounts": [
      {"plan": "FREE", "_count": 5},
      {"plan": "PRO", "_count": 4},
      {"plan": "ENTERPRISE", "_count": 1}
    ],
    "activeOrgs": 9,
    "churnedOrgs": 1
  },
  "revenue": {
    "mrr": 990,
    "mrrGrowth": 15,
    "avgLTV": 1188,
    "enterprise": 0,
    "pro": 990
  },
  "analytics": {
    "totalAnalyses": 350,
    "totalCVs": 1500,
    "totalJobPostings": 120,
    "totalOffers": 45,
    "analysesGrowth": 20,
    "cvsGrowth": 18,
    "jobsGrowth": 10,
    "offersGrowth": 12
  },
  "growth": {
    "chartData": [...],
    "metrics": {
      "orgGrowth": 5,
      "userGrowth": 8,
      "revenueGrowth": 15,
      "activityGrowth": 18
    }
  },
  "systemHealth": {
    "backend": "healthy",
    "database": "healthy",
    "redis": "healthy",
    "milvus": "healthy",
    "queues": "healthy",
    "uptime": 99.9,
    "apiResponseTime": 180,
    "dbConnections": 15,
    "cacheHitRate": 85,
    "vectorCount": 350,
    "queueJobs": 5
  },
  "orgList": [...],
  "queues": [...],
  "security": {...}
}
```

---

## 9. Users

**Base Path:** `/api/v1/users`  
**File:** `userRoutes.js` (48 lines)

### Current User Endpoints (All Authenticated)

#### GET /api/v1/users/me
- **Role:** ALL_AUTHENTICATED
- **Response:** `{id, email, firstName, lastName, role, organizationId, ...}`

#### PATCH /api/v1/users/me
- **Role:** ALL_AUTHENTICATED
- **Body:** `{firstName?, lastName?, avatar?, position?}`
- **Response:** `{id, updated fields}`

#### GET /api/v1/users/me/stats
- **Role:** ALL_AUTHENTICATED
- **Response:** `{profileCompletion, notificationCount, ...}`

#### GET /api/v1/users/me/sessions
- **Role:** ALL_AUTHENTICATED
- **Response:** `[{sessionId, ip, device, lastActive}]`

#### GET /api/v1/users/me/notifications
- **Role:** ALL_AUTHENTICATED
- **Response:** `{preferences: [{type, enabled, emailEnabled}]}`

#### PATCH /api/v1/users/me/notifications
- **Role:** ALL_AUTHENTICATED
- **Body:** `{preferences: [{type, enabled, emailEnabled}]}`
- **Response:** `{updated preferences}`

#### PATCH /api/v1/users/me/password
- **Role:** ALL_AUTHENTICATED
- **Body:** `{currentPassword, newPassword}`
- **Response:** `{success: true}`

### User Management (ADMINS Only)

#### GET /api/v1/users
- **Role:** ADMINS
- **Query:** `?page=1&limit=10&search=...&role=...`
- **Response:** `{users: [...], pagination: {...}}`

#### GET /api/v1/users/:id
- **Role:** ADMINS
- **Response:** `{id, email, firstName, lastName, role, ...}`

#### POST /api/v1/users
- **Role:** ADMINS
- **Body:** `{email, firstName?, lastName?, role, password}`
- **Response:** `{id, email, role, ...}`

#### PUT /api/v1/users/:id
- **Role:** ADMINS
- **Body:** `{email?, firstName?, lastName?, role?}`
- **Response:** `{id, updated fields}`

#### DELETE /api/v1/users/:id
- **Role:** ADMINS
- **Response:** `{success: true}`

#### PATCH /api/v1/users/:id/password
- **Role:** ADMINS
- **Body:** `{newPassword}`
- **Response:** `{success: true}`

---

## 10. Notifications

**Base Path:** `/api/v1/notifications`  
**File:** `notificationRoutes.js` (77 lines)

#### GET /api/v1/notifications
- **Role:** ALL_AUTHENTICATED
- **Query:** `?read=false&type=ANALYSIS_COMPLETE&page=1&limit=20`
- **Response:** `{notifications: [...], pagination: {...}}`

#### GET /api/v1/notifications/unread-count
- **Role:** ALL_AUTHENTICATED
- **Response:** `{count: 5}`

#### PATCH /api/v1/notifications/read-all
- **Role:** ALL_AUTHENTICATED
- **Response:** `{success: true, updated: 5}`

#### PATCH /api/v1/notifications/:id/read
- **Role:** ALL_AUTHENTICATED
- **Response:** `{success: true}`

### Notification Preferences

#### GET /api/v1/notifications/preferences
- **Role:** ALL_AUTHENTICATED
- **Response:** `{preferences: [{type, enabled, emailEnabled}]}`

#### PUT /api/v1/notifications/preferences
- **Role:** ALL_AUTHENTICATED
- **Body:** `{preferences: [{type, enabled, emailEnabled}]}`
- **Response:** `{preferences: [...]}`

#### PUT /api/v1/notifications/preferences/:type
- **Role:** ALL_AUTHENTICATED
- **Body:** `{enabled: true, emailEnabled: false}`
- **Response:** `{preference: {...}}`

**Notification Types (15):**
- `ANALYSIS_COMPLETE`, `ANALYSIS_FAILED`
- `INTERVIEW_SCHEDULED`, `INTERVIEW_REMINDER`, `INTERVIEW_CANCELLED`
- `OFFER_SENT`, `OFFER_ACCEPTED`, `OFFER_REJECTED`, `OFFER_EXPIRING`
- `FEEDBACK_SENT`, `FEEDBACK_RECEIVED`
- `TEAM_INVITATION`
- `USAGE_LIMIT_WARNING`, `USAGE_LIMIT_REACHED`
- `SYSTEM_ANNOUNCEMENT`

---

## 11. Onboarding

**Base Path:** `/api/v1/onboarding`  
**File:** `onboardingRoutes.js` (122 lines)

#### POST /api/v1/onboarding/update-step
- **Role:** ALL_AUTHENTICATED
- **Body:** `{step: 0-5, data: {name?, industry?, size?, logo?}}`
- **Validation:** step must be 0-5
- **Response:** `{currentStep, organization: {...}}`

#### POST /api/v1/onboarding/complete
- **Role:** ALL_AUTHENTICATED
- **Response:** `{success: true, message: 'Onboarding tamamlandı! 🎉', organization: {...}}`
- **Note:** Sets `onboardingCompleted: true`, `onboardingStep: 5`, `isOnboarded: true`

#### GET /api/v1/onboarding/status
- **Role:** ALL_AUTHENTICATED
- **Response:** `{onboardingCompleted, onboardingStep, name, industry, size}`

**Onboarding Steps:**
0. Start
1. Company Info (name, industry, size, logo)
2. Job Posting (create first job)
3. CV Upload (upload first CVs)
4. Team Invitation (invite team members)
5. Complete

---

## 12. Team Management

**Base Path:** `/api/v1/team`  
**File:** `teamRoutes.js` (55 lines)

#### POST /api/v1/team/accept-invitation
- **Role:** PUBLIC (no auth)
- **Body:** `{token: string, password: string}`
- **Response:** `{success: true, user: {...}}`

#### GET /api/v1/team
- **Role:** MANAGERS_PLUS (MANAGER can view)
- **Query:** `?role=HR_SPECIALIST&isActive=true`
- **Response:** `[{id, email, firstName, lastName, role, isActive, ...}]`

#### GET /api/v1/team/stats
- **Role:** MANAGERS_PLUS
- **Response:** `{total, active, byRole: {ADMIN: 2, HR_SPECIALIST: 5, ...}}`

#### GET /api/v1/team/hierarchy
- **Role:** MANAGERS_PLUS
- **Response:** `{ADMIN: [...], MANAGER: [...], HR_SPECIALIST: [...], USER: [...]}`

#### GET /api/v1/team/:id
- **Role:** MANAGERS_PLUS
- **Response:** `{id, email, firstName, lastName, role, ...}`

#### POST /api/v1/team/invite
- **Role:** MANAGERS_PLUS
- **Body:** `{email, role, firstName?, lastName?}`
- **Response:** `{success: true, invitation: {...}, message}`
- **Note:** Sends invitation email

#### PATCH /api/v1/team/:id
- **Role:** MANAGERS_PLUS
- **Body:** `{firstName?, lastName?, role?}`
- **Response:** `{id, updated fields}`

#### PATCH /api/v1/team/:id/toggle
- **Role:** MANAGERS_PLUS
- **Response:** `{id, isActive: boolean, ...}`

#### DELETE /api/v1/team/:id
- **Role:** MANAGERS_PLUS
- **Response:** `{success: true}`

---

## 13. Organization

**Base Path:** `/api/v1/organization`  
**File:** `organizationRoutes.js` (149 lines)

#### GET /api/v1/organization/me
- **Role:** ALL_AUTHENTICATED
- **Response:** `{id, name, slug, plan, logo, industry, size, country, timezone, ...}`

#### PATCH /api/v1/organization/me
- **Role:** ADMINS
- **Body:** `{name?, logo?, primaryColor?, industry?, size?, country?, timezone?}`
- **Response:** `{id, updated fields}`

#### GET /api/v1/organization/me/usage
- **Role:** ALL_AUTHENTICATED
- **Response:**
```json
{
  "monthlyAnalysisCount": 8,
  "maxAnalysisPerMonth": 50,
  "monthlyCvCount": 45,
  "maxCvPerMonth": 200,
  "totalUsers": 6,
  "maxUsers": 10,
  "analyses": {
    "used": 8,
    "limit": 50,
    "remaining": 42
  },
  "cvs": {
    "used": 45,
    "limit": 200,
    "remaining": 155
  },
  "users": {
    "used": 6,
    "limit": 10,
    "remaining": 4
  },
  "percentages": {
    "analysis": 16,
    "cv": 22,
    "user": 60
  },
  "warnings": [
    {
      "type": "user",
      "message": "Kullanıcı limitinizin %60'ine ulaştınız",
      "severity": "warning"
    }
  ],
  "plan": "PRO"
}
```

---

## 14. Super Admin

**Base Path:** `/api/v1/super-admin`  
**File:** `superAdminRoutes.js` (1,774 lines)  
**Role:** SUPER_ADMIN ONLY (all endpoints)

### Organization Management

#### GET /api/v1/super-admin/organizations
- **Query:** `?page=1&limit=10&search=...&plan=PRO&isActive=true&sortBy=createdAt&sortOrder=desc`
- **Response:**
```json
{
  "data": [
    {
      "id": "...",
      "name": "Company X",
      "slug": "company-x-1234567890",
      "plan": "PRO",
      "isActive": true,
      "userCount": 8,
      "monthlyAnalysisCount": 12,
      "createdAt": "2025-11-01"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5
  }
}
```

#### POST /api/v1/super-admin/organizations
- **Body:** `{name, plan: 'FREE'|'PRO'|'ENTERPRISE'}`
- **Response:** `{id, name, slug, plan, limits, ...}`

#### GET /api/v1/super-admin/organizations/:id
- **Response:** `{id, name, plan, userCount, jobPostingCount, analysisCount, ...}`

#### PATCH /api/v1/super-admin/:id/toggle
- **Response:** `{id, isActive: boolean, message}`

#### PATCH /api/v1/super-admin/:id/plan
- **Body:** `{plan: 'FREE'|'PRO'|'ENTERPRISE'}`
- **Response:** `{id, plan, new limits, message}`

#### DELETE /api/v1/super-admin/:id
- **Response:** `{success: true, message}`
- **Note:** Soft delete (sets isActive: false)

#### POST /api/v1/super-admin/:id/suspend
- **Response:** `{id, isActive: false, message}`

#### POST /api/v1/super-admin/:id/reactivate
- **Response:** `{id, isActive: true, message}`

### Statistics & Analytics

#### GET /api/v1/super-admin/stats
- **Response:**
```json
{
  "totalOrganizations": 10,
  "activeOrganizations": 9,
  "totalUsers": 150,
  "planBreakdown": {
    "FREE": 5,
    "PRO": 4,
    "ENTERPRISE": 1
  },
  "monthlyAnalyses": 350,
  "todayRegistrations": 2
}
```

#### GET /api/v1/super-admin/analytics
- **Query:** `?startDate=2025-10-01&endDate=2025-11-01` or `?days=30`
- **Response:**
```json
{
  "overview": {
    "totalOrganizations": 10,
    "activeOrganizations": 9,
    "totalUsers": 150,
    "activeUsers": 120,
    "totalJobPostings": 120,
    "totalCandidates": 1500,
    "totalAnalyses": 350
  },
  "growth": {
    "newOrganizations": 2,
    "newUsers": 15,
    "newJobPostings": 12,
    "period": "30 days"
  },
  "engagement": {
    "avgJobsPerOrg": 12,
    "avgUsersPerOrg": 15,
    "avgAnalysesPerJob": 3
  }
}
```

### System Health

#### GET /api/v1/super-admin/system-health
- **Response:**
```json
{
  "timestamp": "2025-11-05T...",
  "services": {
    "database": {
      "status": "healthy",
      "type": "PostgreSQL",
      "stats": {
        "total_users": 150,
        "total_orgs": 10,
        "total_analyses": 350
      }
    },
    "redis": {
      "status": "healthy",
      "type": "Redis",
      "connection": "localhost:8179"
    },
    "backend": {
      "status": "healthy",
      "type": "Express API",
      "uptime": 86400,
      "uptimeFormatted": "24h 0m"
    },
    "milvus": {
      "status": "healthy",
      "type": "Vector DB",
      "note": "Ping check not implemented"
    }
  },
  "system": {
    "cpuUsage": "1234.56ms",
    "memoryUsage": "150MB / 512MB",
    "memoryPercent": "29%",
    "diskUsage": "N/A"
  },
  "performance": {
    "avgResponseTime": "156ms",
    "requestsPerSecond": "342",
    "errorRate": "0.02%"
  },
  "overall": "healthy"
}
```

#### GET /api/v1/super-admin/database-stats
- **Response:**
```json
{
  "users": 150,
  "organizations": 10,
  "jobPostings": 120,
  "candidates": 1500,
  "analyses": 350,
  "offers": 45,
  "interviews": 80,
  "notifications": 2500,
  "databaseSize": "250 MB"
}
```

#### GET /api/v1/super-admin/redis-stats
- **Response:**
```json
{
  "connection": "localhost:8179",
  "status": "connected",
  "memory": {
    "usedMemory": "8.5M",
    "peakMemory": "12.3M",
    "fragmentationRatio": "1.05"
  }
}
```

#### GET /api/v1/super-admin/milvus-stats
- **Response:**
```json
{
  "status": "operational",
  "collections": [
    {
      "name": "cv_analysis_vectors",
      "estimatedCount": 350
    }
  ],
  "note": "Detailed Milvus metrics require client integration"
}
```

### Queue Management

#### GET /api/v1/super-admin/queues
- **Response:**
```json
[
  {
    "name": "analysis",
    "status": "active",
    "waiting": 3,
    "active": 2,
    "completed": 150,
    "failed": 1,
    "delayed": 0,
    "paused": 0
  },
  {
    "name": "email",
    "status": "active",
    "waiting": 5,
    "active": 1,
    "completed": 200,
    "failed": 0
  }
]
```

### User Management

#### GET /api/v1/super-admin/users
- **Query:** `?search=...&role=ADMIN&page=1&limit=50`
- **Response:**
```json
{
  "users": [
    {
      "id": "...",
      "email": "admin@company.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "ADMIN",
      "isActive": true,
      "createdAt": "...",
      "organization": {
        "id": "...",
        "name": "Company X",
        "plan": "PRO",
        "isActive": true
      }
    }
  ],
  "pagination": {...},
  "stats": {
    "total": 150,
    "byRole": {
      "SUPER_ADMIN": 1,
      "ADMIN": 10,
      "MANAGER": 20,
      "HR_SPECIALIST": 50,
      "USER": 69
    },
    "active": 145
  }
}
```

#### POST /api/v1/super-admin/users
- **Body:** `{email, firstName?, lastName?, role, organizationId, password}`
- **Response:** `{id, email, role, organization, ...}`

#### GET /api/v1/super-admin/users/:id
- **Response:** `{id, email, firstName, lastName, role, organization: {...}, ...}`

#### PATCH /api/v1/super-admin/users/:id
- **Body:** `{email?, firstName?, lastName?, role?, isActive?}`
- **Response:** `{id, updated fields, organization: {...}}`

#### DELETE /api/v1/super-admin/users/:id
- **Response:** `{success: true, message}`

#### POST /api/v1/super-admin/users/:id/activate
- **Response:** `{id, isActive: true, ...}`

#### POST /api/v1/super-admin/users/bulk-action
- **Body:** `{action: 'activate'|'deactivate'|'delete', userIds: [UUID]}`
- **Response:** `{success: true, count: number, message}`

### Security & Logs

#### GET /api/v1/super-admin/security-logs
- **Query:** `?limit=50`
- **Response:**
```json
{
  "stats": {
    "totalUsers": 150,
    "activeToday": 25,
    "activeThisWeek": 80,
    "newToday": 2,
    "suspiciousActivity": 0,
    "failedLogins": 0
  },
  "events": [
    {
      "id": "...",
      "event": "User Registration",
      "type": "success",
      "user": "user@example.com",
      "role": "USER",
      "organization": "Company X",
      "timestamp": "...",
      "ip": "***"
    }
  ]
}
```

#### GET /api/v1/super-admin/security-settings
- **Response:**
```json
{
  "authentication": {
    "twoFactorEnabled": false,
    "passwordComplexity": true,
    "sessionTimeout": 30
  },
  "accessControl": {
    "ipWhitelist": false,
    "apiRateLimit": true,
    "corsProtection": true
  },
  "stats": {
    "totalUsers": 150,
    "activeUsers": 145,
    "inactiveUsers": 5,
    "recentLogins": 25,
    "suspiciousActivity": 0
  }
}
```

#### POST /api/v1/super-admin/security-settings
- **Body:** `{...settings}`
- **Response:** `{success: true, message, data: {...}}`

#### GET /api/v1/super-admin/login-attempts
- **Query:** `?limit=50`
- **Response:**
```json
{
  "attempts": [...],
  "total": 50,
  "note": "Full login tracking requires dedicated table"
}
```

#### GET /api/v1/super-admin/audit-trail
- **Query:** `?limit=50`
- **Response:**
```json
{
  "entries": [
    {
      "id": "...",
      "action": "User Activity",
      "actor": "admin@company.com",
      "role": "ADMIN",
      "timestamp": "...",
      "organization": "Company X",
      "details": "Full audit trail requires dedicated logging"
    }
  ],
  "total": 50,
  "note": "Full audit trail requires dedicated audit_log table"
}
```

#### GET /api/v1/super-admin/logs
- **Query:** `?level=ERROR&limit=100`
- **Response:**
```json
{
  "logs": [
    {
      "level": "ERROR",
      "message": "...",
      "stack": "...",
      "timestamp": "...",
      "context": {...}
    }
  ],
  "count": 15,
  "date": "2025-11-05"
}
```

#### GET /api/v1/super-admin/logs/:id
- **Response:** `{level, message, stack, timestamp, context}`

### Settings & Export

#### GET /api/v1/super-admin/settings
- **Response:**
```json
{
  "general": {
    "platformName": "IKAI HR Platform",
    "defaultLanguage": "tr",
    "timezone": "Europe/Istanbul"
  },
  "notifications": {
    "emailEnabled": true,
    "smsEnabled": false,
    "pushEnabled": true,
    "webhookEnabled": false
  },
  "security": {
    "twoFactorRequired": false,
    "passwordComplexity": true,
    "sessionTimeout": 30
  },
  "performance": {
    "apiRateLimit": 1000,
    "cacheTTL": 300
  }
}
```

#### POST /api/v1/super-admin/settings
- **Body:** `{...settings}`
- **Response:** `{success: true, message, data: {...}}`

#### POST /api/v1/super-admin/export/:type
- **Params:** `type: 'users'|'analytics'|'logs'`
- **Body:** `{format: 'csv'|'pdf'}`
- **Response:** CSV/PDF file download
- **Note:** PDF export not implemented yet

---

## 15. Queue Management

**Base Path:** `/api/v1/queue`  
**File:** `queueRoutes.js` (181 lines)  
**Role:** SUPER_ADMIN ONLY (all endpoints)

#### GET /api/v1/queue/stats
- **Response:**
```json
{
  "success": true,
  "stats": [
    {
      "name": "analysis",
      "waiting": 3,
      "active": 2,
      "completed": 150,
      "failed": 1,
      "delayed": 0,
      "paused": 0
    }
  ]
}
```

#### GET /api/v1/queue/health
- **Response:**
```json
{
  "success": true,
  "overall": "healthy",
  "queues": [
    {
      "name": "analysis",
      "status": "healthy",
      "waiting": 3,
      "active": 2,
      "failed": 1
    }
  ],
  "system": {
    "redis": "connected",
    "workers": 5
  }
}
```

#### POST /api/v1/queue/cleanup
- **Response:**
```json
{
  "success": true,
  "results": {
    "analysis": {"completed": 50, "failed": 2},
    "email": {"completed": 100, "failed": 0}
  }
}
```

#### POST /api/v1/queue/:queueName/pause
- **Response:** `{success: true, message: 'Queue analysis has been paused'}`

#### POST /api/v1/queue/:queueName/resume
- **Response:** `{success: true, message: 'Queue analysis has been resumed'}`

#### DELETE /api/v1/queue/:queueName/clean
- **Query:** `?grace=3600` (seconds)
- **Response:**
```json
{
  "success": true,
  "message": "Queue analysis cleaned",
  "cleaned": {
    "completed": 50,
    "failed": 2
  }
}
```

#### GET /api/v1/queue/:queueName/failed
- **Query:** `?limit=10`
- **Response:**
```json
{
  "success": true,
  "queue": "analysis",
  "failed": [
    {
      "id": "...",
      "name": "analyse-candidates",
      "data": {...},
      "failedReason": "Gemini API rate limit",
      "stacktrace": "...",
      "timestamp": "...",
      "attemptsMade": 3
    }
  ],
  "total": 1
}
```

**Queue Names:**
- `analysis` - CV analysis with Gemini AI
- `offer` - Job offer generation
- `email` - Email sending
- `test-generation` - AI test creation
- `feedback` - Candidate feedback processing

---

## 16. Analytics

**Base Path:** `/api/v1/analytics`  
**File:** `analyticsRoutes.js` (46 lines)  
**Role:** ANALYTICS_VIEWERS (SUPER_ADMIN, ADMIN, MANAGER, HR_SPECIALIST)

#### GET /api/v1/analytics/summary
- **Response:**
```json
{
  "totalAnalyses": 350,
  "totalCandidates": 1500,
  "avgScore": 76,
  "topScoringCandidate": {
    "name": "...",
    "score": 95
  }
}
```

#### GET /api/v1/analytics/time-to-hire
- **Response:**
```json
{
  "avgTimeToHire": 18,
  "unit": "days",
  "breakdown": [
    {"stage": "Application", "avgDays": 2},
    {"stage": "Screening", "avgDays": 5},
    {"stage": "Interview", "avgDays": 7},
    {"stage": "Offer", "avgDays": 4}
  ]
}
```

#### GET /api/v1/analytics/funnel
- **Response:**
```json
{
  "stages": [
    {"name": "Applications", "count": 100, "percentage": 100},
    {"name": "Screening", "count": 60, "percentage": 60},
    {"name": "Interview", "count": 20, "percentage": 20},
    {"name": "Offer", "count": 8, "percentage": 8},
    {"name": "Hired", "count": 3, "percentage": 3}
  ]
}
```

#### GET /api/v1/analytics/score-distribution
- **Response:**
```json
{
  "distribution": [
    {"range": "0-20", "count": 5},
    {"range": "21-40", "count": 15},
    {"range": "41-60", "count": 50},
    {"range": "61-80", "count": 80},
    {"range": "81-100", "count": 30}
  ]
}
```

#### GET /api/v1/analytics/top-jobs
- **Response:**
```json
{
  "jobs": [
    {
      "id": "...",
      "title": "Senior Developer",
      "applications": 120,
      "hires": 5,
      "conversionRate": 4.2
    }
  ]
}
```

---

## 17. Templates

**Base Path:** `/api/v1/templates`  
**File:** `templateRoutes.js` (25 lines)  
**Role:** HR_MANAGERS (all endpoints)

#### POST /api/v1/templates
- **Body:**
```json
{
  "name": "Senior Developer Offer",
  "category": "FULL_TIME",
  "title": "Senior Software Developer",
  "salaryMin": 50000,
  "salaryMax": 80000,
  "benefits": ["Health insurance", "Remote work"],
  "content": "Template content..."
}
```
- **Response:** `{id, name, category, isActive, ...}`

#### GET /api/v1/templates
- **Query:** `?category=FULL_TIME&isActive=true`
- **Response:**
```json
[
  {
    "id": "...",
    "name": "Senior Developer Offer",
    "category": "FULL_TIME",
    "isActive": true,
    "createdAt": "..."
  }
]
```

#### GET /api/v1/templates/:id
- **Response:** `{id, name, category, title, salaryMin, salaryMax, benefits, content, ...}`

#### PUT /api/v1/templates/:id
- **Body:** Same as POST
- **Response:** `{id, updated fields}`

#### DELETE /api/v1/templates/:id
- **Response:** `{success: true}`

#### PATCH /api/v1/templates/:id/activate
- **Response:** `{id, isActive: true, ...}`

#### PATCH /api/v1/templates/:id/deactivate
- **Response:** `{id, isActive: false, ...}`

#### POST /api/v1/templates/:id/create-offer
- **Body:** `{candidateId: UUID, jobPostingId: UUID, customizations?: {...}}`
- **Response:** `{offerId, ...}`

**Template Categories:**
- `FULL_TIME`, `PART_TIME`, `CONTRACT`, `INTERNSHIP`, `FREELANCE`

---

## 18. Categories

**Base Path:** `/api/v1/categories`  
**File:** `categoryRoutes.js` (23 lines)  
**Role:** HR_MANAGERS (all endpoints)

#### POST /api/v1/categories
- **Body:** `{name: string, description?: string, color?: string, icon?: string}`
- **Response:** `{id, name, description, color, icon, sortOrder, ...}`

#### GET /api/v1/categories
- **Response:**
```json
[
  {
    "id": "...",
    "name": "Engineering",
    "description": "Technical roles",
    "color": "#3B82F6",
    "icon": "code",
    "sortOrder": 1,
    "templateCount": 5
  }
]
```

#### GET /api/v1/categories/:id
- **Response:** `{id, name, description, color, icon, templates: [...]}`

#### PUT /api/v1/categories/:id
- **Body:** `{name?, description?, color?, icon?}`
- **Response:** `{id, updated fields}`

#### DELETE /api/v1/categories/:id
- **Response:** `{success: true}`
- **Note:** Cannot delete if templates exist

#### PATCH /api/v1/categories/reorder
- **Body:** `{categoryIds: [UUID]}` (ordered array)
- **Response:** `{success: true, categories: [...]}`

---

## 19. Miscellaneous

### Additional Route Files

The following route files exist but contain specialized endpoints:

- **testRoutes.js** - Development/testing endpoints (not documented)
- **errorLoggingRoutes.js** - Error logging endpoints
- **attachmentRoutes.js** - File attachment handling
- **cacheRoutes.js** - Cache management
- **comprehensiveDashboardRoutes.js** - Legacy dashboard (deprecated)
- **metricsRoutes.js** - Metrics tracking
- **milvusSyncRoutes.js** - Vector DB sync
- **negotiationRoutes.js** - Offer negotiation (placeholder)
- **revisionRoutes.js** - Version control (placeholder)
- **smartSearchRoutes.js** - AI-powered search
- **analyticsOfferRoutes.js** - Offer analytics
- **publicOfferRoutes.js** - Public offer acceptance

---

## Testing Reference

### Common Request Headers

```javascript
headers: {
  'Content-Type': 'application/json',
  'Authorization': 'Bearer YOUR_JWT_TOKEN'
}
```

### Test User Credentials

```javascript
// From docs/CREDENTIALS.md
testUsers: {
  superAdmin: {
    email: 'info@gaiai.ai',
    password: '23235656',
    role: 'SUPER_ADMIN'
  },
  admin: {
    email: 'test-admin@test-org-1.com',
    password: 'TestPass123!',
    role: 'ADMIN',
    org: 'Test Org 1 (FREE)'
  },
  hrSpecialist: {
    email: 'test-hr_specialist@test-org-2.com',
    password: 'TestPass123!',
    role: 'HR_SPECIALIST',
    org: 'Test Org 2 (PRO)'
  }
}
```

### API Base URL

```
Development: http://localhost:8102
Production: https://gaiai.ai/ik
```

---

## Summary Statistics

| Category | Count |
|----------|-------|
| **Total Endpoints** | ~142+ |
| **Authentication** | 5 |
| **Job Postings** | 7 |
| **Candidates** | 7 |
| **Analysis** | 10 |
| **AI Chat** | 3 |
| **Interviews** | 8 |
| **Job Offers** | 13 |
| **Dashboard** | 6 (role-specific) |
| **Users** | 13 |
| **Notifications** | 8 |
| **Onboarding** | 3 |
| **Team** | 9 |
| **Organization** | 3 |
| **Super Admin** | 30+ |
| **Queue** | 7 |
| **Analytics** | 5 |
| **Templates** | 8 |
| **Categories** | 6 |

---

## Notes

1. **Organization Isolation:** Most endpoints enforce organization isolation via `enforceOrganizationIsolation` middleware. SUPER_ADMIN bypasses this for cross-org access.

2. **Rate Limiting:** Auth endpoints have rate limiting (100 requests / 15 min). AI chat has specialized rate limiting.

3. **Usage Tracking:** Analysis creation and CV uploads trigger usage tracking middleware that checks monthly limits.

4. **Pagination:** Most list endpoints support `?page=1&limit=10` query parameters.

5. **Validation:** Request validation uses `express-validator`. Bodies are validated for required fields and formats.

6. **Error Responses:** Standard error format:
```json
{
  "success": false,
  "error": "Error type",
  "message": "Human-readable message in Turkish"
}
```

7. **Success Responses:** Standard success format:
```json
{
  "success": true,
  "data": {...},
  "message": "Optional message"
}
```

---

**Generated by:** Claude Code (File Search Specialist)  
**Date:** 2025-11-05  
**Purpose:** E2E Testing API Reference
