"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Building2,
  Users,
  TrendingUp,
  Calendar,
  Search,
  Filter,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import { useAsync } from "@/lib/hooks/useAsync";
import { useToast } from "@/lib/hooks/useToast";
import { useAuthStore } from "@/lib/store/authStore";
import { parseApiError } from "@/lib/utils/errorHandler";
import LoadingSkeleton from "@/components/ui/LoadingSkeleton";
import { withRoleProtection } from "@/lib/hoc/withRoleProtection";
import { UserRole } from "@/lib/constants/roles";
import {
  getStats,
  getOrganizations,
  toggleOrganization,
  updatePlan,
  type SystemStats,
  type Organization,
} from "@/lib/services/superAdminService";

function SuperAdminPage() {
  const router = useRouter();
  const toast = useToast();
  const { user } = useAuthStore();

  // State
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [planFilter, setPlanFilter] = useState<
    "FREE" | "PRO" | "ENTERPRISE" | ""
  >("");
  const [statusFilter, setStatusFilter] = useState<"active" | "inactive" | "">(
    ""
  );
  const [loading, setLoading] = useState(true);

  // Check super admin access
  const isSuperAdmin = user?.role === "SUPER_ADMIN";

  // Fetch stats
  useEffect(() => {
    if (!isSuperAdmin) return;

    const fetchStats = async () => {
      try {
        const data = await getStats();
        setStats(data);
      } catch (error) {
        toast.error(parseApiError(error));
      }
    };

    fetchStats();
  }, [isSuperAdmin]);

  // Fetch organizations
  useEffect(() => {
    if (!isSuperAdmin) return;

    const fetchOrganizations = async () => {
      try {
        setLoading(true);
        const isActiveFilter =
          statusFilter === "active"
            ? true
            : statusFilter === "inactive"
              ? false
              : undefined;
        const result = await getOrganizations(
          page,
          10,
          searchQuery,
          planFilter || undefined,
          isActiveFilter
        );
        setOrganizations(result.data);
        setTotalPages(result.pagination.totalPages);
      } catch (error) {
        toast.error(parseApiError(error));
      } finally {
        setLoading(false);
      }
    };

    fetchOrganizations();
  }, [page, searchQuery, planFilter, statusFilter, isSuperAdmin]);

  // Handle toggle organization
  const handleToggle = async (id: string) => {
    try {
      await toggleOrganization(id);
      toast.success("Organizasyon durumu güncellendi");
      // Refresh organizations
      const isActiveFilter =
        statusFilter === "active"
          ? true
          : statusFilter === "inactive"
            ? false
            : undefined;
      const result = await getOrganizations(
        page,
        10,
        searchQuery,
        planFilter || undefined,
        isActiveFilter
      );
      setOrganizations(result.data);
    } catch (error) {
      toast.error(parseApiError(error));
    }
  };

  // Handle plan change
  const handlePlanChange = async (
    id: string,
    plan: "FREE" | "PRO" | "ENTERPRISE"
  ) => {
    try {
      await updatePlan(id, plan);
      toast.success("Plan güncellendi");
      // Refresh organizations
      const isActiveFilter =
        statusFilter === "active"
          ? true
          : statusFilter === "inactive"
            ? false
            : undefined;
      const result = await getOrganizations(
        page,
        10,
        searchQuery,
        planFilter || undefined,
        isActiveFilter
      );
      setOrganizations(result.data);
    } catch (error) {
      toast.error(parseApiError(error));
    }
  };

  // Access denied for non-super-admins
  if (!isSuperAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Building2 size={32} className="text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Erişim Engellendi
          </h2>
          <p className="text-gray-600 mb-6">
            Bu sayfaya erişmek için Süper Yönetici yetkisine sahip olmanız
            gerekiyor.
          </p>
          <button
            onClick={() => router.push("/dashboard")}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Dashboard'a Git
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Süper Yönetici Paneli
          </h1>
          <p className="text-gray-600 mt-1">
            Sistem geneli organizasyon yönetimi
          </p>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Toplam Organizasyon</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">
                    {stats.totalOrganizations}
                  </p>
                </div>
                <Building2 size={40} className="text-blue-600" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Aktif Organizasyon</p>
                  <p className="text-3xl font-bold text-green-600 mt-1">
                    {stats.activeOrganizations}
                  </p>
                </div>
                <ToggleRight size={40} className="text-green-600" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Toplam Kullanıcı</p>
                  <p className="text-3xl font-bold text-purple-600 mt-1">
                    {stats.totalUsers}
                  </p>
                </div>
                <Users size={40} className="text-purple-600" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Aylık Analiz</p>
                  <p className="text-3xl font-bold text-orange-600 mt-1">
                    {stats.monthlyAnalyses}
                  </p>
                </div>
                <TrendingUp size={40} className="text-orange-600" />
              </div>
            </div>
          </div>
        )}

        {/* Plan Breakdown */}
        {stats && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h3 className="text-lg font-semibold mb-4">Plan Dağılımı</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-gray-900">
                  {stats.planBreakdown.FREE}
                </p>
                <p className="text-sm text-gray-600 mt-1">FREE</p>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">
                  {stats.planBreakdown.PRO}
                </p>
                <p className="text-sm text-gray-600 mt-1">PRO</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <p className="text-2xl font-bold text-purple-600">
                  {stats.planBreakdown.ENTERPRISE}
                </p>
                <p className="text-sm text-gray-600 mt-1">ENTERPRISE</p>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search
                size={20}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Organizasyon ara..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1);
                }}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Plan Filter */}
            <select
              value={planFilter}
              onChange={(e) => {
                setPlanFilter(e.target.value as any);
                setPage(1);
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Tüm Planlar</option>
              <option value="FREE">FREE</option>
              <option value="PRO">PRO</option>
              <option value="ENTERPRISE">ENTERPRISE</option>
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value as any);
                setPage(1);
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Tüm Durumlar</option>
              <option value="active">Aktif</option>
              <option value="inactive">Pasif</option>
            </select>
          </div>
        </div>

        {/* Organizations Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Organizasyon
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Plan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kullanıcı
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aylık Analiz
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Durum
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    İşlemler
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <LoadingSkeleton variant="table" rows={5} columns={6} />
                    </td>
                  </tr>
                ) : organizations.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-12 text-center text-gray-500"
                    >
                      Organizasyon bulunamadı
                    </td>
                  </tr>
                ) : (
                  organizations.map((org) => (
                    <tr key={org.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {org.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {org.slug}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={org.plan}
                          onChange={(e) =>
                            handlePlanChange(org.id, e.target.value as any)
                          }
                          className="text-sm px-3 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="FREE">FREE</option>
                          <option value="PRO">PRO</option>
                          <option value="ENTERPRISE">ENTERPRISE</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {org.userCount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {org.monthlyAnalysisCount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            org.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {org.isActive ? "Aktif" : "Pasif"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => handleToggle(org.id)}
                          className={`px-4 py-2 rounded-lg transition-colors ${
                            org.isActive
                              ? "bg-red-100 text-red-700 hover:bg-red-200"
                              : "bg-green-100 text-green-700 hover:bg-green-200"
                          }`}
                        >
                          {org.isActive ? "Devre Dışı" : "Aktif Et"}
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
            <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-200">
              <div className="text-sm text-gray-700">
                Sayfa {page} / {totalPages}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Önceki
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Sonraki
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default withRoleProtection(SuperAdminPage, {
  allowedRoles: [UserRole.SUPER_ADMIN],
  redirectTo: "/dashboard",
});
