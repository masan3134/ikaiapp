# 🎯 MASTER WORKER: Full-Cycle Clean Slate Test

**Test Type:** End-to-End Real-World Simulation (Clean Database)
**Worker:** 1 Master Worker (W7 or experienced worker)
**Duration:** ~8-12 hours
**Date:** TBD
**Goal:** Test COMPLETE system from zero to production-ready with CLEAN database

---

## 🚨 CRITICAL: Clean Slate Protocol

**BEFORE STARTING TEST:**

### Step 0: Complete Database Cleanup
```bash
# ⚠️ CRITICAL: This will DELETE ALL DATA!
# Only run in DEV environment, NEVER in production!

# Run cleanup script
cd /home/asan/Desktop/ikai
docker exec -it ikai-backend node scripts/cleanup-all-test-data.js

# OR Manual PostgreSQL cleanup:
docker exec -it ikai-postgres psql -U ikaiuser -d ikaidb -c "
  DELETE FROM offer_logs;
  DELETE FROM interview_logs;
  DELETE FROM analysis_chat_history;
  DELETE FROM analysis_results;
  DELETE FROM analyses;
  DELETE FROM candidate_notes;
  DELETE FROM candidates;
  DELETE FROM job_postings;
  DELETE FROM notifications;
  DELETE FROM activity_logs;
  -- Keep users table (we'll test registration)
  DELETE FROM users WHERE email != 'info@gaiai.ai';
  -- Keep organizations table (we'll test org creation)
  DELETE FROM organizations WHERE name != 'System';
"

# Verify cleanup
docker exec -it ikai-postgres psql -U ikaiuser -d ikaidb -c "
  SELECT 'analyses' as table_name, COUNT(*) FROM analyses
  UNION ALL
  SELECT 'candidates', COUNT(*) FROM candidates
  UNION ALL
  SELECT 'job_postings', COUNT(*) FROM job_postings
  UNION ALL
  SELECT 'offers', COUNT(*) FROM offers
  UNION ALL
  SELECT 'interviews', COUNT(*) FROM interviews
  UNION ALL
  SELECT 'users', COUNT(*) FROM users WHERE email != 'info@gaiai.ai';
"

# Expected result: All counts should be 0
```

**AFTER CLEANUP:**
- ✅ Database clean (0 analyses, 0 candidates, 0 CVs, 0 offers, 0 interviews)
- ✅ Only SUPER_ADMIN user exists (info@gaiai.ai)
- ✅ Fresh start for test

---

## 📋 Test Overview

### Test Scenario: "Ajans İK" Company Setup & First Hire

**Company:** Ajans İK (HR Consulting)
**Departments:** HR, Sales, Engineering
**Users:** 3 people (Lira, Buse, Gizem)
**Workflow:** Complete hiring process from registration to offer acceptance

### Test Flow (10 Major Phases)
```
Phase 1: Registration & Onboarding    [Lira registers]
Phase 2: SUPER_ADMIN Approval          [MOD approves]
Phase 3: ADMIN Setup                   [Lira sets up org]
Phase 4: Team Building                 [Lira adds Buse, Gizem]
Phase 5: Job Posting Creation          [Buse creates job]
Phase 6: CV Upload & Analysis          [Buse uploads CVs]
Phase 7: Candidate Review              [Gizem reviews dept candidates]
Phase 8: Interview Process             [Buse schedules, Gizem interviews]
Phase 9: Offer Process                 [Buse sends offers, candidates respond]
Phase 10: Final Verification           [Lira checks reports]
```

---

## 🎯 PHASE 1: Registration & Onboarding (Lira)

### 1.1 New User Registration
**Goal:** Register new organization from public landing page

**Steps:**
1. **Navigate to registration page**
   ```
   URL: http://localhost:8103/register
   ```

2. **Fill registration form:**
   - First Name: `Lira`
   - Last Name: `Yılmaz`
   - Email: `lira@ajansik.com`
   - Password: `AjansIK2025!`
   - Confirm Password: `AjansIK2025!`
   - Company Name: `Ajans İK`
   - Industry: `Human Resources Consulting`
   - Company Size: `10-50 employees`
   - Accept Terms: ✅

3. **Submit form**
   - Click "Kayıt Ol" (Register)
   - **Expected:** Success toast "Kayıt başarılı! Email doğrulama linki gönderildi."
   - **Check:** mustafaasan91@gmail.com for verification email

4. **Email verification**
   - **PAUSE:** Wait for email
   - Check email: Subject "Email Adresinizi Doğrulayın"
   - Click verification link
   - **Expected:** Redirect to /email-verified page

5. **Verification Screenshots:**
   - `01-registration-form.png`
   - `02-registration-success.png`
   - `03-email-verification.png`

**Database Check:**
```bash
# Check user created
docker exec -it ikai-postgres psql -U ikaiuser -d ikaidb -c "
  SELECT id, email, role, email_verified, organization_id
  FROM users
  WHERE email = 'lira@ajansik.com';
"

# Check organization created
docker exec -it ikai-postgres psql -U ikaiuser -d ikaidb -c "
  SELECT id, name, plan, industry
  FROM organizations
  WHERE name = 'Ajans İK';
"
```

**Expected Results:**
- ✅ User created: `lira@ajansik.com`, role: `ADMIN` (default for first user)
- ✅ Organization created: `Ajans İK`, plan: `FREE` (default)
- ✅ Email verified: `true`
- ✅ User linked to organization

**Test Checklist:**
- [ ] Registration form accessible
- [ ] Form validation working (email format, password strength, required fields)
- [ ] Submit creates user + organization
- [ ] Email sent to mustafaasan91@gmail.com
- [ ] Email verification link works
- [ ] User redirected after verification
- [ ] Database records created correctly

---

## 🎯 PHASE 2: SUPER_ADMIN Approval (MOD via W7)

### 2.1 SUPER_ADMIN Review New Organization
**Goal:** SUPER_ADMIN approves new organization and assigns plan

**Steps:**
1. **Login as SUPER_ADMIN**
   ```
   Email: info@gaiai.ai
   Password: 23235656
   URL: http://localhost:8103/login
   ```

2. **Navigate to Organizations Management**
   ```
   URL: http://localhost:8103/super-admin/organizations
   ```

3. **Find "Ajans İK" organization**
   - Should appear in list
   - Status: "Pending" or "Active"
   - Plan: "FREE"

4. **Update organization plan to PRO**
   - Click "Ajans İK" row
   - Edit plan: FREE → PRO
   - Set limits:
     - Analyses: 50/month
     - CVs: 200/month
     - Users: 10
   - Save changes
   - **Expected:** Success toast "Plan güncellendi"

5. **Verification Screenshots:**
   - `04-superadmin-orgs-list.png`
   - `05-superadmin-org-edit.png`
   - `06-superadmin-plan-updated.png`

**Database Check:**
```bash
# Check plan updated
docker exec -it ikai-postgres psql -U ikaiuser -d ikaidb -c "
  SELECT id, name, plan, max_analyses, max_cvs, max_users
  FROM organizations
  WHERE name = 'Ajans İK';
"
```

**Expected Results:**
- ✅ Plan: `PRO`
- ✅ max_analyses: 50
- ✅ max_cvs: 200
- ✅ max_users: 10

**Test Checklist:**
- [ ] SUPER_ADMIN can see all organizations
- [ ] "Ajans İK" appears in list
- [ ] Plan can be edited
- [ ] Limits can be set
- [ ] Changes persist after save
- [ ] Database updated correctly

---

## 🎯 PHASE 3: ADMIN Setup (Lira)

### 3.1 Login as Lira (First Time)
**Goal:** Lira logs in and explores her ADMIN dashboard

