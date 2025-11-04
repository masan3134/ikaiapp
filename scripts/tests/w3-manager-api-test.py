#!/usr/bin/env python3
"""
W3: MANAGER API Endpoint Test
Test all MANAGER-accessible API endpoints
"""

import requests
import json

BASE = 'http://localhost:8102'

print('=' * 60)
print('W3: MANAGER API ENDPOINT TEST')
print('=' * 60)

# Login
EMAIL = 'test-manager@test-org-2.com'
PASSWORD = 'TestPass123!'

print(f'\n[1/3] Login as MANAGER ({EMAIL})...')
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
    print(f'   Token: {token[:30]}...')
    print(f'   User ID: {user["id"]}')
    print(f'   Role: {user["role"]}')

except Exception as e:
    print(f'❌ Login error: {e}')
    exit(1)

headers = {'Authorization': f'Bearer {token}'}

# Test MANAGER-specific endpoints
print(f'\n[2/3] Testing MANAGER-specific API endpoints...')

endpoints = [
    # Team management
    ('GET', '/api/v1/team', 'Get team members list'),

    # Analytics (might be restricted to ADMIN only - let's check!)
    ('GET', '/api/v1/analytics/dashboard', 'Get analytics dashboard'),
    ('GET', '/api/v1/analytics/summary', 'Get analytics summary'),

    # Offers analytics
    ('GET', '/api/v1/analytics/offers/overview', 'Get offers overview'),
    ('GET', '/api/v1/analytics/offers/acceptance-rate', 'Get acceptance rate'),

    # HR endpoints (MANAGER should have access)
    ('GET', '/api/v1/job-postings', 'Get job postings'),
    ('GET', '/api/v1/candidates', 'Get candidates'),
    ('GET', '/api/v1/analyses', 'Get analyses'),
    ('GET', '/api/v1/offers', 'Get offers'),
    ('GET', '/api/v1/interviews', 'Get interviews'),
]

results = {
    '200_ok': [],
    '403_forbidden': [],
    '404_not_found': [],
    'other': []
}

for method, endpoint, description in endpoints:
    try:
        if method == 'GET':
            r = requests.get(f'{BASE}{endpoint}', headers=headers, timeout=10)

        status = r.status_code

        if status == 200:
            results['200_ok'].append((endpoint, description))
            print(f'   ✅ {description}: {status}')
        elif status == 403:
            results['403_forbidden'].append((endpoint, description))
            print(f'   ❌ {description}: {status} (FORBIDDEN - RBAC blocks MANAGER!)')
        elif status == 404:
            results['404_not_found'].append((endpoint, description))
            print(f'   ⚠️  {description}: {status} (NOT IMPLEMENTED)')
        else:
            results['other'].append((endpoint, description, status))
            print(f'   ⚠️  {description}: {status}')

    except Exception as e:
        print(f'   ❌ {description}: ERROR - {e}')

# Summary
print(f'\n[3/3] SUMMARY:')
print('=' * 60)
print(f'✅ SUCCESS (200): {len(results["200_ok"])}')
for endpoint, desc in results['200_ok']:
    print(f'   - {endpoint}')

print(f'\n❌ FORBIDDEN (403): {len(results["403_forbidden"])}')
for endpoint, desc in results['403_forbidden']:
    print(f'   - {endpoint} (RBAC blocks MANAGER!)')

print(f'\n⚠️  NOT FOUND (404): {len(results["404_not_found"])}')
for endpoint, desc in results['404_not_found']:
    print(f'   - {endpoint}')

if results['other']:
    print(f'\n⚠️  OTHER STATUS: {len(results["other"])}')
    for endpoint, desc, status in results['other']:
        print(f'   - {endpoint} ({status})')

print('\n' + '=' * 60)
print('✅ Test completed!')
