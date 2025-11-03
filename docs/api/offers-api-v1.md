# Job Offer System API Documentation (v1)

This document outlines the API endpoints for the Job Offer System.

**Base Path:** `/api/v1`

---

## 1. Offer Template Categories

- **`GET /offer-template-categories`**: List all categories.
- **`POST /offer-template-categories`**: Create a new category.
- **`GET /offer-template-categories/:id`**: Get a single category.
- **`PUT /offer-template-categories/:id`**: Update a category.
- **`DELETE /offer-template-categories/:id`**: Delete a category.

---

## 2. Offer Templates

- **`GET /offer-templates`**: List all templates. Supports filtering by `categoryId`.
- **`POST /offer-templates`**: Create a new template.
- **`GET /offer-templates/:id`**: Get a single template.
- **`PUT /offer-templates/:id`**: Update a template.
- **`DELETE /offer-templates/:id`**: Delete a template.

---

## 3. Job Offers

- **`GET /offers`**: List all offers. Supports filtering by `status`, `candidateId`.
- **`POST /offers`**: Create a new offer.
- **`POST /offers/bulk-send`**: Send multiple offers in a batch. Expects `{ offerIds: ['id1', 'id2'] }`.
- **`GET /offers/:id`**: Get a single offer.
- **`PUT /offers/:id`**: Update an offer.
- **`DELETE /offers/:id`**: Delete an offer.
- **`PATCH /offers/:id/send`**: Send an offer to a candidate.
- **`PATCH /offers/:id/approve`**: Approve an offer.
- **`PATCH /offers/:id/reject-approval`**: Reject an offer's approval.

---

## 4. Public Offer Actions

- **`GET /offers/public/:token`**: Get public offer details by token.
- **`PATCH /offers/public/:token/accept`**: Candidate accepts the offer.
- **`PATCH /offers/public/:token/reject`**: Candidate rejects the offer.

---

## 5. Analytics

- **`GET /offers/analytics/overview`**: Get an overview of all offer statuses.
- **`GET /offers/analytics/acceptance-rate`**: Get the acceptance rate.
- **`GET /offers/analytics/response-time`**: Get the average response time.
- **`GET /offers/analytics/by-department`**: Get stats grouped by department.

---

## 6. Revisions (Versioning)

- **`GET /offers/:offerId/revisions`**: Get the version history for an offer.

---

## 7. Negotiations

- **`GET /offers/:offerId/negotiations`**: Get the negotiation history for an offer.
- **`POST /offers/:offerId/negotiations`**: Start or add to a negotiation.
- **`PATCH /negotiations/:id/respond`**: Respond to a negotiation message.

---

## 8. Attachments

- **`GET /offers/:offerId/attachments`**: Get all attachments for an offer.
- **`POST /offers/:offerId/attachments`**: Upload a new attachment (multipart/form-data).
- **`DELETE /attachments/:id`**: Delete an attachment.
