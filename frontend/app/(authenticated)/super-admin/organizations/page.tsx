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
import apiClient from "@/lib/services/apiClient";

function OrganizationsPage() {
  const [orgs, setOrgs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [search, setSearch] = useState("");
  const [planFilter, setPlanFilter] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newOrgName, setNewOrgName] = useState("");
  const [newOrgPlan, setNewOrgPlan] = useState("FREE");
  const [creating, setCreating] = useState(false);

  // Organization details/edit/delete modals
  const [selectedOrg, setSelectedOrg] = useState<any>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [editPlan, setEditPlan] = useState("FREE");
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Toast notifications
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type: "success" | "error";
  }>({ show: false, message: "", type: "success" });

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
      const [orgsRes, statsRes] = await Promise.all([
        apiClient.get(
          `/api/v1/super-admin/organizations?${params.toString()}`
        ),
        apiClient.get("/api/v1/super-admin/stats"),
      ]);

      const orgsData = orgsRes.data;
      const statsData = statsRes.data;

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
      await apiClient.patch(`/api/v1/super-admin/${orgId}/toggle`);
      loadData(); // Refresh list
    } catch (error) {
      console.error("Error toggling organization:", error);
    }
  };

  const handleCreateOrganization = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newOrgName.trim()) {
      alert("Organizasyon adı zorunludur");
      return;
    }

    try {
      setCreating(true);
      await apiClient.post("/api/v1/super-admin/organizations", {
        name: newOrgName,
        plan: newOrgPlan,
      });

      // Reset form and close modal
      setNewOrgName("");
      setNewOrgPlan("FREE");
      setShowCreateModal(false);

      // Refresh list
      await loadData();

      showToast(`${newOrgName} organizasyonu oluşturuldu`, "success");
    } catch (error) {
      console.error("Error creating organization:", error);
      showToast("Organizasyon oluşturulurken hata oluştu", "error");
    } finally {
      setCreating(false);
    }
  };

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3000);
  };

  const handleViewDetails = async (org: any) => {
    try {
      const res = await apiClient.get(`/api/v1/super-admin/organizations/${org.id}`);
      if (res.data.success) {
        setSelectedOrg(res.data.data);
        setShowDetailsModal(true);
      }
    } catch (error) {
      console.error("Error loading organization details:", error);
      showToast("Organizasyon detayları yüklenemedi", "error");
    }
  };

  const handleEditPlan = (org: any) => {
    setSelectedOrg(org);
    setEditPlan(org.plan);
    setShowEditModal(true);
  };

  const handleUpdatePlan = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedOrg) return;

    try {
      setUpdating(true);
      await apiClient.patch(`/api/v1/super-admin/${selectedOrg.id}/plan`, {
        plan: editPlan,
      });

      showToast(`${selectedOrg.name} planı ${editPlan} olarak güncellendi`, "success");
      setShowEditModal(false);
      setSelectedOrg(null);
      await loadData();
    } catch (error) {
      console.error("Error updating plan:", error);
      showToast("Plan güncellenirken hata oluştu", "error");
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteConfirm = (org: any) => {
    setSelectedOrg(org);
    setShowDeleteConfirm(true);
  };

  const handleDelete = async () => {
    if (!selectedOrg) return;

    try {
      setDeleting(true);
      await apiClient.delete(`/api/v1/super-admin/${selectedOrg.id}`);

      showToast(`${selectedOrg.name} organizasyonu silindi`, "success");
      setShowDeleteConfirm(false);
      setSelectedOrg(null);
      await loadData();
    } catch (error) {
      console.error("Error deleting organization:", error);
      showToast("Organizasyon silinirken hata oluştu", "error");
    } finally {
      setDeleting(false);
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
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-rose-600 hover:bg-rose-700 text-white px-4 py-2.5 rounded-lg flex items-center gap-2 font-medium transition-colors shadow-sm"
        >
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
                  className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200 hover:border-rose-300 transition-colors cursor-pointer"
                  onClick={() => handleViewDetails(org)}
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
                  <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
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
                    <button
                      onClick={() => handleEditPlan(org)}
                      className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Planı Değiştir"
                    >
                      <Edit2 className="w-4 h-4 text-blue-600" />
                    </button>
                    <button
                      onClick={() => handleDeleteConfirm(org)}
                      className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                      title="Organizasyonu Sil"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create Organization Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 text-slate-900">
              Yeni Organizasyon Oluştur
            </h2>

            <form onSubmit={handleCreateOrganization}>
              {/* Organization Name */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Organizasyon Adı *
                </label>
                <input
                  type="text"
                  value={newOrgName}
                  onChange={(e) => setNewOrgName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  placeholder="Örn: Acme Corporation"
                  required
                />
              </div>

              {/* Plan Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Plan
                </label>
                <select
                  value={newOrgPlan}
                  onChange={(e) => setNewOrgPlan(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                >
                  <option value="FREE">FREE (10 analiz/ay)</option>
                  <option value="PRO">PRO (100 analiz/ay)</option>
                  <option value="ENTERPRISE">ENTERPRISE (Sınırsız)</option>
                </select>
              </div>

              {/* Buttons */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    setNewOrgName("");
                    setNewOrgPlan("FREE");
                  }}
                  className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                  disabled={creating}
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={creating}
                >
                  {creating ? "Oluşturuluyor..." : "Oluştur"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Organization Details Modal */}
      {showDetailsModal && selectedOrg && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-slate-900">
                Organizasyon Detayları
              </h2>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Organizasyon Adı</p>
                  <p className="font-semibold text-slate-900">{selectedOrg.name}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 mb-1">Slug</p>
                  <p className="font-mono text-sm text-slate-900">{selectedOrg.slug}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 mb-1">Plan</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                    selectedOrg.plan === "ENTERPRISE" ? "bg-purple-100 text-purple-700" :
                    selectedOrg.plan === "PRO" ? "bg-blue-100 text-blue-700" :
                    "bg-slate-100 text-slate-700"
                  }`}>
                    {selectedOrg.plan}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-slate-600 mb-1">Durum</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                    selectedOrg.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                  }`}>
                    {selectedOrg.isActive ? "Aktif" : "Pasif"}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-slate-600 mb-1">Kullanıcı Sayısı</p>
                  <p className="font-semibold text-slate-900">{selectedOrg.userCount || 0}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 mb-1">İş İlanları</p>
                  <p className="font-semibold text-slate-900">{selectedOrg.jobPostingCount || 0}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 mb-1">Analizler</p>
                  <p className="font-semibold text-slate-900">{selectedOrg.analysisCount || 0}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 mb-1">Oluşturulma Tarihi</p>
                  <p className="text-sm text-slate-900">
                    {new Date(selectedOrg.createdAt).toLocaleString("tr-TR")}
                  </p>
                </div>
              </div>

              <div className="border-t pt-4">
                <p className="text-sm text-slate-600 mb-2">Limitler</p>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-slate-600">Max Kullanıcı</p>
                    <p className="font-semibold">{selectedOrg.maxUsers}</p>
                  </div>
                  <div>
                    <p className="text-slate-600">Max Analiz/Ay</p>
                    <p className="font-semibold">{selectedOrg.maxAnalysisPerMonth}</p>
                  </div>
                  <div>
                    <p className="text-slate-600">Max CV/Ay</p>
                    <p className="font-semibold">{selectedOrg.maxCvPerMonth}</p>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowDetailsModal(false)}
              className="mt-6 w-full px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
            >
              Kapat
            </button>
          </div>
        </div>
      )}

      {/* Edit Plan Modal */}
      {showEditModal && selectedOrg && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 text-slate-900">
              Planı Değiştir: {selectedOrg.name}
            </h2>

            <form onSubmit={handleUpdatePlan}>
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Yeni Plan
                </label>
                <select
                  value={editPlan}
                  onChange={(e) => setEditPlan(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                >
                  <option value="FREE">FREE (10 analiz/ay, 50 CV, 2 kullanıcı)</option>
                  <option value="PRO">PRO (100 analiz/ay, 500 CV, 10 kullanıcı)</option>
                  <option value="ENTERPRISE">ENTERPRISE (Sınırsız)</option>
                </select>
                <p className="mt-2 text-xs text-slate-500">
                  Mevcut plan: <strong>{selectedOrg.plan}</strong>
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedOrg(null);
                  }}
                  className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                  disabled={updating}
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={updating}
                >
                  {updating ? "Güncelleniyor..." : "Güncelle"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && selectedOrg && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 text-slate-900">
              Organizasyonu Sil?
            </h2>

            <p className="text-slate-600 mb-6">
              <strong>{selectedOrg.name}</strong> organizasyonunu silmek istediğinizden emin misiniz?
              Bu işlem organizasyonu pasif hale getirecektir.
            </p>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-6">
              <p className="text-sm text-yellow-800">
                <strong>Uyarı:</strong> Organizasyon pasif hale gelecek ancak verileri korunacaktır.
                Daha sonra tekrar aktif hale getirilebilir.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setSelectedOrg(null);
                }}
                className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                disabled={deleting}
              >
                İptal
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={deleting}
              >
                {deleting ? "Siliniyor..." : "Evet, Sil"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed bottom-4 right-4 z-50 animate-in slide-in-from-right">
          <div
            className={`px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 ${
              toast.type === "success"
                ? "bg-green-600 text-white"
                : "bg-red-600 text-white"
            }`}
          >
            <span className="text-lg">
              {toast.type === "success" ? "✅" : "❌"}
            </span>
            <p className="font-medium">{toast.message}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default withRoleProtection(OrganizationsPage, {
  allowedRoles: [UserRole.SUPER_ADMIN],
});
