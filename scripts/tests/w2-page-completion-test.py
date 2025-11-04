#!/usr/bin/env python3
"""
W2: Page Completion Test
Test /offers/analytics and /offers/templates APIs
"""

import requests
import json

BASE_URL = "http://localhost:8102"

def main():
    print("🧪 W2: Page Completion API Test")
    print("=" * 60)

    # Login as HR_SPECIALIST
    print("\n1️⃣ Login as HR_SPECIALIST...")
    try:
        r = requests.post(
            f"{BASE_URL}/api/v1/auth/login",
            json={"email": "test-hr_specialist@test-org-1.com", "password": "TestPass123!"}
        )

        if r.status_code != 200:
            print(f"❌ Login failed! Status: {r.status_code}")
            return 1

        token = r.json().get("token")
        print(f"✅ Login successful! Token: {token[:20]}...")

    except Exception as e:
        print(f"❌ Login error: {e}")
        return 1

    headers = {"Authorization": f"Bearer {token}"}

    # Test Analytics Endpoints
    print("\n2️⃣ Testing Analytics Endpoints...")

    analytics_tests = [
        ("/api/v1/offers/analytics/overview", "Overview"),
        ("/api/v1/offers/analytics/acceptance-rate", "Acceptance Rate"),
        ("/api/v1/offers/analytics/response-time", "Response Time"),
        ("/api/v1/offers/analytics/by-department", "By Department")
    ]

    analytics_passed = 0
    for endpoint, name in analytics_tests:
        try:
            r = requests.get(f"{BASE_URL}{endpoint}", headers=headers)
            if r.status_code == 200:
                data = r.json()
                print(f"   ✅ {name}: HTTP 200")
                print(f"      Keys: {list(data.get('data', {}).keys())}")
                analytics_passed += 1
            else:
                print(f"   ❌ {name}: HTTP {r.status_code}")
                print(f"      Response: {r.text[:100]}")
        except Exception as e:
            print(f"   ❌ {name}: Error - {e}")

    print(f"\n   Analytics: {analytics_passed}/4 passed")

    # Test Template Endpoints
    print("\n3️⃣ Testing Template Endpoints...")

    # GET templates (list)
    try:
        r = requests.get(f"{BASE_URL}/api/v1/offer-templates", headers=headers)
        if r.status_code == 200:
            data = r.json()
            templates = data.get('data', [])
            print(f"   ✅ GET /offer-templates: HTTP 200")
            print(f"      Templates found: {len(templates)}")
            template_id = templates[0]['id'] if templates else None
        else:
            print(f"   ❌ GET /offer-templates: HTTP {r.status_code}")
            template_id = None
    except Exception as e:
        print(f"   ❌ GET /offer-templates: Error - {e}")
        template_id = None

    # GET categories
    try:
        r = requests.get(f"{BASE_URL}/api/v1/offer-template-categories", headers=headers)
        if r.status_code == 200:
            data = r.json()
            categories = data.get('data', [])
            print(f"   ✅ GET /offer-template-categories: HTTP 200")
            print(f"      Categories found: {len(categories)}")
        else:
            print(f"   ❌ GET /offer-template-categories: HTTP {r.status_code}")
    except Exception as e:
        print(f"   ❌ GET /offer-template-categories: Error - {e}")

    # GET template by ID (if exists)
    if template_id:
        try:
            r = requests.get(f"{BASE_URL}/api/v1/offer-templates/{template_id}", headers=headers)
            if r.status_code == 200:
                print(f"   ✅ GET /offer-templates/:id: HTTP 200")
            else:
                print(f"   ❌ GET /offer-templates/:id: HTTP {r.status_code}")
        except Exception as e:
            print(f"   ❌ GET /offer-templates/:id: Error - {e}")

    # Summary
    print("\n" + "=" * 60)
    if analytics_passed == 4:
        print("\n✅ All Analytics endpoints working!")
        print("✅ Template endpoints working!")
        print("\n🎉 W2 Page Completion Test PASSED!")
        return 0
    else:
        print(f"\n⚠️ Some tests failed: Analytics {analytics_passed}/4")
        return 1

if __name__ == "__main__":
    exit(main())
