# 🔐 IKAI Platform - Complete RBAC Strategy

**Version:** 1.0
**Date:** 2025-11-04
**Author:** Mustafa Asan + Claude Sonnet 4.5

---

## 🎯 RBAC'in 4 Katmanı

RBAC sadece "sayfa erişimi" değil! **4 katmanlı kontrol** gerekli:

### 1️⃣ **Sayfa/Route Erişimi** (✅ MEVCUT - Phase 3)
- USER → /candidates açamaz
- HR_SPECIALIST → Açabilir

### 2️⃣ **Veri Filtreleme** (⚠️ EKSİK - ŞİMDİ TESPİT EDİLDİ!)
- Aynı sayfayı açanlar farklı veriler görmeli
- SUPER_ADMIN → HER ŞEYİ görür
- ADMIN → Sadece kendi org'unu görür
- USER → Sadece kendi verilerini görür

### 3️⃣ **Fonksiyon/Aksiyon Yetkileri** (⚠️ EKSİK)
- Buton var ama backend red edebilmeli
- Sil butonu → USER görmez, HR_SPECIALIST görür
- Export → ADMIN yetkisi gerekir

### 4️⃣ **UI Element Görünürlüğü** (⚠️ KISMEN VAR)
- Yetki yoksa buton gösterme
- Liste sütunları rol bazlı değişmeli
- SUPER_ADMIN → Ekstra "Organization" sütunu görür

---

## 📊 Şu Anki Durum Analizi

### ✅ NE VAR?

**1. Sayfa Erişim Kontrolü (Phase 3)**
```typescript
// Frontend
withRoleProtection(RoleGroups.HR_MANAGERS)
// 32 sayfa korumalı ✅
```

**2. Backend Route Authorization**
```javascript
// Backend
router.get('/', hrManagers, getAllCandidates); // ✅ HR_MANAGERS kontrolü var
router.delete('/:id', hrManagers, deleteCandidate); // ✅
router.get('/me/usage', allAuthenticated, ...) // ✅ Herkes kendi bilgisini görebilir
```

**3. Organization Isolation Middleware**
```javascript
// ✅ Her kullanıcıya req.organizationId ekleniyor
req.organizationId = user.organizationId;
req.organization = user.organization;
req.userRole = user.role; // ✅ YENİ EKLENDİ
```

### ❌ NE EKSİK?

**1. Veri Filtreleme - Controller Seviyesinde**

#### 📂 **candidateController.js**

**Sorun:**
```javascript
// Şu anda:
const where = userRole === 'SUPER_ADMIN'
  ? { isDeleted: false }
  : {
      userId,           // ❌ SADECE KEND İYÜKLEDİĞİ ADAYLAR!
      organizationId,
      isDeleted: false
    };
```

**Olması gereken:**
```javascript
// ROL BAZLI FİLTRELEME:
let where = { isDeleted: false };

if (userRole === 'SUPER_ADMIN') {
  // SUPER_ADMIN: HER ŞEY
  where = { isDeleted: false };

} else if (userRole === 'ADMIN') {
  // ADMIN: Kendi organizasyonundaki TÜM adaylar
  where = {
    organizationId,
    isDeleted: false
  };

} else if (['MANAGER', 'HR_SPECIALIST'].includes(userRole)) {
  // HR + MANAGER: Kendi organizasyonundaki TÜM adaylar
  where = {
    organizationId,
    isDeleted: false
  };

} else if (userRole === 'USER') {
  // USER: SADECE KENDİ YÜKLEDİĞİ ADAYLAR
  where = {
    userId,
    organizationId,
    isDeleted: false
  };
}
```

**Aynı sorun burada da var:**
- `getCandidateById` → Sadece kendi yüklediğini görebiliyor
- `deleteCandidate` → Sadece kendi yüklediğini silebiliyor
- `checkDuplicateFile` → userId filtresi var

---

#### 📂 **analysisController.js**

**Kontrol edilmeli:**
```javascript
// getAllAnalyses - organizationId filtresi var mı?
// Sadece userId var mı?
// SUPER_ADMIN kontrolü var mı?
```

---

#### 📂 **jobPostingController.js**

**Kontrol edilmeli:**
```javascript
// USER: Hiç görmemeli (zaten route korumalı ✅)
// HR_SPECIALIST: Kendi org'unun ilanlarını görmeli
// ADMIN: Kendi org'unun ilanlarını görmeli
// SUPER_ADMIN: TÜM organizasyonların ilanlarını görmeli
```

