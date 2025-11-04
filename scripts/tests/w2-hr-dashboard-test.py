#!/usr/bin/env python3
"""
W2: HR_SPECIALIST Dashboard Test (Standalone)
Role-based login + endpoint validation
"""

import requests
import json

BASE_URL = "http://localhost:8102"

def main():
    print("🧪 W2: HR_SPECIALIST Dashboard Test")
    print("=" * 60)

    # Login as HR_SPECIALIST
    print("\n1️⃣ Login as HR_SPECIALIST...")
    try:
        response = requests.post(
            f"{BASE_URL}/api/v1/auth/login",
            json={"email": "test-hr_specialist@test-org-1.com", "password": "TestPass123!"},
            headers={"Content-Type": "application/json"}
        )

        if response.status_code != 200:
            print(f"❌ Login failed! Status: {response.status_code}")
            print(f"   Response: {response.text}")
            return 1

        login_data = response.json()
        token = login_data.get("token")
        user = login_data.get("user")

        print(f"✅ Login successful!")
        print(f"   Email: {user.get('email')}")
        print(f"   Role: {user.get('role')}")
        print(f"   Token: {token[:20]}...")

    except Exception as e:
        print(f"❌ Login error: {e}")
        return 1

    # Test HR dashboard endpoint
    print("\n2️⃣ Testing HR dashboard endpoint...")
    try:
        response = requests.get(
            f"{BASE_URL}/api/v1/dashboard/hr-specialist",
            headers={
                "Authorization": f"Bearer {token}",
                "Content-Type": "application/json"
            }
        )

        print(f"   Status: {response.status_code}")

        if response.status_code != 200:
            print(f"❌ Dashboard request failed!")
            print(f"   Response: {response.text}")
            return 1

        data = response.json()
        print(f"✅ Dashboard endpoint responded successfully!")

    except Exception as e:
        print(f"❌ Dashboard request error: {e}")
        return 1

    # Analyze response
    print("\n3️⃣ Analyzing response...")

    if not data.get('success'):
        print(f"❌ API returned success=false")
        print(f"   Error: {data.get('message')}")
        return 1

    dashboard_data = data.get('data', {})

    # Check for mock data patterns
    print("\n4️⃣ Checking for mock data patterns...")

    issues = []

    # Check pipeline
    pipeline = dashboard_data.get('pipeline', [])
    if pipeline:
        print(f"\n   📊 Pipeline stages: {len(pipeline)}")
        for stage in pipeline:
            print(f"      - {stage['stage']}: count={stage['count']}, percentage={stage['percentage']}%")

            # Check if percentages are exactly 70, 40, 20, 15 (old mock values)
            if stage['stage'] == 'Eleme' and stage['percentage'] == 70 and stage['count'] > 0:
                # Calculate expected percentage
                applications = pipeline[0]['count'] if pipeline else 1
                expected = round((stage['count'] / applications) * 100) if applications > 0 else 0
                if expected == 70:
                    issues.append(f"⚠️ Eleme: {stage['count']}/{applications} = exactly 70% (suspicious)")

            if stage['stage'] == 'Mülakat' and stage['percentage'] == 40:
                issues.append("⚠️ Mülakat has hardcoded 40% (old mock value)")

            if stage['stage'] == 'Teklif' and stage['percentage'] == 20:
                issues.append("⚠️ Teklif has hardcoded 20% (old mock value)")

    # Check monthlyStats
    monthly = dashboard_data.get('monthlyStats', {})
    if monthly:
        print(f"\n   📈 Monthly stats:")
        print(f"      - applications: {monthly.get('applications')} (Δ{monthly.get('applicationsChange'):+d}%)")
        print(f"      - analyses: {monthly.get('analyses')} (Δ{monthly.get('analysesChange'):+d}%)")
        print(f"      - interviews: {monthly.get('interviews')} (Δ{monthly.get('interviewsChange'):+d}%)")
        print(f"      - offers: {monthly.get('offers')} (Δ{monthly.get('offersChange'):+d}%)")
        print(f"      - hires: {monthly.get('hires')} (Δ{monthly.get('hiresChange'):+d}%)")
        print(f"      - conversionRate: {monthly.get('conversionRate')}% (Δ{monthly.get('conversionChange'):+d}%)")

        # Check for old mock values (12, 8, 15, 10, 5, 15, 3)
        if monthly.get('applicationsChange') == 12 and monthly.get('applications') > 0:
            issues.append("⚠️ applicationsChange = 12 (old mock value)")
        if monthly.get('analysesChange') == 8:
            issues.append("⚠️ analysesChange = 8 (old mock value)")
        if monthly.get('interviewsChange') == 15:
            issues.append("⚠️ interviewsChange = 15 (old mock value)")
        if monthly.get('offersChange') == 10:
            issues.append("⚠️ offersChange = 10 (old mock value)")
        if monthly.get('hiresChange') == 5:
            issues.append("⚠️ hiresChange = 5 (old mock value)")
        if monthly.get('conversionRate') == 15:
            issues.append("⚠️ conversionRate = 15 (old mock value)")
        if monthly.get('conversionChange') == 3:
            issues.append("⚠️ conversionChange = 3 (old mock value)")

    # Check overview
    overview = dashboard_data.get('overview', {})
    if overview:
        print(f"\n   📋 Overview:")
        print(f"      - activePostings: {overview.get('activePostings')}")
        print(f"      - todayCVs: {overview.get('todayCVs')}")
        print(f"      - thisWeekAnalyses: {overview.get('thisWeekAnalyses')}")

    # Check recentAnalyses
    recent = dashboard_data.get('recentAnalyses', [])
    print(f"\n   🔍 Recent analyses: {len(recent)} found")
    for idx, analysis in enumerate(recent[:3], 1):
        print(f"      - Analysis {idx}: {analysis.get('candidateCount')} candidates, top score: {analysis.get('topScore')}")

    # Print summary
    print("\n" + "=" * 60)
    if issues:
        print(f"\n❌ Found {len(issues)} potential mock data issues:")
        for issue in issues:
            print(f"   {issue}")
        print("\n⚠️ Backend may still contain mock data despite fixes!")
        return 1
    else:
        print("\n✅ No mock data patterns detected!")
        print("✅ All data appears to be real from database!")
        print("\n🎉 HR Dashboard validation PASSED!")
        return 0

if __name__ == "__main__":
    exit(main())
