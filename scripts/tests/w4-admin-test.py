#!/usr/bin/env python3
"""
W4: Deep Integration Test - ADMIN Role
Test all 18 ADMIN pages (same as MANAGER)
"""

import requests
import json

BASE_URL = "http://localhost:8102"

def login(email, password):
    """Login and get token"""
    try:
        response = requests.post(
            f"{BASE_URL}/api/v1/auth/login",
            json={"email": email, "password": password},
            headers={"Content-Type": "application/json"}
        )

        if response.status_code == 200:
            data = response.json()
            return data.get("token"), data.get("user")
        else:
            print(f"❌ Login failed! Status: {response.status_code}")
            print(f"   Error: {response.text}")
            return None, None
    except Exception as e:
        print(f"❌ Error: {e}")
        return None, None

def test_endpoint(endpoint, token, name):
    """Test a single endpoint"""
    try:
        response = requests.get(
            f"{BASE_URL}{endpoint}",
            headers={
                "Authorization": f"Bearer {token}",
                "Content-Type": "application/json"
            }
        )

        if response.status_code == 200:
            return True, response.json()
        else:
            return False, response.text
    except Exception as e:
        return False, str(e)

def main():
    print("=" * 80)
    print("W4: ADMIN ROLE - DEEP INTEGRATION TEST")
    print("=" * 80)

    # Login as ADMIN
    print("\n[1/19] Login as ADMIN...")
    email = "test-admin@test-org-1.com"
    password = "TestPass123!"

    token, user = login(email, password)

    if not token:
        print("❌ Login failed!")
        return

    print(f"\n✅ Logged in as ADMIN")
    print(f"   Email: {email}")
    print(f"   Role: {user.get('role')}")
    print(f"   Org ID: {user.get('organizationId')}")

    # Test all endpoints (17 API endpoints for 18 pages)
    endpoints = [
        # HR Pages (10)
        ("/api/v1/job-postings", "Job Postings - List"),
        ("/api/v1/candidates", "Candidates - List"),
        ("/api/v1/analyses", "Analyses - List"),  # FIXED: analysis → analyses
        ("/api/v1/interviews", "Interviews - List"),
        ("/api/v1/offers", "Offers - List"),
        ("/api/v1/offer-templates", "Offer Templates - List"),  # FIXED: offers/templates → offer-templates
        ("/api/v1/tests", "Tests - List"),
        ("/api/v1/offer-template-categories", "Categories - List"),  # FIXED: categories → offer-template-categories

        # Team & Analytics (3)
        ("/api/v1/team", "Team - List"),
        ("/api/v1/analytics/summary", "Analytics - Dashboard"),  # FIXED: analytics/dashboard → analytics/summary
        ("/api/v1/offers/analytics/overview", "Offers Analytics - Overview"),  # FIXED: analytics/offers/stats → offers/analytics/overview

        # Settings (5)
        ("/api/v1/users/me", "Settings - Profile"),
        ("/api/v1/organizations/me", "Settings - Organization"),  # FIXED: organization → organizations/me
        ("/api/v1/notifications/preferences", "Settings - Notifications"),
        ("/api/v1/organizations/me/usage", "Settings - Usage"),  # FIXED: organization/usage → organizations/me/usage
        # NOTE: /limits endpoint doesn't exist - usage endpoint returns limit info

        # Dashboard (1)
        ("/api/v1/dashboard/stats", "Dashboard"),
    ]

    success_count = 0
    failed_endpoints = []

    for i, (endpoint, name) in enumerate(endpoints, start=2):
        print(f"\n[{i}/{len(endpoints)+1}] Testing: {name}")
        print(f"         Endpoint: {endpoint}")

        success, result = test_endpoint(endpoint, token, name)

        if success:
            print(f"         ✅ SUCCESS")
            success_count += 1
        else:
            print(f"         ❌ FAILED: {result}")
            failed_endpoints.append((endpoint, name))

    # Summary
    print("\n" + "=" * 80)
    print("SUMMARY")
    print("=" * 80)
    print(f"✅ Successful: {success_count}/{len(endpoints)}")
    print(f"❌ Failed: {len(failed_endpoints)}/{len(endpoints)}")

    if failed_endpoints:
        print("\nFailed endpoints:")
        for endpoint, name in failed_endpoints:
            print(f"  - {name}: {endpoint}")

    print("\n" + "=" * 80)
    print("VERIFICATION")
    print("=" * 80)
    print("🔍 ADMIN should have access to same pages as MANAGER (18 pages)")
    print("🔍 NO Sistem Yönetimi access (SUPER_ADMIN only)")
    print("\n✅ API test completed!")
    print("⚠️  Browser test required for UI verification!")
    print("=" * 80)

if __name__ == "__main__":
    main()