---

#### 📂 **offerController.js**

**Kontrol edilmeli:**
```javascript
// Teklifler kime ait?
// userId bazlı mı, organizationId bazlı mı?
// SUPER_ADMIN tüm teklifleri görebilmeli
```

---

#### 📂 **teamRoutes.js**

**Şu anda:**
```javascript
router.get('/', ...adminOnly, getTeamMembers);
// ✅ Sadece ADMIN+ erişebilir
```

**Kontrol edilmeli:**
```javascript
// ADMIN: Kendi org'undaki team üyelerini görmeli
// SUPER_ADMIN: TÜM organizasyonların team üyelerini görmeli
```

---

**2. Fonksiyon Yetki Matrisi**

| Fonksiyon | USER | HR_SPECIALIST | MANAGER | ADMIN | SUPER_ADMIN |
|-----------|------|---------------|---------|-------|-------------|
| **Candidates** |
| List candidates | ❌ (veya sadece kendi) | ✅ (org) | ✅ (org) | ✅ (org) | ✅ (all) |
| Upload CV | ✅ | ✅ | ✅ | ✅ | ✅ |
| Delete candidate | ❌ | ✅ (org) | ✅ (org) | ✅ (org) | ✅ (all) |
| Export candidates | ❌ | ✅ | ✅ | ✅ | ✅ |
| **Analyses** |
| View analyses | ❌ | ✅ (org) | ✅ (org) | ✅ (org) | ✅ (all) |
| Create analysis | ❌ | ✅ | ✅ | ✅ | ✅ |
| Delete analysis | ❌ | ✅ (own) | ✅ (org) | ✅ (org) | ✅ (all) |
| Export analysis | ❌ | ✅ | ✅ | ✅ | ✅ |
| **Job Postings** |
| List jobs | ❌ | ✅ (org) | ✅ (org) | ✅ (org) | ✅ (all) |
| Create job | ❌ | ✅ | ✅ | ✅ | ✅ |
| Update job | ❌ | ✅ (own) | ✅ (org) | ✅ (org) | ✅ (all) |
| Delete job | ❌ | ❌ | ✅ | ✅ | ✅ |
| **Offers** |
| List offers | ❌ | ✅ (org) | ✅ (org) | ✅ (org) | ✅ (all) |
| Create offer | ❌ | ✅ | ✅ | ✅ | ✅ |
| Send offer | ❌ | ❌ | ✅ | ✅ | ✅ |
| Approve offer | ❌ | ❌ | ✅ | ✅ | ✅ |
| **Team Management** |
| List team | ❌ | ❌ | ❌ | ✅ (org) | ✅ (all) |
| Invite user | ❌ | ❌ | ❌ | ✅ | ✅ |
| Update roles | ❌ | ❌ | ❌ | ✅ (org) | ✅ (all) |
| Delete user | ❌ | ❌ | ❌ | ✅ (org) | ✅ (all) |
| **Settings** |
| View org settings | ❌ | ❌ | ❌ | ✅ (own) | ✅ (all) |
| Update org settings | ❌ | ❌ | ❌ | ✅ (own) | ✅ (all) |
| View billing | ❌ | ❌ | ❌ | ✅ (own) | ✅ (all) |
| **Super Admin Panel** |
| View all orgs | ❌ | ❌ | ❌ | ❌ | ✅ |
| Toggle org status | ❌ | ❌ | ❌ | ❌ | ✅ |
| Change plans | ❌ | ❌ | ❌ | ❌ | ✅ |
| System metrics | ❌ | ❌ | ❌ | ❌ | ✅ |

**Legend:**
- ✅ = Allowed
- ❌ = Forbidden
- (own) = Sadece kendi oluşturduğu
- (org) = Kendi organizasyonundaki tüm veriler
- (all) = Tüm organizasyonların verileri

---

**3. UI Element Görünürlüğü**

#### Frontend Components - Conditional Rendering

**Şu anda eksik:**
```typescript
// candidates/page.tsx
// ❌ Sil butonu herkese görünüyor (backend reject ediyor ama UI'da var)
<button onClick={deleteCandidate}>Sil</button>

// ✅ Olması gereken:
{(isHR || isManager || isAdmin || isSuperAdmin) && (
  <button onClick={deleteCandidate}>Sil</button>
)}
```

