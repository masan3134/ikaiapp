#!/usr/bin/env python3
"""
W2 Templates Test - Teklif Şablonları RBAC + API Test
"""

import requests
import json

BASE_URL = "http://localhost:8102/api/v1"

def test_templates():
    print("="*80)
    print("🧪 TEKLIF ŞABLONLARI TEST")
    print("="*80)

    # Test users
    users = [
        ("HR_SPECIALIST", "test-hr_specialist@test-org-2.com", "TestPass123!"),
        ("MANAGER", "test-manager@test-org-2.com", "TestPass123!"),
        ("ADMIN", "test-admin@test-org-1.com", "TestPass123!"),
        ("SUPER_ADMIN", "info@gaiai.ai", "23235656"),
    ]

    results = []

    for role, email, password in users:
        print(f"\n{'='*80}")
        print(f"Testing: {role} ({email})")
        print(f"{'='*80}")

        # Login
        try:
            r = requests.post(f"{BASE_URL}/auth/login",
                            json={"email": email, "password": password})
            if r.status_code != 200:
                print(f"❌ Login failed: {r.status_code}")
                continue

            token = r.json()['token']
            headers = {"Authorization": f"Bearer {token}"}
            print(f"✅ Login successful")
        except Exception as e:
            print(f"❌ Login error: {e}")
            continue

        # Test 1: List templates
        print(f"\n1️⃣  GET /offer-templates")
        try:
            r = requests.get(f"{BASE_URL}/offer-templates", headers=headers)
            status = "✅" if r.status_code == 200 else "❌"
            print(f"   {status} Status: {r.status_code}")
            if r.status_code == 200:
                data = r.json().get('data', [])
                print(f"   📊 Templates found: {len(data)}")
            results.append({
                'role': role,
                'endpoint': 'GET /offer-templates',
                'status': r.status_code,
                'success': r.status_code == 200
            })
        except Exception as e:
            print(f"   ❌ Error: {e}")
            results.append({
                'role': role,
                'endpoint': 'GET /offer-templates',
                'status': 'ERROR',
                'success': False
            })

        # Test 2: List categories
        print(f"\n2️⃣  GET /offer-template-categories")
        try:
            r = requests.get(f"{BASE_URL}/offer-template-categories", headers=headers)
            status = "✅" if r.status_code == 200 else "❌"
            print(f"   {status} Status: {r.status_code}")
            if r.status_code == 200:
                data = r.json().get('data', [])
                print(f"   📂 Categories found: {len(data)}")
            results.append({
                'role': role,
                'endpoint': 'GET /offer-template-categories',
                'status': r.status_code,
                'success': r.status_code == 200
            })
        except Exception as e:
            print(f"   ❌ Error: {e}")
            results.append({
                'role': role,
                'endpoint': 'GET /offer-template-categories',
                'status': 'ERROR',
                'success': False
            })

        # Test 3: Create template (POST)
        print(f"\n3️⃣  POST /offer-templates (Create)")
        try:
            test_template = {
                "name": f"W2 Test Template - {role}",
                "position": "Test Engineer",
                "department": "QA",
                "salaryMin": 50000,
                "salaryMax": 80000,
                "benefits": "Test benefits",
                "requirements": "Test requirements",
                "description": "Test description",
                "isActive": True
            }
            r = requests.post(f"{BASE_URL}/offer-templates",
                            headers=headers, json=test_template)

            # Expected: HR_MANAGERS_PLUS can create (HR, MANAGER, ADMIN, SUPER_ADMIN)
            expected = 201  # All roles should be able to create
            success = r.status_code == expected
            status = "✅" if success else "❌"
            print(f"   {status} Status: {r.status_code} (expected {expected})")

            template_id = None
            if r.status_code == 201:
                template_id = r.json().get('data', {}).get('id')
                print(f"   📝 Created template: {template_id}")

            results.append({
                'role': role,
                'endpoint': 'POST /offer-templates',
                'status': r.status_code,
                'expected': expected,
                'success': success
            })

            # Test 4: Delete template (if created)
            # All roles should be able to delete their own templates
            if template_id:
                print(f"\n4️⃣  DELETE /offer-templates/{template_id}")
                r = requests.delete(f"{BASE_URL}/offer-templates/{template_id}",
                                  headers=headers)
                expected_delete = 200
                success_delete = r.status_code == expected_delete
                status = "✅" if success_delete else "❌"
                print(f"   {status} Status: {r.status_code} (expected {expected_delete})")
                results.append({
                    'role': role,
                    'endpoint': 'DELETE /offer-templates/:id',
                    'status': r.status_code,
                    'expected': expected_delete,
                    'success': success_delete
                })

        except Exception as e:
            print(f"   ❌ Error: {e}")
            results.append({
                'role': role,
                'endpoint': 'POST /offer-templates',
                'status': 'ERROR',
                'success': False
            })

    # Summary
    print(f"\n{'='*80}")
    print("📊 TEST SUMMARY")
    print(f"{'='*80}")

    total = len(results)
    passed = sum(1 for r in results if r['success'])
    failed = total - passed

    print(f"\nTotal tests: {total}")
    print(f"✅ Passed: {passed}")
    print(f"❌ Failed: {failed}")
    print(f"Success rate: {(passed/total*100):.1f}%")

    print(f"\n📋 By Role:")
    for role in ["HR_SPECIALIST", "MANAGER", "ADMIN", "SUPER_ADMIN"]:
        role_results = [r for r in results if r['role'] == role]
        role_passed = sum(1 for r in role_results if r['success'])
        print(f"  {role}: {role_passed}/{len(role_results)}")

    # Save results
    with open('test-outputs/w2-templates-test-results.json', 'w') as f:
        json.dump(results, f, indent=2)
    print(f"\n✅ Results saved to test-outputs/w2-templates-test-results.json")

    return failed == 0

if __name__ == '__main__':
    import sys
    success = test_templates()
    sys.exit(0 if success else 1)
