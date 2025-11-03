'use client';

import { useState } from 'react';
import { Calendar, Clock, AlertTriangle, Loader2 } from 'lucide-react';
import interviewService from '@/lib/services/interviewService';

interface Step2Props {
  data: any;
  onChange: (data: any) => void;
}

export default function Step2_InterviewDetails({ data, onChange }: Step2Props) {
  const [checkingConflicts, setCheckingConflicts] = useState(false);
  const [conflicts, setConflicts] = useState<any[]>([]);
  const [showConflictWarning, setShowConflictWarning] = useState(false);

  const checkConflicts = async () => {
    if (!data.date || !data.time) return;
    
    try {
      setCheckingConflicts(true);
      const result = await interviewService.checkConflicts(data.date, data.time);
      
      if (result.hasConflict) {
        setConflicts(result.conflicts);
        setShowConflictWarning(true);
      }
    } catch (err) {
      console.error('Conflict check failed:', err);
    } finally {
      setCheckingConflicts(false);
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Mülakat Detayları</h3>
      
      <div>
        <label className="block text-sm font-medium mb-3">Mülakat Türü</label>
        <div className="space-y-2">
          {[
            { value: 'phone', label: '📞 Telefon Görüşmesi' },
            { value: 'online', label: '🎥 Online Görüşme (Google Meet)' },
            { value: 'in-person', label: '🏢 Yüz Yüze Görüşme' }
          ].map(type => (
            <label
              key={type.value}
              className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                data.type === type.value
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <input
                type="radio"
                name="type"
                value={type.value}
                checked={data.type === type.value}
                onChange={(e) => onChange({ type: e.target.value })}
                className="w-5 h-5 text-blue-600"
              />
              <span className="font-medium">{type.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            <Calendar size={16} className="inline mr-1" />
            Tarih
          </label>
          <input
            type="date"
            value={data.date}
            onChange={(e) => onChange({ date: e.target.value })}
            onBlur={checkConflicts}
            min={new Date().toISOString().split('T')[0]}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            <Clock size={16} className="inline mr-1" />
            Saat
          </label>
          <input
            type="time"
            value={data.time}
            onChange={(e) => onChange({ time: e.target.value })}
            onBlur={checkConflicts}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Süre</label>
        <select
          value={data.duration || 60}
          onChange={(e) => onChange({ duration: parseInt(e.target.value) })}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value={30}>30 dakika</option>
          <option value={60}>60 dakika</option>
          <option value={90}>90 dakika</option>
          <option value={120}>120 dakika</option>
        </select>
      </div>

      {data.type === 'in-person' && (
        <div>
          <label className="block text-sm font-medium mb-2">Konum</label>
          <input
            type="text"
            value={data.location || ''}
            onChange={(e) => onChange({ location: e.target.value })}
            placeholder="Toplantı Odası 1"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
      )}

      {checkingConflicts && (
        <div className="text-sm text-gray-600 flex items-center gap-2">
          <Loader2 className="animate-spin" size={16} />
          Çakışma kontrol ediliyor...
        </div>
      )}

      {showConflictWarning && conflicts.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="text-yellow-600 flex-shrink-0 mt-0.5" size={20} />
            <div className="flex-1">
              <h4 className="font-medium text-yellow-900 mb-2">Çakışma Tespit Edildi</h4>
              <p className="text-sm text-yellow-800 mb-3">
                Bu tarih ve saatte başka mülakatlar var:
              </p>
              <ul className="text-sm text-yellow-800 space-y-1 mb-3">
                {conflicts.map((c, i) => (
                  <li key={i}>• {c.time} - {c.candidateNames} ({c.type})</li>
                ))}
              </ul>
              <button
                onClick={() => setShowConflictWarning(false)}
                className="text-sm text-yellow-900 underline hover:no-underline"
              >
                Anladım, devam et
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
