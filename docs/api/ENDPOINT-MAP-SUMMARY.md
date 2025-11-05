# API Endpoint Map - Quick Summary

**Date:** 2025-11-05  
**Full Documentation:** [ENDPOINT-MAP-COMPREHENSIVE.md](./ENDPOINT-MAP-COMPREHENSIVE.md)

---

## Quick Stats

- **Total Route Files:** 29
- **Total Lines of Route Code:** 4,529
- **Total Endpoints:** ~142+
- **Roles:** 5 (SUPER_ADMIN, ADMIN, MANAGER, HR_SPECIALIST, USER)

---

## Endpoints by Category

| Category | Count | Base Path | Key Features |
|----------|-------|-----------|--------------|
| **Authentication** | 5 | `/api/v1/auth` | Login, register, logout, me, refresh |
| **Job Postings** | 7 | `/api/v1/job-postings` | CRUD + export (XLSX/CSV) |
| **Candidates** | 7 | `/api/v1/candidates` | CRUD + CV upload + duplicate check + export |
| **Analysis** | 10 | `/api/v1/analyses` | Create analysis, view results, export, email, feedback |
| **AI Chat** | 3 | `/api/v1/analyses/:id` | Chat with analysis, history, stats |
| **Interviews** | 8 | `/api/v1/interviews` | CRUD + wizard + conflict check + stats |
| **Job Offers** | 13 | `/api/v1/offers` | CRUD + wizard + approval workflow + expiration + PDF |
| **Dashboard** | 6 | `/api/v1/dashboard` | Role-specific dashboards (USER, HR, MANAGER, ADMIN, SUPER_ADMIN) |
| **Users** | 13 | `/api/v1/users` | Profile, stats, sessions, notifications, admin CRUD |
| **Notifications** | 8 | `/api/v1/notifications` | List, mark read, preferences (15 types) |
| **Onboarding** | 3 | `/api/v1/onboarding` | 5-step wizard, status, complete |
| **Team** | 9 | `/api/v1/team` | Invite, CRUD, hierarchy, stats |
| **Organization** | 3 | `/api/v1/organization` | Info, update, usage tracking |
| **Super Admin** | 30+ | `/api/v1/super-admin` | Multi-org management, analytics, system health |
| **Queue** | 7 | `/api/v1/queue` | BullMQ monitoring, pause/resume, cleanup |
| **Analytics** | 5 | `/api/v1/analytics` | Summary, funnel, time-to-hire, score distribution |
| **Templates** | 8 | `/api/v1/templates` | CRUD + activate/deactivate + create offer |
| **Categories** | 6 | `/api/v1/categories` | CRUD + reorder |

---

## Role-Based Access

### SUPER_ADMIN
- **Full System Access:** All endpoints across all organizations
- **Exclusive Access:** Super Admin routes, queue management, cross-org analytics
- **No Isolation:** Bypasses organization isolation middleware

### ADMIN
- **Organization Admin:** Full access within their organization
- **User Management:** Create, update, delete users in their org
- **Billing & Settings:** Manage org settings and billing
- **Analytics:** Full analytics dashboard

### MANAGER
- **Team Management:** Invite, manage team members
- **HR Operations:** All HR features (job postings, candidates, analysis, interviews, offers)
- **Analytics:** View analytics dashboard
- **Delete Operations:** Can delete interviews and offers

### HR_SPECIALIST
- **Recruitment Focus:** All HR operations (job postings, candidates, analysis, interviews, offers)
- **Read-Only for Some:** Cannot delete critical resources
- **Analytics:** View analytics dashboard

### USER
- **Read-Only:** View analyses (created by others in org)
- **Profile Management:** Update own profile, notifications, password
- **Dashboard:** Basic user dashboard

---

## Permission Groups

```javascript
ROLE_GROUPS = {
  ADMINS: [SUPER_ADMIN, ADMIN],                    // Admin privileges
  MANAGERS_PLUS: [SUPER_ADMIN, ADMIN, MANAGER],    // Delete operations
  HR_MANAGERS: [SUPER_ADMIN, ADMIN, MANAGER, HR_SPECIALIST], // HR operations
  ANALYTICS_VIEWERS: [SUPER_ADMIN, ADMIN, MANAGER, HR_SPECIALIST], // Analytics
  ALL_AUTHENTICATED: [ALL_ROLES]                    // Basic access
}
```

