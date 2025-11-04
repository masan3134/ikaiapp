# 📋 Worker 4 Task: ADMIN Dashboard Design & Implementation

**Task ID:** W4-ADMIN-DASHBOARD
**Assigned to:** Worker Claude 4
**Created by:** Mod Claude
**Date:** 2025-11-04
**Estimated Duration:** 5-6 hours
**Priority:** HIGH
**Complexity:** HIGH
**Role:** ADMIN (Organization admin - full control)

---

## 🎯 Task Overview

**Mission:** Design and implement a beautiful, control-focused dashboard for ADMIN role with emphasis on organization management, user administration, and billing oversight.

**Design Philosophy:**
- **Full Control:** Organization settings, user management, billing
- **Authority:** Purple colors symbolizing power, premium, administration
- **Oversight:** Team activity, usage metrics, security monitoring
- **Efficiency:** Quick access to all admin functions

**Expected Outcome:**
- ✅ Beautiful ADMIN dashboard with 8 widgets
- ✅ Purple/Violet color scheme (authority, premium)
- ✅ Responsive grid layout
- ✅ Real-time organization metrics
- ✅ User management widgets
- ✅ Billing & usage overview

---

## 🎨 Design Specifications

### Color Palette (Purple/Violet Theme)

```typescript
const ADMIN_THEME = {
  primary: {
    50: '#faf5ff',   // Lightest
    100: '#f3e8ff',
    200: '#e9d5ff',
    300: '#d8b4fe',
    400: '#c084fc',
    500: '#a855f7',  // Main (Purple)
    600: '#9333ea',
    700: '#7e22ce',
    800: '#6b21a8',
    900: '#581c87',  // Darkest
  },
  accent: {
    blue: '#3b82f6',    // Info
    green: '#10b981',   // Success
    yellow: '#f59e0b',  // Warning
    red: '#ef4444',     // Alert
    indigo: '#6366f1',  // Secondary
  },
  gradient: {
    header: 'from-purple-600 to-purple-800',
    card: 'from-purple-50 to-white',
    hover: 'from-purple-100 to-purple-50',
    premium: 'from-violet-400 to-purple-600',
  }
};
```

---

## 📐 Dashboard Layout

```
┌──────────────────────────────────────────────────────────────┐
│  👑 Admin Dashboard - [Org Name]            🔔 [Bell] [⚙️]   │
│  Plan: [PLAN] • Users: [X/Y] • Usage: [Z%]                   │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │  🏢 Org      │  │  👥 User     │  │  💳 Billing  │       │
│  │  Overview    │  │  Management  │  │  Overview    │       │
│  │              │  │              │  │              │       │
│  │  [Stats]     │  │  [Team Size] │  │  [Plan Info] │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
│                                                               │
│  ┌────────────────────────────────────┐  ┌──────────────┐   │
│  │  📈 Usage Metrics (Monthly Trend)   │  │  ⚡ Quick    │   │
│  │                                     │  │  Settings    │   │
│  │  [Line chart - Analysis, CVs, Users]│  │              │   │
│  │                                     │  │  → Org Info  │   │
│  │  Limits: Analysis, CV, Users        │  │  → Invite    │   │
│  └────────────────────────────────────┘  └──────────────┘   │
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │  📋 Team     │  │  🔐 Security │  │  📊 Org      │       │
│  │  Activity    │  │  Overview    │  │  Health      │       │
│  │              │  │              │  │              │       │
│  │  [Feed]      │  │  [2FA, etc]  │  │  [Score]     │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
└──────────────────────────────────────────────────────────────┘
```

---

## 🧩 Widget Specifications

### Widget 1: Welcome Header (Organization Overview)
**Location:** Top (full width)
**Purpose:** Organization-level metrics and quick info

