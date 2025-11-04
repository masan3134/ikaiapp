# 🎨 Worker #3 - Frontend RBAC Layer 4: UI Element Visibility

**Task ID:** worker3-frontend-rbac-ui
**Assigned To:** Worker #3
**Created By:** Master Claude (Mod)
**Date:** 2025-11-04
**Priority:** HIGH
**Estimated Time:** 2-3 hours

---

## 🎯 Objective

Implement **RBAC Layer 4** (UI Element Visibility) across the entire frontend application. Users should only see menu items, buttons, and widgets they have permission to access based on their role.

**5 Major Components:**
1. ✅ RBAC Helper Utilities (foundation)
2. ✅ Sidebar Menu Filtering (navigation)
3. ✅ Action Button Visibility (CRUD operations)
4. ✅ Dashboard Widgets (role-based dashboard)
5. ✅ Settings Page Tabs (role-based settings)

**Expected Outcome:** Complete UI/UX that matches backend RBAC (Layers 1-3).

---

## 📋 Background

### Current State
- ✅ **Backend RBAC:** Complete (Layer 1: Routes, Layer 2: Data, Layer 3: Functions)
- ❌ **Frontend RBAC:** Incomplete (Layer 4: UI visibility missing)
- 🐛 **Problem:** Users see buttons/menus they can't use (403 errors when clicked)

### RBAC Layers Overview
- **Layer 1:** Page/Route Access (middleware) ✅ DONE
- **Layer 2:** Data Filtering (controller) ✅ DONE
- **Layer 3:** Function Permissions (CRUD) ✅ DONE
- **Layer 4:** UI Element Visibility ❌ **THIS TASK**

### 5 Roles
1. **SUPER_ADMIN** → System-wide access (all orgs)
2. **ADMIN** → Full org access
3. **MANAGER** → Department management
4. **HR_SPECIALIST** → HR operations
5. **USER** → Dashboard only (limited)

---

## 🛠️ Task Breakdown

### Phase 1: RBAC Helper Utilities (Foundation) - 30 min

**Goal:** Create reusable helper functions for role checking

#### Task 1.1: Create RBAC Utilities File

**File:** `frontend/lib/utils/rbac.ts`