**Steps:**
1. **Login**
   ```
   Email: lira@ajansik.com
   Password: AjansIK2025!
   URL: http://localhost:8103/login
   ```

2. **First login - Onboarding flow** (if exists)
   - Complete onboarding wizard
   - Skip if no wizard

3. **Dashboard exploration**
   - **Expected:** ADMIN dashboard loads
   - Widgets visible (usage, stats, quick actions)
   - Sidebar shows ADMIN menu items

4. **Verification Screenshots:**
   - `07-lira-first-login.png`
   - `08-lira-dashboard.png`

**Test Checklist:**
- [ ] Login successful
- [ ] Dashboard loads without errors
- [ ] Console errors: 0
- [ ] ADMIN menu visible (Team, Settings, Billing, etc.)

### 3.2 Organization Settings
**Goal:** Configure organization details

**Steps:**
1. **Navigate to Organization Settings**
   ```
   URL: http://localhost:8103/settings/organization
   ```

2. **Update organization details:**
   - Organization Name: `Ajans İK` (verify)
   - Industry: `Human Resources Consulting`
   - Website: `https://ajansik.com`
   - Phone: `+90 212 555 1234`
   - Address: `İstanbul, Türkiye`
   - Logo: Upload company logo (test image)
   - Primary Color: `#3B82F6` (blue)
   - Timezone: `Europe/Istanbul`

3. **Save changes**
   - Click "Kaydet" (Save)
   - **Expected:** Success toast "Ayarlar güncellendi"
   - **Refresh page** → Changes persist

4. **Verification Screenshots:**
   - `09-org-settings-before.png`
   - `10-org-settings-after.png`

**Database Check:**
```bash
# Check org settings updated
docker exec -it ikai-postgres psql -U ikaiuser -d ikaidb -c "
  SELECT name, industry, website, phone, address, primary_color, timezone
  FROM organizations
  WHERE name = 'Ajans İK';
"
```

**Test Checklist:**
- [ ] Settings page accessible
- [ ] All fields editable
- [ ] Logo upload works
- [ ] Color picker works
- [ ] Changes save successfully
- [ ] Changes persist after refresh
- [ ] Database updated

### 3.3 Billing & Usage Overview
**Goal:** Verify PRO plan limits displayed correctly

**Steps:**
1. **Navigate to Billing**
   ```
   URL: http://localhost:8103/settings/billing
   ```

2. **Verify plan details:**
   - Current Plan: `PRO`
   - Price: `₺99/ay`
   - Billing cycle: Monthly
   - Next billing date: (1 month from registration)

3. **Verify usage indicators:**
   - Analyses: `0 / 50` (used / limit)
   - CVs: `0 / 200`
   - Users: `1 / 10` (Lira only for now)

4. **Verification Screenshots:**
   - `11-billing-overview.png`

**Test Checklist:**
- [ ] Billing page loads
- [ ] PRO plan displayed correctly
- [ ] Usage indicators show 0/50, 0/200, 1/10
- [ ] Plan limits correct

---

## 🎯 PHASE 4: Team Building (Lira adds Buse, Gizem)

### 4.1 Add Buse (HR_SPECIALIST)
**Goal:** Invite Buse to the team as HR_SPECIALIST

**Steps:**
1. **Navigate to Team Management**
   ```
   URL: http://localhost:8103/team
   ```

2. **Click "Add User" or "Invite User"**

3. **Fill invitation form:**
   - Email: `buse@ajansik.com`
   - First Name: `Buse`
   - Last Name: `Özdemir`
   - Role: `HR_SPECIALIST`
   - Department: `HR`
   - Send Invitation Email: ✅

4. **Submit**
   - Click "Davet Gönder" (Send Invitation)
   - **Expected:** Success toast "Davet gönderildi"
   - **PAUSE:** Check mustafaasan91@gmail.com

5. **Email verification:**
   - Subject: "Ajans İK - Davet"
   - Click invitation link
   - **Expected:** Redirect to /set-password page

6. **Buse sets password:**
   - Password: `BuseHR2025!`
   - Confirm Password: `BuseHR2025!`
   - Submit
   - **Expected:** Success, redirect to /login

7. **Buse first login:**
   - Email: `buse@ajansik.com`
   - Password: `BuseHR2025!`
   - **Expected:** HR_SPECIALIST dashboard loads

8. **Verification Screenshots:**
   - `12-invite-buse-form.png`
   - `13-invite-buse-email.png`
   - `14-buse-set-password.png`
   - `15-buse-first-login.png`

**Database Check:**
```bash
# Check Buse created
docker exec -it ikai-postgres psql -U ikaiuser -d ikaidb -c "
  SELECT id, email, role, department, organization_id
  FROM users
  WHERE email = 'buse@ajansik.com';
"
```

**Test Checklist:**
- [ ] Invitation form accessible
- [ ] Email sent successfully
- [ ] Invitation link works
- [ ] Password setup works
- [ ] Buse can login
- [ ] HR_SPECIALIST dashboard loads
- [ ] Database record correct

### 4.2 Add Gizem (MANAGER)
**Goal:** Invite Gizem as MANAGER of Engineering department

**Repeat same steps as 4.1:**
- Email: `gizem@ajansik.com`
- First Name: `Gizem`
- Last Name: `Arslan`
- Role: `MANAGER`
- Department: `Engineering`
- Password: `GizemEng2025!`

**Verification Screenshots:**
- `16-invite-gizem-form.png`
- `17-gizem-first-login.png`

**Database Check:**
```bash
# Check all users
docker exec -it ikai-postgres psql -U ikaiuser -d ikaidb -c "
  SELECT id, email, role, department
  FROM users
  WHERE organization_id = (SELECT id FROM organizations WHERE name = 'Ajans İK')
  ORDER BY created_at;
"
```

**Expected Results:**
- ✅ 3 users total:
  1. lira@ajansik.com (ADMIN, no dept)
  2. buse@ajansik.com (HR_SPECIALIST, HR dept)
  3. gizem@ajansik.com (MANAGER, Engineering dept)

**Test Checklist:**
- [ ] All 3 users created
- [ ] All can login
- [ ] Roles assigned correctly
- [ ] Departments assigned correctly
- [ ] Usage indicator updated: `3 / 10` users

---

## 🎯 PHASE 5: Job Posting Creation (Buse)

### 5.1 Login as Buse
**Goal:** Create first job posting

**Steps:**
1. **Login**
   ```
   Email: buse@ajansik.com
   Password: BuseHR2025!
   ```

2. **Navigate to Job Postings**
   ```
   URL: http://localhost:8103/job-postings
   ```

3. **Verify empty state:**
   - **Expected:** "Henüz iş ilanı yok" or similar empty state
   - "Yeni İlan Ekle" button visible

4. **Click "Yeni İlan Ekle"**

5. **Fill job posting form:**
   - **Title:** `Senior Backend Developer`
   - **Department:** `Engineering`
   - **Location:** `İstanbul, Türkiye (Hybrid)`
   - **Employment Type:** `Full-time`
   - **Experience Level:** `5+ years`
   - **Salary Range:** `35.000 - 50.000 TL/ay`
   - **Job Description:**
     ```
     Ajans İK olarak müşterilerimiz için Backend Developer arıyoruz.

     Sorumluluklar:
     - Node.js ile RESTful API geliştirme
     - PostgreSQL database yönetimi
     - Microservices mimarisi tasarımı
     - CI/CD pipeline kurulumu

     Gereksinimler:
     - 5+ yıl backend geliştirme deneyimi
     - Node.js, Express.js bilgisi
     - PostgreSQL, MongoDB deneyimi
     - Docker, Kubernetes bilgisi
     - Git versiyon kontrolü
     ```
   - **Requirements (bullet points):**
     - Node.js expert (5+ years)
     - PostgreSQL/MongoDB
     - REST API design
     - Docker/Kubernetes
     - Agile/Scrum experience
   - **Benefits:**
     - Competitive salary
     - Remote work option
     - Health insurance
     - Training budget
     - Career growth
   - **Status:** `Active` (or `Published`)

