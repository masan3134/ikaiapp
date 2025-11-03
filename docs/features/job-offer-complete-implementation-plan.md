# 🎯 Teklif Mektubu Sistemi - ULTRA DETAYLI UYGULAMA PLANI

**Date:** 2025-10-29
**Status:** Implementation Ready
**Total Features:** 23 özellik
**Estimated Time:** 18-22 gün (3-4 hafta)
**Phases:** 6 Faz

---

## 📋 İÇİNDEKİLER

1. [Genel Bakış](#genel-bakış)
2. [Faz Özeti](#faz-özeti)
3. [Database Schema (Tam)](#database-schema)
4. [API Endpoints (Tam Liste)](#api-endpoints)
5. [Frontend Yapısı](#frontend-yapısı)
6. [FAZ 1: Temel Altyapı](#faz-1-temel-altyapı)
7. [FAZ 2: Template Sistemi](#faz-2-template-sistemi)
8. [FAZ 3: Acceptance & Tracking](#faz-3-acceptance--tracking)
9. [FAZ 4: Bulk & Analytics](#faz-4-bulk--analytics)
10. [FAZ 5: Versioning & Categories](#faz-5-versioning--categories)
11. [FAZ 6: Testing & Polish](#faz-6-testing--polish)
12. [Dosya Yapısı](#dosya-yapısı)
13. [Bağımlılıklar](#bağımlılıklar)
14. [Timeline](#timeline)

---

## 🎯 GENEL BAKIŞ

### Seçilen Özellikler (23 adet):

**Temel (1-6):**
1. Teklif Oluşturma
2. PDF Oluşturma
3. Email Gönderimi
4. Durum Takibi
5. Teklif Listeleme
6. Teklif Detay Görüntüleme

**Template (7-9):**
7. Teklif Şablonları
8. Pozisyon Bazlı Otomatik Doldurma
9. Kabul/Red Linki

**Sistem (10-15):**
10. Email Bildirimi (SMS yok)
11. Onay Sistemi
12. Geçerlilik Süresi
13. Template Yönetimi
14. Şablondan Teklif Oluştur
15. Aday Cevap Sayfası

**İleri Seviye (19, 21, 23-27, 29-30):**
19. Toplu Teklif Gönderme
21. Müzakere Geçmişi
23. Dosya Ekleme
24. Teklif Analitikleri
25. Kabul Oranı Raporları
26. Ortalama Yanıt Süresi
27. Departman Bazlı İstatistik
29. Versiyon Geçmişi
30. Teklif Şablon Kategorileri

---

## 📊 FAZ ÖZETİ

| Faz | Süre | Özellikler | Açıklama |
|-----|------|------------|----------|
| **Faz 1** | 4 gün | 1-6 | Temel CRUD + PDF + Email |
| **Faz 2** | 3 gün | 7-9, 13-14, 30 | Template sistemi + Kategoriler |
| **Faz 3** | 4 gün | 10-12, 15 | Acceptance URL + Onay + Expiration |
| **Faz 4** | 4 gün | 19, 24-27 | Bulk send + Analytics |
| **Faz 5** | 3 gün | 21, 23, 29 | Negotiation + Attachments + Versioning |
| **Faz 6** | 2 gün | - | Testing + Bug fixes + Documentation |
| **TOPLAM** | **20 gün** | **23 özellik** | **Full Featured System** |

---

## 🗄️ DATABASE SCHEMA

### Complete Prisma Schema

```prisma
// ============================================
// OFFER TEMPLATE CATEGORY (Feature #30)
// ============================================
model OfferTemplateCategory {
  id          String   @id @default(uuid())
  name        String   // "Yazılım", "Satış", "Yönetim"
  description String?  @db.Text
  color       String?  // Hex color for UI
  icon        String?  // Icon name
  order       Int      @default(0) // Display order

  templates   OfferTemplate[]

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([order])
  @@map("offer_template_categories")
}

// ============================================
// OFFER TEMPLATE (Features #7, #8, #13, #14)
// ============================================
model OfferTemplate {
  id          String  @id @default(uuid())
  name        String  // "Senior Software Engineer Offer"
  description String? @db.Text
  categoryId  String?

  // Position defaults
  position    String
  department  String

  // Salary range
  salaryMin   Int
  salaryMax   Int
  currency    String  @default("TRY")

  // Benefits (JSON array)
  benefits    Json    // [{type: "insurance", amount: 0}, {type: "meal", amount: 1000}]

  // Work details
  workType    String  @default("office") // office, hybrid, remote

  // Terms and conditions
  terms       String  @db.Text

  // Email template
  emailSubject String
  emailBody    String  @db.Text

  // Relations
  category    OfferTemplateCategory? @relation(fields: [categoryId], references: [id], onDelete: SetNull)
  offers      JobOffer[]

  // Metadata
  isActive    Boolean  @default(true)
  usageCount  Int      @default(0) // Track how many times used

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([categoryId])
  @@index([isActive])
  @@index([usageCount(sort: Desc)])
  @@map("offer_templates")
}

// ============================================
// JOB OFFER (Features #1-6, #9-12, #15)
// ============================================
model JobOffer {
  id              String   @id @default(uuid())

  // Relations
  candidateId     String
  jobPostingId    String
  templateId      String?
  createdBy       String

  // Offer Details (Feature #1)
  position        String
  department      String
  salary          Int
  currency        String   @default("TRY")
  startDate       DateTime
  workType        String   // office, hybrid, remote

  // Benefits (JSON object)
  benefits        Json     // {insurance: true, meal: 1000, transportation: true, gym: false}

  // Terms
  terms           String   @db.Text

  // Custom fields
  customFields    Json?    // Flexible additional fields

  // Status & Tracking (Feature #4)
  status          String   @default("draft") // draft, pending_approval, approved, sent, accepted, rejected, expired, cancelled

  // Timestamps
  sentAt          DateTime?
  respondedAt     DateTime?
  expiresAt       DateTime  // Feature #12: 7 days validity

  // Acceptance System (Feature #9)
  acceptanceToken String   @unique @default(uuid())
  acceptanceUrl   String?  // Full URL to acceptance page

  // Approval Flow (Feature #11)
  approvalStatus  String   @default("pending") // pending, approved, rejected
  approvalNotes   String?  @db.Text
  approvedBy      String?
  approvedAt      DateTime?

  // Notifications (Feature #10)
  emailSent       Boolean  @default(false)
  emailSentAt     DateTime?

  // Analytics tracking
  viewCount       Int      @default(0)
  lastViewedAt    DateTime?

  // Relations
  candidate       Candidate      @relation(fields: [candidateId], references: [id], onDelete: Cascade)
  jobPosting      JobPosting     @relation(fields: [jobPostingId], references: [id], onDelete: Cascade)
  template        OfferTemplate? @relation(fields: [templateId], references: [id], onDelete: SetNull)
  creator         User           @relation("OfferCreator", fields: [createdBy], references: [id], onDelete: Cascade)
  approver        User?          @relation("OfferApprover", fields: [approvedBy], references: [id], onDelete: SetNull)

  // Sub-relations (Features #21, #23, #29)
  negotiations    OfferNegotiation[]
  attachments     OfferAttachment[]
  revisions       OfferRevision[]

  // Metadata
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  @@index([candidateId])
  @@index([jobPostingId])
  @@index([templateId])
  @@index([createdBy])
  @@index([status])
  @@index([approvalStatus])
  @@index([acceptanceToken])
  @@index([expiresAt])
  @@index([sentAt])
  @@index([createdAt(sort: Desc)])
  @@map("job_offers")
}

// ============================================
// OFFER NEGOTIATION (Feature #21)
// ============================================
model OfferNegotiation {
  id              String   @id @default(uuid())
  offerId         String

  // Who is negotiating
  initiatedBy     String   // "candidate" or "company"

  // Counter offer details
  counterSalary   Int?
  counterBenefits Json?    // Modified benefits
  message         String   @db.Text

  // Response
  response        String?  @db.Text
  status          String   @default("pending") // pending, accepted, rejected, superseded
  respondedAt     DateTime?
  respondedBy     String?

  // Relations
  offer           JobOffer @relation(fields: [offerId], references: [id], onDelete: Cascade)
  responder       User?    @relation(fields: [respondedBy], references: [id], onDelete: SetNull)

  createdAt       DateTime @default(now())

  @@index([offerId])
  @@index([status])
  @@index([createdAt(sort: Desc)])
  @@map("offer_negotiations")
}

// ============================================
// OFFER ATTACHMENT (Feature #23)
// ============================================
model OfferAttachment {
  id          String   @id @default(uuid())
  offerId     String

  // File details
  filename    String
  originalName String
  mimeType    String
  size        Int      // bytes

  // Storage
  fileUrl     String   // MinIO URL
  bucket      String   @default("offers")

  // Metadata
  description String?  @db.Text
  uploadedBy  String

  // Relations
  offer       JobOffer @relation(fields: [offerId], references: [id], onDelete: Cascade)
  uploader    User     @relation(fields: [uploadedBy], references: [id], onDelete: Cascade)

  createdAt   DateTime @default(now())

  @@index([offerId])
  @@map("offer_attachments")
}

// ============================================
// OFFER REVISION (Feature #29)
// ============================================
model OfferRevision {
  id          String   @id @default(uuid())
  offerId     String

  // Version info
  version     Int      // 1, 2, 3...
  changeType  String   // created, updated, approved, sent

  // Snapshot of offer data at this version
  snapshot    Json     // Full offer object

  // What changed
  changes     Json?    // Diff of changes {field: {old, new}}
  changeNotes String?  @db.Text

  // Who made the change
  changedBy   String

  // Relations
  offer       JobOffer @relation(fields: [offerId], references: [id], onDelete: Cascade)
  changer     User     @relation(fields: [changedBy], references: [id], onDelete: Cascade)

  createdAt   DateTime @default(now())

  @@unique([offerId, version])
  @@index([offerId])
  @@index([createdAt(sort: Desc)])
  @@map("offer_revisions")
}

// ============================================
// UPDATE EXISTING MODELS
// ============================================

// Add to User model:
model User {
  // ... existing fields ...

  // NEW Relations
  offersCreated     JobOffer[]         @relation("OfferCreator")
  offersApproved    JobOffer[]         @relation("OfferApprover")
  negotiations      OfferNegotiation[]
  attachments       OfferAttachment[]
  revisions         OfferRevision[]
}

// Add to Candidate model:
model Candidate {
  // ... existing fields ...

  // NEW Relation
  jobOffers         JobOffer[]
}

// Add to JobPosting model:
model JobPosting {
  // ... existing fields ...

  // NEW Relation
  jobOffers         JobOffer[]
}
```

---

## 🔌 API ENDPOINTS

### Complete API List (45 endpoints)

#### **1. Offer Template Categories** (6 endpoints)
```
GET    /api/v1/offer-template-categories
POST   /api/v1/offer-template-categories
GET    /api/v1/offer-template-categories/:id
PUT    /api/v1/offer-template-categories/:id
DELETE /api/v1/offer-template-categories/:id
PATCH  /api/v1/offer-template-categories/:id/reorder
```

#### **2. Offer Templates** (8 endpoints)
```
GET    /api/v1/offer-templates
GET    /api/v1/offer-templates?categoryId=xxx
POST   /api/v1/offer-templates
GET    /api/v1/offer-templates/:id
PUT    /api/v1/offer-templates/:id
DELETE /api/v1/offer-templates/:id
PATCH  /api/v1/offer-templates/:id/activate
PATCH  /api/v1/offer-templates/:id/deactivate
```

#### **3. Job Offers - CRUD** (7 endpoints)
```
GET    /api/v1/offers
GET    /api/v1/offers?status=draft&candidateId=xxx
POST   /api/v1/offers
POST   /api/v1/offers/from-template/:templateId
GET    /api/v1/offers/:id
PUT    /api/v1/offers/:id
DELETE /api/v1/offers/:id
```

#### **4. Job Offers - Actions** (9 endpoints)
```
PATCH  /api/v1/offers/:id/send
PATCH  /api/v1/offers/:id/approve
PATCH  /api/v1/offers/:id/reject-approval
PATCH  /api/v1/offers/:id/cancel
PATCH  /api/v1/offers/:id/expire (manual expire)
POST   /api/v1/offers/bulk-send (Feature #19)
GET    /api/v1/offers/:id/preview-pdf
GET    /api/v1/offers/:id/download-pdf
POST   /api/v1/offers/:id/resend-email
```

#### **5. Public Acceptance** (3 endpoints - Feature #15)
```
GET    /api/v1/offers/public/:token
PATCH  /api/v1/offers/public/:token/accept
PATCH  /api/v1/offers/public/:token/reject
```

#### **6. Negotiations** (5 endpoints - Feature #21)
```
GET    /api/v1/offers/:offerId/negotiations
POST   /api/v1/offers/:offerId/negotiations (candidate counter-offer)
GET    /api/v1/negotiations/:id
PATCH  /api/v1/negotiations/:id/respond
DELETE /api/v1/negotiations/:id
```

#### **7. Attachments** (4 endpoints - Feature #23)
```
GET    /api/v1/offers/:offerId/attachments
POST   /api/v1/offers/:offerId/attachments (file upload)
GET    /api/v1/attachments/:id/download
DELETE /api/v1/attachments/:id
```

#### **8. Revisions** (3 endpoints - Feature #29)
```
GET    /api/v1/offers/:offerId/revisions
GET    /api/v1/revisions/:id
POST   /api/v1/offers/:offerId/rollback/:version
```

#### **9. Analytics** (5 endpoints - Features #24-27)
```
GET    /api/v1/offers/analytics/overview
GET    /api/v1/offers/analytics/acceptance-rate
GET    /api/v1/offers/analytics/response-time
GET    /api/v1/offers/analytics/by-department
GET    /api/v1/offers/analytics/trends?period=month
```

---

## 🎨 FRONTEND YAPISI

### Pages & Routes

```
app/
├── (authenticated)/
│   ├── offers/
│   │   ├── page.tsx                    # List view (Feature #5)
│   │   ├── new/
│   │   │   └── page.tsx                # Create wizard (4 steps)
│   │   ├── [id]/
│   │   │   ├── page.tsx                # Detail view (Feature #6)
│   │   │   ├── edit/page.tsx           # Edit offer
│   │   │   └── revisions/page.tsx      # Version history (Feature #29)
│   │   ├── templates/
│   │   │   ├── page.tsx                # Template list (Feature #13)
│   │   │   ├── new/page.tsx            # Create template
│   │   │   ├── [id]/page.tsx           # Template detail
│   │   │   └── categories/page.tsx     # Category management (Feature #30)
│   │   └── analytics/
│   │       └── page.tsx                # Analytics dashboard (Features #24-27)
│   └── dashboard/
│       └── page.tsx                    # Add offer stats
└── accept-offer/
    └── [token]/
        └── page.tsx                    # Public acceptance (Feature #15)
```

### Components

```
components/
├── offers/
│   ├── OfferWizard/
│   │   ├── Step1SelectCandidate.tsx
│   │   ├── Step2OfferDetails.tsx
│   │   ├── Step3BenefitsTerms.tsx
│   │   └── Step4ReviewSend.tsx
│   ├── OfferList.tsx
│   ├── OfferCard.tsx
│   ├── OfferDetailView.tsx
│   ├── OfferStatusBadge.tsx
│   ├── OfferPdfViewer.tsx
│   ├── BulkSendModal.tsx               # Feature #19
│   ├── NegotiationTimeline.tsx         # Feature #21
│   ├── AttachmentUploader.tsx          # Feature #23
│   ├── RevisionHistory.tsx             # Feature #29
│   └── OfferAnalyticsCharts.tsx        # Features #24-27
├── templates/
│   ├── TemplateList.tsx
│   ├── TemplateForm.tsx
│   ├── TemplatePreview.tsx
│   ├── CategoryManager.tsx             # Feature #30
│   └── TemplatePicker.tsx
└── public-offer/
    └── AcceptanceForm.tsx
```

---

## 🚀 FAZ 1: TEMEL ALTYAPI (4 gün)

### Hedef: Temel teklif sistemi çalışır hale gelsin

### Özellikler:
- ✅ #1: Teklif Oluşturma
- ✅ #2: PDF Oluşturma
- ✅ #3: Email Gönderimi
- ✅ #4: Durum Takibi
- ✅ #5: Teklif Listeleme
- ✅ #6: Teklif Detay Görüntüleme

---

### GÜN 1: Database & Basic Backend (8 saat)

#### Sabah (4 saat): Database Setup
```bash
# 1. Prisma Schema Update
backend/prisma/schema.prisma

✅ Add JobOffer model (basic fields)
✅ Add User relations (offersCreated, offersApproved)
✅ Add Candidate relation (jobOffers)
✅ Add JobPosting relation (jobOffers)

# 2. Create Migration
npx prisma migrate dev --name add_job_offers

# 3. Generate Prisma Client
npx prisma generate
```

**Detaylar:**
- JobOffer modeli sadece temel alanlarla (id, candidateId, position, salary, status, etc.)
- İlişkiler: Candidate, JobPosting, User (creator)
- Status enum: draft, sent, accepted, rejected
- createdAt, updatedAt timestamps

#### Öğleden Sonra (4 saat): Core Services
```bash
# 1. Create offerService.js
backend/src/services/offerService.js

✅ createOffer(data, userId)
✅ getOffers(filters, pagination)
✅ getOfferById(id)
✅ updateOffer(id, data)
✅ deleteOffer(id)
✅ updateStatus(id, status)
```

**offerService.js - Core Functions:**

```javascript
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Create new job offer
 * Feature #1: Teklif Oluşturma
 */
async function createOffer(data, userId) {
  // Validation
  if (!data.candidateId || !data.position || !data.salary) {
    throw new Error('Required fields missing');
  }

  // Check candidate exists
  const candidate = await prisma.candidate.findUnique({
    where: { id: data.candidateId }
  });
  if (!candidate) {
    throw new Error('Candidate not found');
  }

  // Create offer
  const offer = await prisma.jobOffer.create({
    data: {
      candidateId: data.candidateId,
      jobPostingId: data.jobPostingId,
      createdBy: userId,
      position: data.position,
      department: data.department,
      salary: data.salary,
      currency: data.currency || 'TRY',
      startDate: new Date(data.startDate),
      workType: data.workType || 'office',
      benefits: data.benefits || {},
      terms: data.terms || '',
      status: 'draft',
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      acceptanceToken: generateToken() // UUID
    },
    include: {
      candidate: true,
      jobPosting: true,
      creator: { select: { id: true, email: true, role: true } }
    }
  });

  // Create initial revision (Feature #29 için hazırlık)
  await createRevision(offer.id, 'created', offer, userId);

  return offer;
}

/**
 * Get offers with filters
 * Feature #5: Teklif Listeleme
 */
async function getOffers(filters = {}, pagination = {}) {
  const { page = 1, limit = 20, status, candidateId, createdBy } = { ...filters, ...pagination };

  const where = {};
  if (status) where.status = status;
  if (candidateId) where.candidateId = candidateId;
  if (createdBy) where.createdBy = createdBy;

  const [offers, total] = await Promise.all([
    prisma.jobOffer.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      include: {
        candidate: { select: { id: true, firstName: true, lastName: true, email: true } },
        jobPosting: { select: { id: true, title: true, department: true } },
        creator: { select: { id: true, email: true } }
      },
      orderBy: { createdAt: 'desc' }
    }),
    prisma.jobOffer.count({ where })
  ]);

  return {
    offers,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  };
}

/**
 * Get offer by ID
 * Feature #6: Teklif Detay Görüntüleme
 */
async function getOfferById(id) {
  const offer = await prisma.jobOffer.findUnique({
    where: { id },
    include: {
      candidate: true,
      jobPosting: true,
      creator: { select: { id: true, email: true, role: true } },
      approver: { select: { id: true, email: true } }
    }
  });

  if (!offer) {
    throw new Error('Offer not found');
  }

  // Increment view count
  await prisma.jobOffer.update({
    where: { id },
    data: {
      viewCount: { increment: 1 },
      lastViewedAt: new Date()
    }
  });

  return offer;
}

// Helper: Generate unique token
function generateToken() {
  return require('uuid').v4();
}

module.exports = {
  createOffer,
  getOffers,
  getOfferById,
  updateOffer,
  deleteOffer,
  updateStatus
};
```

---

### GÜN 2: PDF Generation & Email (8 saat)

#### Sabah (4 saat): PDF Service
```bash
# Create offerPdfService.js
backend/src/services/offerPdfService.js

✅ generateOfferPdf(offerId)
✅ createPdfTemplate(offer, candidate)
✅ uploadToMinio(pdfBuffer, filename)
```

**offerPdfService.js - PDF Generation (Feature #2):**

```javascript
const PDFDocument = require('pdfkit');
const { PrismaClient } = require('@prisma/client');
const minioService = require('./minioService');
const prisma = new PrismaClient();

/**
 * Generate job offer PDF
 * Feature #2: PDF Oluşturma
 */
async function generateOfferPdf(offerId) {
  // Get offer with all relations
  const offer = await prisma.jobOffer.findUnique({
    where: { id: offerId },
    include: {
      candidate: true,
      jobPosting: true,
      creator: true
    }
  });

  if (!offer) {
    throw new Error('Offer not found');
  }

  // Create PDF
  const doc = new PDFDocument({ size: 'A4', margin: 50 });
  const chunks = [];

  doc.on('data', chunk => chunks.push(chunk));
  doc.on('end', () => {});

  // Header with logo (optional)
  doc.fontSize(24)
     .fillColor('#3B82F6')
     .text('İŞ TEKLİFİ', { align: 'center' })
     .moveDown();

  doc.fontSize(10)
     .fillColor('#6B7280')
     .text('IKAI HR Platform', { align: 'center' })
     .moveDown(2);

  // Candidate info
  doc.fontSize(16)
     .fillColor('#1F2937')
     .text(`Sayın ${offer.candidate.firstName} ${offer.candidate.lastName},`)
     .moveDown();

  doc.fontSize(12)
     .fillColor('#4B5563')
     .text(`${offer.candidate.email} adresine gönderilen bu teklif mektubu ile sizinle `)
     .text(`${offer.position} pozisyonunda çalışmaktan mutluluk duyacağız.`)
     .moveDown(2);

  // Offer details box
  doc.rect(50, doc.y, 495, 200)
     .fillAndStroke('#F9FAFB', '#3B82F6');

  const boxY = doc.y + 20;
  doc.fillColor('#1F2937')
     .fontSize(14)
     .text('📋 Teklif Detayları', 70, boxY);

  doc.fontSize(11)
     .fillColor('#374151')
     .text(`Pozisyon: ${offer.position}`, 70, boxY + 30)
     .text(`Departman: ${offer.department}`, 70, boxY + 50)
     .text(`Maaş: ₺${offer.salary.toLocaleString('tr-TR')} (${offer.currency})`, 70, boxY + 70)
     .text(`Başlangıç Tarihi: ${new Date(offer.startDate).toLocaleDateString('tr-TR')}`, 70, boxY + 90)
     .text(`Çalışma Şekli: ${getWorkTypeLabel(offer.workType)}`, 70, boxY + 110);

  doc.y = boxY + 180;
  doc.moveDown(2);

  // Benefits
  if (offer.benefits && Object.keys(offer.benefits).length > 0) {
    doc.fontSize(14)
       .fillColor('#1F2937')
       .text('🎁 Yan Haklar')
       .moveDown(0.5);

    doc.fontSize(11)
       .fillColor('#374151');

    const benefits = offer.benefits;
    if (benefits.insurance) doc.text('• Özel Sağlık Sigortası');
    if (benefits.meal) doc.text(`• Yemek Kartı (₺${benefits.meal}/ay)`);
    if (benefits.transportation) doc.text('• Ulaşım Desteği');
    if (benefits.gym) doc.text('• Spor Salonu Üyeliği');
    if (benefits.education) doc.text('• Eğitim Desteği');

    doc.moveDown(2);
  }

  // Terms
  if (offer.terms) {
    doc.fontSize(14)
       .fillColor('#1F2937')
       .text('📜 Şartlar ve Koşullar')
       .moveDown(0.5);

    doc.fontSize(10)
       .fillColor('#4B5563')
       .text(offer.terms, { align: 'justify' })
       .moveDown(2);
  }

  // Validity notice
  doc.rect(50, doc.y, 495, 60)
     .fillAndStroke('#FEF3C7', '#F59E0B');

  doc.fontSize(11)
     .fillColor('#92400E')
     .text(`📅 Bu teklif ${new Date(offer.expiresAt).toLocaleDateString('tr-TR')} tarihine kadar geçerlidir.`, 70, doc.y - 45);

  doc.y += 40;
  doc.moveDown(2);

  // Footer
  doc.fontSize(9)
     .fillColor('#9CA3AF')
     .text('Bu belge elektronik olarak oluşturulmuştur.', { align: 'center' })
     .text(`Teklif ID: ${offer.id}`, { align: 'center' })
     .text(`Oluşturulma Tarihi: ${new Date().toLocaleDateString('tr-TR')}`, { align: 'center' });

  // Finalize PDF
  doc.end();

  // Wait for completion
  const pdfBuffer = await new Promise((resolve) => {
    doc.on('end', () => resolve(Buffer.concat(chunks)));
  });

  // Upload to MinIO
  const filename = `offer-${offer.id}-${Date.now()}.pdf`;
  const fileUrl = await minioService.uploadFile('offers', filename, pdfBuffer, 'application/pdf');

  return {
    buffer: pdfBuffer,
    filename,
    url: fileUrl
  };
}

function getWorkTypeLabel(type) {
  const labels = {
    office: 'Ofis',
    hybrid: 'Hibrit',
    remote: 'Uzaktan'
  };
  return labels[type] || type;
}

module.exports = {
  generateOfferPdf
};
```

#### Öğleden Sonra (4 saat): Email Service Extension
```bash
# Update emailService.js
backend/src/services/emailService.js

✅ sendOfferEmail(offerId)
✅ offerEmailTemplate(offer, pdfUrl)
```

**emailService.js - Add Offer Email (Feature #3):**

```javascript
/**
 * Send job offer email with PDF
 * Feature #3: Email Gönderimi
 */
async function sendOfferEmail(offerId) {
  const offer = await prisma.jobOffer.findUnique({
    where: { id: offerId },
    include: {
      candidate: true,
      jobPosting: true,
      creator: true
    }
  });

  if (!offer) {
    throw new Error('Offer not found');
  }

  // Generate PDF
  const { buffer: pdfBuffer, filename } = await offerPdfService.generateOfferPdf(offerId);

  // Create acceptance URL
  const acceptanceUrl = `${process.env.FRONTEND_URL}/accept-offer/${offer.acceptanceToken}`;

  // Update offer with acceptance URL
  await prisma.jobOffer.update({
    where: { id: offerId },
    data: { acceptanceUrl }
  });

  const mailOptions = {
    from: `"IKAI HR Platform" <${process.env.GMAIL_USER}>`,
    to: offer.candidate.email,
    subject: `İş Teklifi - ${offer.position}`,
    html: generateOfferEmailHtml(offer, acceptanceUrl),
    attachments: [
      {
        filename,
        content: pdfBuffer,
        contentType: 'application/pdf'
      }
    ]
  };

  const info = await transporter.sendMail(mailOptions);

  // Update offer status
  await prisma.jobOffer.update({
    where: { id: offerId },
    data: {
      status: 'sent',
      emailSent: true,
      emailSentAt: new Date(),
      sentAt: new Date()
    }
  });

  return {
    success: true,
    messageId: info.messageId,
    acceptanceUrl
  };
}

function generateOfferEmailHtml(offer, acceptanceUrl) {
  return `
<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>İş Teklifi</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #F3F4F6;">
  <div style="max-width: 600px; margin: 40px auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">

    <!-- Header -->
    <div style="background: linear-gradient(135deg, #3B82F6, #2563EB); padding: 40px; text-align: center;">
      <h1 style="color: white; margin: 0; font-size: 28px;">🎉 İş Teklifi</h1>
      <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0; font-size: 16px;">IKAI HR Platform</p>
    </div>

    <!-- Content -->
    <div style="padding: 40px;">
      <p style="font-size: 16px; color: #1F2937; margin: 0 0 24px;">
        Sayın <strong>${offer.candidate.firstName} ${offer.candidate.lastName}</strong>,
      </p>

      <p style="font-size: 15px; color: #4B5563; line-height: 1.6; margin: 0 0 24px;">
        Başvurunuz değerlendirilmiş olup, <strong>${offer.position}</strong> pozisyonu için
        sizinle çalışmaktan mutluluk duyacağız.
      </p>

      <!-- Offer Details -->
      <div style="background: #F9FAFB; border-left: 4px solid #3B82F6; padding: 24px; margin: 24px 0; border-radius: 8px;">
        <h3 style="margin: 0 0 16px; color: #1F2937; font-size: 18px;">📋 Teklif Özeti</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; color: #6B7280; font-size: 14px; width: 150px;"><strong>Pozisyon:</strong></td>
            <td style="padding: 8px 0; color: #1F2937; font-size: 15px;">${offer.position}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #6B7280; font-size: 14px;"><strong>Departman:</strong></td>
            <td style="padding: 8px 0; color: #1F2937; font-size: 15px;">${offer.department}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #6B7280; font-size: 14px;"><strong>Maaş:</strong></td>
            <td style="padding: 8px 0; color: #1F2937; font-size: 15px; font-weight: bold;">₺${offer.salary.toLocaleString('tr-TR')} (${offer.currency})</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #6B7280; font-size: 14px;"><strong>Başlangıç:</strong></td>
            <td style="padding: 8px 0; color: #1F2937; font-size: 15px;">${new Date(offer.startDate).toLocaleDateString('tr-TR')}</td>
          </tr>
        </table>
      </div>

      <!-- Validity Notice -->
      <div style="background: #FEF3C7; border-left: 4px solid #F59E0B; padding: 16px; margin: 24px 0; border-radius: 8px;">
        <p style="margin: 0; color: #92400E; font-size: 14px;">
          <strong>📅 Önemli:</strong> Bu teklif ${new Date(offer.expiresAt).toLocaleDateString('tr-TR')} tarihine kadar geçerlidir.
        </p>
      </div>

      <!-- CTA Buttons -->
      <div style="text-align: center; margin: 40px 0;">
        <p style="margin: 0 0 20px; color: #6B7280; font-size: 14px;">
          Teklifi kabul etmek veya reddetmek için aşağıdaki butonları kullanabilirsiniz:
        </p>
        <a href="${acceptanceUrl}"
           style="display: inline-block; background: #10B981; color: white; padding: 16px 40px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; margin: 0 10px;">
          ✅ Teklifi Kabul Et
        </a>
      </div>

      <!-- Attachment Notice -->
      <p style="font-size: 14px; color: #6B7280; margin: 24px 0; text-align: center;">
        📎 Detaylı teklif mektubu ekte PDF olarak bulunmaktadır.
      </p>
    </div>

    <!-- Footer -->
    <div style="background: #F9FAFB; padding: 24px; text-align: center; border-top: 1px solid #E5E7EB;">
      <p style="margin: 0; color: #6B7280; font-size: 13px;">
        Bu e-posta IKAI HR Platform tarafından otomatik olarak gönderilmiştir.
      </p>
      <p style="margin: 8px 0 0; color: #9CA3AF; font-size: 12px;">
        © 2025 IKAI HR Platform - Tüm hakları saklıdır.
      </p>
    </div>

  </div>
</body>
</html>
  `;
}

module.exports = {
  // ... existing exports
  sendOfferEmail
};
```

---

### GÜN 3: Controller & Routes (8 saat)

#### Tam Gün: API Implementation
```bash
# 1. Create offerController.js
backend/src/controllers/offerController.js

✅ createOffer(req, res)
✅ getOffers(req, res)
✅ getOfferById(req, res)
✅ updateOffer(req, res)
✅ deleteOffer(req, res)
✅ sendOffer(req, res)

# 2. Create offerRoutes.js
backend/src/routes/offerRoutes.js

✅ POST   /api/v1/offers
✅ GET    /api/v1/offers
✅ GET    /api/v1/offers/:id
✅ PUT    /api/v1/offers/:id
✅ DELETE /api/v1/offers/:id
✅ PATCH  /api/v1/offers/:id/send

# 3. Register routes in index.js
backend/src/index.js
```

**offerController.js:**

```javascript
const offerService = require('../services/offerService');
const offerPdfService = require('../services/offerPdfService');
const emailService = require('../services/emailService');

class OfferController {

  /**
   * Create new offer
   * POST /api/v1/offers
   * Feature #1
   */
  async createOffer(req, res) {
    try {
      const userId = req.user.id;
      const offer = await offerService.createOffer(req.body, userId);

      res.status(201).json({
        success: true,
        message: 'Teklif başarıyla oluşturuldu',
        data: offer
      });
    } catch (error) {
      console.error('❌ Create offer error:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * Get all offers with filters
   * GET /api/v1/offers?status=draft&page=1&limit=20
   * Feature #5
   */
  async getOffers(req, res) {
    try {
      const { status, candidateId, createdBy, page, limit } = req.query;
      const userId = req.user.id;

      const result = await offerService.getOffers(
        { status, candidateId, createdBy: createdBy || userId },
        { page: parseInt(page) || 1, limit: parseInt(limit) || 20 }
      );

      res.json({
        success: true,
        data: result.offers,
        pagination: result.pagination
      });
    } catch (error) {
      console.error('❌ Get offers error:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * Get offer by ID
   * GET /api/v1/offers/:id
   * Feature #6
   */
  async getOfferById(req, res) {
    try {
      const { id } = req.params;
      const offer = await offerService.getOfferById(id);

      res.json({
        success: true,
        data: offer
      });
    } catch (error) {
      console.error('❌ Get offer error:', error);
      res.status(404).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * Update offer
   * PUT /api/v1/offers/:id
   */
  async updateOffer(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const offer = await offerService.updateOffer(id, req.body, userId);

      res.json({
        success: true,
        message: 'Teklif güncellendi',
        data: offer
      });
    } catch (error) {
      console.error('❌ Update offer error:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * Delete offer
   * DELETE /api/v1/offers/:id
   */
  async deleteOffer(req, res) {
    try {
      const { id } = req.params;
      await offerService.deleteOffer(id);

      res.json({
        success: true,
        message: 'Teklif silindi'
      });
    } catch (error) {
      console.error('❌ Delete offer error:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * Send offer email
   * PATCH /api/v1/offers/:id/send
   * Features #2 + #3
   */
  async sendOffer(req, res) {
    try {
      const { id } = req.params;
      const result = await emailService.sendOfferEmail(id);

      res.json({
        success: true,
        message: 'Teklif gönderildi',
        data: result
      });
    } catch (error) {
      console.error('❌ Send offer error:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * Preview PDF
   * GET /api/v1/offers/:id/preview-pdf
   */
  async previewPdf(req, res) {
    try {
      const { id } = req.params;
      const { buffer } = await offerPdfService.generateOfferPdf(id);

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `inline; filename=offer-${id}.pdf`);
      res.send(buffer);
    } catch (error) {
      console.error('❌ Preview PDF error:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
}

module.exports = new OfferController();
```

**offerRoutes.js:**

```javascript
const express = require('express');
const router = express.Router();
const offerController = require('../controllers/offerController');
const { authenticate } = require('../middleware/auth');

// All routes require authentication
router.use(authenticate);

// CRUD
router.post('/', offerController.createOffer);
router.get('/', offerController.getOffers);
router.get('/:id', offerController.getOfferById);
router.put('/:id', offerController.updateOffer);
router.delete('/:id', offerController.deleteOffer);

// Actions
router.patch('/:id/send', offerController.sendOffer);
router.get('/:id/preview-pdf', offerController.previewPdf);

module.exports = router;
```

**backend/src/index.js - Register routes:**

```javascript
// ... existing imports

const offerRoutes = require('./routes/offerRoutes');

// ... existing routes

app.use('/api/v1/offers', offerRoutes);
```

---

### GÜN 4: Frontend Basic UI (8 saat)

#### Sabah (4 saat): List & Detail Pages
```bash
# 1. Create offer service
frontend/services/offerService.ts

✅ fetchOffers(filters)
✅ fetchOfferById(id)
✅ createOffer(data)
✅ updateOffer(id, data)
✅ deleteOffer(id)
✅ sendOffer(id)

# 2. Create list page
frontend/app/(authenticated)/offers/page.tsx

✅ OfferList component
✅ Filters (status, search)
✅ Pagination
✅ Status badges
```

#### Öğleden Sonra (4 saat): Create Form (Simple)
```bash
# Create new offer page
frontend/app/(authenticated)/offers/new/page.tsx

✅ Simple form (not wizard yet)
✅ Candidate selection
✅ Position, salary, start date
✅ Benefits checkboxes
✅ Submit & preview
```

---

### ✅ FAZ 1 TAMAMLANMA KRİTERLERİ:

```bash
# Test checklist
□ Teklif oluştur (POST /api/v1/offers)
□ Teklifleri listele (GET /api/v1/offers)
□ Teklif detay gör (GET /api/v1/offers/:id)
□ PDF oluştur ve görüntüle
□ Email gönder (with PDF)
□ Status değiştir (draft → sent)
□ Frontend list page çalışıyor
□ Frontend create form çalışıyor
```

---

## 🎨 FAZ 2: TEMPLATE SİSTEMİ (3 gün)

### Hedef: Şablon sistemi ve kategoriler

### Özellikler:
- ✅ #7: Teklif Şablonları
- ✅ #8: Pozisyon Bazlı Otomatik Doldurma
- ✅ #9: Kabul/Red Linki (hazırlık)
- ✅ #13: Template Yönetimi
- ✅ #14: Şablondan Teklif Oluştur
- ✅ #30: Teklif Şablon Kategorileri

---

### GÜN 5: Template Backend (8 saat)

#### Sabah (4 saat): Category System
```bash
# 1. Update Prisma schema
backend/prisma/schema.prisma

✅ Add OfferTemplateCategory model
✅ Add relation to OfferTemplate

# 2. Migrate
npx prisma migrate dev --name add_template_categories

# 3. Create categoryService.js
backend/src/services/categoryService.js

✅ CRUD operations
✅ Reordering
```

#### Öğleden Sonra (4 saat): Template Service
```bash
# Create templateService.js
backend/src/services/templateService.js

✅ createTemplate(data)
✅ getTemplates(filters)
✅ getTemplateById(id)
✅ updateTemplate(id, data)
✅ deleteTemplate(id)
✅ createOfferFromTemplate(templateId, overrides)
```

**templateService.js - Key Function:**

```javascript
/**
 * Create offer from template
 * Feature #14: Şablondan Teklif Oluştur
 */
async function createOfferFromTemplate(templateId, overrides, userId) {
  // Get template
  const template = await prisma.offerTemplate.findUnique({
    where: { id: templateId },
    include: { category: true }
  });

  if (!template) {
    throw new Error('Template not found');
  }

  // Merge template data with overrides
  const offerData = {
    templateId: template.id,
    position: overrides.position || template.position,
    department: overrides.department || template.department,
    salary: overrides.salary || template.salaryMin, // Use min as default
    currency: template.currency,
    workType: overrides.workType || template.workType,
    benefits: { ...template.benefits, ...overrides.benefits },
    terms: overrides.terms || template.terms,
    ...overrides
  };

  // Create offer using offer service
  const offer = await offerService.createOffer(offerData, userId);

  // Increment template usage count
  await prisma.offerTemplate.update({
    where: { id: templateId },
    data: { usageCount: { increment: 1 } }
  });

  return offer;
}
```

---

### GÜN 6: Template Controller & Routes (8 saat)

```bash
# 1. Create controllers
backend/src/controllers/categoryController.js
backend/src/controllers/templateController.js

# 2. Create routes
backend/src/routes/categoryRoutes.js
backend/src/routes/templateRoutes.js

# 3. Register routes
```

---

### GÜN 7: Template Frontend (8 saat)

#### Sabah (4 saat): Template Management UI
```bash
# Pages
frontend/app/(authenticated)/offers/templates/page.tsx
frontend/app/(authenticated)/offers/templates/new/page.tsx
frontend/app/(authenticated)/offers/templates/[id]/page.tsx
frontend/app/(authenticated)/offers/templates/categories/page.tsx

# Components
components/templates/TemplateList.tsx
components/templates/TemplateForm.tsx
components/templates/CategoryManager.tsx
```

#### Öğleden Sonra (4 saat): Template Picker
```bash
# Update offer create page
frontend/app/(authenticated)/offers/new/page.tsx

✅ Add template selection
✅ Auto-fill from template (Feature #8)
✅ Override template values
```

---

### ✅ FAZ 2 TAMAMLANMA KRİTERLERİ:

```bash
□ Kategori oluştur/düzenle
□ Template oluştur
□ Template'leri kategoriye göre listele
□ Template'ten teklif oluştur
□ Template verilerı otomatik dolduruluyor
□ Template usage count artıyor
```

---

## 🔗 FAZ 3: ACCEPTANCE & TRACKING (4 gün)

### Hedef: Aday kabul sistemi ve onay akışı

### Özellikler:
- ✅ #9: Kabul/Red Linki (tamamlanıyor)
- ✅ #10: Email Bildirimi
- ✅ #11: Onay Sistemi
- ✅ #12: Geçerlilik Süresi
- ✅ #15: Aday Cevap Sayfası

---

### GÜN 8: Public Acceptance API (8 saat)

```bash
# Backend

# 1. Create publicOfferService.js
backend/src/services/publicOfferService.js

✅ getOfferByToken(token)
✅ acceptOffer(token, data)
✅ rejectOffer(token, reason)
✅ validateToken(token)

# 2. Create publicOfferController.js
backend/src/controllers/publicOfferController.js

# 3. Create public routes (no auth)
backend/src/routes/publicOfferRoutes.js

✅ GET    /api/v1/offers/public/:token
✅ PATCH  /api/v1/offers/public/:token/accept
✅ PATCH  /api/v1/offers/public/:token/reject
```

**publicOfferService.js:**

```javascript
/**
 * Accept offer via public token
 * Feature #15: Aday Cevap Sayfası
 */
async function acceptOffer(token, candidateData = {}) {
  // Validate token and get offer
  const offer = await validateToken(token);

  // Check if not expired (Feature #12)
  if (new Date() > new Date(offer.expiresAt)) {
    throw new Error('Teklif süresi dolmuş');
  }

  // Check if already responded
  if (offer.status === 'accepted' || offer.status === 'rejected') {
    throw new Error('Bu teklife zaten cevap verilmiş');
  }

  // Update offer
  const updatedOffer = await prisma.jobOffer.update({
    where: { id: offer.id },
    data: {
      status: 'accepted',
      respondedAt: new Date()
    },
    include: {
      candidate: true,
      creator: true
    }
  });

  // Send notification email to HR
  await sendAcceptanceNotification(updatedOffer, 'accepted');

  return updatedOffer;
}

/**
 * Reject offer via public token
 */
async function rejectOffer(token, reason = '') {
  const offer = await validateToken(token);

  if (new Date() > new Date(offer.expiresAt)) {
    throw new Error('Teklif süresi dolmuş');
  }

  if (offer.status === 'accepted' || offer.status === 'rejected') {
    throw new Error('Bu teklife zaten cevap verilmiş');
  }

  const updatedOffer = await prisma.jobOffer.update({
    where: { id: offer.id },
    data: {
      status: 'rejected',
      respondedAt: new Date(),
      customFields: {
        ...(offer.customFields || {}),
        rejectionReason: reason
      }
    },
    include: {
      candidate: true,
      creator: true
    }
  });

  await sendAcceptanceNotification(updatedOffer, 'rejected', reason);

  return updatedOffer;
}
```

---

### GÜN 9: Approval System (8 saat)

```bash
# Backend

# Update offerService.js
✅ requestApproval(offerId)
✅ approveOffer(offerId, userId, notes)
✅ rejectApproval(offerId, userId, reason)

# Update routes
✅ PATCH /api/v1/offers/:id/request-approval
✅ PATCH /api/v1/offers/:id/approve
✅ PATCH /api/v1/offers/:id/reject-approval

# Email notifications
✅ sendApprovalRequest(offer, approver)
✅ sendApprovalDecision(offer, decision)
```

---

### GÜN 10: Expiration System (8 saat)

```bash
# Backend

# 1. Create expirationService.js
backend/src/services/expirationService.js

✅ checkExpiredOffers() // Cron job
✅ expireOffer(offerId)
✅ extendOffer(offerId, days)

# 2. Setup cron job
backend/src/jobs/offerExpirationJob.js

✅ Run every hour
✅ Check expiresAt < now
✅ Update status to 'expired'
✅ Send notification

# 3. Manual expiration endpoint
✅ PATCH /api/v1/offers/:id/expire
✅ PATCH /api/v1/offers/:id/extend
```

**expirationService.js:**

```javascript
const cron = require('node-cron');

/**
 * Check and expire offers
 * Feature #12: Geçerlilik Süresi
 */
async function checkExpiredOffers() {
  console.log('🕐 Checking expired offers...');

  const expiredOffers = await prisma.jobOffer.findMany({
    where: {
      status: 'sent', // Only check sent offers
      expiresAt: {
        lt: new Date() // Expired
      }
    },
    include: {
      candidate: true,
      creator: true
    }
  });

  console.log(`Found ${expiredOffers.length} expired offers`);

  for (const offer of expiredOffers) {
    await expireOffer(offer.id);
  }

  return expiredOffers.length;
}

async function expireOffer(offerId) {
  const offer = await prisma.jobOffer.update({
    where: { id: offerId },
    data: { status: 'expired' },
    include: {
      candidate: true,
      creator: true
    }
  });

  // Send notification to creator
  await emailService.sendEmail({
    to: offer.creator.email,
    subject: `Teklif Süresi Doldu - ${offer.candidate.firstName} ${offer.candidate.lastName}`,
    html: `
      <p>Merhaba,</p>
      <p>${offer.candidate.firstName} ${offer.candidate.lastName} için oluşturduğunuz
      <strong>${offer.position}</strong> pozisyonu teklifi süresi doldu.</p>
      <p>Teklif ID: ${offer.id}</p>
    `
  });

  return offer;
}

// Setup cron job (runs every hour)
function setupExpirationCron() {
  cron.schedule('0 * * * *', async () => {
    await checkExpiredOffers();
  });
  console.log('✅ Offer expiration cron job started');
}

module.exports = {
  checkExpiredOffers,
  expireOffer,
  setupExpirationCron
};
```

---

### GÜN 11: Public Acceptance Page (8 saat)

```bash
# Frontend

# Create public page (no auth required)
frontend/app/accept-offer/[token]/page.tsx

✅ Fetch offer by token
✅ Show offer details
✅ Accept/Reject buttons
✅ Confirmation modals
✅ Success/error messages
✅ Check if expired
✅ Check if already responded
```

**accept-offer/[token]/page.tsx:**

```typescript
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function AcceptOfferPage() {
  const params = useParams();
  const router = useRouter();
  const token = params.token as string;

  const [offer, setOffer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [accepting, setAccepting] = useState(false);

  useEffect(() => {
    fetchOffer();
  }, [token]);

  async function fetchOffer() {
    try {
      const res = await fetch(`/api/v1/offers/public/${token}`);
      const data = await res.json();

      if (!data.success) {
        setError(data.error);
        return;
      }

      setOffer(data.data);
    } catch (err) {
      setError('Teklif yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  }

  async function handleAccept() {
    if (!confirm('Teklifi kabul etmek istediğinizden emin misiniz?')) {
      return;
    }

    setAccepting(true);

    try {
      const res = await fetch(`/api/v1/offers/public/${token}/accept`, {
        method: 'PATCH'
      });

      const data = await res.json();

      if (data.success) {
        alert('Teklif kabul edildi! En kısa sürede sizinle iletişime geçeceğiz.');
        router.push('/');
      } else {
        alert(data.error);
      }
    } catch (err) {
      alert('Hata oluştu');
    } finally {
      setAccepting(false);
    }
  }

  async function handleReject() {
    const reason = prompt('Reddetme sebebinizi belirtebilir misiniz? (Opsiyonel)');

    if (reason === null) return; // Cancelled

    setAccepting(true);

    try {
      const res = await fetch(`/api/v1/offers/public/${token}/reject`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason })
      });

      const data = await res.json();

      if (data.success) {
        alert('Teklifiniz kaydedildi. Teşekkür ederiz.');
        router.push('/');
      } else {
        alert(data.error);
      }
    } catch (err) {
      alert('Hata oluştu');
    } finally {
      setAccepting(false);
    }
  }

  if (loading) {
    return <div className="p-8">Yükleniyor...</div>;
  }

  if (error) {
    return <div className="p-8 text-red-600">{error}</div>;
  }

  const isExpired = new Date() > new Date(offer.expiresAt);
  const isResponded = offer.status === 'accepted' || offer.status === 'rejected';

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">

        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-8 text-white text-center">
          <h1 className="text-3xl font-bold mb-2">🎉 İş Teklifi</h1>
          <p className="text-blue-100">IKAI HR Platform</p>
        </div>

        {/* Content */}
        <div className="p-8">
          <p className="text-lg mb-6">
            Sayın <strong>{offer.candidate.firstName} {offer.candidate.lastName}</strong>,
          </p>

          <p className="text-gray-700 mb-8">
            <strong>{offer.position}</strong> pozisyonu için sizinle çalışmaktan mutluluk duyacağız.
          </p>

          {/* Offer Details */}
          <div className="bg-gray-50 border-l-4 border-blue-500 p-6 mb-8 rounded">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">📋 Teklif Detayları</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-gray-600 text-sm">Pozisyon:</span>
                <p className="font-semibold">{offer.position}</p>
              </div>
              <div>
                <span className="text-gray-600 text-sm">Departman:</span>
                <p className="font-semibold">{offer.department}</p>
              </div>
              <div>
                <span className="text-gray-600 text-sm">Maaş:</span>
                <p className="font-semibold text-blue-600">
                  ₺{offer.salary.toLocaleString('tr-TR')} ({offer.currency})
                </p>
              </div>
              <div>
                <span className="text-gray-600 text-sm">Başlangıç Tarihi:</span>
                <p className="font-semibold">
                  {new Date(offer.startDate).toLocaleDateString('tr-TR')}
                </p>
              </div>
            </div>
          </div>

          {/* Status Messages */}
          {isExpired && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8">
              <p className="text-red-800">⏰ Bu teklifin süresi dolmuştur.</p>
            </div>
          )}

          {isResponded && (
            <div className={`border-l-4 p-4 mb-8 ${
              offer.status === 'accepted'
                ? 'bg-green-50 border-green-500'
                : 'bg-gray-50 border-gray-500'
            }`}>
              <p className={offer.status === 'accepted' ? 'text-green-800' : 'text-gray-800'}>
                {offer.status === 'accepted'
                  ? '✅ Bu teklifi zaten kabul ettiniz.'
                  : '❌ Bu teklifi zaten reddettiniz.'}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          {!isExpired && !isResponded && (
            <div className="flex gap-4 justify-center mt-8">
              <button
                onClick={handleAccept}
                disabled={accepting}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg disabled:opacity-50"
              >
                ✅ Teklifi Kabul Et
              </button>
              <button
                onClick={handleReject}
                disabled={accepting}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-lg disabled:opacity-50"
              >
                ❌ Teklifi Reddet
              </button>
            </div>
          )}

          {/* Validity Notice */}
          {!isExpired && !isResponded && (
            <p className="text-center text-sm text-gray-600 mt-6">
              📅 Bu teklif {new Date(offer.expiresAt).toLocaleDateString('tr-TR')} tarihine kadar geçerlidir.
            </p>
          )}
        </div>

      </div>
    </div>
  );
}
```

---

### ✅ FAZ 3 TAMAMLANMA KRİTERLERİ:

```bash
□ Public endpoint çalışıyor (no auth)
□ Token validation yapılıyor
□ Aday kabul edebiliyor
□ Aday reddedebiliyor
□ Expired offers otomatik işaretleniyor
□ Approval flow çalışıyor
□ Email notifications gidiyor
```

---

## 📊 FAZ 4: BULK & ANALYTICS (4 gün)

### Hedef: Toplu gönderim ve raporlama

### Özellikler:
- ✅ #19: Toplu Teklif Gönderme
- ✅ #24: Teklif Analitikleri
- ✅ #25: Kabul Oranı Raporları
- ✅ #26: Ortalama Yanıt Süresi
- ✅ #27: Departman Bazlı İstatistik

---

### GÜN 12: Bulk Send Backend (8 saat)

```bash
# Backend

# 1. Create bulkOfferService.js
backend/src/services/bulkOfferService.js

✅ bulkSendOffers(offerIds, userId)
✅ validateOffers(offerIds)
✅ sendInBatches(offers, batchSize)

# 2. Add BullMQ queue (optional - for better performance)
backend/src/queues/offerQueue.js

✅ processOfferSend(offerId)
✅ Error handling & retry

# 3. Create endpoint
✅ POST /api/v1/offers/bulk-send
   Body: { offerIds: ['id1', 'id2', ...] }
```

**bulkOfferService.js:**

```javascript
const emailService = require('./emailService');
const Queue = require('bullmq').Queue;

const offerQueue = new Queue('offer-sending', {
  connection: {
    host: 'localhost',
    port: 6379
  }
});

/**
 * Bulk send job offers
 * Feature #19: Toplu Teklif Gönderme
 */
async function bulkSendOffers(offerIds, userId) {
  console.log(`📧 Bulk sending ${offerIds.length} offers...`);

  // Validate offers
  const offers = await prisma.jobOffer.findMany({
    where: {
      id: { in: offerIds },
      status: 'approved', // Only send approved offers
      createdBy: userId // Only creator can send
    },
    include: {
      candidate: true
    }
  });

  if (offers.length === 0) {
    throw new Error('No valid offers found');
  }

  // Queue offers for sending
  const jobs = [];
  for (const offer of offers) {
    const job = await offerQueue.add('send-offer', {
      offerId: offer.id
    });
    jobs.push(job.id);
  }

  return {
    success: true,
    queued: offers.length,
    jobIds: jobs,
    message: `${offers.length} teklif gönderiliyor...`
  };
}

/**
 * Process offer send job (worker)
 */
async function processOfferSendJob(job) {
  const { offerId } = job.data;

  try {
    await emailService.sendOfferEmail(offerId);
    console.log(`✅ Offer ${offerId} sent`);
    return { success: true };
  } catch (error) {
    console.error(`❌ Failed to send offer ${offerId}:`, error);
    throw error; // Will retry
  }
}

// Setup worker
const { Worker } = require('bullmq');
const worker = new Worker('offer-sending', processOfferSendJob, {
  connection: {
    host: 'localhost',
    port: 6379
  }
});

worker.on('completed', (job) => {
  console.log(`✅ Job ${job.id} completed`);
});

worker.on('failed', (job, err) => {
  console.error(`❌ Job ${job.id} failed:`, err);
});

module.exports = {
  bulkSendOffers
};
```

---

### GÜN 13: Analytics Service (8 saat)

```bash
# Create analyticsOfferService.js
backend/src/services/analyticsOfferService.js

✅ getOverview()
✅ getAcceptanceRate(filters)
✅ getAverageResponseTime(filters)
✅ getByDepartment(filters)
✅ getTrends(period, filters)
```

**analyticsOfferService.js:**

```javascript
/**
 * Get offer analytics overview
 * Feature #24: Teklif Analitikleri
 */
async function getOverview(filters = {}) {
  const { startDate, endDate } = filters;

  const where = {};
  if (startDate || endDate) {
    where.createdAt = {};
    if (startDate) where.createdAt.gte = new Date(startDate);
    if (endDate) where.createdAt.lte = new Date(endDate);
  }

  const [
    total,
    sent,
    accepted,
    rejected,
    expired,
    pending
  ] = await Promise.all([
    prisma.jobOffer.count({ where }),
    prisma.jobOffer.count({ where: { ...where, status: 'sent' } }),
    prisma.jobOffer.count({ where: { ...where, status: 'accepted' } }),
    prisma.jobOffer.count({ where: { ...where, status: 'rejected' } }),
    prisma.jobOffer.count({ where: { ...where, status: 'expired' } }),
    prisma.jobOffer.count({
      where: {
        ...where,
        status: { in: ['draft', 'approved'] }
      }
    })
  ]);

  return {
    total,
    sent,
    accepted,
    rejected,
    expired,
    pending,
    acceptanceRate: sent > 0 ? ((accepted / sent) * 100).toFixed(2) : 0,
    rejectionRate: sent > 0 ? ((rejected / sent) * 100).toFixed(2) : 0
  };
}

/**
 * Get acceptance rate
 * Feature #25: Kabul Oranı Raporları
 */
async function getAcceptanceRate(filters = {}) {
  const { startDate, endDate, department } = filters;

  const where = { status: { in: ['sent', 'accepted', 'rejected'] } };

  if (startDate || endDate) {
    where.sentAt = {};
    if (startDate) where.sentAt.gte = new Date(startDate);
    if (endDate) where.sentAt.lte = new Date(endDate);
  }

  if (department) {
    where.department = department;
  }

  const offers = await prisma.jobOffer.findMany({
    where,
    select: {
      id: true,
      status: true,
      sentAt: true,
      respondedAt: true,
      department: true
    }
  });

  const total = offers.length;
  const accepted = offers.filter(o => o.status === 'accepted').length;
  const rejected = offers.filter(o => o.status === 'rejected').length;
  const pending = offers.filter(o => o.status === 'sent').length;

  return {
    total,
    accepted,
    rejected,
    pending,
    acceptanceRate: total > 0 ? ((accepted / total) * 100).toFixed(2) : 0,
    rejectionRate: total > 0 ? ((rejected / total) * 100).toFixed(2) : 0,
    pendingRate: total > 0 ? ((pending / total) * 100).toFixed(2) : 0
  };
}

/**
 * Get average response time
 * Feature #26: Ortalama Yanıt Süresi
 */
async function getAverageResponseTime(filters = {}) {
  const { startDate, endDate } = filters;

  const where = {
    status: { in: ['accepted', 'rejected'] },
    respondedAt: { not: null },
    sentAt: { not: null }
  };

  if (startDate || endDate) {
    where.sentAt = {};
    if (startDate) where.sentAt.gte = new Date(startDate);
    if (endDate) where.sentAt.lte = new Date(endDate);
  }

  const offers = await prisma.jobOffer.findMany({
    where,
    select: {
      sentAt: true,
      respondedAt: true,
      status: true
    }
  });

  if (offers.length === 0) {
    return {
      averageHours: 0,
      averageDays: 0,
      total: 0
    };
  }

  // Calculate response time for each offer
  const responseTimes = offers.map(offer => {
    const sent = new Date(offer.sentAt);
    const responded = new Date(offer.respondedAt);
    const diffMs = responded - sent;
    const diffHours = diffMs / (1000 * 60 * 60);
    return diffHours;
  });

  const totalHours = responseTimes.reduce((sum, h) => sum + h, 0);
  const averageHours = totalHours / offers.length;
  const averageDays = averageHours / 24;

  return {
    averageHours: averageHours.toFixed(2),
    averageDays: averageDays.toFixed(2),
    total: offers.length,
    fastest: Math.min(...responseTimes).toFixed(2),
    slowest: Math.max(...responseTimes).toFixed(2)
  };
}

/**
 * Get statistics by department
 * Feature #27: Departman Bazlı İstatistik
 */
async function getByDepartment(filters = {}) {
  const { startDate, endDate } = filters;

  const where = {};
  if (startDate || endDate) {
    where.createdAt = {};
    if (startDate) where.createdAt.gte = new Date(startDate);
    if (endDate) where.createdAt.lte = new Date(endDate);
  }

  const offers = await prisma.jobOffer.groupBy({
    by: ['department', 'status'],
    where,
    _count: true
  });

  // Organize by department
  const departments = {};

  offers.forEach(item => {
    if (!departments[item.department]) {
      departments[item.department] = {
        department: item.department,
        total: 0,
        sent: 0,
        accepted: 0,
        rejected: 0,
        expired: 0,
        pending: 0
      };
    }

    departments[item.department].total += item._count;

    if (item.status === 'sent') departments[item.department].sent += item._count;
    if (item.status === 'accepted') departments[item.department].accepted += item._count;
    if (item.status === 'rejected') departments[item.department].rejected += item._count;
    if (item.status === 'expired') departments[item.department].expired += item._count;
    if (item.status === 'draft' || item.status === 'approved') {
      departments[item.department].pending += item._count;
    }
  });

  // Calculate rates
  Object.values(departments).forEach(dept => {
    dept.acceptanceRate = dept.sent > 0
      ? ((dept.accepted / dept.sent) * 100).toFixed(2)
      : 0;
  });

  return Object.values(departments);
}

module.exports = {
  getOverview,
  getAcceptanceRate,
  getAverageResponseTime,
  getByDepartment,
  getTrends
};
```

---

### GÜN 14: Analytics API & Controller (8 saat)

```bash
# Create controller & routes
backend/src/controllers/analyticsOfferController.js
backend/src/routes/analyticsOfferRoutes.js

✅ GET /api/v1/offers/analytics/overview
✅ GET /api/v1/offers/analytics/acceptance-rate
✅ GET /api/v1/offers/analytics/response-time
✅ GET /api/v1/offers/analytics/by-department
✅ GET /api/v1/offers/analytics/trends
```

---

### GÜN 15: Analytics Frontend (8 saat)

```bash
# Create analytics page
frontend/app/(authenticated)/offers/analytics/page.tsx

✅ Overview stats cards
✅ Acceptance rate chart
✅ Response time chart
✅ Department comparison table
✅ Trends chart (line/bar)
✅ Date range filter
✅ Export to PDF/Excel
```

**Analytics Page Structure:**

```typescript
export default function OfferAnalyticsPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">📊 Teklif Analitikleri</h1>

      {/* Filters */}
      <DateRangeFilter />

      {/* Overview Cards */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <StatCard label="Toplam Teklif" value={stats.total} />
        <StatCard label="Kabul Edildi" value={stats.accepted} color="green" />
        <StatCard label="Reddedildi" value={stats.rejected} color="red" />
        <StatCard label="Bekliyor" value={stats.pending} color="yellow" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        <AcceptanceRateChart data={acceptanceData} />
        <ResponseTimeChart data={responseTimeData} />
      </div>

      {/* Department Table */}
      <DepartmentStatsTable data={departmentStats} />

      {/* Trends */}
      <TrendsChart data={trendsData} />
    </div>
  );
}
```

---

### ✅ FAZ 4 TAMAMLANMA KRİTERLERİ:

```bash
□ Toplu teklif gönderimi çalışıyor
□ Queue sistemi çalışıyor
□ Analytics overview endpoint çalışıyor
□ Acceptance rate hesaplanıyor
□ Response time hesaplanıyor
□ Department stats çalışıyor
□ Frontend charts görünüyor
□ Export fonksiyonu çalışıyor
```

---

## 🔄 FAZ 5: VERSIONING & NEGOTIATION (3 gün)

### Hedef: İleri seviye özellikler

### Özellikler:
- ✅ #21: Müzakere Geçmişi
- ✅ #23: Dosya Ekleme
- ✅ #29: Versiyon Geçmişi

---

### GÜN 16: Versioning System (8 saat)

```bash
# Backend

# 1. Create revisionService.js
backend/src/services/revisionService.js

✅ createRevision(offerId, changeType, snapshot, userId)
✅ getRevisions(offerId)
✅ getRevisionById(id)
✅ rollbackToVersion(offerId, version)
✅ compareVersions(version1, version2)

# 2. Add revision hooks
# Automatically create revision on:
# - Create (type: 'created')
# - Update (type: 'updated')
# - Approve (type: 'approved')
# - Send (type: 'sent')

# 3. Create endpoints
✅ GET /api/v1/offers/:offerId/revisions
✅ GET /api/v1/revisions/:id
✅ POST /api/v1/offers/:offerId/rollback/:version
```

**revisionService.js - Key Functions:**

```javascript
/**
 * Create revision snapshot
 * Feature #29: Versiyon Geçmişi
 */
async function createRevision(offerId, changeType, changedData, userId) {
  // Get current offer state
  const offer = await prisma.jobOffer.findUnique({
    where: { id: offerId },
    include: {
      candidate: true,
      jobPosting: true,
      template: true
    }
  });

  if (!offer) {
    throw new Error('Offer not found');
  }

  // Get latest version number
  const latestRevision = await prisma.offerRevision.findFirst({
    where: { offerId },
    orderBy: { version: 'desc' }
  });

  const version = latestRevision ? latestRevision.version + 1 : 1;

  // Calculate changes (diff)
  let changes = null;
  if (latestRevision && changeType === 'updated') {
    changes = calculateDiff(latestRevision.snapshot, changedData);
  }

  // Create revision
  const revision = await prisma.offerRevision.create({
    data: {
      offerId,
      version,
      changeType,
      snapshot: offer, // Full offer state
      changes,
      changedBy: userId
    }
  });

  return revision;
}

/**
 * Rollback to previous version
 */
async function rollbackToVersion(offerId, targetVersion) {
  // Get target revision
  const revision = await prisma.offerRevision.findUnique({
    where: {
      offerId_version: {
        offerId,
        version: targetVersion
      }
    }
  });

  if (!revision) {
    throw new Error('Revision not found');
  }

  // Restore offer from snapshot
  const snapshot = revision.snapshot;

  const updatedOffer = await prisma.jobOffer.update({
    where: { id: offerId },
    data: {
      position: snapshot.position,
      department: snapshot.department,
      salary: snapshot.salary,
      startDate: snapshot.startDate,
      workType: snapshot.workType,
      benefits: snapshot.benefits,
      terms: snapshot.terms
      // Don't restore status, sentAt, etc.
    }
  });

  // Create new revision for rollback
  await createRevision(offerId, `rollback_to_v${targetVersion}`, updatedOffer, userId);

  return updatedOffer;
}

function calculateDiff(oldData, newData) {
  const diff = {};
  const fields = ['position', 'department', 'salary', 'startDate', 'workType', 'benefits', 'terms'];

  fields.forEach(field => {
    if (JSON.stringify(oldData[field]) !== JSON.stringify(newData[field])) {
      diff[field] = {
        old: oldData[field],
        new: newData[field]
      };
    }
  });

  return diff;
}

module.exports = {
  createRevision,
  getRevisions,
  rollbackToVersion,
  compareVersions
};
```

---

### GÜN 17: Negotiation & Attachments (8 saat)

```bash
# 1. Negotiation Service
backend/src/services/negotiationService.js

✅ createNegotiation(offerId, data, initiator)
✅ respondToNegotiation(negotiationId, response, userId)
✅ getNegotiations(offerId)

# 2. Attachment Service
backend/src/services/attachmentService.js

✅ uploadAttachment(offerId, file, userId)
✅ getAttachments(offerId)
✅ downloadAttachment(attachmentId)
✅ deleteAttachment(attachmentId, userId)

# 3. Create endpoints
✅ POST /api/v1/offers/:offerId/negotiations
✅ PATCH /api/v1/negotiations/:id/respond
✅ POST /api/v1/offers/:offerId/attachments (multipart)
✅ DELETE /api/v1/attachments/:id
```

---

### GÜN 18: Frontend - Version & Negotiation UI (8 saat)

```bash
# Pages & Components

# 1. Revision history page
frontend/app/(authenticated)/offers/[id]/revisions/page.tsx

✅ Timeline view
✅ Version comparison
✅ Rollback button
✅ Diff visualization

# 2. Negotiation component
components/offers/NegotiationTimeline.tsx

✅ Show all negotiations
✅ Counter-offer form
✅ Accept/reject negotiation
✅ Thread view

# 3. Attachment uploader
components/offers/AttachmentUploader.tsx

✅ Drag & drop upload
✅ File list
✅ Download/delete
```

---

### ✅ FAZ 5 TAMAMLANMA KRİTERLERİ:

```bash
□ Revision otomatik oluşuyor
□ Version timeline görünüyor
□ Rollback çalışıyor
□ Diff gösteriliyor
□ Negotiation oluşturuluyor
□ Counter-offer yapılabiliyor
□ Attachment upload çalışıyor
□ File download çalışıyor
```

---

## 🧪 FAZ 6: TESTING & POLISH (2 gün)

### Hedef: Tüm sistem test ve düzeltme

---

### GÜN 19: Testing & Bug Fixes (8 saat)

```bash
# E2E Test Scenarios

□ Create offer (all fields)
□ Create from template
□ Bulk send offers
□ Accept offer (public URL)
□ Reject offer
□ Approve offer
□ Offer expiration
□ PDF generation
□ Email sending
□ Revision tracking
□ Negotiation flow
□ Attachment upload
□ Analytics calculations
□ Department stats

# Performance Testing
□ 100 offers load test
□ Bulk send 50 offers
□ PDF generation speed
□ Analytics query optimization

# Security Testing
□ Public token validation
□ Auth on protected routes
□ File upload size limits
□ SQL injection prevention
```

---

### GÜN 20: Documentation & Final Polish (8 saat)

```bash
# Documentation

# 1. Create API documentation
docs/api/offers-api-v1.md

✅ All endpoints
✅ Request/response examples
✅ Error codes
✅ Authentication

# 2. Update README
✅ Offer system overview
✅ Quick start guide
✅ Feature list

# 3. Create user guide
docs/features/job-offer-user-guide.md

✅ How to create offer
✅ How to use templates
✅ How to bulk send
✅ How to view analytics

# Final Checks
□ All console.logs removed (or env-gated)
□ Error messages user-friendly
□ Loading states everywhere
□ Responsive design
□ Accessibility (a11y)
□ Browser compatibility
```

---

## 📁 DOSYA YAPISI (Tam Liste)

```
vps_ikai_workspace/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma (UPDATED: +5 models)
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── offerController.js (NEW)
│   │   │   ├── templateController.js (NEW)
│   │   │   ├── categoryController.js (NEW)
│   │   │   ├── publicOfferController.js (NEW)
│   │   │   ├── analyticsOfferController.js (NEW)
│   │   │   ├── negotiationController.js (NEW)
│   │   │   └── attachmentController.js (NEW)
│   │   ├── services/
│   │   │   ├── offerService.js (NEW)
│   │   │   ├── offerPdfService.js (NEW)
│   │   │   ├── templateService.js (NEW)
│   │   │   ├── categoryService.js (NEW)
│   │   │   ├── publicOfferService.js (NEW)
│   │   │   ├── bulkOfferService.js (NEW)
│   │   │   ├── analyticsOfferService.js (NEW)
│   │   │   ├── expirationService.js (NEW)
│   │   │   ├── revisionService.js (NEW)
│   │   │   ├── negotiationService.js (NEW)
│   │   │   ├── attachmentService.js (NEW)
│   │   │   └── emailService.js (UPDATED: +sendOfferEmail)
│   │   ├── routes/
│   │   │   ├── offerRoutes.js (NEW)
│   │   │   ├── templateRoutes.js (NEW)
│   │   │   ├── categoryRoutes.js (NEW)
│   │   │   ├── publicOfferRoutes.js (NEW)
│   │   │   └── analyticsOfferRoutes.js (NEW)
│   │   ├── queues/
│   │   │   └── offerQueue.js (NEW - BullMQ)
│   │   ├── jobs/
│   │   │   └── offerExpirationJob.js (NEW - Cron)
│   │   └── index.js (UPDATED: register routes, cron)
│   └── package.json (UPDATED: +pdfkit)
│
├── frontend/
│   ├── app/
│   │   ├── (authenticated)/
│   │   │   └── offers/
│   │   │       ├── page.tsx (NEW - List)
│   │   │       ├── new/page.tsx (NEW - Create)
│   │   │       ├── [id]/
│   │   │       │   ├── page.tsx (NEW - Detail)
│   │   │       │   ├── edit/page.tsx (NEW)
│   │   │       │   └── revisions/page.tsx (NEW)
│   │   │       ├── templates/
│   │   │       │   ├── page.tsx (NEW)
│   │   │       │   ├── new/page.tsx (NEW)
│   │   │       │   ├── [id]/page.tsx (NEW)
│   │   │       │   └── categories/page.tsx (NEW)
│   │   │       └── analytics/
│   │   │           └── page.tsx (NEW)
│   │   └── accept-offer/
│   │       └── [token]/
│   │           └── page.tsx (NEW - Public)
│   ├── components/
│   │   ├── offers/
│   │   │   ├── OfferWizard/ (NEW - 4 steps)
│   │   │   ├── OfferList.tsx (NEW)
│   │   │   ├── OfferCard.tsx (NEW)
│   │   │   ├── OfferDetailView.tsx (NEW)
│   │   │   ├── OfferStatusBadge.tsx (NEW)
│   │   │   ├── OfferPdfViewer.tsx (NEW)
│   │   │   ├── BulkSendModal.tsx (NEW)
│   │   │   ├── NegotiationTimeline.tsx (NEW)
│   │   │   ├── AttachmentUploader.tsx (NEW)
│   │   │   ├── RevisionHistory.tsx (NEW)
│   │   │   └── OfferAnalyticsCharts.tsx (NEW)
│   │   ├── templates/
│   │   │   ├── TemplateList.tsx (NEW)
│   │   │   ├── TemplateForm.tsx (NEW)
│   │   │   ├── TemplatePreview.tsx (NEW)
│   │   │   ├── CategoryManager.tsx (NEW)
│   │   │   └── TemplatePicker.tsx (NEW)
│   │   └── public-offer/
│   │       └── AcceptanceForm.tsx (NEW)
│   └── services/
│       ├── offerService.ts (NEW)
│       ├── templateService.ts (NEW)
│       └── analyticsService.ts (NEW)
│
└── docs/
    ├── api/
    │   └── offers-api-v1.md (NEW)
    └── features/
        ├── job-offer-system-proposal.md (EXISTS)
        ├── job-offer-features-comparison.md (EXISTS)
        ├── job-offer-complete-implementation-plan.md (THIS FILE)
        └── job-offer-user-guide.md (NEW)
```

**Totals:**
- Backend files: 31 (7 controllers, 12 services, 5 routes, 2 jobs/queues, 5 other)
- Frontend files: 35+ (11 pages, 20+ components, 3 services)
- Docs: 4 files

---

## 📦 BAĞIMLILIKLAR

### Backend - New Dependencies

```json
{
  "dependencies": {
    "pdfkit": "^0.17.2",          // PDF generation (already exists ✅)
    "bullmq": "^5.61.0",           // Queue system (already exists ✅)
    "node-cron": "^3.0.3"          // Cron jobs (NEW)
  }
}
```

### Frontend - New Dependencies

```json
{
  "dependencies": {
    "recharts": "^2.10.0",         // Charts for analytics
    "react-dropzone": "^14.2.3"    // File upload
  }
}
```

### Install Commands

```bash
# Backend
cd backend
npm install node-cron recharts react-dropzone

# Frontend
cd frontend
npm install recharts react-dropzone
```

---

## 📅 TIMELINE (Detaylı)

| Hafta | Günler | Fazlar | Özellikler | Durum |
|-------|--------|--------|------------|-------|
| **1** | 1-4 | Faz 1 | Temel CRUD + PDF + Email | 🔵 Core |
| **1-2** | 5-7 | Faz 2 | Template + Categories | 🟢 Medium |
| **2** | 8-11 | Faz 3 | Acceptance + Approval + Expiration | 🟡 Complex |
| **3** | 12-15 | Faz 4 | Bulk + Analytics | 🟣 Advanced |
| **3** | 16-18 | Faz 5 | Versioning + Negotiation | 🔴 Expert |
| **4** | 19-20 | Faz 6 | Testing + Documentation | ✅ Polish |

**Toplam:** 20 iş günü = **4 hafta** (1 developer, full-time)

---

## ✅ BAŞARI KRİTERLERİ (Final Checklist)

### Fonksiyonel:
```
□ Teklif oluşturulabiliyor
□ Template'ten teklif oluşturuluyor
□ PDF oluşuyor ve doğru görünüyor
□ Email gönderimi çalışıyor
□ Aday kabul/red edebiliyor (public URL)
□ Onay sistemi çalışıyor
□ Süresi dolan teklifler otomatik expiring
□ Toplu gönderim çalışıyor
□ Analytics doğru hesaplanıyor
□ Versioning çalışıyor
□ Negotiation flow çalışıyor
□ Attachment upload/download çalışıyor
```

### Performans:
```
□ List page < 1s load time
□ PDF generation < 2s
□ Email send < 3s
□ Bulk send 50 offers < 30s
□ Analytics queries < 2s
```

### UX:
```
□ Loading states everywhere
□ Error messages clear
□ Success confirmations
□ Responsive design
□ Mobile friendly
```

### Güvenlik:
```
□ Auth middleware on protected routes
□ Token validation on public routes
□ File upload size limits (10MB)
□ SQL injection prevented (Prisma)
□ XSS prevented (sanitization)
```

---

## 🚀 UYGULAMA BAŞLATMA

### Adım 1: Kararı Onayla
```
✅ Bu plan onaylandı
✅ 23 özellik uygulanacak
✅ 20 gün sürecek
✅ 6 faz halinde
```

### Adım 2: İlk Commit
```bash
git checkout -b feature/job-offer-system
git commit -m "docs: Add job offer complete implementation plan"
git push origin feature/job-offer-system
```

### Adım 3: Faz 1 Başlat
```bash
# GÜN 1 başlıyor...
echo "🚀 Starting Phase 1: Core Infrastructure"
```

---

**HAZIR! Başlamak için onay bekliyorum.** 🎯