```typescript
import { UserRole } from '@/lib/constants/roles'

/**
 * RBAC Helper Utilities
 * Centralized permission checking for UI elements
 */

// ============================================
// PERMISSION CHECKERS
// ============================================

/**
 * Check if role can create job postings
 */
export const canCreateJobPosting = (role?: UserRole): boolean => {
  if (!role) return false
  return ['SUPER_ADMIN', 'ADMIN', 'MANAGER'].includes(role)
}

/**
 * Check if role can edit job postings
 */
export const canEditJobPosting = (role?: UserRole): boolean => {
  if (!role) return false
  return ['SUPER_ADMIN', 'ADMIN', 'MANAGER'].includes(role)
}

/**
 * Check if role can delete job postings
 */
export const canDeleteJobPosting = (role?: UserRole): boolean => {
  if (!role) return false
  return ['SUPER_ADMIN', 'ADMIN'].includes(role)
}

/**
 * Check if role can view job postings
 */
export const canViewJobPostings = (role?: UserRole): boolean => {
  if (!role) return false
  return ['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'HR_SPECIALIST'].includes(role)
}

// ============================================
// CANDIDATE PERMISSIONS
// ============================================

export const canCreateCandidate = (role?: UserRole): boolean => {
  if (!role) return false
  return ['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'HR_SPECIALIST'].includes(role)
}

export const canEditCandidate = (role?: UserRole): boolean => {
  if (!role) return false
  return ['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'HR_SPECIALIST'].includes(role)
}

export const canDeleteCandidate = (role?: UserRole): boolean => {
  if (!role) return false
  return ['SUPER_ADMIN', 'ADMIN'].includes(role)
}

export const canViewCandidates = (role?: UserRole): boolean => {
  if (!role) return false
  return ['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'HR_SPECIALIST'].includes(role)
}

// ============================================
// ANALYSIS PERMISSIONS
// ============================================

export const canCreateAnalysis = (role?: UserRole): boolean => {
  if (!role) return false
  return ['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'HR_SPECIALIST'].includes(role)
}

export const canViewAnalyses = (role?: UserRole): boolean => {
  if (!role) return false
  return ['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'HR_SPECIALIST'].includes(role)
}

export const canDeleteAnalysis = (role?: UserRole): boolean => {
  if (!role) return false
  return ['SUPER_ADMIN', 'ADMIN'].includes(role)
}

// ============================================
// OFFER PERMISSIONS
// ============================================

export const canCreateOffer = (role?: UserRole): boolean => {
  if (!role) return false
  return ['SUPER_ADMIN', 'ADMIN', 'MANAGER'].includes(role)
}

export const canEditOffer = (role?: UserRole): boolean => {
  if (!role) return false
  return ['SUPER_ADMIN', 'ADMIN', 'MANAGER'].includes(role)
}

export const canDeleteOffer = (role?: UserRole): boolean => {
  if (!role) return false
  return ['SUPER_ADMIN', 'ADMIN'].includes(role)
}

export const canViewOffers = (role?: UserRole): boolean => {
  if (!role) return false
  return ['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'HR_SPECIALIST'].includes(role)
}

// ============================================
// INTERVIEW PERMISSIONS
// ============================================

export const canScheduleInterview = (role?: UserRole): boolean => {
  if (!role) return false
  return ['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'HR_SPECIALIST'].includes(role)
}

export const canEditInterview = (role?: UserRole): boolean => {
  if (!role) return false
  return ['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'HR_SPECIALIST'].includes(role)
}

export const canDeleteInterview = (role?: UserRole): boolean => {
  if (!role) return false
  return ['SUPER_ADMIN', 'ADMIN'].includes(role)
}

export const canViewInterviews = (role?: UserRole): boolean => {
  if (!role) return false
  return ['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'HR_SPECIALIST'].includes(role)
}

// ============================================
// TEAM MANAGEMENT PERMISSIONS
// ============================================

export const canInviteUsers = (role?: UserRole): boolean => {
  if (!role) return false
  return ['SUPER_ADMIN', 'ADMIN'].includes(role)
}

export const canManageTeam = (role?: UserRole): boolean => {
  if (!role) return false
  return ['SUPER_ADMIN', 'ADMIN', 'MANAGER'].includes(role)
}

export const canViewTeam = (role?: UserRole): boolean => {
  if (!role) return false
  return ['SUPER_ADMIN', 'ADMIN', 'MANAGER'].includes(role)
}

// ============================================
// SETTINGS & ORGANIZATION PERMISSIONS
// ============================================

export const canViewOrganizationSettings = (role?: UserRole): boolean => {
  if (!role) return false
  return ['SUPER_ADMIN', 'ADMIN'].includes(role)
}

export const canEditOrganizationSettings = (role?: UserRole): boolean => {
  if (!role) return false
  return ['SUPER_ADMIN', 'ADMIN'].includes(role)
}

export const canViewUsageStats = (role?: UserRole): boolean => {
  if (!role) return false
  return ['SUPER_ADMIN', 'ADMIN'].includes(role)
}

// ============================================
// ANALYTICS & REPORTS PERMISSIONS
// ============================================

export const canViewAnalytics = (role?: UserRole): boolean => {
  if (!role) return false
  return ['SUPER_ADMIN', 'ADMIN', 'MANAGER'].includes(role)
}

export const canExportReports = (role?: UserRole): boolean => {
  if (!role) return false
  return ['SUPER_ADMIN', 'ADMIN', 'MANAGER'].includes(role)
}

// ============================================
// DASHBOARD PERMISSIONS
// ============================================

export const canViewDashboard = (role?: UserRole): boolean => {
  // All roles can view dashboard (but content differs)
  return !!role
}

export const canViewTeamPerformance = (role?: UserRole): boolean => {
  if (!role) return false
  return ['SUPER_ADMIN', 'ADMIN', 'MANAGER'].includes(role)
}

export const canViewPersonalStats = (role?: UserRole): boolean => {
  // All roles can view their own stats
  return !!role
}

// ============================================
// GENERIC ROLE CHECKER (for complex cases)
// ============================================

/**
 * Check if user has one of the specified roles
 * @param userRole - Current user's role
 * @param allowedRoles - Array of allowed roles
 */
export const hasAnyRole = (
  userRole?: UserRole,
  allowedRoles: UserRole[] = []
): boolean => {
  if (!userRole) return false
  return allowedRoles.includes(userRole)
}

/**
 * Check if user is SUPER_ADMIN
 */
export const isSuperAdmin = (role?: UserRole): boolean => {
  return role === 'SUPER_ADMIN'
}

/**
 * Check if user is ADMIN or higher
 */
export const isAdminOrHigher = (role?: UserRole): boolean => {
  if (!role) return false
  return ['SUPER_ADMIN', 'ADMIN'].includes(role)
}

/**
 * Check if user is MANAGER or higher
 */
export const isManagerOrHigher = (role?: UserRole): boolean => {
  if (!role) return false
  return ['SUPER_ADMIN', 'ADMIN', 'MANAGER'].includes(role)
}
```

