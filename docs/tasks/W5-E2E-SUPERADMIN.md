# W5: SUPER_ADMIN Role - Comprehensive E2E Testing

**Worker:** W5
**Role:** SUPER_ADMIN (System Administrator)
**Method:** Puppeteer + Auto-Fix
**Duration:** 90 minutes
**Goal:** Test SUPER_ADMIN god mode + System management + FIX issues

---

## 🎯 MISSION

**Test as system super admin:**
1. ✅ God mode: Access ALL features from all roles
2. ✅ Cross-organization management
3. ✅ System health monitoring
4. ✅ Queue management
5. ✅ Security monitoring
6. ❌ If error → FIX immediately → Continue

**CRITICAL:** SUPER_ADMIN = NO RESTRICTIONS! Can do EVERYTHING!

---

## 📋 TEST SCENARIOS (20 Workflows)

### GROUP A: God Mode Verification (1-5)
**Quickly verify SUPER_ADMIN can access:**
1. USER dashboard → Should work ✅
2. HR features (job postings) → Should work ✅
3. MANAGER features (team) → Should work ✅
4. ADMIN features (org settings) → Should work ✅
5. All orgs visible → Should see ALL organizations ✅

**Test these quickly (5 min total)** - Focus on SA-specific features below!

---

### 2️⃣0️⃣ Organizations - LIST ALL
**Steps:**
1. Navigate to `/super-admin/organizations`
2. Verify ALL organizations listed (5+ orgs)
3. Check columns:
   - Org name
   - Plan
   - User count
   - Status
   - Created date
4. Test search filter
5. Test plan filter (FREE/PRO/ENTERPRISE)
6. Test status filter (Active/Inactive)
7. Test sorting

**Success Criteria:**
- ✅ All orgs visible (no isolation!)
- ✅ Filters work
- ✅ Correct counts

**If Error:**
- Empty list → Check if orgs exist
- Missing orgs → Check query (should NOT filter by organizationId!)
- Wrong counts → Check backend aggregation

---

### 2️⃣1️⃣ Organizations - UPDATE PLAN
**Steps:**
1. Select an organization (FREE plan)
2. Click "Edit" or "Change Plan"
3. Change plan from FREE to PRO
4. Click "Save"
5. Verify success message
6. Verify plan updated in list
7. Verify usage limits increased (check org detail)

**Success Criteria:**
- ✅ Plan change works
- ✅ Limits updated immediately
- ✅ Org continues functioning

**If Error:**
- Change fails → Check RBAC
- Limits not updating → Check backend logic
- Org breaks → Fix gracefully

---

### 2️⃣2️⃣ Organizations - SUSPEND/REACTIVATE
**Steps:**
1. Select an organization
2. Click "Suspend"
3. Confirm suspension
4. Verify org status = "Inactive"
5. Try to login as user from that org
6. Verify login blocked or limited access
7. Back to SA, click "Reactivate"
8. Verify org active again
9. Verify user can login

**Success Criteria:**
- ✅ Suspend works
- ✅ Org users cannot login (or limited)
- ✅ Reactivate works
- ✅ Everything restored

**If Error:**
- Suspend fails → Check API endpoint
- Users still access → Fix auth middleware
- Reactivate fails → Check backend logic

---

### 2️⃣3️⃣ System Health - DASHBOARD
**Steps:**
1. Navigate to `/super-admin/system-health` (or main dashboard)
2. Verify system health widgets:
   - Database status
   - Redis status
   - Milvus status
   - Backend API status
   - Queue workers status
3. Check each service shows "healthy" ✅
4. Check response times displayed
5. Test "Refresh" button

**Success Criteria:**
- ✅ Health dashboard loads
- ✅ All services healthy
- ✅ Accurate status

**If Error:**
- Widget not loading → Check API endpoint
- Wrong status → Check health check logic
- Service down → Investigate (Docker logs)

---

### 2️⃣4️⃣ Queue Management - HEALTH
**Steps:**
1. Navigate to `/super-admin/queues`
2. Verify all 5 queues listed:
   - analysis-processing
   - offer-processing
   - generic-email
   - test-generation
   - feedback-processing
3. Check queue stats:
   - Waiting jobs
   - Active jobs
   - Completed jobs
   - Failed jobs
4. Verify charts/graphs (if present)

**Success Criteria:**
- ✅ All queues visible
- ✅ Stats accurate
- ✅ Visualizations render

**If Error:**
- Queue missing → Check if worker running
- Wrong stats → Check BullMQ connection
- Chart error → Fix visualization

---

### 2️⃣5️⃣ Queue Management - PAUSE/RESUME
**Steps:**
1. Select a queue (e.g., "email")
2. Click "Pause"
3. Verify queue status = "Paused"
4. Verify no new jobs processing
5. Click "Resume"
6. Verify queue status = "Active"
7. Verify jobs resume processing

