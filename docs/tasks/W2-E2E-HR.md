# W2: HR_SPECIALIST Role - Comprehensive E2E Testing

**Worker:** W2
**Role:** HR_SPECIALIST (Recruitment Specialist)
**Method:** Puppeteer + Auto-Fix
**Duration:** 90 minutes
**Goal:** Test ALL HR features as REAL recruiter + FIX issues immediately

---

## 🎯 MISSION

**Test like a real HR recruiter:**
1. ✅ Manage job postings (CRUD)
2. ✅ Upload and manage candidates
3. ✅ Run CV analysis wizard
4. ✅ Create offers
5. ✅ Schedule interviews
6. ✅ View analytics
7. ❌ If error → FIX immediately → Continue
8. ✅ Final report

**CRITICAL:** Full recruitment workflow E2E testing with auto-fix!

---

## 📋 TEST SCENARIOS (10 Core Workflows)

### 1️⃣ Login as HR_SPECIALIST
**Steps:**
1. Navigate to `/login`
2. Fill email: `test-hr_specialist@test-org-2.com`
3. Fill password: `TestPass123!`
4. Click "Giriş Yap"
5. Verify redirect to HR dashboard
6. Verify HR-specific widgets visible

**Success Criteria:**
- ✅ Login successful
- ✅ HR dashboard renders
- ✅ No USER-only restrictions

---

### 2️⃣ Job Postings - LIST
**Steps:**
1. Navigate to `/job-postings`
2. Wait for job postings list to load
3. Verify table headers present
4. Verify pagination works
5. Test search filter
6. Test status filter (Active/Closed)
7. Test sort by date

**Success Criteria:**
- ✅ Job list renders
- ✅ Filters work
- ✅ Pagination works
- ✅ No console errors

**If Error:**
- Empty list → Check if test data exists (create if needed)
- Filter broken → Fix client-side filter logic
- API error → Check backend RBAC

---

### 3️⃣ Job Postings - CREATE
**Steps:**
1. Click "Yeni İlan Oluştur" button
2. Navigate to `/job-postings/new`
3. Fill form:
   - Title: "W2 E2E Test - Senior Developer"
   - Department: "Engineering"
   - Location: "Istanbul"
   - Type: "Full-time"
   - Description: "Test job posting for E2E testing..."
   - Requirements: "3+ years experience..."
4. Click "Kaydet" (Save)
5. Wait for success message
6. Verify redirect to job list
7. Verify new job appears in list

**Success Criteria:**
- ✅ Form renders correctly
- ✅ Form submits successfully
- ✅ Job created in database
- ✅ Appears in job list

**If Error:**
- Form validation fails → Check required fields
- Submit error → Check API endpoint
- Not appearing → Check organizationId isolation

---

### 4️⃣ Job Postings - UPDATE
**Steps:**
1. From job list, click created job
2. Navigate to `/job-postings/:id`
3. Click "Düzenle" (Edit)
4. Update title: "W2 E2E Test - UPDATED Senior Developer"
5. Update description
6. Click "Kaydet"
7. Verify success message
8. Refresh page
9. Verify changes persisted

**Success Criteria:**
- ✅ Detail page loads
- ✅ Edit form populates with current data
- ✅ Update succeeds
- ✅ Changes persist

**If Error:**
- Detail page 404 → Check route params
- Edit not loading → Check data fetching
- Update fails → Check RBAC permissions

---

### 5️⃣ Job Postings - DELETE (Should FAIL - HR cannot delete!)
**Steps:**
1. Try to delete job posting
2. Verify 403 Forbidden or button disabled
3. Verify job still exists

**Success Criteria:**
- ✅ Delete blocked (403 or disabled button)
- ✅ Job not deleted

**If Error:**
- Delete succeeds → FIX RBAC! HR should NOT delete!

---

### 6️⃣ Candidates - UPLOAD
**Steps:**
1. Navigate to `/candidates`
2. Click "Upload CV" button
3. Select PDF file (create dummy PDF if needed)
4. Fill candidate info:
   - Name: "Test Candidate W2"
   - Email: "test-candidate-w2@example.com"
   - Phone: "+90 555 123 4567"
5. Click "Upload"
6. Wait for success message
7. Verify candidate appears in list

**Success Criteria:**
- ✅ Upload form works
- ✅ PDF uploads successfully
- ✅ Candidate created
- ✅ Appears in candidate list