**Verification:**
```bash
# File should exist
ls -lh frontend/lib/utils/rbac.ts

# Count functions
grep -c "export const" frontend/lib/utils/rbac.ts
# Expected: 40+ functions
```

**Git Commit:**
```bash
git add frontend/lib/utils/rbac.ts
git commit -m "feat(rbac): Add comprehensive RBAC helper utilities

40+ permission checking functions:
- Job postings (create/edit/delete/view)
- Candidates (create/edit/delete/view)
- Analyses (create/view/delete)
- Offers (create/edit/delete/view)
- Interviews (schedule/edit/delete/view)
- Team management (invite/manage/view)
- Settings (view/edit org settings)
- Analytics (view/export)
- Dashboard widgets (team performance, personal stats)

Generic helpers: hasAnyRole, isSuperAdmin, isAdminOrHigher"
```

---

### Phase 2: Sidebar Menu Filtering - 40 min

**Goal:** Show only menu items user has permission to access

#### Task 2.1: Update AppLayout Component

**File:** `frontend/components/AppLayout.tsx`

**Current State:** All menu items visible to all users

**New Implementation:**

```typescript
// Add imports
import { useUser } from '@/lib/hooks/useUser'
import {
  canViewJobPostings,
  canViewCandidates,
  canViewAnalyses,
  canViewOffers,
  canViewInterviews,
  canViewTeam,
  canViewAnalytics,
  isAdminOrHigher
} from '@/lib/utils/rbac'

// Inside AppLayout component
const { user } = useUser()
const userRole = user?.role

// Define menu items with role requirements
const menuItems = [
  {
    path: '/dashboard',
    label: 'Dashboard',
    icon: HomeIcon,
    show: true // All roles can see dashboard
  },
  {
    path: '/job-postings',
    label: 'Job Postings',
    icon: BriefcaseIcon,
    show: canViewJobPostings(userRole)
  },
  {
    path: '/candidates',
    label: 'Candidates',
    icon: UsersIcon,
    show: canViewCandidates(userRole)
  },
  {
    path: '/analyses',
    label: 'Analyses',
    icon: ChartBarIcon,
    show: canViewAnalyses(userRole)
  },
  {
    path: '/offers',
    label: 'Offers',
    icon: DocumentTextIcon,
    show: canViewOffers(userRole)
  },
  {
    path: '/interviews',
    label: 'Interviews',
    icon: CalendarIcon,
    show: canViewInterviews(userRole)
  },
  {
    path: '/team',
    label: 'Team',
    icon: UserGroupIcon,
    show: canViewTeam(userRole)
  },
  {
    path: '/analytics',
    label: 'Analytics',
    icon: ChartPieIcon,
    show: canViewAnalytics(userRole)
  },
  {
    path: '/settings',
    label: 'Settings',
    icon: CogIcon,
    show: true // All roles can access settings (but tabs differ)
  }
]

// Filter visible menu items
const visibleMenuItems = menuItems.filter(item => item.show)

// Render only visible items
{visibleMenuItems.map((item) => (
  <Link
    key={item.path}
    href={item.path}
    className={/* ... */}
  >
    <item.icon className="h-5 w-5" />
    <span>{item.label}</span>
  </Link>
))}
```

**Expected Results by Role:**

| Role | Visible Menu Items |
|------|-------------------|
| **USER** | Dashboard, Settings |
| **HR_SPECIALIST** | Dashboard, Job Postings, Candidates, Analyses, Offers, Interviews, Settings |
| **MANAGER** | + Team, Analytics |
| **ADMIN** | All items |
| **SUPER_ADMIN** | All items |

**Verification:**
```bash
# Check if rbac imports exist
grep "canView" frontend/components/AppLayout.tsx

# Count menu items
grep -c "path:" frontend/components/AppLayout.tsx
# Expected: 9 items
```

**Git Commit:**
```bash
git add frontend/components/AppLayout.tsx
git commit -m "feat(rbac): Add role-based sidebar menu filtering

Menu items now filtered by user role:
- USER: Dashboard + Settings (2 items)
- HR_SPECIALIST: +Job Postings, Candidates, Analyses, Offers, Interviews (7 items)
- MANAGER: +Team, Analytics (9 items)
- ADMIN/SUPER_ADMIN: All items (9 items)

Uses RBAC helper utilities for permission checking"
```

---

### Phase 3: Action Button Visibility - 60 min

**Goal:** Show/hide CRUD buttons based on role permissions

#### Task 3.1: Job Postings Page

**File:** `frontend/app/(authenticated)/job-postings/page.tsx`

