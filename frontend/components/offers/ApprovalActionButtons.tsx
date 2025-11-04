"use client";

import React, { useState } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import { JobOffer } from "@/services/offerService";
// We need to add approval functions to offerService
// For now, let's assume they exist and are named approveOffer and rejectOffer.
// We will need to implement them in offerService.ts next.
import { approveOffer, rejectOffer } from "@/services/approvalService"; // This service needs to be created

interface ApprovalActionButtonsProps {
  offer: JobOffer;
  onActionComplete: () => void; // Callback to refresh data on parent
}

const ApprovalActionButtons: React.FC<ApprovalActionButtonsProps> = ({
  offer,
  onActionComplete,
}) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [reason, setReason] = useState("");

  // A single, combined guard clause to prevent rendering if conditions are not met.
  // This is safer and prevents null reference errors on initial render.
  if (
    !offer ||
    !user ||
    !["ADMIN", "MANAGER"].includes(user.role) ||
    offer.approvalStatus !== "pending"
  ) {
    return null;
  }

  const handleApprove = async () => {
    if (confirm("Bu teklifi onaylamak istediğinizden emin misiniz?")) {
      setLoading(true);
      try {
        await approveOffer(offer.id, "Onaylandı."); // Assuming a default note
        alert("Teklif onaylandı.");
        onActionComplete();
      } catch (error: any) {
        alert(`Hata: ${error.message}`);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleReject = async () => {
    if (!reason.trim()) {
      alert("Lütfen reddetme nedenini belirtin.");
      return;
    }
    setLoading(true);
    try {
      await rejectOffer(offer.id, reason);
      alert("Teklif reddedildi.");
      onActionComplete();
      setShowRejectModal(false);
    } catch (error: any) {
      alert(`Hata: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg shadow-md p-6 border-l-4 border-purple-500">
      <h4 className="text-lg font-bold text-gray-900 mb-2">
        ⚡ Yönetici Aksiyonları
      </h4>
      <p className="text-gray-700 mb-4">Bu teklif sizin onayınızı bekliyor.</p>
      <div className="flex gap-3">
        <button
          onClick={handleApprove}
          disabled={loading}
          className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {loading ? "İşleniyor..." : "✓ Onayla"}
        </button>
        <button
          onClick={() => setShowRejectModal(true)}
          disabled={loading}
          className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          ✗ Reddet
        </button>
      </div>

      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
            <h5 className="text-xl font-bold text-gray-900 mb-2">
              Teklifi Reddet
            </h5>
            <p className="text-gray-600 mb-4">
              Lütfen bu teklifi reddetme nedeninizi belirtin.
            </p>
            <textarea
              rows={4}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Reddetme nedeni..."
              className="w-full border border-gray-300 rounded-lg p-3 text-gray-900 focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setShowRejectModal(false)}
                disabled={loading}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg disabled:opacity-50 transition"
              >
                İptal
              </button>
              <button
                onClick={handleReject}
                disabled={loading}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {loading ? "Reddediliyor..." : "Reddetmeyi Onayla"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApprovalActionButtons;
