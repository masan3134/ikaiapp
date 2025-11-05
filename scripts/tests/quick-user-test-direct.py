#!/usr/bin/env python3
import requests

BASE_URL = "http://localhost:8102"

# Login
login_response = requests.post(f"{BASE_URL}/api/v1/auth/login", json={
    "email": "test-user@test-org-1.com",
    "password": "TestPass123!"
})

if login_response.status_code == 200:
    token = login_response.json()["token"]
    headers = {"Authorization": f"Bearer {token}"}

    print("\n🧪 Testing USER Dashboard Endpoint...")
    response = requests.get(f"{BASE_URL}/api/v1/dashboard/user", headers=headers)
    print(f"Status: {response.status_code}")
    if response.status_code == 200:
        print(f"Response: {response.json()}")
    else:
        print(f"Error: {response.text}")
else:
    print(f"❌ Login failed: {login_response.status_code}")
