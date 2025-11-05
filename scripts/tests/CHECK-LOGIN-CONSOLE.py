#!/usr/bin/env python3
"""Quick check - Is handleSubmit being called?"""
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

    # Navigate
    page.goto(f"{BASE_URL}/login")
    page.wait_for_load_state('networkidle')

    # Clear state
    page.evaluate("""() => {
        localStorage.clear();
        document.cookie.split(";").forEach(function(c) {
            document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
        });
    }""")

    page.reload()
    page.wait_for_load_state('networkidle')
    time.sleep(5)

    # Fill
    page.fill('input[type="email"]', TEST_USER['email'])
    page.fill('input[type="password"]', TEST_USER['password'])

    # Clear console
    console_logs.clear()

    # Submit
    page.evaluate("""() => {
        const form = document.querySelector('form');
        if (form) form.requestSubmit();
    }""")

    time.sleep(10)  # Wait longer

    print("Console logs after submit:")
    for log in console_logs:
        print(f"  {log}")

    print(f"\nFinal URL: {page.url}")

    if any('[LOGIN] handleSubmit called' in log for log in console_logs):
        print("\n✅ handleSubmit WAS CALLED")
    else:
        print("\n❌ handleSubmit WAS NOT CALLED")

    if any('error' in log.lower() for log in console_logs):
        print("\n⚠️  ERRORS DETECTED:")
        for log in console_logs:
            if 'error' in log.lower():
                print(f"    {log}")

    browser.close()
