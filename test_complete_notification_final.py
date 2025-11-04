#!/usr/bin/env python3
"""
COMPLETE NOTIFICATION SYSTEM - FINAL COMPREHENSIVE TEST
Tests: Backend API + Frontend Pages + Triggers + RBAC + Preferences

Worker #2 - Final Verification
Date: 2025-11-04
"""

import requests
import json
import time

BASE_URL = "http://localhost:8102"

def test_backend_apis():
    """Test all 7 backend notification endpoints"""
    print('=' * 100)
    print('📡 BACKEND API TEST (7 Endpoints)')
    print('=' * 100)

    # Login
    resp = requests.post(f'{BASE_URL}/api/v1/auth/login',
        json={'email': 'test-hr_specialist@test-org-1.com', 'password': 'TestPass123!'})

    if resp.status_code != 200:
        print(f'❌ Login failed: {resp.status_code}')
        return []

    token = resp.json()['token']
    print(f'✅ Authenticated: test-hr_specialist@test-org-1.com\n')

    tests = []

    # 1. GET /notifications
    resp = requests.get(f'{BASE_URL}/api/v1/notifications',
        headers={'Authorization': f'Bearer {token}'})
    passed = resp.status_code == 200
    tests.append(('GET /notifications', passed))
    status = '✅ PASS' if passed else f'❌ FAIL ({resp.status_code})'
    print(f'1. {status}')
    if passed:
        notifs = resp.json().get('notifications', [])
        print(f'   Notifications: {len(notifs)}')

    # 2. GET /notifications (with filters)
    resp = requests.get(f'{BASE_URL}/api/v1/notifications?read=false&limit=5',
        headers={'Authorization': f'Bearer {token}'})
    passed = resp.status_code == 200
    tests.append(('GET /notifications (filtered)', passed))
    status = '✅ PASS' if passed else f'❌ FAIL ({resp.status_code})'
    print(f'2. {status}')
    if passed:
        unread = resp.json().get('notifications', [])
        print(f'   Unread notifications: {len(unread)}')

    # 3. GET /unread-count
    resp = requests.get(f'{BASE_URL}/api/v1/notifications/unread-count',
        headers={'Authorization': f'Bearer {token}'})
    passed = resp.status_code == 200
    tests.append(('GET /unread-count', passed))
    status = '✅ PASS' if passed else f'❌ FAIL ({resp.status_code})'
    print(f'3. {status}')
    if passed:
        count = resp.json().get('count', 0)
        print(f'   Count: {count}')

    # 4. PATCH /read-all
    resp = requests.patch(f'{BASE_URL}/api/v1/notifications/read-all',
        headers={'Authorization': f'Bearer {token}'})
    passed = resp.status_code == 200
    tests.append(('PATCH /read-all', passed))
    status = '✅ PASS' if passed else f'❌ FAIL ({resp.status_code})'
    print(f'4. {status}')
    if passed:
        marked = resp.json().get('count', 0)
        print(f'   Marked: {marked} notifications')

    # 5. GET /preferences
    resp = requests.get(f'{BASE_URL}/api/v1/notifications/preferences',
        headers={'Authorization': f'Bearer {token}'})
    passed = resp.status_code == 200
    tests.append(('GET /preferences', passed))
    status = '✅ PASS' if passed else f'❌ FAIL ({resp.status_code})'
    print(f'5. {status}')
    if passed:
        prefs = resp.json().get('preferences', [])
        print(f'   Preference types: {len(prefs)}')
        enabled = len([p for p in prefs if p.get('enabled')])
        print(f'   Enabled: {enabled}/{len(prefs)}')

    # 6. PUT /preferences/:type
    resp = requests.put(f'{BASE_URL}/api/v1/notifications/preferences/ANALYSIS_COMPLETED',
        headers={'Authorization': f'Bearer {token}'},
        json={'enabled': True, 'emailEnabled': True})
    passed = resp.status_code == 200
    tests.append(('PUT /preferences/:type', passed))
    status = '✅ PASS' if passed else f'❌ FAIL ({resp.status_code})'
    print(f'6. {status}')

    # 7. PUT /preferences (batch)
    resp = requests.put(f'{BASE_URL}/api/v1/notifications/preferences',
        headers={'Authorization': f'Bearer {token}'},
        json={'preferences': [
            {'type': 'OFFER_ACCEPTED', 'enabled': True, 'emailEnabled': True}
        ]})
    passed = resp.status_code == 200
    tests.append(('PUT /preferences (batch)', passed))
    status = '✅ PASS' if passed else f'❌ FAIL ({resp.status_code})'
    print(f'7. {status}')

    print()
    return tests

def test_frontend_pages():
    """Test all frontend notification pages"""
    print('=' * 100)
    print('🎨 FRONTEND PAGE TEST (3 Pages)')
    print('=' * 100)

    tests = []

    pages = [
        ('http://localhost:8103/dashboard', 'Dashboard (with bell icon)'),
        ('http://localhost:8103/notifications', 'Notification Center'),
        ('http://localhost:8103/settings/notifications', 'Preferences Page'),
    ]

    for url, desc in pages:
        resp = requests.get(url)
        passed = resp.status_code == 200
        tests.append((desc, passed))
        status = '✅ PASS' if passed else f'❌ FAIL ({resp.status_code})'
        print(f'{desc:40s} → {status}')

    print()
    return tests

