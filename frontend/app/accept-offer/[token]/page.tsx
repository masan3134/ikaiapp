'use client';

import { useEffect, useState } from 'react';
import { getOfferByToken, acceptOffer, rejectOffer } from '@/services/publicOfferService';
import { JobOffer } from '@/services/offerService';

export default function PublicOfferPage({ params }: { params: { token: string } }) {
  const { token } = params;
  const [offer, setOffer] = useState<JobOffer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [decision, setDecision] = useState<'accepted' | 'rejected' | 'confirm_reject' | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);

  useEffect(() => {
    async function fetchOffer() {
      try {
        const response = await getOfferByToken(token);
        setOffer(response.data);
      } catch (err: any) {
        setError(err.message || 'Teklif yüklenirken bir hata oluştu.');
      } finally {
        setLoading(false);
      }
    }
    if (token) {
      fetchOffer();
    }
  }, [token]);

  const handleAccept = async () => {
    try {
      setLoading(true);
      await acceptOffer(token);
      setDecision('accepted');
    } catch (err: any) {
      setError(err.message || 'İşlem sırasında bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const handleRejectClick = () => {
    setShowRejectModal(true);
  };

  const handleRejectSubmit = async () => {
    if (!rejectionReason.trim()) {
      alert('Lütfen reddetme nedeninizi belirtin.');
      return;
    }
    try {
      setLoading(true);
      await rejectOffer(token, rejectionReason);
      setDecision('rejected');
      setShowRejectModal(false);
    } catch (err: any) {
      setError(err.message || 'İşlem sırasında bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const getWorkTypeLabel = (workType: string) => {
    const labels: Record<string, string> = {
      office: '🏢 Ofis',
      hybrid: '🏠 Hibrit',
      remote: '💻 Uzaktan',
    };
    return labels[workType] || workType;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="text-center">
          <div className="inline-block w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-700 font-medium">Teklif yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-white to-pink-50 p-6">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border-2 border-red-200">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">⚠️</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Hata Oluştu</h2>
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (decision === 'accepted') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-emerald-50 p-6">
        <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl p-8 border-2 border-green-200">
          <div className="text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
              <span className="text-4xl">🎉</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Tebrikler!</h2>
            <p className="text-lg text-gray-700 mb-6">
              Teklifi başarıyla kabul ettiniz. İnsan kaynakları ekibimiz en kısa sürede sizinle iletişime geçecektir.
            </p>
            <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6">
              <p className="text-green-800 font-medium">
                ✅ Onay e-postanız gönderildi<br />
                📧 Gelen kutunuzu kontrol ediniz<br />
                📞 Yakında sizinle iletişime geçeceğiz
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (decision === 'rejected') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-slate-50 p-6">
        <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl p-8 border-2 border-gray-200">
          <div className="text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">📝</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Bilgilendirme</h2>
            <p className="text-lg text-gray-700 mb-6">
              Teklifi reddettiniz. Geri bildiriminiz için teşekkür ederiz.
            </p>
            <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-6">
              <p className="text-gray-800">
                Sizinle çalışma fırsatı bulamadığımız için üzgünüz.<br />
                Gelecekte başka fırsatlar için bekliyoruz.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!offer) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-slate-50 p-6">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border-2 border-gray-200">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">❓</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Teklif Bulunamadı</h2>
            <p className="text-gray-600">Geçersiz veya süresi dolmuş teklif linki.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-6 print:bg-white print:p-0">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden mb-6 print:shadow-none print:rounded-none">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-center print:bg-blue-600">
              <div className="mb-4">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto shadow-lg">
                  <span className="text-4xl">💼</span>
                </div>
              </div>
              <h1 className="text-4xl font-bold text-white mb-2">İş Teklifi</h1>
              <p className="text-blue-100 text-lg">IKAI HR Platform</p>
            </div>

            {/* Main Content */}
            <div className="p-8 print:p-6">
              {/* Greeting */}
              <div className="mb-8">
                <p className="text-xl text-gray-900 mb-4">
                  Sayın <span className="font-bold text-blue-600">{offer.candidate?.firstName} {offer.candidate?.lastName}</span>,
                </p>
                <p className="text-gray-700 text-lg leading-relaxed">
                  Başvurunuz değerlendirilmiş olup, <span className="font-semibold text-gray-900">{offer.position}</span> pozisyonu için
                  ekibimize katılmanızı büyük bir memnuniyetle bekliyoruz.
                </p>
              </div>

              {/* Offer Details Card */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 mb-6 border-2 border-blue-200 print:border print:border-gray-300">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <span>📋</span> Teklif Detayları
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white rounded-lg p-4 shadow-sm print:shadow-none print:border print:border-gray-200">
                    <p className="text-sm text-gray-600 mb-1 font-medium">Pozisyon</p>
                    <p className="text-lg font-bold text-gray-900">{offer.position}</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-sm print:shadow-none print:border print:border-gray-200">
                    <p className="text-sm text-gray-600 mb-1 font-medium">Departman</p>
                    <p className="text-lg font-bold text-gray-900">{offer.department}</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-sm print:shadow-none print:border print:border-gray-200">
                    <p className="text-sm text-gray-600 mb-1 font-medium">Maaş</p>
                    <p className="text-2xl font-bold text-green-600">
                      ₺{offer.salary?.toLocaleString('tr-TR')} <span className="text-base text-gray-600">{offer.currency}</span>
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-sm print:shadow-none print:border print:border-gray-200">
                    <p className="text-sm text-gray-600 mb-1 font-medium">Başlangıç Tarihi</p>
                    <p className="text-lg font-bold text-gray-900">
                      {new Date(offer.startDate).toLocaleDateString('tr-TR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-sm print:shadow-none print:border print:border-gray-200">
                    <p className="text-sm text-gray-600 mb-1 font-medium">Çalışma Şekli</p>
                    <p className="text-lg font-bold text-gray-900">{getWorkTypeLabel(offer.workType)}</p>
                  </div>
                </div>
              </div>

              {/* Benefits */}
              {offer.benefits && (
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 mb-6 border-2 border-green-200 print:border print:border-gray-300">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <span>🎁</span> Yan Haklar ve İmkanlar
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {offer.benefits.insurance && (
                      <div className="flex items-center gap-3 bg-white rounded-lg p-3 shadow-sm print:shadow-none print:border print:border-gray-200">
                        <span className="text-2xl">🏥</span>
                        <span className="text-gray-900 font-medium">Özel Sağlık Sigortası</span>
                      </div>
                    )}
                    {offer.benefits.meal > 0 && (
                      <div className="flex items-center gap-3 bg-white rounded-lg p-3 shadow-sm print:shadow-none print:border print:border-gray-200">
                        <span className="text-2xl">🍽️</span>
                        <span className="text-gray-900 font-medium">Yemek Kartı ({offer.benefits.meal} TL/ay)</span>
                      </div>
                    )}
                    {offer.benefits.transportation && (
                      <div className="flex items-center gap-3 bg-white rounded-lg p-3 shadow-sm print:shadow-none print:border print:border-gray-200">
                        <span className="text-2xl">🚌</span>
                        <span className="text-gray-900 font-medium">Ulaşım Desteği</span>
                      </div>
                    )}
                    {offer.benefits.gym && (
                      <div className="flex items-center gap-3 bg-white rounded-lg p-3 shadow-sm print:shadow-none print:border print:border-gray-200">
                        <span className="text-2xl">🏋️</span>
                        <span className="text-gray-900 font-medium">Spor Salonu Üyeliği</span>
                      </div>
                    )}
                    {offer.benefits.education && (
                      <div className="flex items-center gap-3 bg-white rounded-lg p-3 shadow-sm print:shadow-none print:border print:border-gray-200">
                        <span className="text-2xl">📚</span>
                        <span className="text-gray-900 font-medium">Eğitim Desteği</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Terms */}
              {offer.terms && (
                <div className="bg-gray-50 rounded-xl p-6 mb-6 border-2 border-gray-200 print:border print:border-gray-300">
                  <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <span>📝</span> Şartlar ve Koşullar
                  </h2>
                  <div className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                    {offer.terms}
                  </div>
                </div>
              )}

              {/* Expiry Notice */}
              <div className="bg-gradient-to-r from-yellow-50 to-amber-50 border-2 border-yellow-300 rounded-xl p-5 mb-8 print:border print:border-gray-300">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">⏰</span>
                  <div>
                    <p className="font-bold text-gray-900 mb-1">Geçerlilik Süresi</p>
                    <p className="text-gray-800">
                      Bu teklif <span className="font-bold text-amber-700">
                        {new Date(offer.expiresAt).toLocaleDateString('tr-TR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span> tarihine kadar geçerlidir.
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center print:hidden">
                <button
                  onClick={handleAccept}
                  disabled={loading}
                  className="flex-1 sm:flex-none bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ✅ Teklifi Kabul Et
                </button>
                <button
                  onClick={handleRejectClick}
                  disabled={loading}
                  className="flex-1 sm:flex-none bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ❌ Teklifi Reddet
                </button>
                <button
                  onClick={handlePrint}
                  className="flex-1 sm:flex-none bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 text-lg"
                >
                  🖨️ PDF Olarak Yazdır
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-8 py-6 border-t-2 border-gray-200 text-center print:border-t">
              <p className="text-gray-600 text-sm mb-1">
                Bu teklif IKAI HR Platform tarafından otomatik olarak oluşturulmuştur.
              </p>
              <p className="text-gray-500 text-xs">
                © 2025 IKAI HR Platform - Tüm hakları saklıdır.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-6 print:hidden">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 animate-fadeIn">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">⚠️</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Teklifi Reddet</h3>
              <p className="text-gray-600">
                Lütfen reddetme nedeninizi belirtin. Bu bilgi değerlendirmelerimize yardımcı olacaktır.
              </p>
            </div>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Reddetme nedeninizi buraya yazın..."
              rows={5}
              className="w-full border-2 border-gray-300 rounded-lg p-4 text-gray-900 focus:ring-2 focus:ring-red-500 focus:border-transparent mb-6 resize-none"
              disabled={loading}
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowRejectModal(false)}
                disabled={loading}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-lg transition disabled:opacity-50"
              >
                İptal
              </button>
              <button
                onClick={handleRejectSubmit}
                disabled={loading}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Gönderiliyor...' : 'Reddetmeyi Onayla'}
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        @media print {
          body {
            background: white !important;
          }
          .print\\:hidden {
            display: none !important;
          }
          .print\\:bg-white {
            background: white !important;
          }
          .print\\:p-0 {
            padding: 0 !important;
          }
          .print\\:shadow-none {
            box-shadow: none !important;
          }
          .print\\:rounded-none {
            border-radius: 0 !important;
          }
          .print\\:border {
            border-width: 1px !important;
          }
          .print\\:border-gray-200 {
            border-color: #e5e7eb !important;
          }
          .print\\:border-gray-300 {
            border-color: #d1d5db !important;
          }
          .print\\:p-6 {
            padding: 1.5rem !important;
          }
          .print\\:border-t {
            border-top-width: 1px !important;
          }
          .print\\:bg-blue-600 {
            background: linear-gradient(to right, #2563eb, #4f46e5) !important;
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </>
  );
}
