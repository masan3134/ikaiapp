"use client";

import { useRouter } from "next/navigation";
import { useOfferWizardStore } from "@/lib/store/offerWizardStore";
import Step1_TemplateOrScratch from "@/components/offers/wizard/Step1_TemplateOrScratch";
import Step2_OfferDetails from "@/components/offers/wizard/Step2_OfferDetails";
import Step3_Summary from "@/components/offers/wizard/Step3_Summary";
import { ChevronLeft, ChevronRight, FileText } from "lucide-react";
import { withRoleProtection } from "@/lib/hoc/withRoleProtection";
import { RoleGroups } from "@/lib/constants/roles";

function OfferWizardPage() {
  const router = useRouter();
  const {
    currentStep,
    nextStep,
    prevStep,
    resetWizard,
    canProceedToStep2,
    canProceedToStep3,
    loading,
  } = useOfferWizardStore();

  const steps = [
    { number: 1, title: "Başlangıç", component: Step1_TemplateOrScratch },
    { number: 2, title: "Detaylar", component: Step2_OfferDetails },
    { number: 3, title: "Özet & Gönder", component: Step3_Summary },
  ];

  const CurrentStepComponent = steps[currentStep - 1].component;

  const canProceed = () => {
    if (currentStep === 1) return canProceedToStep2();
    if (currentStep === 2) return canProceedToStep3();
    return true;
  };

  const handleNext = () => {
    if (!canProceed()) return;
    nextStep();
  };

  const handlePrev = () => {
    prevStep();
  };

  const handleCancel = () => {
    if (
      confirm(
        "Wizard'dan çıkmak istediğinize emin misiniz? Tüm değişiklikler kaybedilecek."
      )
    ) {
      resetWizard();
      router.push("/offers");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={handleCancel}
            className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            Vazgeç
          </button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Yeni Teklif Oluştur
              </h1>
              <p className="text-gray-600">
                Adım {currentStep}/3: {steps[currentStep - 1].title}
              </p>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.number} className="flex-1 flex items-center">
                {/* Step Circle */}
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`
                      w-10 h-10 rounded-full flex items-center justify-center font-semibold
                      transition-all duration-200
                      ${
                        currentStep > step.number
                          ? "bg-green-500 text-white"
                          : currentStep === step.number
                            ? "bg-blue-600 text-white ring-4 ring-blue-100"
                            : "bg-gray-200 text-gray-500"
                      }
                    `}
                  >
                    {currentStep > step.number ? "✓" : step.number}
                  </div>
                  <span
                    className={`
                      mt-2 text-sm font-medium
                      ${currentStep >= step.number ? "text-gray-900" : "text-gray-500"}
                    `}
                  >
                    {step.title}
                  </span>
                </div>

                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div
                    className={`
                      h-1 flex-1 mx-2 transition-all duration-200
                      ${currentStep > step.number ? "bg-green-500" : "bg-gray-200"}
                    `}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <CurrentStepComponent />
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center">
          <button
            onClick={handlePrev}
            disabled={currentStep === 1}
            className="
              flex items-center gap-2 px-6 py-3 rounded-lg font-medium
              transition-all duration-200
              disabled:opacity-40 disabled:cursor-not-allowed
              text-gray-700 border border-gray-300 hover:bg-gray-50
            "
          >
            <ChevronLeft className="w-5 h-5" />
            Geri
          </button>

          {currentStep < 3 && (
            <button
              onClick={handleNext}
              disabled={!canProceed() || loading}
              className="
                flex items-center gap-2 px-8 py-3 rounded-lg font-semibold
                transition-all duration-200
                disabled:opacity-40 disabled:cursor-not-allowed
                bg-blue-600 hover:bg-blue-700 text-white
                shadow-lg hover:shadow-xl
              "
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  İşleniyor...
                </>
              ) : (
                <>
                  İleri
                  <ChevronRight className="w-5 h-5" />
                </>
              )}
            </button>
          )}
        </div>

        {/* Helper Text */}
        {!canProceed() && currentStep < 3 && (
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              {currentStep === 1 &&
                "Devam etmek için aday seçimi ve oluşturma modu zorunludur"}
              {currentStep === 2 &&
                "Devam etmek için tüm zorunlu alanları doldurun"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default withRoleProtection(OfferWizardPage, {
  allowedRoles: RoleGroups.HR_MANAGERS,
});
