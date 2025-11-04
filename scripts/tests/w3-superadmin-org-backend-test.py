#!/usr/bin/env python3
"""
W3: SUPER_ADMIN Organization Management - Backend Test
Test all organization management endpoints
"""

import requests
import json

BASE = 'http://localhost:8102'

print('=' * 70)
print('SUPER_ADMIN: ORGANIZATION MANAGEMENT - BACKEND TEST')
print('=' * 70)

# Login as SUPER_ADMIN
EMAIL = 'info@gaiai.ai'
PASSWORD = '23235656'

print(f'\n[1/7] Login as SUPER_ADMIN ({EMAIL})...')
try:
    r = requests.post(f'{BASE}/api/v1/auth/login',
                      json={'email': EMAIL, 'password': PASSWORD},
                      timeout=10)

    if r.status_code != 200:
        print(f'❌ Login FAILED: {r.status_code}')
        exit(1)

    token = r.json().get('token')
    user = r.json().get('user')

    print(f'✅ Login OK')
    print(f'   Role: {user["role"]}')
    print(f'   User ID: {user["id"]}')

except Exception as e:
    print(f'❌ Login error: {e}')
    exit(1)

headers = {'Authorization': f'Bearer {token}'}

# Test 1: GET /super-admin/organizations (List all orgs)
print(f'\n[2/7] GET /api/v1/super-admin/organizations (List all orgs)...')

try:
    r = requests.get(f'{BASE}/api/v1/super-admin/organizations',
                     headers=headers,
                     timeout=10)

    if r.status_code == 200:
        data = r.json()

        if data.get('success'):
            orgs = data.get('data', [])
            print(f'✅ List organizations: {r.status_code}')
            print(f'   Total organizations: {len(orgs)}')

            # Print org details
            print(f'\n   Organizations:')
            for i, org in enumerate(orgs, 1):
                print(f'   {i}. {org.get("name")} ({org.get("plan")})')
                print(f'      ID: {org.get("id")}')
                print(f'      Users: {org.get("_count", {}).get("users", "N/A")}')
                print(f'      Active: {org.get("isActive", "N/A")}')
                print(f'      Created: {org.get("createdAt", "N/A")[:10]}')
        else:
            print(f'⚠️  Response not success: {data}')
    else:
        print(f'❌ List organizations FAILED: {r.status_code}')
        print(f'   Response: {r.text[:200]}')

except Exception as e:
    print(f'❌ List organizations error: {e}')

# Test 2: GET /super-admin/organizations/:id (Single org details)
print(f'\n[3/7] GET /api/v1/super-admin/organizations/:id (Single org)...')

if orgs:
    test_org_id = orgs[0]['id']

    try:
        r = requests.get(f'{BASE}/api/v1/super-admin/organizations/{test_org_id}',
                         headers=headers,
                         timeout=10)

        if r.status_code == 200:
            org = r.json().get('data', {})
            print(f'✅ Get single organization: {r.status_code}')
            print(f'   Name: {org.get("name")}')
            print(f'   Plan: {org.get("plan")}')
            print(f'   Users: {org.get("_count", {}).get("users", "N/A")}')
        elif r.status_code == 404:
            print(f'⚠️  Endpoint not implemented: 404')
        else:
            print(f'❌ Get single org FAILED: {r.status_code}')
            print(f'   Response: {r.text[:200]}')

    except Exception as e:
        print(f'❌ Get single org error: {e}')
else:
    print(f'⚠️  No organizations to test')

# Test 3: GET /super-admin/organizations/stats (Org statistics)
print(f'\n[4/7] GET /api/v1/super-admin/organizations/stats (Stats)...')

try:
    r = requests.get(f'{BASE}/api/v1/super-admin/organizations/stats',
                     headers=headers,
                     timeout=10)

    if r.status_code == 200:
        stats = r.json().get('data', {})
        print(f'✅ Get organization stats: {r.status_code}')
        print(f'   Total Orgs: {stats.get("totalOrganizations", "N/A")}')
        print(f'   Active Orgs: {stats.get("activeOrganizations", "N/A")}')
        print(f'   Total Users: {stats.get("totalUsers", "N/A")}')
        print(f'   Today New: {stats.get("todayNew", "N/A")}')
    elif r.status_code == 404:
        print(f'⚠️  Endpoint not implemented: 404')
    else:
        print(f'❌ Get stats FAILED: {r.status_code}')
        print(f'   Response: {r.text[:200]}')

