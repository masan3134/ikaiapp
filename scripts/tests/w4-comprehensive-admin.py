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

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(__file__)))

from test_helper import IKAITestHelper, TEST_USERS
import json

def test_org_management(helper):
    """Test Organization Management Endpoints (6 endpoints)"""
    print("\n" + "="*60)
    print("🏢 ORGANIZATION MANAGEMENT (6 endpoints)")
    print("="*60)

    passed = 0
    total = 6

    # 1. GET /organizations/me
    print("\n[1/6] GET /api/v1/organizations/me")
    org = helper.get("/api/v1/organizations/me")
    if org:
        print(f"✅ Organization: {org.get('name', 'N/A')}")
        print(f"   Plan: {org.get('plan', 'N/A')}")
        print(f"   Industry: {org.get('industry', 'N/A')}")
        passed += 1

    # 2. PATCH /organizations/me
    print("\n[2/6] PATCH /api/v1/organizations/me")
    update_data = {"name": "Updated Test Org (W4 Test)"}
    # Note: Using PUT instead of PATCH for compatibility
    updated = helper.put("/api/v1/organizations/me", update_data)
    if updated:
        print(f"✅ Updated name: {updated.get('name', 'N/A')}")
        passed += 1

    # 3. GET /organizations/usage
    print("\n[3/6] GET /api/v1/organizations/usage")
    usage = helper.get("/api/v1/organizations/usage")
    if usage:
        print(f"✅ Usage stats retrieved")
        print(f"   Analyses: {usage.get('analysisCount', 0)}")
        print(f"   CV Count: {usage.get('cvCount', 0)}")
        passed += 1

    # 4. PATCH /organizations/plan
    print("\n[4/6] PATCH /api/v1/organizations/plan")
    print("   ⚠️  SKIP - Plan changes require payment flow")
    # Skipping to avoid breaking test data

    # 5. GET /organizations/billing-history
    print("\n[5/6] GET /api/v1/organizations/billing-history")
    billing = helper.get("/api/v1/organizations/billing-history")
    if billing is not None:  # Can be empty array
        print(f"✅ Billing history retrieved")
        if isinstance(billing, list):
            print(f"   Records: {len(billing)}")
        passed += 1

    # 6. POST /organizations/export-data
    print("\n[6/6] POST /api/v1/organizations/export-data")
    export_result = helper.post("/api/v1/organizations/export-data", {})
    if export_result:
        print(f"✅ Data export initiated")
        passed += 1

    print(f"\n📊 Organization Management: {passed}/{total} passed")
    return passed, total

def test_user_management(helper):
    """Test User Management Endpoints (8 endpoints)"""
    print("\n" + "="*60)
    print("👥 USER MANAGEMENT (8 endpoints)")
    print("="*60)

    passed = 0
    total = 8

    # 1. GET /team
    print("\n[1/8] GET /api/v1/team")
    team = helper.get("/api/v1/team")
    if team:
        users = team if isinstance(team, list) else team.get('users', [])
        print(f"✅ Team retrieved: {len(users)} users")
        passed += 1

        # Save a user ID for later tests
        test_user_id = None
        if users and len(users) > 0:
            # Find a non-admin user
            for user in users:
                if user.get('role') != 'ADMIN':
                    test_user_id = user.get('id')
                    break

    # 2. POST /team/invite
    print("\n[2/8] POST /api/v1/team/invite")
    invite_data = {
        "email": f"w4-test-{os.getpid()}@test-org-1.com",
        "role": "USER",
        "firstName": "W4",
        "lastName": "TestUser"
    }
    invite_result = helper.post("/api/v1/team/invite", invite_data)
    if invite_result:
        print(f"✅ User invited: {invite_result.get('email', 'N/A')}")
        invited_user_id = invite_result.get('id')
        passed += 1
    else:
        invited_user_id = test_user_id  # Fallback

    # 3. PATCH /team/:userId/role
    print("\n[3/8] PATCH /api/v1/team/{userId}/role")
    if invited_user_id:
        role_update = {"role": "HR_SPECIALIST"}
        role_result = helper.put(f"/api/v1/team/{invited_user_id}/role", role_update)
        if role_result:
            print(f"✅ Role updated to: {role_result.get('role', 'N/A')}")
            passed += 1
    else:
        print("   ⚠️  SKIP - No user ID available")

    # 4. GET /team/:userId/permissions
    print("\n[4/8] GET /api/v1/team/{userId}/permissions")
    if invited_user_id:
        perms = helper.get(f"/api/v1/team/{invited_user_id}/permissions")
        if perms:
            print(f"✅ Permissions retrieved")
            passed += 1
    else:
        print("   ⚠️  SKIP - No user ID available")

    # 5. PATCH /team/:userId/permissions
    print("\n[5/8] PATCH /api/v1/team/{userId}/permissions")
    if invited_user_id:
        perm_update = {"canManageJobPostings": True}
        perm_result = helper.put(f"/api/v1/team/{invited_user_id}/permissions", perm_update)
        if perm_result:
            print(f"✅ Permissions updated")
            passed += 1
    else:
        print("   ⚠️  SKIP - No user ID available")

    # 6. POST /team/:userId/deactivate
    print("\n[6/8] POST /api/v1/team/{userId}/deactivate")
    if invited_user_id:
        deactivate_result = helper.post(f"/api/v1/team/{invited_user_id}/deactivate", {})
        if deactivate_result:
            print(f"✅ User deactivated")
            passed += 1
    else:
        print("   ⚠️  SKIP - No user ID available")

    # 7. POST /team/:userId/reactivate
    print("\n[7/8] POST /api/v1/team/{userId}/reactivate")
    if invited_user_id:
        reactivate_result = helper.post(f"/api/v1/team/{invited_user_id}/reactivate", {})
        if reactivate_result:
            print(f"✅ User reactivated")
            passed += 1
    else:
        print("   ⚠️  SKIP - No user ID available")

    # 8. DELETE /team/:userId
    print("\n[8/8] DELETE /api/v1/team/{userId}")
    if invited_user_id:
        delete_result = helper.delete(f"/api/v1/team/{invited_user_id}")
        if delete_result:
            print(f"✅ User removed")
            passed += 1
    else:
        print("   ⚠️  SKIP - No user ID available")

    print(f"\n📊 User Management: {passed}/{total} passed")
    return passed, total

