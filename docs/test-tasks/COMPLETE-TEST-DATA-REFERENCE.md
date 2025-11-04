# 🧪 IKAI - Complete Test Data Reference

**Version:** 1.0
**Created:** 2025-11-04
**Purpose:** Comprehensive reference for all test data (organizations, users, job postings, CVs)
**Usage:** Test scenarios, RBAC testing, API testing, CV analysis testing

---

## 📋 Quick Access

**Test Password (All Users):** `TestPass123!`
**Admin Account:** info@gaiai.ai / 23235656 (SUPER_ADMIN)
**Python Test Helper:** `scripts/test-helper.py`
**Test Data Location:** `/home/asan/Desktop/ikai/test-data/`

---

## 🏢 TEST ORGANIZATIONS (3)

### Organization 1: Test Organization Free

**Details:**
- **ID:** `7ccc7b62-af0c-4161-9231-c36aa06ac6dc`
- **Name:** Test Organization Free
- **Slug:** `test-org-free`
- **Plan:** FREE
- **Industry:** Technology
- **Limits:**
  - Max Analysis/Month: 10
  - Max CV/Month: 50
  - Max Users: 2

**Users:** 4 (ADMIN, MANAGER, HR_SPECIALIST, USER)
**Test Emails:**
- test-admin@test-org-1.com
- test-manager@test-org-1.com
- test-hr_specialist@test-org-1.com
- test-user@test-org-1.com

**Job Postings:** 2
- Junior Frontend Developer
- Software Test Engineer

**CVs:** 10 (5 per job posting)

---

### Organization 2: Test Organization Pro

**Details:**
- **ID:** `e1664ccb-8f41-4221-8aa9-c5028b8ce8ec`
- **Name:** Test Organization Pro
- **Slug:** `test-org-pro`
- **Plan:** PRO
- **Industry:** Healthcare
- **Limits:**
  - Max Analysis/Month: 50
  - Max CV/Month: 200
  - Max Users: 10

**Users:** 4 (ADMIN, MANAGER, HR_SPECIALIST, USER)
**Test Emails:**
- test-admin@test-org-2.com
- test-manager@test-org-2.com
- test-hr_specialist@test-org-2.com
- test-user@test-org-2.com

**Job Postings:** 2
- Healthcare Data Analyst
- Medical Records Specialist

**CVs:** 10 (5 per job posting)

---

### Organization 3: Test Organization Enterprise

**Details:**
- **ID:** `91e5bdd1-5ce6-4fe3-8492-47fdefc3e5d3`
- **Name:** Test Organization Enterprise
- **Slug:** `test-org-enterprise`
- **Plan:** ENTERPRISE
- **Industry:** Finance
- **Limits:**
  - Max Analysis/Month: 200
  - Max CV/Month: 1000
  - Max Users: 50

**Users:** 4 (ADMIN, MANAGER, HR_SPECIALIST, USER)
**Test Emails:**
- test-admin@test-org-3.com
- test-manager@test-org-3.com
- test-hr_specialist@test-org-3.com
- test-user@test-org-3.com

**Job Postings:** 2
- Senior Financial Analyst
- Risk Management Specialist

**CVs:** 10 (5 per job posting)

---

## 👥 TEST USERS (12 + 1 SUPER_ADMIN)

### SUPER_ADMIN (System-Wide Access)

| Email | Password | Name | Organization |
|-------|----------|------|--------------|
| info@gaiai.ai | 23235656 | Mustafa Asan | Default Org |

**Access:** All organizations, all data (cross-org access)

---

### Organization 1 - Test Organization Free (4 users)

| Email | Password | Name | Role |
|-------|----------|------|------|
| test-admin@test-org-1.com | TestPass123! | Test ADMIN 1 | ADMIN |
| test-manager@test-org-1.com | TestPass123! | Test MANAGER 1 | MANAGER |
| test-hr_specialist@test-org-1.com | TestPass123! | Test HR SPECIALIST 1 | HR_SPECIALIST |
| test-user@test-org-1.com | TestPass123! | Test USER 1 | USER |

---

### Organization 2 - Test Organization Pro (4 users)

