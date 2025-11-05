#!/usr/bin/env python3
"""Debug login redirect"""
from playwright.sync_api import sync_playwright
import time

BASE_URL = "http://localhost:8103"
TEST_USER = {"email": "test-user@test-org-1.com", "password": "TestPass123!"}

with sync_playwright() as p:
    browser = p.chromium.launch(headless=False)  # NON-HEADLESS for debugging
    page = browser.new_context(viewport={'width': 1920, 'height': 1080}).new_page()

    # Log ALL console messages
    page.on('console', lambda msg: print(f"CONSOLE [{msg.type}]: {msg.text}"))

    print("🔍 DEBUG LOGIN TEST")
    print("="*60)

    # Navigate
    print("\n1. Navigate to login...")
    page.goto(f"{BASE_URL}/login")
    page.wait_for_load_state('networkidle')
    time.sleep(2)

    # Fill form
    print("\n2. Fill login form...")
    page.wait_for_selector('input[type="email"]', timeout=10000)
    page.fill('input[type="email"]', TEST_USER['email'])
    page.fill('input[type="password"]', TEST_USER['password'])

    # Submit
    print("\n3. Submit form...")
    page.click('button[type="submit"]')

    # Wait and watch
    print("\n4. Waiting 15 seconds...")
    for i in range(15):
        time.sleep(1)
        print(f"   {i+1}s - URL: {page.url}")
        if '/dashboard' in page.url:
            print("   ✅ REDIRECTED TO DASHBOARD!")
            break

    print(f"\nFinal URL: {page.url}")
    print("\nPress Enter to close...")
    input()
    browser.close()
