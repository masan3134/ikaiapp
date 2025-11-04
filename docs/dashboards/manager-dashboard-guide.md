# MANAGER Dashboard - Implementation Guide

**Version:** 1.0
**Date:** 2025-11-04
**Author:** Worker Claude 3
**Role:** MANAGER (Department Manager)

---

## 🎯 Overview

The **MANAGER Dashboard** is designed for department managers with a focus on:
- **Team Management** - Monitor team performance and productivity
- **Analytics** - Department metrics, hiring statistics, KPIs
- **Decision Support** - Action items, approval queues, urgent tasks
- **Leadership Tools** - Interview schedules, budget tracking, strategic KPIs

**Theme:** Blue/Cyan (symbolizing leadership, trust, analytics)

---

## 📐 Layout Structure

### Grid System
- **Top Row:** 3 columns (Team Performance, Dept Analytics, Action Items)
- **Middle Row:** 2 columns + 1 column (Performance Trend Chart + Approval Queue)
- **Bottom Row:** 3 columns (Interview Schedule, Monthly KPIs, Budget Overview)

### Responsive Design
- **Mobile:** 1 column stack
- **Tablet:** 2-3 column grid
- **Desktop:** Full 3-column layout

---

## 🧩 Widgets (8 Total)

### 1. Manager Welcome Header
**Purpose:** Overview of team size, projects, performance, budget
**Color:** Blue gradient (`from-blue-600 to-blue-800`)
**Metrics:**
- Team Size (12 people)
- Active Projects (5)
- Performance Score (87%)
- Budget Used (65%)

---

### 2. Team Performance Widget
**Purpose:** Team metrics at a glance
**Metrics:**
- Team Score (87/100)
- Active Members (10/12)
- Completed Tasks (45)
- Satisfaction (92%)

**Visual:** Circular score badge with gradient background

---

### 3. Department Analytics Widget
**Purpose:** Key hiring metrics with trends
**Color:** Cyan gradient (`from-cyan-50 to-white`)
**Metrics:**
- Monthly Hires (8, +15%)
- Avg Time to Hire (18 days, -5%)
- Acceptance Rate (85%, +10%)
- Cost Per Hire (₺5,200, -8%)

**Visual:** 2x2 grid with colored badges and trend arrows

---

### 4. Action Items Widget
**Purpose:** Urgent tasks requiring attention
**Color:** Yellow accent (`from-yellow-50 to-white`)
**Categories:**
- Urgent (3 items - red badge)
- Approval Pending (7 items - yellow badge)
- Due Today (12 items - blue badge)

**CTA:** "Tümünü Görüntüle" button (yellow)

---

### 5. Team Performance Trend Chart
**Purpose:** 30-day performance visualization
**Chart Type:** Bar chart placeholder (can be upgraded to line chart with recharts)
**Metrics:**
- Productivity: 88%
- Quality: 92%
- Delivery: 85%

**Visual:** Gradient bars with legend below

---

### 6. Approval Queue Widget
**Purpose:** Items waiting for manager approval
**Item Types:**
- OFFER (purple badge) - Job offers
- BUDGET (yellow badge) - Budget requests
- LEAVE (blue badge) - Leave requests

**Actions:** Quick approve/reject buttons (green/red)

**Empty State:** "Tüm işler onaylandı! 🎉"

---

### 7. Interview Schedule Widget
**Purpose:** Upcoming interviews
**Display:** Calendar-style cards
**Info:**
- Date (month/day badge)
- Candidate name
- Job position
- Time (HH:MM)

**Link:** "Tüm Mülakatlar →"

---

### 8. Monthly KPIs Widget
**Purpose:** Department KPIs vs targets
**Color:** Blue gradient background
**KPIs:**
- İşe Alım Hedefi (8/10 = 80%)
- Mülakat Sayısı (18/20 = 90%)
- Pozisyon Doldurma (6/8 = 75%)
- Takım Memnuniyeti (92/100 = 92%)

**Visual:** Progress bars with color coding:
- Green: ≥100%
- Blue: 75-99%
- Yellow: 50-74%
- Red: <50%

---

## 🔌 API Integration

### Endpoint
```
GET /api/v1/dashboard/manager
```

