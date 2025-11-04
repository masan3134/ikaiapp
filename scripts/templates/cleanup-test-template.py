#!/usr/bin/env python3
"""
Cleanup Test Template
Clean up test data created during testing

Usage:
  cp scripts/templates/cleanup-test-template.py scripts/tests/cleanup.py
  python3 scripts/tests/cleanup.py
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(__file__)))

from test_helper import IKAITestHelper, TEST_USERS

def cleanup_test_items(helper, endpoint, filter_field="title", filter_value="Test"):
    """Delete items that match filter (e.g., title contains 'Test')"""

    print(f"\n🧹 Cleaning up: {endpoint}")

    # Get all items
    items = helper.get(endpoint)
    print(f"   Total items: {len(items)}")

    # Filter test items
    test_items = [
        item for item in items
        if filter_value.lower() in str(item.get(filter_field, "")).lower()
    ]

    print(f"   Test items found: {len(test_items)}")

    if len(test_items) == 0:
        print(f"   ✅ No test items to clean")
        return 0

    # Delete test items
    deleted = 0
    for item in test_items:
        try:
            item_id = item['id']
            item_name = item.get(filter_field, 'Unknown')
            helper.delete(f"{endpoint}/{item_id}")
            print(f"   ✅ Deleted: {item_name} ({item_id[:8]}...)")
            deleted += 1
        except Exception as e:
            print(f"   ❌ Failed to delete {item_id}: {e}")

    print(f"   🧹 Cleaned: {deleted}/{len(test_items)} items")
    return deleted

def main():
    helper = IKAITestHelper()

    print("=" * 60)
    print("CLEANUP: Remove Test Data")
    print("=" * 60)

    # Login as ADMIN (delete permissions)
    print("\n📋 Login as ADMIN")
    helper.login(TEST_USERS["org1_admin"]["email"], TEST_USERS["org1_admin"]["password"])
    print("✅ Logged in")

    # Cleanup categories
    total_deleted = 0

    # 1. Job Postings
    deleted = cleanup_test_items(
        helper,
        "/api/v1/job-postings",
        filter_field="title",
        filter_value="Test"
    )
    total_deleted += deleted

    # 2. Candidates
    deleted = cleanup_test_items(
        helper,
        "/api/v1/candidates",
        filter_field="name",
        filter_value="Test"
    )
    total_deleted += deleted

    # 3. Offers
    deleted = cleanup_test_items(
        helper,
        "/api/v1/offers",
        filter_field="notes",
        filter_value="test"
    )
    total_deleted += deleted

    # 4. Interviews
    deleted = cleanup_test_items(
        helper,
        "/api/v1/interviews",
        filter_field="notes",
        filter_value="test"
    )
    total_deleted += deleted

    # Summary
    print("\n" + "=" * 60)
    print("CLEANUP COMPLETE")
    print("=" * 60)
    print(f"\nTotal items deleted: {total_deleted}")

    print(f"\n⚠️ Note: Analyses cannot be deleted via this script")
    print(f"   (Use ADMIN UI or direct API call)")

if __name__ == "__main__":
    main()
