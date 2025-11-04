"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import * as offerService from "@/services/offerService";
import * as attachmentService from "@/services/attachmentService";
import * as negotiationService from "@/services/negotiationService";
import AttachmentUploader from "@/components/offers/AttachmentUploader";
import NegotiationTimeline from "@/components/offers/NegotiationTimeline";
import ApprovalActionButtons from "@/components/offers/ApprovalActionButtons";
import { withRoleProtection } from "@/lib/hoc/withRoleProtection";
import { RoleGroups } from "@/lib/constants/roles";

function OfferDetailPage() {
  const params = useParams();
  const router = useRouter();
  const offerId = params.id as string;

  const [offer, setOffer] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Derived state for related data - simplifies logic and avoids extra state management
  const attachments = offer?.attachments || [];
  const negotiations = offer?.negotiations || [];

  useEffect(() => {
    if (offerId) {
      loadAllData();
    }
  }, [offerId]);

  async function loadAllData() {
    try {
      setLoading(true);
      setError("");
      const offerData = await offerService.fetchOfferById(offerId);
      setOffer(offerData);
    } catch (err: any) {
      setError(err.message || "Teklif detayları yüklenirken hata oluştu");
    } finally {
      setLoading(false);
    }
  }

  async function handleFileUpload(file: File) {
    try {
      await attachmentService.uploadAttachment(offerId, file);
      alert("Dosya yüklendi");
      loadAllData(); // Refresh data
    } catch (err: any) {
      alert(err.message || "Dosya yüklenirken hata oluştu");
    }
  }

  async function handleSend() {
    if (!confirm("Teklifi adaya göndermek istediğinize emin misiniz?")) return;
    try {
      await offerService.sendOffer(offerId);
      alert("Teklif gönderildi");
      loadAllData();
    } catch (err: any) {
      alert(err.message || "Teklif gönderilirken hata oluştu");
    }
  }

  async function handleDelete() {
    if (
      !confirm(
        "Teklifi silmek istediğinize emin misiniz? Bu işlem geri alınamaz."
      )
    )
      return;
    try {
      await offerService.deleteOffer(offerId);
      alert("Teklif silindi");
      router.push("/offers");
    } catch (err: any) {
      alert(err.message || "Teklif silinirken hata oluştu");
    }
  }

  function getStatusBadge(status: string) {
    const badges: Record<string, { bg: string; text: string; label: string }> =
      {
        draft: { bg: "bg-gray-100", text: "text-gray-800", label: "Taslak" },
        pending_approval: {
          bg: "bg-yellow-100",
          text: "text-yellow-800",
          label: "Onay Bekliyor",
        },
        approved: {
          bg: "bg-blue-100",
          text: "text-blue-800",
          label: "Onaylandı",
        },
        sent: {
          bg: "bg-indigo-100",
          text: "text-indigo-800",
          label: "Gönderildi",
        },
        accepted: {
          bg: "bg-green-100",
          text: "text-green-800",
          label: "Kabul Edildi",
        },
        rejected: {
          bg: "bg-red-100",
          text: "text-red-800",
          label: "Reddedildi",
        },
        negotiation: {
          bg: "bg-purple-100",
          text: "text-purple-800",
          label: "Müzakere",
        },
      };
    const badge = badges[status] || {
      bg: "bg-gray-100",
      text: "text-gray-800",
      label: status,
    };
    return (
      <span
        className={`px-3 py-1 rounded-full text-sm font-medium ${badge.bg} ${badge.text}`}
      >
        {badge.label}
      </span>
    );
  }

  function getWorkTypeLabel(workType: string) {
    const labels: Record<string, string> = {
      office: "🏢 Ofis",
      hybrid: "🏠 Hibrit",
      remote: "💻 Uzaktan",
    };
    return labels[workType] || workType;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Teklif yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-5xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-700 font-semibold mb-2">Hata</p>
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => router.push("/offers")}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Tekliflere Dön
          </button>
        </div>
      </div>
    );
  }

  if (!offer) {
    return (
      <div className="p-6 max-w-5xl mx-auto">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
          <p className="text-gray-700">Teklif bulunamadı</p>
          <button
            onClick={() => router.push("/offers")}
            className="mt-4 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            Tekliflere Dön
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header with Back Button and Actions */}
      <div className="mb-6">
        <button
          onClick={() => router.push("/offers")}
          className="flex items-center text-blue-600 hover:text-blue-800 mb-4 font-medium"
        >
          ← Tekliflere Dön
        </button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Teklif Detayı
            </h1>
            <div className="flex items-center gap-3">
              {getStatusBadge(offer.status)}
              <span className="text-sm text-gray-600">
                Oluşturulma:{" "}
                {new Date(offer.createdAt).toLocaleDateString("tr-TR")}
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            {offer.status === "draft" && (
              <button
                onClick={handleSend}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
              >
                📧 Gönder
              </button>
            )}
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
            >
              🗑️ Sil
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Candidate Information */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 flex items-center gap-2">
              <span>👤</span> Aday Bilgileri
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Ad Soyad</p>
                <p className="text-gray-900 font-medium">
                  {offer.candidate?.firstName && offer.candidate?.lastName
                    ? `${offer.candidate.firstName} ${offer.candidate.lastName}`
                    : offer.candidate?.email || "Bilinmiyor"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">E-posta</p>
                <p className="text-gray-900 font-medium">
                  {offer.candidate?.email || "Belirtilmemiş"}
                </p>
              </div>
              {offer.candidate?.phone && (
                <div>
                  <p className="text-sm text-gray-600 mb-1">Telefon</p>
                  <p className="text-gray-900 font-medium">
                    {offer.candidate.phone}
                  </p>
                </div>
              )}
              {offer.candidate?.address && (
                <div>
                  <p className="text-sm text-gray-600 mb-1">Adres</p>
                  <p className="text-gray-900 font-medium">
                    {offer.candidate.address}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Offer Details */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 flex items-center gap-2">
              <span>💼</span> Teklif Detayları
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Pozisyon</p>
                <p className="text-gray-900 font-medium">{offer.position}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Departman</p>
                <p className="text-gray-900 font-medium">{offer.department}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Maaş</p>
                <p className="text-gray-900 font-medium text-lg">
                  {offer.salary?.toLocaleString("tr-TR")} {offer.currency}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Başlangıç Tarihi</p>
                <p className="text-gray-900 font-medium">
                  {new Date(offer.startDate).toLocaleDateString("tr-TR")}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Çalışma Tipi</p>
                <p className="text-gray-900 font-medium">
                  {getWorkTypeLabel(offer.workType)}
                </p>
              </div>
              {offer.jobPosting && (
                <div>
                  <p className="text-sm text-gray-600 mb-1">İş İlanı</p>
                  <button
                    onClick={() =>
                      router.push(`/job-postings/${offer.jobPosting.id}`)
                    }
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    {offer.jobPosting.title} →
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Benefits */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 flex items-center gap-2">
              <span>🎁</span> Yan Haklar
            </h2>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2">
                <span
                  className={
                    offer.benefits?.insurance
                      ? "text-green-600"
                      : "text-gray-400"
                  }
                >
                  {offer.benefits?.insurance ? "✅" : "❌"}
                </span>
                <span className="text-gray-700">Sağlık Sigortası</span>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={
                    offer.benefits?.transportation
                      ? "text-green-600"
                      : "text-gray-400"
                  }
                >
                  {offer.benefits?.transportation ? "✅" : "❌"}
                </span>
                <span className="text-gray-700">Ulaşım Desteği</span>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={
                    offer.benefits?.gym ? "text-green-600" : "text-gray-400"
                  }
                >
                  {offer.benefits?.gym ? "✅" : "❌"}
                </span>
                <span className="text-gray-700">Spor Salonu</span>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={
                    offer.benefits?.education
                      ? "text-green-600"
                      : "text-gray-400"
                  }
                >
                  {offer.benefits?.education ? "✅" : "❌"}
                </span>
                <span className="text-gray-700">Eğitim Desteği</span>
              </div>
              {offer.benefits?.meal > 0 && (
                <div className="col-span-2">
                  <p className="text-gray-700">
                    <span className="text-green-600 font-semibold">
                      🍽️ Yemek:
                    </span>{" "}
                    {offer.benefits.meal} TL/gün
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Terms and Conditions */}
          {offer.terms && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 flex items-center gap-2">
                <span>📋</span> Şartlar ve Koşullar
              </h2>
              <div className="prose max-w-none">
                <p className="text-gray-700 whitespace-pre-wrap">
                  {offer.terms}
                </p>
              </div>
            </div>
          )}

          {/* Rejection Reason */}
          {offer.status === "rejected" && offer.rejectionReason && (
            <div className="bg-gradient-to-br from-red-50 to-pink-50 border-2 border-red-300 rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 flex items-center gap-2">
                <span>❌</span> Reddetme Nedeni
              </h2>
              <div className="bg-white rounded-lg p-4 border border-red-200">
                <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                  {offer.rejectionReason}
                </p>
              </div>
              {offer.rejectedAt && (
                <p className="text-sm text-gray-600 mt-3">
                  <strong>Reddedilme Tarihi:</strong>{" "}
                  {new Date(offer.rejectedAt).toLocaleString("tr-TR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              )}
            </div>
          )}

          {/* Phase 5: Attachments */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-900">
              📎 Ekler
            </h2>
            <AttachmentUploader onUpload={handleFileUpload} />
            <ul className="mt-4 space-y-2">
              {attachments.map((att) => (
                <li
                  key={att.id}
                  className="flex justify-between items-center p-2 border rounded-lg"
                >
                  <a
                    href={att.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {att.originalName}
                  </a>
                  <button
                    onClick={async () => {
                      await attachmentService.deleteAttachment(att.id);
                      loadAllData();
                    }}
                    className="text-red-500 hover:text-red-700"
                  >
                    Sil
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Phase 5: Negotiation History */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-900">
              💬 Müzakere Geçmişi
            </h2>
            <NegotiationTimeline negotiations={negotiations} />
          </div>
        </div>

        <div className="space-y-6">
          {/* Status Timeline */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-900 flex items-center gap-2">
              <span>📊</span> Durum Geçmişi
            </h2>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-gray-400 rounded-full mt-2" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    Oluşturuldu
                  </p>
                  <p className="text-xs text-gray-600">
                    {new Date(offer.createdAt).toLocaleString("tr-TR")}
                  </p>
                </div>
              </div>
              {offer.sentAt && (
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      Gönderildi
                    </p>
                    <p className="text-xs text-gray-600">
                      {new Date(offer.sentAt).toLocaleString("tr-TR")}
                    </p>
                  </div>
                </div>
              )}
              {offer.acceptedAt && (
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-600 rounded-full mt-2" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      Kabul Edildi
                    </p>
                    <p className="text-xs text-gray-600">
                      {new Date(offer.acceptedAt).toLocaleString("tr-TR")}
                    </p>
                  </div>
                </div>
              )}
              {offer.rejectedAt && (
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-red-600 rounded-full mt-2" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      Reddedildi
                    </p>
                    <p className="text-xs text-gray-600">
                      {new Date(offer.rejectedAt).toLocaleString("tr-TR")}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Public Acceptance URL */}
          {offer.acceptanceToken && (
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-3 text-gray-900 flex items-center gap-2">
                <span>🔗</span> Kabul/Red Linki
              </h2>
              <p className="text-sm text-gray-700 mb-3">
                Adayın teklifi kabul/red edebileceği link:
              </p>
              <div className="bg-white border border-gray-300 rounded-lg p-3 mb-3">
                <code className="text-xs text-gray-800 break-all">
                  {`${window.location.origin}/accept-offer/${offer.acceptanceToken}`}
                </code>
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(
                    `${window.location.origin}/accept-offer/${offer.acceptanceToken}`
                  );
                  alert("Link kopyalandı!");
                }}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm"
              >
                📋 Linki Kopyala
              </button>
            </div>
          )}

          {/* Metadata */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-900 flex items-center gap-2">
              <span>ℹ️</span> Ek Bilgiler
            </h2>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-gray-600 mb-1">Teklif ID</p>
                <code className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-800">
                  {offer.id}
                </code>
              </div>
              {offer.template && (
                <div>
                  <p className="text-gray-600 mb-1">Kullanılan Şablon</p>
                  <button
                    onClick={() => router.push(`/offers/templates`)}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    {offer.template.name} →
                  </button>
                </div>
              )}
              <div>
                <p className="text-gray-600 mb-1">Son Güncelleme</p>
                <p className="text-gray-900">
                  {new Date(offer.updatedAt).toLocaleString("tr-TR")}
                </p>
              </div>
            </div>
          </div>

          {/* Approval Actions */}
          <ApprovalActionButtons offer={offer} onActionComplete={loadAllData} />

          {/* Revisions Link */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-3 text-gray-900 flex items-center gap-2">
              <span>🔄</span> Versiyon Geçmişi
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Teklifte yapılan tüm değişiklikleri görüntüleyin
            </p>
            <button
              onClick={() => router.push(`/offers/${offerId}/revisions`)}
              className="w-full px-4 py-2 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 font-medium"
            >
              Tüm Versiyonları Gör →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default withRoleProtection(OfferDetailPage, {
  allowedRoles: RoleGroups.HR_MANAGERS,
});