**Add imports:**
```typescript
import { useUser } from '@/lib/hooks/useUser'
import {
  canCreateJobPosting,
  canEditJobPosting,
  canDeleteJobPosting
} from '@/lib/utils/rbac'
```

**Update component:**
```typescript
const JobPostingsPage = () => {
  const { user } = useUser()
  const userRole = user?.role

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1>Job Postings</h1>

        {/* Create button - only for ADMIN/MANAGER */}
        {canCreateJobPosting(userRole) && (
          <button onClick={handleCreate}>
            Create Job Posting
          </button>
        )}
      </div>

      {/* Job postings list */}
      {jobPostings.map((job) => (
        <div key={job.id}>
          <h3>{job.title}</h3>

          <div className="flex gap-2">
            {/* Edit button - ADMIN/MANAGER */}
            {canEditJobPosting(userRole) && (
              <button onClick={() => handleEdit(job.id)}>
                Edit
              </button>
            )}

            {/* Delete button - ADMIN only */}
            {canDeleteJobPosting(userRole) && (
              <button onClick={() => handleDelete(job.id)}>
                Delete
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
```

**Expected Results:**

| Role | Create | Edit | Delete |
|------|--------|------|--------|
| USER | ❌ | ❌ | ❌ |
| HR_SPECIALIST | ❌ | ❌ | ❌ |
| MANAGER | ✅ | ✅ | ❌ |
| ADMIN | ✅ | ✅ | ✅ |
| SUPER_ADMIN | ✅ | ✅ | ✅ |

---

#### Task 3.2: Candidates Page

**File:** `frontend/app/(authenticated)/candidates/page.tsx`

```typescript
import {
  canCreateCandidate,
  canEditCandidate,
  canDeleteCandidate
} from '@/lib/utils/rbac'

const CandidatesPage = () => {
  const { user } = useUser()
  const userRole = user?.role

  return (
    <div>
      {/* Create button - HR_SPECIALIST and above */}
      {canCreateCandidate(userRole) && (
        <button>Add Candidate</button>
      )}

      {candidates.map((candidate) => (
        <div key={candidate.id}>
          {/* Edit - HR_SPECIALIST and above */}
          {canEditCandidate(userRole) && (
            <button>Edit</button>
          )}

          {/* Delete - ADMIN only */}
          {canDeleteCandidate(userRole) && (
            <button>Delete</button>
          )}
        </div>
      ))}
    </div>
  )
}
```

---

#### Task 3.3: Analyses Page

**File:** `frontend/app/(authenticated)/analyses/page.tsx`

```typescript
import {
  canCreateAnalysis,
  canDeleteAnalysis
} from '@/lib/utils/rbac'

const AnalysesPage = () => {
  const { user } = useUser()
  const userRole = user?.role

  return (
    <div>
      {/* Create/Upload CV button */}
      {canCreateAnalysis(userRole) && (
        <button>Upload CV</button>
      )}

      {analyses.map((analysis) => (
        <div key={analysis.id}>
          {/* Delete - ADMIN only */}
          {canDeleteAnalysis(userRole) && (
            <button>Delete</button>
          )}
        </div>
      ))}
    </div>
  )
}
```

---

#### Task 3.4: Offers Page

**File:** `frontend/app/(authenticated)/offers/page.tsx`

```typescript
import {
  canCreateOffer,
  canEditOffer,
  canDeleteOffer
} from '@/lib/utils/rbac'

const OffersPage = () => {
  const { user } = useUser()
  const userRole = user?.role

  return (
    <div>
      {/* Create - MANAGER and above */}
      {canCreateOffer(userRole) && (
        <button>Create Offer</button>
      )}

      {offers.map((offer) => (
        <div key={offer.id}>
          {canEditOffer(userRole) && (
            <button>Edit</button>
          )}

          {canDeleteOffer(userRole) && (
            <button>Delete</button>
          )}
        </div>
      ))}
    </div>
  )
}
```

---

#### Task 3.5: Interviews Page

**File:** `frontend/app/(authenticated)/interviews/page.tsx`

```typescript
import {
  canScheduleInterview,
  canEditInterview,
  canDeleteInterview
} from '@/lib/utils/rbac'

const InterviewsPage = () => {
  const { user } = useUser()
  const userRole = user?.role

  return (
    <div>
      {/* Schedule - HR_SPECIALIST and above */}
      {canScheduleInterview(userRole) && (
        <button>Schedule Interview</button>
      )}

      {interviews.map((interview) => (
        <div key={interview.id}>
          {canEditInterview(userRole) && (
            <button>Edit</button>
          )}

          {canDeleteInterview(userRole) && (
            <button>Delete</button>
          )}
        </div>
      ))}
    </div>
  )
}
```

---

