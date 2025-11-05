#!/usr/bin/env python3
"""
W4 E2E Test - ADMIN Dashboard API Test (Simple)
Tests /api/v1/dashboard/admin endpoint
"""

import requests
import json

BASE_URL = "http://localhost:8102"

def test_admin_dashboard_api():
    """Test ADMIN dashboard API endpoint"""

    print("="*80)
    print("🧪 W4 E2E TEST - ADMIN DASHBOARD API")
    print("="*80)
    print()

    # Step 1: Login
    print("🔑 Step 1: Logging in as ADMIN...")
    try:
        response = requests.post(
            f"{BASE_URL}/api/v1/auth/login",
            json={"email": "test-admin@test-org-2.com", "password": "TestPass123!"},
            headers={"Content-Type": "application/json"}
        )

        if response.status_code != 200:
            print(f"❌ Login failed! Status: {response.status_code}")
            print(f"   Response: {response.text}")
            return False

        login_data = response.json()
        token = login_data.get("token")
        user = login_data.get("user")
        organization = login_data.get("organization")

        # Debug: print full response
        print(f"DEBUG - Login response keys: {login_data.keys()}")
        print(f"DEBUG - User: {user}")
        print(f"DEBUG - Organization: {organization}")

        user_name = f"{user.get('firstName', '')} {user.get('lastName', '')}".strip() or user.get('email', 'Unknown')
        print(f"✅ Logged in as: {user_name}")

        if organization:
            print(f"   Organization: {organization.get('name', 'N/A')}")
            print(f"   Plan: {organization.get('plan', 'N/A')}")
        else:
            print(f"   ⚠️  No organization data in login response")

        print(f"   Token: {token[:20] if token else 'N/A'}...")
        print()

    except Exception as e:
        print(f"❌ Login error: {str(e)}")
        return False

    # Step 2: Test dashboard API
    print("📊 Step 2: Testing /api/v1/dashboard/admin...")
    try:
        response = requests.get(
            f"{BASE_URL}/api/v1/dashboard/admin",
            headers={"Authorization": f"Bearer {token}"}
        )

        if response.status_code != 200:
            print(f"❌ Dashboard API failed! Status: {response.status_code}")
            print(f"   Response: {response.text}")
            return False

        data = response.json()

        if not data.get('success'):
            print(f"❌ API returned success=false: {data.get('message')}")
            return False

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

    except Exception as e:
        print(f"❌ Error testing API: {str(e)}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    success = test_admin_dashboard_api()
    exit(0 if success else 1)
