# 🔍 REAL DATA VALIDATION PROMPTS - 5 Workers

**Created:** 2025-11-04
**Purpose:** Ensure ALL dashboard data is REAL (no mock data)
**Duration per worker:** 1-2 hours

---

## 📋 W1: USER Dashboard - Real Data Validation

```
"sen workersin"

🎯 GÖREV: USER Dashboard Real Data Doğrulama

📖 SENİN DOSYALARIN:
- frontend/app/(authenticated)/dashboard/user-dashboard.tsx
- frontend/components/dashboard/user/* (8 widget)
- backend/src/routes/dashboardRoutes.js (GET /user endpoint)

🔍 KONTROL ET:

1. Backend API (/api/v1/dashboard/user)
   ✅ Prisma query'leri var mı?
   ❌ Mock data var mı? (örnek: loginTime: "09:30" hardcoded)

   Kontrol komutları:
   ```bash
   grep -n "loginTime.*:" backend/src/routes/dashboardRoutes.js
   grep -n "TODO\|MOCK\|FAKE\|hardcoded" backend/src/routes/dashboardRoutes.js
   grep -c "prisma\." backend/src/routes/dashboardRoutes.js
   ```

2. Frontend Widget'ları
   ✅ API fetch var mı?
   ❌ Hardcoded data var mı?

   Kontrol komutları:
   ```bash
   grep -r "const.*=.*\[" frontend/components/dashboard/user/ | grep -v "useState\|Props"
   grep -r "TODO\|MOCK" frontend/components/dashboard/user/
   ```

3. API Testi
   ```bash
   # Login
   TOKEN=$(curl -s -X POST http://localhost:8102/api/v1/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"test-user@test-org-1.com","password":"TestPass123!"}' \
     | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

   # Test endpoint
   curl -s http://localhost:8102/api/v1/dashboard/user \
     -H "Authorization: Bearer $TOKEN" | jq .

   # Check for mock data
   curl -s http://localhost:8102/api/v1/dashboard/user \
     -H "Authorization: Bearer $TOKEN" | grep -i "mock\|fake\|test"
   ```

4. Log Kontrolü
   ```bash
   docker logs ikai-frontend --tail 50 | grep -i "user.*dashboard\|error"
   docker logs ikai-backend --tail 50 | grep -i "dashboard.*user\|error"
   ```

5. Bulduğun Mock Data'yı Düzelt
   - Her mock data için Real Prisma query yaz
   - Commit yap
   - Log'ları tekrar kontrol et

📝 RAPOR:
docs/reports/w1-user-dashboard-real-data-validation.md

Raporda belirt:
- Kaç mock data buldun?
- Kaç tanesini düzelttin?
- API test sonucu (curl output)
- Log'lar temiz mi?

BAŞLA!
```

---

## 📋 W2: HR_SPECIALIST Dashboard - Real Data Validation

```
"sen workersin"

🎯 GÖREV: HR_SPECIALIST Dashboard Real Data Doğrulama

📖 SENİN DOSYALARIN:
- frontend/app/(authenticated)/dashboard/hr-specialist-dashboard.tsx
- frontend/components/dashboard/hr-specialist/* (8-9 widget)
- backend/src/routes/dashboardRoutes.js (GET /hr-specialist endpoint)

🔍 KONTROL ET:

1. Backend API - Mock Data Taraması
   ```bash
   # HR endpoint'ini bul
   grep -n "'/hr-specialist'" backend/src/routes/dashboardRoutes.js

   # Mock data ara (line range: endpoint başı-sonu)
   sed -n '136,300p' backend/src/routes/dashboardRoutes.js | grep -n "TODO\|MOCK\|hardcoded\|="

   # Prisma query sayısını kontrol et (minimum 10 olmalı!)
   sed -n '136,300p' backend/src/routes/dashboardRoutes.js | grep -c "await prisma\."
   ```

   **Beklenen:** Minimum 10 Prisma query
   **Eğer <10:** Mock data var, düzelt!

2. Pipeline Data Kontrolü
   ```bash
   # Hiring pipeline real mi?
   grep -A 50 "pipeline" backend/src/routes/dashboardRoutes.js | grep "prisma\|MOCK"
   ```

   **Beklenen:** Pipeline data Prisma'dan gelecek
   **Eğer hardcoded array varsa:** Düzelt!

3. Recent Analyses Kontrolü
   ```bash
   # Recent analyses real mi?
   grep -A 30 "recentAnalyses" backend/src/routes/dashboardRoutes.js
   ```

   **Beklenen:**
   ```javascript
   const recentAnalyses = await prisma.analysis.findMany({...})
   ```
   **Eğer mock array:** Düzelt!

4. API Test
   ```bash
   # Login as HR_SPECIALIST
   TOKEN=$(curl -s -X POST http://localhost:8102/api/v1/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"test-hr_specialist@test-org-1.com","password":"TestPass123!"}' \
     | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

   # Test endpoint
   curl -s http://localhost:8102/api/v1/dashboard/hr-specialist \
     -H "Authorization: Bearer $TOKEN" | jq .

   # Kontrol: activePostings, weekCVs, recentAnalyses REAL mi?
   curl -s http://localhost:8102/api/v1/dashboard/hr-specialist \
     -H "Authorization: Bearer $TOKEN" | jq '.data | keys'
   ```

5. Her Mock Data İçin:
   - Prisma query yaz
   - Real data döndür
   - Commit
   - Test et
   - Log kontrol et

📝 RAPOR:
docs/reports/w2-hr-dashboard-real-data-validation.md

BAŞLA!
```

---

## 📋 W3: MANAGER Dashboard - Real Data Validation

```
"sen workersin"

🎯 GÖREV: MANAGER Dashboard Real Data Doğrulama

📖 SENİN DOSYALARIN:
- frontend/components/dashboard/ManagerDashboard.tsx
- frontend/components/dashboard/manager/* (8 widget)
- backend/src/routes/dashboardRoutes.js (GET /manager endpoint)

🔍 KONTROL ET:

1. Endpoint Var mı?
   ```bash
   grep -n "'/manager'" backend/src/routes/dashboardRoutes.js
   ```

   **Eğer YOK:** Endpoint'i oluştur!
   **Eğer VAR:** Mock data kontrolüne geç

2. Team Performance Data
   ```bash
   # Team metrics real mi?
   grep -A 50 "teamPerformance\|team.*metrics" backend/src/routes/dashboardRoutes.js
   ```

   **Beklenen:** User count, team stats from Prisma
   **Eğer hardcoded:** Düzelt!

3. Approval Queue Data
   ```bash
   # Approval queue real mi?
   grep -A 30 "approval\|pending.*approval" backend/src/routes/dashboardRoutes.js
   ```

   **Beklenen:** Prisma query (Offer, Interview status = PENDING)
   **Eğer mock array:** Düzelt!

4. KPI Data
   ```bash
   # KPI'lar real mi?
   grep -A 20 "kpi\|KPI" backend/src/routes/dashboardRoutes.js
   ```

   **Beklenen:** Real hiring metrics from DB
   **Eğer hardcoded percentage:** Düzelt!

5. API Test
   ```bash
   # Login as MANAGER
   TOKEN=$(curl -s -X POST http://localhost:8102/api/v1/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"test-manager@test-org-1.com","password":"TestPass123!"}' \
     | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

   # Test endpoint
   curl -s http://localhost:8102/api/v1/dashboard/manager \
     -H "Authorization: Bearer $TOKEN" | jq .

   # Verify fields exist
   curl -s http://localhost:8102/api/v1/dashboard/manager \
     -H "Authorization: Bearer $TOKEN" | jq '.data | keys'
   ```

   **Expected fields:**
   - teamPerformance
   - approvalQueue
   - monthlyKPIs
   - upcomingInterviews

6. Fix All Mock Data:
   - Replace with Prisma queries
   - Calculate from real DB data
   - Commit each fix
   - Re-test

📝 RAPOR:
docs/reports/w3-manager-dashboard-real-data-validation.md

BAŞLA!
```

---

## 📋 W4: ADMIN Dashboard - Real Data Validation

```
"sen workersin"

🎯 GÖREV: ADMIN Dashboard Real Data Doğrulama

📖 SENİN DOSYALARIN:
- frontend/app/(authenticated)/dashboard/admin-dashboard.tsx
- frontend/components/dashboard/admin/* (9 widget)
- backend/src/routes/dashboardRoutes.js (GET /admin endpoint)

🔍 KONTROL ET:

1. Organization Stats
   ```bash
   # Org stats real mi?
   grep -A 40 "'/admin'" backend/src/routes/dashboardRoutes.js | grep "totalUsers\|orgStats"
   ```

   **Beklenen:**
   ```javascript
   const totalUsers = await prisma.user.count({
     where: { organizationId }
   });
   ```
   **Eğer hardcoded number:** Düzelt!

2. Billing Data
   ```bash
   # Billing real mi?
   grep -A 20 "billing" backend/src/routes/dashboardRoutes.js | grep -A 5 "'/admin'"
   ```

   **Beklenen:** organization.plan, billingCycleStart from DB
   **Eğer mock:** Düzelt!

3. Usage Metrics
   ```bash
   # Usage trend real mi?
   grep -A 30 "usageTrend\|usage.*trend" backend/src/routes/dashboardRoutes.js
   ```

   **Beklenen:** Last 30 days analysis/CV count from DB
   **Eğer fake array:** Düzelt!

4. Security Metrics
   ```bash
   # Security data real mi?
   grep -A 20 "security\|twoFactor" backend/src/routes/dashboardRoutes.js | grep -A 5 "'/admin'"
   ```

   **Beklenen:**
   ```javascript
   const twoFactorUsers = await prisma.user.count({
     where: { organizationId, twoFactorEnabled: true }
   });
   ```

5. API Test
   ```bash
   # Login as ADMIN
   TOKEN=$(curl -s -X POST http://localhost:8102/api/v1/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"test-admin@test-org-1.com","password":"TestPass123!"}' \
     | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

   # Test endpoint
   curl -s http://localhost:8102/api/v1/dashboard/admin \
     -H "Authorization: Bearer $TOKEN" | jq .

   # Check all fields are REAL
   curl -s http://localhost:8102/api/v1/dashboard/admin \
     -H "Authorization: Bearer $TOKEN" | jq '.data'
   ```

6. Mock Data Temizleme:
   - Her hardcoded value için Prisma query
   - Test after each fix
   - Commit
   - Verify in API response

📝 RAPOR:
docs/reports/w4-admin-dashboard-real-data-validation.md

BAŞLA!
```

---

## 📋 W5: SUPER_ADMIN Dashboard - Real Data Validation

```
"sen workersin"

🎯 GÖREV: SUPER_ADMIN Dashboard Real Data Doğrulama

📖 SENİN DOSYALARIN:
- frontend/components/dashboard/SuperAdminDashboard.tsx
- frontend/components/dashboard/super-admin/* (9 widget)
- backend/src/routes/dashboardRoutes.js (GET /super-admin endpoint)

🔍 KONTROL ET:

1. Multi-Org Stats (CRITICAL!)
   ```bash
   # Cross-org query var mı? (SUPER_ADMIN tüm org'ları görmeli!)
   grep -A 50 "'/super-admin'" backend/src/routes/dashboardRoutes.js | grep "organizationId\|Organization"
   ```

   **KRITIK:** SUPER_ADMIN endpoint'inde enforceOrganizationIsolation OLMAMALI!
   **Beklenen:**
   ```javascript
   router.get('/super-admin', [
     authenticateToken,
     authorize([ROLES.SUPER_ADMIN])  // ← NO enforceOrganizationIsolation!
   ], ...)

   const totalOrgs = await prisma.organization.count(); // ← ALL orgs
   ```

2. Revenue Calculation
   ```bash
   # MRR real mi?
   grep -A 40 "revenue\|MRR\|mrr" backend/src/routes/dashboardRoutes.js | grep -A 10 "super-admin"
   ```

   **Beklenen:** Plan fiyatları * organization count
   **Eğer hardcoded ₺X:** Düzelt!

3. Platform Analytics
   ```bash
   # Platform-wide queries var mı?
   grep -A 30 "totalAnalyses\|totalCVs\|totalJobs" backend/src/routes/dashboardRoutes.js
   ```

   **Beklenen:**
   ```javascript
   const totalAnalyses = await prisma.analysis.count(); // ← NO organizationId filter!
   const totalCVs = await prisma.candidate.count();
   ```

4. Queue Health
   ```bash
   # Queue stats real mi?
   grep -A 30 "queue\|Queue" backend/src/routes/dashboardRoutes.js | grep "super-admin"
   ```

   **Beklenen:** BullMQ queue.getJobCounts() calls
   **Eğer yok:** Queue integration ekle!

5. System Health
   ```bash
   # Service health checks var mı?
   grep -A 30 "systemHealth\|health.*check" backend/src/routes/dashboardRoutes.js
   ```

   **Beklenen:** Database ping, Redis ping, Milvus status
   **Eğer mock:** Düzelt!

6. API Test (SUPER_ADMIN)
   ```bash
   # Login
   TOKEN=$(curl -s -X POST http://localhost:8102/api/v1/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"info@gaiai.ai","password":"23235656"}' \
     | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

   # Test endpoint
   curl -s http://localhost:8102/api/v1/dashboard/super-admin \
     -H "Authorization: Bearer $TOKEN" | jq .

   # Verify cross-org data (should see ALL 3 test orgs!)
   curl -s http://localhost:8102/api/v1/dashboard/super-admin \
     -H "Authorization: Bearer $TOKEN" | jq '.data.organizations.total'
   ```

   **Expected:** total = 3 (test-org-1, test-org-2, test-org-3)
   **Eğer 1:** enforceOrganizationIsolation kaldır!

7. Mock Data Temizleme:
   - CRITICAL: Remove enforceOrganizationIsolation from endpoint
   - Add cross-org Prisma queries
   - Calculate real MRR
   - Add BullMQ queue stats
   - Test + Commit + Verify

📝 RAPOR:
docs/reports/w5-super-admin-dashboard-real-data-validation.md

BAŞLA!
```

---

## 📋 W1+W2+W4+W5: COMMON VALIDATION CHECKLIST

**Her Worker Şunları Kontrol Edecek:**

### ✅ Backend Endpoint Checklist

```bash
# 1. Endpoint exists?
grep "'/[your-role]'" backend/src/routes/dashboardRoutes.js

# 2. Authorization correct?
# - USER/HR/MANAGER/ADMIN: enforceOrganizationIsolation ✅
# - SUPER_ADMIN: NO enforceOrganizationIsolation ✅

# 3. Prisma query count (minimum!)
# - USER: 5+ queries
# - HR_SPECIALIST: 10+ queries
# - MANAGER: 8+ queries
# - ADMIN: 8+ queries
# - SUPER_ADMIN: 12+ queries (cross-org!)

# 4. No mock data keywords
grep -i "mock\|fake\|todo\|hardcoded\|example" backend/src/routes/dashboardRoutes.js

# 5. No hardcoded arrays/objects (except default fallbacks)
grep "= \[{" backend/src/routes/dashboardRoutes.js
```

### ✅ Frontend Widget Checklist

```bash
# 1. All widgets fetch from API (no hardcoded data)
grep -r "const.*=.*{.*:.*}" frontend/components/dashboard/[your-role]/ | grep -v "Props\|Interface"

# 2. Loading states exist
grep -r "loading\|isLoading" frontend/components/dashboard/[your-role]/

# 3. Error states exist
grep -r "error\|catch" frontend/components/dashboard/[your-role]/
```

### ✅ Integration Test

```bash
# 1. Login
# 2. Call your dashboard API
# 3. Verify response has real data
# 4. Check frontend renders correctly
# 5. Check browser console (no errors)
```

### ✅ Log Verification

```bash
# Backend errors?
docker logs ikai-backend --tail 100 | grep -i "dashboard.*[your-role]\|error"

# Frontend errors?
docker logs ikai-frontend --tail 100 | grep -i "[your-role].*dashboard\|error"
```

---

## 🚨 CRITICAL: Mock Data Patterns to Find

**Common Mock Patterns:**

```javascript
// ❌ Pattern 1: Hardcoded numbers
const activePostings = 5; // MOCK!

// ✅ Fix:
const activePostings = await prisma.jobPosting.count({
  where: { organizationId, status: 'ACTIVE' }
});

// ❌ Pattern 2: Hardcoded arrays
const pipeline = [
  { stage: 'Applied', count: 120 },
  { stage: 'Screened', count: 45 }
]; // MOCK!

// ✅ Fix:
const applied = await prisma.candidate.count({...});
const screened = await prisma.candidate.count({
  where: { organizationId, status: 'SCREENED' }
});
const pipeline = [
  { stage: 'Applied', count: applied },
  { stage: 'Screened', count: screened }
];

// ❌ Pattern 3: Hardcoded time
const loginTime = "09:30"; // MOCK!

// ✅ Fix:
const loginTime = new Date().toLocaleTimeString('tr-TR', {
  hour: '2-digit',
  minute: '2-digit'
});

// ❌ Pattern 4: Fake growth percentages
const growth = 15.5; // MOCK!

// ✅ Fix:
const thisMonth = await prisma.analysis.count({
  where: { organizationId, createdAt: { gte: monthStart } }
});
const lastMonth = await prisma.analysis.count({
  where: { organizationId, createdAt: { gte: lastMonthStart, lt: monthStart } }
});
const growth = lastMonth > 0 ? ((thisMonth - lastMonth) / lastMonth * 100) : 0;
```

---

## 📝 Verification Report Template (All Workers)

```markdown
# ✅ [Worker X] Real Data Validation Report

**Dashboard:** [ROLE] Dashboard
**Date:** 2025-11-04
**Duration:** [TIME]

---

## 🔍 Mock Data Found

**Total Mock Data:** [COUNT]

### Backend Mock Data:
1. [Field name]: [Description] - Line [X]
2. [Field name]: [Description] - Line [Y]
...

### Frontend Mock Data:
1. [Widget name]: [Description]
2. [Widget name]: [Description]
...

---

## ✅ Fixes Applied

### Fix 1: [Field Name]
**Before (Mock):**
```javascript
const activePostings = 5;
```

**After (Real):**
```javascript
const activePostings = await prisma.jobPosting.count({
  where: { organizationId, status: 'ACTIVE' }
});
```

**Commit:** [HASH]

---

## 🧪 API Test Results

**Command:**
```bash
curl -s http://localhost:8102/api/v1/dashboard/[role] \
  -H "Authorization: Bearer [TOKEN]" | jq .
```

**Response:**
```json
[PASTE FULL API RESPONSE]
```

**Mock Data Remaining:** [COUNT] (should be 0!)

---

## 📊 Summary

**Mock Data Found:** [COUNT]
**Mock Data Fixed:** [COUNT]
**Real Prisma Queries Added:** [COUNT]
**API Test:** ✅ PASS / ❌ FAIL
**Logs Clean:** ✅ YES / ❌ NO

**Status:** ✅ 100% REAL DATA / ⚠️ PARTIAL / ❌ FAILED

---

**Worker [X] Sign-off:** [NAME]
**Ready for Mod:** ✅ YES / ❌ NO
```

---

## 🎯 Success Criteria (ALL Workers)

**Backend:**
- ✅ Minimum Prisma query count met
- ✅ No hardcoded numbers/arrays (except safe defaults)
- ✅ No "TODO", "MOCK", "FAKE" comments
- ✅ Authorization middleware correct

**Frontend:**
- ✅ All widgets fetch from API
- ✅ Loading states implemented
- ✅ Error handling exists
- ✅ No hardcoded data in widgets

**Integration:**
- ✅ API returns 200
- ✅ Real data in response
- ✅ Frontend renders correctly
- ✅ No console errors
- ✅ Logs clean

**Git:**
- ✅ Each fix = 1 commit
- ✅ All commits pushed
- ✅ Verification report written

---

**Created by:** Mod Claude
**Date:** 2025-11-04
**Purpose:** Ensure 100% real data in all dashboards