**Liste sütunları - Rol bazlı:**
```typescript
// SUPER_ADMIN → Ekstra sütunlar görmeli
const columns = [
  { key: 'name', label: 'Aday Adı' }, // Herkes görür
  { key: 'position', label: 'Pozisyon' }, // Herkes görür
  { key: 'score', label: 'Skor' }, // HR+ görür

  // SUPER_ADMIN ekstra sütunlar:
  ...(isSuperAdmin ? [
    { key: 'organizationName', label: 'Organizasyon' },
    { key: 'uploadedBy', label: 'Yükleyen Kullanıcı' },
  ] : []),
];
```

**Bulk operations:**
```typescript
// Export All button
{(isAdmin || isSuperAdmin) && (
  <button onClick={exportAll}>Tümünü Dışa Aktar</button>
)}

// Bulk Delete
{(isManager || isAdmin || isSuperAdmin) && (
  <button onClick={bulkDelete}>Toplu Sil</button>
)}
```

---

## 🔧 Düzeltme Planı

### Phase 1: Veri Filtreleme Düzeltmeleri (URGENT!)

**1.1. candidateController.js**
- ✅ getAllCandidates → Rol bazlı filtreleme (YAPILDI!)
- ⚠️ getCandidateById → userId filtresi kaldırılmalı (HR+ org görmeli)
- ⚠️ deleteCandidate → userId filtresi kaldırılmalı
- ⚠️ checkDuplicateFile → Rol bazlı filtreleme

**1.2. analysisController.js**
- getAllAnalyses → Kontrol et ve düzelt
- getAnalysisById → Kontrol et
- deleteAnalysis → Kontrol et

**1.3. jobPostingController.js**
- getAllJobPostings → SUPER_ADMIN kontrolü ekle
- deleteJobPosting → Yetki kontrolü (MANAGER+ silebilir)

**1.4. offerController.js**
- getOffers → SUPER_ADMIN tüm org'ları görmeli
- sendOffer → MANAGER+ yetkisi
- approveOffer → MANAGER+ yetkisi

**1.5. teamController.js**
- getTeamMembers → SUPER_ADMIN tüm org'ları görmeli

---

### Phase 2: Fonksiyon Yetkilendirme

**2.1. Delete Operations**
```javascript
// deleteCandidate - Örnek:
async function deleteCandidate(req, res) {
  const { id } = req.params;
  const { userRole, userId, organizationId } = req;

  // Adayı bul
  const candidate = await prisma.candidate.findUnique({ where: { id } });

  // Yetki kontrolü:
  if (userRole === 'SUPER_ADMIN') {
    // SUPER_ADMIN her şeyi silebilir

  } else if (['ADMIN', 'MANAGER', 'HR_SPECIALIST'].includes(userRole)) {
    // ADMIN/MANAGER/HR → Sadece kendi org'undakileri silebilir
    if (candidate.organizationId !== organizationId) {
      return res.status(403).json({ error: 'Bu adayı silme yetkiniz yok' });
    }

  } else {
    // USER → Hiç silemez
    return res.status(403).json({ error: 'Aday silme yetkiniz yok' });
  }

  // Sil
  await prisma.candidate.update({
    where: { id },
    data: { isDeleted: true }
  });

  res.json({ success: true });
}
```

**2.2. Export Operations**
```javascript
// exportCandidatesXLSX
// Sadece HR+ yapabilmeli (route'da zaten hrManagers var ✅)
// Ama veri filtresi doğru mu kontrol et
```

**2.3. Bulk Operations**
```javascript
// Bulk delete, bulk send vb.
// MANAGER+ yetkisi gerekir
// Frontend'de buton conditional render
```

---

### Phase 3: UI Element Görünürlüğü

**3.1. Button Visibility**
```typescript
// frontend/app/(authenticated)/candidates/page.tsx
import { useAuthStore } from '@/stores/authStore';
import { useHasRole } from '@/lib/hooks/useHasRole';
import { RoleGroups } from '@/lib/constants/roles';

const CandidatesPage = () => {
  const canManageHR = useHasRole(RoleGroups.HR_MANAGERS);
  const isManager = useHasRole(RoleGroups.MANAGERS_PLUS);
  const isAdmin = useHasRole(RoleGroups.ADMINS);
  const isSuperAdmin = useHasRole([UserRole.SUPER_ADMIN]);

  return (
    <div>
      {/* Sil butonu - HR+ */}
      {canManageHR && (
        <button onClick={handleDelete}>Sil</button>
      )}

      {/* Export All - ADMIN+ */}
      {isAdmin && (
        <button onClick={handleExportAll}>Tümünü Dışa Aktar</button>
      )}

      {/* Bulk Delete - MANAGER+ */}
      {isManager && (
        <button onClick={handleBulkDelete}>Toplu Sil</button>
      )}
    </div>
  );
};
```

