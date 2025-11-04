# 📋 Worker 2 Task: HR_SPECIALIST Dashboard Design & Implementation

**Task ID:** W2-HR-SPECIALIST-DASHBOARD
**Assigned to:** Worker Claude 2
**Created by:** Mod Claude
**Date:** 2025-11-04
**Estimated Duration:** 5-6 hours
**Priority:** HIGH
**Complexity:** HIGH
**Role:** HR_SPECIALIST (HR staff - recruitment focus)

---

## 🎯 Task Overview

**Mission:** Design and implement a beautiful, recruitment-focused dashboard for HR_SPECIALIST role with emphasis on hiring pipeline and CV management.

**Design Philosophy:**
- **Recruitment Focus:** CV analysis, job postings, candidate pipeline
- **Action-Oriented:** Quick upload, fast analysis, easy navigation
- **Growth Mindset:** Green colors symbolizing growth and hiring
- **Data-Driven:** Charts, metrics, conversion rates

**Expected Outcome:**
- ✅ Beautiful HR_SPECIALIST dashboard with 8 widgets
- ✅ Emerald/Green color scheme (growth, recruitment)
- ✅ Responsive grid layout
- ✅ Real-time hiring metrics
- ✅ Quick CV upload widget
- ✅ Hiring pipeline visualization

---

## 🎨 Design Specifications

### Color Palette (Emerald/Green Theme)

```typescript
const HR_SPECIALIST_THEME = {
  primary: {
    50: '#ecfdf5',   // Lightest
    100: '#d1fae5',
    200: '#a7f3d0',
    300: '#6ee7b7',
    400: '#34d399',
    500: '#10b981',  // Main (Emerald)
    600: '#059669',
    700: '#047857',
    800: '#065f46',
    900: '#064e3b',  // Darkest
  },
  accent: {
    blue: '#3b82f6',    // Info
    yellow: '#f59e0b',  // Warning
    red: '#ef4444',     // Error
    purple: '#8b5cf6',  // Analysis
  },
  gradient: {
    header: 'from-emerald-600 to-emerald-800',
    card: 'from-emerald-50 to-white',
    hover: 'from-emerald-100 to-emerald-50',
    pipeline: 'from-emerald-400 to-green-600',
  }
};
```

---

## 📐 Dashboard Layout

```
┌──────────────────────────────────────────────────────────────┐
│  💼 HR Dashboard - [User Name]              🔔 [Bell] [+CV]  │
│  [Today's Date] • [Active Postings: X] • [CVs Today: Y]      │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │  📋 Active   │  │  📊 CV       │  │  🎯 Recent   │       │
│  │  Job         │  │  Analytics   │  │  Analyses    │       │
│  │  Postings    │  │              │  │              │       │
│  │  [Count: X]  │  │  [This Week] │  │  [Last 5]    │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
│                                                               │
│  ┌────────────────────────────────────┐  ┌──────────────┐   │
│  │  📈 Hiring Pipeline (Funnel)        │  │  ⚡ Quick    │   │
│  │                                     │  │  Actions     │   │
│  │  [Pipeline visualization chart]     │  │              │   │
│  │                                     │  │  → Upload CV │   │
│  │  Applied → Screened → Interview →   │  │  → New Job   │   │
│  │  Offer → Hired                      │  │  → Analyze   │   │
│  └────────────────────────────────────┘  └──────────────┘   │
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │  📅 Pending  │  │  📈 Monthly  │  │  🎓 Top      │       │
│  │  Interviews  │  │  Stats       │  │  Candidates  │       │
│  │              │  │              │  │              │       │
│  │  [List: 5]   │  │  [Metrics]   │  │  [Top 3]     │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
└──────────────────────────────────────────────────────────────┘
```

---

## 🧩 Widget Specifications

### Widget 1: Welcome Header (HR Focus)
**Location:** Top (full width)
**Purpose:** HR-specific metrics overview