#### Task 3.6: Team Page

**File:** `frontend/app/(authenticated)/team/page.tsx`

```typescript
import {
  canInviteUsers,
  canManageTeam
} from '@/lib/utils/rbac'

const TeamPage = () => {
  const { user } = useUser()
  const userRole = user?.role

  return (
    <div>
      {/* Invite button - ADMIN only */}
      {canInviteUsers(userRole) && (
        <button>Invite User</button>
      )}

      {teamMembers.map((member) => (
        <div key={member.id}>
          {/* Manage (edit role, remove) - ADMIN/MANAGER */}
          {canManageTeam(userRole) && (
            <>
              <button>Edit Role</button>
              <button>Remove</button>
            </>
          )}
        </div>
      ))}
    </div>
  )
}
```

**Git Commit (after all pages updated):**
```bash
git add frontend/app/\(authenticated\)/*/page.tsx
git commit -m "feat(rbac): Add role-based action button visibility

6 pages updated with RBAC button filtering:
- Job Postings: Create (ADMIN/MANAGER), Edit (ADMIN/MANAGER), Delete (ADMIN)
- Candidates: Create/Edit (HR_SPECIALIST+), Delete (ADMIN)
- Analyses: Upload CV (HR_SPECIALIST+), Delete (ADMIN)
- Offers: Create/Edit (MANAGER+), Delete (ADMIN)
- Interviews: Schedule/Edit (HR_SPECIALIST+), Delete (ADMIN)
- Team: Invite (ADMIN), Manage (ADMIN/MANAGER)

All buttons now respect role permissions"
```

---

### Phase 4: Dashboard Widgets - 35 min

**Goal:** Show different dashboard content based on role

#### Task 4.1: Update Dashboard Page

**File:** `frontend/app/(authenticated)/dashboard/page.tsx`

```typescript
import { useUser } from '@/lib/hooks/useUser'
import {
  canViewTeamPerformance,
  canViewAnalytics,
  canViewUsageStats,
  isAdminOrHigher
} from '@/lib/utils/rbac'

const DashboardPage = () => {
  const { user } = useUser()
  const userRole = user?.role

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Personal Stats - All roles */}
      <PersonalStatsWidget user={user} />

      {/* Recent Activity - All roles */}
      <RecentActivityWidget />

      {/* Team Performance - MANAGER and above */}
      {canViewTeamPerformance(userRole) && (
        <TeamPerformanceWidget />
      )}

      {/* Analytics Overview - MANAGER and above */}
      {canViewAnalytics(userRole) && (
        <AnalyticsOverviewWidget />
      )}

      {/* Usage Limits - ADMIN only */}
      {canViewUsageStats(userRole) && (
        <UsageLimitsWidget />
      )}

      {/* Organization Stats - ADMIN only */}
      {isAdminOrHigher(userRole) && (
        <OrganizationStatsWidget />
      )}

      {/* Quick Actions - Role-based */}
      <QuickActionsWidget role={userRole} />
    </div>
  )
}
```

**Expected Dashboard by Role:**

| Role | Widgets |
|------|---------|
| **USER** | Personal Stats, Recent Activity, Quick Actions (limited) |
| **HR_SPECIALIST** | + Quick Actions (full HR operations) |
| **MANAGER** | + Team Performance, Analytics Overview |
| **ADMIN** | + Usage Limits, Organization Stats |
| **SUPER_ADMIN** | All widgets + cross-org data |

---

#### Task 4.2: Create Quick Actions Widget

**File:** `frontend/components/dashboard/QuickActionsWidget.tsx`

```typescript
import { UserRole } from '@/lib/constants/roles'
import {
  canCreateJobPosting,
  canCreateCandidate,
  canScheduleInterview,
  canCreateOffer
} from '@/lib/utils/rbac'

interface QuickActionsWidgetProps {
  role?: UserRole
}

const QuickActionsWidget: React.FC<QuickActionsWidgetProps> = ({ role }) => {
  const actions = [
    {
      label: 'Create Job Posting',
      href: '/job-postings/new',
      show: canCreateJobPosting(role)
    },
    {
      label: 'Add Candidate',
      href: '/candidates/new',
      show: canCreateCandidate(role)
    },
    {
      label: 'Schedule Interview',
      href: '/interviews/new',
      show: canScheduleInterview(role)
    },
    {
      label: 'Create Offer',
      href: '/offers/new',
      show: canCreateOffer(role)
    }
  ]

  const visibleActions = actions.filter(action => action.show)

  if (visibleActions.length === 0) {
    return null // No actions available for this role
  }

  return (
    <div className="card">
      <h3>Quick Actions</h3>
      <div className="flex flex-col gap-2">
        {visibleActions.map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className="btn"
          >
            {action.label}
          </Link>
        ))}
      </div>
    </div>
  )
}
```