**If Error:**
- Upload fails → Check file size limits
- Form error → Check validation
- Not appearing → Check backend CV parsing

---

### 7️⃣ Candidates - DETAIL
**Steps:**
1. Click uploaded candidate
2. Navigate to `/candidates/:id`
3. Verify candidate details render:
   - Name, email, phone
   - CV preview/download link
   - Timeline/history
4. Click "Download CV" button
5. Verify PDF downloads

**Success Criteria:**
- ✅ Detail page loads
- ✅ All candidate data visible
- ✅ CV download works

**If Error:**
- Detail 404 → Check route
- CV not loading → Check file storage (MinIO)
- Download fails → Check API endpoint

---

### 8️⃣ Analysis Wizard - FULL FLOW
**Steps:**
1. Navigate to `/wizard`
2. **Step 1:** Select job posting (use created job)
3. Click "Next"
4. **Step 2:** Upload CVs (upload 2-3 test PDFs)
5. Click "Next"
6. **Step 3:** Review selections
7. Click "Start Analysis"
8. Wait for analysis to complete (queue processing)
9. Navigate to `/analyses`
10. Verify analysis result appears
11. Click analysis to view results

**Success Criteria:**
- ✅ Wizard completes all steps
- ✅ CVs upload successfully
- ✅ Analysis queued (BullMQ)
- ✅ Analysis completes (check after 30s)
- ✅ Results viewable

**If Error:**
- Wizard stuck → Check step navigation
- Upload fails → Check file handling
- Analysis not starting → Check queue worker
- No results → Check Gemini API + Milvus

---

### 9️⃣ Offers - CREATE
**Steps:**
1. Navigate to `/offers`
2. Click "Yeni Teklif"
3. Select candidate
4. Fill offer details:
   - Position: "Senior Developer"
   - Salary: "15000"
   - Start date: [Select date]
5. Click "Send Offer"
6. Verify success message
7. Verify offer appears in list

**Success Criteria:**
- ✅ Offer form works
- ✅ Offer created
- ✅ Appears in offer list

**If Error:**
- Form error → Check validation
- Create fails → Check API endpoint
- Not appearing → Check query

---

### 🔟 Interviews - SCHEDULE
**Steps:**
1. Navigate to `/interviews`
2. Click "Schedule Interview"
3. Select candidate (use uploaded candidate)
4. Select job posting
5. Fill interview details:
   - Date/time
   - Location/meeting link
   - Interviewers
6. Click "Schedule"
7. Verify success message
8. Verify interview appears in list

**Success Criteria:**
- ✅ Schedule form works
- ✅ Interview created
- ✅ Appears in interview list

**If Error:**
- Form error → Check validation
- Create fails → Check API endpoint
- Not appearing → Check query

---

## 🐛 FIX PROTOCOL

**Same as W1 + HR-specific fixes:**

### Common HR Issues:

**1. File Upload Issues:**
```typescript
// Fix: Check file size limits
if (file.size > 10 * 1024 * 1024) {
  throw new Error('File too large (max 10MB)');
}

// Fix: Check MIME types
if (!['application/pdf', 'application/msword'].includes(file.type)) {
  throw new Error('Invalid file type');
}
```

**2. Queue Issues:**
```javascript
// Check if worker is running
docker logs ikai-backend | grep "analysis-processing worker started"

// Check queue health
GET /api/v1/queue/health
```

**3. MinIO Issues:**
```javascript
// Check MinIO connection
docker logs ikai-minio

// Verify file uploaded
docker exec ikai-minio mc ls local/ikai-cvs
```

---

## 📊 FINAL REPORT

**File:** `docs/reports/w2-e2e-hr.md`

**Include:**
- 10 scenarios tested
- Issues found and fixed
- Screenshots of key workflows
- Queue processing verification
- File upload verification
- Full recruitment workflow proof

---

## ⏱️ TIME BUDGET

**Total:** 90 minutes

- Job postings CRUD: 25 min
- Candidates upload: 15 min
- Analysis wizard: 20 min
- Offers: 10 min
- Interviews: 10 min
- **Testing:** 80 min
- **Report:** 10 min

---

## 🚀 START COMMAND

```bash
node scripts/tests/w2-e2e-hr.js
```

---

**GO! Test the full recruitment workflow! Fix issues! Ship quality! 🚀**
