# 📚 Worker #1 - Complete API Documentation (Swagger/OpenAPI + Postman)

**Task ID:** worker1-api-documentation
**Assigned To:** Worker #1
**Created By:** Master Claude (Mod)
**Date:** 2025-11-04
**Priority:** HIGH
**Estimated Time:** 90-120 minutes

---

## 🎯 Objective

Create **comprehensive API documentation** for all 120+ backend endpoints using:
- ✅ Swagger/OpenAPI specification (JSON)
- ✅ Markdown documentation files
- ✅ Postman collection (importable)
- ✅ Request/response examples
- ✅ RBAC permissions per endpoint
- ✅ Error responses

**Expected Outcome:** Developer-friendly API docs that any frontend dev or third-party integrator can use.

---

## 📋 Background

### Current State
- ✅ **Backend:** 120+ endpoints operational
- ✅ **RBAC:** Complete (authorize middleware on all routes)
- ❌ **Documentation:** Missing or incomplete
- 🐛 **Problem:** New developers struggle to understand API

### API Categories
1. **Auth:** Login, register, refresh token, logout
2. **Job Postings:** CRUD + search + statistics
3. **Candidates:** CRUD + upload CV + search
4. **Analyses:** Create, list, get by ID, delete
5. **Offers:** CRUD + status updates
6. **Interviews:** CRUD + scheduling + feedback
7. **Team Management:** Invite, accept, list, remove
8. **Organizations:** Get info, update, usage stats
9. **Users:** Profile, update, list
10. **Analytics:** Dashboard stats, reports
11. **Queue:** Health check, job stats (admin only)

### Total Endpoints
- **Public:** 3 (login, register, health)
- **Protected:** 117+ (require authentication)
- **Admin Only:** ~15 (SUPER_ADMIN, ADMIN)

---

## 🛠️ Task Breakdown

### Phase 1: Endpoint Inventory - 20 min

**Goal:** List ALL endpoints from backend routes

#### Task 1.1: Extract All Route Files

```bash
# List all route files
find backend/src/routes -name "*Routes.js" -type f

# Expected output:
# backend/src/routes/authRoutes.js
# backend/src/routes/userRoutes.js
# backend/src/routes/jobPostingRoutes.js
# backend/src/routes/candidateRoutes.js
# backend/src/routes/analysisRoutes.js
# backend/src/routes/offerRoutes.js
# backend/src/routes/interviewRoutes.js
# backend/src/routes/teamRoutes.js
# backend/src/routes/organizationRoutes.js
# backend/src/routes/analyticsRoutes.js
# backend/src/routes/queueRoutes.js
# ... etc
```

---

#### Task 1.2: Count Endpoints Per Category

```bash
# Count routes in each file
for file in backend/src/routes/*Routes.js; do
  echo "=== $(basename $file) ==="
  grep -E "router\.(get|post|put|patch|delete)" "$file" | wc -l
done

# Create summary table
```

**Expected Output Example:**
```
=== authRoutes.js ===
4 endpoints

=== jobPostingRoutes.js ===
8 endpoints

=== candidateRoutes.js ===
9 endpoints

... (total: 120+)
```

**Save to:** `docs/api/endpoint-inventory.md`

**Format:**
```markdown
# API Endpoint Inventory

**Total Endpoints:** 120+
**Last Updated:** 2025-11-04

## Summary by Category

| Category | File | Endpoints | Auth Required | Admin Only |
|----------|------|-----------|---------------|------------|
| Auth | authRoutes.js | 4 | Partial | 0 |
| Job Postings | jobPostingRoutes.js | 8 | Yes | 2 |
| Candidates | candidateRoutes.js | 9 | Yes | 2 |
| ... | ... | ... | ... | ... |

**Total:** 120+ endpoints
```

**Git Commit:**
```bash
git add docs/api/endpoint-inventory.md
git commit -m "docs(api): Add endpoint inventory - 120+ endpoints catalogued

Inventory includes:
- Endpoint count per category
- Auth requirements
- Admin-only endpoints
- File locations

Foundation for API documentation"
```

---

### Phase 2: OpenAPI/Swagger Specification - 40 min

**Goal:** Create OpenAPI 3.0 JSON specification

#### Task 2.1: Create OpenAPI Base Structure

**File:** `docs/api/openapi.json`