**Design:**
```tsx
<div className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-xl p-6 mb-6 text-white">
  <div className="flex justify-between items-start">
    <div>
      <div className="flex items-center gap-3 mb-2">
        <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
          <Crown className="w-7 h-7 text-yellow-300" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">
            Admin Dashboard
          </h1>
          <p className="text-purple-100 text-sm">
            {organization.name}
          </p>
        </div>
      </div>
      <div className="flex gap-6 text-sm mt-4">
        <div className="flex items-center gap-2 bg-purple-700/40 px-3 py-1.5 rounded-lg backdrop-blur">
          <Sparkles className="w-4 h-4" />
          <span>Plan: {organization.plan}</span>
        </div>
        <div className="flex items-center gap-2 bg-purple-700/40 px-3 py-1.5 rounded-lg backdrop-blur">
          <Users className="w-4 h-4" />
          <span>{organization.totalUsers}/{organization.maxUsers} Kullanıcı</span>
        </div>
        <div className="flex items-center gap-2 bg-purple-700/40 px-3 py-1.5 rounded-lg backdrop-blur">
          <BarChart3 className="w-4 h-4" />
          <span>{usage.analysisPercentage}% Analiz Kullanımı</span>
        </div>
        <div className="flex items-center gap-2 bg-purple-700/40 px-3 py-1.5 rounded-lg backdrop-blur">
          <FileText className="w-4 h-4" />
          <span>{usage.cvPercentage}% CV Kullanımı</span>
        </div>
      </div>
    </div>
    <div className="flex items-center gap-3">
      <NotificationBell />
      <Link
        href="/settings/organization"
        className="p-2 bg-white/20 hover:bg-white/30 rounded-lg backdrop-blur transition-colors"
      >
        <Settings className="w-5 h-5" />
      </Link>
    </div>
  </div>
</div>
```

---

### Widget 2: Organization Stats
**Location:** Top left
**Purpose:** Key organization metrics

**Metrics:**
- Total users (vs limit)
- Active users today
- Plan type
- Subscription status

**Design:**
```tsx
<Card className="bg-white shadow-sm hover:shadow-md transition-all group">
  <CardBody className="relative overflow-hidden">
    <div className="absolute -right-8 -top-8 w-32 h-32 bg-purple-100 rounded-full opacity-20 group-hover:scale-110 transition-transform" />

    <div className="relative">
      <div className="flex items-center justify-between mb-4">
        <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
          <Building2 className="w-6 h-6 text-purple-600" />
        </div>
        <span className={`text-xs px-2 py-1 rounded font-medium ${
          organization.plan === 'ENTERPRISE' ? 'bg-purple-100 text-purple-700' :
          organization.plan === 'PRO' ? 'bg-blue-100 text-blue-700' :
          'bg-slate-100 text-slate-700'
        }`}>
          {organization.plan}
        </span>
      </div>

      <h3 className="text-2xl font-bold text-slate-800 mb-1">
        {organization.totalUsers}
        <span className="text-lg text-slate-400">/{organization.maxUsers}</span>
      </h3>
      <p className="text-sm text-slate-600 mb-3">
        Toplam Kullanıcı
      </p>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-600">Bugün Aktif</span>
          <span className="font-semibold text-green-600">{activeToday}</span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-purple-500 to-purple-700 h-2 rounded-full transition-all"
            style={{ width: `${(organization.totalUsers / organization.maxUsers) * 100}%` }}
          />
        </div>
      </div>

      <Link
        href="/team"
        className="mt-4 text-sm text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1"
      >
        Kullanıcıları Yönet
        <ChevronRight className="w-4 h-4" />
      </Link>
    </div>
  </CardBody>
</Card>
```

---

### Widget 3: User Management Quick Access
**Location:** Top center
**Purpose:** Quick user management actions

**Actions:**
- Invite new user
- Manage roles
- View activity logs
- Deactivate users

