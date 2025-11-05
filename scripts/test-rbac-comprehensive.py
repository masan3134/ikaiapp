#!/usr/bin/env python3
"""
Comprehensive RBAC Test Script
Tests all 5 roles against endpoints they CANNOT access

Usage:
  python3 scripts/test-rbac-comprehensive.py > test-outputs/w6-rbac-comprehensive.txt
"""

import requests
import json
from typing import Dict, List, Tuple

# Configuration
API_URL = "http://localhost:8102"

# Test credentials
CREDENTIALS = {
    "HR_SPECIALIST": {"email": "test-hr_specialist@test-org-2.com", "password": "TestPass123!"},
    "MANAGER": {"email": "test-manager@test-org-1.com", "password": "TestPass123!"},
    "ADMIN": {"email": "test-admin@test-org-2.com", "password": "TestPass123!"},
    "SUPER_ADMIN": {"email": "info@gaiai.ai", "password": "23235656"}
}

# RBAC Test Matrix: Role → Forbidden Operations
RBAC_MATRIX = {
    "HR_SPECIALIST": [
        {
            "name": "User Management (List Users)",
            "method": "GET",
            "endpoint": "/api/v1/users",
            "expected": [403, 404],
            "required_role": "ADMIN+"
        },
        {
            "name": "User Management (Create User)",
            "method": "POST",
            "endpoint": "/api/v1/users",
            "body": {"email": "test@test.com", "role": "USER"},
            "expected": [403, 404],
            "required_role": "ADMIN+"
        },
        {
            "name": "Organization Settings (Update)",
            "method": "PATCH",
            "endpoint": "/api/v1/organization/me",
            "body": {"name": "Hacked Org"},
            "expected": [403, 404],
            "required_role": "ADMIN+"
        },
        {
            "name": "Cache Management (Stats)",
            "method": "GET",
            "endpoint": "/api/v1/cache/stats",
            "expected": [403, 404],
            "required_role": "ADMIN+"
        },
        {
            "name": "Delete Offer (Requires MANAGER+)",
            "method": "DELETE",
            "endpoint": "/api/v1/offers/test-offer-id",
            "expected": [403, 404],
            "required_role": "MANAGER+"
        }
    ],
    "MANAGER": [
        {
            "name": "User Management (List Users)",
            "method": "GET",
            "endpoint": "/api/v1/users",
            "expected": [403, 404],
            "required_role": "ADMIN+"
        },
        {
            "name": "Organization Settings (Update)",
            "method": "PATCH",
            "endpoint": "/api/v1/organization/me",
            "body": {"name": "Hacked Org"},
            "expected": [403, 404],
            "required_role": "ADMIN+"
        },
        {
            "name": "Cache Clear (System-wide)",
            "method": "DELETE",
            "endpoint": "/api/v1/cache/clear",
            "expected": [403, 404],
            "required_role": "ADMIN+"
        },
        {
            "name": "Delete Candidate (Permanent)",
            "method": "DELETE",
            "endpoint": "/api/v1/candidates/test-candidate-id",
            "expected": [403, 404],
            "required_role": "ADMIN+"
        },
        {
            "name": "Delete Job Posting",
            "method": "DELETE",
            "endpoint": "/api/v1/job-postings/test-job-id",
            "expected": [403, 404],
            "required_role": "ADMIN+"
        }
    ],
    "ADMIN": [
        {
            "name": "Super Admin Dashboard",
            "method": "GET",
            "endpoint": "/api/v1/dashboard/super-admin",
            "expected": [403, 404],
            "required_role": "SUPER_ADMIN"
        },
        {
            "name": "List All Organizations (Platform-wide)",
            "method": "GET",
            "endpoint": "/api/v1/super-admin/organizations",
            "expected": [403, 404],
            "required_role": "SUPER_ADMIN"
        },
        {
            "name": "Create Organization (Platform)",
            "method": "POST",
            "endpoint": "/api/v1/super-admin/organizations",
            "body": {"name": "Fake Org", "plan": "FREE"},
            "expected": [403, 404],
            "required_role": "SUPER_ADMIN"
        },
        {
            "name": "Queue Management (System)",
            "method": "GET",
            "endpoint": "/api/v1/queue/stats",
            "expected": [403, 404],
            "required_role": "SUPER_ADMIN"
        },
        {
            "name": "Platform Stats (All Orgs)",
            "method": "GET",
            "endpoint": "/api/v1/super-admin/stats",
            "expected": [403, 404],
            "required_role": "SUPER_ADMIN"
        }
    ],
    "SUPER_ADMIN": [
        # SUPER_ADMIN has all permissions
        # These tests verify SUPER_ADMIN CAN access everything
        {
            "name": "Super Admin Dashboard (Should Access)",
            "method": "GET",
            "endpoint": "/api/v1/dashboard/super-admin",
            "expected": [200],
            "required_role": "SUPER_ADMIN"
        },
        {
            "name": "List All Organizations (Should Access)",
            "method": "GET",
            "endpoint": "/api/v1/super-admin/organizations",
            "expected": [200],
            "required_role": "SUPER_ADMIN"
        },
        {
            "name": "Queue Stats (Should Access)",
            "method": "GET",
            "endpoint": "/api/v1/queue/stats",
            "expected": [200],
            "required_role": "SUPER_ADMIN"
        },
        {
            "name": "Platform Stats (Should Access)",
            "method": "GET",
            "endpoint": "/api/v1/super-admin/stats",
            "expected": [200],
            "required_role": "SUPER_ADMIN"
        },
        {
            "name": "User Management (Should Access)",
            "method": "GET",
            "endpoint": "/api/v1/users",
            "expected": [200],
            "required_role": "SUPER_ADMIN"
        }
    ]
}


