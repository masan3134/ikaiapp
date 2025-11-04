# 📋 Worker 3 Task: MANAGER Dashboard Design & Implementation

**Task ID:** W3-MANAGER-DASHBOARD
**Assigned to:** Worker Claude 3
**Created by:** Mod Claude
**Date:** 2025-11-04
**Estimated Duration:** 5-6 hours
**Priority:** HIGH
**Complexity:** HIGH
**Role:** MANAGER (Department manager - leadership & analytics focus)

---

## 🎯 Task Overview

**Mission:** Design and implement a beautiful, analytics-focused dashboard for MANAGER role with emphasis on team performance, decision-making, and strategic insights.

**Design Philosophy:**
- **Leadership Focus:** Team metrics, department performance, strategic KPIs
- **Decision Support:** Data-driven insights, approval queues, action items
- **Analytics Power:** Charts, trends, forecasts, comparisons
- **Authority:** Blue colors symbolizing trust, leadership, professionalism

**Expected Outcome:**
- ✅ Beautiful MANAGER dashboard with 8 widgets
- ✅ Blue/Cyan color scheme (leadership, analytics)
- ✅ Responsive grid layout
- ✅ Real-time team metrics
- ✅ Decision widgets
- ✅ Analytics charts

---

## 🎨 Design Specifications

### Color Palette (Blue/Cyan Theme)

```typescript
const MANAGER_THEME = {
  primary: {
    50: '#eff6ff',   // Lightest
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',  // Main (Blue)
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',  // Darkest
  },
  accent: {
    cyan: '#06b6d4',    // Analytics
    green: '#10b981',   // Success
    yellow: '#f59e0b',  // Warning
    red: '#ef4444',     // Alert
    purple: '#8b5cf6',  // Premium
  },
  gradient: {
    header: 'from-blue-600 to-blue-800',
    card: 'from-blue-50 to-white',
    hover: 'from-blue-100 to-blue-50',
    analytics: 'from-cyan-400 to-blue-600',
  }
};
```

---

## 📐 Dashboard Layout

```
┌──────────────────────────────────────────────────────────────┐
│  📊 Manager Dashboard - [User Name]         🔔 [Bell] [Menu] │
│  Department: [Name] • Team: [X] • Budget: [Y]                │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │  👥 Team     │  │  📈 Dept     │  │  ⚡ Action   │       │
│  │  Performance │  │  Analytics   │  │  Items       │       │
│  │              │  │              │  │              │       │
│  │  [Metrics]   │  │  [Charts]    │  │  [Count: X]  │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
│                                                               │
│  ┌────────────────────────────────────┐  ┌──────────────┐   │
│  │  📊 Team Performance Trend          │  │  ✅ Approval │   │
│  │                                     │  │  Queue       │   │
│  │  [Line chart - 30 days]             │  │              │   │
│  │                                     │  │  • Offers    │   │
│  │  Productivity • Quality • Delivery   │  │  • Budgets   │   │
│  └────────────────────────────────────┘  └──────────────┘   │
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │  📅 Interview│  │  💰 Budget   │  │  🎯 KPIs     │       │
│  │  Schedule    │  │  Overview    │  │  This Month  │       │
│  │              │  │              │  │              │       │
│  │  [Calendar]  │  │  [Spending]  │  │  [Targets]   │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
└──────────────────────────────────────────────────────────────┘
```

---

## 🧩 Widget Specifications

### Widget 1: Welcome Header (Manager Focus)
**Location:** Top (full width)
**Purpose:** Department overview with key metrics