**Design:**
```tsx
<Card className="bg-gradient-to-br from-indigo-50 to-white shadow-sm hover:shadow-md transition-shadow">
  <CardHeader>
    <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
      <UserPlus className="w-5 h-5 text-indigo-600" />
      Kullanıcı Yönetimi
    </h3>
  </CardHeader>
  <CardBody>
    <div className="grid grid-cols-2 gap-3">
      <button className="p-4 bg-white rounded-lg border border-indigo-200 hover:border-indigo-400 hover:bg-indigo-50 transition-all group">
        <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center mb-2 mx-auto group-hover:scale-110 transition-transform">
          <UserPlus className="w-5 h-5 text-indigo-600" />
        </div>
        <p className="text-sm font-medium text-slate-800">Davet Et</p>
        <p className="text-xs text-slate-500">Yeni kullanıcı</p>
      </button>

      <button className="p-4 bg-white rounded-lg border border-purple-200 hover:border-purple-400 hover:bg-purple-50 transition-all group">
        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-2 mx-auto group-hover:scale-110 transition-transform">
          <Shield className="w-5 h-5 text-purple-600" />
        </div>
        <p className="text-sm font-medium text-slate-800">Roller</p>
        <p className="text-xs text-slate-500">Yetki yönetimi</p>
      </button>

      <button className="p-4 bg-white rounded-lg border border-blue-200 hover:border-blue-400 hover:bg-blue-50 transition-all group">
        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-2 mx-auto group-hover:scale-110 transition-transform">
          <Activity className="w-5 h-5 text-blue-600" />
        </div>
        <p className="text-sm font-medium text-slate-800">Aktivite</p>
        <p className="text-xs text-slate-500">Kullanıcı logları</p>
      </button>

      <button className="p-4 bg-white rounded-lg border border-slate-200 hover:border-slate-400 hover:bg-slate-50 transition-all group">
        <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center mb-2 mx-auto group-hover:scale-110 transition-transform">
          <UserMinus className="w-5 h-5 text-slate-600" />
        </div>
        <p className="text-sm font-medium text-slate-800">Deaktif Et</p>
        <p className="text-xs text-slate-500">Erişim kapat</p>
      </button>
    </div>

    <div className="mt-4 p-3 bg-purple-50 rounded-lg">
      <div className="flex items-center justify-between text-sm">
        <span className="text-slate-700">Son Giriş</span>
        <span className="font-medium text-purple-600">{lastLogin}</span>
      </div>
    </div>
  </CardBody>
</Card>
```

---

### Widget 4: Billing Overview
**Location:** Top right
**Purpose:** Subscription and billing information

**Metrics:**
- Current plan
- Monthly cost
- Next billing date
- Usage vs limits

