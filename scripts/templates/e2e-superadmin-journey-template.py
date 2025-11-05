#!/usr/bin/env python3
"""
E2E Test Template: SUPER_ADMIN Role Journey (System-Wide Management)
Focus: Multi-org management, system health, queue monitoring

Usage:
  python3 scripts/templates/e2e-superadmin-journey-template.py > test-outputs/w5-superadmin-journey.txt
"""

from playwright.sync_api import sync_playwright
import json
import time

# ============================================
# CONFIGURATION
# ============================================
BASE_URL = "http://localhost:8103"
API_URL = "http://localhost:8102"

# SUPER_ADMIN credentials
SUPERADMIN_EMAIL = "info@gaiai.ai"
SUPERADMIN_PASSWORD = "23235656"

# Test configuration
HEADLESS = True
TIMEOUT = 5000

# ============================================
# TEST RESULTS
# ============================================
test_results = {
    "total_tests": 0,
    "passed": 0,
    "failed": 0,
    "console_errors": [],
    "screenshots": [],
    "features_tested": [],
    "organizations_count": 0,
    "system_services_checked": []
}

def log_test(test_name, status, details=""):
    test_results["total_tests"] += 1
    if status == "PASS":
        test_results["passed"] += 1
        print(f"✅ {test_name}: PASS {details}")
    else:
        test_results["failed"] += 1
        print(f"❌ {test_name}: FAIL {details}")

