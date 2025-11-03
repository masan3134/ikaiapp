# ✅ FAZ 1: TEMEL ALTYAPI - ULTRA CHECKLIST

**Duration:** 4 Days
**Features:** #1-6 (Basic CRUD + PDF + Email)
**Status:** 🔵 IN PROGRESS

---

## 📋 GENEL BAKIŞ

### Hedefler:
- ✅ Database schema hazır
- ✅ Temel CRUD API çalışıyor
- ✅ PDF oluşturma çalışıyor
- ✅ Email gönderimi çalışıyor
- ✅ Frontend basic UI hazır
- ✅ End-to-end flow test edildi

### Başarı Kriteri:
**Bir teklif oluşturup, PDF ile email gönderebiliyorum.**

---

## 🗓️ GÜN 1: DATABASE & CORE SERVICE (8 saat)

### ⏰ SABAH (09:00 - 13:00) - DATABASE SETUP

#### Task 1.1: Prisma Schema Update ⏱️ 2 saat
```prisma
Location: backend/prisma/schema.prisma
```

**Checklist:**
- [ ] JobOffer model oluşturuldu
  - [ ] id field (String, UUID)
  - [ ] candidateId relation
  - [ ] jobPostingId relation
  - [ ] createdBy relation (User)
  - [ ] position field (String)
  - [ ] department field (String)
  - [ ] salary field (Int)
  - [ ] currency field (String, default "TRY")
  - [ ] startDate field (DateTime)
  - [ ] workType field (String)
  - [ ] benefits field (Json)
  - [ ] terms field (Text)
  - [ ] status field (String, default "draft")
  - [ ] expiresAt field (DateTime)
  - [ ] acceptanceToken field (String, unique)
  - [ ] acceptanceUrl field (String, optional)
  - [ ] emailSent field (Boolean, default false)
  - [ ] emailSentAt field (DateTime, optional)
  - [ ] sentAt field (DateTime, optional)
  - [ ] respondedAt field (DateTime, optional)
  - [ ] createdAt field (DateTime)
  - [ ] updatedAt field (DateTime)

- [ ] User model updated
  - [ ] offersCreated relation added (@relation "OfferCreator")
  - [ ] offersApproved relation added (@relation "OfferApprover")

- [ ] Candidate model updated
  - [ ] jobOffers relation added

- [ ] JobPosting model updated
  - [ ] jobOffers relation added

- [ ] Indexes added
  - [ ] @@index([candidateId])
  - [ ] @@index([jobPostingId])
  - [ ] @@index([createdBy])
  - [ ] @@index([status])
  - [ ] @@index([acceptanceToken])
  - [ ] @@index([expiresAt])
  - [ ] @@index([sentAt])
  - [ ] @@index([createdAt(sort: Desc)])

**Commands:**
```bash
cd backend
nano prisma/schema.prisma
# Copy model from implementation plan
```

**Validation:**
```bash
npx prisma format
npx prisma validate
```

---

#### Task 1.2: Database Migration ⏱️ 30 min
```bash
Location: backend/prisma/migrations/
```

**Checklist:**
- [ ] Migration created successfully
  ```bash
  npx prisma migrate dev --name add_job_offers
  ```
- [ ] No migration errors
- [ ] Migration applied to database
- [ ] Tables visible in database
  ```bash
  npx prisma studio
  # Check: job_offers table exists
  ```

**Expected Output:**
```
✔ Generated Prisma Client
✔ Applied migration 20251029_add_job_offers
```

---

#### Task 1.3: Prisma Client Generation ⏱️ 15 min
```bash
Location: backend/node_modules/.prisma/
```

**Checklist:**
- [ ] Prisma client generated
  ```bash
  npx prisma generate
  ```
- [ ] No TypeScript errors
- [ ] JobOffer type available in Prisma Client

**Test:**
```javascript
// In backend/src/index.js or test file
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Should not throw error
console.log(prisma.jobOffer);
```

---

### ⏰ ÖĞLEDEN SONRA (14:00 - 18:00) - OFFER SERVICE

#### Task 1.4: Create offerService.js ⏱️ 4 saat
```bash
Location: backend/src/services/offerService.js
```

**File Structure:**
```javascript
// backend/src/services/offerService.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { v4: uuidv4 } = require('uuid');

// Functions to implement:
// 1. createOffer(data, userId)
// 2. getOffers(filters, pagination)
// 3. getOfferById(id)
// 4. updateOffer(id, data, userId)
// 5. deleteOffer(id)
// 6. updateStatus(id, status)

module.exports = { ... };
```

**Checklist - createOffer:**
- [ ] Function signature correct: `async function createOffer(data, userId)`
- [ ] Required fields validation
  - [ ] candidateId exists
  - [ ] position exists
  - [ ] salary exists
- [ ] Candidate existence check
  ```javascript
  const candidate = await prisma.candidate.findUnique({ where: { id: data.candidateId } });
  if (!candidate) throw new Error('Candidate not found');
  ```
- [ ] Generate acceptanceToken (UUID)
  ```javascript
  const acceptanceToken = uuidv4();
  ```
- [ ] Calculate expiresAt (7 days from now)
  ```javascript
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  ```
- [ ] Create offer with Prisma
  ```javascript
  const offer = await prisma.jobOffer.create({
    data: { ... },
    include: { candidate: true, jobPosting: true, creator: true }
  });
  ```
- [ ] Return created offer
- [ ] Error handling with try-catch