**Design:**
```tsx
<div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-6 mb-6 text-white">
  <div className="flex justify-between items-start">
    <div>
      <h1 className="text-3xl font-bold mb-2">
        📊 Manager Dashboard
      </h1>
      <p className="text-blue-100 text-lg mb-3">
        Hoş geldin, {user.firstName}! Takımını yönet ve performansı izle.
      </p>
      <div className="flex gap-6 text-sm">
        <div className="flex items-center gap-2 bg-blue-700/30 px-3 py-1 rounded-lg">
          <Users className="w-4 h-4" />
          <span>{teamSize} Kişi Takım</span>
        </div>
        <div className="flex items-center gap-2 bg-blue-700/30 px-3 py-1 rounded-lg">
          <Briefcase className="w-4 h-4" />
          <span>{activeProjects} Aktif Proje</span>
        </div>
        <div className="flex items-center gap-2 bg-blue-700/30 px-3 py-1 rounded-lg">
          <TrendingUp className="w-4 h-4" />
          <span>Performans: {performance}%</span>
        </div>
        <div className="flex items-center gap-2 bg-blue-700/30 px-3 py-1 rounded-lg">
          <DollarSign className="w-4 h-4" />
          <span>Bütçe: {budgetUsed}% kullanıldı</span>
        </div>
      </div>
    </div>
    <div className="flex items-center gap-3">
      <NotificationBell />
    </div>
  </div>
</div>
```

---

### Widget 2: Team Performance Overview
**Location:** Top left
**Purpose:** Show team performance metrics at a glance

**Metrics:**
- Team productivity score
- Active team members
- Completed tasks this week
- Average satisfaction

**Design:**
```tsx
<Card className="bg-white shadow-sm hover:shadow-md transition-all">
  <CardHeader>
    <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
      <Users className="w-5 h-5 text-blue-600" />
      Takım Performansı
    </h3>
  </CardHeader>
  <CardBody>
    <div className="text-center mb-4">
      <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full mb-3">
        <div className="text-center">
          <p className="text-3xl font-bold text-blue-600">{teamScore}</p>
          <p className="text-xs text-slate-600">Skor</p>
        </div>
      </div>
    </div>

    <div className="space-y-3">
      <div className="flex items-center justify-between text-sm">
        <span className="text-slate-600">Aktif Üyeler</span>
        <span className="font-semibold text-slate-800">{activeMembers}/{totalMembers}</span>
      </div>
      <div className="flex items-center justify-between text-sm">
        <span className="text-slate-600">Tamamlanan Görev</span>
        <span className="font-semibold text-green-600">{completedTasks}</span>
      </div>
      <div className="flex items-center justify-between text-sm">
        <span className="text-slate-600">Memnuniyet</span>
        <span className="font-semibold text-blue-600">{satisfaction}%</span>
      </div>
    </div>

    <Link
      href="/team"
      className="block mt-4 text-center text-sm text-blue-600 hover:text-blue-700 font-medium"
    >
      Detaylı Rapor →
    </Link>
  </CardBody>
</Card>
```

---

### Widget 3: Department Analytics
**Location:** Top center
**Purpose:** Key department metrics with trends

**Metrics:**
- Total hires this month
- Average time-to-hire
- Offer acceptance rate
- Cost per hire