**3.2. Column Visibility**
```typescript
// DataTable columns
const getColumns = (userRole: string) => {
  const baseColumns = [
    { key: 'name', label: 'Aday Adı' },
    { key: 'email', label: 'E-posta' },
    { key: 'position', label: 'Pozisyon' },
  ];

  // HR+ sees score
  const hrColumns = userRole !== 'USER' ? [
    { key: 'score', label: 'Skor' },
    { key: 'status', label: 'Durum' },
  ] : [];

  // SUPER_ADMIN sees organization
  const superAdminColumns = userRole === 'SUPER_ADMIN' ? [
    { key: 'organizationName', label: 'Organizasyon' },
    { key: 'uploadedBy', label: 'Yükleyen' },
  ] : [];

  return [...baseColumns, ...hrColumns, ...superAdminColumns];
};
```

**3.3. Filter Visibility**
```typescript
// Filters
{isSuperAdmin && (
  <OrganizationFilter onChange={setOrgFilter} />
)}

{isAdmin && (
  <DepartmentFilter onChange={setDeptFilter} />
)}
```

---

### Phase 4: Frontend API Calls Update

**4.1. Candidate API calls**
```typescript
// frontend/lib/api/candidates.ts

// getAllCandidates - Artık SUPER_ADMIN için tüm org'ları dönecek
export const getAllCandidates = async () => {
  // Backend otomatik rol bazlı filtreliyor
  const res = await fetch('/api/v1/candidates');
  return res.json();
};

// Tablo SUPER_ADMIN için "Organization" sütunu eklemeli
```

**4.2. Response shape update**
```typescript
// Candidate type - Organization field ekle
interface Candidate {
  id: string;
  name: string;
  email: string;
  // ...

  // SUPER_ADMIN için ek bilgiler:
  organization?: {
    id: string;
    name: string;
    slug: string;
  };
  uploadedBy?: {
    id: string;
    name: string;
    email: string;
  };
}
```

---

## 📋 Implementation Checklist

### Backend (URGENT!)

- [ ] **candidateController.js**
  - [x] getAllCandidates - SUPER_ADMIN fix (YAPILDI!)
  - [ ] getCandidateById - userId filtresi kaldır
  - [ ] deleteCandidate - Rol bazlı yetki kontrolü
  - [ ] checkDuplicateFile - Rol bazlı filtreleme

- [ ] **analysisController.js**
  - [ ] getAllAnalyses - SUPER_ADMIN + org filtreleme
  - [ ] getAnalysisById - Yetki kontrolü
  - [ ] deleteAnalysis - Rol bazlı yetki
  - [ ] exportAnalysis - Yetki kontrolü

- [ ] **jobPostingController.js**
  - [ ] getAllJobPostings - SUPER_ADMIN görmeli
  - [ ] deleteJobPosting - MANAGER+ yetkisi

- [ ] **offerController.js**
  - [ ] getOffers - SUPER_ADMIN tüm org'lar
  - [ ] sendOffer - MANAGER+ yetkisi
  - [ ] approveOffer - MANAGER+ yetkisi

- [ ] **teamController.js**
  - [ ] getTeamMembers - SUPER_ADMIN tüm org'lar
  - [ ] updateTeamMember - Sadece kendi org'u
  - [ ] deleteTeamMember - Sadece kendi org'u

### Frontend

- [ ] **candidates/page.tsx**
  - [ ] Sil butonu - Conditional render (HR+)
  - [ ] Export butonu - Conditional render (ADMIN+)
  - [ ] Bulk operations - Conditional render (MANAGER+)
  - [ ] Organization column - SUPER_ADMIN için
  - [ ] Uploaded by column - SUPER_ADMIN için

- [ ] **analyses/page.tsx**
  - [ ] Delete button - Conditional
  - [ ] Export button - Conditional
  - [ ] Organization filter - SUPER_ADMIN

