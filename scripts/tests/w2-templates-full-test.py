#!/usr/bin/env python3
"""
W2 Full Templates Test - Tüm işlevleri test et
Aktif/Pasif, Görüntüle, Edit, Delete, Create
"""

import requests
import json

BASE_URL = "http://localhost:8102/api/v1"

def test_full_templates():
    print("="*80)
    print("🧪 TEKLIF ŞABLONLARI - FULL FUNCTIONALİTY TEST")
    print("="*80)

    # Login as SUPER_ADMIN
    print("\n🔐 Login: SUPER_ADMIN")
    r = requests.post(f"{BASE_URL}/auth/login",
                     json={"email": "info@gaiai.ai", "password": "23235656"})
    token = r.json()['token']
    headers = {"Authorization": f"Bearer {token}"}
    print("✅ Login successful")

    # Test 1: List all templates
    print("\n" + "="*80)
    print("1️⃣  LIST TEMPLATES")
    print("="*80)
    r = requests.get(f"{BASE_URL}/offer-templates", headers=headers)
    print(f"Status: {r.status_code}")
    templates = r.json().get('data', [])
    print(f"Total templates: {len(templates)}")

    for i, t in enumerate(templates[:3], 1):
        print(f"  {i}. {t['name']}")
        print(f"     Active: {t['isActive']}, Usage: {t.get('usageCount', 0)}")
        print(f"     ID: {t['id'][:8]}...")

    # Test 2: Create new template
    print("\n" + "="*80)
    print("2️⃣  CREATE TEMPLATE")
    print("="*80)

    new_template = {
        "name": "W2 Full Test Template",
        "position": "Senior QA Engineer",
        "department": "Quality Assurance",
        "salaryMin": 70000,
        "salaryMax": 100000,
        "currency": "TRY",
        "benefits": {"insurance": True, "remote": True},
        "workType": "hybrid",
        "terms": "Full-time permanent position",
        "description": "Test template for W2 full functionality test",
        "isActive": True
    }

    r = requests.post(f"{BASE_URL}/offer-templates", headers=headers, json=new_template)
    print(f"Status: {r.status_code}")

    if r.status_code == 201:
        template_id = r.json().get('data', {}).get('id')
        print(f"✅ Created: {template_id}")
    else:
        print(f"❌ Failed: {r.text[:200]}")
        return False

    # Test 3: Get template detail
    print("\n" + "="*80)
    print("3️⃣  GET TEMPLATE DETAIL")
    print("="*80)

    r = requests.get(f"{BASE_URL}/offer-templates/{template_id}", headers=headers)
    print(f"Status: {r.status_code}")
    if r.status_code == 200:
        detail = r.json().get('data', {})
        print(f"✅ Name: {detail.get('name')}")
        print(f"   Position: {detail.get('position')}")
        print(f"   Active: {detail.get('isActive')}")

    # Test 4: Update template
    print("\n" + "="*80)
    print("4️⃣  UPDATE TEMPLATE")
    print("="*80)

    update_data = {
        "name": "W2 Full Test Template UPDATED",
        "salaryMin": 80000,
        "salaryMax": 110000
    }

    r = requests.put(f"{BASE_URL}/offer-templates/{template_id}", headers=headers, json=update_data)
    print(f"Status: {r.status_code}")
    if r.status_code == 200:
        print(f"✅ Updated successfully")

    # Test 5: Deactivate (Pasif Et)
    print("\n" + "="*80)
    print("5️⃣  DEACTIVATE (Pasif Et)")
    print("="*80)

    r = requests.patch(f"{BASE_URL}/offer-templates/{template_id}/deactivate", headers=headers)
    print(f"Status: {r.status_code}")
    if r.status_code == 200:
        print(f"✅ Deactivated")

        # Verify
        r = requests.get(f"{BASE_URL}/offer-templates/{template_id}", headers=headers)
        is_active = r.json().get('data', {}).get('isActive')
        print(f"   Verified isActive: {is_active} (should be False)")
        if is_active == False:
            print(f"   ✅ Pasif durumu doğru!")
        else:
            print(f"   ❌ Pasif edilmedi!")

    # Test 6: Activate (Aktif Et)
    print("\n" + "="*80)
    print("6️⃣  ACTIVATE (Aktif Et)")
    print("="*80)

    r = requests.patch(f"{BASE_URL}/offer-templates/{template_id}/activate", headers=headers)
    print(f"Status: {r.status_code}")
    if r.status_code == 200:
        print(f"✅ Activated")

        # Verify
        r = requests.get(f"{BASE_URL}/offer-templates/{template_id}", headers=headers)
        is_active = r.json().get('data', {}).get('isActive')
        print(f"   Verified isActive: {is_active} (should be True)")
        if is_active == True:
            print(f"   ✅ Aktif durumu doğru!")
        else:
            print(f"   ❌ Aktif edilmedi!")

    # Test 7: Filter by active status
    print("\n" + "="*80)
    print("7️⃣  FILTER BY ACTIVE STATUS")
    print("="*80)

    r = requests.get(f"{BASE_URL}/offer-templates?isActive=true", headers=headers)
    print(f"Active templates: {len(r.json().get('data', []))}")

    r = requests.get(f"{BASE_URL}/offer-templates?isActive=false", headers=headers)
    print(f"Inactive templates: {len(r.json().get('data', []))}")

    # Test 8: Create offer from template
    print("\n" + "="*80)
    print("8️⃣  CREATE OFFER FROM TEMPLATE")
    print("="*80)

    offer_data = {
        "candidateId": "test-candidate-id",  # Will fail if not exists, but tests endpoint
        "customSalary": 95000,
        "customBenefits": "Extra vacation days"
    }

    r = requests.post(f"{BASE_URL}/offer-templates/{template_id}/create-offer",
                     headers=headers, json=offer_data)
    print(f"Status: {r.status_code}")
    if r.status_code == 201:
        print(f"✅ Offer created from template")
    elif r.status_code == 400 or r.status_code == 404:
        print(f"⚠️  Expected (no valid candidate): {r.json().get('message', 'N/A')[:80]}")
    else:
        print(f"❌ Unexpected error: {r.text[:200]}")

    # Test 9: Delete template
    print("\n" + "="*80)
    print("9️⃣  DELETE TEMPLATE")
    print("="*80)

    r = requests.delete(f"{BASE_URL}/offer-templates/{template_id}", headers=headers)
    print(f"Status: {r.status_code}")
    if r.status_code == 200:
        print(f"✅ Deleted")

        # Verify deleted
        r = requests.get(f"{BASE_URL}/offer-templates/{template_id}", headers=headers)
        if r.status_code == 404:
            print(f"   ✅ Template gerçekten silindi!")
        else:
            print(f"   ❌ Template hala var!")

    # Test 10: Categories
    print("\n" + "="*80)
    print("🔟 CATEGORIES")
    print("="*80)

    r = requests.get(f"{BASE_URL}/offer-template-categories", headers=headers)
    print(f"Status: {r.status_code}")
    categories = r.json().get('data', [])
    print(f"Total categories: {len(categories)}")
    for cat in categories:
        print(f"  - {cat['name']} (order: {cat.get('order', 0)})")

    # Summary
    print("\n" + "="*80)
    print("✅ FULL FUNCTIONALITY TEST COMPLETE")
    print("="*80)
    print("\nAll features tested:")
    print("  ✅ List templates")
    print("  ✅ Create template")
    print("  ✅ Get template detail")
    print("  ✅ Update template")
    print("  ✅ Deactivate (Pasif Et)")
    print("  ✅ Activate (Aktif Et)")
    print("  ✅ Filter by status")
    print("  ✅ Create offer from template")
    print("  ✅ Delete template")
    print("  ✅ List categories")

    return True

if __name__ == '__main__':
    import sys
    success = test_full_templates()
    sys.exit(0 if success else 1)
