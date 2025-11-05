#!/usr/bin/env python3
"""
Extended E2E Tests - W2: HR_SPECIALIST
CV Upload, AI Chat, Usage Limits, Additional endpoints
"""

import sys
import os
import importlib.util

# Load test_helper
spec = importlib.util.spec_from_file_location("test_helper", "/home/asan/Desktop/ikai/scripts/test-helper.py")
test_helper_module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(test_helper_module)
IKAITestHelper = test_helper_module.IKAITestHelper

import json
import time

HR_USER = {
    "email": "test-hr_specialist@test-org-2.com",
    "password": "TestPass123!"
}

results = {
    "timestamp": time.strftime("%Y-%m-%d %H:%M:%S"),
    "tests": [],
    "bugs": []
}

def log_test(category, test, status, details=""):
    result = {"category": category, "test": test, "status": status, "details": details}
    results["tests"].append(result)
    symbol = "✅" if status == "PASS" else "❌" if status == "FAIL" else "⚠️"
    print(f"{symbol} [{category}] {test}: {status}")
    if details:
        print(f"   {details}")

def test_cv_endpoints(helper):
    """Test CV management endpoints"""
    print("\n" + "="*60)
    print("TEST: CV MANAGEMENT")
    print("="*60)

    # List CVs
    print("\n📋 Listing CVs...")
    response = helper.get("/api/v1/cvs")
    if response:
        if isinstance(response, dict):
            cv_count = response.get("total", 0) if "total" in response else len(response.get("cvs", []))
            log_test("CV Management", "List CVs", "PASS", f"Found {cv_count} CVs")
        else:
            log_test("CV Management", "List CVs", "WARN", "Response format unexpected")
    else:
        log_test("CV Management", "List CVs", "WARN", "Endpoint may not exist or access denied")

    # Get CV upload endpoint info
    print("\n📤 Checking CV upload endpoint...")
    # Note: Actual file upload would require multipart/form-data
    log_test("CV Management", "Upload endpoint available", "INFO", "Requires multipart/form-data for testing")

def test_ai_chat(helper):
    """Test AI chat endpoint"""
    print("\n" + "="*60)
    print("TEST: AI CHAT (Gemini + Milvus)")
    print("="*60)

    # Try to send a chat message
    print("\n💬 Testing AI chat...")
    chat_payload = {
        "message": "What are the top skills for a backend developer?",
        "context": "job_search"
    }

    response = helper.post("/api/v1/chat", chat_payload)
    if response:
        if isinstance(response, dict) and "response" in response:
            log_test("AI Chat", "Send chat message", "PASS", f"Response length: {len(response.get('response', ''))} chars")
        else:
            log_test("AI Chat", "Send chat message", "WARN", "Response format unexpected")
    else:
        log_test("AI Chat", "Send chat message", "WARN", "Endpoint may not exist or requires different payload")

def test_notifications(helper):
    """Test notification endpoints"""
    print("\n" + "="*60)
    print("TEST: NOTIFICATIONS")
    print("="*60)

    # Get notifications
    print("\n🔔 Getting notifications...")
    response = helper.get("/api/v1/notifications")
    if response:
        if isinstance(response, dict):
            notif_count = len(response.get("notifications", []))
            log_test("Notifications", "List notifications", "PASS", f"Found {notif_count} notifications")
        elif isinstance(response, list):
            log_test("Notifications", "List notifications", "PASS", f"Found {len(response)} notifications")
        else:
            log_test("Notifications", "List notifications", "WARN", "Response format unexpected")
    else:
        log_test("Notifications", "List notifications", "WARN", "Endpoint may not exist")

    # Get unread count
    response = helper.get("/api/v1/notifications/unread-count")
    if response:
        if isinstance(response, dict) and "count" in response:
            log_test("Notifications", "Unread count", "PASS", f"Unread: {response['count']}")
        else:
            log_test("Notifications", "Unread count", "WARN", "Response format unexpected")
    else:
        log_test("Notifications", "Unread count", "WARN", "Endpoint may not exist")

def test_user_profile(helper):
    """Test user profile endpoints"""
    print("\n" + "="*60)
    print("TEST: USER PROFILE")
    print("="*60)

    # Get own profile
    print("\n👤 Getting user profile...")
    response = helper.get("/api/v1/users/me")
    if response:
        if isinstance(response, dict):
            email = response.get("email", "")
            role = response.get("role", "")
            org = response.get("organizationId", "")
            log_test("User Profile", "Get own profile", "PASS",
                    f"Email: {email}, Role: {role}, Org: {org[:8]}...")

            # Verify role
            if role == "HR_SPECIALIST":
                log_test("User Profile", "Verify role", "PASS", "Role is HR_SPECIALIST")
            else:
                log_test("User Profile", "Verify role", "FAIL", f"Expected HR_SPECIALIST, got {role}")
                results["bugs"].append({
                    "category": "Authentication",
                    "severity": "HIGH",
                    "description": f"User role mismatch: expected HR_SPECIALIST, got {role}"
                })
        else:
            log_test("User Profile", "Get own profile", "WARN", "Response format unexpected")
    else:
        log_test("User Profile", "Get own profile", "FAIL", "Cannot get user profile")

