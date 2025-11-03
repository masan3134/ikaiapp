'use client';

interface Step4Props {
  data: any;
  onChange: (data: any) => void;
  wizardData: any;
}

export default function Step4_EmailTemplate({ data, onChange, wizardData }: Step4Props) {
  const previewTemplate = `
Sayın [Aday Adı],

IKAI HR olarak başvurunuz için mülakat yapmak isteriz.

📅 Tarih: ${wizardData.step2.date}
🕐 Saat: ${wizardData.step2.time}
${wizardData.step2.type === 'online' ? '🎥 Google Meet linki e-posta ile gönderilecektir.' : ''}

${data.additionalNotes ? 'Ek Bilgi: ' + data.additionalNotes : ''}

Saygılarımızla,
IKAI HR - İK Departmanı
  `;

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">E-posta Şablonu</h3>
      
      <div className="bg-gray-50 border rounded-lg p-6">
        <p className="text-xs text-gray-500 mb-2">Önizleme:</p>
        <div className="bg-white p-4 rounded border whitespace-pre-wrap text-sm">
          {previewTemplate}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Ek Not (Opsiyonel)</label>
        <textarea
          value={data.additionalNotes || ''}
          onChange={(e) => onChange({ additionalNotes: e.target.value })}
          placeholder="Mülakattan önce bilmesi gereken ek bilgiler..."
          rows={4}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  );
}
