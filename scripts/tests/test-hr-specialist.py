#!/usr/bin/env python3
"""
HR_SPECIALIST Role RBAC Audit Test Script
Worker #2 - Testing HR_SPECIALIST permissions
"""

import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

from scripts.test_helper import IKAITestHelper, TEST_USERS
import json

def print_section(title):
    print(f"\n{'='*60}")
    print(f"  {title}")
    print(f"{'='*60}\n")

def test_hr_specialist_permissions():
    """Main test function for HR_SPECIALIST role"""

    helper = IKAITestHelper()

    # Login as HR_SPECIALIST
    print_section("LOGIN AS HR_SPECIALIST")
    user = TEST_USERS["org1_hr"]
    print(f"Email: {user['email']}")
    print(f"Password: {user['password']}")
    print(f"Organization: {user['org_name']} ({user['plan']})")
    print()

    login_result = helper.login(user["email"], user["password"])
    if login_result:
        print("✅ Login successful!")
        print(f"User ID: {helper.user_id}")
        print(f"Role: {helper.role}")
        print(f"Token: {helper.token[:50]}...")
    else:
        print("❌ Login failed!")
        return

    # Test 1: GET Job Postings (SHOULD WORK)
    print_section("TEST 1: GET /api/v1/job-postings (SHOULD BE 200)")
    result = helper.get("/api/v1/job-postings")
    print(f"Status Code: {result.status_code}")
    if result.status_code == 200:
        data = result.json()
        print(f"✅ SUCCESS - Got {len(data.get('data', []))} job postings")
        for job in data.get('data', [])[:2]:
            print(f"  - {job.get('title')} (ID: {job.get('id')[:8]}...)")
    else:
        print(f"❌ FAIL - Expected 200, got {result.status_code}")
        print(result.text)

    # Test 2: POST Job Posting (SHOULD WORK)
    print_section("TEST 2: POST /api/v1/job-postings (SHOULD BE 201)")
    new_job_data = {
        "title": "Test Job by HR_SPECIALIST - W2 Audit",
        "description": "Testing HR_SPECIALIST create permission",
        "location": "Istanbul",
        "employmentType": "FULL_TIME",
        "experienceLevel": "JUNIOR",
        "department": "Engineering"
    }
    result = helper.post("/api/v1/job-postings", new_job_data)
    print(f"Status Code: {result.status_code}")
    if result.status_code in [200, 201]:
        data = result.json()
        job_id = data.get('id')
        print(f"✅ SUCCESS - Created job posting")
        print(f"  Job ID: {job_id}")
        print(f"  Title: {data.get('title')}")
    else:
        print(f"❌ FAIL - Expected 201, got {result.status_code}")
        print(result.text)
        job_id = None

    # Test 3: GET Candidates (SHOULD WORK)
    print_section("TEST 3: GET /api/v1/candidates (SHOULD BE 200)")
    result = helper.get("/api/v1/candidates")
    print(f"Status Code: {result.status_code}")
    if result.status_code == 200:
        data = result.json()
        candidates = data.get('data', [])
        print(f"✅ SUCCESS - Got {len(candidates)} candidates")
        candidate_id = candidates[0]['id'] if candidates else None
        if candidate_id:
            print(f"  First candidate ID: {candidate_id[:8]}...")
    else:
        print(f"❌ FAIL - Expected 200, got {result.status_code}")
        candidate_id = None

    # Test 4: DELETE Job Posting (SHOULD FAIL - 403)
    if job_id:
        print_section("TEST 4: DELETE /api/v1/job-postings/:id (SHOULD BE 403)")
        result = helper.delete(f"/api/v1/job-postings/{job_id}")
        print(f"Status Code: {result.status_code}")
        if result.status_code == 403:
            print("✅ SUCCESS - Correctly blocked (403 Forbidden)")
            print("  HR_SPECIALIST cannot delete job postings ✓")
        else:
            print(f"❌ FAIL - Expected 403, got {result.status_code}")
            print(f"  BUG: HR_SPECIALIST should NOT be able to delete!")

    # Test 5: GET Analyses (SHOULD WORK)
    print_section("TEST 5: GET /api/v1/analyses (SHOULD BE 200)")
    result = helper.get("/api/v1/analyses")
    print(f"Status Code: {result.status_code}")
    if result.status_code == 200:
        data = result.json()
        analyses = data.get('data', [])
        print(f"✅ SUCCESS - Got {len(analyses)} analyses")
    else:
        print(f"❌ FAIL - Expected 200, got {result.status_code}")

    # Test 6: GET Offers (SHOULD WORK)
    print_section("TEST 6: GET /api/v1/offers (SHOULD BE 200)")
    result = helper.get("/api/v1/offers")
    print(f"Status Code: {result.status_code}")
    if result.status_code == 200:
        data = result.json()
        offers = data.get('data', [])
        print(f"✅ SUCCESS - Got {len(offers)} offers")
    else:
        print(f"❌ FAIL - Expected 200, got {result.status_code}")

    # Test 7: GET Interviews (SHOULD WORK)
    print_section("TEST 7: GET /api/v1/interviews (SHOULD BE 200)")
    result = helper.get("/api/v1/interviews")
    print(f"Status Code: {result.status_code}")
    if result.status_code == 200:
        data = result.json()
        interviews = data.get('data', [])
        print(f"✅ SUCCESS - Got {len(interviews)} interviews")
    else:
        print(f"❌ FAIL - Expected 200, got {result.status_code}")

    # Test 8: GET Team (SHOULD FAIL - 403)
    print_section("TEST 8: GET /api/v1/team (SHOULD BE 403)")
    result = helper.get("/api/v1/team")
    print(f"Status Code: {result.status_code}")
    if result.status_code == 403:
        print("✅ SUCCESS - Correctly blocked (403 Forbidden)")
        print("  HR_SPECIALIST cannot access team management ✓")
    else:
        print(f"❌ FAIL - Expected 403, got {result.status_code}")
        print(f"  BUG: HR_SPECIALIST should NOT access team!")

    # Test 9: POST Team Invite (SHOULD FAIL - 403)
    print_section("TEST 9: POST /api/v1/team/invite (SHOULD BE 403)")
    invite_data = {
        "email": "newhr@test-org-1.com",
        "role": "HR_SPECIALIST"
    }
    result = helper.post("/api/v1/team/invite", invite_data)
    print(f"Status Code: {result.status_code}")
    if result.status_code == 403:
        print("✅ SUCCESS - Correctly blocked (403 Forbidden)")
        print("  HR_SPECIALIST cannot invite team members ✓")
    else:
        print(f"❌ FAIL - Expected 403, got {result.status_code}")
        print(f"  BUG: HR_SPECIALIST should NOT invite team!")

    # Test 10: GET Analytics (SHOULD FAIL - 403)
    print_section("TEST 10: GET /api/v1/analytics/offers (SHOULD BE 403)")
    result = helper.get("/api/v1/analytics/offers")
    print(f"Status Code: {result.status_code}")
    if result.status_code == 403:
        print("✅ SUCCESS - Correctly blocked (403 Forbidden)")
        print("  HR_SPECIALIST cannot access analytics ✓")
    else:
        print(f"❌ FAIL - Expected 403, got {result.status_code}")
        print(f"  BUG: HR_SPECIALIST should NOT access analytics!")

    # Test 11: DELETE Candidate (SHOULD FAIL - 403)
    if candidate_id:
        print_section("TEST 11: DELETE /api/v1/candidates/:id (SHOULD BE 403)")
        result = helper.delete(f"/api/v1/candidates/{candidate_id}")
        print(f"Status Code: {result.status_code}")
        if result.status_code == 403:
            print("✅ SUCCESS - Correctly blocked (403 Forbidden)")
            print("  HR_SPECIALIST cannot delete candidates ✓")
        else:
            print(f"❌ FAIL - Expected 403, got {result.status_code}")
            print(f"  BUG: HR_SPECIALIST should NOT delete candidates!")

    print_section("SUMMARY")
    print("HR_SPECIALIST Backend API Audit - Phase 1 Complete")
    print("\nNext steps:")
    print("1. Review test results above")
    print("2. Fix any bugs found (commits!)")
    print("3. Continue with frontend page testing")
    print("4. Document in verification report")

if __name__ == "__main__":
    test_hr_specialist_permissions()