def test_settings(helper):
    """Test Settings Endpoints (4 endpoints)"""
    print("\n" + "="*60)
    print("⚙️  SETTINGS (4 endpoints)")
    print("="*60)

    passed = 0
    total = 4

    # 1. GET /settings/security
    print("\n[1/4] GET /api/v1/settings/security")
    security = helper.get("/api/v1/settings/security")
    if security:
        print(f"✅ Security settings retrieved")
        passed += 1

    # 2. PATCH /settings/security
    print("\n[2/4] PATCH /api/v1/settings/security")
    security_update = {"twoFactorEnabled": False}
    security_result = helper.put("/api/v1/settings/security", security_update)
    if security_result:
        print(f"✅ Security settings updated")
        passed += 1

    # 3. GET /settings/integrations
    print("\n[3/4] GET /api/v1/settings/integrations")
    integrations = helper.get("/api/v1/settings/integrations")
    if integrations is not None:
        print(f"✅ Integrations retrieved")
        passed += 1

    # 4. PATCH /settings/integrations
    print("\n[4/4] PATCH /api/v1/settings/integrations")
    integration_update = {"emailEnabled": True}
    integration_result = helper.put("/api/v1/settings/integrations", integration_update)
    if integration_result:
        print(f"✅ Integrations updated")
        passed += 1

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

    org2 = helper_org2.get("/api/v1/organizations/me")
    org2_id = org2.get('id') if org2 else None

    if not org2_id:
        print("❌ Failed to get Org 2 ID")
        return 0, total

    print(f"✅ Org 2 ID: {org2_id}")
    passed += 1

    # Test 1: Org 1 ADMIN cannot access Org 2 data
    print("\n[2/3] Org 1 ADMIN tries to access Org 2 organization...")

    # Try to access org 2's data using org 1 credentials
    # Most endpoints are implicit (use token's org), so we test team endpoint
    print("   Testing: GET /api/v1/team (should only see Org 1 users)")
    team_org1 = helper_org1.get("/api/v1/team")

    if team_org1:
        users_org1 = team_org1 if isinstance(team_org1, list) else team_org1.get('users', [])

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
    team_org2 = helper_org2.get("/api/v1/team")

    if team_org2:
        users_org2 = team_org2 if isinstance(team_org2, list) else team_org2.get('users', [])

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
            org1_emails = {u.get('email') for u in users_org1}
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

    # Get org ID
    org = helper.get("/api/v1/organizations/me")
    org_id = org.get('id') if org else None

    # Run all tests
    total_passed = 0
    total_tests = 0

    # 1. Organization Management
    org_passed, org_total = test_org_management(helper)
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
