"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/lib/store/authStore";

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, isLoading, error, clearError } =
    useAuthStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [validationError, setValidationError] = useState("");

  // Quick Login için test accounts
  const quickLoginAccounts = [
    { label: "SUPER_ADMIN (Mustafa Asan)", email: "info@gaiai.ai", password: "23235656" },
    { label: "ADMIN - Test Org 1 (FREE)", email: "test-admin@test-org-1.com", password: "TestPass123!" },
    { label: "USER - Test Org 1 (FREE)", email: "test-user@test-org-1.com", password: "TestPass123!" },
    { label: "ADMIN - Test Org 2 (PRO)", email: "test-admin@test-org-2.com", password: "TestPass123!" },
    { label: "MANAGER - Test Org 2 (PRO)", email: "test-manager@test-org-2.com", password: "TestPass123!" },
    { label: "HR_SPECIALIST - Test Org 2 (PRO)", email: "test-hr_specialist@test-org-2.com", password: "TestPass123!" },
    { label: "USER - Test Org 2 (PRO)", email: "test-user@test-org-2.com", password: "TestPass123!" },
    { label: "ADMIN - Test Org 3 (ENTERPRISE)", email: "test-admin@test-org-3.com", password: "TestPass123!" },
  ];

  const handleQuickLogin = (account: typeof quickLoginAccounts[0]) => {
    setEmail(account.email);
    setPassword(account.password);
    // Automatically submit after setting values
    setTimeout(() => {
      const form = document.querySelector('form');
      if (form) {
        form.requestSubmit();
      }
    }, 100);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError("");
    clearError();

    // Client-side validation
    if (!email || !password) {
      setValidationError("Tüm alanları doldurun");
      return;
    }

    if (!email.includes("@")) {
      setValidationError("Geçerli bir email adresi girin");
      return;
    }

    try {
      // Login first
      await login(email, password);

      // Check onboarding status
      const token = localStorage.getItem("auth_token");
      if (token) {
        const res = await fetch(
          "http://localhost:8102/api/v1/organizations/me",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (res.ok) {
          const data = await res.json();
          const org = data.data;

          // Redirect based on onboarding status
          if (org.onboardingCompleted) {
            router.push("/dashboard");
          } else {
            router.push("/onboarding");
          }
        } else {
          // Fallback to dashboard if org fetch fails
          router.push("/dashboard");
        }
      }
    } catch (err: any) {
      // useAuthStore zaten hata durumunu yönetiyor.
      // Konsola yazdırmak, geliştirme sırasında hata ayıklama için yararlıdır.
      console.error("Login error:", err);
    }
  };

  const displayError = validationError || error;

  return (
    <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 min-h-[calc(100vh-theme(spacing.64))] bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">İKAI HR</h1>
          <p className="text-gray-600 mt-2">Hesabınıza giriş yapın</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {displayError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {displayError}
            </div>
          )}

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              placeholder="ornek@email.com"
              disabled={isLoading}
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Şifre
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              placeholder="••••••••"
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Giriş yapılıyor...
              </>
            ) : (
              "Giriş Yap"
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Hesabınız yok mu?{" "}
            <Link
              href="/register"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Kayıt Ol
            </Link>
          </p>
        </div>

        {/* Quick Login for development */}
        {process.env.NODE_ENV === "development" && (
          <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border-2 border-green-200">
            <p className="text-sm text-gray-700 font-bold mb-3 flex items-center">
              <span className="mr-2">⚡</span>
              Quick Login (Dev Only)
            </p>
            <div className="space-y-2">
              {quickLoginAccounts.map((account, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleQuickLogin(account)}
                  className="w-full text-left px-3 py-2 bg-white hover:bg-green-50 border border-gray-200 hover:border-green-300 rounded-lg transition-all duration-200 text-sm text-gray-700 hover:text-green-700 font-medium"
                  disabled={isLoading}
                >
                  {account.label}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-3 text-center">
              Tıkla → Otomatik login! 🚀
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
