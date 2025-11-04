#!/usr/bin/env python3
"""
Create Test Candidates for Interview Testing
"""

import requests
import json

BASE_URL = 'http://localhost:8102'

print("=" * 80)
print("CREATE TEST CANDIDATES")
print("=" * 80)

# Login as SUPER_ADMIN
print("\n[1] Login as SUPER_ADMIN...")
r = requests.post(f'{BASE_URL}/api/v1/auth/login',
                  json={'email': 'info@gaiai.ai', 'password': '23235656'})

if r.status_code != 200:
    print(f"❌ Login failed: {r.status_code}")
    exit(1)

token = r.json().get('token')
headers = {'Authorization': f'Bearer {token}'}
print("✅ Logged in")

# Get job postings (need one for candidates)
print("\n[2] Fetch job postings...")
r = requests.get(f'{BASE_URL}/api/v1/job-postings',
                 headers=headers,
                 params={'page': 1, 'limit': 10})

job_postings = []
if r.status_code == 200:
    job_postings = r.json().get('data', {}).get('jobPostings', [])
    print(f"✅ Found {len(job_postings)} job postings")
else:
    print(f"⚠️  No job postings found")

# Use first job posting or create without one
job_posting_id = job_postings[0]['id'] if len(job_postings) > 0 else None

if job_posting_id:
    print(f"   Using job posting: {job_postings[0].get('title', 'N/A')}")
else:
    print("   No job posting available (will create candidate without job)")

# Create test candidates
print("\n[3] Creating test candidates...")

test_candidates = [
    {
        "firstName": "Ali",
        "lastName": "Yılmaz",
        "email": "ali.yilmaz@example.com",
        "phone": "+90 532 111 1111",
        "desiredPosition": "Frontend Developer",
        "source": "LinkedIn"
    },
    {
        "firstName": "Ayşe",
        "lastName": "Demir",
        "email": "ayse.demir@example.com",
        "phone": "+90 532 222 2222",
        "desiredPosition": "Backend Developer",
        "source": "Kariyer.net"
    },
    {
        "firstName": "Mehmet",
        "lastName": "Kaya",
        "email": "mehmet.kaya@example.com",
        "phone": "+90 532 333 3333",
        "desiredPosition": "Full Stack Developer",
        "source": "Website"
    },
    {
        "firstName": "Fatma",
        "lastName": "Şahin",
        "email": "fatma.sahin@example.com",
        "phone": "+90 532 444 4444",
        "desiredPosition": "DevOps Engineer",
        "source": "Referral"
    },
    {
        "firstName": "Can",
        "lastName": "Öztürk",
        "email": "can.ozturk@example.com",
        "phone": "+90 532 555 5555",
        "desiredPosition": "Product Manager",
        "source": "LinkedIn"
    }
]

created_count = 0
failed_count = 0

for candidate_data in test_candidates:
    if job_posting_id:
        candidate_data['jobPostingId'] = job_posting_id

    r = requests.post(f'{BASE_URL}/api/v1/candidates',
                      headers=headers,
                      json=candidate_data)

    if r.status_code == 201:
        created_count += 1
        print(f"✅ Created: {candidate_data['firstName']} {candidate_data['lastName']}")
    else:
        failed_count += 1
        print(f"❌ Failed: {candidate_data['firstName']} {candidate_data['lastName']}")
        print(f"   Status: {r.status_code}")
        print(f"   Error: {r.text[:100]}")

print(f"\n📊 RESULTS:")
print(f"   ✅ Created: {created_count}")
print(f"   ❌ Failed: {failed_count}")

# Verify candidates are visible in interview wizard
print("\n[4] Verify candidates are visible...")
r = requests.get(f'{BASE_URL}/api/v1/interviews/candidates/recent',
                 headers=headers,
                 params={'limit': 10})

if r.status_code == 200:
    candidates = r.json().get('data', [])
    print(f"✅ Interview wizard can see {len(candidates)} candidates")

    if len(candidates) > 0:
        print("\n✅ SUCCESS! Candidates are now visible in interview wizard:")
        for candidate in candidates:
            print(f"   - {candidate.get('firstName')} {candidate.get('lastName')}")
    else:
        print("\n⚠️  WARNING: Candidates created but not visible in interview wizard")
        print("   This might be a backend issue with the getRecentCandidates endpoint")
else:
    print(f"❌ Failed to verify: {r.status_code}")

print("\n" + "=" * 80)
print("TEST DATA CREATION COMPLETE")
print("=" * 80)
print("\n💡 TIP: Refresh your browser to see the new candidates!")