**Design:**
```tsx
<Card className="bg-gradient-to-br from-cyan-50 to-white shadow-sm hover:shadow-md transition-shadow">
  <CardHeader>
    <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
      <BarChart3 className="w-5 h-5 text-cyan-600" />
      Departman Analitikleri
    </h3>
  </CardHeader>
  <CardBody>
    <div className="grid grid-cols-2 gap-3">
      {[
        {
          label: 'İşe Alım',
          value: monthHires,
          icon: <UserPlus className="w-4 h-4" />,
          change: hiresChange,
          color: 'green'
        },
        {
          label: 'Ort. Süre',
          value: `${avgTimeToHire} gün`,
          icon: <Clock className="w-4 h-4" />,
          change: timeChange,
          color: 'blue',
          reversed: true
        },
        {
          label: 'Kabul Oranı',
          value: `${acceptanceRate}%`,
          icon: <CheckCircle className="w-4 h-4" />,
          change: acceptanceChange,
          color: 'cyan'
        },
        {
          label: 'Kişi Başı Maliyet',
          value: `₺${costPerHire}`,
          icon: <DollarSign className="w-4 h-4" />,
          change: costChange,
          color: 'purple',
          reversed: true
        }
      ].map(metric => (
        <div key={metric.label} className="p-3 bg-white rounded-lg border border-slate-100">
          <div className="flex items-center justify-between mb-2">
            <div className={`w-8 h-8 bg-${metric.color}-100 rounded-lg flex items-center justify-center`}>
              <div className={`text-${metric.color}-600`}>{metric.icon}</div>
            </div>
            {metric.change !== undefined && (
              <span className={`text-xs flex items-center gap-1 ${
                metric.reversed
                  ? (metric.change <= 0 ? 'text-green-600' : 'text-red-600')
                  : (metric.change >= 0 ? 'text-green-600' : 'text-red-600')
              }`}>
                {((metric.reversed && metric.change <= 0) || (!metric.reversed && metric.change >= 0)) ? (
                  <ArrowUp className="w-3 h-3" />
                ) : (
                  <ArrowDown className="w-3 h-3" />
                )}
                {Math.abs(metric.change)}%
              </span>
            )}
          </div>
          <p className="text-lg font-bold text-slate-800">{metric.value}</p>
          <p className="text-xs text-slate-600">{metric.label}</p>
        </div>
      ))}
    </div>
  </CardBody>
</Card>
```

---

### Widget 4: Action Items
**Location:** Top right
**Purpose:** Pending actions requiring manager attention

**Content:**
- Pending approvals count
- Urgent items count
- Tasks due today
- Quick action link

**Design:**
```tsx
<Card className="bg-gradient-to-br from-yellow-50 to-white shadow-sm hover:shadow-md transition-shadow border-l-4 border-yellow-500">
  <CardHeader>
    <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
      <AlertCircle className="w-5 h-5 text-yellow-600" />
      Dikkat Gereken İşler
    </h3>
  </CardHeader>
  <CardBody>
    <div className="space-y-3">
      <div className="flex items-center justify-between p-3 bg-white rounded-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
            <span className="text-lg font-bold text-red-600">{urgentCount}</span>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-800">Acil</p>
            <p className="text-xs text-slate-500">Hemen yanıt gerekli</p>
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-slate-400" />
      </div>

      <div className="flex items-center justify-between p-3 bg-white rounded-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
            <span className="text-lg font-bold text-yellow-600">{approvalCount}</span>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-800">Onay Bekliyor</p>
            <p className="text-xs text-slate-500">Teklifler, bütçeler</p>
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-slate-400" />
      </div>

      <div className="flex items-center justify-between p-3 bg-white rounded-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <span className="text-lg font-bold text-blue-600">{todayTasksCount}</span>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-800">Bugün Biten</p>
            <p className="text-xs text-slate-500">Görevler ve toplantılar</p>
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-slate-400" />
      </div>
    </div>

    <button className="w-full mt-4 bg-yellow-600 hover:bg-yellow-700 text-white py-2 rounded-lg font-medium transition-colors">
      Tümünü Görüntüle
    </button>
  </CardBody>
</Card>
```

---

### Widget 5: Team Performance Trend Chart
**Location:** Middle left (2 columns wide)
**Purpose:** Show team performance over last 30 days

**Chart Type:** Multi-line chart
**Metrics:** Productivity, Quality, Delivery

