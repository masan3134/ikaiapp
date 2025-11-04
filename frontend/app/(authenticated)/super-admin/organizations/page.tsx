'use client';

import { Building2, Plus, Edit, Trash2, Users, Calendar } from 'lucide-react';
import { withRoleProtection } from '@/lib/hoc/withRoleProtection';
import { UserRole } from '@/lib/constants/roles';

function OrganizationsPage() {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2 text-slate-900">
            <Building2 className="w-7 h-7 text-rose-600" />
            Organizasyon Yönetimi
          </h1>
          <p className="text-slate-600 mt-1">
            Tüm organizasyonları görüntüleyin ve yönetin
          </p>
        </div>
        <button className="bg-rose-600 hover:bg-rose-700 text-white px-4 py-2.5 rounded-lg flex items-center gap-2 font-medium transition-colors shadow-sm">
          <Plus className="w-4 h-4" />
          Yeni Organizasyon
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-700 font-medium">Toplam Organizasyon</p>
              <p className="text-3xl font-bold text-blue-900 mt-1">-</p>
            </div>
            <Building2 className="w-10 h-10 text-blue-600 opacity-50" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-700 font-medium">Aktif Organizasyon</p>
              <p className="text-3xl font-bold text-green-900 mt-1">-</p>
            </div>
            <Users className="w-10 h-10 text-green-600 opacity-50" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-700 font-medium">Bu Ay Yeni</p>
              <p className="text-3xl font-bold text-purple-900 mt-1">-</p>
            </div>
            <Calendar className="w-10 h-10 text-purple-600 opacity-50" />
          </div>
        </div>
      </div>

      {/* Organizations Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900">
            Organizasyon Listesi
          </h2>
        </div>
        <div className="p-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              🚧 <strong>Yapım aşamasında:</strong> Organizasyon listesi, detaylar,
              düzenleme ve plan yönetimi özellikleri yakında eklenecek.
            </p>
          </div>

          {/* Placeholder table structure */}
          <div className="mt-6 space-y-2">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
              <div className="flex items-center gap-4">
                <Building2 className="w-8 h-8 text-slate-400" />
                <div>
                  <p className="font-medium text-slate-900">Örnek Organizasyon 1</p>
                  <p className="text-sm text-slate-600">PRO Plan • 12 Kullanıcı</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-slate-200 rounded-lg transition-colors">
                  <Edit className="w-4 h-4 text-slate-600" />
                </button>
                <button className="p-2 hover:bg-red-50 rounded-lg transition-colors">
                  <Trash2 className="w-4 h-4 text-red-600" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default withRoleProtection(OrganizationsPage, {
  allowedRoles: [UserRole.SUPER_ADMIN]
});
