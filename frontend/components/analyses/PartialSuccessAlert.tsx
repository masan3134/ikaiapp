"use client";

import { AlertTriangle, X } from "lucide-react";
import { useState } from "react";

interface AnalysisError {
  candidateId?: string;
  fileName?: string;
  error: string;
  details?: string[];
}

interface PartialSuccessAlertProps {
  errorMessage: string | null;
  successCount: number;
}

export default function PartialSuccessAlert({
  errorMessage,
  successCount,
}: PartialSuccessAlertProps) {
  const [isVisible, setIsVisible] = useState(true);

  if (!errorMessage || !isVisible) return null;

  let errors: AnalysisError[] = [];
  try {
    errors = JSON.parse(errorMessage);
  } catch (e) {
    return null;
  }

  if (errors.length === 0) return null;

  const failedCount = errors.length;

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 flex-1">
          <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="font-semibold text-yellow-900 mb-2">
              Kismi Basari: {successCount} aday basarili, {failedCount} aday
              islenemedi
            </h4>
            <p className="text-sm text-yellow-800 mb-3">
              Asagidaki adaylar cesitli nedenlerle analiz edilemedi. Lutfen CV
              dosyalarini kontrol edin.
            </p>
            <div className="space-y-2">
              {errors.map((err, idx) => (
                <div
                  key={idx}
                  className="bg-white border border-yellow-200 rounded p-3"
                >
                  <div className="flex items-start gap-2">
                    <div className="flex-1">
                      {err.candidateId && err.candidateId !== "unknown" && (
                        <p className="text-sm font-medium text-gray-900">
                          Aday ID: {err.candidateId.substring(0, 8)}...
                        </p>
                      )}
                      {err.fileName && err.fileName !== "unknown" && (
                        <p className="text-sm text-gray-700">
                          Dosya: {err.fileName}
                        </p>
                      )}
                      <p className="text-sm text-gray-600 mt-1">
                        Hata: {err.error || "Bilinmeyen hata"}
                      </p>
                      {err.details && Array.isArray(err.details) && (
                        <ul className="mt-2 ml-4 text-xs text-gray-500 list-disc">
                          {err.details.map((detail, i) => (
                            <li key={i}>{detail}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 text-sm text-yellow-700">
              <p className="font-medium">Olasi Nedenler:</p>
              <ul className="mt-1 ml-4 list-disc space-y-1">
                <li>CV dosyasina erisim sorunu (suresiz veya silinmis link)</li>
                <li>Dosya formati desteklenmiyor</li>
                <li>CV iceriginin Gemini tarafindan islenememesi</li>
                <li>Gate validasyon kurallarina uymayan veri</li>
              </ul>
            </div>
          </div>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="p-1 hover:bg-yellow-100 rounded transition-colors"
        >
          <X className="w-4 h-4 text-yellow-600" />
        </button>
      </div>
    </div>
  );
}
