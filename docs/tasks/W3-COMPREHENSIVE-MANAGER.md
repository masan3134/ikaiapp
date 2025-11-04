# W3: MANAGER Role - Comprehensive Full-Stack Test

**Worker:** W3
**Role:** MANAGER
**Duration:** 75 minutes
**Scope:** Team management + Analytics + All HR features

---

## 🎯 MISSION

**HR + MANAGER features:**
- Frontend: 18 pages (all HR + team + analytics)
- Backend: 15 endpoints (team, analytics)
- Database: 12 queries
- RBAC: 20 checks
- CRUD: Team member management

---

## 🖥️ FRONTEND (18 Pages)

**All HR pages (16) + MANAGER-specific (2):**
```
1-16. All W2 pages (HR features)
17. /team (team management)
18. /analytics (org analytics)
```

---

## ⚙️ BACKEND (15 Endpoints)

**All HR endpoints + MANAGER-specific:**
```python
# Team Management (7)
GET /team (list team members)
POST /team/invite (invite new member)
PATCH /team/:userId/role (change role)
DELETE /team/:userId (remove member)
GET /team/:userId/activity
GET /team/stats
GET /team/hierarchy

# Analytics (8)
GET /analytics/summary
GET /analytics/hiring-pipeline
GET /analytics/time-to-hire
GET /analytics/candidate-sources
GET /analytics/team-performance
GET /analytics/budget-utilization
POST /analytics/export
GET /analytics/custom-report
```

---

## 🗄️ DATABASE (12 Queries)

**Team queries (6):**
```
User (team members within org)
Activity (team activity logs)
Role assignments
```

**Analytics queries (6):**
```
Aggregations (hiring metrics)
Time-series data (trends)
Performance data
```

**Verify:**
```
✅ organizationId filter in ALL
✅ Only org-2 data (MANAGER is in org-2)
```

---

## 🔒 RBAC (20 Checks)

**MANAGER should:**
```
✅ All HR features (jobs, candidates, analyses)
✅ Team management (within org)
✅ Analytics (org-level)
❌ NOT org settings (ADMIN+)
❌ NOT billing (ADMIN+)
❌ NOT super-admin features
```

**Test:**
```python
# Allowed
GET /team → 200 ✅
POST /team/invite → 201 ✅
GET /analytics → 200 ✅

# Forbidden
PATCH /organizations/me → 403 ✅
GET /super-admin/organizations → 403 ✅
```

---

## ✏️ CRUD (Team Management)

**Test full CRUD on team:**
```python
# CREATE: Invite member
POST /team/invite
Body: {email: 'newmember@test.com', role: 'USER'}
→ 201 Created ✅

# READ: List team
GET /team
→ 200 OK, includes new member ✅

# UPDATE: Change role
PATCH /team/:userId/role
Body: {role: 'HR_SPECIALIST'}
→ 200 OK ✅

# DELETE: Remove member
DELETE /team/:userId
→ 200 OK ✅
```

---

## 📊 DELIVERABLE

`docs/reports/w3-comprehensive-manager.md`

**Time: 75 min**

**W3, START!** 🚀
