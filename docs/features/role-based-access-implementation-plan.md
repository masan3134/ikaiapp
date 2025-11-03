# Rol Bazlı Erişim Kontrolü - İmplementasyon Planı

## 📊 DURUM ANALİZİ

### Backend
- **Toplam route dosyası:** 29 adet
- **Toplam route:** 136 adet
- **Korunan route:** Sadece 6 adet (dashboardRoutes, teamRoutes)
- **Korunmayan:** 130+ route (%95)

### Frontend
- **Toplam sayfa:** 24 adet
- **Korunan sayfa:** 3 adet (dashboard, super-admin, team)
- **Korunmayan:** 21 sayfa (%88)

---

## 🎯 FAZ PLANI - 5 FAZ (Toplam 8-10 saat)

### **FAZ 1: Temel Altyapı (1.5 saat)**
**Hedef:** Reusable component'ler ve helper'lar

**Backend:**
- ✅ authorize middleware zaten var
- Role constants tanımla (constants/roles.js)
- Role group helper'lar (örn: `isAdminRole()`)

**Frontend:**
- `RoleGuard.tsx` component (client-side check)
- `withRoleProtection()` HOC (page wrapper)
- `useHasRole()` hook
- Role constants

**Dosyalar:**
- `frontend/lib/constants/roles.ts`
- `frontend/components/guards/RoleGuard.tsx`
- `frontend/lib/hooks/useHasRole.ts`
- `backend/src/constants/roles.js`
- `backend/src/utils/roleHelpers.js`

---

### **FAZ 2: Backend Route Protection (3 saat)**
**Hedef:** Tüm backend route'ları koru

**Öncelik Sırası:**

**2.1 - Kritik Routes (30 dakika)**
- superAdminRoutes.js (5 routes) - SUPER_ADMIN only
- organizationRoutes.js (3 routes) - ADMIN, SUPER_ADMIN
- queueRoutes.js (3 routes) - ADMIN, SUPER_ADMIN

**2.2 - Ana İş Akışı (1 saat)**
- jobPostingRoutes.js (7 routes) - HR_SPECIALIST+
- candidateRoutes.js (7 routes) - HR_SPECIALIST+
- analysisRoutes.js (10 routes) - HR_SPECIALIST+
- interviewRoutes.js (8 routes) - HR_SPECIALIST+

**2.3 - Offer Sistemi (45 dakika)**
- offerRoutes.js (15 routes) - HR_SPECIALIST+
- templateRoutes.js (8 routes) - MANAGER+
- negotiationRoutes.js (3 routes) - HR_SPECIALIST+
- revisionRoutes.js (1 route) - HR_SPECIALIST+

**2.4 - Diğer (45 dakika)**
- testRoutes.js (8 routes) - HR_SPECIALIST+
- attachmentRoutes.js (3 routes) - HR_SPECIALIST+
- userRoutes.js (6 routes) - Mix (bazı public, bazı admin)
- categoryRoutes.js (6 routes) - MANAGER+
- analysisChatRoutes.js (2 routes) - HR_SPECIALIST+
- analyticsOfferRoutes.js (4 routes) - MANAGER+
- smartSearchRoutes.js (2 routes) - HR_SPECIALIST+
- metricsRoutes.js (1 route) - ADMIN+
- cacheRoutes.js (3 routes) - ADMIN+
- milvusSyncRoutes.js (2 routes) - ADMIN+
- onboardingRoutes.js (3 routes) - All authenticated
- publicOfferRoutes.js (3 routes) - Public (no change)
- authRoutes.js (5 routes) - Public (no change)

**Toplam:** ~26 dosya, 130 route

---

### **FAZ 3: Frontend Page Protection (2.5 saat)**
**Hedef:** Tüm sayfaları koru

