"use client";

import { Shield, Lock, Eye, AlertTriangle, CheckCircle } from "lucide-react";
import { withRoleProtection } from "@/lib/hoc/withRoleProtection";

function SuperAdminSecurityPage() {
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
              <div className="text-2xl font-bold text-gray-900">3</div>
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
              <div className="text-2xl font-bold text-gray-900">24/7</div>
              <div className="text-sm text-gray-600">Aktif İzleme</div>
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
              <span className="px-2.5 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">Aktif</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-700">Şifre Karmaşıklığı</span>
              <span className="px-2.5 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">Zorunlu</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-700">Oturum Zaman Aşımı</span>
              <span className="text-sm text-gray-600">30 dakika</span>
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
              <span className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">Pasif</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-700">API Rate Limiting</span>
              <span className="px-2.5 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">Aktif</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-700">CORS Koruması</span>
              <span className="px-2.5 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">Aktif</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Son Güvenlik Olayları</h2>
        <div className="text-center py-8 text-gray-500">
          Olay kaydı yüklenecek...
        </div>
      </div>
    </div>
  );
}

export default withRoleProtection(SuperAdminSecurityPage, ["SUPER_ADMIN"]);
