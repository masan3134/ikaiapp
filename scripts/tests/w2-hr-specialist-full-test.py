#!/usr/bin/env python3
"""
W2: HR_SPECIALIST Role RBAC - COMPREHENSIVE API Testing
Tests all CRUD operations on all endpoints
"""

import requests
import json

BASE_URL = "http://localhost:8102"
HR_EMAIL = "test-hr_specialist@test-org-1.com"
HR_PASSWORD = "TestPass123!"

class TestResults:
    def __init__(self):
        self.tests = []
        self.passed = 0
        self.failed = 0

    def add(self, name, expected, actual, response_preview=""):
        is_pass = (expected == actual)
        self.tests.append({
            "name": name,
            "expected": expected,
            "actual": actual,
            "pass": is_pass,
            "response": response_preview
        })
        if is_pass:
            self.passed += 1
        else:
            self.failed += 1

    def summary(self):
        print("\n" + "="*80)
        print(f"TEST SUMMARY: {self.passed} PASS / {self.failed} FAIL (Total: {len(self.tests)})")
        print("="*80)

        if self.failed > 0:
            print("\n❌ FAILED TESTS:")
            for test in self.tests:
                if not test["pass"]:
                    print(f"  - {test['name']}")
                    print(f"    Expected: {test['expected']}, Got: {test['actual']}")

        print("\n✅ ALL PASSED TESTS:")
        for test in self.tests:
            if test["pass"]:
                print(f"  - {test['name']} → {test['actual']}")

results = TestResults()

def test(name, response, expected_status):
    """Test helper function"""
    print(f"\n[TEST] {name}")
    print(f"  Status: {response.status_code} (Expected: {expected_status})")

    # Get response preview
    try:
        data = response.json()
        preview = json.dumps(data, indent=2)[:200]
    except:
        preview = response.text[:200]

    if response.status_code == expected_status:
        print(f"  ✅ PASS")
    else:
        print(f"  ❌ FAIL")
        print(f"  Response: {preview}")

    results.add(name, expected_status, response.status_code, preview)
    return response

# Login
print("\n" + "="*80)
print("HR_SPECIALIST RBAC - COMPREHENSIVE API AUDIT")
print("="*80)

print("\n[LOGIN] Authenticating as HR_SPECIALIST...")
login_resp = requests.post(
    f"{BASE_URL}/api/v1/auth/login",
    json={"email": HR_EMAIL, "password": HR_PASSWORD}
)

if login_resp.status_code != 200:
    print("❌ Login failed!")
    exit(1)

TOKEN = login_resp.json()["token"]
H = {"Authorization": f"Bearer {TOKEN}"}
print(f"✅ Logged in successfully")
print(f"   Token: {TOKEN[:40]}...")

# JOB POSTINGS
print("\n" + "-"*80)
print("JOB POSTINGS ENDPOINTS")
print("-"*80)

test("GET /api/v1/job-postings",
     requests.get(f"{BASE_URL}/api/v1/job-postings", headers=H), 200)

job_data = {
    "title": "W2 Test - HR Job Posting",
    "description": "Testing HR_SPECIALIST create permission",
    "location": "Istanbul",
    "employmentType": "FULL_TIME",
    "department": "Engineering",  # FIXED: Added required field
    "experienceLevel": "JUNIOR"
}

resp = test("POST /api/v1/job-postings",
            requests.post(f"{BASE_URL}/api/v1/job-postings", json=job_data, headers=H), 201)
job_id = resp.json().get("id") if resp.status_code == 201 else None

if job_id:
    test(f"GET /api/v1/job-postings/{job_id[:8]}...",
         requests.get(f"{BASE_URL}/api/v1/job-postings/{job_id}", headers=H), 200)

    test(f"PATCH /api/v1/job-postings/{job_id[:8]}...",
         requests.patch(f"{BASE_URL}/api/v1/job-postings/{job_id}",
                       json={"title": "Updated by HR_SPECIALIST"}, headers=H), 200)

    test(f"DELETE /api/v1/job-postings/{job_id[:8]}... (should FAIL)",
         requests.delete(f"{BASE_URL}/api/v1/job-postings/{job_id}", headers=H), 403)

# CANDIDATES
print("\n" + "-"*80)
print("CANDIDATES ENDPOINTS")
print("-"*80)

resp = test("GET /api/v1/candidates",
            requests.get(f"{BASE_URL}/api/v1/candidates", headers=H), 200)
candidates = resp.json().get("candidates", []) if resp.status_code == 200 else []
cand_id = candidates[0]["id"] if candidates else None