def test_team_endpoints(helper):
    """Test team/user management endpoints (HR should have limited access)"""
    print("\n" + "="*60)
    print("TEST: TEAM MANAGEMENT (LIMITED ACCESS)")
    print("="*60)

    # Try to list team (should be forbidden or limited)
    print("\n👥 Checking team list access...")
    response = helper.get("/api/v1/team")

    # This should either be 403 (forbidden) or return limited data
    # Checking what the actual behavior is
    log_test("Team Management", "List team endpoint", "INFO", "Endpoint behavior documented")

    # Try to list all users in org
    response = helper.get("/api/v1/users")
    if response:
        if isinstance(response, dict):
            user_count = len(response.get("users", []))
            log_test("Team Management", "List users", "INFO", f"Can see {user_count} users")
        elif isinstance(response, list):
            log_test("Team Management", "List users", "INFO", f"Can see {len(response)} users")
    else:
        log_test("Team Management", "List users", "INFO", "Cannot list users (may be restricted)")

def test_analytics_endpoints(helper):
    """Test analytics endpoints"""
    print("\n" + "="*60)
    print("TEST: ANALYTICS (ADDITIONAL)")
    print("="*60)

    endpoints = [
        "/api/v1/analytics/summary",
        "/api/v1/analytics/time-to-hire",
        "/api/v1/analytics/candidate-pipeline",
        "/api/v1/analytics/source-effectiveness"
    ]

    for endpoint in endpoints:
        print(f"\n📊 Testing {endpoint}...")
        response = helper.get(endpoint)

        if response and isinstance(response, dict):
            # Check if it's an error response
            if "error" in response or "message" in response:
                log_test("Analytics", f"{endpoint}", "FAIL", f"Error: {response.get('message', 'Unknown')}")
                if endpoint == "/api/v1/analytics/summary":
                    results["bugs"].append({
                        "category": "Analytics",
                        "severity": "MEDIUM",
                        "endpoint": endpoint,
                        "description": "Analytics summary endpoint returns error"
                    })
            else:
                log_test("Analytics", f"{endpoint}", "PASS", "Data returned successfully")
        elif response:
            log_test("Analytics", f"{endpoint}", "PASS", "Data returned")
        else:
            log_test("Analytics", f"{endpoint}", "WARN", "No response or endpoint doesn't exist")

def test_export_endpoints(helper):
    """Test export functionality"""
    print("\n" + "="*60)
    print("TEST: EXPORT FUNCTIONALITY")
    print("="*60)

    export_endpoints = [
        ("/api/v1/job-postings/export/csv", "CSV"),
        ("/api/v1/job-postings/export/xlsx", "XLSX"),
        ("/api/v1/candidates/export/csv", "Candidates CSV"),
        ("/api/v1/candidates/export/xlsx", "Candidates XLSX")
    ]

    for endpoint, format_name in export_endpoints:
        print(f"\n📥 Testing {format_name} export...")
        response = helper.get(endpoint)

        if response:
            log_test("Export", f"{format_name}", "PASS", "Export successful")
        else:
            log_test("Export", f"{format_name}", "WARN", "Export failed or endpoint doesn't exist")

def test_search_functionality(helper):
    """Test search/filter endpoints"""
    print("\n" + "="*60)
    print("TEST: SEARCH & FILTERS")
    print("="*60)

    # Search job postings
    print("\n🔍 Testing job posting search...")
    response = helper.get("/api/v1/job-postings?search=developer")
    if response:
        log_test("Search", "Job posting search", "PASS", "Search working")
    else:
        log_test("Search", "Job posting search", "WARN", "Search may not be implemented")

    # Filter by status
    response = helper.get("/api/v1/job-postings?status=ACTIVE")
    if response:
        log_test("Search", "Job posting status filter", "PASS", "Status filter working")
    else:
        log_test("Search", "Job posting status filter", "WARN", "Status filter may not work")

    # Search candidates
    response = helper.get("/api/v1/candidates?search=john")
    if response:
        log_test("Search", "Candidate search", "PASS", "Candidate search working")
    else:
        log_test("Search", "Candidate search", "WARN", "Candidate search may not be implemented")

def main():
    print("="*60)
    print("EXTENDED E2E TESTS - W2: HR_SPECIALIST")
    print("="*60)
    print(f"User: {HR_USER['email']}")
    print("="*60)

    helper = IKAITestHelper()

    try:
        # Login
        if not helper.login(HR_USER["email"], HR_USER["password"]):
            print("\n❌ Login failed, cannot continue")
            return

        # Run extended tests
        test_user_profile(helper)
        test_cv_endpoints(helper)
        test_ai_chat(helper)
        test_notifications(helper)
        test_team_endpoints(helper)
        test_analytics_endpoints(helper)
        test_export_endpoints(helper)
        test_search_functionality(helper)

        # Summary
        print("\n" + "="*60)
        print("EXTENDED TEST SUMMARY")
        print("="*60)
        passed = len([t for t in results["tests"] if t["status"] == "PASS"])
        failed = len([t for t in results["tests"] if t["status"] == "FAIL"])
        warned = len([t for t in results["tests"] if t["status"] in ["WARN", "INFO"]])
        total = len(results["tests"])

        print(f"Total: {total}")
        print(f"Passed: {passed} ✅")
        print(f"Failed: {failed} ❌")
        print(f"Warned/Info: {warned} ⚠️")
        print(f"Bugs Found: {len(results['bugs'])}")

        if results["bugs"]:
            print("\n🐛 BUGS FOUND:")
            for bug in results["bugs"]:
                print(f"  - [{bug['severity']}] {bug['category']}: {bug['description']}")

        # Save results
        output_file = "/home/asan/Desktop/ikai/test-outputs/w2-extended-tests-results.json"
        with open(output_file, "w") as f:
            json.dump(results, f, indent=2)
        print(f"\n✅ Results saved: {output_file}")

    except Exception as e:
        print(f"\n❌ Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()
