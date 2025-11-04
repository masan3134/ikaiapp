# W4: ADMIN Role - Comprehensive Full-Stack Test

**Worker:** W4
**Role:** ADMIN
**Duration:** 75 minutes
**Scope:** Organization management + All lower features

---

## 🎯 MISSION

**Full org admin:**
- Frontend: 18 pages (all MANAGER + org settings)
- Backend: 18 endpoints (org management, user admin)
- Database: 15 queries
- RBAC: 25 checks
- CRUD: Org settings, user management

---

## 🖥️ FRONTEND (18 Pages)

**All MANAGER pages (18) + ADMIN-specific:**
```
1-18. All W3 pages
+ /settings/organization (org details)
+ /settings/billing (plan, usage)
+ /settings/team-admin (user roles)
```

---

## ⚙️ BACKEND (18 Endpoints)

**Organization Management (6):**
```python
GET /organizations/me (org details)
PATCH /organizations/me (update org)
GET /organizations/usage (usage stats)
PATCH /organizations/plan (upgrade/downgrade)
GET /organizations/billing-history
POST /organizations/export-data
```

**User Management (8):**
```python
GET /team (all users in org)
POST /team/invite
PATCH /team/:userId/role (promote/demote)
DELETE /team/:userId (remove)
POST /team/:userId/deactivate
POST /team/:userId/reactivate
GET /team/:userId/permissions
PATCH /team/:userId/permissions
```

**Settings (4):**
```python
GET /settings/security
PATCH /settings/security
GET /settings/integrations
PATCH /settings/integrations
```

---

## 🗄️ DATABASE (15 Queries)

**Organization queries (5):**
```
Organization (own org details)
UsageLimits (plan limits)
BillingHistory (if exists)
```

**User management queries (7):**
```
User (all in org)
Role assignments
Permissions
Activity logs
```

**Settings queries (3):**
```
OrganizationSettings
SecuritySettings
Integrations
```

**Verify:**
```
✅ All queries filter by organizationId
✅ ADMIN can manage ALL users in org
✅ ADMIN CANNOT access other orgs
```

---

## 🔒 RBAC (25 Checks)

**ADMIN should:**
```
✅ All MANAGER features
✅ Org settings (update, billing)
✅ User management (add, remove, roles)
✅ Full org control (within org!)
❌ NOT cross-org access (SA only)
❌ NOT system management (SA only)
```

**Critical test:**
```python
# Cross-org prevention
# Login as ADMIN (org-1)
token_admin_org1 = login('test-admin@test-org-1.com')

# Try to get org-2 data
r = requests.get(f'{BASE}/api/v1/organizations/[ORG-2-UUID]',
                 headers={'Authorization': f'Bearer {token_admin_org1}'})
assert r.status_code == 403  # Should be blocked!

print('✅ Cross-org blocked correctly')
```

---

## ✏️ CRUD (Org & Users)

**Organization CRUD:**
```python
# READ
GET /organizations/me → 200 ✅

# UPDATE
PATCH /organizations/me
Body: {name: 'Updated Org Name'}
→ 200 OK ✅

# DELETE
DELETE /organizations/me → 403 ✅ (not allowed!)
```

**User CRUD (within org):**
```python
# CREATE
POST /team/invite → 201 ✅

# READ
GET /team → 200 ✅

# UPDATE
PATCH /team/:userId/role → 200 ✅

# DELETE
DELETE /team/:userId → 200 ✅
```

---

## 📊 DELIVERABLE

`docs/reports/w4-comprehensive-admin.md`

**Time: 75 min**

**W4, START!** 🚀