**Checklist - getOffers:**
- [ ] Function signature: `async function getOffers(filters, pagination)`
- [ ] Default pagination: `{ page: 1, limit: 20 }`
- [ ] Build where clause based on filters
  - [ ] status filter
  - [ ] candidateId filter
  - [ ] createdBy filter
- [ ] Implement pagination (skip/take)
  ```javascript
  skip: (page - 1) * limit,
  take: limit
  ```
- [ ] Include relations: candidate, jobPosting, creator
- [ ] Order by: createdAt DESC
- [ ] Return both offers and pagination metadata
  ```javascript
  return {
    offers: [...],
    pagination: { total, page, limit, totalPages }
  };
  ```
- [ ] Parallel count query for total
  ```javascript
  const [offers, total] = await Promise.all([
    prisma.jobOffer.findMany({ ... }),
    prisma.jobOffer.count({ where })
  ]);
  ```

**Checklist - getOfferById:**
- [ ] Function signature: `async function getOfferById(id)`
- [ ] Find offer by ID with all relations
- [ ] Throw error if not found
- [ ] Increment viewCount
  ```javascript
  await prisma.jobOffer.update({
    where: { id },
    data: {
      viewCount: { increment: 1 },
      lastViewedAt: new Date()
    }
  });
  ```
- [ ] Return offer

**Checklist - updateOffer:**
- [ ] Function signature: `async function updateOffer(id, data, userId)`
- [ ] Check offer exists
- [ ] Validate ownership (createdBy === userId)
- [ ] Update allowed fields only
- [ ] Return updated offer with relations

**Checklist - deleteOffer:**
- [ ] Function signature: `async function deleteOffer(id)`
- [ ] Check offer exists
- [ ] Delete offer (Prisma cascade will handle relations)
  ```javascript
  await prisma.jobOffer.delete({ where: { id } });
  ```
- [ ] Return success

**Checklist - updateStatus:**
- [ ] Function signature: `async function updateStatus(id, status)`
- [ ] Validate status (draft/sent/accepted/rejected/expired)
- [ ] Update status field
- [ ] Update timestamps based on status
  - [ ] If 'sent': set sentAt
  - [ ] If 'accepted' or 'rejected': set respondedAt
- [ ] Return updated offer

**Testing:**
```bash
# Create test file: backend/test-offer-service.js
node test-offer-service.js
```

```javascript
// test-offer-service.js
const offerService = require('./src/services/offerService');

async function test() {
  // Test createOffer
  const offer = await offerService.createOffer({
    candidateId: 'existing-candidate-id',
    jobPostingId: 'existing-job-posting-id',
    position: 'Senior Developer',
    department: 'Engineering',
    salary: 50000,
    startDate: '2025-12-01',
    workType: 'hybrid',
    benefits: { insurance: true, meal: 1000 },
    terms: 'Test terms'
  }, 'user-id');

  console.log('✅ Created offer:', offer.id);

  // Test getOffers
  const { offers } = await offerService.getOffers();
  console.log('✅ Got offers:', offers.length);

  // Test getOfferById
  const single = await offerService.getOfferById(offer.id);
  console.log('✅ Got single offer:', single.position);

  console.log('🎉 All tests passed!');
}

test().catch(console.error);
```

**Validation Checklist:**
- [ ] ✅ createOffer returns valid offer object
- [ ] ✅ getOffers returns array with pagination
- [ ] ✅ getOfferById returns single offer
- [ ] ✅ updateOffer changes fields
- [ ] ✅ deleteOffer removes from DB
- [ ] ✅ updateStatus changes status correctly
- [ ] ✅ No console errors
- [ ] ✅ All promises resolve

---

### 🎯 GÜN 1 COMPLETION CRITERIA

**Must Pass All:**
- [ ] ✅ Prisma schema has JobOffer model
- [ ] ✅ Migration applied successfully
- [ ] ✅ Prisma client generated
- [ ] ✅ offerService.js exists with all 6 functions
- [ ] ✅ createOffer works (tested)
- [ ] ✅ getOffers returns list (tested)
- [ ] ✅ getOfferById returns single offer (tested)
- [ ] ✅ No database errors
- [ ] ✅ No TypeScript/Prisma errors

**Git Commit:**
```bash
git add .
git commit -m "feat(offers): Add database schema and core service (Phase 1 Day 1)

- Add JobOffer Prisma model with all fields
- Update User/Candidate/JobPosting relations
- Create offerService with CRUD operations
- Add indexes for performance
- Test all service functions

Features: #1, #4"
git push origin feature/job-offer-system
```

---

## 🗓️ GÜN 2: PDF GENERATION & EMAIL (8 saat)

### ⏰ SABAH (09:00 - 13:00) - PDF SERVICE

#### Task 2.1: Create offerPdfService.js ⏱️ 4 saat
```bash
Location: backend/src/services/offerPdfService.js
```

**Checklist:**
- [ ] File created
- [ ] Dependencies imported
  ```javascript
  const PDFDocument = require('pdfkit');
  const { PrismaClient } = require('@prisma/client');
  const minioService = require('./minioService');
  ```
