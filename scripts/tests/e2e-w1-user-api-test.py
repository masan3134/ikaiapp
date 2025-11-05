#!/usr/bin/env python3
"""
E2E API Test - USER Role
Worker: W1
Test Account: test-user@test-org-1.com / TestPass123!
"""

import sys
sys.path.append('/home/asan/Desktop/ikai/scripts')

from test_helper import IKAITestHelper
import json
from pathlib import Path

# Test configuration
TEST_USER = {
    "email": "test-user@test-org-1.com",
    "password": "TestPass123!"
}

# Results storage
api_test_results = {
    "authorized_endpoints": [],
    "unauthorized_endpoints": [],
    "rbac_violations": [],
    "performance": {}
}

def test_api_endpoints():
    helper = IKAITestHelper()

    print("="*80)
    print("API ENDPOINT TESTING - USER ROLE")
    print("="*80)

    # Login
    print(f"\n🔐 Logging in as {TEST_USER['email']}...")
    try:
        login_response = helper.login(TEST_USER['email'], TEST_USER['password'])
        print(f"✅ Login successful")
        print(f"   Token: {helper.token[:50]}...")
    except Exception as e:
        print(f"❌ Login failed: {str(e)}")
        return

    print("\n" + "="*80)
    print("TESTING AUTHORIZED ENDPOINTS (USER should access these)")
    print("="*80)

    # Test authorized endpoints
    authorized_tests = [
        {
            'method': 'GET',
            'endpoint': '/api/v1/dashboard',
            'description': 'Get dashboard data',
            'expected_status': 200
        },
        {
            'method': 'GET',
            'endpoint': '/api/v1/profile',
            'description': 'Get own profile',
            'expected_status': 200
        },
        {
            'method': 'GET',
            'endpoint': '/api/v1/notifications',
            'description': 'Get notifications',
            'expected_status': 200
        },
        {
            'method': 'GET',
            'endpoint': '/api/v1/analyses',
            'description': 'Get CV analyses (read-only)',
            'expected_status': 200
        }
    ]

    for test in authorized_tests:
        print(f"\n📊 Testing: {test['description']}")
        print(f"   {test['method']} {test['endpoint']}")

        try:
            if test['method'] == 'GET':
                response = helper.get(test['endpoint'])
            else:
                response = helper.post(test['endpoint'], {})

            status = response.status_code

            if status == test['expected_status']:
                print(f"   ✅ PASS: {status} (expected {test['expected_status']})")

                # Try to parse response
                try:
                    data = response.json()
                    print(f"   📦 Response: {json.dumps(data, indent=2)[:200]}...")
                except:
                    print(f"   📦 Response: {response.text[:100]}...")

                api_test_results['authorized_endpoints'].append({
                    'endpoint': test['endpoint'],
                    'status': status,
                    'result': 'PASS'
                })
            else:
                print(f"   ❌ FAIL: {status} (expected {test['expected_status']})")
                api_test_results['authorized_endpoints'].append({
                    'endpoint': test['endpoint'],
                    'status': status,
                    'expected': test['expected_status'],
                    'result': 'FAIL'
                })
        except Exception as e:
            print(f"   ❌ ERROR: {str(e)}")
            api_test_results['authorized_endpoints'].append({
                'endpoint': test['endpoint'],
                'error': str(e),
                'result': 'ERROR'
            })

    print("\n" + "="*80)
    print("TESTING UNAUTHORIZED ENDPOINTS (USER should NOT access these)")
    print("="*80)

    # Test unauthorized endpoints (RBAC violations)
    unauthorized_tests = [
        {
            'method': 'POST',
            'endpoint': '/api/v1/job-postings',
            'description': 'Create job posting (ADMIN only)',
            'expected_status': 403,
            'payload': {
                'title': 'Test Job',
                'description': 'Test Description',
                'department': 'Engineering'
            }
        },
        {
            'method': 'POST',
            'endpoint': '/api/v1/users',
            'description': 'Create user (ADMIN only)',
            'expected_status': 403,
            'payload': {
                'email': 'test-new-user@example.com',
                'firstName': 'Test',
                'lastName': 'User',
                'role': 'USER'
            }
        },
        {
            'method': 'GET',
            'endpoint': '/api/v1/organizations',
            'description': 'List all organizations (SUPER_ADMIN only)',
            'expected_status': 403
        },
        {
            'method': 'GET',
            'endpoint': '/api/v1/admin/analytics',
            'description': 'View analytics (ADMIN/MANAGER only)',
            'expected_status': 403
        },
        {
            'method': 'DELETE',
            'endpoint': '/api/v1/users/test-user-id',
            'description': 'Delete user (ADMIN only)',
            'expected_status': 403
        }
    ]

    for test in unauthorized_tests:
        print(f"\n🔒 Testing RBAC: {test['description']}")
        print(f"   {test['method']} {test['endpoint']}")

        try:
            if test['method'] == 'GET':
                response = helper.get(test['endpoint'])
            elif test['method'] == 'POST':
                response = helper.post(test['endpoint'], test.get('payload', {}))
            elif test['method'] == 'DELETE':
                response = helper.delete(test['endpoint'])

            status = response.status_code

            if status == test['expected_status']:
                print(f"   ✅ PASS: {status} (correctly blocked)")
                api_test_results['unauthorized_endpoints'].append({
                    'endpoint': test['endpoint'],
                    'status': status,
                    'result': 'PASS - Correctly blocked'
                })
            elif status == 200 or status == 201:
                print(f"   ❌ RBAC VIOLATION: {status} (USER can access restricted endpoint!)")
                api_test_results['rbac_violations'].append({
                    'endpoint': test['endpoint'],
                    'status': status,
                    'severity': 'CRITICAL',
                    'description': 'USER role can access restricted endpoint'
                })
            else:
                print(f"   ⚠️ UNEXPECTED: {status} (expected {test['expected_status']})")
                api_test_results['unauthorized_endpoints'].append({
                    'endpoint': test['endpoint'],
                    'status': status,
                    'expected': test['expected_status'],
                    'result': 'UNEXPECTED'
                })
        except Exception as e:
            print(f"   ❌ ERROR: {str(e)}")
            api_test_results['unauthorized_endpoints'].append({
                'endpoint': test['endpoint'],
                'error': str(e),
                'result': 'ERROR'
            })

    # Save results
    output_path = Path("/home/asan/Desktop/ikai/test-outputs/e2e-w1-user-api-results.json")
    output_path.parent.mkdir(parents=True, exist_ok=True)
    with open(output_path, 'w') as f:
        json.dump(api_test_results, f, indent=2)

    print("\n" + "="*80)
    print("✅ API TESTING COMPLETED!")
    print("="*80)
    print(f"📊 Authorized Endpoints Tested: {len(api_test_results['authorized_endpoints'])}")
    print(f"🔒 Unauthorized Endpoints Tested: {len(api_test_results['unauthorized_endpoints'])}")
    print(f"❌ RBAC Violations Found: {len(api_test_results['rbac_violations'])}")
    print(f"📄 Results saved: {output_path}")

    # Print summary
    if api_test_results['rbac_violations']:
        print("\n🚨 CRITICAL RBAC VIOLATIONS:")
        for violation in api_test_results['rbac_violations']:
            print(f"   - {violation['endpoint']}: {violation['description']}")

if __name__ == "__main__":
    test_api_endpoints()