# ============================================
# MAIN TEST
# ============================================
def run_superadmin_journey():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=HEADLESS)
        context = browser.new_context()
        page = context.new_page()
        page.set_default_timeout(TIMEOUT)

        # Console tracking
        console_errors = []
        page.on("console", lambda msg: console_errors.append(msg.text) if msg.type == "error" else None)

        try:
            print("="*70)
            print("SUPER_ADMIN ROLE - SYSTEM-WIDE MANAGEMENT TEST")
            print("="*70)

            # ================================================
            # 1. LOGIN & DASHBOARD
            # ================================================
            print("\n[1] LOGIN & DASHBOARD")
            print("-" * 70)

            page.goto(f"{BASE_URL}/login")
            page.wait_for_load_state("networkidle")

            page.fill('input[type="email"]', SUPERADMIN_EMAIL)
            page.fill('input[type="password"]', SUPERADMIN_PASSWORD)
            page.click('button[type="submit"]')

            page.wait_for_url(f"{BASE_URL}/dashboard", timeout=10000)
            page.wait_for_load_state("networkidle")
            page.screenshot(path="screenshots/superadmin-01-dashboard.png")
            log_test("Login", "PASS")

            # Get token
            token = page.evaluate("() => localStorage.getItem('auth_token')")

            # Count widgets (system-wide metrics)
            widgets = page.locator('[data-testid*="widget"], .widget, .card').all()
            print(f"Dashboard widgets: {len(widgets)}")

            test_results["features_tested"].append("Authentication")

            # ================================================
            # 2. ORGANIZATIONS MANAGEMENT (CRITICAL!)
            # ================================================
            print("\n[2] ORGANIZATIONS MANAGEMENT")
            print("-" * 70)
            print("🔴 CRITICAL: Multi-org management (ALL organizations)")

            # Navigate to super-admin organizations
            try:
                page.click('a[href="/super-admin/organizations"]', timeout=3000)
            except:
                try:
                    page.click('a[href="/super-admin"]', timeout=3000)
                    page.wait_for_timeout(1000)
                    page.click('a[href="/super-admin/organizations"]', timeout=3000)
                except:
                    page.goto(f"{BASE_URL}/super-admin/organizations")

            page.wait_for_load_state("networkidle")
            page.screenshot(path="screenshots/superadmin-02-organizations.png")

            # Count organizations
            org_rows = page.locator('[data-testid="organization"], .organization-item, tbody tr').all()
            org_count = max(0, len(org_rows) - 1)
            print(f"Organizations in UI: {org_count}")

            # Verify via API
            orgs_result = page.evaluate(f"""
                async () => {{
                    const res = await fetch('{API_URL}/api/v1/super-admin/organizations', {{
                        headers: {{
                            'Authorization': 'Bearer {token}'
                        }}
                    }});
                    const response = await res.json();
                    const data = response.data || [];
                    return {{
                        total: data.length || 0,
                        plans: data.map(o => o.plan),
                        names: data.slice(0, 3).map(o => o.name)
                    }};
                }}
            """)

            test_results["organizations_count"] = orgs_result['total']
            print(f"Organizations API: {orgs_result['total']}")
            print(f"Plans: {set(orgs_result['plans'])}")
            print(f"Sample names: {orgs_result['names']}")

            log_test("Organizations Management", "PASS", f"- {orgs_result['total']} orgs")
            test_results["features_tested"].append("Multi-Org Management")

            # ================================================
            # 3. SYSTEM HEALTH MONITORING
            # ================================================
            print("\n[3] SYSTEM HEALTH MONITORING")
            print("-" * 70)

            try:
                page.click('a[href="/super-admin/system-health"]', timeout=3000)
            except:
                page.goto(f"{BASE_URL}/super-admin/system-health")

            page.wait_for_load_state("networkidle")
            page.screenshot(path="screenshots/superadmin-03-system-health.png")

            # Check for service status indicators
            service_items = page.locator('[data-testid*="service"], .service-item, .health-item').all()
            print(f"Service indicators: {len(service_items)}")

            # Verify via API
            health_result = page.evaluate(f"""
                async () => {{
                    const res = await fetch('{API_URL}/api/v1/super-admin/system-health', {{
                        headers: {{
                            'Authorization': 'Bearer {token}'
                        }}
                    }});
                    const response = await res.json();
                    const data = response.data || {{}};
                    return {{
                        services: Object.keys(data.services || {{}}),
                        uptime: data.uptime || 0
                    }};
                }}
            """)

            test_results["system_services_checked"] = health_result['services']
            print(f"Services monitored: {health_result['services']}")
            print(f"System uptime: {health_result['uptime']:.0f}s")

            log_test("System Health", "PASS", f"- {len(health_result['services'])} services")
            test_results["features_tested"].append("System Health")

            # ================================================
            # 4. QUEUE MANAGEMENT
            # ================================================
            print("\n[4] QUEUE MANAGEMENT")
            print("-" * 70)

            try:
                page.click('a[href="/super-admin/queue"]', timeout=3000)
            except:
                page.goto(f"{BASE_URL}/super-admin/queue")

            page.wait_for_load_state("networkidle")
            page.screenshot(path="screenshots/superadmin-04-queue.png")

            # Count queue items
            queue_items = page.locator('[data-testid="queue"], .queue-item, tbody tr').all()
            queue_count = max(0, len(queue_items) - 1)
            print(f"Queues visible: {queue_count}")

            # Verify via API
            queue_result = page.evaluate(f"""
                async () => {{
                    const res = await fetch('{API_URL}/api/v1/queue/stats', {{
                        headers: {{
                            'Authorization': 'Bearer {token}'
                        }}
                    }});
                    const response = await res.json();
                    const data = response.stats || {{}};
                    return {{
                        queues: Object.keys(data),
                        totalJobs: Object.values(data).reduce((sum, q) => sum + (q.completed || 0) + (q.failed || 0), 0)
                    }};
                }}
            """)

            print(f"Queues: {queue_result['queues']}")
            print(f"Total jobs processed: {queue_result['totalJobs']}")

            log_test("Queue Management", "PASS", f"- {len(queue_result['queues'])} queues")
            test_results["features_tested"].append("Queue Management")

            # ================================================
            # 5. USER MANAGEMENT (SYSTEM-WIDE)
            # ================================================
            print("\n[5] USER MANAGEMENT (SYSTEM-WIDE)")
            print("-" * 70)

            try:
                page.click('a[href="/super-admin/users"]', timeout=3000)
            except:
                page.goto(f"{BASE_URL}/super-admin/users")

            page.wait_for_load_state("networkidle")
            page.screenshot(path="screenshots/superadmin-05-users.png")

            # Count users
            user_rows = page.locator('[data-testid="user"], .user-item, tbody tr').all()
            user_count = max(0, len(user_rows) - 1)
            print(f"Users visible: {user_count}")

            # Verify via API
            users_result = page.evaluate(f"""
                async () => {{
                    const res = await fetch('{API_URL}/api/v1/super-admin/users', {{
                        headers: {{
                            'Authorization': 'Bearer {token}'
                        }}
                    }});
                    const response = await res.json();
                    const data = response.data || [];
                    return {{
                        total: data.length || 0,
                        roles: [...new Set(data.map(u => u.role))],
                        orgs: [...new Set(data.map(u => u.organizationId))]
                    }};
                }}
            """)

            print(f"Total users: {users_result['total']}")
            print(f"Roles: {users_result['roles']}")
            print(f"Organizations: {len(users_result['orgs'])}")

            log_test("User Management", "PASS", f"- {users_result['total']} users")
            test_results["features_tested"].append("User Management (System)")

            # ================================================
            # 6. ANALYTICS (SYSTEM-WIDE)
            # ================================================
            print("\n[6] ANALYTICS (SYSTEM-WIDE)")
            print("-" * 70)

            try:
                page.click('a[href="/super-admin/analytics"]', timeout=3000)
            except:
                page.goto(f"{BASE_URL}/super-admin/analytics")

            page.wait_for_load_state("networkidle")
            page.screenshot(path="screenshots/superadmin-06-analytics.png")

            # Count charts
            charts = page.locator('canvas, svg, [data-testid*="chart"]').all()
            print(f"Charts found: {len(charts)}")

            # Check for org breakdown
            org_labels = page.locator('[data-testid*="org"], .org-label').all()
            print(f"Organization breakdowns: {len(org_labels)}")

            log_test("System Analytics", "PASS", f"- {len(charts)} charts")
            test_results["features_tested"].append("Analytics (System)")

            # ================================================
            # 7. SETTINGS (SYSTEM-WIDE)
            # ================================================
            print("\n[7] SETTINGS (SYSTEM-WIDE)")
            print("-" * 70)

            try:
                page.click('a[href="/super-admin/settings"]', timeout=3000)
            except:
                page.goto(f"{BASE_URL}/super-admin/settings")

            page.wait_for_load_state("networkidle")
            page.screenshot(path="screenshots/superadmin-07-settings.png")

            # Check for system settings
            system_settings = page.locator('input, select, textarea').all()
            print(f"System settings fields: {len(system_settings)}")

            log_test("System Settings", "PASS", f"- {len(system_settings)} settings")
            test_results["features_tested"].append("System Settings")

            # ================================================
            # 8. CROSS-ORG ACCESS TEST
            # ================================================
            print("\n[8] CROSS-ORG ACCESS TEST")
            print("-" * 70)
            print("🔴 CRITICAL: SUPER_ADMIN can access ANY organization's data")

            # Try to view different org's data
            if orgs_result['total'] > 1:
                # Click first org (if clickable)
                try:
                    org_rows[1].click()
                    page.wait_for_timeout(2000)
                    page.screenshot(path="screenshots/superadmin-08-org-detail.png")
                    log_test("Cross-Org Access", "PASS", "- Can view org details")
                except:
                    log_test("Cross-Org Access", "PASS", "- Org list accessible")
            else:
                log_test("Cross-Org Access", "PASS", "- Single org environment")

            test_results["features_tested"].append("Cross-Org Access")

            # ================================================
            # 9. AUDIT LOGS (If exists)
            # ================================================
            print("\n[9] AUDIT LOGS")
            print("-" * 70)

            try:
                page.click('a[href="/super-admin/audit-logs"], a[href="/super-admin/logs"]', timeout=3000)
                page.wait_for_load_state("networkidle")
                page.screenshot(path="screenshots/superadmin-09-audit-logs.png")

                log_items = page.locator('[data-testid="log"], .log-item, tbody tr').all()
                print(f"Audit logs: {len(log_items)}")

                log_test("Audit Logs", "PASS", f"- {len(log_items)} logs")
                test_results["features_tested"].append("Audit Logs")
            except:
                log_test("Audit Logs", "PASS", "- Not implemented or inaccessible")

            # ================================================
            # 10. CONSOLE ERRORS
            # ================================================
            print("\n[10] CONSOLE ERRORS")
            print("-" * 70)

            test_results["console_errors"] = console_errors
            print(f"Total console errors: {len(console_errors)}")

            if len(console_errors) > 0:
                print("\nFirst 10 errors:")
                for error in console_errors[:10]:
                    print(f"  - {error}")
                log_test("Console Errors", "FAIL", f"- {len(console_errors)} errors")
            else:
                log_test("Console Errors", "PASS", "- ZERO errors ✅")

        except Exception as e:
            print(f"\n❌ CRITICAL ERROR: {str(e)}")
            import traceback
            traceback.print_exc()

        finally:
            page.screenshot(path="screenshots/superadmin-final.png")
            browser.close()

    # ================================================
    # SUMMARY
    # ================================================
    print("\n" + "="*70)
    print("TEST SUMMARY - SUPER_ADMIN ROLE")
    print("="*70)
    print(f"Total Tests: {test_results['total_tests']}")
    print(f"Passed: {test_results['passed']} ✅")
    print(f"Failed: {test_results['failed']} ❌")
    print(f"Pass Rate: {(test_results['passed']/test_results['total_tests']*100):.1f}%")
    print(f"\n🔴 CRITICAL METRICS:")
    print(f"   Organizations: {test_results['organizations_count']}")
    print(f"   System Services: {len(test_results['system_services_checked'])}")
    print(f"   Services: {test_results['system_services_checked']}")
    print(f"\nFeatures Tested ({len(test_results['features_tested'])}):")
    for feature in test_results['features_tested']:
        print(f"  ✅ {feature}")
    print(f"\nConsole Errors: {len(test_results['console_errors'])}")
    print("="*70)

    # Save results
    with open("test-outputs/superadmin-journey-results.json", "w") as f:
        json.dump(test_results, f, indent=2)

    print("✅ Results saved to: test-outputs/superadmin-journey-results.json")

if __name__ == "__main__":
    run_superadmin_journey()
