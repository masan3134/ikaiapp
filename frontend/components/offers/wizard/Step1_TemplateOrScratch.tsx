"use client";

import { useState, useEffect } from "react";
import {
  useOfferWizardStore,
  type OfferTemplate,
  type Candidate,
} from "@/lib/store/offerWizardStore";
import { getAuthToken } from "@/services/auth";
import { Sparkles, FileText, User, TrendingUp } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8102"; // W1 FIX: was 3001

export default function Step1_TemplateOrScratch() {
  const {
    creationMode,
    selectedCandidate,
    setCreationMode,
    setCandidate,
    setTemplate,
    setLoading,
    setError,
  } = useOfferWizardStore();

  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [templates, setTemplates] = useState<OfferTemplate[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [showTemplates, setShowTemplates] = useState(false);

  useEffect(() => {
    loadInitialData();
  }, []);

  async function loadInitialData() {
    try {
      setLoadingData(true);
      const token = getAuthToken();

      const [candidatesRes, templatesRes] = await Promise.all([
        fetch(`${API_URL}/api/v1/candidates?page=1&limit=100`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_URL}/api/v1/offer-templates?isActive=true`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const candidatesData = await candidatesRes.json();
      const templatesData = await templatesRes.json();

      setCandidates(candidatesData.candidates || candidatesData.data || []);
      setTemplates(templatesData.data || []);
    } catch (error) {
      console.error("Error loading data:", error);
      setError("Veri yüklenirken hata oluştu");
    } finally {
      setLoadingData(false);
    }
  }

  function handleTemplateSelect(template: OfferTemplate) {
    setTemplate(template);
    setCreationMode("template");
    setShowTemplates(false);
  }

  if (loadingData) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Veriler yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (showTemplates) {
    return (
      <div>
        <button
          onClick={() => setShowTemplates(false)}
          className="text-blue-600 hover:text-blue-800 mb-4"
        >
          ← Geri Dön
        </button>

        <h2 className="text-2xl font-bold text-gray-900 mb-6">Şablon Seç</h2>

        {templates.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">Henüz şablon oluşturulmamış</p>
            <button
              onClick={() => setShowTemplates(false)}
              className="text-blue-600 hover:text-blue-800"
            >
              Şablonsuz devam et →
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {templates.map((template) => (
              <div
                key={template.id}
                className="border border-gray-200 rounded-lg p-4 hover:border-blue-500 hover:shadow-md transition cursor-pointer"
                onClick={() => handleTemplateSelect(template)}
              >
                <div className="flex items-start justify-between mb-3">
                  <FileText className="w-6 h-6 text-blue-600" />
                  <span className="text-xs text-gray-500">
                    {template.usageCount}x kullanıldı
                  </span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  {template.name}
                </h3>
                {template.description && (
                  <p className="text-sm text-gray-600 mb-3">
                    {template.description}
                  </p>
                )}
                <div className="text-sm text-gray-700 space-y-1">
                  <p>
                    💰 {template.salaryMin.toLocaleString()} -{" "}
                    {template.salaryMax.toLocaleString()} {template.currency}
                  </p>
                  <p>
                    🏠{" "}
                    {template.workType === "office"
                      ? "Ofis"
                      : template.workType === "hybrid"
                        ? "Hibrit"
                        : "Remote"}
                  </p>
                </div>
                <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
                  Bu Şablonu Seç
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        Nasıl başlamak istersiniz?
      </h2>
      <p className="text-gray-600 mb-8">
        Şablondan hızlıca başlayın veya sıfırdan oluşturun
      </p>

      {/* Creation Mode Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Template Mode */}
        <div
          className={`
            border-2 rounded-lg p-6 transition-all
            ${creationMode === "template" ? "border-blue-600 bg-blue-50" : "border-gray-200"}
          `}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Şablondan Oluştur</h3>
              <p className="text-sm text-gray-600">Hazır şablonları kullan</p>
            </div>
          </div>
          <p className="text-gray-700 mb-4">
            Önceden hazırlanmış şablonlardan birini seçin ve özelleştirin.
          </p>
          <div className="flex items-center text-sm text-gray-600">
            <span className="mr-2">⏱️</span>
            Tahmini süre: ~1 dakika
          </div>
          <button
            onClick={() => setShowTemplates(true)}
            className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Şablonları Görüntüle ({templates.length})
          </button>
        </div>

        {/* Scratch Mode */}
        <div
          className={`
            border-2 rounded-lg p-6 transition-all
            ${creationMode === "scratch" ? "border-purple-600 bg-purple-50" : "border-gray-200"}
          `}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Sıfırdan Oluştur</h3>
              <p className="text-sm text-gray-600">Manuel olarak gir</p>
            </div>
          </div>
          <p className="text-gray-700 mb-4">
            Kendi teklif bilgilerinizi baştan sona manuel olarak girin.
          </p>
          <div className="flex items-center text-sm text-gray-600">
            <span className="mr-2">⏱️</span>
            Tahmini süre: ~3 dakika
          </div>
          <button
            onClick={() => setCreationMode("scratch")}
            className="mt-4 w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition"
          >
            Manuel Başla →
          </button>
        </div>
      </div>

      {/* Candidate Selection */}
      <div className="border-t border-gray-200 pt-8">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Aday Seçimi *</h3>
        <p className="text-gray-600 mb-4">
          Teklif göndermek istediğiniz adayı seçin
        </p>

        {candidates.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <User className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">Henüz aday bulunmuyor</p>
            <button
              onClick={() => window.open("/candidates", "_blank")}
              className="mt-4 text-blue-600 hover:text-blue-800 font-medium"
            >
              Aday Ekle →
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {candidates.slice(0, 10).map((candidate) => (
              <div
                key={candidate.id}
                onClick={() => setCandidate(candidate)}
                className={`
                  flex items-center justify-between p-4 border-2 rounded-lg cursor-pointer transition-all
                  ${selectedCandidate?.id === candidate.id ? "border-blue-600 bg-blue-50" : "border-gray-200 hover:border-blue-400"}
                `}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold">
                      {candidate.firstName?.[0] || "?"}
                      {candidate.lastName?.[0] || "?"}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {candidate.firstName && candidate.lastName
                        ? `${candidate.firstName} ${candidate.lastName}`
                        : candidate.email ||
                          candidate.sourceFileName ||
                          "İsimsiz Aday"}
                    </p>
                    <p className="text-sm text-gray-600">
                      {candidate.email || "Email yok"}
                    </p>
                  </div>
                </div>
                {selectedCandidate?.id === candidate.id && (
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">✓</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
