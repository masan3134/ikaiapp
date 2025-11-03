'use client';

interface Step3Props {
  data: any;
  onChange: (data: any) => void;
}

export default function Step3_GoogleMeetSetup({ data, onChange }: Step3Props) {
  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-blue-800 text-sm">
          ✅ Google Meet linki otomatik oluşturulacak ve adaylara gönderilecektir.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Toplantı Başlığı</label>
        <input
          type="text"
          value={data.meetingTitle || ''}
          onChange={(e) => onChange({ meetingTitle: e.target.value })}
          placeholder="Mülakat - Pozisyon"
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Açıklama (Opsiyonel)</label>
        <textarea
          value={data.meetingDescription || ''}
          onChange={(e) => onChange({ meetingDescription: e.target.value })}
          placeholder="Toplantı hakkında ek bilgiler..."
          rows={4}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  );
}
