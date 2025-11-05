#!/usr/bin/env python3
"""
Simple E2E API Test - USER Role (without test-helper)
"""

import requests
import json

BASE_URL = "http://localhost:8102"
TEST_USER = {
    "email": "test-user@test-org-1.com",
    "password": "TestPass123!"
}

def main():
    print("="*80)
    print("API TESTING - USER ROLE")
    print("="*80)

    # Login
    print(f"\n🔐 Logging in as {TEST_USER['email']}...")
    login_response = requests.post(
        f"{BASE_URL}/api/v1/auth/login",
        json=TEST_USER
    )

    if login_response.status_code != 200:
        print(f"❌ Login failed: {login_response.status_code}")
        print(login_response.text)
        return

    data = login_response.json()
    token = data.get('token')
    user = data.get('user')

    print(f"✅ Login successful")
    print(f"   Role: {user.get('role')}")
    print(f"   Token: {token[:30]}...")

    headers = {'Authorization': f'Bearer {token}'}

    # Test authorized endpoints
    print("\n" + "="*80)
    print("AUTHORIZED ENDPOINTS (USER should access)")
    print("="*80)

    authorized_tests = [
        ('GET', '/api/v1/dashboard', 'Dashboard data'),
        ('GET', '/api/v1/profile', 'Own profile'),
        ('GET', '/api/v1/notifications', 'Notifications'),
        ('GET', '/api/v1/analyses', 'CV Analyses (read-only)')
    ]

    for method, endpoint, desc in authorized_tests:
        print(f"\n📊 {desc}")
        print(f"   {method} {endpoint}")
        try:
            response = requests.get(f"{BASE_URL}{endpoint}", headers=headers)
            if response.status_code == 200:
                print(f"   ✅ PASS: {response.status_code}")
            else:
                print(f"   ❌ FAIL: {response.status_code}")
                print(f"   Response: {response.text[:100]}")
        except Exception as e:
            print(f"   ❌ ERROR: {str(e)}")

    # Test unauthorized endpoints
    print("\n" + "="*80)
    print("UNAUTHORIZED ENDPOINTS (USER should NOT access)")
    print("="*80)

    unauthorized_tests = [
        ('POST', '/api/v1/job-postings', 'Create job posting', {'title': 'Test'}),
        ('POST', '/api/v1/users', 'Create user', {'email': 'test@test.com'}),
        ('GET', '/api/v1/organizations', 'List organizations', None),
        ('GET', '/api/v1/admin/analytics', 'View analytics', None),
        ('GET', '/api/v1/team', 'View team', None)
    ]

    rbac_violations = []

    for method, endpoint, desc, payload in unauthorized_tests:
        print(f"\n🔒 {desc}")
        print(f"   {method} {endpoint}")
        try:
            if method == 'GET':
                response = requests.get(f"{BASE_URL}{endpoint}", headers=headers)
            else:
                response = requests.post(f"{BASE_URL}{endpoint}", headers=headers, json=payload)

            status = response.status_code

            if status == 403:
                print(f"   ✅ PASS: {status} (correctly blocked)")
            elif status in [200, 201]:
                print(f"   ❌ RBAC VIOLATION: {status} (USER can access!)")
                rbac_violations.append(endpoint)
            elif status == 404:
                print(f"   ⚠️ UNEXPECTED: {status} (endpoint not found)")
            else:
                print(f"   ⚠️ UNEXPECTED: {status}")
                print(f"   Response: {response.text[:100]}")
        except Exception as e:
            print(f"   ❌ ERROR: {str(e)}")

    # Summary
    print("\n" + "="*80)
    print("TEST SUMMARY")
    print("="*80)
    print(f"🔒 RBAC Violations: {len(rbac_violations)}")
    if rbac_violations:
        for endpoint in rbac_violations:
            print(f"   - {endpoint}")

    print("\n✅ API Testing complete!")

if __name__ == "__main__":
    main()
