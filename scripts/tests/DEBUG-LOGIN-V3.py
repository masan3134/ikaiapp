#!/usr/bin/env python3
"""Debug login - ALL network requests"""
from playwright.sync_api import sync_playwright
import time

BASE_URL = "http://localhost:8103"
TEST_USER = {"email": "test-user@test-org-1.com", "password": "TestPass123!"}

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_context(viewport={'width': 1920, 'height': 1080}).new_page()

    console_logs = []
    page.on('console', lambda msg: console_logs.append(f"[{msg.type}] {msg.text}"))

    network_logs = []
    def track_network(response):
        try:
            network_logs.append(f"{response.status} {response.request.method} {response.url}")
        except:
            pass
    page.on('response', track_network)

    print("🔍 DEBUG LOGIN V3 - ALL REQUESTS")
    print("="*60)

    # Navigate
    print("\n1. Navigate to login...")
    page.goto(f"{BASE_URL}/login")
    page.wait_for_load_state('networkidle')
    time.sleep(2)

    # Fill form
    print("\n2. Fill form...")
    page.wait_for_selector('input[type="email"]', timeout=10000)
    page.fill('input[type="email"]', TEST_USER['email'])
    page.fill('input[type="password"]', TEST_USER['password'])

    # Clear logs before submit
    console_logs.clear()
    network_logs.clear()

    # Submit
    print("\n3. Submit...")
    page.click('button[type="submit"]')
    time.sleep(10)

    print(f"\nFinal URL: {page.url}")

    print("\n📋 Console Logs (last 10):")
    for log in console_logs[-10:]:
        print(f"  {log}")

    print("\n🌐 Network Logs (last 20):")
    for log in network_logs[-20:]:
        print(f"  {log}")

    browser.close()