**3.1 - Ana Sayfalar (1 saat)**
- `/job-postings/page.tsx` - HR_SPECIALIST+
- `/candidates/page.tsx` - HR_SPECIALIST+
- `/candidates/[id]/page.tsx` - HR_SPECIALIST+
- `/analyses/page.tsx` - HR_SPECIALIST+
- `/analyses/[id]/page.tsx` - HR_SPECIALIST+
- `/wizard/page.tsx` - HR_SPECIALIST+
- `/interviews/page.tsx` - HR_SPECIALIST+

**3.2 - Offer Sayfaları (1 saat)**
- `/offers/page.tsx` - HR_SPECIALIST+
- `/offers/[id]/page.tsx` - HR_SPECIALIST+
- `/offers/new/page.tsx` - HR_SPECIALIST+
- `/offers/wizard/page.tsx` - HR_SPECIALIST+
- `/offers/analytics/page.tsx` - MANAGER+
- `/offers/templates/**` (5 sayfa) - MANAGER+
- `/offers/[id]/revisions/page.tsx` - HR_SPECIALIST+

**3.3 - Settings (30 dakika)**
- `/settings/organization/page.tsx` - ADMIN+
- `/settings/billing/page.tsx` - ADMIN+

**Toplam:** ~19 sayfa

---

### **FAZ 4: Sidebar & Navigation (1 saat)**
**Hedef:** Menu öğelerini rol bazlı göster/gizle

**Güncellenecek:**
- `Sidebar.tsx` - Her menu item'a `roles` array ekle
- `PublicNavbar.tsx` - Login/logout durumu
- Menu render logic - Role check ekle

**Menu Rol Matrisi:**
- Dashboard - HR_SPECIALIST+
- İş İlanları - HR_SPECIALIST+
- Adaylar - HR_SPECIALIST+
- Analizler - HR_SPECIALIST+
- Wizard - HR_SPECIALIST+
- Offers - HR_SPECIALIST+
- Interviews - HR_SPECIALIST+
- Settings - ADMIN+
- Team Management - ADMIN+ (already done)
- Super Admin - SUPER_ADMIN (already done)

---

### **FAZ 5: Test & Dokümantasyon (2 saat)**

**5.1 - Manuel Test (1 saat)**
Her rol için test senaryoları:
- USER rolü ile login → Hiçbir sayfaya erişemez
- HR_SPECIALIST → İş sayfalarına erişir, settings'e erişemez
- MANAGER → Tüm iş sayfaları + analytics
- ADMIN → Her şey (kendi org'da)
- SUPER_ADMIN → Tüm sistem

**5.2 - Dokümantasyon (1 saat)**
- Role matrix güncelle
- API dokümantasyonu
- Frontend component kullanım örnekleri
- Troubleshooting guide

---

## 📋 TOPLAM ÖZET

| Faz | İş | Süre |
|-----|-----|------|
| 1 | Altyapı | 1.5 saat |
| 2 | Backend (130 route) | 3 saat |
| 3 | Frontend (19 sayfa) | 2.5 saat |
| 4 | Navigation | 1 saat |
| 5 | Test & Docs | 2 saat |
| **TOPLAM** | | **10 saat** |

---

## 🚀 BAŞLATMA STRATEJİSİ

**Seçenek A: Hızlı Kritik Koruma (2 saat)**
- Sadece Faz 1 + Faz 2.1 + Faz 3.3 + Faz 4
- Super admin, settings, queue korunur
- Diğerleri sonra yapılır

**Seçenek B: Tam İmplementasyon (10 saat)**
- Tüm 5 fazı sırayla
- Profesyonel, production-ready
- 2-3 session'da tamamlanır

**Seçenek C: Paralel Çalışma**
- Frontend + Backend aynı anda
- 2 tab'da ayrı agent'lar
- 5-6 saatte biter

---

## 💡 ÖNERİ

**Bugün:** Faz 1 + Faz 2.1 (Kritik Koruma - 2 saat)
**Yarın:** Faz 2.2-2.4 + Faz 3 (Ana İş - 5 saat)
**Sonraki:** Faz 4 + Faz 5 (Polish - 3 saat)

**Toplam:** 3 session, 10 saat

