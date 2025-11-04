# W2: HR_SPECIALIST Role - Comprehensive Full-Stack Test

**Worker:** W2
**Role:** HR_SPECIALIST
**Duration:** 90 minutes
**Scope:** Recruitment pipeline (jobs, candidates, analyses, offers)

---

## 🎯 YOUR MISSION

**LARGEST TEST - HR is core!**
- Frontend: 16 pages
- Backend: 30 endpoints
- Database: 20 queries
- RBAC: 30 permission checks
- CRUD: Full CRUD on all HR entities

---

## 🖥️ FRONTEND (16 Pages)

**Core HR pages:**
```
1. /hr-dashboard
2-5. Job postings (list, new, detail, edit)
6-7. Candidates (list, detail)
8-11. Wizard (main, step-1, step-2, step-3)
12-13. Analyses (list, detail)
14-15. Offers (list, wizard)
16. Interviews
+ Settings (6 pages)
```

---

## ⚙️ BACKEND (30 Endpoints!)

**Job Postings (10):**
```python
# Full CRUD + extras
POST /job-postings (create)
GET /job-postings (list with filters)
GET /job-postings/:id (detail)
PATCH /job-postings/:id (update)
DELETE /job-postings/:id
POST /job-postings/:id/publish
POST /job-postings/:id/unpublish
GET /job-postings/:id/candidates
GET /job-postings/:id/analytics
POST /job-postings/:id/duplicate
```

**Candidates (8):**
```python
POST /candidates/upload (CV upload)
GET /candidates (list)
GET /candidates/:id
PATCH /candidates/:id
DELETE /candidates/:id
POST /candidates/:id/notes
GET /candidates/:id/timeline
POST /candidates/:id/status
```

**Analyses (8):**
```python
POST /analyses/wizard
POST /analyses/wizard/upload-cvs
POST /analyses/wizard/complete
GET /analyses
GET /analyses/:id
GET /analyses/:id/results
POST /analyses/:id/regenerate
DELETE /analyses/:id
```

**Others (4):**
```python
GET /offers
POST /offers/wizard
GET /interviews
POST /interviews/schedule
```

---

## 🗄️ DATABASE (20 Queries)

**Verify organizationId in ALL:**
```
JobPosting queries: 8
Candidate queries: 6
Analysis queries: 4
Offer queries: 2

Total: 20 queries
Expected: ALL have organizationId filter!
```

---

## 🔒 RBAC (30 Checks)

**HR should:**
```
✅ All HR operations
✅ View/manage jobs, candidates
❌ NOT team management
❌ NOT analytics
❌ NOT org settings
❌ NOT super-admin
```

---

## ✏️ CRUD (Full)

Test CREATE, READ, UPDATE, DELETE for:
- Job postings ✅
- Candidates ✅
- Analyses ✅

---

## 📊 DELIVERABLE

`docs/reports/w2-comprehensive-hr.md`

**Time: 90 min (largest test!)**

**W2, START!** 🚀