```json
{
  "openapi": "3.0.0",
  "info": {
    "title": "IKAI HR Platform API",
    "version": "1.0.0",
    "description": "Complete API documentation for IKAI HR recruitment platform with multi-tenant architecture and role-based access control.",
    "contact": {
      "name": "IKAI Support",
      "email": "info@gaiai.ai"
    }
  },
  "servers": [
    {
      "url": "http://localhost:8102",
      "description": "Development server"
    },
    {
      "url": "https://gaiai.ai/ik",
      "description": "Production server"
    }
  ],
  "components": {
    "securitySchemes": {
      "bearerAuth": {
        "type": "http",
        "scheme": "bearer",
        "bearerFormat": "JWT"
      }
    },
    "schemas": {
      "User": {
        "type": "object",
        "properties": {
          "id": { "type": "string", "format": "uuid" },
          "email": { "type": "string", "format": "email" },
          "name": { "type": "string" },
          "role": {
            "type": "string",
            "enum": ["SUPER_ADMIN", "ADMIN", "MANAGER", "HR_SPECIALIST", "USER"]
          },
          "organizationId": { "type": "string", "format": "uuid" }
        }
      },
      "JobPosting": {
        "type": "object",
        "properties": {
          "id": { "type": "string", "format": "uuid" },
          "title": { "type": "string" },
          "description": { "type": "string" },
          "requirements": { "type": "string" },
          "location": { "type": "string" },
          "salary": { "type": "number" },
          "status": {
            "type": "string",
            "enum": ["DRAFT", "PUBLISHED", "CLOSED", "ARCHIVED"]
          },
          "organizationId": { "type": "string", "format": "uuid" },
          "createdAt": { "type": "string", "format": "date-time" },
          "updatedAt": { "type": "string", "format": "date-time" }
        }
      },
      "Candidate": {
        "type": "object",
        "properties": {
          "id": { "type": "string", "format": "uuid" },
          "name": { "type": "string" },
          "email": { "type": "string", "format": "email" },
          "phone": { "type": "string" },
          "cvUrl": { "type": "string", "format": "uri" },
          "organizationId": { "type": "string", "format": "uuid" },
          "createdAt": { "type": "string", "format": "date-time" }
        }
      },
      "Error": {
        "type": "object",
        "properties": {
          "error": { "type": "string" },
          "message": { "type": "string" },
          "statusCode": { "type": "integer" }
        }
      }
    }
  },
  "paths": {}
}
```

---

#### Task 2.2: Document Auth Endpoints

**Add to `paths` in openapi.json:**

```json
"/api/v1/auth/login": {
  "post": {
    "tags": ["Authentication"],
    "summary": "Login to the platform",
    "description": "Authenticate user with email and password. Returns JWT token.",
    "requestBody": {
      "required": true,
      "content": {
        "application/json": {
          "schema": {
            "type": "object",
            "required": ["email", "password"],
            "properties": {
              "email": {
                "type": "string",
                "format": "email",
                "example": "test-admin@test-org-1.com"
              },
              "password": {
                "type": "string",
                "format": "password",
                "example": "TestPass123!"
              }
            }
          }
        }
      }
    },
    "responses": {
      "200": {
        "description": "Login successful",
        "content": {
          "application/json": {
            "schema": {
              "type": "object",
              "properties": {
                "token": {
                  "type": "string",
                  "example": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                },
                "user": {
                  "$ref": "#/components/schemas/User"
                }
              }
            }
          }
        }
      },
      "401": {
        "description": "Invalid credentials",
        "content": {
          "application/json": {
            "schema": {
              "$ref": "#/components/schemas/Error"
            }
          }
        }
      }
    }
  }
},
"/api/v1/auth/register": {
  "post": {
    "tags": ["Authentication"],
    "summary": "Register new user",
    "description": "Create new user account with organization setup",
    "requestBody": {
      "required": true,
      "content": {
        "application/json": {
          "schema": {
            "type": "object",
            "required": ["email", "password", "name", "organizationName"],
            "properties": {
              "email": { "type": "string", "format": "email" },
              "password": { "type": "string", "minLength": 8 },
              "name": { "type": "string" },
              "organizationName": { "type": "string" }
            }
          }
        }
      }
    },
    "responses": {
      "201": {
        "description": "Registration successful",
        "content": {
          "application/json": {
            "schema": {
              "type": "object",
              "properties": {
                "token": { "type": "string" },
                "user": { "$ref": "#/components/schemas/User" }
              }
            }
          }
        }
      },
      "400": {
        "description": "Validation error or email already exists"
      }
    }
  }
}
```

