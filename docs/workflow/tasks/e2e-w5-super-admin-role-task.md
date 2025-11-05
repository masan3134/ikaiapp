# 🧪 E2E Test Task - W5: SUPER_ADMIN Role

**Worker:** W5
**Role to Test:** SUPER_ADMIN (System Administrator)
**Test Account:** info@gaiai.ai / 23235656
**Organization:** All Organizations
**Duration:** ~3 hours
**Report Location:** `docs/reports/e2e-test-w5-super-admin-report.md`

---

## 🎯 YOUR MISSION

Test **SUPER_ADMIN role** - the highest privilege level. SUPER_ADMIN sees ALL organizations, system health, global analytics. This is Mustafa Asan's account.

### Key Focus
1. **Multi-Org Access** - Can see ALL organizations (Test Org 1, Test Org 2, etc.)
2. **System Health** - Queue status, DB health, API monitoring
3. **Global Analytics** - Cross-org metrics, system-wide stats
4. **User Management** - All orgs' users
5. **System Configuration** - Global settings

---

## 🔐 SUPER_ADMIN PERMISSIONS

### ✅ SHOULD ACCESS (EVERYTHING!)
- Dashboard (SUPER_ADMIN variant - system-wide)
- All Organizations view + management
- System Health monitoring
- Global Analytics (cross-org)
- Queue Management (BullMQ queues)
- Database Health
- API Monitoring
- All users (all orgs)
- System Configuration

### ❌ Should NOT (N/A - highest privilege)
- Nothing is restricted for SUPER_ADMIN

---

## 📋 TESTING CHECKLIST

### 1. Dashboard (SUPER_ADMIN)
- [ ] Login: info@gaiai.ai / 23235656
- [ ] Console errors: 0
- [ ] **Widgets:**
  - [ ] System Health (red/yellow/green)
  - [ ] All Organizations count
  - [ ] Total Users (all orgs)
  - [ ] Active Analyses (all orgs)
  - [ ] Queue Status (5 queues)
  - [ ] Database Health
  - [ ] API Response Times
- [ ] **Color:** Red theme for SUPER_ADMIN
- [ ] **Screenshot:** Dashboard

### 2. All Organizations View (CRITICAL)

- [ ] Navigate to Organizations (or switch org dropdown)
- [ ] **Expected:** List of ALL organizations
  - [ ] Test Org 1 (FREE)
  - [ ] Test Org 2 (PRO)
  - [ ] Any other orgs
- [ ] **For Each Org Display:**
  - [ ] Org name
  - [ ] Plan (FREE/PRO/ENTERPRISE)
  - [ ] User count
  - [ ] Usage stats
  - [ ] Status (active/inactive)
- [ ] **Test:** Click on Test Org 1
  - [ ] **Expected:** View Test Org 1 dashboard (as if ADMIN of that org)
  - [ ] Can see all Test Org 1 data
- [ ] **Test:** Switch to Test Org 2
  - [ ] **Expected:** View Test Org 2 data
- [ ] Console errors: 0
- [ ] **Screenshot:** Organizations list

### 3. System Health Monitoring

- [ ] Navigate to System Health
- [ ] **Components to Monitor:**
  - [ ] **PostgreSQL:** Status (connected/disconnected), response time
  - [ ] **Redis:** Status, memory usage
  - [ ] **Milvus:** Status, collection count
  - [ ] **MinIO:** Status, storage used
  - [ ] **Backend API:** Status, uptime
  - [ ] **Frontend:** Status, build version
- [ ] **Status Indicators:**
  - 🟢 Green: All OK
  - 🟡 Yellow: Warning
  - 🔴 Red: Critical
- [ ] **Verify:** All services green (if system healthy)
- [ ] Console errors: 0
- [ ] **Screenshot:** System health page

### 4. Queue Management (BullMQ)

- [ ] Navigate to Queue Management
- [ ] **5 Queues:**
  - [ ] analysis-queue
  - [ ] offer-queue
  - [ ] email-queue
  - [ ] test-queue
  - [ ] feedback-queue
- [ ] **For Each Queue Display:**
  - [ ] Active jobs count
  - [ ] Waiting jobs count
  - [ ] Completed jobs count
  - [ ] Failed jobs count
  - [ ] Processing rate (jobs/min)
- [ ] **Test:** View queue details
  - [ ] Click on analysis-queue
  - [ ] **Expected:** List of jobs (active, waiting, failed)
- [ ] **Test:** Retry failed job (if any)
  - [ ] Click "Retry" on failed job
  - [ ] **Expected:** Job moved to waiting
- [ ] **Test:** Clear completed jobs
  - [ ] Click "Clear Completed"
  - [ ] **Expected:** Completed jobs removed
- [ ] Console errors: 0
- [ ] **Screenshot:** Queue management page

### 5. Global Analytics

- [ ] Navigate to Analytics (SUPER_ADMIN view)
- [ ] **Global Metrics:**
  - [ ] Total Users (all orgs)
  - [ ] Total Analyses (all orgs, all time)
  - [ ] Total CVs Processed (all orgs)
  - [ ] Analyses per Day (trend chart)
  - [ ] Organization Growth (new orgs over time)
  - [ ] Plan Distribution (FREE/PRO/ENTERPRISE counts)
