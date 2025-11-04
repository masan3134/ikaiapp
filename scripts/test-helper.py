#!/usr/bin/env python3
"""
IKAI Test Helper Script
Kullanım: Worker'ların API testlerini kolaylaştırır
"""

import requests
import json
import sys
from typing import Optional, Dict

# Backend URL
BASE_URL = "http://localhost:8102"

class IKAITestHelper:
    def __init__(self):
        self.token: Optional[str] = None
        self.user_info: Optional[Dict] = None

    def login(self, email: str, password: str) -> bool:
        """
        Kullanıcı girişi yap ve token al

        Örnek:
        helper.login("test-hr_specialist@test-org-1.com", "TestPass123!")
        """
        try:
            response = requests.post(
                f"{BASE_URL}/api/v1/auth/login",
                json={"email": email, "password": password},
                headers={"Content-Type": "application/json"}
            )

            if response.status_code == 200:
                data = response.json()
                self.token = data.get("token")
                self.user_info = data.get("user")

                print(f"✅ Login başarılı!")
                print(f"   Email: {email}")
                print(f"   Rol: {self.user_info.get('role')}")
                print(f"   Organizasyon: {self.user_info.get('organizationId')}")
                print(f"   Token: {self.token[:20]}...")
                return True
            else:
                print(f"❌ Login başarısız! Status: {response.status_code}")
                print(f"   Hata: {response.text}")
                return False

        except Exception as e:
            print(f"❌ Hata: {e}")
            return False

    def get(self, endpoint: str) -> Optional[Dict]:
        """
        GET request yap

        Örnek:
        helper.get("/api/v1/job-postings")
        """
        if not self.token:
            print("❌ Önce login olmalısınız!")
            return None

        try:
            response = requests.get(
                f"{BASE_URL}{endpoint}",
                headers={
                    "Authorization": f"Bearer {self.token}",
                    "Content-Type": "application/json"
                }
            )

            print(f"\n{'='*60}")
            print(f"GET {endpoint}")
            print(f"Status: {response.status_code}")
            print(f"{'='*60}")

            if response.status_code == 200:
                data = response.json()
                print(json.dumps(data, indent=2, ensure_ascii=False))
                return data
            else:
                print(f"Hata: {response.text}")
                return None

        except Exception as e:
            print(f"❌ Hata: {e}")
            return None

    def post(self, endpoint: str, data: Dict) -> Optional[Dict]:
        """
        POST request yap

        Örnek:
        helper.post("/api/v1/job-postings", {...})
        """
        if not self.token:
            print("❌ Önce login olmalısınız!")
            return None

        try:
            response = requests.post(
                f"{BASE_URL}{endpoint}",
                json=data,
                headers={
                    "Authorization": f"Bearer {self.token}",
                    "Content-Type": "application/json"
                }
            )

            print(f"\n{'='*60}")
            print(f"POST {endpoint}")
            print(f"Status: {response.status_code}")
            print(f"{'='*60}")

            if response.status_code in [200, 201]:
                result = response.json()
                print(json.dumps(result, indent=2, ensure_ascii=False))
                return result
            else:
                print(f"Hata: {response.text}")
                return None

        except Exception as e:
            print(f"❌ Hata: {e}")
            return None

    def put(self, endpoint: str, data: Dict) -> Optional[Dict]:
        """
        PUT request yap
        """
        if not self.token:
            print("❌ Önce login olmalısınız!")
            return None

        try:
            response = requests.put(
                f"{BASE_URL}{endpoint}",
                json=data,
                headers={
                    "Authorization": f"Bearer {self.token}",
                    "Content-Type": "application/json"
                }
            )

            print(f"\n{'='*60}")
            print(f"PUT {endpoint}")
            print(f"Status: {response.status_code}")
            print(f"{'='*60}")

            if response.status_code == 200:
                result = response.json()
                print(json.dumps(result, indent=2, ensure_ascii=False))
                return result
            else:
                print(f"Hata: {response.text}")
                return None

        except Exception as e:
            print(f"❌ Hata: {e}")
            return None

    def delete(self, endpoint: str) -> bool:
        """
        DELETE request yap
        """
        if not self.token:
            print("❌ Önce login olmalısınız!")
            return False

        try:
            response = requests.delete(
                f"{BASE_URL}{endpoint}",
                headers={
                    "Authorization": f"Bearer {self.token}",
                    "Content-Type": "application/json"
                }
            )

            print(f"\n{'='*60}")
            print(f"DELETE {endpoint}")
            print(f"Status: {response.status_code}")
            print(f"{'='*60}")

            if response.status_code == 200:
                print("✅ Silme başarılı!")
                return True
            else:
                print(f"Hata: {response.text}")
                return False

        except Exception as e:
            print(f"❌ Hata: {e}")
            return False