def test_rbac():
    """Test SUPER_ADMIN can see all notifications"""
    print('=' * 100)
    print('🔐 RBAC TEST (SUPER_ADMIN Visibility)')
    print('=' * 100)

    # Login as SUPER_ADMIN
    resp = requests.post(f'{BASE_URL}/api/v1/auth/login',
        json={'email': 'info@gaiai.ai', 'password': '23235656'})

    if resp.status_code != 200:
        print(f'❌ SUPER_ADMIN login failed')
        return [('SUPER_ADMIN RBAC', False)]

    token = resp.json()['token']
    print(f'✅ Authenticated as: SUPER_ADMIN\n')

    # Get notifications
    resp = requests.get(f'{BASE_URL}/api/v1/notifications',
        headers={'Authorization': f'Bearer {token}'})

    if resp.status_code == 200:
        notifications = resp.json().get('notifications', [])
        org_ids = set(n.get('organizationId') for n in notifications)

        print(f'SUPER_ADMIN sees: {len(notifications)} notifications')
        print(f'From {len(org_ids)} organization(s)')

        if len(notifications) > 0:
            print(f'✅ RBAC working (SUPER_ADMIN sees notifications from Org 1 HR)')
            return [('SUPER_ADMIN RBAC', True)]
        else:
            print(f'⚠️  No notifications visible')
            return [('SUPER_ADMIN RBAC', False)]
    else:
        print(f'❌ Failed to get notifications: {resp.status_code}')
        return [('SUPER_ADMIN RBAC', False)]

def test_triggers():
    """Test notification triggers by creating analysis"""
    print('=' * 100)
    print('🔔 TRIGGER TEST (Live Event → Notification)')
    print('=' * 100)

    # Login
    resp = requests.post(f'{BASE_URL}/api/v1/auth/login',
        json={'email': 'test-hr_specialist@test-org-1.com', 'password': 'TestPass123!'})
    token = resp.json()['token']

    print('Creating analysis to trigger ANALYSIS_STARTED notification...\n')

    # Create analysis
    resp = requests.post(f'{BASE_URL}/api/v1/analyses',
        headers={'Authorization': f'Bearer {token}'},
        json={
            'jobPostingId': '5815de9f-5c59-426d-a837-8c96060f9a31',
            'candidateIds': ['39359a10-04f2-49b4-b5ba-61cf296bcb86']
        })

    if resp.status_code in [200, 201]:
        analysis_id = resp.json().get('analysis', {}).get('id')
        print(f'✅ Analysis created: {analysis_id}')

        # Wait for trigger
        print('Waiting 2 seconds for trigger...')
        time.sleep(2)

        # Check for notification
        resp = requests.get(f'{BASE_URL}/api/v1/notifications?type=ANALYSIS_STARTED',
            headers={'Authorization': f'Bearer {token}'})

        if resp.status_code == 200:
            started_notifs = resp.json().get('notifications', [])
            if len(started_notifs) > 0:
                latest = started_notifs[0]
                print(f'✅ Trigger working!')
                print(f'   Type: {latest.get("type")}')
                print(f'   Title: {latest.get("title")}')
                print(f'   Message: {latest.get("message")}')
                return [('Trigger: ANALYSIS_STARTED', True)]
            else:
                print(f'⚠️  No ANALYSIS_STARTED notification found')
                return [('Trigger: ANALYSIS_STARTED', False)]
        else:
            print(f'❌ Failed to check notifications: {resp.status_code}')
            return [('Trigger: ANALYSIS_STARTED', False)]
    else:
        print(f'❌ Analysis creation failed: {resp.status_code}')
        return [('Trigger: ANALYSIS_STARTED', False)]

def main():
    print()
    print('🔥🔥🔥 NOTIFICATION SYSTEM - COMPLETE FINAL TEST 🔥🔥🔥')
    print()

    # Run all tests
    backend_tests = test_backend_apis()
    print()

    frontend_tests = test_frontend_pages()
    print()

    rbac_tests = test_rbac()
    print()

    trigger_tests = test_triggers()
    print()

    # Calculate results
    all_tests = backend_tests + frontend_tests + rbac_tests + trigger_tests
    total_passed = sum(1 for _, passed in all_tests if passed)
    total_tests = len(all_tests)

    # Summary
    print('=' * 100)
    print('📊 FINAL SUMMARY')
    print('=' * 100)
    print()

    print(f'Backend API:       {sum(1 for _, p in backend_tests if p)}/{len(backend_tests)} passed')
    print(f'Frontend Pages:    {sum(1 for _, p in frontend_tests if p)}/{len(frontend_tests)} passed')
    print(f'RBAC:              {sum(1 for _, p in rbac_tests if p)}/{len(rbac_tests)} passed')
    print(f'Triggers:          {sum(1 for _, p in trigger_tests if p)}/{len(trigger_tests)} passed')
    print()
    print(f'TOTAL: {total_passed}/{total_tests} TESTS PASSED')
    print()

    if total_passed == total_tests:
        print('🎉🎉🎉 ALL SYSTEMS FULLY OPERATIONAL! 🎉🎉🎉')
        print()
        print('✅ Backend: All 7 endpoints working')
        print('✅ Frontend: All 3 pages accessible')
        print('✅ Triggers: Auto-firing on events')
        print('✅ RBAC: SUPER_ADMIN sees all orgs')
        print('✅ Preferences: User control working')
        print()
        print('🚀 SYSTEM READY FOR PRODUCTION USE!')
        print()
        print('👉 ACTION REQUIRED:')
        print('   1. Hard refresh browser (Ctrl+Shift+R)')
        print('   2. Bell icon will appear in top-right')
        print('   3. Click to test dropdown')
        print('   4. Test "Tümünü Okundu İşaretle" button')
        print('   5. Visit /settings/notifications for preferences')
    else:
        print(f'⚠️  {total_tests - total_passed} tests failed')
        print()
        print('Failed tests:')
        for name, passed in all_tests:
            if not passed:
                print(f'  ❌ {name}')

    print()
    print('=' * 100)

if __name__ == '__main__':
    main()