### Authorization
- **Roles:** MANAGER, ADMIN, SUPER_ADMIN
- **Middleware:** authenticateToken, enforceOrganizationIsolation, authorize(ROLE_GROUPS.MANAGERS_PLUS)

### Response Structure
```json
{
  "success": true,
  "data": {
    "overview": { teamSize, activeProjects, performance, budgetUsed },
    "teamPerformance": { teamScore, activeMembers, totalMembers, completedTasks, satisfaction },
    "departmentAnalytics": { monthHires, hiresChange, avgTimeToHire, ... },
    "actionItems": { urgentCount, approvalCount, todayTasksCount },
    "performanceTrend": { trend[], currentProductivity, currentQuality, currentDelivery },
    "approvalQueue": { queue[] },
    "interviews": { upcomingInterviews[] },
    "kpis": { kpis[] }
  },
  "timestamp": "2025-11-04T10:30:00.000Z"
}
```

---

## 🎨 Color Palette

### Primary Colors
- **Blue 600:** `#2563eb` - Main brand color
- **Blue 800:** `#1e40af` - Header gradient
- **Cyan 600:** `#06b6d4` - Analytics accent

### Accent Colors
- **Green 600:** `#10b981` - Success/Approve
- **Yellow 600:** `#f59e0b` - Warning/Pending
- **Red 600:** `#ef4444` - Urgent/Reject
- **Purple 600:** `#8b5cf6` - Offers/Premium

### Backgrounds
- **Blue 50:** `#eff6ff` - Light backgrounds
- **Cyan 50:** `#ecfeff` - Analytics widget bg
- **Slate 50:** `#f8fafc` - Page background

---

## 📱 Responsive Breakpoints

```css
/* Mobile First */
grid-cols-1            /* < 768px */
md:grid-cols-3         /* ≥ 768px */
lg:grid-cols-3         /* ≥ 1024px */
lg:col-span-2          /* Performance chart takes 2 cols */
```

---

## 🔄 Loading States

### Skeleton
- **Component:** `<LoadingSkeleton variant="grid" rows={3} columns={3} />`
- **Location:** While fetching API data
- **Duration:** Until `setLoading(false)`

### Error State
- **Display:** Red error box with retry button
- **Message:** "Dashboard verileri yüklenemedi"
- **Action:** Retry fetch on button click

---

## ✅ Implementation Checklist

- [x] 8 widget components created
- [x] Blue/Cyan color scheme applied
- [x] Responsive grid layout
- [x] Backend API endpoint (`/api/v1/dashboard/manager`)
- [x] Role-based routing (MANAGER → ManagerDashboard)
- [x] Loading skeleton integration
- [x] Error handling
- [x] Mock data for development

---

## 🚀 Future Enhancements

1. **Real Data Integration**
   - Connect to actual team metrics
   - Fetch real approval queue from DB
   - Pull interview schedules from calendar

2. **Chart Upgrades**
   - Replace bar chart placeholder with recharts LineChart
   - Add interactive tooltips
   - Multi-metric trend lines

3. **Real-time Updates**
   - WebSocket for approval queue updates
   - Live team performance metrics
   - Notification badges

4. **Export Features**
   - PDF export of KPI reports
   - CSV download of team metrics
   - Email summaries

5. **Filtering & Customization**
   - Date range selector
   - Widget reordering
   - Custom KPI targets

---

## 📦 File Structure

```
frontend/
├── components/
│   └── dashboard/
│       ├── ManagerDashboard.tsx (Main component)
│       └── manager/
│           ├── ManagerWelcomeHeader.tsx
│           ├── TeamPerformanceWidget.tsx
│           ├── DepartmentAnalyticsWidget.tsx
│           ├── ActionItemsWidget.tsx
│           ├── TeamPerformanceTrendWidget.tsx
│           ├── ApprovalQueueWidget.tsx
│           ├── InterviewScheduleWidget.tsx
│           └── MonthlyKPIsWidget.tsx

backend/
├── src/
│   ├── controllers/
│   │   └── dashboardController.js (getManagerDashboard)
│   └── routes/
│       └── dashboardRoutes.js (GET /manager)
```

---

**Status:** ✅ COMPLETE
**Production Ready:** YES (with mock data)
**Next Steps:** Replace mock data with real DB queries

---

**Created by:** Worker Claude 3
**Task:** W3-MANAGER-DASHBOARD
**Date:** 2025-11-04
