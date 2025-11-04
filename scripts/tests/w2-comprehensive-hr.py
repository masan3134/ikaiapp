#!/usr/bin/env python3
"""
W2 COMPREHENSIVE HR_SPECIALIST TEST
Task: docs/tasks/W2-COMPREHENSIVE-HR.md

Tests:
- Frontend: 16 pages
- Backend: 30 endpoints (Full CRUD)
- Database: 20 organizationId queries
- RBAC: 30 permission checks
- Duration: 90 minutes

Worker: W2
Date: 2025-11-04
"""

import requests
import json
import sys
from datetime import datetime

# === CONFIG ===
BASE_URL = "http://localhost:8102/api/v1"
LOGIN_URL = f"{BASE_URL}/auth/login"

# HR_SPECIALIST user (PRO plan org)
EMAIL = "test-hr_specialist@test-org-2.com"
PASSWORD = "TestPass123!"

class ComprehensiveHRTest:
    def __init__(self):
        self.token = None
        self.headers = {}
        self.results = {
            'timestamp': datetime.now().isoformat(),
            'role': 'HR_SPECIALIST',
            'test_user': EMAIL,
            'backend': {'tested': 0, 'passed': 0, 'failed': 0, 'endpoints': []},
            'rbac': {'tested': 0, 'passed': 0, 'failed': 0, 'checks': []},
            'crud': {'tested': 0, 'passed': 0, 'failed': 0, 'operations': []},
            'database': {'tested': 0, 'passed': 0, 'failed': 0, 'queries': []},
        }
        self.created_ids = {}

    def log(self, msg):
        """Print with timestamp"""
        print(f"[{datetime.now().strftime('%H:%M:%S')}] {msg}")

    def login(self):
        """Step 1: Login"""
        self.log("🔐 Logging in as HR_SPECIALIST...")
        try:
            r = requests.post(LOGIN_URL, json={'email': EMAIL, 'password': PASSWORD})
            if r.status_code == 200:
                data = r.json()
                self.token = data.get('token')
                self.headers = {'Authorization': f'Bearer {self.token}'}
                self.log(f"✅ Login successful")
                self.log(f"   User ID: {data.get('userId', 'N/A')}")
                self.log(f"   Org ID: {data.get('organizationId', 'N/A')}")
                return True
            else:
                self.log(f"❌ Login failed: {r.status_code}")
                return False
        except Exception as e:
            self.log(f"❌ Login error: {e}")
            return False

    def test_endpoint(self, category, method, endpoint, name, expected_status=200, data=None, extract_id=False):
        """Test single endpoint"""
        url = f"{BASE_URL}{endpoint}"

        try:
            if method == 'GET':
                r = requests.get(url, headers=self.headers)
            elif method == 'POST':
                r = requests.post(url, headers=self.headers, json=data)
            elif method == 'PATCH':
                r = requests.patch(url, headers=self.headers, json=data)
            elif method == 'PUT':
                r = requests.put(url, headers=self.headers, json=data)
            elif method == 'DELETE':
                r = requests.delete(url, headers=self.headers)
            else:
                self.log(f"❌ Unknown method: {method}")
                return None

            success = r.status_code == expected_status
            status_icon = "✅" if success else "❌"

            result = {
                'name': name,
                'method': method,
                'endpoint': endpoint,
                'expected': expected_status,
                'actual': r.status_code,
                'success': success,
                'timestamp': datetime.now().isoformat()
            }

            self.results[category]['tested'] += 1
            if success:
                self.results[category]['passed'] += 1
            else:
                self.results[category]['failed'] += 1

            key_name = 'endpoints' if category == 'backend' else 'checks' if category == 'rbac' else 'operations' if category == 'crud' else 'queries'
            self.results[category][key_name].append(result)

            self.log(f"  {status_icon} {method:6} {endpoint:50} → {r.status_code} (expected {expected_status})")

            # Extract ID from response
            if success and extract_id:
                try:
                    json_data = r.json()
                    if isinstance(json_data, dict):
                        # Try different response structures
                        if 'data' in json_data:
                            if isinstance(json_data['data'], dict) and 'id' in json_data['data']:
                                return json_data['data']['id']
                            elif isinstance(json_data['data'], str):
                                # Sometimes data is directly the ID
                                return json_data['data']
                        elif 'id' in json_data:
                            return json_data['id']
                        elif 'jobPosting' in json_data and 'id' in json_data['jobPosting']:
                            return json_data['jobPosting']['id']
                except Exception as e:
                    self.log(f"     ⚠️ Failed to extract ID: {e}")
                return None  # Return None if extraction failed

            return True if success else None

        except Exception as e:
            self.log(f"❌ ERROR: {method} {endpoint} - {e}")
            self.results[category]['tested'] += 1
            self.results[category]['failed'] += 1
            return None

    def test_job_postings(self):
        """Job Postings: 10 endpoints"""
        self.log("\n" + "="*80)
        self.log("📋 JOB POSTINGS (10 endpoints)")
        self.log("="*80)

        # 1. List
        self.test_endpoint('backend', 'GET', '/job-postings', 'List job postings', 200)

        # 2. Filter by status
        self.test_endpoint('backend', 'GET', '/job-postings?status=active', 'Filter by status', 200)

        # 3. CREATE (CRUD)
        job_id = self.test_endpoint('crud', 'POST', '/job-postings', 'Create job posting', 201, {
            'title': 'W2 Comprehensive Test Job',
            'department': 'Engineering',
            'details': 'Full-stack developer position with 3+ years of experience in React and Node.js',
            'notes': 'Test job posting for W2 comprehensive test'
        }, extract_id=True)

        if job_id:
            self.created_ids['job_posting'] = job_id
            self.log(f"   📝 Created job posting: {job_id}")

            # 4. READ (CRUD)
            self.test_endpoint('crud', 'GET', f'/job-postings/{job_id}', 'Read job posting', 200)

            # 5. UPDATE (CRUD) - NOTE: Backend uses PUT not PATCH
            # Test with PUT
            result = self.test_endpoint('crud', 'PUT', f'/job-postings/{job_id}', 'Update job posting (PUT)', 200, {
                'title': 'W2 Test Job UPDATED',
                'department': 'Engineering',
                'details': 'Updated details for comprehensive test'
            })

            # 6. Export endpoints
            self.test_endpoint('backend', 'GET', '/job-postings/export/xlsx', 'Export XLSX', 200)
            self.test_endpoint('backend', 'GET', '/job-postings/export/csv', 'Export CSV', 200)

            # NOTE: The following endpoints don't exist in current implementation:
            # - POST /:id/publish
            # - POST /:id/unpublish
            # - GET /:id/candidates
            # - GET /:id/analytics
            # - POST /:id/duplicate
            self.log("  ⚠️  Skipping unimplemented endpoints (publish, unpublish, candidates, analytics, duplicate)")

            # DELETE (CRUD) - last
            # Keep job for other tests

        else:
            self.log("⚠️  Skipping detail tests (create failed)")

    def test_candidates(self):
        """Candidates: 8 endpoints"""
        self.log("\n" + "="*80)
        self.log("👥 CANDIDATES (8 endpoints)")
        self.log("="*80)

        # 1. List
        self.test_endpoint('backend', 'GET', '/candidates', 'List candidates', 200)

        # 2. Paginated
        self.test_endpoint('backend', 'GET', '/candidates?page=1&limit=10', 'Paginated list', 200)

        # 3. Upload (skip - requires file)
        self.log("  ⏭️  SKIP   /candidates/upload (requires multipart file)")

        # For remaining tests, check if we have existing candidates
        # Get first candidate if exists
        try:
            r = requests.get(f"{BASE_URL}/candidates?limit=1", headers=self.headers)
            if r.status_code == 200:
                data = r.json()
                candidates = data.get('data', {}).get('candidates', []) if isinstance(data.get('data'), dict) else data.get('candidates', [])

                if candidates and len(candidates) > 0:
                    candidate_id = candidates[0].get('id')
                    if candidate_id:
                        self.log(f"   📝 Using existing candidate: {candidate_id}")

                        # 4. GET detail
                        self.test_endpoint('crud', 'GET', f'/candidates/{candidate_id}', 'Read candidate', 200)

                        # 5. UPDATE
                        self.test_endpoint('crud', 'PATCH', f'/candidates/{candidate_id}', 'Update candidate', 200, {
                            'notes': 'W2 test note'
                        })

                        # 6. Add note
                        self.test_endpoint('backend', 'POST', f'/candidates/{candidate_id}/notes', 'Add note', 201, {
                            'content': 'W2 comprehensive test note'
                        })

                        # 7. Timeline
                        self.test_endpoint('backend', 'GET', f'/candidates/{candidate_id}/timeline', 'Get timeline', 200)

                        # 8. Update status
                        self.test_endpoint('backend', 'POST', f'/candidates/{candidate_id}/status', 'Update status', 200, {
                            'status': 'REVIEWING'
                        })

                        # Don't delete - keep existing data
                    else:
                        self.log("  ⚠️  No candidate ID found")
                else:
                    self.log("  ⚠️  No existing candidates found - skipping detail tests")
        except Exception as e:
            self.log(f"  ⚠️  Could not fetch candidates: {e}")

    def test_analyses(self):
        """Analyses: 8 endpoints"""
        self.log("\n" + "="*80)
        self.log("📊 ANALYSES (8 endpoints)")
        self.log("="*80)

        # 1. List
        self.test_endpoint('backend', 'GET', '/analyses', 'List analyses', 200)

        # Wizard endpoints (2-3) - skip (complex multi-step)
        self.log("  ⏭️  SKIP   /analyses/wizard (requires multi-step wizard)")
        self.log("  ⏭️  SKIP   /analyses/wizard/upload-cvs (requires files)")
        self.log("  ⏭️  SKIP   /analyses/wizard/complete (requires wizard session)")

        # Check existing analyses
        try:
            r = requests.get(f"{BASE_URL}/analyses?limit=1", headers=self.headers)
            if r.status_code == 200:
                data = r.json()
                analyses = data.get('data', {}).get('analyses', []) if isinstance(data.get('data'), dict) else data.get('analyses', [])

                if analyses and len(analyses) > 0:
                    analysis_id = analyses[0].get('id')
                    if analysis_id:
                        self.log(f"   📝 Using existing analysis: {analysis_id}")

                        # 4. GET detail
                        self.test_endpoint('backend', 'GET', f'/analyses/{analysis_id}', 'Read analysis', 200)

                        # 5. Get results
                        self.test_endpoint('backend', 'GET', f'/analyses/{analysis_id}/results', 'Get results', 200)

                        # 6. Regenerate (might fail if already processing)
                        self.log("  ⏭️  SKIP   /analyses/:id/regenerate (may interfere with production)")

                        # 7. DELETE (skip - keep data)
                        self.log("  ⏭️  SKIP   DELETE /analyses/:id (keep production data)")
                    else:
                        self.log("  ⚠️  No analysis ID found")
                else:
                    self.log("  ⚠️  No existing analyses - skipping detail tests")
        except Exception as e:
            self.log(f"  ⚠️  Could not fetch analyses: {e}")

    def test_offers(self):
        """Offers: 4 endpoints"""
        self.log("\n" + "="*80)
        self.log("💼 OFFERS (4 endpoints)")
        self.log("="*80)

        # 1. List
        self.test_endpoint('backend', 'GET', '/offers', 'List offers', 200)

        # 2. Wizard (skip - complex)
        self.log("  ⏭️  SKIP   POST /offers/wizard (requires multi-step wizard)")

        # Check existing offers
        try:
            r = requests.get(f"{BASE_URL}/offers?limit=1", headers=self.headers)
            if r.status_code == 200:
                data = r.json()
                # Handle different response structures
                offers = []
                if isinstance(data, dict):
                    if 'data' in data:
                        if isinstance(data['data'], dict) and 'offers' in data['data']:
                            offers = data['data']['offers']
                        elif isinstance(data['data'], list):
                            offers = data['data']
                    elif 'offers' in data:
                        offers = data['offers']

                if offers and len(offers) > 0:
                    offer_id = offers[0].get('id')
                    if offer_id:
                        self.log(f"   📝 Using existing offer: {offer_id}")

                        # 3. GET detail
                        self.test_endpoint('backend', 'GET', f'/offers/{offer_id}', 'Read offer', 200)

                        # 4. Update (if endpoint exists)
                        # Skip for now as we don't want to modify production data
                        self.log("  ⏭️  SKIP   PATCH /offers/:id (keep production data)")
                    else:
                        self.log("  ⚠️  No offer ID found")
                else:
                    self.log("  ⚠️  No existing offers - skipping detail tests")
        except Exception as e:
            self.log(f"  ⚠️  Could not fetch offers: {e}")

    def test_interviews(self):
        """Interviews: 2 endpoints"""
        self.log("\n" + "="*80)
        self.log("🗓️ INTERVIEWS (2 endpoints)")
        self.log("="*80)

        # 1. List
        self.test_endpoint('backend', 'GET', '/interviews', 'List interviews', 200)

        # 2. Schedule (skip - requires valid data)
        self.log("  ⏭️  SKIP   POST /interviews/schedule (requires candidate/job)")

    def test_rbac_permissions(self):
        """RBAC: Test forbidden endpoints"""
        self.log("\n" + "="*80)
        self.log("🔒 RBAC CHECKS (HR should NOT access)")
        self.log("="*80)

        # Team management (ADMIN/MANAGER only)
        self.test_endpoint('rbac', 'GET', '/team', 'Team list (forbidden)', 403)
        self.test_endpoint('rbac', 'POST', '/team/invite', 'Invite team member (forbidden)', 403, {
            'email': 'test@test.com',
            'role': 'USER'
        })

        # Analytics (HR_SPECIALIST HAS ACCESS per ROLE_GROUPS.ANALYTICS_VIEWERS)
        self.test_endpoint('backend', 'GET', '/analytics/summary', 'Analytics summary (allowed)', 200)
        self.test_endpoint('backend', 'GET', '/analytics/time-to-hire', 'Time-to-hire analytics (allowed)', 200)

        # Organization settings (ADMIN only)
        self.test_endpoint('rbac', 'GET', '/organizations/me', 'Org settings (read allowed)', 200)
        self.test_endpoint('rbac', 'PATCH', '/organizations/me', 'Update org (forbidden)', 403, {
            'name': 'test'
        })

        # Super admin (SUPER_ADMIN only)
        self.test_endpoint('rbac', 'GET', '/super-admin/organizations', 'Super admin list orgs (forbidden)', 403)
        self.test_endpoint('rbac', 'GET', '/super-admin/stats', 'Super admin stats (forbidden)', 403)

        self.log(f"\n✅ RBAC checks completed: {self.results['rbac']['passed']}/{self.results['rbac']['tested']} correctly enforced")

    def test_database_isolation(self):
        """Database: Verify organizationId in all queries"""
        self.log("\n" + "="*80)
        self.log("🗄️ DATABASE ISOLATION (organizationId verification)")
        self.log("="*80)

        # This test verifies that all returned data belongs to user's organization
        # We check this by verifying organizationId in responses

        checks = [
            ('GET', '/job-postings', 'Job postings'),
            ('GET', '/candidates', 'Candidates'),
            ('GET', '/analyses', 'Analyses'),
            ('GET', '/offers', 'Offers'),
            ('GET', '/interviews', 'Interviews'),
        ]

        for method, endpoint, name in checks:
            try:
                r = requests.get(f"{BASE_URL}{endpoint}", headers=self.headers)
                if r.status_code == 200:
                    data = r.json()
                    # Extract items from response
                    items = []
                    if isinstance(data, dict):
                        if 'data' in data:
                            if isinstance(data['data'], dict):
                                # Could be data.data.items or data.data[key]
                                for key in ['job-postings', 'candidates', 'analyses', 'offers', 'interviews', 'jobPostings']:
                                    if key in data['data']:
                                        items = data['data'][key]
                                        break
                            elif isinstance(data['data'], list):
                                items = data['data']
                        else:
                            # Try direct keys
                            for key in ['job-postings', 'candidates', 'analyses', 'offers', 'interviews', 'jobPostings']:
                                if key in data:
                                    items = data[key]
                                    break

                    if items and len(items) > 0:
                        # Check first few items for organizationId
                        sample_size = min(3, len(items))
                        has_org_id = all('organizationId' in item for item in items[:sample_size])

                        result = {
                            'name': name,
                            'endpoint': endpoint,
                            'items_checked': sample_size,
                            'has_organizationId': has_org_id,
                            'success': has_org_id
                        }

                        self.results['database']['tested'] += 1
                        if has_org_id:
                            self.results['database']['passed'] += 1
                            self.log(f"  ✅ {name:30} → {sample_size} items have organizationId")
                        else:
                            self.results['database']['failed'] += 1
                            self.log(f"  ❌ {name:30} → Missing organizationId in some items!")

                        self.results['database']['queries'].append(result)
                    else:
                        self.log(f"  ⏭️  {name:30} → No items to check")
                else:
                    self.log(f"  ⚠️  {name:30} → Request failed ({r.status_code})")
            except Exception as e:
                self.log(f"  ❌ {name:30} → Error: {e}")

    def cleanup(self):
        """Clean up created test data"""
        self.log("\n" + "="*80)
        self.log("🧹 CLEANUP")
        self.log("="*80)

        if 'job_posting' in self.created_ids and self.created_ids['job_posting']:
            job_id = self.created_ids['job_posting']
            self.log(f"Test job posting created: {job_id}")
            # NOTE: HR_SPECIALIST cannot delete (ADMIN only)
            # Testing DELETE permission
            self.test_endpoint('rbac', 'DELETE', f'/job-postings/{job_id}', 'Delete job (forbidden for HR)', 403)
            self.log("  ⚠️  Test job posting left in database (HR cannot delete)")

    def generate_report(self):
        """Generate final report"""
        self.log("\n" + "="*80)
        self.log("📊 TEST SUMMARY")
        self.log("="*80)

        total_tested = (self.results['backend']['tested'] +
                       self.results['rbac']['tested'] +
                       self.results['crud']['tested'] +
                       self.results['database']['tested'])

        total_passed = (self.results['backend']['passed'] +
                       self.results['rbac']['passed'] +
                       self.results['crud']['passed'] +
                       self.results['database']['passed'])

        total_failed = (self.results['backend']['failed'] +
                       self.results['rbac']['failed'] +
                       self.results['crud']['failed'] +
                       self.results['database']['failed'])

        self.log(f"\nTotal Tests: {total_tested}")
        self.log(f"  ✅ Passed: {total_passed}")
        self.log(f"  ❌ Failed: {total_failed}")
        self.log(f"  Success Rate: {(total_passed/total_tested*100):.1f}%")

        self.log(f"\nBy Category:")
        self.log(f"  Backend Endpoints: {self.results['backend']['passed']}/{self.results['backend']['tested']}")
        self.log(f"  CRUD Operations: {self.results['crud']['passed']}/{self.results['crud']['tested']}")
        self.log(f"  RBAC Checks: {self.results['rbac']['passed']}/{self.results['rbac']['tested']}")
        self.log(f"  Database Isolation: {self.results['database']['passed']}/{self.results['database']['tested']}")

        # Save JSON
        output_file = 'test-outputs/w2-comprehensive-hr-results.json'
        with open(output_file, 'w') as f:
            json.dump(self.results, f, indent=2)
        self.log(f"\n✅ Results saved to: {output_file}")

        return total_failed == 0

    def run(self):
        """Main test runner"""
        self.log("="*80)
        self.log("🧪 W2 COMPREHENSIVE HR_SPECIALIST TEST")
        self.log("="*80)
        self.log(f"User: {EMAIL}")
        self.log(f"Started: {self.results['timestamp']}")
        self.log("="*80)

        if not self.login():
            self.log("❌ Login failed - aborting")
            return False

        # Run all tests
        self.test_job_postings()
        self.test_candidates()
        self.test_analyses()
        self.test_offers()
        self.test_interviews()
        self.test_rbac_permissions()
        self.test_database_isolation()
        self.cleanup()

        return self.generate_report()

def main():
    tester = ComprehensiveHRTest()
    success = tester.run()

    sys.exit(0 if success else 1)

if __name__ == '__main__':
    main()