| Email | Password | Name | Role |
|-------|----------|------|------|
| test-admin@test-org-2.com | TestPass123! | Test ADMIN 2 | ADMIN |
| test-manager@test-org-2.com | TestPass123! | Test MANAGER 2 | MANAGER |
| test-hr_specialist@test-org-2.com | TestPass123! | Test HR SPECIALIST 2 | HR_SPECIALIST |
| test-user@test-org-2.com | TestPass123! | Test USER 2 | USER |

---

### Organization 3 - Test Organization Enterprise (4 users)

| Email | Password | Name | Role |
|-------|----------|------|------|
| test-admin@test-org-3.com | TestPass123! | Test ADMIN 3 | ADMIN |
| test-manager@test-org-3.com | TestPass123! | Test MANAGER 3 | MANAGER |
| test-hr_specialist@test-org-3.com | TestPass123! | Test HR SPECIALIST 3 | HR_SPECIALIST |
| test-user@test-org-3.com | TestPass123! | Test USER 3 | USER |

---

## 📢 JOB POSTINGS (6 Turkish Translations)

### Organization 1 - TechStart Innovations (Technology/FREE)

#### 1. Junior Frontend Developer
- **File:** `test-data/job-postings-turkish/org1-junior-frontend-developer-TR.txt`
- **Position:** Junior Frontend Geliştirici
- **Location:** İstanbul (Hibrit)
- **Required Skills:**
  - 1-2 yıl JavaScript/TypeScript
  - React, HTML5, CSS3
  - Git
  - İngilizce (teknik döküman)
- **Nice to Have:**
  - Next.js
  - Redux/Zustand
  - RESTful API/GraphQL
- **CVs:** 5 (High/Good/Medium/Low/Poor match)

#### 2. Software Test Engineer
- **File:** `test-data/job-postings-turkish/org1-software-test-engineer-TR.txt`
- **Position:** Yazılım Test Mühendisi
- **Location:** İstanbul (Hibrit)
- **Required Skills:**
  - 2-3 yıl test deneyimi
  - Selenium/Cypress/Jest
  - ISTQB Foundation
  - SQL, API testing
- **Nice to Have:**
  - Performance testing
  - CI/CD (Jenkins/GitLab)
  - Python/JavaScript
- **CVs:** 5 (High/Good/Medium/Low/Poor match)

---

### Organization 2 - MediCare Analytics (Healthcare/PRO)

#### 3. Healthcare Data Analyst
- **File:** `test-data/job-postings-turkish/org2-healthcare-data-analyst-TR.txt`
- **Position:** Sağlık Veri Analisti
- **Location:** Ankara (Tam Zamanlı)
- **Required Skills:**
  - 3-5 yıl sağlık verisi analizi
  - Power BI, SQL
  - HIS/EMR sistemleri
  - KVKK/GDPR
- **Nice to Have:**
  - Python/R
  - Machine Learning
  - Tıbbi terminoloji
- **CVs:** 5 (High/Good/Medium/Low/Poor match)

#### 4. Medical Records Specialist
- **File:** `test-data/job-postings-turkish/org2-medical-records-specialist-TR.txt`
- **Position:** Tıbbi Kayıt Uzmanı
- **Location:** Ankara (Tam Zamanlı)
- **Required Skills:**
  - 2-3 yıl tıbbi kayıt deneyimi
  - HIS sistemleri (Epic/Cerner)
  - ICD-10, CPT kodlama
  - KVKK
- **Nice to Have:**
  - Sağlık yönetimi sertifikası
  - HL7 standardı
- **CVs:** 5 (High/Good/Medium/Low/Poor match)

---

### Organization 3 - FinTech Capital (Finance/ENTERPRISE)

#### 5. Senior Financial Analyst
- **File:** `test-data/job-postings-turkish/org3-senior-financial-analyst-TR.txt`
- **Position:** Kıdemli Finansal Analist
- **Location:** İstanbul (Ofis)
- **Required Skills:**
  - 5+ yıl finansal analiz
  - TFRS/IFRS
  - SAP/Oracle
  - İngilizce (ileri seviye)
- **Nice to Have:**
  - MBA/YL (Finans)
  - CFA/ACCA
  - Python/VBA
