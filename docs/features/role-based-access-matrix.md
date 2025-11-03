# Role-Based Access Control Matrix

## User Roles Hierarchy
1. **SUPER_ADMIN** - System-wide admin (all organizations)
2. **ADMIN** - Organization admin (full access within org)
3. **MANAGER** - Department manager (limited admin)
4. **HR_SPECIALIST** - HR operations (candidate & job management)
5. **USER** - Basic user (view only)

## Page Access Matrix

| Page | USER | HR_SPECIALIST | MANAGER | ADMIN | SUPER_ADMIN |
|------|------|---------------|---------|-------|-------------|
| **Dashboard** | ❌ | ✅ | ✅ | ✅ | ✅ |
| **Job Postings** | ❌ | ✅ | ✅ | ✅ | ✅ |
| **Candidates** | ❌ | ✅ | ✅ | ✅ | ✅ |
| **Analyses** | ❌ | ✅ | ✅ | ✅ | ✅ |
| **Analysis Detail** | ❌ | ✅ | ✅ | ✅ | ✅ |
| **Wizard** | ❌ | ✅ | ✅ | ✅ | ✅ |
| **Interviews** | ❌ | ✅ | ✅ | ✅ | ✅ |
| **Offers** | ❌ | ✅ | ✅ | ✅ | ✅ |
| **Offer Templates** | ❌ | ✅ | ✅ | ✅ | ✅ |
| **Settings/Organization** | ❌ | ❌ | ❌ | ✅ | ✅ |
| **Settings/Billing** | ❌ | ❌ | ❌ | ✅ | ✅ |
| **Team Management** | ❌ | ❌ | ❌ | ✅ | ✅ |
| **Super Admin** | ❌ | ❌ | ❌ | ❌ | ✅ |
| **Onboarding** | ✅ | ✅ | ✅ | ✅ | ✅ |

## Implementation Status

### ✅ Already Protected
- `/super-admin` - Only SUPER_ADMIN
- `/dashboard` - ADMIN, MANAGER, SUPER_ADMIN
- `/team` - ADMIN, SUPER_ADMIN

### ❌ Needs Protection
- `/job-postings` - Should check role
- `/candidates` - Should check role
- `/analyses` - Should check role
- `/wizard` - Should check role
- `/offers/**` - Should check role
- `/settings/**` - Should check role
- `/interviews` - Should check role

## Recommended Approach

Create reusable components:
1. `RoleGuard.tsx` - Client-side role check
2. `withRoleProtection()` - HOC for pages
3. Update backend authorize middleware usage

## Backend Routes Status

Most routes already use `authorize([...roles])` middleware:
- ✅ Team routes - ADMIN, SUPER_ADMIN only
- ✅ Dashboard routes - ADMIN, MANAGER, SUPER_ADMIN
- ⚠️ Other routes - Need review

