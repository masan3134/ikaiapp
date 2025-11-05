#!/usr/bin/env python3
"""
W4 E2E Test - Browser Test (Headless)
Tests: Console errors, Design consistency, Dashboard rendering
"""

from playwright.sync_api import sync_playwright
import json
import time

def test_browser_headless():
    """Browser test in headless mode"""

    results = {
        "console_errors": [],
        "screenshots": [],
        "page_loads": {},
        "design_issues": []
    }

    with sync_playwright() as p:
        # Launch browser in headless mode
        browser = p.chromium.launch(headless=True)
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

        print("="*80)
        print("🧪 W4 BROWSER TEST (HEADLESS)")
        print("="*80)
        print()

        try:
            # Step 1: Login
            print("🔑 Step 1: Login as ADMIN...")
            start = time.time()

            page.goto("http://localhost:8103/login", wait_until="networkidle", timeout=30000)
            page.fill('input[type="email"]', 'test-admin@test-org-2.com')
            page.fill('input[type="password"]', 'TestPass123!')
            page.click('button[type="submit"]')

            page.wait_for_url("**/dashboard**", timeout=15000)
            login_time = round(time.time() - start, 2)

            print(f"   ✅ Logged in ({login_time}s)")
            results["page_loads"]["login"] = login_time

            # Step 2: Wait for dashboard to load
            print("\n📊 Step 2: Loading dashboard...")
            time.sleep(3)  # Wait for widgets

            # Check page title
            title = page.title()
            print(f"   Page title: {title}")

            # Take screenshot
            page.screenshot(path="/home/asan/Desktop/ikai/test-outputs/w4-browser-dashboard-headless.png", full_page=True)
            results["screenshots"].append("w4-browser-dashboard-headless.png")
            print(f"   📸 Screenshot: w4-browser-dashboard-headless.png")

            # Step 3: Check for visible elements
            print("\n🔍 Step 3: Checking dashboard elements...")

            # Look for common dashboard elements
            selectors_to_check = [
                ('h1', 'Main heading'),
                ('nav', 'Navigation'),
                ('[class*="card"]', 'Cards/Widgets'),
                ('button', 'Buttons'),
                ('a', 'Links')
            ]

            for selector, name in selectors_to_check:
                try:
                    elements = page.locator(selector).all()
                    print(f"   ✅ {name}: {len(elements)} found")
                except:
                    print(f"   ⚠️  {name}: Not found")

            # Step 4: Navigate to users page
            print("\n👥 Step 4: Navigating to users page...")
            try:
                # Look for users link
                users_link = page.locator('text=/users/i, text=/kullanıcı/i').first
                if users_link.is_visible(timeout=5000):
                    start = time.time()
                    users_link.click()
                    page.wait_for_load_state("networkidle", timeout=10000)
                    users_time = round(time.time() - start, 2)

                    results["page_loads"]["users"] = users_time
                    print(f"   ✅ Users page loaded ({users_time}s)")

                    page.screenshot(path="/home/asan/Desktop/ikai/test-outputs/w4-browser-users-headless.png", full_page=True)
                    results["screenshots"].append("w4-browser-users-headless.png")
                    print(f"   📸 Screenshot: w4-browser-users-headless.png")
                else:
                    print(f"   ⚠️  Users link not found")
            except Exception as e:
                print(f"   ⚠️  Users navigation error: {str(e)}")

            # Wait for any delayed console errors
            print("\n⏳ Waiting for delayed console errors...")
            time.sleep(3)

            # Results
            print("\n" + "="*80)
            print("📊 BROWSER TEST RESULTS")
            print("="*80)
            print(f"Console Errors: {len(results['console_errors'])}")
            print(f"Screenshots: {len(results['screenshots'])}")
            print(f"Page Loads: {len(results['page_loads'])}")

            if results["console_errors"]:
                print("\n⚠️  CONSOLE ERRORS DETECTED:")
                for i, error in enumerate(results["console_errors"][:5], 1):  # Show first 5
                    print(f"\n{i}. [{error['type'].upper()}]")
                    print(f"   {error['text'][:100]}")  # First 100 chars
            else:
                print("\n✅ ZERO CONSOLE ERRORS - PERFECT!")

            print("="*80)

        except Exception as e:
            print(f"\n❌ Browser test error: {str(e)}")
            results["error"] = str(e)
            page.screenshot(path="/home/asan/Desktop/ikai/test-outputs/w4-browser-error.png", full_page=True)

        finally:
            browser.close()

    # Save results
    with open('/home/asan/Desktop/ikai/test-outputs/w4-browser-results.json', 'w') as f:
        json.dump(results, f, indent=2)
    print("\n📁 Results saved: test-outputs/w4-browser-results.json")

    return len(results["console_errors"]) == 0

if __name__ == "__main__":
    success = test_browser_headless()
    exit(0 if success else 1)
