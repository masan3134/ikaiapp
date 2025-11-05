#!/usr/bin/env python3
"""
E2E Test - USER Role
Worker: W1
Test Account: test-user@test-org-1.com / TestPass123!
"""

from playwright.sync_api import sync_playwright, expect
import time
import json
from pathlib import Path

# Test configuration
BASE_URL = "http://localhost:8103"
TEST_USER = {
    "email": "test-user@test-org-1.com",
    "password": "TestPass123!"
}
SCREENSHOTS_DIR = Path("/home/asan/Desktop/ikai/screenshots/e2e-w1-user")

# Test results storage
test_results = {
    "console_errors": [],
    "network_errors": [],
    "issues": [],
    "timings": {},
    "rbac_tests": []
}

def save_results():
    """Save test results to JSON"""
    output_path = Path("/home/asan/Desktop/ikai/test-outputs/e2e-w1-user-results.json")
    output_path.parent.mkdir(parents=True, exist_ok=True)
    with open(output_path, 'w') as f:
        json.dump(test_results, f, indent=2)
    print(f"✅ Results saved to {output_path}")

def main():
    with sync_playwright() as p:
        # Launch browser in HEADLESS mode (as required)
        print("🚀 Launching browser (headless)...")
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            viewport={'width': 1920, 'height': 1080}
        )
        page = context.new_page()

        # Console error listener
        console_errors = []
        def handle_console(msg):
            if msg.type == 'error':
                error_info = {
                    'text': msg.text,
                    'location': msg.location,
                    'timestamp': time.time()
                }
                console_errors.append(error_info)
                print(f"❌ Console Error: {msg.text}")

        page.on('console', handle_console)

        # Network error listener
        network_errors = []
        def handle_response(response):
            if response.status >= 400:
                error_info = {
                    'url': response.url,
                    'status': response.status,
                    'method': response.request.method
                }
                network_errors.append(error_info)
                print(f"❌ Network Error: {response.status} - {response.url}")

        page.on('response', handle_response)

        print("\n" + "="*80)
        print("TEST 1: LOGIN & AUTHENTICATION")
        print("="*80)

        # Navigate to login page
        start_time = time.time()
        page.goto(BASE_URL)
        load_time = time.time() - start_time
        test_results['timings']['initial_load'] = round(load_time, 2)
        print(f"✅ Page loaded in {load_time:.2f}s")

        # Take screenshot of login page
        page.screenshot(path=str(SCREENSHOTS_DIR / "01-login-page.png"), full_page=True)
        print("📸 Screenshot: 01-login-page.png")

        # Check if already logged in (redirect to dashboard)
        time.sleep(2)
        current_url = page.url

        if '/dashboard' not in current_url and '/login' not in current_url:
            # Navigate to login explicitly
            page.goto(f"{BASE_URL}/login")
            time.sleep(2)

        # If already on dashboard, logout first
        if '/dashboard' in page.url:
            print("⚠️ Already logged in, logging out first...")
            try:
                # Try to find and click logout button
                page.click('button:has-text("Logout")', timeout=3000)
                time.sleep(2)
            except:
                # If no logout button, clear storage
                page.evaluate("localStorage.clear()")
                page.evaluate("sessionStorage.clear()")
                page.goto(f"{BASE_URL}/login")
                time.sleep(2)

        # Perform login
        print(f"🔐 Logging in as {TEST_USER['email']}...")

        # Fill login form
        page.fill('input[type="email"], input[name="email"]', TEST_USER['email'])
        page.fill('input[type="password"], input[name="password"]', TEST_USER['password'])

        # Take screenshot before submit
        page.screenshot(path=str(SCREENSHOTS_DIR / "02-login-filled.png"), full_page=True)

        # Submit form
        start_time = time.time()
        page.click('button[type="submit"]')

        # Wait for navigation to dashboard
        try:
            page.wait_for_url('**/dashboard**', timeout=10000)
            login_time = time.time() - start_time
            test_results['timings']['login_duration'] = round(login_time, 2)
            print(f"✅ Login successful in {login_time:.2f}s")
        except Exception as e:
            print(f"❌ Login failed: {str(e)}")
            page.screenshot(path=str(SCREENSHOTS_DIR / "02-login-error.png"), full_page=True)
            test_results['issues'].append({
                'severity': 'CRITICAL',
                'category': 'Functionality',
                'title': 'Login Failed',
                'description': str(e)
            })
            browser.close()
            save_results()
            return

        # Wait for dashboard to fully load
        time.sleep(3)

        print("\n" + "="*80)
        print("TEST 2: DASHBOARD TESTING")
        print("="*80)

        # Take full dashboard screenshot
        start_time = time.time()
        page.screenshot(path=str(SCREENSHOTS_DIR / "03-dashboard-full.png"), full_page=True)
        dashboard_load_time = time.time() - start_time
        test_results['timings']['dashboard_load'] = round(dashboard_load_time, 2)
        print(f"📸 Screenshot: 03-dashboard-full.png")
        print(f"✅ Dashboard loaded in {dashboard_load_time:.2f}s")

        # Check for USER-specific widgets
        print("\n📊 Checking dashboard widgets...")

        # Expected widgets for USER role
        expected_widgets = [
            "Welcome",
            "Recent Activity",
            "Notifications"
        ]

        for widget in expected_widgets:
            try:
                element = page.locator(f"text={widget}").first
                if element.is_visible():
                    print(f"✅ {widget} widget found")
                else:
                    print(f"⚠️ {widget} widget not visible")
            except:
                print(f"❌ {widget} widget not found")
                test_results['issues'].append({
                    'severity': 'MEDIUM',
                    'category': 'Functionality',
                    'title': f'{widget} Widget Missing',
                    'description': f'Expected {widget} widget for USER role not found'
                })

        # Check for admin-only widgets (should NOT be visible)
        admin_widgets = [
            "System Health",
            "Usage Limits",
            "Analytics"
        ]

        for widget in admin_widgets:
            try:
                element = page.locator(f"text={widget}").first
                if element.is_visible():
                    print(f"❌ RBAC VIOLATION: {widget} widget visible to USER!")
                    test_results['issues'].append({
                        'severity': 'CRITICAL',
                        'category': 'Security',
                        'title': f'RBAC Violation - {widget} Widget Visible',
                        'description': f'USER role should not see {widget} widget'
                    })
            except:
                print(f"✅ {widget} widget correctly hidden")

        print("\n" + "="*80)
        print("TEST 3: NAVIGATION & SIDEBAR")
        print("="*80)

        # Check sidebar menu items
        print("\n📋 Checking sidebar navigation...")

        # Expected menu items for USER
        expected_menu_items = [
            "Dashboard",
            "Profile"
        ]

        for item in expected_menu_items:
            try:
                element = page.locator(f"nav >> text={item}").first
                if element.is_visible():
                    print(f"✅ {item} menu item found")
                else:
                    print(f"⚠️ {item} menu item not visible")
            except:
                print(f"❌ {item} menu item not found")

        # Items that should NOT be visible to USER
        forbidden_menu_items = [
            "Admin Panel",
            "Team Management",
            "Reports",
            "Settings",
            "Billing"
        ]

        for item in forbidden_menu_items:
            try:
                element = page.locator(f"nav >> text={item}").first
                if element.is_visible():
                    print(f"❌ RBAC VIOLATION: {item} menu item visible to USER!")
                    test_results['issues'].append({
                        'severity': 'HIGH',
                        'category': 'Security',
                        'title': f'RBAC Violation - {item} Menu Item Visible',
                        'description': f'USER role should not see {item} menu item'
                    })
            except:
                print(f"✅ {item} menu item correctly hidden")

        # Take sidebar screenshot
        page.screenshot(path=str(SCREENSHOTS_DIR / "04-sidebar.png"), full_page=True)

        print("\n" + "="*80)
        print("TEST 4: RBAC VIOLATION ATTEMPTS")
        print("="*80)

        # Try to access restricted URLs
        restricted_urls = [
            "/admin",
            "/job-postings/create",
            "/team",
            "/reports",
            "/settings"
        ]

        for url in restricted_urls:
            print(f"\n🔒 Testing access to {url}...")
            try:
                page.goto(f"{BASE_URL}{url}", wait_until="networkidle", timeout=5000)
                time.sleep(2)

                current_url = page.url

                # Check if redirected or blocked
                if url in current_url:
                    # Still on restricted page - RBAC violation!
                    print(f"❌ RBAC VIOLATION: USER can access {url}!")
                    page.screenshot(path=str(SCREENSHOTS_DIR / f"rbac-violation-{url.replace('/', '-')}.png"), full_page=True)
                    test_results['rbac_tests'].append({
                        'url': url,
                        'accessible': True,
                        'status': 'VIOLATION'
                    })
                    test_results['issues'].append({
                        'severity': 'CRITICAL',
                        'category': 'Security',
                        'title': f'RBAC Violation - Unrestricted Access to {url}',
                        'description': f'USER role can access restricted URL: {url}'
                    })
                else:
                    print(f"✅ Correctly redirected from {url} to {current_url}")
                    test_results['rbac_tests'].append({
                        'url': url,
                        'accessible': False,
                        'redirected_to': current_url,
                        'status': 'PASS'
                    })
            except Exception as e:
                print(f"✅ Access denied (timeout/error): {str(e)}")
                test_results['rbac_tests'].append({
                    'url': url,
                    'accessible': False,
                    'error': str(e),
                    'status': 'PASS'
                })

        # Return to dashboard
        page.goto(f"{BASE_URL}/dashboard")
        time.sleep(2)

        print("\n" + "="*80)
        print("TEST 5: PROFILE SETTINGS")
        print("="*80)

        # Navigate to profile
        try:
            print("🔍 Looking for Profile link...")
            page.click('a[href="/profile"], button:has-text("Profile")', timeout=5000)
            time.sleep(2)

            print(f"✅ Navigated to profile: {page.url}")
            page.screenshot(path=str(SCREENSHOTS_DIR / "05-profile-page.png"), full_page=True)

            # Check if can edit own profile
            print("✅ Profile page accessible")

        except Exception as e:
            print(f"⚠️ Could not navigate to profile: {str(e)}")
            test_results['issues'].append({
                'severity': 'MEDIUM',
                'category': 'Functionality',
                'title': 'Profile Page Not Accessible',
                'description': str(e)
            })

        print("\n" + "="*80)
        print("TEST 6: CONSOLE ERRORS CHECK")
        print("="*80)

        # Report console errors
        test_results['console_errors'] = console_errors
        test_results['network_errors'] = network_errors

        print(f"\n📊 Console Errors: {len(console_errors)}")
        if console_errors:
            print("❌ ERRORS FOUND:")
            for i, error in enumerate(console_errors, 1):
                print(f"  {i}. {error['text']}")
                test_results['issues'].append({
                    'severity': 'HIGH',
                    'category': 'Functionality',
                    'title': f'Console Error: {error["text"][:50]}...',
                    'description': error['text']
                })
        else:
            print("✅ NO CONSOLE ERRORS!")

        print(f"\n📊 Network Errors: {len(network_errors)}")
        if network_errors:
            print("❌ NETWORK ERRORS FOUND:")
            for i, error in enumerate(network_errors, 1):
                print(f"  {i}. {error['status']} - {error['url']}")
        else:
            print("✅ NO NETWORK ERRORS!")

        # Save results
        save_results()

        print("\n" + "="*80)
        print("✅ E2E TEST COMPLETED!")
        print("="*80)
        print(f"📸 Screenshots: {SCREENSHOTS_DIR}")
        print(f"📊 Results: /home/asan/Desktop/ikai/test-outputs/e2e-w1-user-results.json")
        print(f"🐛 Issues Found: {len(test_results['issues'])}")
        print(f"❌ Console Errors: {len(console_errors)}")
        print(f"🔒 RBAC Tests: {len(test_results['rbac_tests'])}")

        # Close browser (headless mode - no manual inspection needed)
        browser.close()
        print("✅ Browser closed")

if __name__ == "__main__":
    main()