def login(role: str) -> str:
    """Login and return JWT token"""
    creds = CREDENTIALS[role]
    response = requests.post(
        f"{API_URL}/api/v1/auth/login",
        json=creds
    )
    if response.status_code == 200:
        return response.json().get("token")
    else:
        raise Exception(f"Login failed for {role}: {response.status_code}")


def test_endpoint(token: str, test: Dict) -> Tuple[bool, int, str]:
    """Test a single endpoint"""
    headers = {"Authorization": f"Bearer {token}"}

    method = test["method"]
    url = f"{API_URL}{test['endpoint']}"
    body = test.get("body", {})

    try:
        if method == "GET":
            response = requests.get(url, headers=headers)
        elif method == "POST":
            response = requests.post(url, json=body, headers=headers)
        elif method == "PUT":
            response = requests.put(url, json=body, headers=headers)
        elif method == "PATCH":
            response = requests.patch(url, json=body, headers=headers)
        elif method == "DELETE":
            response = requests.delete(url, headers=headers)
        else:
            return False, 0, "Unknown method"

        status = response.status_code
        expected = test["expected"]

        # Check if status is in expected list
        passed = status in expected

        # Get response message
        try:
            data = response.json()
            message = data.get("message", data.get("error", "No message"))
        except:
            message = response.text[:100] if response.text else "Empty response"

        return passed, status, message

    except Exception as e:
        return False, 0, str(e)


def run_rbac_tests():
    """Run comprehensive RBAC tests"""
    print("=" * 80)
    print("COMPREHENSIVE RBAC TEST - All Roles")
    print("=" * 80)
    print()

    results = {
        "total_tests": 0,
        "passed": 0,
        "failed": 0,
        "by_role": {}
    }

    for role, tests in RBAC_MATRIX.items():
        print(f"\n{'='*80}")
        print(f"TESTING ROLE: {role}")
        print(f"{'='*80}")

        # Login
        try:
            token = login(role)
            print(f"✅ Login successful: {token[:30]}...")
        except Exception as e:
            print(f"❌ Login failed: {e}")
            continue

        print(f"\n{role} PERMISSION TESTS ({len(tests)} tests):")
        print("-" * 80)

        role_results = {"total": len(tests), "passed": 0, "failed": 0, "details": []}

        for i, test in enumerate(tests, 1):
            results["total_tests"] += 1

            passed, status, message = test_endpoint(token, test)

            if passed:
                results["passed"] += 1
                role_results["passed"] += 1
                icon = "✅"
            else:
                results["failed"] += 1
                role_results["failed"] += 1
                icon = "❌"

            print(f"\n[{i}] {test['name']}")
            print(f"    {test['method']} {test['endpoint']}")
            print(f"    Required: {test['required_role']}")
            print(f"    Expected: {test['expected']} | Got: {status}")
            print(f"    {icon} {'PASS' if passed else 'FAIL'}")
            print(f"    Response: {message[:80]}")

            role_results["details"].append({
                "test": test["name"],
                "passed": passed,
                "status": status,
                "message": message
            })

        results["by_role"][role] = role_results

        print(f"\n{role} SUMMARY: {role_results['passed']}/{role_results['total']} PASS")

    # Final Summary
    print(f"\n{'='*80}")
    print("FINAL SUMMARY")
    print(f"{'='*80}")
    print(f"Total Tests: {results['total_tests']}")
    print(f"Passed: {results['passed']} ✅")
    print(f"Failed: {results['failed']} ❌")
    print(f"Pass Rate: {(results['passed']/results['total_tests']*100):.1f}%")
    print()

    print("BY ROLE:")
    for role, role_results in results["by_role"].items():
        pass_rate = (role_results['passed']/role_results['total']*100) if role_results['total'] > 0 else 0
        print(f"  {role}: {role_results['passed']}/{role_results['total']} ({pass_rate:.1f}%)")

    print(f"\n{'='*80}")

    # Save JSON results
    with open("test-outputs/rbac-comprehensive-results.json", "w") as f:
        json.dump(results, f, indent=2)

    print("✅ Results saved to: test-outputs/rbac-comprehensive-results.json")

    return results


if __name__ == "__main__":
    run_rbac_tests()
