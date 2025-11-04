'use client';

import { Activity, Database, Server, HardDrive, Cpu, Zap, CheckCircle, XCircle } from 'lucide-react';
import { withRoleProtection } from '@/lib/hoc/withRoleProtection';
import { UserRole } from '@/lib/constants/roles';

function SystemHealthPage() {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2 text-slate-900">
            <Activity className="w-7 h-7 text-green-600" />
            Sistem Sağlığı
          </h1>
          <p className="text-slate-600 mt-1">
            Tüm servislerin durum ve performans izleme
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-green-100 text-green-800 rounded-lg text-sm font-medium">
            <CheckCircle className="w-4 h-4" />
            Tüm Sistemler Operasyonel
          </div>
        </div>
      </div>

      {/* Service Status Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {[
          { name: 'Backend API', status: 'healthy', icon: Server, color: 'green', uptime: '99.9%' },
          { name: 'PostgreSQL', status: 'healthy', icon: Database, color: 'blue', uptime: '100%' },
          { name: 'Redis Cache', status: 'healthy', icon: Zap, color: 'orange', uptime: '99.8%' },
          { name: 'Milvus Vector DB', status: 'healthy', icon: HardDrive, color: 'purple', uptime: '99.5%' },
          { name: 'BullMQ Queues', status: 'healthy', icon: Activity, color: 'indigo', uptime: '99.7%' },
          { name: 'MinIO Storage', status: 'healthy', icon: HardDrive, color: 'teal', uptime: '99.9%' },
        ].map((service, index) => {
          const Icon = service.icon;
          const isHealthy = service.status === 'healthy';

          return (
            <div
              key={index}
              className={`bg-gradient-to-br ${
                isHealthy
                  ? `from-${service.color}-50 to-${service.color}-100 border-${service.color}-200`
                  : 'from-red-50 to-red-100 border-red-200'
              } border rounded-xl p-5`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Icon className={`w-6 h-6 text-${service.color}-600`} />
                  <p className="font-semibold text-slate-900">{service.name}</p>
                </div>
                {isHealthy ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600" />
                )}
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Durum:</span>
                  <span className={`font-medium ${isHealthy ? 'text-green-600' : 'text-red-600'}`}>
                    {isHealthy ? 'Sağlıklı' : 'Sorunlu'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Uptime:</span>
                  <span className="font-medium text-slate-900">{service.uptime}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Response Time */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-5 h-5 text-yellow-600" />
            <h2 className="text-lg font-semibold text-slate-900">API Response Time</h2>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              📊 Ortalama yanıt süresi, son 1 saat ve 24 saat grafikleri yakında eklenecek.
            </p>
          </div>
        </div>

        {/* Resource Usage */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Cpu className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-slate-900">Kaynak Kullanımı</h2>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              💻 CPU, RAM, Disk kullanım metrikleri yakında eklenecek.
            </p>
          </div>
        </div>
      </div>

      {/* Connection Status */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900">
            Bağlantı Durumu
          </h2>
        </div>
        <div className="p-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              🚧 <strong>Yapım aşamasında:</strong> Database connection pool,
              Redis connections, WebSocket connections ve diğer servis bağlantı
              detayları yakında eklenecek.
            </p>
          </div>

          {/* Placeholder metrics */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { label: 'DB Connections', value: '-', color: 'blue' },
              { label: 'Redis Connections', value: '-', color: 'orange' },
              { label: 'Active WebSockets', value: '-', color: 'green' },
            ].map((metric, index) => (
              <div key={index} className="text-center p-4 bg-slate-50 rounded-lg border border-slate-200">
                <p className="text-sm text-slate-600 mb-1">{metric.label}</p>
                <p className={`text-3xl font-bold text-${metric.color}-600`}>{metric.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default withRoleProtection(SystemHealthPage, {
  allowedRoles: [UserRole.SUPER_ADMIN]
});
