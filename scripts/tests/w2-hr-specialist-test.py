#!/usr/bin/env python3
"""
W2: HR_SPECIALIST Role RBAC Audit
Backend API Testing
"""

import requests
import json

BASE_URL = "http://localhost:8102"

# Test credentials
HR_EMAIL = "test-hr_specialist@test-org-1.com"
HR_PASSWORD = "TestPass123!"

def print_test(number, description):
    print(f"\n{'='*70}")
    print(f"TEST {number}: {description}")
    print(f"{'='*70}")

def print_result(response, expected_status):
    print(f"Status Code: {response.status_code}")
    if response.status_code == expected_status:
        print(f"✅ PASS - Expected {expected_status}, got {response.status_code}")
    else:
        print(f"❌ FAIL - Expected {expected_status}, got {response.status_code}")

    try:
        data = response.json()
        print(f"\nResponse:")
        print(json.dumps(data, indent=2)[:500])  # First 500 chars
    except:
        print(f"Response text: {response.text[:200]}")

    return response

# Main test execution
print("\n" + "="*70)
print("HR_SPECIALIST RBAC AUDIT - BACKEND API TESTING")
print("="*70)

# Step 1: Login
print_test(0, "LOGIN as HR_SPECIALIST")
login_response = requests.post(
    f"{BASE_URL}/api/v1/auth/login",
    json={"email": HR_EMAIL, "password": HR_PASSWORD}
)

if login_response.status_code != 200:
    print("❌ Login failed! Cannot continue.")
    exit(1)

login_data = login_response.json()
TOKEN = login_data["token"]
HEADERS = {"Authorization": f"Bearer {TOKEN}"}

print(f"✅ Login successful!")
print(f"User ID: {login_data['user']['id']}")
print(f"Role: {login_data['user']['role']}")
print(f"Token: {TOKEN[:30]}...")

# Test 1: GET Job Postings (SHOULD BE 200)
print_test(1, "GET /api/v1/job-postings (SHOULD BE 200)")
response = requests.get(f"{BASE_URL}/api/v1/job-postings", headers=HEADERS)
print_result(response, 200)
job_postings = response.json() if response.status_code == 200 else {}

# Test 2: POST Job Posting (SHOULD BE 201)
print_test(2, "POST /api/v1/job-postings (SHOULD BE 201)")
new_job = {
    "title": "W2 Test - HR_SPECIALIST Job Posting",
    "description": "Testing create permission",
    "location": "Istanbul",
    "employmentType": "FULL_TIME"
}
response = requests.post(f"{BASE_URL}/api/v1/job-postings", json=new_job, headers=HEADERS)
print_result(response, 201)
created_job_id = response.json().get("id") if response.status_code == 201 else None

# Test 3: DELETE Job Posting (SHOULD BE 403)
if created_job_id:
    print_test(3, f"DELETE /api/v1/job-postings/{created_job_id[:8]}... (SHOULD BE 403)")
    response = requests.delete(f"{BASE_URL}/api/v1/job-postings/{created_job_id}", headers=HEADERS)
    print_result(response, 403)

# Test 4: GET Candidates (SHOULD BE 200)
print_test(4, "GET /api/v1/candidates (SHOULD BE 200)")
response = requests.get(f"{BASE_URL}/api/v1/candidates", headers=HEADERS)
print_result(response, 200)
candidates = response.json() if response.status_code == 200 else {}
candidate_id = candidates.get("data", [{}])[0].get("id") if response.status_code == 200 else None

# Test 5: DELETE Candidate (SHOULD BE 403)
if candidate_id:
    print_test(5, f"DELETE /api/v1/candidates/{candidate_id[:8]}... (SHOULD BE 403)")
    response = requests.delete(f"{BASE_URL}/api/v1/candidates/{candidate_id}", headers=HEADERS)
    print_result(response, 403)

# Test 6: GET Analyses (SHOULD BE 200)
print_test(6, "GET /api/v1/analyses (SHOULD BE 200)")
response = requests.get(f"{BASE_URL}/api/v1/analyses", headers=HEADERS)
print_result(response, 200)

# Test 7: GET Offers (SHOULD BE 200)
print_test(7, "GET /api/v1/offers (SHOULD BE 200)")
response = requests.get(f"{BASE_URL}/api/v1/offers", headers=HEADERS)
print_result(response, 200)

# Test 8: GET Interviews (SHOULD BE 200)
print_test(8, "GET /api/v1/interviews (SHOULD BE 200)")
response = requests.get(f"{BASE_URL}/api/v1/interviews", headers=HEADERS)
print_result(response, 200)

# Test 9: GET Team (SHOULD BE 403 - ADMIN only)
print_test(9, "GET /api/v1/team (SHOULD BE 403 - ADMIN only)")
response = requests.get(f"{BASE_URL}/api/v1/team", headers=HEADERS)
print_result(response, 403)

# Test 10: POST Team Invite (SHOULD BE 403)
print_test(10, "POST /api/v1/team/invite (SHOULD BE 403)")
invite_data = {"email": "newhr@test.com", "role": "HR_SPECIALIST"}
response = requests.post(f"{BASE_URL}/api/v1/team/invite", json=invite_data, headers=HEADERS)
print_result(response, 403)

# Test 11: GET Analytics (SHOULD BE 403 - MANAGER+ only)
print_test(11, "GET /api/v1/analytics/offers (SHOULD BE 403)")
response = requests.get(f"{BASE_URL}/api/v1/analytics/offers", headers=HEADERS)
print_result(response, 403)

# Test 12: GET Organization (SHOULD BE 403 - ADMIN only)
print_test(12, "GET /api/v1/organization (SHOULD BE 403)")
response = requests.get(f"{BASE_URL}/api/v1/organization", headers=HEADERS)
print_result(response, 403)

# Test 13: GET Queue Health (SHOULD BE 403 - ADMIN only)
print_test(13, "GET /api/v1/queue/health (SHOULD BE 403)")
response = requests.get(f"{BASE_URL}/api/v1/queue/health", headers=HEADERS)
print_result(response, 403)

print("\n" + "="*70)
print("BACKEND API TESTING COMPLETE")
print("="*70)
print("\nReview results above for any FAIL statuses.")
print("Next: Frontend page testing + UI element visibility")