---

#### Task 2.3: Document Job Postings Endpoints

```json
"/api/v1/job-postings": {
  "get": {
    "tags": ["Job Postings"],
    "summary": "Get all job postings",
    "description": "Returns job postings for current organization. SUPER_ADMIN sees all organizations.",
    "security": [{ "bearerAuth": [] }],
    "x-rbac": {
      "roles": ["SUPER_ADMIN", "ADMIN", "MANAGER", "HR_SPECIALIST"],
      "description": "USER role cannot access this endpoint"
    },
    "parameters": [
      {
        "in": "query",
        "name": "status",
        "schema": {
          "type": "string",
          "enum": ["DRAFT", "PUBLISHED", "CLOSED", "ARCHIVED"]
        },
        "description": "Filter by status"
      },
      {
        "in": "query",
        "name": "page",
        "schema": { "type": "integer", "default": 1 }
      },
      {
        "in": "query",
        "name": "limit",
        "schema": { "type": "integer", "default": 20 }
      }
    ],
    "responses": {
      "200": {
        "description": "List of job postings",
        "content": {
          "application/json": {
            "schema": {
              "type": "array",
              "items": { "$ref": "#/components/schemas/JobPosting" }
            }
          }
        }
      },
      "403": {
        "description": "Insufficient permissions (USER role)"
      }
    }
  },
  "post": {
    "tags": ["Job Postings"],
    "summary": "Create new job posting",
    "security": [{ "bearerAuth": [] }],
    "x-rbac": {
      "roles": ["SUPER_ADMIN", "ADMIN", "MANAGER"],
      "description": "Only ADMIN and MANAGER can create"
    },
    "requestBody": {
      "required": true,
      "content": {
        "application/json": {
          "schema": {
            "type": "object",
            "required": ["title", "description"],
            "properties": {
              "title": { "type": "string", "example": "Senior Frontend Developer" },
              "description": { "type": "string" },
              "requirements": { "type": "string" },
              "location": { "type": "string", "example": "Istanbul, Turkey" },
              "salary": { "type": "number", "example": 50000 },
              "status": { "type": "string", "enum": ["DRAFT", "PUBLISHED"], "default": "DRAFT" }
            }
          }
        }
      }
    },
    "responses": {
      "201": {
        "description": "Job posting created",
        "content": {
          "application/json": {
            "schema": { "$ref": "#/components/schemas/JobPosting" }
          }
        }
      },
      "403": {
        "description": "Insufficient permissions (HR_SPECIALIST, USER)"
      }
    }
  }
},
"/api/v1/job-postings/{id}": {
  "get": {
    "tags": ["Job Postings"],
    "summary": "Get job posting by ID",
    "security": [{ "bearerAuth": [] }],
    "x-rbac": {
      "roles": ["SUPER_ADMIN", "ADMIN", "MANAGER", "HR_SPECIALIST"]
    },
    "parameters": [
      {
        "in": "path",
        "name": "id",
        "required": true,
        "schema": { "type": "string", "format": "uuid" }
      }
    ],
    "responses": {
      "200": {
        "description": "Job posting details",
        "content": {
          "application/json": {
            "schema": { "$ref": "#/components/schemas/JobPosting" }
          }
        }
      },
      "404": {
        "description": "Job posting not found"
      },
      "403": {
        "description": "Cannot access other organization's job posting"
      }
    }
  },
  "put": {
    "tags": ["Job Postings"],
    "summary": "Update job posting",
    "security": [{ "bearerAuth": [] }],
    "x-rbac": {
      "roles": ["SUPER_ADMIN", "ADMIN", "MANAGER"]
    },
    "parameters": [
      {
        "in": "path",
        "name": "id",
        "required": true,
        "schema": { "type": "string", "format": "uuid" }
      }
    ],
    "requestBody": {
      "required": true,
      "content": {
        "application/json": {
          "schema": {
            "type": "object",
            "properties": {
              "title": { "type": "string" },
              "description": { "type": "string" },
              "status": { "type": "string", "enum": ["DRAFT", "PUBLISHED", "CLOSED", "ARCHIVED"] }
            }
          }
        }
      }
    },
    "responses": {
      "200": {
        "description": "Job posting updated"
      },
      "403": {
        "description": "Insufficient permissions"
      },
      "404": {
        "description": "Job posting not found"
      }
    }
  },
  "delete": {
    "tags": ["Job Postings"],
    "summary": "Delete job posting",
    "security": [{ "bearerAuth": [] }],
    "x-rbac": {
      "roles": ["SUPER_ADMIN", "ADMIN"],
      "description": "Only ADMIN can delete"
    },
    "parameters": [
      {
        "in": "path",
        "name": "id",
        "required": true,
        "schema": { "type": "string", "format": "uuid" }
      }
    ],
    "responses": {
      "204": {
        "description": "Job posting deleted"
      },
      "403": {
        "description": "Insufficient permissions (MANAGER, HR_SPECIALIST)"
      },
      "404": {
        "description": "Job posting not found"
      }
    }
  }
}
```