candidate_data = {
    "firstName": "Test",
    "lastName": "Candidate HR",
    "email": "testcandidate-hr@example.com",
    "phone": "+905551234567"
}

resp = test("POST /api/v1/candidates",
            requests.post(f"{BASE_URL}/api/v1/candidates", json=candidate_data, headers=H), 201)
new_cand_id = resp.json().get("id") if resp.status_code == 201 else None

if new_cand_id:
    test(f"GET /api/v1/candidates/{new_cand_id[:8]}...",
         requests.get(f"{BASE_URL}/api/v1/candidates/{new_cand_id}", headers=H), 200)

    test(f"PATCH /api/v1/candidates/{new_cand_id[:8]}...",
         requests.patch(f"{BASE_URL}/api/v1/candidates/{new_cand_id}",
                       json={"firstName": "Updated"}, headers=H), 200)

    test(f"DELETE /api/v1/candidates/{new_cand_id[:8]}... (should FAIL)",
         requests.delete(f"{BASE_URL}/api/v1/candidates/{new_cand_id}", headers=H), 403)

# ANALYSES
print("\n" + "-"*80)
print("ANALYSES ENDPOINTS")
print("-"*80)

test("GET /api/v1/analyses",
     requests.get(f"{BASE_URL}/api/v1/analyses", headers=H), 200)

# OFFERS
print("\n" + "-"*80)
print("OFFERS ENDPOINTS")
print("-"*80)

test("GET /api/v1/offers",
     requests.get(f"{BASE_URL}/api/v1/offers", headers=H), 200)

if cand_id and job_id:
    offer_data = {
        "candidateId": cand_id,
        "jobPostingId": job_id,
        "position": "Test Position",
        "department": "Engineering",
        "salary": 50000,
        "currency": "TRY",
        "startDate": "2025-12-01"
    }

    resp = test("POST /api/v1/offers",
                requests.post(f"{BASE_URL}/api/v1/offers", json=offer_data, headers=H), 201)
    offer_id = resp.json().get("id") if resp.status_code == 201 else None

    if offer_id:
        test(f"GET /api/v1/offers/{offer_id[:8]}...",
             requests.get(f"{BASE_URL}/api/v1/offers/{offer_id}", headers=H), 200)

        test(f"DELETE /api/v1/offers/{offer_id[:8]}... (should FAIL)",
             requests.delete(f"{BASE_URL}/api/v1/offers/{offer_id}", headers=H), 403)

# INTERVIEWS
print("\n" + "-"*80)
print("INTERVIEWS ENDPOINTS")
print("-"*80)

test("GET /api/v1/interviews",
     requests.get(f"{BASE_URL}/api/v1/interviews", headers=H), 200)

if cand_id:
    interview_data = {
        "candidateId": cand_id,
        "type": "technical",
        "date": "2025-11-10",
        "time": "14:00",
        "duration": 60,
        "location": "Office"
    }

    resp = test("POST /api/v1/interviews",
                requests.post(f"{BASE_URL}/api/v1/interviews", json=interview_data, headers=H), 201)
    interview_id = resp.json().get("id") if resp.status_code == 201 else None

    if interview_id:
        test(f"DELETE /api/v1/interviews/{interview_id[:8]}... (should FAIL)",
             requests.delete(f"{BASE_URL}/api/v1/interviews/{interview_id}", headers=H), 403)

# ADMIN-ONLY ENDPOINTS (should all be 403)
print("\n" + "-"*80)
print("ADMIN-ONLY ENDPOINTS (Should all be 403)")
print("-"*80)

test("GET /api/v1/team",
     requests.get(f"{BASE_URL}/api/v1/team", headers=H), 403)

test("POST /api/v1/team/invite",
     requests.post(f"{BASE_URL}/api/v1/team/invite",
                  json={"email": "test@test.com", "role": "USER"}, headers=H), 403)

test("GET /api/v1/queue/health",
     requests.get(f"{BASE_URL}/api/v1/queue/health", headers=H), 403)

# USER PROFILE (should work)
print("\n" + "-"*80)
print("USER PROFILE ENDPOINTS (Should work)")
print("-"*80)

test("GET /api/v1/user/profile",
     requests.get(f"{BASE_URL}/api/v1/user/profile", headers=H), 200)

test("PATCH /api/v1/user/profile",
     requests.patch(f"{BASE_URL}/api/v1/user/profile",
                   json={"firstName": "Test", "lastName": "HR"}, headers=H), 200)

# SUMMARY
results.summary()

print("\n" + "="*80)
print("Next Steps:")
print("1. Review failed tests above")
print("2. Frontend page testing (30 pages)")
print("3. UI element visibility")
print("="*80)