**Design:**
```tsx
<div className="bg-gradient-to-r from-emerald-600 to-emerald-800 rounded-xl p-6 mb-6 text-white">
  <div className="flex justify-between items-start">
    <div>
      <h1 className="text-3xl font-bold mb-2">
        💼 HR Dashboard
      </h1>
      <p className="text-emerald-100 text-lg mb-3">
        Hoş geldin, {user.firstName}! İşe alım süreçlerini yönet.
      </p>
      <div className="flex gap-6 text-sm">
        <div className="flex items-center gap-2">
          <Briefcase className="w-4 h-4" />
          <span>{activePostings} Aktif İlan</span>
        </div>
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4" />
          <span>{todayCVs} CV Bugün</span>
        </div>
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4" />
          <span>{thisWeekAnalyses} Analiz Bu Hafta</span>
        </div>
      </div>
    </div>
    <div className="flex items-center gap-3">
      <NotificationBell />
      <button className="bg-white text-emerald-600 px-4 py-2 rounded-lg font-medium hover:bg-emerald-50 transition-colors flex items-center gap-2">
        <Plus className="w-4 h-4" />
        Hızlı CV Yükle
      </button>
    </div>
  </div>
</div>
```

---

### Widget 2: Active Job Postings
**Location:** Top left
**Purpose:** Show active job postings count with quick access

**Metrics:**
- Total active postings
- Applications received today
- Average applicants per posting

**Design:**
```tsx
<Card className="bg-white shadow-sm hover:shadow-md transition-all group cursor-pointer">
  <CardBody className="relative overflow-hidden">
    {/* Background decoration */}
    <div className="absolute -right-8 -top-8 w-32 h-32 bg-emerald-100 rounded-full opacity-20 group-hover:scale-110 transition-transform" />

    <div className="relative">
      <div className="flex items-center justify-between mb-4">
        <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
          <Briefcase className="w-6 h-6 text-emerald-600" />
        </div>
        <span className="text-xs text-emerald-600 font-medium">Aktif</span>
      </div>

      <h3 className="text-3xl font-bold text-slate-800 mb-1">
        {activePostings}
      </h3>
      <p className="text-sm text-slate-600 mb-3">
        Aktif İş İlanı
      </p>

      <div className="flex items-center gap-2 text-xs text-slate-500">
        <ArrowUp className="w-3 h-3 text-green-500" />
        <span>{todayApplications} başvuru bugün</span>
      </div>

      <Link
        href="/job-postings"
        className="mt-4 text-sm text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1"
      >
        Tümünü Gör
        <ChevronRight className="w-4 h-4" />
      </Link>
    </div>
  </CardBody>
</Card>
```

---

### Widget 3: CV Analytics (This Week)
**Location:** Top center
**Purpose:** Show CV upload and analysis metrics

**Metrics:**
- CVs uploaded this week
- CVs analyzed this week
- Average match score
- Pending CVs

**Design:**
```tsx
<Card className="bg-gradient-to-br from-purple-50 to-white shadow-sm hover:shadow-md transition-shadow">
  <CardBody>
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
        <BarChart2 className="w-5 h-5 text-purple-600" />
        CV Analitik
      </h3>
      <span className="text-xs text-slate-500">Bu Hafta</span>
    </div>

    <div className="grid grid-cols-2 gap-4">
      <div>
        <p className="text-2xl font-bold text-slate-800">{weekCVs}</p>
        <p className="text-xs text-slate-600">CV Yüklendi</p>
      </div>
      <div>
        <p className="text-2xl font-bold text-purple-600">{weekAnalyses}</p>
        <p className="text-xs text-slate-600">Analiz Yapıldı</p>
      </div>
      <div>
        <p className="text-2xl font-bold text-green-600">{avgScore}%</p>
        <p className="text-xs text-slate-600">Ort. Eşleşme</p>
      </div>
      <div>
        <p className="text-2xl font-bold text-yellow-600">{pendingCVs}</p>
        <p className="text-xs text-slate-600">Bekleyen</p>
      </div>
    </div>

    <button className="w-full mt-4 bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg text-sm font-medium transition-colors">
      Detaylı Rapor
    </button>
  </CardBody>
</Card>
```

---

### Widget 4: Recent Analyses
**Location:** Top right
**Purpose:** Show last 5 analyses with quick access

**Content:**
- Analysis date
- Job posting title
- Candidate count
- Top match score
- Quick view link

