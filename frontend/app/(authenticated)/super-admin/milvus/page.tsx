"use client";
import { useState, useEffect } from "react";
import { Database } from "lucide-react";
import { withRoleProtection } from "@/lib/hoc/withRoleProtection";
import apiClient from "@/lib/services/apiClient";
import toast from "react-hot-toast";

function SuperAdminMilvusPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get("/api/v1/super-admin/milvus-stats").then(r => {
      if (r.data?.success && r.data?.data) {
        setData(r.data.data);
      } else {
        // Fallback to default data if API fails
        setData({ status: 'unknown', collections: [] });
      }
      setLoading(false);
    }).catch(e => {
      console.error(e);
      // Set default data on error instead of leaving null
      setData({ status: 'unknown', collections: [] });
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="p-12 text-center">Yükleniyor...</div>;
  if (!data) return <div className="p-12 text-center text-gray-500">Veri yüklenemedi</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Milvus Vektör Veritabanı</h1>
        <p className="text-gray-600 mt-1">Vektör veritabanı durumu ve koleksiyon bilgileri</p>
      </div>

      {/* Status Card */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className={`w-3 h-3 rounded-full ${
            data.status === 'operational' ? 'bg-green-600' : 'bg-red-600'
          }`}></div>
          <span className="text-lg font-semibold">
            Durum: {data.status === 'operational' ? 'Operasyonel' : 'Sorunlu'}
          </span>
        </div>

        {data.note && (
          <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg border border-blue-200">
            ℹ️ {data.note}
          </div>
        )}
      </div>

      {/* Collections */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Koleksiyonlar ({data.collections?.length || 0})</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.collections && data.collections.length > 0 ? (
            data.collections.map((collection: any) => (
              <div key={collection.name} className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900">{collection.name}</h3>
                  <Database className="w-5 h-5 text-blue-600" />
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tahmini Kayıt:</span>
                    <span className="font-medium">{collection.estimatedCount || 0}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-2 text-center py-12 text-gray-500">
              Henüz koleksiyon bulunamadı
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
export default withRoleProtection(SuperAdminMilvusPage, ["SUPER_ADMIN"]);