# 🧪 E2E Test Task - W2: HR_SPECIALIST Role

**Worker:** W2
**Role to Test:** HR_SPECIALIST (HR Operations)
**Test Account:** test-hr_specialist@test-org-2.com / TestPass123!
**Organization:** Test Org 2 (PRO plan)
**Duration:** ~4 hours
**Report Location:** `docs/reports/e2e-test-w2-hr-specialist-report.md`

---

## 🎯 YOUR MISSION

Test the **HR_SPECIALIST role** experience comprehensively. HR_SPECIALIST is the core hiring role - manages job postings, CVs, analyses, candidates. Your job is to:

1. **Verify RBAC** - Ensure HR can access hiring features but NOT admin/system features
2. **Test Full Hiring Workflow** - Job posting → CV upload → Analysis → Candidate management
3. **Find Bugs** - Console errors, wizard bugs, analysis issues
4. **Design Audit** - Multi-step wizards, form consistency, data displays
5. **Document Everything** - Ultra-detailed report with screenshots

---

## 🔐 HR_SPECIALIST ROLE PERMISSIONS (EXPECTED)

### ✅ SHOULD ACCESS
- **Dashboard** - HR variant (hiring metrics)
- **Job Postings** - Full CRUD (create, edit, delete)
- **CV Management** - Upload, view, delete CVs
- **Analysis Wizard** - Create analyses (multi-step)
- **Candidate Management** - View, score, compare candidates
- **Reports** - HR-specific reports (hiring pipeline, candidate stats)
- **Team Management** - LIMITED (view team, cannot change roles)
- **AI Chat** - Ask questions about candidates
- **Profile** - Own profile

### ❌ SHOULD NOT ACCESS
- **Admin Settings** - Org configuration
- **Billing/Subscription** - No payment access
- **System Health** - No system monitoring
- **User Role Management** - Cannot assign roles (ADMIN only)
- **Usage Limits Config** - Cannot change plan limits
- **Super Admin Features** - No multi-org access

### 🔍 MUST VERIFY
- **Org Isolation** - Only sees Test Org 2 data
- **Usage Limits** - PRO plan limits enforced (50 analyses/mo, 200 CVs/mo)
- **CRUD Permissions** - Can create/edit/delete job postings
- **Wizard Flow** - Analysis wizard works end-to-end
- **Data Filtering** - Only org 2 candidates visible

---

## 📋 TESTING CHECKLIST

### 1. Login & Dashboard
- [ ] Login with test-hr_specialist@test-org-2.com / TestPass123!
- [ ] Verify redirected to HR dashboard
- [ ] Check console errors (MUST be 0)
- [ ] **Widgets Present:**
  - [ ] Welcome widget (with HR name)
  - [ ] Active Job Postings count
  - [ ] Total Candidates count
  - [ ] Recent Analyses
  - [ ] Hiring Pipeline (candidates by stage)
  - [ ] Usage Stats (analyses used / limit)
  - [ ] Quick Actions (Create Job, Upload CV, New Analysis)
- [ ] **Widgets ABSENT:**
  - [ ] System Health (SUPER_ADMIN only)
  - [ ] All Organizations view
  - [ ] Billing widget (ADMIN only)
- [ ] **Performance:** Dashboard load < 2s
- [ ] **Take Screenshot:** Full dashboard

### 2. Job Postings Management (FULL CRUD)

#### Create Job Posting
- [ ] Navigate to Job Postings
- [ ] Click "Create Job Posting"
- [ ] **Form Fields:**
  - [ ] Title (required)
  - [ ] Description (required)
  - [ ] Department (dropdown)
  - [ ] Location
  - [ ] Salary Range
  - [ ] Requirements
  - [ ] Status (Draft/Active/Closed)
- [ ] Fill form with test data:
  ```
  Title: "Senior Backend Developer"
  Description: "We're looking for an experienced backend developer..."
  Department: "Engineering"
  Location: "Istanbul, Turkey"
  Status: "Active"
  ```
