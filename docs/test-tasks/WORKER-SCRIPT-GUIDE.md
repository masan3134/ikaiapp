# 🐍 Worker Test Script Guide - Complete Reference

**Version:** 1.0
**Created:** 2025-11-04
**Purpose:** Kapsamlı test script sistemi - Worker'lar için tam rehber
**Principle:** Kirletme YOK, Orjinallere dokunma YOK, Template kopyala-düzenle

---

## 🎯 Quick Start (30 Seconds)

### Worker'san ve Test Yapacaksan:

**1. Template'i kopyala:**
```bash
cp scripts/templates/api-test-template.py scripts/tests/w1-my-test.py
```

**2. Senaryonu yaz:**
```bash
nano scripts/tests/w1-my-test.py  # Customize for your test
```

**3. Çalıştır ve kaydet:**
```bash
python3 scripts/tests/w1-my-test.py > test-outputs/w1-output.txt
```

**4. Raporda referans ver:**
```markdown
**Test Script:** scripts/tests/w1-my-test.py
**Output:** test-outputs/w1-output.txt
```

**Hepsi bu kadar! ✅**

---

## 📁 Dizin Yapısı (KATMANLI - Kirletme YOK)

```
/home/asan/Desktop/ikai/
├── scripts/
│   ├── test-helper.py           # ⚠️ READONLY - ASLA DEĞĐŞTĐRME!
│   │
│   ├── templates/               # 📋 Template'ler (READONLY)
│   │   ├── api-test-template.py
│   │   ├── rbac-test-template.py
│   │   ├── workflow-test-template.py
│   │   ├── performance-test-template.py
│   │   ├── ai-chat-test-template.py
│   │   └── cleanup-test-template.py
│   │
│   └── tests/                   # ✅ Worker'ların test scriptleri (BURAYA YAZ!)
│       ├── w1-super-admin-test.py
│       ├── w2-notification-test.py
│       ├── w3-ui-integration-test.py
│       └── w4-ai-chat-context-test.py
│
├── test-outputs/                # 📊 Test çıktıları (KĐRLENEBĐLĐR)
│   ├── w1-output.txt
│   ├── w2-results.json
│   ├── w3-screenshots/
│   └── cleanup-log.txt
│
└── test-data/                   # ⚠️ READONLY - TEST DATA
    ├── cvs/ (30 CVs)
    └── job-postings-turkish/ (6 files)
```

---

## 🚨 KATĐ KURALLAR

### ✅ YAPILACAKLAR (ALLOWED)

```bash
# ✅ Template kopyala
cp scripts/templates/api-test-template.py scripts/tests/w1-my-test.py

# ✅ Kendi testini yaz (tests/ klasöründe)
nano scripts/tests/w1-my-test.py

# ✅ Çıktıları test-outputs/'a kaydet
python3 scripts/tests/w1-my-test.py > test-outputs/w1-output.txt

# ✅ Test data'yı OKU (readonly)
with open('test-data/cvs/org1-junior-frontend-developer/cv-01.txt', 'rb') as f:
    ...

# ✅ Helper'ı import et
from test_helper import IKAITestHelper, TEST_USERS
```

### ❌ YASAK (FORBIDDEN)

```bash
# ❌ ASLA orjinal helper'ı değiştirme
nano scripts/test-helper.py  # YASAK!

# ❌ ASLA template'leri değiştirme
nano scripts/templates/api-test-template.py  # YASAK!

# ❌ ASLA test data'yı değiştirme
echo "test" > test-data/cvs/org1-junior-frontend-developer/cv-01.txt  # YASAK!

# ❌ ASLA root dizine dosya bırakma
python3 my-test.py  # Root'a script yazma!
touch output.txt   # Root'a output yazma!

# ❌ ASLA proje klasörlerini kirletme
echo "test" > backend/test-output.txt  # YASAK!
```

---

## 📚 Template'ler (6 Adet)

### 1. API Test Template ⭐⭐⭐

**File:** `scripts/templates/api-test-template.py`

**Use for:**
- Basic CRUD testing
- Endpoint verification
- Request/response validation

