"use client";

import { useState, useEffect } from "react";
import {
  Building2,
  Plus,
  Edit2,
  Trash2,
  Users,
  Calendar,
  Search,
  Filter,
} from "lucide-react";
import { withRoleProtection } from "@/lib/hoc/withRoleProtection";
import { UserRole } from "@/lib/constants/roles";

function OrganizationsPage() {
  const [orgs, setOrgs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [search, setSearch] = useState("");
  const [planFilter, setPlanFilter] = useState("");

  useEffect(() => {
    loadData();
  }, [search, planFilter]);

  const loadData = async () => {
    try {
      setLoading(true);

      // Build query params
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (planFilter) params.append("plan", planFilter);

      // Fetch organizations and stats
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "";
      const token = localStorage.getItem("auth_token");
      const headers = { Authorization: `Bearer ${token}` };
      const [orgsRes, statsRes] = await Promise.all([
        fetch(
          `${API_URL}/api/v1/super-admin/organizations?${params.toString()}`,
          { headers }
        ),
        fetch(`${API_URL}/api/v1/super-admin/stats`, { headers }),
      ]);

      const orgsData = await orgsRes.json();
      const statsData = await statsRes.json();

      if (orgsData.success) {
        setOrgs(orgsData.data);
      }

      if (statsData.success) {
        setStats(statsData.data);
      }
    } catch (error) {
      console.error("Error loading organizations:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (orgId: string) => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "";
      const res = await fetch(`${API_URL}/api/v1/super-admin/${orgId}/toggle`, {
        method: "PATCH",
      });

      if (res.ok) {
        loadData(); // Refresh list
      }
    } catch (error) {
      console.error("Error toggling organization:", error);
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
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
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-700 font-medium">
                  Toplam Organizasyon
                </p>
                <p className="text-3xl font-bold text-blue-900 mt-1">
                  {stats.totalOrganizations}
                </p>
              </div>
              <Building2 className="w-10 h-10 text-blue-600 opacity-50" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-700 font-medium">Aktif</p>
                <p className="text-3xl font-bold text-green-900 mt-1">
                  {stats.activeOrganizations}
                </p>
              </div>
              <Users className="w-10 h-10 text-green-600 opacity-50" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-700 font-medium">
                  Toplam Kullanıcı
                </p>
                <p className="text-3xl font-bold text-purple-900 mt-1">
                  {stats.totalUsers}
                </p>
              </div>
              <Users className="w-10 h-10 text-purple-600 opacity-50" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-700 font-medium">
                  Bugün Yeni
                </p>
                <p className="text-3xl font-bold text-orange-900 mt-1">
                  {stats.todayRegistrations}
                </p>
              </div>
              <Calendar className="w-10 h-10 text-orange-600 opacity-50" />
            </div>
          </div>
        </div>
      )}

      {/* Search & Filter */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 mb-6">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Organizasyon ara..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-slate-600" />
            <select
              value={planFilter}
              onChange={(e) => setPlanFilter(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
            >
              <option value="">Tüm Planlar</option>
              <option value="FREE">FREE</option>
              <option value="PRO">PRO</option>
              <option value="ENTERPRISE">ENTERPRISE</option>
            </select>
          </div>
        </div>
      </div>

      {/* Organizations List */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900">
            Organizasyon Listesi ({orgs.length})
          </h2>
        </div>
        <div className="p-6">
          {loading ? (
            <div className="text-center py-8 text-slate-600">Yükleniyor...</div>
          ) : orgs.length === 0 ? (
            <div className="text-center py-8 text-slate-600">
              Organizasyon bulunamadı
            </div>
          ) : (
            <div className="space-y-3">
              {orgs.map((org) => (
                <div
                  key={org.id}
                  className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200 hover:border-rose-300 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                        org.plan === "ENTERPRISE"
                          ? "bg-purple-100"
                          : org.plan === "PRO"
                            ? "bg-blue-100"
                            : "bg-slate-100"
                      }`}
                    >
                      <Building2
                        className={`w-6 h-6 ${
                          org.plan === "ENTERPRISE"
                            ? "text-purple-600"
                            : org.plan === "PRO"
                              ? "text-blue-600"
                              : "text-slate-600"
                        }`}
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-slate-900">
                          {org.name}
                        </h3>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            org.plan === "ENTERPRISE"
                              ? "bg-purple-100 text-purple-700"
                              : org.plan === "PRO"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {org.plan}
                        </span>
                        {!org.isActive && (
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
                            Pasif
                          </span>
                        )}
                      </div>
                      <div className="flex gap-4 mt-1.5 text-sm text-slate-600">
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {org.userCount} kullanıcı
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(org.createdAt).toLocaleDateString("tr-TR")}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleToggleActive(org.id)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        org.isActive
                          ? "bg-red-100 hover:bg-red-200 text-red-700"
                          : "bg-green-100 hover:bg-green-200 text-green-700"
                      }`}
                    >
                      {org.isActive ? "Pasifleştir" : "Aktifleştir"}
                    </button>
                    <button className="p-2 hover:bg-blue-50 rounded-lg transition-colors">
                      <Edit2 className="w-4 h-4 text-blue-600" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default withRoleProtection(OrganizationsPage, {
  allowedRoles: [UserRole.SUPER_ADMIN],
});
