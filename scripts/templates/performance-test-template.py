#!/usr/bin/env python3
"""
Performance Test Template
Measure API response times and throughput

Usage:
  cp scripts/templates/performance-test-template.py scripts/tests/w1-performance.py
  python3 scripts/tests/w1-performance.py > test-outputs/w1-performance-output.txt
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(__file__)))

from test_helper import IKAITestHelper, TEST_USERS
import time
import statistics

def measure_response_time(helper, method, endpoint, data=None, runs=10):
    """Measure average response time for an endpoint"""

    times = []

    print(f"\n📊 Testing {method} {endpoint}")
    print(f"   Running {runs} times...")

    for i in range(runs):
        start = time.time()

        try:
            if method == "GET":
                helper.get(endpoint)
            elif method == "POST":
                helper.post(endpoint, data or {})
            elif method == "PUT":
                helper.put(endpoint, data or {})
            elif method == "DELETE":
                helper.delete(endpoint)

            end = time.time()
            response_time = (end - start) * 1000  # Convert to ms
            times.append(response_time)

            print(f"   Run {i+1:2d}: {response_time:6.0f}ms")

        except Exception as e:
            print(f"   Run {i+1:2d}: ERROR - {e}")

    if len(times) == 0:
        return None

    # Calculate statistics
    avg = statistics.mean(times)
    median = statistics.median(times)
    min_time = min(times)
    max_time = max(times)
    std_dev = statistics.stdev(times) if len(times) > 1 else 0

    print(f"\n   Statistics:")
    print(f"   - Average:   {avg:6.0f}ms")
    print(f"   - Median:    {median:6.0f}ms")
    print(f"   - Min:       {min_time:6.0f}ms")
    print(f"   - Max:       {max_time:6.0f}ms")
    print(f"   - Std Dev:   {std_dev:6.0f}ms")

    return {
        "avg": avg,
        "median": median,
        "min": min_time,
        "max": max_time,
        "std_dev": std_dev
    }

def main():
    helper = IKAITestHelper()

    print("=" * 60)
    print("PERFORMANCE TEST: API Response Time Measurement")
    print("=" * 60)

    # Login
    print("\n📋 Login")
    helper.login(TEST_USERS["org1_admin"]["email"], TEST_USERS["org1_admin"]["password"])
    print("✅ Logged in")

    # Define endpoints to test
    endpoints = [
        ("GET", "/api/v1/job-postings"),
        ("GET", "/api/v1/candidates"),
        ("GET", "/api/v1/analyses"),
        ("GET", "/api/v1/offers"),
        ("GET", "/api/v1/interviews"),
        ("GET", "/api/v1/notifications"),
        ("GET", "/api/v1/team")
    ]

    # Test each endpoint
    all_results = {}

    for method, endpoint in endpoints:
        stats = measure_response_time(helper, method, endpoint, runs=10)

        if stats:
            all_results[endpoint] = stats

    # Overall summary
    print("\n" + "=" * 60)
    print("OVERALL SUMMARY")
    print("=" * 60)

    print(f"\n{'Endpoint':<35} {'Avg (ms)':<10} {'P50 (ms)':<10} {'P99 (ms)':<10}")
    print("-" * 75)

    for endpoint, stats in all_results.items():
        print(f"{endpoint:<35} {stats['avg']:>8.0f}  {stats['median']:>8.0f}  {stats['max']:>8.0f}")

    # Performance assessment
    print("\n" + "=" * 60)
    print("PERFORMANCE ASSESSMENT")
    print("=" * 60)

    fast = [ep for ep, stats in all_results.items() if stats['avg'] < 100]
    good = [ep for ep, stats in all_results.items() if 100 <= stats['avg'] < 500]
    slow = [ep for ep, stats in all_results.items() if stats['avg'] >= 500]

    print(f"\n✅ Fast (<100ms): {len(fast)} endpoints")
    for ep in fast:
        print(f"   - {ep}: {all_results[ep]['avg']:.0f}ms")

    print(f"\n🟡 Good (100-500ms): {len(good)} endpoints")
    for ep in good:
        print(f"   - {ep}: {all_results[ep]['avg']:.0f}ms")

    if slow:
        print(f"\n⚠️ Slow (>500ms): {len(slow)} endpoints")
        for ep in slow:
            print(f"   - {ep}: {all_results[ep]['avg']:.0f}ms")
    else:
        print(f"\n✅ No slow endpoints!")

    print("\n" + "=" * 60)
    print("PERFORMANCE TEST COMPLETE")
    print("=" * 60)

if __name__ == "__main__":
    main()