**Note:** Continue for all endpoint categories (candidates, analyses, offers, interviews, etc.)

**Save incrementally** and commit after each major category.

---

#### Task 2.4: Add RBAC Documentation Section

**In openapi.json, add custom field:**

```json
"x-rbac-matrix": {
  "description": "Role-Based Access Control Matrix",
  "roles": {
    "SUPER_ADMIN": {
      "description": "System administrator with cross-organization access",
      "permissions": "All endpoints, can see data from all organizations"
    },
    "ADMIN": {
      "description": "Organization administrator",
      "permissions": "Full access within organization, cannot see other orgs"
    },
    "MANAGER": {
      "description": "Department manager",
      "permissions": "Can create/edit job postings, offers, interviews. Cannot delete."
    },
    "HR_SPECIALIST": {
      "description": "HR staff member",
      "permissions": "Can manage candidates, schedule interviews. Cannot create job postings or delete."
    },
    "USER": {
      "description": "Basic employee",
      "permissions": "Dashboard and profile only. No HR operations."
    }
  },
  "endpoints": {
    "POST /api/v1/job-postings": ["SUPER_ADMIN", "ADMIN", "MANAGER"],
    "DELETE /api/v1/job-postings/:id": ["SUPER_ADMIN", "ADMIN"],
    "POST /api/v1/candidates": ["SUPER_ADMIN", "ADMIN", "MANAGER", "HR_SPECIALIST"],
    "DELETE /api/v1/candidates/:id": ["SUPER_ADMIN", "ADMIN"]
  }
}
```

**Git Commit:**
```bash
git add docs/api/openapi.json
git commit -m "docs(api): Add OpenAPI 3.0 specification

Documented endpoints:
- Authentication (4 endpoints)
- Job Postings (8 endpoints)
- Candidates (partial)

Includes:
- Request/response schemas
- RBAC permissions (x-rbac field)
- Error responses
- Example values

Foundation for Swagger UI integration"
```

---

### Phase 3: Markdown Documentation - 30 min

**Goal:** Create human-readable Markdown docs

#### Task 3.1: Create API Overview

**File:** `docs/api/README.md`

