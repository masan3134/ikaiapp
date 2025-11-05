#!/usr/bin/env python3
"""Check login - WITH BROWSER (non-headless)"""
from playwright.sync_api import sync_playwright
import time

BASE_URL = "http://localhost:8103"
TEST_USER = {"email": "test-user@test-org-1.com", "password": "TestPass123!"}

with sync_playwright() as p:
    browser = p.chromium.launch(headless=False)  # SHOW BROWSER
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
    print("Submitting form...")
    page.evaluate("""() => {
        const form = document.querySelector('form');
        if (form) form.requestSubmit();
    }""")

    print("Waiting 15 seconds for login...")
    for i in range(15):
        time.sleep(1)
        if '/dashboard' in page.url:
            print(f"✅ Redirected to dashboard at {i+1}s")
            break
        print(f"  {i+1}s: {page.url}")

    print(f"\nFinal URL: {page.url}")
    print("\nConsole logs:")
    for log in console_logs:
        print(f"  {log}")

    print("\nPress Enter to close...")
    input()
    browser.close()
