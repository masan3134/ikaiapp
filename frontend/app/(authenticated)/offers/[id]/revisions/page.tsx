'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import * as offerService from '@/services/offerService';
import RevisionHistory from '@/components/offers/RevisionHistory';
import { withRoleProtection } from '@/lib/hoc/withRoleProtection';
import { RoleGroups } from '@/lib/constants/roles';

function RevisionsPage() {
  const params = useParams();
  const router = useRouter();
  const offerId = params.id as string;

  const [offer, setOffer] = useState<any>(null);
  const [revisions, setRevisions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (offerId) {
      offerService.fetchOfferById(offerId)
        .then(offerData => {
          setOffer(offerData);
          setRevisions(offerData?.revisions || []);
        })
        .catch(err => {
          console.error("Failed to fetch offer revisions", err);
          setError(err.message || 'Versiyon geçmişi yüklenirken hata oluştu');
        })
        .finally(() => setLoading(false));
    }
  }, [offerId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Versiyon geçmişi yükleniyor...</p>
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
            onClick={() => router.push('/offers')}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Tekliflere Dön
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header with Navigation */}
      <div className="mb-6">
        <button
          onClick={() => router.push(`/offers/${offerId}`)}
          className="flex items-center text-blue-600 hover:text-blue-800 mb-4 font-medium"
        >
          ← Teklif Detayına Dön
        </button>
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-3 flex items-center gap-2">
            <span>🔄</span> Versiyon Geçmişi
          </h1>
          {offer && (
            <div className="space-y-2 text-sm">
              <p className="text-gray-700">
                <span className="font-semibold">Teklif:</span> {offer.position} - {offer.candidate?.firstName} {offer.candidate?.lastName}
              </p>
              <p className="text-gray-700">
                <span className="font-semibold">Toplam Versiyon:</span> {revisions.length}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Revision History */}
      {revisions.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
          <p className="text-gray-600 mb-2">Henüz versiyon geçmişi bulunmuyor</p>
          <p className="text-sm text-gray-500">
            Teklifte yapılan değişiklikler burada görünecektir
          </p>
        </div>
      ) : (
        <RevisionHistory revisions={revisions} />
      )}
    </div>
  );
}

export default withRoleProtection(RevisionsPage, {
  allowedRoles: RoleGroups.HR_MANAGERS
});
