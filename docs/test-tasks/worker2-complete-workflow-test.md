# 🧪 Worker #2 - Complete HR Workflow Test (Analysis → Offer → Interview)

**Task ID:** worker2-complete-workflow-test
**Assigned To:** Worker #2
**Created By:** Master Claude (Mod)
**Date:** 2025-11-04
**Priority:** HIGH
**Estimated Time:** 90-120 minutes

---

## 🎯 Objective

Test the **COMPLETE HR workflow** using real test data (30 CVs, 6 job postings, 3 organizations). Verify:
- ✅ CV upload & analysis (match scoring)
- ✅ Offer generation & management
- ✅ Interview scheduling & tracking
- ✅ Multi-tenant data isolation
- ✅ Role-based access control
- ✅ Usage limits (plan-based)

**Real-world simulation:** Org 1 (FREE) hires Frontend Developer, Org 2 (PRO) hires Healthcare Analyst, Org 3 (ENTERPRISE) hires Financial Analyst.

---

## 📋 Background

### Test Data Available
- **30 CVs:** 5 match levels per job posting (High/Good/Medium/Low/Poor)
- **6 Job Postings:** 2 per organization (Turkish)
- **3 Organizations:** FREE (Org 1), PRO (Org 2), ENTERPRISE (Org 3)
- **12 Test Users:** 4 roles × 3 orgs (ADMIN, MANAGER, HR_SPECIALIST, USER)
- **Location:** `/home/asan/Desktop/ikai/test-data/`

### System Components to Test
- **Backend:** Analysis, Offer, Interview APIs
- **Queue System:** BullMQ workers (analysisWorker, offerWorker, emailWorker)
- **AI Integration:** Gemini CV analysis with chunking (batch size: 6)
- **Database:** Multi-tenant isolation (organizationId filtering)
- **Middleware:** RBAC (authorize + organizationIsolation)

---

## 🔑 Test Accounts

| Org | Plan | HR User | Password | Use Case |
|-----|------|---------|----------|----------|
| **Org 1** | FREE | test-hr_specialist@test-org-1.com | TestPass123! | Junior Frontend Developer |
| **Org 2** | PRO | test-hr_specialist@test-org-2.com | TestPass123! | Healthcare Data Analyst |
| **Org 3** | ENTERPRISE | test-admin@test-org-3.com | TestPass123! | Senior Financial Analyst |

---

## 🧪 Test Scenarios

### Scenario 1: Org 1 (FREE) - Junior Frontend Developer Hiring

**Goal:** Hire 1 frontend developer from 5 CVs, verify FREE plan limits

**Actors:**
- HR Specialist (test-hr_specialist@test-org-1.com)
- Job Posting: Junior Frontend Developer
- CVs: 5 (test-data/cvs/org1-junior-frontend-developer/)

**Expected Outcome:**
- ✅ High match CV (AHMET YILMAZ) → Offer → Interview
- ✅ Good match CV (AYŞE KAYA) → Maybe (reserve)
- ✅ Medium/Low/Poor → Reject
- ✅ Usage tracking (1 analysis, 5 CVs counted)

---

### Scenario 2: Org 2 (PRO) - Healthcare Data Analyst Hiring

**Goal:** Hire 1 healthcare analyst, test PRO plan features

**Actors:**
- HR Specialist (test-hr_specialist@test-org-2.com)
- Job Posting: Healthcare Data Analyst
- CVs: 5 (test-data/cvs/org2-healthcare-data-analyst/)

**Expected Outcome:**
- ✅ High match CV (DR. ELİF DEMİR) → Offer → Interview → Hire
- ✅ Good match CV (AHMET YÜKSEL) → Interview (backup)
- ✅ PRO features (50 analyses/month, email notifications)

---

### Scenario 3: Org 3 (ENTERPRISE) - Senior Financial Analyst Hiring

**Goal:** Hire 1 financial analyst, test ENTERPRISE unlimited features

**Actors:**
- Admin (test-admin@test-org-3.com)
- Job Posting: Senior Financial Analyst
- CVs: 5 (test-data/cvs/org3-senior-financial-analyst/)

