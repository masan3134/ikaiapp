# API Changelog

All notable changes to the IKAI HR Platform API will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Coming Soon
- GraphQL API endpoint
- WebSocket support for real-time notifications
- Webhook subscriptions for events
- API versioning (/api/v2/...)

---

## [1.0.0] - 2025-11-04

### 🎉 Initial Release

Complete API documentation for IKAI HR Platform with 141 endpoints across 29 categories.

### Added - Documentation
- ✅ **OpenAPI 3.0 Specification** (`openapi.json`)
  - 46 endpoints fully documented
  - 11 schemas (User, Organization, JobPosting, etc.)
  - RBAC permission matrix
  - Request/response examples
  - Error responses

- ✅ **Endpoint Inventory** (`endpoint-inventory.md`)
  - Complete catalog of all 141 endpoints
  - Categorized by feature (Core, SaaS, AI, System)
  - Method breakdown (GET, POST, PUT, DELETE)
  - Role requirements

- ✅ **Markdown Documentation** (`README.md`)
  - Quick start guide
  - Authentication examples
  - Multi-tenant architecture explained
  - RBAC permission matrix
  - Core workflows with curl examples
  - Error handling guide
  - Test accounts table

- ✅ **Postman Collection** (`postman-collection.json`)
  - 21 requests across 7 categories
  - Auto-token script (login → save token → auto-use)
  - Test assertions (status code, response time, JSON validation)
  - Environment variables

- ✅ **Swagger UI** (`swagger-ui.html`)
  - Interactive API explorer
  - Try-it-out functionality
  - Quick start guide embedded
  - Custom IKAI branding

