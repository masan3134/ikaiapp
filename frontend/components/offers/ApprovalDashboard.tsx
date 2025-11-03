'use client';

import React, { useState, useEffect } from 'react';
import { fetchOffers, JobOffer } from '@/services/offerService';
import { useAuth } from '@/lib/hooks/useAuth';

const ApprovalDashboard = () => {
  const [pendingOffers, setPendingOffers] = useState<JobOffer[]>([]);
  const [approvedOffers, setApprovedOffers] = useState<JobOffer[]>([]);
  const [rejectedOffers, setRejectedOffers] = useState<JobOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user?.role === 'ADMIN' || user?.role === 'MANAGER') {
      const loadOffers = async () => {
        try {
          setLoading(true);
          // This is a simplified fetch. Ideally, the backend should support filtering by approvalStatus.
          // For now, we fetch all and filter on the client.
          const { data: allOffers } = await fetchOffers({ limit: 100 }); // Fetch a large number
          
          setPendingOffers(allOffers.filter((o: JobOffer) => o.approvalStatus === 'pending'));
          setApprovedOffers(allOffers.filter((o: JobOffer) => o.approvalStatus === 'approved'));
          setRejectedOffers(allOffers.filter((o: JobOffer) => o.approvalStatus === 'rejected'));

        } catch (err) {
          setError('Onaylanacak teklifler yüklenirken bir hata oluştu.');
        } finally {
          setLoading(false);
        }
      };
      loadOffers();
    }
  }, [user]);

  if (user?.role !== 'ADMIN' && user?.role !== 'MANAGER') {
    return null; // Render nothing if user is not an admin/manager
  }

  if (loading) return <p className="text-gray-700">Onay listesi yükleniyor...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  const renderOfferList = (title: string, offers: JobOffer[]) => (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-gray-900 border-b-2 border-blue-600 pb-2 mb-3">
        {title} ({offers.length})
      </h3>
      {offers.length === 0 ? (
        <p className="text-gray-600">Bu kategoride teklif bulunmuyor.</p>
      ) : (
        <ul className="space-y-2">
          {offers.map(offer => (
            <li key={offer.id} className="py-2 border-b border-gray-200">
              <a href={`/offers/${offer.id}`} className="text-blue-600 hover:text-blue-800 hover:underline">
                {offer.position} - {offer.candidate?.firstName} {offer.candidate?.lastName}
              </a>
              <small className="text-gray-500 ml-2">(Oluşturan: {offer.creator?.email})</small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  return (
    <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg mt-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Teklif Onay Yönetimi</h2>
      {renderOfferList('Onay Bekleyenler', pendingOffers)}
      {renderOfferList('Onaylanmış Olanlar', approvedOffers)}
      {renderOfferList('Reddedilmiş Olanlar', rejectedOffers)}
    </div>
  );
};

export default ApprovalDashboard;
