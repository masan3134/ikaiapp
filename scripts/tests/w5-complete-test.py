from playwright.sync_api import sync_playwright
import time
import json

FRONTEND_URL = 'http://localhost:8103'
EMAIL = 'info@gaiai.ai'
PASSWORD = '23235656'

results = {
    'timestamp': time.strftime('%Y-%m-%d %H:%M:%S'),
    'pages_tested': [],
    'console_errors': [],
}

with sync_playwright() as p:
    browser = p.chromium.launch(headless=False)
    page = browser.new_page(viewport={'width': 1920, 'height': 1080})
    
    # Track console errors
    page.on('console', lambda msg: 
        results['console_errors'].append(msg.text) if msg.type == 'error' else None)
    
    print("=== COMPLETE SUPER_ADMIN E2E TEST ===\n")
    
    # Login
    print("[1] LOGIN...")
    page.goto(f'{FRONTEND_URL}/login')
    page.fill('#email', EMAIL)
    page.fill('#password', PASSWORD)
    page.click('button[type="submit"]')
    time.sleep(3)
    
    if '/dashboard' in page.url:
        print('   ✅ Login successful')
        results['pages_tested'].append({'page': 'Login', 'status': 'PASS'})
    
    # Test ALL 12 pages
    pages_to_test = [
        ('Dashboard', '/super-admin'),
        ('Organizations', '/super-admin/organizations'),
        ('System Health', '/super-admin/system-health'),
        ('Queue Management', '/super-admin/queues'),
        ('Analytics', '/super-admin/analytics'),
        ('Users', '/super-admin/users'),
        ('Settings', '/super-admin/settings'),
        ('Security Logs', '/super-admin/security-logs'),
        ('Security', '/super-admin/security'),
        ('Logs', '/super-admin/logs'),
        ('System', '/super-admin/system'),
        ('Milvus', '/super-admin/milvus'),
    ]
    
    for idx, (name, url) in enumerate(pages_to_test, 2):
        print(f"[{idx}] {name.upper()}...")
        page.goto(f'{FRONTEND_URL}{url}')
        page.wait_for_load_state('networkidle')
        time.sleep(2)
        
        current_url = page.url
        if url in current_url:
            print(f'   ✅ {name} loaded')
            results['pages_tested'].append({'page': name, 'status': 'PASS', 'url': url})
        else:
            print(f'   ❌ {name} FAILED (URL: {current_url})')
            results['pages_tested'].append({'page': name, 'status': 'FAIL', 'url': url})
    
    print(f"\n=== CONSOLE ERRORS: {len(results['console_errors'])} ===")
    if results['console_errors']:
        for err in set(results['console_errors']):
            print(f"   ❌ {err[:80]}")
    else:
        print("   ✅ ZERO CONSOLE ERRORS")
    
    pass_count = len([p for p in results['pages_tested'] if p['status'] == 'PASS'])
    total_count = len(results['pages_tested'])
    
    print(f"\n=== FINAL RESULT ===")
    print(f"Pages: {pass_count}/{total_count} PASS")
    print(f"Console Errors: {len(results['console_errors'])}")
    
    if pass_count == total_count and len(results['console_errors']) == 0:
        print("\n🎉 100% SUCCESS - ALL PAGES WORKING!")
    
    browser.close()
    
    # Save results
    with open('scripts/test-outputs/w5-real/complete-test-results.json', 'w') as f:
        json.dump(results, f, indent=2)