- **CVs:** 5 (High/Good/Medium/Low/Poor match)

#### 6. Risk Management Specialist
- **File:** `test-data/job-postings-turkish/org3-risk-management-specialist-TR.txt`
- **Position:** Risk Yönetimi Uzmanı
- **Location:** İstanbul (Ofis)
- **Required Skills:**
  - 4+ yıl risk yönetimi
  - Basel III/IV
  - Risk modelleme
  - İngilizce (ileri seviye)
- **Nice to Have:**
  - FRM/PRM
  - Python/R
  - Machine Learning
- **CVs:** 5 (High/Good/Medium/Low/Poor match)

---

## 📄 CV FILES (30 Total)

**Location:** `/home/asan/Desktop/ikai/test-data/cvs/`

**All CVs contain:**
- **Email:** mustafaasan91@gmail.com
- **Phone:** 05398827540
- **Language:** Turkish
- **Format:** .txt

### CV Distribution by Match Level

| Match Level | Description | Count | Example Profiles |
|-------------|-------------|-------|------------------|
| **High (90-100%)** | All required + most nice-to-have skills | 6 | AHMET YILMAZ (Frontend, 2yr React/TS/Next) |
| **Good (70-80%)** | All required + some nice-to-have | 6 | AYŞE KAYA (Web Dev, 1.5yr React/JS) |
| **Medium (50-60%)** | Most required, missing nice-to-have | 6 | MEHMET DEMİR (Web Designer, HTML/CSS) |
| **Low (30-40%)** | Some required, many gaps | 6 | FATİH YILDIRIM (IT Support, basic HTML) |
| **Poor (10-20%)** | Irrelevant position | 6 | ZEYNEP ARSLAN (Marketing, no tech) |

---

### Organization 1 - TechStart Innovations

#### Junior Frontend Developer CVs (5)

**Folder:** `test-data/cvs/org1-junior-frontend-developer/`

| File | Name | Current Role | Match Level | Key Skills |
|------|------|--------------|-------------|------------|
| cv-01-high-match.txt | AHMET YILMAZ | Frontend Developer | 90-100% | React, TS, Next.js, Redux, 2yr exp, İTÜ |
| cv-02-good-match.txt | AYŞE KAYA | Web Developer | 70-80% | React, JS, 1.5yr, missing TS depth |
| cv-03-medium-match.txt | MEHMET DEMİR | Web Tasarımcı | 50-60% | HTML/CSS/jQuery, no React |
| cv-04-low-match.txt | FATİH YILDIRIM | IT Support | 30-40% | Basic HTML/CSS, no framework |
| cv-05-poor-match.txt | ZEYNEP ARSLAN | Pazarlama Uzmanı | 10-20% | Digital marketing, no dev skills |

#### Software Test Engineer CVs (5)

**Folder:** `test-data/cvs/org1-software-test-engineer/`

| File | Name | Current Role | Match Level | Key Skills |
|------|------|--------------|-------------|------------|
| cv-01-high-match.txt | BURAK ÖZDEMİR | QA Test Engineer | 90-100% | 3yr, ISTQB, Selenium/Cypress/Jest |
| cv-02-good-match.txt | SEDA AKIN | Software Tester | 70-80% | 2.5yr, Selenium/Postman, missing CI/CD |
| cv-03-medium-match.txt | CAN YILMAZ | Junior QA Tester | 50-60% | 1.5yr, manual testing only |
| cv-04-low-match.txt | AYŞE ÇETİN | Customer Support | 30-40% | UAT testing, no automation |
| cv-05-poor-match.txt | MEHMET KARA | Network Engineer | 10-20% | Network admin, no QA exp |

---

### Organization 2 - MediCare Analytics

#### Healthcare Data Analyst CVs (5)

**Folder:** `test-data/cvs/org2-healthcare-data-analyst/`

