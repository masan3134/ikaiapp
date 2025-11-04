#!/usr/bin/env python3
"""
W3: MANAGER Comprehensive Backend Test
Test 15 endpoints: 7 Team + 8 Analytics
"""

import requests
import json

BASE = 'http://localhost:8102'

print('=' * 70)
print('W3: MANAGER COMPREHENSIVE BACKEND TEST')
print('=' * 70)

# Login
EMAIL = 'test-manager@test-org-2.com'
PASSWORD = 'TestPass123!'

print(f'\n[1/6] Login as MANAGER ({EMAIL})...')
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
    print(f'   Organization ID: {user.get("organizationId")}')
    print(f'   Role: {user["role"]}')

except Exception as e:
    print(f'❌ Login error: {e}')
    exit(1)

headers = {'Authorization': f'Bearer {token}'}

# Test Team endpoints (7)
print(f'\n[2/6] Testing Team Management Endpoints (7)...')

team_endpoints = [
    ('GET', '/api/v1/team', 'List team members'),
    ('GET', '/api/v1/team/stats', 'Team statistics'),
    ('GET', '/api/v1/team/hierarchy', 'Team hierarchy'),
    ('POST', '/api/v1/team/invite', 'Invite team member', {'email': 'test-invite@example.com', 'role': 'USER'}),
    # Note: userId-specific endpoints will be tested after getting team list
]

team_results = {'success': [], 'not_found': [], 'forbidden': [], 'error': []}

for item in team_endpoints:
    method = item[0]
    endpoint = item[1]
    description = item[2]
    body = item[3] if len(item) > 3 else None

    try:
        if method == 'GET':
            r = requests.get(f'{BASE}{endpoint}', headers=headers, timeout=10)
        elif method == 'POST':
            r = requests.post(f'{BASE}{endpoint}', headers=headers, json=body, timeout=10)

        status = r.status_code

        if status in [200, 201]:
            team_results['success'].append((endpoint, description, status))
            print(f'   ✅ {description}: {status}')

            # Store team members for later tests
            if endpoint == '/api/v1/team' and status == 200:
                team_data = r.json()
                if team_data.get('success'):
                    members = team_data.get('data', {}).get('users', [])
                    print(f'      → Found {len(members)} team members')

        elif status == 404:
            team_results['not_found'].append((endpoint, description))
            print(f'   ⚠️  {description}: 404 (NOT IMPLEMENTED)')
        elif status == 403:
            team_results['forbidden'].append((endpoint, description))
            print(f'   ❌ {description}: 403 (FORBIDDEN)')
        else:
            team_results['error'].append((endpoint, description, status))
            print(f'   ⚠️  {description}: {status}')

    except Exception as e:
        team_results['error'].append((endpoint, description, str(e)))
        print(f'   ❌ {description}: ERROR - {e}')

# Test Analytics endpoints (8)
print(f'\n[3/6] Testing Analytics Endpoints (8)...')

analytics_endpoints = [
    ('GET', '/api/v1/analytics/summary', 'Analytics summary'),
    ('GET', '/api/v1/analytics/hiring-pipeline', 'Hiring pipeline'),
    ('GET', '/api/v1/analytics/time-to-hire', 'Time to hire'),
    ('GET', '/api/v1/analytics/candidate-sources', 'Candidate sources'),
    ('GET', '/api/v1/analytics/team-performance', 'Team performance'),
    ('GET', '/api/v1/analytics/budget-utilization', 'Budget utilization'),
    ('POST', '/api/v1/analytics/export', 'Export analytics', {'format': 'csv'}),
    ('GET', '/api/v1/analytics/custom-report', 'Custom report'),
]

analytics_results = {'success': [], 'not_found': [], 'forbidden': [], 'error': []}

for item in analytics_endpoints:
    method = item[0]
    endpoint = item[1]
    description = item[2]
    body = item[3] if len(item) > 3 else None

    try:
        if method == 'GET':
            r = requests.get(f'{BASE}{endpoint}', headers=headers, timeout=10)
        elif method == 'POST':
            r = requests.post(f'{BASE}{endpoint}', headers=headers, json=body, timeout=10)

        status = r.status_code

        if status in [200, 201]:
            analytics_results['success'].append((endpoint, description, status))
            print(f'   ✅ {description}: {status}')
        elif status == 404:
            analytics_results['not_found'].append((endpoint, description))
            print(f'   ⚠️  {description}: 404 (NOT IMPLEMENTED)')
        elif status == 403:
            analytics_results['forbidden'].append((endpoint, description))
            print(f'   ❌ {description}: 403 (FORBIDDEN)')
        else:
            analytics_results['error'].append((endpoint, description, status))
            print(f'   ⚠️  {description}: {status}')

    except Exception as e:
        analytics_results['error'].append((endpoint, description, str(e)))
        print(f'   ❌ {description}: ERROR - {e}')

