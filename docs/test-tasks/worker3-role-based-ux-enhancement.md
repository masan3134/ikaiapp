# 🎨 Worker #3 - Role-Based UX/UI Enhancement (Visual + Easy)

**Task ID:** worker3-role-based-ux-enhancement
**Assigned To:** Worker #3
**Created By:** Master Claude (Mod)
**Date:** 2025-11-04
**Priority:** HIGH
**Estimated Time:** 2-3 hours

---

## 🎯 Objective

Transform the frontend into a **beautiful, intuitive, role-specific experience** where each user sees exactly what they need - nothing more, nothing less.

**Core Principles:**
- ✨ **Visual Hierarchy** - Important things are big and colorful
- 🎯 **One-Click Actions** - No more than 2 clicks for any action
- 🌈 **Color-Coded Roles** - Each role has its own color identity
- 📱 **Mobile-First** - Perfect on all devices
- 🚀 **Instant Feedback** - Every action has animation

**Expected Outcome:** 5 completely different dashboard experiences, one for each role.

---

## 🌈 Role Color System

**Visual Identity for Each Role:**

```typescript
// frontend/lib/constants/roleColors.ts
export const ROLE_COLORS = {
  SUPER_ADMIN: {
    primary: '#EF4444',    // Red (power/danger)
    light: '#FEE2E2',
    dark: '#991B1B',
    gradient: 'from-red-500 to-red-700'
  },
  ADMIN: {
    primary: '#A855F7',    // Purple (premium/authority)
    light: '#F3E8FF',
    dark: '#6B21A8',
    gradient: 'from-purple-500 to-purple-700'
  },
  MANAGER: {
    primary: '#3B82F6',    // Blue (trust/leadership)
    light: '#DBEAFE',
    dark: '#1E40AF',
    gradient: 'from-blue-500 to-blue-700'
  },
  HR_SPECIALIST: {
    primary: '#10B981',    // Green (growth/recruitment)
    light: '#D1FAE5',
    dark: '#065F46',
    gradient: 'from-green-500 to-green-700'
  },
  USER: {
    primary: '#6B7280',    // Gray (neutral/basic)
    light: '#F3F4F6',
    dark: '#374151',
    gradient: 'from-gray-500 to-gray-700'
  }
}
```

**Usage:**
- Header: Role badge with primary color
- Dashboard cards: Border color matches role
- Buttons: Primary color
- Success messages: Role color

---

## 🛠️ Phase 1: Role Badge & Header (30 min)

### Task 1.1: Create Role Badge Component

**File:** `frontend/components/ui/RoleBadge.tsx`

```typescript
import { UserRole } from '@/lib/constants/roles'
import { ROLE_COLORS } from '@/lib/constants/roleColors'

interface RoleBadgeProps {
  role: UserRole
  size?: 'sm' | 'md' | 'lg'
}

export const RoleBadge: React.FC<RoleBadgeProps> = ({ role, size = 'md' }) => {
  const colors = ROLE_COLORS[role]

  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2'
  }

  const icons = {
    SUPER_ADMIN: '🔴',
    ADMIN: '🟣',
    MANAGER: '🔵',
    HR_SPECIALIST: '🟢',
    USER: '⚪'
  }

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 rounded-full font-medium
        ${sizeClasses[size]}
        transition-all duration-300 hover:scale-105
      `}
      style={{
        backgroundColor: colors.light,
        color: colors.dark,
        border: `2px solid ${colors.primary}`
      }}
    >
      <span>{icons[role]}</span>
      <span>{role.replace('_', ' ')}</span>
    </span>
  )
}
```

---

### Task 1.2: Update AppLayout Header

**File:** `frontend/components/AppLayout.tsx`

```typescript
import { RoleBadge } from '@/components/ui/RoleBadge'
import { useUser } from '@/lib/hooks/useUser'

const AppLayout = ({ children }) => {
  const { user } = useUser()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <img src="/logo.svg" alt="IKAI" className="h-8" />
              <h1 className="text-xl font-bold text-gray-900">IKAI HR</h1>
            </div>

            {/* User Info */}
            <div className="flex items-center gap-4">
              {/* Role Badge */}
              <RoleBadge role={user?.role} size="sm" />

              {/* User Menu */}
              <div className="flex items-center gap-2">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {user?.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {user?.organization?.name}
                  </p>
                </div>
                <button className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-lg">
                    {user?.name?.[0]?.toUpperCase()}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Rest of layout... */}
    </div>
  )
}
```

**Git Commit:**
```bash
git add frontend/components/ui/RoleBadge.tsx frontend/lib/constants/roleColors.ts frontend/components/AppLayout.tsx
git commit -m "feat(ux): Add role-based color system and badge component