---

## Key Features by Endpoint

### 1. Authentication (`/api/v1/auth`)
- ✅ Rate limited (100/15min)
- ✅ JWT token-based
- ✅ Password validation (min 8 chars)
- ✅ Email validation

### 2. Job Postings (`/api/v1/job-postings`)
- ✅ CRUD operations
- ✅ Export (XLSX, CSV)
- ✅ Organization isolation
- ✅ Field validation (title 3-200 chars, department 2-100 chars)

### 3. Candidates (`/api/v1/candidates`)
- ✅ CV upload (multipart/form-data)
- ✅ Duplicate detection (file hash)
- ✅ Monthly CV limit tracking
- ✅ Export (XLSX, CSV)

### 4. Analysis (`/api/v1/analyses`)
- ✅ Batch CV analysis (Gemini AI)
- ✅ Monthly analysis limit tracking
- ✅ BullMQ queue integration
- ✅ Export (XLSX, CSV, HTML)
- ✅ Email results
- ✅ Send candidate feedback
- ✅ Add candidates to existing analysis

### 5. AI Chat (`/api/v1/analyses/:id/chat`)
- ✅ Analysis-specific chat
- ✅ Gemini 2.0 Flash integration
- ✅ Full context (no vector search)
- ✅ Conversation history persistence
- ✅ Rate limiting
- ✅ Response time tracking

### 6. Interviews (`/api/v1/interviews`)
- ✅ Wizard mode (recent candidates, conflict check)
- ✅ CRUD operations
- ✅ Status management (scheduled, completed, cancelled)
- ✅ Stats endpoint

### 7. Job Offers (`/api/v1/offers`)
- ✅ Wizard mode
- ✅ CRUD operations
- ✅ Approval workflow (pending_approval, approved, rejected)
- ✅ Expiration management
- ✅ PDF generation (preview, download)
- ✅ Bulk send
- ✅ Email integration

### 8. Dashboard (`/api/v1/dashboard`)
- ✅ Role-specific data
- ✅ USER: Profile completion, notifications, activity
- ✅ HR_SPECIALIST: Recruitment pipeline, recent analyses, interviews
- ✅ MANAGER: Team analytics, department focus
- ✅ ADMIN: Org management, billing, security, health
- ✅ SUPER_ADMIN: Multi-org overview, system health, revenue

### 9. Super Admin (`/api/v1/super-admin`)
- ✅ Multi-org management (CRUD, suspend, reactivate, change plan)
- ✅ System health (database, redis, backend, milvus)
- ✅ Queue monitoring (real-time BullMQ stats)
- ✅ User management (cross-org CRUD, bulk actions)
- ✅ Security logs (login attempts, audit trail)
- ✅ Analytics (growth, engagement, revenue)
- ✅ Settings management
- ✅ Export (CSV, PDF)

### 10. Queue Management (`/api/v1/queue`)
- ✅ Real-time stats (waiting, active, completed, failed)
- ✅ Health monitoring
- ✅ Pause/resume queues
- ✅ Cleanup old jobs
- ✅ View failed jobs with stacktrace
- ✅ 5 queues: analysis, email, offer, test-generation, feedback

---

## API Design Patterns

### 1. Standard Response Format

**Success:**
```json
{
  "success": true,
  "data": {...},
  "message": "Optional Turkish message"
}
```

**Error:**
```json
{
  "success": false,
  "error": "Error type",
  "message": "Human-readable Turkish message"
}
```

### 2. Pagination

```
Query: ?page=1&limit=10
Response: {data: [...], pagination: {page, limit, total, totalPages}}
```

### 3. Filtering & Sorting

```
Query: ?status=active&sortBy=createdAt&sortOrder=desc&search=developer
```

### 4. Authorization Pattern

```javascript
// Middleware chain
const hrManagers = [
  authenticateToken,              // JWT validation
  enforceOrganizationIsolation,   // Multi-tenant isolation
  authorize(ROLE_GROUPS.HR_MANAGERS) // Role check
];

router.get('/', ...hrManagers, controller);
```

### 5. Usage Tracking Pattern