```markdown
# IKAI API Documentation

**Version:** 1.0.0
**Base URL (Dev):** http://localhost:8102
**Base URL (Prod):** https://gaiai.ai/ik

---

## 📚 Quick Links

- [OpenAPI Specification](openapi.json) - Machine-readable API spec
- [Postman Collection](postman-collection.json) - Importable collection
- [Endpoint Inventory](endpoint-inventory.md) - Complete endpoint list
- [RBAC Guide](rbac-guide.md) - Role permissions matrix

---

## 🔐 Authentication

All protected endpoints require JWT token in Authorization header:

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Login

**POST** `/api/v1/auth/login`

**Request:**
```json
{
  "email": "test-admin@test-org-1.com",
  "password": "TestPass123!"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "test-admin@test-org-1.com",
    "name": "Test ADMIN 1",
    "role": "ADMIN",
    "organizationId": "org-uuid"
  }
}
```

---

## 🏢 Multi-Tenant Architecture

- Each organization has isolated data
- `organizationId` automatically added by middleware
- SUPER_ADMIN can access all organizations
- Regular users limited to their organization

---

## 🎭 Role-Based Access Control (RBAC)

### 5 Roles

| Role | Description | Permissions |
|------|-------------|-------------|
| **SUPER_ADMIN** | System admin | All endpoints, cross-org access |
| **ADMIN** | Org admin | Full access within org |
| **MANAGER** | Department manager | Create/edit (no delete) |
| **HR_SPECIALIST** | HR staff | Candidates, interviews |
| **USER** | Employee | Dashboard only |

### Permission Matrix

| Endpoint | USER | HR | MGR | ADMIN | SUPER |
|----------|------|-----|-----|-------|-------|
| GET /job-postings | ❌ | ✅ | ✅ | ✅ | ✅ |
| POST /job-postings | ❌ | ❌ | ✅ | ✅ | ✅ |
| DELETE /job-postings/:id | ❌ | ❌ | ❌ | ✅ | ✅ |
| POST /candidates | ❌ | ✅ | ✅ | ✅ | ✅ |
| DELETE /candidates/:id | ❌ | ❌ | ❌ | ✅ | ✅ |

---

## 📋 Endpoint Categories

### Authentication
- POST /api/v1/auth/login
- POST /api/v1/auth/register
- POST /api/v1/auth/refresh
- POST /api/v1/auth/logout

### Job Postings
- GET /api/v1/job-postings
- POST /api/v1/job-postings
- GET /api/v1/job-postings/:id
- PUT /api/v1/job-postings/:id
- DELETE /api/v1/job-postings/:id
- GET /api/v1/job-postings/:id/statistics

### Candidates
- GET /api/v1/candidates
- POST /api/v1/candidates
- GET /api/v1/candidates/:id
- PUT /api/v1/candidates/:id
- DELETE /api/v1/candidates/:id
- POST /api/v1/candidates/upload-cv (multipart/form-data)

### Analyses
- GET /api/v1/analyses
- POST /api/v1/analyses (upload CV + jobPostingId)
- GET /api/v1/analyses/:id
- DELETE /api/v1/analyses/:id

### Offers
- GET /api/v1/offers
- POST /api/v1/offers
- GET /api/v1/offers/:id
- PUT /api/v1/offers/:id
- DELETE /api/v1/offers/:id

### Interviews
- GET /api/v1/interviews
- POST /api/v1/interviews
- GET /api/v1/interviews/:id
- PUT /api/v1/interviews/:id
- DELETE /api/v1/interviews/:id

---

## 🚨 Error Responses

All errors follow consistent format:

```json
{
  "error": "ERROR_CODE",
  "message": "Human-readable error message",
  "statusCode": 400
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
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource not found |
| 500 | Server Error | Internal error |

---

## 📊 Pagination

List endpoints support pagination:

**Query Parameters:**
- `page` (default: 1)
- `limit` (default: 20, max: 100)

**Response:**
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  }
}
```

---

## 🔍 Filtering & Search

Most list endpoints support filtering:

**Job Postings:**
- `?status=PUBLISHED`
- `?location=Istanbul`
- `?salary[gte]=50000`

**Candidates:**
- `?search=John%20Doe`
- `?jobPostingId=uuid`

---

## 📤 File Uploads

### Upload CV for Analysis

**POST** `/api/v1/analyses`

**Content-Type:** `multipart/form-data`

**Form Fields:**
- `file` (required) - CV file (PDF, DOCX, TXT)
- `jobPostingId` (required) - UUID

**Example (curl):**
```bash
curl -X POST http://localhost:8102/api/v1/analyses \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@/path/to/cv.pdf" \
  -F "jobPostingId=uuid"
```

**Response:**
```json
{
  "id": "analysis-uuid",
  "status": "PENDING",
  "candidateId": "candidate-uuid",
  "jobPostingId": "job-uuid"
}
```

---

## 🧪 Testing

### Test Accounts

| Email | Password | Role | Org |
|-------|----------|------|-----|
| info@gaiai.ai | 23235656 | SUPER_ADMIN | Default |
| test-admin@test-org-1.com | TestPass123! | ADMIN | Org 1 (FREE) |
| test-hr_specialist@test-org-1.com | TestPass123! | HR_SPECIALIST | Org 1 |
| test-user@test-org-1.com | TestPass123! | USER | Org 1 |

### Python Test Helper

```python
python3 -i scripts/test-helper.py

helper = IKAITestHelper()
helper.login('test-admin@test-org-1.com', 'TestPass123!')
helper.get('/api/v1/job-postings')
```

---

## 📚 Additional Resources

- [Test Data Reference](../test-tasks/COMPLETE-TEST-DATA-REFERENCE.md)
- [RBAC Strategy](../architecture/RBAC-COMPLETE-STRATEGY.md)
- [Queue System](../reports/2025-11-02-queue-system-implementation.md)

---

**Last Updated:** 2025-11-04
**Maintained By:** IKAI Dev Team
```