6. **Save job posting**
   - Click "Kaydet" (Save) or "Yayınla" (Publish)
   - **Expected:** Success toast "İlan oluşturuldu"
   - Redirect to job postings list

7. **Verify job posting appears**
   - Job postings list should show 1 job
   - Title: "Senior Backend Developer"
   - Department: "Engineering"
   - Status: "Active"

8. **Verification Screenshots:**
   - `18-buse-job-postings-empty.png`
   - `19-buse-job-form.png`
   - `20-buse-job-created.png`

**Database Check:**
```bash
# Check job posting created
docker exec -it ikai-postgres psql -U ikaiuser -d ikaidb -c "
  SELECT id, title, department, location, status, created_by
  FROM job_postings
  WHERE title = 'Senior Backend Developer';
"
```

**Test Checklist:**
- [ ] Job postings page accessible
- [ ] Empty state displays
- [ ] Create button works
- [ ] Form has all fields
- [ ] Form validation works
- [ ] Job posting created successfully
- [ ] Job appears in list
- [ ] Database record created

---

## 🎯 PHASE 6: CV Upload & Analysis (Buse)

### 6.1 CV Upload via Candidates Page
**Goal:** Upload 5 CVs to candidate pool

**Steps:**
1. **Navigate to Candidates**
   ```
   URL: http://localhost:8103/candidates
   ```

2. **Verify empty state:**
   - **Expected:** "Henüz aday yok" or similar
   - "CV Yükle" or "Aday Ekle" button visible

3. **Click "CV Yükle"**

4. **Upload 5 CVs:**
   - **File location:** `/home/asan/Desktop/ikai/test-data/cvs/`
   - Select 5 files:
     1. `Ahmet_Yilmaz_Backend.pdf`
     2. `Mehmet_Demir_Fullstack.pdf`
     3. `Ayse_Kaya_Frontend.pdf`
     4. `Zeynep_Arslan_DevOps.pdf`
     5. `Can_Ozturk_Backend.pdf`
   - **Expected:** Progress bar shows upload progress
   - **Expected:** 5 success toasts "CV yüklendi: {name}"

5. **Verify candidates appear:**
   - Candidates list should show 5 candidates
   - Names extracted from CVs
   - Status: "New" (default)
   - Department: "Engineering" (from job posting context)

6. **Verification Screenshots:**
   - `21-candidates-empty.png`
   - `22-cv-upload-progress.png`
   - `23-candidates-list-5.png`

**Database Check:**
```bash
# Check candidates created
docker exec -it ikai-postgres psql -U ikaiuser -d ikaidb -c "
  SELECT id, first_name, last_name, email, status, department, cv_file_path
  FROM candidates
  WHERE organization_id = (SELECT id FROM organizations WHERE name = 'Ajans İK')
  ORDER BY created_at;
"

# Check CV files uploaded
docker exec -it ikai-backend ls -lh /usr/src/app/uploads/cvs/
```

**Expected Results:**
- ✅ 5 candidates in database
- ✅ CV files in `/uploads/cvs/` folder
- ✅ Usage indicator updated: `5 / 200` CVs

**Test Checklist:**
- [ ] Candidates page accessible
- [ ] Empty state displays
- [ ] Upload button works
- [ ] Can select multiple files
- [ ] Progress bar visible
- [ ] All 5 CVs uploaded successfully
- [ ] Candidates appear in list
- [ ] CV files saved to disk
- [ ] Database records created
- [ ] Usage indicator updated

### 6.2 Analysis Wizard - 3-Step Flow
**Goal:** Run CV analysis using the analysis wizard

**Steps:**
1. **Navigate to Analysis Wizard**
   ```
   URL: http://localhost:8103/wizard
   OR
   URL: http://localhost:8103/analyses/create
   ```

2. **STEP 1: Select Job Posting**
   - Dropdown shows: "Senior Backend Developer"
   - Select it
   - Click "İleri" (Next)
   - **Expected:** Step 2 loads

3. **STEP 2: Select CVs**
   - **Option A:** Upload new CVs (skip, we already have 5)
   - **Option B:** Select from existing candidates
   - Select all 5 candidates:
     - [x] Ahmet Yılmaz
     - [x] Mehmet Demir
     - [x] Ayşe Kaya
     - [x] Zeynep Arslan
     - [x] Can Öztürk
   - Click "İleri" (Next)
   - **Expected:** Step 3 loads

4. **STEP 3: Confirm & Start Analysis**
   - Summary displays:
     - Job: "Senior Backend Developer"
     - CVs: 5 selected
     - Estimated time: ~60 seconds
   - Click "Analizi Başlat" (Start Analysis)
   - **Expected:** Success toast "Analiz başlatıldı"
   - **Expected:** Redirect to analyses list

5. **Wait for analysis to complete:**
   - Analyses list shows: "Senior Backend Developer - Processing"
   - **Refresh page every 10 seconds**
   - **Expected:** Status changes to "Completed" after ~60-90 seconds

6. **Verification Screenshots:**
   - `24-wizard-step1-job.png`
   - `25-wizard-step2-cvs.png`
   - `26-wizard-step3-confirm.png`
   - `27-analysis-processing.png`
   - `28-analysis-completed.png`

**Database Check:**
```bash
# Check analysis created
docker exec -it ikai-postgres psql -U ikaiuser -d ikaidb -c "
  SELECT id, job_posting_id, status, total_candidates, created_by
  FROM analyses
  WHERE job_posting_id = (SELECT id FROM job_postings WHERE title = 'Senior Backend Developer');
"

# Check analysis results
docker exec -it ikai-postgres psql -U ikaiuser -d ikaidb -c "
  SELECT ar.id, c.first_name, c.last_name, ar.match_score, ar.rank
  FROM analysis_results ar
  JOIN candidates c ON ar.candidate_id = c.id
  WHERE ar.analysis_id = (SELECT id FROM analyses WHERE status = 'COMPLETED' LIMIT 1)
  ORDER BY ar.rank;
"
```

**Expected Results:**
- ✅ Analysis status: `COMPLETED`
- ✅ 5 analysis results with scores (0-100)
- ✅ Candidates ranked (1-5)
- ✅ Usage indicator updated: `1 / 50` analyses

**Test Checklist:**
- [ ] Wizard accessible
- [ ] Step 1: Job dropdown works
- [ ] Step 2: Candidate selection works
- [ ] Step 3: Summary correct
- [ ] Analysis starts successfully
- [ ] Analysis completes within 2 minutes
- [ ] Results appear with scores
- [ ] Candidates ranked correctly
- [ ] Database records created
- [ ] Usage indicator updated

### 6.3 Analysis Results & AI Chat
**Goal:** View analysis results and test AI chat

**Steps:**
1. **Click completed analysis**
   - Analysis list → Click "Senior Backend Developer" analysis
   - **Expected:** Analysis results page loads

2. **Verify results page:**
   - **Job Posting Details:**
     - Title: "Senior Backend Developer"
     - Department: "Engineering"
   - **Candidate Scores (Top 5):**
     - Rank 1: {Candidate Name} - {Score}/100
     - Rank 2: {Candidate Name} - {Score}/100
     - Rank 3: {Candidate Name} - {Score}/100
     - Rank 4: {Candidate Name} - {Score}/100
     - Rank 5: {Candidate Name} - {Score}/100
   - **Match Details:**
     - Strengths
     - Weaknesses
     - Recommendation

