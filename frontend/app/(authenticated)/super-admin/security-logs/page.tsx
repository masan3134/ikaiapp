'use client';

import { Shield, AlertTriangle, Check, X, Clock, User, MapPin } from 'lucide-react';
import { withRoleProtection } from '@/lib/hoc/withRoleProtection';
import { UserRole } from '@/lib/constants/roles';

function SecurityLogsPage() {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2 text-slate-900">
            <Shield className="w-7 h-7 text-indigo-600" />
            Güvenlik Logları
          </h1>
          <p className="text-slate-600 mt-1">
            Güvenlik olaylarını ve sistem aktivitelerini izleyin
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition-colors">
            Filtrele
          </button>
          <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors">
            Export
          </button>
        </div>
      </div>

      {/* Security Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-700 font-medium">Başarılı Login</p>
              <p className="text-3xl font-bold text-green-900 mt-1">-</p>
            </div>
            <Check className="w-10 h-10 text-green-600 opacity-50" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-700 font-medium">Başarısız Login</p>
              <p className="text-3xl font-bold text-red-900 mt-1">-</p>
            </div>
            <X className="w-10 h-10 text-red-600 opacity-50" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-orange-700 font-medium">Şüpheli Aktivite</p>
              <p className="text-3xl font-bold text-orange-900 mt-1">-</p>
            </div>
            <AlertTriangle className="w-10 h-10 text-orange-600 opacity-50" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-700 font-medium">Rate Limit Hit</p>
              <p className="text-3xl font-bold text-blue-900 mt-1">-</p>
            </div>
            <Clock className="w-10 h-10 text-blue-600 opacity-50" />
          </div>
        </div>
      </div>

      {/* Security Events Log */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">
              Son Güvenlik Olayları
            </h2>
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Clock className="w-4 h-4" />
              Son 24 Saat
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-yellow-800">
              🚧 <strong>Yapım aşamasında:</strong> Gerçek zamanlı güvenlik log'ları,
              kullanıcı aktivite izleme, IP tabanlı analiz ve güvenlik uyarı sistemi
              yakında eklenecek.
            </p>
          </div>

          {/* Placeholder security events */}
          <div className="space-y-3">
            {[
              {
                type: 'success',
                event: 'Başarılı Login',
                user: 'admin@example.com',
                ip: '192.168.1.100',
                time: '2 dakika önce',
                color: 'green',
              },
              {
                type: 'warning',
                event: 'Başarısız Login Denemesi',
                user: 'unknown@example.com',
                ip: '45.123.45.67',
                time: '15 dakika önce',
                color: 'red',
              },
              {
                type: 'info',
                event: 'Rate Limit Uyarısı',
                user: 'api@service.com',
                ip: '10.0.0.5',
                time: '30 dakika önce',
                color: 'blue',
              },
            ].map((log, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-2 h-2 rounded-full bg-${log.color}-500 flex-shrink-0`}
                  ></div>
                  <div>
                    <p className="font-medium text-slate-900">{log.event}</p>
                    <div className="flex items-center gap-4 mt-1 text-sm text-slate-600">
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {log.user}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {log.ip}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {log.time}
                      </span>
                    </div>
                  </div>
                </div>
                <button className="px-3 py-1 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded transition-colors">
                  Detay
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Security Score */}
      <div className="mt-6 bg-gradient-to-br from-indigo-50 to-indigo-100 border border-indigo-200 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-1">Güvenlik Skoru</h3>
            <p className="text-sm text-slate-600">
              Platform genelindeki güvenlik durumunun özeti
            </p>
          </div>
          <div className="text-center">
            <div className="text-5xl font-bold text-indigo-600">-</div>
            <p className="text-sm text-slate-600 mt-1">/ 100</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default withRoleProtection(SecurityLogsPage, {
  allowedRoles: [UserRole.SUPER_ADMIN]
});