- [ ] Click "Save"
- [ ] **Expected:** Success message, redirected to job list
- [ ] **Verify:** New job appears in list
- [ ] Check console errors
- [ ] **Take Screenshot:** Create form + Success message

#### Edit Job Posting
- [ ] Find the job you just created
- [ ] Click "Edit"
- [ ] Change title to "Senior Backend Engineer"
- [ ] Click "Save"
- [ ] **Expected:** Success message
- [ ] **Verify:** Title updated in list
- [ ] Check console errors
- [ ] **Take Screenshot:** Edit form

#### Delete Job Posting
- [ ] Find the job posting
- [ ] Click "Delete"
- [ ] **Expected:** Confirmation dialog
- [ ] Confirm deletion
- [ ] **Expected:** Success message, job removed from list
- [ ] **Verify:** Job no longer in database
- [ ] Check console errors

#### RBAC Test - Cross-Org Isolation
- [ ] **API Test (Python):**
  ```python
  # Try to access Test Org 1's jobs (should fail)
  response = helper.get('/api/v1/job-postings')
  jobs = response.json()
  # Verify: All jobs belong to Test Org 2 only
  ```

### 3. CV Management

#### Upload CVs
- [ ] Navigate to CV Management
- [ ] Click "Upload CVs"
- [ ] **Test 1:** Upload single PDF CV
  - [ ] Select 1 CV file
  - [ ] Upload
  - [ ] **Expected:** Success message, CV appears in list
  - [ ] **Upload time:** _____ seconds
- [ ] **Test 2:** Upload multiple CVs (10 files)
  - [ ] Select 10 CV files
  - [ ] Upload
  - [ ] **Expected:** Batch upload success
  - [ ] **Upload time:** _____ seconds
  - [ ] **Verify:** All 10 CVs in list
- [ ] **Test 3:** Upload limit test (PRO plan = 200 CVs/mo)
  - [ ] Check current usage in dashboard
  - [ ] Try to upload more than limit (if applicable)
  - [ ] **Expected:** Error message if limit reached
- [ ] Check console errors
- [ ] **Take Screenshot:** CV list after uploads

#### View CV
- [ ] Click on a CV to view
- [ ] **Expected:** CV preview (if PDF viewer implemented)
- [ ] **Verify:** CV metadata displayed (filename, upload date, size)
- [ ] **Verify:** Download button works
- [ ] Check console errors

#### Delete CV
- [ ] Select a CV
- [ ] Click "Delete"
- [ ] **Expected:** Confirmation dialog
- [ ] Confirm deletion
- [ ] **Expected:** Success message, CV removed
- [ ] Check console errors

### 4. Analysis Wizard (CRITICAL FLOW)

**This is a multi-step wizard - test EVERY step!**

#### Step 1: Job Selection
- [ ] Navigate to Analysis Wizard
- [ ] **Expected:** "Select Job Posting" step
- [ ] **Verify:** Dropdown shows only Test Org 2 jobs
- [ ] Select a job posting
- [ ] Click "Next"
- [ ] **Expected:** Move to Step 2
- [ ] Check console errors
- [ ] **Take Screenshot:** Step 1

#### Step 2: CV Upload
- [ ] **Expected:** "Upload CVs" step
- [ ] **Test:** Drag & drop 5 CVs
- [ ] **Expected:** Files listed, progress bar
- [ ] **Upload time:** _____ seconds (target < 2s per file)
- [ ] **Verify:** CV limit enforced (50 CVs max per analysis)
- [ ] **Test:** Try to upload 51 CVs → Should show error
- [ ] Click "Next"
- [ ] **Expected:** Move to Step 3
- [ ] Check console errors
- [ ] **Take Screenshot:** Step 2 with uploaded CVs

