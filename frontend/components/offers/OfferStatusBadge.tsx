import React from 'react';

interface OfferStatusBadgeProps {
  status: string;
}

const OfferStatusBadge: React.FC<OfferStatusBadgeProps> = ({ status }) => {
  const statusStyles: { [key: string]: { text: string; bg: string; text_color: string } } = {
    draft: { text: 'Taslak', bg: 'bg-gray-200', text_color: 'text-gray-800' },
    pending_approval: { text: 'Onay Bekliyor', bg: 'bg-yellow-200', text_color: 'text-yellow-800' },
    approved: { text: 'Onaylandı', bg: 'bg-blue-200', text_color: 'text-blue-800' },
    sent: { text: 'Gönderildi', bg: 'bg-indigo-200', text_color: 'text-indigo-800' },
    accepted: { text: 'Kabul Edildi', bg: 'bg-green-200', text_color: 'text-green-800' },
    rejected: { text: 'Reddedildi', bg: 'bg-red-200', text_color: 'text-red-800' },
    expired: { text: 'Süresi Doldu', bg: 'bg-gray-400', text_color: 'text-white' },
    cancelled: { text: 'İptal Edildi', bg: 'bg-orange-200', text_color: 'text-orange-800' },
    default: { text: status, bg: 'bg-gray-200', text_color: 'text-gray-800' },
  };

  const style = statusStyles[status] || statusStyles.default;

  return (
    <span
      className={`px-2.5 py-1 text-xs font-semibold rounded-full ${style.bg} ${style.text_color}`}>
      {style.text}
    </span>
  );
};

export default OfferStatusBadge;