- [ ] **Cross-Org Comparison:**
  - [ ] Org 1 vs Org 2 usage
  - [ ] Most active org
  - [ ] Usage by plan type
- [ ] **System Performance:**
  - [ ] Average API response time
  - [ ] Average analysis processing time
  - [ ] Error rate (system-wide)
- [ ] Console errors: 0
- [ ] **Screenshot:** Global analytics dashboard

### 6. User Management (All Orgs)

- [ ] Navigate to Users (SUPER_ADMIN view)
- [ ] **Expected:** All users from ALL organizations
- [ ] **Filters:**
  - [ ] By Organization
  - [ ] By Role
  - [ ] By Status (active/inactive)
- [ ] **Test:** Filter by organization
  - [ ] Select "Test Org 1"
  - [ ] **Expected:** Only Test Org 1 users
- [ ] **Test:** View user from different org
  - [ ] Click on a Test Org 2 user
  - [ ] **Expected:** Can view full details (SUPER_ADMIN privilege)
- [ ] **Test:** Can SUPER_ADMIN change user roles across orgs?
  - [ ] This is a gray area - document current behavior
  - [ ] Try to change a Test Org 1 user's role
  - [ ] **Document:** Allowed or blocked?
- [ ] Console errors: 0
- [ ] **Screenshot:** All users view

### 7. Database Health

- [ ] Navigate to Database Health (or System → Database)
- [ ] **PostgreSQL Stats:**
  - [ ] Connection pool status
  - [ ] Active connections
  - [ ] Database size
  - [ ] Table sizes (top 10)
- [ ] **Milvus Stats:**
  - [ ] Collections count
  - [ ] Total vectors
  - [ ] Index status
- [ ] **Redis Stats:**
  - [ ] Memory usage
  - [ ] Keys count
  - [ ] Hit rate
- [ ] Console errors: 0
- [ ] **Screenshot:** Database health page

### 8. API Monitoring

- [ ] Navigate to API Monitoring
- [ ] **Metrics:**
  - [ ] Total API calls (today/week/month)
  - [ ] Average response time
  - [ ] Error rate (5xx, 4xx)
  - [ ] Slowest endpoints
  - [ ] Most called endpoints
- [ ] **Real-time Monitoring:**
  - [ ] Live API call log (recent 100 calls)
  - [ ] Status codes, response times
- [ ] Console errors: 0
- [ ] **Screenshot:** API monitoring page

### 9. System Configuration

- [ ] Navigate to System Configuration
- [ ] **Global Settings:**
  - [ ] Email SMTP configuration
  - [ ] Gemini API key
  - [ ] Default plan limits
  - [ ] Feature flags (enable/disable features globally)
  - [ ] Maintenance mode (toggle)
- [ ] **Test:** View current configuration (DO NOT CHANGE!)
  - [ ] Just verify settings are displayed correctly
- [ ] Console errors: 0
- [ ] **Screenshot:** System config page

### 10. Performance Testing

- [ ] **Page Load Times:**
  - Dashboard: _____ s (may be slower - lots of data!)
  - Organizations: _____ s
  - System Health: _____ s
  - Queue Management: _____ s
  - Global Analytics: _____ s
- [ ] **API Response Times:**
  - GET /api/v1/super-admin/organizations: _____ ms
  - GET /api/v1/super-admin/system-health: _____ ms
  - GET /api/v1/super-admin/queue-stats: _____ ms

### 11. Design Consistency

- [ ] **Color Scheme:** Red for SUPER_ADMIN
- [ ] Consistent? Yes/No
- [ ] **Identify Inconsistencies:** [List]
- [ ] **Screenshot:** Inconsistent pages

### 12. Console Errors

```bash
playwright.console_errors() → errorCount = ?
```

- [ ] If > 0, list ALL errors

---

## 🐛 CRITICAL CHECKS

1. **Multi-Org Access:** Can see ALL orgs?
2. **System Health:** All services monitored?
3. **Queue Management:** Can manage queues?
4. **Cross-Org User Management:** What level of access to other org users?

---

## 📊 REPORT TEMPLATE

```markdown
# E2E Test Report - SUPER_ADMIN Role

**Worker:** W5
**Role:** SUPER_ADMIN
**Account:** info@gaiai.ai
**Organizations:** All
**Date:** 2025-11-05

## 🎯 Executive Summary
- Total Issues: [N]
- Critical: [N]
- Multi-Org Access: PASS/FAIL
- System Monitoring: PASS/FAIL
- Console Errors: [N]

## 🐛 Issues Found
[Standard format]

## ✅ Feature Verification
| Feature | Expected | Working | Status |
|---------|----------|---------|--------|
| All Orgs View | ✅ | ? | ? |
| System Health | ✅ | ? | ? |
| Queue Management | ✅ | ? | ? |
| Global Analytics | ✅ | ? | ? |
| DB Health | ✅ | ? | ? |

## 📸 Screenshots
[All screenshots]

## 💡 Recommendations
[Priority fixes]
```

---

**START TESTING! You have the highest privileges - test system-wide features!**
