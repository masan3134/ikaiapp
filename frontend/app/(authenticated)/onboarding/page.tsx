"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useOrganization } from "@/contexts/OrganizationContext";

export default function OnboardingWizard() {
  const router = useRouter();
  const { organization, refreshOrganization } = useOrganization();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);

  // Form state
  const [companyName, setCompanyName] = useState("");
  const [industry, setIndustry] = useState("");
  const [companySize, setCompanySize] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [jobDepartment, setJobDepartment] = useState("");
  const [useDemoCVs, setUseDemoCVs] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("onboarding-progress");
    if (saved) {
      const data = JSON.parse(saved);
      setCurrentStep(data.step || 0);
      setCompanyName(data.companyName || "");
      setIndustry(data.industry || "");
      setCompanySize(data.companySize || "");
    }
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem(
      "onboarding-progress",
      JSON.stringify({
        step: currentStep,
        companyName,
        industry,
        companySize,
      })
    );
  }, [currentStep, companyName, industry, companySize]);

  const updateStep = async (step: number, data?: any) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        "http://localhost:8102/api/v1/onboarding/update-step",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ step, data }),
        }
      );

      if (res.ok) {
        setCurrentStep(step);
      }
    } catch (error) {
      console.error("Update step error:", error);
    } finally {
      setLoading(false);
    }
  };

  const completeOnboarding = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        "http://localhost:8102/api/v1/onboarding/complete",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.ok) {
        localStorage.removeItem("onboarding-progress");
        await refreshOrganization();
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Complete onboarding error:", error);
    } finally {
      setLoading(false);
    }
  };

  const nextStep = async () => {
    if (currentStep === 1) {
      await updateStep(2, { name: companyName, industry, size: companySize });
    } else if (currentStep === 4) {
      await completeOnboarding();
    } else {
      await updateStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl w-full">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {[0, 1, 2, 3, 4].map((step) => (
              <div
                key={step}
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                  step <= currentStep
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {step + 1}
              </div>
            ))}
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-2 bg-blue-600 transition-all duration-300"
              style={{ width: `${((currentStep + 1) / 5) * 100}%` }}
            />
          </div>
        </div>

        {/* Step 0: Welcome */}
        {currentStep === 0 && (
          <div className="text-center">
            <div className="text-6xl mb-4">👋</div>
            <h1 className="text-3xl font-bold mb-4">IKAI'ye Hoş Geldiniz!</h1>
            <p className="text-gray-600 mb-8 text-lg">
              Yapay zeka destekli işe alım platformunuza hoş geldiniz.
              <br />
              Hadi hemen başlayalım!
            </p>
            <button
              onClick={() => setCurrentStep(1)}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium text-lg hover:bg-blue-700 transition-colors"
            >
              Başlayalım →
            </button>
          </div>
        )}

        {/* Step 1: Company Info */}
        {currentStep === 1 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Şirket Bilgileriniz</h2>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Şirket Adı *
              </label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Örn: Acme Corporation"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Sektör *</label>
              <select
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Seçiniz</option>
                <option value="Teknoloji">Teknoloji</option>
                <option value="Sağlık">Sağlık</option>
                <option value="Finans">Finans</option>
                <option value="Eğitim">Eğitim</option>
                <option value="Perakende">Perakende</option>
                <option value="İmalat">İmalat</option>
                <option value="Diğer">Diğer</option>
              </select>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">
                Şirket Büyüklüğü *
              </label>
              <select
                value={companySize}
                onChange={(e) => setCompanySize(e.target.value)}
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Seçiniz</option>
                <option value="1-10">1-10 kişi</option>
                <option value="11-50">11-50 kişi</option>
                <option value="51-200">51-200 kişi</option>
                <option value="201-500">201-500 kişi</option>
                <option value="500+">500+ kişi</option>
              </select>
            </div>

            <button
              onClick={nextStep}
              disabled={!companyName || !industry || !companySize || loading}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg w-full font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Kaydediliyor..." : "Devam Et →"}
            </button>
          </div>
        )}

        {/* Step 2: First Job Posting */}
        {currentStep === 2 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">
              İlk İş İlanınız (İsteğe Bağlı)
            </h2>
            <p className="text-gray-600 mb-6">
              Daha sonra ekleyebilirsiniz. Şimdi atlamak isterseniz "Atla"
              butonuna tıklayın.
            </p>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Pozisyon</label>
              <input
                type="text"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                className="w-full border rounded-lg px-4 py-2"
                placeholder="Örn: Senior Yazılım Geliştirici"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">
                Departman
              </label>
              <input
                type="text"
                value={jobDepartment}
                onChange={(e) => setJobDepartment(e.target.value)}
                className="w-full border rounded-lg px-4 py-2"
                placeholder="Örn: Yazılım"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setCurrentStep(3)}
                className="flex-1 border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50"
              >
                Atla
              </button>
              <button
                onClick={nextStep}
                className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700"
              >
                Devam Et →
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Demo CVs */}
        {currentStep === 3 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Demo CV'ler</h2>
            <p className="text-gray-600 mb-6">
              Platformu test etmek için örnek CV'ler yüklemek ister misiniz?
            </p>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <label className="flex items-start cursor-pointer">
                <input
                  type="checkbox"
                  checked={useDemoCVs}
                  onChange={(e) => setUseDemoCVs(e.target.checked)}
                  className="mt-1 mr-3"
                />
                <div>
                  <div className="font-medium">Evet, demo CV'leri kullan</div>
                  <div className="text-sm text-gray-600">
                    3 örnek CV otomatik olarak sisteme eklenecek
                  </div>
                </div>
              </label>
            </div>

            <button
              onClick={() => setCurrentStep(4)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg w-full font-medium hover:bg-blue-700"
            >
              Devam Et →
            </button>
          </div>
        )}

        {/* Step 4: Complete */}
        {currentStep === 4 && (
          <div className="text-center">
            <div className="text-6xl mb-4">✅</div>
            <h2 className="text-2xl font-bold mb-4">Tamamlandı!</h2>
            <p className="text-gray-600 mb-8">
              Artık IKAI platformunu kullanmaya hazırsınız!
            </p>
            <button
              onClick={completeOnboarding}
              disabled={loading}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium text-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Tamamlanıyor..." : "Dashboard'a Git →"}
            </button>
          </div>
        )}

        {/* Back Button */}
        {currentStep > 0 && currentStep < 4 && (
          <button
            onClick={prevStep}
            className="mt-4 text-gray-600 hover:text-gray-800 transition-colors"
          >
            ← Geri
          </button>
        )}
      </div>
    </div>
  );
}