**Git Commit:**
```bash
git add frontend/app/\(authenticated\)/dashboard/page.tsx frontend/components/dashboard/QuickActionsWidget.tsx
git commit -m "feat(rbac): Add role-based dashboard widgets

Dashboard now shows different content by role:
- USER: Personal stats + recent activity (2 widgets)
- HR_SPECIALIST: + Quick actions (3 widgets)
- MANAGER: + Team performance + Analytics (5 widgets)
- ADMIN: + Usage limits + Org stats (7 widgets)

QuickActionsWidget shows only permitted actions:
- Job posting (ADMIN/MANAGER)
- Candidate (HR_SPECIALIST+)
- Interview (HR_SPECIALIST+)
- Offer (MANAGER+)"
```

---

### Phase 5: Settings Page Tabs - 30 min

**Goal:** Filter settings tabs based on role

#### Task 5.1: Update Settings Layout

**File:** `frontend/app/(authenticated)/settings/layout.tsx`

```typescript
import { useUser } from '@/lib/hooks/useUser'
import {
  canViewOrganizationSettings,
  canManageTeam,
  isAdminOrHigher
} from '@/lib/utils/rbac'

const SettingsLayout = ({ children }: { children: React.ReactNode }) => {
  const { user } = useUser()
  const userRole = user?.role

  const tabs = [
    {
      id: 'overview',
      label: 'Overview',
      href: '/settings/overview',
      show: true // All roles
    },
    {
      id: 'profile',
      label: 'Profile',
      href: '/settings/profile',
      show: true // All roles
    },
    {
      id: 'organization',
      label: 'Organization',
      href: '/settings/organization',
      show: canViewOrganizationSettings(userRole)
    },
    {
      id: 'team',
      label: 'Team',
      href: '/settings/team',
      show: canManageTeam(userRole)
    },
    {
      id: 'security',
      label: 'Security',
      href: '/settings/security',
      show: true // All roles
    },
    {
      id: 'notifications',
      label: 'Notifications',
      href: '/settings/notifications',
      show: true // All roles
    },
    {
      id: 'billing',
      label: 'Billing',
      href: '/settings/billing',
      show: isAdminOrHigher(userRole)
    }
  ]

  const visibleTabs = tabs.filter(tab => tab.show)

  return (
    <div>
      <h1>Settings</h1>

      {/* Tab navigation */}
      <div className="flex gap-4 border-b mb-6">
        {visibleTabs.map((tab) => (
          <Link
            key={tab.id}
            href={tab.href}
            className="tab"
          >
            {tab.label}
          </Link>
        ))}
      </div>

      {/* Tab content */}
      {children}
    </div>
  )
}
```

**Expected Tabs by Role:**

| Role | Visible Tabs |
|------|--------------|
| **USER** | Overview, Profile, Security, Notifications (4) |
| **HR_SPECIALIST** | Same as USER (4) |
| **MANAGER** | + Team (5) |
| **ADMIN** | + Organization, Billing (7) |
| **SUPER_ADMIN** | All (7) |

---

#### Task 5.2: Update Organization Settings Page

**File:** `frontend/app/(authenticated)/settings/organization/page.tsx`

```typescript
import { useUser } from '@/lib/hooks/useUser'
import {
  canEditOrganizationSettings,
  canViewUsageStats
} from '@/lib/utils/rbac'

const OrganizationSettingsPage = () => {
  const { user } = useUser()
  const userRole = user?.role

  return (
    <div>
      <h2>Organization Settings</h2>

      {/* Basic info - view only for MANAGER, editable for ADMIN */}
      <section>
        <h3>Organization Information</h3>
        {/* ... org name, industry, etc ... */}

        {canEditOrganizationSettings(userRole) && (
          <button>Save Changes</button>
        )}
      </section>

      {/* Usage stats - ADMIN only */}
      {canViewUsageStats(userRole) && (
        <section>
          <h3>Usage Statistics</h3>
          <UsageStatsChart />
        </section>
      )}

      {/* Danger zone - ADMIN only */}
      {canEditOrganizationSettings(userRole) && (
        <section className="danger-zone">
          <h3>Danger Zone</h3>
          <button className="btn-danger">Delete Organization</button>
        </section>
      )}
    </div>
  )
}
```

