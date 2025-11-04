#!/usr/bin/env python3
"""
Test USER Dashboard API
Tests /api/v1/dashboard/user endpoint for real data
"""
import requests
import json

BASE_URL = "http://localhost:8102/api/v1"

def login(email, password):
    """Login and get token"""
    response = requests.post(
        f"{BASE_URL}/auth/login",
        json={"email": email, "password": password}
    )
    data = response.json()
    # Response format: {"message": "...", "token": "...", "user": {...}}
    if "token" in data:
        return data["token"]
    else:
        raise Exception(f"Login failed: {data}")

def test_dashboard():
    """Test USER dashboard endpoint"""
    print("=" * 60)
    print("USER Dashboard API Test")
    print("=" * 60)
    print()

    # Login
    print("1. Login as USER...")
    token = login("test-user@test-org-1.com", "TestPass123!")
    print(f"   ✅ Token: {token[:20]}...")
    print()

    # Get dashboard
    print("2. Get USER dashboard...")
    response = requests.get(
        f"{BASE_URL}/dashboard/user",
        headers={"Authorization": f"Bearer {token}"}
    )

    print(f"   Status: {response.status_code}")

    if response.status_code == 200:
        data = response.json()
        print(f"   Success: {data.get('success')}")
        print()
        print("3. Response data:")
        print(json.dumps(data, indent=2))
        print()

        # Check for mock data
        print("4. Mock data check:")
        response_str = json.dumps(data)
        mock_keywords = ["MOCK", "FAKE", "TODO", "test", "example"]
        found_mock = False
        for keyword in mock_keywords:
            if keyword in response_str:
                print(f"   ⚠️ Found '{keyword}' in response")
                found_mock = True

        if not found_mock:
            print("   ✅ No mock data keywords found")
        print()

        return data
    else:
        print(f"   ❌ Error: {response.text}")
        return None

if __name__ == "__main__":
    test_dashboard()
