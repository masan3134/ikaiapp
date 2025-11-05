#!/usr/bin/env python3
"""
QUICK FINAL TEST - Verify all fixes
"""
from playwright.sync_api import sync_playwright
import time

BASE_URL = "http://localhost:8103"
TEST_USER = {"email": "test-user@test-org-1.com", "password": "TestPass123!"}

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_context(viewport={'width': 1920, 'height': 1080}).new_page()

    # Console errors
    errors = []
    page.on('console', lambda msg: errors.append(msg.text) if msg.type == 'error' else None)

    print("🧪 QUICK FINAL TEST")
    print("="*60)

    # 1. Login
    print("\n1. Testing login...")
    page.goto(f"{BASE_URL}/login")
    page.wait_for_load_state('networkidle')
    time.sleep(3)

    page.wait_for_selector('input[type="email"]', timeout=10000)
    page.fill('input[type="email"]', TEST_USER['email'])
    page.fill('input[type="password"]', TEST_USER['password'])
    page.click('button[type="submit"]')

    time.sleep(5)  # Wait longer for redirect

    if '/dashboard' in page.url:
        print("✅ Login successful → Dashboard")
    else:
        print(f"❌ Login failed - URL: {page.url}")

    # 2. Test /analyses
    print("\n2. Testing /analyses access...")
    page.goto(f"{BASE_URL}/analyses")
    time.sleep(3)
    if '/analyses' in page.url:
        print("✅ USER can access /analyses")
    else:
        print(f"❌ Redirected to: {page.url}")

    # 3. Test /chat
    print("\n3. Testing /chat access...")
    page.goto(f"{BASE_URL}/chat")
    time.sleep(3)
    if '/chat' in page.url:
        print("✅ USER can access /chat")
    else:
        print(f"❌ Redirected to: {page.url}")

    # 4. Console errors
    print(f"\n4. Console errors: {len(errors)}")
    if errors:
        for err in errors[:3]:
            print(f"   ❌ {err[:100]}")
    else:
        print("   ✅ NO CONSOLE ERRORS!")

    browser.close()
    print("\n" + "="*60)
    print(f"RESULT: {'✅ ALL PASSED' if len(errors) == 0 and '/chat' in page.url else '❌ ISSUES FOUND'}")