**Design:**
```tsx
<Card className="bg-gradient-to-br from-purple-50 to-white shadow-sm hover:shadow-md transition-shadow border-l-4 border-purple-500">
  <CardHeader>
    <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
      <CreditCard className="w-5 h-5 text-purple-600" />
      Faturalandırma
    </h3>
  </CardHeader>
  <CardBody>
    <div className="mb-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-slate-600">Mevcut Plan</span>
        <span className={`text-sm font-bold px-3 py-1 rounded-full ${
          organization.plan === 'ENTERPRISE' ? 'bg-purple-100 text-purple-700' :
          organization.plan === 'PRO' ? 'bg-blue-100 text-blue-700' :
          'bg-slate-100 text-slate-700'
        }`}>
          {organization.plan}
        </span>
      </div>

      <div className="bg-purple-50 rounded-lg p-4 mb-4">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-purple-600">
            ₺{billing.monthlyAmount}
          </span>
          <span className="text-sm text-slate-600">/ay</span>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          Sonraki fatura: {formatDate(billing.nextBillingDate)}
        </p>
      </div>

      <div className="space-y-2">
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-slate-600">Analiz Kullanımı</span>
            <span className="font-semibold">{usage.analysisPercentage}%</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all ${
                usage.analysisPercentage >= 90 ? 'bg-red-500' :
                usage.analysisPercentage >= 75 ? 'bg-yellow-500' :
                'bg-green-500'
              }`}
              style={{ width: `${usage.analysisPercentage}%` }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-slate-600">CV Kullanımı</span>
            <span className="font-semibold">{usage.cvPercentage}%</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all ${
                usage.cvPercentage >= 90 ? 'bg-red-500' :
                usage.cvPercentage >= 75 ? 'bg-yellow-500' :
                'bg-green-500'
              }`}
              style={{ width: `${usage.cvPercentage}%` }}
            />
          </div>
        </div>
      </div>

      <Link
        href="/settings/billing"
        className="block mt-4 text-center text-sm text-purple-600 hover:text-purple-700 font-medium"
      >
        Planı Yönet →
      </Link>
    </div>
  </CardBody>
</Card>
```

---

### Widget 5: Usage Metrics Chart
**Location:** Middle left (2 columns wide)
**Purpose:** Monthly usage trends (analysis, CVs, users)

**Chart Type:** Multi-line area chart
**Data:** Last 30 days

**Design:**
```tsx
<Card className="bg-white shadow-sm">
  <CardHeader>
    <div className="flex items-center justify-between">
      <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
        <TrendingUp className="w-5 h-5 text-purple-600" />
        Kullanım Metrikleri (30 Gün)
      </h3>
      <div className="flex gap-2">
        <button className="text-xs px-3 py-1 rounded bg-purple-100 text-purple-700 font-medium">
          Analiz
        </button>
        <button className="text-xs px-3 py-1 rounded bg-slate-100 text-slate-700">
          CV
        </button>
        <button className="text-xs px-3 py-1 rounded bg-slate-100 text-slate-700">
          Kullanıcı
        </button>
      </div>
    </div>
  </CardHeader>
  <CardBody>
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={usageTrend}>
        <defs>
          <linearGradient id="analysisGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#a855f7" stopOpacity={0.4}/>
            <stop offset="100%" stopColor="#a855f7" stopOpacity={0.1}/>
          </linearGradient>
          <linearGradient id="cvGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.4}/>
            <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.1}/>
          </linearGradient>
          <linearGradient id="userGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10b981" stopOpacity={0.4}/>
            <stop offset="100%" stopColor="#10b981" stopOpacity={0.1}/>
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
        />
        <Tooltip
          contentStyle={{
            backgroundColor: '#fff',
            border: '1px solid #e9d5ff',
            borderRadius: '8px'
          }}
        />
        <Legend />
        <Area
          type="monotone"
          dataKey="analyses"
          stroke="#a855f7"
          fill="url(#analysisGrad)"
          name="Analizler"
        />
        <Area
          type="monotone"
          dataKey="cvs"
          stroke="#3b82f6"
          fill="url(#cvGrad)"
          name="CV'ler"
        />
        <Area
          type="monotone"
          dataKey="activeUsers"
          stroke="#10b981"
          fill="url(#userGrad)"
          name="Aktif Kullanıcılar"
        />
      </AreaChart>
    </ResponsiveContainer>

    <div className="mt-4 grid grid-cols-3 gap-4 p-4 bg-purple-50 rounded-lg">
      <div className="text-center">
        <p className="text-xs text-slate-600 mb-1">Analiz Limiti</p>
        <p className="text-sm font-bold text-purple-600">
          {usage.monthlyAnalysisCount}/{usage.maxAnalysisPerMonth}
        </p>
      </div>
      <div className="text-center">
        <p className="text-xs text-slate-600 mb-1">CV Limiti</p>
        <p className="text-sm font-bold text-blue-600">
          {usage.monthlyCvCount}/{usage.maxCvPerMonth}
        </p>
      </div>
      <div className="text-center">
        <p className="text-xs text-slate-600 mb-1">Kullanıcı Limiti</p>
        <p className="text-sm font-bold text-green-600">
          {usage.totalUsers}/{usage.maxUsers}
        </p>
      </div>
    </div>
  </CardBody>
</Card>
```

---

### Widget 6: Quick Settings
**Location:** Middle right
**Purpose:** Fast access to organization settings

**Actions:**
- Edit organization info
- Invite team member
- View billing
- Security settings
- Usage reports

**Design:**
```tsx
<Card className="bg-white shadow-sm">
  <CardHeader>
    <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
      <Zap className="w-5 h-5 text-yellow-600" />
      Hızlı Ayarlar
    </h3>
  </CardHeader>
  <CardBody>
    <div className="space-y-2">
      {[
        {
          icon: <Building2 className="w-5 h-5 text-purple-600" />,
          title: 'Organizasyon Bilgileri',
          description: 'İsim, logo, sektör',
          path: '/settings/organization',
          color: 'purple'
        },
        {
          icon: <UserPlus className="w-5 h-5 text-indigo-600" />,
          title: 'Kullanıcı Davet Et',
          description: 'Takıma yeni üye ekle',
          action: 'invite',
          color: 'indigo'
        },
        {
          icon: <CreditCard className="w-5 h-5 text-blue-600" />,
          title: 'Faturalandırma',
          description: 'Plan ve ödeme',
          path: '/settings/billing',
          color: 'blue'
        },
        {
          icon: <Shield className="w-5 h-5 text-green-600" />,
          title: 'Güvenlik',
          description: '2FA, oturum yönetimi',
          path: '/settings/security',
          color: 'green'
        },
        {
          icon: <BarChart3 className="w-5 h-5 text-cyan-600" />,
          title: 'Kullanım Raporları',
          description: 'Detaylı analitik',
          path: '/analytics',
          color: 'cyan'
        }
      ].map(action => (
        <Link
          key={action.title}
          href={action.path || '#'}
          onClick={action.action ? () => handleAction(action.action) : undefined}
          className={`flex items-center gap-3 p-3 rounded-lg hover:bg-${action.color}-50 transition-colors group`}
        >
          <div className={`w-10 h-10 bg-${action.color}-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
            {action.icon}
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-slate-800">{action.title}</p>
            <p className="text-xs text-slate-500">{action.description}</p>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />
        </Link>
      ))}
    </div>
  </CardBody>
