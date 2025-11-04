#!/usr/bin/env python3
"""
W2: Verify DELETE Bug Fixes
Test that HR_SPECIALIST cannot delete resources (should get 403)
"""

import requests
import json

BASE_URL = "http://localhost:8102"
HR_EMAIL = "test-hr_specialist@test-org-1.com"
HR_PASSWORD = "TestPass123!"

print("="*70)
print("W2: Verify DELETE Bug Fixes")
print("="*70)

# Login
print("\n[LOGIN] HR_SPECIALIST...")
login_resp = requests.post(
    f"{BASE_URL}/api/v1/auth/login",
    json={"email": HR_EMAIL, "password": HR_PASSWORD}
)

if login_resp.status_code != 200:
    print("❌ Login failed!")
    exit(1)

TOKEN = login_resp.json()["token"]
H = {"Authorization": f"Bearer {TOKEN}"}
print(f"✅ Logged in")

# Get IDs for testing
print("\n[SETUP] Getting resource IDs...")

# Get job posting ID
jobs_resp = requests.get(f"{BASE_URL}/api/v1/job-postings", headers=H)
job_id = jobs_resp.json()["jobPostings"][0]["id"] if jobs_resp.status_code == 200 and jobs_resp.json().get("jobPostings") else None

# Get candidate ID
cands_resp = requests.get(f"{BASE_URL}/api/v1/candidates", headers=H)
cand_id = cands_resp.json()["candidates"][0]["id"] if cands_resp.status_code == 200 and cands_resp.json().get("candidates") else None

# Get analysis ID
analyses_resp = requests.get(f"{BASE_URL}/api/v1/analyses", headers=H)
analysis_id = analyses_resp.json()["analyses"][0]["id"] if analyses_resp.status_code == 200 and analyses_resp.json().get("analyses") else None

# Get offer ID
offers_resp = requests.get(f"{BASE_URL}/api/v1/offers", headers=H)
offer_id = offers_resp.json()["data"][0]["id"] if offers_resp.status_code == 200 and offers_resp.json().get("data") else None

# Get interview ID
interviews_resp = requests.get(f"{BASE_URL}/api/v1/interviews", headers=H)
interview_id = interviews_resp.json()["data"][0]["id"] if interviews_resp.status_code == 200 and interviews_resp.json().get("data") else None

print(f"Job ID: {job_id[:8] if job_id else 'None'}...")
print(f"Candidate ID: {cand_id[:8] if cand_id else 'None'}...")
print(f"Analysis ID: {analysis_id[:8] if analysis_id else 'None'}...")
print(f"Offer ID: {offer_id[:8] if offer_id else 'None'}...")
print(f"Interview ID: {interview_id[:8] if interview_id else 'None'}...")

# Test DELETE endpoints
print("\n" + "="*70)
print("TESTING DELETE ENDPOINTS (All should return 403)")
print("="*70)

results = []

def test_delete(name, endpoint, resource_id, expected=403):
    """Test DELETE endpoint"""
    if not resource_id:
        print(f"\n[SKIP] {name} - No resource ID available")
        return

    print(f"\n[TEST] DELETE {endpoint}")
    resp = requests.delete(f"{BASE_URL}{endpoint}/{resource_id}", headers=H)
    print(f"  Status: {resp.status_code} (Expected: {expected})")

    if resp.status_code == expected:
        print(f"  ✅ PASS - HR_SPECIALIST correctly blocked")
        results.append((name, "PASS"))
    else:
        print(f"  ❌ FAIL - Expected {expected}, got {resp.status_code}")
        try:
            print(f"  Response: {resp.json()}")
        except:
            print(f"  Response: {resp.text[:200]}")
        results.append((name, "FAIL"))

# Run tests
test_delete("Job Posting DELETE", "/api/v1/job-postings", job_id)
test_delete("Candidate DELETE", "/api/v1/candidates", cand_id)
test_delete("Analysis DELETE", "/api/v1/analyses", analysis_id)
test_delete("Offer DELETE", "/api/v1/offers", offer_id)
test_delete("Interview DELETE", "/api/v1/interviews", interview_id)

# Summary
print("\n" + "="*70)
print("SUMMARY")
print("="*70)

passed = sum(1 for _, status in results if status == "PASS")
failed = sum(1 for _, status in results if status == "FAIL")

print(f"\n✅ PASSED: {passed}/{len(results)}")
print(f"❌ FAILED: {failed}/{len(results)}")

if failed == 0:
    print("\n🎉 ALL DELETE FIXES VERIFIED! HR_SPECIALIST cannot delete resources.")
else:
    print("\n⚠️  Some tests failed - review above")

for name, status in results:
    symbol = "✅" if status == "PASS" else "❌"
    print(f"  {symbol} {name}")
