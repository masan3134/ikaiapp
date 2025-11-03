import React from 'react';

const NegotiationTimeline = ({ negotiations }) => {
  if (!negotiations || negotiations.length === 0) {
    return <p>Müzakere geçmişi bulunmuyor.</p>;
  }

  return (
    <div className="space-y-4">
      {negotiations.map((item) => (
        <div key={item.id} className="p-4 border rounded-lg">
          <p className="font-semibold">{item.initiatedBy === 'candidate' ? 'Aday' : 'Şirket'}</p>
          <p>{item.message}</p>
          {item.response && <p className="mt-2 pt-2 border-t">Cevap: {item.response}</p>}
        </div>
      ))}
    </div>
  );
};

export default NegotiationTimeline;