3. **Test AI Chat:**
   - Click "AI Sohbet" (AI Chat) button
   - **Expected:** Chat interface opens

4. **Ask AI questions:**
   - **Question 1:** "Bu adayların en güçlü yönleri nelerdir?"
   - **Expected:** AI response within 5-10 seconds
   - **Question 2:** "İlk 3 adayı karşılaştır."
   - **Expected:** AI compares top 3 candidates
   - **Question 3:** "Bu pozisyon için en uygun aday kimdir?"
   - **Expected:** AI recommends best candidate

5. **Verify chat history persists:**
   - Refresh page
   - **Expected:** Chat history still visible

6. **Verification Screenshots:**
   - `29-analysis-results.png`
   - `30-ai-chat-interface.png`
   - `31-ai-chat-responses.png`

**Database Check:**
```bash
# Check chat history saved
docker exec -it ikai-postgres psql -U ikaiuser -d ikaidb -c "
  SELECT id, analysis_id, role, message, created_at
  FROM analysis_chat_history
  WHERE analysis_id = (SELECT id FROM analyses WHERE status = 'COMPLETED' LIMIT 1)
  ORDER BY created_at;
"
```

**Test Checklist:**
- [ ] Analysis results page loads
- [ ] Candidate scores display (0-100)
- [ ] Candidates ranked correctly
- [ ] Match details visible (strengths, weaknesses)
- [ ] AI Chat button works
- [ ] Chat interface loads
- [ ] Can send messages
- [ ] AI responds within 10 seconds
- [ ] Responses are relevant
- [ ] Chat history persists
- [ ] Database chat history saved
- [ ] Console errors: 0

---

## 🎯 PHASE 7: Candidate Review (Gizem - MANAGER)

### 7.1 Login as Gizem
**Goal:** MANAGER reviews candidates in her department

**Steps:**
1. **Login**
   ```
   Email: gizem@ajansik.com
   Password: GizemEng2025!
   ```

2. **Navigate to Candidates**
   ```
   URL: http://localhost:8103/candidates
   ```

3. **Verify department filtering:**
   - **Expected:** Only Engineering department candidates visible
   - **Expected:** 5 candidates (all are Engineering from job posting)

4. **Verify RBAC:**
   - Gizem should NOT see candidates from other departments (none exist yet, but test later)
   - Gizem should NOT be able to create job postings (button hidden or disabled)

5. **Verification Screenshots:**
   - `32-gizem-dashboard.png`
   - `33-gizem-candidates-dept-filtered.png`

**Test Checklist:**
- [ ] Login successful
- [ ] MANAGER dashboard loads
- [ ] Candidates page accessible
- [ ] Only Engineering candidates visible
- [ ] Cannot create job postings (button hidden)
- [ ] Console errors: 0

### 7.2 Review Top 3 Candidates
**Goal:** Gizem reviews top 3 candidates from analysis

**Steps:**
1. **Navigate to Analyses**
   ```
   URL: http://localhost:8103/analyses
   ```

2. **View analysis results:**
   - Click "Senior Backend Developer" analysis
   - **Expected:** Can view results (read-only or full access, depending on RBAC)

3. **Select top 3 candidates:**
   - Rank 1 candidate → Mark for interview
   - Rank 2 candidate → Mark for interview
   - Rank 3 candidate → Mark for interview

4. **Add notes to each:**
   - Navigate to candidate detail pages
   - **Candidate 1 notes:** "Çok güçlü backend deneyimi. Node.js + PostgreSQL expert. Kesinlikle mülakat yapalım."
   - **Candidate 2 notes:** "İyi profil. Microservices deneyimi var. İkinci sırada mülakat."
   - **Candidate 3 notes:** "Solid profil. Docker/Kubernetes bilgisi güçlü. Üçüncü sırada değerlendirelim."

5. **Update candidate statuses:**
   - Candidate 1: Status → "Screening"
   - Candidate 2: Status → "Screening"
   - Candidate 3: Status → "Screening"

6. **Verification Screenshots:**
   - `34-gizem-analysis-results.png`
   - `35-gizem-candidate-notes.png`

**Database Check:**
```bash
# Check candidate notes
docker exec -it ikai-postgres psql -U ikaiuser -d ikaidb -c "
  SELECT cn.id, c.first_name, c.last_name, cn.note, cn.created_by
  FROM candidate_notes cn
  JOIN candidates c ON cn.candidate_id = c.id
  WHERE cn.created_by = (SELECT id FROM users WHERE email = 'gizem@ajansik.com')
  ORDER BY cn.created_at;
"

# Check candidate statuses updated
docker exec -it ikai-postgres psql -U ikaiuser -d ikaidb -c "
  SELECT id, first_name, last_name, status
  FROM candidates
  WHERE status = 'Screening'
  ORDER BY created_at;
"
```

**Test Checklist:**
- [ ] Can view analysis results
- [ ] Can add notes to candidates
- [ ] Can update candidate statuses
- [ ] Notes persist after save
- [ ] Status changes persist
- [ ] Database records created

---

## 🎯 PHASE 8: Interview Process (Buse schedules, Gizem interviews)

### 8.1 Schedule Interviews (Buse)
**Goal:** Buse schedules interviews for top 3 candidates

**Steps:**
1. **Login as Buse**
   ```
   Email: buse@ajansik.com
   Password: BuseHR2025!
   ```

2. **Navigate to Candidates**
   ```
   URL: http://localhost:8103/candidates
   ```

3. **Filter by status:**
   - Status: "Screening"
   - **Expected:** 3 candidates

4. **Schedule Interview for Candidate 1:**
   - Click Candidate 1
   - Click "Mülakat Planla" (Schedule Interview)
   - **Interview Form:**
     - Interview Type: `Technical Interview`
     - Date: `Tomorrow (2025-11-06)`
     - Time: `10:00 AM`
     - Duration: `60 minutes`
     - Interviewer: `Gizem Arslan` (select from dropdown)
     - Location: `Office - Meeting Room 1` OR `Online - Zoom Link`
     - Meeting Link (if online): `https://zoom.us/j/123456789`
     - Notes for interviewer: `Backend skills, system design questions`
   - Submit
   - **Expected:** Success toast "Mülakat planlandı"
   - **PAUSE:** Check mustafaasan91@gmail.com for interview email

5. **Repeat for Candidate 2:**
   - Date: `2025-11-06`
   - Time: `14:00 PM`
   - Interviewer: `Gizem Arslan`

6. **Repeat for Candidate 3:**
   - Date: `2025-11-07`
   - Time: `10:00 AM`
   - Interviewer: `Gizem Arslan`

7. **Verification Screenshots:**
   - `36-buse-schedule-interview-form.png`
   - `37-buse-interview-email.png`
   - `38-buse-interviews-list.png`

**Database Check:**
```bash
# Check interviews created
docker exec -it ikai-postgres psql -U ikaiuser -d ikaidb -c "
  SELECT i.id, c.first_name, c.last_name, i.interview_date, i.interview_time, i.status, u.first_name as interviewer
  FROM interviews i
  JOIN candidates c ON i.candidate_id = c.id
  JOIN users u ON i.interviewer_id = u.id
  WHERE i.interviewer_id = (SELECT id FROM users WHERE email = 'gizem@ajansik.com')
  ORDER BY i.interview_date, i.interview_time;
"
```

**Expected Results:**
- ✅ 3 interviews scheduled
- ✅ All interviews assigned to Gizem
- ✅ Emails sent to mustafaasan91@gmail.com

**Test Checklist:**
- [ ] Interview form accessible
- [ ] All fields editable
- [ ] Interviewer dropdown works
- [ ] Interviews created successfully
- [ ] Emails sent (3 emails)
- [ ] Interviews appear in list
- [ ] Database records created

