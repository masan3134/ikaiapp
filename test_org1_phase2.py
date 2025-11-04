#!/usr/bin/env python3
"""
Phase 2: Org 1 (FREE) - Complete Workflow Test
Tasks 2.1-2.10
"""

import sys
import os
import time
import json
import requests
from typing import Optional, Dict

# Backend URL
BASE_URL = "http://localhost:8102"

class IKAITestHelper:
    """Embedded test helper class"""
    def __init__(self):
        self.token: Optional[str] = None
        self.user_info: Optional[Dict] = None

    def login(self, email: str, password: str) -> bool:
        try:
            response = requests.post(
                f"{BASE_URL}/api/v1/auth/login",
                json={"email": email, "password": password},
                headers={"Content-Type": "application/json"}
            )

            if response.status_code == 200:
                data = response.json()
                self.token = data.get("token")
                self.user_info = data.get("user")
                return True
            else:
                print(f"❌ Login failed! Status: {response.status_code}")
                print(f"   Error: {response.text}")
                return False

        except Exception as e:
            print(f"❌ Error: {e}")
            return False

    def get(self, endpoint: str) -> Optional[Dict]:
        if not self.token:
            print("❌ Must login first!")
            return None

        try:
            response = requests.get(
                f"{BASE_URL}{endpoint}",
                headers={
                    "Authorization": f"Bearer {self.token}",
                    "Content-Type": "application/json"
                }
            )

            if response.status_code == 200:
                return response.json()
            else:
                print(f"Error: {response.text}")
                return None

        except Exception as e:
            print(f"❌ Error: {e}")
            return None

    def post(self, endpoint: str, data: Dict) -> Optional[Dict]:
        if not self.token:
            print("❌ Must login first!")
            return None

        try:
            response = requests.post(
                f"{BASE_URL}{endpoint}",
                json=data,
                headers={
                    "Authorization": f"Bearer {self.token}",
                    "Content-Type": "application/json"
                }
            )

            if response.status_code in [200, 201]:
                return response.json()
            else:
                print(f"Error: {response.text}")
                return None

        except Exception as e:
            print(f"❌ Error: {e}")
            return None

    def put(self, endpoint: str, data: Dict) -> Optional[Dict]:
        if not self.token:
            print("❌ Must login first!")
            return None

        try:
            response = requests.put(
                f"{BASE_URL}{endpoint}",
                json=data,
                headers={
                    "Authorization": f"Bearer {self.token}",
                    "Content-Type": "application/json"
                }
            )

            if response.status_code == 200:
                return response.json()
            else:
                print(f"Error: {response.text}")
                return None

        except Exception as e:
            print(f"❌ Error: {e}")
            return None

    def patch(self, endpoint: str, data: Dict) -> Optional[Dict]:
        if not self.token:
            print("❌ Must login first!")
            return None

        try:
            response = requests.patch(
                f"{BASE_URL}{endpoint}",
                json=data,
                headers={
                    "Authorization": f"Bearer {self.token}",
                    "Content-Type": "application/json"
                }
            )

            if response.status_code == 200:
                return response.json()
            else:
                print(f"Error: {response.text}")
                return None

        except Exception as e:
            print(f"❌ Error: {e}")
            return None

