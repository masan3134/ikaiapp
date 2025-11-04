"use client";

import { useEffect, useState } from "react";
import {
  Shield,
  AlertTriangle,
  Check,
  X,
  Clock,
  User,
  MapPin,
} from "lucide-react";
import { withRoleProtection } from "@/lib/hoc/withRoleProtection";
import { UserRole } from "@/lib/constants/roles";
import apiClient from "@/lib/services/apiClient";

interface SecurityStats {
  totalUsers: number;
  activeToday: number;
  activeThisWeek: number;
  newToday: number;
  suspiciousActivity: number;
  failedLogins: number;
}

interface SecurityEvent {
  id: string;
  event: string;
  type: string;
  user: string;
  role: string;
  organization: string;
  timestamp: string;
  ip: string;
}

function SecurityLogsPage() {
  const [stats, setStats] = useState<SecurityStats | null>(null);
  const [events, setEvents] = useState<SecurityEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSecurityLogs();
  }, []);

  const loadSecurityLogs = async () => {
    try {
      const res = await apiClient.get("/api/v1/super-admin/security-logs");
      const data = res.data;

      if (data.success) {
        setStats(data.data.stats);
        setEvents(data.data.events);
      }
    } catch (error) {
      console.error("Error loading security logs:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2 text-slate-900">
            <Shield className="w-7 h-7 text-indigo-600" />
            Güvenlik Logları
          </h1>
          <p className="text-slate-600 mt-1">
            Güvenlik olaylarını ve sistem aktivitelerini izleyin
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition-colors">
            Filtrele
          </button>
          <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors">
            Export
          </button>
        </div>
      </div>

      {/* Security Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-700 font-medium">Aktif Bugün</p>
              <p className="text-3xl font-bold text-green-900 mt-1">
                {loading ? "..." : stats?.activeToday || 0}
              </p>
            </div>
            <Check className="w-10 h-10 text-green-600 opacity-50" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-700 font-medium">
                Aktif Bu Hafta
              </p>
              <p className="text-3xl font-bold text-blue-900 mt-1">
                {loading ? "..." : stats?.activeThisWeek || 0}
              </p>
            </div>
            <User className="w-10 h-10 text-blue-600 opacity-50" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-700 font-medium">Yeni Bugün</p>
              <p className="text-3xl font-bold text-purple-900 mt-1">
                {loading ? "..." : stats?.newToday || 0}
              </p>
            </div>
            <Clock className="w-10 h-10 text-purple-600 opacity-50" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-700 font-medium">
                Toplam Kullanıcı
              </p>
              <p className="text-3xl font-bold text-slate-900 mt-1">
                {loading ? "..." : stats?.totalUsers || 0}
              </p>
            </div>
            <User className="w-10 h-10 text-slate-600 opacity-50" />
          </div>
        </div>
      </div>

      {/* Security Events Log */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">
              Son Güvenlik Olayları
            </h2>
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Clock className="w-4 h-4" />
              Son 24 Saat
            </div>
          </div>
        </div>
        <div className="p-6">
          {loading ? (
            <div className="text-center py-8 text-slate-600">Yükleniyor...</div>
          ) : events.length === 0 ? (
            <div className="text-center py-8 text-slate-600">
              Güvenlik olayı bulunamadı
            </div>
          ) : (
            <div className="space-y-3">
              {events.map((log) => (
                <div
                  key={log.id}
                  className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0"></div>
                    <div>
                      <p className="font-medium text-slate-900">{log.event}</p>
                      <div className="flex items-center gap-4 mt-1 text-sm text-slate-600">
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {log.user}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {log.organization}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(log.timestamp).toLocaleString("tr-TR")}
                        </span>
                      </div>
                    </div>
                  </div>
                  <span className="px-2 py-1 text-xs bg-slate-200 text-slate-700 rounded">
                    {log.role}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Activity Summary */}
      <div className="mt-6 bg-gradient-to-br from-indigo-50 to-indigo-100 border border-indigo-200 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-1">
              Aktivite Özeti
            </h3>
            <p className="text-sm text-slate-600">
              Son güvenlik olayları ve kullanıcı aktiviteleri
            </p>
          </div>
          <div className="text-center">
            <div className="text-5xl font-bold text-indigo-600">
              {loading ? "..." : events.length}
            </div>
            <p className="text-sm text-slate-600 mt-1">Son olay</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default withRoleProtection(SecurityLogsPage, {
  allowedRoles: [UserRole.SUPER_ADMIN],
});