**Git Commit:**
```bash
git add docs/api/README.md
git commit -m "docs(api): Add comprehensive API documentation README

Includes:
- Authentication guide with examples
- Multi-tenant architecture explanation
- RBAC permission matrix (5 roles)
- All endpoint categories listed
- Error response formats
- Pagination & filtering guide
- File upload instructions
- Test accounts table
- Python test helper usage

Complete getting-started guide for API consumers"
```

---

### Phase 4: Postman Collection - 30 min

**Goal:** Create importable Postman collection

#### Task 4.1: Create Postman Collection

**File:** `docs/api/postman-collection.json`

```json
{
  "info": {
    "name": "IKAI HR Platform API",
    "description": "Complete API collection for IKAI recruitment platform",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "auth": {
    "type": "bearer",
    "bearer": [
      {
        "key": "token",
        "value": "{{jwt_token}}",
        "type": "string"
      }
    ]
  },
  "variable": [
    {
      "key": "base_url",
      "value": "http://localhost:8102",
      "type": "string"
    },
    {
      "key": "jwt_token",
      "value": "",
      "type": "string"
    }
  ],
  "item": [
    {
      "name": "Authentication",
      "item": [
        {
          "name": "Login (ADMIN)",
          "event": [
            {
              "listen": "test",
              "script": {
                "exec": [
                  "// Save token to environment",
                  "if (pm.response.code === 200) {",
                  "    const response = pm.response.json();",
                  "    pm.collectionVariables.set('jwt_token', response.token);",
                  "    console.log('Token saved:', response.token);",
                  "}"
                ]
              }
            }
          ],
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"email\": \"test-admin@test-org-1.com\",\n  \"password\": \"TestPass123!\"\n}"
            },
            "url": {
              "raw": "{{base_url}}/api/v1/auth/login",
              "host": ["{{base_url}}"],
              "path": ["api", "v1", "auth", "login"]
            }
          }
        },
        {
          "name": "Login (SUPER_ADMIN)",
          "event": [
            {
              "listen": "test",
              "script": {
                "exec": [
                  "if (pm.response.code === 200) {",
                  "    const response = pm.response.json();",
                  "    pm.collectionVariables.set('jwt_token', response.token);",
                  "}"
                ]
              }
            }
          ],
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"email\": \"info@gaiai.ai\",\n  \"password\": \"23235656\"\n}"
            },
            "url": {
              "raw": "{{base_url}}/api/v1/auth/login",
              "host": ["{{base_url}}"],
              "path": ["api", "v1", "auth", "login"]
            }
          }
        }
      ]
    },
    {
      "name": "Job Postings",
      "item": [
        {
          "name": "Get All Job Postings",
          "request": {
            "auth": {
              "type": "bearer",
              "bearer": [
                {
                  "key": "token",
                  "value": "{{jwt_token}}",
                  "type": "string"
                }
              ]
            },
            "method": "GET",
            "url": {
              "raw": "{{base_url}}/api/v1/job-postings",
              "host": ["{{base_url}}"],
              "path": ["api", "v1", "job-postings"]
            }
          }
        },
        {
          "name": "Create Job Posting",
          "request": {
            "auth": {
              "type": "bearer",
              "bearer": [
                {
                  "key": "token",
                  "value": "{{jwt_token}}",
                  "type": "string"
                }
              ]
            },
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"title\": \"Senior Backend Developer\",\n  \"description\": \"We are looking for an experienced backend developer...\",\n  \"requirements\": \"5+ years Node.js, PostgreSQL, Docker\",\n  \"location\": \"Istanbul, Turkey\",\n  \"salary\": 80000,\n  \"status\": \"PUBLISHED\"\n}"
            },
            "url": {
              "raw": "{{base_url}}/api/v1/job-postings",
              "host": ["{{base_url}}"],
              "path": ["api", "v1", "job-postings"]
            }
          }
        },
        {
          "name": "Get Job Posting by ID",
          "request": {
            "auth": {
              "type": "bearer",
              "bearer": [
                {
                  "key": "token",
                  "value": "{{jwt_token}}",
                  "type": "string"
                }
              ]
            },
            "method": "GET",
            "url": {
              "raw": "{{base_url}}/api/v1/job-postings/:id",
              "host": ["{{base_url}}"],
              "path": ["api", "v1", "job-postings", ":id"],
              "variable": [
                {
                  "key": "id",
                  "value": "job-posting-uuid"
                }
              ]
            }
          }
        }
      ]
    },
    {
      "name": "Candidates",
      "item": [
        {
          "name": "Get All Candidates",
          "request": {
            "auth": {
              "type": "bearer",
              "bearer": [
                {
                  "key": "token",
                  "value": "{{jwt_token}}",
                  "type": "string"
                }
              ]
            },
            "method": "GET",
            "url": {
              "raw": "{{base_url}}/api/v1/candidates",
              "host": ["{{base_url}}"],
              "path": ["api", "v1", "candidates"]
            }
          }
        },
        {
          "name": "Create Candidate",
          "request": {
            "auth": {
              "type": "bearer",
              "bearer": [
                {
                  "key": "token",
                  "value": "{{jwt_token}}",
                  "type": "string"
                }
              ]
            },
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"name\": \"John Doe\",\n  \"email\": \"john.doe@example.com\",\n  \"phone\": \"+905551234567\",\n  \"cvUrl\": \"https://example.com/cv.pdf\"\n}"
            },
            "url": {
              "raw": "{{base_url}}/api/v1/candidates",
              "host": ["{{base_url}}"],
              "path": ["api", "v1", "candidates"]
            }
          }
        }
      ]
    },
    {
      "name": "Analyses",
      "item": [
        {
          "name": "Upload CV for Analysis",
          "request": {
            "auth": {
              "type": "bearer",
              "bearer": [
                {
                  "key": "token",
                  "value": "{{jwt_token}}",
                  "type": "string"
                }
              ]
            },
            "method": "POST",
            "header": [],
            "body": {
              "mode": "formdata",
              "formdata": [
                {
                  "key": "file",
                  "type": "file",
                  "src": "/path/to/cv.pdf"
                },
                {
                  "key": "jobPostingId",
                  "value": "job-posting-uuid",
                  "type": "text"
                }
              ]
            },
            "url": {
              "raw": "{{base_url}}/api/v1/analyses",
              "host": ["{{base_url}}"],
              "path": ["api", "v1", "analyses"]
            }
          }
        },
        {
          "name": "Get All Analyses",
          "request": {
            "auth": {
              "type": "bearer",
              "bearer": [
                {
                  "key": "token",
                  "value": "{{jwt_token}}",
                  "type": "string"
                }
              ]
            },
            "method": "GET",
            "url": {
              "raw": "{{base_url}}/api/v1/analyses",
              "host": ["{{base_url}}"],
              "path": ["api", "v1", "analyses"]
            }
          }
        }
      ]
    }
  ]
}
```

