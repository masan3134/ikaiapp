# W4: ADMIN Role - Comprehensive E2E Testing

**Worker:** W4
**Role:** ADMIN (Organization Administrator)
**Method:** Puppeteer + Auto-Fix
**Duration:** 75 minutes
**Goal:** Test ALL ADMIN features + FIX issues immediately

---

## 🎯 MISSION

**Test as organization admin:**
1. ✅ All HR + MANAGER features (inherited)
2. ✅ Organization settings
3. ✅ User management (CRUD)
4. ✅ Billing management
5. ✅ Security settings
6. ❌ If error → FIX immediately → Continue

**CRITICAL:** ADMIN = Full organization control (within own org)!

---

## 📋 TEST SCENARIOS (15 Workflows)

### GROUP A: Inherited Features (1-12)
**From W2 + W3:**
- All HR features
- All MANAGER features

**Test these quickly** - Focus on ADMIN-specific features below!

---

### 1️⃣3️⃣ Organization Settings - UPDATE
**Steps:**
1. Navigate to `/settings/organization`
2. Verify org details load:
   - Organization name
   - Industry
   - Company size
   - Website
3. Update organization name: "Test Org (W4 E2E Updated)"
4. Update industry
5. Click "Save Changes"
6. Verify success message
7. Refresh page
8. Verify changes persisted

**Success Criteria:**
- ✅ Org settings page loads
- ✅ Form populates with current data
- ✅ Update succeeds
- ✅ Changes persist

**If Error:**
- Page not loading → Check RBAC
- Update fails → Check API endpoint
- Not persisted → Check backend logic

---

### 1️⃣4️⃣ Organization Settings - USAGE STATS
**Steps:**
1. In org settings, scroll to "Usage Statistics"
2. Verify usage data displays:
   - Monthly analyses: X / MAX
   - Monthly CVs: Y / MAX
   - Total users: Z / MAX
3. Verify progress bars render
4. Verify plan limits correct (FREE/PRO/ENTERPRISE)

**Success Criteria:**
- ✅ Usage stats load
- ✅ Data accurate
- ✅ Progress bars render
- ✅ Plan limits shown

**If Error:**
- Stats not loading → Check API endpoint
- Wrong data → Check backend query
- Progress bar broken → Fix CSS/component

---

### 1️⃣5️⃣ User Management - LIST
**Steps:**
1. Navigate to `/settings/team` (or `/team` if ADMIN uses same)
2. Verify all org users listed
3. Check columns:
   - Name, Email, Role, Status, Last active
4. Verify ADMIN can see all roles
5. Test search filter
6. Test role filter

**Success Criteria:**
- ✅ User list loads
- ✅ All org users visible
- ✅ Filters work
- ✅ No users from other orgs

**If Error:**
- Empty list → Check test data
- Wrong users → Check org isolation
- Missing users → Check query

---

### 1️⃣6️⃣ User Management - UPDATE ROLE
**Steps:**
1. Select a user (USER role)
2. Click "Edit" or "Change Role"
3. Change role from USER to HR_SPECIALIST
4. Click "Save"
5. Verify success message
6. Verify role updated in list
7. Logout
8. Login as that user
9. Verify they now have HR features

**Success Criteria:**
- ✅ Role change works
- ✅ User immediately has new permissions
- ✅ RBAC updated

**If Error:**
- Change fails → Check RBAC (ADMIN can change roles)
- Permissions not updating → Check auth middleware
- User confused → Add clear feedback

---

### 1️⃣7️⃣ User Management - DEACTIVATE USER
**Steps:**
1. Select a user
2. Click "Deactivate"
3. Confirm deactivation
4. Verify success message
5. Verify user marked as "Inactive"
6. Try to login as that user
7. Verify login blocked (account inactive)

**Success Criteria:**
- ✅ Deactivate works
- ✅ User cannot login
- ✅ User still in database (soft delete)

**If Error:**
- Deactivate fails → Check API endpoint
- User can still login → Check auth middleware
- User deleted (hard) → Should be soft delete!

---

### 1️⃣8️⃣ Billing - VIEW
**Steps:**
1. Navigate to `/settings/billing`
2. Verify billing info displays:
   - Current plan (FREE/PRO/ENTERPRISE)
   - Plan price
   - Billing cycle
   - Next billing date
   - Payment method (if any)
3. Check "Upgrade Plan" button visible
4. Check "Billing History" section

**Success Criteria:**
- ✅ Billing page loads
- ✅ Plan info accurate
- ✅ Upgrade option available

**If Error:**
- Page not loading → Check if page exists
- Wrong plan → Check org data
- Upgrade button missing → Check UI component

---

### 1️⃣9️⃣ Security Settings - VIEW
**Steps:**
1. Navigate to `/settings/security`
2. Verify security options:
   - Two-factor authentication toggle
   - Session timeout setting
   - IP whitelist (if implemented)
   - Activity log
3. Toggle 2FA requirement
4. Click "Save"
5. Verify success message

**Success Criteria:**
- ✅ Security settings load
- ✅ Toggle works
- ✅ Changes save

**If Error:**
- Page not loading → Check if page exists
- Settings not saving → Check API endpoint
- 2FA not enforcing → Check auth middleware

---

## 🐛 FIX PROTOCOL

**ADMIN-specific issues:**

**1. Organization Isolation (CRITICAL!):**
```javascript
// ADMIN should ONLY manage own organization
const users = await prisma.user.findMany({
  where: {
    organizationId: req.organizationId  // MUST FILTER!
  }
});

// DO NOT allow cross-org access
if (targetUser.organizationId !== req.organizationId) {
  return res.status(403).json({ error: 'Cannot manage users from other orgs' });
}
```

**2. Role Management:**
```javascript
// ADMIN can change roles (within own org)
router.patch('/users/:id/role', authorize(['ADMIN', 'SUPER_ADMIN']));

// But cannot promote to SUPER_ADMIN
if (newRole === 'SUPER_ADMIN') {
  return res.status(403).json({ error: 'Cannot promote to SUPER_ADMIN' });
}
```

**3. Billing Restrictions:**
```javascript
// ADMIN can view billing but may not change plan
// (depends on business logic - may require SUPER_ADMIN approval)
```

---

## 📊 FINAL REPORT

**File:** `docs/reports/w4-e2e-admin.md`

**Include:**
- 19 scenarios tested
- Org settings verified
- User management CRUD proof
- Cross-org isolation verified (CRITICAL!)
- Billing page verified
- Issues fixed

---

## ⏱️ TIME BUDGET

**Total:** 75 minutes

- Inherited features (quick): 30 min
- Org settings: 10 min
- User management: 20 min
- Billing: 5 min
- Security: 5 min
- **Testing:** 65 min
- **Report:** 10 min

---

## 🚀 START COMMAND

```bash
node scripts/tests/w4-e2e-admin.js
```

---

**Credentials:**
```
Email: test-admin@test-org-1.com
Password: TestPass123!
```

---

**GO! Test full org management! Verify isolation! Fix issues! Ship quality! 🚀**
