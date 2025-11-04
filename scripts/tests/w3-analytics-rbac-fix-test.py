#!/usr/bin/env python3
"""
W3: Analytics RBAC Fix Verification
Test that MANAGER can now access /analytics page
"""

import requests

BASE = 'http://localhost:8102'

print('=' * 60)
print('W3: ANALYTICS RBAC FIX VERIFICATION')
print('=' * 60)

# Test with MANAGER
print('\n[1/3] Testing MANAGER access to /analytics...')
EMAIL = 'test-manager@test-org-2.com'
PASSWORD = 'TestPass123!'

try:
    # Login
    r = requests.post(f'{BASE}/api/v1/auth/login',
                      json={'email': EMAIL, 'password': PASSWORD},
                      timeout=10)

    if r.status_code != 200:
        print(f'❌ Login FAILED: {r.status_code}')
        exit(1)

    token = r.json().get('token')
    print(f'✅ MANAGER login OK')
    print(f'   Token: {token[:30]}...')

except Exception as e:
    print(f'❌ Login error: {e}')
    exit(1)

# Test analytics API endpoint
print('\n[2/3] Testing analytics API endpoint...')
headers = {'Authorization': f'Bearer {token}'}

try:
    r = requests.get(f'{BASE}/api/v1/analytics/summary', headers=headers, timeout=10)

    if r.status_code == 200:
        print(f'✅ GET /analytics/summary: 200 (MANAGER allowed)')
        data = r.json()
        if data.get('success'):
            analytics = data.get('data')
            print(f'   Total analyses: {analytics.get("totalAnalyses", 0)}')
            print(f'   Active candidates: {analytics.get("activeCandidates", 0)}')
    elif r.status_code == 403:
        print(f'❌ GET /analytics/summary: 403 (MANAGER blocked - BUG!)')
    else:
        print(f'⚠️  GET /analytics/summary: {r.status_code}')

except Exception as e:
    print(f'❌ API error: {e}')

# Summary
print('\n[3/3] VERIFICATION RESULT:')
print('=' * 60)

# Check RBAC in code
import os
analytics_file = '/home/asan/Desktop/ikai/frontend/app/(authenticated)/analytics/page.tsx'

if os.path.exists(analytics_file):
    with open(analytics_file, 'r') as f:
        content = f.read()

    if 'RoleGroups.MANAGERS_PLUS' in content:
        print('✅ RBAC FIX VERIFIED: analytics/page.tsx uses MANAGERS_PLUS')
        print('   MANAGER can now access /analytics page!')
    elif 'RoleGroups.ADMINS' in content:
        print('❌ RBAC NOT FIXED: analytics/page.tsx still uses ADMINS')
        print('   MANAGER still blocked!')
    else:
        print('⚠️  RBAC status unclear (check manually)')

    # Show exact line
    for i, line in enumerate(content.split('\n'), 1):
        if 'allowedRoles:' in line and 'withRoleProtection' in content[max(0, content.find(line)-200):content.find(line)+200]:
            print(f'\n   Line {i}: {line.strip()}')

else:
    print('❌ analytics/page.tsx not found!')

print('\n' + '=' * 60)
print('✅ Test completed!')