**Includes:**
- Login helper
- GET/POST/PUT/DELETE examples
- Cleanup after test
- Error handling

**Copy & Run:**
```bash
cp scripts/templates/api-test-template.py scripts/tests/w1-job-postings-test.py
python3 scripts/tests/w1-job-postings-test.py > test-outputs/w1-jobs.txt
```

---

### 2. RBAC Test Template ⭐⭐⭐

**File:** `scripts/templates/rbac-test-template.py`

**Use for:**
- Testing all 5 roles (SUPER_ADMIN, ADMIN, MANAGER, HR, USER)
- Permission verification
- Access control testing

**Includes:**
- Multi-role testing function
- Expected vs actual comparison
- Summary table (role → access → match)

**Copy & Run:**
```bash
cp scripts/templates/rbac-test-template.py scripts/tests/w1-rbac-offers.py
# Edit: Change endpoint to /api/v1/offers
# Edit: Change expected_access to ["SUPER_ADMIN", "ADMIN", "MANAGER"]
python3 scripts/tests/w1-rbac-offers.py > test-outputs/w1-rbac-offers.txt
```

---

### 3. Workflow Test Template ⭐⭐⭐

**File:** `scripts/templates/workflow-test-template.py`

**Use for:**
- Full hiring workflow (CV → Analysis → Offer → Interview)
- Multi-step processes
- Integration testing

**Includes:**
- CV upload helper
- Wait for analysis (queue)
- Role switching (HR → MANAGER)
- Complete workflow

**Copy & Run:**
```bash
cp scripts/templates/workflow-test-template.py scripts/tests/w2-full-workflow.py
python3 scripts/tests/w2-full-workflow.py > test-outputs/w2-workflow.txt
```

---

### 4. Performance Test Template ⭐⭐

**File:** `scripts/templates/performance-test-template.py`

**Use for:**
- Response time measurement
- Performance benchmarking
- Slow endpoint detection

**Includes:**
- measure_response_time() function
- Statistics (avg, median, min, max, std dev)
- Multiple runs (10x per endpoint)
- Performance assessment

**Copy & Run:**
```bash
cp scripts/templates/performance-test-template.py scripts/tests/w1-perf-test.py
python3 scripts/tests/w1-perf-test.py > test-outputs/w1-performance.txt
```

---

### 5. AI Chat Test Template ⭐⭐

**File:** `scripts/templates/ai-chat-test-template.py`

**Use for:**
- AI chat functionality
- Response quality testing
- Context management verification

**Includes:**
- ask_question() helper
- Response time measurement
- Context test (follow-up questions)
- Comparison questions
- Chat history verification

**Copy & Run:**
```bash
cp scripts/templates/ai-chat-test-template.py scripts/tests/w4-chat-test.py
python3 scripts/tests/w4-chat-test.py > test-outputs/w4-chat.txt
```

---

### 6. Cleanup Test Template ⭐

**File:** `scripts/templates/cleanup-test-template.py`

**Use for:**
- Cleaning up test data
- Removing test items
- Database hygiene

**Includes:**
- cleanup_test_items() function
- Filter by field (title, name, notes)
- Multi-category cleanup
- Delete summary

**Copy & Run:**
```bash
cp scripts/templates/cleanup-test-template.py scripts/tests/cleanup.py
python3 scripts/tests/cleanup.py > test-outputs/cleanup-log.txt
```

---

## 🔧 Base Helper Functions (READONLY)

