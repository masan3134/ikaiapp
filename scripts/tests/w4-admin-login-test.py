#!/usr/bin/env python3
"""
W4 E2E Test - ADMIN Login and Dashboard
Tests ADMIN role login and initial dashboard verification
"""

from playwright.sync_api import sync_playwright
import json
import time
from datetime import datetime

def test_admin_login():
    """Test ADMIN login and dashboard access"""

    results = {
        "test_name": "ADMIN Login & Dashboard",
        "timestamp": datetime.now().isoformat(),
        "login_success": False,
        "dashboard_loaded": False,
        "console_errors": [],
        "screenshots": [],
        "dashboard_widgets": [],
        "errors": []
    }

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False)
        context = browser.new_context(viewport={"width": 1920, "height": 1080})
        page = context.new_page()

        # Capture console messages
        def handle_console(msg):
            if msg.type in ['error', 'warning']:
                results["console_errors"].append({
                    "type": msg.type,
                    "text": msg.text,
                    "location": str(msg.location) if msg.location else None
                })

        page.on("console", handle_console)

        try:
            print("="*80)
            print("🧪 W4 E2E TEST - ADMIN LOGIN & DASHBOARD")
            print("="*80)
            print(f"Account: test-admin@test-org-2.com")
            print(f"Organization: Test Org 2 (PRO plan)")
            print(f"Role: ADMIN")
            print()

            # Step 1: Navigate to login
            print("🔍 Step 1: Navigating to login page...")
            page.goto("http://localhost:8103/login", wait_until="networkidle", timeout=30000)
            time.sleep(2)

            page.screenshot(path="/home/asan/Desktop/ikai/test-outputs/w4-01-login-page.png", full_page=True)
            results["screenshots"].append("w4-01-login-page.png")
            print("   ✅ Login page loaded")
            print("   📸 Screenshot: w4-01-login-page.png")

            # Step 2: Fill login form
            print("\n🔑 Step 2: Filling login credentials...")
            page.fill('input[type="email"]', 'test-admin@test-org-2.com')
            page.fill('input[type="password"]', 'TestPass123!')
            print("   ✅ Credentials filled")

            # Step 3: Submit login
            print("\n🚀 Step 3: Submitting login form...")
            page.click('button[type="submit"]')

            # Wait for dashboard
            page.wait_for_url("**/dashboard**", timeout=15000)
            time.sleep(3)  # Wait for widgets to load

            results["login_success"] = True
            print("   ✅ Login successful!")
            print("   ✅ Redirected to dashboard")

            # Step 4: Capture dashboard
            print("\n📸 Step 4: Capturing dashboard...")
            page.screenshot(path="/home/asan/Desktop/ikai/test-outputs/w4-02-admin-dashboard.png", full_page=True)
            results["screenshots"].append("w4-02-admin-dashboard.png")
            print("   ✅ Screenshot: w4-02-admin-dashboard.png")

            # Step 5: Check dashboard elements
            print("\n🔍 Step 5: Verifying dashboard elements...")

            # Check page title
            title_elements = page.locator('h1, h2, [role="heading"]').all()
            if title_elements:
                results["dashboard_loaded"] = True
                print(f"   ✅ Dashboard title found: {title_elements[0].inner_text() if title_elements else 'N/A'}")

            # Check for widgets (cards, panels)
            widget_selectors = [
                'div[class*="card"]',
                'div[class*="widget"]',
                'div[class*="panel"]',
                'section'
            ]

            for selector in widget_selectors:
                widgets = page.locator(selector).all()
                if len(widgets) > 0:
                    results["dashboard_widgets"].append({
                        "selector": selector,
                        "count": len(widgets)
                    })
                    print(f"   ✅ Found {len(widgets)} widgets/cards ({selector})")
                    break

            # Wait for any delayed console errors
            time.sleep(3)

            print("\n" + "="*80)
            print("📊 TEST RESULTS SUMMARY")
            print("="*80)
            print(f"✅ Login Success: {results['login_success']}")
            print(f"✅ Dashboard Loaded: {results['dashboard_loaded']}")
            print(f"📸 Screenshots Captured: {len(results['screenshots'])}")
            print(f"⚠️  Console Errors: {len(results['console_errors'])}")

            if results["console_errors"]:
                print("\n" + "="*80)
                print("⚠️  CONSOLE ERRORS DETECTED")
                print("="*80)
                for i, error in enumerate(results["console_errors"], 1):
                    print(f"\n{i}. [{error['type'].upper()}]")
                    print(f"   Message: {error['text']}")
                    if error.get('location'):
                        print(f"   Location: {error['location']}")
            else:
                print("\n✅ ZERO CONSOLE ERRORS - PERFECT!")

            print("\n" + "="*80)

        except Exception as e:
            print(f"\n❌ ERROR: {str(e)}")
            results["errors"].append(str(e))
            page.screenshot(path="/home/asan/Desktop/ikai/test-outputs/w4-error-login.png", full_page=True)
            results["screenshots"].append("w4-error-login.png")

        finally:
            browser.close()

    # Save results to JSON
    with open("/home/asan/Desktop/ikai/test-outputs/w4-login-results.json", "w") as f:
        json.dump(results, f, indent=2)

    return results

if __name__ == "__main__":
    results = test_admin_login()

    # Exit with error code if test failed
    if not results["login_success"] or len(results["console_errors"]) > 0:
        exit(1)

    exit(0)
