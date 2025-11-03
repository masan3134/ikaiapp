# Teklif Mektubu Sistemi - Feature Proposal

**Date:** 2025-10-29
**Author:** IKAI Development Team
**Status:** Proposed
**Estimated Time:** 7-10 days (Option 2)

---

## 📋 Executive Summary

IKAI HR Platform'a teklif mektubu (job offer letter) sistemi eklenmesi için 3 farklı seçenek analiz edildi. Mevcut altyapı (email, PDF, database) %100 hazır. **Önerilen:** Seçenek 2 (Template + Tracking sistemi).

---

## 🎯 Overview

İşe alım sürecinin son adımı olan teklif mektubu oluşturma, gönderme ve takip sistemi. Mevcut özelliklerle entegre çalışacak:
- İş ilanı oluşturma ✅
- Aday ekleme ✅
- CV analizi ✅
- Test gönderme ✅
- Mülakat oluşturma ✅
- **→ Teklif mektubu** (YENİ)

---

## 👥 User Stories

1. **HR Specialist olarak,** başarılı adaylara hızlı bir şekilde teklif mektubu göndermek istiyorum.
2. **Manager olarak,** teklif şablonları oluşturup departmanım için standartlaştırmak istiyorum.
3. **HR Specialist olarak,** adayın teklifi kabul edip etmediğini takip etmek istiyorum.
4. **Aday olarak,** teklifi PDF olarak görüp email ile kabul/red edebilmek istiyorum.

---

## 🔧 Technical Specification

### Option 1: Basic System (3-5 days)
**Features:**
- Create offer (select candidate)
- Enter position, salary, start date
- Generate PDF + Send email
- Status tracking (sent/accepted/rejected)

**Database:**
```prisma
model JobOffer {
  id           String   @id @default(uuid())
  candidateId  String
  jobPostingId String
  position     String
  salary       Int
  startDate    DateTime
  benefits     String?  @db.Text
  status       String   @default("draft")
  sentAt       DateTime?
  respondedAt  DateTime?
  expiresAt    DateTime
  candidate    Candidate @relation(fields: [candidateId], references: [id])
  jobPosting   JobPosting @relation(fields: [jobPostingId], references: [id])
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}
```

**API Endpoints:**
```
POST   /api/v1/offers              - Create offer
GET    /api/v1/offers              - List all offers
GET    /api/v1/offers/:id          - Get offer details
PATCH  /api/v1/offers/:id/send     - Send offer via email
PATCH  /api/v1/offers/:id/status   - Update status
DELETE /api/v1/offers/:id          - Delete offer
```

---

### Option 2: Template + Tracking System (7-10 days) ⭐ RECOMMENDED

**Additional Features:**
- Offer templates
- Position-based auto-fill
- Acceptance URL system (token-based)
- Email + SMS notifications
- Approval workflow (optional)

**Database:**
```prisma
model OfferTemplate {
  id           String @id @default(uuid())
  name         String
  department   String
  salaryMin    Int
  salaryMax    Int
  benefits     Json
  terms        String @db.Text
  emailSubject String
  emailBody    String @db.Text
  offers       JobOffer[]
  createdAt    DateTime @default(now())
}

model JobOffer {
  id              String   @id @default(uuid())
  candidateId     String
  jobPostingId    String
  templateId      String?

  // Offer Details
  position        String
  department      String
  salary          Int
  startDate       DateTime
  workType        String   // "office", "hybrid", "remote"
  benefits        Json     // {insurance: true, meal: 1000, ...}
  terms           String   @db.Text

  // Status & Tracking
  status          String   @default("draft") // draft, sent, accepted, rejected, expired
  sentAt          DateTime?
  respondedAt     DateTime?
  expiresAt       DateTime // 7 days validity

  // Acceptance System
  acceptanceToken String   @unique
  acceptanceUrl   String

  // Approval (Optional)
  approvalStatus  String   @default("pending") // pending, approved, rejected
  approvedBy      String?
  approvedAt      DateTime?

  // Notifications
  emailSent       Boolean  @default(false)
  smsSent         Boolean  @default(false)

  // Relations
  candidate       Candidate      @relation(fields: [candidateId], references: [id])
  jobPosting      JobPosting     @relation(fields: [jobPostingId], references: [id])
  template        OfferTemplate? @relation(fields: [templateId], references: [id])

  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  @@index([candidateId])
  @@index([status])
  @@index([acceptanceToken])
}
```

