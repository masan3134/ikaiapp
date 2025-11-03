'use client';

import { useState, useEffect } from 'react';
import { Briefcase, Loader2, DollarSign, Calendar, CheckCircle, XCircle, Clock, Send, Gift, FileText, TrendingUp } from 'lucide-react';
import { formatDate } from '@/lib/utils/dateFormat';
import offerService from '@/lib/services/offerService';
import type { JobOffer } from '../../types';

interface OffersTabProps {
  candidateId: string;
}

export default function OffersTab({ candidateId }: OffersTabProps) {
  const [offers, setOffers] = useState<JobOffer[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadOffers();
  }, [candidateId]);

  async function loadOffers() {
    try {
      setLoading(true);
      const data = await offerService.getOffers({ candidateId });
      const offersList = data?.data || data?.offers || [];
      setOffers(offersList);
    } catch (error) {
      console.error('Offers load error:', error);
    } finally {
      setLoading(false);
    }
  }

  function getStatusBadge(status: JobOffer['status']) {
    const badges: Record<string, { icon: any; colors: string; text: string }> = {
      draft: { icon: FileText, colors: 'bg-gray-100 text-gray-700 border-gray-200', text: 'Taslak' },
      pending_approval: { icon: Clock, colors: 'bg-yellow-100 text-yellow-700 border-yellow-200', text: 'Onay Bekliyor' },
      approved: { icon: CheckCircle, colors: 'bg-blue-100 text-blue-700 border-blue-200', text: 'Onaylandı' },
      sent: { icon: Send, colors: 'bg-purple-100 text-purple-700 border-purple-200', text: 'Gönderildi' },
      accepted: { icon: CheckCircle, colors: 'bg-green-100 text-green-700 border-green-200', text: 'Kabul Edildi' },
      rejected: { icon: XCircle, colors: 'bg-red-100 text-red-700 border-red-200', text: 'Reddedildi' },
      negotiating: { icon: TrendingUp, colors: 'bg-orange-100 text-orange-700 border-orange-200', text: 'Müzakere' },
      withdrawn: { icon: XCircle, colors: 'bg-orange-100 text-orange-700 border-orange-200', text: 'Geri Çekildi' },
      expired: { icon: Clock, colors: 'bg-red-100 text-red-700 border-red-200', text: 'Süresi Doldu' },
      cancelled: { icon: XCircle, colors: 'bg-gray-100 text-gray-700 border-gray-200', text: 'İptal Edildi' },
    };
    const statusLower = status?.toLowerCase() || 'draft';
    const badge = badges[statusLower] || badges.draft;
    const Icon = badge.icon;

    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 ${badge.colors} border rounded-full text-xs font-semibold`}>
        <Icon className="w-3.5 h-3.5" />
        {badge.text}
      </span>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {offers.length > 0 ? (
        <div className="space-y-4">
          {offers.map((offer) => (
            <div
              key={offer.id}
              className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-5">
                <div className="flex-1">
                  <h4 className="text-lg font-bold text-gray-900 mb-1">{offer.position}</h4>
                  <p className="text-sm text-gray-600 font-medium">{offer.department}</p>
                </div>
                {getStatusBadge(offer.status)}
              </div>

              {/* Salary Card */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-5 mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs text-green-700 font-bold uppercase tracking-wide mb-1">
                      Maaş Teklifi
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {offer.salary.toLocaleString()} {offer.currency}
                    </p>
                  </div>
                </div>
              </div>

              {/* Dates Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-5">
                <div className="flex items-center gap-3 bg-white rounded-lg p-3 border border-gray-100">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Başlangıç Tarihi</p>
                    <p className="text-sm font-bold text-gray-900">{formatDate(offer.startDate)}</p>
                  </div>
                </div>

                {offer.sentAt && (
                  <div className="flex items-center gap-3 bg-white rounded-lg p-3 border border-gray-100">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Send className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Gönderilme</p>
                      <p className="text-sm font-bold text-gray-900">{formatDate(offer.sentAt)}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Benefits */}
              {offer.benefits && offer.benefits.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Gift className="w-4 h-4 text-blue-600" />
                    <p className="text-xs font-bold text-blue-900 uppercase tracking-wide">
                      Yan Haklar
                    </p>
                  </div>
                  <ul className="space-y-2">
                    {offer.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-gray-800">
                        <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Conditions */}
              {offer.conditions && offer.conditions.length > 0 && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
                  <div className="flex items-center gap-2 mb-3">
                    <FileText className="w-4 h-4 text-gray-600" />
                    <p className="text-xs font-bold text-gray-900 uppercase tracking-wide">
                      Şartlar
                    </p>
                  </div>
                  <ul className="space-y-2">
                    {offer.conditions.map((condition, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-1.5 flex-shrink-0"></span>
                        <span>{condition}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Response & Expiry */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {offer.respondedAt && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <p className="text-xs text-green-700 font-semibold mb-1">Yanıtlanma</p>
                    <p className="text-sm font-bold text-gray-900">{formatDate(offer.respondedAt)}</p>
                  </div>
                )}
                {offer.expiresAt && (
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                    <p className="text-xs text-orange-700 font-semibold mb-1">Son Geçerlilik</p>
                    <p className="text-sm font-bold text-gray-900">{formatDate(offer.expiresAt)}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border-2 border-dashed border-gray-300">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <Briefcase className="w-8 h-8 text-gray-500" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            Henüz Teklif Gönderilmemiş
          </h3>
          <p className="text-sm text-gray-600">
            Teklifler sayfasından yeni iş teklifi oluşturabilirsiniz
          </p>
        </div>
      )}
    </div>
  );
}
