#!/usr/bin/env python3
"""
W4: Deep Integration Test - ADMIN Role
Test all 18 ADMIN pages (same as MANAGER)
"""

import sys
sys.path.append('/home/asan/Desktop/ikai/scripts')

from test_helper import IKAITestHelper, TEST_USERS

def main():
    print("=" * 80)
    print("W4: ADMIN ROLE - DEEP INTEGRATION TEST")
    print("=" * 80)

    helper = IKAITestHelper()

    # Login as ADMIN
    print("\n[1/19] Login as ADMIN...")
    user = TEST_USERS["org1_admin"]
    if not helper.login(user["email"], user["password"]):
        print("❌ Login failed!")
        return

    print(f"\n✅ Logged in as ADMIN")
    print(f"   Email: {user['email']}")
    print(f"   Org: {user['org']}")

    # Test all endpoints (18 pages)
    endpoints = [
        # HR Pages (10)
        ("/api/v1/job-postings", "Job Postings - List"),
        ("/api/v1/candidates", "Candidates - List"),
        ("/api/v1/analysis", "Analyses - List"),
        ("/api/v1/interviews", "Interviews - List"),
        ("/api/v1/offers", "Offers - List"),
        ("/api/v1/offers/templates", "Offer Templates - List"),
        ("/api/v1/tests", "Tests - List"),
        ("/api/v1/categories", "Categories - List"),

        # Team & Analytics (3)
        ("/api/v1/team", "Team - List"),
        ("/api/v1/analytics/dashboard", "Analytics - Dashboard"),
        ("/api/v1/analytics/offers/stats", "Offers Analytics - Stats"),

        # Settings (6)
        ("/api/v1/users/me", "Settings - Profile"),
        ("/api/v1/organization", "Settings - Organization"),
        ("/api/v1/team", "Settings - Team"),
        ("/api/v1/notifications/preferences", "Settings - Notifications"),
        ("/api/v1/organization/usage", "Settings - Usage"),
        ("/api/v1/organization/limits", "Settings - Limits"),

        # Dashboard (1)
        ("/api/v1/dashboard/stats", "Dashboard"),
    ]

    success_count = 0
    failed_endpoints = []

    for i, (endpoint, name) in enumerate(endpoints, start=2):
        print(f"\n[{i}/19] Testing: {name}")
        print(f"         Endpoint: {endpoint}")

        result = helper.get(endpoint)

        if result is not None:
            print(f"         ✅ SUCCESS")
            success_count += 1
        else:
            print(f"         ❌ FAILED")
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
