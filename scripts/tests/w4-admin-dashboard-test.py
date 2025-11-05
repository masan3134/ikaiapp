#!/usr/bin/env python3
"""
W4 E2E Test - ADMIN Dashboard Deep Inspection
Tests ADMIN dashboard widgets, org-wide metrics, and console errors
"""

from playwright.sync_api import sync_playwright
import json
import time
from datetime import datetime

def test_admin_dashboard():
    """Test ADMIN dashboard in detail"""

    results = {
        "test_name": "ADMIN Dashboard Deep Inspection",
        "timestamp": datetime.now().isoformat(),
        "dashboard_loaded": False,
        "widgets_found": [],
        "metrics_found": [],
        "console_errors": [],
        "screenshots": [],
        "page_load_time": 0,
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
            print("🧪 W4 E2E TEST - ADMIN DASHBOARD DEEP INSPECTION")
            print("="*80)
            print(f"Account: test-admin@test-org-2.com (ADMIN)")
            print(f"Organization: Test Org 2 (PRO plan)")
            print()

            # Step 1: Login
            print("🔑 Step 1: Logging in as ADMIN...")
            start_time = time.time()

            page.goto("http://localhost:8103/login", wait_until="networkidle", timeout=30000)
            page.fill('input[type="email"]', 'test-admin@test-org-2.com')
            page.fill('input[type="password"]', 'TestPass123!')
            page.click('button[type="submit"]')
            page.wait_for_url("**/dashboard**", timeout=15000)
            time.sleep(3)

            results["page_load_time"] = round(time.time() - start_time, 2)
            print(f"   ✅ Logged in and dashboard loaded in {results['page_load_time']}s")

            # Step 2: Inspect page structure
            print("\n📋 Step 2: Inspecting dashboard structure...")

            # Get page title
            title = page.title()
            print(f"   Page title: {title}")

            # Check for main heading
            headings = page.locator('h1, h2, [role="heading"]').all()
            if headings:
                print(f"   Main heading: {headings[0].inner_text()}")

            results["dashboard_loaded"] = True

            # Step 3: Find widgets/cards
            print("\n🔍 Step 3: Detecting widgets and cards...")

            widget_selectors = [
                'div[class*="card"]',
                'div[class*="Card"]',
                'div[class*="widget"]',
                'div[class*="Widget"]',
                'div[class*="panel"]',
                'div[class*="Panel"]',
                '[role="region"]',
                'section',
                'article'
            ]

            total_widgets = 0
            for selector in widget_selectors:
                elements = page.locator(selector).all()
                if len(elements) > 0:
                    print(f"   Found {len(elements)} elements matching: {selector}")
                    total_widgets = max(total_widgets, len(elements))

                    # Try to get text content from first few
                    for i, elem in enumerate(elements[:5]):
                        try:
                            text = elem.inner_text()[:100]  # First 100 chars
                            if text.strip():
                                results["widgets_found"].append({
                                    "selector": selector,
                                    "index": i,
                                    "preview": text.strip()
                                })
                        except:
                            pass

            print(f"\n   📊 Total widgets/cards detected: {total_widgets}")

            # Step 4: Look for specific ADMIN metrics
            print("\n🎯 Step 4: Looking for ADMIN-specific metrics...")

            admin_keywords = [
                'users',
                'organization',
                'billing',
                'subscription',
                'usage',
                'limit',
                'job posting',
                'candidate',
                'department',
                'analytics',
                'PRO',
                'ENTERPRISE'
            ]

            page_text = page.content().lower()
            for keyword in admin_keywords:
                if keyword.lower() in page_text:
                    results["metrics_found"].append(keyword)
                    print(f"   ✅ Found keyword: {keyword}")

            # Step 5: Take detailed screenshots
            print("\n📸 Step 5: Capturing detailed screenshots...")

            page.screenshot(path="/home/asan/Desktop/ikai/test-outputs/w4-03-dashboard-full.png", full_page=True)
            results["screenshots"].append("w4-03-dashboard-full.png")
            print("   ✅ Full page: w4-03-dashboard-full.png")

            # Try to scroll and capture different sections
            page.evaluate("window.scrollTo(0, 500)")
            time.sleep(1)
            page.screenshot(path="/home/asan/Desktop/ikai/test-outputs/w4-04-dashboard-middle.png")
            results["screenshots"].append("w4-04-dashboard-middle.png")
            print("   ✅ Middle section: w4-04-dashboard-middle.png")

            # Step 6: Check navigation menu
            print("\n🧭 Step 6: Checking navigation menu...")

            nav_items = page.locator('nav a, [role="navigation"] a, aside a').all()
            print(f"   Found {len(nav_items)} navigation links")

            nav_texts = []
            for nav in nav_items[:15]:  # First 15
                try:
                    text = nav.inner_text().strip()
                    if text:
                        nav_texts.append(text)
                except:
                    pass

            if nav_texts:
                print(f"   Navigation items: {', '.join(nav_texts[:10])}")

            # Wait for any delayed console errors
            print("\n⏳ Waiting for delayed console errors...")
            time.sleep(5)

            # Final results
            print("\n" + "="*80)
            print("📊 DASHBOARD INSPECTION RESULTS")
            print("="*80)
            print(f"✅ Dashboard Loaded: {results['dashboard_loaded']}")
            print(f"⏱️  Page Load Time: {results['page_load_time']}s")
            print(f"📦 Widgets/Cards Found: {total_widgets}")
            print(f"🎯 ADMIN Metrics Found: {len(results['metrics_found'])}")
            print(f"📸 Screenshots: {len(results['screenshots'])}")
            print(f"⚠️  Console Errors: {len(results['console_errors'])}")

            if results["metrics_found"]:
                print(f"\n✅ Detected metrics: {', '.join(results['metrics_found'][:10])}")

            if results["console_errors"]:
                print("\n" + "="*80)
                print("⚠️  CONSOLE ERRORS DETECTED")
                print("="*80)
                for i, error in enumerate(results["console_errors"], 1):
                    print(f"\n{i}. [{error['type'].upper()}]")
                    print(f"   Message: {error['text'][:200]}")  # First 200 chars
                    if error.get('location'):
                        print(f"   Location: {error['location']}")
            else:
                print("\n✅ ZERO CONSOLE ERRORS - PERFECT!")

            print("\n" + "="*80)

        except Exception as e:
            print(f"\n❌ ERROR: {str(e)}")
            results["errors"].append(str(e))
            page.screenshot(path="/home/asan/Desktop/ikai/test-outputs/w4-error-dashboard.png", full_page=True)

        finally:
            browser.close()

    # Save results
    with open("/home/asan/Desktop/ikai/test-outputs/w4-dashboard-results.json", "w") as f:
        json.dump(results, f, indent=2)

    return results

if __name__ == "__main__":
    results = test_admin_dashboard()

    # Exit with error if console errors found
    if len(results["console_errors"]) > 0:
        exit(1)

    exit(0)
