#!/usr/bin/env python3
"""
W5: SUPER_ADMIN Dashboard Test Script
Tests SUPER_ADMIN dashboard endpoint for real data validation
"""

import requests
import json
import sys

BASE_URL = "http://localhost:8102"

def test_super_admin_dashboard():
    """Test SUPER_ADMIN dashboard endpoint"""

    print("=" * 80)
    print("🎯 W5: SUPER_ADMIN DASHBOARD TEST")
    print("=" * 80)
    print()

    # 1. Login as SUPER_ADMIN
    print("📋 Step 1: Login as SUPER_ADMIN")
    print("-" * 80)

    login_response = requests.post(
        f"{BASE_URL}/api/v1/auth/login",
        json={"email": "info@gaiai.ai", "password": "23235656"},
        headers={"Content-Type": "application/json"}
    )

    if login_response.status_code != 200:
        print(f"❌ CRITICAL: Login failed! Status: {login_response.status_code}")
        print(f"Response: {login_response.text}")
        return False

    login_data = login_response.json()
    token = login_data.get("token")
    user = login_data.get("user")

    print(f"✅ Login başarılı!")
    print(f"   Email: info@gaiai.ai")
    print(f"   Rol: {user.get('role')}")
    print(f"   Token: {token[:20]}...")
    print()

    # 2. Get dashboard data
    print("📋 Step 2: Get SUPER_ADMIN Dashboard Data")
    print("-" * 80)

    dashboard_response = requests.get(
        f"{BASE_URL}/api/v1/dashboard/super-admin",
        headers={"Authorization": f"Bearer {token}"}
    )

    if dashboard_response.status_code != 200:
        print(f"❌ CRITICAL: API failed with status {dashboard_response.status_code}")
        print(f"Response: {dashboard_response.text}")
        return False

    data = dashboard_response.json()
    print(f"✅ API call successful (200 OK)")
    print()

    # 3. Validate response structure
    print("📋 Step 3: Validate Response Structure")
    print("-" * 80)

    required_fields = [
        'overview',
        'organizations',
        'revenue',
        'analytics',
        'growth',
        'systemHealth',
        'orgList',
        'queues',
        'security'
    ]

    errors = []
    warnings = []

    for field in required_fields:
        if field not in data['data']:
            errors.append(f"❌ Missing required field: {field}")
        else:
            print(f"✅ Field exists: {field}")

    print()

    # 4. Cross-org validation
    print("📋 Step 4: Cross-org Access Validation")
    print("-" * 80)

    total_orgs = data['data']['organizations']['total']
    org_list_count = len(data['data']['orgList'])

    print(f"Total Organizations: {total_orgs}")
    print(f"Org List Count: {org_list_count}")

    if total_orgs < 3:
        errors.append(f"❌ CRITICAL: Expected at least 3 organizations, got {total_orgs}")
        print(f"❌ CRITICAL: SUPER_ADMIN should see ALL organizations!")
    else:
        print(f"✅ Cross-org access working ({total_orgs} organizations)")

    print()

    # 5. Revenue validation
    print("📋 Step 5: Revenue Validation")
    print("-" * 80)

    revenue = data['data']['revenue']
    print(f"MRR: ₺{revenue['mrr']}")
    print(f"MRR Growth: {revenue['mrrGrowth']}%")
    print(f"Avg LTV: ₺{revenue['avgLTV']}")
    print(f"Enterprise Revenue: ₺{revenue['enterprise']}")
    print(f"Pro Revenue: ₺{revenue['pro']}")

    # Check for mock data patterns
    if revenue['mrrGrowth'] in [12, 15]:
        warnings.append(f"⚠️  mrrGrowth looks like mock data: {revenue['mrrGrowth']}%")

    if revenue['avgLTV'] in [5000]:
        warnings.append(f"⚠️  avgLTV looks like mock data: ₺{revenue['avgLTV']}")

    # ENTERPRISE should be 0 (custom pricing)
    if revenue['enterprise'] != 0:
        warnings.append(f"⚠️  ENTERPRISE revenue should be 0 (custom pricing), got ₺{revenue['enterprise']}")
    else:
        print(f"✅ ENTERPRISE revenue = 0 (custom pricing) ✓")

    # MRR should be calculated from PRO plans
    plan_counts = data['data']['organizations']['planCounts']
    pro_count = next((p['_count'] for p in plan_counts if p['plan'] == 'PRO'), 0)
    expected_mrr = pro_count * 99

    if revenue['mrr'] != expected_mrr:
        errors.append(f"❌ MRR mismatch: Expected ₺{expected_mrr} (PRO count: {pro_count}), got ₺{revenue['mrr']}")
    else:
        print(f"✅ MRR calculation correct: {pro_count} PRO orgs × ₺99 = ₺{revenue['mrr']}")

    # avgLTV should be 99 * 12 = 1188
    expected_ltv = 99 * 12
    if revenue['avgLTV'] != expected_ltv:
        warnings.append(f"⚠️  avgLTV should be ₺{expected_ltv} (99 × 12 months), got ₺{revenue['avgLTV']}")
    else:
        print(f"✅ avgLTV calculation correct: ₺99 × 12 months = ₺{revenue['avgLTV']}")

    print()

    # 6. Analytics validation
    print("📋 Step 6: Analytics Growth Validation")
    print("-" * 80)

    analytics = data['data']['analytics']
    print(f"Total Analyses: {analytics['totalAnalyses']}")
    print(f"Total CVs: {analytics['totalCVs']}")
    print(f"Total Job Postings: {analytics['totalJobPostings']}")
    print(f"Total Offers: {analytics['totalOffers']}")
    print(f"Analyses Growth: {analytics['analysesGrowth']}%")
    print(f"CVs Growth: {analytics['cvsGrowth']}%")
    print(f"Jobs Growth: {analytics['jobsGrowth']}%")
    print(f"Offers Growth: {analytics['offersGrowth']}%")

    # Check for mock data patterns (hardcoded percentages)
    if analytics['analysesGrowth'] in [15, 20]:
        warnings.append(f"⚠️  analysesGrowth looks like mock data: {analytics['analysesGrowth']}%")

    if analytics['cvsGrowth'] in [20, 25]:
        warnings.append(f"⚠️  cvsGrowth looks like mock data: {analytics['cvsGrowth']}%")

    if analytics['jobsGrowth'] in [10]:
        warnings.append(f"⚠️  jobsGrowth looks like mock data: {analytics['jobsGrowth']}%")

    if analytics['offersGrowth'] in [8]:
        warnings.append(f"⚠️  offersGrowth looks like mock data: {analytics['offersGrowth']}%")

    print()

    # 7. Growth data validation
    print("📋 Step 7: Growth Data Validation")
    print("-" * 80)

    growth = data['data']['growth']
    chart_data = growth['chartData']
    metrics = growth['metrics']

    print(f"Chart Data Points: {len(chart_data)}")
    print(f"Org Growth: {metrics['orgGrowth']}%")
    print(f"User Growth: {metrics['userGrowth']}%")
    print(f"Revenue Growth: {metrics['revenueGrowth']}%")
    print(f"Activity Growth: {metrics['activityGrowth']}%")

    # Validate chart data
    if len(chart_data) != 7:
        warnings.append(f"⚠️  Expected 7 chart data points, got {len(chart_data)}")
    else:
        print(f"✅ Chart data has 7 days ✓")

    # Check for mock patterns in chart data (hardcoded dates)
    first_date = chart_data[0]['date']
    if first_date in ['01-08', '15-08', '01-09']:
        warnings.append(f"⚠️  Chart data has mock dates: {first_date}")
    else:
        print(f"✅ Chart data has real dates (Turkish format): {first_date}")

    # Check for mock patterns in metrics (hardcoded percentages)
    if metrics['orgGrowth'] in [15]:
        warnings.append(f"⚠️  orgGrowth looks like mock data: {metrics['orgGrowth']}%")

    if metrics['userGrowth'] in [25]:
        warnings.append(f"⚠️  userGrowth looks like mock data: {metrics['userGrowth']}%")

    if metrics['revenueGrowth'] in [12]:
        warnings.append(f"⚠️  revenueGrowth looks like mock data: {metrics['revenueGrowth']}%")

    if metrics['activityGrowth'] in [30]:
        warnings.append(f"⚠️  activityGrowth looks like mock data: {metrics['activityGrowth']}%")

    print()

    # 8. System health validation
    print("📋 Step 8: System Health Validation")
    print("-" * 80)

    health = data['data']['systemHealth']
    print(f"Backend: {health['backend']}")
    print(f"Database: {health['database']}")
    print(f"Redis: {health['redis']}")
    print(f"Milvus: {health['milvus']}")
    print(f"Queues: {health['queues']}")
    print(f"Uptime: {health['uptime']}%")
    print(f"API Response Time: {health['apiResponseTime']}ms")
    print(f"Vector Count: {health['vectorCount']}")

    # Database should be healthy (real check)
    if health['database'] != 'healthy':
        errors.append(f"❌ Database unhealthy: {health['database']}")
    else:
        print(f"✅ Database health check passed ✓")

    # Vector count should match total analyses
    if health['vectorCount'] != analytics['totalAnalyses']:
        warnings.append(f"⚠️  Vector count mismatch: {health['vectorCount']} vs {analytics['totalAnalyses']}")
    else:
        print(f"✅ Vector count matches total analyses ✓")

    print()

    # 9. Organization list validation
    print("📋 Step 9: Organization List Validation")
    print("-" * 80)

    org_list = data['data']['orgList']
    print(f"Organizations in list: {len(org_list)}")

    for i, org in enumerate(org_list[:5], 1):  # Show first 5
        print(f"{i}. {org['name']} ({org['plan']}) - {org['totalUsers']} users")

    if len(org_list) < total_orgs:
        print(f"⚠️  Note: Showing {len(org_list)} of {total_orgs} organizations (pagination)")

    print()

    # 10. Queue stats validation
    print("📋 Step 10: Queue Stats Validation")
    print("-" * 80)

    queues = data['data']['queues']
    print(f"Queues: {len(queues)}")

    for queue in queues:
        print(f"- {queue['name']}: {queue['status']} (waiting: {queue['waiting']}, active: {queue['active']}, completed: {queue['completed']}, failed: {queue['failed']})")

    # Check for hardcoded mock data
    if queues[0]['waiting'] == 3 and queues[0]['active'] == 2 and queues[0]['completed'] == 150:
        warnings.append(f"⚠️  Queue stats look like mock data (hardcoded values)")

    print()

    # 11. Security validation
    print("📋 Step 11: Security Metrics Validation")
    print("-" * 80)

    security = data['data']['security']
    print(f"Security Score: {security['securityScore']}")
    print(f"Failed Logins: {security['failedLogins']}")
    print(f"Suspicious Activity: {security['suspiciousActivity']}")
    print(f"Rate Limit Hits: {security['rateLimitHits']}")
    print(f"Last Event: {security['lastEvent']}")

    # Check for mock patterns
    if security['securityScore'] == 95 and security['failedLogins'] == 3:
        warnings.append(f"⚠️  Security metrics look like mock data (hardcoded values)")

    print()

    # Summary
    print("=" * 80)
    print("📊 TEST SUMMARY")
    print("=" * 80)

    print(f"\n✅ Total Checks Passed: {11 - len(errors)}/11")

    if errors:
        print(f"\n❌ ERRORS ({len(errors)}):")
        for error in errors:
            print(f"  {error}")

    if warnings:
        print(f"\n⚠️  WARNINGS ({len(warnings)}):")
        for warning in warnings:
            print(f"  {warning}")

    if not errors and not warnings:
        print("\n🎉 ALL TESTS PASSED - NO ISSUES FOUND!")
    elif not errors:
        print("\n✅ NO CRITICAL ERRORS - Some warnings present")
    else:
        print("\n❌ CRITICAL ERRORS FOUND - FIX REQUIRED!")

    print()

    return len(errors) == 0

if __name__ == "__main__":
    success = test_super_admin_dashboard()
    sys.exit(0 if success else 1)
