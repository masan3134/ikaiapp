# 📋 Worker 5 Task: SUPER_ADMIN Dashboard Design & Implementation

**Task ID:** W5-SUPER-ADMIN-DASHBOARD
**Assigned to:** Worker Claude 5
**Created by:** Mod Claude
**Date:** 2025-11-04
**Estimated Duration:** 6-7 hours
**Priority:** CRITICAL
**Complexity:** VERY HIGH
**Role:** SUPER_ADMIN (Platform owner - system-wide control)

---

## 🎯 Task Overview

**Mission:** Design and implement a powerful, system-wide dashboard for SUPER_ADMIN role with emphasis on multi-organization management, platform analytics, and system health monitoring.

**Design Philosophy:**
- **System-Wide Vision:** Multi-org overview, platform metrics, global analytics
- **Ultimate Power:** Red/Rose colors symbolizing authority, importance, control
- **Platform Health:** System monitoring, queue management, error tracking
- **Revenue Focus:** Subscription tracking, MRR, customer lifetime value

**Expected Outcome:**
- ✅ Powerful SUPER_ADMIN dashboard with 10 widgets
- ✅ Red/Rose color scheme (power, authority)
- ✅ Multi-org overview
- ✅ Real-time system metrics
- ✅ Platform analytics
- ✅ Revenue tracking

---

## 🎨 Design Specifications

### Color Palette (Red/Rose Theme)

```typescript
const SUPER_ADMIN_THEME = {
  primary: {
    50: '#fff1f2',   // Lightest
    100: '#ffe4e6',
    200: '#fecdd3',
    300: '#fda4af',
    400: '#fb7185',
    500: '#f43f5e',  // Main (Rose)
    600: '#e11d48',
    700: '#be123c',
    800: '#9f1239',
    900: '#881337',  // Darkest
  },
  accent: {
    blue: '#3b82f6',    // Info
    green: '#10b981',   // Success
    yellow: '#f59e0b',  // Warning
    purple: '#a855f7',  // Premium
    orange: '#f97316',  // Alert
  },
  gradient: {
    header: 'from-rose-600 to-red-800',
    card: 'from-rose-50 to-white',
    hover: 'from-rose-100 to-rose-50',
    power: 'from-red-500 to-rose-600',
    revenue: 'from-green-400 to-emerald-600',
  }
};
```

---

## 📐 Dashboard Layout

```
┌──────────────────────────────────────────────────────────────┐
│  ⚡ Platform Control Center                    🔔 [Bell] 🔧  │
│  Organizations: [X] • Revenue: ₺[Y] • Uptime: [Z]%           │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │  🏢 Multi-Org│  │  💰 Revenue  │  │  📊 Platform │       │
│  │  Overview    │  │  Overview    │  │  Analytics   │       │
│  │              │  │              │  │              │       │
│  │  [X orgs]    │  │  MRR: ₺[Y]   │  │  [Stats]     │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
│                                                               │
│  ┌────────────────────────────────────┐  ┌──────────────┐   │
│  │  📈 Platform Growth (90 Days)       │  │  🚨 System   │   │
│  │                                     │  │  Health      │   │
│  │  [Multi-line chart]                 │  │              │   │
│  │  Users • Orgs • Revenue • Activity  │  │  [Status]    │   │
│  └────────────────────────────────────┘  └──────────────┘   │
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │  🏢 Org List │  │  📋 Queue    │  │  🔐 Security │       │
│  │  & Status    │  │  Management  │  │  Monitoring  │       │
│  │              │  │              │  │              │       │
│  │  [Table]     │  │  [5 queues]  │  │  [Events]    │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
└──────────────────────────────────────────────────────────────┘
```

---

## 🧩 Widget Specifications

### Widget 1: Platform Control Center Header
**Location:** Top (full width)
**Purpose:** System-wide overview with critical metrics

