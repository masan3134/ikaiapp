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
  Search,
  Filter,
  Download,
  ChevronLeft,
  ChevronRight,
  Info,
  XCircle,
  RefreshCw,
  Eye,
  Calendar,
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
  severity: "INFO" | "WARN" | "ERROR" | "CRITICAL";
  user: string;
  role: string;
  organization: string;
  timestamp: string;
  ip: string;
  details?: string;
}

type DateRange = "today" | "week" | "month" | "all" | "custom";
type LogLevel = "all" | "INFO" | "WARN" | "ERROR" | "CRITICAL";

function SecurityLogsPage() {
  const [stats, setStats] = useState<SecurityStats | null>(null);
  const [events, setEvents] = useState<SecurityEvent[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<SecurityEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [logLevel, setLogLevel] = useState<LogLevel>("all");
  const [dateRange, setDateRange] = useState<DateRange>("today");
  const [showFilters, setShowFilters] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Modal
  const [selectedLog, setSelectedLog] = useState<SecurityEvent | null>(null);
  const [showExportModal, setShowExportModal] = useState(false);

  useEffect(() => {
    loadSecurityLogs();
  }, []);

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(loadSecurityLogs, 30000); // Refresh every 30s
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  useEffect(() => {
    applyFilters();
  }, [events, searchQuery, logLevel, dateRange]);

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

  const applyFilters = () => {
    let filtered = [...events];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (e) =>
          e.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
          e.event.toLowerCase().includes(searchQuery.toLowerCase()) ||
          e.organization.toLowerCase().includes(searchQuery.toLowerCase()) ||
          e.ip.includes(searchQuery)
      );
    }

    // Log level filter
    if (logLevel !== "all") {
      filtered = filtered.filter((e) => e.severity === logLevel);
    }

    // Date range filter
    const now = new Date();
    if (dateRange === "today") {
      filtered = filtered.filter((e) => {
        const logDate = new Date(e.timestamp);
        return logDate.toDateString() === now.toDateString();
      });
    } else if (dateRange === "week") {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      filtered = filtered.filter((e) => new Date(e.timestamp) >= weekAgo);
    } else if (dateRange === "month") {
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      filtered = filtered.filter((e) => new Date(e.timestamp) >= monthAgo);
    }

    setFilteredEvents(filtered);
    setCurrentPage(1); // Reset to first page
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "INFO":
        return "bg-blue-500";
      case "WARN":
        return "bg-yellow-500";
      case "ERROR":
        return "bg-orange-500";
      case "CRITICAL":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "INFO":
        return <Info className="w-4 h-4" />;
      case "WARN":
        return <AlertTriangle className="w-4 h-4" />;
      case "ERROR":
      case "CRITICAL":
        return <XCircle className="w-4 h-4" />;
      default:
        return <Info className="w-4 h-4" />;
    }
  };

  const exportLogs = (format: "csv" | "json" | "pdf") => {
    console.log(`Exporting ${filteredEvents.length} logs as ${format.toUpperCase()}...`);
    // TODO: Implement actual export
    setShowExportModal(false);
  };

  // Pagination
  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedEvents = filteredEvents.slice(startIndex, endIndex);

  return (
    <div className="p-6">
      {/* Header */}
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
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
              autoRefresh
                ? "bg-indigo-600 text-white"
                : "bg-slate-100 hover:bg-slate-200 text-slate-700"
            }`}
          >
            <RefreshCw className={`w-4 h-4 ${autoRefresh ? "animate-spin" : ""}`} />
            {autoRefresh ? "Auto Refresh ON" : "Auto Refresh"}
          </button>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            <Filter className="w-4 h-4" />
            Filtrele
          </button>
          <button
            onClick={() => setShowExportModal(true)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Security Summary */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-6">
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
              <p className="text-sm text-blue-700 font-medium">Aktif Bu Hafta</p>
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

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-orange-700 font-medium">Şüpheli Aktivite</p>
              <p className="text-3xl font-bold text-orange-900 mt-1">
                {loading ? "..." : stats?.suspiciousActivity || 0}
              </p>
            </div>
            <AlertTriangle className="w-10 h-10 text-orange-600 opacity-50" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-700 font-medium">Başarısız Giriş</p>
              <p className="text-3xl font-bold text-red-900 mt-1">
                {loading ? "..." : stats?.failedLogins || 0}
              </p>
            </div>
            <X className="w-10 h-10 text-red-600 opacity-50" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-700 font-medium">Toplam Kullanıcı</p>
              <p className="text-3xl font-bold text-slate-900 mt-1">
                {loading ? "..." : stats?.totalUsers || 0}
              </p>
            </div>
            <User className="w-10 h-10 text-slate-600 opacity-50" />
          </div>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Arama
              </label>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="search"
                  placeholder="Kullanıcı, email, IP, event..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Log Seviyesi
              </label>
              <select
                value={logLevel}
                onChange={(e) => setLogLevel(e.target.value as LogLevel)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="all">Tümü</option>
                <option value="INFO">INFO</option>
                <option value="WARN">WARN</option>
                <option value="ERROR">ERROR</option>
                <option value="CRITICAL">CRITICAL</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Tarih Aralığı
              </label>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value as DateRange)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="today">Bugün</option>
                <option value="week">Son 7 Gün</option>
                <option value="month">Son 30 Gün</option>
                <option value="all">Tümü</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearchQuery("");
                  setLogLevel("all");
                  setDateRange("today");
                }}
                className="w-full px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition-colors"
              >
                Sıfırla
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Security Events Log */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Güvenlik Olayları
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                Toplam {filteredEvents.length} olay {filteredEvents.length !== events.length && `(${events.length} olaydan filtrelendi)`}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm text-slate-600">Sayfa başına:</label>
              <select
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                className="px-3 py-1.5 border border-slate-300 rounded-lg text-sm"
              >
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Seviye</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Olay</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Kullanıcı</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Organizasyon</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">IP Adresi</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Zaman</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Rol</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-slate-500 uppercase">Detay</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-slate-600">
                    Yükleniyor...
                  </td>
                </tr>
              ) : paginatedEvents.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-slate-600">
                    Güvenlik olayı bulunamadı
                  </td>
                </tr>
              ) : (
                paginatedEvents.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <div className={`flex items-center gap-2 px-2.5 py-1 ${getSeverityColor(log.severity)} bg-opacity-10 rounded-full text-xs font-medium w-fit`}>
                        {getSeverityIcon(log.severity)}
                        <span className={`${getSeverityColor(log.severity).replace('bg-', 'text-')}`}>
                          {log.severity}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-slate-900">{log.event}</p>
                      <p className="text-xs text-slate-500">{log.type}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-700">{log.user}</td>
                    <td className="px-6 py-4 text-sm text-slate-700">{log.organization}</td>
                    <td className="px-6 py-4">
                      <code className="px-2 py-1 bg-slate-100 rounded text-xs font-mono text-slate-700">
                        {log.ip}
                      </code>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {new Date(log.timestamp).toLocaleString("tr-TR")}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 text-xs bg-slate-200 text-slate-700 rounded">
                        {log.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => setSelectedLog(log)}
                        className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between">
            <div className="text-sm text-slate-600">
              Gösterilen: {startIndex + 1}-{Math.min(endIndex, filteredEvents.length)} / {filteredEvents.length}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-slate-300 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-4 py-2 text-sm">
                Sayfa {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-slate-300 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Log Detail Modal */}
      {selectedLog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-slate-900">Log Detayları</h3>
                <button
                  onClick={() => setSelectedLog(null)}
                  className="p-2 hover:bg-slate-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700">Seviye</label>
                <div className="mt-1">
                  <div className={`flex items-center gap-2 px-3 py-2 ${getSeverityColor(selectedLog.severity)} bg-opacity-10 rounded-lg w-fit`}>
                    {getSeverityIcon(selectedLog.severity)}
                    <span className={`font-medium ${getSeverityColor(selectedLog.severity).replace('bg-', 'text-')}`}>
                      {selectedLog.severity}
                    </span>
                  </div>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">Olay</label>
                <p className="mt-1 text-slate-900">{selectedLog.event}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">Tip</label>
                <p className="mt-1 text-slate-900">{selectedLog.type}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700">Kullanıcı</label>
                  <p className="mt-1 text-slate-900">{selectedLog.user}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">Rol</label>
                  <p className="mt-1 text-slate-900">{selectedLog.role}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">Organizasyon</label>
                <p className="mt-1 text-slate-900">{selectedLog.organization}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700">IP Adresi</label>
                  <code className="block mt-1 px-3 py-2 bg-slate-100 rounded text-sm font-mono text-slate-900">
                    {selectedLog.ip}
                  </code>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">Zaman</label>
                  <p className="mt-1 text-slate-900">
                    {new Date(selectedLog.timestamp).toLocaleString("tr-TR")}
                  </p>
                </div>
              </div>
              {selectedLog.details && (
                <div>
                  <label className="text-sm font-medium text-slate-700">Detaylar</label>
                  <pre className="mt-1 p-3 bg-slate-100 rounded text-sm text-slate-900 overflow-x-auto">
                    {selectedLog.details}
                  </pre>
                </div>
              )}
            </div>
            <div className="p-6 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setSelectedLog(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-slate-900">Logları Export Et</h3>
                <button
                  onClick={() => setShowExportModal(false)}
                  className="p-2 hover:bg-slate-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-sm text-slate-600">
                {filteredEvents.length} log kaydını export etmek üzeresiniz.
              </p>
              <div className="space-y-2">
                <button
                  onClick={() => exportLogs("csv")}
                  className="w-full px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-lg font-medium text-left flex items-center justify-between"
                >
                  <span>CSV Format</span>
                  <Download className="w-4 h-4" />
                </button>
                <button
                  onClick={() => exportLogs("json")}
                  className="w-full px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-lg font-medium text-left flex items-center justify-between"
                >
                  <span>JSON Format</span>
                  <Download className="w-4 h-4" />
                </button>
                <button
                  onClick={() => exportLogs("pdf")}
                  className="w-full px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-lg font-medium text-left flex items-center justify-between"
                >
                  <span>PDF Report</span>
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="p-6 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setShowExportModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium"
              >
                İptal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default withRoleProtection(SecurityLogsPage, {
  allowedRoles: [UserRole.SUPER_ADMIN],
});
