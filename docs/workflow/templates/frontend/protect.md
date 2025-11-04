# 🔒 Template: Protect Page (RBAC)

**Use case:** Adding role protection to a page
**Duration:** 5 minutes
**Difficulty:** Very Easy

---

## Step 1: Read Page File

**File:** `frontend/app/(authenticated)/{path}/page.tsx`

```bash
# Use Read tool
Read('frontend/app/(authenticated)/{path}/page.tsx')
```

---

## Step 2: Add Imports

**At top of file:**
```tsx
import { withRoleProtection } from '@/lib/hoc/withRoleProtection';
import { RoleGroups } from '@/lib/constants/roles';
```

---

## Step 3: Wrap Export

**Find:** `export default PageComponent`

**Replace with:**
```tsx
export default withRoleProtection(PageComponent, {
  allowedRoles: RoleGroups.{ROLE_GROUP}
});
```

**Role groups:**
- `RoleGroups.ALL` - All roles
- `RoleGroups.HR_MANAGERS` - HR_SPECIALIST, MANAGER, ADMIN, SUPER_ADMIN
- `RoleGroups.MANAGERS` - MANAGER, ADMIN, SUPER_ADMIN
- `RoleGroups.ADMINS` - ADMIN, SUPER_ADMIN
- `RoleGroups.SUPER_ADMINS` - SUPER_ADMIN only

---

## Step 4: Commit

```bash
git add frontend/app/(authenticated)/{path}/page.tsx
git commit -m "feat(rbac): Protect {path} page - {ROLE_GROUP}"
```

---

## Step 5: Report

**Format:**
```
✅ {path} page korundu
Role: {ROLE_GROUP}
Commit: 1
```

---

## Verification (for Mod)

**Count protected pages:**
```bash
grep -r "withRoleProtection" frontend/app/(authenticated) --include="page.tsx" | wc -l
```

**Check specific page:**
```bash
grep "withRoleProtection.*{PageName}" frontend/app/(authenticated)/{path}/page.tsx
```

**Expected:** Import + wrap exists ✅
