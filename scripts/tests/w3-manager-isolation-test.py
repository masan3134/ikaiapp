#!/usr/bin/env python3
"""
W3 - MANAGER Role API Tests
Critical Focus: Department Data Isolation
"""

import sys
import os
sys.path.insert(0, '/home/asan/Desktop/ikai/scripts')

from test_helper import IKAITestHelper
import requests

BASE_URL = "http://localhost:8102"

def main():
    print("=" * 70)
    print("W3 - MANAGER ROLE API TESTS")
    print("=" * 70)
    print("\nAccount: test-manager@test-org-1.com")
    print("Department: Engineering")
    print("Critical Test: Department Data Isolation\n")

    helper = IKAITestHelper()

    # 1. LOGIN
    print("=" * 70)
    print("TEST 1: LOGIN AS MANAGER")
    print("=" * 70)

    success = helper.login("test-manager@test-org-1.com", "TestPass123!")

    if not success:
        print("\n❌ Login failed - cannot continue tests")
        sys.exit(1)

    print(f"\n✅ Logged in successfully")
    print(f"Role: {helper.user_info.get('role')}")
    print(f"Organization: {helper.user_info.get('organizationId')}")
    print(f"Department: {helper.user_info.get('department', 'N/A')}")

    # 2. DEPARTMENT DATA ISOLATION - CANDIDATES
    print("\n" + "=" * 70)
    print("TEST 2: DEPARTMENT ISOLATION - CANDIDATES (CRITICAL)")
    print("=" * 70)

    print("\n🔍 Fetching candidates (should only see Engineering dept)...")

    try:
        response = requests.get(
            f"{BASE_URL}/api/v1/candidates",
            headers={
                "Authorization": f"Bearer {helper.token}",
                "Content-Type": "application/json"
            }
        )

        print(f"\nStatus: {response.status_code}")

        if response.status_code == 200:
            candidates = response.json()

            if isinstance(candidates, list):
                print(f"✅ Candidates returned: {len(candidates)}")

                # Check departments
                departments = set()
                for candidate in candidates:
                    dept = candidate.get('department') or candidate.get('jobPosting', {}).get('department')
                    if dept:
                        departments.add(dept)
                    print(f"   - {candidate.get('name', 'Unknown')}: {dept or 'NO DEPARTMENT'}")

                print(f"\n📊 Departments found: {departments}")

                if len(departments) == 0:
                    print("⚠️  No department info in candidates")
                elif len(departments) == 1 and 'Engineering' in departments:
                    print("✅ PASS: Only Engineering department visible")
                elif len(departments) > 1:
                    print(f"❌ FAIL: Multiple departments visible: {departments}")
                    print("   SECURITY ISSUE: Department isolation broken!")
                elif 'Engineering' not in departments:
                    print(f"❌ FAIL: Wrong department visible: {departments}")
                    print("   Expected: Engineering")

            elif isinstance(candidates, dict):
                # Might be paginated
                data = candidates.get('data', [])
                print(f"✅ Candidates returned (paginated): {len(data)}")
                # Same check as above
                departments = set()
                for candidate in data:
                    dept = candidate.get('department') or candidate.get('jobPosting', {}).get('department')
                    if dept:
                        departments.add(dept)

                print(f"\n📊 Departments found: {departments}")

                if 'Engineering' in departments and len(departments) == 1:
                    print("✅ PASS: Only Engineering department visible")
                else:
                    print(f"❌ FAIL: Unexpected departments: {departments}")

        elif response.status_code == 404:
            print("⚠️  Candidates endpoint not found (404)")
        else:
            print(f"❌ Error: {response.status_code}")
            print(f"   {response.text[:200]}")

    except Exception as e:
        print(f"❌ Test failed: {e}")

    # 3. CROSS-DEPARTMENT ACCESS ATTEMPT
    print("\n" + "=" * 70)
    print("TEST 3: CROSS-DEPARTMENT ACCESS ATTEMPT")
    print("=" * 70)

    print("\n🔒 Trying to access Sales department data (should FAIL)...")

    try:
        # Try with department filter
        response = requests.get(
            f"{BASE_URL}/api/v1/candidates?department=Sales",
            headers={
                "Authorization": f"Bearer {helper.token}",
                "Content-Type": "application/json"
            }
        )

        print(f"Status: {response.status_code}")

        if response.status_code == 403:
            print("✅ PASS: 403 Forbidden (correct behavior)")
        elif response.status_code == 200:
            data = response.json()
            candidates = data if isinstance(data, list) else data.get('data', [])

            if len(candidates) == 0:
                print("✅ PASS: Empty result (correct behavior)")
            else:
                print(f"❌ FAIL: Returned {len(candidates)} candidates from Sales")
                print("   SECURITY ISSUE: Cross-department access allowed!")
        else:
            print(f"⚠️  Unexpected status: {response.status_code}")

    except Exception as e:
        print(f"❌ Test failed: {e}")

    # 4. RBAC VIOLATION - ADMIN ENDPOINTS
    print("\n" + "=" * 70)
    print("TEST 4: RBAC VIOLATION - ADMIN ENDPOINTS")
    print("=" * 70)

    print("\n🔒 Trying to access admin-only endpoints (should all FAIL)...")

    admin_endpoints = [
        ("/api/v1/organization", "Organization settings"),
        ("/api/v1/users", "User management"),
        ("/api/v1/billing", "Billing info"),
        ("/api/v1/admin/system", "System admin"),
    ]

    for endpoint, name in admin_endpoints:
        try:
            response = requests.get(
                f"{BASE_URL}{endpoint}",
                headers={
                    "Authorization": f"Bearer {helper.token}",
                    "Content-Type": "application/json"
                }
            )

            if response.status_code == 403:
                print(f"   ✅ {name}: 403 Forbidden (correct)")
            elif response.status_code == 401:
                print(f"   ✅ {name}: 401 Unauthorized (correct)")
            elif response.status_code == 404:
                print(f"   ⚠️  {name}: 404 Not Found")
            elif response.status_code == 200:
                print(f"   ❌ {name}: 200 OK (SECURITY ISSUE!)")
            else:
                print(f"   ⚠️  {name}: {response.status_code}")

        except Exception as e:
            print(f"   ⚠️  {name}: Error - {e}")

    # SUMMARY
    print("\n" + "=" * 70)
    print("API TEST SUMMARY - MANAGER ROLE")
    print("=" * 70)

    print(f"""
✅ Tests Completed: 4

🔍 Critical Checks:
   1. Department Isolation (Candidates) - Check results above
   2. Cross-Department Access Blocked - Check results above
   3. Admin Endpoints Blocked - Check results above

📊 Account Info:
   Email: test-manager@test-org-1.com
   Role: {helper.user_info.get('role')}
   Department: Engineering
   Organization: {helper.user_info.get('organizationId')}

⚠️  IMPORTANT:
   - All department data MUST be Engineering only
   - Cross-department access MUST be blocked (403 or empty)
   - Admin endpoints MUST return 403/401

📋 Next Steps:
   1. Review all test results above
   2. Document any FAIL or SECURITY ISSUE
   3. Combine with Playwright E2E test results
   4. Create comprehensive report
    """)

    print("\n✅ API tests completed!")

if __name__ == "__main__":
    main()
