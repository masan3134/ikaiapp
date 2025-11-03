# ✅ FAZ 3: ACCEPTANCE & TRACKING - ULTRA TODO CHECKLIST

**Duration:** 4 Days (Accelerated to complete in single session)
**Features:** #9, #10, #11, #12, #15
**Tasks:** 47 individual tasks

---

## 📋 TASK BREAKDOWN

### GÜN 8: PUBLIC ACCEPTANCE API (16 tasks)

**Morning - Public Service (8 tasks):**
- [ ] 1. Create publicOfferService.js file
- [ ] 2. Implement validateToken(token)
- [ ] 3. Implement getOfferByToken(token)
- [ ] 4. Implement acceptOffer(token, data)
- [ ] 5. Implement rejectOffer(token, reason)
- [ ] 6. Implement sendAcceptanceNotification(offer, decision, reason)
- [ ] 7. Add error handling to all functions
- [ ] 8. Export all functions

**Afternoon - Public Controller & Routes (8 tasks):**
- [ ] 9. Create publicOfferController.js file
- [ ] 10. Implement getOfferByToken(req, res)
- [ ] 11. Implement acceptOffer(req, res)
- [ ] 12. Implement rejectOffer(req, res)
- [ ] 13. Create publicOfferRoutes.js (NO AUTH)
- [ ] 14. Add 3 public routes (GET, PATCH accept, PATCH reject)
- [ ] 15. Register public routes in index.js
- [ ] 16. Test public API with curl (no auth token)

---

### GÜN 9: APPROVAL SYSTEM (14 tasks)

**Morning - Approval Service (7 tasks):**
- [ ] 17. Add requestApproval(offerId, userId) to offerService.js
- [ ] 18. Add approveOffer(offerId, userId, notes) to offerService.js
- [ ] 19. Add rejectApproval(offerId, userId, reason) to offerService.js
- [ ] 20. Add sendApprovalRequestEmail(offer) function
- [ ] 21. Add sendApprovalDecisionEmail(offer, decision, notes) function
- [ ] 22. Add role validation (MANAGER/ADMIN)
- [ ] 23. Test approval service functions

**Afternoon - Approval Routes (7 tasks):**
- [ ] 24. Add requestApproval(req, res) to offerController.js
- [ ] 25. Add approveOffer(req, res) to offerController.js
- [ ] 26. Add rejectApproval(req, res) to offerController.js
- [ ] 27. Add 3 routes to offerRoutes.js (request, approve, reject)
- [ ] 28. Test request-approval endpoint
- [ ] 29. Test approve endpoint (with MANAGER role)
- [ ] 30. Test reject-approval endpoint

---

### GÜN 10: EXPIRATION SYSTEM (10 tasks)

**Morning - Expiration Service (5 tasks):**
- [ ] 31. Create expirationService.js file
- [ ] 32. Implement checkExpiredOffers() function
- [ ] 33. Implement expireOffer(offerId) function
- [ ] 34. Implement sendExpirationNotification(offer) function
- [ ] 35. Implement extendOfferExpiration(offerId, days) function

**Afternoon - Cron Job & Routes (5 tasks):**
- [ ] 36. Install node-cron package (if not exists)
- [ ] 37. Create offerExpirationJob.js with cron setup
- [ ] 38. Register cron in index.js (after app.listen)
- [ ] 39. Add expireOffer route + controller method
- [ ] 40. Add extendExpiration route + controller method

---

### GÜN 11: PUBLIC ACCEPTANCE PAGE (7 tasks)

**Full Day - Frontend Public Page (7 tasks):**
- [ ] 41. Create publicOfferService.ts (3 functions, NO AUTH)
- [ ] 42. Create accept-offer/[token]/page.tsx file
- [ ] 43. Implement loading/error/success states
- [ ] 44. Implement offer display with all details
- [ ] 45. Implement handleAccept() with confirmation
- [ ] 46. Implement handleReject() with reason prompt
- [ ] 47. Test complete public flow (token → accept/reject)

---

## 🎯 FEATURE-BY-FEATURE CHECKLIST

### Feature #9: Kabul/Red Linki ✅

**What's Already Done:**
- [x] acceptanceToken generated in createOffer
- [x] acceptanceUrl field in database
- [x] URL generated in sendOfferEmail

**What Needs to be Done:**
- [ ] Public API endpoints (3)
- [ ] Token validation logic
- [ ] Accept/reject logic
- [ ] Public frontend page

**Completion:** 40% → 100%

---

### Feature #10: Email Bildirimi ✅

**What's Already Done:**
- [x] sendOfferEmail (offer sent to candidate)