**Expected Outcome:**
- ✅ High match CV (EMRE BAŞARAN, CFA) → Fast-track → Offer → Interview
- ✅ ENTERPRISE unlimited usage
- ✅ Advanced analytics

---

## ✅ Task Checklist

### Phase 1: Setup & Preparation (15 min)

#### Task 1.1: Backend & Queue Health Check

```bash
# Backend health
curl -s http://localhost:8102/health | jq

# Check BullMQ workers
docker logs ikai-backend --tail 50 | grep "worker started"

# Check Redis
docker exec ikai-redis redis-cli ping

# Expected: PONG
```

**Verification:**
- ✅ Backend healthy
- ✅ 5 workers running (analysis, offer, email, test, feedback)
- ✅ Redis accessible

---

#### Task 1.2: Verify Test Data Files

```bash
# Count CVs
find test-data/cvs/ -name "*.txt" | wc -l
# Expected: 30

# Count job postings (Turkish)
ls -1 test-data/job-postings-turkish/*.txt | wc -l
# Expected: 6

# Verify email in all CVs
grep -r "mustafaasan91@gmail.com" test-data/cvs/ | wc -l
# Expected: 30
```

**Verification:**
- ✅ 30 CVs exist
- ✅ 6 Turkish job postings exist
- ✅ All CVs have correct email/phone

---

#### Task 1.3: Database State Check

```bash
# Check organizations
docker exec ikai-backend node -e "
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
(async () => {
  const orgs = await prisma.organization.count();
  console.log('Organizations:', orgs);
  await prisma.\$disconnect();
})()
"

# Check test users
docker exec ikai-backend node -e "
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
(async () => {
  const users = await prisma.user.count({ where: { email: { contains: 'test-' } } });
  console.log('Test users:', users);
  await prisma.\$disconnect();
})()
"
```

**Expected:**
- Organizations: >= 3
- Test users: >= 12

---

### Phase 2: Org 1 (FREE) - Complete Workflow (30 min)

#### Task 2.1: Login as Org 1 HR Specialist

```python
python3 -i scripts/test-helper.py

# Login
helper = IKAITestHelper()
helper.login('test-hr_specialist@test-org-1.com', 'TestPass123!')
print("✅ Logged in as Org 1 HR Specialist")
```

---

#### Task 2.2: Get Job Posting ID (Junior Frontend Developer)

```python
# Get all job postings for Org 1
job_postings = helper.get('/api/v1/job-postings')
print(f"Total job postings: {len(job_postings)}")

# Find Junior Frontend Developer
frontend_job = [jp for jp in job_postings if 'Frontend' in jp['title']][0]
job_id = frontend_job['id']
print(f"Job ID: {job_id}")
print(f"Job Title: {frontend_job['title']}")

# Save for later use
```

**Expected:**
- ✅ 2 job postings visible (Org 1 only)
- ✅ Junior Frontend Developer found

---

#### Task 2.3: Upload 5 CVs for Analysis

```python
# CV files
cv_folder = 'test-data/cvs/org1-junior-frontend-developer/'
cv_files = [
    'cv-01-high-match.txt',
    'cv-02-good-match.txt',
    'cv-03-medium-match.txt',
    'cv-04-low-match.txt',
    'cv-05-poor-match.txt'
]

# Upload each CV
import requests
import os

analysis_ids = []

for cv_file in cv_files:
    file_path = os.path.join(cv_folder, cv_file)

    with open(file_path, 'rb') as f:
        files = {'file': (cv_file, f, 'text/plain')}
        data = {'jobPostingId': job_id}

        response = requests.post(
            'http://localhost:8102/api/v1/analyses',
            headers={'Authorization': f'Bearer {helper.token}'},
            files=files,
            data=data
        )

        if response.status_code == 201:
            result = response.json()
            analysis_ids.append(result['id'])
            print(f"✅ Uploaded {cv_file} → Analysis ID: {result['id']}")
        else:
            print(f"❌ Failed to upload {cv_file}: {response.status_code}")
            print(response.text)

print(f"\nTotal analyses created: {len(analysis_ids)}")
```