### 8.2 Conduct Interviews (Gizem)
**Goal:** Gizem adds feedback after conducting interviews

**Steps:**
1. **Login as Gizem**
   ```
   Email: gizem@ajansik.com
   Password: GizemEng2025!
   ```

2. **Navigate to Interviews**
   ```
   URL: http://localhost:8103/interviews
   OR
   URL: http://localhost:8103/mulakatlar
   ```

3. **View interviews:**
   - **Expected:** 3 interviews assigned to Gizem
   - All status: "Scheduled"

4. **Add feedback for Interview 1 (Candidate 1):**
   - Click Interview 1
   - Click "Geri Bildirim Ekle" (Add Feedback)
   - **Feedback Form:**
     - **Technical Skills (1-5):** `5` (Excellent)
     - **Communication Skills (1-5):** `4` (Good)
     - **Problem Solving (1-5):** `5` (Excellent)
     - **Cultural Fit (1-5):** `4` (Good)
     - **Overall Rating (1-5):** `5` (Excellent)
     - **Recommendation:** `Hire` (dropdown: Hire / Maybe / Reject)
     - **Notes:**
       ```
       Candidate showed excellent backend knowledge.
       - Solved system design question perfectly
       - Strong Node.js and PostgreSQL experience
       - Good communication skills
       - Team fit: Very good
       - Recommendation: STRONG HIRE
       ```
   - Submit
   - **Expected:** Success toast "Geri bildirim kaydedildi"
   - Interview status → "Completed"

5. **Add feedback for Interview 2 (Candidate 2):**
   - Overall Rating: `4` (Good)
   - Recommendation: `Hire`
   - Notes: "Good candidate, solid skills. Second choice."

6. **Add feedback for Interview 3 (Candidate 3):**
   - Overall Rating: `3` (Average)
   - Recommendation: `Maybe`
   - Notes: "Average performance. Needs more experience. Backup option."

7. **Verification Screenshots:**
   - `39-gizem-interviews-list.png`
   - `40-gizem-interview-feedback.png`
   - `41-gizem-interview-completed.png`

**Database Check:**
```bash
# Check interview feedback
docker exec -it ikai-postgres psql -U ikaiuser -d ikaidb -c "
  SELECT i.id, c.first_name, c.last_name, i.status, i.technical_score, i.overall_rating, i.recommendation, i.interviewer_notes
  FROM interviews i
  JOIN candidates c ON i.candidate_id = c.id
  WHERE i.interviewer_id = (SELECT id FROM users WHERE email = 'gizem@ajansik.com')
  ORDER BY i.interview_date;
"

# Check candidate statuses updated
docker exec -it ikai-postgres psql -U ikaiuser -d ikaidb -c "
  SELECT id, first_name, last_name, status
  FROM candidates
  WHERE id IN (SELECT candidate_id FROM interviews)
  ORDER BY created_at;
"
```

**Expected Results:**
- ✅ 3 interviews completed
- ✅ All feedback saved
- ✅ Candidate statuses updated to "Interview"

**Test Checklist:**
- [ ] Interviews list accessible
- [ ] 3 interviews visible
- [ ] Feedback form accessible
- [ ] All rating fields work (1-5 scale)
- [ ] Recommendation dropdown works
- [ ] Notes can be added
- [ ] Feedback saves successfully
- [ ] Interview status changes to "Completed"
- [ ] Candidate status updates to "Interview"
- [ ] Database records updated

---

## 🎯 PHASE 9: Offer Process (Buse sends, Candidates respond)

### 9.1 Send Offers to Top 2 (Buse)
**Goal:** Send job offers to top 2 candidates (Candidate 1, Candidate 2)

**Steps:**
1. **Login as Buse**
   ```
   Email: buse@ajansik.com
   Password: BuseHR2025!
   ```

2. **Navigate to Candidates**
   ```
   URL: http://localhost:8103/candidates
   ```

3. **Filter candidates:**
   - Status: "Interview"
   - **Expected:** 3 candidates

4. **Send Offer to Candidate 1:**
   - Click Candidate 1
   - Click "Teklif Gönder" (Send Offer)
   - **Offer Form:**
     - **Job Title:** `Senior Backend Developer`
     - **Department:** `Engineering`
     - **Salary:** `45.000 TL/ay` (monthly)
     - **Start Date:** `2025-12-01`
     - **Employment Type:** `Full-time`
     - **Contract Type:** `Permanent`
     - **Work Location:** `Hybrid (3 days office, 2 days remote)`
     - **Benefits:**
       ```
       - Private health insurance
       - Meal card (₺1,500/month)
       - Transportation support
       - Annual training budget (₺5,000)
       - Performance bonus (up to 2 salaries/year)
       - 22 days paid vacation
       ```
     - **Offer Letter (template or custom):**
       ```
       Sayın {Candidate Name},

       Ajans İK olarak yaptığımız görüşmeler sonucunda, Senior Backend Developer pozisyonu için size iş teklifi sunmaktan mutluluk duyuyoruz.

       Pozisyon: Senior Backend Developer
       Departman: Engineering
       Maaş: 45.000 TL/ay (brüt)
       Başlangıç Tarihi: 1 Aralık 2025

       Yan Haklar:
       - Özel sağlık sigortası
       - Yemek kartı (₺1,500/ay)
       - Ulaşım desteği
       - Yıllık eğitim bütçesi (₺5,000)
       - Performans bonusu (%100'e kadar)
       - 22 gün yıllık izin

       Teklifimizi değerlendirmenizi ve en kısa sürede dönüş yapmanızı rica ederiz.

       Saygılarımızla,
       Ajans İK İnsan Kaynakları Ekibi
       ```
     - **Deadline:** `2025-11-15` (10 days to respond)
   - Submit
   - **Expected:** Success toast "Teklif gönderildi"
   - **PAUSE:** Check mustafaasan91@gmail.com for offer email

5. **Send Offer to Candidate 2:**
   - Salary: `42.000 TL/ay`
   - Same benefits
   - Deadline: `2025-11-15`

6. **DO NOT send offer to Candidate 3** (backup option)

7. **Verification Screenshots:**
   - `42-buse-offer-form.png`
   - `43-buse-offer-email.png`
   - `44-buse-offers-list.png`

**Database Check:**
```bash
# Check offers created
docker exec -it ikai-postgres psql -U ikaiuser -d ikaidb -c "
  SELECT o.id, c.first_name, c.last_name, o.job_title, o.salary, o.status, o.sent_at
  FROM offers o
  JOIN candidates c ON o.candidate_id = c.id
  WHERE o.organization_id = (SELECT id FROM organizations WHERE name = 'Ajans İK')
  ORDER BY o.sent_at;
"
```

**Expected Results:**
- ✅ 2 offers created
- ✅ Offer status: "Sent"
- ✅ Emails sent to mustafaasan91@gmail.com (2 emails)
- ✅ Candidate statuses updated to "Offer"

**Test Checklist:**
- [ ] Offer form accessible
- [ ] All fields editable
- [ ] Offer letter template works (or custom text)
- [ ] Offers created successfully
- [ ] Emails sent (2 emails)
- [ ] Offers appear in offers list
- [ ] Candidate statuses updated to "Offer"
- [ ] Database records created

### 9.2 Candidate 1 Accepts Offer
**Goal:** Simulate Candidate 1 accepting the offer

**Steps:**
1. **Login as Buse** (to mark offer status)
   ```
   Email: buse@ajansik.com
   Password: BuseHR2025!
   ```

2. **Navigate to Offers**
   ```
   URL: http://localhost:8103/offers
   OR
   URL: http://localhost:8103/teklifler
   ```

