#!/usr/bin/env python3
"""
Complete Workflow Test Template
Test full hiring workflow: Upload CV → Analyze → Offer → Interview

Usage:
  cp scripts/templates/workflow-test-template.py scripts/tests/w2-workflow.py
  python3 scripts/tests/w2-workflow.py > test-outputs/w2-workflow-output.txt
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(__file__)))

from test_helper import IKAITestHelper, TEST_USERS
import requests
import time
import json

def upload_cv(helper, cv_path, job_id):
    """Upload CV for analysis"""
    print(f"   Uploading: {os.path.basename(cv_path)}")

    with open(cv_path, 'rb') as f:
        files = {'file': (os.path.basename(cv_path), f, 'text/plain')}
        data = {'jobPostingId': job_id}

        response = requests.post(
            'http://localhost:8102/api/v1/analyses',
            headers={'Authorization': f'Bearer {helper.token}'},
            files=files,
            data=data
        )

        if response.status_code == 201:
            analysis = response.json()
            print(f"   ✅ Analysis created: {analysis['id']}")
            return analysis['id']
        else:
            print(f"   ❌ Upload failed: {response.status_code}")
            print(f"   Error: {response.text}")
            return None

def wait_for_analysis(helper, analysis_id, max_wait=120):
    """Wait for analysis to complete"""
    print(f"   Waiting for analysis (max {max_wait}s)...")

    waited = 0
    while waited < max_wait:
        analysis = helper.get(f"/api/v1/analyses/{analysis_id}")
        status = analysis['status']

        if status == 'COMPLETED':
            print(f"   ✅ Analysis completed (waited {waited}s)")
            return analysis
        elif status == 'FAILED':
            print(f"   ❌ Analysis failed")
            return analysis

        time.sleep(10)
        waited += 10
        print(f"   ⏳ Still processing... ({waited}s)")

    print(f"   ⚠️ Timeout after {max_wait}s")
    return None

def main():
    helper = IKAITestHelper()

    print("=" * 60)
    print("WORKFLOW TEST: Complete Hiring Process")
    print("=" * 60)

    # Step 1: Login as HR Specialist
    print("\n📋 Step 1: Login as HR Specialist")
    user = TEST_USERS["org1_hr"]
    helper.login(user["email"], user["password"])
    print(f"✅ Logged in as {user['email']}")

    # Step 2: Get job posting
    print("\n📋 Step 2: Get job posting")
    jobs = helper.get("/api/v1/job-postings")
    print(f"✅ Found {len(jobs)} job postings")

    if len(jobs) == 0:
        print("❌ No job postings available. Create one first!")
        return

    job = jobs[0]
    job_id = job["id"]
    print(f"   Using: {job['title']} ({job_id[:8]}...)")

    # Step 3: Upload CV
    print("\n📋 Step 3: Upload CV for analysis")
    cv_path = "test-data/cvs/org1-junior-frontend-developer/cv-01-high-match.txt"

    if not os.path.exists(cv_path):
        print(f"❌ CV file not found: {cv_path}")
        return

    analysis_id = upload_cv(helper, cv_path, job_id)

    if not analysis_id:
        print("❌ CV upload failed")
        return

    # Step 4: Wait for AI analysis
    print("\n📋 Step 4: Wait for AI analysis")
    analysis = wait_for_analysis(helper, analysis_id)

    if not analysis:
        print("❌ Analysis failed or timeout")
        return

    candidate_id = analysis['candidateId']
    match_score = analysis.get('matchScore', 'N/A')
    print(f"✅ Match score: {match_score}%")
    print(f"   Candidate ID: {candidate_id}")

    # Step 5: Login as MANAGER (for offer creation)
    print("\n📋 Step 5: Login as MANAGER (offer permission)")
    manager = TEST_USERS["org1_manager"]
    helper.login(manager["email"], manager["password"])
    print(f"✅ Logged in as MANAGER")

    # Step 6: Create offer
    print("\n📋 Step 6: Create offer")
    offer_data = {
        "candidateId": candidate_id,
        "jobPostingId": job_id,
        "offerDate": "2025-11-10",
        "salary": 50000,
        "currency": "TRY",
        "startDate": "2025-12-01",
        "notes": "Competitive offer for excellent candidate"
    }

    offer = helper.post("/api/v1/offers", offer_data)
    offer_id = offer['id']
    print(f"✅ Offer created: {offer_id}")
    print(f"   Salary: {offer['salary']} {offer['currency']}")

    # Step 7: Schedule interview
    print("\n📋 Step 7: Schedule interview")
    interview_data = {
        "candidateId": candidate_id,
        "jobPostingId": job_id,
        "scheduledAt": "2025-11-08T14:00:00Z",
        "interviewType": "TECHNICAL",
        "location": "Istanbul Office - Meeting Room 2",
        "notes": "Technical interview - React + TypeScript focus"
    }

    interview = helper.post("/api/v1/interviews", interview_data)
    interview_id = interview['id']
    print(f"✅ Interview scheduled: {interview_id}")
    print(f"   Date: {interview['scheduledAt']}")
    print(f"   Type: {interview['interviewType']}")

    # Step 8: Summary
    print("\n" + "=" * 60)
    print("✅ WORKFLOW COMPLETE")
    print("=" * 60)

    print(f"\nWorkflow Summary:")
    print(f"  Job Posting ID: {job_id}")
    print(f"  Analysis ID: {analysis_id}")
    print(f"  Candidate ID: {candidate_id}")
    print(f"  Match Score: {match_score}%")
    print(f"  Offer ID: {offer_id}")
    print(f"  Interview ID: {interview_id}")

    print(f"\n🎯 Next Steps:")
    print(f"  - Complete interview (update status)")
    print(f"  - Update offer status (ACCEPTED/REJECTED)")
    print(f"  - Cleanup test data (delete offer, interview, analysis)")

if __name__ == "__main__":
    main()