```javascript
// Analysis creation
router.post('/',
  authenticateToken,
  enforceOrganizationIsolation,
  authorize(ROLE_GROUPS.HR_MANAGERS),
  trackAnalysisUsage,  // Check monthly limit before processing
  createAnalysis
);
```

---

## Testing Quick Start

### 1. Get Auth Token

```bash
# Login as SUPER_ADMIN
curl -X POST http://localhost:8102/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "info@gaiai.ai", "password": "23235656"}'

# Response: {"token": "eyJhbGciOiJ...", "user": {...}}
```

### 2. Test Protected Endpoint

```bash
# Get dashboard data
curl -X GET http://localhost:8102/api/v1/dashboard/super-admin \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 3. Test With Python

```python
import requests

# Login
response = requests.post('http://localhost:8102/api/v1/auth/login', 
  json={'email': 'info@gaiai.ai', 'password': '23235656'})
token = response.json()['token']

# Get dashboard
headers = {'Authorization': f'Bearer {token}'}
dashboard = requests.get('http://localhost:8102/api/v1/dashboard/super-admin', 
  headers=headers)
print(dashboard.json())
```

---

## Usage Limits (By Plan)

| Limit Type | FREE | PRO | ENTERPRISE |
|------------|------|-----|------------|
| **Analyses/month** | 10 | 50 | Unlimited |
| **CVs/month** | 50 | 200 | Unlimited |
| **Users** | 2 | 10 | 100 |
| **Pricing** | ₺0 | ₺99/mo | Contact |

**Tracking Endpoints:**
- `GET /api/v1/organization/me/usage` - Current usage stats
- Warnings generated when usage > 80%
- Critical alerts when usage = 100%

---

## Notification Types (15)

1. **ANALYSIS_COMPLETE** - Analysis finished
2. **ANALYSIS_FAILED** - Analysis error
3. **INTERVIEW_SCHEDULED** - Interview created
4. **INTERVIEW_REMINDER** - 24h before interview
5. **INTERVIEW_CANCELLED** - Interview cancelled
6. **OFFER_SENT** - Offer sent to candidate
7. **OFFER_ACCEPTED** - Candidate accepted
8. **OFFER_REJECTED** - Candidate rejected
9. **OFFER_EXPIRING** - Offer expiring soon
10. **FEEDBACK_SENT** - Feedback sent to candidate
11. **FEEDBACK_RECEIVED** - Candidate feedback received
12. **TEAM_INVITATION** - Team member invited
13. **USAGE_LIMIT_WARNING** - Usage > 80%
14. **USAGE_LIMIT_REACHED** - Usage = 100%
15. **SYSTEM_ANNOUNCEMENT** - Admin announcement

**Preferences:**
- In-app notifications (on/off)
- Email notifications (on/off)
- Per-type configuration

---

## BullMQ Queues (5)

1. **analysis** - CV analysis jobs (Gemini AI)
2. **email** - Email sending (SMTP)
3. **offer** - Job offer generation (PDF)
4. **test-generation** - AI test creation
5. **feedback** - Candidate feedback processing

**Monitoring:**
- Real-time stats (waiting, active, completed, failed)
- Failed job inspection (with stacktrace)
- Pause/resume queues
- Cleanup old jobs
- Super Admin access only

---

## Next Steps for E2E Testing

1. **Read Full Documentation:** [ENDPOINT-MAP-COMPREHENSIVE.md](./ENDPOINT-MAP-COMPREHENSIVE.md)
2. **Setup Test Environment:** Use test credentials from `docs/CREDENTIALS.md`
3. **Test by Role:**
   - Start with SUPER_ADMIN (full access)
   - Test ADMIN (org-level access)
   - Test HR_SPECIALIST (recruitment focus)
   - Test USER (read-only)
4. **Test Critical Flows:**
   - Job posting → CV upload → Analysis → Interview → Offer
   - Onboarding wizard (5 steps)
   - Team management
   - Usage limits
5. **Test Edge Cases:**
   - Usage limit warnings
   - Rate limiting
   - Invalid permissions
   - Organization isolation

---

**Status:** ✅ Complete  
**Files Generated:**
- `docs/api/ENDPOINT-MAP-COMPREHENSIVE.md` (142+ endpoints documented)
- `docs/api/ENDPOINT-MAP-SUMMARY.md` (this file)

**Next Action:** Use these docs for E2E testing implementation