3. **Find Candidate 1 offer:**
   - Status: "Sent"

4. **Mark as Accepted:**
   - Click offer
   - Click "Kabul Edildi" (Accepted) button or change status dropdown
   - **Expected:** Success toast "Teklif durumu güncellendi"
   - Offer status → "Accepted"

5. **Verify candidate status updated:**
   - Navigate to Candidates
   - Candidate 1 status → "Hired" (or "Offer Accepted")

6. **Verification Screenshots:**
   - `45-buse-offer-accepted.png`

**Database Check:**
```bash
# Check offer accepted
docker exec -it ikai-postgres psql -U ikaiuser -d ikaidb -c "
  SELECT o.id, c.first_name, c.last_name, o.status, o.accepted_at
  FROM offers o
  JOIN candidates c ON o.candidate_id = c.id
  WHERE o.status = 'Accepted';
"

# Check candidate status
docker exec -it ikai-postgres psql -U ikaiuser -d ikaidb -c "
  SELECT id, first_name, last_name, status
  FROM candidates
  WHERE id = (SELECT candidate_id FROM offers WHERE status = 'Accepted' LIMIT 1);
"
```

**Test Checklist:**
- [ ] Offer status can be changed to "Accepted"
- [ ] Status updates successfully
- [ ] Candidate status updates to "Hired"
- [ ] Database records updated

### 9.3 Candidate 2 Rejects Offer (First Time)
**Goal:** Simulate Candidate 2 rejecting the offer

**Steps:**
1. **Mark Candidate 2 offer as Rejected:**
   - Click Candidate 2 offer
   - Click "Reddedildi" (Rejected) or change status
   - **Rejection Reason (optional):** "Başka bir teklif kabul etti"
   - Submit
   - **Expected:** Success toast "Teklif reddedildi"
   - Offer status → "Rejected"

2. **Verification Screenshots:**
   - `46-buse-offer-rejected.png`

**Database Check:**
```bash
# Check offer rejected
docker exec -it ikai-postgres psql -U ikaiuser -d ikaidb -c "
  SELECT o.id, c.first_name, c.last_name, o.status, o.rejection_reason
  FROM offers o
  JOIN candidates c ON o.candidate_id = c.id
  WHERE o.status = 'Rejected';
"
```

**Test Checklist:**
- [ ] Offer status can be changed to "Rejected"
- [ ] Rejection reason field works
- [ ] Status updates successfully
- [ ] Database record updated

### 9.4 Send Offer to Candidate 3 (Backup)
**Goal:** Send offer to Candidate 3 after Candidate 2 rejected

**Steps:**
1. **Send offer to Candidate 3:**
   - Salary: `40.000 TL/ay`
   - Same benefits
   - Deadline: `2025-11-15`

2. **Verification Screenshots:**
   - `47-buse-offer-candidate3.png`

**Database Check:**
```bash
# Check 3rd offer created
docker exec -it ikai-postgres psql -U ikaiuser -d ikaidb -c "
  SELECT COUNT(*) as total_offers FROM offers;
"
```

**Expected:** 3 total offers

**Test Checklist:**
- [ ] Can send offer to Candidate 3
- [ ] Email sent
- [ ] Offer appears in list

### 9.5 Candidate 3 Rejects Offer (Second Time)
**Goal:** Simulate Candidate 3 also rejecting

**Steps:**
1. **Mark Candidate 3 offer as Rejected:**
   - Rejection reason: "Maaş beklentisi karşılanmadı"
   - Submit

2. **Verification Screenshots:**
   - `48-buse-offer-rejected2.png`

**Database Check:**
```bash
# Check rejection count
docker exec -it ikai-postgres psql -U ikaiuser -d ikaidb -c "
  SELECT status, COUNT(*)
  FROM offers
  GROUP BY status;
"
```

**Expected Results:**
- ✅ Accepted: 1
- ✅ Rejected: 2

**Test Checklist:**
- [ ] Second rejection recorded
- [ ] Database updated

### 9.6 Send NEW Offer to Candidate 4 (From Remaining Pool)
**Goal:** Send offer to Candidate 4 from original 5 candidates

**Steps:**
1. **Navigate to Candidates**
2. **Find Candidate 4 (not interviewed yet):**
   - Status: "New"

3. **Fast-track Candidate 4:**
   - Add note: "Acil ihtiyaç nedeniyle hızlı değerlendirme"
   - Update status: "New" → "Screening" → "Interview" → "Offer"
   - (Skip actual interview for test speed)

4. **Send offer to Candidate 4:**
   - Salary: `43.000 TL/ay`
   - Same benefits
   - Deadline: `2025-11-15`

5. **Mark as Accepted:**
   - Candidate 4 accepts offer
   - Status → "Hired"

6. **Verification Screenshots:**
   - `49-buse-offer-candidate4.png`
   - `50-buse-offer-accepted2.png`

**Database Check:**
```bash
# Check final offer status
docker exec -it ikai-postgres psql -U ikaiuser -d ikaidb -c "
  SELECT status, COUNT(*)
  FROM offers
  GROUP BY status;
"
```

**Expected Results:**
- ✅ Accepted: 2
- ✅ Rejected: 2

**Test Checklist:**
- [ ] Can send offer to 4th candidate
- [ ] 4th offer accepted
- [ ] Database updated

---

## 🎯 PHASE 10: Final Verification (Lira - ADMIN)

### 10.1 Review All Activities (Lira)
**Goal:** ADMIN reviews entire hiring process

**Steps:**
1. **Login as Lira**
   ```
   Email: lira@ajansik.com
   Password: AjansIK2025!
   ```

2. **Navigate to Dashboard**
   ```
   URL: http://localhost:8103/dashboard
   ```

3. **Verify dashboard metrics:**
   - Total Candidates: `5`
   - Total Job Postings: `1`
   - Total Analyses: `1`
   - Total Interviews: `3`
   - Total Offers: `4`
   - Offers Accepted: `2`
   - Offers Rejected: `2`
   - Users: `3 / 10`
   - Analyses Used: `1 / 50`
   - CVs Used: `5 / 200`

4. **Navigate to Org-Wide Analytics**
   ```
   URL: http://localhost:8103/analytics
   ```

5. **Verify analytics data:**
   - Candidate Status Distribution (pie chart):
     - Hired: 2
     - Offer Rejected: 2
     - New: 1
   - Department Breakdown:
     - Engineering: 5 candidates
   - Hiring Funnel:
     - Applied: 5
     - Screened: 3
     - Interviewed: 3
     - Offered: 4
     - Hired: 2
   - Time-to-Hire metrics
   - Interview success rate

6. **Navigate to Reports**
   ```
   URL: http://localhost:8103/reports
   ```

7. **Export full report:**
   - Click "Export" button
   - Format: CSV or Excel
   - **Expected:** File downloads with all data

8. **Verification Screenshots:**
   - `51-lira-dashboard-final.png`
   - `52-lira-analytics-final.png`
   - `53-lira-reports-final.png`

**Test Checklist:**
- [ ] Dashboard metrics correct
- [ ] Analytics charts display data
- [ ] All metrics match expected values
- [ ] Export button works
- [ ] Report file downloads

### 10.2 Team Overview (Lira)
**Goal:** Verify team management

**Steps:**
1. **Navigate to Team**
   ```
   URL: http://localhost:8103/team
   ```

2. **Verify all users:**
   - Total: 3 users
   - Lira (ADMIN, no dept)
   - Buse (HR_SPECIALIST, HR dept)
   - Gizem (MANAGER, Engineering dept)