# Test kullanıcıları
TEST_USERS = {
    "org1_admin": {
        "email": "test-admin@test-org-1.com",
        "password": "TestPass123!",
        "org": "Test Organization Free (Technology/FREE)"
    },
    "org1_hr": {
        "email": "test-hr_specialist@test-org-1.com",
        "password": "TestPass123!",
        "org": "Test Organization Free (Technology/FREE)"
    },
    "org2_manager": {
        "email": "test-manager@test-org-2.com",
        "password": "TestPass123!",
        "org": "Test Organization Pro (Healthcare/PRO)"
    },
    "org2_hr": {
        "email": "test-hr_specialist@test-org-2.com",
        "password": "TestPass123!",
        "org": "Test Organization Pro (Healthcare/PRO)"
    },
    "org3_admin": {
        "email": "test-admin@test-org-3.com",
        "password": "TestPass123!",
        "org": "Test Organization Enterprise (Finance/ENTERPRISE)"
    },
    "super_admin": {
        "email": "info@gaiai.ai",
        "password": "23235656",
        "org": "SUPER_ADMIN (All organizations)"
    }
}


def print_help():
    """Yardım mesajı"""
    print("""
╔════════════════════════════════════════════════════════════╗
║          IKAI Test Helper - Kullanım Kılavuzu             ║
╚════════════════════════════════════════════════════════════╝

1. PYTHON INTERACTIVE MODE:
   python3 -i scripts/test-helper.py

   Sonra:
   >>> helper = IKAITestHelper()
   >>> helper.login("test-hr_specialist@test-org-1.com", "TestPass123!")
   >>> helper.get("/api/v1/job-postings")
   >>> helper.post("/api/v1/job-postings", {...})

2. TEST KULLANICILARI:
   TEST_USERS dictionary'sinde hazır kullanıcılar var:
   >>> user = TEST_USERS["org1_hr"]
   >>> helper.login(user["email"], user["password"])

3. ÖRNEKLERİ ÇALIŞTIR:
   python3 scripts/test-helper.py example_job_postings
   python3 scripts/test-helper.py example_candidates

4. WORKER İÇİN KULLANIM:
   - Python interactive mode aç
   - Login ol
   - GET/POST/PUT/DELETE yap
   - Terminal çıktısını kopyala
   - MD raporuna yapıştır

Test kullanıcıları:
""")
    for key, user in TEST_USERS.items():
        print(f"  {key:20s} → {user['email']:45s} | {user['org']}")
    print()


def example_job_postings():
    """İş ilanları örnek test"""
    print("\n🔍 ÖRNEK: İş İlanları Testi\n")

    helper = IKAITestHelper()

    # Org 1 - HR ile login
    print("\n[1/3] Test Org 1 - HR Specialist ile login...")
    user = TEST_USERS["org1_hr"]
    if not helper.login(user["email"], user["password"]):
        return

    # İlanları listele
    print("\n[2/3] İş ilanlarını listele...")
    job_postings = helper.get("/api/v1/job-postings")

    if job_postings and "jobPostings" in job_postings:
        count = len(job_postings["jobPostings"])
        print(f"\n✅ {count} ilan bulundu")

    # Yeni ilan oluştur
    print("\n[3/3] Yeni ilan oluştur...")
    new_job = {
        "title": "Test - Junior Frontend Developer",
        "department": "Engineering",
        "location": "İstanbul - Remote",
        "employmentType": "FULL_TIME",
        "experienceLevel": "JUNIOR",
        "description": "Test için oluşturulmuş ilan",
        "requirements": "React, TypeScript, Next.js",
        "responsibilities": "Frontend geliştirme",
        "benefits": "Esnek çalışma, uzaktan çalışma"
    }

    result = helper.post("/api/v1/job-postings", new_job)
    if result:
        print(f"\n✅ Ilan ID: {result.get('jobPosting', {}).get('id')}")


def example_candidates():
    """Adaylar örnek test"""
    print("\n🔍 ÖRNEK: Adaylar Testi\n")

    helper = IKAITestHelper()

    # Org 2 - Manager ile login
    print("\n[1/2] Test Org 2 - Manager ile login...")
    user = TEST_USERS["org2_manager"]
    if not helper.login(user["email"], user["password"]):
        return

    # Adayları listele
    print("\n[2/2] Adayları listele...")
    candidates = helper.get("/api/v1/candidates")

    if candidates and "candidates" in candidates:
        count = len(candidates["candidates"])
        print(f"\n✅ {count} aday bulundu")


if __name__ == "__main__":
    if len(sys.argv) > 1:
        command = sys.argv[1]

        if command == "example_job_postings":
            example_job_postings()
        elif command == "example_candidates":
            example_candidates()
        elif command == "help":
            print_help()
        else:
            print(f"❌ Bilinmeyen komut: {command}")
            print_help()
    else:
        print_help()
        print("\n💡 Interactive mode için:")
        print("   python3 -i scripts/test-helper.py")
        print("\n   Sonra:")
        print("   >>> helper = IKAITestHelper()")
        print("   >>> user = TEST_USERS['org1_hr']")
        print("   >>> helper.login(user['email'], user['password'])")
        print("   >>> helper.get('/api/v1/job-postings')")