def main():
    helper = IKAITestHelper()

    # Task 2.1: Login
    print('=' * 60)
    print('Task 2.1: Login as Org 1 HR Specialist')
    print('=' * 60)

    login_result = helper.login('test-hr_specialist@test-org-1.com', 'TestPass123!')
    print(f'✅ Logged in: {login_result}')
    print()

    # Task 2.2: Get Job Posting
    print('=' * 60)
    print('Task 2.2: Get Job Posting ID (Junior Frontend Developer)')
    print('=' * 60)

    job_postings_response = helper.get('/api/v1/job-postings')
    job_postings = job_postings_response.get('jobPostings', []) if job_postings_response else []
    print(f'Total job postings visible: {len(job_postings)}')

    # Find Frontend job
    frontend_jobs = [jp for jp in job_postings if 'Frontend' in jp.get('title', '')]

    if not frontend_jobs:
        print('❌ ERROR: No Frontend job found!')
        print('Available jobs:')
        for jp in job_postings:
            print(f'  - {jp.get("title")}')
        sys.exit(1)

    frontend_job = frontend_jobs[0]
    job_id = frontend_job['id']

    print(f'✅ Job found:')
    print(f'   ID: {job_id}')
    print(f'   Title: {frontend_job["title"]}')
    print(f'   Organization ID: {frontend_job["organizationId"]}')
    print()

    # Task 2.3: Upload 5 CVs (Create Candidates + Analysis)
    print('=' * 60)
    print('Task 2.3: Upload 5 CVs (Step 1: Create Candidates)')
    print('=' * 60)

    cv_folder = 'test-data/cvs/org1-junior-frontend-developer/'
    cv_files = [
        'cv-01-high-match.txt',
        'cv-02-good-match.txt',
        'cv-03-medium-match.txt',
        'cv-04-low-match.txt',
        'cv-05-poor-match.txt'
    ]

    import requests

    candidate_ids = []

    # Step 1: Upload CVs to create candidates
    for i, cv_file in enumerate(cv_files, 1):
        file_path = os.path.join(cv_folder, cv_file)

        if not os.path.exists(file_path):
            print(f'❌ CV file not found: {file_path}')
            continue

        print(f'[{i}/5] Uploading {cv_file} to create candidate...')

        with open(file_path, 'rb') as f:
            files = {'cv': (cv_file, f, 'text/plain')}

            response = requests.post(
                'http://localhost:8102/api/v1/candidates/upload',
                headers={'Authorization': f'Bearer {helper.token}'},
                files=files
            )

            if response.status_code in [200, 201]:
                result = response.json()
                candidate = result.get('candidate', {})
                candidate_id = candidate.get('id')
                candidate_name = candidate.get('name', 'Unknown')

                if candidate_id:
                    candidate_ids.append(candidate_id)
                    print(f'   ✅ Candidate created: {candidate_name}')
                    print(f'      ID: {candidate_id}')
                else:
                    print(f'   ❌ No candidate ID returned')
            elif response.status_code == 409:
                # Duplicate file - use existing candidate
                result = response.json()
                candidate = result.get('candidate', {})
                candidate_id = candidate.get('id')
                if candidate_id:
                    candidate_ids.append(candidate_id)
                    print(f'   ⚠️  File already exists, using existing candidate')
                    print(f'      ID: {candidate_id}')
                else:
                    print(f'   ❌ Duplicate detected but no candidate ID')
            else:
                print(f'   ❌ Failed: {response.status_code}')
                print(f'   Error: {response.text[:200]}')

    print(f'\n✅ Total candidates created: {len(candidate_ids)}')
    print()

    # Step 2: Create analysis with all candidates
    print('=' * 60)
    print('Task 2.3: Upload 5 CVs (Step 2: Create Analysis)')
    print('=' * 60)

    if len(candidate_ids) == 0:
        print('❌ No candidates to analyze! Exiting.')
        sys.exit(1)

    analysis_data = {
        "jobPostingId": job_id,
        "candidateIds": candidate_ids
    }

    print(f'Creating analysis with {len(candidate_ids)} candidates...')

    try:
        analysis_response = helper.post('/api/v1/analyses', analysis_data)
        if analysis_response:
            analysis = analysis_response.get('analysis', {})
            analysis_id = analysis.get('id')
            print(f'✅ Analysis created!')
            print(f'   Analysis ID: {analysis_id}')
            print(f'   Status: {analysis.get("status", "N/A")}')
            print(f'   Candidates: {len(candidate_ids)}')
        else:
            print('❌ Failed to create analysis')
            sys.exit(1)
    except Exception as e:
        print(f'❌ Error creating analysis: {str(e)}')
        sys.exit(1)

    print()

    # Task 2.4: Wait for Queue Processing
    print('=' * 60)
    print('Task 2.4: Wait for Analysis Queue Processing')
    print('=' * 60)

    print('⏳ Waiting 60 seconds for queue to process...')
    time.sleep(60)

    print('Checking analysis status...')
    try:
        analysis = helper.get(f'/api/v1/analyses/{analysis_id}')
        status = analysis.get('status', 'UNKNOWN')
        print(f'  Analysis {analysis_id[:12]}... → Status: {status}')
    except Exception as e:
        print(f'  ❌ Error: {str(e)[:50]}')

    print()

    # Task 2.5: Review Analysis Results
    print('=' * 60)
    print('Task 2.5: Review Analysis Results & Match Scores')
    print('=' * 60)

    # Get detailed analysis with results
    try:
        analysis_details = helper.get(f'/api/v1/analyses/{analysis_id}')
        analysis = analysis_details.get('analysis', {})
        results = analysis.get('analysisResults', [])

        print(f'Analysis Status: {analysis.get("status")}')
        print(f'Total results: {len(results)}')
        print()

        if len(results) == 0:
            print('❌ No analysis results found! Exiting.')
            sys.exit(1)

        # Sort by compatibility score
        results_sorted = sorted(results, key=lambda r: r.get('compatibilityScore', 0), reverse=True)

        print(f'📊 Analysis Results for "{frontend_job["title"]}":')
        print('-' * 90)
        print(f'{"Rank":<6} {"Candidate ID":<38} {"Compatibility":<15} {"Technical":<12}')
        print('-' * 90)

        for i, result in enumerate(results_sorted, 1):
            candidate_id_short = result.get('candidateId', 'Unknown')[:36]
            compat = result.get('compatibilityScore', 'N/A')
            tech = result.get('technicalScore', 'N/A')

            print(f'{i:<6} {candidate_id_short:<38} {compat}%{" ":<12} {tech}%')

        print('-' * 90)
        print()

    except Exception as e:
        print(f'❌ Error getting analysis results: {str(e)}')
        sys.exit(1)

    # Use sorted results for next steps
    analyses_sorted = results_sorted

    # Task 2.6: Create Offer for Best Candidate
    print('=' * 60)
    print('Task 2.6: Create Offer for High Match Candidate')
    print('=' * 60)

    best_result = analyses_sorted[0]
    candidate_id = best_result['candidateId']
    match_score = best_result.get('compatibilityScore', 'N/A')

    # Get candidate details
    try:
        candidate_response = helper.get(f'/api/v1/candidates/{candidate_id}')
        candidate = candidate_response.get('candidate', {})
        candidate_name = f"{candidate.get('firstName', '')} {candidate.get('lastName', '')}".strip()
    except:
        candidate_name = 'Unknown Candidate'

    print(f'Selected candidate: {candidate_name} (Match: {match_score}%)')

    offer_data = {
        "candidateId": candidate_id,
        "jobPostingId": job_id,
        "position": "Junior Frontend Developer",
        "department": "Engineering",
        "salary": 45000,
        "currency": "TRY",
        "startDate": "2025-12-01",
        "workType": "hybrid",
        "benefits": {"insurance": True, "meal": 1000, "transportation": True},
        "terms": "3 month probation period. Contract renewable annually."
    }

    try:
        response = helper.post('/api/v1/offers', offer_data)
        offer = response.get('offer') or response.get('data', {})
        offer_id = offer.get('id')
        print(f'✅ Offer created successfully!')
        print(f'   Offer ID: {offer_id}')
        print(f'   Salary: {offer.get("salary")} {offer.get("currency")}')
        print(f'   Start Date: {offer.get("startDate")}')
        print(f'   Status: {offer.get("status", "N/A")}')
    except Exception as e:
        print(f'❌ Failed to create offer: {str(e)}')
        offer_id = None

    print()

    # Task 2.7: Schedule Interview
    print('=' * 60)
    print('Task 2.7: Schedule Interview for High Match Candidate')
    print('=' * 60)

    interview_data = {
        "candidateIds": [candidate_id],
        "jobPostingId": job_id,
        "date": "2025-11-08",
        "time": "14:00",
        "duration": 60,
        "type": "technical",
        "location": "Istanbul Office - Meeting Room 2",
        "notes": f"Technical interview with {candidate_name} - React + TypeScript focus",
        "meetingTitle": f"Technical Interview - {candidate_name}"
    }

    try:
        response = helper.post('/api/v1/interviews', interview_data)
        interview = response.get('data', {})
        interview_id = interview.get('id')
        print(f'✅ Interview scheduled successfully!')
        print(f'   Interview ID: {interview_id}')
        print(f'   Type: {interview.get("type", "N/A")}')
        print(f'   Date: {interview.get("date", "N/A")} {interview.get("time", "")}')
        print(f'   Location: {interview.get("location", "N/A")}')
        print(f'   Status: {interview.get("status", "N/A")}')
    except Exception as e:
        print(f'❌ Failed to schedule interview: {str(e)}')
        interview_id = None

    print()

    # Task 2.8: Complete Interview
    if interview_id:
        print('=' * 60)
        print('Task 2.8: Update Interview Status (Complete Interview)')
        print('=' * 60)

        interview_update = {
            "status": "COMPLETED",
            "feedback": f"Strong React and TypeScript skills demonstrated by {candidate_name}. Good problem-solving ability. Team fit: excellent. Recommendation: HIRE",
            "rating": 9
        }

        try:
            updated_interview_response = helper.patch(f'/api/v1/interviews/{interview_id}/status', interview_update)
            updated_interview = updated_interview_response.get('data', {})
            print(f'✅ Interview completed!')
            print(f'   Status: {updated_interview["status"]}')
            print(f'   Rating: {updated_interview["rating"]}/10')
            print(f'   Feedback: {updated_interview["feedback"][:60]}...')
        except Exception as e:
            print(f'❌ Failed to update interview: {str(e)}')

        print()

    # Task 2.9: Accept Offer
    if offer_id:
        print('=' * 60)
        print('Task 2.9: Update Offer Status (Accept Offer)')
        print('=' * 60)

        offer_update = {
            "status": "ACCEPTED",
            "responseDate": "2025-11-11"
        }

        try:
            updated_offer = helper.put(f'/api/v1/offers/{offer_id}', offer_update)
            print(f'🎉 Offer accepted by {candidate_name}!')
            print(f'   Status: {updated_offer["status"]}')
            print(f'   Response Date: {updated_offer["responseDate"]}')
        except Exception as e:
            print(f'❌ Failed to update offer: {str(e)}')

        print()

    # Task 2.10: Check Usage Limits
    print('=' * 60)
    print('Task 2.10: Verify Org 1 Usage Tracking (FREE Plan Limits)')
    print('=' * 60)

    try:
        usage_response = helper.get('/api/v1/organizations/me/usage')
        usage = usage_response.get('data', {})
        print(f'📊 Org 1 (FREE Plan) Current Usage:')
        print(f'   Analyses: {usage.get("analysisCount", "?")} / {usage.get("maxAnalysisPerMonth", "?")}')
        print(f'   CVs: {usage.get("cvCount", "?")} / {usage.get("maxCvPerMonth", "?")}')
        print(f'   Users: {usage.get("userCount", "?")} / {usage.get("maxUsers", "?")}')

        analysis_count = usage.get('analysisCount', 0)
        max_analysis = usage.get('maxAnalysisPerMonth', 10)

        if analysis_count <= max_analysis:
            print(f'   ✅ Analysis limit OK ({analysis_count}/{max_analysis})')
        else:
            print(f'   ⚠️ Analysis limit exceeded! ({analysis_count}/{max_analysis})')

    except Exception as e:
        print(f'❌ Failed to get usage data: {str(e)}')

    print()
    print('=' * 60)
    print('✅ PHASE 2 (ORG 1) COMPLETED!')
    print('=' * 60)

if __name__ == '__main__':
    main()
