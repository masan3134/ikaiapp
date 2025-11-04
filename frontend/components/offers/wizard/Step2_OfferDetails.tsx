"use client";

import { useOfferWizardStore } from "@/lib/store/offerWizardStore";

export default function Step2_OfferDetails() {
  const { selectedTemplate, formData, updateFormData } = useOfferWizardStore();

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        Teklif Detayları
      </h2>
      {selectedTemplate && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6">
          <p className="text-sm text-blue-800">
            ℹ️ "<strong>{selectedTemplate.name}</strong>" şablonundan değerler
            yüklendi
          </p>
        </div>
      )}

      {/* Form fields - Implementation continues here */}
      <div className="space-y-6">
        {/* Position */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Pozisyon <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.position}
            onChange={(e) => updateFormData({ position: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900"
            placeholder="Örn: Senior Full Stack Developer"
            required
          />
        </div>

        {/* Department */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Departman <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.department}
            onChange={(e) => updateFormData({ department: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900"
            placeholder="Örn: Engineering"
            required
          />
        </div>

        {/* Salary */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Maaş <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={formData.salary}
              onChange={(e) =>
                updateFormData({ salary: parseInt(e.target.value) || 0 })
              }
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900"
              placeholder="45000"
              required
              min="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Para Birimi
            </label>
            <select
              value={formData.currency}
              onChange={(e) => updateFormData({ currency: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900"
            >
              <option value="TRY">TRY (₺)</option>
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
            </select>
          </div>
        </div>

        {/* Start Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Başlangıç Tarihi <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            value={formData.startDate}
            onChange={(e) => updateFormData({ startDate: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900"
            required
            min={new Date().toISOString().split("T")[0]}
          />
        </div>

        {/* Work Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Çalışma Şekli
          </label>
          <div className="flex gap-4">
            {[
              { value: "office", label: "Ofis" },
              { value: "hybrid", label: "Hibrit" },
              { value: "remote", label: "Uzaktan" },
            ].map((option) => (
              <label
                key={option.value}
                className="flex items-center text-gray-700"
              >
                <input
                  type="radio"
                  name="workType"
                  value={option.value}
                  checked={formData.workType === option.value}
                  onChange={(e) =>
                    updateFormData({ workType: e.target.value as any })
                  }
                  className="mr-2"
                />
                {option.label}
              </label>
            ))}
          </div>
        </div>

        {/* Benefits */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Yan Haklar
          </label>
          <div className="space-y-3">
            <label className="flex items-center text-gray-700">
              <input
                type="checkbox"
                checked={formData.benefits.insurance}
                onChange={(e) =>
                  updateFormData({
                    benefits: {
                      ...formData.benefits,
                      insurance: e.target.checked,
                    },
                  })
                }
                className="mr-3 h-4 w-4"
              />
              Özel Sağlık Sigortası
            </label>

            <div>
              <label className="flex items-center mb-2 text-gray-700">
                <input
                  type="checkbox"
                  checked={formData.benefits.meal > 0}
                  onChange={(e) =>
                    updateFormData({
                      benefits: {
                        ...formData.benefits,
                        meal: e.target.checked ? 1500 : 0,
                      },
                    })
                  }
                  className="mr-3 h-4 w-4"
                />
                Yemek Kartı
              </label>
              {formData.benefits.meal > 0 && (
                <input
                  type="number"
                  value={formData.benefits.meal}
                  onChange={(e) =>
                    updateFormData({
                      benefits: {
                        ...formData.benefits,
                        meal: parseInt(e.target.value) || 0,
                      },
                    })
                  }
                  className="ml-7 border border-gray-300 rounded px-3 py-1 w-32 text-gray-900"
                  placeholder="₺/ay"
                />
              )}
            </div>

            <label className="flex items-center text-gray-700">
              <input
                type="checkbox"
                checked={formData.benefits.transportation}
                onChange={(e) =>
                  updateFormData({
                    benefits: {
                      ...formData.benefits,
                      transportation: e.target.checked,
                    },
                  })
                }
                className="mr-3 h-4 w-4"
              />
              Ulaşım Desteği
            </label>

            <label className="flex items-center text-gray-700">
              <input
                type="checkbox"
                checked={formData.benefits.gym}
                onChange={(e) =>
                  updateFormData({
                    benefits: { ...formData.benefits, gym: e.target.checked },
                  })
                }
                className="mr-3 h-4 w-4"
              />
              Spor Salonu Üyeliği
            </label>

            <label className="flex items-center text-gray-700">
              <input
                type="checkbox"
                checked={formData.benefits.education}
                onChange={(e) =>
                  updateFormData({
                    benefits: {
                      ...formData.benefits,
                      education: e.target.checked,
                    },
                  })
                }
                className="mr-3 h-4 w-4"
              />
              Eğitim Desteği
            </label>
          </div>
        </div>

        {/* Terms */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Şartlar ve Koşullar (opsiyonel)
          </label>
          <textarea
            value={formData.terms}
            onChange={(e) => updateFormData({ terms: e.target.value })}
            rows={6}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900"
            placeholder="Örn: Çalışma saatleri 09:00-18:00. Deneme süresi 3 ay. Yıllık izin 14 gün."
          />
        </div>
      </div>
    </div>
  );
}