**Expected:**
- ✅ 5 CVs uploaded successfully
- ✅ 5 analysis IDs returned
- ✅ Status: PENDING (queued for processing)

---

#### Task 2.4: Wait for Analysis Queue Processing

```python
import time

print("⏳ Waiting for analysis queue to process (estimated: 30-60 seconds)...")
time.sleep(60)

# Check analysis status
for analysis_id in analysis_ids:
    analysis = helper.get(f'/api/v1/analyses/{analysis_id}')
    print(f"Analysis {analysis_id[:8]}... → Status: {analysis['status']}")
```

**Expected:**
- ✅ All statuses: COMPLETED (not PENDING, not FAILED)
- ⏱️ Processing time: ~50-70 seconds (5 CVs, batch size 6)

---

#### Task 2.5: Review Analysis Results & Match Scores

```python
# Get all analyses for this job
analyses = helper.get(f'/api/v1/analyses?jobPostingId={job_id}')

print(f"\n📊 Analysis Results for {frontend_job['title']}:")
print(f"Total analyses: {len(analyses)}")
print()

# Sort by match score
analyses_sorted = sorted(analyses, key=lambda a: a.get('matchScore', 0), reverse=True)

for a in analyses_sorted:
    candidate = a.get('candidate', {})
    match_score = a.get('matchScore', 'N/A')
    print(f"  - {candidate.get('name', 'Unknown')} → Match: {match_score}%")
    print(f"    Status: {a['status']} | CV: {candidate.get('cvUrl', 'N/A')[:30]}...")
```

**Expected Results:**

| CV File | Candidate Name | Expected Match Score | Status |
|---------|----------------|----------------------|--------|
| cv-01-high-match | AHMET YILMAZ | 90-100% | COMPLETED |
| cv-02-good-match | AYŞE KAYA | 70-80% | COMPLETED |
| cv-03-medium-match | MEHMET DEMİR | 50-60% | COMPLETED |
| cv-04-low-match | FATİH YILDIRIM | 30-40% | COMPLETED |
| cv-05-poor-match | ZEYNEP ARSLAN | 10-20% | COMPLETED |

**Verification:**
- ✅ Match scores align with CV quality
- ✅ High match CV has highest score
- ✅ Poor match CV has lowest score

---

#### Task 2.6: Create Offer for High Match Candidate

```python
# Get best candidate (AHMET YILMAZ)
best_analysis = analyses_sorted[0]
candidate_id = best_analysis['candidateId']
candidate_name = best_analysis['candidate']['name']

print(f"\n📄 Creating offer for {candidate_name}...")

# Create offer
offer_data = {
    "candidateId": candidate_id,
    "jobPostingId": job_id,
    "offerDate": "2025-11-10",
    "salary": 45000,
    "currency": "TRY",
    "startDate": "2025-12-01",
    "notes": "Competitive offer for junior frontend developer position"
}

offer = helper.post('/api/v1/offers', offer_data)
print(f"✅ Offer created: ID {offer['id']}")
print(f"   Salary: {offer['salary']} {offer['currency']}")
print(f"   Start Date: {offer['startDate']}")

offer_id = offer['id']
```

**Expected:**
- ✅ Offer created successfully
- ✅ Status: PENDING (awaiting candidate response)

---

#### Task 2.7: Schedule Interview for High Match Candidate

```python
# Schedule interview
interview_data = {
    "candidateId": candidate_id,
    "jobPostingId": job_id,
    "scheduledAt": "2025-11-08T14:00:00Z",
    "interviewType": "TECHNICAL",
    "location": "Istanbul Office - Meeting Room 2",
    "notes": "Technical interview - React + TypeScript focus"
}

interview = helper.post('/api/v1/interviews', interview_data)
print(f"\n📅 Interview scheduled: ID {interview['id']}")
print(f"   Type: {interview['interviewType']}")
print(f"   Date: {interview['scheduledAt']}")
print(f"   Location: {interview['location']}")

interview_id = interview['id']
```

**Expected:**
- ✅ Interview created successfully
- ✅ Status: SCHEDULED