3. **Verify activity logs:**
   - Lira: Created organization, invited users, reviewed reports
   - Buse: Created job posting, uploaded CVs, ran analysis, scheduled interviews, sent offers
   - Gizem: Reviewed candidates, added notes, conducted interviews, approved offers

4. **Verification Screenshots:**
   - `54-lira-team-overview.png`

**Test Checklist:**
- [ ] All 3 users visible
- [ ] Roles correct
- [ ] Departments correct
- [ ] Activity logs visible (if feature exists)

### 10.3 Billing & Usage Final Check (Lira)
**Goal:** Verify usage tracking updated correctly

**Steps:**
1. **Navigate to Billing**
   ```
   URL: http://localhost:8103/settings/billing
   ```

2. **Verify usage:**
   - Analyses: `1 / 50` ✅
   - CVs: `5 / 200` ✅
   - Users: `3 / 10` ✅

3. **Verification Screenshots:**
   - `55-lira-billing-final.png`

**Database Check:**
```bash
# Check usage tracking
docker exec -it ikai-postgres psql -U ikaiuser -d ikaidb -c "
  SELECT
    org.name,
    org.plan,
    org.max_analyses,
    org.max_cvs,
    org.max_users,
    (SELECT COUNT(*) FROM analyses WHERE organization_id = org.id) as analyses_used,
    (SELECT COUNT(*) FROM candidates WHERE organization_id = org.id) as cvs_used,
    (SELECT COUNT(*) FROM users WHERE organization_id = org.id) as users_count
  FROM organizations org
  WHERE org.name = 'Ajans İK';
"
```

**Expected Results:**
- ✅ analyses_used: 1
- ✅ cvs_used: 5
- ✅ users_count: 3

**Test Checklist:**
- [ ] Billing page shows correct usage
- [ ] Database usage counts match
- [ ] Usage indicators updated throughout test

---

## 📊 FINAL DATABASE VERIFICATION

### Complete Database Audit
**Goal:** Verify ALL test data in database

```bash
# Run comprehensive database check
docker exec -it ikai-postgres psql -U ikaiuser -d ikaidb << 'EOF'

\echo '========================================='
\echo 'FINAL DATABASE VERIFICATION - AJANS İK'
\echo '========================================='

\echo ''
\echo '1. ORGANIZATION:'
SELECT id, name, plan, max_analyses, max_cvs, max_users
FROM organizations
WHERE name = 'Ajans İK';

\echo ''
\echo '2. USERS (3 expected):'
SELECT id, email, role, department
FROM users
WHERE organization_id = (SELECT id FROM organizations WHERE name = 'Ajans İK')
ORDER BY created_at;

\echo ''
\echo '3. JOB POSTINGS (1 expected):'
SELECT id, title, department, status
FROM job_postings
WHERE organization_id = (SELECT id FROM organizations WHERE name = 'Ajans İK');

\echo ''
\echo '4. CANDIDATES (5 expected):'
SELECT id, first_name, last_name, status, department
FROM candidates
WHERE organization_id = (SELECT id FROM organizations WHERE name = 'Ajans İK')
ORDER BY created_at;

\echo ''
\echo '5. ANALYSES (1 expected):'
SELECT id, job_posting_id, status, total_candidates
FROM analyses
WHERE organization_id = (SELECT id FROM organizations WHERE name = 'Ajans İK');

\echo ''
\echo '6. ANALYSIS RESULTS (5 expected):'
SELECT ar.id, c.first_name, c.last_name, ar.match_score, ar.rank
FROM analysis_results ar
JOIN candidates c ON ar.candidate_id = c.id
WHERE ar.analysis_id = (SELECT id FROM analyses WHERE organization_id = (SELECT id FROM organizations WHERE name = 'Ajans İK') LIMIT 1)
ORDER BY ar.rank;

\echo ''
\echo '7. INTERVIEWS (3 expected):'
SELECT i.id, c.first_name, c.last_name, i.status, i.overall_rating, i.recommendation
FROM interviews i
JOIN candidates c ON i.candidate_id = c.id
WHERE i.organization_id = (SELECT id FROM organizations WHERE name = 'Ajans İK')
ORDER BY i.interview_date;

\echo ''
\echo '8. OFFERS (4 expected):'
SELECT o.id, c.first_name, c.last_name, o.salary, o.status
FROM offers o
JOIN candidates c ON o.candidate_id = c.id
WHERE o.organization_id = (SELECT id FROM organizations WHERE name = 'Ajans İK')
ORDER BY o.sent_at;

\echo ''
\echo '9. OFFER STATUS SUMMARY:'
SELECT status, COUNT(*)
FROM offers
WHERE organization_id = (SELECT id FROM organizations WHERE name = 'Ajans İK')
GROUP BY status;

\echo ''
\echo '10. ACTIVITY LOGS (sample - last 10):'
SELECT id, user_id, action, entity_type, created_at
FROM activity_logs
WHERE organization_id = (SELECT id FROM organizations WHERE name = 'Ajans İK')
ORDER BY created_at DESC
LIMIT 10;

\echo ''
\echo '========================================='
\echo 'VERIFICATION COMPLETE'
\echo '========================================='

EOF
```

**Expected Summary:**
```
✅ Organization: 1 (Ajans İK, PRO plan)
✅ Users: 3 (Lira, Buse, Gizem)
✅ Job Postings: 1 (Senior Backend Developer)
✅ Candidates: 5
✅ Analyses: 1 (completed)
✅ Analysis Results: 5 (ranked)
✅ Interviews: 3 (all completed with feedback)
✅ Offers: 4 (2 accepted, 2 rejected)
✅ Activity Logs: Multiple entries
```

---

## 📸 FINAL SCREENSHOTS CHECKLIST

**Total Screenshots:** ~55 expected

### Registration & Setup (10)
- [ ] 01-registration-form.png
- [ ] 02-registration-success.png
- [ ] 03-email-verification.png
- [ ] 04-superadmin-orgs-list.png
- [ ] 05-superadmin-org-edit.png
- [ ] 06-superadmin-plan-updated.png
- [ ] 07-lira-first-login.png
- [ ] 08-lira-dashboard.png
- [ ] 09-org-settings-before.png
- [ ] 10-org-settings-after.png

### Team Building (7)
- [ ] 11-billing-overview.png
- [ ] 12-invite-buse-form.png
- [ ] 13-invite-buse-email.png
- [ ] 14-buse-set-password.png
- [ ] 15-buse-first-login.png
- [ ] 16-invite-gizem-form.png
- [ ] 17-gizem-first-login.png

### Job & CV (9)
- [ ] 18-buse-job-postings-empty.png
- [ ] 19-buse-job-form.png
- [ ] 20-buse-job-created.png
- [ ] 21-candidates-empty.png
- [ ] 22-cv-upload-progress.png
- [ ] 23-candidates-list-5.png
- [ ] 24-wizard-step1-job.png
- [ ] 25-wizard-step2-cvs.png
- [ ] 26-wizard-step3-confirm.png

### Analysis (6)
- [ ] 27-analysis-processing.png
- [ ] 28-analysis-completed.png
- [ ] 29-analysis-results.png
- [ ] 30-ai-chat-interface.png
- [ ] 31-ai-chat-responses.png
- [ ] 32-gizem-dashboard.png

### Candidate Review (3)
- [ ] 33-gizem-candidates-dept-filtered.png
- [ ] 34-gizem-analysis-results.png
- [ ] 35-gizem-candidate-notes.png

### Interviews (6)
- [ ] 36-buse-schedule-interview-form.png
- [ ] 37-buse-interview-email.png
- [ ] 38-buse-interviews-list.png
- [ ] 39-gizem-interviews-list.png
- [ ] 40-gizem-interview-feedback.png
- [ ] 41-gizem-interview-completed.png

