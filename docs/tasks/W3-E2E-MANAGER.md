# W3: MANAGER Role - Comprehensive E2E Testing

**Worker:** W3
**Role:** MANAGER (Department Manager)
**Method:** Puppeteer + Auto-Fix
**Duration:** 75 minutes
**Goal:** Test ALL MANAGER features + ALL HR features + FIX issues

---

## 🎯 MISSION

**Test as department manager:**
1. ✅ All HR features (inherited from HR_SPECIALIST)
2. ✅ Team management
3. ✅ Analytics and reports
4. ✅ Performance tracking
5. ❌ If error → FIX immediately → Continue

**CRITICAL:** MANAGER = HR + Team Management permissions!

---

## 📋 TEST SCENARIOS (12 Workflows)

### GROUP A: HR Features (1-8)
**Inherit from W2:**
- Job postings (list, create, update)
- Candidates (upload, view, manage)
- Analysis wizard
- Offers
- Interviews

**Test these quickly** - Focus on MANAGER-specific features below!

---

### 9️⃣ Team Management - VIEW
**Steps:**
1. Navigate to `/team`
2. Verify team member list loads
3. Check columns:
   - Name
   - Email
   - Role
   - Department
   - Status
4. Test search filter
5. Test role filter
6. Verify pagination

**Success Criteria:**
- ✅ Team list renders
- ✅ All team members visible
- ✅ Filters work
- ✅ Only same organization members

**If Error:**
- Empty list → Check if test data exists
- Wrong members → Check organizationId isolation
- Filter broken → Fix client logic

---

### 🔟 Team Management - INVITE MEMBER
**Steps:**
1. Click "Invite Member" button
2. Fill invite form:
   - Email: "test-new-member-w3@test.com"
   - First name: "New"
   - Last name: "Member"
   - Role: "HR_SPECIALIST"
3. Click "Send Invitation"
4. Verify success message
5. Verify member appears in "Pending Invitations"

**Success Criteria:**
- ✅ Invite form works
- ✅ Invitation sent
- ✅ Email queued (check BullMQ)
- ✅ Appears in pending list

**If Error:**
- Form fails → Check validation
- Invite fails → Check RBAC (MANAGER can invite)
- Email not sent → Check email queue

---

### 1️⃣1️⃣ Analytics - DASHBOARD
**Steps:**
1. Navigate to `/analytics`
2. Verify analytics widgets load:
   - Total analyses
   - Active candidates
   - Pending offers
   - Interview pipeline
3. Check date range filter works
4. Check chart renders (if present)
5. Verify export button (XLSX/CSV)

**Success Criteria:**
- ✅ Analytics dashboard renders
- ✅ All widgets load
- ✅ Date filter works
- ✅ Charts render (if present)

**If Error:**
- Widget not loading → Check API endpoint
- No data → Check if analyses exist
- Chart error → Check chart library

---

### 1️⃣2️⃣ Analytics - REPORTS
**Steps:**
1. Navigate to `/analytics/reports`
2. Verify report types available:
   - Recruitment funnel
   - Time to hire
   - Source effectiveness
3. Select report type
4. Set date range
5. Click "Generate Report"
6. Verify report renders
7. Test export to PDF/XLSX

**Success Criteria:**
- ✅ Reports page renders
- ✅ Report generation works
- ✅ Data accurate
- ✅ Export works

**If Error:**
- Page 404 → Check if page exists (should exist from W6 fixes)
- Report fails → Check backend logic
- Export broken → Check export library

---

## 🐛 FIX PROTOCOL

**MANAGER-specific issues:**

**1. Team Isolation:**
```javascript
// CRITICAL: MANAGER should only see own org members
const team = await prisma.user.findMany({
  where: {
    organizationId: req.organizationId  // Must filter!
  }
});
```

**2. Analytics Permissions:**
```javascript
// MANAGER should access analytics
router.get('/analytics', authorize(ROLE_GROUPS.ANALYTICS_VIEWERS));
```

**3. Inherited HR Features:**
```javascript
// MANAGER inherits all HR permissions
authorize(['MANAGER', 'HR_SPECIALIST', 'ADMIN', 'SUPER_ADMIN'])
```

---

## 📊 FINAL REPORT

**File:** `docs/reports/w3-e2e-manager.md`

**Include:**
- 12 scenarios (8 HR + 4 MANAGER)
- Team management verification
- Analytics functionality proof
- Cross-org isolation verified
- Issues fixed

---

## ⏱️ TIME BUDGET

**Total:** 75 minutes

- HR features (quick test): 30 min
- Team management: 20 min
- Analytics: 15 min
- **Testing:** 65 min
- **Report:** 10 min

---

## 🚀 START COMMAND

```bash
node scripts/tests/w3-e2e-manager.js
```

---

**Credentials:**
```
Email: test-manager@test-org-2.com
Password: TestPass123!
```

---

**GO! Test team management + analytics! Fix issues! Ship quality! 🚀**
