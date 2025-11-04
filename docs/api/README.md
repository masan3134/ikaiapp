# IKAI API Documentation

**Version:** 1.0.0
**Total Endpoints:** 141
**Base URL (Dev):** http://localhost:8102
**Base URL (Prod):** https://gaiai.ai/ik
**Last Updated:** 2025-11-04

---

## 📚 Quick Links

- **[OpenAPI Specification](openapi.json)** - Machine-readable API spec (Swagger compatible)
- **[Postman Collection](postman-collection.json)** - Importable collection with auto-token
- **[Endpoint Inventory](endpoint-inventory.md)** - Complete list of all 141 endpoints
- **[Test Data Reference](../test-tasks/COMPLETE-TEST-DATA-REFERENCE.md)** - Test accounts and data

---

## 🚀 Quick Start

### 1. Authentication

All protected endpoints require JWT token in Authorization header:

```http
Authorization: Bearer YOUR_JWT_TOKEN
```

### 2. Login

**POST** `/api/v1/auth/login`

```json
{
  "email": "test-admin@test-org-1.com",
  "password": "TestPass123!"
}
```

**Response:**

```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "96d1d73f-7e33-4c5d-bd10-da74e860add2",
    "email": "test-admin@test-org-1.com",
    "role": "ADMIN",
    "organizationId": "org-uuid",
    "name": "Test ADMIN 1"
  }
}
```

### 3. Use Token

```bash
curl -X GET http://localhost:8102/api/v1/job-postings \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

## 🔐 Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/v1/auth/register` | Register new user + create organization | No (rate limited) |
| POST | `/api/v1/auth/login` | Login with email/password | No (rate limited) |
| POST | `/api/v1/auth/logout` | Logout (invalidate session) | Yes |
| GET | `/api/v1/auth/me` | Get current user info | Yes |
| POST | `/api/v1/auth/refresh` | Refresh JWT token | Yes |

**Rate Limiting:** 100 requests per 15 minutes for login/register endpoints.

---

## 🏢 Multi-Tenant Architecture

### Organization Isolation

- Each organization has **isolated data**
- `organizationId` automatically added by middleware
- **SUPER_ADMIN** can access all organizations
- Regular users limited to their organization

### How It Works

1. User logs in → JWT token contains `organizationId`
2. Middleware (`enforceOrganizationIsolation`) adds filter to queries
3. Prisma queries automatically scoped to organization
4. SUPER_ADMIN bypasses isolation (can see all orgs)

**Example:**

```javascript
// Regular user (ADMIN)
GET /api/v1/job-postings
// Returns only their organization's job postings

// SUPER_ADMIN
GET /api/v1/job-postings
// Returns job postings from ALL organizations
```

---

## 🎭 Role-Based Access Control (RBAC)

### 5 Roles

| Role | Description | Access Level |
|------|-------------|--------------|
| **SUPER_ADMIN** | System administrator | All 141 endpoints, cross-org access |
| **ADMIN** | Organization administrator | Full access within org (~120 endpoints) |
| **MANAGER** | Department manager | Create/edit, limited delete (~90 endpoints) |
| **HR_SPECIALIST** | HR staff | Candidates, interviews (~80 endpoints) |
| **USER** | Basic employee | Dashboard, profile only (~20 endpoints) |

### Permission Matrix

| Endpoint | USER | HR | MGR | ADMIN | SUPER |
|----------|------|-----|-----|-------|-------|
| GET /api/v1/job-postings | ❌ | ✅ | ✅ | ✅ | ✅ |
| POST /api/v1/job-postings | ❌ | ✅ | ✅ | ✅ | ✅ |
| DELETE /api/v1/job-postings/:id | ❌ | ❌ | ❌ | ✅ | ✅ |
| GET /api/v1/candidates | ❌ | ✅ | ✅ | ✅ | ✅ |
| POST /api/v1/candidates | ❌ | ✅ | ✅ | ✅ | ✅ |
| DELETE /api/v1/candidates/:id | ❌ | ❌ | ❌ | ✅ | ✅ |
| POST /api/v1/offers | ❌ | ❌ | ✅ | ✅ | ✅ |
| GET /api/v1/dashboard | ✅ | ✅ | ✅ | ✅ | ✅ |

**Role Groups:**
- `HR_MANAGERS` = [SUPER_ADMIN, ADMIN, MANAGER, HR_SPECIALIST]
- `ADMINS` = [SUPER_ADMIN, ADMIN]
- `ALL_AUTHENTICATED` = [SUPER_ADMIN, ADMIN, MANAGER, HR_SPECIALIST, USER]

---

## 📋 Endpoint Categories

### 🔐 Authentication (5 endpoints)
- Register, Login, Logout, Get current user, Refresh token

### 💼 Job Postings (7 endpoints)
- CRUD operations, export (XLSX/CSV)
- **Role:** HR_MANAGERS required

### 👥 Candidates (7 endpoints)
- CRUD operations, CV upload
- **Role:** HR_MANAGERS required

