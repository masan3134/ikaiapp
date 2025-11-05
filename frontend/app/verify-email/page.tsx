"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/lib/store/authStore";

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUser, setToken } = useAuthStore();

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get("token");

      if (!token) {
        setStatus("error");
        setMessage("Doğrulama token'ı bulunamadı. Lütfen email'deki linki kontrol edin.");
        return;
      }

      try {
        // Call backend verification endpoint
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/verify-email/${token}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const data = await response.json();

        if (response.ok) {
          // Email verified successfully
          setStatus("success");
          setMessage(data.message || "Email başarıyla doğrulandı!");

          // Save user and token to auth store
          if (data.user && data.token) {
            setUser(data.user);
            setToken(data.token);

            // Save to localStorage for persistence
            if (typeof window !== "undefined") {
              localStorage.setItem("token", data.token);
              localStorage.setItem("user", JSON.stringify(data.user));
            }
          }

          // Redirect to onboarding after 2 seconds
          setTimeout(() => {
            window.location.href = "/onboarding";
          }, 2000);
        } else {
          // Verification failed
          setStatus("error");
          setMessage(
            data.message || "Email doğrulama başarısız. Token geçersiz veya süresi dolmuş olabilir."
          );
        }
      } catch (error) {
        console.error("Email verification error:", error);
        setStatus("error");
        setMessage("Bir hata oluştu. Lütfen tekrar deneyin.");
      }
    };

    verifyEmail();
  }, [searchParams, setUser, setToken]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              İKAI HR
            </h1>
            <p className="text-gray-600 mt-2">AI-Powered HR Platform</p>
          </div>

          {/* Status Icon */}
          <div className="flex justify-center mb-6">
            {status === "loading" && (
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600"></div>
            )}
            {status === "success" && (
              <div className="rounded-full bg-green-100 p-4">
                <svg
                  className="w-12 h-12 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            )}
            {status === "error" && (
              <div className="rounded-full bg-red-100 p-4">
                <svg
                  className="w-12 h-12 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
            )}
          </div>

          {/* Status Message */}
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {status === "loading" && "Email Doğrulanıyor..."}
              {status === "success" && "Email Doğrulandı!"}
              {status === "error" && "Doğrulama Başarısız"}
            </h2>
            <p className="text-gray-600 mb-6">{message}</p>

            {status === "success" && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <p className="text-green-800 text-sm">
                  ✅ Hesabınız aktifleştirildi!
                  <br />
                  Yönlendiriliyorsunuz...
                </p>
              </div>
            )}

            {status === "error" && (
              <div className="space-y-3">
                <button
                  onClick={() => window.location.href = "/register"}
                  className="w-full px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Yeniden Kayıt Ol
                </button>
                <button
                  onClick={() => window.location.href = "/login"}
                  className="w-full px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Giriş Yap
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Support Text */}
        <p className="text-center text-gray-600 text-sm mt-6">
          Sorun mu yaşıyorsunuz?{" "}
          <a href="mailto:info@gaiai.ai" className="text-indigo-600 hover:underline">
            Destek ekibimize ulaşın
          </a>
        </p>
      </div>
    </div>
  );
}
