#!/usr/bin/env python3

"""
W6: SUPER_ADMIN Analysis Creation Test
Tests if SUPER_ADMIN can create analysis with job postings from ANY organization
"""

import requests
import json
import sys

BASE_URL = 'http://localhost:8102'
SUPER_ADMIN_EMAIL = 'info@gaiai.ai'
SUPER_ADMIN_PASS = '23235656'

def test_superadmin_analysis():
    """Test SUPER_ADMIN can create analysis with any org's job posting"""

    print("\n" + "="*60)
    print("W6: SUPER_ADMIN Analysis Creation Test")
    print("="*60 + "\n")

    # Login as SUPER_ADMIN
    print("1. Login as SUPER_ADMIN...")
    login_res = requests.post(f"{BASE_URL}/api/v1/auth/login", json={
        "email": SUPER_ADMIN_EMAIL,
        "password": SUPER_ADMIN_PASS
    })
    login_data = login_res.json()

    # Handle different response formats
    if 'data' in login_data:
        token = login_data['data']['token']
    elif 'token' in login_data:
        token = login_data['token']
    else:
        print(f"   ❌ Login failed: {login_data}")
        return False

    headers = {"Authorization": f"Bearer {token}"}
    print("   ✅ Logged in\n")

    # Get job postings from different organizations
    print("2. Fetching job postings from all organizations...")
    jp_res = requests.get(f"{BASE_URL}/api/v1/job-postings", headers=headers)
    jp_data = jp_res.json()

    if 'data' in jp_data:
        job_postings = jp_data['data']
    elif 'jobPostings' in jp_data:
        job_postings = jp_data['jobPostings']
    elif isinstance(jp_data, list):
        job_postings = jp_data
    else:
        print(f"   ❌ Unexpected response format: {list(jp_data.keys())}")
        return False

    if not job_postings or len(job_postings) == 0:
        print("   ❌ No job postings found!")
        return False

    print(f"   ✅ Found {len(job_postings)} job postings\n")

    # Find job posting from a different org
    test_job = None
    for jp in job_postings:
        org_name = jp.get('organization', {}).get('name', '')
        if 'Test Org' in org_name or 'Test Organization' in org_name:
            test_job = jp
            print(f"3. Testing with job posting: {jp['title']}")
            print(f"   Organization: {org_name}")
            print(f"   Job Posting ID: {jp['id']}\n")
            break

    if not test_job:
        test_job = job_postings[0]
        print(f"3. Testing with first job posting: {test_job['title']}\n")

    # Get candidates from same organization as job posting
    print("4. Fetching candidates...")
    cand_res = requests.get(f"{BASE_URL}/api/v1/candidates", headers=headers)
    cand_data = cand_res.json()

    if 'data' in cand_data:
        all_candidates = cand_data['data']
    elif 'candidates' in cand_data:
        all_candidates = cand_data['candidates']
    elif isinstance(cand_data, list):
        all_candidates = cand_data
    else:
        print(f"   ❌ Unexpected response format: {list(cand_data.keys())}")
        return False

    # Filter candidates from same org as test job
    org_id = test_job.get('organizationId')
    candidates = [c for c in all_candidates if c.get('organizationId') == org_id]

    # If no candidates in same org, use any candidate (SUPER_ADMIN can do this!)
    if len(candidates) == 0:
        print(f"   ⚠️  No candidates in same org, using any candidate (SUPER_ADMIN privilege)")
        if len(all_candidates) > 0:
            candidates = [all_candidates[0]]
        else:
            print(f"   ❌ No candidates found at all!")
            return False

    candidate_id = candidates[0]['id']
    print(f"   ✅ Using candidate: {candidates[0].get('fullName', 'Unknown')}")
    print(f"   Candidate Org ID: {candidates[0].get('organizationId')}\n")

    # Create analysis (THIS IS THE TEST!)
    print("5. Creating analysis as SUPER_ADMIN...")
    print(f"   Job Posting Org: {test_job.get('organizationId')}")
    print(f"   Candidate Org: {candidates[0].get('organizationId')}")
    print(f"   (Should work even if different orgs)\n")

    try:
        analysis_res = requests.post(f"{BASE_URL}/api/v1/analyses",
            headers=headers,
            json={
                "jobPostingId": test_job['id'],
                "candidateIds": [candidate_id]
            }
        )

        if analysis_res.status_code == 201:
            analysis_data = analysis_res.json()

            if 'data' in analysis_data:
                analysis = analysis_data['data']
            elif 'analysis' in analysis_data:
                analysis = analysis_data['analysis']
            elif 'id' in analysis_data:
                analysis = analysis_data
            else:
                print(f"   ⚠️  Unexpected response: {list(analysis_data.keys())}")
                analysis = analysis_data

            print(f"   ✅ SUCCESS! Analysis created: {analysis.get('id')}")
            print(f"   Status: {analysis.get('status')}\n")

            # Cleanup
            print("6. Cleaning up...")
            requests.delete(f"{BASE_URL}/api/v1/analyses/{analysis['id']}", headers=headers)
            print("   ✅ Test analysis deleted\n")

            return True
        else:
            print(f"   ❌ FAILED! Status: {analysis_res.status_code}")
            print(f"   Error: {analysis_res.json()}\n")
            return False

    except Exception as e:
        print(f"   ❌ FAILED! Exception: {e}\n")
        return False

if __name__ == "__main__":
    print("\n🔍 Testing SUPER_ADMIN analysis creation (cross-organization)")

    success = test_superadmin_analysis()

    print("\n" + "="*60)
    if success:
        print("✅ TEST PASSED - SUPER_ADMIN can create analysis for any org")
    else:
        print("❌ TEST FAILED - SUPER_ADMIN still blocked")
    print("="*60 + "\n")

    sys.exit(0 if success else 1)