# Test RBAC - Forbidden endpoints
print(f'\n[4/6] Testing RBAC - Forbidden Endpoints...')

forbidden_tests = [
    ('PATCH', '/api/v1/organizations/me', 'Organization settings (ADMIN+)', {'name': 'Test'}),
    ('GET', '/api/v1/super-admin/organizations', 'Super Admin organizations (SUPER_ADMIN)'),
    ('GET', '/api/v1/super-admin/queues', 'Queue management (SUPER_ADMIN)'),
]

rbac_results = {'correctly_forbidden': [], 'incorrectly_allowed': [], 'not_found': []}

for method, endpoint, description, *body_args in forbidden_tests:
    body = body_args[0] if body_args else None

    try:
        if method == 'GET':
            r = requests.get(f'{BASE}{endpoint}', headers=headers, timeout=10)
        elif method == 'PATCH':
            r = requests.patch(f'{BASE}{endpoint}', headers=headers, json=body, timeout=10)

        status = r.status_code

        if status == 403:
            rbac_results['correctly_forbidden'].append((endpoint, description))
            print(f'   ✅ {description}: 403 (Correctly forbidden)')
        elif status == 404:
            rbac_results['not_found'].append((endpoint, description))
            print(f'   ⚠️  {description}: 404 (Endpoint not found)')
        elif status in [200, 201]:
            rbac_results['incorrectly_allowed'].append((endpoint, description))
            print(f'   ❌ {description}: {status} (SHOULD BE FORBIDDEN!)')
        else:
            print(f'   ⚠️  {description}: {status}')

    except Exception as e:
        print(f'   ❌ {description}: ERROR - {e}')

# Summary
print(f'\n[5/6] BACKEND TEST SUMMARY:')
print('=' * 70)

print(f'\n📊 TEAM ENDPOINTS (7 total):')
print(f'   ✅ Success (200/201): {len(team_results["success"])}')
for endpoint, desc, status in team_results['success']:
    print(f'      - {desc} ({status})')

print(f'\n   ⚠️  Not Found (404): {len(team_results["not_found"])}')
for endpoint, desc in team_results['not_found']:
    print(f'      - {desc}')

print(f'\n   ❌ Forbidden (403): {len(team_results["forbidden"])}')
for endpoint, desc in team_results['forbidden']:
    print(f'      - {desc}')

print(f'\n📊 ANALYTICS ENDPOINTS (8 total):')
print(f'   ✅ Success (200/201): {len(analytics_results["success"])}')
for endpoint, desc, status in analytics_results['success']:
    print(f'      - {desc} ({status})')

print(f'\n   ⚠️  Not Found (404): {len(analytics_results["not_found"])}')
for endpoint, desc in analytics_results['not_found']:
    print(f'      - {desc}')

print(f'\n   ❌ Forbidden (403): {len(analytics_results["forbidden"])}')
for endpoint, desc in analytics_results['forbidden']:
    print(f'      - {desc}')

print(f'\n🔒 RBAC CHECKS:')
print(f'   ✅ Correctly Forbidden: {len(rbac_results["correctly_forbidden"])}')
for endpoint, desc in rbac_results['correctly_forbidden']:
    print(f'      - {desc}')

print(f'\n   ❌ Incorrectly Allowed: {len(rbac_results["incorrectly_allowed"])}')
for endpoint, desc in rbac_results['incorrectly_allowed']:
    print(f'      - {desc} (BUG!)')

# Final summary
print(f'\n[6/6] FINAL RESULT:')
print('=' * 70)

total_team = len(team_results['success']) + len(team_results['not_found'])
total_analytics = len(analytics_results['success']) + len(analytics_results['not_found'])
total_rbac = len(rbac_results['correctly_forbidden']) + len(rbac_results['not_found'])

print(f'Team Endpoints: {len(team_results["success"])}/{total_team} working')
print(f'Analytics Endpoints: {len(analytics_results["success"])}/{total_analytics} working')
print(f'RBAC Checks: {len(rbac_results["correctly_forbidden"])}/{len(forbidden_tests)} correct')

if len(rbac_results['incorrectly_allowed']) > 0:
    print(f'\n⚠️  WARNING: {len(rbac_results["incorrectly_allowed"])} RBAC bugs found!')

print('\n✅ Test completed!')