**What Needs to be Done:**
- [ ] Acceptance notification (to HR)
- [ ] Rejection notification (to HR)
- [ ] Approval request notification (to managers)
- [ ] Approval decision notification (to creator)
- [ ] Expiration notification (to creator)

**Completion:** 20% → 100%

---

### Feature #11: Onay Sistemi (Approval Flow)

**What's Already Done:**
- [x] approvalStatus field
- [x] approvedBy field
- [x] approvedAt field

**What Needs to be Done:**
- [ ] requestApproval() function
- [ ] approveOffer() function (with role check)
- [ ] rejectApproval() function
- [ ] API endpoints (3)
- [ ] Email notifications (2)

**Completion:** 30% → 100%

---

### Feature #12: Geçerlilik Süresi (Expiration)

**What's Already Done:**
- [x] expiresAt field (7 days default)

**What Needs to be Done:**
- [ ] checkExpiredOffers() cron function
- [ ] expireOffer() function
- [ ] Cron job setup (node-cron)
- [ ] Email notification
- [ ] Manual expire endpoint
- [ ] Extend expiration endpoint

**Completion:** 20% → 100%

---

### Feature #15: Aday Cevap Sayfası (Public Page)

**What's Already Done:**
- Nothing (0%)

**What Needs to be Done:**
- [ ] Public service (no auth)
- [ ] Public page component
- [ ] All UI states
- [ ] Accept/reject handlers

**Completion:** 0% → 100%

---

## 🔧 DEPENDENCIES

### Backend Package Check:
```bash
cd backend
npm list node-cron || npm install node-cron
npm list bullmq  # Already exists (confirmed)
```

**Required:**
- [x] node-cron (NEW - for expiration cron)
- [x] bullmq (EXISTS - for bulk sending)

---

## 🧪 TESTING MATRIX

### API Endpoint Tests (8 endpoints):

| Endpoint | Method | Auth | Test Status |
|----------|--------|------|-------------|
| /offers/public/:token | GET | NO | [ ] |
| /offers/public/:token/accept | PATCH | NO | [ ] |
| /offers/public/:token/reject | PATCH | NO | [ ] |
| /offers/:id/request-approval | PATCH | YES | [ ] |
| /offers/:id/approve | PATCH | YES | [ ] |
| /offers/:id/reject-approval | PATCH | YES | [ ] |
| /offers/:id/expire | PATCH | YES | [ ] |
| /offers/:id/extend | PATCH | YES | [ ] |

---

### Functional Tests (10 scenarios):

1. [ ] Get offer by valid token (no auth)
2. [ ] Accept offer (status → accepted)
3. [ ] Reject offer with reason
4. [ ] Get offer with expired token (error message)
5. [ ] Get offer already accepted (message)
6. [ ] Request approval (email to managers)
7. [ ] Approve as MANAGER (status update)
8. [ ] Approve as USER (403 error)
9. [ ] Cron job runs (check logs)
10. [ ] Manual expire works

---

### Email Tests (5 types):

1. [ ] Offer sent email (to candidate) - Already working
2. [ ] Acceptance notification (to HR)
3. [ ] Rejection notification (to HR)
4. [ ] Approval request (to managers)
5. [ ] Expiration notification (to creator)

---

## 📊 IMPLEMENTATION METRICS

### Backend Code to Write:
- publicOfferService.js: ~200 lines (5 functions)
- expirationService.js: ~150 lines (4 functions)
- offerService.js: +180 lines (3 approval functions)
- publicOfferController.js: ~100 lines (3 methods)
- offerController.js: +60 lines (2 expiration methods)
- publicOfferRoutes.js: ~15 lines (3 routes)
- offerRoutes.js: +15 lines (5 routes)
- offerExpirationJob.js: ~50 lines (cron setup)
- index.js: +5 lines (register routes + cron)

**Total Backend:** ~775 new lines

### Frontend Code to Write:
- publicOfferService.ts: ~80 lines (3 functions)
- accept-offer/[token]/page.tsx: ~300 lines (complete page)

**Total Frontend:** ~380 new lines

### Grand Total Phase 3: ~1,155 new lines

---

## 🎯 COMPLETION DEFINITION

**Phase 3 считается завершённым когда:**

✅ ALL 47 tasks completed
✅ ALL 8 API endpoints working
✅ ALL 5 email types sending
✅ Cron job running every hour
✅ Public page accessible and functional
✅ All test scenarios pass
✅ Git committed with proper message

---

## 🚀 READY TO START

**Current Status:** Plan ready, checklist ready
**Next Action:** Start implementation

**Start Command:** "Implement Phase 3 tasks 1-47"

---

**PLAN CREATED - READY FOR EXECUTION** 🎯
