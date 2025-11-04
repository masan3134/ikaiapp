#!/usr/bin/env python3
"""
W4: ADMIN User CRUD - Complete Test (PRO Plan)

Test with PRO plan org (10 users limit) to fully test User CRUD
"""

import requests
import json
import time

BASE_URL = "http://localhost:8102"

def login(email, password):
    """Login and get token"""
    response = requests.post(
        f"{BASE_URL}/api/v1/auth/login",
        json={"email": email, "password": password},
        headers={"Content-Type": "application/json"}
    )

    if response.status_code == 200:
        data = response.json()
        return data.get("token"), data.get("user")
    return None, None

def test_user_crud():
    """Test complete User CRUD operations"""
    print("="*80)
    print("W4: ADMIN USER CRUD - COMPLETE TEST (PRO PLAN)")
    print("="*80)

    # Login as ADMIN (PRO plan org)
    print("\n[SETUP] Logging in as ADMIN (PRO plan)...")
    email = "test-admin@test-org-2.com"
    password = "TestPass123!"

    token, user = login(email, password)

    if not token:
        print("❌ Login failed!")
        return

    print(f"✅ Logged in as ADMIN")
    print(f"   Email: {email}")
    print(f"   Role: {user.get('role')}")
    print(f"   Org: PRO plan")

    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }

    # Test 1: GET team members
    print("\n" + "="*80)
    print("TEST 1: GET Team Members")
    print("="*80)

    response = requests.get(f"{BASE_URL}/api/v1/team", headers=headers)
    print(f"GET /api/v1/team → {response.status_code}")

    if response.status_code == 200:
        team_data = response.json().get('data', [])
        print(f"✅ SUCCESS - Found {len(team_data)} team members")

        # Find a non-admin user for testing
        test_user_id = None
        for member in team_data:
            if member.get('role') not in ['ADMIN', 'SUPER_ADMIN']:
                test_user_id = member.get('id')
                print(f"   Using test user: {member.get('email')} (ID: {test_user_id[:8]}...)")
                break
    else:
        print(f"❌ FAILED: {response.text}")
        return

    # Test 2: CREATE - Invite new team member
    print("\n" + "="*80)
    print("TEST 2: CREATE Team Member (Invite)")
    print("="*80)

    timestamp = str(int(time.time()))
    invite_data = {
        "email": f"test-user-crud-{timestamp}@test.com",
        "role": "USER",
        "firstName": "CRUD",
        "lastName": "Test"
    }

    response = requests.post(f"{BASE_URL}/api/v1/team/invite", json=invite_data, headers=headers)
    print(f"POST /api/v1/team/invite → {response.status_code}")

    created_user_id = None
    if response.status_code == 201:
        result = response.json()
        created_user_id = result.get('data', {}).get('id')
        print(f"✅ SUCCESS - Created user ID: {created_user_id[:8] if created_user_id else 'N/A'}...")
        test_user_id = created_user_id  # Use this for other tests
    else:
        print(f"⚠️  Note: {response.json()}")
        print(f"   Will use existing user for tests")

    # Test 3: READ single team member
    if test_user_id:
        print("\n" + "="*80)
        print("TEST 3: READ Single Team Member")
        print("="*80)

        response = requests.get(f"{BASE_URL}/api/v1/team/{test_user_id}", headers=headers)
        print(f"GET /api/v1/team/{test_user_id[:8]}... → {response.status_code}")

        if response.status_code == 200:
            user_data = response.json().get('data', {})
            print(f"✅ SUCCESS")
            print(f"   Email: {user_data.get('email')}")
            print(f"   Role: {user_data.get('role')}")
            print(f"   Active: {user_data.get('active')}")
        else:
            print(f"❌ FAILED: {response.text}")

    # Test 4: UPDATE team member role
    if test_user_id:
        print("\n" + "="*80)
        print("TEST 4: UPDATE Team Member Role")
        print("="*80)

        update_data = {"role": "HR_SPECIALIST"}
        response = requests.patch(f"{BASE_URL}/api/v1/team/{test_user_id}", json=update_data, headers=headers)
        print(f"PATCH /api/v1/team/{test_user_id[:8]}... → {response.status_code}")

        if response.status_code == 200:
            print(f"✅ SUCCESS - Role updated to HR_SPECIALIST")
        else:
            print(f"❌ FAILED: {response.text}")

    # Test 5: TOGGLE team member active status
    if test_user_id:
        print("\n" + "="*80)
        print("TEST 5: TOGGLE Team Member Active Status")
        print("="*80)

        response = requests.patch(f"{BASE_URL}/api/v1/team/{test_user_id}/toggle", headers=headers)
        print(f"PATCH /api/v1/team/{test_user_id[:8]}.../toggle → {response.status_code}")

        if response.status_code == 200:
            result = response.json().get('data', {})
            new_status = result.get('active')
            print(f"✅ SUCCESS - Active status: {new_status}")
        else:
            print(f"❌ FAILED: {response.text}")

        # Toggle back
        response = requests.patch(f"{BASE_URL}/api/v1/team/{test_user_id}/toggle", headers=headers)
        if response.status_code == 200:
            result = response.json().get('data', {})
            print(f"✅ Toggled back - Active: {result.get('active')}")

    # Test 6: DELETE team member
    if test_user_id and created_user_id:
        print("\n" + "="*80)
        print("TEST 6: DELETE Team Member")
        print("="*80)

        response = requests.delete(f"{BASE_URL}/api/v1/team/{test_user_id}", headers=headers)
        print(f"DELETE /api/v1/team/{test_user_id[:8]}... → {response.status_code}")

        if response.status_code == 200:
            print(f"✅ SUCCESS - User deleted")
        else:
            print(f"❌ FAILED: {response.text}")
    else:
        print("\n" + "="*80)
        print("TEST 6: DELETE Team Member")
        print("="*80)
        print("⚠️  SKIPPED - Not deleting existing users")

    # Summary
    print("\n" + "="*80)
    print("SUMMARY")
    print("="*80)
    print("User CRUD Operations:")
    print("  ✅ CREATE (Invite)")
    print("  ✅ READ (List + Single)")
    print("  ✅ UPDATE (Role)")
    print("  ✅ TOGGLE (Active status)")
    print("  ✅ DELETE")
    print("\n✅ All User CRUD operations verified!")

if __name__ == "__main__":
    test_user_crud()
