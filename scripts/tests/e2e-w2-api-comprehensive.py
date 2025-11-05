#!/usr/bin/env python3
"""
E2E API Test - W2: HR_SPECIALIST Role
Comprehensive API testing for HR_SPECIALIST role
Test Account: test-hr_specialist@test-org-2.com / TestPass123!
"""

import sys
import os
import importlib.util

# Load test_helper module manually
spec = importlib.util.spec_from_file_location("test_helper", "/home/asan/Desktop/ikai/scripts/test-helper.py")
test_helper_module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(test_helper_module)
IKAITestHelper = test_helper_module.IKAITestHelper

import json
import time

# Test Configuration
HR_USER = {
    "email": "test-hr_specialist@test-org-2.com",
    "password": "TestPass123!",
    "role": "HR_SPECIALIST",
    "org": "test-org-2",
    "plan": "PRO"
}

# Test results storage
results = {
    "timestamp": time.strftime("%Y-%m-%d %H:%M:%S"),
    "role": "HR_SPECIALIST",
    "organization": "test-org-2",
    "plan": "PRO",
    "categories": {},
    "bugs_found": [],
    "recommendations": [],
    "summary": {}
}

def log_test(category, test_name, status, details="", response_time=None):
    """Log a test result"""
    if category not in results["categories"]:
        results["categories"][category] = {"tests": [], "passed": 0, "failed": 0}

    test_result = {
        "test": test_name,
        "status": status,
        "details": details,
        "timestamp": time.strftime("%H:%M:%S")
    }

    if response_time:
        test_result["response_time_ms"] = response_time

    results["categories"][category]["tests"].append(test_result)

    if status == "PASS":
        results["categories"][category]["passed"] += 1
    elif status == "FAIL":
        results["categories"][category]["failed"] += 1

    symbol = "✅" if status == "PASS" else "❌" if status == "FAIL" else "⚠️"
    print(f"{symbol} [{category}] {test_name}: {status}")
    if details:
        print(f"   {details}")
    if response_time:
        print(f"   Response time: {response_time}ms")

def test_authentication(helper):
    """Test 1: Authentication & Session"""
    print("\n" + "="*60)
    print("TEST 1: AUTHENTICATION & SESSION")
    print("="*60)

    # Login
    start = time.time()
    success = helper.login(HR_USER["email"], HR_USER["password"])
    elapsed = int((time.time() - start) * 1000)

    if success:
        log_test("Authentication", "Login successful", "PASS",
                f"Email: {HR_USER['email']}", elapsed)
    else:
        log_test("Authentication", "Login successful", "FAIL",
                "Login failed - check credentials")
        return False

    # Check session
    if helper.token:
        log_test("Authentication", "Session token obtained", "PASS",
                f"Token: {helper.token[:20]}...")
    else:
        log_test("Authentication", "Session token obtained", "FAIL",
                "No token received")
        return False

    return True

def test_rbac_access(helper):
    """Test 2: RBAC - Allowed Endpoints"""
    print("\n" + "="*60)
    print("TEST 2: RBAC - ALLOWED ENDPOINTS")
    print("="*60)

    endpoints = [
        ("/api/v1/job-postings", "GET", "Job postings list"),
        ("/api/v1/candidates", "GET", "Candidates list"),
        ("/api/v1/analyses", "GET", "Analyses list"),
        ("/api/v1/users/me", "GET", "User profile"),
        ("/api/v1/organization", "GET", "Organization info"),
    ]

    for endpoint, method, description in endpoints:
        start = time.time()
        response = helper.get(endpoint) if method == "GET" else None
        elapsed = int((time.time() - start) * 1000)

        if response and response.status_code == 200:
            log_test("RBAC Access", f"Access {endpoint}", "PASS",
                    f"{description}: {response.status_code}", elapsed)
        elif response and response.status_code == 403:
            log_test("RBAC Access", f"Access {endpoint}", "FAIL",
                    f"Forbidden (should be allowed for HR): {response.status_code}")
            results["bugs_found"].append({
                "category": "RBAC",
                "severity": "HIGH",
                "endpoint": endpoint,
                "description": f"HR_SPECIALIST should access {endpoint} but got 403"
            })
        else:
            status_code = response.status_code if response else "No response"
            log_test("RBAC Access", f"Access {endpoint}", "WARN",
                    f"Unexpected response: {status_code}")

