"use client";

import { useState, useEffect } from "react";
import { FileText, Search, Filter, Download } from "lucide-react";
import { withRoleProtection } from "@/lib/hoc/withRoleProtection";
import apiClient from "@/lib/services/apiClient";

function SuperAdminLogsPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [level, setLevel] = useState("all");

  useEffect(() => {
    loadLogs();
  }, [level]);

  const loadLogs = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get(`/api/v1/super-admin/logs?level=${level}&limit=50`);
      if (res.data.success) {
        setLogs(res.data.data.logs);
      }
    } catch (error) {
      console.error("Error loading logs:", error);
    } finally {
      setLoading(false);
    }
  };

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
          <select
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg"
          >
            <option value="all">Tüm Seviyeler</option>
            <option value="ERROR">ERROR</option>
            <option value="WARN">WARN</option>
            <option value="INFO">INFO</option>
            <option value="DEBUG">DEBUG</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        {loading ? (
          <div className="text-center py-12 text-gray-500">Yükleniyor...</div>
        ) : logs.length === 0 ? (
          <div className="text-center py-12 text-gray-500">Log kaydı bulunamadı</div>
        ) : (
          <div className="space-y-2">
            {logs.map((log, i) => (
              <div key={i} className="p-3 bg-gray-50 rounded border-l-4 border-red-500 text-sm font-mono">
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded text-xs font-semibold">
                    {log.level || "INFO"}
                  </span>
                  <span className="text-gray-500">{log.timestamp || new Date().toISOString()}</span>
                </div>
                <div className="text-gray-900">{log.message}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default withRoleProtection(SuperAdminLogsPage, ["SUPER_ADMIN"]);