Role colors:
- SUPER_ADMIN: 🔴 Red (power)
- ADMIN: 🟣 Purple (authority)
- MANAGER: 🔵 Blue (leadership)
- HR_SPECIALIST: 🟢 Green (recruitment)
- USER: ⚪ Gray (basic)

RoleBadge component:
- Emoji icon + label
- Hover animation (scale)
- Size variants (sm/md/lg)
- Color-coded border

Header updated:
- Role badge prominent
- User info with org name
- Avatar initials"
```

---

## 🎨 Phase 2: Dashboard Cards System (45 min)

### Task 2.1: Create DashboardCard Component

**File:** `frontend/components/dashboard/DashboardCard.tsx`

```typescript
import { ReactNode } from 'react'

interface DashboardCardProps {
  title: string
  value?: string | number
  subtitle?: string
  icon?: ReactNode
  color?: string
  gradient?: string
  onClick?: () => void
  loading?: boolean
  trend?: {
    value: number
    isPositive: boolean
  }
}

export const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  color = '#3B82F6',
  gradient,
  onClick,
  loading,
  trend
}) => {
  return (
    <div
      className={`
        bg-white rounded-xl shadow-sm border-2 p-6
        transition-all duration-300
        hover:shadow-lg hover:-translate-y-1
        ${onClick ? 'cursor-pointer' : ''}
      `}
      style={{ borderColor: color }}
      onClick={onClick}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        {icon && (
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center text-white"
            style={{
              background: gradient || `linear-gradient(135deg, ${color}, ${color}dd)`
            }}
          >
            {icon}
          </div>
        )}
      </div>

      {/* Value */}
      {loading ? (
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-20 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-32"></div>
        </div>
      ) : (
        <>
          <div className="flex items-end gap-2 mb-2">
            <p className="text-3xl font-bold text-gray-900">{value}</p>
            {trend && (
              <span
                className={`text-sm font-medium ${
                  trend.isPositive ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-sm text-gray-500">{subtitle}</p>
          )}
        </>
      )}
    </div>
  )
}
```

---

### Task 2.2: Create Stat Cards for Dashboard

**File:** `frontend/components/dashboard/StatCards.tsx`

```typescript
import { DashboardCard } from './DashboardCard'
import { useUser } from '@/lib/hooks/useUser'
import { ROLE_COLORS } from '@/lib/constants/roleColors'

interface StatCardsProps {
  stats: {
    activeJobs?: number
    totalCandidates?: number
    thisMonthAnalyses?: number
    usagePercent?: number
  }
}

export const StatCards: React.FC<StatCardsProps> = ({ stats }) => {
  const { user } = useUser()
  const roleColor = ROLE_COLORS[user?.role]?.primary || '#3B82F6'

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Active Jobs */}
      <DashboardCard
        title="Active Job Postings"
        value={stats.activeJobs || 0}
        icon={<span className="text-2xl">📄</span>}
        color={roleColor}
        onClick={() => router.push('/job-postings')}
      />

      {/* Total Candidates */}
      <DashboardCard
        title="Total Candidates"
        value={stats.totalCandidates || 0}
        subtitle="In pipeline"
        icon={<span className="text-2xl">👥</span>}
        color={roleColor}
        trend={{ value: 12, isPositive: true }}
      />

      {/* This Month Analyses */}
      <DashboardCard
        title="This Month Analyses"
        value={`${stats.thisMonthAnalyses || 0}/10`}
        subtitle="CV analysis quota"
        icon={<span className="text-2xl">📊</span>}
        color={stats.usagePercent > 80 ? '#EF4444' : roleColor}
      />

      {/* Usage Alert (if over limit) */}
      {stats.usagePercent > 80 && (
        <DashboardCard
          title="⚠️ Usage Alert"
          value="Upgrade"
          subtitle="You're over your monthly limit"
          icon={<span className="text-2xl">🚀</span>}
          color="#EF4444"
          gradient="from-red-500 to-orange-500"
          onClick={() => router.push('/settings/billing')}
        />
      )}
    </div>
  )
}
```

**Git Commit:**
```bash
git add frontend/components/dashboard/DashboardCard.tsx frontend/components/dashboard/StatCards.tsx
git commit -m "feat(dashboard): Add interactive stat cards with animations

DashboardCard features:
- Hover animation (lift + shadow)
- Color-coded borders
- Gradient icons
- Trend indicators (↑/↓ with %)
- Loading skeleton
- Click action

StatCards:
- Role-based coloring
- 4 metrics (jobs, candidates, analyses, usage)
- Usage alert (red if >80%)
- Responsive grid (1-2-4 cols)"
```

---

## 🎯 Phase 3: Role-Specific Dashboards (60 min)

### Task 3.1: SUPER_ADMIN Dashboard

**File:** `frontend/app/(authenticated)/dashboard/SuperAdminDashboard.tsx`

```typescript
import { useState } from 'react'
import { DashboardCard } from '@/components/dashboard/DashboardCard'

export const SuperAdminDashboard = () => {
  const [selectedOrg, setSelectedOrg] = useState('all')

  return (
    <div className="space-y-6">
      {/* Header with Org Switcher */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            🔴 SUPER ADMIN CONTROL CENTER
          </h1>
          <p className="text-sm text-gray-500">System-wide overview</p>
        </div>

        {/* Organization Switcher */}
        <select
          value={selectedOrg}
          onChange={(e) => setSelectedOrg(e.target.value)}
          className="px-4 py-2 border-2 border-red-500 rounded-lg bg-white text-gray-900 font-medium"
        >
          <option value="all">🌐 All Organizations</option>
          <option value="org1">Test Org Free</option>
          <option value="org2">Test Org Pro</option>
          <option value="org3">Test Org Enterprise</option>
        </select>
      </div>

      {/* System Health */}
      <div className="bg-white rounded-xl shadow-sm border-2 border-red-500 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          System Health
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl mb-1">✅</div>
            <div className="text-sm font-medium text-gray-900">API</div>
            <div className="text-xs text-gray-500">180ms avg</div>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-1">✅</div>
            <div className="text-sm font-medium text-gray-900">Queue</div>
            <div className="text-xs text-gray-500">3ms avg</div>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-1">✅</div>
            <div className="text-sm font-medium text-gray-900">Database</div>
            <div className="text-xs text-gray-500">78GB / 200GB</div>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-1">✅</div>
            <div className="text-sm font-medium text-gray-900">Error Rate</div>
            <div className="text-xs text-gray-500">0.02%</div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard
          title="Total Organizations"
          value={150}
          icon={<span className="text-2xl">🏢</span>}
          color="#EF4444"
          gradient="from-red-500 to-red-700"
        />
        <DashboardCard
          title="Total Users"
          value="2,340"
          icon={<span className="text-2xl">👥</span>}
          color="#EF4444"
          trend={{ value: 8, isPositive: true }}
        />
        <DashboardCard
          title="Total Job Postings"
          value={892}
          icon={<span className="text-2xl">📄</span>}
          color="#EF4444"
        />
        <DashboardCard
          title="Active Analyses"
          value={45}
          subtitle="Processing now"
          icon={<span className="text-2xl">⚙️</span>}
          color="#EF4444"
        />
      </div>

      {/* Organizations by Plan */}
      <div className="bg-white rounded-xl shadow-sm border-2 border-red-500 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Organizations by Plan
        </h2>
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>FREE Plan</span>
              <span className="font-medium">80 orgs</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gray-500 h-2 rounded-full"
                style={{ width: '53%' }}
              ></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>PRO Plan</span>
              <span className="font-medium">50 orgs</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full"
                style={{ width: '33%' }}
              ></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>ENTERPRISE Plan</span>
              <span className="font-medium">20 orgs</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-purple-500 h-2 rounded-full"
                style={{ width: '13%' }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Events */}
      <div className="bg-white rounded-xl shadow-sm border-2 border-red-500 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Recent System Events
        </h2>
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
            <span className="text-2xl">🆕</span>
            <div>
              <p className="text-sm font-medium text-gray-900">
                New organization: XYZ Consulting
              </p>
              <p className="text-xs text-gray-500">2 hours ago</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
            <span className="text-2xl">⚠️</span>
            <div>
              <p className="text-sm font-medium text-gray-900">
                TechStart: Limit exceeded (12/10 analyses)
              </p>
              <p className="text-xs text-gray-500">5 hours ago</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
            <span className="text-2xl">✅</span>
            <div>
              <p className="text-sm font-medium text-gray-900">
                MediCare Analytics upgraded to PRO
              </p>
              <p className="text-xs text-gray-500">1 day ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
```

---

### Task 3.2: ADMIN Dashboard

**File:** `frontend/app/(authenticated)/dashboard/AdminDashboard.tsx`

```typescript
export const AdminDashboard = () => {
  const { user } = useUser()
  const roleColor = ROLE_COLORS.ADMIN.primary

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            👋 Good morning, {user?.name}!
          </h1>
          <p className="text-sm text-gray-500">
            {user?.organization?.name} • {user?.organization?.plan} Plan
          </p>
        </div>

        {/* Upgrade CTA (if FREE) */}
        {user?.organization?.plan === 'FREE' && (
          <button className="px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-700 text-white rounded-lg font-medium hover:shadow-lg transition-all">
            🚀 Upgrade to PRO
          </button>
        )}
      </div>

      {/* Stat Cards */}
      <StatCards stats={{
        activeJobs: 8,
        totalCandidates: 47,
        thisMonthAnalyses: 12,
        usagePercent: 120 // Over limit!
      }} />

      {/* Candidate Pipeline */}
      <div className="bg-white rounded-xl shadow-sm border-2 p-6" style={{ borderColor: roleColor }}>
        <h2 className="text-lg font-semibold text-gray-900 mb-6">
          Candidate Pipeline
        </h2>
        <div className="flex items-center justify-between">
          {[
            { label: 'New', count: 12, color: '#6B7280' },
            { label: 'Screening', count: 8, color: '#3B82F6' },
            { label: 'Interview', count: 5, color: '#F59E0B' },
            { label: 'Offer', count: 2, color: '#10B981' },
            { label: 'Hired', count: 1, color: '#A855F7' }
          ].map((stage, index) => (
            <div key={stage.label} className="flex flex-col items-center">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-bold mb-2"
                style={{ backgroundColor: stage.color }}
              >
                {stage.count}
              </div>
              <span className="text-sm font-medium text-gray-700">
                {stage.label}
              </span>
              {index < 4 && (
                <span className="text-2xl text-gray-400 mx-4">→</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Two Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Activity */}
        <div className="bg-white rounded-xl shadow-sm border-2 p-6" style={{ borderColor: roleColor }}>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Today's Activity
          </h2>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
              <span className="text-2xl">🆕</span>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  John Doe applied for Frontend Developer
                </p>
                <p className="text-xs text-gray-500">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
              <span className="text-2xl">📅</span>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  Interview scheduled: Jane Smith
                </p>
                <p className="text-xs text-gray-500">Today at 14:00</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
              <span className="text-2xl">💼</span>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  Offer sent to Mike Johnson
                </p>
                <p className="text-xs text-gray-500">Waiting response</p>
              </div>
            </div>
          </div>
          <button className="w-full mt-4 text-sm text-purple-600 font-medium hover:text-purple-700">
            View All Activity →
          </button>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border-2 p-6" style={{ borderColor: roleColor }}>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Quick Actions
          </h2>
          <div className="space-y-3">
            <button className="w-full flex items-center gap-3 p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg hover:shadow-md transition-all">
              <span className="text-2xl">📄</span>
              <span className="text-sm font-medium text-gray-900">
                Create Job Posting
              </span>
            </button>
            <button className="w-full flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg hover:shadow-md transition-all">
              <span className="text-2xl">📤</span>
              <span className="text-sm font-medium text-gray-900">
                Upload CV
              </span>
            </button>
            <button className="w-full flex items-center gap-3 p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg hover:shadow-md transition-all">
              <span className="text-2xl">📅</span>
              <span className="text-sm font-medium text-gray-900">
                Schedule Interview
              </span>
            </button>
            <button className="w-full flex items-center gap-3 p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg hover:shadow-md transition-all">
              <span className="text-2xl">👥</span>
              <span className="text-sm font-medium text-gray-900">
                Invite Team Member
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
```

---

### Task 3.3: HR_SPECIALIST Dashboard

**File:** `frontend/app/(authenticated)/dashboard/HRDashboard.tsx`

```typescript
export const HRDashboard = () => {
  const roleColor = ROLE_COLORS.HR_SPECIALIST.primary

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          👋 Welcome back, Elif!
        </h1>
        <p className="text-sm text-gray-500">
          HR Specialist • MediCare Analytics
        </p>
      </div>

      {/* Today's To-Do */}
      <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl border-2 border-green-500 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          📋 Today's To-Do
        </h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-900">
              ✅ Review 3 CVs
            </span>
            <button className="text-sm text-green-600 font-medium hover:text-green-700">
              Start Now →
            </button>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-900">
              📅 2 Interviews today
            </span>
            <button className="text-sm text-green-600 font-medium hover:text-green-700">
              View →
            </button>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-900">
              ⏳ 1 Analysis pending (30 min ago)
            </span>
            <button className="text-sm text-green-600 font-medium hover:text-green-700">
              Check →
            </button>
          </div>
        </div>
      </div>

      {/* Drag & Drop CV Upload */}
      <div className="bg-white rounded-xl shadow-sm border-4 border-dashed border-green-300 p-8 text-center hover:border-green-500 transition-all cursor-pointer">
        <div className="text-6xl mb-4">📤</div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Upload CV (Drag & Drop)
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          Drag your CV file here or click to browse
        </p>
        <button className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-700 text-white rounded-lg font-medium hover:shadow-lg transition-all">
          Browse Files
        </button>
        <p className="text-xs text-gray-400 mt-3">
          Supports: PDF, DOCX, TXT (max 10MB)
        </p>
      </div>

      {/* Two Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Candidate Pipeline */}
        <div className="bg-white rounded-xl shadow-sm border-2 border-green-500 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Candidate Pipeline
          </h2>
          <div className="space-y-4">
            {[
              { stage: 'New', count: 12, color: '#6B7280' },
              { stage: 'Screening', count: 8, color: '#3B82F6' },
              { stage: 'Interview', count: 5, color: '#F59E0B' },
              { stage: 'Offer', count: 2, color: '#10B981' },
              { stage: 'Hired', count: 1, color: '#A855F7' }
            ].map((item) => (
              <div key={item.stage} className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                  style={{ backgroundColor: item.color }}
                >
                  {item.count}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900">
                    {item.stage}
                  </div>
                  <div className="text-xs text-gray-500">
                    {item.count} candidates
                  </div>
                </div>
                <span className="text-2xl text-gray-300">↓</span>
              </div>
            ))}
          </div>
        </div>

        {/* This Week's Interviews */}
        <div className="bg-white rounded-xl shadow-sm border-2 border-green-500 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            📅 This Week's Interviews
          </h2>
          <div className="space-y-4">
            <div>
              <div className="text-xs text-gray-500 mb-2">Monday</div>
              <div className="p-3 bg-green-50 rounded-lg">
                <p className="text-sm font-medium text-gray-900">
                  John Doe
                </p>
                <p className="text-xs text-gray-500">
                  Frontend Developer • 14:00
                </p>
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-2">Wednesday</div>
              <div className="p-3 bg-green-50 rounded-lg">
                <p className="text-sm font-medium text-gray-900">
                  Jane Smith
                </p>
                <p className="text-xs text-gray-500">
                  Backend Developer • 10:00
                </p>
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-2">Friday</div>
              <div className="p-3 bg-green-50 rounded-lg">
                <p className="text-sm font-medium text-gray-900">
                  Mike Johnson
                </p>
                <p className="text-xs text-gray-500">
                  QA Engineer • 11:00
                </p>
              </div>
            </div>
          </div>
          <button className="w-full mt-4 text-sm text-green-600 font-medium hover:text-green-700">
            View Calendar →
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm border-2 border-green-500 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Recent Activity
        </h2>
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
            <span className="text-2xl">🆕</span>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">
                AHMET YILMAZ - 95% match
              </p>
              <p className="text-xs text-gray-500">2 hours ago</p>
            </div>
            <button className="text-sm text-green-600 font-medium hover:text-green-700">
              View →
            </button>
          </div>
          <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
            <span className="text-2xl">📊</span>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">
                Analysis completed: 5 CVs
              </p>
              <p className="text-xs text-gray-500">5 hours ago</p>
            </div>
            <button className="text-sm text-blue-600 font-medium hover:text-blue-700">
              Review →
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
```

---

### Task 3.4: USER Dashboard (Minimal)

**File:** `frontend/app/(authenticated)/dashboard/UserDashboard.tsx`

```typescript
export const UserDashboard = () => {
  const { user } = useUser()

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Greeting */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          👋 Hi {user?.name}!
        </h1>
        <p className="text-gray-500">
          Welcome to your dashboard
        </p>
      </div>

      {/* Your Profile */}
      <div className="bg-white rounded-xl shadow-sm border-2 border-gray-300 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Your Profile
        </h2>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📧</span>
            <span className="text-sm text-gray-700">{user?.email}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-2xl">🏢</span>
            <span className="text-sm text-gray-700">
              {user?.organization?.name}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-2xl">👤</span>
            <span className="text-sm text-gray-700">
              {user?.role?.replace('_', ' ')}
            </span>
          </div>
        </div>
        <button className="w-full mt-6 px-4 py-2 bg-gray-100 text-gray-900 rounded-lg font-medium hover:bg-gray-200 transition-all">
          Edit Profile →
        </button>
      </div>

      {/* Company Snapshot */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border-2 border-gray-300 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Company Snapshot
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900 mb-1">8</div>
            <div className="text-sm text-gray-600">Active Job Postings</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900 mb-1">4</div>
            <div className="text-sm text-gray-600">Team Members</div>
          </div>
        </div>
      </div>

      {/* Need More Access? */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border-2 border-blue-300 p-6 text-center">
        <div className="text-4xl mb-3">💡</div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Need More Access?
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Want to access HR features? Contact your admin to upgrade your role.
        </p>
        <button className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all">
          Request Access
        </button>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm border-2 border-gray-300 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Recent Activity
        </h2>
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <span>✏️</span>
            <span>Profile updated</span>
            <span className="ml-auto text-xs">2 days ago</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <span>🔒</span>
            <span>Password changed</span>
            <span className="ml-auto text-xs">1 week ago</span>
          </div>
        </div>
      </div>
    </div>
  )
}
```

**Git Commit:**
```bash
git add frontend/app/\(authenticated\)/dashboard/*Dashboard.tsx
git commit -m "feat(dashboard): Add 5 role-specific dashboard layouts

SUPER_ADMIN Dashboard:
- Organization switcher (cross-org)
- System health panel
- Organizations by plan (bar charts)
- Recent system events

ADMIN Dashboard:
- Greeting with upgrade CTA
- Stat cards (4 metrics)
- Candidate pipeline (funnel visual)
- Today's activity feed
- Quick actions (4 buttons)

HR_SPECIALIST Dashboard:
- Today's to-do (actionable tasks)
- Drag & drop CV upload (prominent)
- Candidate pipeline (funnel)
- This week's interviews calendar
- Recent activity with match %

USER Dashboard:
- Minimal design (3 cards only)
- Profile summary
- Company snapshot (read-only stats)
- Request access CTA (helpful)
- Recent activity log

All dashboards:
- Role-based coloring
- Interactive cards (hover effects)
- Emoji icons (visual)
- Responsive grid layouts"
```

---

## 🎯 Phase 4: Quick Actions & Floating Button (30 min)

### Task 4.1: Create Floating Action Button

**File:** `frontend/components/ui/FloatingActionButton.tsx`

```typescript
import { useState } from 'react'
import { useUser } from '@/lib/hooks/useUser'
import {
  canCreateJobPosting,
  canCreateCandidate,
  canScheduleInterview,
  canCreateOffer
} from '@/lib/utils/rbac'
import { ROLE_COLORS } from '@/lib/constants/roleColors'

export const FloatingActionButton = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { user } = useUser()
  const roleColor = ROLE_COLORS[user?.role]?.primary || '#3B82F6'

  const actions = [
    {
      label: 'Create Job Posting',
      icon: '📄',
      href: '/job-postings/new',
      show: canCreateJobPosting(user?.role)
    },
    {
      label: 'Upload CV',
      icon: '📤',
      href: '/analyses/upload',
      show: canCreateCandidate(user?.role)
    },
    {
      label: 'Add Candidate',
      icon: '👥',
      href: '/candidates/new',
      show: canCreateCandidate(user?.role)
    },
    {
      label: 'Schedule Interview',
      icon: '📅',
      href: '/interviews/new',
      show: canScheduleInterview(user?.role)
    },
    {
      label: 'Create Offer',
      icon: '💼',
      href: '/offers/new',
      show: canCreateOffer(user?.role)
    }
  ]

  const visibleActions = actions.filter(a => a.show)

  if (visibleActions.length === 0) {
    return null // USER role - no actions
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Action Menu */}
      {isOpen && (
        <div className="absolute bottom-20 right-0 bg-white rounded-xl shadow-2xl border-2 p-2 min-w-[200px] animate-fade-in">
          {visibleActions.map((action) => (
            <a
              key={action.href}
              href={action.href}
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50 transition-all"
              onClick={() => setIsOpen(false)}
            >
              <span className="text-2xl">{action.icon}</span>
              <span className="text-sm font-medium text-gray-900">
                {action.label}
              </span>
            </a>
          ))}
        </div>
      )}

      {/* Main FAB Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 rounded-full text-white text-3xl shadow-2xl hover:scale-110 active:scale-95 transition-all"
        style={{
          background: `linear-gradient(135deg, ${roleColor}, ${roleColor}dd)`
        }}
      >
        {isOpen ? '✕' : '+'}
      </button>
    </div>
  )
}
```

**Add to Layout:**

```typescript
// frontend/components/AppLayout.tsx
import { FloatingActionButton } from '@/components/ui/FloatingActionButton'

// Inside layout return:
<main>
  {children}
  <FloatingActionButton />
</main>
```

**Git Commit:**
```bash
git add frontend/components/ui/FloatingActionButton.tsx frontend/components/AppLayout.tsx
git commit -m "feat(ux): Add floating action button (FAB) for quick actions

Features:
- Role-based actions (only show permitted)
- Animated menu (fade in/out)
- Role-colored gradient
- Hover scale animation
- Click to expand/collapse

Actions by role:
- USER: No FAB (no permissions)
- HR: Upload CV, Add Candidate, Schedule
- MANAGER: + Create Job, Create Offer
- ADMIN: All actions

Position: Fixed bottom-right
Mobile: Accessible with thumb"
```

---

## ✅ Verification Checklist

### Phase 1: Role Badge & Header
- [ ] `roleColors.ts` created with 5 role colors
- [ ] `RoleBadge.tsx` component created
- [ ] Header shows role badge with color
- [ ] Hover animation works (scale)
- [ ] User info shows org name

### Phase 2: Dashboard Cards
- [ ] `DashboardCard.tsx` component created
- [ ] Hover animation (lift + shadow)
- [ ] Color-coded borders
- [ ] Loading skeleton
- [ ] Trend indicators (↑/↓)
- [ ] `StatCards.tsx` created with 4 metrics

### Phase 3: Role-Specific Dashboards
- [ ] SUPER_ADMIN dashboard with org switcher
- [ ] System health panel (4 metrics)
- [ ] ADMIN dashboard with pipeline visual
- [ ] Usage alert if over limit
- [ ] HR dashboard with drag & drop upload
- [ ] USER dashboard (minimal, 3 cards)
- [ ] All dashboards color-coded

### Phase 4: Floating Action Button
- [ ] FAB component created
- [ ] Role-based action filtering
- [ ] Animated menu (fade in/out)
- [ ] Hover/active animations
- [ ] USER role: No FAB (returns null)

---

## 📊 Success Criteria

### Critical (Must Pass)
- ✅ **5 distinct dashboards** (one per role)
- ✅ **Role color coding** throughout UI
- ✅ **Hover animations** on cards and buttons
- ✅ **SUPER_ADMIN org switcher** functional
- ✅ **USER minimal dashboard** friendly
- ✅ **HR drag & drop** upload area prominent
- ✅ **FAB** shows role-specific actions

### Visual Quality
- ✅ Cards have **shadow on hover**
- ✅ Colors are **vibrant but professional**
- ✅ Typography is **clear and hierarchical**
- ✅ Spacing is **consistent** (Tailwind scale)
- ✅ Icons are **large and recognizable**

### User Experience
- ✅ **One-click access** to common actions
- ✅ **Empty states** are helpful (USER dashboard)
- ✅ **Loading states** with skeleton
- ✅ **Trend indicators** show progress
- ✅ **Mobile responsive** (tested)

---

## 📝 Deliverables

### Required Files
1. ✅ `frontend/lib/constants/roleColors.ts` - Color system
2. ✅ `frontend/components/ui/RoleBadge.tsx` - Badge component
3. ✅ `frontend/components/dashboard/DashboardCard.tsx` - Card component
4. ✅ `frontend/components/dashboard/StatCards.tsx` - Stats component
5. ✅ `frontend/app/(authenticated)/dashboard/*Dashboard.tsx` - 5 dashboards
6. ✅ `frontend/components/ui/FloatingActionButton.tsx` - FAB

### Required Report
**Filename:** `docs/reports/worker3-role-based-ux-report.md`

**Sections:**
1. Executive Summary (visual improvements)
2. Color System (role colors + usage)
3. Dashboard Layouts (5 roles, screenshots)
4. Interactive Elements (animations, hover states)
5. Mobile Responsiveness (test results)
6. User Testing (manual test for each role)
7. Performance (load times, animation smoothness)

### Git Commits Expected
1. ✅ Role colors + badge component
2. ✅ Dashboard card system
3. ✅ 5 role-specific dashboards
4. ✅ Floating action button

**Total: 4 commits**

---

## ⏱️ Estimated Time

**Total: 2-3 hours**

- Phase 1 (Role Badge): 30 min
- Phase 2 (Card System): 45 min
- Phase 3 (5 Dashboards): 60 min
- Phase 4 (FAB): 30 min
- Testing & Polish: 20 min
- Report Writing: 20-30 min

---

## 🧪 Manual Testing Steps

### Test 1: Login as USER
```
Email: test-user@test-org-1.com
Password: TestPass123!
```

**Expected:**
- ✅ Header: ⚪ USER badge (gray)
- ✅ Dashboard: Minimal (3 cards)
- ✅ Sidebar: Dashboard + Settings (2 items)
- ✅ No FAB button
- ✅ "Request access" CTA visible

---

### Test 2: Login as HR_SPECIALIST
```
Email: test-hr_specialist@test-org-1.com
Password: TestPass123!
```

**Expected:**
- ✅ Header: 🟢 HR_SPECIALIST badge (green)
- ✅ Dashboard: To-do + drag & drop upload prominent
- ✅ FAB: Upload CV, Add Candidate, Schedule
- ✅ Candidate pipeline funnel
- ✅ This week's interviews calendar

---

### Test 3: Login as MANAGER
```
Email: test-manager@test-org-1.com
Password: TestPass123!
```

**Expected:**
- ✅ Header: 🔵 MANAGER badge (blue)
- ✅ Dashboard: Team performance chart
- ✅ "My job postings" filter default
- ✅ FAB: All actions except Invite User

---

### Test 4: Login as ADMIN
```
Email: test-admin@test-org-1.com
Password: TestPass123!
```

**Expected:**
- ✅ Header: 🟣 ADMIN badge (purple)
- ✅ Dashboard: Usage alert if >80%
- ✅ "Upgrade to PRO" button (if FREE)
- ✅ Candidate pipeline visual
- ✅ FAB: All actions

---

### Test 5: Login as SUPER_ADMIN
```
Email: info@gaiai.ai
Password: 23235656
```

**Expected:**
- ✅ Header: 🔴 SUPER_ADMIN badge (red)
- ✅ Dashboard: Org switcher prominent
- ✅ System health panel (4 metrics)
- ✅ Organizations by plan (bar charts)
- ✅ Recent system events

---

## 🎯 AsanMod Rules

**STRICT_MODE Enabled:**
- ❌ NO placeholder colors - Use exact hex codes
- ❌ NO static mockups - Implement REAL interactive components
- ✅ REAL animations - Tailwind transitions
- ✅ REAL testing - Login as each role manually

**After Each Phase:**
- ✅ Git commit immediately
- ✅ Test in browser (visual check)
- ✅ Screenshot for report

**After Task:**
- ✅ Test all 5 roles manually
- ✅ Record GIF of animations (optional)
- ✅ Write comprehensive report
- ✅ Report to Mod with summary

---

## 📚 Reference Documents

- **RBAC Strategy:** [`docs/architecture/RBAC-COMPLETE-STRATEGY.md`](../architecture/RBAC-COMPLETE-STRATEGY.md)
- **Test Accounts:** [`docs/test-tasks/COMPLETE-TEST-DATA-REFERENCE.md`](COMPLETE-TEST-DATA-REFERENCE.md)
- **Tailwind Docs:** https://tailwindcss.com/docs

---

## 🎨 Design Inspiration

**Colors:** Vibrant but professional (80% saturation)
**Shadows:** Subtle on default, strong on hover
**Animations:** 0.3s ease (smooth but snappy)
**Typography:** Inter or System UI (clean sans-serif)
**Spacing:** Tailwind scale (consistent gaps)

**Visual Reference:**
- Linear.app (clean, modern)
- Vercel Dashboard (minimalist)
- Notion (card-based)

---

**🚀 START: Phase 1, Task 1.1 (Create Role Colors File)**

**IMPORTANT:** Make it beautiful AND easy to use! Test every role manually!
