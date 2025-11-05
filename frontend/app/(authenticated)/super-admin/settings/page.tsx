"use client";
import { useState, useEffect } from "react";
import { Settings, Save } from "lucide-react";
import { withRoleProtection } from "@/lib/hoc/withRoleProtection";
import apiClient from "@/lib/services/apiClient";
import toast from "react-hot-toast";

function SuperAdminSettingsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    apiClient.get("/api/v1/super-admin/settings").then(r => {
      if (r.data.success) {
        setData(r.data.data);
      } else {
        toast.error(r.data.message || "Ayarlar yüklenemedi");
      }
      setLoading(false);
    }).catch(e => {
      console.error(e);
      toast.error("Ayarlar yüklenirken hata oluştu");
      setLoading(false);
    });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await apiClient.post("/api/v1/super-admin/settings", data);
      if (res.data.success) {
        toast.success("Ayarlar başarıyla kaydedildi!");
      } else {
        toast.error(res.data.message || "Ayarlar kaydedilemedi");
      }
    } catch (e) {
      console.error(e);
      toast.error("Ayarlar kaydedilirken hata oluştu");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-12 text-center">Yükleniyor...</div>;
  if (!data) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Sistem Ayarları</h1>
        <button onClick={handleSave} disabled={saving} className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center gap-2">
          <Save className="w-5 h-5" />
          {saving ? "Kaydediliyor..." : "Kaydet"}
        </button>
      </div>
      <div className="bg-white p-6 rounded border">
        <div className="grid grid-cols-2 gap-6">
          <div><label className="block text-sm font-medium mb-2">Platform Adı</label><input type="text" value={data.general?.platformName || ""} onChange={e => setData({...data, general: {...data.general, platformName: e.target.value}})} className="w-full px-4 py-2 border rounded-lg" /></div>
          <div><label className="block text-sm font-medium mb-2">Zaman Dilimi</label><select value={data.general?.timezone || ""} onChange={e => setData({...data, general: {...data.general, timezone: e.target.value}})} className="w-full px-4 py-2 border rounded-lg"><option>Europe/Istanbul</option><option>UTC</option></select></div>
        </div>
      </div>
    </div>
  );
}
export default withRoleProtection(SuperAdminSettingsPage, ["SUPER_ADMIN"]);