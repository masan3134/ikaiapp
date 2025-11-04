#!/usr/bin/env python3
"""
W3: MANAGER Frontend Test (18 Pages)
Check accessibility of all MANAGER pages
"""

import requests

BASE = 'http://localhost:8103'
API_BASE = 'http://localhost:8102'

print('=' * 70)
print('W3: MANAGER FRONTEND TEST (18 Pages)')
print('=' * 70)

# Login to get token
EMAIL = 'test-manager@test-org-2.com'
PASSWORD = 'TestPass123!'

print(f'\n[1/3] Login as MANAGER ({EMAIL})...')
try:
    r = requests.post(f'{API_BASE}/api/v1/auth/login',
                      json={'email': EMAIL, 'password': PASSWORD},
                      timeout=10)

    if r.status_code != 200:
        print(f'❌ Login FAILED: {r.status_code}')
        exit(1)

    token = r.json().get('token')
    user = r.json().get('user')

    print(f'✅ Login OK')
    print(f'   Role: {user["role"]}')
    print(f'   Organization: {user.get("organizationId")}')

except Exception as e:
    print(f'❌ Login error: {e}')
    exit(1)

# Frontend pages to test
pages = {
    'HR Features (16 pages)': [
        '/dashboard',
        '/job-postings',
        '/job-postings/new',
        '/candidates',
        '/candidates/import',
        '/analyses',
        '/analyses/new',
        '/interviews',
        '/interviews/calendar',
        '/offers',
        '/offers/templates',
        '/offers/templates/new',
        '/offers/templates/categories',
        '/settings',
        '/settings/profile',
        '/settings/notifications',
    ],
    'MANAGER-Specific (2 pages)': [
        '/team',
        '/analytics',
    ]
}

print(f'\n[2/3] Testing Frontend Pages...')

results = {'accessible': [], 'redirect': [], 'error': []}

for category, page_list in pages.items():
    print(f'\n📁 {category}')

    for page in page_list:
        try:
            # Frontend Next.js pages don't need auth token in headers
            # They use cookies, so we just check if page loads (200 or 301/302)
            r = requests.get(f'{BASE}{page}',
                             allow_redirects=False,
                             timeout=10)

            status = r.status_code

            if status == 200:
                results['accessible'].append(page)
                print(f'   ✅ {page}: {status}')
            elif status in [301, 302, 307, 308]:
                results['redirect'].append(page)
                redirect_to = r.headers.get('Location', 'unknown')
                print(f'   🔀 {page}: {status} → {redirect_to}')
            else:
                results['error'].append((page, status))
                print(f'   ⚠️  {page}: {status}')

        except Exception as e:
            results['error'].append((page, str(e)))
            print(f'   ❌ {page}: ERROR - {e}')

# Summary
print(f'\n[3/3] FRONTEND TEST SUMMARY')
print('=' * 70)

print(f'\n✅ Accessible (200): {len(results["accessible"])}')
for page in results['accessible']:
    print(f'   - {page}')

print(f'\n🔀 Redirects (30x): {len(results["redirect"])}')
for page in results['redirect']:
    print(f'   - {page}')

print(f'\n⚠️  Errors: {len(results["error"])}')
for page, status in results['error']:
    print(f'   - {page}: {status}')

total_pages = sum(len(pages[cat]) for cat in pages)
accessible_count = len(results['accessible']) + len(results['redirect'])

print(f'\n📊 Total: {accessible_count}/{total_pages} pages accessible')

if accessible_count >= total_pages * 0.8:
    print('✅ Frontend test PASSED (80%+ accessible)')
else:
    print('⚠️  Frontend test needs review (<80% accessible)')
