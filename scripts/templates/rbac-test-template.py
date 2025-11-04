#!/usr/bin/env python3
"""
RBAC Test Template
Test role-based access control across multiple roles

Usage:
  cp scripts/templates/rbac-test-template.py scripts/tests/w1-rbac-test.py
  python3 scripts/tests/w1-rbac-test.py > test-outputs/w1-rbac-output.txt
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(__file__)))

from test_helper import IKAITestHelper, TEST_USERS

def test_endpoint_with_all_roles(helper, endpoint, method="GET"):
    """Test an endpoint with all 5 roles"""

    roles = {
        "SUPER_ADMIN": TEST_USERS["super_admin"],
        "ADMIN": TEST_USERS["org1_admin"],
        "MANAGER": TEST_USERS["org1_manager"],
        "HR_SPECIALIST": TEST_USERS["org1_hr"],
        "USER": TEST_USERS["org1_user"]
    }

    results = {}

    print(f"\n{'='*60}")
    print(f"Testing: {method} {endpoint}")
    print(f"{'='*60}")

    for role_name, user_data in roles.items():
        print(f"\n--- Testing as {role_name} ---")

        try:
            # Login as role
            helper.login(user_data["email"], user_data["password"])

            # Call endpoint
            if method == "GET":
                response = helper.get(endpoint)
            elif method == "POST":
                response = helper.post(endpoint, {})
            elif method == "DELETE":
                response = helper.delete(endpoint)

            # Success
            count = len(response) if isinstance(response, list) else 1
            results[role_name] = {
                "status": "✅ ACCESS GRANTED",
                "count": count,
                "has_access": True
            }
            print(f"✅ {role_name}: {count} items")

        except Exception as e:
            # Blocked (403 or other error)
            error_msg = str(e)
            results[role_name] = {
                "status": "❌ ACCESS DENIED",
                "error": error_msg,
                "has_access": False
            }

            if "403" in error_msg or "Forbidden" in error_msg:
                print(f"❌ {role_name}: 403 Forbidden (expected)")
            else:
                print(f"❌ {role_name}: {error_msg}")

    return results

def print_rbac_summary(results, expected_access):
    """Print RBAC test summary"""

    print(f"\n{'='*60}")
    print("RBAC VERIFICATION SUMMARY")
    print(f"{'='*60}")

    print(f"\n{'Role':<20} {'Actual':<20} {'Expected':<20} {'Match'}")
    print("-" * 80)

    all_match = True

    for role in ["SUPER_ADMIN", "ADMIN", "MANAGER", "HR_SPECIALIST", "USER"]:
        actual = "✅" if results[role]["has_access"] else "❌"
        expected = "✅" if role in expected_access else "❌"
        match = "✅" if (actual == expected) else "❌ MISMATCH"

        print(f"{role:<20} {actual:<20} {expected:<20} {match}")

        if match == "❌ MISMATCH":
            all_match = False

    print("\n" + "=" * 60)
    if all_match:
        print("✅ ALL RBAC CHECKS PASSED")
    else:
        print("❌ RBAC MISMATCH DETECTED")
    print("=" * 60)

    return all_match

def main():
    helper = IKAITestHelper()

    print("=" * 60)
    print("RBAC TEST: Role-Based Access Control Verification")
    print("=" * 60)

    # Test 1: Job Postings (HR_SPECIALIST and above)
    results_jobs = test_endpoint_with_all_roles(
        helper,
        "/api/v1/job-postings",
        "GET"
    )

    expected_jobs = ["SUPER_ADMIN", "ADMIN", "MANAGER", "HR_SPECIALIST"]
    print_rbac_summary(results_jobs, expected_jobs)

    # Test 2: Team (ADMIN and above)
    results_team = test_endpoint_with_all_roles(
        helper,
        "/api/v1/team",
        "GET"
    )

    expected_team = ["SUPER_ADMIN", "ADMIN", "MANAGER"]
    print_rbac_summary(results_team, expected_team)

    # Test 3: Analytics (MANAGER and above)
    results_analytics = test_endpoint_with_all_roles(
        helper,
        "/api/v1/analytics/dashboard",
        "GET"
    )

    expected_analytics = ["SUPER_ADMIN", "ADMIN", "MANAGER"]
    print_rbac_summary(results_analytics, expected_analytics)

    print("\n" + "=" * 60)
    print("RBAC TEST COMPLETE")
    print("=" * 60)

if __name__ == "__main__":
    main()