except Exception as e:
    print(f'❌ Get stats error: {e}')

# Test 4: POST /super-admin/organizations (Create new org)
print(f'\n[5/7] POST /api/v1/super-admin/organizations (Create org)...')

new_org_data = {
    'name': 'W3 Test Organization',
    'slug': f'w3-test-org-{int(__import__("time").time())}',
    'plan': 'FREE',
    'maxUsers': 2,
    'maxAnalysisPerMonth': 10,
    'maxCvPerMonth': 50
}

try:
    r = requests.post(f'{BASE}/api/v1/super-admin/organizations',
                      headers=headers,
                      json=new_org_data,
                      timeout=10)

    if r.status_code in [200, 201]:
        new_org = r.json().get('data', {})
        print(f'✅ Create organization: {r.status_code}')
        print(f'   Name: {new_org.get("name")}')
        print(f'   ID: {new_org.get("id")}')
        print(f'   Plan: {new_org.get("plan")}')

        created_org_id = new_org.get('id')
    elif r.status_code == 404:
        print(f'⚠️  Endpoint not implemented: 404')
        created_org_id = None
    else:
        print(f'❌ Create org FAILED: {r.status_code}')
        print(f'   Response: {r.text[:200]}')
        created_org_id = None

except Exception as e:
    print(f'❌ Create org error: {e}')
    created_org_id = None

# Test 5: PATCH /super-admin/organizations/:id (Update org)
print(f'\n[6/7] PATCH /api/v1/super-admin/organizations/:id (Update org)...')

if created_org_id:
    update_data = {
        'plan': 'PRO',
        'maxUsers': 10
    }

    try:
        r = requests.patch(f'{BASE}/api/v1/super-admin/organizations/{created_org_id}',
                           headers=headers,
                           json=update_data,
                           timeout=10)

        if r.status_code == 200:
            updated_org = r.json().get('data', {})
            print(f'✅ Update organization: {r.status_code}')
            print(f'   Plan: {updated_org.get("plan")}')
            print(f'   Max Users: {updated_org.get("maxUsers")}')
        elif r.status_code == 404:
            print(f'⚠️  Endpoint not implemented: 404')
        else:
            print(f'❌ Update org FAILED: {r.status_code}')
            print(f'   Response: {r.text[:200]}')

    except Exception as e:
        print(f'❌ Update org error: {e}')
else:
    print(f'⚠️  No org created to update')

# Test 6: PATCH /super-admin/organizations/:id/toggle (Toggle active status)
print(f'\n[7/7] PATCH /api/v1/super-admin/organizations/:id/toggle (Toggle)...')

if created_org_id:
    try:
        r = requests.patch(f'{BASE}/api/v1/super-admin/organizations/{created_org_id}/toggle',
                           headers=headers,
                           timeout=10)

        if r.status_code == 200:
            toggled_org = r.json().get('data', {})
            print(f'✅ Toggle organization: {r.status_code}')
            print(f'   Active: {toggled_org.get("isActive")}')
        elif r.status_code == 404:
            print(f'⚠️  Endpoint not implemented: 404')
        else:
            print(f'❌ Toggle org FAILED: {r.status_code}')
            print(f'   Response: {r.text[:200]}')

    except Exception as e:
        print(f'❌ Toggle org error: {e}')
else:
    print(f'⚠️  No org created to toggle')

# Test 7: DELETE /super-admin/organizations/:id (Delete org)
# Skipped to avoid deleting test data

# Summary
print(f'\n' + '=' * 70)
print('BACKEND TEST SUMMARY')
print('=' * 70)

print(f'\n📊 Endpoints Tested:')
print(f'   1. GET /organizations - List all orgs')
print(f'   2. GET /organizations/:id - Single org details')
print(f'   3. GET /organizations/stats - Statistics')
print(f'   4. POST /organizations - Create org')
print(f'   5. PATCH /organizations/:id - Update org')
print(f'   6. PATCH /organizations/:id/toggle - Toggle status')
print(f'   7. DELETE /organizations/:id - Delete org (not tested)')

print(f'\n✅ Test completed!')