#### Step 3: Analysis Configuration
- [ ] **Expected:** "Configure Analysis" step
- [ ] **Settings:**
  - [ ] Scoring criteria (weights)
  - [ ] Must-have requirements
  - [ ] Nice-to-have requirements
  - [ ] Knockout questions (if any)
- [ ] Fill configuration
- [ ] Click "Next"
- [ ] **Expected:** Move to Step 4
- [ ] Check console errors
- [ ] **Take Screenshot:** Step 3

#### Step 4: Review & Submit
- [ ] **Expected:** "Review & Submit" step
- [ ] **Verify:** Summary of selections
  - [ ] Job posting name
  - [ ] Number of CVs
  - [ ] Analysis settings
- [ ] Click "Submit Analysis"
- [ ] **Expected:** Analysis queued, redirected to results page
- [ ] **Wait:** Analysis processing (BullMQ queue)
- [ ] **Expected Processing Time:** ~70s for 25 CVs (BATCH_SIZE=6)
- [ ] Check console errors
- [ ] **Take Screenshot:** Step 4 + Processing screen

#### Step 5: Results View
- [ ] **Wait:** Until analysis completes
- [ ] **Verify:** Analysis results displayed
  - [ ] Candidate list with scores
  - [ ] Sorting by score
  - [ ] Filtering options
  - [ ] Comparison view
- [ ] **Performance:** Results load time < 3s
- [ ] **Verify:** Data accuracy (scores make sense)
- [ ] Check console errors
- [ ] **Take Screenshot:** Analysis results

#### Wizard UX Evaluation
- [ ] **Intuitive?** Easy to understand each step?
- [ ] **Progress Indicator:** Shows current step clearly?
- [ ] **Back Button:** Can go back to previous steps?
- [ ] **Form Validation:** Clear error messages?
- [ ] **Design Consistency:** All steps use same design?

### 5. Candidate Management

#### View Candidates
- [ ] Navigate to Candidates
- [ ] **Verify:** List shows only Test Org 2 candidates
- [ ] **Columns:**
  - [ ] Name
  - [ ] Email
  - [ ] Score
  - [ ] Status (Applied, Reviewing, Interview, Offer, Rejected)
  - [ ] Applied Date
- [ ] **Sorting:** Click column headers to sort
- [ ] **Filtering:** Use filters (status, score range)
- [ ] Check console errors
- [ ] **Take Screenshot:** Candidate list

#### Candidate Detail View
- [ ] Click on a candidate
- [ ] **Expected:** Candidate detail page
- [ ] **Sections:**
  - [ ] CV preview
  - [ ] Analysis score breakdown
  - [ ] Timeline (status changes)
  - [ ] Notes (if any)
  - [ ] Actions (Move to next stage, Reject, etc.)
- [ ] Check console errors
- [ ] **Take Screenshot:** Candidate detail

#### Candidate Actions
- [ ] **Test:** Change candidate status
  - [ ] Select "Move to Interview"
  - [ ] **Expected:** Status updated, notification sent (?)
- [ ] **Test:** Add note to candidate
  - [ ] Write note: "Great communication skills"
  - [ ] Save
  - [ ] **Expected:** Note appears in timeline
- [ ] **Test:** Reject candidate
  - [ ] Click "Reject"
  - [ ] Confirm
  - [ ] **Expected:** Status changed to "Rejected"
- [ ] Check console errors

### 6. Reports (HR-Specific)

- [ ] Navigate to Reports
- [ ] **Available Reports (HR):**
  - [ ] Hiring Pipeline (candidates by stage)
  - [ ] Time to Hire (average days)
  - [ ] Source Effectiveness (where candidates come from)
  - [ ] Candidate Demographics (if applicable)
- [ ] **Generate Report:**
  - [ ] Select date range
  - [ ] Select report type
  - [ ] Click "Generate"
  - [ ] **Expected:** Report displayed with charts/tables
  - [ ] **Performance:** Report generation < 5s