**Design:**
```tsx
<div className="bg-gradient-to-r from-rose-600 to-red-800 rounded-xl p-6 mb-6 text-white relative overflow-hidden">
  {/* Background decoration */}
  <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
  <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-red-900/30 rounded-full blur-3xl" />

  <div className="relative flex justify-between items-start">
    <div>
      <div className="flex items-center gap-3 mb-3">
        <div className="w-14 h-14 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center border border-white/30">
          <Zap className="w-8 h-8 text-yellow-300" />
        </div>
        <div>
          <h1 className="text-4xl font-bold">
            Platform Control Center
          </h1>
          <p className="text-rose-100 text-sm">
            System-wide administration & monitoring
          </p>
        </div>
      </div>

      <div className="flex gap-4 mt-4">
        <div className="bg-red-700/40 backdrop-blur px-4 py-2 rounded-lg border border-white/20">
          <p className="text-xs text-rose-200">Toplam Organizasyon</p>
          <p className="text-2xl font-bold">{platformStats.totalOrganizations}</p>
        </div>
        <div className="bg-red-700/40 backdrop-blur px-4 py-2 rounded-lg border border-white/20">
          <p className="text-xs text-rose-200">Aylık Gelir (MRR)</p>
          <p className="text-2xl font-bold">₺{platformStats.monthlyRevenue}</p>
        </div>
        <div className="bg-red-700/40 backdrop-blur px-4 py-2 rounded-lg border border-white/20">
          <p className="text-xs text-rose-200">Toplam Kullanıcı</p>
          <p className="text-2xl font-bold">{platformStats.totalUsers}</p>
        </div>
        <div className="bg-red-700/40 backdrop-blur px-4 py-2 rounded-lg border border-white/20">
          <p className="text-xs text-rose-200">System Uptime</p>
          <p className="text-2xl font-bold">{platformStats.uptime}%</p>
        </div>
        <div className="bg-red-700/40 backdrop-blur px-4 py-2 rounded-lg border border-white/20">
          <p className="text-xs text-rose-200">Aktif Analizler</p>
          <p className="text-2xl font-bold">{platformStats.activeAnalyses}</p>
        </div>
      </div>
    </div>
    <div className="flex items-center gap-3">
      <NotificationBell />
      <Link
        href="/super-admin"
        className="p-2.5 bg-white/20 hover:bg-white/30 rounded-lg backdrop-blur transition-colors border border-white/30"
      >
        <Settings className="w-6 h-6" />
      </Link>
    </div>
  </div>
</div>
```

---

### Widget 2: Multi-Organization Overview
**Location:** Top left
**Purpose:** Overview of all organizations on platform

**Metrics:**
- Total organizations
- By plan (FREE, PRO, ENTERPRISE)
- Active organizations
- Churned this month

**Design:**
```tsx
<Card className="bg-white shadow-sm hover:shadow-lg transition-all">
  <CardHeader>
    <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
      <Building2 className="w-5 h-5 text-rose-600" />
      Organizasyonlar
    </h3>
  </CardHeader>
  <CardBody>
    <div className="text-center mb-4">
      <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-rose-100 to-red-100 rounded-full mb-3">
        <span className="text-3xl font-bold text-rose-600">{totalOrgs}</span>
      </div>
      <p className="text-sm text-slate-600">Toplam Organizasyon</p>
    </div>

    <div className="space-y-2 mb-4">
      {[
        { plan: 'ENTERPRISE', count: planCounts.enterprise, color: 'purple', icon: Crown },
        { plan: 'PRO', count: planCounts.pro, color: 'blue', icon: Star },
        { plan: 'FREE', count: planCounts.free, color: 'slate', icon: Users }
      ].map(item => (
        <div key={item.plan} className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 bg-${item.color}-100 rounded-lg flex items-center justify-center`}>
              <item.icon className={`w-4 h-4 text-${item.color}-600`} />
            </div>
            <span className="text-sm text-slate-700">{item.plan}</span>
          </div>
          <span className="text-sm font-bold text-slate-800">{item.count}</span>
        </div>
      ))}
    </div>

    <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-200">
      <div className="text-center">
        <p className="text-xs text-slate-600">Aktif</p>
        <p className="text-lg font-bold text-green-600">{activeOrgs}</p>
      </div>
      <div className="text-center">
        <p className="text-xs text-slate-600">Bu Ay Kayıp</p>
        <p className="text-lg font-bold text-red-600">{churnedOrgs}</p>
      </div>
    </div>

    <Link
      href="/super-admin/organizations"
      className="block mt-4 text-center text-sm text-rose-600 hover:text-rose-700 font-medium"
    >
      Tüm Organizasyonlar →
    </Link>
  </CardBody>
