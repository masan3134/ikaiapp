"use client";

import { FileText, Search, Filter, Download } from "lucide-react";
import { withRoleProtection } from "@/lib/hoc/withRoleProtection";

function SuperAdminLogsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sistem Logları</h1>
          <p className="text-gray-600 mt-1">Tüm sistem aktiviteleri ve hata kayıtları</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
          <Download className="w-5 h-5" />
          Logları İndir
        </button>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Loglarda ara..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
          <select className="px-4 py-2 border border-gray-300 rounded-lg">
            <option>Tüm Seviyeler</option>
            <option>ERROR</option>
            <option>WARN</option>
            <option>INFO</option>
            <option>DEBUG</option>
          </select>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Filter className="w-5 h-5" />
            Filtrele
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="text-center py-12 text-gray-500">
          Log kayıtları yüklenecek...
        </div>
      </div>
    </div>
  );
}

export default withRoleProtection(SuperAdminLogsPage, ["SUPER_ADMIN"]);
