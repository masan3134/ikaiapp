import React, { useState } from 'react';

interface AcceptanceFormProps {
  offer: any; // Simplified type, consider a proper type definition
  onAccept: (data: any) => Promise<void>;
  onReject: (reason: string) => Promise<void>;
}

const AcceptanceForm: React.FC<AcceptanceFormProps> = ({ offer, onAccept, onReject }) => {
  const [loading, setLoading] = useState(false);

  const handleAccept = async () => {
    if (!confirm('Teklifi kabul etmek istediğinizden emin misiniz?')) return;
    setLoading(true);
    await onAccept({});
    setLoading(false);
  };

  const handleReject = async () => {
    const reason = prompt('Reddetme sebebinizi belirtebilir misiniz? (Opsiyonel)');
    if (reason === null) return; // User cancelled the prompt
    setLoading(true);
    await onReject(reason);
    setLoading(false);
  };

  const isExpired = new Date() > new Date(offer.expiresAt);
  const isResponded = offer.status === 'accepted' || offer.status === 'rejected';

  if (isExpired) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 my-8">
        <p className="text-red-800 font-semibold">⏰ Bu teklifin süresi dolmuştur.</p>
        <p className="text-red-700">Lütfen daha fazla bilgi için işe alım uzmanıyla iletişime geçin.</p>
      </div>
    );
  }

  if (isResponded) {
    return (
      <div
        className={`border-l-4 p-4 my-8 ${
          offer.status === 'accepted'
            ? 'bg-green-50 border-green-500'
            : 'bg-gray-100 border-gray-500'
        }`}>
        <p
          className={`font-semibold ${
            offer.status === 'accepted' ? 'text-green-800' : 'text-gray-800'
          }`}>
          {offer.status === 'accepted'
            ? '✅ Bu teklifi zaten kabul ettiniz.'
            : '❌ Bu teklifi zaten reddettiniz.'}
        </p>
        <p className={offer.status === 'accepted' ? 'text-green-700' : 'text-gray-700'}>
          Süreçle ilgili en kısa zamanda sizinle iletişime geçilecektir.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="text-center my-10">
        <p className="text-gray-600 mb-4">
          Teklifi değerlendirmek ve yanıtlamak için aşağıdaki butonları kullanabilirsiniz.
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={handleAccept}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200">
            {loading ? 'İşleniyor...' : '✅ Teklifi Kabul Et'}
          </button>
          <button
            onClick={handleReject}
            disabled={loading}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200">
            {loading ? 'İşleniyor...' : '❌ Teklifi Reddet'}
          </button>
        </div>
      </div>
      <p className="text-center text-sm text-gray-500 mt-6">
        📅 Bu teklif {new Date(offer.expiresAt).toLocaleDateString('tr-TR')} tarihine kadar geçerlidir.
      </p>
    </div>
  );
};

export default AcceptanceForm;