**Design:**
```tsx
<Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
  <CardHeader>
    <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
      <Zap className="w-5 h-5 text-emerald-600" />
      Son Analizler
    </h3>
  </CardHeader>
  <CardBody>
    <div className="space-y-3">
      {recentAnalyses.slice(0, 5).map(analysis => (
        <Link
          key={analysis.id}
          href={`/analyses/${analysis.id}`}
          className="block p-3 rounded-lg hover:bg-emerald-50 transition-colors group"
        >
          <div className="flex items-start justify-between mb-2">
            <h4 className="text-sm font-medium text-slate-800 line-clamp-1 group-hover:text-emerald-600">
              {analysis.jobPosting.title}
            </h4>
            <span className="text-xs text-slate-500 whitespace-nowrap ml-2">
              {formatDate(analysis.createdAt)}
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs text-slate-600">
            <span className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              {analysis.candidateCount} aday
            </span>
            <span className="flex items-center gap-1">
              <Trophy className="w-3 h-3 text-yellow-500" />
              En iyi: {analysis.topScore}%
            </span>
          </div>
        </Link>
      ))}
    </div>
    <Link
      href="/analyses"
      className="block text-center mt-4 text-sm text-emerald-600 hover:text-emerald-700 font-medium"
    >
      Tümünü Gör →
    </Link>
  </CardBody>
</Card>
```

---

### Widget 5: Hiring Pipeline (Funnel Chart)
**Location:** Middle left (larger, 2 columns wide)
**Purpose:** Visualize hiring funnel with conversion rates

**Data:**
- Applications
- Screened
- Interviewed
- Offered
- Hired

**Design:**
```tsx
<Card className="bg-white shadow-sm">
  <CardHeader>
    <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
      <TrendingUp className="w-5 h-5 text-emerald-600" />
      İşe Alım Hunisi (Bu Ay)
    </h3>
  </CardHeader>
  <CardBody>
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={pipelineData}
        layout="vertical"
        margin={{ left: 80, right: 20 }}
      >
        <defs>
          <linearGradient id="pipelineGradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
        <XAxis type="number" />
        <YAxis
          type="category"
          dataKey="stage"
          tick={{ fontSize: 12 }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: '#fff',
            border: '1px solid #d1fae5',
            borderRadius: '8px'
          }}
          formatter={(value, name, props) => [
            `${value} aday (${props.payload.percentage}%)`,
            props.payload.stage
          ]}
        />
        <Bar
          dataKey="count"
          fill="url(#pipelineGradient)"
          radius={[0, 8, 8, 0]}
        >
          <LabelList
            dataKey="count"
            position="right"
            formatter={(value) => `${value}`}
            style={{ fontSize: 12, fontWeight: 600 }}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>

    {/* Conversion rates */}
    <div className="mt-4 grid grid-cols-4 gap-2">
      {conversionRates.map((rate, idx) => (
        <div key={idx} className="text-center p-2 bg-emerald-50 rounded-lg">
          <p className="text-xs text-slate-600">{rate.label}</p>
          <p className="text-sm font-bold text-emerald-600">{rate.value}%</p>
        </div>
      ))}
    </div>
  </CardBody>
</Card>
```

---

### Widget 6: Quick Actions
**Location:** Middle right
**Purpose:** Fast access to common HR actions

**Actions:**
- Upload CV (modal)
- New Analysis
- Create Job Posting
- View Candidates
- Schedule Interview

