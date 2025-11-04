"use client";

import { useState } from "react";
import { X, Mail, FileSpreadsheet, FileText, Download } from "lucide-react";

interface EmailExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  analysisId: string;
  onSuccess?: () => void;
}

export default function EmailExportModal({
  isOpen,
  onClose,
  analysisId,
  onSuccess,
}: EmailExportModalProps) {
  const [email, setEmail] = useState("");
  const [formats, setFormats] = useState<string[]>(["html"]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_URL;
      if (!API_BASE) {
        throw new Error("API URL is not configured");
      }
      const token = localStorage.getItem("auth_token");

      const response = await fetch(
        `${API_BASE}/api/v1/analyses/${analysisId}/send-email`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            recipientEmail: email,
            formats,
          }),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Email gönderilemedi");
      }

      onSuccess?.();
      onClose();
      setEmail("");
      setFormats(["html"]);
    } catch (err: any) {
      setError(err.message || "Bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  const toggleFormat = (format: string) => {
    setFormats((prev) =>
      prev.includes(format)
        ? prev.filter((f) => f !== format)
        : [...prev, format]
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-900">
            📧 Email ile Gönder
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* Email Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Alıcı Email Adresi
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ornek@email.com"
                required
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Format Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Gönderilecek Formatlar
            </label>
            <div className="space-y-2">
              <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="checkbox"
                  checked={formats.includes("html")}
                  onChange={() => toggleFormat("html")}
                  className="w-5 h-5 text-purple-600 rounded focus:ring-2 focus:ring-purple-500"
                />
                <FileText className="w-5 h-5 text-purple-600" />
                <div className="flex-1">
                  <div className="font-medium text-gray-900">HTML Rapor</div>
                  <div className="text-xs text-gray-500">
                    Yazdırılabilir, görsel rapor
                  </div>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="checkbox"
                  checked={formats.includes("xlsx")}
                  onChange={() => toggleFormat("xlsx")}
                  className="w-5 h-5 text-green-600 rounded focus:ring-2 focus:ring-green-500"
                />
                <FileSpreadsheet className="w-5 h-5 text-green-600" />
                <div className="flex-1">
                  <div className="font-medium text-gray-900">Excel</div>
                  <div className="text-xs text-gray-500">
                    Tüm veriler, tablolar
                  </div>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="checkbox"
                  checked={formats.includes("csv")}
                  onChange={() => toggleFormat("csv")}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <Download className="w-5 h-5 text-blue-600" />
                <div className="flex-1">
                  <div className="font-medium text-gray-900">CSV</div>
                  <div className="text-xs text-gray-500">
                    Ham veri, import uyumlu
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={loading || formats.length === 0}
              className="flex-1 px-4 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Gönderiliyor..." : "📧 Gönder"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