---

#### Task 2.8: Update Interview Status (Simulate Interview Completion)

```python
# Complete interview
interview_update = {
    "status": "COMPLETED",
    "feedback": "Strong React and TypeScript skills. Good problem-solving. Team fit: excellent. Recommendation: HIRE",
    "rating": 9
}

updated_interview = helper.put(f'/api/v1/interviews/{interview_id}', interview_update)
print(f"\n✅ Interview completed:")
print(f"   Status: {updated_interview['status']}")
print(f"   Rating: {updated_interview['rating']}/10")
print(f"   Feedback: {updated_interview['feedback'][:50]}...")
```

---

#### Task 2.9: Update Offer Status (Accept Offer)

```python
# Accept offer
offer_update = {
    "status": "ACCEPTED",
    "responseDate": "2025-11-11"
}

updated_offer = helper.put(f'/api/v1/offers/{offer_id}', offer_update)
print(f"\n🎉 Offer accepted!")
print(f"   Status: {updated_offer['status']}")
print(f"   Response Date: {updated_offer['responseDate']}")
```

---

#### Task 2.10: Verify Org 1 Usage Tracking (FREE Plan Limits)

```python
# Get current usage
usage = helper.get('/api/v1/organizations/usage')

print(f"\n📊 Org 1 (FREE) Usage:")
print(f"   Analyses: {usage['analysisCount']}/{usage['maxAnalysisPerMonth']}")
print(f"   CVs: {usage['cvCount']}/{usage['maxCvPerMonth']}")
print(f"   Users: {usage['userCount']}/{usage['maxUsers']}")

# Check if limits are respected
if usage['analysisCount'] <= usage['maxAnalysisPerMonth']:
    print("✅ Analysis limit OK")
else:
    print("❌ Analysis limit exceeded!")
```

**Expected (FREE plan):**
- Analysis: 1/10
- CVs: 5/50
- Users: 4/2 (might exceed, but existing users OK)

---

### Phase 3: Org 2 (PRO) - Healthcare Analyst Hiring (25 min)

#### Task 3.1: Login as Org 2 HR Specialist

```python
# Logout from Org 1
helper.logout()

# Login to Org 2
helper.login('test-hr_specialist@test-org-2.com', 'TestPass123!')
print("✅ Logged in as Org 2 HR Specialist")
```

---

#### Task 3.2: Upload Healthcare Data Analyst CVs

```python
# Get job posting
job_postings = helper.get('/api/v1/job-postings')
healthcare_job = [jp for jp in job_postings if 'Healthcare' in jp['title'] and 'Data' in jp['title']][0]
job_id = healthcare_job['id']

print(f"Job: {healthcare_job['title']}")

# Upload 5 CVs
cv_folder = 'test-data/cvs/org2-healthcare-data-analyst/'
cv_files = [
    'cv-01-high-match.txt',
    'cv-02-good-match.txt',
    'cv-03-medium-match.txt',
    'cv-04-low-match.txt',
    'cv-05-poor-match.txt'
]

analysis_ids_org2 = []

for cv_file in cv_files:
    file_path = os.path.join(cv_folder, cv_file)

    with open(file_path, 'rb') as f:
        files = {'file': (cv_file, f, 'text/plain')}
        data = {'jobPostingId': job_id}

        response = requests.post(
            'http://localhost:8102/api/v1/analyses',
            headers={'Authorization': f'Bearer {helper.token}'},
            files=files,
            data=data
        )

        if response.status_code == 201:
            result = response.json()
            analysis_ids_org2.append(result['id'])
            print(f"✅ Uploaded {cv_file}")

print(f"\nTotal analyses: {len(analysis_ids_org2)}")

# Wait for processing
print("⏳ Waiting 60 seconds...")
time.sleep(60)
```

---

#### Task 3.3: Select Top 2 Candidates & Schedule Interviews