**Design:**
```tsx
<Card className="bg-white shadow-sm">
  <CardHeader>
    <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
      <TrendingUp className="w-5 h-5 text-blue-600" />
      Takım Performans Trendi (30 Gün)
    </h3>
  </CardHeader>
  <CardBody>
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={performanceTrend}>
        <defs>
          <linearGradient id="productivityGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3}/>
            <stop offset="100%" stopColor="#3b82f6" stopOpacity={0}/>
          </linearGradient>
          <linearGradient id="qualityGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10b981" stopOpacity={0.3}/>
            <stop offset="100%" stopColor="#10b981" stopOpacity={0}/>
          </linearGradient>
          <linearGradient id="deliveryGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.3}/>
            <stop offset="100%" stopColor="#f59e0b" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis
          dataKey="date"
          stroke="#94a3b8"
          tick={{ fontSize: 11 }}
        />
        <YAxis
          stroke="#94a3b8"
          tick={{ fontSize: 11 }}
          domain={[0, 100]}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: '#fff',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
          }}
        />
        <Legend />
        <Line
          type="monotone"
          dataKey="productivity"
          stroke="#3b82f6"
          strokeWidth={2}
          dot={{ fill: '#3b82f6', r: 4 }}
          activeDot={{ r: 6 }}
          name="Verimlilik"
        />
        <Line
          type="monotone"
          dataKey="quality"
          stroke="#10b981"
          strokeWidth={2}
          dot={{ fill: '#10b981', r: 4 }}
          activeDot={{ r: 6 }}
          name="Kalite"
        />
        <Line
          type="monotone"
          dataKey="delivery"
          stroke="#f59e0b"
          strokeWidth={2}
          dot={{ fill: '#f59e0b', r: 4 }}
          activeDot={{ r: 6 }}
          name="Teslimat"
        />
      </LineChart>
    </ResponsiveContainer>

    <div className="mt-4 grid grid-cols-3 gap-4">
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-1">
          <div className="w-3 h-3 bg-blue-500 rounded-full" />
          <span className="text-xs text-slate-600">Verimlilik</span>
        </div>
        <p className="text-lg font-bold text-blue-600">{currentProductivity}%</p>
      </div>
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-1">
          <div className="w-3 h-3 bg-green-500 rounded-full" />
          <span className="text-xs text-slate-600">Kalite</span>
        </div>
        <p className="text-lg font-bold text-green-600">{currentQuality}%</p>
      </div>
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-1">
          <div className="w-3 h-3 bg-yellow-500 rounded-full" />
          <span className="text-xs text-slate-600">Teslimat</span>
        </div>
        <p className="text-lg font-bold text-yellow-600">{currentDelivery}%</p>
      </div>
    </div>
  </CardBody>
</Card>
```

---

### Widget 6: Approval Queue
**Location:** Middle right
**Purpose:** Items waiting for manager approval

**Content:**
- Pending offers (need approval)
- Budget requests
- Leave requests
- Quick approve/reject

**Design:**
```tsx
<Card className="bg-white shadow-sm">
  <CardHeader>
    <div className="flex items-center justify-between">
      <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
        <CheckSquare className="w-5 h-5 text-blue-600" />
        Onay Kuyruğu
      </h3>
      <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-semibold">
        {approvalQueue.length}
      </span>
    </div>
  </CardHeader>
  <CardBody>
    {approvalQueue.length === 0 ? (
      <div className="text-center py-8">
        <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
        <p className="text-sm text-slate-500">Tüm işler onaylandı! 🎉</p>
      </div>
    ) : (
      <div className="space-y-3">
        {approvalQueue.slice(0, 5).map(item => (
          <div
            key={item.id}
            className="p-3 border border-slate-200 rounded-lg hover:border-blue-300 transition-colors"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  {getApprovalIcon(item.type)}
                  <span className={`text-xs px-2 py-0.5 rounded ${
                    item.type === 'OFFER' ? 'bg-purple-100 text-purple-700' :
                    item.type === 'BUDGET' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {item.type === 'OFFER' ? 'Teklif' :
                     item.type === 'BUDGET' ? 'Bütçe' : 'İzin'}
                  </span>
                </div>
                <p className="text-sm font-medium text-slate-800 line-clamp-1">
                  {item.title}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  {formatRelativeTime(item.createdAt)}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="flex-1 bg-green-600 hover:bg-green-700 text-white py-1.5 rounded text-xs font-medium transition-colors">
                ✓ Onayla
              </button>
              <button className="flex-1 bg-red-600 hover:bg-red-700 text-white py-1.5 rounded text-xs font-medium transition-colors">
                ✗ Reddet
              </button>
            </div>
          </div>
        ))}
      </div>
    )}
  </CardBody>
