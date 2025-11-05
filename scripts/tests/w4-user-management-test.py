#!/usr/bin/env python3
"""
W4 E2E Test - ADMIN User Management (CRITICAL)
Tests user CRUD operations and cross-org RBAC
"""

import requests
import json
import time

BASE_URL = "http://localhost:8102"

class AdminUserTest:
    def __init__(self):
        self.token = None
        self.user = None
        self.organization = None
        self.test_results = {
            "tests_run": 0,
            "tests_passed": 0,
            "tests_failed": 0,
            "issues": []
        }

    def login(self):
        """Login as ADMIN"""
        print("🔑 Logging in as ADMIN...")
        response = requests.post(
            f"{BASE_URL}/api/v1/auth/login",
            json={"email": "test-admin@test-org-2.com", "password": "TestPass123!"}
        )

        if response.status_code == 200:
            data = response.json()
            self.token = data.get("token")
            self.user = data.get("user")
            self.organization = {"id": self.user["organizationId"]}
            print(f"✅ Logged in as ADMIN (Org: {self.user['organizationId']})\n")
            return True
        else:
            print(f"❌ Login failed: {response.status_code}")
            return False

    def add_result(self, test_name, passed, message=""):
        """Record test result"""
        self.test_results["tests_run"] += 1
        if passed:
            self.test_results["tests_passed"] += 1
            print(f"   ✅ {test_name}: PASS")
        else:
            self.test_results["tests_failed"] += 1
            self.test_results["issues"].append({"test": test_name, "message": message})
            print(f"   ❌ {test_name}: FAIL - {message}")

    def test_view_users(self):
        """Test: View all users in own organization"""
        print("\n📋 Test 1: View Users (Own Organization)")
        print("-" * 60)

        try:
            response = requests.get(
                f"{BASE_URL}/api/v1/users",
                headers={"Authorization": f"Bearer {self.token}"}
            )

            if response.status_code == 200:
                data = response.json()
                users = data.get("data", []) if isinstance(data.get("data"), list) else data.get("users", [])

                print(f"   Found {len(users)} users in organization")

                # Check org isolation
                other_org_users = [u for u in users if u.get("organizationId") != self.user["organizationId"]]

                if len(other_org_users) > 0:
                    self.add_result("Org Isolation", False, f"Saw {len(other_org_users)} users from other orgs!")
                else:
                    self.add_result("Org Isolation", True)

                # Print sample users
                for user in users[:3]:
                    print(f"   - {user.get('email', 'N/A')} ({user.get('role', 'N/A')})")

                self.add_result("View Users", True)
                return users
            else:
                self.add_result("View Users", False, f"Status {response.status_code}")
                return []

        except Exception as e:
            self.add_result("View Users", False, str(e))
            return []

    def test_create_user(self):
        """Test: Create new user"""
        print("\n➕ Test 2: Create User")
        print("-" * 60)

        new_user_email = f"test-new-user-{int(time.time())}@test-org-2.com"

        try:
            response = requests.post(
                f"{BASE_URL}/api/v1/users",
                headers={"Authorization": f"Bearer {self.token}"},
                json={
                    "email": new_user_email,
                    "password": "TestPass123!",
                    "firstName": "Test",
                    "lastName": "NewUser",
                    "role": "USER",
                    "department": "Engineering"
                }
            )

            print(f"   Attempting to create: {new_user_email}")
            print(f"   Response status: {response.status_code}")

            if response.status_code in [200, 201]:
                data = response.json()
                print(f"   Response: {json.dumps(data, indent=2)}")
                self.add_result("Create User", True)
                return data.get("data", {}).get("id") or data.get("user", {}).get("id")
            elif response.status_code == 403:
                self.add_result("Create User", False, "403 Forbidden - ADMIN should be able to create users!")
                print(f"   ❌ RBAC Issue: ADMIN cannot create users!")
            else:
                self.add_result("Create User", False, f"Status {response.status_code}: {response.text[:200]}")
                print(f"   Response: {response.text[:200]}")

            return None

        except Exception as e:
            self.add_result("Create User", False, str(e))
            return None

    def test_edit_user_role(self, user_id):
        """Test: Edit user role"""
        print("\n✏️  Test 3: Edit User Role")
        print("-" * 60)

        if not user_id:
            self.add_result("Edit User Role", False, "No user ID (create failed)")
            return False

        try:
            response = requests.put(
                f"{BASE_URL}/api/v1/users/{user_id}",
                headers={"Authorization": f"Bearer {self.token}"},
                json={"role": "HR_SPECIALIST"}
            )

            print(f"   Attempting to change role to HR_SPECIALIST")
            print(f"   Response status: {response.status_code}")

            if response.status_code in [200, 204]:
                self.add_result("Edit User Role", True)
                return True
            else:
                self.add_result("Edit User Role", False, f"Status {response.status_code}")
                print(f"   Response: {response.text[:200]}")
                return False

        except Exception as e:
            self.add_result("Edit User Role", False, str(e))
            return False

    def test_delete_user(self, user_id):
        """Test: Delete user"""
        print("\n🗑️  Test 4: Delete User")
        print("-" * 60)

        if not user_id:
            self.add_result("Delete User", False, "No user ID (create failed)")
            return False

        try:
            response = requests.delete(
                f"{BASE_URL}/api/v1/users/{user_id}",
                headers={"Authorization": f"Bearer {self.token}"}
            )

            print(f"   Attempting to delete user {user_id}")
            print(f"   Response status: {response.status_code}")

            if response.status_code in [200, 204]:
                self.add_result("Delete User", True)
                return True
            else:
                self.add_result("Delete User", False, f"Status {response.status_code}")
                print(f"   Response: {response.text[:200]}")
                return False

        except Exception as e:
            self.add_result("Delete User", False, str(e))
            return False

    def test_cross_org_access(self):
        """Test: Try to access users from other org (should fail)"""
        print("\n🚫 Test 5: Cross-Org Access (Should Fail)")
        print("-" * 60)

        # Try to get Test Org 1 users (we're in Test Org 2)
        test_org_1_id = "550e8400-e29b-41d4-a716-446655440000"  # Assumed ID

        try:
            # Try to access via query param
            response = requests.get(
                f"{BASE_URL}/api/v1/users?organizationId={test_org_1_id}",
                headers={"Authorization": f"Bearer {self.token}"}
            )

            print(f"   Attempting to access Test Org 1 users")
            print(f"   Response status: {response.status_code}")

            if response.status_code == 403:
                self.add_result("Cross-Org Block (403)", True)
            elif response.status_code == 200:
                data = response.json()
                users = data.get("data", []) if isinstance(data.get("data"), list) else data.get("users", [])

                # Check if any users belong to other org
                if len(users) == 0 or all(u.get("organizationId") == self.user["organizationId"] for u in users):
                    self.add_result("Cross-Org Block (Filtered)", True)
                else:
                    self.add_result("Cross-Org Block", False, "Could see other org's users!")
            else:
                self.add_result("Cross-Org Block", False, f"Unexpected status {response.status_code}")

        except Exception as e:
            self.add_result("Cross-Org Block", False, str(e))

    def print_summary(self):
        """Print test summary"""
        print("\n" + "="*80)
        print("📊 USER MANAGEMENT TEST SUMMARY")
        print("="*80)
        print(f"Tests Run: {self.test_results['tests_run']}")
        print(f"✅ Passed: {self.test_results['tests_passed']}")
        print(f"❌ Failed: {self.test_results['tests_failed']}")

        if self.test_results['issues']:
            print(f"\n⚠️  ISSUES FOUND ({len(self.test_results['issues'])}):")
            for i, issue in enumerate(self.test_results['issues'], 1):
                print(f"\n{i}. {issue['test']}")
                print(f"   {issue['message']}")

        print("\n" + "="*80)

        # Save results
        with open('/home/asan/Desktop/ikai/test-outputs/w4-user-management-results.json', 'w') as f:
            json.dump(self.test_results, f, indent=2)
        print("\n📁 Results saved: test-outputs/w4-user-management-results.json")

        return self.test_results['tests_failed'] == 0

def main():
    print("="*80)
    print("🧪 W4 E2E TEST - ADMIN USER MANAGEMENT")
    print("="*80)

    tester = AdminUserTest()

    # Login
    if not tester.login():
        print("❌ Login failed, aborting tests")
        return False

    # Run tests
    users = tester.test_view_users()
    new_user_id = tester.test_create_user()

    if new_user_id:
        tester.test_edit_user_role(new_user_id)
        time.sleep(1)  # Brief pause
        tester.test_delete_user(new_user_id)

    tester.test_cross_org_access()

    # Summary
    success = tester.print_summary()

    return success

if __name__ == "__main__":
    success = main()
    exit(0 if success else 1)
