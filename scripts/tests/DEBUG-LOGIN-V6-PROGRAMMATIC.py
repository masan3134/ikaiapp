#!/usr/bin/env python3
"""Debug login - PROGRAMMATIC SUBMIT"""
from playwright.sync_api import sync_playwright
import time

BASE_URL = "http://localhost:8103"
TEST_USER = {"email": "test-user@test-org-1.com", "password": "TestPass123!"}

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    context = browser.new_context(viewport={'width': 1920, 'height': 1080})
    page = context.new_page()

    console_logs = []
    page.on('console', lambda msg: console_logs.append(f"[{msg.type}] {msg.text}"))

    network_logs = []
    def track_network(response):
        try:
            network_logs.append({
                "status": response.status,
                "method": response.request.method,
                "url": response.url
            })
        except:
            pass
    page.on('response', track_network)

    print("🔍 DEBUG LOGIN V6 - PROGRAMMATIC SUBMIT")
    print("="*80)

    # Navigate
    print("\n1. Navigate and wait for React hydration...")
    page.goto(f"{BASE_URL}/login")
    page.wait_for_load_state('networkidle')

    # Wait longer for React hydration
    print("   Waiting 5 seconds for React hydration...")
    time.sleep(5)

    # Clear state
    print("\n2. Clear all auth state...")
    page.evaluate("""() => {
        localStorage.clear();
        document.cookie.split(";").forEach(function(c) {
            document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
        });
    }""")

    # Reload
    page.reload()
    page.wait_for_load_state('networkidle')
    time.sleep(5)

    # Fill form
    print("\n3. Fill form...")
    page.fill('input[type="email"]', TEST_USER['email'])
    page.fill('input[type="password"]', TEST_USER['password'])

    # Check React hydration
    print("\n4. Check React hydration...")
    is_hydrated = page.evaluate("""() => {
        const emailInput = document.querySelector('input[type="email"]');
        return emailInput && emailInput._valueTracker ? true : false;
    }""")
    print(f"   React hydrated: {'✅ Yes' if is_hydrated else '❌ No'}")

    # Clear logs
    console_logs.clear()
    network_logs.clear()

    # Try different submit methods
    print("\n5. Testing submit methods...")

    # Method 1: Click button
    print("   Method 1: Clicking submit button...")
    page.click('button[type="submit"]')
    time.sleep(3)
    print(f"   Result: URL={page.url}, Requests={len(network_logs)}")

    if '/dashboard' not in page.url:
        # Method 2: Programmatic submit
        print("   Method 2: Programmatic form.submit()...")
        network_logs.clear()
        page.evaluate("""() => {
            const form = document.querySelector('form');
            if (form) {
                form.requestSubmit();
            }
        }""")
        time.sleep(3)
        print(f"   Result: URL={page.url}, Requests={len(network_logs)}")

    if '/dashboard' not in page.url:
        # Method 3: Press Enter
        print("   Method 3: Press Enter in password field...")
        network_logs.clear()
        page.press('input[type="password"]', 'Enter')
        time.sleep(3)
        print(f"   Result: URL={page.url}, Requests={len(network_logs)}")

    # Final check
    print(f"\n6. Final State:")
    print(f"   URL: {page.url}")
    print(f"   Total requests: {len(network_logs)}")

    if network_logs:
        print(f"\n7. Network Logs:")
        for log in network_logs:
            print(f"   {log['status']} {log['method']} {log['url']}")

    if console_logs:
        print(f"\n8. Console Logs:")
        for log in console_logs:
            print(f"   {log}")

    browser.close()