</Card>
```

---

### Widget 7: Interview Schedule
**Location:** Bottom left
**Purpose:** Upcoming interviews manager should attend

**Design:**
```tsx
<Card className="bg-white shadow-sm">
  <CardHeader>
    <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
      <Calendar className="w-5 h-5 text-blue-600" />
      Mülakat Takvimi
    </h3>
  </CardHeader>
  <CardBody>
    <div className="space-y-3">
      {upcomingInterviews.slice(0, 4).map(interview => (
        <div
          key={interview.id}
          className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg hover:bg-blue-50 transition-colors"
        >
          <div className="flex-shrink-0 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex flex-col items-center justify-center">
              <span className="text-xs text-blue-600 font-medium">
                {format(interview.scheduledAt, 'MMM')}
              </span>
              <span className="text-lg font-bold text-blue-700">
                {format(interview.scheduledAt, 'dd')}
              </span>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-800 truncate">
              {interview.candidate.name}
            </p>
            <p className="text-xs text-slate-500 truncate">
              {interview.jobPosting.title}
            </p>
            <p className="text-xs text-blue-600 mt-1">
              {format(interview.scheduledAt, 'HH:mm')}
            </p>
          </div>
        </div>
      ))}
    </div>
    <Link
      href="/interviews"
      className="block text-center mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium"
    >
      Tüm Mülakatlar →
    </Link>
  </CardBody>
</Card>
```

---

### Widget 8: Monthly KPIs
**Location:** Bottom right
**Purpose:** Department KPIs vs targets

**Design:**
```tsx
<Card className="bg-gradient-to-br from-blue-50 to-white shadow-sm">
  <CardHeader>
    <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
      <Target className="w-5 h-5 text-blue-600" />
      Aylık KPI'lar
    </h3>
  </CardHeader>
  <CardBody>
    <div className="space-y-4">
      {kpis.map(kpi => (
        <div key={kpi.name}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-700">{kpi.name}</span>
            <span className="text-sm font-bold text-slate-800">
              {kpi.current} / {kpi.target}
            </span>
          </div>
          <div className="relative w-full bg-slate-200 rounded-full h-2">
            <div
              className={`absolute top-0 left-0 h-2 rounded-full transition-all ${
                kpi.percentage >= 100 ? 'bg-green-500' :
                kpi.percentage >= 75 ? 'bg-blue-500' :
                kpi.percentage >= 50 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${Math.min(kpi.percentage, 100)}%` }}
            />
          </div>
          <div className="flex items-center justify-between mt-1">
            <span className={`text-xs ${
              kpi.percentage >= 100 ? 'text-green-600' :
              kpi.percentage >= 75 ? 'text-blue-600' :
              kpi.percentage >= 50 ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {kpi.percentage}%
            </span>
            {kpi.percentage >= 100 && (
              <CheckCircle className="w-4 h-4 text-green-600" />
            )}
          </div>
        </div>
      ))}
    </div>
  </CardBody>
</Card>
```

---

## 🛠️ Implementation Tasks

### Task 1-7: Same structure as W1 & W2
- Dashboard component
- 8 widget components
- Backend API endpoint
- Dashboard routing
- Layout/Skeleton
- Testing

**Commits:** 7 total (1 per task)

---

## 🧪 Testing & Verification

Same as W1/W2 - Visual, API, Functionality, Responsive, Real-time

---

## 📝 Verification Report Template

```markdown
# ✅ Worker 3 Verification Report: MANAGER Dashboard

**Task ID:** W3-MANAGER-DASHBOARD
**Duration:** [TIME]

## Tasks Completed
- [x] All 7 tasks

## Test Results
- All tests: ✅ PASS

## Summary
**Widgets:** 8
**Status:** ✅ SUCCESS
```

---

**Estimated Time:** ~5-6 hours

**Ready to start? Good luck, Worker 3! 🚀**

**Created by:** Mod Claude
**Date:** 2025-11-04
**Version:** 1.0
