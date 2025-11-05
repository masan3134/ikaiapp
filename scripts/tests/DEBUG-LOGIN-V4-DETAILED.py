#!/usr/bin/env python3
"""Debug login - ULTRA DETAILED"""
from playwright.sync_api import sync_playwright
import time
import json

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

    print("🔍 DEBUG LOGIN V4 - ULTRA DETAILED")
    print("="*80)

    # Navigate
    print("\n1. Navigate to login...")
    page.goto(f"{BASE_URL}/login")
    page.wait_for_load_state('networkidle')
    time.sleep(3)
    print(f"   URL: {page.url}")
    print(f"   Title: {page.title()}")

    # Check if form exists
    print("\n2. Check form elements...")
    email_input = page.query_selector('input[type="email"]')
    password_input = page.query_selector('input[type="password"]')
    submit_button = page.query_selector('button[type="submit"]')

    print(f"   Email input: {'✅ Found' if email_input else '❌ Not found'}")
    print(f"   Password input: {'✅ Found' if password_input else '❌ Not found'}")
    print(f"   Submit button: {'✅ Found' if submit_button else '❌ Not found'}")

    if submit_button:
        print(f"   Submit button text: {submit_button.inner_text()}")
        print(f"   Submit button disabled: {submit_button.is_disabled()}")

    # Fill form
    print("\n3. Fill form...")
    page.fill('input[type="email"]', TEST_USER['email'])
    page.fill('input[type="password"]', TEST_USER['password'])
    print(f"   Email filled: {page.input_value('input[type=\"email\"]')}")
    print(f"   Password filled: {'*' * len(page.input_value('input[type=\"password\"]'))}")

    # Clear logs
    console_logs.clear()
    network_logs.clear()

    # Submit and watch closely
    print("\n4. Submit form...")
    print("   Clicking submit button...")
    page.click('button[type="submit"]')

    # Watch for 10 seconds
    for i in range(10):
        time.sleep(1)
        print(f"\n   [{i+1}s] URL: {page.url}")
        print(f"   [{i+1}s] Network requests: {len(network_logs)}")
        if network_logs:
            last_req = network_logs[-1]
            print(f"   [{i+1}s] Last request: {last_req['method']} {last_req['status']} {last_req['url']}")

        if '/dashboard' in page.url:
            print("   ✅ REDIRECTED TO DASHBOARD!")
            break

    print(f"\n5. Final State:")
    print(f"   URL: {page.url}")
    print(f"   Total network requests: {len(network_logs)}")
    print(f"   Total console logs: {len(console_logs)}")

    print("\n6. Console Logs:")
    for log in console_logs:
        print(f"   {log}")

    print("\n7. Network Logs:")
    for log in network_logs:
        print(f"   {log['status']} {log['method']} {log['url']}")

    # Check localStorage
    print("\n8. LocalStorage:")
    storage = context.storage_state()
    origins = storage.get('origins', [])
    for origin in origins:
        if origin.get('origin') == BASE_URL:
            local_storage = origin.get('localStorage', [])
            for item in local_storage:
                if 'token' in item['name'] or 'user' in item['name']:
                    value = item['value']
                    if len(value) > 50:
                        value = value[:47] + "..."
                    print(f"   {item['name']}: {value}")

    # Check cookies
    print("\n9. Cookies:")
    cookies = context.cookies()
    for cookie in cookies:
        if 'token' in cookie['name'] or 'user' in cookie['name']:
            value = cookie['value']
            if len(value) > 50:
                value = value[:47] + "..."
            print(f"   {cookie['name']}: {value}")

    browser.close()
