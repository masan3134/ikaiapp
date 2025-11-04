'use client';

import { ListIcon, Activity, Play, Pause, RefreshCw, AlertCircle } from 'lucide-react';
import { withRoleProtection } from '@/lib/hoc/withRoleProtection';
import { UserRole } from '@/lib/constants/roles';

function QueuesPage() {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2 text-slate-900">
            <ListIcon className="w-7 h-7 text-orange-600" />
            Queue Yönetimi
          </h1>
          <p className="text-slate-600 mt-1">
            BullMQ queue'larını izleyin ve yönetin
          </p>
        </div>
        <button className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2.5 rounded-lg flex items-center gap-2 font-medium transition-colors shadow-sm">
          <RefreshCw className="w-4 h-4" />
          Yenile
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-700 font-medium">Aktif Queue'lar</p>
              <p className="text-3xl font-bold text-green-900 mt-1">-</p>
            </div>
            <Activity className="w-10 h-10 text-green-600 opacity-50" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-700 font-medium">Bekleyen Job'lar</p>
              <p className="text-3xl font-bold text-blue-900 mt-1">-</p>
            </div>
            <ListIcon className="w-10 h-10 text-blue-600 opacity-50" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-700 font-medium">İşleniyor</p>
              <p className="text-3xl font-bold text-purple-900 mt-1">-</p>
            </div>
            <Play className="w-10 h-10 text-purple-600 opacity-50" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-700 font-medium">Başarısız</p>
              <p className="text-3xl font-bold text-red-900 mt-1">-</p>
            </div>
            <AlertCircle className="w-10 h-10 text-red-600 opacity-50" />
          </div>
        </div>
      </div>

      {/* Queue List */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900">
            Queue Durumu
          </h2>
        </div>
        <div className="p-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-yellow-800">
              🚧 <strong>Yapım aşamasında:</strong> BullMQ entegrasyonu,
              gerçek zamanlı queue monitoring, job detayları ve queue yönetim
              özellikleri yakında eklenecek.
            </p>
          </div>

          {/* Placeholder queue items */}
          <div className="space-y-3">
            {[
              { name: 'CV Analysis Queue', status: 'active', waiting: 0, active: 0 },
              { name: 'Email Sending Queue', status: 'active', waiting: 0, active: 0 },
              { name: 'Offer Generation Queue', status: 'active', waiting: 0, active: 0 },
              { name: 'AI Test Creation Queue', status: 'active', waiting: 0, active: 0 },
              { name: 'Feedback Processing Queue', status: 'active', waiting: 0, active: 0 },
            ].map((queue, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200"
              >
                <div className="flex items-center gap-4">
                  <Activity className="w-6 h-6 text-green-600" />
                  <div>
                    <p className="font-medium text-slate-900">{queue.name}</p>
                    <p className="text-sm text-slate-600">
                      Durum: <span className="text-green-600 font-medium">{queue.status}</span>
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
                  <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-slate-200 rounded-lg transition-colors">
                      <Play className="w-4 h-4 text-slate-600" />
                    </button>
                    <button className="p-2 hover:bg-slate-200 rounded-lg transition-colors">
                      <Pause className="w-4 h-4 text-slate-600" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default withRoleProtection(QueuesPage, {
  allowedRoles: [UserRole.SUPER_ADMIN]
});
