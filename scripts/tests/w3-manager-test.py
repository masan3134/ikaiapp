#!/usr/bin/env python3
"""
W3: MANAGER Dashboard Comprehensive Test
Tests MANAGER role endpoints with test-helper.py
"""

import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from test_helper import IKAITestHelper

def main():
    print("="*70)
    print("W3: MANAGER DASHBOARD TEST")
    print("="*70)

    helper = IKAITestHelper()

    # Test 1: Login as MANAGER
    print("\n📝 TEST 1: Login as MANAGER")
    print("-" * 70)
    success = helper.login("test-manager@test-org-1.com", "TestPass123!")

    if not success:
        print("❌ Login başarısız! Test durduruluyor.")
        return

    # Test 2: Manager Dashboard
    print("\n📝 TEST 2: Manager Dashboard (/api/v1/dashboard/manager)")
    print("-" * 70)
    dashboard_data = helper.get("/api/v1/dashboard/manager")

    if dashboard_data:
        print("\n✅ Dashboard data alındı!")

        # Validate structure
        data = dashboard_data.get('data', {})

        # Check overview
        if 'overview' in data:
            print(f"\n📊 Overview:")
            print(f"   Team Size: {data['overview'].get('teamSize')}")
            print(f"   Active Projects: {data['overview'].get('activeProjects')}")
            print(f"   Performance: {data['overview'].get('performance')}%")
            print(f"   Budget Used: {data['overview'].get('budgetUsed')}%")
        else:
            print("❌ HATA: 'overview' field eksik!")

        # Check teamPerformance
        if 'teamPerformance' in data:
            print(f"\n👥 Team Performance:")
            print(f"   Team Score: {data['teamPerformance'].get('teamScore')}")
            print(f"   Active Members: {data['teamPerformance'].get('activeMembers')}")
            print(f"   Completed Tasks: {data['teamPerformance'].get('completedTasks')}")
            print(f"   Satisfaction: {data['teamPerformance'].get('satisfaction')}%")
        else:
            print("❌ HATA: 'teamPerformance' field eksik!")

        # Check approvalQueue
        if 'approvalQueue' in data:
            queue = data['approvalQueue'].get('queue', [])
            print(f"\n📋 Approval Queue:")
            print(f"   Pending Items: {len(queue)}")
            if queue:
                for item in queue[:3]:  # First 3 items
                    print(f"   - {item.get('title')} ({item.get('type')})")
        else:
            print("❌ HATA: 'approvalQueue' field eksik!")

        # Check kpis
        if 'kpis' in data:
            kpis = data['kpis'].get('kpis', [])
            print(f"\n🎯 KPIs:")
            print(f"   Total KPIs: {len(kpis)}")
            for kpi in kpis:
                print(f"   - {kpi.get('name')}: {kpi.get('current')}/{kpi.get('target')} ({kpi.get('percentage')}%)")
        else:
            print("❌ HATA: 'kpis' field eksik!")

        # Check performanceTrend
        if 'performanceTrend' in data:
            trend = data['performanceTrend'].get('trend', [])
            print(f"\n📈 Performance Trend:")
            print(f"   Data Points: {len(trend)}")
            print(f"   Current Productivity: {data['performanceTrend'].get('currentProductivity')}")
            print(f"   Current Quality: {data['performanceTrend'].get('currentQuality')}")
        else:
            print("❌ HATA: 'performanceTrend' field eksik!")
    else:
        print("❌ Dashboard data alınamadı!")

    # Test 3: Stats endpoint (MANAGER has access)
    print("\n📝 TEST 3: Dashboard Stats (/api/v1/dashboard/stats)")
    print("-" * 70)
    stats_data = helper.get("/api/v1/dashboard/stats")

    if stats_data:
        print("\n✅ Stats data alındı!")
        if 'overview' in stats_data:
            print(f"\n📊 Stats Overview:")
            print(f"   Total Candidates: {stats_data['overview'].get('totalCandidates')}")
            print(f"   Total Job Postings: {stats_data['overview'].get('totalJobPostings')}")
            print(f"   Total Analyses: {stats_data['overview'].get('totalAnalyses')}")
        else:
            print("❌ HATA: 'overview' field eksik!")
    else:
        print("❌ Stats data alınamadı!")

    # Test 4: Team endpoint (if exists)
    print("\n📝 TEST 4: Team Endpoint (/api/v1/team)")
    print("-" * 70)
    team_data = helper.get("/api/v1/team")

    if team_data:
        print("\n✅ Team data alındı!")
        users = team_data.get('users', [])
        print(f"   Team Members: {len(users)}")
        for user in users[:3]:  # First 3
            print(f"   - {user.get('firstName')} {user.get('lastName')} ({user.get('role')})")
    else:
        print("⚠️ Team endpoint bulunamadı veya erişim yok")

    # Test 5: Job Postings (MANAGER should have access)
    print("\n📝 TEST 5: Job Postings (/api/v1/job-postings)")
    print("-" * 70)
    jobs_data = helper.get("/api/v1/job-postings")

    if jobs_data:
        print("\n✅ Job postings data alındı!")
        jobs = jobs_data.get('jobPostings', [])
        print(f"   Total Job Postings: {len(jobs)}")
        for job in jobs[:3]:  # First 3
            print(f"   - {job.get('title')} ({job.get('status', 'N/A')})")
    else:
        print("❌ Job postings data alınamadı!")

    # Test 6: Candidates (MANAGER should have access)
    print("\n📝 TEST 6: Candidates (/api/v1/candidates)")
    print("-" * 70)
    candidates_data = helper.get("/api/v1/candidates")

    if candidates_data:
        print("\n✅ Candidates data alındı!")
        candidates = candidates_data.get('candidates', [])
        print(f"   Total Candidates: {len(candidates)}")
        for candidate in candidates[:3]:  # First 3
            print(f"   - {candidate.get('firstName')} {candidate.get('lastName')}")
    else:
        print("❌ Candidates data alınamadı!")

    # Test 7: Analyses (MANAGER should have access)
    print("\n📝 TEST 7: Analyses (/api/v1/analyses)")
    print("-" * 70)
    analyses_data = helper.get("/api/v1/analyses")

    if analyses_data:
        print("\n✅ Analyses data alındı!")
        analyses = analyses_data.get('analyses', [])
        print(f"   Total Analyses: {len(analyses)}")
    else:
        print("❌ Analyses data alınamadı!")

    # Test 8: Offers (MANAGER should have access)
    print("\n📝 TEST 8: Offers (/api/v1/offers)")
    print("-" * 70)
    offers_data = helper.get("/api/v1/offers")

    if offers_data:
        print("\n✅ Offers data alındı!")
        offers = offers_data.get('offers', [])
        print(f"   Total Offers: {len(offers)}")
        for offer in offers[:3]:  # First 3
            print(f"   - Offer ID: {offer.get('id')[:8]}... Status: {offer.get('status')}")
    else:
        print("❌ Offers data alınamadı!")

    # Test 9: Interviews (MANAGER should have access)
    print("\n📝 TEST 9: Interviews (/api/v1/interviews)")
    print("-" * 70)
    interviews_data = helper.get("/api/v1/interviews")

    if interviews_data:
        print("\n✅ Interviews data alındı!")
        interviews = interviews_data.get('interviews', [])
        print(f"   Total Interviews: {len(interviews)}")
    else:
        print("❌ Interviews data alınamadı!")

    # Summary
    print("\n" + "="*70)
    print("TEST SUMMARY")
    print("="*70)
    print("✅ Login: SUCCESS")
    print(f"✅ Dashboard: {'SUCCESS' if dashboard_data else 'FAILED'}")
    print(f"✅ Stats: {'SUCCESS' if stats_data else 'FAILED'}")
    print(f"⚠️ Team: {'SUCCESS' if team_data else 'NOT FOUND'}")
    print(f"✅ Job Postings: {'SUCCESS' if jobs_data else 'FAILED'}")
    print(f"✅ Candidates: {'SUCCESS' if candidates_data else 'FAILED'}")
    print(f"✅ Analyses: {'SUCCESS' if analyses_data else 'FAILED'}")
    print(f"✅ Offers: {'SUCCESS' if offers_data else 'FAILED'}")
    print(f"✅ Interviews: {'SUCCESS' if interviews_data else 'FAILED'}")
    print("="*70)

if __name__ == "__main__":
    main()