**Git Commit:**
```bash
git add frontend/app/\(authenticated\)/settings/layout.tsx frontend/app/\(authenticated\)/settings/organization/page.tsx
git commit -m "feat(rbac): Add role-based settings tab filtering

Settings tabs now filtered by role:
- USER: Overview, Profile, Security, Notifications (4 tabs)
- HR_SPECIALIST: Same as USER (4 tabs)
- MANAGER: + Team (5 tabs)
- ADMIN: + Organization, Billing (7 tabs)

Organization settings page:
- View-only for MANAGER
- Editable for ADMIN (save button, danger zone)"
```

---

## ✅ Final Verification Checklist

### Phase 1: RBAC Utilities
- [ ] `frontend/lib/utils/rbac.ts` created
- [ ] 40+ helper functions defined
- [ ] All permission types covered (job postings, candidates, offers, interviews, team, settings)
- [ ] Generic helpers (hasAnyRole, isSuperAdmin, isAdminOrHigher)

### Phase 2: Sidebar Menu
- [ ] `AppLayout.tsx` updated with role filtering
- [ ] Menu items array has `show` property
- [ ] Only visible items rendered
- [ ] USER sees 2 items (Dashboard, Settings)
- [ ] HR_SPECIALIST sees 7 items
- [ ] MANAGER sees 9 items
- [ ] ADMIN sees 9 items

### Phase 3: Action Buttons
- [ ] Job Postings: Create/Edit/Delete buttons filtered
- [ ] Candidates: Create/Edit/Delete buttons filtered
- [ ] Analyses: Upload CV/Delete buttons filtered
- [ ] Offers: Create/Edit/Delete buttons filtered
- [ ] Interviews: Schedule/Edit/Delete buttons filtered
- [ ] Team: Invite/Manage buttons filtered

### Phase 4: Dashboard Widgets
- [ ] Dashboard page updated with role-based widgets
- [ ] Personal stats shown to all
- [ ] Team performance for MANAGER+
- [ ] Analytics for MANAGER+
- [ ] Usage limits for ADMIN
- [ ] Organization stats for ADMIN
- [ ] QuickActionsWidget created with role-based actions

### Phase 5: Settings Tabs
- [ ] Settings layout updated with tab filtering
- [ ] Overview/Profile/Security/Notifications for all
- [ ] Team tab for MANAGER+
- [ ] Organization tab for ADMIN
- [ ] Billing tab for ADMIN
- [ ] Organization page: Edit buttons for ADMIN only

---

## 🧪 Manual Testing Steps

### Test 1: Login as USER

```bash
# Email: test-user@test-org-1.com
# Password: TestPass123!
```

**Expected:**
- ✅ Sidebar: Dashboard, Settings (2 items)
- ✅ Dashboard: Personal stats, Recent activity (no admin widgets)
- ✅ Settings: Overview, Profile, Security, Notifications (4 tabs)
- ✅ No "Create" buttons anywhere
- ✅ No "Delete" buttons anywhere

---

### Test 2: Login as HR_SPECIALIST

```bash
# Email: test-hr_specialist@test-org-1.com
# Password: TestPass123!
```

**Expected:**
- ✅ Sidebar: Dashboard, Job Postings, Candidates, Analyses, Offers, Interviews, Settings (7 items)
- ✅ Job Postings: No "Create" button (only MANAGER/ADMIN can create)
- ✅ Candidates: "Add Candidate" button visible
- ✅ Interviews: "Schedule Interview" button visible
- ✅ No "Delete" buttons (only ADMIN can delete)
- ✅ Dashboard: + Quick actions widget (with HR operations)

---

### Test 3: Login as MANAGER

```bash
# Email: test-manager@test-org-1.com
# Password: TestPass123!
```

**Expected:**
- ✅ Sidebar: + Team, Analytics (9 items)
- ✅ Job Postings: "Create Job Posting" button visible
- ✅ Job Postings: "Edit" button visible
- ✅ Job Postings: No "Delete" button (only ADMIN)
- ✅ Offers: "Create Offer" button visible
- ✅ Team: "Manage" buttons visible, no "Invite" button
- ✅ Dashboard: + Team performance, Analytics widgets
- ✅ Settings: + Team tab (5 tabs)

---

### Test 4: Login as ADMIN

```bash
# Email: test-admin@test-org-1.com
# Password: TestPass123!
```

**Expected:**
- ✅ Sidebar: All items (9 items)
- ✅ All "Create" buttons visible
- ✅ All "Edit" buttons visible
- ✅ All "Delete" buttons visible
- ✅ Team: "Invite User" button visible
- ✅ Dashboard: + Usage limits, Org stats widgets
- ✅ Settings: + Organization, Billing tabs (7 tabs)
- ✅ Organization settings: "Save Changes" button visible

---

### Test 5: Login as SUPER_ADMIN

```bash
# Email: info@gaiai.ai
# Password: 23235656
```

