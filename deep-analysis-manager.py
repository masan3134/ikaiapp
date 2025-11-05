#!/usr/bin/env python3
"""Deep Analysis - MANAGER Dashboard Issues"""

import requests
import json

BASE_URL = "http://localhost:8102"

print("=" * 70)
print("DEEP ANALYSIS - MANAGER DASHBOARD ISSUES")
print("=" * 70)

# Login
print("\n1. LOGIN...")
login_response = requests.post(
    f"{BASE_URL}/api/v1/auth/login",
    json={"email": "test-manager@test-org-1.com", "password": "TestPass123!"}
)

if login_response.status_code != 200:
    print(f"❌ Login failed: {login_response.status_code}")
    exit(1)

data = login_response.json()
token = data.get("token")
headers = {"Authorization": f"Bearer {token}"}

print("✅ Login successful")

# Test dashboard endpoints
print("\n2. TESTING DASHBOARD ENDPOINTS...")

dashboard_endpoints = [
    "/api/v1/dashboard",
    "/api/v1/dashboard/manager",
    "/api/v1/dashboard/stats",
]

for endpoint in dashboard_endpoints:
    print(f"\n   Testing: {endpoint}")
    response = requests.get(f"{BASE_URL}{endpoint}", headers=headers)
    print(f"   Status: {response.status_code}")
    
    if response.status_code == 200:
        print(f"   ✅ SUCCESS")
        try:
            data = response.json()
            print(f"   Keys: {list(data.keys())[:5]}")
        except:
            print(f"   ⚠️ Invalid JSON")
    elif response.status_code == 404:
        print(f"   ❌ NOT FOUND")
    elif response.status_code == 500:
        print(f"   ❌ SERVER ERROR")
        print(f"   Error: {response.text[:200]}")
    else:
        print(f"   ⚠️ Status: {response.status_code}")

# Test user department field
print("\n3. USER DEPARTMENT FIELD...")
user_response = requests.get(f"{BASE_URL}/api/v1/auth/me", headers=headers)
if user_response.status_code == 200:
    user = user_response.json()
    user_obj = user.get('user', {})
    print(f"   User fields: {list(user_obj.keys())}")
    print(f"   Department field exists: {'department' in user_obj}")
    print(f"   Department value: {user_obj.get('department', 'N/A')}")

# Test candidate with full details
print("\n4. CANDIDATE DETAILS...")
candidates_response = requests.get(f"{BASE_URL}/api/v1/candidates", headers=headers)
if candidates_response.status_code == 200:
    candidates_data = candidates_response.json()
    candidates = candidates_data.get('candidates', [])
    
    if candidates:
        first = candidates[0]
        print(f"   Candidate fields: {list(first.keys())}")
        print(f"   Has department: {'department' in first}")
        print(f"   Has jobPosting: {'jobPosting' in first}")
        
        if 'jobPosting' in first and first['jobPosting']:
            jp = first['jobPosting']
            print(f"   JobPosting fields: {list(jp.keys())}")
            print(f"   JobPosting has department: {'department' in jp}")

# Test organization structure
print("\n5. ORGANIZATION STRUCTURE...")
org_response = requests.get(f"{BASE_URL}/api/v1/organization", headers=headers)
print(f"   Status: {org_response.status_code}")
if org_response.status_code == 200:
    print(f"   ✅ Organization endpoint accessible (SHOULD BE 403!)")
elif org_response.status_code == 403:
    print(f"   ✅ Correctly blocked")
elif org_response.status_code == 404:
    print(f"   ⚠️ 404 (should be 403)")

print("\n" + "=" * 70)
print("DEEP ANALYSIS COMPLETE")
print("=" * 70)
