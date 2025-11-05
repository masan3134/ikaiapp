#!/usr/bin/env python3
import sys
sys.path.append('/home/asan/Desktop/ikai/scripts')
from test_helper import IKAITestHelper

helper = IKAITestHelper()
helper.login("test-user@test-org-1.com", "TestPass123!")

print("\n🧪 Testing USER Dashboard Endpoint...")
response = helper.get("/api/v1/dashboard/user")
print(f"Status: {response.status_code}")
print(f"Response: {response.json() if response.status_code == 200 else response.text}")
