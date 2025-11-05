#!/usr/bin/env python3
"""
W4 E2E Test - ADMIN Dashboard API Test
Tests /api/v1/dashboard/admin endpoint
"""

import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from test_helper import IKAITestHelper
import json

def test_admin_dashboard_api():
    """Test ADMIN dashboard API endpoint"""

    helper = IKAITestHelper()

    print("="*80)
    print("🧪 W4 E2E TEST - ADMIN DASHBOARD API")
    print("="*80)
    print()

    # Login
    print("🔑 Step 1: Logging in as ADMIN...")
    login_result = helper.login("test-admin@test-org-2.com", "TestPass123!")

    if not login_result['success']:
        print(f"❌ Login failed: {login_result.get('message')}")
        return False

    print(f"✅ Logged in as: {login_result['user']['firstName']} {login_result['user']['lastName']}")
    print(f"   Organization: {login_result['organization']['name']}")
    print(f"   Plan: {login_result['organization']['plan']}")
    print()

    # Test dashboard API
    print("📊 Step 2: Testing /api/v1/dashboard/admin...")
    try:
        response = helper.get('/api/v1/dashboard/admin')

        if response.status_code == 200:
            data = response.json()

            if data.get('success'):
                dashboard_data = data['data']

                print("✅ Dashboard API successful!")
                print()
                print("="*80)
                print("📊 DASHBOARD DATA")
                print("="*80)

                # Org stats
                if 'orgStats' in dashboard_data:
                    org_stats = dashboard_data['orgStats']
                    print(f"\n📈 Organization Stats:")
                    print(f"   Total Users: {org_stats.get('totalUsers')}")
                    print(f"   Active Today: {org_stats.get('activeToday')}")
                    print(f"   Plan: {org_stats.get('plan')}")

                # User management
                if 'userManagement' in dashboard_data:
                    user_mgmt = dashboard_data['userManagement']
                    print(f"\n👥 User Management:")
                    print(f"   Total Users: {user_mgmt.get('totalUsers')}")
                    print(f"   Active Today: {user_mgmt.get('activeToday')}")

                # Billing
                if 'billing' in dashboard_data:
                    billing = dashboard_data['billing']
                    print(f"\n💳 Billing:")
                    print(f"   Monthly Amount: ₺{billing.get('monthlyAmount')}")
                    print(f"   Next Billing Date: {billing.get('nextBillingDate')}")

                # Usage trend
                if 'usageTrend' in dashboard_data:
                    usage_trend = dashboard_data['usageTrend']
                    print(f"\n📊 Usage Trend (last {len(usage_trend)} days):")
                    for day in usage_trend:
                        print(f"   {day['date']}: {day['analyses']} analyses, {day['cvs']} CVs, {day['activeUsers']} active users")

                # Team activity
                if 'teamActivity' in dashboard_data:
                    team_activity = dashboard_data['teamActivity']
                    print(f"\n👥 Team Activity: {len(team_activity)} items")
                    if len(team_activity) == 0:
                        print("   ⚠️  No team activity data (mock not implemented)")

                # Security
                if 'security' in dashboard_data:
                    security = dashboard_data['security']
                    print(f"\n🔒 Security:")
                    print(f"   2FA Users: {security.get('twoFactorUsers')}")
                    print(f"   Active Sessions: {security.get('activeSessions')}")
                    print(f"   Last Security Event: {security.get('lastSecurityEvent')}")
                    print(f"   Compliance Score: {security.get('complianceScore')}%")

                # Health
                if 'health' in dashboard_data:
                    health = dashboard_data['health']
                    print(f"\n🏥 Organization Health:")
                    print(f"   Overall Score: {health.get('score')}%")
                    if 'factors' in health:
                        print(f"   Factors:")
                        for factor in health['factors']:
                            status_emoji = "✅" if factor['status'] == 'good' else "⚠️"
                            print(f"     {status_emoji} {factor['name']}: {factor['score']}% ({factor['status']})")

                print("\n" + "="*80)
                print("✅ ALL DATA RETRIEVED SUCCESSFULLY")
                print("="*80)

                # Save full response
                with open('/home/asan/Desktop/ikai/test-outputs/w4-admin-dashboard-api.json', 'w') as f:
                    json.dump(data, f, indent=2)
                print("\n📁 Full response saved: test-outputs/w4-admin-dashboard-api.json")

                return True
            else:
                print(f"❌ API returned success=false: {data.get('message')}")
                return False
        else:
            print(f"❌ API returned status {response.status_code}")
            print(f"   Response: {response.text[:200]}")
            return False

    except Exception as e:
        print(f"❌ Error testing API: {str(e)}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    success = test_admin_dashboard_api()
    exit(0 if success else 1)
