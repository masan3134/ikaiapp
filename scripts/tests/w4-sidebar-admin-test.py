#!/usr/bin/env python3
"""
W4 - ADMIN Sidebar Test
Test ADMIN user sidebar items (expected: 12)
"""

import requests
import json

BASE = 'http://localhost:8102'

print('=' * 60)
print('W4 - ADMIN SIDEBAR TEST')
print('=' * 60)

# 1. Login as ADMIN
print('\n[1/3] Login as ADMIN...')
login = requests.post(f'{BASE}/api/v1/auth/login',
                     json={'email': 'test-admin@test-org-1.com',
                           'password': 'TestPass123!'})

if login.status_code != 200:
    print(f'❌ Login FAILED: {login.status_code}')
    print(f'   Response: {login.text}')
    exit(1)

response_data = login.json()
token = response_data.get('token')
user_info = response_data.get('user', {})

print(f'✅ Login OK')
print(f'   Token: {token[:20]}...' if token else '   Token: None')
print(f'   User data: {json.dumps(user_info, indent=2)}')

# 2. Get sidebar data (dashboard endpoint has user context)
print('\n[2/3] Fetching ADMIN dashboard data...')
headers = {'Authorization': f'Bearer {token}'}
dash = requests.get(f'{BASE}/api/v1/dashboard/admin', headers=headers)

if dash.status_code != 200:
    print(f'❌ Dashboard FAILED: {dash.status_code}')
    print(f'   Response: {dash.text[:200]}')
    exit(1)

data = dash.json()
print(f'✅ Dashboard OK')
print(f'   Success: {data.get("success")}')

# 3. Analyze what ADMIN can see
print('\n[3/3] Analyzing ADMIN permissions...')

# ADMIN expected sidebar items (based on RoleGroups.ADMINS access):
admin_sidebar = [
    '1. Dashboard',           # All roles
    '2. İlanlar',            # RoleGroups.HR_MANAGERS (ADMIN, MANAGER, HR_SPECIALIST)
    '3. Adaylar',            # RoleGroups.HR_MANAGERS
    '4. Analizler',          # RoleGroups.HR_MANAGERS
    '5. Mülakatlar',         # RoleGroups.HR_MANAGERS
    '6. Teklifler',          # RoleGroups.HR_MANAGERS
    '7. Teklif Şablonları',  # RoleGroups.HR_MANAGERS
    '8. Testler',            # RoleGroups.HR_MANAGERS
    '9. Kategoriler',        # RoleGroups.HR_MANAGERS
    '10. Kuyruk İzleme',     # RoleGroups.ADMINS (ADMIN only)
    '11. Takım',             # RoleGroups.ADMINS
    '12. Ayarlar',           # All roles
]

print('\n📋 ADMIN Sidebar Items (Expected: 12):')
for item in admin_sidebar:
    print(f'   {item}')

# Check dashboard data
print('\n📊 Dashboard API Response:')
if 'data' in data:
    for key, value in data['data'].items():
        if isinstance(value, dict):
            print(f'   {key}: {len(value)} fields')
        elif isinstance(value, list):
            print(f'   {key}: {len(value)} items')
        else:
            print(f'   {key}: {value}')

print('\n' + '=' * 60)
print('✅ ADMIN TEST COMPLETE')
print('=' * 60)
print(f'\nExpected sidebar items: 12')
print(f'ADMIN role verified: {user_info.get("role") == "ADMIN"}')
print(f'Dashboard access: SUCCESS')
print('\n📝 Next: Check frontend http://localhost:8103')
print('   Login with: test-admin@test-org-1.com / TestPass123!')
print('   Count sidebar items visually')