### Offers (8)
- [ ] 42-buse-offer-form.png
- [ ] 43-buse-offer-email.png
- [ ] 44-buse-offers-list.png
- [ ] 45-buse-offer-accepted.png
- [ ] 46-buse-offer-rejected.png
- [ ] 47-buse-offer-candidate3.png
- [ ] 48-buse-offer-rejected2.png
- [ ] 49-buse-offer-candidate4.png

### Final Verification (6)
- [ ] 50-buse-offer-accepted2.png
- [ ] 51-lira-dashboard-final.png
- [ ] 52-lira-analytics-final.png
- [ ] 53-lira-reports-final.png
- [ ] 54-lira-team-overview.png
- [ ] 55-lira-billing-final.png

---

## 📋 FINAL REPORT TEMPLATE

### Executive Summary
```
TEST: Full-Cycle Clean Slate Test
ORGANIZATION: Ajans İK
DURATION: {X hours}
WORKER: W7
DATE: {Date}

OVERALL STATUS: ✅ PASS or ❌ FAIL

KEY METRICS:
- Users Created: 3/3 ✅
- Job Postings: 1/1 ✅
- CVs Uploaded: 5/5 ✅
- Analyses: 1/1 ✅
- Interviews: 3/3 ✅
- Offers Sent: 4/4 ✅
- Offers Accepted: 2/2 ✅
- Console Errors: {X}
- Database Verified: ✅
```

### Phase Results
```
Phase 1: Registration ✅ PASS
Phase 2: SUPER_ADMIN Approval ✅ PASS
Phase 3: ADMIN Setup ✅ PASS
Phase 4: Team Building ✅ PASS
Phase 5: Job Posting ✅ PASS
Phase 6: CV & Analysis ✅ PASS
Phase 7: Candidate Review ✅ PASS
Phase 8: Interviews ✅ PASS
Phase 9: Offers ✅ PASS
Phase 10: Final Verification ✅ PASS
```

### Issues Found
```
CRITICAL ISSUES: {X}
1. [Description]
2. [Description]

HIGH ISSUES: {X}
1. [Description]

MEDIUM ISSUES: {X}
1. [Description]

LOW ISSUES: {X}
1. [Description]
```

### Database Verification
```
✅ All expected records created
✅ No orphaned records
✅ Usage tracking correct
✅ Foreign key integrity maintained
```

### Recommendations
```
1. [Improvement suggestion]
2. [Feature idea]
3. [Bug fix priority]
```

---

## ✅ SUCCESS CRITERIA

**Test passes if ALL of the following are true:**

### Critical Criteria (Must Pass)
- [ ] ✅ User registration works
- [ ] ✅ Email verification works
- [ ] ✅ Organization created automatically
- [ ] ✅ SUPER_ADMIN can manage organization
- [ ] ✅ ADMIN can invite users
- [ ] ✅ All 3 users can login
- [ ] ✅ Job posting creation works
- [ ] ✅ CV upload works (5 files)
- [ ] ✅ Analysis wizard completes successfully
- [ ] ✅ Analysis results display correctly
- [ ] ✅ AI Chat works
- [ ] ✅ Interview scheduling works
- [ ] ✅ Interview feedback can be added
- [ ] ✅ Offers can be sent
- [ ] ✅ Offer status can be changed (Accept/Reject)
- [ ] ✅ Dashboard metrics correct
- [ ] ✅ Usage tracking correct (1/50, 5/200, 3/10)
- [ ] ✅ Console errors: 0
- [ ] ✅ Database records match expected

### High Priority
- [ ] ✅ Email delivery (all 6+ emails received)
- [ ] ✅ RBAC working (dept filtering for MANAGER)
- [ ] ✅ Analytics display correct data
- [ ] ✅ Export works

### Medium Priority
- [ ] ⚠️ Page load times < 2s
- [ ] ⚠️ All forms validate correctly
- [ ] ⚠️ Toast messages appear

---

## 🎯 DELIVERABLES

### Final Deliverables:
1. **Test Report:** `docs/reports/MASTER-WORKER-FULL-CYCLE-RESULTS.md`
2. **Screenshots:** `screenshots/full-cycle/` (55 files)
3. **Database Export:** `test-outputs/ajansik-final-db-export.sql`
4. **Console Log:** `test-outputs/w7-full-cycle-console.log`
5. **Email Screenshots:** `screenshots/emails/` (6 emails)

---

## 🚀 POST-TEST ACTIONS

**After test completes:**

### 1. Database Backup
```bash
# Export Ajans İK data for reference
docker exec -it ikai-postgres pg_dump -U ikaiuser -d ikaidb \
  --data-only \
  --table=organizations \
  --table=users \
  --table=job_postings \
  --table=candidates \
  --table=analyses \
  --table=analysis_results \
  --table=interviews \
  --table=offers \
  > test-outputs/ajansik-final-db-export.sql
```

### 2. Keep Test Data (Optional)
```bash
# If you want to keep this data for demo purposes, skip cleanup
# This data can serve as sample data for future demos
```

### 3. Or Clean Up (Optional)
```bash
# If you want to clean up after test
docker exec -it ikai-postgres psql -U ikaiuser -d ikaidb -c "
  DELETE FROM activity_logs WHERE organization_id = (SELECT id FROM organizations WHERE name = 'Ajans İK');
  DELETE FROM offers WHERE organization_id = (SELECT id FROM organizations WHERE name = 'Ajans İK');
  DELETE FROM interviews WHERE organization_id = (SELECT id FROM organizations WHERE name = 'Ajans İK');
  DELETE FROM analysis_results WHERE analysis_id IN (SELECT id FROM analyses WHERE organization_id = (SELECT id FROM organizations WHERE name = 'Ajans İK'));
  DELETE FROM analysis_chat_history WHERE analysis_id IN (SELECT id FROM analyses WHERE organization_id = (SELECT id FROM organizations WHERE name = 'Ajans İK'));
  DELETE FROM analyses WHERE organization_id = (SELECT id FROM organizations WHERE name = 'Ajans İK');
  DELETE FROM candidate_notes WHERE candidate_id IN (SELECT id FROM candidates WHERE organization_id = (SELECT id FROM organizations WHERE name = 'Ajans İK'));
  DELETE FROM candidates WHERE organization_id = (SELECT id FROM organizations WHERE name = 'Ajans İK');
  DELETE FROM job_postings WHERE organization_id = (SELECT id FROM organizations WHERE name = 'Ajans İK');
  DELETE FROM users WHERE organization_id = (SELECT id FROM organizations WHERE name = 'Ajans İK');
  DELETE FROM organizations WHERE name = 'Ajans İK';
"
```

---

## 📖 WORKER INSTRUCTIONS

**Master Worker (W7 or experienced):**

### Before Starting:
1. Read this document completely (1,100+ lines)
2. Understand all 10 phases
3. Prepare email account (mustafaasan91@gmail.com access)
4. Clean database (Step 0)
5. Verify backend + frontend running
6. Open browser DevTools (F12) for console monitoring

### During Test:
1. Follow phases sequentially (1→2→3→...→10)
2. Take screenshots at EVERY step
3. Check mustafaasan91@gmail.com when expecting emails
4. Pause when instructed (email checks)
5. Run database checks after each phase
6. Monitor console for errors (0 expected!)
7. Document any issues found

### After Test:
1. Compile final report
2. Organize screenshots
3. Export database
4. Verify all deliverables
5. Submit to MOD for review

**Estimated Time:** 8-12 hours (1 full work day)

---

**END OF MASTER WORKER TASK DOCUMENT**

*Total Lines: 1,867*
*Created: 2025-11-05*
*Version: 1.0*
*AsanMod v17.0 - Full-Cycle Clean Slate Test*
