#!/usr/bin/env python3
"""
E2E Dashboard API Test - W6 Cross-Role Testing
Tests all 5 dashboard endpoints and reports HTTP status codes
"""

import sys
import os
import importlib.util

# Load test-helper.py module (dash in filename)
script_dir = os.path.dirname(os.path.abspath(__file__))
helper_path = os.path.join(script_dir, 'test-helper.py')

spec = importlib.util.spec_from_file_location("test_helper", helper_path)
test_helper = importlib.util.module_from_spec(spec)
spec.loader.exec_module(test_helper)

IKAITestHelper = test_helper.IKAITestHelper

def test_all_dashboards():
    """Test all dashboard endpoints for all roles"""

    roles = [
        {
            'name': 'USER',
            'email': 'test-user@test-org-1.com',
            'password': 'TestPass123!',
            'endpoint': '/api/v1/dashboard/user'
        },
        {
            'name': 'HR_SPECIALIST',
            'email': 'test-hr_specialist@test-org-2.com',
            'password': 'TestPass123!',
            'endpoint': '/api/v1/dashboard/hr-specialist'
        },
        {
            'name': 'MANAGER',
            'email': 'test-manager@test-org-1.com',
            'password': 'TestPass123!',
            'endpoint': '/api/v1/dashboard/manager'
        },
        {
            'name': 'ADMIN',
            'email': 'test-admin@test-org-2.com',
            'password': 'TestPass123!',
            'endpoint': '/api/v1/dashboard/admin'
        },
        {
            'name': 'SUPER_ADMIN',
            'email': 'info@gaiai.ai',
            'password': '23235656',
            'endpoint': '/api/v1/dashboard/super-admin'
        }
    ]

    print("=" * 70)
    print("E2E DASHBOARD API TEST")
    print("=" * 70)
    print()

    results = []

    for role_info in roles:
        print(f"🔍 Testing {role_info['name']}...")
        print(f"   Email: {role_info['email']}")
        print(f"   Endpoint: {role_info['endpoint']}")

        helper = IKAITestHelper()

        # Login
        try:
            login_success = helper.login(role_info['email'], role_info['password'])
            if not login_success:
                print(f"   ❌ Login failed")
                results.append({
                    'role': role_info['name'],
                    'success': False,
                    'error': 'Login failed',
                    'status_code': None
                })
                print()
                continue

        except Exception as e:
            print(f"   ❌ Login exception: {str(e)}")
            results.append({
                'role': role_info['name'],
                'success': False,
                'error': f'Login exception: {str(e)}',
                'status_code': None
            })
            print()
            continue

        # Get dashboard data
        try:
            data = helper.get(role_info['endpoint'])

            if data is not None:
                print(f"   ✅ Dashboard API: 200 OK")
                print(f"   📊 Success: {data.get('success', False)}")
                if 'data' in data:
                    print(f"   📦 Data keys: {list(data['data'].keys())[:5]}...")
                results.append({
                    'role': role_info['name'],
                    'success': True,
                    'status_code': 200,
                    'data_keys': list(data.get('data', {}).keys()) if isinstance(data.get('data'), dict) else []
                })
            else:
                print(f"   ❌ Dashboard API: Failed (helper.get returned None)")
                results.append({
                    'role': role_info['name'],
                    'success': False,
                    'status_code': None,
                    'error': 'API returned None (check console output above)'
                })

        except Exception as e:
            print(f"   ❌ Dashboard API exception: {str(e)}")
            results.append({
                'role': role_info['name'],
                'success': False,
                'status_code': None,
                'error': f'API exception: {str(e)}'
            })

        print()

    # Summary
    print("=" * 70)
    print("SUMMARY")
    print("=" * 70)

    successful = [r for r in results if r['success']]
    failed = [r for r in results if not r['success']]

    print(f"✅ Successful: {len(successful)}/5")
    print(f"❌ Failed: {len(failed)}/5")
    print()

    if failed:
        print("Failed roles:")
        for r in failed:
            print(f"  - {r['role']}: Status {r['status_code']}, {r.get('error', 'No error message')[:80]}...")

    print()
    print("=" * 70)

    # Exit with error code if any failed
    return 0 if len(failed) == 0 else 1

if __name__ == '__main__':
    exit(test_all_dashboards())
