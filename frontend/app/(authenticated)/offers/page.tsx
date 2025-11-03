'use client';

import { useEffect, useState } from 'react';
import { fetchOffers, bulkSendOffers, bulkDeleteOffers } from '@/services/offerService';
import { Offer } from '@/lib/types/offer';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { Eye, Plus, Send, Trash2, CheckSquare, Square } from 'lucide-react';
import Link from 'next/link';

export default function OffersPage() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOffers, setSelectedOffers] = useState<Set<string>>(new Set());
  const [bulkActionLoading, setBulkActionLoading] = useState(false);

  useEffect(() => {
    loadOffers();
  }, []);

  const loadOffers = async () => {
    try {
      setLoading(true);
      const response = await fetchOffers();
      setOffers(response.data);
      setError(null);
    } catch (err) {
      setError('Teklifler yüklenirken bir hata oluştu.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusVariant = (status: string): 'success' | 'error' | 'info' | 'neutral' => {
    switch (status) {
      case 'accepted':
        return 'success';
      case 'rejected':
      case 'expired':
        return 'error';
      case 'sent':
        return 'info';
      case 'pending_approval':
      case 'draft':
      default:
        return 'neutral';
    }
  };

  const toggleSelectAll = () => {
    if (selectedOffers.size === offers.length) {
      setSelectedOffers(new Set());
    } else {
      setSelectedOffers(new Set(offers.map(o => o.id)));
    }
  };

  const toggleSelectOffer = (offerId: string) => {
    const newSelected = new Set(selectedOffers);
    if (newSelected.has(offerId)) {
      newSelected.delete(offerId);
    } else {
      newSelected.add(offerId);
    }
    setSelectedOffers(newSelected);
  };

  const handleBulkSend = async () => {
    if (selectedOffers.size === 0) {
      alert('Lütfen en az bir teklif seçin');
      return;
    }

    if (!confirm(`${selectedOffers.size} teklifi toplu olarak göndermek istediğinize emin misiniz?`)) {
      return;
    }

    try {
      setBulkActionLoading(true);
      await bulkSendOffers(Array.from(selectedOffers));
      alert('Teklifler başarıyla gönderildi');
      setSelectedOffers(new Set());
      await loadOffers();
    } catch (err: any) {
      alert(err.message || 'Toplu gönderme başarısız');
    } finally {
      setBulkActionLoading(false);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedOffers.size === 0) {
      alert('Lütfen en az bir teklif seçin');
      return;
    }

    if (!confirm(`${selectedOffers.size} teklifi kalıcı olarak silmek istediğinize emin misiniz? Bu işlem geri alınamaz.`)) {
      return;
    }

    try {
      setBulkActionLoading(true);
      await bulkDeleteOffers(Array.from(selectedOffers));
      alert('Teklifler başarıyla silindi');
      setSelectedOffers(new Set());
      await loadOffers();
    } catch (err: any) {
      alert(err.message || 'Toplu silme başarısız');
    } finally {
      setBulkActionLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">İş Teklifleri</h1>
        <Link href="/offers/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Yeni Teklif
          </Button>
        </Link>
      </div>

      {/* Toplu İşlem Butonları */}
      {selectedOffers.size > 0 && (
        <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-blue-900 font-semibold">
              {selectedOffers.size} teklif seçildi
            </span>
            <button
              onClick={() => setSelectedOffers(new Set())}
              className="text-blue-600 hover:text-blue-800 text-sm underline"
            >
              Seçimi Temizle
            </button>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={handleBulkSend}
              disabled={bulkActionLoading}
              variant="outline"
              className="bg-green-50 border-green-300 text-green-700 hover:bg-green-100"
            >
              <Send className="h-4 w-4 mr-2" />
              Toplu Gönder
            </Button>
            <Button
              onClick={handleBulkDelete}
              disabled={bulkActionLoading}
              variant="outline"
              className="bg-red-50 border-red-300 text-red-700 hover:bg-red-100"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Toplu Sil
            </Button>
          </div>
        </div>
      )}

      {loading && <p className="text-gray-600">Yükleniyor...</p>}
      {error && <p className="text-red-600 bg-red-50 p-4 rounded-lg">{error}</p>}

      {!loading && !error && offers.length === 0 && (
        <div className="bg-white p-12 rounded-lg shadow-md text-center">
          <p className="text-gray-500 text-lg">Henüz teklif bulunmamaktadır.</p>
          <Link href="/offers/new" className="mt-4 inline-block">
            <Button>İlk Teklifi Oluştur</Button>
          </Link>
        </div>
      )}

      {!loading && !error && offers.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-gray-200">
                <TableHead className="w-12">
                  <button
                    onClick={toggleSelectAll}
                    className="text-gray-700 hover:text-gray-900 transition"
                    title={selectedOffers.size === offers.length ? 'Tümünü Kaldır' : 'Tümünü Seç'}
                  >
                    {selectedOffers.size === offers.length ? (
                      <CheckSquare className="h-5 w-5 text-blue-600" />
                    ) : (
                      <Square className="h-5 w-5" />
                    )}
                  </button>
                </TableHead>
                <TableHead className="text-gray-700 font-semibold">Aday</TableHead>
                <TableHead className="text-gray-700 font-semibold">Pozisyon</TableHead>
                <TableHead className="text-gray-700 font-semibold">Maaş</TableHead>
                <TableHead className="text-gray-700 font-semibold">Durum</TableHead>
                <TableHead className="text-gray-700 font-semibold">Gönderim Tarihi</TableHead>
                <TableHead className="text-gray-700 font-semibold">İşlemler</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {offers.map((offer) => (
                <TableRow
                  key={offer.id}
                  className={`border-b border-gray-100 hover:bg-gray-50 transition ${
                    selectedOffers.has(offer.id) ? 'bg-blue-50' : ''
                  }`}
                >
                  <TableCell>
                    <button
                      onClick={() => toggleSelectOffer(offer.id)}
                      className="text-gray-700 hover:text-gray-900 transition"
                    >
                      {selectedOffers.has(offer.id) ? (
                        <CheckSquare className="h-5 w-5 text-blue-600" />
                      ) : (
                        <Square className="h-5 w-5" />
                      )}
                    </button>
                  </TableCell>
                  <TableCell className="text-gray-900 font-medium">
                    {offer.candidate?.firstName} {offer.candidate?.lastName}
                  </TableCell>
                  <TableCell className="text-gray-700">{offer.position}</TableCell>
                  <TableCell className="text-gray-900 font-semibold">
                    {offer.salary.toLocaleString()} {offer.currency}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(offer.status)}>
                      {offer.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {offer.sentAt ? new Date(offer.sentAt).toLocaleDateString('tr-TR') : '-'}
                  </TableCell>
                  <TableCell>
                    <Link href={`/offers/${offer.id}`}>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        Görüntüle
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