```python
# Get analyses
analyses = helper.get(f'/api/v1/analyses?jobPostingId={job_id}')
analyses_sorted = sorted(analyses, key=lambda a: a.get('matchScore', 0), reverse=True)

# Top 2 candidates
top_candidates = analyses_sorted[:2]

interview_ids_org2 = []

for i, analysis in enumerate(top_candidates, 1):
    candidate = analysis['candidate']
    candidate_id = analysis['candidateId']

    print(f"\n{i}. {candidate['name']} → Match: {analysis.get('matchScore')}%")

    # Schedule interview
    interview_data = {
        "candidateId": candidate_id,
        "jobPostingId": job_id,
        "scheduledAt": f"2025-11-0{7+i}T10:00:00Z",
        "interviewType": "TECHNICAL" if i == 1 else "HR",
        "location": "Ankara Office",
        "notes": f"Interview with candidate {i}"
    }

    interview = helper.post('/api/v1/interviews', interview_data)
    interview_ids_org2.append(interview['id'])
    print(f"   ✅ Interview scheduled: {interview['scheduledAt']}")
```

---

#### Task 3.4: Create Offer for Best Candidate

```python
# Best candidate
best_candidate = analyses_sorted[0]
candidate_id = best_candidate['candidateId']

# Create offer
offer_data = {
    "candidateId": candidate_id,
    "jobPostingId": job_id,
    "offerDate": "2025-11-12",
    "salary": 85000,
    "currency": "TRY",
    "startDate": "2025-12-15",
    "notes": "Senior healthcare data analyst - Dr. Elif Demir"
}

offer = helper.post('/api/v1/offers', offer_data)
print(f"\n✅ Offer created for {best_candidate['candidate']['name']}")
print(f"   Salary: {offer['salary']} {offer['currency']}")
```

---

### Phase 4: Org 3 (ENTERPRISE) - Financial Analyst Hiring (20 min)

#### Task 4.1: Login as Org 3 Admin

```python
helper.logout()
helper.login('test-admin@test-org-3.com', 'TestPass123!')
print("✅ Logged in as Org 3 Admin (ENTERPRISE)")
```

---

#### Task 4.2: Upload Financial Analyst CVs

```python
# Get job posting
job_postings = helper.get('/api/v1/job-postings')
finance_job = [jp for jp in job_postings if 'Financial' in jp['title']][0]
job_id = finance_job['id']

# Upload CVs
cv_folder = 'test-data/cvs/org3-senior-financial-analyst/'
cv_files = [
    'cv-01-high-match.txt',
    'cv-02-good-match.txt',
    'cv-03-medium-match.txt'
]

# Upload only top 3 (ENTERPRISE fast hiring)
analysis_ids_org3 = []

for cv_file in cv_files:
    file_path = os.path.join(cv_folder, cv_file)

    with open(file_path, 'rb') as f:
        files = {'file': (cv_file, f, 'text/plain')}
        data = {'jobPostingId': job_id}

        response = requests.post(
            'http://localhost:8102/api/v1/analyses',
            headers={'Authorization': f'Bearer {helper.token}'},
            files=files,
            data=data
        )

        if response.status_code == 201:
            result = response.json()
            analysis_ids_org3.append(result['id'])
            print(f"✅ Uploaded {cv_file}")

print("⏳ Waiting 60 seconds...")
time.sleep(60)
```

---

#### Task 4.3: Fast-Track Hiring (Offer + Interview Same Day)

```python
# Get best candidate
analyses = helper.get(f'/api/v1/analyses?jobPostingId={job_id}')
best_analysis = sorted(analyses, key=lambda a: a.get('matchScore', 0), reverse=True)[0]
candidate_id = best_analysis['candidateId']

print(f"\n🚀 Fast-track hiring: {best_analysis['candidate']['name']}")
print(f"   Match Score: {best_analysis.get('matchScore')}%")

# Create offer
offer_data = {
    "candidateId": candidate_id,
    "jobPostingId": job_id,
    "offerDate": "2025-11-05",
    "salary": 180000,
    "currency": "TRY",
    "startDate": "2025-11-20",
    "notes": "CFA charter holder - competitive package"
}

offer = helper.post('/api/v1/offers', offer_data)
print(f"✅ Offer: {offer['salary']} TRY")

# Schedule interview (same week)
interview_data = {
    "candidateId": candidate_id,
    "jobPostingId": job_id,
    "scheduledAt": "2025-11-06T09:00:00Z",
    "interviewType": "PANEL",
    "location": "Istanbul HQ - Executive Floor",
    "notes": "Panel interview with CFO and Finance Director"
}

interview = helper.post('/api/v1/interviews', interview_data)
print(f"✅ Interview: {interview['scheduledAt']}")
```

