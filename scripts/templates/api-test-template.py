#!/usr/bin/env python3
"""
API Test Template
Copy this file to scripts/tests/ and customize for your scenario

Usage:
  cp scripts/templates/api-test-template.py scripts/tests/w1-my-test.py
  nano scripts/tests/w1-my-test.py  # Customize
  python3 scripts/tests/w1-my-test.py > test-outputs/w1-output.txt
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(__file__)))

from test_helper import IKAITestHelper, TEST_USERS
import json

def main():
    helper = IKAITestHelper()

    print("=" * 60)
    print("API TEST: [CHANGE THIS TO YOUR TEST NAME]")
    print("=" * 60)

    # Test Scenario 1: Login
    print("\n📋 Step 1: Testing login...")
    user = TEST_USERS["org1_admin"]  # Change role as needed
    helper.login(user["email"], user["password"])
    print("✅ Login successful")

    # Test Scenario 2: GET data
    print("\n📋 Step 2: Testing GET endpoint...")
    data = helper.get("/api/v1/job-postings")  # Change endpoint
    print(f"✅ Retrieved {len(data)} items")

    # Show first item as example
    if len(data) > 0:
        print(f"\nExample item:")
        print(json.dumps(data[0], indent=2)[:200] + "...")

    # Test Scenario 3: POST (create)
    print("\n📋 Step 3: Testing POST endpoint...")
    new_item = {
        "title": "Test Job Posting",
        "description": "Test description",
        "requirements": "Test requirements",
        "location": "Test Location",
        "salary": 50000,
        "status": "DRAFT"
    }

    try:
        result = helper.post("/api/v1/job-postings", new_item)
        created_id = result['id']
        print(f"✅ Created item: {created_id}")

        # Test Scenario 4: GET by ID
        print("\n📋 Step 4: Testing GET by ID...")
        item = helper.get(f"/api/v1/job-postings/{created_id}")
        print(f"✅ Retrieved item: {item['title']}")

        # Test Scenario 5: PUT (update)
        print("\n📋 Step 5: Testing PUT endpoint...")
        update_data = {
            "title": "Updated Title",
            "status": "PUBLISHED"
        }
        updated = helper.put(f"/api/v1/job-postings/{created_id}", update_data)
        print(f"✅ Updated item: {updated['title']}")

        # Test Scenario 6: DELETE (cleanup)
        print("\n📋 Step 6: Cleanup - Testing DELETE...")
        helper.delete(f"/api/v1/job-postings/{created_id}")
        print("✅ Deleted item")

    except Exception as e:
        print(f"❌ Error: {e}")

    print("\n" + "=" * 60)
    print("TEST COMPLETE")
    print("=" * 60)

if __name__ == "__main__":
    main()