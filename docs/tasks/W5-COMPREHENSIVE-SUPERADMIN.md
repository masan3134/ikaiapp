# W5: SUPER_ADMIN Role - Comprehensive Full-Stack Test

**Worker:** W5
**Role:** SUPER_ADMIN
**Duration:** 120 minutes (most comprehensive!)
**Scope:** SYSTEM-WIDE + All features

---

## 🎯 MISSION

**COMPLETE SYSTEM TEST:**
- Frontend: 22 pages (all pages + SA features)
- Backend: 40 endpoints (all endpoints + system)
- Database: 30 queries (cross-org queries!)
- RBAC: 35 checks (god mode verification)
- CRUD: Cross-org operations

---

## 🖥️ FRONTEND (22 Pages)

**All pages (18) + SUPER_ADMIN-specific (4):**
```
1-18. All W4 pages

SUPER_ADMIN pages:
19. /super-admin (SA dashboard)
20. /super-admin/organizations (all orgs!)
21. /super-admin/queues (BullMQ management)
22. /super-admin/security-logs (system logs)
23. /super-admin/system-health (system metrics)
```

---

## ⚙️ BACKEND (40 Endpoints!)

**All lower endpoints (35) + SA-specific (5):**

**Super Admin endpoints:**
```python
# Organizations (cross-org!)
GET /super-admin/organizations (all 3 orgs!)
GET /super-admin/organizations/:id
PATCH /super-admin/organizations/:id/plan
POST /super-admin/organizations/:id/suspend
POST /super-admin/organizations/:id/reactivate

# Queue Management
GET /queue/health (5 queues status)
POST /queue/:queueName/pause
POST /queue/:queueName/resume
DELETE /queue/:queueName/clean
GET /queue/:queueName/failed

# Security Logs
GET /super-admin/security-logs
GET /super-admin/login-attempts
GET /super-admin/audit-trail

# System Health
GET /super-admin/system-health
GET /super-admin/database-stats
GET /super-admin/redis-stats
GET /super-admin/milvus-stats
```

---

## 🗄️ DATABASE (30 Queries!)

**CRITICAL: Cross-org queries!**

**Verify SA can see ALL orgs:**
```python
# Get all organizations
r = requests.get(f'{BASE}/api/v1/super-admin/organizations', headers=sa_headers)
orgs = r.json()['data']

# Should return 3 orgs!
assert len(orgs) == 3
org_ids = [o['id'] for o in orgs]

# Verify all 3 test orgs present
assert 'test-org-1' in [o['name'] for o in orgs]
assert 'test-org-2' in [o['name'] for o in orgs]
assert 'test-org-3' in [o['name'] for o in orgs]

print('✅ Cross-org access verified!')
```

**Check backend queries:**
```bash
# SA dashboard queries
grep -A30 "router.get('/dashboard/super-admin'" backend/src/routes/dashboardRoutes.js

# Should have NO organizationId filter!
# (SA sees all orgs)

# Count cross-org queries
grep -c "organizationId" [backend file]
# Should be 0 for SA dashboard!
```

---

## 🔒 RBAC (35 Checks!)

**SUPER_ADMIN should:**
```
✅ Access ALL features (no restrictions!)
✅ Cross-org data access
✅ System management
✅ Queue control
✅ Security logs
✅ All CRUD on any org
```

**Test matrix:**
```python
# Everything should work!
endpoints = [
    '/dashboard/super-admin',  # SA dashboard
    '/super-admin/organizations',  # Cross-org
    '/queue/health',  # System
    '/job-postings',  # HR
    '/team',  # MANAGER
    '/organizations/me',  # ADMIN
    # ... all 40 endpoints should return 200!
]

for endpoint in endpoints:
    r = requests.get(f'{BASE}/api/v1{endpoint}', headers=sa_headers)
    assert r.status_code == 200, f'{endpoint} failed with {r.status_code}'

print('✅ SUPER_ADMIN has access to everything!')
```

---

## ✏️ CRUD (Cross-Org!)

**Critical: SA can modify ANY org!**

```python
# Get org-1 ID
orgs = requests.get(f'{BASE}/api/v1/super-admin/organizations', headers=sa_headers).json()['data']
org1_id = [o['id'] for o in orgs if 'test-org-1' in o['name']][0]

# UPDATE org-1 (SA in different org!)
r = requests.patch(f'{BASE}/api/v1/super-admin/organizations/{org1_id}',
                   headers=sa_headers,
                   json={'plan': 'ENTERPRISE'})
assert r.status_code == 200
print('✅ Cross-org UPDATE works!')

# READ any org's data
r = requests.get(f'{BASE}/api/v1/super-admin/organizations/{org1_id}/users',
                 headers=sa_headers)
assert r.status_code == 200
print('✅ Cross-org READ works!')
```

---

## 🚨 CRITICAL TESTS

**Multi-tenant verification:**
```python
# SA dashboard should show:
r = requests.get(f'{BASE}/api/v1/dashboard/super-admin', headers=sa_headers)
data = r.json()['data']

# Verify counts
assert data['organizations']['total'] == 3  # All 3 orgs!
assert data['users']['total'] >= 12  # All users across all orgs!
assert data['jobPostings']['total'] >= 5  # All jobs across all orgs!

print('✅ SA sees aggregated cross-org data!')
```

**Queue management:**
```python
# Queue health
r = requests.get(f'{BASE}/api/v1/queue/health', headers=sa_headers)
queues = r.json()['data']

# Should show 5 queues
assert len(queues) >= 5
queue_names = [q['name'] for q in queues]
assert 'analysis' in queue_names
assert 'offer' in queue_names
assert 'email' in queue_names
assert 'test' in queue_names
assert 'feedback' in queue_names

print('✅ Queue health API works!')
```

---

## 📊 DELIVERABLE

`docs/reports/w5-comprehensive-superadmin.md`

**MUST include:**
- Cross-org verification (3 orgs seen!)
- System health checks
- Queue management tests
- Complete coverage (all 40 endpoints!)

**Time: 120 min (most comprehensive!)**

**W5, START!** 🚀