</Card>
```

---

### Widget 7: Team Activity Feed
**Location:** Bottom left
**Purpose:** Recent team actions and events

**Design:**
```tsx
<Card className="bg-white shadow-sm">
  <CardHeader>
    <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
      <Activity className="w-5 h-5 text-blue-600" />
      Takım Aktiviteleri
    </h3>
  </CardHeader>
  <CardBody>
    <div className="space-y-3">
      {teamActivity.slice(0, 6).map(activity => (
        <div
          key={activity.id}
          className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors"
        >
          <div className="flex-shrink-0">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              activity.type === 'CV_UPLOAD' ? 'bg-green-100' :
              activity.type === 'ANALYSIS' ? 'bg-purple-100' :
              activity.type === 'OFFER' ? 'bg-blue-100' :
              activity.type === 'INTERVIEW' ? 'bg-yellow-100' :
              'bg-slate-100'
            }`}>
              {getActivityIcon(activity.type)}
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-slate-800">
              <span className="font-medium">{activity.user.name}</span>
              {' '}
              {activity.action}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              {formatRelativeTime(activity.createdAt)}
            </p>
          </div>
        </div>
      ))}
    </div>
    <button className="w-full mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium">
      Tüm Aktiviteler →
    </button>
  </CardBody>
</Card>
```

---

### Widget 8: Security Overview
**Location:** Bottom center
**Purpose:** Security and compliance status

**Metrics:**
- 2FA enabled users
- Active sessions
- Recent security events
- Compliance score

**Design:**
```tsx
<Card className="bg-white shadow-sm">
  <CardHeader>
    <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
      <Shield className="w-5 h-5 text-green-600" />
      Güvenlik Durumu
    </h3>
  </CardHeader>
  <CardBody>
    <div className="space-y-4">
      <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-800">2FA Aktif</p>
            <p className="text-xs text-slate-500">
              {security.twoFactorUsers}/{organization.totalUsers} kullanıcı
            </p>
          </div>
        </div>
        <span className="text-lg font-bold text-green-600">
          {Math.round((security.twoFactorUsers / organization.totalUsers) * 100)}%
        </span>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-600">Aktif Oturumlar</span>
          <span className="font-semibold text-blue-600">{security.activeSessions}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-600">Son Güvenlik Olayı</span>
          <span className="font-semibold text-slate-800">
            {security.lastSecurityEvent ? formatRelativeTime(security.lastSecurityEvent) : 'Yok'}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-600">Uyumluluk Skoru</span>
          <span className="font-semibold text-green-600">{security.complianceScore}%</span>
        </div>
      </div>

      <Link
        href="/settings/security"
        className="block text-center mt-4 text-sm text-green-600 hover:text-green-700 font-medium"
      >
        Güvenlik Ayarları →
      </Link>
    </div>
  </CardBody>
</Card>
```

---

### Widget 9: Organization Health Score
**Location:** Bottom right
**Purpose:** Overall organization health rating

**Design:**
```tsx
<Card className="bg-gradient-to-br from-purple-50 to-white shadow-sm">
  <CardHeader>
    <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
      <Heart className="w-5 h-5 text-purple-600" />
      Organizasyon Sağlığı
    </h3>
  </CardHeader>
  <CardBody>
    <div className="text-center mb-4">
      <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full mb-3">
        <div className="text-center">
          <p className="text-3xl font-bold text-purple-600">{healthScore}</p>
          <p className="text-xs text-purple-700">Skor</p>
        </div>
      </div>
      <p className={`text-sm font-medium ${
        healthScore >= 90 ? 'text-green-600' :
        healthScore >= 70 ? 'text-blue-600' :
        healthScore >= 50 ? 'text-yellow-600' : 'text-red-600'
      }`}>
        {healthScore >= 90 ? 'Mükemmel' :
         healthScore >= 70 ? 'İyi' :
         healthScore >= 50 ? 'Orta' : 'Dikkat Gerekli'}
      </p>
    </div>

    <div className="space-y-3">
      {healthFactors.map(factor => (
        <div key={factor.name} className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${
              factor.status === 'good' ? 'bg-green-500' :
              factor.status === 'warning' ? 'bg-yellow-500' :
              'bg-red-500'
            }`} />
            <span className="text-sm text-slate-700">{factor.name}</span>
          </div>
          <span className="text-xs text-slate-600">{factor.score}%</span>
        </div>
      ))}
    </div>

    <button className="w-full mt-4 bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg text-sm font-medium transition-colors">
      Detaylı Rapor
    </button>
  </CardBody>
