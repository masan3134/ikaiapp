'use client';

import { useState, useEffect } from 'react';
import { Activity, Database, Server, HardDrive, Cpu, Zap, CheckCircle, XCircle, RefreshCw, Clock } from 'lucide-react';
import { withRoleProtection } from '@/lib/hoc/withRoleProtection';
import { UserRole } from '@/lib/constants/roles';

interface ServiceHealth {
  status: string;
  type?: string;
  uptime?: number;
  stats?: any;
  url?: string;
  note?: string;
  error?: string;
}

interface HealthData {
  timestamp: string;
  overall: string;
  services: {
    backend?: ServiceHealth;
    database?: ServiceHealth;
    redis?: ServiceHealth;
    milvus?: ServiceHealth;
  };
}

function SystemHealthPage() {
  const [health, setHealth] = useState<HealthData | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    loadHealth();
    // Auto-refresh every 10 seconds
    const interval = setInterval(loadHealth, 10000);
    return () => clearInterval(interval);
  }, []);

  const loadHealth = async () => {
    try {
      const res = await fetch('/api/v1/super-admin/system-health');
      const data = await res.json();

      if (data.success) {
        setHealth(data.data);
        setLastUpdated(new Date());
      }
    } catch (error) {
      console.error('Error loading system health:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const services = [
    {
      key: 'backend',
      name: 'Backend API',
      icon: Server,
      color: 'green',
      data: health?.services?.backend
    },
    {
      key: 'database',
      name: 'PostgreSQL',
      icon: Database,
      color: 'blue',
      data: health?.services?.database
    },
    {
      key: 'redis',
      name: 'Redis Cache',
      icon: Zap,
      color: 'orange',
      data: health?.services?.redis
    },
    {
      key: 'milvus',
      name: 'Milvus Vector DB',
      icon: HardDrive,
      color: 'purple',
      data: health?.services?.milvus
    }
  ];

  const allHealthy = health?.overall === 'healthy';

  return (
    <div className="p-6">
      {/* Header */}
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
          {lastUpdated && (
            <div className="text-sm text-slate-600 flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {lastUpdated.toLocaleTimeString('tr-TR')}
            </div>
          )}
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium ${
            allHealthy
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}>
            {allHealthy ? (
              <>
                <CheckCircle className="w-4 h-4" />
                Tüm Sistemler Operasyonel
              </>
            ) : (
              <>
                <XCircle className="w-4 h-4" />
                Sistem Sorunları Var
              </>
            )}
          </div>
          <button
            onClick={loadHealth}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-lg flex items-center gap-2 font-medium transition-colors shadow-sm"
          >
            <RefreshCw className="w-4 h-4" />
            Yenile
          </button>
        </div>
      </div>

      {/* Service Status Grid */}
      {loading ? (
        <div className="text-center py-12 text-slate-600">Sistem durumu kontrol ediliyor...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {services.map((service) => {
            const Icon = service.icon;
            const isHealthy = service.data?.status === 'healthy';

            return (
              <div
                key={service.key}
                className={`bg-gradient-to-br ${
                  isHealthy
                    ? `from-${service.color}-50 to-${service.color}-100 border-${service.color}-200`
                    : 'from-red-50 to-red-100 border-red-200'
                } border rounded-xl p-5`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Icon className={`w-7 h-7 text-${service.color}-600`} />
                    <div>
                      <p className="font-bold text-slate-900">{service.name}</p>
                      {service.data?.type && (
                        <p className="text-sm text-slate-600">{service.data.type}</p>
                      )}
                    </div>
                  </div>
                  {isHealthy ? (
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  ) : (
                    <XCircle className="w-6 h-6 text-red-600" />
                  )}
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between py-2 border-t border-slate-200">
                    <span className="text-slate-600">Durum:</span>
                    <span className={`font-semibold ${isHealthy ? 'text-green-600' : 'text-red-600'}`}>
                      {isHealthy ? 'Sağlıklı' : 'Sorunlu'}
                    </span>
                  </div>

                  {service.data?.uptime !== undefined && (
                    <div className="flex items-center justify-between py-2 border-t border-slate-200">
                      <span className="text-slate-600">Uptime:</span>
                      <span className="font-semibold text-slate-900">
                        {formatUptime(service.data.uptime)}
                      </span>
                    </div>
                  )}

                  {service.data?.stats && (
                    <div className="mt-3 p-3 bg-white bg-opacity-50 rounded-lg">
                      <p className="text-xs font-medium text-slate-700 mb-2">Database Stats:</p>
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div>
                          <p className="text-slate-600">Users</p>
                          <p className="font-bold text-slate-900">{service.data.stats.total_users}</p>
                        </div>
                        <div>
                          <p className="text-slate-600">Orgs</p>
                          <p className="font-bold text-slate-900">{service.data.stats.total_orgs}</p>
                        </div>
                        <div>
                          <p className="text-slate-600">Analyses</p>
                          <p className="font-bold text-slate-900">{service.data.stats.total_analyses}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {service.data?.error && (
                    <div className="mt-2 p-3 bg-red-100 rounded-lg">
                      <p className="text-xs text-red-800">
                        <strong>Error:</strong> {service.data.error}
                      </p>
                    </div>
                  )}

                  {service.data?.note && (
                    <div className="mt-2 text-xs text-slate-500 italic">
                      {service.data.note}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Overall System Status */}
      <div className={`mt-6 bg-gradient-to-br ${
        allHealthy ? 'from-green-50 to-green-100 border-green-200' : 'from-red-50 to-red-100 border-red-200'
      } border rounded-xl p-6`}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-1 flex items-center gap-2">
              {allHealthy ? (
                <CheckCircle className="w-6 h-6 text-green-600" />
              ) : (
                <XCircle className="w-6 h-6 text-red-600" />
              )}
              Genel Sistem Durumu
            </h3>
            <p className="text-sm text-slate-600">
              {health?.timestamp && `Son kontrol: ${new Date(health.timestamp).toLocaleString('tr-TR')}`}
            </p>
          </div>
          <div className="text-center">
            <div className={`text-5xl font-bold ${allHealthy ? 'text-green-600' : 'text-red-600'}`}>
              {allHealthy ? 'OK' : 'ERR'}
            </div>
            <p className="text-sm text-slate-600 mt-1">
              {allHealthy ? 'Tüm Servisler Çalışıyor' : 'Bazı Servisler Sorunlu'}
            </p>
          </div>
        </div>
      </div>

      {/* Auto-refresh notice */}
      <div className="mt-4 text-center text-sm text-slate-500">
        🔄 Otomatik yenileme: 10 saniyede bir
      </div>
    </div>
  );
}

export default withRoleProtection(SystemHealthPage, {
  allowedRoles: [UserRole.SUPER_ADMIN]
});