**Note:** Continue for all endpoint categories

**Git Commit:**
```bash
git add docs/api/postman-collection.json
git commit -m "docs(api): Add Postman collection with auto-token

Collection includes:
- Auth endpoints (auto-save token script)
- Job postings (CRUD)
- Candidates (CRUD)
- Analyses (file upload)
- Environment variables (base_url, jwt_token)

Importable into Postman for instant API testing"
```

---

## ✅ Verification Checklist

### Phase 1: Endpoint Inventory
- [ ] All route files listed
- [ ] Endpoint count per category calculated
- [ ] `endpoint-inventory.md` created with summary table
- [ ] Total endpoint count verified (120+)

### Phase 2: OpenAPI Specification
- [ ] `openapi.json` created with base structure
- [ ] Auth endpoints documented (4)
- [ ] Job postings documented (8)
- [ ] Candidates documented (9)
- [ ] Analyses documented (4)
- [ ] Offers documented (5)
- [ ] Interviews documented (5)
- [ ] RBAC matrix added (x-rbac field)
- [ ] Error schemas defined
- [ ] Example values provided

### Phase 3: Markdown Documentation
- [ ] `README.md` created with overview
- [ ] Authentication guide with examples
- [ ] RBAC permission matrix
- [ ] All endpoint categories listed
- [ ] Error response format documented
- [ ] Pagination guide
- [ ] File upload instructions
- [ ] Test accounts table

### Phase 4: Postman Collection
- [ ] `postman-collection.json` created
- [ ] Auto-token script added (login requests)
- [ ] Environment variables defined
- [ ] Auth requests (login endpoints)
- [ ] Job postings requests (CRUD)
- [ ] Candidates requests (CRUD)
- [ ] Analyses request (file upload)
- [ ] All major categories included

---

## 📊 Success Criteria

### Critical (Must Pass)
- ✅ **Endpoint inventory** complete (120+ endpoints)
- ✅ **OpenAPI spec** valid JSON (can be imported to Swagger UI)
- ✅ **RBAC permissions** documented for each endpoint
- ✅ **Request/response examples** for all major endpoints
- ✅ **Markdown README** comprehensive and readable
- ✅ **Postman collection** importable and functional
- ✅ **Auto-token script** works (login → save token → use in next requests)

