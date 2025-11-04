"use client";

import { useState } from "react";
import { Users, Calendar, Clock, Video, MapPin, Mail } from "lucide-react";
import interviewService from "@/lib/services/interviewService";

interface Step5Props {
  data: any;
  onSuccess: () => void;
}

export default function Step5_Summary({ data, onSuccess }: Step5Props) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const typeLabels = {
    phone: "📞 Telefon",
    online: "🎥 Online (Google Meet)",
    "in-person": "🏢 Yüz Yüze",
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      setError("");

      const formData = {
        candidateIds: data.step1.selectedIds,
        type: data.step2.type,
        date: data.step2.date,
        time: data.step2.time,
        duration: data.step2.duration || 60,
        location: data.step2.location,
        meetingTitle: data.step3.meetingTitle,
        notes: data.step4.additionalNotes,
      };

      await interviewService.createInterview(formData);
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.error || "Bir hata oluştu");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Mülakat Özeti</h3>

      <div className="bg-gray-50 rounded-lg p-6 space-y-4">
        <div>
          <h4 className="font-medium text-gray-700 mb-2 flex items-center gap-2">
            <Users size={18} />
            Seçilen Adaylar
          </h4>
          <p className="text-sm text-gray-600">
            {data.step1.selectedIds.length} aday
          </p>
        </div>

        <div>
          <h4 className="font-medium text-gray-700 mb-2 flex items-center gap-2">
            <Calendar size={18} />
            Tarih & Saat
          </h4>
          <p className="text-sm text-gray-600">
            {data.step2.date} - {data.step2.time}
          </p>
        </div>

        <div>
          <h4 className="font-medium text-gray-700 mb-2">Mülakat Türü</h4>
          <p className="text-sm text-gray-600">
            {typeLabels[data.step2.type as keyof typeof typeLabels]}
          </p>
        </div>

        {data.step4.additionalNotes && (
          <div>
            <h4 className="font-medium text-gray-700 mb-2 flex items-center gap-2">
              <Mail size={18} />
              Ek Notlar
            </h4>
            <p className="text-sm text-gray-600">
              {data.step4.additionalNotes}
            </p>
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800 text-sm">
          {error}
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={submitting}
        className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
      >
        {submitting ? "Oluşturuluyor..." : "💾 Kaydet & Gönder"}
      </button>
    </div>
  );
}
