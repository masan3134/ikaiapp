# IKAI HR Platform - API Endpoint Map Documentation

**Generated:** 2025-11-05  
**Purpose:** Complete API reference for E2E testing and integration  

---

## Documentation Files

### 1. ENDPOINT-MAP-COMPREHENSIVE.md (1,713 lines)
**Primary Reference - Full API Documentation**

Complete documentation of all 142+ endpoints including:
- Request/response formats
- Authentication & authorization
- Role-based access control
- Validation rules
- Query parameters
- Example payloads
- Error handling

**Use this for:**
- Detailed endpoint specifications
- Request/response structure reference
- Authorization requirements
- E2E test planning

### 2. ENDPOINT-MAP-SUMMARY.md (355 lines)
**Quick Reference - High-Level Overview**

Executive summary with:
- Quick stats (29 route files, 4,529 lines of code)
- Endpoints by category
- Role-based access summary
- Key features by endpoint
- Testing quick start
- Usage limits by plan
- BullMQ queue overview

**Use this for:**
- Quick endpoint lookup
- Role permission reference
- Testing setup guide
- Plan limit reference

---

## Quick Access

### By Category

| Category | Endpoints | Documentation |
|----------|-----------|---------------|
| Authentication | 5 | [Comprehensive](./ENDPOINT-MAP-COMPREHENSIVE.md#1-authentication) |
| Job Postings | 7 | [Comprehensive](./ENDPOINT-MAP-COMPREHENSIVE.md#2-job-postings) |
| Candidates | 7 | [Comprehensive](./ENDPOINT-MAP-COMPREHENSIVE.md#3-candidates) |
| Analysis | 10 | [Comprehensive](./ENDPOINT-MAP-COMPREHENSIVE.md#4-analysis) |
| AI Chat | 3 | [Comprehensive](./ENDPOINT-MAP-COMPREHENSIVE.md#5-ai-chat) |
| Interviews | 8 | [Comprehensive](./ENDPOINT-MAP-COMPREHENSIVE.md#6-interviews) |
| Job Offers | 13 | [Comprehensive](./ENDPOINT-MAP-COMPREHENSIVE.md#7-job-offers) |
| Dashboard | 6 | [Comprehensive](./ENDPOINT-MAP-COMPREHENSIVE.md#8-dashboard) |
| Users | 13 | [Comprehensive](./ENDPOINT-MAP-COMPREHENSIVE.md#9-users) |
| Notifications | 8 | [Comprehensive](./ENDPOINT-MAP-COMPREHENSIVE.md#10-notifications) |
| Onboarding | 3 | [Comprehensive](./ENDPOINT-MAP-COMPREHENSIVE.md#11-onboarding) |
| Team | 9 | [Comprehensive](./ENDPOINT-MAP-COMPREHENSIVE.md#12-team-management) |
| Organization | 3 | [Comprehensive](./ENDPOINT-MAP-COMPREHENSIVE.md#13-organization) |
| Super Admin | 30+ | [Comprehensive](./ENDPOINT-MAP-COMPREHENSIVE.md#14-super-admin) |
| Queue | 7 | [Comprehensive](./ENDPOINT-MAP-COMPREHENSIVE.md#15-queue-management) |
| Analytics | 5 | [Comprehensive](./ENDPOINT-MAP-COMPREHENSIVE.md#16-analytics) |
| Templates | 8 | [Comprehensive](./ENDPOINT-MAP-COMPREHENSIVE.md#17-templates) |
| Categories | 6 | [Comprehensive](./ENDPOINT-MAP-COMPREHENSIVE.md#18-categories) |

### By Role

| Role | Access Level | Documentation |
|------|--------------|---------------|
| SUPER_ADMIN | Full system access (all orgs) | [Summary](./ENDPOINT-MAP-SUMMARY.md#super_admin) |
| ADMIN | Organization admin | [Summary](./ENDPOINT-MAP-SUMMARY.md#admin) |
| MANAGER | Team + HR operations | [Summary](./ENDPOINT-MAP-SUMMARY.md#manager) |
| HR_SPECIALIST | Recruitment focus | [Summary](./ENDPOINT-MAP-SUMMARY.md#hr_specialist) |
| USER | Read-only | [Summary](./ENDPOINT-MAP-SUMMARY.md#user) |

---

## Analysis Process

### What Was Done

1. **Route File Discovery**
   - Located all 29 route files in `backend/src/routes/`
   - Total: 4,529 lines of route definitions

2. **Endpoint Extraction**
   - Analyzed each route file for:
     - HTTP methods (GET, POST, PUT, PATCH, DELETE)
     - Endpoint paths
     - Authorization requirements (role groups)
     - Request body structures
     - Response formats
     - Middleware chains

3. **Role Mapping**
   - Identified 5 roles: SUPER_ADMIN, ADMIN, MANAGER, HR_SPECIALIST, USER
   - Mapped role groups to endpoints
   - Documented permission hierarchy

4. **Feature Documentation**
   - Key features per endpoint category
   - Request/response examples
   - Validation rules
   - Query parameters
   - Error handling

5. **Testing Reference**
   - Test user credentials
   - Quick start examples
   - Python/curl examples
   - Usage limit reference

---

## Key Findings

### Architecture Highlights

✅ **Role-Based Access Control (RBAC)**
- 5 roles with clear hierarchy
- Role groups for efficient permission management
- Organization-level isolation (multi-tenant)

✅ **Comprehensive API Coverage**
- 142+ documented endpoints
- Full recruitment lifecycle (job posting → hire)
- Advanced features (AI chat, analytics, queue management)

✅ **Multi-Tenant Architecture**
- Organization isolation middleware
- SUPER_ADMIN can access all orgs
- Usage tracking per organization

✅ **Advanced Features**
- AI-powered CV analysis (Gemini 2.0 Flash)
- Real-time AI chat with analysis context
- BullMQ queue system (5 queues)
- Export capabilities (XLSX, CSV, HTML, PDF)
- Email integration
- Notification system (15 types, in-app + email)

✅ **Security**
- JWT authentication
- Rate limiting (auth endpoints)
- Password validation
- Organization isolation
- Role-based permissions

---

## E2E Testing Roadmap

### Phase 1: Authentication & Authorization
- [ ] Test login/register for all roles
- [ ] Test JWT token validation
- [ ] Test rate limiting
- [ ] Test organization isolation

### Phase 2: Core Recruitment Flow
- [ ] Job posting CRUD
- [ ] CV upload (with duplicate check)
- [ ] Analysis creation (with usage limits)
- [ ] Analysis results verification
- [ ] Interview scheduling
- [ ] Job offer generation

### Phase 3: Advanced Features
- [ ] AI chat with analysis
- [ ] Export functionality (XLSX, CSV, HTML, PDF)
- [ ] Email notifications
- [ ] Notification preferences
- [ ] Team management
- [ ] Usage limit warnings

### Phase 4: Admin & Super Admin
- [ ] Organization management
- [ ] User management
- [ ] System health monitoring
- [ ] Queue management
- [ ] Analytics endpoints
- [ ] Audit trail

### Phase 5: Edge Cases
- [ ] Usage limit enforcement
- [ ] Role permission boundaries
- [ ] Organization isolation verification
- [ ] Error handling
- [ ] Rate limit enforcement

---

## Related Documentation

### Other API Docs (Already Existing)

1. **openapi.json** (125KB)
   - OpenAPI 3.0 specification
   - Machine-readable API definition
   - Use for: API clients, Swagger UI

2. **postman-collection.json** (33KB)
   - Postman collection
   - Pre-configured requests
   - Use for: Manual testing, Postman

3. **README.md** (17KB)
   - API overview
   - Authentication guide
   - Common patterns
   - Use for: General understanding

4. **SDK-GENERATION-GUIDE.md** (12KB)
   - How to generate API clients
   - OpenAPI generator guide
   - Use for: SDK generation

### Credentials

**Location:** `docs/CREDENTIALS.md`

Test users available for all 5 roles:
- SUPER_ADMIN: info@gaiai.ai / 23235656
- ADMIN: test-admin@test-org-1.com / TestPass123!
- HR_SPECIALIST: test-hr_specialist@test-org-2.com / TestPass123!
- MANAGER: test-manager@test-org-3.com / TestPass123!
- USER: test-user@test-org-1.com / TestPass123!

---

## File Structure

```
docs/api/
├── README-ENDPOINT-MAP.md              ← This file
├── ENDPOINT-MAP-COMPREHENSIVE.md       ← Full documentation (1,713 lines)
├── ENDPOINT-MAP-SUMMARY.md             ← Quick reference (355 lines)
├── openapi.json                        ← OpenAPI spec
├── postman-collection.json             ← Postman collection
├── README.md                           ← API overview
├── SDK-GENERATION-GUIDE.md             ← SDK generation guide
└── swagger-ui.html                     ← Swagger UI
```

---

## Usage Examples

### Quick Lookup

**Want to test CV upload?**
→ [ENDPOINT-MAP-COMPREHENSIVE.md#3-candidates](./ENDPOINT-MAP-COMPREHENSIVE.md#3-candidates)

**Need to know ADMIN permissions?**
→ [ENDPOINT-MAP-SUMMARY.md#admin](./ENDPOINT-MAP-SUMMARY.md#admin)

**Testing AI chat?**
→ [ENDPOINT-MAP-COMPREHENSIVE.md#5-ai-chat](./ENDPOINT-MAP-COMPREHENSIVE.md#5-ai-chat)

**Need Super Admin endpoints?**
→ [ENDPOINT-MAP-COMPREHENSIVE.md#14-super-admin](./ENDPOINT-MAP-COMPREHENSIVE.md#14-super-admin)

### Testing Setup

```bash
# 1. Start backend
cd backend
docker compose up -d

# 2. Get auth token
curl -X POST http://localhost:8102/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "info@gaiai.ai", "password": "23235656"}'

# 3. Test endpoint
curl -X GET http://localhost:8102/api/v1/dashboard/super-admin \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Changelog

**2025-11-05:** Initial creation
- Explored 29 route files (4,529 lines)
- Documented 142+ endpoints
- Created comprehensive documentation (1,713 lines)
- Created summary reference (355 lines)
- Mapped role-based access control
- Extracted request/response formats

---

## Support

**Questions?** Check these resources:
1. Full documentation: [ENDPOINT-MAP-COMPREHENSIVE.md](./ENDPOINT-MAP-COMPREHENSIVE.md)
2. Quick reference: [ENDPOINT-MAP-SUMMARY.md](./ENDPOINT-MAP-SUMMARY.md)
3. API overview: [README.md](./README.md)
4. Test credentials: `docs/CREDENTIALS.md`
5. Project documentation: `docs/INDEX.md`

**Generated by:** Claude Code (File Search Specialist)  
**Purpose:** E2E Testing API Reference