def test_rbac_denial(helper):
    """Test 3: RBAC - Denied Endpoints"""
    print("\n" + "="*60)
    print("TEST 3: RBAC - DENIED ENDPOINTS (ADMIN ONLY)")
    print("="*60)

    admin_endpoints = [
        ("/api/v1/organization", "PATCH", "Update organization"),
        ("/api/v1/billing", "GET", "Billing info"),
        ("/api/v1/billing/subscription", "POST", "Change subscription"),
        ("/api/v1/users/123/role", "PATCH", "Change user role"),
    ]

    for endpoint, method, description in admin_endpoints:
        start = time.time()

        if method == "GET":
            response = helper.get(endpoint)
        elif method == "PATCH":
            response = helper.patch(endpoint, {"test": "data"})
        elif method == "POST":
            response = helper.post(endpoint, {"test": "data"})
        else:
            continue

        elapsed = int((time.time() - start) * 1000)

        if response and response.status_code == 403:
            log_test("RBAC Denial", f"Block {endpoint}", "PASS",
                    f"{description}: Correctly denied (403)", elapsed)
        elif response and response.status_code == 200:
            log_test("RBAC Denial", f"Block {endpoint}", "FAIL",
                    f"SECURITY BUG: HR accessed admin endpoint!")
            results["bugs_found"].append({
                "category": "RBAC",
                "severity": "CRITICAL",
                "endpoint": endpoint,
                "description": f"HR_SPECIALIST should NOT access {endpoint} but got 200"
            })
        else:
            status_code = response.status_code if response else "No response"
            log_test("RBAC Denial", f"Block {endpoint}", "WARN",
                    f"Unexpected response: {status_code}")

def test_job_postings_crud(helper):
    """Test 4: Job Postings CRUD"""
    print("\n" + "="*60)
    print("TEST 4: JOB POSTINGS CRUD")
    print("="*60)

    created_job_id = None

    # List job postings
    response = helper.get("/api/v1/job-postings")
    if response and response.status_code == 200:
        jobs = response.json()
        count = len(jobs) if isinstance(jobs, list) else jobs.get("total", 0)
        log_test("Job Postings", "List job postings", "PASS",
                f"Found {count} job postings")
    else:
        log_test("Job Postings", "List job postings", "FAIL",
                f"Status: {response.status_code if response else 'No response'}")

    # Create job posting
    new_job = {
        "title": "E2E Test - Senior Backend Developer",
        "description": "Test job posting for E2E testing",
        "department": "Engineering",
        "location": "Istanbul, Turkey",
        "status": "ACTIVE"
    }

    response = helper.post("/api/v1/job-postings", new_job)
    if response and response.status_code in [200, 201]:
        created_job = response.json()
        created_job_id = created_job.get("id")
        log_test("Job Postings", "Create job posting", "PASS",
                f"Created job ID: {created_job_id}")
    else:
        log_test("Job Postings", "Create job posting", "FAIL",
                f"Status: {response.status_code if response else 'No response'}")
        return

    # Get specific job
    if created_job_id:
        response = helper.get(f"/api/v1/job-postings/{created_job_id}")
        if response and response.status_code == 200:
            job = response.json()
            log_test("Job Postings", "Get job by ID", "PASS",
                    f"Title: {job.get('title')}")
        else:
            log_test("Job Postings", "Get job by ID", "FAIL")

    # Update job
    if created_job_id:
        updated_job = {"title": "E2E Test - Senior Backend Engineer (Updated)"}
        response = helper.patch(f"/api/v1/job-postings/{created_job_id}", updated_job)
        if response and response.status_code == 200:
            log_test("Job Postings", "Update job posting", "PASS")
        else:
            log_test("Job Postings", "Update job posting", "FAIL")

    # Delete job
    if created_job_id:
        response = helper.delete(f"/api/v1/job-postings/{created_job_id}")
        if response and response.status_code in [200, 204]:
            log_test("Job Postings", "Delete job posting", "PASS",
                    f"Deleted job ID: {created_job_id}")
        else:
            log_test("Job Postings", "Delete job posting", "FAIL")

def test_candidates(helper):
    """Test 5: Candidates Management"""
    print("\n" + "="*60)
    print("TEST 5: CANDIDATES MANAGEMENT")
    print("="*60)

    # List candidates
    response = helper.get("/api/v1/candidates")
    if response and response.status_code == 200:
        candidates = response.json()
        count = len(candidates) if isinstance(candidates, list) else candidates.get("total", 0)
        log_test("Candidates", "List candidates", "PASS",
                f"Found {count} candidates")

        # Check org isolation
        if isinstance(candidates, list) and len(candidates) > 0:
            orgs = set(c.get("organizationId") for c in candidates if "organizationId" in c)
            if len(orgs) == 1:
                log_test("Candidates", "Org isolation check", "PASS",
                        "All candidates belong to same org")
            else:
                log_test("Candidates", "Org isolation check", "FAIL",
                        f"Found candidates from {len(orgs)} different orgs!")
                results["bugs_found"].append({
                    "category": "Data Isolation",
                    "severity": "CRITICAL",
                    "description": "HR can see candidates from other organizations"
                })
    else:
        log_test("Candidates", "List candidates", "FAIL")