---

### Phase 5: Cross-Org Verification & Data Isolation (15 min)

#### Task 5.1: Verify SUPER_ADMIN Can See All Data

```python
# Login as SUPER_ADMIN
helper.logout()
helper.login('info@gaiai.ai', '23235656')

print("\n🔐 SUPER_ADMIN Cross-Org Check:")

# Job postings
all_jobs = helper.get('/api/v1/job-postings')
print(f"  Job Postings: {len(all_jobs)} (expected: 6)")

# Analyses
all_analyses = helper.get('/api/v1/analyses')
print(f"  Analyses: {len(all_analyses)} (expected: ~13)")

# Offers
all_offers = helper.get('/api/v1/offers')
print(f"  Offers: {len(all_offers)} (expected: 3)")

# Interviews
all_interviews = helper.get('/api/v1/interviews')
print(f"  Interviews: {len(all_interviews)} (expected: ~4)")

# Verify unique org IDs
org_ids_jobs = set(j['organizationId'] for j in all_jobs)
print(f"  Unique Orgs (jobs): {len(org_ids_jobs)} (expected: 3)")
```

**Expected:**
- ✅ SUPER_ADMIN sees data from all 3 orgs
- ✅ No 403 errors

---

#### Task 5.2: Verify Org Isolation (Org 1 Cannot See Org 2 Data)

```python
# Login as Org 1 HR
helper.login('test-hr_specialist@test-org-1.com', 'TestPass123!')

org1_jobs = helper.get('/api/v1/job-postings')
org1_analyses = helper.get('/api/v1/analyses')
org1_offers = helper.get('/api/v1/offers')

print(f"\n🔒 Org 1 Isolation Check:")
print(f"  Job Postings: {len(org1_jobs)} (expected: 2)")
print(f"  Analyses: {len(org1_analyses)} (expected: 5)")
print(f"  Offers: {len(org1_offers)} (expected: 1)")

# Check org IDs
org_ids = set(j['organizationId'] for j in org1_jobs)
print(f"  Unique Orgs: {len(org_ids)} (expected: 1)")

if len(org_ids) == 1:
    print("✅ Data isolation working!")
else:
    print("❌ DATA LEAK! Seeing other orgs' data!")
```

---

### Phase 6: Queue & Email System (10 min)

#### Task 6.1: Check Queue Job Status

```bash
# Check Redis queue stats
docker exec ikai-redis redis-cli --scan --pattern "bull:*:*" | head -20

# Check for failed jobs
docker logs ikai-backend --tail 200 | grep -i "failed" || echo "No failures"

# Check analysis worker logs
docker logs ikai-backend --tail 100 | grep "analysisWorker"
```

---

#### Task 6.2: Verify Email Queue (if configured)

```python
# Check if emails were queued
# Note: In test environment, emails may not actually send

print("\n📧 Email Queue Check:")
print("  (Check Docker logs for email worker activity)")
```

---

## 📊 Success Criteria

### Critical (Must Pass)

**Org 1 (FREE):**
- ✅ 5 CVs uploaded & analyzed
- ✅ Match scores: High (90-100%) → Poor (10-20%)
- ✅ 1 Offer created (high match candidate)
- ✅ 1 Interview scheduled & completed
- ✅ Usage tracking accurate (1 analysis, 5 CVs)

**Org 2 (PRO):**
- ✅ 5 CVs analyzed
- ✅ 2 Interviews scheduled (top 2 candidates)
- ✅ 1 Offer created
- ✅ PRO limits not exceeded

**Org 3 (ENTERPRISE):**
- ✅ 3 CVs analyzed (fast hiring)
- ✅ 1 Fast-track offer + interview
- ✅ ENTERPRISE unlimited usage

