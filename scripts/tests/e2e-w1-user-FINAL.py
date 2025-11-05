#!/usr/bin/env python3
"""
E2E TEST - USER ROLE - FINAL VERSION
Fixed: Use form.requestSubmit() instead of button click
"""
from playwright.sync_api import sync_playwright
import time
import json

BASE_URL = "http://localhost:8103"
API_URL = "http://localhost:8102"
TEST_USER = {"email": "test-user@test-org-1.com", "password": "TestPass123!"}

# Test results
results = {
    "test_name": "E2E Test - USER Role - FINAL",
    "timestamp": time.strftime("%Y-%m-%d %H:%M:%S"),
    "user": TEST_USER["email"],
    "tests": [],
    "console_errors": [],
    "network_errors": [],
    "screenshots": [],
    "summary": {}
}

def add_test(name, passed, details=""):
    results["tests"].append({
        "name": name,
        "passed": passed,
        "details": details
    })
    status = "✅ PASS" if passed else "❌ FAIL"
    print(f"   {status}: {name}")
    if details:
        print(f"      {details}")

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    context = browser.new_context(viewport={'width': 1920, 'height': 1080})
    page = context.new_page()

    # Track console errors
    def handle_console(msg):
        if msg.type == 'error':
            results["console_errors"].append(msg.text)

    page.on('console', handle_console)

    # Track network errors
    def handle_response(response):
        if response.status >= 400:
            results["network_errors"].append({
                "status": response.status,
                "url": response.url
            })

    page.on('response', handle_response)

    print("🧪 E2E TEST - USER ROLE - FINAL VERSION")
    print("="*80)

    # 1. LOGIN TEST
    print("\n1. LOGIN TEST")
    page.goto(f"{BASE_URL}/login")
    page.wait_for_load_state('networkidle')

    # Clear auth state
    page.evaluate("""() => {
        localStorage.clear();
        document.cookie.split(";").forEach(function(c) {
            document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
        });
    }""")

    page.reload()
    page.wait_for_load_state('networkidle')

    # Wait for React hydration (critical for event handlers!)
    print("   Waiting for React hydration...")
    time.sleep(5)

    # Fill and submit
    page.fill('input[type="email"]', TEST_USER['email'])
    page.fill('input[type="password"]', TEST_USER['password'])

    # Track network requests for login
    login_requests = []
    def track_login_network(response):
        try:
            url = response.url
            if '/auth/login' in url or '/organizations/me' in url:
                login_requests.append({
                    "status": response.status,
                    "url": url
                })
        except:
            pass

    page.on('response', track_login_network)

    # Use form.requestSubmit() instead of button click!
    page.evaluate("""() => {
        const form = document.querySelector('form');
        if (form) form.requestSubmit();
    }""")

    # Wait for redirect (can take up to 10s for API call + org check + redirect)
    for i in range(10):
        time.sleep(1)
        if '/dashboard' in page.url or '/onboarding' in page.url:
            break

    # Check if login actually worked
    has_auth_request = any('/auth/login' in req['url'] for req in login_requests)
    has_org_request = any('/organizations/me' in req['url'] for req in login_requests)
    is_redirected = '/dashboard' in page.url or '/onboarding' in page.url

    login_details = f"Auth API: {has_auth_request}, Org API: {has_org_request}, Redirected: {is_redirected}, URL: {page.url}"
    add_test("Login and redirect", is_redirected, login_details)
    page.screenshot(path="screenshots/e2e-w1-final-01-login.png")
    results["screenshots"].append("01-login.png")

    # 2. DASHBOARD ACCESS
    print("\n2. DASHBOARD ACCESS")
    page.goto(f"{BASE_URL}/dashboard")
    time.sleep(3)
    dashboard_loaded = page.query_selector('h1') is not None
    add_test("Dashboard loads", dashboard_loaded)
    page.screenshot(path="screenshots/e2e-w1-final-02-dashboard.png")
    results["screenshots"].append("02-dashboard.png")

    # 3. CV ANALYSIS (READ-ONLY)
    print("\n3. CV ANALYSIS (READ-ONLY ACCESS)")
    page.goto(f"{BASE_URL}/analyses")
    time.sleep(3)
    analyses_accessible = '/analyses' in page.url and page.query_selector('h1') is not None
    add_test("USER can access /analyses", analyses_accessible, page.url)
    page.screenshot(path="screenshots/e2e-w1-final-03-analyses.png")
    results["screenshots"].append("03-analyses.png")

    # 4. AI CHAT
    print("\n4. AI CHAT")
    page.goto(f"{BASE_URL}/chat")
    time.sleep(3)
    chat_accessible = '/chat' in page.url and page.query_selector('h1') is not None
    add_test("USER can access /chat", chat_accessible, page.url)
    page.screenshot(path="screenshots/e2e-w1-final-04-chat.png")
    results["screenshots"].append("04-chat.png")

    # 5. PROFILE SETTINGS
    print("\n5. PROFILE SETTINGS")
    page.goto(f"{BASE_URL}/settings/profile")
    time.sleep(3)

    # Test profile rename
    original_name = page.input_value('input[name="firstName"]')
    test_name = f"TestUser{int(time.time() % 1000)}"

    page.fill('input[name="firstName"]', test_name)
    page.click('button:has-text("Kaydet")')
    time.sleep(2)

    # Reload and verify
    page.reload()
    time.sleep(2)
    saved_name = page.input_value('input[name="firstName"]')
    profile_rename_works = saved_name == test_name
    add_test("Profile rename", profile_rename_works, f"Set: {test_name}, Got: {saved_name}")

    # Restore original name
    if profile_rename_works:
        page.fill('input[name="firstName"]', original_name)
        page.click('button:has-text("Kaydet")')
        time.sleep(2)

    page.screenshot(path="screenshots/e2e-w1-final-05-profile.png")
    results["screenshots"].append("05-profile.png")

    # 6. NOTIFICATIONS
    print("\n6. NOTIFICATIONS")
    page.goto(f"{BASE_URL}/notifications")
    time.sleep(3)
    notifications_accessible = '/notifications' in page.url
    add_test("USER can access /notifications", notifications_accessible)
    page.screenshot(path="screenshots/e2e-w1-final-06-notifications.png")
    results["screenshots"].append("06-notifications.png")

    # 7. RBAC VIOLATIONS (USER should NOT access these)
    print("\n7. RBAC VIOLATION TESTS")
    forbidden_pages = [
        "/job-postings",
        "/candidates",
        "/email-templates",
        "/team"
    ]

    for page_path in forbidden_pages:
        page.goto(f"{BASE_URL}{page_path}")
        time.sleep(2)
        is_blocked = '/dashboard' in page.url or '/403' in page.url or page.url.endswith('/login')
        add_test(f"USER blocked from {page_path}", is_blocked, page.url)

    # 8. CONSOLE ERRORS
    print("\n8. CONSOLE ERROR CHECK")
    console_error_count = len(results["console_errors"])
    add_test("Zero console errors", console_error_count == 0, f"Found: {console_error_count}")

    if results["console_errors"]:
        print("\n   Console Errors:")
        for err in results["console_errors"][:5]:
            print(f"      ❌ {err[:100]}")

    # 9. NETWORK ERRORS
    print("\n9. NETWORK ERROR CHECK")
    network_error_count = len(results["network_errors"])
    add_test("No critical network errors", network_error_count == 0, f"Found: {network_error_count}")

    if results["network_errors"]:
        print("\n   Network Errors:")
        for err in results["network_errors"][:5]:
            print(f"      ❌ {err['status']} {err['url']}")

    browser.close()

    # SUMMARY
    print("\n" + "="*80)
    print("SUMMARY")
    print("="*80)

    passed_count = sum(1 for t in results["tests"] if t["passed"])
    total_count = len(results["tests"])

    results["summary"] = {
        "total_tests": total_count,
        "passed": passed_count,
        "failed": total_count - passed_count,
        "pass_rate": f"{passed_count/total_count*100:.1f}%",
        "console_errors": console_error_count,
        "network_errors": network_error_count
    }

    print(f"Tests Passed: {passed_count}/{total_count} ({results['summary']['pass_rate']})")
    print(f"Console Errors: {console_error_count}")
    print(f"Network Errors: {network_error_count}")
    print(f"Screenshots: {len(results['screenshots'])} saved")

    # Save results
    with open("test-outputs/e2e-w1-user-final-results.json", "w") as f:
        json.dump(results, f, indent=2)

    print("\n✅ Results saved to: test-outputs/e2e-w1-user-final-results.json")

    # Final verdict
    all_passed = passed_count == total_count and console_error_count == 0
    print("\n" + "="*80)
    if all_passed:
        print("🎉 ALL TESTS PASSED - USER ROLE E2E VERIFIED ✅")
    else:
        print("⚠️  SOME TESTS FAILED - SEE DETAILS ABOVE ❌")
    print("="*80)
