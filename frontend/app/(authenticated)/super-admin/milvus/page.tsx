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
      if (r.data.success) {
        setData(r.data.data);
      } else {
        toast.error(r.data.message || "Milvus istatistikleri yüklenemedi");
      }
      setLoading(false);
    }).catch(e => {
      console.error(e);
      toast.error("Milvus istatistikleri yüklenirken hata oluştu");
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="p-12 text-center">Yükleniyor...</div>;
  if (!data) return null;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Milvus Vektör Veritabanı</h1>
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded border"><div className="text-2xl font-bold">{data.collections?.length || 0}</div><div className="text-sm text-gray-600">Toplam Collection</div></div>
      </div>
    </div>
  );
}
export default withRoleProtection(SuperAdminMilvusPage, ["SUPER_ADMIN"]);