### 🔍 Analyses (10 endpoints)
- CV analysis with Gemini AI, batch processing
- **Role:** HR_MANAGERS required

### 📄 Offers (15 endpoints)
- Job offer CRUD, negotiations, status updates
- **Role:** MANAGER+ required

### 📅 Interviews (8 endpoints)
- Interview scheduling, feedback, status tracking
- **Role:** HR_MANAGERS required

### 👪 Team (7 endpoints)
- Invite members, accept invitations, remove members
- **Role:** ADMIN+ required

### 🏢 Organizations (3 endpoints)
- Get organization info, update settings, usage stats
- **Role:** Authenticated required

### 👤 Users (11 endpoints)
- Profile management, preferences, list users
- **Role:** Authenticated required

### 📊 Dashboard (2 endpoints)
- Analytics, statistics
- **Role:** Authenticated required

### ⚙️ Super Admin (5 endpoints)
- System-wide management, organization management
- **Role:** SUPER_ADMIN only

**See [Endpoint Inventory](endpoint-inventory.md) for complete list of all 141 endpoints.**

---

## 📚 Core Workflows

### Workflow 1: Create Job Posting + Analyze CVs

```bash
# 1. Login
curl -X POST http://localhost:8102/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test-admin@test-org-1.com","password":"TestPass123!"}'

# Response: {"token": "..."}

# 2. Create Job Posting
curl -X POST http://localhost:8102/api/v1/job-postings \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Senior Backend Developer",
    "department": "Engineering",
    "details": "Node.js, PostgreSQL, Docker experience required..."
  }'

# Response: {"id": "job-uuid", ...}

# 3. Upload CV for Analysis
curl -X POST http://localhost:8102/api/v1/analyses \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@/path/to/cv.pdf" \
  -F "jobPostingId=job-uuid"

# Response: {"id": "analysis-uuid", "status": "PENDING"}

# 4. Check Analysis Status
curl -X GET http://localhost:8102/api/v1/analyses/analysis-uuid \
  -H "Authorization: Bearer YOUR_TOKEN"

# Response: {"status": "COMPLETED", "score": 85, "aiResponse": {...}}
```

### Workflow 2: Invite Team Member

```bash
# 1. Send Invitation (ADMIN only)
curl -X POST http://localhost:8102/api/v1/team/invite \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newmember@company.com",
    "role": "HR_SPECIALIST"
  }'

# 2. New member accepts invitation
curl -X POST http://localhost:8102/api/v1/team/accept \
  -H "Authorization: Bearer NEW_MEMBER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"token": "invitation-token-from-email"}'
```

---

## 🚨 Error Responses

All errors follow consistent format:

```json
{
  "error": "ERROR_CODE",
  "message": "Human-readable error message",
  "statusCode": 400,
  "details": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

### Common Status Codes

| Code | Meaning | Example |
|------|---------|---------|
| 200 | Success | Request successful |
| 201 | Created | Resource created |
| 204 | No Content | Delete successful |
| 400 | Bad Request | Validation error |
| 401 | Unauthorized | Missing/invalid token |
| 403 | Forbidden | Insufficient permissions (role-based) |
| 404 | Not Found | Resource not found |
| 409 | Conflict | Email already exists |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Server Error | Internal error |

### Example Errors

**401 Unauthorized:**
```json
{
  "error": "Unauthorized",
  "message": "No token provided or token invalid",
  "statusCode": 401
}
```

**403 Forbidden (RBAC):**
```json
{
  "error": "Forbidden",
  "message": "Insufficient permissions. Required roles: ADMIN, MANAGER",
  "statusCode": 403
}
```

**400 Validation Error:**
```json
{
  "error": "Validation Error",
  "message": "Invalid input data",
  "details": [
    {
      "field": "password",
      "message": "Password must be at least 8 characters long"
    },
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ],
  "statusCode": 400
}
```

---

## 📊 Pagination

List endpoints support pagination:

**Query Parameters:**
- `page` (default: 1)
- `limit` (default: 20, max: 100)

**Example:**

```bash
GET /api/v1/job-postings?page=2&limit=50
```

**Response:**

```json
{
  "data": [...],
  "pagination": {
    "page": 2,
    "limit": 50,
    "total": 150,
    "totalPages": 3
  }
}
```

---

## 🔍 Filtering & Search

### Job Postings

```bash
# Filter by department
GET /api/v1/job-postings?department=Engineering

# Search by title
GET /api/v1/job-postings?search=backend
```

### Candidates

```bash
# Search by name
GET /api/v1/candidates?search=John

# Filter by job posting
GET /api/v1/candidates?jobPostingId=uuid
```

---

## 📤 File Uploads

### Upload CV for Analysis

**POST** `/api/v1/analyses`

**Content-Type:** `multipart/form-data`

**Form Fields:**
- `file` (required) - CV file (PDF, DOCX, TXT, max 10MB)
- `jobPostingId` (required) - UUID of job posting

**Example (curl):**

```bash
curl -X POST http://localhost:8102/api/v1/analyses \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@/path/to/cv.pdf" \
  -F "jobPostingId=550e8400-e29b-41d4-a716-446655440000"