| File | Name | Current Role | Match Level | Key Skills |
|------|------|--------------|-------------|------------|
| cv-01-high-match.txt | DR. ELİF DEMİR | Healthcare Data Analyst | 90-100% | 4yr, Power BI/Python, HIS systems |
| cv-02-good-match.txt | AHMET YÜKSEL | Sağlık Veri Analisti | 70-80% | 3.5yr, Power BI/SQL, missing ML |
| cv-03-medium-match.txt | ZEYNEP KAYA | Data Analyst | 50-60% | 2yr analyst, no healthcare exp |
| cv-04-low-match.txt | MUSTAFA ŞAHİN | Business Analyst | 30-40% | Excel/SQL, no healthcare |
| cv-05-poor-match.txt | AYLIN KORKMAZ | İK Uzmanı | 10-20% | HR specialist, no data analysis |

#### Medical Records Specialist CVs (5)

**Folder:** `test-data/cvs/org2-medical-records-specialist/`

| File | Name | Current Role | Match Level | Key Skills |
|------|------|--------------|-------------|------------|
| cv-01-high-match.txt | SEDA YILDIZ | Tıbbi Kayıt Uzmanı | 90-100% | 3.5yr, Epic/Cerner, ICD-10 |
| cv-02-good-match.txt | MEHMET ARSLAN | Tıbbi Kayıt Görevlisi | 70-80% | 2.5yr, Nucleus, ICD-10, missing HL7 |
| cv-03-medium-match.txt | AYŞE ÖZTÜRK | Tıbbi Sekreter | 50-60% | 1.5yr, basic HIS |
| cv-04-low-match.txt | ALİ KILIÇ | Arşiv Görevlisi | 30-40% | File archiving, no medical coding |
| cv-05-poor-match.txt | BURCU AKIN | Müşteri Hizmetleri | 10-20% | Customer service, no medical exp |

---

### Organization 3 - FinTech Capital

#### Senior Financial Analyst CVs (5)

**Folder:** `test-data/cvs/org3-senior-financial-analyst/`

| File | Name | Current Role | Match Level | Key Skills |
|------|------|--------------|-------------|------------|
| cv-01-high-match.txt | EMRE BAŞARAN, CFA | Senior Financial Analyst | 90-100% | 7yr, MBA, CFA, SAP/Oracle |
| cv-02-good-match.txt | AYŞE YILMAZ, ACCA | Finansal Analist | 70-80% | 5.5yr, ACCA, SAP, YL Finans |
| cv-03-medium-match.txt | MEHMET KARA | Muhasebe Uzmanı | 50-60% | 3yr accounting, TFRS, no analyst exp |
| cv-04-low-match.txt | FATMA DEMİR | Mali İşler Uzmanı | 30-40% | Basic accounting, no analysis |
| cv-05-poor-match.txt | CAN ŞAHİN | Satış Temsilcisi | 10-20% | Sales rep, no finance exp |

#### Risk Management Specialist CVs (5)

**Folder:** `test-data/cvs/org3-risk-management-specialist/`

| File | Name | Current Role | Match Level | Key Skills |
|------|------|--------------|-------------|------------|
| cv-01-high-match.txt | SERKAN AYDOĞAN, FRM | Risk Management Specialist | 90-100% | 6yr, FRM, Basel III/IV |
| cv-02-good-match.txt | NİLAY ÖZTÜRK | Risk Analisti | 70-80% | 4.5yr, PRM, Basel III, missing ML |
| cv-03-medium-match.txt | BURAK YILMAZ | Kredi Analisti | 50-60% | 2.5yr credit analysis, basic Basel |
| cv-04-low-match.txt | AYŞE ÇELİK | Uyum Uzmanı | 30-40% | Compliance (KVKK), no risk mgmt |
| cv-05-poor-match.txt | MURAT KAYA | Sigorta Danışmanı | 10-20% | Insurance advisor, no risk mgmt |

---

## 🧪 TEST SCENARIOS

### Scenario 1: Multi-Tenant Data Isolation

**Goal:** Verify RBAC Layer 2 (data filtering)

**Test:**
```python
# scripts/test-helper.py
helper = IKAITestHelper()

# Login as Org 1 ADMIN
helper.login("test-admin@test-org-1.com", "TestPass123!")
job_postings = helper.get("/api/v1/job-postings")
# Should see only 2 job postings (org1)

# Login as SUPER_ADMIN
helper.login("info@gaiai.ai", "23235656")
job_postings = helper.get("/api/v1/job-postings")
# Should see 6 job postings (all orgs)
```