### Optional (Nice to Have)
- ✅ Response time examples
- ✅ Rate limiting documentation
- ✅ Webhook documentation (if applicable)
- ✅ WebSocket documentation (if applicable)

---

## 📝 Deliverables

### Required Files
1. ✅ `docs/api/endpoint-inventory.md` - Complete endpoint list
2. ✅ `docs/api/openapi.json` - OpenAPI 3.0 specification
3. ✅ `docs/api/README.md` - Human-readable documentation
4. ✅ `docs/api/postman-collection.json` - Postman collection

### Required Report
**Filename:** `docs/reports/worker1-api-documentation-report.md`

**Sections:**
1. Executive Summary (what was documented)
2. Endpoint Inventory (total count, categories)
3. OpenAPI Specification (structure, schemas)
4. Markdown Documentation (sections included)
5. Postman Collection (features, auto-token)
6. Testing Results (imported to Swagger UI? Postman?)
7. Recommendations (missing docs, improvements)

### Git Commits Expected
1. ✅ Endpoint inventory
2. ✅ OpenAPI specification (may be multiple commits)
3. ✅ Markdown README
4. ✅ Postman collection

**Total: 4-6 commits**

---

## ⏱️ Estimated Time

**Total: 90-120 minutes**

- Phase 1 (Endpoint Inventory): 20 min
- Phase 2 (OpenAPI Spec): 40 min
- Phase 3 (Markdown Docs): 30 min
- Phase 4 (Postman Collection): 30 min
- Testing & Validation: 10 min
- Report Writing: 15-20 min

---

## 🎯 AsanMod Rules

**STRICT_MODE Enabled:**
- ❌ NO simulation - Document REAL endpoints only
- ❌ NO placeholder examples - Use ACTUAL request/response from backend
- ✅ REAL testing - Import to Postman/Swagger and test
- ✅ REAL commits - Git commit after each phase

**After Each Phase:**
- ✅ Git commit with descriptive message
- ✅ Verify JSON validity (for OpenAPI/Postman)

**After Task:**
- ✅ Write documentation report
- ✅ Test Postman collection (import & run requests)
- ✅ Validate OpenAPI spec (can use online validator)
- ✅ Report to Mod with summary

---

## 📚 Reference Documents

- **Backend Routes:** `backend/src/routes/`
- **Controllers:** `backend/src/controllers/`
- **RBAC Middleware:** `backend/src/middleware/authorize.js`
- **Test Accounts:** [`docs/test-tasks/COMPLETE-TEST-DATA-REFERENCE.md`](COMPLETE-TEST-DATA-REFERENCE.md)

---

## 🧪 Testing Steps

### Step 1: Validate OpenAPI Spec

```bash
# Use online validator
# https://editor.swagger.io/
# Copy/paste openapi.json content
```

**Expected:** No errors, spec loads correctly

---

### Step 2: Import Postman Collection

1. Open Postman
2. File → Import → Upload `postman-collection.json`
3. Verify collection imported
4. Check environment variables (base_url, jwt_token)

---

### Step 3: Test Postman Requests

```
1. Run "Login (ADMIN)" request
2. Check if jwt_token variable populated
3. Run "Get All Job Postings" request
4. Verify token auto-added to Authorization header
5. Check response (should return job postings)
```

**Expected:**
- ✅ Token saved automatically after login
- ✅ Subsequent requests use token
- ✅ 200 response with data

---

## 🚨 Common Issues & Fixes

### Issue 1: OpenAPI JSON Invalid

**Symptom:** Swagger Editor shows errors
**Debug:** Use JSON linter (https://jsonlint.com/)
**Fix:** Fix syntax errors (missing commas, brackets)

---

### Issue 2: Postman Token Not Saving

**Symptom:** jwt_token variable empty after login
**Debug:** Check "Test" script in login request
**Fix:** Ensure script has `pm.collectionVariables.set('jwt_token', response.token);`

---

### Issue 3: 401 Unauthorized in Postman

**Symptom:** Requests fail with 401
**Debug:** Check if token in Authorization header
**Fix:** Run login request first, ensure token saved

---

**🚀 START: Phase 1, Task 1.1 (Extract All Route Files)**

**IMPORTANT:** Document REAL endpoints only! Test Postman collection before finalizing!