**Expected:**
- ✅ Same as ADMIN (all buttons/tabs visible)
- ✅ Can see data from ALL organizations (cross-org access)

---

## 📊 Success Criteria

### Critical (Must Pass)
- ✅ **40+ RBAC helper functions** created
- ✅ **Sidebar menu** filtered by role (USER: 2 items, HR: 7, MANAGER: 9, ADMIN: 9)
- ✅ **Action buttons** hidden when user lacks permission
- ✅ **Dashboard widgets** show different content by role
- ✅ **Settings tabs** filtered by role (USER: 4, MANAGER: 5, ADMIN: 7)
- ✅ **No 403 errors** when clicking visible buttons
- ✅ **USER role** sees minimal UI (Dashboard + Settings only)

### Optional (Nice to Have)
- ✅ Loading states for role checks
- ✅ Tooltips explaining why buttons are hidden
- ✅ Role badges in user menu

---

## 🚨 Common Issues & Fixes

### Issue 1: useUser hook returns undefined

**Symptom:** Menu items not filtering, all items visible
**Debug:**
```typescript
console.log('User:', user)
console.log('Role:', user?.role)
```
**Fix:** Ensure `useUser` hook correctly fetches current user from auth context

---

### Issue 2: Buttons still visible despite role check

**Symptom:** USER sees "Delete" buttons
**Debug:**
```typescript
console.log('Can delete:', canDeleteJobPosting(userRole))
console.log('User role:', userRole)
```
**Fix:** Check if role comparison is case-sensitive, ensure role value matches exactly

---

### Issue 3: Settings tabs not filtering

**Symptom:** USER sees "Organization" tab
**Debug:**
```bash
grep "show:" frontend/app/\(authenticated\)/settings/layout.tsx
```
**Fix:** Ensure `visibleTabs` filter is applied before rendering

---

## 📝 Deliverables

### Required: Implementation Report

**Filename:** `docs/reports/worker3-frontend-rbac-ui-report.md`

**Required Sections:**
1. **Executive Summary** (Pass/Fail overview)
2. **Phase 1: RBAC Utilities** (40+ functions created)
3. **Phase 2: Sidebar Menu** (before/after screenshots)
4. **Phase 3: Action Buttons** (6 pages updated)
5. **Phase 4: Dashboard Widgets** (role-based widgets)
6. **Phase 5: Settings Tabs** (tab filtering)
7. **Manual Testing Results** (5 role tests)
8. **Issues Found** (if any)
9. **Recommendations**

### Git Commits Expected
1. ✅ RBAC helper utilities (rbac.ts)
2. ✅ Sidebar menu filtering (AppLayout.tsx)
3. ✅ Action button visibility (6 pages)
4. ✅ Dashboard widgets (dashboard page + QuickActionsWidget)
5. ✅ Settings tabs (settings layout + org page)

**Total: 5 commits**

---

## ⏱️ Estimated Time

**Total: 2-3 hours**

- Phase 1 (RBAC Utils): 30 min
- Phase 2 (Sidebar Menu): 40 min
- Phase 3 (Action Buttons): 60 min
- Phase 4 (Dashboard Widgets): 35 min
- Phase 5 (Settings Tabs): 30 min
- Manual Testing: 20 min
- Report Writing: 20-30 min

---

## 🎯 AsanMod Rules

**STRICT_MODE Enabled:**
- ❌ NO simulation - Make REAL file changes
- ❌ NO placeholder code - Write COMPLETE implementations
- ✅ REAL commits - Git commit after each phase
- ✅ TEST each role - Login and verify UI manually

**After Each Phase:**
- ✅ Git commit with descriptive message
- ✅ Verify files changed correctly

**After Task:**
- ✅ Write implementation report
- ✅ Test all 5 roles manually
- ✅ Report to Mod with summary

---

## 📚 Reference Documents

- **RBAC Strategy:** [`docs/architecture/RBAC-COMPLETE-STRATEGY.md`](../architecture/RBAC-COMPLETE-STRATEGY.md)
- **Test Data:** [`docs/test-tasks/COMPLETE-TEST-DATA-REFERENCE.md`](COMPLETE-TEST-DATA-REFERENCE.md)
- **Roles Constants:** [`frontend/lib/constants/roles.ts`](../../frontend/lib/constants/roles.ts)
- **useHasRole Hook:** [`frontend/lib/hooks/useHasRole.ts`](../../frontend/lib/hooks/useHasRole.ts)

---

**🚀 START: Phase 1, Task 1.1 (Create RBAC Utilities File)**

**IMPORTANT:** Commit after EACH phase! Test UI changes in browser for each role!
