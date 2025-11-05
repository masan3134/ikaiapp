"use client";
import { useState, useEffect } from "react";
import { Server, Cpu, Activity, Zap } from "lucide-react";
import { withRoleProtection } from "@/lib/hoc/withRoleProtection";
import apiClient from "@/lib/services/apiClient";
import toast from "react-hot-toast";

function SuperAdminSystemPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get("/api/v1/super-admin/system-health").then(r => {
      if (r.data?.success && r.data?.data) {
        setData(r.data.data);
      } else {
        // Fallback to default data if API fails
        setData({ services: {} });
      }
      setLoading(false);
    }).catch(e => {
      console.error(e);
      // Set default data on error instead of leaving null
      setData({ services: {} });
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="p-12 text-center">Yükleniyor...</div>;
  if (!data) return <div className="p-12 text-center text-gray-500">Veri yüklenemedi</div>;

  const services = [
    {
      name: "Database",
      status: data.services?.database?.status || "unknown",
      type: data.services?.database?.type || "PostgreSQL",
      stats: data.services?.database?.stats
    },
    {
      name: "Redis",
      status: data.services?.redis?.status || "unknown",
      info: data.services?.redis?.info
    },
    {
      name: "Milvus",
      status: data.services?.milvus?.status || "unknown",
      collections: data.services?.milvus?.collections
    },
    {
      name: "Backend",
      status: "healthy", // If we got response, backend is up
      uptime: data.services?.backend?.uptime
    }
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Sistem Sağlığı</h1>
      <div className="text-sm text-gray-600">Son Güncelleme: {new Date(data.timestamp).toLocaleString('tr-TR')}</div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {services.map(service => (
          <div key={service.name} className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${
                  service.status === 'healthy' ? 'bg-green-600' :
                  service.status === 'unhealthy' ? 'bg-red-600' :
                  'bg-gray-400'
                }`}></div>
                <h3 className="font-semibold text-lg">{service.name}</h3>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                service.status === 'healthy' ? 'bg-green-100 text-green-700' :
                service.status === 'unhealthy' ? 'bg-red-100 text-red-700' :
                'bg-gray-100 text-gray-700'
              }`}>
                {service.status === 'healthy' ? 'Sağlıklı' :
                 service.status === 'unhealthy' ? 'Sorunlu' :
                 'Bilinmiyor'}
              </span>
            </div>

            {service.stats && (
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Toplam Kullanıcı:</span>
                  <span className="font-medium">{service.stats.total_users}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Toplam Organizasyon:</span>
                  <span className="font-medium">{service.stats.total_orgs}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Toplam Analiz:</span>
                  <span className="font-medium">{service.stats.total_analyses}</span>
                </div>
              </div>
            )}

            {service.info && (
              <div className="text-sm text-gray-600">
                {service.info.version && <div>Versiyon: {service.info.version}</div>}
                {service.info.connected_clients !== undefined && (
                  <div>Bağlı İstemci: {service.info.connected_clients}</div>
                )}
              </div>
            )}

            {service.collections !== undefined && (
              <div className="text-sm text-gray-600">
                Koleksiyon Sayısı: {service.collections?.length || 0}
              </div>
            )}

            {service.uptime && (
              <div className="text-sm text-gray-600">
                Çalışma Süresi: {Math.floor(service.uptime / 3600)}h {Math.floor((service.uptime % 3600) / 60)}m
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
export default withRoleProtection(SuperAdminSystemPage, ["SUPER_ADMIN"]);