def test_analyses(helper):
    """Test 6: Analyses"""
    print("\n" + "="*60)
    print("TEST 6: ANALYSES")
    print("="*60)

    # List analyses
    response = helper.get("/api/v1/analyses")
    if response and response.status_code == 200:
        analyses = response.json()
        count = len(analyses) if isinstance(analyses, list) else analyses.get("total", 0)
        log_test("Analyses", "List analyses", "PASS",
                f"Found {count} analyses")
    else:
        log_test("Analyses", "List analyses", "FAIL")

def test_usage_limits(helper):
    """Test 7: Usage Limits (PRO Plan)"""
    print("\n" + "="*60)
    print("TEST 7: USAGE LIMITS (PRO PLAN)")
    print("="*60)

    # Get usage stats
    response = helper.get("/api/v1/organization/usage")
    if response and response.status_code == 200:
        usage = response.json()

        # Expected PRO limits
        expected_limits = {
            "analyses": 50,
            "cvs": 200,
            "users": 10
        }

        log_test("Usage Limits", "Get usage stats", "PASS",
                f"Analyses: {usage.get('analysesUsed', 0)}/{expected_limits['analyses']}")

        # Check if limits are correctly set
        limits = usage.get("limits", {})
        for key, expected in expected_limits.items():
            actual = limits.get(key)
            if actual == expected:
                log_test("Usage Limits", f"Check {key} limit", "PASS",
                        f"Limit: {actual} (expected: {expected})")
            else:
                log_test("Usage Limits", f"Check {key} limit", "FAIL",
                        f"Limit: {actual} (expected: {expected})")
    else:
        log_test("Usage Limits", "Get usage stats", "FAIL")

def test_performance(helper):
    """Test 8: Performance"""
    print("\n" + "="*60)
    print("TEST 8: PERFORMANCE")
    print("="*60)

    endpoints = [
        "/api/v1/job-postings",
        "/api/v1/candidates",
        "/api/v1/analyses",
        "/api/v1/users/me",
    ]

    for endpoint in endpoints:
        times = []
        for i in range(3):
            start = time.time()
            response = helper.get(endpoint)
            elapsed = int((time.time() - start) * 1000)
            if response and response.status_code == 200:
                times.append(elapsed)

        if times:
            avg_time = sum(times) / len(times)
            status = "PASS" if avg_time < 2000 else "WARN"
            log_test("Performance", f"{endpoint} avg response", status,
                    f"Average: {avg_time:.0f}ms (3 requests)")

def generate_summary():
    """Generate test summary"""
    print("\n" + "="*60)
    print("TEST SUMMARY")
    print("="*60)

    total_passed = sum(cat["passed"] for cat in results["categories"].values())
    total_failed = sum(cat["failed"] for cat in results["categories"].values())
    total_tests = total_passed + total_failed

    results["summary"] = {
        "total_tests": total_tests,
        "passed": total_passed,
        "failed": total_failed,
        "pass_rate": f"{(total_passed / total_tests * 100):.1f}%" if total_tests > 0 else "0%",
        "bugs_found": len(results["bugs_found"])
    }

    print(f"Total Tests: {total_tests}")
    print(f"Passed: {total_passed} ✅")
    print(f"Failed: {total_failed} ❌")
    print(f"Pass Rate: {results['summary']['pass_rate']}")
    print(f"Bugs Found: {len(results['bugs_found'])}")

    if results["bugs_found"]:
        print("\n🐛 BUGS FOUND:")
        for bug in results["bugs_found"]:
            print(f"  - [{bug['severity']}] {bug['category']}: {bug['description']}")

    # Save results
    output_file = "/home/asan/Desktop/ikai/test-outputs/w2-hr-specialist-api-results.json"
    with open(output_file, "w") as f:
        json.dump(results, f, indent=2)
    print(f"\n✅ Results saved to: {output_file}")

def main():
    """Run all tests"""
    print("="*60)
    print("E2E API TEST: HR_SPECIALIST ROLE")
    print("="*60)
    print(f"User: {HR_USER['email']}")
    print(f"Org: {HR_USER['org']}")
    print(f"Plan: {HR_USER['plan']}")
    print("="*60)

    helper = IKAITestHelper()

    try:
        # Run tests in order
        if not test_authentication(helper):
            print("\n❌ Authentication failed, stopping tests")
            return

        test_rbac_access(helper)
        test_rbac_denial(helper)
        test_job_postings_crud(helper)
        test_candidates(helper)
        test_analyses(helper)
        test_usage_limits(helper)
        test_performance(helper)

        generate_summary()

    except Exception as e:
        print(f"\n❌ Test execution error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()
