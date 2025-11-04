#!/usr/bin/env python3
"""
W1: USER Dashboard Full Test
Login as USER and test all functionality
"""
import requests
import json
import sys

BASE_URL = "http://localhost:8102/api/v1"
FRONTEND_URL = "http://localhost:8103"

def login(email, password):
    """Login and get token"""
    response = requests.post(
        f"{BASE_URL}/auth/login",
        json={"email": email, "password": password}
    )
    data = response.json()
    if "token" in data:
        return data["token"], data.get("user")
    else:
        raise Exception(f"Login failed: {data}")

def test_dashboard(token):
    """Test USER dashboard endpoint"""
    response = requests.get(
        f"{BASE_URL}/dashboard/user",
        headers={"Authorization": f"Bearer {token}"}
    )
    return response.status_code, response.json()

def test_health():
    """Test health endpoint"""
    response = requests.get("http://localhost:8102/health")
    return response.status_code, response.json()

def test_notifications(token):
    """Test notifications endpoint"""
    response = requests.get(
        f"{BASE_URL}/notifications",
        headers={"Authorization": f"Bearer {token}"}
    )
    return response.status_code, response.json()

def test_profile(token):
    """Test profile endpoint"""
    response = requests.get(
        f"{BASE_URL}/user/profile",
        headers={"Authorization": f"Bearer {token}"}
    )
    return response.status_code, response.json()

def main():
    print("=" * 70)
    print("W1: USER Dashboard Full Test")
    print("=" * 70)
    print()

    errors = []
    warnings = []

    # Test 1: Login
    print("1️⃣  Login as USER...")
    try:
        token, user = login("test-user@test-org-1.com", "TestPass123!")
        print(f"   ✅ Login successful")
        print(f"   User: {user.get('email')} ({user.get('role')})")
        print(f"   Token: {token[:30]}...")
    except Exception as e:
        print(f"   ❌ Login FAILED: {e}")
        errors.append(f"Login failed: {e}")
        sys.exit(1)
    print()

    # Test 2: Health Check
    print("2️⃣  Health Check...")
    try:
        status, data = test_health()
        if status == 200:
            print(f"   ✅ Status: {status}")
            print(f"   Backend: {data.get('status')}")
            print(f"   Database: {data.get('services', {}).get('database')}")
            print(f"   Redis: {data.get('services', {}).get('redis')}")

            # Check for issues
            if data.get('status') != 'ok':
                warnings.append(f"Backend status: {data.get('status')}")
            if data.get('services', {}).get('database') != 'connected':
                errors.append(f"Database not connected: {data.get('services', {}).get('database')}")
        else:
            print(f"   ❌ Status: {status}")
            errors.append(f"Health check failed: {status}")
    except Exception as e:
        print(f"   ❌ FAILED: {e}")
        errors.append(f"Health check error: {e}")
    print()

    # Test 3: Dashboard
    print("3️⃣  USER Dashboard...")
    try:
        status, data = test_dashboard(token)
        if status == 200:
            print(f"   ✅ Status: {status}")

            # Check data structure
            dashboard_data = data.get('data', {})

            # Profile
            profile = dashboard_data.get('profile', {})
            print(f"   Profile completion: {profile.get('completion')}%")

            # Notifications
            notifications = dashboard_data.get('notifications', {})
            print(f"   Unread notifications: {notifications.get('unread')}")

            # Activity
            activity = dashboard_data.get('activity', {})
            print(f"   Login time: {activity.get('loginTime')}")

            # Activity timeline
            timeline = dashboard_data.get('activityTimeline', [])
            print(f"   Activity timeline: {len(timeline)} days")

            # Recent notifications
            recent = dashboard_data.get('recentNotifications', [])
            print(f"   Recent notifications: {len(recent)} items")

            # Validation checks
            if profile.get('completion') is None:
                errors.append("Profile completion missing")

            if notifications.get('unread') is None:
                errors.append("Notification count missing")

            if not activity.get('loginTime'):
                warnings.append("Login time missing")

            if len(timeline) != 7:
                warnings.append(f"Activity timeline should be 7 days, got {len(timeline)}")

        else:
            print(f"   ❌ Status: {status}")
            print(f"   Response: {json.dumps(data, indent=2)}")
            errors.append(f"Dashboard request failed: {status}")
    except Exception as e:
        print(f"   ❌ FAILED: {e}")
        errors.append(f"Dashboard error: {e}")
    print()

    # Test 4: Notifications
    print("4️⃣  Notifications...")
    try:
        status, data = test_notifications(token)
        if status == 200:
            print(f"   ✅ Status: {status}")
            notifications = data.get('notifications', [])
            print(f"   Total: {len(notifications)} notifications")
        elif status == 404:
            print(f"   ⚠️  Endpoint not found (status: {status})")
            warnings.append("Notifications endpoint not found")
        else:
            print(f"   ❌ Status: {status}")
            errors.append(f"Notifications request failed: {status}")
    except Exception as e:
        print(f"   ⚠️  FAILED: {e}")
        warnings.append(f"Notifications error: {e}")
    print()

    # Test 5: Profile
    print("5️⃣  User Profile...")
    try:
        status, data = test_profile(token)
        if status == 200:
            print(f"   ✅ Status: {status}")
            user_data = data.get('user', {})
            print(f"   Email: {user_data.get('email')}")
            print(f"   Role: {user_data.get('role')}")
            print(f"   Organization: {user_data.get('organizationId')}")
        elif status == 404:
            print(f"   ⚠️  Endpoint not found (status: {status})")
            warnings.append("Profile endpoint not found")
        else:
            print(f"   ❌ Status: {status}")
            errors.append(f"Profile request failed: {status}")
    except Exception as e:
        print(f"   ⚠️  FAILED: {e}")
        warnings.append(f"Profile error: {e}")
    print()

    # Summary
    print("=" * 70)
    print("SUMMARY")
    print("=" * 70)

    if errors:
        print(f"\n❌ ERRORS ({len(errors)}):")
        for i, error in enumerate(errors, 1):
            print(f"   {i}. {error}")

    if warnings:
        print(f"\n⚠️  WARNINGS ({len(warnings)}):")
        for i, warning in enumerate(warnings, 1):
            print(f"   {i}. {warning}")

    if not errors and not warnings:
        print("\n✅ ALL TESTS PASSED!")
    elif not errors:
        print(f"\n⚠️  TESTS PASSED WITH WARNINGS ({len(warnings)})")
    else:
        print(f"\n❌ TESTS FAILED ({len(errors)} errors, {len(warnings)} warnings)")
        sys.exit(1)

if __name__ == "__main__":
    main()