**Available in `test-helper.py` (DON'T MODIFY!):**

### Authentication
```python
helper = IKAITestHelper()

# Login
helper.login(email, password)
# Output: "✅ Login başarılı! Email: ..., Rol: ..."

# Logout
helper.logout()
# Output: "✅ Logout başarılı!"
```

### HTTP Methods
```python
# GET
data = helper.get("/api/v1/job-postings")
# Returns: List or Dict

# POST
result = helper.post("/api/v1/job-postings", {"title": "..."})
# Returns: Created item

# PUT
updated = helper.put("/api/v1/job-postings/uuid", {"title": "..."})
# Returns: Updated item

# PATCH
patched = helper.patch("/api/v1/notifications/uuid/read", {})
# Returns: Patched item

# DELETE
helper.delete("/api/v1/job-postings/uuid")
# Returns: None (success) or raises exception
```

### Pre-configured Users
```python
TEST_USERS = {
    "super_admin": {
        "email": "info@gaiai.ai",
        "password": "23235656"
    },
    "org1_admin": {
        "email": "test-admin@test-org-1.com",
        "password": "TestPass123!"
    },
    "org1_manager": {...},
    "org1_hr": {...},
    "org1_user": {...},
    "org2_admin": {...},
    "org2_manager": {...},
    "org2_hr": {...},
    "org2_user": {...},
    "org3_admin": {...},
    "org3_manager": {...},
    "org3_hr": {...},
    "org3_user": {...}
}

# Usage:
user = TEST_USERS["org1_hr"]
helper.login(user["email"], user["password"])
```

---

## 🚀 Advanced Helpers (Create Your Own)

### File Upload Helper

**Create:** `scripts/tests/my-helpers.py`

```python
"""Custom helpers for my tests (don't modify test-helper.py!)"""

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(__file__)))

from test_helper import IKAITestHelper
import requests
import time

def upload_cv_and_wait(helper, cv_path, job_id, wait_seconds=60):
    """Upload CV and wait for analysis to complete"""

    # Upload
    with open(cv_path, 'rb') as f:
        files = {'file': (os.path.basename(cv_path), f, 'text/plain')}
        data = {'jobPostingId': job_id}

        response = requests.post(
            'http://localhost:8102/api/v1/analyses',
            headers={'Authorization': f'Bearer {helper.token}'},
            files=files,
            data=data
        )

        analysis = response.json()
        analysis_id = analysis['id']

    print(f"✅ Uploaded CV: {os.path.basename(cv_path)}")
    print(f"   Analysis ID: {analysis_id}")

    # Wait
    print(f"⏳ Waiting {wait_seconds}s for AI analysis...")
    time.sleep(wait_seconds)

    # Get result
    result = helper.get(f"/api/v1/analyses/{analysis_id}")
    print(f"✅ Analysis complete: {result['status']}")
    print(f"   Match score: {result.get('matchScore', 'N/A')}%")

    return result

def test_all_roles(helper, endpoint, expected_roles):
    """Test endpoint with all roles and verify RBAC"""

    roles = {
        "SUPER_ADMIN": ("info@gaiai.ai", "23235656"),
        "ADMIN": ("test-admin@test-org-1.com", "TestPass123!"),
        "MANAGER": ("test-manager@test-org-1.com", "TestPass123!"),
        "HR": ("test-hr_specialist@test-org-1.com", "TestPass123!"),
        "USER": ("test-user@test-org-1.com", "TestPass123!")
    }

    results = {}

    for role, (email, password) in roles.items():
        helper.login(email, password)

        try:
            response = helper.get(endpoint)
            results[role] = "✅ ACCESS"
        except Exception as e:
            results[role] = "❌ DENIED"

    # Verify
    for role, status in results.items():
        expected = "✅ ACCESS" if role in expected_roles else "❌ DENIED"
        match = "✅" if status == expected else "❌ MISMATCH"
        print(f"{role:15} → {status:15} (expected: {expected:15}) {match}")

    return results

# Use in your test:
# from my_helpers import upload_cv_and_wait, test_all_roles
# result = upload_cv_and_wait(helper, cv_path, job_id)
# test_all_roles(helper, "/api/v1/offers", ["SUPER_ADMIN", "ADMIN", "MANAGER"])
```

---

## 🧪 Example Test Scenarios

### Scenario 1: Worker #1 - SUPER_ADMIN Verification

**Goal:** Verify SUPER_ADMIN can see all orgs

**Script:** `scripts/tests/w1-super-admin-cross-org.py`

```python
#!/usr/bin/env python3
import sys, os
sys.path.append(os.path.dirname(os.path.dirname(__file__)))
from test_helper import IKAITestHelper, TEST_USERS

helper = IKAITestHelper()

print("SUPER_ADMIN Cross-Org Test")

# Test 1: SUPER_ADMIN
helper.login("info@gaiai.ai", "23235656")
super_jobs = helper.get("/api/v1/job-postings")
super_org_ids = set(j['organizationId'] for j in super_jobs)
print(f"SUPER_ADMIN: {len(super_jobs)} jobs, {len(super_org_ids)} orgs")

# Test 2: Org 1 ADMIN
helper.login("test-admin@test-org-1.com", "TestPass123!")
org1_jobs = helper.get("/api/v1/job-postings")
org1_org_ids = set(j['organizationId'] for j in org1_jobs)
print(f"Org 1 ADMIN: {len(org1_jobs)} jobs, {len(org1_org_ids)} orgs")

# Verify
print(f"\n✅ Expected: SUPER_ADMIN (6 jobs, 3 orgs), Org 1 (2 jobs, 1 org)")
print(f"{'✅' if len(super_jobs) == 6 and len(super_org_ids) == 3 else '❌'} SUPER_ADMIN verified")
print(f"{'✅' if len(org1_jobs) == 2 and len(org1_org_ids) == 1 else '❌'} Org isolation verified")
```

**Run:**
```bash
python3 scripts/tests/w1-super-admin-cross-org.py > test-outputs/w1-super-admin.txt
```

---

### Scenario 2: Worker #2 - Notification Preferences

**Goal:** Test notification preferences (enable/disable per type)

**Script:** `scripts/tests/w2-notification-preferences.py`

```python
#!/usr/bin/env python3
import sys, os
sys.path.append(os.path.dirname(os.path.dirname(__file__)))
from test_helper import IKAITestHelper, TEST_USERS

helper = IKAITestHelper()
helper.login("test-admin@test-org-1.com", "TestPass123!")

print("Notification Preferences Test")

# Get current preferences
prefs = helper.get("/api/v1/notifications/preferences")
print(f"✅ Current preferences: {len(prefs)} types")

# Disable ANALYSIS_COMPLETED
update = {
    "type": "ANALYSIS_COMPLETED",
    "enabled": False,
    "emailEnabled": False
}
helper.put("/api/v1/notifications/preferences", update)
print(f"✅ Disabled ANALYSIS_COMPLETED")

# Verify
prefs_after = helper.get("/api/v1/notifications/preferences")
analysis_pref = [p for p in prefs_after if p['type'] == 'ANALYSIS_COMPLETED'][0]
print(f"✅ Verified: enabled={analysis_pref['enabled']} (expected: False)")
```

---

### Scenario 3: Worker #3 - UI Integration Test

**Goal:** Test that RBAC buttons are actually hidden

**Script:** `scripts/tests/w3-ui-rbac-buttons.py`

```python
#!/usr/bin/env python3
"""
Note: This is backend API test (not actual UI test)
For real UI test, use Playwright or manual testing
"""

import sys, os
sys.path.append(os.path.dirname(os.path.dirname(__file__)))
from test_helper import IKAITestHelper, TEST_USERS

helper = IKAITestHelper()

print("UI RBAC Integration Test (Backend Verification)")

# Test: USER should get 403 on job-postings
helper.login("test-user@test-org-1.com", "TestPass123!")

try:
    jobs = helper.get("/api/v1/job-postings")
    print(f"❌ USER can access job-postings (should be blocked!)")
except Exception as e:
    if "403" in str(e):
        print(f"✅ USER blocked from job-postings (expected)")
    else:
        print(f"⚠️ Unexpected error: {e}")

# Test: HR_SPECIALIST should access
helper.login("test-hr_specialist@test-org-1.com", "TestPass123!")

try:
    jobs = helper.get("/api/v1/job-postings")
    print(f"✅ HR_SPECIALIST can access job-postings (expected)")
except Exception as e:
    print(f"❌ HR_SPECIALIST blocked (unexpected!): {e}")
```

---

### Scenario 4: Worker #4 - AI Chat Context Limit

**Goal:** Test 40-message context window

**Script:** `scripts/tests/w4-chat-context-limit.py`

```python
#!/usr/bin/env python3
import sys, os
sys.path.append(os.path.dirname(os.path.dirname(__file__)))
from test_helper import IKAITestHelper, TEST_USERS
import time

helper = IKAITestHelper()
helper.login("test-hr_specialist@test-org-1.com", "TestPass123!")

# Get analysis
analyses = helper.get("/api/v1/analyses")
analysis_id = analyses[0]['id']

print(f"AI Chat Context Limit Test")
print(f"Analysis ID: {analysis_id}")

# Send 45 messages (over 40 limit)
print(f"\nSending 45 messages...")

for i in range(45):
    msg = f"Test message {i+1}: What is the candidate's name?"
    helper.post(f'/api/v1/analysis-chat/{analysis_id}/chat', {"message": msg})
    print(f"  Message {i+1} sent")
    time.sleep(0.5)  # Avoid rate limiting

# Test memory
print(f"\n Testing context memory...")
memory_test = helper.post(
    f'/api/v1/analysis-chat/{analysis_id}/chat',
    {"message": "İlk sorumda ne sormuştum?"}
)

print(f"\nAI Response:")
print(memory_test['response'])

print(f"\n✅ Expected: AI may NOT remember message #1 (context window = 40)")
print(f"✅ Expected: AI should remember recent messages (36-45)")
```

---

## 📊 Output Management Best Practices

### 1. Structured Output Files

**Naming convention:**
```
test-outputs/
├── w1-super-admin-cross-org.txt
├── w2-notification-preferences.txt
├── w3-ui-rbac-buttons.txt
└── w4-chat-context-limit.txt
```

**Pattern:** `w{worker}-{feature}-{focus}.txt`

---

### 2. JSON Output (for parsing)

```python
import json

# At end of script
results = {
    "test_name": "RBAC Test",
    "timestamp": "2025-11-04T10:30:00Z",
    "results": {
        "SUPER_ADMIN": "✅ ACCESS",
        "ADMIN": "✅ ACCESS",
        "USER": "❌ DENIED"
    },
    "summary": {
        "passed": 2,
        "failed": 0,
        "total": 3
    }
}

# Save to JSON
with open("test-outputs/w1-rbac-results.json", "w") as f:
    json.dump(results, f, indent=2)

print(f"\n✅ Results saved to: test-outputs/w1-rbac-results.json")
```

---

### 3. Append to Cumulative Log

```bash
# Append instead of overwrite
python3 scripts/tests/w1-test.py >> test-outputs/cumulative-log.txt

# Add timestamp
echo "=== Test run: $(date) ===" >> test-outputs/cumulative-log.txt
python3 scripts/tests/w1-test.py >> test-outputs/cumulative-log.txt
```

---

## 🎯 Worker Workflow (Step-by-Step)

### Phase 1: Choose Template

**Ask yourself:**
- Testing API CRUD? → `api-test-template.py`
- Testing RBAC? → `rbac-test-template.py`
- Testing workflow? → `workflow-test-template.py`
- Testing performance? → `performance-test-template.py`
- Testing AI chat? → `ai-chat-test-template.py`
- Cleanup needed? → `cleanup-test-template.py`

---

### Phase 2: Copy & Customize

```bash
# Copy template
cp scripts/templates/api-test-template.py scripts/tests/w1-my-test.py

# Edit for your scenario
nano scripts/tests/w1-my-test.py
```

**Customize:**
1. Change test name in print statements
2. Change endpoint ("/api/v1/...")
3. Change test user (role)
4. Adjust test data (request body)
5. Update expected results

---

### Phase 3: Run & Save

```bash
# Run and save to file
python3 scripts/tests/w1-my-test.py > test-outputs/w1-output.txt

# Check output
cat test-outputs/w1-output.txt
```

---

### Phase 4: Reference in Report

**In your Worker report:**

```markdown
## Test Execution

**Test Script:** `scripts/tests/w1-my-test.py`

**Script Content:**
\`\`\`python
#!/usr/bin/env python3
[Key parts of script - or full script if short]
\`\`\`

**Execution:**
\`\`\`bash
$ python3 scripts/tests/w1-my-test.py
\`\`\`

**RAW Output:**
\`\`\`
[PASTE ENTIRE OUTPUT FROM test-outputs/w1-output.txt]
\`\`\`

**Verification:**
- ✅ Expected behavior 1: [VERIFIED]
- ✅ Expected behavior 2: [VERIFIED]
```

---

## 🔍 Common Patterns

### Pattern 1: Test Multiple Items

```python
# Upload multiple CVs
cv_files = [
    'cv-01-high-match.txt',
    'cv-02-good-match.txt',
    'cv-03-medium-match.txt'
]

analysis_ids = []

for cv_file in cv_files:
    cv_path = f'test-data/cvs/org1-junior-frontend-developer/{cv_file}'
    analysis_id = upload_cv(helper, cv_path, job_id)
    analysis_ids.append(analysis_id)

print(f"\n✅ Uploaded {len(analysis_ids)} CVs")
```

---

### Pattern 2: Role Switching

```python
# Login as HR (upload CV)
helper.login(TEST_USERS["org1_hr"]["email"], "TestPass123!")
analysis_id = upload_cv(...)

# Switch to MANAGER (create offer)
helper.login(TEST_USERS["org1_manager"]["email"], "TestPass123!")
offer = helper.post("/api/v1/offers", {...})

# Switch to ADMIN (delete if needed)
helper.login(TEST_USERS["org1_admin"]["email"], "TestPass123!")
helper.delete(f"/api/v1/offers/{offer['id']}")
```

---

### Pattern 3: Verify Expected Errors

```python
# Test that USER gets 403
helper.login(TEST_USERS["org1_user"]["email"], "TestPass123!")

try:
    jobs = helper.get("/api/v1/job-postings")
    print("❌ USER can access (should be blocked!)")
except Exception as e:
    if "403" in str(e):
        print("✅ USER blocked as expected")
    else:
        print(f"⚠️ Unexpected error: {e}")
```

---

### Pattern 4: Cleanup After Test

```python
def main():
    helper = IKAITestHelper()
    created_ids = []

    try:
        # ... create test items ...
        item = helper.post("/api/v1/job-postings", {...})
        created_ids.append(item['id'])

        # ... run tests ...

    finally:
        # Cleanup (runs even if test fails)
        print("\n🧹 Cleanup")
        for item_id in created_ids:
            try:
                helper.delete(f"/api/v1/job-postings/{item_id}")
                print(f"   ✅ Deleted {item_id}")
            except Exception as e:
                print(f"   ⚠️ Failed to delete {item_id}: {e}")
```

---

## 🚨 Error Handling Best Practices

### Try-Except Pattern

```python
# Test with graceful error handling
try:
    result = helper.post("/api/v1/job-postings", data)
    print(f"✅ Success: {result['id']}")

except Exception as e:
    error_msg = str(e)

    if "403" in error_msg:
        print(f"❌ 403 Forbidden (insufficient permissions)")
    elif "401" in error_msg:
        print(f"❌ 401 Unauthorized (token issue)")
    elif "400" in error_msg:
        print(f"❌ 400 Bad Request (validation error)")
    elif "404" in error_msg:
        print(f"❌ 404 Not Found")
    else:
        print(f"❌ Error: {error_msg}")

    # Continue with next test (don't exit)
```

---

## 📝 Report Integration

### In Worker Reports - Standard Format

```markdown
## 🧪 Test Execution

### Test Script
**Location:** `scripts/tests/w2-notification-test.py`
**Template:** `scripts/templates/api-test-template.py`
**Output:** `test-outputs/w2-notification-output.txt`

### Script Overview
\`\`\`python
# Test notification preferences
# - Get all preferences
# - Disable specific type
# - Verify disabled
# - Re-enable
\`\`\`

### Execution Command
\`\`\`bash
$ python3 scripts/tests/w2-notification-test.py
\`\`\`

### RAW Output
\`\`\`
============================================================
API TEST: Notification Preferences
============================================================

📋 Step 1: Testing login...
✅ Login başarılı!
   Email: test-admin@test-org-1.com
   Rol: ADMIN

📋 Step 2: Get preferences...
✅ Retrieved 15 preferences

[... PASTE COMPLETE OUTPUT HERE ...]

============================================================
TEST COMPLETE
============================================================
\`\`\`

### Verification
- ✅ All 15 notification types have preferences
- ✅ Disable/enable toggle works
- ✅ Email preferences save correctly
- ✅ API returns 200 (no errors)
```

---

## 🎓 Advanced Techniques

### 1. Batch Operations

```python
# Test creating 10 candidates
print("Creating 10 test candidates...")

for i in range(10):
    candidate = {
        "name": f"Test Candidate {i+1}",
        "email": f"test{i+1}@example.com",
        "phone": f"055512340{i:02d}"
    }

    result = helper.post("/api/v1/candidates", candidate)
    print(f"  {i+1}. Created: {result['id']}")
```

---

### 2. Data Validation

```python
# Verify response structure
job = helper.get("/api/v1/job-postings/uuid")

required_fields = ['id', 'title', 'description', 'organizationId', 'createdAt']

for field in required_fields:
    if field in job:
        print(f"✅ {field}: present")
    else:
        print(f"❌ {field}: MISSING!")
```

---

### 3. Performance Profiling

```python
import time

# Measure each step
steps = []

start = time.time()
helper.login(...)
steps.append(("Login", time.time() - start))

start = time.time()
jobs = helper.get("/api/v1/job-postings")
steps.append(("Get jobs", time.time() - start))

# Print profile
print("\nPerformance Profile:")
for step_name, duration in steps:
    print(f"  {step_name:20} {duration*1000:6.0f}ms")
```

---

## 🚀 Quick Reference Card

**Copy template:**
```bash
cp scripts/templates/[TEMPLATE].py scripts/tests/w[N]-[NAME].py
```

**Edit:**
```bash
nano scripts/tests/w[N]-[NAME].py
```

**Run:**
```bash
python3 scripts/tests/w[N]-[NAME].py
```

**Save output:**
```bash
python3 scripts/tests/w[N]-[NAME].py > test-outputs/w[N]-output.txt
```

**Both stdout + stderr:**
```bash
python3 scripts/tests/w[N]-[NAME].py > test-outputs/w[N]-output.txt 2>&1
```

**Reference in report:**
```markdown
**Script:** scripts/tests/w[N]-[NAME].py
**Output:** test-outputs/w[N]-output.txt
```

---

## 📚 Related Documentation

- **Test Helper Source:** [`scripts/test-helper.py`](../../scripts/test-helper.py)
- **Test Data Reference:** [`docs/test-tasks/COMPLETE-TEST-DATA-REFERENCE.md`](COMPLETE-TEST-DATA-REFERENCE.md)
- **AsanMod Methodology:** [`docs/workflow/ASANMOD-METHODOLOGY.md`](../workflow/ASANMOD-METHODOLOGY.md)

---

## ✅ Pre-flight Checklist

**Before running your test:**

- [ ] Copied template to `scripts/tests/`
- [ ] Customized for your scenario
- [ ] Test helper imported correctly
- [ ] Test users configured
- [ ] Test data paths verified (exist)
- [ ] Backend running (http://localhost:8102)
- [ ] Output directory exists (`test-outputs/`)

**After running test:**

- [ ] Output saved to `test-outputs/`
- [ ] Output pasted to report (RAW)
- [ ] Verification done (expected vs actual)
- [ ] Script referenced in report
- [ ] Cleanup executed (if needed)
- [ ] Git commit (report + test script if useful for future)

---

**🚀 Clean, Organized, Verifiable Testing!**

**Remember:**
- ✅ Templates are READONLY (copy, don't modify)
- ✅ Test helper is READONLY (import, don't modify)
- ✅ Test data is READONLY (read, don't write)
- ✅ Your scripts go in `scripts/tests/`
- ✅ Your outputs go in `test-outputs/`