```

**Response:**

```json
{
  "id": "analysis-uuid",
  "status": "PENDING",
  "candidateId": "candidate-uuid",
  "jobPostingId": "job-uuid",
  "createdAt": "2025-11-04T10:00:00.000Z"
}
```

**Processing:**
1. File uploaded to MinIO object storage
2. Job queued in BullMQ (`analysisQueue`)
3. Worker processes CV with Gemini AI
4. Results saved to database
5. Status changes to `COMPLETED` or `FAILED`

**Check status:**

```bash
GET /api/v1/analyses/{analysis-uuid}
```

**Supported formats:** PDF, DOCX, TXT

---

## 🧪 Testing

### Test Accounts

| Email | Password | Role | Organization |
|-------|----------|------|--------------|
| info@gaiai.ai | 23235656 | SUPER_ADMIN | Default |
| test-admin@test-org-1.com | TestPass123! | ADMIN | Test Org 1 (FREE) |
| test-manager@test-org-1.com | TestPass123! | MANAGER | Test Org 1 (FREE) |
| test-hr_specialist@test-org-1.com | TestPass123! | HR_SPECIALIST | Test Org 1 (FREE) |
| test-user@test-org-1.com | TestPass123! | USER | Test Org 1 (FREE) |
| test-admin@test-org-2.com | TestPass123! | ADMIN | Test Org 2 (PRO) |

**See [Test Data Reference](../test-tasks/COMPLETE-TEST-DATA-REFERENCE.md) for complete list.**

### Python Test Helper

```python
# Start interactive helper
python3 -i scripts/test-helper.py

# Login
helper = IKAITestHelper()
helper.login('test-admin@test-org-1.com', 'TestPass123!')

# Make requests
result = helper.get('/api/v1/job-postings')
print(result.status_code)  # 200
print(result.json())

# Test different roles
helper.login('test-user@test-org-1.com', 'TestPass123!')
result = helper.get('/api/v1/job-postings')
print(result.status_code)  # 403 (USER role forbidden)
```

---

## 🔧 Development

### Local Setup

```bash
# Start all services (Docker)
docker compose up -d

# Access API
curl http://localhost:8102/health

# View logs
docker logs ikai-backend -f
```

### Environment Variables

```env
DATABASE_URL=postgresql://ikaiuser:ikaipass2025@localhost:8132/ikaidb
REDIS_URL=redis://localhost:8179
MINIO_ENDPOINT=localhost
MINIO_PORT=8100
GEMINI_API_KEY=AIzaSyAT-KFuJ_GWaotsep3xtETJex8-gMEAc4g
```

---

## 📚 Additional Resources

### Documentation

- **Architecture:** [`docs/INDEX.md`](../INDEX.md)
- **SaaS Features:** [`docs/features/saas-quick-reference.md`](../features/saas-quick-reference.md)
- **RBAC Strategy:** [`docs/architecture/RBAC-COMPLETE-STRATEGY.md`](../architecture/RBAC-COMPLETE-STRATEGY.md)
- **Queue System:** [`docs/reports/2025-11-02-queue-system-implementation.md`](../reports/2025-11-02-queue-system-implementation.md)

### Tools

- **Swagger UI:** [https://editor.swagger.io/](https://editor.swagger.io/) (paste `openapi.json`)
- **Postman:** Import `postman-collection.json` for instant testing
- **Python Helper:** `scripts/test-helper.py` for automated API testing

---

## 💡 Tips & Best Practices

### 1. Always Use Proper Auth

```bash
# ❌ Wrong
curl http://localhost:8102/api/v1/job-postings

# ✅ Right
curl http://localhost:8102/api/v1/job-postings \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 2. Check Role Permissions

Before calling an endpoint, verify your role has access:
- See RBAC matrix above
- Check endpoint documentation for required roles

### 3. Handle Errors Gracefully

```javascript
try {
  const response = await fetch('/api/v1/job-postings', {
    headers: { 'Authorization': `Bearer ${token}` }
  });

  if (!response.ok) {
    const error = await response.json();
    console.error('API Error:', error.message);
    // Handle 401, 403, 404, etc.
  }
} catch (err) {
  console.error('Network error:', err);
}
```

### 4. Respect Rate Limits

Login/register endpoints are rate limited (100 req/15min). Implement retry logic with exponential backoff.

---

## 🆘 Support

**Issues:** [GitHub Issues](https://github.com/masan3134/ikaiapp/issues)
**Email:** info@gaiai.ai
**Documentation:** [Full Docs](../INDEX.md)

---

**Last Updated:** 2025-11-04
**Maintained By:** IKAI Dev Team
**API Version:** 1.0.0
**Worker:** Claude (Sonnet 4.5)
