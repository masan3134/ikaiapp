'use client';

import Link from 'next/link';
import { Activity, Server, Database, Zap, Layers, List as ListIcon } from 'lucide-react';

interface SystemHealthWidgetProps {
  data: {
    backend: string;
    database: string;
    redis: string;
    milvus: string;
    queues: string;
    uptime: number;
    apiResponseTime: number;
    dbConnections: number;
    cacheHitRate: number;
    vectorCount: number;
    queueJobs: number;
  };
}

export default function SystemHealthWidget({ data }: SystemHealthWidgetProps) {
  const services = [
    {
      name: 'Backend API',
      status: data.backend || 'healthy',
      metric: `${data.apiResponseTime || 0}ms`,
      icon: Server
    },
    {
      name: 'PostgreSQL',
      status: data.database || 'healthy',
      metric: `${data.dbConnections || 0} conn`,
      icon: Database
    },
    {
      name: 'Redis Cache',
      status: data.redis || 'healthy',
      metric: `${data.cacheHitRate || 0}% hit`,
      icon: Zap
    },
    {
      name: 'Milvus Vector',
      status: data.milvus || 'healthy',
      metric: `${data.vectorCount || 0} docs`,
      icon: Layers
    },
    {
      name: 'BullMQ Queues',
      status: data.queues || 'healthy',
      metric: `${data.queueJobs || 0} jobs`,
      icon: ListIcon
    }
  ];

  return (
    <div className="bg-white shadow-sm border-l-4 border-rose-500 rounded-lg">
      <div className="p-6 border-b border-slate-200">
        <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
          <Activity className="w-5 h-5 text-rose-600" />
          Sistem Sağlığı
        </h3>
      </div>
      <div className="p-6">
        <div className="space-y-3">
          {services.map(service => (
            <div
              key={service.name}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  service.status === 'healthy' ? 'bg-green-100' :
                  service.status === 'degraded' ? 'bg-yellow-100' :
                  'bg-red-100'
                }`}>
                  <service.icon className={`w-4 h-4 ${
                    service.status === 'healthy' ? 'text-green-600' :
                    service.status === 'degraded' ? 'text-yellow-600' :
                    'text-red-600'
                  }`} />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-800">{service.name}</p>
                  <p className="text-xs text-slate-500">{service.metric}</p>
                </div>
              </div>
              <div className={`flex items-center gap-1 ${
                service.status === 'healthy' ? 'text-green-600' :
                service.status === 'degraded' ? 'text-yellow-600' :
                'text-red-600'
              }`}>
                <div className={`w-2 h-2 rounded-full ${
                  service.status === 'healthy' ? 'bg-green-500 animate-pulse' :
                  service.status === 'degraded' ? 'bg-yellow-500' :
                  'bg-red-500 animate-pulse'
                }`} />
                <span className="text-xs font-medium">
                  {service.status === 'healthy' ? 'Sağlıklı' :
                   service.status === 'degraded' ? 'Yavaş' : 'Hata'}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 p-3 bg-rose-50 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-700">Sistem Uptime</span>
            <span className="text-sm font-bold text-rose-600">{data.uptime || 99.9}%</span>
          </div>
        </div>

        <Link
          href="/super-admin/system-health"
          className="block mt-4 text-center text-sm text-rose-600 hover:text-rose-700 font-medium"
        >
          Detaylı İzleme →
        </Link>
      </div>
    </div>
  );
}
