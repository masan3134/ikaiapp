#!/usr/bin/env python3
"""Debug login - WITH CLEAN STATE"""
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

    print("🔍 DEBUG LOGIN V5 - CLEAN STATE")
    print("="*80)

    # Navigate
    print("\n1. Navigate to login...")
    page.goto(f"{BASE_URL}/login")
    page.wait_for_load_state('networkidle')
    time.sleep(2)

    # CLEAR ALL STATE
    print("\n2. Clear all auth state...")
    page.evaluate("""() => {
        localStorage.clear();
        document.cookie.split(";").forEach(function(c) {
            document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
        });
    }""")
    print("   ✅ LocalStorage cleared")
    print("   ✅ Cookies cleared")

    # Reload
    print("\n3. Reload page...")
    page.reload()
    page.wait_for_load_state('networkidle')
    time.sleep(2)

    # Fill form
    print("\n4. Fill form...")
    page.fill('input[type="email"]', TEST_USER['email'])
    page.fill('input[type="password"]', TEST_USER['password'])

    # Clear logs
    console_logs.clear()
    network_logs.clear()

    # Submit
    print("\n5. Submit form...")
    page.click('button[type="submit"]')

    # Watch for 10 seconds
    for i in range(10):
        time.sleep(1)
        url = page.url
        print(f"   [{i+1}s] URL: {url}, Requests: {len(network_logs)}")

        if '/dashboard' in url:
            print("   ✅ REDIRECTED TO DASHBOARD!")
            break

    # Final state
    print(f"\n6. Final URL: {page.url}")
    print(f"\n7. Network Logs:")
    for log in network_logs[-10:]:
        print(f"   {log['status']} {log['method']} {log['url']}")

    print(f"\n8. Console Logs:")
    for log in console_logs:
        print(f"   {log}")

    # Check if auth stored
    storage = context.storage_state()
    has_token = False
    for origin in storage.get('origins', []):
        if origin.get('origin') == BASE_URL:
            for item in origin.get('localStorage', []):
                if 'auth_token' in item['name']:
                    has_token = True
                    break

    print(f"\n9. Auth State:")
    print(f"   Token in localStorage: {'✅ Yes' if has_token else '❌ No'}")
    print(f"   Redirected: {'✅ Yes' if '/dashboard' in page.url else '❌ No'}")

    browser.close()
