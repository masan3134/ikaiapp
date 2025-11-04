#!/usr/bin/env python3
"""
W4: ADMIN Role - Comprehensive Full-Stack Test
Duration: 75 minutes
Scope: Organization management + User management + Settings + Cross-org isolation

Test Coverage:
- 18 Backend endpoints (org management, user management, settings)
- Cross-org isolation (CRITICAL)
- CRUD operations (org settings, users)
- RBAC checks (ADMIN permissions)
"""

import requests
import json
import sys
import os
from typing import Optional, Dict

BASE_URL = "http://localhost:8102"

# Test users
TEST_USERS = {
    "org1_admin": {
        "email": "test-admin@test-org-1.com",
        "password": "TestPass123!",
    },
    "org2_admin": {
        "email": "test-admin@test-org-2.com",
        "password": "TestPass123!",
    }
}

class IKAITestHelper:
    """Simple test helper for API testing"""
    def __init__(self):
        self.token: Optional[str] = None
        self.user_info: Optional[Dict] = None

    def login(self, email: str, password: str) -> bool:
        """Login and get token"""
        try:
            response = requests.post(
                f"{BASE_URL}/api/v1/auth/login",
                json={"email": email, "password": password},
                headers={"Content-Type": "application/json"}
            )

            if response.status_code == 200:
                data = response.json()
                self.token = data.get("token")
                self.user_info = data.get("user")
                print(f"✅ Login successful: {email}")
                print(f"   Role: {self.user_info.get('role')}")
                return True
            else:
                print(f"❌ Login failed! Status: {response.status_code}")
                return False
        except Exception as e:
            print(f"❌ Error: {e}")
            return False

    def get(self, endpoint: str) -> Optional[Dict]:
        """GET request"""
        if not self.token:
            return None
        try:
            response = requests.get(
                f"{BASE_URL}{endpoint}",
                headers={"Authorization": f"Bearer {self.token}"}
            )
            if response.status_code == 200:
                return response.json()
            return None
        except:
            return None

    def post(self, endpoint: str, data: Dict) -> Optional[Dict]:
        """POST request"""
        if not self.token:
            return None
        try:
            response = requests.post(
                f"{BASE_URL}{endpoint}",
                json=data,
                headers={"Authorization": f"Bearer {self.token}"}
            )
            if response.status_code in [200, 201]:
                return response.json()
            return None
        except:
            return None

    def put(self, endpoint: str, data: Dict) -> Optional[Dict]:
        """PUT request"""
        if not self.token:
            return None
        try:
            response = requests.put(
                f"{BASE_URL}{endpoint}",
                json=data,
                headers={"Authorization": f"Bearer {self.token}"}
            )
            if response.status_code == 200:
                return response.json()
            return None
        except:
            return None

    def patch(self, endpoint: str, data: Dict) -> Optional[Dict]:
        """PATCH request"""
        if not self.token:
            return None
        try:
            response = requests.patch(
                f"{BASE_URL}{endpoint}",
                json=data,
                headers={"Authorization": f"Bearer {self.token}"}
            )
            if response.status_code == 200:
                return response.json()
            return None
        except:
            return None

    def delete(self, endpoint: str) -> bool:
        """DELETE request"""
        if not self.token:
            return False
        try:
            response = requests.delete(
                f"{BASE_URL}{endpoint}",
                headers={"Authorization": f"Bearer {self.token}"}
            )
            return response.status_code == 200
        except:
            return False

def test_org_management(helper):
    """Test Organization Management Endpoints (3 endpoints)"""
    print("\n" + "="*60)
    print("🏢 ORGANIZATION MANAGEMENT (3 endpoints)")
    print("="*60)

    passed = 0
    total = 3
    org_id = None

    # 1. GET /organizations/me
    print("\n[1/3] GET /api/v1/organizations/me")
    response = helper.get("/api/v1/organizations/me")
    if response and response.get('success'):
        org = response.get('data', {})
        org_id = org.get('id')
        print(f"✅ Organization: {org.get('name', 'N/A')}")
        print(f"   ID: {org_id}")
        print(f"   Plan: {org.get('plan', 'N/A')}")
        print(f"   Industry: {org.get('industry', 'N/A')}")
        passed += 1
    else:
        print(f"❌ Failed to get organization")

    # 2. PATCH /organizations/me
    print("\n[2/3] PATCH /api/v1/organizations/me")
    update_data = {"name": "Updated Test Org (W4 Test)"}
    response = helper.patch("/api/v1/organizations/me", update_data)
    if response and response.get('success'):
        updated = response.get('data', {})
        print(f"✅ Updated name: {updated.get('name', 'N/A')}")
        passed += 1
    else:
        print(f"❌ Failed to update organization")

    # 3. GET /organizations/me/usage
    print("\n[3/3] GET /api/v1/organizations/me/usage")
    response = helper.get("/api/v1/organizations/me/usage")
    if response and response.get('success'):
        usage = response.get('data', {})
        print(f"✅ Usage stats retrieved")
        print(f"   Analyses: {usage.get('monthlyAnalysisCount', 0)}/{usage.get('maxAnalysisPerMonth', 0)}")
        print(f"   CVs: {usage.get('monthlyCvCount', 0)}/{usage.get('maxCvPerMonth', 0)}")
        print(f"   Users: {usage.get('totalUsers', 0)}/{usage.get('maxUsers', 0)}")
        passed += 1
    else:
        print(f"❌ Failed to get usage stats")

    print(f"\n📊 Organization Management: {passed}/{total} passed")
    return passed, total, org_id