**Design:**
```tsx
<Card className="bg-white shadow-sm">
  <CardHeader>
    <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
      <Zap className="w-5 h-5 text-yellow-600" />
      Hızlı İşlemler
    </h3>
  </CardHeader>
  <CardBody>
    <div className="space-y-2">
      {[
        {
          icon: <Upload className="w-5 h-5 text-emerald-600" />,
          title: 'CV Yükle',
          description: 'Toplu CV yükleme',
          action: 'upload',
          color: 'emerald'
        },
        {
          icon: <Wand2 className="w-5 h-5 text-purple-600" />,
          title: 'Yeni Analiz',
          description: 'CV analizi başlat',
          action: 'analyze',
          color: 'purple'
        },
        {
          icon: <Plus className="w-5 h-5 text-blue-600" />,
          title: 'İş İlanı Oluştur',
          description: 'Yeni ilan yayınla',
          action: 'create-job',
          color: 'blue'
        },
        {
          icon: <Users className="w-5 h-5 text-slate-600" />,
          title: 'Adayları Gör',
          description: 'Aday havuzu',
          action: 'view-candidates',
          color: 'slate'
        },
        {
          icon: <Calendar className="w-5 h-5 text-orange-600" />,
          title: 'Mülakat Planla',
          description: 'Takvime ekle',
          action: 'schedule',
          color: 'orange'
        }
      ].map(action => (
        <button
          key={action.action}
          onClick={() => handleQuickAction(action.action)}
          className={`w-full flex items-center gap-3 p-3 rounded-lg hover:bg-${action.color}-50 transition-colors group`}
        >
          <div className={`flex-shrink-0 w-10 h-10 bg-${action.color}-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
            {action.icon}
          </div>
          <div className="flex-1 text-left">
            <p className="text-sm font-medium text-slate-800">{action.title}</p>
            <p className="text-xs text-slate-500">{action.description}</p>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />
        </button>
      ))}
    </div>
  </CardBody>
</Card>
```

---

### Widget 7: Pending Interviews
**Location:** Bottom left
**Purpose:** Show upcoming interviews that need scheduling

**Content:**
- Interview date/time
- Candidate name
- Job posting
- Interview type (phone, video, in-person)
- Quick reschedule button

**Design:**
```tsx
<Card className="bg-white shadow-sm">
  <CardHeader>
    <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
      <Calendar className="w-5 h-5 text-orange-600" />
      Bekleyen Mülakatlar
    </h3>
  </CardHeader>
  <CardBody>
    {pendingInterviews.length === 0 ? (
      <div className="text-center py-8">
        <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <p className="text-sm text-slate-500">Bekleyen mülakat yok</p>
      </div>
    ) : (
      <div className="space-y-3">
        {pendingInterviews.slice(0, 5).map(interview => (
          <div
            key={interview.id}
            className="p-3 border border-slate-200 rounded-lg hover:border-emerald-300 transition-colors"
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="text-sm font-medium text-slate-800">
                  {interview.candidate.name}
                </p>
                <p className="text-xs text-slate-500">
                  {interview.jobPosting.title}
                </p>
              </div>
              <span className={`text-xs px-2 py-1 rounded ${
                interview.type === 'IN_PERSON' ? 'bg-blue-100 text-blue-700' :
                interview.type === 'VIDEO' ? 'bg-purple-100 text-purple-700' :
                'bg-green-100 text-green-700'
              }`}>
                {interview.type === 'IN_PERSON' ? 'Yüz Yüze' :
                 interview.type === 'VIDEO' ? 'Video' : 'Telefon'}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {formatDateTime(interview.scheduledAt)}
              </span>
              <button className="text-emerald-600 hover:text-emerald-700 font-medium">
                Yeniden Planla
              </button>
            </div>
          </div>
        ))}
      </div>
    )}
    <Link
      href="/interviews"
      className="block text-center mt-4 text-sm text-emerald-600 hover:text-emerald-700 font-medium"
    >
      Tüm Mülakatlar →
    </Link>
  </CardBody>