**Success Criteria:**
- ✅ Pause works
- ✅ Resume works
- ✅ Jobs process after resume

**If Error:**
- Pause fails → Check API endpoint
- Jobs still processing → Fix queue logic
- Resume fails → Check BullMQ

---

### 2️⃣6️⃣ Queue Management - RETRY FAILED
**Steps:**
1. Navigate to failed jobs for a queue
2. Select a failed job
3. Click "Retry"
4. Verify job re-queued
5. Check if job succeeds (wait 10s)

**Success Criteria:**
- ✅ Failed jobs listed
- ✅ Retry works
- ✅ Job processes

**If Error:**
- No failed jobs → Create test job that fails
- Retry fails → Check BullMQ API
- Job fails again → Debug root cause

---

### 2️⃣7️⃣ Security Logs - VIEW
**Steps:**
1. Navigate to `/super-admin/security-logs`
2. Verify security events listed:
   - Login attempts (success/fail)
   - Permission denials (403)
   - Suspicious activities
   - IP addresses
   - Timestamps
3. Test date range filter
4. Test event type filter
5. Test search by user email

**Success Criteria:**
- ✅ Logs load
- ✅ Events accurate
- ✅ Filters work

**If Error:**
- No logs → Check if logging enabled
- Missing events → Check backend logging
- Filter broken → Fix client logic

---

### 2️⃣8️⃣ Cross-Org Verification (CRITICAL!)
**Steps:**
1. Login as SUPER_ADMIN
2. Navigate to Org A's job postings
3. Verify you see Org A's data
4. Navigate to Org B's job postings
5. Verify you see Org B's data
6. Create a job posting (verify organizationId set correctly)
7. Switch orgs, verify job NOT visible in other org

**Success Criteria:**
- ✅ Can view all orgs
- ✅ Data properly isolated
- ✅ Creates don't leak across orgs

**If Error:**
- Cannot see other orgs → Check middleware
- Data leaking → CRITICAL BUG! Fix isolation!

---

### 2️⃣9️⃣ Users Management (Cross-Org)
**Steps:**
1. Navigate to `/super-admin/users` (if exists)
2. Verify ALL users from ALL orgs listed
3. Search for user from Org A
4. View user detail
5. Verify org affiliation shown
6. Test changing user's organization (if supported)

**Success Criteria:**
- ✅ All users visible
- ✅ Org affiliation clear
- ✅ Can manage any user

**If Error:**
- Page 404 → Create page (from W6 fixes)
- Users missing → Check query
- Cannot manage → Check RBAC

---

### 3️⃣0️⃣ Analytics (System-Wide)
**Steps:**
1. Navigate to `/super-admin/analytics` (if exists)
2. Verify system-wide analytics:
   - Total analyses (all orgs)
   - Total users (all orgs)
   - Total organizations
   - Plan distribution
   - Usage trends
3. Test date range filter
4. Test export to XLSX

**Success Criteria:**
- ✅ System analytics load
- ✅ Data aggregated across all orgs
- ✅ Charts render

**If Error:**
- Page 404 → Create page
- Wrong data → Check aggregation logic
- Chart error → Fix visualization

---

## 🐛 FIX PROTOCOL

**SUPER_ADMIN-specific issues:**

**1. No Organization Isolation!**
```javascript
// SUPER_ADMIN should NOT be filtered by organizationId
const allOrgs = await prisma.organization.findMany();  // No where clause!

// But when creating, still set organizationId
const job = await prisma.jobPosting.create({
  data: {
    ...data,
    organizationId: targetOrgId || req.organizationId  // Explicit org
  }
});
```

**2. God Mode Middleware:**
```javascript
// SUPER_ADMIN bypasses most checks
if (req.user.role === 'SUPER_ADMIN') {
  return next();  // Skip isolation checks
}
```

**3. Cross-Org Operations:**
```javascript
// When SA operates on specific org, set context
req.targetOrganizationId = req.query.organizationId || req.params.organizationId;

// Use target org for queries
const data = await prisma.candidates.findMany({
  where: { organizationId: req.targetOrganizationId }
});
```

---

## 📊 FINAL REPORT

**File:** `docs/reports/w5-e2e-superadmin.md`

**Include:**
- 30 scenarios (god mode + SA features)
- Cross-org verification proof
- System health verified
- Queue management proof
- Security monitoring verified
- Issues fixed

---

## ⏱️ TIME BUDGET

**Total:** 90 minutes

- God mode verification: 10 min
- Organizations management: 20 min
- System health: 10 min
- Queue management: 15 min
- Security logs: 10 min
- Cross-org verification: 15 min
- **Testing:** 80 min
- **Report:** 10 min

---

## 🚀 START COMMAND

```bash
node scripts/tests/w5-e2e-superadmin.js
```

---

**Credentials:**
```
Email: info@gaiai.ai
Password: 23235656
```

---

**GO! Test god mode! Verify cross-org! Fix issues! Ship quality! 🚀**