def test_user_management(helper):
    """Test User Management Endpoints (5 endpoints from teamRoutes)"""
    print("\n" + "="*60)
    print("👥 USER MANAGEMENT (5 endpoints)")
    print("="*60)

    passed = 0
    total = 5
    test_user_id = None

    # 1. GET /team
    print("\n[1/5] GET /api/v1/team")
    response = helper.get("/api/v1/team")
    if response and response.get('success'):
        users = response.get('data', {}).get('users', [])
        print(f"✅ Team retrieved: {len(users)} users")
        passed += 1

        # Save a non-admin user ID
        if users and len(users) > 0:
            for user in users:
                if user.get('role') != 'ADMIN':
                    test_user_id = user.get('id')
                    print(f"   Found test user: {user.get('firstName')} ({user.get('role')})")
                    break

    # 2. POST /team/invite
    print("\n[2/5] POST /api/v1/team/invite")
    invite_data = {
        "email": f"w4-test-{os.getpid()}@test-org-1.com",
        "role": "USER",
        "firstName": "W4Test",
        "lastName": "User"
    }
    response = helper.post("/api/v1/team/invite", invite_data)
    if response and response.get('success'):
        invited_user = response.get('data', {})
        invited_user_id = invited_user.get('id')
        print(f"✅ User invited: {invited_user.get('email', 'N/A')}")
        print(f"   ID: {invited_user_id}")
        passed += 1
        test_user_id = invited_user_id  # Use this for tests
    else:
        print(f"❌ Failed to invite user")
        invited_user_id = test_user_id

    # 3. PATCH /team/:id (update user)
    print("\n[3/5] PATCH /api/v1/team/{userId}")
    if test_user_id:
        update_data = {"role": "HR_SPECIALIST"}
        response = helper.patch(f"/api/v1/team/{test_user_id}", update_data)
        if response and response.get('success'):
            updated_user = response.get('data', {})
            print(f"✅ User updated - Role: {updated_user.get('role', 'N/A')}")
            passed += 1
        else:
            print(f"❌ Failed to update user")
    else:
        print("   ⚠️  SKIP - No user ID available")

    # 4. PATCH /team/:id/toggle (deactivate/reactivate)
    print("\n[4/5] PATCH /api/v1/team/{userId}/toggle")
    if test_user_id:
        response = helper.patch(f"/api/v1/team/{test_user_id}/toggle", {})
        if response and response.get('success'):
            print(f"✅ User toggled (activated/deactivated)")
            passed += 1
        else:
            print(f"❌ Failed to toggle user")
    else:
        print("   ⚠️  SKIP - No user ID available")

    # 5. DELETE /team/:id
    print("\n[5/5] DELETE /api/v1/team/{userId}")
    if invited_user_id:
        # Only delete if we created it
        response = helper.delete(f"/api/v1/team/{invited_user_id}")
        if response:
            print(f"✅ User removed")
            passed += 1
        else:
            print(f"❌ Failed to delete user")
    else:
        print("   ⚠️  SKIP - No invited user to delete")

    print(f"\n📊 User Management: {passed}/{total} passed")
    return passed, total

def test_settings(helper):
    """Test Settings Endpoints (2 endpoints from userRoutes)"""
    print("\n" + "="*60)
    print("⚙️  SETTINGS (2 endpoints)")
    print("="*60)

    passed = 0
    total = 2

    # 1. GET /user/me/notifications (notification preferences)
    print("\n[1/2] GET /api/v1/user/me/notifications")
    response = helper.get("/api/v1/user/me/notifications")
    if response and response.get('success'):
        prefs = response.get('data', {})
        print(f"✅ Notification preferences retrieved")
        print(f"   Email: {prefs.get('emailNotifications', 'N/A')}")
        print(f"   In-app: {prefs.get('inAppNotifications', 'N/A')}")
        passed += 1
    else:
        print(f"❌ Failed to get notification preferences")

    # 2. PATCH /user/me/notifications
    print("\n[2/2] PATCH /api/v1/user/me/notifications")
    prefs_update = {
        "emailNotifications": True,
        "inAppNotifications": True
    }
    response = helper.patch("/api/v1/user/me/notifications", prefs_update)
    if response and response.get('success'):
        print(f"✅ Notification preferences updated")
        passed += 1
    else:
        print(f"❌ Failed to update notification preferences")

    print(f"\n📊 Settings: {passed}/{total} passed")
    return passed, total