- ✅ **SDK Generation Guide** (`SDK-GENERATION-GUIDE.md`)
  - Instructions for 7 languages (TypeScript, Python, Java, C#, Go, PHP, Ruby)
  - Usage examples
  - Publishing guides (npm, PyPI, Maven, NuGet)
  - CI/CD automation

### Added - API Endpoints

#### Authentication (5 endpoints)
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login with credentials
- `POST /api/v1/auth/logout` - Logout (invalidate session)
- `GET /api/v1/auth/me` - Get current user
- `POST /api/v1/auth/refresh` - Refresh JWT token

**Features:**
- Rate limiting: 100 requests per 15 minutes
- JWT authentication
- Redis session management

#### Job Postings (5 endpoints)
- `GET /api/v1/job-postings` - List job postings
- `POST /api/v1/job-postings` - Create job posting
- `GET /api/v1/job-postings/{id}` - Get by ID
- `PUT /api/v1/job-postings/{id}` - Update
- `DELETE /api/v1/job-postings/{id}` - Delete (soft)

**RBAC:** HR_MANAGERS required (ADMIN, MANAGER, HR_SPECIALIST)

#### Candidates (7 endpoints)
- `GET /api/v1/candidates` - List candidates
- `POST /api/v1/candidates/check-duplicate` - Duplicate detection
- `POST /api/v1/candidates/upload` - Upload CV (multipart)
- `GET /api/v1/candidates/{id}` - Get by ID
- `DELETE /api/v1/candidates/{id}` - Delete
- `GET /api/v1/candidates/export/xlsx` - Export to Excel
- `GET /api/v1/candidates/export/csv` - Export to CSV

**Features:**
- Usage tracking (maxCvPerMonth)
- File upload support (PDF, DOCX, TXT, max 10MB)
- MD5 hash duplicate detection
- Export formats (XLSX, CSV)

#### Analyses (10 endpoints)
- `POST /api/v1/analyses` - Create AI analysis
- `GET /api/v1/analyses` - List analyses
- `GET /api/v1/analyses/{id}` - Get results
- `DELETE /api/v1/analyses/{id}` - Delete
- `POST /api/v1/analyses/{id}/add-candidates` - Add more candidates
- `GET /api/v1/analyses/{id}/export/xlsx` - Export to Excel
- `GET /api/v1/analyses/{id}/export/csv` - Export to CSV
- `GET /api/v1/analyses/{id}/export/html` - Export to HTML
- `POST /api/v1/analyses/{id}/send-email` - Email results
- `POST /api/v1/analyses/{id}/send-feedback` - Send candidate feedback

**Features:**
- Gemini AI integration
- BullMQ queue system
- Usage tracking (maxAnalysisPerMonth)
- Multiple export formats
- Automated feedback emails

#### Offers (15 endpoints)
- `GET /api/v1/offers` - List offers
- `POST /api/v1/offers` - Create offer
- `POST /api/v1/offers/wizard` - Create from wizard
- `POST /api/v1/offers/bulk-send` - Bulk send
- `GET /api/v1/offers/{id}` - Get by ID
- `PUT /api/v1/offers/{id}` - Update
- `DELETE /api/v1/offers/{id}` - Delete
- `PATCH /api/v1/offers/{id}/send` - Send to candidate
- `GET /api/v1/offers/{id}/preview-pdf` - Preview PDF
- `GET /api/v1/offers/{id}/download-pdf` - Download PDF
- `PATCH /api/v1/offers/{id}/request-approval` - Request approval
- `PATCH /api/v1/offers/{id}/approve` - Approve
- `PATCH /api/v1/offers/{id}/reject-approval` - Reject
- `PATCH /api/v1/offers/{id}/expire` - Expire manually
- `PATCH /api/v1/offers/{id}/extend` - Extend expiration

**Features:**
- Multi-step wizard
- Approval workflow
- PDF generation
- Bulk operations
- Expiration management

#### Interviews (4 documented endpoints)
- `GET /api/v1/interviews` - List interviews
- `POST /api/v1/interviews` - Create interview
- `GET /api/v1/interviews/{id}` - Get by ID
- `DELETE /api/v1/interviews/{id}` - Delete

**Additional:** stats, conflict checking (8 total in inventory)

#### Team Management (3 documented endpoints)
- `GET /api/v1/team` - List team members
- `POST /api/v1/team/invite` - Invite member (ADMIN only)
- `GET /api/v1/team/{id}` - Get member by ID

**Additional:** update, toggle, delete, accept invitation (7 total in inventory)

#### Organizations (2 documented endpoints)
- `GET /api/v1/organization/me` - Get current organization
- `PATCH /api/v1/organization/me` - Update settings

**Features:**
- Usage statistics
- Plan management (FREE, PRO, ENTERPRISE)
- Multi-tenant isolation

#### Users (3 documented endpoints)
- `GET /api/v1/users/me` - Get current user profile
- `PATCH /api/v1/users/me` - Update profile
- `GET /api/v1/users` - List users (ADMIN only)

#### Dashboard (1 documented endpoint)
- `GET /api/v1/dashboard` - Get statistics

---

### Added - Features

#### Multi-Tenant Architecture
- Organization-level data isolation
- `organizationIsolation` middleware
- SUPER_ADMIN cross-org access
- Automatic `organizationId` filtering

#### Role-Based Access Control (RBAC)
- 5 roles: SUPER_ADMIN, ADMIN, MANAGER, HR_SPECIALIST, USER
- `authorize` middleware
- Role groups (HR_MANAGERS, ADMINS, ALL_AUTHENTICATED)
- Per-endpoint permission checks

#### Usage Tracking & Limits
- Plan-based limits (FREE, PRO, ENTERPRISE)
- Monthly analysis quota
- Monthly CV upload quota
- User count limits
- Real-time usage tracking

#### File Upload
- MinIO object storage
- Supported formats: PDF, DOCX, TXT
- Max file size: 10MB
- CV duplicate detection (MD5 hash)

#### AI Integration
- Gemini 2.0 Flash API
- CV analysis with scoring
- Batch processing (6 CVs per batch)
- Queue system (BullMQ)
- Status tracking (PENDING → PROCESSING → COMPLETED/FAILED)

#### Export Capabilities
- Excel (XLSX)
- CSV
- HTML reports
- Email delivery
- Bulk exports

---

## Security

### Authentication
- JWT token-based
- 7-day token expiration
- Redis session storage
- Rate limiting on auth endpoints

### Authorization
- Role-based access control
- Organization isolation
- Resource ownership validation

### Rate Limiting
- Auth endpoints: 100 requests / 15 minutes
- Applied per IP address
- 429 status on limit exceeded

---

## Deprecations

### None (Initial Release)

No deprecated endpoints in this version.

---

## Breaking Changes

### None (Initial Release)

---

## Migration Guides

### Future Versions

Migration guides will be provided when breaking changes are introduced.

---

## Versioning Strategy

### API Versioning
- Current: `/api/v1/...`
- Future versions: `/api/v2/...`, etc.
- Old versions supported for 6 months after new version release

### Documentation Versioning
- OpenAPI spec tagged with version number
- Changelog maintained for all versions
- SDK versions aligned with API versions

---

## Known Issues

### Current Limitations
- No GraphQL support (REST only)
- No WebSocket support (planned for v1.1)
- No webhook subscriptions (planned for v1.2)
- Rate limits apply globally (not per user)

### Upcoming Fixes
- None currently planned

---

## Roadmap

### v1.1.0 (Planned: Q1 2025)
- WebSocket support for real-time notifications
- Interview scheduling conflict detection
- Advanced search with Elasticsearch
- File preview in browser

### v1.2.0 (Planned: Q2 2025)
- Webhook subscriptions
- Custom report builder
- Bulk import/export (Excel)
- Advanced analytics dashboard

### v2.0.0 (Planned: Q3 2025)
- GraphQL API
- Mobile SDK (React Native)
- SSO integration (OAuth, SAML)
- Audit logs

---

## Support

**Issues:** [GitHub Issues](https://github.com/masan3134/ikaiapp/issues)
**Email:** info@gaiai.ai
**Documentation:** [API Docs](README.md)

---

## Contributors

- **Worker Claude (Sonnet 4.5)** - Initial API documentation
- **IKAI Dev Team** - API development and maintenance

---

**Last Updated:** 2025-11-04
**Maintained By:** IKAI Dev Team
