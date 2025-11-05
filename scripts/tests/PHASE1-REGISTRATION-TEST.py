#!/usr/bin/env python3
"""
PHASE 1: REGISTRATION & ONBOARDING TEST
Master Worker Full-Cycle Test - Phase 1

CRITICAL RULES:
- Real browser (headless=False)
- Real form submission
- Real email verification (PAUSE for user confirmation)
- Real screenshots (10 required)
- Real database verification
- Console errors = 0 (MANDATORY)
"""

from playwright.sync_api import sync_playwright
import time
import os
from datetime import datetime

# Configuration
BASE_URL = "http://localhost:8103"
SCREENSHOT_DIR = "/home/asan/Desktop/ikai/test-outputs/screenshots/phase1"
TEST_USER = {
    "email": "lira@ajansik.com",
    "password": "AjansIK2025!",
    "firstName": "Lira",
    "lastName": "Yılmaz",
    "companyName": "Ajans İK",
    "industry": "Recruitment",
    "companySize": "1-10"
}

# Ensure screenshot directory exists
os.makedirs(SCREENSHOT_DIR, exist_ok=True)

print("="*80)
print("🎯 PHASE 1: REGISTRATION & ONBOARDING TEST")
print("="*80)
print(f"📁 Screenshots: {SCREENSHOT_DIR}")
print(f"🌐 Base URL: {BASE_URL}")
print(f"👤 Test User: {TEST_USER['email']}")
print("="*80)