</Card>
```

---

## 🛠️ Implementation Tasks

### Task 1: Create Dashboard Component
**File:** `frontend/app/(authenticated)/dashboard/admin-dashboard.tsx`

```typescript
'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/lib/store/authStore';
import { useOrganization } from '@/contexts/OrganizationContext';
// ... imports

export default function AdminDashboard() {
  const { user } = useAuthStore();
  const { organization, usage } = useOrganization();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAdminDashboard();
  }, []);

  const loadAdminDashboard = async () => {
    try {
      const response = await fetch('/api/v1/dashboard/admin');
      const data = await response.json();
      setStats(data.data);
    } catch (error) {
      console.error('[ADMIN DASHBOARD] Load error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <DashboardSkeleton />;

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <AdminWelcomeHeader
        user={user}
        organization={organization}
        usage={usage}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <OrganizationStatsWidget data={stats.orgStats} />
        <UserManagementWidget data={stats.userManagement} />
        <BillingOverviewWidget
          organization={organization}
          usage={usage}
          billing={stats.billing}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <UsageMetricsChart data={stats.usageTrend} />
        </div>
        <QuickSettingsWidget />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <TeamActivityWidget data={stats.teamActivity} />
        <SecurityOverviewWidget data={stats.security} />
        <OrganizationHealthWidget data={stats.health} />
      </div>
    </div>
  );
}
```

**Commit after Task 1:**
```bash
git add frontend/app/(authenticated)/dashboard/admin-dashboard.tsx
git commit -m "feat(dashboard): Add ADMIN dashboard component"
```

---

### Task 2: Create Widget Components
**Directory:** `frontend/components/dashboard/admin/`

Create 8 widget files:
1. `AdminWelcomeHeader.tsx`
2. `OrganizationStatsWidget.tsx`
3. `UserManagementWidget.tsx`
4. `BillingOverviewWidget.tsx`
5. `UsageMetricsChart.tsx`
6. `QuickSettingsWidget.tsx`
7. `TeamActivityWidget.tsx`
8. `SecurityOverviewWidget.tsx`
9. `OrganizationHealthWidget.tsx`

**Commit after Task 2:**
```bash
git add frontend/components/dashboard/admin/
git commit -m "feat(dashboard): Add ADMIN dashboard widget components (9 widgets)"
```

---

### Task 3: Create Backend API
**File:** `backend/src/routes/dashboardRoutes.js`

```javascript
// GET /api/v1/dashboard/admin
router.get('/admin', [
  authenticateToken,
  enforceOrganizationIsolation,
  authorize(ROLE_GROUPS.ADMINS)
], async (req, res) => {
  try {
    const organizationId = req.organizationId;

    // Organization stats
    const orgStats = {
      totalUsers: await prisma.user.count({ where: { organizationId } }),
      activeToday: await getActiveTodayCount(organizationId),
      plan: req.organization.plan
    };

    // Billing info
    const billing = {
      monthlyAmount: getPlanPrice(req.organization.plan),
      nextBillingDate: req.organization.billingCycleStart
    };

    // Usage trend (last 30 days)
    const usageTrend = await calculateUsageTrend(organizationId, 30);

    // Team activity (last 20 actions)
    const teamActivity = await prisma.activityLog.findMany({
      where: { organizationId },
      include: {
        user: { select: { firstName: true, lastName: true } }
      },
      orderBy: { createdAt: 'desc' },
      take: 20
    });

    // Security metrics
    const security = {
      twoFactorUsers: await prisma.user.count({
        where: { organizationId, twoFactorEnabled: true }
      }),
      activeSessions: await getActiveSessionCount(organizationId),
      lastSecurityEvent: await getLastSecurityEvent(organizationId),
      complianceScore: calculateComplianceScore(req.organization)
    };

    // Health score
    const health = calculateOrganizationHealth(req.organization, orgStats, security);

    res.json({
      success: true,
      data: {
        orgStats,
        userManagement: orgStats,
        billing,
        usageTrend,
        teamActivity,
        security,
        health
      }
    });
  } catch (error) {
    console.error('[DASHBOARD] ADMIN error:', error);
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
git commit -m "feat(api): Add ADMIN dashboard endpoint"
```

---

### Task 4-7: Integration Tasks
- Task 4: Update dashboard routing (add ADMIN case)
- Task 5: Add recharts (if not installed)
- Task 6: Update dashboard layout
- Task 7: Add ADMIN skeleton

**Commits:** 1 per task

---

## 🧪 Testing & Verification

### Test 1: Visual Check
- All 8 widgets visible
- Purple color scheme applied
- Responsive layout working

### Test 2: API Data
```bash
curl -X GET http://localhost:8102/api/v1/dashboard/admin \
  -H "Authorization: Bearer [ADMIN_TOKEN]"
```

### Test 3: Organization Management
- Edit organization button works
- Invite user modal opens
- Settings links navigate correctly

### Test 4: Billing Widget
- Plan information correct
- Usage percentages accurate
- Upgrade/downgrade links work

### Test 5: Team Activity
- Recent actions displayed
- Real-time updates working
- Activity types properly categorized

---

## 📝 Verification Report Template

```markdown
# ✅ Worker 4 Verification Report: ADMIN Dashboard

**Task ID:** W4-ADMIN-DASHBOARD
**Duration:** [TIME]

## Tasks Completed
- [x] All 7 tasks

## Test Results
- Test 1-5: ✅ PASS

## Summary
**Widgets:** 9
**API Endpoints:** 1
**Commits:** 7
**Status:** ✅ SUCCESS
```

---

## ✅ Task Checklist

- [ ] Task 1: Component → Commit
- [ ] Task 2: Widgets → Commit
- [ ] Task 3: Backend API → Commit
- [ ] Task 4-7: Integration → 4 Commits
- [ ] Run all tests
- [ ] Write report

---

**Estimated Time:** ~5-6 hours

**Ready to start? Good luck, Worker 4! 🚀**

**Created by:** Mod Claude
**Date:** 2025-11-04
**Version:** 1.0