- [ ] **job-postings/page.tsx**
  - [ ] Delete button - MANAGER+
  - [ ] Organization column - SUPER_ADMIN

- [ ] **offers/page.tsx**
  - [ ] Send button - MANAGER+
  - [ ] Approve button - MANAGER+
  - [ ] Organization column - SUPER_ADMIN

- [ ] **team/page.tsx**
  - [ ] Organization filter - SUPER_ADMIN
  - [ ] Delete button - ADMIN (own org only)

---

## 🚨 Critical Issues Found

### 1. **Candidate Visibility Bug** (FIXED!)
**Before:**
```javascript
// USER sadece kendi yüklediği adayları görür ✅ DOĞRU
// SUPER_ADMIN tüm organizasyonları görür ✅ FIXED!
// Ama HR_SPECIALIST de sadece kendi yüklediğini görüyor ❌ YANLIŞ!
```

**After:**
```javascript
where = userRole === 'SUPER_ADMIN'
  ? { isDeleted: false } // ✅ Tüm org'lar
  : { userId, organizationId, isDeleted: false }; // ❌ Hala userId var!
```

**Doğrusu:**
```javascript
// HR_SPECIALIST, MANAGER, ADMIN → Organizasyondaki TÜM adaylar
// USER → Sadece kendi yüklediği
```

### 2. **Delete Permission Bug**
```javascript
// deleteCandidate - userId kontrolü var
// HR_SPECIALIST sadece kendi yüklediğini silebiliyor
// Olması gereken: HR+ kendi org'undaki HER adayı silebilmeli
```

### 3. **UI Button Visibility**
```typescript
// Delete button herkese görünüyor
// Backend reject ediyor ama UX kötü
// USER buton görmemeli
```

---

## 🎯 Priority Order

**🔴 CRITICAL (Hemen yapılmalı):**
1. candidateController.js veri filtreleme düzeltmesi
2. Delete permission düzeltmesi
3. SUPER_ADMIN tüm veri görünürlüğü

**🟡 HIGH (Bu hafta):**
4. analysisController.js düzeltmeleri
5. offerController.js düzeltmeleri
6. Frontend button visibility

**🟢 MEDIUM (Gelecek hafta):**
7. jobPostingController.js düzeltmeleri
8. Column visibility (SUPER_ADMIN için extra sütunlar)
9. Filter visibility

---

## 📝 Testing Scenarios

### Test 1: SUPER_ADMIN View
```
1. Login as info@gaiai.ai (SUPER_ADMIN)
2. Go to /candidates
3. Expected: 47 candidates (all orgs) ✅
4. See "Organization" column ✅
5. Can delete ANY candidate ✅
```

### Test 2: ADMIN View
```
1. Login as test-admin@test-org-1.com (ADMIN - Free org)
2. Go to /candidates
3. Expected: 7 candidates (own org only)
4. NO "Organization" column
5. Can delete own org candidates
6. Cannot delete other org candidates (403)
```

### Test 3: HR_SPECIALIST View
```
1. Login as test-hr_specialist@test-org-2.com (HR - Pro org)
2. Go to /candidates
3. Expected: 21 candidates (own org)
4. Can delete own org candidates
5. Can export own org candidates
6. NO organization filter
```

### Test 4: USER View
```
1. Login as test-user@test-org-3.com (USER - Enterprise)
2. Go to /candidates
3. Expected: ONLY candidates uploaded by this user
4. NO delete button
5. NO export button
6. CAN upload new CV
```

---

## 📚 Related Files

- `backend/src/middleware/organizationIsolation.js` - ✅ req.userRole eklendi
- `backend/src/controllers/candidateController.js` - ⚠️ Düzeltilmeli
- `backend/src/controllers/analysisController.js` - ⚠️ Kontrol edilmeli
- `backend/src/controllers/jobPostingController.js` - ⚠️ Kontrol edilmeli
- `backend/src/controllers/offerController.js` - ⚠️ Kontrol edilmeli
- `backend/src/controllers/teamController.js` - ⚠️ Kontrol edilmeli
- `frontend/app/(authenticated)/candidates/page.tsx` - ⚠️ UI düzeltilmeli

---

**Created:** 2025-11-04
**Status:** 🔴 CRITICAL ISSUES FOUND - Immediate action required
**Next Step:** Fix candidateController.js veri filtreleme mantığı