**Expected:**
- ✅ SUPER_ADMIN sees all 6 job postings
- ✅ Org ADMIN sees only their org's postings
- ✅ USER role blocked from endpoint (403)

---

### Scenario 2: Role-Based Access Control (Layer 1)

**Goal:** Verify page/route access by role

**Test:**
```python
# Test USER role (minimal access)
helper.login("test-user@test-org-1.com", "TestPass123!")
response = helper.get("/api/v1/job-postings")
# Should return 403 (no access)

# Test HR_SPECIALIST (data access)
helper.login("test-hr_specialist@test-org-1.com", "TestPass123!")
response = helper.get("/api/v1/job-postings")
# Should return 200 (has access)
```

**Expected:**
- ✅ USER: Dashboard only (403 for job-postings)
- ✅ HR_SPECIALIST: Can view/create job postings
- ✅ MANAGER: Can view/create job postings + candidates
- ✅ ADMIN: Full organization access

---

### Scenario 3: CV Analysis with Match Levels

**Goal:** Test CV upload and match scoring

**Test:**
```bash
# Upload high-match CV
curl -X POST http://localhost:8102/api/v1/analyses \
  -H "Authorization: Bearer $TOKEN" \
  -F "jobPostingId=$JOB_ID" \
  -F "file=@test-data/cvs/org1-junior-frontend-developer/cv-01-high-match.txt"

# Expected match score: 90-100%
```

**Expected Results:**
- High Match CV → 90-100% score
- Good Match CV → 70-80% score
- Medium Match CV → 50-60% score
- Low Match CV → 30-40% score
- Poor Match CV → 10-20% score

---

### Scenario 4: Usage Limits (Plan-Based)

**Goal:** Verify plan limits enforcement

**Test:**
```python
# FREE plan (10 analyses/month)
helper.login("test-admin@test-org-1.com", "TestPass123!")
# Upload 11 CVs → 11th should fail (limit exceeded)

# ENTERPRISE plan (200 analyses/month)
helper.login("test-admin@test-org-3.com", "TestPass123!")
# Upload 201 CVs → 201st should fail
```

**Expected:**
- ✅ FREE: 10 analysis limit enforced
- ✅ PRO: 50 analysis limit enforced
- ✅ ENTERPRISE: 200 analysis limit enforced

---

### Scenario 5: Cross-Organization Data Leak

**Goal:** Ensure Org 1 cannot see Org 2 data

**Test:**
```python
# Login as Org 1 ADMIN
helper.login("test-admin@test-org-1.com", "TestPass123!")
candidates = helper.get("/api/v1/candidates")
# Should only see candidates from Org 1

# Check if Org 2's candidate IDs are accessible
org2_candidate_id = "some-org2-candidate-id"
response = helper.get(f"/api/v1/candidates/{org2_candidate_id}")
# Should return 404 or 403 (not found/no access)
```

**Expected:**
- ✅ Org 1 ADMIN cannot access Org 2 data
- ✅ Org 2 ADMIN cannot access Org 3 data
- ✅ SUPER_ADMIN can access all orgs

---

## 🐍 Python Test Helper Usage

**File:** `scripts/test-helper.py`

### Quick Start

```python
# Interactive mode
python3 -i scripts/test-helper.py

# Create helper instance
>>> helper = IKAITestHelper()

# Test SUPER_ADMIN
>>> helper.login("info@gaiai.ai", "23235656")
>>> helper.get("/api/v1/job-postings")

# Test Org 1 ADMIN
>>> user = TEST_USERS["org1_admin"]
>>> helper.login(user["email"], user["password"])
>>> helper.get("/api/v1/job-postings")
```

### Available Users in TEST_USERS Dict