**Cross-Org:**
- ✅ SUPER_ADMIN sees all 3 orgs' data
- ✅ Org 1 HR cannot see Org 2/3 data
- ✅ Data isolation working (no leaks)

**System:**
- ✅ No queue failures
- ✅ All analyses completed within 2 minutes
- ✅ No 403/500 errors

---

## 📝 Deliverables

### Required: Comprehensive Test Report

**Filename:** `docs/reports/worker2-complete-workflow-test-report.md`

**Required Sections:**
1. **Executive Summary** (Pass/Fail overview)
2. **Org 1 Test Results** (Frontend dev hiring - with RAW outputs)
3. **Org 2 Test Results** (Healthcare analyst hiring - with RAW outputs)
4. **Org 3 Test Results** (Financial analyst hiring - with RAW outputs)
5. **Cross-Org Verification** (SUPER_ADMIN + isolation tests)
6. **Match Score Analysis** (Table: CV → Expected % → Actual %)
7. **Queue Performance** (Processing times)
8. **Issues Found** (if any)
9. **Recommendations**

### Optional
- Screenshots of Python test helper output
- Database query snapshots
- Queue stats

---

## 🚨 Common Issues & Fixes

### Issue 1: Analysis Queue Stuck

**Symptom:** Status stays PENDING after 2+ minutes
**Debug:**
```bash
docker logs ikai-backend --tail 100 | grep "analysisWorker"
docker logs ikai-backend | grep -i "error"
```
**Likely Cause:** Gemini API rate limit, Redis connection issue

---

### Issue 2: Wrong Match Scores

**Symptom:** Poor match CV gets high score (or vice versa)
**Debug:** Check analysis results field, review AI prompt
**Expected:** High match (90-100%), Poor match (10-20%)

---

### Issue 3: Cross-Org Data Leak

**Symptom:** Org 1 sees Org 2 data
**Debug:**
```bash
grep "organizationId" backend/src/middleware/organizationIsolation.js
```
**Fix:** Ensure organizationId filter applied

---

### Issue 4: 403 Errors

**Symptom:** HR_SPECIALIST gets 403 on /api/v1/offers
**Debug:** Check route authorization in backend/src/routes/
**Fix:** Add HR_SPECIALIST to allowed roles

---

## 🎯 AsanMod Rules

**STRICT_MODE Enabled:**
- ❌ NO simulation - Run REAL API calls
- ❌ NO fake data - Use actual test CVs
- ✅ RAW terminal outputs - Copy/paste everything
- ✅ Python test helper - Use scripts/test-helper.py
- ✅ Wait for queue - Don't skip processing delays

**After Each Phase:**
- ✅ Paste RAW Python output to report
- ✅ Note any errors/warnings
- ✅ Verify expected vs actual results

**After Task:**
- ✅ Write comprehensive report
- ✅ Git commit immediately
- ✅ Report to Mod with summary

---

## ⏱️ Estimated Time

**Total: 90-120 minutes**

- Phase 1 (Setup): 15 min
- Phase 2 (Org 1): 30 min
- Phase 3 (Org 2): 25 min
- Phase 4 (Org 3): 20 min
- Phase 5 (Cross-org): 15 min
- Phase 6 (Queue): 10 min
- Report writing: 20-30 min

---

## 📚 Reference Documents

- **Test Data:** [`docs/test-tasks/COMPLETE-TEST-DATA-REFERENCE.md`](COMPLETE-TEST-DATA-REFERENCE.md)
- **Python Helper:** [`scripts/test-helper.py`](../../scripts/test-helper.py)
- **RBAC Strategy:** [`docs/architecture/RBAC-COMPLETE-STRATEGY.md`](../architecture/RBAC-COMPLETE-STRATEGY.md)
- **Queue System:** [`docs/reports/2025-11-02-queue-system-implementation.md`](../reports/2025-11-02-queue-system-implementation.md)

---

**🚀 START: Phase 1, Task 1.1 (Backend Health Check)**

**IMPORTANT:** Use Python test helper for all API calls. Paste RAW outputs to report!
