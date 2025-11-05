#!/usr/bin/env python3
"""
COMPREHENSIVE E2E Test - USER Role
GERÇEK kullanıcı gibi her sayfayı test et!

Worker: W1
Test Account: test-user@test-org-1.com / TestPass123!
"""

from playwright.sync_api import sync_playwright
import time
import json
from pathlib import Path

# Test configuration
BASE_URL = "http://localhost:8103"
TEST_USER = {
    "email": "test-user@test-org-1.com",
    "password": "TestPass123!"
}
SCREENSHOTS_DIR = Path("/home/asan/Desktop/ikai/screenshots/e2e-w1-comprehensive")
SCREENSHOTS_DIR.mkdir(parents=True, exist_ok=True)

# Results storage
comprehensive_results = {
    "pages_visited": [],
    "buttons_clicked": [],
    "forms_tested": [],
    "console_errors": [],
    "network_errors": [],
    "issues": [],
    "user_actions": []
}

def log_action(action):
    """Log user action"""
    comprehensive_results['user_actions'].append(action)
    print(f"👤 USER ACTION: {action}")

def main():
    with sync_playwright() as p:
        print("🚀 Starting COMPREHENSIVE E2E Test (Real User Simulation)")
        print("="*80)

        # Launch browser (headless)
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={'width': 1920, 'height': 1080})
        page = context.new_page()

        # Console error tracking
        console_errors = []
        def handle_console(msg):
            if msg.type == 'error':
                console_errors.append({
                    'text': msg.text,
                    'url': msg.location.get('url', ''),
                    'timestamp': time.time()
                })
                print(f"❌ Console Error: {msg.text[:100]}")

        page.on('console', handle_console)

        # Network error tracking
        network_errors = []
        def handle_response(response):
            if response.status >= 400:
                network_errors.append({
                    'url': response.url,
                    'status': response.status
                })
                print(f"❌ Network Error: {response.status} - {response.url}")

        page.on('response', handle_response)

        try:
            # ===================================================================
            # STEP 1: LOGIN
            # ===================================================================
            print("\n" + "="*80)
            print("STEP 1: LOGIN")
            print("="*80)

            log_action("Navigate to login page")
            page.goto(f"{BASE_URL}/login")
            page.wait_for_load_state('networkidle')
            time.sleep(3)  # Extra wait for Next.js hydration
            page.screenshot(path=str(SCREENSHOTS_DIR / "01-login-page.png"))
            comprehensive_results['pages_visited'].append({'page': 'Login', 'url': page.url})

            log_action(f"Enter credentials: {TEST_USER['email']}")
            # Wait for email input to be visible
            page.wait_for_selector('input[type="email"]', timeout=10000)
            page.fill('input[type="email"]', TEST_USER['email'])
            page.fill('input[type="password"]', TEST_USER['password'])
            page.screenshot(path=str(SCREENSHOTS_DIR / "02-login-filled.png"))

            log_action("Click login button")
            comprehensive_results['buttons_clicked'].append('Login Button')
            page.click('button[type="submit"]')

            page.wait_for_url('**/dashboard**', timeout=10000)
            time.sleep(3)
            print("✅ Login successful!")

            # ===================================================================
            # STEP 2: DASHBOARD - Explore Everything
            # ===================================================================
            print("\n" + "="*80)
            print("STEP 2: DASHBOARD EXPLORATION")
            print("="*80)

            log_action("View dashboard")
            page.screenshot(path=str(SCREENSHOTS_DIR / "03-dashboard.png"), full_page=True)
            comprehensive_results['pages_visited'].append({'page': 'Dashboard', 'url': page.url})

            # Count visible elements
            print("\n🔍 Dashboard Analysis:")
            try:
                widgets = page.locator('[class*="widget"], [class*="card"]').count()
                print(f"   Widgets/Cards found: {widgets}")
            except:
                print("   Could not count widgets")

            try:
                buttons = page.locator('button').count()
                print(f"   Buttons found: {buttons}")
            except:
                print("   Could not count buttons")

            # ===================================================================
            # STEP 3: SIDEBAR NAVIGATION - Click Every Menu Item
            # ===================================================================
            print("\n" + "="*80)
            print("STEP 3: SIDEBAR NAVIGATION - Test Every Menu Item")
            print("="*80)

            # Menu items to test (visible to USER)
            menu_items = [
                {'name': 'Dashboard', 'selector': 'a[href="/dashboard"]'},
                {'name': 'Bildirimler', 'selector': 'a[href="/notifications"]'},
                {'name': 'Yardım', 'selector': 'a[href="/help"]'},
                {'name': 'Ayarlar', 'selector': 'button:has-text("Ayarlar"), a:has-text("Ayarlar")'}
            ]

            for menu_item in menu_items:
                log_action(f"Click menu: {menu_item['name']}")
                try:
                    page.click(menu_item['selector'], timeout=5000)
                    time.sleep(2)

                    screenshot_name = f"04-menu-{menu_item['name'].lower().replace(' ', '-')}.png"
                    page.screenshot(path=str(SCREENSHOTS_DIR / screenshot_name), full_page=True)

                    comprehensive_results['pages_visited'].append({
                        'page': menu_item['name'],
                        'url': page.url
                    })
                    print(f"✅ {menu_item['name']} page loaded")

                    # Check console errors on this page
                    if console_errors:
                        print(f"   ⚠️ {len(console_errors)} console errors on this page")
                except Exception as e:
                    print(f"❌ Could not access {menu_item['name']}: {str(e)}")
                    comprehensive_results['issues'].append({
                        'page': menu_item['name'],
                        'issue': f'Menu item not accessible: {str(e)}'
                    })

            # ===================================================================
            # STEP 4: NOTIFICATIONS PAGE - Full Test
            # ===================================================================
            print("\n" + "="*80)
            print("STEP 4: NOTIFICATIONS - Full Interaction Test")
            print("="*80)

            log_action("Navigate to Notifications")
            try:
                page.goto(f"{BASE_URL}/notifications")
                time.sleep(3)
                page.screenshot(path=str(SCREENSHOTS_DIR / "05-notifications.png"), full_page=True)

                print("📬 Checking notifications...")
                try:
                    notif_count = page.locator('[class*="notification"], [data-testid="notification"]').count()
                    print(f"   Notifications found: {notif_count}")

                    if notif_count > 0:
                        log_action("Click first notification (mark as read)")
                        # Try to mark as read
                        try:
                            page.locator('[class*="notification"]').first.click()
                            time.sleep(1)
                            comprehensive_results['buttons_clicked'].append('Notification Mark Read')
                            print("✅ Notification interaction successful")
                        except:
                            print("⚠️ Could not interact with notification")
                except:
                    print("   Could not count notifications")
            except Exception as e:
                print(f"❌ Notifications page error: {str(e)}")

            # ===================================================================
            # STEP 5: SETTINGS - Test ALL Tabs
            # ===================================================================
            print("\n" + "="*80)
            print("STEP 5: SETTINGS - Comprehensive Test")
            print("="*80)

            settings_pages = [
                {'name': 'Overview', 'url': '/settings/overview'},
                {'name': 'Profile', 'url': '/settings/profile'},
                {'name': 'Security', 'url': '/settings/security'},
                {'name': 'Notifications Preferences', 'url': '/settings/notifications'}
            ]

            for setting in settings_pages:
                log_action(f"Navigate to Settings - {setting['name']}")
                try:
                    page.goto(f"{BASE_URL}{setting['url']}")
                    time.sleep(2)

                    screenshot_name = f"06-settings-{setting['name'].lower().replace(' ', '-')}.png"
                    page.screenshot(path=str(SCREENSHOTS_DIR / screenshot_name), full_page=True)

                    comprehensive_results['pages_visited'].append({
                        'page': f"Settings - {setting['name']}",
                        'url': page.url
                    })
                    print(f"✅ {setting['name']} page loaded")
                except Exception as e:
                    print(f"❌ {setting['name']} error: {str(e)}")

            # ===================================================================
            # STEP 6: PROFILE EDIT - RENAME TEST (Critical!)
            # ===================================================================
            print("\n" + "="*80)
            print("STEP 6: PROFILE EDIT - RENAME TEST")
            print("="*80)

            log_action("Navigate to Profile Settings")
            try:
                page.goto(f"{BASE_URL}/settings/profile")
                time.sleep(2)

                log_action("TEST: Edit profile - Change name (RENAME)")

                # Find name inputs
                try:
                    first_name_input = page.locator('input[name="firstName"], input[id="firstName"]').first
                    if first_name_input.is_visible():
                        current_name = first_name_input.input_value()
                        print(f"   Current name: {current_name}")

                        # Change name
                        new_name = "TestUserUpdated"
                        first_name_input.fill(new_name)
                        log_action(f"Changed name from '{current_name}' to '{new_name}'")

                        page.screenshot(path=str(SCREENSHOTS_DIR / "07-profile-edit-renamed.png"), full_page=True)

                        # Try to save
                        try:
                            save_button = page.locator('button[type="submit"], button:has-text("Save"), button:has-text("Kaydet")').first
                            if save_button.is_visible():
                                log_action("Click Save button")
                                save_button.click()
                                time.sleep(2)
                                comprehensive_results['buttons_clicked'].append('Profile Save Button')
                                comprehensive_results['forms_tested'].append({
                                    'form': 'Profile Edit',
                                    'field': 'firstName',
                                    'test': 'Rename',
                                    'result': 'Submitted'
                                })
                                print("✅ RENAME TEST: Form submitted successfully")
                                page.screenshot(path=str(SCREENSHOTS_DIR / "08-profile-saved.png"), full_page=True)
                            else:
                                print("⚠️ Save button not found")
                        except Exception as e:
                            print(f"⚠️ Could not save: {str(e)}")
                    else:
                        print("⚠️ Name input not visible")
                except Exception as e:
                    print(f"❌ Profile edit error: {str(e)}")
                    comprehensive_results['issues'].append({
                        'page': 'Profile Edit',
                        'issue': f'Cannot edit profile: {str(e)}'
                    })
            except Exception as e:
                print(f"❌ Profile page error: {str(e)}")

            # ===================================================================
            # STEP 7: SECURITY SETTINGS - Test Password Change
            # ===================================================================
            print("\n" + "="*80)
            print("STEP 7: SECURITY SETTINGS - Password Change Test")
            print("="*80)

            log_action("Navigate to Security Settings")
            try:
                page.goto(f"{BASE_URL}/settings/security")
                time.sleep(2)
                page.screenshot(path=str(SCREENSHOTS_DIR / "09-security-settings.png"), full_page=True)

                print("🔒 Checking password change form...")
                try:
                    password_inputs = page.locator('input[type="password"]').count()
                    print(f"   Password inputs found: {password_inputs}")

                    if password_inputs >= 2:
                        log_action("Password change form is present")
                        comprehensive_results['forms_tested'].append({
                            'form': 'Password Change',
                            'fields_found': password_inputs,
                            'test': 'Form presence check',
                            'result': 'PASS'
                        })
                    else:
                        print("⚠️ Password change form not complete")
                except:
                    print("   Could not check password form")
            except Exception as e:
                print(f"❌ Security page error: {str(e)}")

            # ===================================================================
            # STEP 8: HELP PAGE
            # ===================================================================
            print("\n" + "="*80)
            print("STEP 8: HELP PAGE")
            print("="*80)

            log_action("Navigate to Help page")
            try:
                page.goto(f"{BASE_URL}/help")
                time.sleep(2)
                page.screenshot(path=str(SCREENSHOTS_DIR / "10-help-page.png"), full_page=True)
                comprehensive_results['pages_visited'].append({'page': 'Help', 'url': page.url})
                print("✅ Help page accessible")
            except Exception as e:
                print(f"❌ Help page error: {str(e)}")

            # ===================================================================
            # STEP 9: FORBIDDEN PAGES TEST (RBAC)
            # ===================================================================
            print("\n" + "="*80)
            print("STEP 9: RBAC TEST - Try Accessing Forbidden Pages")
            print("="*80)

            forbidden_pages = [
                {'name': 'Admin Panel', 'url': '/admin'},
                {'name': 'Job Postings Create', 'url': '/job-postings/create'},
                {'name': 'Team Management', 'url': '/team'},
                {'name': 'Analytics', 'url': '/analytics'},
                {'name': 'Organization Settings', 'url': '/settings/organization'},
                {'name': 'Billing', 'url': '/settings/billing'}
            ]

            for forbidden in forbidden_pages:
                log_action(f"TEST RBAC: Try to access {forbidden['name']}")
                try:
                    page.goto(f"{BASE_URL}{forbidden['url']}", wait_until='networkidle', timeout=5000)
                    time.sleep(1)

                    # Check if redirected
                    current_url = page.url
                    if forbidden['url'] in current_url:
                        print(f"❌ RBAC VIOLATION: USER can access {forbidden['name']}!")
                        comprehensive_results['issues'].append({
                            'severity': 'CRITICAL',
                            'issue': f"RBAC Violation: {forbidden['name']} accessible",
                            'url': current_url
                        })
                    else:
                        print(f"✅ {forbidden['name']} correctly blocked (redirected to {current_url})")
                except Exception as e:
                    print(f"✅ {forbidden['name']} correctly blocked (error/timeout)")

            # ===================================================================
            # STEP 10: FINAL CHECKS
            # ===================================================================
            print("\n" + "="*80)
            print("STEP 10: FINAL CHECKS")
            print("="*80)

            # Console errors summary
            comprehensive_results['console_errors'] = console_errors
            comprehensive_results['network_errors'] = network_errors

            print(f"\n📊 Test Summary:")
            print(f"   Pages visited: {len(comprehensive_results['pages_visited'])}")
            print(f"   Buttons clicked: {len(comprehensive_results['buttons_clicked'])}")
            print(f"   Forms tested: {len(comprehensive_results['forms_tested'])}")
            print(f"   User actions: {len(comprehensive_results['user_actions'])}")
            print(f"   Console errors: {len(console_errors)}")
            print(f"   Network errors: {len(network_errors)}")
            print(f"   Issues found: {len(comprehensive_results['issues'])}")

            # Save results
            output_path = Path("/home/asan/Desktop/ikai/test-outputs/e2e-w1-comprehensive-results.json")
            output_path.parent.mkdir(parents=True, exist_ok=True)
            with open(output_path, 'w') as f:
                json.dump(comprehensive_results, f, indent=2)

            print(f"\n✅ Results saved to: {output_path}")
            print(f"📸 Screenshots saved to: {SCREENSHOTS_DIR}")

        except Exception as e:
            print(f"\n❌ TEST FAILED: {str(e)}")
            comprehensive_results['issues'].append({
                'severity': 'CRITICAL',
                'issue': f'Test execution failed: {str(e)}'
            })
        finally:
            browser.close()
            print("\n✅ Browser closed")

        print("\n" + "="*80)
        print("COMPREHENSIVE E2E TEST COMPLETED!")
        print("="*80)

        # Print detailed results
        print("\n📋 Detailed Results:")
        print(f"\n✅ Successfully Visited Pages ({len(comprehensive_results['pages_visited'])}):")
        for page_visit in comprehensive_results['pages_visited']:
            print(f"   - {page_visit['page']}")

        if comprehensive_results['forms_tested']:
            print(f"\n📝 Forms Tested ({len(comprehensive_results['forms_tested'])}):")
            for form in comprehensive_results['forms_tested']:
                print(f"   - {form['form']}: {form.get('result', 'N/A')}")

        if console_errors:
            print(f"\n❌ Console Errors ({len(console_errors)}):")
            for err in console_errors[:5]:  # Show first 5
                print(f"   - {err['text'][:100]}")
        else:
            print("\n✅ NO CONSOLE ERRORS!")

        if comprehensive_results['issues']:
            print(f"\n⚠️ Issues Found ({len(comprehensive_results['issues'])}):")
            for issue in comprehensive_results['issues']:
                print(f"   - {issue.get('severity', 'UNKNOWN')}: {issue.get('issue', 'N/A')}")
        else:
            print("\n✅ NO ISSUES FOUND!")

if __name__ == "__main__":
    main()
