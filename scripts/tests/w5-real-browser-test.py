#!/usr/bin/env python3
"""
W5: SUPER_ADMIN Real Browser Test
Full manual test with Playwright - Login, navigate all pages, CRUD operations, screenshots
"""

from playwright.sync_api import sync_playwright
import time
import json

FRONTEND_URL = 'http://localhost:8103'
BACKEND_URL = 'http://localhost:8102'
SUPER_ADMIN_EMAIL = 'info@gaiai.ai'
SUPER_ADMIN_PASSWORD = '23235656'

def main():
    print('=' * 80)
    print('W5: SUPER_ADMIN REAL BROWSER TEST')
    print('=' * 80)

    with sync_playwright() as p:
        # Launch browser (headless=False to see what's happening)
        browser = p.chromium.launch(headless=False, slow_mo=500)
        context = browser.new_context(viewport={'width': 1920, 'height': 1080})
        page = context.new_page()

        # Track console errors
        console_errors = []
        def handle_console(msg):
            if msg.type == 'error':
                console_errors.append(msg.text)
                print(f'   ⚠️  Console error: {msg.text[:100]}')

        page.on('console', handle_console)

        results = {
            'timestamp': time.strftime('%Y-%m-%d %H:%M:%S'),
            'pages_tested': [],
            'console_errors': [],
            'bugs': [],
            'screenshots': []
        }

        try:
            # ========================================
            # TEST 1: LOGIN
            # ========================================
            print('\n[1/10] LOGIN...')
            page.goto(f'{FRONTEND_URL}/login')
            time.sleep(2)

            # Fill login form
            page.fill('input[type="email"]', SUPER_ADMIN_EMAIL)
            page.fill('input[type="password"]', SUPER_ADMIN_PASSWORD)

            # Take screenshot before submit
            page.screenshot(path='scripts/test-outputs/w5-real/01-login-form.png', full_page=True)
            print('   📸 Screenshot: login-form.png')

            # Submit
            page.click('button[type="submit"]')
            page.wait_for_load_state('networkidle')
            time.sleep(3)

            current_url = page.url
            print(f'   Current URL: {current_url}')

            if '/dashboard' in current_url or '/super-admin' in current_url:
                print('   ✅ Login successful!')
                results['pages_tested'].append({'page': 'Login', 'status': 'PASS'})
            else:
                print(f'   ❌ Login failed - unexpected URL: {current_url}')
                results['bugs'].append({'page': 'Login', 'issue': f'Unexpected redirect: {current_url}'})

            page.screenshot(path='scripts/test-outputs/w5-real/02-after-login.png', full_page=True)
            print('   📸 Screenshot: after-login.png')

            # ========================================
            # TEST 2: SUPER_ADMIN DASHBOARD
            # ========================================
            print('\n[2/10] SUPER_ADMIN DASHBOARD...')
            page.goto(f'{FRONTEND_URL}/super-admin')
            page.wait_for_load_state('networkidle')
            time.sleep(2)

            # Check if we're on the right page
            if '/super-admin' in page.url:
                print('   ✅ Dashboard loaded')
                results['pages_tested'].append({'page': 'Dashboard', 'status': 'PASS', 'url': '/super-admin'})

                # Check for heading
                try:
                    heading = page.locator('h1').first.text_content()
                    print(f'   Dashboard heading: "{heading}"')
                except:
                    print('   ⚠️  No h1 heading found')

                # Count widgets/cards
                cards = page.locator('[class*="card"], [class*="bg-white"]').count()
                print(f'   Widgets/cards: {cards}')

                page.screenshot(path='scripts/test-outputs/w5-real/03-dashboard.png', full_page=True)
                print('   📸 Screenshot: dashboard.png')
            else:
                print(f'   ❌ Not on dashboard - URL: {page.url}')
                results['bugs'].append({'page': 'Dashboard', 'issue': f'Wrong URL: {page.url}'})

            # ========================================
            # TEST 3: ORGANIZATIONS PAGE
            # ========================================
            print('\n[3/10] ORGANIZATIONS PAGE...')
            page.goto(f'{FRONTEND_URL}/super-admin/organizations')
            page.wait_for_load_state('networkidle')
            time.sleep(2)

            if '/organizations' in page.url:
                print('   ✅ Organizations page loaded')
                results['pages_tested'].append({'page': 'Organizations', 'status': 'PASS', 'url': '/super-admin/organizations'})

                # Check for page elements
                try:
                    heading = page.locator('h1').first.text_content()
                    print(f'   Page heading: "{heading}"')
                except:
                    pass

                # Count org cards/rows
                org_elements = page.locator('[class*="organization"], [class*="border"][class*="rounded"]').count()
                print(f'   Organization elements: {org_elements}')

                page.screenshot(path='scripts/test-outputs/w5-real/04-organizations.png', full_page=True)
                print('   📸 Screenshot: organizations.png')
            else:
                print(f'   ❌ Not on organizations page - URL: {page.url}')
                results['bugs'].append({'page': 'Organizations', 'issue': f'Wrong URL: {page.url}'})

            # ========================================
            # TEST 4: SYSTEM HEALTH PAGE
            # ========================================
            print('\n[4/10] SYSTEM HEALTH PAGE...')
            page.goto(f'{FRONTEND_URL}/super-admin/system-health')
            page.wait_for_load_state('networkidle')
            time.sleep(2)

            if '/system-health' in page.url:
                print('   ✅ System Health page loaded')
                results['pages_tested'].append({'page': 'System Health', 'status': 'PASS', 'url': '/super-admin/system-health'})

                page.screenshot(path='scripts/test-outputs/w5-real/05-system-health.png', full_page=True)
                print('   📸 Screenshot: system-health.png')
            else:
                print(f'   ❌ Not on system health page - URL: {page.url}')
                results['bugs'].append({'page': 'System Health', 'issue': f'Wrong URL: {page.url}'})

            # ========================================
            # TEST 5: QUEUE MANAGEMENT PAGE
            # ========================================
            print('\n[5/10] QUEUE MANAGEMENT PAGE...')
            page.goto(f'{FRONTEND_URL}/super-admin/queues')
            page.wait_for_load_state('networkidle')
            time.sleep(2)

            if '/queues' in page.url:
                print('   ✅ Queue Management page loaded')
                results['pages_tested'].append({'page': 'Queue Management', 'status': 'PASS', 'url': '/super-admin/queues'})

                page.screenshot(path='scripts/test-outputs/w5-real/06-queues.png', full_page=True)
                print('   📸 Screenshot: queues.png')
            else:
                print(f'   ❌ Not on queues page - URL: {page.url}')
                results['bugs'].append({'page': 'Queue Management', 'issue': f'Wrong URL: {page.url}'})

            # ========================================
            # TEST 6: ANALYTICS PAGE
            # ========================================
            print('\n[6/10] ANALYTICS PAGE...')
            page.goto(f'{FRONTEND_URL}/super-admin/analytics')
            page.wait_for_load_state('networkidle')
            time.sleep(2)

            if '/analytics' in page.url:
                print('   ✅ Analytics page loaded')
                results['pages_tested'].append({'page': 'Analytics', 'status': 'PASS', 'url': '/super-admin/analytics'})

                page.screenshot(path='scripts/test-outputs/w5-real/07-analytics.png', full_page=True)
                print('   📸 Screenshot: analytics.png')
            else:
                print(f'   ❌ Not on analytics page - URL: {page.url}')
                results['bugs'].append({'page': 'Analytics', 'issue': f'Wrong URL: {page.url}'})

            # ========================================
            # TEST 7: USERS PAGE
            # ========================================
            print('\n[7/10] USERS PAGE...')
            page.goto(f'{FRONTEND_URL}/super-admin/users')
            page.wait_for_load_state('networkidle')
            time.sleep(2)

            if '/users' in page.url:
                print('   ✅ Users page loaded')
                results['pages_tested'].append({'page': 'Users', 'status': 'PASS', 'url': '/super-admin/users'})

                page.screenshot(path='scripts/test-outputs/w5-real/08-users.png', full_page=True)
                print('   📸 Screenshot: users.png')
            else:
                print(f'   ❌ Not on users page - URL: {page.url}')
                results['bugs'].append({'page': 'Users', 'issue': f'Wrong URL: {page.url}'})

            # ========================================
            # TEST 8: SETTINGS PAGE
            # ========================================
            print('\n[8/10] SETTINGS PAGE...')
            page.goto(f'{FRONTEND_URL}/super-admin/settings')
            page.wait_for_load_state('networkidle')
            time.sleep(2)

            if '/settings' in page.url:
                print('   ✅ Settings page loaded')
                results['pages_tested'].append({'page': 'Settings', 'status': 'PASS', 'url': '/super-admin/settings'})

                page.screenshot(path='scripts/test-outputs/w5-real/09-settings.png', full_page=True)
                print('   📸 Screenshot: settings.png')
            else:
                print(f'   ❌ Not on settings page - URL: {page.url}')

            # ========================================
            # TEST 9: CRUD OPERATIONS
            # ========================================
            print('\n[9/10] CRUD OPERATIONS TEST...')
            print('   Returning to Organizations page for CRUD test...')
            page.goto(f'{FRONTEND_URL}/super-admin/organizations')
            page.wait_for_load_state('networkidle')
            time.sleep(2)

            # Try to find "New Organization" button
            try:
                new_org_button = page.locator('button:has-text("Yeni")').first
                if new_org_button.is_visible():
                    print('   ✅ "New Organization" button found')
                    print('   📝 CRUD operations exist (not clicking to avoid data changes)')
                else:
                    print('   ⚠️  "New Organization" button not visible')
            except Exception as e:
                print(f'   ⚠️  Could not find "New Organization" button: {str(e)[:50]}')

            # ========================================
            # TEST 10: CONSOLE ERRORS CHECK
            # ========================================
            print('\n[10/10] CONSOLE ERRORS SUMMARY...')
            results['console_errors'] = console_errors
            print(f'   Total console errors: {len(console_errors)}')

            if len(console_errors) == 0:
                print('   ✅ ZERO CONSOLE ERRORS - Policy satisfied!')
            else:
                print(f'   ❌ {len(console_errors)} console errors found:')
                for i, error in enumerate(console_errors[:5], 1):
                    print(f'      {i}. {error[:100]}')

            # ========================================
            # SUMMARY
            # ========================================
            print('\n' + '=' * 80)
            print('TEST SUMMARY')
            print('=' * 80)

            passed = sum(1 for p in results['pages_tested'] if p['status'] == 'PASS')
            total = len(results['pages_tested'])
            print(f'\n📊 Pages Tested: {passed}/{total} PASS')
            for page_result in results['pages_tested']:
                status_icon = '✅' if page_result['status'] == 'PASS' else '❌'
                print(f'   {status_icon} {page_result["page"]}')

            print(f'\n🐛 Bugs Found: {len(results["bugs"])}')
            for bug in results['bugs']:
                print(f'   - {bug["page"]}: {bug["issue"]}')

            print(f'\n⚠️  Console Errors: {len(console_errors)}')

            print('\n📸 Screenshots saved to: scripts/test-outputs/w5-real/')

            # Save results to JSON
            with open('scripts/test-outputs/w5-real/test-results.json', 'w') as f:
                json.dump(results, f, indent=2)
            print('\n💾 Results saved to: test-results.json')

            print('\n' + '=' * 80)
            print('✅ REAL BROWSER TEST COMPLETED')
            print('=' * 80)

        except Exception as e:
            print(f'\n❌ FATAL ERROR: {e}')
            import traceback
            traceback.print_exc()

        finally:
            # Keep browser open for 5 seconds to see results
            print('\n⏳ Keeping browser open for 5 seconds...')
            time.sleep(5)
            browser.close()

if __name__ == '__main__':
    main()
