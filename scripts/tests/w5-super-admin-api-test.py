#!/usr/bin/env python3
"""
W5: SUPER_ADMIN API Deep Test
Tests all SUPER_ADMIN-specific API endpoints
"""

import requests
import json
import sys

BASE_URL = "http://localhost:8102"

def test_super_admin_apis():
    """Test SUPER_ADMIN API endpoints"""

    print("=" * 80)
    print("🎯 W5: SUPER_ADMIN API DEEP TEST")
    print("=" * 80)
    print()

    # 1. Login as SUPER_ADMIN
    print("📋 Step 1: Login as SUPER_ADMIN")
    print("-" * 80)

    login_response = requests.post(
        f"{BASE_URL}/api/v1/auth/login",
        json={"email": "info@gaiai.ai", "password": "23235656"},
        headers={"Content-Type": "application/json"}
    )

    if login_response.status_code != 200:
        print(f"❌ CRITICAL: Login failed! Status: {login_response.status_code}")
        print(f"Response: {login_response.text}")
        return False

    login_data = login_response.json()
    token = login_data.get("token")
    user = login_data.get("user")

    print(f"✅ Login successful!")
    print(f"   Email: info@gaiai.ai")
    print(f"   Role: {user.get('role')}")
    print(f"   Token: {token[:20]}...")
    print()

    headers = {"Authorization": f"Bearer {token}"}
    errors = []
    warnings = []

    # 2. Test Organizations API
    print("📋 Step 2: GET /super-admin/organizations")
    print("-" * 80)

    org_response = requests.get(
        f"{BASE_URL}/api/v1/super-admin/organizations",
        headers=headers
    )

    if org_response.status_code != 200:
        errors.append(f"❌ Organizations API failed: {org_response.status_code}")
        print(f"❌ FAILED: Status {org_response.status_code}")
        print(f"Response: {org_response.text}")
    else:
        print(f"✅ API call successful (200 OK)")
        org_data = org_response.json()

        # Check structure
        if 'data' not in org_data:
            errors.append("❌ Missing 'data' field in response")
        else:
            orgs = org_data['data']
            print(f"   Total organizations: {len(orgs)}")

            # Cross-org verification
            if len(orgs) < 3:
                errors.append(f"❌ CRITICAL: Expected at least 3 orgs, got {len(orgs)}")
                print(f"❌ CRITICAL: Cross-org access NOT working!")
            else:
                print(f"✅ Cross-org access working ({len(orgs)} organizations)")

            # Show first 5 orgs
            print(f"\n   First 5 organizations:")
            for i, org in enumerate(orgs[:5], 1):
                print(f"   {i}. {org.get('name', 'N/A')} ({org.get('plan', 'N/A')}) - {org.get('userCount', 0)} users")

            # Check required fields
            if orgs:
                required_fields = ['id', 'name', 'plan', 'userCount', 'createdAt']
                print(f"\n   Organization Fields Verification:")
                for field in required_fields:
                    if field not in orgs[0]:
                        warnings.append(f"⚠️  Missing field in org: {field}")
                        print(f"   ✗ {field} - Missing")
                    else:
                        print(f"   ✓ {field} - Exists")

    print()

    # 3. Test Queue Health API
    print("📋 Step 3: GET /queue/health")
    print("-" * 80)

    queue_response = requests.get(
        f"{BASE_URL}/api/v1/queue/health",
        headers=headers
    )

    if queue_response.status_code != 200:
        errors.append(f"❌ Queue Health API failed: {queue_response.status_code}")
        print(f"❌ FAILED: Status {queue_response.status_code}")
        print(f"Response: {queue_response.text}")
    else:
        print(f"✅ API call successful (200 OK)")
        queue_data = queue_response.json()

        # Check structure (queues field, not data)
        if 'queues' not in queue_data:
            errors.append("❌ Missing 'queues' field in response")
        else:
            queues = queue_data['queues']
            print(f"   Total queues: {len(queues)}")

            # Expected queues (actual names in backend)
            expected_queues = ['analysis-processing', 'offer-processing', 'generic-email',
                             'test-creation', 'feedback-processing']
            found_queues = [q['name'] for q in queues]

            print(f"\n   Queue List:")
            for queue in queues:
                name = queue.get('name', 'N/A')
                waiting = queue.get('waiting', 0)
                active = queue.get('active', 0)
                completed = queue.get('completed', 0)
                failed = queue.get('failed', 0)
                total = queue.get('total', 0)

                print(f"   - {name}:")
                print(f"     Waiting: {waiting}, Active: {active}, Completed: {completed}, Failed: {failed}, Total: {total}")

            # Verify all expected queues exist
            print(f"\n   Expected Queues Verification:")
            for expected in expected_queues:
                if expected in found_queues:
                    print(f"   ✓ {expected} - Found")
                else:
                    warnings.append(f"⚠️  Expected queue missing: {expected}")
                    print(f"   ✗ {expected} - Missing")

            # Check required fields
            if queues:
                required_fields = ['name', 'waiting', 'active', 'completed', 'failed']
                print(f"\n   Queue Fields Verification:")
                for field in required_fields:
                    if field not in queues[0]:
                        warnings.append(f"⚠️  Missing field in queue: {field}")
                        print(f"   ✗ {field} - Missing")
                    else:
                        print(f"   ✓ {field} - Exists")

    print()

    # 4. Test Dashboard Super Admin API
    print("📋 Step 4: GET /dashboard/super-admin")
    print("-" * 80)

    dashboard_response = requests.get(
        f"{BASE_URL}/api/v1/dashboard/super-admin",
        headers=headers
    )

    if dashboard_response.status_code != 200:
        errors.append(f"❌ Super Admin Dashboard API failed: {dashboard_response.status_code}")
        print(f"❌ FAILED: Status {dashboard_response.status_code}")
    else:
        print(f"✅ API call successful (200 OK)")
        dashboard_data = dashboard_response.json()

        # Check main sections
        main_sections = ['overview', 'organizations', 'revenue', 'analytics',
                        'growth', 'systemHealth', 'orgList', 'queues', 'security']

        print(f"\n   Dashboard Sections:")
        for section in main_sections:
            if section in dashboard_data.get('data', {}):
                print(f"   ✓ {section} - Exists")
            else:
                warnings.append(f"⚠️  Missing dashboard section: {section}")
                print(f"   ✗ {section} - Missing")

        # System Health metrics
        if 'systemHealth' in dashboard_data.get('data', {}):
            health = dashboard_data['data']['systemHealth']
            print(f"\n   System Health:")
            print(f"   - Backend: {health.get('backend', 'N/A')}")
            print(f"   - Database: {health.get('database', 'N/A')}")
            print(f"   - Redis: {health.get('redis', 'N/A')}")
            print(f"   - Milvus: {health.get('milvus', 'N/A')}")
            print(f"   - Queues: {health.get('queues', 'N/A')}")

    print()

    # 5. Summary
    print("=" * 80)
    print("📊 TEST SUMMARY")
    print("=" * 80)
    print()

    total_tests = 4
    failed_tests = len([e for e in errors if 'API failed' in e])
    passed_tests = total_tests - failed_tests

    print(f"Total API Tests: {total_tests}")
    print(f"✅ Passed: {passed_tests}")
    print(f"❌ Failed: {failed_tests}")
    print()

    if errors:
        print(f"❌ ERRORS ({len(errors)}):")
        for error in errors:
            print(f"  {error}")
        print()

    if warnings:
        print(f"⚠️  WARNINGS ({len(warnings)}):")
        for warning in warnings:
            print(f"  {warning}")
        print()

    if not errors and not warnings:
        print("🎉 ALL TESTS PASSED - NO ISSUES FOUND!")
        print()
    elif not errors:
        print("✅ NO CRITICAL ERRORS - Some warnings present")
        print()
    else:
        print("❌ CRITICAL ERRORS FOUND - FIX REQUIRED!")
        print()

    print("=" * 80)
    print()

    return len(errors) == 0

if __name__ == "__main__":
    success = test_super_admin_apis()
    sys.exit(0 if success else 1)
