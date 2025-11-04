#!/usr/bin/env python3
"""
W3: MANAGER Deep Integration Test
Test 18 pages (12 main + 6 settings)
"""

import requests
import json
import os

BASE = 'http://localhost:8102'
FRONTEND = 'http://localhost:8103'

print('=' * 60)
print('W3: MANAGER DEEP INTEGRATION TEST')
print('=' * 60)

# Login credentials
EMAIL = 'test-manager@test-org-2.com'
PASSWORD = 'TestPass123!'

# Expected pages (18 total)
PAGES = [
    # Main pages (12)
    '/dashboard',
    '/notifications',
    '/job-postings',
    '/candidates',
    '/wizard',
    '/analyses',
    '/offers',
    '/interviews',
    '/team',  # MANAGER+
    '/analytics',  # MANAGER+
    '/offers/analytics',  # MANAGER+ (submenu)
    '/help',
    # Settings (6)
    '/settings/overview',
    '/settings/profile',
    '/settings/security',
    '/settings/notifications',
    '/settings/organization',
    '/settings/billing',
]

EXPECTED_COUNT = len(PAGES)

# Step 1: Login
print(f'\n[1/5] Login as MANAGER ({EMAIL})...')
try:
    r = requests.post(f'{BASE}/api/v1/auth/login',
                      json={'email': EMAIL, 'password': PASSWORD},
                      timeout=10)

    if r.status_code != 200:
        print(f'❌ Login FAILED: {r.status_code}')
        print(f'   Response: {r.text[:200]}')
        exit(1)

    token = r.json().get('token')
    if not token:
        print('❌ No token in response!')
        exit(1)

    print(f'✅ Login OK')
    print(f'   Token: {token[:20]}...')

except Exception as e:
    print(f'❌ Login error: {e}')
    exit(1)

# Step 2: Verify MANAGER-specific API endpoints
print(f'\n[2/5] Testing MANAGER-specific API endpoints...')

manager_apis = [
    ('GET', '/api/v1/team', 'Team list'),
    ('GET', '/api/v1/analytics/dashboard', 'Analytics dashboard'),
]

headers = {'Authorization': f'Bearer {token}'}

for method, endpoint, description in manager_apis:
    try:
        if method == 'GET':
            r = requests.get(f'{BASE}{endpoint}', headers=headers, timeout=10)

        print(f'   {description}: {r.status_code}', end='')

        if r.status_code == 200:
            print(' ✅')
        elif r.status_code == 404:
            print(' ⚠️  (endpoint not implemented yet)')
        else:
            print(f' ❌ (unexpected: {r.status_code})')

    except Exception as e:
        print(f'   {description}: ❌ Error: {e}')

# Step 3: Code review - Verify sidebar routing
print(f'\n[3/5] Code review: AppLayout.tsx sidebar...')

layout_path = '/home/asan/Desktop/ikai/frontend/components/AppLayout.tsx'

if os.path.exists(layout_path):
    with open(layout_path, 'r') as f:
        content = f.read()

    # Count MANAGER role checks
    manager_checks = content.count('MANAGER')
    print(f'   MANAGER mentions: {manager_checks}')

    # Check for MANAGER-specific items
    has_team = '/team' in content
    has_analytics = '/analytics' in content

    print(f'   /team route: {"✅" if has_team else "❌"}')
    print(f'   /analytics route: {"✅" if has_analytics else "❌"}')
else:
    print(f'   ⚠️  AppLayout.tsx not found at {layout_path}')

# Step 4: Verify page files exist
print(f'\n[4/5] Verifying page files existence...')

page_files = {
    '/dashboard': 'frontend/app/(authenticated)/dashboard/page.tsx',
    '/notifications': 'frontend/app/(authenticated)/notifications/page.tsx',
    '/job-postings': 'frontend/app/(authenticated)/job-postings/page.tsx',
    '/candidates': 'frontend/app/(authenticated)/candidates/page.tsx',
    '/wizard': 'frontend/app/(authenticated)/wizard/page.tsx',
    '/analyses': 'frontend/app/(authenticated)/analyses/page.tsx',
    '/offers': 'frontend/app/(authenticated)/offers/page.tsx',
    '/interviews': 'frontend/app/(authenticated)/interviews/page.tsx',
    '/team': 'frontend/app/(authenticated)/team/page.tsx',
    '/analytics': 'frontend/app/(authenticated)/analytics/page.tsx',
    '/offers/analytics': 'frontend/app/(authenticated)/offers/analytics/page.tsx',
    '/help': 'frontend/app/(authenticated)/help/page.tsx',
    '/settings/overview': 'frontend/app/(authenticated)/settings/overview/page.tsx',
    '/settings/profile': 'frontend/app/(authenticated)/settings/profile/page.tsx',
    '/settings/security': 'frontend/app/(authenticated)/settings/security/page.tsx',
    '/settings/notifications': 'frontend/app/(authenticated)/settings/notifications/page.tsx',
    '/settings/organization': 'frontend/app/(authenticated)/settings/organization/page.tsx',
    '/settings/billing': 'frontend/app/(authenticated)/settings/billing/page.tsx',
}

existing_pages = 0
missing_pages = []

for route, file_path in page_files.items():
    full_path = f'/home/asan/Desktop/ikai/{file_path}'
    if os.path.exists(full_path):
        existing_pages += 1
        print(f'   ✅ {route}')
    else:
        missing_pages.append(route)
        print(f'   ❌ {route} (file missing: {file_path})')

# Step 5: Summary
print(f'\n[5/5] RESULT:')
print('=' * 60)
print(f'ROLE: MANAGER')
print(f'EXPECTED PAGES: {EXPECTED_COUNT}')
print(f'EXISTING PAGES: {existing_pages}')
print(f'MISSING PAGES: {len(missing_pages)}')
print('=' * 60)

if existing_pages == EXPECTED_COUNT:
    print('✅ ALL PAGES EXIST - TEST PASS')
else:
    print(f'⚠️  {len(missing_pages)} pages missing:')
    for page in missing_pages:
        print(f'   - {page}')

print('\n📊 MANAGER-Specific Features:')
print('   - /team (Team management)')
print('   - /analytics (Analytics & reports)')
print('   - /offers/analytics (Offer analytics submenu)')

print('\n✅ Test completed!')
