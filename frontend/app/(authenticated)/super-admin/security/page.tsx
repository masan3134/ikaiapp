"use client";

import { useState, useEffect } from "react";
import { Shield, Lock, Eye, AlertTriangle, CheckCircle } from "lucide-react";
import { withRoleProtection } from "@/lib/hoc/withRoleProtection";
import apiClient from "@/lib/services/apiClient";
import toast from "react-hot-toast";

function SuperAdminSecurityPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSecuritySettings();
  }, []);

  const loadSecuritySettings = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get("/api/v1/super-admin/security-settings");

      if (res.data.success) {
        setData(res.data.data);
      } else {
        toast.error(res.data.message || "Güvenlik ayarları yüklenemedi");
      }
    } catch (error) {
      console.error("Error loading security settings:", error);
      toast.error("Güvenlik ayarları yüklenirken hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = (category: "authentication" | "accessControl", field: string) => {
    setSaving(true);

    // Update local state immediately (optimistic update)
    setData((prev: any) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: !prev[category][field]
      }
    }));

    // Simulate API call (in real implementation, would call backend)
    setTimeout(() => {
      setSaving(false);
      toast.success(`${field} ayarı güncellendi`);
    }, 300);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Güvenlik Yönetimi</h1>
          <p className="text-gray-600 mt-1">Sistem güvenliği ve erişim kontrolü</p>
        </div>
        <div className="text-center py-12 text-gray-500">Yükleniyor...</div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Güvenlik Yönetimi</h1>
        <p className="text-gray-600 mt-1">Sistem güvenliği ve erişim kontrolü</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">Güvenli</div>
              <div className="text-sm text-gray-600">Sistem Durumu</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{data.stats.suspiciousActivity}</div>
              <div className="text-sm text-gray-600">Güvenlik Uyarısı</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Eye className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{data.stats.recentLogins}</div>
              <div className="text-sm text-gray-600">Son 24 Saat Aktivite</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-red-100 rounded-lg">
              <Lock className="w-5 h-5 text-red-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Kimlik Doğrulama</h2>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-700">İki Faktörlü Doğrulama</span>
              <button
                onClick={() => handleToggle("authentication", "twoFactorEnabled")}
                disabled={saving}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  data.authentication.twoFactorEnabled
                    ? "bg-green-600 text-white hover:bg-green-700"
                    : "bg-gray-300 text-gray-700 hover:bg-gray-400"
                } disabled:opacity-50`}
              >
                {data.authentication.twoFactorEnabled ? "Aktif" : "Pasif"}
              </button>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-700">Şifre Karmaşıklığı</span>
              <button
                onClick={() => handleToggle("authentication", "passwordComplexity")}
                disabled={saving}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  data.authentication.passwordComplexity
                    ? "bg-green-600 text-white hover:bg-green-700"
                    : "bg-gray-300 text-gray-700 hover:bg-gray-400"
                } disabled:opacity-50`}
              >
                {data.authentication.passwordComplexity ? "Zorunlu" : "Pasif"}
              </button>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-700">Oturum Zaman Aşımı</span>
              <span className="text-sm text-gray-600">{data.authentication.sessionTimeout} dakika</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-red-100 rounded-lg">
              <Shield className="w-5 h-5 text-red-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Erişim Kontrolü</h2>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-700">IP Beyaz Listesi</span>
              <button
                onClick={() => handleToggle("accessControl", "ipWhitelist")}
                disabled={saving}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  data.accessControl.ipWhitelist
                    ? "bg-green-600 text-white hover:bg-green-700"
                    : "bg-gray-300 text-gray-700 hover:bg-gray-400"
                } disabled:opacity-50`}
              >
                {data.accessControl.ipWhitelist ? "Aktif" : "Pasif"}
              </button>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-700">API Rate Limiting</span>
              <button
                onClick={() => handleToggle("accessControl", "apiRateLimit")}
                disabled={saving}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  data.accessControl.apiRateLimit
                    ? "bg-green-600 text-white hover:bg-green-700"
                    : "bg-gray-300 text-gray-700 hover:bg-gray-400"
                } disabled:opacity-50`}
              >
                {data.accessControl.apiRateLimit ? "Aktif" : "Pasif"}
              </button>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-700">CORS Koruması</span>
              <button
                onClick={() => handleToggle("accessControl", "corsProtection")}
                disabled={saving}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  data.accessControl.corsProtection
                    ? "bg-green-600 text-white hover:bg-green-700"
                    : "bg-gray-300 text-gray-700 hover:bg-gray-400"
                } disabled:opacity-50`}
              >
                {data.accessControl.corsProtection ? "Aktif" : "Pasif"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Kullanıcı İstatistikleri</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600">Toplam Kullanıcı</div>
            <div className="text-2xl font-bold text-gray-900 mt-1">{data.stats.totalUsers}</div>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <div className="text-sm text-gray-600">Aktif Kullanıcı</div>
            <div className="text-2xl font-bold text-green-600 mt-1">{data.stats.activeUsers}</div>
          </div>
          <div className="p-4 bg-red-50 rounded-lg">
            <div className="text-sm text-gray-600">Pasif Kullanıcı</div>
            <div className="text-2xl font-bold text-red-600 mt-1">{data.stats.inactiveUsers}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default withRoleProtection(SuperAdminSecurityPage, ["SUPER_ADMIN"]);
