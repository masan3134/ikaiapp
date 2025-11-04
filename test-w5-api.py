#!/usr/bin/env python3
"""W5: SUPER_ADMIN API Test"""

import requests

BASE = 'http://localhost:8102'

print('=' * 60)
print('W5: SUPER_ADMIN API TEST')
print('=' * 60)

# Login as SUPER_ADMIN
print('\n1. Login as SUPER_ADMIN...')
login = requests.post(f'{BASE}/api/v1/auth/login',
                     json={'email': 'info@gaiai.ai',
                           'password': '23235656'})

if login.status_code != 200:
    print(f'❌ Login FAILED: {login.text}')
    exit(1)

token = login.json()['token']
print('✅ Login OK')

headers = {'Authorization': f'Bearer {token}'}

# Test endpoints
endpoints = [
    ('/api/v1/dashboard/super-admin', 'Dashboard'),
    ('/api/v1/super-admin/organizations', 'Organizations'),
    ('/api/v1/super-admin/stats', 'Stats'),
    ('/api/v1/super-admin/system-health', 'System Health'),
    ('/api/v1/super-admin/security-logs', 'Security Logs'),  # Check if exists
]

print('\n2. Testing endpoints...')
for endpoint, name in endpoints:
    try:
        r = requests.get(f'{BASE}{endpoint}', headers=headers)
        if r.status_code == 200:
            data = r.json()
            if data.get('success'):
                print(f'✅ {name}: OK')

                # Check cross-org for dashboard
                if 'dashboard/super-admin' in endpoint:
                    org_count = data.get('data', {}).get('organizations', {}).get('total', 0)
                    print(f'   → Organizations: {org_count}')
                    if org_count >= 3:
                        print(f'   → ✅ Cross-org verified (3+ orgs)')
                    else:
                        print(f'   → ⚠️ Low org count (expected 3+)')
            else:
                print(f'❌ {name}: {r.status_code} - {data.get("error", "Unknown error")}')
        elif r.status_code == 404:
            print(f'❌ {name}: NOT FOUND (API missing!)')
        else:
            print(f'❌ {name}: {r.status_code}')
    except Exception as e:
        print(f'❌ {name}: Error - {e}')

print('\n' + '=' * 60)
print('TEST COMPLETE')
print('=' * 60)
