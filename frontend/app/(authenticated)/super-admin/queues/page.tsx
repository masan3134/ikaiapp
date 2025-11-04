'use client';

import { useState, useEffect } from 'react';
import { ListIcon, Activity, Play, Pause, RefreshCw, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { withRoleProtection } from '@/lib/hoc/withRoleProtection';
import { UserRole } from '@/lib/constants/roles';

interface QueueStats {
  name: string;
  status: string;
  waiting: number;
  active: number;
  completed: number;
  failed: number;
  delayed?: number;
  paused?: number;
  error?: string;
}

function QueuesPage() {
  const [queues, setQueues] = useState<QueueStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    loadQueues();
    // Auto-refresh every 5 seconds
    const interval = setInterval(loadQueues, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadQueues = async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || '';
      const res = await fetch(`${API_URL}/api/v1/super-admin/queues`);
      const data = await res.json();

      if (data.success) {
        setQueues(data.data);
        setLastUpdated(new Date());
      }
    } catch (error) {
      console.error('Error loading queues:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate totals
  const totals = queues.reduce(
    (acc, q) => ({
      waiting: acc.waiting + q.waiting,
      active: acc.active + q.active,
      completed: acc.completed + q.completed,
      failed: acc.failed + q.failed
    }),
    { waiting: 0, active: 0, completed: 0, failed: 0 }
  );

  const getQueueDisplayName = (name: string) => {
    const names: Record<string, string> = {
      'analysis': 'CV Analysis',
      'offer': 'Offer Generation',
      'email': 'Email Sending',
      'test-generation': 'AI Test Creation',
      'feedback': 'Feedback Processing'
    };
    return names[name] || name;
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2 text-slate-900">
            <ListIcon className="w-7 h-7 text-orange-600" />
            Queue Yönetimi
          </h1>
          <p className="text-slate-600 mt-1">
            BullMQ queue'larını gerçek zamanlı izleyin
          </p>
        </div>
        <div className="flex items-center gap-3">
          {lastUpdated && (
            <div className="text-sm text-slate-600 flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {lastUpdated.toLocaleTimeString('tr-TR')}
            </div>
          )}
          <button
            onClick={loadQueues}
            className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2.5 rounded-lg flex items-center gap-2 font-medium transition-colors shadow-sm"
          >
            <RefreshCw className="w-4 h-4" />
            Yenile
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-700 font-medium">Bekleyen Job'lar</p>
              <p className="text-3xl font-bold text-blue-900 mt-1">{totals.waiting}</p>
            </div>
            <ListIcon className="w-10 h-10 text-blue-600 opacity-50" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-700 font-medium">İşleniyor</p>
              <p className="text-3xl font-bold text-purple-900 mt-1">{totals.active}</p>
            </div>
            <Play className="w-10 h-10 text-purple-600 opacity-50" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-700 font-medium">Tamamlanan</p>
              <p className="text-3xl font-bold text-green-900 mt-1">{totals.completed}</p>
            </div>
            <CheckCircle className="w-10 h-10 text-green-600 opacity-50" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-700 font-medium">Başarısız</p>
              <p className="text-3xl font-bold text-red-900 mt-1">{totals.failed}</p>
            </div>
            <AlertCircle className="w-10 h-10 text-red-600 opacity-50" />
          </div>
        </div>
      </div>

      {/* Queue List */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900">
            Queue Durumu ({queues.length} Queue)
          </h2>
        </div>
        <div className="p-6">
          {loading ? (
            <div className="text-center py-8 text-slate-600">Yükleniyor...</div>
          ) : queues.length === 0 ? (
            <div className="text-center py-8 text-slate-600">Queue bulunamadı</div>
          ) : (
            <div className="space-y-3">
              {queues.map((queue) => (
                <div
                  key={queue.name}
                  className={`flex items-center justify-between p-4 rounded-lg border ${
                    queue.status === 'active' ? 'bg-green-50 border-green-200' :
                    queue.status === 'error' ? 'bg-red-50 border-red-200' :
                    'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <Activity className={`w-6 h-6 ${
                      queue.status === 'active' ? 'text-green-600' : 'text-red-600'
                    }`} />
                    <div>
                      <p className="font-medium text-slate-900">{getQueueDisplayName(queue.name)}</p>
                      <p className="text-sm text-slate-600 flex items-center gap-1">
                        Durum:{' '}
                        <span className={`font-medium ${
                          queue.status === 'active' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {queue.status === 'active' ? 'Aktif' : 'Hata'}
                        </span>
                        {queue.error && (
                          <span className="text-red-600 text-xs ml-2">({queue.error})</span>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 text-sm">
                    <div className="text-center">
                      <p className="font-bold text-lg text-blue-600">{queue.waiting}</p>
                      <p className="text-slate-600">Bekleyen</p>
                    </div>
                    <div className="text-center">
                      <p className="font-bold text-lg text-purple-600">{queue.active}</p>
                      <p className="text-slate-600">Aktif</p>
                    </div>
                    <div className="text-center">
                      <p className="font-bold text-lg text-green-600">{queue.completed}</p>
                      <p className="text-slate-600">Tamamlanan</p>
                    </div>
                    <div className="text-center">
                      <p className="font-bold text-lg text-red-600">{queue.failed}</p>
                      <p className="text-slate-600">Başarısız</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Auto-refresh notice */}
      <div className="mt-4 text-center text-sm text-slate-500">
        🔄 Otomatik yenileme: 5 saniyede bir
      </div>
    </div>
  );
}

export default withRoleProtection(QueuesPage, {
  allowedRoles: [UserRole.SUPER_ADMIN]
});