</Card>
```

---

### Widget 8: Monthly Stats
**Location:** Bottom center
**Purpose:** Show key monthly metrics

**Metrics:**
- Total applications
- CVs analyzed
- Interviews conducted
- Offers sent
- Hires made

**Design:**
```tsx
<Card className="bg-gradient-to-br from-emerald-50 to-white shadow-sm">
  <CardHeader>
    <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
      <BarChart3 className="w-5 h-5 text-emerald-600" />
      Aylık İstatistikler
    </h3>
  </CardHeader>
  <CardBody>
    <div className="grid grid-cols-2 gap-4">
      {[
        {
          label: 'Başvurular',
          value: monthStats.applications,
          icon: <FileText className="w-4 h-4" />,
          color: 'blue',
          change: monthStats.applicationsChange
        },
        {
          label: 'Analizler',
          value: monthStats.analyses,
          icon: <Wand2 className="w-4 h-4" />,
          color: 'purple',
          change: monthStats.analysesChange
        },
        {
          label: 'Mülakatlar',
          value: monthStats.interviews,
          icon: <Calendar className="w-4 h-4" />,
          color: 'orange',
          change: monthStats.interviewsChange
        },
        {
          label: 'Teklifler',
          value: monthStats.offers,
          icon: <Mail className="w-4 h-4" />,
          color: 'indigo',
          change: monthStats.offersChange
        },
        {
          label: 'İşe Alımlar',
          value: monthStats.hires,
          icon: <UserCheck className="w-4 h-4" />,
          color: 'green',
          change: monthStats.hiresChange
        },
        {
          label: 'Dönüşüm',
          value: `${monthStats.conversionRate}%`,
          icon: <TrendingUp className="w-4 h-4" />,
          color: 'emerald',
          change: monthStats.conversionChange
        }
      ].map(stat => (
        <div key={stat.label} className="text-center p-3 bg-white rounded-lg border border-slate-100">
          <div className={`inline-flex items-center justify-center w-8 h-8 bg-${stat.color}-100 rounded-lg mb-2`}>
            <div className={`text-${stat.color}-600`}>
              {stat.icon}
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
          <p className="text-xs text-slate-600 mb-1">{stat.label}</p>
          {stat.change !== undefined && (
            <div className={`flex items-center justify-center gap-1 text-xs ${
              stat.change >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {stat.change >= 0 ? (
                <ArrowUp className="w-3 h-3" />
              ) : (
                <ArrowDown className="w-3 h-3" />
              )}
              <span>{Math.abs(stat.change)}%</span>
            </div>
          )}
        </div>
      ))}
    </div>
  </CardBody>
</Card>
```

---

## 🛠️ Implementation Tasks

### Task 1: Create Dashboard Component
**File:** `frontend/app/(authenticated)/dashboard/hr-specialist-dashboard.tsx`

```typescript
'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/lib/store/authStore';
// ... imports

export default function HRSpecialistDashboard() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHRDashboard();
  }, []);

  const loadHRDashboard = async () => {
    try {
      const response = await fetch('/api/v1/dashboard/hr-specialist');
      const data = await response.json();
      setStats(data.data);
    } catch (error) {
      console.error('[HR DASHBOARD] Load error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <DashboardSkeleton />;

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <HRWelcomeHeader user={user} stats={stats.overview} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <ActiveJobPostingsWidget data={stats.jobPostings} />
        <CVAnalyticsWidget data={stats.cvAnalytics} />
        <RecentAnalysesWidget data={stats.recentAnalyses} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <HiringPipelineWidget data={stats.pipeline} />
        </div>
        <QuickActionsWidget />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <PendingInterviewsWidget data={stats.interviews} />
        <MonthlyStatsWidget data={stats.monthlyStats} />
        <TopCandidatesWidget data={stats.topCandidates} />
      </div>
    </div>
  );
}
```

**Commit after Task 1:**
```bash
git add frontend/app/(authenticated)/dashboard/hr-specialist-dashboard.tsx
git commit -m "feat(dashboard): Add HR_SPECIALIST dashboard component"
```

---

### Task 2: Create Widget Components
**Directory:** `frontend/components/dashboard/hr-specialist/`

Create 8 widget files:
1. `HRWelcomeHeader.tsx`
2. `ActiveJobPostingsWidget.tsx`
3. `CVAnalyticsWidget.tsx`
4. `RecentAnalysesWidget.tsx`
5. `HiringPipelineWidget.tsx`
6. `QuickActionsWidget.tsx`
7. `PendingInterviewsWidget.tsx`
8. `MonthlyStatsWidget.tsx`

**Commit after Task 2:**
```bash
git add frontend/components/dashboard/hr-specialist/
git commit -m "feat(dashboard): Add HR_SPECIALIST widget components (8 widgets)"
```

---

### Task 3: Create Backend API
**File:** `backend/src/routes/dashboardRoutes.js`

```javascript
// GET /api/v1/dashboard/hr-specialist
router.get('/hr-specialist', [
  authenticateToken,
  enforceOrganizationIsolation,
  authorize(ROLE_GROUPS.HR_MANAGERS)
], async (req, res) => {
  try {
    const organizationId = req.organizationId;

    // Active job postings
    const activePostings = await prisma.jobPosting.count({
      where: {
        organizationId,
        status: 'ACTIVE'
      }
    });

    // Today's applications
    const todayApplications = await prisma.candidate.count({
      where: {
        organizationId,
        createdAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0))
        }
      }
    });

    // This week CVs and analyses
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - 7);

    const weekCVs = await prisma.candidate.count({
      where: {
        organizationId,
        createdAt: { gte: weekStart }
      }
    });

    const weekAnalyses = await prisma.analysis.count({
      where: {
        organizationId,
        createdAt: { gte: weekStart }
      }
    });

    // Recent analyses
    const recentAnalyses = await prisma.analysis.findMany({
      where: { organizationId },
      include: {
        jobPosting: {
          select: { title: true }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 5
    });

    // Hiring pipeline
    const pipeline = await calculateHiringPipeline(organizationId);

    // Monthly stats
    const monthlyStats = await calculateMonthlyStats(organizationId);

    res.json({
      success: true,
      data: {
        overview: {
          activePostings,
          todayApplications,
          weekCVs,
          weekAnalyses
        },
        jobPostings: { activePostings, todayApplications },
        cvAnalytics: { weekCVs, weekAnalyses },
        recentAnalyses,
        pipeline,
        monthlyStats
      }
    });
  } catch (error) {
    console.error('[DASHBOARD] HR error:', error);
    res.status(500).json({
      success: false,
      message: 'Dashboard verileri alınırken hata'
    });
  }
});
```

**Commit after Task 3:**
```bash
git add backend/src/routes/dashboardRoutes.js
git commit -m "feat(api): Add HR_SPECIALIST dashboard endpoint"
```

---

### Task 4-7: Same as W1
(Dashboard routing, Recharts install, Layout, Skeleton)

**Commits:**
- Task 4: Dashboard routing update
- Task 5: Install recharts (already done in W1)
- Task 6: Layout wrapper (already done in W1)
- Task 7: HR-specific loading skeleton

---

## 🧪 Testing & Verification

### Test 1: Visual Check
- All 8 widgets visible
- Emerald color scheme applied
- Responsive layout working

### Test 2: API Data
```bash
curl -X GET http://localhost:8102/api/v1/dashboard/hr-specialist \
  -H "Authorization: Bearer [HR_TOKEN]"
```

### Test 3: Quick Actions
- Upload CV button opens modal
- New Analysis navigates to wizard
- All quick actions functional

### Test 4: Pipeline Chart
- Funnel chart renders correctly
- Conversion rates calculated
- Tooltips show details

### Test 5: Real-time Updates
- New CV upload updates count
- Analysis completion updates stats
- Interview schedule updates calendar

---

## 📝 Verification Report Template

```markdown
# ✅ Worker 2 Verification Report: HR_SPECIALIST Dashboard

**Task ID:** W2-HR-SPECIALIST-DASHBOARD
**Duration:** [TIME]

## Tasks Completed
- [x] Task 1: Dashboard component
- [x] Task 2: 8 widget components
- [x] Task 3: Backend API
- [x] Task 4-7: Integration

## Test Results
- Test 1 (Visual): ✅ PASS
- Test 2 (API): ✅ PASS
- Test 3 (Actions): ✅ PASS
- Test 4 (Charts): ✅ PASS
- Test 5 (Real-time): ✅ PASS

## Summary
**Widgets:** 8
**API Endpoints:** 1
**Commits:** 7
**Status:** ✅ SUCCESS
```

---

## ✅ Task Checklist

- [ ] Task 1: Component structure → Commit
- [ ] Task 2: Widget components → Commit
- [ ] Task 3: Backend API → Commit
- [ ] Task 4: Routing → Commit
- [ ] Task 5: Charts (if needed) → Commit
- [ ] Task 6: Layout → Commit
- [ ] Task 7: Skeleton → Commit
- [ ] Run all tests
- [ ] Write report

---

**Estimated Time:** ~5-6 hours

**Ready to start? Good luck, Worker 2! 🚀**

**Created by:** Mod Claude
**Date:** 2025-11-04
**Version:** 1.0
