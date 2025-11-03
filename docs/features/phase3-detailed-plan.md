# 🔗 FAZ 3: ACCEPTANCE & TRACKING SYSTEM - ULTRA DETAYLI PLAN

**Duration:** 4 Days
**Features:** #9, #10, #11, #12, #15 (5 features)
**Status:** 🟡 READY TO START

---

## 🎯 GENEL BAKIŞ

### 5N Analizi:

1. **NE (What):** Public acceptance system + approval workflow + expiration automation
2. **NEREDE (Where):** Backend services + public API + frontend public page
3. **NE LAZIM (What's needed):** Public routes (no auth), cron job, approval logic
4. **NEDEN (Why):** Aday teklifi kabul/red edebilmeli, teklifler otomatik expire olmalı
5. **NASIL (How):** Token-based public API + cron job + approval workflow

---

## 📋 ÖZELLİKLER

### Feature #9: Kabul/Red Linki (Acceptance URL) ✅
**Durum:** %50 tamamlanmış (token + URL generation var)
**Eksik:** Public API endpoints, token validation

### Feature #10: Email Bildirimi ✅
**Durum:** %100 tamamlanmış (sendOfferEmail var)
**Ek:** Acceptance notification emails eklenecek

### Feature #11: Onay Sistemi (Approval Flow)
**Durum:** %30 tamamlanmış (DB fields var)
**Eksik:** API endpoints, approval logic, notifications

### Feature #12: Geçerlilik Süresi (Expiration)
**Durum:** %50 tamamlanmış (expiresAt field var)
**Eksik:** Cron job, auto-expire logic

### Feature #15: Aday Cevap Sayfası (Public Page)
**Durum:** %0 tamamlanmış
**Eksik:** Tüm sayfa oluşturulacak

---

## 🗓️ GÜN 8: PUBLIC ACCEPTANCE API (8 saat)

### Hedef: Token-based public API endpoints

---

### ⏰ SABAH (09:00 - 13:00) - PUBLIC SERVICE

#### Task 8.1: Create publicOfferService.js ⏱️ 4 saat

**File:** `backend/src/services/publicOfferService.js`

**Functions to implement:**

1. **validateToken(token)** - Core validation
```javascript
async function validateToken(token) {
  const offer = await prisma.jobOffer.findUnique({
    where: { acceptanceToken: token },
    include: { candidate: true, creator: true, jobPosting: true }
  });

  if (!offer) {
    throw new Error('Geçersiz veya bulunamayan token');
  }

  return offer;
}
```

2. **getOfferByToken(token)** - Public view
```javascript
async function getOfferByToken(token) {
  const offer = await validateToken(token);

  // Check expiration
  if (new Date() > new Date(offer.expiresAt)) {
    return {
      ...offer,
      expired: true
    };
  }

  // Check if already responded
  if (offer.status === 'accepted' || offer.status === 'rejected') {
    return {
      ...offer,
      alreadyResponded: true
    };
  }

  return offer;
}
```

3. **acceptOffer(token, candidateData)** - Accept logic
```javascript
async function acceptOffer(token, candidateData = {}) {
  const offer = await validateToken(token);

  // Validation
  if (new Date() > new Date(offer.expiresAt)) {
    throw new Error('Bu teklifin süresi dolmuştur');
  }

  if (offer.status === 'accepted' || offer.status === 'rejected') {
    throw new Error('Bu teklife zaten cevap verilmiştir');
  }

  // Update offer
  const updated = await prisma.jobOffer.update({
    where: { id: offer.id },
    data: {
      status: 'accepted',
      respondedAt: new Date()
    },
    include: {
      candidate: true,
      creator: true,
      jobPosting: true
    }
  });

  // Send notification to HR
  await sendAcceptanceNotification(updated, 'accepted');

  return updated;
}
```

4. **rejectOffer(token, reason)** - Reject logic
```javascript
async function rejectOffer(token, reason = '') {
  const offer = await validateToken(token);

  if (new Date() > new Date(offer.expiresAt)) {
    throw new Error('Bu teklifin süresi dolmuştur');
  }

  if (offer.status === 'accepted' || offer.status === 'rejected') {
    throw new Error('Bu teklife zaten cevap verilmiştir');
  }

  const updated = await prisma.jobOffer.update({
    where: { id: offer.id },
    data: {
      status: 'rejected',
      respondedAt: new Date()
    },
    include: {
      candidate: true,
      creator: true
    }
  });

  await sendAcceptanceNotification(updated, 'rejected', reason);

  return updated;
}
```

5. **sendAcceptanceNotification(offer, decision, reason)** - Email to HR
```javascript
async function sendAcceptanceNotification(offer, decision, reason = '') {
  const emailService = require('./emailService');

  const subject = decision === 'accepted'
    ? `✅ Teklif Kabul Edildi - ${offer.candidate.firstName} ${offer.candidate.lastName}`
    : `❌ Teklif Reddedildi - ${offer.candidate.firstName} ${offer.candidate.lastName}`;

  const html = `
    <h2>${subject}</h2>
    <p><strong>Aday:</strong> ${offer.candidate.firstName} ${offer.candidate.lastName}</p>
    <p><strong>Pozisyon:</strong> ${offer.position}</p>
    <p><strong>Karar:</strong> ${decision === 'accepted' ? 'KABUL EDİLDİ' : 'REDDEDİLDİ'}</p>
    ${reason ? `<p><strong>Red Sebebi:</strong> ${reason}</p>` : ''}
    <p><strong>Tarih:</strong> ${new Date().toLocaleString('tr-TR')}</p>
  `;

  await emailService.sendEmail({
    to: offer.creator.email,
    subject,
    html
  });
}
```

**Checklist:**
- [ ] File created: `backend/src/services/publicOfferService.js`
- [ ] validateToken() implemented
- [ ] getOfferByToken() implemented
- [ ] acceptOffer() implemented
- [ ] rejectOffer() implemented
- [ ] sendAcceptanceNotification() implemented
- [ ] Error handling on all functions
- [ ] Expiration check in accept/reject
- [ ] Already responded check
- [ ] Email notifications

---

### ⏰ ÖĞLEDEN SONRA (14:00 - 18:00) - PUBLIC CONTROLLER & ROUTES

#### Task 8.2: Create publicOfferController.js ⏱️ 2 saat

**File:** `backend/src/controllers/publicOfferController.js`

**Methods:**

1. **getOfferByToken(req, res)**
```javascript
async getOfferByToken(req, res) {
  try {
    const { token } = req.params;
    const offer = await publicOfferService.getOfferByToken(token);

    res.json({
      success: true,
      data: offer
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      error: error.message
    });
  }
}
```

2. **acceptOffer(req, res)**
```javascript
async acceptOffer(req, res) {
  try {
    const { token } = req.params;
    const offer = await publicOfferService.acceptOffer(token, req.body);

    res.json({
      success: true,
      message: 'Teklif kabul edildi',
      data: offer
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
}
```

3. **rejectOffer(req, res)**
```javascript
async rejectOffer(req, res) {
  try {
    const { token } = req.params;
    const { reason } = req.body;
    const offer = await publicOfferService.rejectOffer(token, reason);

    res.json({
      success: true,
      message: 'Cevabınız kaydedildi',
      data: offer
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
}
```

**Checklist:**
- [ ] File created
- [ ] Class structure
- [ ] 3 methods implemented
- [ ] Error handling
- [ ] Proper HTTP status codes

---

#### Task 8.3: Create publicOfferRoutes.js ⏱️ 1 saat

**File:** `backend/src/routes/publicOfferRoutes.js`

**IMPORTANT:** NO AUTHENTICATION on these routes (public)

```javascript
const express = require('express');
const router = express.Router();
const publicOfferController = require('../controllers/publicOfferController');

// Public routes (NO AUTH)
router.get('/:token', publicOfferController.getOfferByToken);
router.patch('/:token/accept', publicOfferController.acceptOffer);
router.patch('/:token/reject', publicOfferController.rejectOffer);

module.exports = router;
```

**Checklist:**
- [ ] File created
- [ ] 3 routes defined
- [ ] NO authenticate middleware
- [ ] Proper HTTP methods (GET, PATCH)

---

#### Task 8.4: Register Public Routes ⏱️ 30 min

**File:** `backend/src/index.js`

**Add after offer routes:**
```javascript
// Public offer acceptance (NO AUTH)
const publicOfferRoutes = require('./routes/publicOfferRoutes');
apiV1Router.use('/offers/public', publicOfferRoutes);
logger.info('✅ Public offer routes registered');
```

**Checklist:**
- [ ] Import publicOfferRoutes
- [ ] Register with apiV1Router
- [ ] Path: /api/v1/offers/public
- [ ] Logger message

---

#### Task 8.5: Test Public API ⏱️ 30 min

**Test Commands:**

```bash
# 1. Create a test offer first (with auth)
curl -X POST http://localhost:3001/api/v1/offers \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{...}' \
  | jq '.data.acceptanceToken'

# Save token
PUBLIC_TOKEN="<token-from-above>"

# 2. Get offer by token (NO AUTH - Public)
curl http://localhost:3001/api/v1/offers/public/$PUBLIC_TOKEN

# 3. Accept offer (NO AUTH)
curl -X PATCH http://localhost:3001/api/v1/offers/public/$PUBLIC_TOKEN/accept \
  -H "Content-Type: application/json"

# 4. Verify status changed
curl http://localhost:3001/api/v1/offers/public/$PUBLIC_TOKEN \
  | jq '.data.status'
```

**Checklist:**
- [ ] Get by token works (no auth)
- [ ] Response includes offer data
- [ ] Accept works (no auth)
- [ ] Status changes to 'accepted'
- [ ] respondedAt timestamp set
- [ ] Notification email sent to creator
- [ ] Reject works (no auth)
- [ ] Error on expired offer
- [ ] Error on already responded

---

### 🎯 GÜN 8 COMPLETION CRITERIA

- [ ] ✅ publicOfferService.js created (5 functions)
- [ ] ✅ publicOfferController.js created (3 methods)
- [ ] ✅ publicOfferRoutes.js created (3 endpoints)
- [ ] ✅ Routes registered (no auth)
- [ ] ✅ Public API tested
- [ ] ✅ Token validation works
- [ ] ✅ Accept/reject works
- [ ] ✅ Email notifications sent

---

## 🗓️ GÜN 9: APPROVAL SYSTEM (8 saat)

### Hedef: Multi-step approval workflow

---

### ⏰ SABAH (09:00 - 13:00) - APPROVAL SERVICE

#### Task 9.1: Update offerService.js with Approval Functions ⏱️ 4 saat

**File:** `backend/src/services/offerService.js`

**Add these functions:**

1. **requestApproval(offerId, userId)**
```javascript
async function requestApproval(offerId, userId) {
  const offer = await prisma.jobOffer.findUnique({
    where: { id: offerId },
    include: { creator: true, candidate: true }
  });

  if (!offer) throw new Error('Offer not found');
  if (offer.createdBy !== userId) throw new Error('Not authorized');
  if (offer.status !== 'draft') throw new Error('Only draft offers can request approval');

  const updated = await prisma.jobOffer.update({
    where: { id: offerId },
    data: {
      approvalStatus: 'pending'
    },
    include: { creator: true, candidate: true }
  });

  // Send approval request email to managers
  await sendApprovalRequestEmail(updated);

  return updated;
}
```

2. **approveOffer(offerId, userId, notes)**
```javascript
async function approveOffer(offerId, userId, notes = '') {
  const offer = await prisma.jobOffer.findUnique({
    where: { id: offerId }
  });

  if (!offer) throw new Error('Offer not found');
  if (offer.approvalStatus !== 'pending') throw new Error('Offer is not pending approval');

  // Check user role (should be MANAGER or ADMIN)
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!['MANAGER', 'ADMIN'].includes(user.role)) {
    throw new Error('Not authorized to approve offers');
  }

  const updated = await prisma.jobOffer.update({
    where: { id: offerId },
    data: {
      approvalStatus: 'approved',
      approvedBy: userId,
      approvedAt: new Date()
    },
    include: {
      creator: true,
      approver: true,
      candidate: true
    }
  });

  // Send approval notification to creator
  await sendApprovalDecisionEmail(updated, 'approved', notes);

  return updated;
}
```

3. **rejectApproval(offerId, userId, reason)**
```javascript
async function rejectApproval(offerId, userId, reason) {
  const offer = await prisma.jobOffer.findUnique({
    where: { id: offerId }
  });

  if (!offer) throw new Error('Offer not found');
  if (offer.approvalStatus !== 'pending') throw new Error('Offer is not pending approval');

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!['MANAGER', 'ADMIN'].includes(user.role)) {
    throw new Error('Not authorized to reject offers');
  }

  const updated = await prisma.jobOffer.update({
    where: { id: offerId },
    data: {
      approvalStatus: 'rejected',
      approvedBy: userId,
      approvedAt: new Date()
    },
    include: {
      creator: true,
      approver: true,
      candidate: true
    }
  });

  await sendApprovalDecisionEmail(updated, 'rejected', reason);

  return updated;
}
```

4. **sendApprovalRequestEmail(offer)**
```javascript
async function sendApprovalRequestEmail(offer) {
  const emailService = require('./emailService');

  // Get all managers
  const managers = await prisma.user.findMany({
    where: {
      role: { in: ['MANAGER', 'ADMIN'] }
    }
  });

  for (const manager of managers) {
    await emailService.sendEmail({
      to: manager.email,
      subject: `Onay Bekleyen Teklif - ${offer.candidate.firstName} ${offer.candidate.lastName}`,
      html: `
        <h2>Teklif Onay Talebi</h2>
        <p><strong>Aday:</strong> ${offer.candidate.firstName} ${offer.candidate.lastName}</p>
        <p><strong>Pozisyon:</strong> ${offer.position}</p>
        <p><strong>Maaş:</strong> ₺${offer.salary.toLocaleString('tr-TR')}</p>
        <p><strong>Oluşturan:</strong> ${offer.creator.email}</p>
        <br>
        <p>Lütfen sisteme giriş yaparak teklifi onaylayın veya reddedin.</p>
        <a href="${process.env.FRONTEND_URL}/offers/${offer.id}" style="background: #3B82F6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px;">
          Teklifi İncele
        </a>
      `
    });
  }
}
```

5. **sendApprovalDecisionEmail(offer, decision, notes)**
```javascript
async function sendApprovalDecisionEmail(offer, decision, notes) {
  const emailService = require('./emailService');

  const subject = decision === 'approved'
    ? `✅ Teklifiniz Onaylandı - ${offer.candidate.firstName} ${offer.candidate.lastName}`
    : `❌ Teklifiniz Reddedildi - ${offer.candidate.firstName} ${offer.candidate.lastName}`;

  await emailService.sendEmail({
    to: offer.creator.email,
    subject,
    html: `
      <h2>${subject}</h2>
      <p><strong>Aday:</strong> ${offer.candidate.firstName} ${offer.candidate.lastName}</p>
      <p><strong>Pozisyon:</strong> ${offer.position}</p>
      <p><strong>Onaylayan:</strong> ${offer.approver.email}</p>
      <p><strong>Tarih:</strong> ${new Date().toLocaleString('tr-TR')}</p>
      ${notes ? `<p><strong>Not:</strong> ${notes}</p>` : ''}
      <br>
      ${decision === 'approved'
        ? '<p>Teklif artık gönderilebilir.</p>'
        : '<p>Lütfen teklifi düzenleyip tekrar onaya gönderin.</p>'}
    `
  });
}
```

**Checklist:**
- [ ] 5 new functions added to offerService.js
- [ ] requestApproval() works
- [ ] approveOffer() works (role check)
- [ ] rejectApproval() works (role check)
- [ ] sendApprovalRequestEmail() sends to all managers
- [ ] sendApprovalDecisionEmail() notifies creator
- [ ] Export all functions

---

### ⏰ ÖĞLEDEN SONRA (14:00 - 18:00) - APPROVAL ROUTES

#### Task 9.2: Update offerController.js ⏱️ 2 saat

**File:** `backend/src/controllers/offerController.js`

**Add these methods:**

```javascript
async requestApproval(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const offer = await offerService.requestApproval(id, userId);

    res.json({
      success: true,
      message: 'Onay talebi gönderildi',
      data: offer
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
}

async approveOffer(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { notes } = req.body;
    const offer = await offerService.approveOffer(id, userId, notes);

    res.json({
      success: true,
      message: 'Teklif onaylandı',
      data: offer
    });
  } catch (error) {
    res.status(403).json({
      success: false,
      error: error.message
    });
  }
}

async rejectApproval(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { reason } = req.body;
    const offer = await offerService.rejectApproval(id, userId, reason);

    res.json({
      success: true,
      message: 'Teklif reddedildi',
      data: offer
    });
  } catch (error) {
    res.status(403).json({
      success: false,
      error: error.message
    });
  }
}
```

**Checklist:**
- [ ] 3 methods added to offerController.js
- [ ] requestApproval() method
- [ ] approveOffer() method
- [ ] rejectApproval() method
- [ ] Error codes: 400 (bad request), 403 (forbidden)

---

#### Task 9.3: Update offerRoutes.js ⏱️ 30 min

**File:** `backend/src/routes/offerRoutes.js`

**Add these routes:**
```javascript
// Approval workflow
router.patch('/:id/request-approval', offerController.requestApproval);
router.patch('/:id/approve', offerController.approveOffer);
router.patch('/:id/reject-approval', offerController.rejectApproval);
```

**Checklist:**
- [ ] 3 new routes added
- [ ] Routes after existing CRUD routes
- [ ] Auth middleware applies (from router.use)

---

#### Task 9.4: Test Approval Flow ⏱️ 1 saat 30 min

**Test Scenario:**

```bash
# 1. Create offer as HR_SPECIALIST
curl -X POST http://localhost:3001/api/v1/offers \
  -H "Authorization: Bearer $HR_TOKEN" \
  -d '{...}' | jq '.data.id'

OFFER_ID="<offer-id>"

# 2. Request approval
curl -X PATCH http://localhost:3001/api/v1/offers/$OFFER_ID/request-approval \
  -H "Authorization: Bearer $HR_TOKEN"

# 3. Check email (managers should receive notification)

# 4. Login as MANAGER
curl -X POST http://localhost:3001/api/v1/auth/login \
  -d '{"email": "manager@gaiai.ai", "password": "..."}' \
  | jq '.token'

MANAGER_TOKEN="<token>"

# 5. Approve offer
curl -X PATCH http://localhost:3001/api/v1/offers/$OFFER_ID/approve \
  -H "Authorization: Bearer $MANAGER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"notes": "Looks good!"}'

# 6. Verify status
curl http://localhost:3001/api/v1/offers/$OFFER_ID \
  -H "Authorization: Bearer $HR_TOKEN" \
  | jq '.data.approvalStatus'
```

**Checklist:**
- [ ] Request approval works
- [ ] Email sent to managers
- [ ] Approve works (MANAGER role)
- [ ] approvalStatus = 'approved'
- [ ] approvedBy = manager userId
- [ ] approvedAt timestamp set
- [ ] Notification sent to creator
- [ ] Reject works
- [ ] Non-manager gets 403 error

---

### 🎯 GÜN 9 COMPLETION CRITERIA

- [ ] ✅ Approval functions in offerService.js
- [ ] ✅ Approval methods in controller
- [ ] ✅ Approval routes added
- [ ] ✅ Role-based authorization works
- [ ] ✅ Email notifications sent
- [ ] ✅ Approval flow tested end-to-end

---

## 🗓️ GÜN 10: EXPIRATION SYSTEM (8 saat)

### Hedef: Automatic offer expiration with cron job

---

### ⏰ SABAH (09:00 - 13:00) - EXPIRATION SERVICE

#### Task 10.1: Create expirationService.js ⏱️ 3 saat

**File:** `backend/src/services/expirationService.js`

**Functions:**

1. **checkExpiredOffers()** - Main cron function
```javascript
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkExpiredOffers() {
  console.log('🕐 Checking expired offers...');

  const now = new Date();

  const expiredOffers = await prisma.jobOffer.findMany({
    where: {
      status: 'sent',
      expiresAt: {
        lt: now
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

  return {
    checked: now,
    expired: expiredOffers.length,
    offers: expiredOffers.map(o => o.id)
  };
}
```

2. **expireOffer(offerId)** - Expire single offer
```javascript
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
  await sendExpirationNotification(offer);

  console.log(`✅ Offer expired: ${offerId}`);
  return offer;
}
```

3. **sendExpirationNotification(offer)**
```javascript
async function sendExpirationNotification(offer) {
  const emailService = require('./emailService');

  await emailService.sendEmail({
    to: offer.creator.email,
    subject: `⏰ Teklif Süresi Doldu - ${offer.candidate.firstName} ${offer.candidate.lastName}`,
    html: `
      <h2>Teklif Süresi Doldu</h2>
      <p><strong>Aday:</strong> ${offer.candidate.firstName} ${offer.candidate.lastName}</p>
      <p><strong>Pozisyon:</strong> ${offer.position}</p>
      <p><strong>Gönderilme Tarihi:</strong> ${new Date(offer.sentAt).toLocaleDateString('tr-TR')}</p>
      <p><strong>Son Geçerlilik:</strong> ${new Date(offer.expiresAt).toLocaleDateString('tr-TR')}</p>
      <br>
      <p>Aday belirlenen süre içinde cevap vermedi. Teklif otomatik olarak sona erdi.</p>
    `
  });
}
```

4. **extendOfferExpiration(offerId, days)**
```javascript
async function extendOfferExpiration(offerId, days = 7) {
  const offer = await prisma.jobOffer.findUnique({
    where: { id: offerId }
  });

  if (!offer) throw new Error('Offer not found');
  if (offer.status === 'accepted' || offer.status === 'rejected') {
    throw new Error('Cannot extend accepted/rejected offers');
  }

  const newExpiresAt = new Date(offer.expiresAt.getTime() + days * 24 * 60 * 60 * 1000);

  const updated = await prisma.jobOffer.update({
    where: { id: offerId },
    data: { expiresAt: newExpiresAt }
  });

  console.log(`✅ Offer expiration extended: ${offerId} → ${newExpiresAt}`);
  return updated;
}
```

**Checklist:**
- [ ] File created
- [ ] checkExpiredOffers() implemented
- [ ] expireOffer() implemented
- [ ] sendExpirationNotification() implemented
- [ ] extendOfferExpiration() implemented
- [ ] Proper logging
- [ ] Email notifications

---

#### Task 10.2: Create offerExpirationJob.js (Cron Job) ⏱️ 1 saat

**File:** `backend/src/jobs/offerExpirationJob.js`

**Implementation:**
```javascript
const cron = require('node-cron');
const expirationService = require('../services/expirationService');
const logger = require('../utils/logger');

/**
 * Setup offer expiration cron job
 * Runs every hour
 * Feature #12: Geçerlilik Süresi
 */
function setupExpirationCron() {
  // Run every hour: '0 * * * *'
  const job = cron.schedule('0 * * * *', async () => {
    try {
      logger.info('⏰ Starting offer expiration check...');
      const result = await expirationService.checkExpiredOffers();
      logger.info(`✅ Expiration check complete: ${result.expired} offers expired`);
    } catch (error) {
      logger.error('❌ Expiration check failed:', { error: error.message });
    }
  });

  // Run immediately on startup (for testing)
  if (process.env.NODE_ENV === 'development') {
    setTimeout(async () => {
      logger.info('🔄 Running initial expiration check (dev mode)...');
      await expirationService.checkExpiredOffers();
    }, 5000); // 5 seconds after startup
  }

  logger.info('✅ Offer expiration cron job started (every hour)');

  return job;
}

module.exports = {
  setupExpirationCron
};
```

**Checklist:**
- [ ] File created in `backend/src/jobs/`
- [ ] node-cron imported
- [ ] Schedule: every hour ('0 * * * *')
- [ ] Calls expirationService.checkExpiredOffers()
- [ ] Error handling with logger
- [ ] Dev mode: runs once on startup
- [ ] Export setupExpirationCron

---

### ⏰ ÖĞLEDEN SONRA (14:00 - 18:00) - INTEGRATION & ROUTES

#### Task 10.3: Update index.js with Cron Job ⏱️ 30 min

**File:** `backend/src/index.js`

**Add after server starts:**
```javascript
// Setup cron jobs
const { setupExpirationCron } = require('./jobs/offerExpirationJob');
setupExpirationCron();
```

**Checklist:**
- [ ] Import setupExpirationCron
- [ ] Call after app.listen()
- [ ] Logger shows cron started

---

#### Task 10.4: Add Expiration Routes ⏱️ 1 saat

**File:** `backend/src/controllers/offerController.js`

**Add methods:**
```javascript
async expireOffer(req, res) {
  try {
    const { id } = req.params;
    const offer = await expirationService.expireOffer(id);

    res.json({
      success: true,
      message: 'Teklif süresi doldu olarak işaretlendi',
      data: offer
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}

async extendExpiration(req, res) {
  try {
    const { id } = req.params;
    const { days } = req.body;
    const offer = await expirationService.extendOfferExpiration(id, days);

    res.json({
      success: true,
      message: `Teklif geçerlilik süresi ${days} gün uzatıldı`,
      data: offer
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}
```

**File:** `backend/src/routes/offerRoutes.js`

**Add routes:**
```javascript
// Expiration management
router.patch('/:id/expire', offerController.expireOffer);
router.patch('/:id/extend', offerController.extendExpiration);
```

**Checklist:**
- [ ] expireOffer() method added
- [ ] extendExpiration() method added
- [ ] Routes added
- [ ] Auth middleware applies

---

#### Task 10.5: Test Expiration System ⏱️ 2 saat 30 min

**Manual Expiration Test:**
```bash
# 1. Create offer with past expiration (for testing)
curl -X POST http://localhost:3001/api/v1/offers \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "candidateId": "...",
    "position": "Test",
    ...
  }' | jq '.data.id'

OFFER_ID="<id>"

# 2. Manually set expiration to past (via Prisma Studio)
# or update expiresAt in database

# 3. Trigger expiration check manually
curl -X PATCH http://localhost:3001/api/v1/offers/$OFFER_ID/expire \
  -H "Authorization: Bearer $TOKEN"

# 4. Verify status
curl http://localhost:3001/api/v1/offers/$OFFER_ID \
  -H "Authorization: Bearer $TOKEN" \
  | jq '.data.status'

# 5. Check email notification sent

# 6. Test extend
curl -X PATCH http://localhost:3001/api/v1/offers/$OFFER_ID/extend \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"days": 3}'
```

**Cron Job Test:**
```bash
# Check logs for cron execution
tail -f backend/logs/combined.log | grep -i expiration

# Should see every hour:
# "⏰ Starting offer expiration check..."
# "✅ Expiration check complete: X offers expired"
```

**Checklist:**
- [ ] Manual expire works
- [ ] Status changes to 'expired'
- [ ] Email notification sent
- [ ] Extend works
- [ ] expiresAt updated correctly
- [ ] Cron job runs on schedule
- [ ] Cron job logs properly
- [ ] Dev mode runs on startup

---

### 🎯 GÜN 10 COMPLETION CRITERIA

- [ ] ✅ expirationService.js created
- [ ] ✅ offerExpirationJob.js created
- [ ] ✅ Cron job registered in index.js
- [ ] ✅ Cron runs every hour
- [ ] ✅ Manual expire endpoint works
- [ ] ✅ Extend endpoint works
- [ ] ✅ Email notifications sent
- [ ] ✅ Dev mode testing works

---

## 🗓️ GÜN 11: PUBLIC ACCEPTANCE PAGE (8 saat)

### Hedef: Frontend public page for candidates

---

### ⏰ TAM GÜN (09:00 - 18:00) - PUBLIC PAGE

#### Task 11.1: Create Frontend Public Service ⏱️ 1 saat

**File:** `frontend/services/publicOfferService.ts`

```typescript
// NO AUTH required for these calls

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function fetchOfferByToken(token: string) {
  const response = await fetch(`${API_URL}/api/v1/offers/public/${token}`);

  if (!response.ok) {
    throw new Error('Teklif bulunamadı veya geçersiz token');
  }

  return response.json();
}

export async function acceptOffer(token: string, data?: any) {
  const response = await fetch(`${API_URL}/api/v1/offers/public/${token}/accept`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data || {})
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Teklif kabul edilemedi');
  }

  return response.json();
}

export async function rejectOffer(token: string, reason?: string) {
  const response = await fetch(`${API_URL}/api/v1/offers/public/${token}/reject`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ reason: reason || '' })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Teklif reddedilemedi');
  }

  return response.json();
}
```

**Checklist:**
- [ ] File created
- [ ] 3 functions exported
- [ ] NO auth token used
- [ ] Error handling

---

#### Task 11.2: Create Public Acceptance Page ⏱️ 6 saat

**File:** `frontend/app/accept-offer/[token]/page.tsx`

**IMPORTANT:** This is OUTSIDE (authenticated) folder (public route)

**Full Implementation:**
```typescript
'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import * as publicOfferService from '@/services/publicOfferService';

export default function AcceptOfferPage() {
  const params = useParams();
  const token = params.token as string;

  const [offer, setOffer] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState<'accepted' | 'rejected' | null>(null);

  useEffect(() => {
    fetchOffer();
  }, [token]);

  async function fetchOffer() {
    try {
      setLoading(true);
      setError('');
      const result = await publicOfferService.fetchOfferByToken(token);
      setOffer(result.data);
    } catch (err: any) {
      setError(err.message || 'Teklif yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  }

  async function handleAccept() {
    if (!confirm('Teklifi kabul etmek istediğinizden emin misiniz?')) {
      return;
    }

    setProcessing(true);

    try {
      await publicOfferService.acceptOffer(token);
      setSuccess('accepted');
      fetchOffer(); // Refresh to show updated status
    } catch (err: any) {
      alert(err.message || 'Hata oluştu');
    } finally {
      setProcessing(false);
    }
  }

  async function handleReject() {
    const reason = prompt('Reddetme sebebinizi belirtebilir misiniz? (Opsiyonel)');

    if (reason === null) return; // Cancelled

    setProcessing(true);

    try {
      await publicOfferService.rejectOffer(token, reason);
      setSuccess('rejected');
      fetchOffer();
    } catch (err: any) {
      alert(err.message || 'Hata oluştu');
    } finally {
      setProcessing(false);
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md">
          <div className="text-red-600 text-6xl mb-4 text-center">⚠️</div>
          <h2 className="text-xl font-bold text-gray-900 mb-4 text-center">Hata</h2>
          <p className="text-gray-700 text-center mb-6">{error}</p>
          <p className="text-sm text-gray-500 text-center">
            Link geçersiz veya süresi dolmuş olabilir. Lütfen emailinizi kontrol edin.
          </p>
        </div>
      </div>
    );
  }

  if (!offer) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Teklif bulunamadı</div>
      </div>
    );
  }

  const isExpired = new Date() > new Date(offer.expiresAt);
  const isResponded = offer.status === 'accepted' || offer.status === 'rejected';

  // Success state
  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
          <div className={`text-6xl mb-4 ${success === 'accepted' ? 'text-green-600' : 'text-gray-600'}`}>
            {success === 'accepted' ? '✅' : '📝'}
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {success === 'accepted' ? 'Tebrikler!' : 'Cevabınız Kaydedildi'}
          </h2>
          <p className="text-gray-700 mb-6">
            {success === 'accepted'
              ? 'Teklifimizi kabul ettiğiniz için teşekkür ederiz. En kısa sürede sizinle iletişime geçeceğiz.'
              : 'Geri bildiriminiz için teşekkür ederiz.'}
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded p-4 text-sm text-gray-700">
            <p>İletişim: {offer.creator?.email || 'hr@company.com'}</p>
          </div>
        </div>
      </div>
    );
  }

  // Main offer view
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg shadow-lg p-8 text-white text-center mb-6">
          <h1 className="text-3xl font-bold mb-2">🎉 İş Teklifi</h1>
          <p className="text-blue-100">IKAI HR Platform</p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-6">
          <div className="p-8">

            {/* Greeting */}
            <p className="text-lg mb-6">
              Sayın <strong className="text-gray-900">{offer.candidate.firstName} {offer.candidate.lastName}</strong>,
            </p>

            <p className="text-gray-700 mb-8">
              <strong className="text-gray-900">{offer.position}</strong> pozisyonu için sizinle çalışmaktan mutluluk duyacağız.
            </p>

            {/* Offer Details Card */}
            <div className="bg-gray-50 border-l-4 border-blue-500 rounded-lg p-6 mb-8">
              <h3 className="text-lg font-semibold mb-4 text-gray-900">📋 Teklif Detayları</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-gray-600">Pozisyon</span>
                  <p className="font-semibold text-gray-900">{offer.position}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Departman</span>
                  <p className="font-semibold text-gray-900">{offer.department}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Maaş</span>
                  <p className="font-bold text-blue-600 text-xl">
                    ₺{offer.salary.toLocaleString('tr-TR')} ({offer.currency})
                  </p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Başlangıç Tarihi</span>
                  <p className="font-semibold text-gray-900">
                    {new Date(offer.startDate).toLocaleDateString('tr-TR')}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Çalışma Şekli</span>
                  <p className="font-semibold text-gray-900">
                    {offer.workType === 'office' ? 'Ofis' : offer.workType === 'hybrid' ? 'Hibrit' : 'Uzaktan'}
                  </p>
                </div>
              </div>
            </div>

            {/* Benefits */}
            {offer.benefits && Object.keys(offer.benefits).some((k: any) => offer.benefits[k]) && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-3 text-gray-900">🎁 Yan Haklar</h3>
                <ul className="space-y-2">
                  {offer.benefits.insurance && <li className="flex items-center text-gray-700"><span className="text-green-500 mr-2">✓</span>Özel Sağlık Sigortası</li>}
                  {offer.benefits.meal > 0 && <li className="flex items-center text-gray-700"><span className="text-green-500 mr-2">✓</span>Yemek Kartı (₺{offer.benefits.meal}/ay)</li>}
                  {offer.benefits.transportation && <li className="flex items-center text-gray-700"><span className="text-green-500 mr-2">✓</span>Ulaşım Desteği</li>}
                  {offer.benefits.gym && <li className="flex items-center text-gray-700"><span className="text-green-500 mr-2">✓</span>Spor Salonu</li>}
                  {offer.benefits.education && <li className="flex items-center text-gray-700"><span className="text-green-500 mr-2">✓</span>Eğitim Desteği</li>}
                </ul>
              </div>
            )}

            {/* Terms */}
            {offer.terms && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-3 text-gray-900">📜 Şartlar</h3>
                <p className="text-gray-700 whitespace-pre-wrap bg-gray-50 p-4 rounded">{offer.terms}</p>
              </div>
            )}

            {/* Status Messages */}
            {isExpired && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
                <p className="text-red-800 font-semibold">⏰ Bu teklifin süresi dolmuştur.</p>
                <p className="text-red-700 text-sm mt-2">
                  Son geçerlilik tarihi: {new Date(offer.expiresAt).toLocaleDateString('tr-TR')}
                </p>
              </div>
            )}

            {isResponded && (
              <div className={`border-l-4 p-4 mb-6 ${
                offer.status === 'accepted'
                  ? 'bg-green-50 border-green-500'
                  : 'bg-gray-50 border-gray-500'
              }`}>
                <p className={`font-semibold ${offer.status === 'accepted' ? 'text-green-800' : 'text-gray-800'}`}>
                  {offer.status === 'accepted'
                    ? '✅ Bu teklifi zaten kabul ettiniz.'
                    : '📝 Bu teklifi zaten reddettiniz.'}
                </p>
                <p className="text-sm mt-2">
                  Cevap tarihi: {new Date(offer.respondedAt).toLocaleDateString('tr-TR')}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            {!isExpired && !isResponded && (
              <div className="flex gap-4 justify-center mt-8">
                <button
                  onClick={handleAccept}
                  disabled={processing}
                  className="bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-12 rounded-lg disabled:opacity-50 transition text-lg"
                >
                  ✅ Teklifi Kabul Et
                </button>
                <button
                  onClick={handleReject}
                  disabled={processing}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-12 rounded-lg disabled:opacity-50 transition text-lg"
                >
                  ❌ Teklifi Reddet
                </button>
              </div>
            )}

            {/* Validity Notice */}
            {!isExpired && !isResponded && (
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  📅 Bu teklif <strong>{new Date(offer.expiresAt).toLocaleDateString('tr-TR')}</strong> tarihine kadar geçerlidir.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-gray-500 text-sm">
          <p>Bu sayfa IKAI HR Platform tarafından oluşturulmuştur.</p>
          <p className="mt-2">© 2025 IKAI HR Platform</p>
        </div>
      </div>
    </div>
  );
}
```

**Checklist:**
- [ ] File created in `app/accept-offer/[token]/page.tsx`
- [ ] 'use client' directive
- [ ] useParams() to get token
- [ ] Load offer on mount (no auth)
- [ ] Loading state (spinner)
- [ ] Error state (invalid token message)
- [ ] Success state (accepted/rejected confirmation)
- [ ] Main view sections:
  - [ ] Header (gradient, IKAI branding)
  - [ ] Greeting (Sayın [Name])
  - [ ] Offer details card
  - [ ] Benefits list
  - [ ] Terms section
  - [ ] Status messages (expired, already responded)
  - [ ] Action buttons (Accept green, Reject red)
  - [ ] Validity notice
  - [ ] Footer
- [ ] handleAccept() function
- [ ] handleReject() function with reason prompt
- [ ] Confirmation dialogs
- [ ] Disabled states during processing
- [ ] Responsive design
- [ ] Mobile-friendly layout

---

#### Task 11.3: Test Public Page ⏱️ 1 saat

**Test Scenarios:**

**Scenario 1: Valid Offer**
```
1. Get acceptance URL from sent offer
2. Open URL in browser (new incognito window)
3. Verify offer details display
4. Click "Kabul Et"
5. Confirm dialog
6. Verify success message
7. Check HR email for notification
```

**Scenario 2: Already Accepted**
```
1. Use same token again
2. Open URL
3. Verify "Zaten kabul ettiniz" message
4. Verify buttons are hidden
```

**Scenario 3: Expired Offer**
```
1. Create offer with past expiration
2. Get token
3. Open URL
4. Verify "Süresi dolmuş" message
5. Verify buttons are disabled
```

**Scenario 4: Invalid Token**
```
1. Use random/invalid token
2. Open URL
3. Verify error message
4. Verify proper error UI
```

**Checklist:**
- [ ] Valid offer displays correctly
- [ ] Accept works (status → accepted)
- [ ] Reject works (with reason)
- [ ] HR email received on accept
- [ ] HR email received on reject
- [ ] Already responded shows message
- [ ] Expired offer shows message
- [ ] Invalid token shows error
- [ ] Mobile responsive
- [ ] All Turkish text

---

### 🎯 GÜN 11 COMPLETION CRITERIA

- [ ] ✅ publicOfferService.ts created (3 functions)
- [ ] ✅ Public page created (complete layout)
- [ ] ✅ All states handled (loading, error, success)
- [ ] ✅ Accept/reject works (no auth)
- [ ] ✅ Email notifications sent
- [ ] ✅ Mobile responsive
- [ ] ✅ All test scenarios pass

---

## 📦 FAZ 3 DOSYA YAPISI

### Backend Files (6 new/updated)
```
backend/
├── src/
│   ├── services/
│   │   ├── publicOfferService.js (NEW - 5 functions)
│   │   ├── expirationService.js (NEW - 4 functions)
│   │   └── offerService.js (UPDATED: +3 approval functions)
│   ├── controllers/
│   │   ├── publicOfferController.js (NEW - 3 methods)
│   │   └── offerController.js (UPDATED: +2 expiration methods)
│   ├── routes/
│   │   ├── publicOfferRoutes.js (NEW - 3 endpoints, NO AUTH)
│   │   └── offerRoutes.js (UPDATED: +5 approval/expiration routes)
│   ├── jobs/
│   │   └── offerExpirationJob.js (NEW - cron setup)
│   └── index.js (UPDATED: register public routes + cron)
└── package.json (UPDATED: +node-cron if not exists)
```

### Frontend Files (2 new)
```
frontend/
├── services/
│   └── publicOfferService.ts (NEW - 3 functions, NO AUTH)
└── app/
    └── accept-offer/
        └── [token]/
            └── page.tsx (NEW - public page)
```

**Total Phase 3:** 8 files (6 backend + 2 frontend)

---

## 📊 API ENDPOINTS

### Public Endpoints (3 - NO AUTH)
```
GET    /api/v1/offers/public/:token
PATCH  /api/v1/offers/public/:token/accept
PATCH  /api/v1/offers/public/:token/reject
```

### Approval Endpoints (3 - AUTH REQUIRED)
```
PATCH  /api/v1/offers/:id/request-approval
PATCH  /api/v1/offers/:id/approve
PATCH  /api/v1/offers/:id/reject-approval
```

### Expiration Endpoints (2 - AUTH REQUIRED)
```
PATCH  /api/v1/offers/:id/expire
PATCH  /api/v1/offers/:id/extend
```

**Total Phase 3:** 8 new endpoints

---

## ✅ TAMAMLANMA KRİTERLERİ

### Backend Checklist:
- [ ] publicOfferService.js (5 functions)
- [ ] expirationService.js (4 functions)
- [ ] offerService.js (+3 approval functions)
- [ ] publicOfferController.js (3 methods)
- [ ] offerController.js (+2 expiration methods)
- [ ] publicOfferRoutes.js (3 routes, NO AUTH)
- [ ] offerRoutes.js (+5 routes)
- [ ] offerExpirationJob.js (cron setup)
- [ ] Cron registered in index.js
- [ ] node-cron installed

### Frontend Checklist:
- [ ] publicOfferService.ts (3 functions, NO AUTH)
- [ ] accept-offer/[token]/page.tsx (complete)
- [ ] All states (loading, error, success, expired, responded)
- [ ] Accept/reject buttons
- [ ] Mobile responsive

### Functionality Checklist:
- [ ] Token validation works
- [ ] Public access works (no auth)
- [ ] Accept updates status
- [ ] Reject updates status
- [ ] Expiration check runs hourly
- [ ] Auto-expire works
- [ ] Manual expire works
- [ ] Extend expiration works
- [ ] Approval request works
- [ ] Approve works (role check)
- [ ] Reject approval works
- [ ] All email notifications sent

### Testing Checklist:
- [ ] Public page accessible via token
- [ ] Accept flow complete
- [ ] Reject flow complete
- [ ] Expiration cron tested
- [ ] Approval flow tested
- [ ] Email notifications received
- [ ] Mobile view tested

---

## 🎯 SUCCESS CRITERIA

**Phase 3 başarılı sayılır:**
1. Aday token ile sayfayı açabiliyor (auth yok)
2. Teklifi kabul/red edebiliyor
3. HR email bildirimi alıyor
4. Süresi dolan teklifler otomatik expire oluyor
5. Onay sistemi çalışıyor (manager onayı)
6. Tüm email notifications gönderiliyor

---

## 📅 TIMELINE

| Gün | Saat | Task | Özellikler |
|-----|------|------|------------|
| 8 | 4+4 | Public API | Token validation, Accept/Reject API |
| 9 | 4+4 | Approval | Request, Approve, Reject logic |
| 10 | 3+5 | Expiration | Cron job, Auto-expire, Extend |
| 11 | 8 | Public Page | Frontend acceptance page |

**Total:** 4 days (32 hours)

---

**PLAN HAZIR - IMPLEMENTATION BAŞLIYOR** 🚀