**API Endpoints:**
```
# Templates
GET    /api/v1/offer-templates
POST   /api/v1/offer-templates
GET    /api/v1/offer-templates/:id
PUT    /api/v1/offer-templates/:id
DELETE /api/v1/offer-templates/:id

# Offers
GET    /api/v1/offers
POST   /api/v1/offers
POST   /api/v1/offers/from-template/:templateId
GET    /api/v1/offers/:id
PUT    /api/v1/offers/:id
DELETE /api/v1/offers/:id
PATCH  /api/v1/offers/:id/send
PATCH  /api/v1/offers/:id/approve

# Public (Candidate Response)
GET    /api/v1/offers/public/:token
PATCH  /api/v1/offers/public/:token/accept
PATCH  /api/v1/offers/public/:token/reject
```

---

### Option 3: Advanced System (14-21 days)

**Additional Features:**
- All Option 2 features
- E-signature integration (DocuSign API)
- AI salary suggestion (Gemini)
- Bulk offer sending
- Negotiation system
- Offer comparison
- Advanced analytics

**Database Extensions:**
```prisma
model JobOffer {
  // ... all Option 2 fields ...

  // AI Suggestions
  suggestedSalary Int?
  salaryRationale String? @db.Text

  // E-signature
  signatureRequired Boolean @default(false)
  signatureUrl      String?
  signedAt          DateTime?

  // Documents
  attachments       Json?

  // Relations
  negotiations      OfferNegotiation[]
}

model OfferNegotiation {
  id              String   @id @default(uuid())
  offerId         String
  counterSalary   Int?
  counterBenefits String?  @db.Text
  message         String   @db.Text
  status          String   // pending, accepted, rejected
  respondedAt     DateTime?
  offer           JobOffer @relation(fields: [offerId], references: [id])
  createdAt       DateTime @default(now())
}
```

---

## 🎨 UI/UX Design

### Wizard Flow (4 Steps - Similar to Interview)

**Step 1: Candidate Selection**
```
[Search Bar: "Search candidates..."]
┌──────────────────────────────────────┐
│ 📋 Recent Analyzed Candidates        │
├──────────────────────────────────────┤
│ ☑ Ahmet Yılmaz                       │
│   Senior Developer | Score: 85/100   │
│                                       │
│ ☑ Ayşe Demir                         │
│   Product Manager | Score: 78/100    │
└──────────────────────────────────────┘
[Next Step →]
```

**Step 2: Offer Details**
```
Template: [Dropdown: Software Engineer Template ▼]

Position:     [Software Engineer          ]
Department:   [Engineering                ]
Salary:       [₺ 50,000] Brüt/Net [▼]
              💡 AI Suggestion: ₺45,000-55,000
Start Date:   [2025-11-15] 📅
Work Type:    ( ) Office (•) Hybrid ( ) Remote

[Previous] [Next →]
```

**Step 3: Benefits & Terms**
```
✅ Benefits
  ☑ Private Health Insurance
  ☑ Meal Card (₺1,000/month)
  ☑ Transportation
  ☐ Gym Membership

📝 Additional Terms:
┌────────────────────────────────────┐
│ - 14 days annual leave            │
│ - Performance bonus annually       │
│ - Education support                │
└────────────────────────────────────┘

[Preview PDF]
[Previous] [Next →]
```