- [ ] **Export Test:**
  - [ ] Click "Export to CSV"
  - [ ] **Expected:** CSV file downloaded
  - [ ] **Verify:** CSV contains correct data
- [ ] Check console errors
- [ ] **Take Screenshot:** Report view

### 7. Team Management (LIMITED)

- [ ] Navigate to Team
- [ ] **Expected:** List of Test Org 2 users
- [ ] **Can View:**
  - [ ] User name, email, role
  - [ ] User status (active/inactive)
- [ ] **Cannot Do (should be hidden/disabled):**
  - [ ] Change user roles (ADMIN only)
  - [ ] Delete users (ADMIN only)
  - [ ] Invite new users (ADMIN only)
- [ ] **RBAC Test:** Try to access role management API
  ```python
  response = helper.patch('/api/v1/users/123', {"role": "ADMIN"})
  # Expected: 403 Forbidden
  ```
- [ ] Check console errors
- [ ] **Take Screenshot:** Team list

### 8. AI Chat

- [ ] Navigate to AI Chat
- [ ] **Test Query:** "Show me top 5 candidates for Senior Backend Developer"
- [ ] **Expected:** Gemini response with candidate list
- [ ] **Response time:** < 5s
- [ ] **Verify:** Response uses Milvus data (semantic search)
- [ ] **Test Query 2:** "What skills are missing in our candidate pool?"
- [ ] **Expected:** Analytical response
- [ ] **Test:** Chat history saved
- [ ] **Test:** Cannot see other users' chats
- [ ] Check console errors
- [ ] **Take Screenshot:** AI Chat with responses

### 9. Usage Limits Verification (PRO Plan)

**PRO Plan Limits:**
- 50 analyses/month
- 200 CVs/month
- 10 users

- [ ] Navigate to Dashboard → Usage Widget
- [ ] **Verify:** Current usage displayed
  - [ ] Analyses: X / 50
  - [ ] CVs: Y / 200
  - [ ] Users: Z / 10
- [ ] **Test:** Try to create 51st analysis (if possible)
  - [ ] **Expected:** Error message "Limit reached, upgrade to ENTERPRISE"
- [ ] **Test:** Try to upload 201st CV (if possible)
  - [ ] **Expected:** Error message
- [ ] Check console errors
- [ ] **Take Screenshot:** Usage limits widget

### 10. RBAC Violation Attempts

**Try to access ADMIN-only features:**

- [ ] **Manual URL Tests:**
  - [ ] `/admin` → Should redirect or 403
  - [ ] `/settings/organization` → Should redirect or 403
  - [ ] `/billing` → Should redirect or 403
  - [ ] `/system-health` → Should redirect or 403
- [ ] **API Tests:**
  ```python
  # Try to change org settings (ADMIN only)
  response = helper.patch('/api/v1/organization', {"name": "Hacked Org"})
  # Expected: 403
  
  # Try to access billing (ADMIN only)
  response = helper.get('/api/v1/billing')
  # Expected: 403
  
  # Try to change user roles (ADMIN only)
  response = helper.patch('/api/v1/users/123', {"role": "ADMIN"})
  # Expected: 403
  ```
- [ ] **UI Tests:**
  - [ ] Admin buttons should be hidden in UI
  - [ ] Cannot access billing page from nav
- [ ] **Take Screenshot:** 403 errors (if any)

### 11. Performance Testing

- [ ] **Page Load Times:**
  - Dashboard: _____ seconds
  - Job Postings: _____ seconds
  - CV Management: _____ seconds
  - Analysis Wizard: _____ seconds
  - Candidates: _____ seconds
  - Reports: _____ seconds
- [ ] **API Response Times (Python script):**
  ```python
  import time
  
  start = time.time()
  response = helper.get('/api/v1/job-postings')
  elapsed = time.time() - start
  print(f"Job Postings API: {elapsed*1000:.0f} ms")
  ```