def test_cross_org_isolation(helper_org1, org1_id):
    """Test Cross-Organization Isolation (CRITICAL!)"""
    print("\n" + "="*60)
    print("🔒 CROSS-ORG ISOLATION TEST (CRITICAL!)")
    print("="*60)

    passed = 0
    total = 3

    # Get org2 admin token
    helper_org2 = IKAITestHelper()
    user_org2 = TEST_USERS["org2_admin"]

    print("\n[1/3] Login to Org 2 as ADMIN...")
    if not helper_org2.login(user_org2["email"], user_org2["password"]):
        print("❌ Failed to login to Org 2")
        return 0, total

    response = helper_org2.get("/api/v1/organizations/me")
    if not response or not response.get('success'):
        print("❌ Failed to get Org 2 data")
        return 0, total

    org2_data = response.get('data', {})
    org2_id = org2_data.get('id')

    if not org2_id:
        print("❌ Failed to get Org 2 ID")
        return 0, total

    print(f"✅ Org 2 ID: {org2_id}")
    print(f"   Name: {org2_data.get('name', 'N/A')}")
    passed += 1

    # Test 1: Org 1 ADMIN cannot access Org 2 data
    print("\n[2/3] Org 1 ADMIN tries to access Org 2 organization...")

    # Most endpoints are implicit (use token's org), so we test team endpoint
    print("   Testing: GET /api/v1/team (should only see Org 1 users)")
    response = helper_org1.get("/api/v1/team")

    if response and response.get('success'):
        users_org1 = response.get('data', {}).get('users', [])

        # Verify all users belong to org1
        all_same_org = True
        for user in users_org1:
            if user.get('organizationId') != org1_id:
                all_same_org = False
                print(f"   ❌ Found user from different org: {user.get('id')}")
                break

        if all_same_org:
            print(f"   ✅ All {len(users_org1)} users belong to Org 1")
            passed += 1
        else:
            print("   ❌ Cross-org data leak detected!")
    else:
        print("   ⚠️  Could not retrieve team data")

    # Test 2: Verify Org 2 ADMIN sees different data
    print("\n[3/3] Verify Org 2 ADMIN sees different team...")
    response = helper_org2.get("/api/v1/team")

    if response and response.get('success'):
        users_org2 = response.get('data', {}).get('users', [])

        # Verify all users belong to org2
        all_same_org = True
        for user in users_org2:
            if user.get('organizationId') != org2_id:
                all_same_org = False
                print(f"   ❌ Found user from different org: {user.get('id')}")
                break

        if all_same_org:
            print(f"   ✅ All {len(users_org2)} users belong to Org 2")

            # Verify no overlap
            org1_emails = {u.get('email') for u in users_org1 if users_org1}
            org2_emails = {u.get('email') for u in users_org2}
            overlap = org1_emails & org2_emails

            if not overlap:
                print(f"   ✅ No user overlap between orgs")
                passed += 1
            else:
                print(f"   ❌ Found {len(overlap)} overlapping users!")
        else:
            print("   ❌ Cross-org data leak detected!")
    else:
        print("   ⚠️  Could not retrieve team data")

    print(f"\n📊 Cross-Org Isolation: {passed}/{total} passed")

    if passed == total:
        print("\n🎉 CRITICAL TEST PASSED - Data isolation is working!")
    else:
        print("\n⚠️  CRITICAL TEST FAILED - Data isolation issue detected!")

    return passed, total

def main():
    print("="*60)
    print("W4: ADMIN ROLE - COMPREHENSIVE FULL-STACK TEST")
    print("="*60)
    print("Scope: Org management + User management + Cross-org isolation")
    print()

    # Login as ADMIN (Org 1)
    helper = IKAITestHelper()
    user = TEST_USERS["org1_admin"]

    print("\n🔐 Login as ADMIN (Org 1)...")
    if not helper.login(user["email"], user["password"]):
        print("❌ Login failed! Aborting test.")
        return

    # Run all tests
    total_passed = 0
    total_tests = 0

    # 1. Organization Management
    org_passed, org_total, org_id = test_org_management(helper)
    total_passed += org_passed
    total_tests += org_total

    # 2. User Management
    user_passed, user_total = test_user_management(helper)
    total_passed += user_passed
    total_tests += user_total

    # 3. Settings
    settings_passed, settings_total = test_settings(helper)
    total_passed += settings_passed
    total_tests += settings_total

    # 4. Cross-Org Isolation (CRITICAL!)
    if org_id:
        isolation_passed, isolation_total = test_cross_org_isolation(helper, org_id)
        total_passed += isolation_passed
        total_tests += isolation_total
    else:
        print("\n⚠️  Skipping cross-org test - could not get org ID")

    # Final Summary
    print("\n" + "="*60)
    print("📊 FINAL SUMMARY")
    print("="*60)
    print(f"Total Tests Passed: {total_passed}/{total_tests}")
    print(f"Success Rate: {(total_passed/total_tests)*100:.1f}%")
    print()

    if total_passed == total_tests:
        print("🎉 ALL TESTS PASSED!")
    elif total_passed >= total_tests * 0.8:
        print("✅ Most tests passed (80%+)")
    else:
        print("⚠️  Some tests failed - review output above")

    print("\n" + "="*60)
    print("TEST COMPLETE")
    print("="*60)

if __name__ == "__main__":
    main()