**Step 4: Review & Send**
```
📊 Offer Summary
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Candidate:  Ahmet Yılmaz
Position:   Software Engineer
Salary:     ₺50,000 (Brüt)
Start Date: 15 Nov 2025

📧 Email Preview
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Subject: İş Teklifi - IKAI Company
[Email template preview...]

⏰ Expires in: 7 days

[Save as Draft] [Send Offer ✉️]
```

---

## 📦 Implementation Plan

### Phase 1: Database & Backend (3 days)
```
Day 1:
- Create Prisma models (JobOffer, OfferTemplate)
- Run migration
- Create basic CRUD services

Day 2-3:
- Implement offerController.js
- Implement offerService.js
- Create offerPdfService.js
- Setup offer email templates
- Create API routes
```

### Phase 2: Frontend (3 days)
```
Day 4-5:
- Create /offers page (list view)
- Create /offers/new (wizard - 4 steps)
- Create /offers/[id] (detail page)

Day 6:
- Create /accept-offer/[token] (public page)
- Add offers to dashboard stats
```

### Phase 3: Testing & Polish (1-2 days)
```
Day 7-8:
- E2E testing
- Email testing
- PDF generation testing
- Fix bugs
- Documentation
```

---

## 🎯 Success Metrics

- ✅ Create offer in < 2 minutes
- ✅ Email delivery rate > 99%
- ✅ PDF generation success > 99%
- ✅ Candidate response rate tracking
- ✅ Average response time analytics

---

## 🔗 Integration Points

**Existing Systems:**
- `emailService.js` → Use for sending offer emails
- `exportService.js` → Pattern for PDF generation
- `interviewService.js` → Reference for wizard pattern
- `Candidate` model → Relation
- `JobPosting` model → Relation

---

## 📊 Comparison Matrix

| Feature | Option 1 | Option 2 | Option 3 |
|---------|----------|----------|----------|
| **Time** | 3-5 days | 7-10 days | 14-21 days |
| **Complexity** | Low | Medium | High |
| **Templates** | ❌ | ✅ | ✅ |
| **Tracking** | Basic | Advanced | Advanced |
| **Acceptance URL** | ❌ | ✅ | ✅ |
| **Approval Flow** | ❌ | ✅ | ✅ |
| **AI Suggestions** | ❌ | ❌ | ✅ |
| **E-signature** | ❌ | ❌ | ✅ |
| **Negotiations** | ❌ | ❌ | ✅ |
| **Future-proof** | Low | High | Very High |

---

## ✅ Recommendation

**Choose Option 2** because:
1. Template system saves time for repetitive offers
2. Acceptance URL provides professional candidate experience
3. Compatible with existing infrastructure (90% reuse)
4. Can be completed in 7-10 days
5. Easy upgrade path to Option 3 in future
6. Balanced feature set vs development time

---

## 📁 File Structure

```
backend/
├── prisma/
│   └── schema.prisma (+ JobOffer, OfferTemplate models)
├── src/
│   ├── controllers/
│   │   └── offerController.js (NEW)
│   ├── services/
│   │   ├── offerService.js (NEW)
│   │   └── offerPdfService.js (NEW)
│   ├── routes/
│   │   └── offerRoutes.js (NEW)
│   └── templates/
│       └── offerEmail.js (NEW)

frontend/
├── app/
│   ├── offers/
│   │   ├── page.tsx (List view)
│   │   ├── new/
│   │   │   └── page.tsx (Wizard - 4 steps)
│   │   └── [id]/
│   │       └── page.tsx (Detail view)
│   └── accept-offer/
│       └── [token]/
│           └── page.tsx (Public acceptance page)
└── services/
    └── offerService.ts (NEW)
```

---

## 🚀 Next Steps

1. Wait for user decision (Option 1, 2, or 3)
2. Create detailed implementation checklist
3. Start Phase 1 development
4. Regular progress updates

---

**Ready to implement when decision is made!** 🎉