- [ ] **Large Data Handling:**
  - [ ] Upload 50 CVs (max) → Time: _____ seconds
  - [ ] View analysis with 50 candidates → Load time: _____ seconds
  - [ ] Scroll candidate list (100+ candidates) → Smooth? Yes/No
- [ ] **Bottlenecks:**
  - [ ] Any slow pages?
  - [ ] Any API calls > 2s?
  - [ ] Any UI freezes?

### 12. Design Consistency Audit

**Compare all pages for consistency:**

- [ ] **Color Scheme:**
  - Primary: _____ (expected: Emerald for HR)
  - Consistent across all pages? Yes/No
- [ ] **Typography:**
  - Font family: _____
  - Consistent? Yes/No
- [ ] **Buttons:**
  - Style consistent? Yes/No
  - Hover effects consistent? Yes/No
- [ ] **Forms:**
  - Input field styles consistent? Yes/No
  - Validation messages consistent? Yes/No
- [ ] **Cards/Widgets:**
  - Border radius consistent? Yes/No
  - Shadow consistent? Yes/No
- [ ] **Layouts:**
  - All pages use same container width? Yes/No
  - Sidebar consistent? Yes/No
- [ ] **Wizard Design:**
  - Step indicator consistent across steps? Yes/No
  - Button placement consistent? Yes/No
- [ ] **Identify Inconsistencies:**
  - Page A uses design X
  - Page B uses design Y
  - Should be unified!
- [ ] **Take Screenshot:** All inconsistencies

### 13. Error Discovery

- [ ] **Console Errors (Playwright):**
  ```bash
  playwright.console_errors() → errorCount = ?
  ```
  - [ ] If errorCount > 0, list ALL errors
  - [ ] Screenshot each error
  - [ ] Provide reproduction steps
- [ ] **Network Errors:**
  - [ ] Check Network tab (F12)
  - [ ] Any 500 errors?
  - [ ] Any 403 errors (unexpected)?
  - [ ] Any failed requests?
- [ ] **UI Bugs:**
  - [ ] Broken layouts
  - [ ] Overlapping elements
  - [ ] Missing labels
  - [ ] Broken images
  - [ ] Unclickable buttons
- [ ] **Logic Errors:**
  - [ ] Wrong data in widgets
  - [ ] Incorrect calculations (scores, counts)
  - [ ] Broken workflows (wizard stuck)

### 14. UX Evaluation

- [ ] **Intuitive Features:**
  - Job posting creation easy? Yes/No
  - CV upload intuitive? Yes/No
  - Analysis wizard clear? Yes/No
  - Candidate management straightforward? Yes/No
- [ ] **Confusing Elements:**
  - Any unclear labels?
  - Any missing instructions?
  - Any dead-end pages?
- [ ] **User Flow:**
  - Dashboard → Create Job → Upload CVs → Analyze → View Results
  - Flow smooth? Any friction points?
- [ ] **Feedback:**
  - Loading states present? Yes/No
  - Success messages clear? Yes/No
  - Error messages helpful? Yes/No

---

## 📊 REPORT STRUCTURE

Use the standard E2E report template (see master plan).

**Critical Sections for HR Role:**
1. **Wizard Testing Results** - Did all 5 steps work?
2. **CRUD Operations** - Job postings create/edit/delete working?
3. **Usage Limits** - PRO plan limits enforced correctly?
4. **RBAC** - Cannot access ADMIN features?
5. **Performance** - Analysis wizard fast enough? (target: 70s for 25 CVs)

---

## ⚠️ CRITICAL REMINDERS

1. **Analysis Wizard:** This is CRITICAL - test ALL 5 steps thoroughly!
2. **Usage Limits:** PRO plan limits MUST be enforced
3. **RBAC:** Try to access ADMIN features - should fail!
4. **Console Errors:** MUST be 0
5. **Honest Reporting:** Do NOT fake wizard test results!

---

**START TESTING! Report when done.**