```python
TEST_USERS = {
    # SUPER_ADMIN
    "super_admin": {"email": "info@gaiai.ai", "password": "23235656"},

    # Org 1 (FREE)
    "org1_admin": {"email": "test-admin@test-org-1.com", "password": "TestPass123!"},
    "org1_manager": {"email": "test-manager@test-org-1.com", "password": "TestPass123!"},
    "org1_hr": {"email": "test-hr_specialist@test-org-1.com", "password": "TestPass123!"},
    "org1_user": {"email": "test-user@test-org-1.com", "password": "TestPass123!"},

    # Org 2 (PRO)
    "org2_admin": {"email": "test-admin@test-org-2.com", "password": "TestPass123!"},
    "org2_manager": {"email": "test-manager@test-org-2.com", "password": "TestPass123!"},
    "org2_hr": {"email": "test-hr_specialist@test-org-2.com", "password": "TestPass123!"},
    "org2_user": {"email": "test-user@test-org-2.com", "password": "TestPass123!"},

    # Org 3 (ENTERPRISE)
    "org3_admin": {"email": "test-admin@test-org-3.com", "password": "TestPass123!"},
    "org3_manager": {"email": "test-manager@test-org-3.com", "password": "TestPass123!"},
    "org3_hr": {"email": "test-hr_specialist@test-org-3.com", "password": "TestPass123!"},
    "org3_user": {"email": "test-user@test-org-3.com", "password": "TestPass123!"}
}
```

---

## 🔄 Recreate Test Data

### Recreate Organizations & Users

```bash
docker exec ikai-backend node /usr/src/app/create-test-data.js
```

**Output:**
- 3 organizations (FREE, PRO, ENTERPRISE)
- 12 users (4 roles × 3 orgs)
- Password: TestPass123!

### CVs & Job Postings

**Already created!** Located in:
- `/home/asan/Desktop/ikai/test-data/cvs/` (30 CVs)
- `/home/asan/Desktop/ikai/test-data/job-postings-turkish/` (6 job postings)

**To verify:**
```bash
# Count CVs
find test-data/cvs/ -name "*.txt" | wc -l
# Should output: 30

# Count job postings
ls -1 test-data/job-postings-turkish/*.txt | wc -l
# Should output: 6

# Verify email in all CVs
grep -r "mustafaasan91@gmail.com" test-data/cvs/ | wc -l
# Should output: 30
```

---

## 📊 Test Data Summary

| Category | Count | Details |
|----------|-------|---------|
| **Organizations** | 3 | FREE, PRO, ENTERPRISE |
| **Users** | 12 + 1 | 4 roles × 3 orgs + SUPER_ADMIN |
| **Job Postings** | 6 | 2 per org (Turkish) |
| **CVs** | 30 | 5 per job posting (5 match levels) |
| **Total Files** | 36 | 30 CVs + 6 job postings |

**Test Password:** TestPass123! (all users)
**Admin Password:** 23235656 (SUPER_ADMIN)

**CV Contact Info (all CVs):**
- Email: mustafaasan91@gmail.com
- Phone: 05398827540

---

## 🎯 Quick Test Commands

### Backend Health Check
```bash
curl http://localhost:8102/health
```

### Login & Get Token
```bash
curl -X POST http://localhost:8102/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test-admin@test-org-1.com","password":"TestPass123!"}'
```

### Get Job Postings (with token)
```bash
TOKEN="your-jwt-token"
curl -X GET http://localhost:8102/api/v1/job-postings \
  -H "Authorization: Bearer $TOKEN"
```

### Upload CV
```bash
curl -X POST http://localhost:8102/api/v1/analyses \
  -H "Authorization: Bearer $TOKEN" \
  -F "jobPostingId=$JOB_ID" \
  -F "file=@test-data/cvs/org1-junior-frontend-developer/cv-01-high-match.txt"
```

---

## 📚 Related Documentation

- **AsanMod Methodology:** [`docs/workflow/ASANMOD-METHODOLOGY.md`](../workflow/ASANMOD-METHODOLOGY.md)
- **RBAC Strategy:** [`docs/architecture/RBAC-COMPLETE-STRATEGY.md`](../architecture/RBAC-COMPLETE-STRATEGY.md)
- **SaaS Transformation:** [`docs/features/saas-transformation-plan.md`](../features/saas-transformation-plan.md)
- **Test CVs Verification:** [`docs/test-tasks/test-cvs-verification-report.md`](test-cvs-verification-report.md)
- **Python Test Helper:** [`scripts/test-helper.py`](../../scripts/test-helper.py)

---

**🎉 Complete Test Data Reference - Ready for Worker Testing!**