</Card>
```

---

### Widget 3: Revenue Overview
**Location:** Top center
**Purpose:** Financial metrics and revenue tracking

**Metrics:**
- MRR (Monthly Recurring Revenue)
- ARR (Annual Recurring Revenue)
- Growth rate
- Revenue by plan

**Design:**
```tsx
<Card className="bg-gradient-to-br from-green-50 to-white shadow-sm hover:shadow-lg transition-all">
  <CardHeader>
    <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
      <DollarSign className="w-5 h-5 text-green-600" />
      Gelir Özeti
    </h3>
  </CardHeader>
  <CardBody>
    <div className="mb-4">
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg p-4 text-white mb-3">
        <p className="text-xs mb-1 opacity-90">Aylık Yinelenen Gelir</p>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold">₺{revenue.mrr.toLocaleString()}</span>
          <span className="text-sm opacity-90">/ay</span>
        </div>
        <div className="flex items-center gap-1 mt-2 text-xs">
          <TrendingUp className="w-3 h-3" />
          <span>+{revenue.mrrGrowth}% bu ay</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 bg-blue-50 rounded-lg">
          <p className="text-xs text-slate-600 mb-1">ARR</p>
          <p className="text-lg font-bold text-blue-600">
            ₺{(revenue.mrr * 12).toLocaleString()}
          </p>
        </div>
        <div className="p-3 bg-purple-50 rounded-lg">
          <p className="text-xs text-slate-600 mb-1">LTV Ort.</p>
          <p className="text-lg font-bold text-purple-600">
            ₺{revenue.avgLTV.toLocaleString()}
          </p>
        </div>
      </div>
    </div>

    <div className="space-y-2 pt-3 border-t border-slate-200">
      <p className="text-xs text-slate-600 mb-2">Plan Bazlı Gelir</p>
      {[
        { plan: 'ENTERPRISE', amount: revenue.enterprise, color: 'purple' },
        { plan: 'PRO', amount: revenue.pro, color: 'blue' },
        { plan: 'FREE', amount: 0, color: 'slate' }
      ].map(item => (
        <div key={item.plan} className="flex items-center justify-between">
          <span className="text-sm text-slate-700">{item.plan}</span>
          <span className={`text-sm font-bold text-${item.color}-600`}>
            ₺{item.amount.toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  </CardBody>
</Card>
```

---

### Widget 4: Platform Analytics
**Location:** Top right
**Purpose:** Key platform usage statistics

**Metrics:**
- Total analyses run
- Total CVs uploaded
- Total job postings
- Total offers sent

**Design:**
```tsx
<Card className="bg-gradient-to-br from-purple-50 to-white shadow-sm hover:shadow-lg transition-all">
  <CardHeader>
    <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
      <BarChart3 className="w-5 h-5 text-purple-600" />
      Platform Analitikleri
    </h3>
  </CardHeader>
  <CardBody>
    <div className="grid grid-cols-2 gap-3">
      {[
        {
          label: 'Toplam Analiz',
          value: platformStats.totalAnalyses.toLocaleString(),
          icon: <Wand2 className="w-5 h-5" />,
          color: 'purple',
          change: platformStats.analysesGrowth
        },
        {
          label: 'Toplam CV',
          value: platformStats.totalCVs.toLocaleString(),
          icon: <FileText className="w-5 h-5" />,
          color: 'blue',
          change: platformStats.cvsGrowth
        },
        {
          label: 'İş İlanları',
          value: platformStats.totalJobPostings.toLocaleString(),
          icon: <Briefcase className="w-5 h-5" />,
          color: 'green',
          change: platformStats.jobsGrowth
        },
        {
          label: 'Gönderilen Teklifler',
          value: platformStats.totalOffers.toLocaleString(),
          icon: <Mail className="w-5 h-5" />,
          color: 'orange',
          change: platformStats.offersGrowth
        }
      ].map(stat => (
        <div key={stat.label} className={`p-3 bg-white rounded-lg border border-${stat.color}-100`}>
          <div className={`w-10 h-10 bg-${stat.color}-100 rounded-lg flex items-center justify-center mb-2`}>
            <div className={`text-${stat.color}-600`}>{stat.icon}</div>
          </div>
          <p className="text-xl font-bold text-slate-800">{stat.value}</p>
          <p className="text-xs text-slate-600 mb-1">{stat.label}</p>
          <div className={`flex items-center gap-1 text-xs ${
            stat.change >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {stat.change >= 0 ? (
              <ArrowUp className="w-3 h-3" />
            ) : (
              <ArrowDown className="w-3 h-3" />
            )}
            <span>{Math.abs(stat.change)}%</span>
          </div>
        </div>
      ))}
    </div>
  </CardBody>
</Card>
```

---

### Widget 5: Platform Growth Chart
**Location:** Middle left (2 columns wide)
**Purpose:** Show platform growth over 90 days

**Chart Type:** Multi-line chart
**Metrics:** Organizations, Users, Revenue, Activity

**Design:**
```tsx
<Card className="bg-white shadow-sm">
  <CardHeader>
    <div className="flex items-center justify-between">
      <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
        <TrendingUp className="w-5 h-5 text-rose-600" />
        Platform Büyüme Trendi (90 Gün)
      </h3>
      <div className="flex gap-2">
        <button className="text-xs px-3 py-1 rounded bg-rose-100 text-rose-700 font-medium">
          Tümü
        </button>
        <button className="text-xs px-3 py-1 rounded bg-slate-100 text-slate-700">
          30 Gün
        </button>
      </div>
    </div>
  </CardHeader>
  <CardBody>
    <ResponsiveContainer width="100%" height={320}>
      <LineChart data={growthData}>
        <defs>
          <linearGradient id="orgGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f43f5e" stopOpacity={0.3}/>
            <stop offset="100%" stopColor="#f43f5e" stopOpacity={0}/>
          </linearGradient>
          <linearGradient id="userGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3}/>
            <stop offset="100%" stopColor="#3b82f6" stopOpacity={0}/>
          </linearGradient>
          <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10b981" stopOpacity={0.3}/>
            <stop offset="100%" stopColor="#10b981" stopOpacity={0}/>
          </linearGradient>
          <linearGradient id="activityGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#a855f7" stopOpacity={0.3}/>
            <stop offset="100%" stopColor="#a855f7" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis
          dataKey="date"
          stroke="#94a3b8"
          tick={{ fontSize: 10 }}
        />
        <YAxis
          yAxisId="left"
          stroke="#94a3b8"
          tick={{ fontSize: 10 }}
        />
        <YAxis
          yAxisId="right"
          orientation="right"
          stroke="#94a3b8"
          tick={{ fontSize: 10 }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: '#fff',
            border: '1px solid #fecdd3',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}
        />
        <Legend />
        <Line
          yAxisId="left"
          type="monotone"
          dataKey="organizations"
          stroke="#f43f5e"
          strokeWidth={2}
          dot={{ fill: '#f43f5e', r: 3 }}
          name="Organizasyonlar"
        />
        <Line
          yAxisId="left"
          type="monotone"
          dataKey="users"
          stroke="#3b82f6"
          strokeWidth={2}
          dot={{ fill: '#3b82f6', r: 3 }}
          name="Kullanıcılar"
        />
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="revenue"
          stroke="#10b981"
          strokeWidth={2}
          dot={{ fill: '#10b981', r: 3 }}
          name="Gelir (₺)"
        />
        <Line
          yAxisId="left"
          type="monotone"
          dataKey="activity"
          stroke="#a855f7"
          strokeWidth={2}
          dot={{ fill: '#a855f7', r: 3 }}
          name="Aktivite"
        />
      </LineChart>
    </ResponsiveContainer>

    <div className="mt-4 grid grid-cols-4 gap-2">
      {[
        { label: 'Org Büyüme', value: `+${metrics.orgGrowth}%`, color: 'rose' },
        { label: 'Kullanıcı Büyüme', value: `+${metrics.userGrowth}%`, color: 'blue' },
        { label: 'Gelir Büyüme', value: `+${metrics.revenueGrowth}%`, color: 'green' },
        { label: 'Aktivite Artışı', value: `+${metrics.activityGrowth}%`, color: 'purple' }
      ].map(metric => (
        <div key={metric.label} className={`text-center p-2 bg-${metric.color}-50 rounded-lg`}>
          <p className="text-xs text-slate-600">{metric.label}</p>
          <p className={`text-sm font-bold text-${metric.color}-600`}>{metric.value}</p>
        </div>
      ))}
    </div>
  </CardBody>
</Card>
```

---

### Widget 6: System Health Monitor
**Location:** Middle right
**Purpose:** Real-time system status monitoring

**Metrics:**
- Service uptime
- Database status
- Queue health
- API response time
- Error rate

**Design:**
```tsx
<Card className="bg-white shadow-sm border-l-4 border-rose-500">
  <CardHeader>
    <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
      <Activity className="w-5 h-5 text-rose-600" />
      Sistem Sağlığı
    </h3>
  </CardHeader>
  <CardBody>
    <div className="space-y-3">
      {[
        {
          name: 'Backend API',
          status: systemHealth.backend,
          metric: `${systemHealth.apiResponseTime}ms`,
          icon: Server
        },
        {
          name: 'PostgreSQL',
          status: systemHealth.database,
          metric: `${systemHealth.dbConnections} conn`,
          icon: Database
        },
        {
          name: 'Redis Cache',
          status: systemHealth.redis,
          metric: `${systemHealth.cacheHitRate}% hit`,
          icon: Zap
        },
        {
          name: 'Milvus Vector',
          status: systemHealth.milvus,
          metric: `${systemHealth.vectorCount} docs`,
          icon: Layers
        },
        {
          name: 'BullMQ Queues',
          status: systemHealth.queues,
          metric: `${systemHealth.queueJobs} jobs`,
          icon: ListIcon
        }
      ].map(service => (
        <div
          key={service.name}
          className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              service.status === 'healthy' ? 'bg-green-100' :
              service.status === 'degraded' ? 'bg-yellow-100' :
              'bg-red-100'
            }`}>
              <service.icon className={`w-4 h-4 ${
                service.status === 'healthy' ? 'text-green-600' :
                service.status === 'degraded' ? 'text-yellow-600' :
                'text-red-600'
              }`} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-800">{service.name}</p>
              <p className="text-xs text-slate-500">{service.metric}</p>
            </div>
          </div>
          <div className={`flex items-center gap-1 ${
            service.status === 'healthy' ? 'text-green-600' :
            service.status === 'degraded' ? 'text-yellow-600' :
            'text-red-600'
          }`}>
            <div className={`w-2 h-2 rounded-full ${
              service.status === 'healthy' ? 'bg-green-500 animate-pulse' :
              service.status === 'degraded' ? 'bg-yellow-500' :
              'bg-red-500 animate-pulse'
            }`} />
            <span className="text-xs font-medium">
              {service.status === 'healthy' ? 'Sağlıklı' :
               service.status === 'degraded' ? 'Yavaş' : 'Hata'}
            </span>
          </div>
        </div>
      ))}
    </div>

    <div className="mt-4 p-3 bg-rose-50 rounded-lg">
      <div className="flex items-center justify-between">
        <span className="text-sm text-slate-700">Sistem Uptime</span>
        <span className="text-sm font-bold text-rose-600">{systemHealth.uptime}%</span>
      </div>
    </div>

    <Link
      href="/super-admin/system-health"
      className="block mt-4 text-center text-sm text-rose-600 hover:text-rose-700 font-medium"
    >
      Detaylı İzleme →
    </Link>
  </CardBody>
</Card>
```

---

### Widget 7: Organization List & Management
**Location:** Bottom left
**Purpose:** Quick organization list with actions

**Design:**
```tsx
<Card className="bg-white shadow-sm">
  <CardHeader>
    <div className="flex items-center justify-between">
      <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
        <Building2 className="w-5 h-5 text-rose-600" />
        Organizasyonlar
      </h3>
      <button className="text-xs bg-rose-600 hover:bg-rose-700 text-white px-3 py-1 rounded font-medium">
        + Yeni
      </button>
    </div>
  </CardHeader>
  <CardBody>
    <div className="space-y-2">
      {organizations.slice(0, 5).map(org => (
        <div
          key={org.id}
          className="flex items-center justify-between p-3 border border-slate-200 rounded-lg hover:border-rose-300 hover:bg-rose-50 transition-all group"
        >
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold ${
              org.plan === 'ENTERPRISE' ? 'bg-purple-500' :
              org.plan === 'PRO' ? 'bg-blue-500' :
              'bg-slate-400'
            }`}>
              {org.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-800 truncate">
                {org.name}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-xs px-2 py-0.5 rounded ${
                  org.plan === 'ENTERPRISE' ? 'bg-purple-100 text-purple-700' :
                  org.plan === 'PRO' ? 'bg-blue-100 text-blue-700' :
                  'bg-slate-100 text-slate-700'
                }`}>
                  {org.plan}
                </span>
                <span className="text-xs text-slate-500">
                  {org.totalUsers} kullanıcı
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-blue-100 rounded transition-all">
              <Edit2 className="w-4 h-4 text-blue-600" />
            </button>
            <button className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-100 rounded transition-all">
              <Trash2 className="w-4 h-4 text-red-600" />
            </button>
          </div>
        </div>
      ))}
    </div>

    <Link
      href="/super-admin/organizations"
      className="block text-center mt-4 text-sm text-rose-600 hover:text-rose-700 font-medium"
    >
      Tüm Organizasyonlar ({totalOrgs}) →
    </Link>
  </CardBody>
</Card>
```

---

### Widget 8: Queue Management
**Location:** Bottom center
**Purpose:** BullMQ queue health and job monitoring

**Design:**
```tsx
<Card className="bg-white shadow-sm">
  <CardHeader>
    <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
      <ListIcon className="w-5 h-5 text-orange-600" />
      Queue Yönetimi
    </h3>
  </CardHeader>
  <CardBody>
    <div className="space-y-3">
      {queueStats.map(queue => (
        <div key={queue.name} className="p-3 border border-slate-200 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-800">{queue.name}</span>
            <span className={`text-xs px-2 py-1 rounded ${
              queue.status === 'active' ? 'bg-green-100 text-green-700' :
              queue.status === 'paused' ? 'bg-yellow-100 text-yellow-700' :
              'bg-red-100 text-red-700'
            }`}>
              {queue.status}
            </span>
          </div>
          <div className="grid grid-cols-4 gap-2 text-xs">
            <div className="text-center">
              <p className="text-slate-600">Waiting</p>
              <p className="font-bold text-blue-600">{queue.waiting}</p>
            </div>
            <div className="text-center">
              <p className="text-slate-600">Active</p>
              <p className="font-bold text-green-600">{queue.active}</p>
            </div>
            <div className="text-center">
              <p className="text-slate-600">Completed</p>
              <p className="font-bold text-slate-600">{queue.completed}</p>
            </div>
            <div className="text-center">
              <p className="text-slate-600">Failed</p>
              <p className="font-bold text-red-600">{queue.failed}</p>
            </div>
          </div>
        </div>
      ))}
    </div>

    <Link
      href="/super-admin/queues"
      className="block text-center mt-4 text-sm text-orange-600 hover:text-orange-700 font-medium"
    >
      Queue Dashboard →
    </Link>
  </CardBody>
</Card>
```

---

### Widget 9: Security Monitoring
**Location:** Bottom right
**Purpose:** Platform-wide security events

**Design:**
```tsx
<Card className="bg-white shadow-sm">
  <CardHeader>
    <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
      <ShieldAlert className="w-5 h-5 text-red-600" />
      Güvenlik İzleme
    </h3>
  </CardHeader>
  <CardBody>
    <div className="mb-4">
      <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
        <span className="text-sm text-slate-700">Güvenlik Skoru</span>
        <span className="text-2xl font-bold text-green-600">{securityScore}/100</span>
      </div>
    </div>

    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-slate-600">Failed Logins (24h)</span>
        <span className={`font-semibold ${
          security.failedLogins > 10 ? 'text-red-600' : 'text-green-600'
        }`}>
          {security.failedLogins}
        </span>
      </div>
      <div className="flex items-center justify-between text-sm">
        <span className="text-slate-600">Suspicious Activity</span>
        <span className={`font-semibold ${
          security.suspiciousActivity > 0 ? 'text-yellow-600' : 'text-green-600'
        }`}>
          {security.suspiciousActivity}
        </span>
      </div>
      <div className="flex items-center justify-between text-sm">
        <span className="text-slate-600">API Rate Limits Hit</span>
        <span className="font-semibold text-slate-800">{security.rateLimitHits}</span>
      </div>
    </div>

    <div className="mt-4 p-3 bg-slate-50 rounded-lg">
      <p className="text-xs text-slate-600 mb-1">Son Güvenlik Olayı</p>
      <p className="text-sm text-slate-800">
        {security.lastEvent || 'Olay yok ✅'}
      </p>
    </div>

    <Link
      href="/super-admin/security-logs"
      className="block text-center mt-4 text-sm text-red-600 hover:text-red-700 font-medium"
    >
      Güvenlik Logları →
    </Link>
  </CardBody>
</Card>
```

---

## 🛠️ Implementation Tasks

### Task 1: Create Dashboard Component
**File:** `frontend/app/(authenticated)/dashboard/super-admin-dashboard.tsx`

```typescript
'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/lib/store/authStore';
// ... imports

export default function SuperAdminDashboard() {
  const { user } = useAuthStore();
  const [platformStats, setPlatformStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSuperAdminDashboard();
  }, []);

  const loadSuperAdminDashboard = async () => {
    try {
      const response = await fetch('/api/v1/dashboard/super-admin');
      const data = await response.json();
      setPlatformStats(data.data);
    } catch (error) {
      console.error('[SUPER ADMIN DASHBOARD] Load error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <DashboardSkeleton />;

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <SuperAdminHeader platformStats={platformStats.overview} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <MultiOrgOverviewWidget data={platformStats.organizations} />
        <RevenueOverviewWidget data={platformStats.revenue} />
        <PlatformAnalyticsWidget data={platformStats.analytics} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <PlatformGrowthChart data={platformStats.growth} />
        </div>
        <SystemHealthWidget data={platformStats.systemHealth} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <OrganizationListWidget data={platformStats.orgList} />
        <QueueManagementWidget data={platformStats.queues} />
        <SecurityMonitoringWidget data={platformStats.security} />
      </div>
    </div>
  );
}
```

**Commit after Task 1:**
```bash
git add frontend/app/(authenticated)/dashboard/super-admin-dashboard.tsx
git commit -m "feat(dashboard): Add SUPER_ADMIN dashboard component"
```

---

### Task 2: Create Widget Components
**Directory:** `frontend/components/dashboard/super-admin/`

Create 9 widget files:
1. `SuperAdminHeader.tsx`
2. `MultiOrgOverviewWidget.tsx`
3. `RevenueOverviewWidget.tsx`
4. `PlatformAnalyticsWidget.tsx`
5. `PlatformGrowthChart.tsx`
6. `SystemHealthWidget.tsx`
7. `OrganizationListWidget.tsx`
8. `QueueManagementWidget.tsx`
9. `SecurityMonitoringWidget.tsx`

**Commit after Task 2:**
```bash
git add frontend/components/dashboard/super-admin/
git commit -m "feat(dashboard): Add SUPER_ADMIN widget components (9 widgets)"
```

---

### Task 3: Create Backend API
**File:** `backend/src/routes/dashboardRoutes.js`

```javascript
// GET /api/v1/dashboard/super-admin
router.get('/super-admin', [
  authenticateToken,
  authorize([ROLES.SUPER_ADMIN])
], async (req, res) => {
  try {
    // Multi-org overview
    const totalOrganizations = await prisma.organization.count();
    const planCounts = await prisma.organization.groupBy({
      by: ['plan'],
      _count: true
    });

    // Revenue calculation
    const revenue = await calculatePlatformRevenue();

    // Platform analytics
    const analytics = {
      totalAnalyses: await prisma.analysis.count(),
      totalCVs: await prisma.candidate.count(),
      totalJobPostings: await prisma.jobPosting.count(),
      totalOffers: await prisma.offer.count()
    };

    // Growth data (90 days)
    const growthData = await calculatePlatformGrowth(90);

    // System health
    const systemHealth = await checkSystemHealth();

    // Organization list
    const orgList = await prisma.organization.findMany({
      select: {
        id: true,
        name: true,
        plan: true,
        totalUsers: true,
        createdAt: true,
        _count: {
          select: {
            analyses: true,
            candidates: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 10
    });

    // Queue stats
    const queueStats = await getQueueStats();

    // Security monitoring
    const security = await getPlatformSecurityMetrics();

    res.json({
      success: true,
      data: {
        overview: {
          totalOrganizations,
          monthlyRevenue: revenue.mrr,
          totalUsers: analytics.totalUsers,
          uptime: systemHealth.uptime
        },
        organizations: {
          total: totalOrganizations,
          planCounts,
          activeOrgs: totalOrganizations,
          churnedOrgs: 0
        },
        revenue,
        analytics,
        growth: growthData,
        systemHealth,
        orgList,
        queues: queueStats,
        security
      }
    });
  } catch (error) {
    console.error('[DASHBOARD] SUPER_ADMIN error:', error);
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
git commit -m "feat(api): Add SUPER_ADMIN dashboard endpoint"
```

---

### Task 4-7: Integration Tasks
Same as previous workers

---

## 🧪 Testing & Verification

### Test 1: Multi-Org Data
**Verify:** SUPER_ADMIN can see all organizations

```bash
curl -X GET http://localhost:8102/api/v1/dashboard/super-admin \
  -H "Authorization: Bearer [SUPER_ADMIN_TOKEN]"
```

**Expected:** All orgs visible (not just one)

### Test 2: System Health
**Verify:** All services status accurate

### Test 3: Queue Management
**Verify:** Queue stats correct

### Test 4: Revenue Tracking
**Verify:** MRR calculation accurate

### Test 5: Security Monitoring
**Verify:** Failed login tracking works

---

## 📝 Verification Report Template

```markdown
# ✅ Worker 5 Verification Report: SUPER_ADMIN Dashboard

**Task ID:** W5-SUPER-ADMIN-DASHBOARD
**Duration:** [TIME]

## Tasks Completed
- [x] All 7 tasks

## Test Results
- All tests: ✅ PASS

## Summary
**Widgets:** 9
**Multi-org:** ✅ Works
**Status:** ✅ SUCCESS
```

---

## ✅ Task Checklist

- [ ] Task 1: Dashboard component → Commit
- [ ] Task 2: 9 widgets → Commit
- [ ] Task 3: Backend API → Commit
- [ ] Task 4-7: Integration → 4 Commits
- [ ] Run all tests
- [ ] Write report

---

**Estimated Time:** ~6-7 hours

**Ready to start? Good luck, Worker 5! 🚀**

**Created by:** Mod Claude
**Date:** 2025-11-04
**Version:** 1.0