- [ ] Main function: `generateOfferPdf(offerId)`
  - [ ] Fetch offer from DB with relations
  - [ ] Create PDFDocument instance
  - [ ] Collect chunks in array
  - [ ] Header section
    - [ ] Title: "İŞ TEKLİFİ"
    - [ ] Subtitle: "IKAI HR Platform"
    - [ ] Blue gradient colors (#3B82F6)
  - [ ] Greeting section
    - [ ] "Sayın [Name]"
    - [ ] Introduction text
  - [ ] Offer details box
    - [ ] Position
    - [ ] Department
    - [ ] Salary (formatted with ₺)
    - [ ] Start date (Turkish format)
    - [ ] Work type label
  - [ ] Benefits section (if exists)
    - [ ] Icon: 🎁
    - [ ] List all benefits
  - [ ] Terms section (if exists)
    - [ ] Icon: 📜
    - [ ] Full terms text
  - [ ] Validity notice box
    - [ ] Yellow background (#FEF3C7)
    - [ ] Expiry date
  - [ ] Footer
    - [ ] "Elektronik olarak oluşturulmuştur"
    - [ ] Offer ID
    - [ ] Creation date
- [ ] Helper function: `getWorkTypeLabel(type)`
  - [ ] office → "Ofis"
  - [ ] hybrid → "Hibrit"
  - [ ] remote → "Uzaktan"
- [ ] Buffer creation from chunks
- [ ] Upload to MinIO
  ```javascript
  const filename = `offer-${offerId}-${Date.now()}.pdf`;
  const fileUrl = await minioService.uploadFile('offers', filename, pdfBuffer, 'application/pdf');
  ```
- [ ] Return buffer, filename, url
- [ ] Error handling

**Test Commands:**
```javascript
// backend/test-pdf.js
const offerPdfService = require('./src/services/offerPdfService');
const fs = require('fs');

async function test() {
  const { buffer, filename } = await offerPdfService.generateOfferPdf('offer-id');

  // Save to file for viewing
  fs.writeFileSync(`/tmp/${filename}`, buffer);
  console.log(`✅ PDF saved to /tmp/${filename}`);
  console.log('Open it to verify layout');
}

test();
```

**Validation Checklist:**
- [ ] ✅ PDF generates without errors
- [ ] ✅ PDF opens in browser/viewer
- [ ] ✅ All text is visible
- [ ] ✅ Turkish characters display correctly (ş, ğ, ı, ü, ö, ç)
- [ ] ✅ Layout looks professional
- [ ] ✅ Salary formatted with ₺ symbol
- [ ] ✅ Date in Turkish format
- [ ] ✅ Colors are correct (blue header, yellow notice)
- [ ] ✅ File uploaded to MinIO
- [ ] ✅ URL is valid

---

### ⏰ ÖĞLEDEN SONRA (14:00 - 18:00) - EMAIL SERVICE

#### Task 2.2: Update emailService.js ⏱️ 3 saat
```bash
Location: backend/src/services/emailService.js
```

**Checklist:**
- [ ] Import offerPdfService
  ```javascript
  const offerPdfService = require('./offerPdfService');
  ```
- [ ] Add `sendOfferEmail(offerId)` function
  - [ ] Fetch offer with relations
  - [ ] Generate PDF via offerPdfService
  - [ ] Create acceptance URL
    ```javascript
    const acceptanceUrl = `${process.env.FRONTEND_URL}/accept-offer/${offer.acceptanceToken}`;
    ```
  - [ ] Update offer with acceptanceUrl
  - [ ] Build email HTML template
    - [ ] Header with gradient
    - [ ] Greeting with candidate name
    - [ ] Offer summary table
    - [ ] Validity notice box
    - [ ] CTA button (Kabul Et)
    - [ ] Attachment notice
    - [ ] Footer
  - [ ] Attach PDF
    ```javascript
    attachments: [{
      filename,
      content: pdfBuffer,
      contentType: 'application/pdf'
    }]
    ```
  - [ ] Send email via Nodemailer
  - [ ] Update offer status
    ```javascript
    status: 'sent',
    emailSent: true,
    emailSentAt: new Date(),
    sentAt: new Date()
    ```
  - [ ] Return success + acceptanceUrl
- [ ] Helper function: `generateOfferEmailHtml(offer, acceptanceUrl)`
  - [ ] Professional HTML template
  - [ ] Responsive design
  - [ ] Turkish content
  - [ ] Proper encoding (UTF-8)

**Email Template Checklist:**
- [ ] Subject: "İş Teklifi - [Position]"
- [ ] From: "IKAI HR Platform <[GMAIL_USER]>"
- [ ] To: candidate email
- [ ] HTML structure:
  - [ ] DOCTYPE html
  - [ ] Meta charset UTF-8
  - [ ] Meta viewport
  - [ ] Inline CSS styles
- [ ] Header section:
  - [ ] Blue gradient background
  - [ ] 🎉 emoji
  - [ ] "İş Teklifi" heading
- [ ] Content section:
  - [ ] Greeting
  - [ ] Introduction paragraph
  - [ ] Offer details table
    - [ ] Position
    - [ ] Department
    - [ ] Salary (bold, blue)
    - [ ] Start date
  - [ ] Validity notice (yellow box)
  - [ ] Instructions text
  - [ ] Accept button (green, large)
  - [ ] PDF attachment notice
- [ ] Footer section:
  - [ ] Auto-generated notice
  - [ ] Copyright
  - [ ] Gray background
- [ ] All text in Turkish
- [ ] Colors match brand:
  - [ ] Primary: #3B82F6
  - [ ] Success: #10B981
  - [ ] Warning: #F59E0B
  - [ ] Gray: #6B7280

**Test Email:**
```javascript
// backend/test-email.js
const emailService = require('./src/services/emailService');

async function test() {
  const result = await emailService.sendOfferEmail('offer-id');
  console.log('✅ Email sent:', result.messageId);
  console.log('📧 Check inbox:', 'candidate@email.com');
  console.log('🔗 Acceptance URL:', result.acceptanceUrl);
}

test();
```

**Validation Checklist:**
- [ ] ✅ Email received in inbox (not spam)
- [ ] ✅ Subject is correct
- [ ] ✅ HTML renders correctly
- [ ] ✅ All images/icons visible
- [ ] ✅ Colors display correctly
- [ ] ✅ PDF attachment is present
- [ ] ✅ PDF attachment opens correctly
- [ ] ✅ Acceptance URL is clickable
- [ ] ✅ Mobile responsive (test on phone)
- [ ] ✅ Turkish characters correct (ş, ğ, ı, ü, ö, ç)
- [ ] ✅ No broken links
- [ ] ✅ Gmail/Outlook compatible

---

#### Task 2.3: Integration Test ⏱️ 1 saat

**Complete Flow Test:**
```javascript
// backend/test-complete-flow.js
const offerService = require('./src/services/offerService');
const emailService = require('./src/services/emailService');

async function testCompleteFlow() {
  console.log('🚀 Starting complete flow test...\n');

  // Step 1: Create offer
  console.log('1️⃣ Creating offer...');
  const offer = await offerService.createOffer({
    candidateId: 'real-candidate-id',
    jobPostingId: 'real-job-posting-id',
    position: 'Senior Full Stack Developer',
    department: 'Engineering',
    salary: 75000,
    currency: 'TRY',
    startDate: '2025-12-15',
    workType: 'hybrid',
    benefits: {
      insurance: true,
      meal: 1500,
      transportation: true,
      gym: false,
      education: true
    },
    terms: 'Çalışma saatleri: 09:00-18:00. Deneme süresi: 3 ay. Yıllık izin: 14 gün.'
  }, 'test-user-id');
  console.log('✅ Offer created:', offer.id);

  // Step 2: Send email
  console.log('\n2️⃣ Sending email...');
  const emailResult = await emailService.sendOfferEmail(offer.id);
  console.log('✅ Email sent:', emailResult.messageId);
  console.log('🔗 Acceptance URL:', emailResult.acceptanceUrl);

  // Step 3: Verify offer status
  console.log('\n3️⃣ Verifying offer status...');
  const updatedOffer = await offerService.getOfferById(offer.id);
  console.log('Status:', updatedOffer.status);
  console.log('Email sent:', updatedOffer.emailSent);
  console.log('Sent at:', updatedOffer.sentAt);

  console.log('\n🎉 Complete flow test PASSED!');
  console.log('\n📋 Manual checks:');
  console.log('  - Check email inbox');
  console.log('  - Open PDF attachment');
  console.log('  - Click acceptance URL');
}

testCompleteFlow().catch(console.error);
```

**Checklist:**
- [ ] ✅ Script runs without errors
- [ ] ✅ Offer created in database
- [ ] ✅ PDF generated
- [ ] ✅ Email sent
- [ ] ✅ Offer status changed to 'sent'
- [ ] ✅ Timestamps updated correctly
- [ ] ✅ Manual verification:
  - [ ] Email received
  - [ ] PDF looks good
  - [ ] All data correct

---

### 🎯 GÜN 2 COMPLETION CRITERIA

**Must Pass All:**
- [ ] ✅ offerPdfService.js exists and works
- [ ] ✅ PDF generates with correct layout
- [ ] ✅ PDF uploaded to MinIO
- [ ] ✅ emailService updated with sendOfferEmail
- [ ] ✅ Email template looks professional
- [ ] ✅ Email sends with PDF attachment
- [ ] ✅ Complete flow test passes
- [ ] ✅ No errors in console
- [ ] ✅ Turkish characters render correctly

**Git Commit:**
```bash
git add .
git commit -m "feat(offers): Add PDF generation and email sending (Phase 1 Day 2)

- Create offerPdfService with professional template
- Add sendOfferEmail to emailService
- Generate acceptance URL for candidates
- Upload PDFs to MinIO
- Test complete offer creation → email flow

Features: #2, #3"
git push origin feature/job-offer-system
```

---

## 🗓️ GÜN 3: CONTROLLER & API ROUTES (8 saat)

### ⏰ SABAH (09:00 - 13:00) - CONTROLLER

#### Task 3.1: Create offerController.js ⏱️ 4 saat
```bash
Location: backend/src/controllers/offerController.js
```

**File Structure:**
```javascript
const offerService = require('../services/offerService');
const offerPdfService = require('../services/offerPdfService');
const emailService = require('../services/emailService');

class OfferController {
  async createOffer(req, res) { }
  async getOffers(req, res) { }
  async getOfferById(req, res) { }
  async updateOffer(req, res) { }
  async deleteOffer(req, res) { }
  async sendOffer(req, res) { }
  async previewPdf(req, res) { }
}

module.exports = new OfferController();
```

**Checklist - createOffer:**
- [ ] Extract userId from req.user.id
- [ ] Call offerService.createOffer(req.body, userId)
- [ ] Return 201 status
- [ ] JSON response:
  ```javascript
  {
    success: true,
    message: 'Teklif başarıyla oluşturuldu',
    data: offer
  }
  ```
- [ ] Try-catch error handling
- [ ] Return 500 on error with message

**Checklist - getOffers:**
- [ ] Extract query params: status, candidateId, createdBy, page, limit
- [ ] Get userId from req.user.id
- [ ] Call offerService.getOffers(filters, pagination)
- [ ] Return 200 with offers + pagination

**Checklist - getOfferById:**
- [ ] Extract id from req.params
- [ ] Call offerService.getOfferById(id)
- [ ] Return 200 with offer
- [ ] Return 404 if not found

**Checklist - updateOffer:**
- [ ] Extract id from params
- [ ] Extract userId from req.user
- [ ] Call offerService.updateOffer(id, req.body, userId)
- [ ] Return 200 with updated offer

**Checklist - deleteOffer:**
- [ ] Extract id from params
- [ ] Call offerService.deleteOffer(id)
- [ ] Return 200 with success message

**Checklist - sendOffer:**
- [ ] Extract id from params
- [ ] Call emailService.sendOfferEmail(id)
- [ ] Return 200 with success message + acceptanceUrl

**Checklist - previewPdf:**
- [ ] Extract id from params
- [ ] Call offerPdfService.generateOfferPdf(id)
- [ ] Set Content-Type: application/pdf
- [ ] Set Content-Disposition: inline
- [ ] Send buffer directly

**Error Handling:**
- [ ] All methods wrapped in try-catch
- [ ] Console.error for debugging
- [ ] Proper HTTP status codes:
  - [ ] 201 for created
  - [ ] 200 for success
  - [ ] 404 for not found
  - [ ] 500 for server error

---

### ⏰ ÖĞLEDEN SONRA (14:00 - 18:00) - ROUTES & TESTING

#### Task 3.2: Create offerRoutes.js ⏱️ 1 saat
```bash
Location: backend/src/routes/offerRoutes.js
```

**Checklist:**
- [ ] File created
- [ ] Dependencies imported:
  ```javascript
  const express = require('express');
  const router = express.Router();
  const offerController = require('../controllers/offerController');
  const { authenticate } = require('../middleware/auth');
  ```
- [ ] Apply auth middleware to all routes:
  ```javascript
  router.use(authenticate);
  ```
- [ ] CRUD routes:
  - [ ] POST / → offerController.createOffer
  - [ ] GET / → offerController.getOffers
  - [ ] GET /:id → offerController.getOfferById
  - [ ] PUT /:id → offerController.updateOffer
  - [ ] DELETE /:id → offerController.deleteOffer
- [ ] Action routes:
  - [ ] PATCH /:id/send → offerController.sendOffer
  - [ ] GET /:id/preview-pdf → offerController.previewPdf
- [ ] Export router:
  ```javascript
  module.exports = router;
  ```

---

#### Task 3.3: Register Routes in index.js ⏱️ 15 min
```bash
Location: backend/src/index.js
```

**Checklist:**
- [ ] Import offerRoutes:
  ```javascript
  const offerRoutes = require('./routes/offerRoutes');
  ```
- [ ] Register route:
  ```javascript
  app.use('/api/v1/offers', offerRoutes);
  ```
- [ ] Verify route appears in route list
- [ ] Restart backend server
- [ ] Check console for "✅ Server running on port 3001"

---

#### Task 3.4: API Testing with Postman/curl ⏱️ 2 saat 45 min

**Setup:**
```bash
# Get auth token first
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "info@gaiai.ai",
    "password": "23235656"
  }'

# Save token
TOKEN="<your-jwt-token>"
```

**Test Checklist:**

**1. POST /api/v1/offers - Create Offer**
- [ ] Request:
  ```bash
  curl -X POST http://localhost:3001/api/v1/offers \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
      "candidateId": "existing-candidate-id",
      "jobPostingId": "existing-job-posting-id",
      "position": "Senior Backend Developer",
      "department": "Engineering",
      "salary": 60000,
      "currency": "TRY",
      "startDate": "2025-12-01",
      "workType": "hybrid",
      "benefits": {
        "insurance": true,
        "meal": 1200,
        "transportation": true
      },
      "terms": "Test terms"
    }'
  ```
- [ ] Response: 201 Created
- [ ] Response has offer object
- [ ] Offer has id, acceptanceToken, expiresAt
- [ ] createdBy is current user

**2. GET /api/v1/offers - List Offers**
- [ ] Request:
  ```bash
  curl http://localhost:3001/api/v1/offers \
    -H "Authorization: Bearer $TOKEN"
  ```
- [ ] Response: 200 OK
- [ ] Response has offers array
- [ ] Response has pagination object
- [ ] Offers include candidate, jobPosting relations

**3. GET /api/v1/offers/:id - Get Single Offer**
- [ ] Request:
  ```bash
  curl http://localhost:3001/api/v1/offers/<offer-id> \
    -H "Authorization: Bearer $TOKEN"
  ```
- [ ] Response: 200 OK
- [ ] Response has complete offer object
- [ ] viewCount incremented

**4. PUT /api/v1/offers/:id - Update Offer**
- [ ] Request:
  ```bash
  curl -X PUT http://localhost:3001/api/v1/offers/<offer-id> \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
      "salary": 65000,
      "workType": "remote"
    }'
  ```
- [ ] Response: 200 OK
- [ ] Salary updated to 65000
- [ ] workType updated to remote

**5. PATCH /api/v1/offers/:id/send - Send Offer**
- [ ] Request:
  ```bash
  curl -X PATCH http://localhost:3001/api/v1/offers/<offer-id>/send \
    -H "Authorization: Bearer $TOKEN"
  ```
- [ ] Response: 200 OK
- [ ] Email sent successfully
- [ ] Response has acceptanceUrl
- [ ] Check inbox for email

**6. GET /api/v1/offers/:id/preview-pdf - Preview PDF**
- [ ] Request:
  ```bash
  curl http://localhost:3001/api/v1/offers/<offer-id>/preview-pdf \
    -H "Authorization: Bearer $TOKEN" \
    --output offer.pdf
  ```
- [ ] Response: 200 OK
- [ ] Content-Type: application/pdf
- [ ] File downloads successfully
- [ ] PDF opens correctly
- [ ] PDF content is correct

**7. DELETE /api/v1/offers/:id - Delete Offer**
- [ ] Request:
  ```bash
  curl -X DELETE http://localhost:3001/api/v1/offers/<offer-id> \
    -H "Authorization: Bearer $TOKEN"
  ```
- [ ] Response: 200 OK
- [ ] Offer deleted from database
- [ ] GET by id returns 404

**Error Cases:**
- [ ] Test without auth token → 401 Unauthorized
- [ ] Test with invalid offer id → 404 Not Found
- [ ] Test with missing required fields → 400/500 with error message
- [ ] Test with non-existent candidateId → 500 with error

**Performance:**
- [ ] List endpoint responds < 1 second
- [ ] Create endpoint responds < 2 seconds
- [ ] PDF preview responds < 3 seconds
- [ ] Email send responds < 5 seconds

---

### 🎯 GÜN 3 COMPLETION CRITERIA

**Must Pass All:**
- [ ] ✅ offerController.js exists with all methods
- [ ] ✅ offerRoutes.js created and registered
- [ ] ✅ All 7 API endpoints working
- [ ] ✅ Authentication required on all routes
- [ ] ✅ Proper error handling
- [ ] ✅ Postman/curl tests pass
- [ ] ✅ PDF preview works
- [ ] ✅ Email send works
- [ ] ✅ No backend errors

**Git Commit:**
```bash
git add .
git commit -m "feat(offers): Add controller and API routes (Phase 1 Day 3)

- Create offerController with 7 methods
- Add offerRoutes with CRUD + actions
- Register routes in main app
- Add authentication middleware
- Test all endpoints with curl

API Endpoints:
- POST /api/v1/offers
- GET /api/v1/offers
- GET /api/v1/offers/:id
- PUT /api/v1/offers/:id
- DELETE /api/v1/offers/:id
- PATCH /api/v1/offers/:id/send
- GET /api/v1/offers/:id/preview-pdf

Features: #5, #6"
git push origin feature/job-offer-system
```

---

## 🗓️ GÜN 4: FRONTEND UI (8 saat)

### ⏰ SABAH (09:00 - 13:00) - FRONTEND SERVICE & LIST PAGE

#### Task 4.1: Create Frontend Service ⏱️ 1 saat
```bash
Location: frontend/services/offerService.ts
```

**Checklist:**
- [ ] File created
- [ ] Interface types defined:
  ```typescript
  interface JobOffer {
    id: string;
    candidateId: string;
    position: string;
    department: string;
    salary: number;
    currency: string;
    startDate: string;
    workType: string;
    status: string;
    // ... other fields
    candidate?: any;
    jobPosting?: any;
  }

  interface CreateOfferData {
    candidateId: string;
    jobPostingId: string;
    position: string;
    department: string;
    salary: number;
    startDate: string;
    workType: string;
    benefits: any;
    terms: string;
  }
  ```
- [ ] API base URL from env:
  ```typescript
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
  ```
- [ ] Function: `fetchOffers(filters?)`
  - [ ] GET request to /api/v1/offers
  - [ ] Include auth token from localStorage
  - [ ] Query params for filters
  - [ ] Return typed response
- [ ] Function: `fetchOfferById(id)`
  - [ ] GET /api/v1/offers/:id
  - [ ] Return single offer
- [ ] Function: `createOffer(data)`
  - [ ] POST /api/v1/offers
  - [ ] Send CreateOfferData
  - [ ] Return created offer
- [ ] Function: `updateOffer(id, data)`
  - [ ] PUT /api/v1/offers/:id
- [ ] Function: `deleteOffer(id)`
  - [ ] DELETE /api/v1/offers/:id
- [ ] Function: `sendOffer(id)`
  - [ ] PATCH /api/v1/offers/:id/send
- [ ] Function: `previewPdf(id)`
  - [ ] GET /api/v1/offers/:id/preview-pdf
  - [ ] Return blob for download
- [ ] Error handling for all functions
- [ ] Export all functions

---

#### Task 4.2: Create List Page ⏱️ 3 saat
```bash
Location: frontend/app/(authenticated)/offers/page.tsx
```

**Checklist:**
- [ ] File created with 'use client' directive
- [ ] Imports:
  ```typescript
  import { useState, useEffect } from 'react';
  import { useRouter } from 'next/navigation';
  import * as offerService from '@/services/offerService';
  ```
- [ ] State management:
  - [ ] offers state (array)
  - [ ] loading state (boolean)
  - [ ] error state (string)
  - [ ] filters state (status, search)
  - [ ] pagination state
- [ ] useEffect to fetch offers on mount
- [ ] Header section:
  - [ ] Page title: "Teklifler"
  - [ ] "Yeni Teklif" button (navigates to /offers/new)
- [ ] Filters section:
  - [ ] Status filter dropdown (draft, sent, accepted, rejected)
  - [ ] Search input (by candidate name)
  - [ ] Filter button
- [ ] Offers table:
  - [ ] Columns:
    - [ ] Aday (candidate name)
    - [ ] Pozisyon (position)
    - [ ] Maaş (salary with ₺)
    - [ ] Durum (status badge)
    - [ ] Gönderilme (sentAt date)
    - [ ] Aksiyonlar (actions)
  - [ ] Loading skeleton while fetching
  - [ ] Empty state if no offers
  - [ ] Error message if fetch fails
- [ ] Status Badge Component:
  - [ ] draft → Gray badge
  - [ ] sent → Blue badge
  - [ ] accepted → Green badge
  - [ ] rejected → Red badge
  - [ ] expired → Orange badge
- [ ] Actions column:
  - [ ] View button (navigate to /offers/:id)
  - [ ] Send button (if status === 'draft')
  - [ ] Delete button (with confirmation)
- [ ] Pagination:
  - [ ] Previous/Next buttons
  - [ ] Page numbers
  - [ ] Total count
- [ ] Responsive design (mobile-friendly table)

**Code Structure:**
```typescript
'use client';

export default function OffersPage() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadOffers();
  }, []);

  async function loadOffers() {
    try {
      setLoading(true);
      const { offers } = await offerService.fetchOffers();
      setOffers(offers);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Teklifler</h1>
        <button
          onClick={() => router.push('/offers/new')}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          + Yeni Teklif
        </button>
      </div>

      {/* Table */}
      <table className="w-full">
        {/* ... */}
      </table>

      {/* Pagination */}
    </div>
  );
}
```

---

### ⏰ ÖĞLEDEN SONRA (14:00 - 18:00) - CREATE & DETAIL PAGES

#### Task 4.3: Create New Offer Page ⏱️ 2 saat
```bash
Location: frontend/app/(authenticated)/offers/new/page.tsx
```

**Checklist:**
- [ ] File created with 'use client'
- [ ] Form state for all fields:
  - [ ] candidateId (dropdown)
  - [ ] jobPostingId (dropdown)
  - [ ] position (text input)
  - [ ] department (text input)
  - [ ] salary (number input)
  - [ ] currency (select: TRY, USD, EUR)
  - [ ] startDate (date picker)
  - [ ] workType (radio: office/hybrid/remote)
  - [ ] benefits (checkboxes)
    - [ ] insurance
    - [ ] meal (with amount input)
    - [ ] transportation
    - [ ] gym
    - [ ] education
  - [ ] terms (textarea)
- [ ] Fetch candidates on mount for dropdown
- [ ] Fetch job postings on mount for dropdown
- [ ] Form sections:
  1. **Aday Seçimi**
     - [ ] Candidate dropdown
     - [ ] Show candidate info on select
  2. **İlan Seçimi**
     - [ ] Job posting dropdown
     - [ ] Show position/department on select
  3. **Teklif Detayları**
     - [ ] Position input
     - [ ] Department input
     - [ ] Salary input with ₺ prefix
     - [ ] Currency dropdown
     - [ ] Start date picker
     - [ ] Work type radio buttons
  4. **Yan Haklar**
     - [ ] Checkboxes for each benefit
     - [ ] Conditional inputs (meal amount)
  5. **Şartlar**
     - [ ] Terms textarea
- [ ] Form validation:
  - [ ] Required fields marked
  - [ ] Salary must be > 0
  - [ ] Start date must be future
- [ ] Submit button:
  - [ ] "Teklif Oluştur"
  - [ ] Disabled while submitting
  - [ ] Loading spinner
- [ ] Error handling:
  - [ ] Show error messages
  - [ ] Toast notification on success
- [ ] Navigation:
  - [ ] On success → navigate to /offers/:id
  - [ ] Cancel button → navigate to /offers

**Form Submission:**
```typescript
async function handleSubmit(e: React.FormEvent) {
  e.preventDefault();

  try {
    setSubmitting(true);
    const offer = await offerService.createOffer(formData);
    toast.success('Teklif oluşturuldu!');
    router.push(`/offers/${offer.id}`);
  } catch (error) {
    toast.error('Hata oluştu');
  } finally {
    setSubmitting(false);
  }
}
```

---

#### Task 4.4: Create Detail Page ⏱️ 2 saat
```bash
Location: frontend/app/(authenticated)/offers/[id]/page.tsx
```

**Checklist:**
- [ ] File created with 'use client'
- [ ] Get id from useParams()
- [ ] Fetch offer on mount
- [ ] Loading state
- [ ] Error state (404 if not found)
- [ ] Layout sections:
  1. **Header**
     - [ ] Back button
     - [ ] Offer title (position)
     - [ ] Status badge
     - [ ] Action buttons:
       - [ ] Edit (navigate to /offers/:id/edit)
       - [ ] Send (if draft)
       - [ ] Preview PDF
       - [ ] Delete (with confirmation)
  2. **Candidate Info Card**
     - [ ] Name
     - [ ] Email
     - [ ] Phone
     - [ ] Link to candidate profile
  3. **Offer Details Card**
     - [ ] Position
     - [ ] Department
     - [ ] Salary (formatted)
     - [ ] Start date
     - [ ] Work type
     - [ ] Validity (expiresAt)
  4. **Benefits Card**
     - [ ] List all benefits
     - [ ] Icons for each type
  5. **Terms Card**
     - [ ] Full terms text
  6. **Status Timeline**
     - [ ] Created at
     - [ ] Sent at (if sent)
     - [ ] Responded at (if responded)
     - [ ] Status changes
  7. **Metadata**
     - [ ] Created by
     - [ ] Acceptance URL (if sent)
     - [ ] View count
     - [ ] Last viewed at
- [ ] Action handlers:
  - [ ] handleSend → confirm & send email
  - [ ] handlePreviewPdf → open PDF in new tab
  - [ ] handleDelete → confirm & delete
- [ ] Toast notifications for actions
- [ ] Responsive design

**Code Structure:**
```typescript
'use client';

export default function OfferDetailPage({ params }: { params: { id: string } }) {
  const [offer, setOffer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOffer();
  }, [params.id]);

  async function loadOffer() {
    try {
      const data = await offerService.fetchOfferById(params.id);
      setOffer(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSend() {
    if (!confirm('Teklifi göndermek istediğinizden emin misiniz?')) return;

    try {
      await offerService.sendOffer(params.id);
      toast.success('Teklif gönderildi!');
      loadOffer(); // Refresh
    } catch (error) {
      toast.error('Hata oluştu');
    }
  }

  if (loading) return <div>Yükleniyor...</div>;
  if (!offer) return <div>Teklif bulunamadı</div>;

  return (
    <div className="p-6">
      {/* Header */}
      {/* Cards */}
    </div>
  );
}
```

---

### 🎯 GÜN 4 COMPLETION CRITERIA

**Must Pass All:**
- [ ] ✅ offerService.ts created with all functions
- [ ] ✅ List page shows offers table
- [ ] ✅ List page has filters
- [ ] ✅ List page has pagination
- [ ] ✅ Status badges display correctly
- [ ] ✅ Create page form works
- [ ] ✅ Create page validates inputs
- [ ] ✅ Create page submits successfully
- [ ] ✅ Detail page shows all offer info
- [ ] ✅ Detail page actions work (send, preview, delete)
- [ ] ✅ Navigation between pages works
- [ ] ✅ Loading states display
- [ ] ✅ Error handling works
- [ ] ✅ Mobile responsive
- [ ] ✅ Turkish text throughout

**Manual E2E Test:**
```
1. Open http://localhost:3000/offers
2. Click "Yeni Teklif"
3. Fill form with valid data
4. Submit
5. Redirected to detail page
6. Click "Gönder"
7. Email received
8. PDF attachment opens
9. Back to list
10. Offer shows "sent" status
```

**Git Commit:**
```bash
git add .
git commit -m "feat(offers): Add frontend UI pages (Phase 1 Day 4)

- Create offerService.ts for API calls
- Add offers list page with filters and pagination
- Add new offer creation form
- Add offer detail page with actions
- Implement status badges and UI components
- Add toast notifications
- Mobile responsive design

Pages:
- /offers (list)
- /offers/new (create)
- /offers/:id (detail)

Features: Complete Phase 1 (#1-6)"
git push origin feature/job-offer-system
```

---

## 🎉 FAZ 1 FINAL CHECKLIST

### ✅ Backend Checklist
- [ ] Database schema created (JobOffer model)
- [ ] Migration applied successfully
- [ ] offerService.js with 6 functions
- [ ] offerPdfService.js with PDF generation
- [ ] emailService.js updated with offer email
- [ ] offerController.js with 7 methods
- [ ] offerRoutes.js with all routes
- [ ] Routes registered in index.js
- [ ] All API endpoints tested
- [ ] PDFs generating correctly
- [ ] Emails sending correctly
- [ ] MinIO uploads working

### ✅ Frontend Checklist
- [ ] offerService.ts created
- [ ] List page (/offers) working
- [ ] Create page (/offers/new) working
- [ ] Detail page (/offers/:id) working
- [ ] All CRUD operations working
- [ ] Status badges displaying
- [ ] Filters working
- [ ] Pagination working
- [ ] Loading states
- [ ] Error handling
- [ ] Toast notifications
- [ ] Mobile responsive

### ✅ Features Completed
- [ ] #1: Teklif Oluşturma ✅
- [ ] #2: PDF Oluşturma ✅
- [ ] #3: Email Gönderimi ✅
- [ ] #4: Durum Takibi ✅
- [ ] #5: Teklif Listeleme ✅
- [ ] #6: Teklif Detay Görüntüleme ✅

### ✅ Testing
- [ ] Unit tests for services
- [ ] API endpoint tests (curl/Postman)
- [ ] Frontend UI tests (manual)
- [ ] E2E flow test (create → send → email)
- [ ] PDF rendering test
- [ ] Email delivery test
- [ ] Mobile responsive test
- [ ] Turkish characters test

### ✅ Performance
- [ ] List page loads < 1s
- [ ] Create offer < 2s
- [ ] PDF generation < 3s
- [ ] Email send < 5s
- [ ] No memory leaks
- [ ] No console errors

### ✅ Code Quality
- [ ] No console.log in production code
- [ ] Error messages user-friendly
- [ ] Code commented where needed
- [ ] Consistent naming conventions
- [ ] No duplicated code
- [ ] Git commits descriptive

### ✅ Documentation
- [ ] API endpoints documented
- [ ] Service functions commented
- [ ] README updated with offer feature
- [ ] Phase 1 checklist completed

---

## 🚀 FAZ 1 TAMAMLANDI - SONRAKI ADIMLAR

**Phase 1 Status:** ✅ COMPLETE

**Next Phase:** Phase 2 - Template System (3 days)

**Before Starting Phase 2:**
1. [ ] Merge Phase 1 to main branch
2. [ ] Create Phase 2 branch
3. [ ] Review Phase 2 plan
4. [ ] Update project board

**Git Flow:**
```bash
# Merge to main
git checkout main
git merge feature/job-offer-system
git push origin main

# Tag release
git tag -a v1.1.0-phase1 -m "Job Offer System - Phase 1 Complete"
git push origin v1.1.0-phase1

# Create Phase 2 branch
git checkout -b feature/job-offer-phase2
```

---

**🎉 CONGRATULATIONS! Phase 1 Complete! 🎉**

**Ready for Phase 2?** Say "start phase 2" 🚀
