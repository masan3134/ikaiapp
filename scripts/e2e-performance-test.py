#!/usr/bin/env python3
"""
E2E Performance Test - W6 Cross-Role Testing
Measures API response times for all dashboard endpoints

Benchmarks:
- Dashboard API response times (all 5 roles)
- Key API endpoints response times
- Performance matrix generation
"""

import sys
import os
import importlib.util
import time

# Load test-helper.py module
script_dir = os.path.dirname(os.path.abspath(__file__))
helper_path = os.path.join(script_dir, 'test-helper.py')

spec = importlib.util.spec_from_file_location("test_helper", helper_path)
test_helper = importlib.util.module_from_spec(spec)
spec.loader.exec_module(test_helper)

IKAITestHelper = test_helper.IKAITestHelper

def measure_endpoint(helper, endpoint, iterations=3):
    """Measure average response time for an endpoint"""
    times = []

    for i in range(iterations):
        start = time.time()
        try:
            response = helper.get(endpoint)
            elapsed = (time.time() - start) * 1000  # Convert to ms

            if response:
                times.append(elapsed)
            else:
                return None  # Failed request
        except Exception as e:
            print(f"   ❌ Error: {str(e)[:50]}")
            return None

        # Small delay between requests
        if i < iterations - 1:
            time.sleep(0.5)

    if len(times) > 0:
        return {
            'avg': sum(times) / len(times),
            'min': min(times),
            'max': max(times),
            'count': len(times)
        }
    else:
        return None

def test_performance():
    """Test performance across all roles and endpoints"""

    print("=" * 70)
    print("E2E PERFORMANCE TEST - API RESPONSE TIMES")
    print("=" * 70)
    print()

    roles = [
        {
            'name': 'USER',
            'email': 'test-user@test-org-1.com',
            'password': 'TestPass123!',
            'endpoints': [
                '/api/v1/dashboard/user',
                '/api/v1/notifications'
            ]
        },
        {
            'name': 'HR_SPECIALIST',
            'email': 'test-hr_specialist@test-org-2.com',
            'password': 'TestPass123!',
            'endpoints': [
                '/api/v1/dashboard/hr-specialist',
                '/api/v1/job-postings',
                '/api/v1/candidates',
                '/api/v1/analyses'
            ]
        },
        {
            'name': 'MANAGER',
            'email': 'test-manager@test-org-1.com',
            'password': 'TestPass123!',
            'endpoints': [
                '/api/v1/dashboard/manager',
                '/api/v1/candidates',
                '/api/v1/job-offers'
            ]
        },
        {
            'name': 'ADMIN',
            'email': 'test-admin@test-org-2.com',
            'password': 'TestPass123!',
            'endpoints': [
                '/api/v1/dashboard/admin',
                '/api/v1/users',
                '/api/v1/job-postings'
            ]
        },
        {
            'name': 'SUPER_ADMIN',
            'email': 'info@gaiai.ai',
            'password': '23235656',
            'endpoints': [
                '/api/v1/dashboard/super-admin',
                '/api/v1/organizations'
            ]
        }
    ]

    all_results = {}

    for role_info in roles:
        print(f"📊 Testing {role_info['name']}...")
        print("-" * 70)

        helper = IKAITestHelper()

        # Login (don't count login time)
        if not helper.login(role_info['email'], role_info['password']):
            print(f"   ❌ Login failed!")
            continue

        role_results = {}

        for endpoint in role_info['endpoints']:
            print(f"   Testing {endpoint}...", end=" ")
            sys.stdout.flush()

            metrics = measure_endpoint(helper, endpoint, iterations=3)

            if metrics:
                print(f"✅ {metrics['avg']:.0f}ms (min: {metrics['min']:.0f}ms, max: {metrics['max']:.0f}ms)")
                role_results[endpoint] = metrics
            else:
                print(f"❌ Failed")
                role_results[endpoint] = None

        all_results[role_info['name']] = role_results
        print()

    # Generate Performance Matrix
    print("=" * 70)
    print("PERFORMANCE MATRIX")
    print("=" * 70)
    print()

    # Dashboard endpoints
    print("🏠 Dashboard APIs:")
    print("-" * 70)
    dashboard_endpoints = [
        ('/api/v1/dashboard/user', 'USER'),
        ('/api/v1/dashboard/hr-specialist', 'HR_SPECIALIST'),
        ('/api/v1/dashboard/manager', 'MANAGER'),
        ('/api/v1/dashboard/admin', 'ADMIN'),
        ('/api/v1/dashboard/super-admin', 'SUPER_ADMIN')
    ]

    for endpoint, role in dashboard_endpoints:
        if role in all_results and endpoint in all_results[role]:
            metrics = all_results[role][endpoint]
            if metrics:
                print(f"   {role:15s} | {metrics['avg']:6.0f}ms | min: {metrics['min']:5.0f}ms | max: {metrics['max']:5.0f}ms")
            else:
                print(f"   {role:15s} | FAILED")
        else:
            print(f"   {role:15s} | NOT TESTED")

    print()

    # Calculate averages
    print("📈 Summary:")
    print("-" * 70)

    all_dashboard_times = []
    for endpoint, role in dashboard_endpoints:
        if role in all_results and endpoint in all_results[role]:
            metrics = all_results[role][endpoint]
            if metrics:
                all_dashboard_times.append(metrics['avg'])

    if all_dashboard_times:
        avg_dashboard = sum(all_dashboard_times) / len(all_dashboard_times)
        min_dashboard = min(all_dashboard_times)
        max_dashboard = max(all_dashboard_times)

        print(f"   Average Dashboard Load: {avg_dashboard:.0f}ms")
        print(f"   Fastest Dashboard: {min_dashboard:.0f}ms")
        print(f"   Slowest Dashboard: {max_dashboard:.0f}ms")

        if max_dashboard > 2000:
            print(f"   ⚠️  WARNING: Some dashboards exceed 2s threshold!")
        else:
            print(f"   ✅ All dashboards under 2s - GOOD!")

    print()

    # Other endpoints
    print("📦 Other API Endpoints:")
    print("-" * 70)

    other_times = []
    for role_name, endpoints in all_results.items():
        for endpoint, metrics in endpoints.items():
            if '/dashboard/' not in endpoint and metrics:
                other_times.append(metrics['avg'])
                print(f"   {endpoint:40s} | {metrics['avg']:6.0f}ms")

    if other_times:
        avg_other = sum(other_times) / len(other_times)
        print(f"\n   Average API Response: {avg_other:.0f}ms")

    print()
    print("=" * 70)
    print("✅ Performance test complete!")
    print("=" * 70)

    return True

if __name__ == '__main__':
    success = test_performance()
    exit(0 if success else 1)