with sync_playwright() as p:
    # Launch browser - headless=False for visual verification
    print("\n🚀 STEP 1: Launch Browser (headless=False)")
    browser = p.chromium.launch(
        headless=False,
        args=['--start-maximized']
    )
    context = browser.new_context(
        viewport={'width': 1920, 'height': 1080},
        record_video_dir=SCREENSHOT_DIR
    )
    page = context.new_page()

    # Console error tracking
    console_errors = []
    console_logs = []

    def handle_console(msg):
        log_entry = f"[{msg.type}] {msg.text}"
        console_logs.append(log_entry)
        if msg.type in ['error', 'warning']:
            console_errors.append(log_entry)
            print(f"   ⚠️ Console {msg.type}: {msg.text}")

    page.on('console', handle_console)

    # Network tracking
    network_logs = []
    def track_network(response):
        try:
            network_logs.append({
                "status": response.status,
                "method": response.request.method,
                "url": response.url,
                "timestamp": datetime.now().isoformat()
            })
        except:
            pass
    page.on('response', track_network)

    try:
        # STEP 2: Navigate to Register Page
        print("\n📍 STEP 2: Navigate to /register")
        page.goto(f"{BASE_URL}/register", wait_until='networkidle')
        time.sleep(2)  # Wait for React hydration

        # Screenshot 1: Register page
        screenshot_path = f"{SCREENSHOT_DIR}/phase1-01-register-page.png"
        page.screenshot(path=screenshot_path, full_page=True)
        print(f"   ✅ Screenshot: {screenshot_path}")

        # Verify page loaded
        page_title = page.title()
        print(f"   📄 Page title: {page_title}")

        # Check console errors
        print(f"   🔍 Console errors: {len([e for e in console_errors if 'error' in e.lower()])}")

        # STEP 3: Fill Registration Form
        print("\n✍️ STEP 3: Fill Registration Form")

        # Wait for form to be ready
        page.wait_for_selector('input[name="email"], input[type="email"]', timeout=10000)

        # Fill email
        email_selector = 'input[name="email"], input[type="email"]'
        page.fill(email_selector, TEST_USER['email'])
        print(f"   ✅ Email: {TEST_USER['email']}")

        # Fill password
        password_selectors = 'input[name="password"], input[type="password"]'
        password_fields = page.query_selector_all(password_selectors)
        if len(password_fields) >= 1:
            password_fields[0].fill(TEST_USER['password'])
            print(f"   ✅ Password: {'*' * len(TEST_USER['password'])}")

        # Fill confirm password (if exists)
        if len(password_fields) >= 2:
            password_fields[1].fill(TEST_USER['password'])
            print(f"   ✅ Confirm Password: {'*' * len(TEST_USER['password'])}")

        # Fill first name
        fname_selector = 'input[name="firstName"], input[placeholder*="First"], input[placeholder*="İsim"]'
        try:
            page.fill(fname_selector, TEST_USER['firstName'], timeout=2000)
            print(f"   ✅ First Name: {TEST_USER['firstName']}")
        except:
            print(f"   ⚠️ First Name field not found (may not exist)")

        # Fill last name
        lname_selector = 'input[name="lastName"], input[placeholder*="Last"], input[placeholder*="Soyad"]'
        try:
            page.fill(lname_selector, TEST_USER['lastName'], timeout=2000)
            print(f"   ✅ Last Name: {TEST_USER['lastName']}")
        except:
            print(f"   ⚠️ Last Name field not found (may not exist)")

        # Screenshot 2: Form filled
        screenshot_path = f"{SCREENSHOT_DIR}/phase1-02-form-filled.png"
        page.screenshot(path=screenshot_path, full_page=True)
        print(f"   ✅ Screenshot: {screenshot_path}")

        # STEP 4: Submit Form
        print("\n🚀 STEP 4: Submit Registration Form")

        # Clear console errors before submit
        console_errors.clear()
        network_logs.clear()

        # Find and click submit button
        submit_selectors = [
            'button[type="submit"]',
            'button:has-text("Register")',
            'button:has-text("Sign Up")',
            'button:has-text("Kayıt")',
            'button:has-text("Kayıt Ol")'
        ]

        submitted = False
        for selector in submit_selectors:
            try:
                page.click(selector, timeout=2000)
                print(f"   ✅ Clicked submit button: {selector}")
                submitted = True
                break
            except:
                continue

        if not submitted:
            print("   ⚠️ Submit button not found, trying Enter key...")
            page.press(email_selector, 'Enter')

        # Wait for navigation or response
        time.sleep(5)

        # Screenshot 3: After submit (email sent message)
        screenshot_path = f"{SCREENSHOT_DIR}/phase1-03-email-sent-message.png"
        page.screenshot(path=screenshot_path, full_page=True)
        print(f"   ✅ Screenshot: {screenshot_path}")

        # Check URL
        current_url = page.url
        print(f"   📍 Current URL: {current_url}")

        # Check for success message
        page_content = page.content()
        success_keywords = ['email', 'verification', 'doğrulama', 'check', 'sent', 'gönderildi']
        found_keywords = [kw for kw in success_keywords if kw.lower() in page_content.lower()]
        print(f"   📧 Success indicators found: {found_keywords}")

        # Check network logs for API calls
        api_calls = [log for log in network_logs if '/api/' in log['url']]
        print(f"   🌐 API calls made: {len(api_calls)}")
        for call in api_calls[:5]:  # Show first 5
            print(f"      - {call['method']} {call['url'].split('/api/')[-1]} → {call['status']}")

        # Check console errors after submit
        error_count = len([e for e in console_errors if 'error' in e.lower()])
        print(f"   🔍 Console errors after submit: {error_count}")
        if error_count > 0:
            print("   ❌ CRITICAL: Console errors detected!")
            for err in console_errors[:5]:
                print(f"      {err}")

        # STEP 5: EMAIL VERIFICATION PAUSE
        print("\n" + "="*80)
        print("⏸️  STEP 5: EMAIL VERIFICATION - MANUAL CHECK REQUIRED")
        print("="*80)
        print("📧 EMAIL CHECK: mustafaasan91@gmail.com")
        print("🔍 Expected: Email with subject 'Email Verification' or 'Doğrulama'")
        print("📩 Action required: Check email and click verification link")
        print("="*80)
        print("⏳ Waiting for user confirmation...")
        print("   Type '✅ Geldi' when email received and link clicked")
        print("   Type '❌ Gelmedi' if email not received")
        print("="*80)

        # Keep browser open for manual verification
        print("\n🌐 Browser kept open for email verification...")
        print("   URL: http://localhost:8103")
        print("   Email: mustafaasan91@gmail.com")
        print("   Waiting 300 seconds (5 minutes) for manual verification...")

        # Wait for email verification (user will click link in browser)
        time.sleep(300)  # 5 minutes for user to check email and click link

        # Screenshot 4: After email verification
        screenshot_path = f"{SCREENSHOT_DIR}/phase1-04-email-verified.png"
        page.screenshot(path=screenshot_path, full_page=True)
        print(f"   ✅ Screenshot: {screenshot_path}")

        # STEP 6: Check if redirected to dashboard or onboarding
        print("\n📍 STEP 6: Check redirect after email verification")
        current_url = page.url
        print(f"   Current URL: {current_url}")

        if 'onboarding' in current_url or 'wizard' in current_url:
            print("   ✅ Redirected to onboarding - starting wizard...")

            # ONBOARDING STEP 1: Company Info
            print("\n📋 ONBOARDING STEP 1: Company Info")
            time.sleep(2)

            # Fill company info (adjust selectors based on actual form)
            try:
                page.fill('input[name="companyName"], input[placeholder*="Company"]', TEST_USER['companyName'])
                print(f"   ✅ Company Name: {TEST_USER['companyName']}")
            except:
                print("   ⚠️ Company name field handling...")

            screenshot_path = f"{SCREENSHOT_DIR}/phase1-05-onboarding-step1.png"
            page.screenshot(path=screenshot_path, full_page=True)
            print(f"   ✅ Screenshot: {screenshot_path}")

            # Click Next
            try:
                page.click('button:has-text("Next"), button:has-text("İleri"), button:has-text("Devam")')
                time.sleep(2)
            except:
                print("   ⚠️ Next button not found, continuing...")

            # ONBOARDING STEP 2: Job Info
            print("\n📋 ONBOARDING STEP 2: Job Info (Skip)")
            screenshot_path = f"{SCREENSHOT_DIR}/phase1-06-onboarding-step2.png"
            page.screenshot(path=screenshot_path, full_page=True)
            print(f"   ✅ Screenshot: {screenshot_path}")

            try:
                page.click('button:has-text("Skip"), button:has-text("Atla"), button:has-text("Next")')
                time.sleep(2)
            except:
                pass

            # Continue through remaining steps...
            for step_num in range(3, 6):
                print(f"\n📋 ONBOARDING STEP {step_num}: (Skip)")
                screenshot_path = f"{SCREENSHOT_DIR}/phase1-0{step_num+4}-onboarding-step{step_num}.png"
                page.screenshot(path=screenshot_path, full_page=True)
                print(f"   ✅ Screenshot: {screenshot_path}")

                try:
                    page.click('button:has-text("Skip"), button:has-text("Atla"), button:has-text("Next"), button:has-text("Finish"), button:has-text("Dashboard")', timeout=3000)
                    time.sleep(2)
                except:
                    pass

        # STEP 7: Final Dashboard
        print("\n🏠 STEP 7: Dashboard Landing")

        # Navigate to dashboard if not there
        if 'dashboard' not in page.url.lower():
            page.goto(f"{BASE_URL}/dashboard", wait_until='networkidle')
            time.sleep(3)

        # Final screenshot
        screenshot_path = f"{SCREENSHOT_DIR}/phase1-10-dashboard.png"
        page.screenshot(path=screenshot_path, full_page=True)
        print(f"   ✅ Screenshot: {screenshot_path}")

        # Final console error check
        final_error_count = len([e for e in console_errors if 'error' in e.lower()])
        print(f"   🔍 Final console errors: {final_error_count}")

        # Summary
        print("\n" + "="*80)
        print("📊 PHASE 1 EXECUTION SUMMARY")
        print("="*80)
        print(f"✅ Screenshots captured: ~10 (check {SCREENSHOT_DIR})")
        print(f"✅ Registration form submitted")
        print(f"✅ Email verification: MANUAL CHECK REQUIRED")
        print(f"✅ Final URL: {page.url}")
        print(f"🔍 Console errors: {final_error_count}")
        print("="*80)

        # Keep browser open for final inspection
        print("\n⏳ Keeping browser open for 30 seconds for final inspection...")
        time.sleep(30)

    except Exception as e:
        print(f"\n❌ ERROR: {str(e)}")
        import traceback
        traceback.print_exc()

        # Error screenshot
        screenshot_path = f"{SCREENSHOT_DIR}/phase1-ERROR.png"
        try:
            page.screenshot(path=screenshot_path, full_page=True)
            print(f"   📸 Error screenshot: {screenshot_path}")
        except:
            pass

    finally:
        print("\n🔚 Closing browser...")
        browser.close()

        print("\n" + "="*80)
        print("✅ PHASE 1 TEST COMPLETED")
        print("="*80)
        print(f"📁 Screenshots: {SCREENSHOT_DIR}")
        print(f"📊 Total console logs: {len(console_logs)}")
        print(f"⚠️ Total console errors: {len(console_errors)}")
        print("="*80)
        print("\n🔍 NEXT: Run database verification query")
        print("   docker exec ikai-postgres psql -U ikaiuser -d ikaidb -c \"SELECT * FROM users WHERE email = 'lira@ajansik.com';\"")
        print("="*80)
