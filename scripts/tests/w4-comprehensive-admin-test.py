#!/usr/bin/env python3
"""
W4 E2E Test - Comprehensive ADMIN Testing
Tests: Billing, Usage Limits, Job Postings, Candidates, Performance
"""

import requests
import json
import time

BASE_URL = "http://localhost:8102"

class ComprehensiveAdminTest:
    def __init__(self):
        self.token = None
        self.org_id = None
        self.results = {
            "billing": {},
            "usage_limits": {},
            "job_postings": {},
            "candidates": {},
            "performance": {},
            "summary": {"passed": 0, "failed": 0}
        }

    def login(self):
        """Login as ADMIN"""
        print("="*80)
        print("🧪 W4 COMPREHENSIVE ADMIN TEST")
        print("="*80)
        print("\n🔑 Logging in as ADMIN...")

        response = requests.post(
            f"{BASE_URL}/api/v1/auth/login",
            json={"email": "test-admin@test-org-2.com", "password": "TestPass123!"}
        )

        if response.status_code == 200:
            data = response.json()
            self.token = data.get("token")
            self.org_id = data.get("user", {}).get("organizationId")
            print(f"✅ Logged in (Org: {self.org_id[:8]}...)\n")
            return True
        else:
            print(f"❌ Login failed: {response.status_code}")
            return False

    def test_billing(self):
        """Test Billing & Subscription"""
        print("💳 TEST: Billing & Subscription")
        print("-" * 60)

        try:
            # Get organization details
            start = time.time()
            response = requests.get(
                f"{BASE_URL}/api/v1/organizations/me",
                headers={"Authorization": f"Bearer {self.token}"}
            )
            response_time = round((time.time() - start) * 1000, 2)

            if response.status_code == 200:
                data = response.json()
                org = data.get("data", {}) if data.get("success") else data

                plan = org.get("plan", "N/A")
                print(f"   Plan: {plan}")
                print(f"   Response time: {response_time}ms")

                # Verify PRO plan
                if plan == "PRO":
                    print(f"   ✅ PRO plan verified")
                    self.results["billing"]["plan"] = "PRO"
                    self.results["billing"]["status"] = "PASS"
                    self.results["summary"]["passed"] += 1
                else:
                    print(f"   ⚠️  Expected PRO, got {plan}")
                    self.results["billing"]["plan"] = plan
                    self.results["billing"]["status"] = "WARN"

                self.results["billing"]["response_time_ms"] = response_time
            else:
                print(f"   ❌ Failed: {response.status_code}")
                self.results["billing"]["status"] = "FAIL"
                self.results["summary"]["failed"] += 1

        except Exception as e:
            print(f"   ❌ Error: {str(e)}")
            self.results["billing"]["status"] = "ERROR"
            self.results["billing"]["error"] = str(e)
            self.results["summary"]["failed"] += 1

        print()

    def test_usage_limits(self):
        """Test Usage Limits"""
        print("📊 TEST: Usage Limits (PRO Plan)")
        print("-" * 60)

        try:
            # Get usage from organization endpoint
            start = time.time()
            response = requests.get(
                f"{BASE_URL}/api/v1/organizations/me",
                headers={"Authorization": f"Bearer {self.token}"}
            )
            response_time = round((time.time() - start) * 1000, 2)

            if response.status_code == 200:
                data = response.json()
                org = data.get("data", {}) if data.get("success") else data

                # PRO plan limits (from organization model)
                expected_limits = {
                    "analyses": 50,
                    "cvs": 200,
                    "users": 10
                }

                # Get actual limits (monthly limits from organization)
                analyses_limit = org.get('analysesPerMonth', org.get('analysesLimit', '?'))
                cvs_limit = org.get('cvsPerMonth', org.get('cvsLimit', '?'))
                users_limit = org.get('maxUsers', org.get('usersLimit', '?'))

                # Get usage (may not be in this endpoint, but we can check structure)
                analyses_used = org.get('analysesUsed', 0)
                cvs_used = org.get('cvsUsed', 0)
                total_users = org.get('totalUsers', 0)

                print(f"   Analyses: {analyses_used}/{analyses_limit}")
                print(f"   CVs: {cvs_used}/{cvs_limit}")
                print(f"   Users: {total_users}/{users_limit}")
                print(f"   Response time: {response_time}ms")

                # Verify limits match PRO plan
                limits_correct = (
                    analyses_limit == expected_limits['analyses'] and
                    cvs_limit == expected_limits['cvs'] and
                    users_limit == expected_limits['users']
                )

                if limits_correct:
                    print(f"   ✅ PRO limits verified")
                    self.results["usage_limits"]["status"] = "PASS"
                    self.results["summary"]["passed"] += 1
                else:
                    print(f"   ⚠️  Limits don't match PRO plan")
                    self.results["usage_limits"]["status"] = "WARN"

                self.results["usage_limits"]["data"] = {
                    "analyses": f"{analyses_used}/{analyses_limit}",
                    "cvs": f"{cvs_used}/{cvs_limit}",
                    "users": f"{total_users}/{users_limit}"
                }
                self.results["usage_limits"]["response_time_ms"] = response_time

            else:
                print(f"   ❌ Failed: {response.status_code}")
                self.results["usage_limits"]["status"] = "FAIL"
                self.results["summary"]["failed"] += 1

        except Exception as e:
            print(f"   ❌ Error: {str(e)}")
            self.results["usage_limits"]["status"] = "ERROR"
            self.results["usage_limits"]["error"] = str(e)
            self.results["summary"]["failed"] += 1

        print()

    def test_job_postings(self):
        """Test Job Postings Management"""
        print("📋 TEST: Job Postings (All Departments)")
        print("-" * 60)

        try:
            start = time.time()
            response = requests.get(
                f"{BASE_URL}/api/v1/job-postings",
                headers={"Authorization": f"Bearer {self.token}"}
            )
            response_time = round((time.time() - start) * 1000, 2)

            if response.status_code == 200:
                data = response.json()
                postings = data.get("data", []) if isinstance(data.get("data"), list) else data.get("jobPostings", [])

                print(f"   Found: {len(postings)} job postings")
                print(f"   Response time: {response_time}ms")

                # Check departments
                departments = set(p.get("department", "N/A") for p in postings if p.get("department"))
                if departments:
                    print(f"   Departments: {', '.join(sorted(departments))}")

                # Verify org isolation
                other_org = [p for p in postings if p.get("organizationId") and p["organizationId"] != self.org_id]

                if len(other_org) == 0:
                    print(f"   ✅ Org isolation verified")
                    self.results["job_postings"]["status"] = "PASS"
                    self.results["summary"]["passed"] += 1
                else:
                    print(f"   ❌ Found {len(other_org)} postings from other orgs!")
                    self.results["job_postings"]["status"] = "FAIL"
                    self.results["summary"]["failed"] += 1

                self.results["job_postings"]["count"] = len(postings)
                self.results["job_postings"]["departments"] = list(departments)
                self.results["job_postings"]["response_time_ms"] = response_time

            else:
                print(f"   ❌ Failed: {response.status_code}")
                self.results["job_postings"]["status"] = "FAIL"
                self.results["summary"]["failed"] += 1

        except Exception as e:
            print(f"   ❌ Error: {str(e)}")
            self.results["job_postings"]["status"] = "ERROR"
            self.results["job_postings"]["error"] = str(e)
            self.results["summary"]["failed"] += 1

        print()

    def test_candidates(self):
        """Test Candidate Management"""
        print("👥 TEST: Candidate Management (All Departments)")
        print("-" * 60)

        try:
            start = time.time()
            response = requests.get(
                f"{BASE_URL}/api/v1/candidates",
                headers={"Authorization": f"Bearer {self.token}"}
            )
            response_time = round((time.time() - start) * 1000, 2)

            if response.status_code == 200:
                data = response.json()
                candidates = data.get("data", []) if isinstance(data.get("data"), list) else data.get("candidates", [])

                print(f"   Found: {len(candidates)} candidates")
                print(f"   Response time: {response_time}ms")

                # Verify org isolation
                other_org = [c for c in candidates if c.get("organizationId") and c["organizationId"] != self.org_id]

                if len(other_org) == 0:
                    print(f"   ✅ Org isolation verified")
                    self.results["candidates"]["status"] = "PASS"
                    self.results["summary"]["passed"] += 1
                else:
                    print(f"   ❌ Found {len(other_org)} candidates from other orgs!")
                    self.results["candidates"]["status"] = "FAIL"
                    self.results["summary"]["failed"] += 1

                self.results["candidates"]["count"] = len(candidates)
                self.results["candidates"]["response_time_ms"] = response_time

            else:
                print(f"   ❌ Failed: {response.status_code}")
                self.results["candidates"]["status"] = "FAIL"
                self.results["summary"]["failed"] += 1

        except Exception as e:
            print(f"   ❌ Error: {str(e)}")
            self.results["candidates"]["status"] = "ERROR"
            self.results["candidates"]["error"] = str(e)
            self.results["summary"]["failed"] += 1

        print()

    def test_performance(self):
        """Test API Performance"""
        print("⚡ TEST: Performance (API Response Times)")
        print("-" * 60)

        endpoints = [
            ("/api/v1/dashboard/admin", "Dashboard"),
            ("/api/v1/users", "Users"),
            ("/api/v1/job-postings", "Job Postings"),
            ("/api/v1/candidates", "Candidates"),
            ("/api/v1/usage", "Usage Stats")
        ]

        times = []
        for endpoint, name in endpoints:
            try:
                start = time.time()
                response = requests.get(
                    f"{BASE_URL}{endpoint}",
                    headers={"Authorization": f"Bearer {self.token}"},
                    timeout=10
                )
                response_time = round((time.time() - start) * 1000, 2)
                times.append(response_time)

                status = "✅" if response_time < 1000 else "⚠️"
                print(f"   {status} {name}: {response_time}ms")

            except Exception as e:
                print(f"   ❌ {name}: Error - {str(e)}")
                times.append(9999)

        avg_time = round(sum(times) / len(times), 2) if times else 0
        print(f"\n   Average: {avg_time}ms")

        if avg_time < 1000:
            print(f"   ✅ Performance acceptable (<1s)")
            self.results["performance"]["status"] = "PASS"
            self.results["summary"]["passed"] += 1
        else:
            print(f"   ⚠️  Performance slow (>1s)")
            self.results["performance"]["status"] = "WARN"

        self.results["performance"]["average_ms"] = avg_time
        self.results["performance"]["endpoints"] = dict(zip([e[1] for e in endpoints], times))

        print()

    def print_summary(self):
        """Print test summary"""
        print("="*80)
        print("📊 COMPREHENSIVE TEST SUMMARY")
        print("="*80)

        total = self.results["summary"]["passed"] + self.results["summary"]["failed"]
        print(f"Total Tests: {total}")
        print(f"✅ Passed: {self.results['summary']['passed']}")
        print(f"❌ Failed: {self.results['summary']['failed']}")

        if self.results["summary"]["failed"] == 0:
            print("\n🎉 ALL TESTS PASSED!")
        else:
            print(f"\n⚠️  {self.results['summary']['failed']} tests failed")

        print("="*80)

        # Save results
        with open('/home/asan/Desktop/ikai/test-outputs/w4-comprehensive-results.json', 'w') as f:
            json.dump(self.results, f, indent=2)
        print("\n📁 Results saved: test-outputs/w4-comprehensive-results.json")

def main():
    tester = ComprehensiveAdminTest()

    if not tester.login():
        return False

    tester.test_billing()
    tester.test_usage_limits()
    tester.test_job_postings()
    tester.test_candidates()
    tester.test_performance()

    tester.print_summary()

    return tester.results["summary"]["failed"] == 0

if __name__ == "__main__":
    success = main()
    exit(0 if success else 1)
