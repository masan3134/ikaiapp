"use client";

import { Database, Search, Trash2, RefreshCw } from "lucide-react";
import { withRoleProtection } from "@/lib/hoc/withRoleProtection";

function SuperAdminMilvusPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Milvus Vektör Veritabanı</h1>
          <p className="text-gray-600 mt-1">AI embeddings ve vektör arama yönetimi</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
          <RefreshCw className="w-5 h-5" />
          Yenile
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Toplam Collection", value: "3", icon: Database },
          { label: "Toplam Vektör", value: "1.2M", icon: Database },
          { label: "Depolama", value: "2.4 GB", icon: Database },
          { label: "Sorgu/Gün", value: "45K", icon: Search },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <stat.icon className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-900">Collections</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Collection</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vektör Sayısı</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Boyut</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Durum</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {[
                { name: "ai_chat_embeddings", vectors: "856K", size: "1.2 GB", status: "active" },
                { name: "candidate_embeddings", vectors: "342K", size: "890 MB", status: "active" },
                { name: "job_posting_embeddings", vectors: "28K", size: "156 MB", status: "active" },
              ].map((collection) => (
                <tr key={collection.name} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{collection.name}</td>
                  <td className="px-6 py-4 text-gray-600">{collection.vectors}</td>
                  <td className="px-6 py-4 text-gray-600">{collection.size}</td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                      Aktif
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default withRoleProtection(SuperAdminMilvusPage, ["SUPER_ADMIN"]);
