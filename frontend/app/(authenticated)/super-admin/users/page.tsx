"use client";

import { useState, useEffect } from "react";
import { Users, UserPlus, Search, Filter, Shield, Building2, Eye, Edit2, Trash2 } from "lucide-react";
import { withRoleProtection } from "@/lib/hoc/withRoleProtection";
import apiClient from "@/lib/services/apiClient";
import toast from "react-hot-toast";
import CreateUserModal from "@/components/super-admin/CreateUserModal";
import EditUserModal from "@/components/super-admin/EditUserModal";
import DeleteUserModal from "@/components/super-admin/DeleteUserModal";
import UserDetailModal from "@/components/super-admin/UserDetailModal";

function SuperAdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  // Bulk selection
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [bulkLoading, setBulkLoading] = useState(false);

  useEffect(() => {
    loadUsers();
  }, [search]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.append("search", search);

      const res = await apiClient.get(`/api/v1/super-admin/users?${params.toString()}`);

      if (res.data.success) {
        setUsers(res.data.data.users);
        setStats(res.data.data.stats);
      } else {
        toast.error(res.data.message || "Kullanıcılar yüklenemedi");
      }
    } catch (error) {
      console.error("Error loading users:", error);
      toast.error("Kullanıcılar yüklenirken hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  // Bulk selection handlers
  const handleSelectAll = () => {
    if (selectedUserIds.length === users.length) {
      setSelectedUserIds([]);
    } else {
      setSelectedUserIds(users.map((u: any) => u.id));
    }
  };

  const handleSelectUser = (userId: string) => {
    if (selectedUserIds.includes(userId)) {
      setSelectedUserIds(selectedUserIds.filter(id => id !== userId));
    } else {
      setSelectedUserIds([...selectedUserIds, userId]);
    }
  };

  const handleBulkAction = async (action: "activate" | "deactivate" | "delete") => {
    if (selectedUserIds.length === 0) {
      toast.error("Lütfen en az bir kullanıcı seçin");
      return;
    }

    const confirmMessages = {
      activate: `${selectedUserIds.length} kullanıcı aktif edilecek. Emin misiniz?`,
      deactivate: `${selectedUserIds.length} kullanıcı pasif edilecek. Emin misiniz?`,
      delete: `${selectedUserIds.length} kullanıcı SİLİNECEK! Bu işlem geri alınamaz. Emin misiniz?`
    };

    if (!confirm(confirmMessages[action])) {
      return;
    }

    setBulkLoading(true);

    try {
      const res = await apiClient.post("/api/v1/super-admin/users/bulk-action", {
        action,
        userIds: selectedUserIds
      });

      if (res.data.success) {
        const actionNames = {
          activate: "aktif edildi",
          deactivate: "pasif edildi",
          delete: "silindi"
        };
        toast.success(`${res.data.data.count} kullanıcı ${actionNames[action]}!`);
        setSelectedUserIds([]);
        loadUsers();
      } else {
        toast.error(res.data.message || "İşlem başarısız oldu");
      }
    } catch (error: any) {
      console.error("Bulk action error:", error);
      toast.error(error.response?.data?.message || "İşlem sırasında hata oluştu");
    } finally {
      setBulkLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Kullanıcı Yönetimi</h1>
          <p className="text-gray-600 mt-1">Tüm sistem kullanıcılarını görüntüleyin ve yönetin</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          <UserPlus className="w-5 h-5" />
          Yeni Kullanıcı
        </button>
      </div>

      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <Users className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
                <div className="text-sm text-gray-600">Toplam Kullanıcı</div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Shield className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{stats.active}</div>
                <div className="text-sm text-gray-600">Aktif</div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{stats.byRole?.SUPER_ADMIN || 0}</div>
                <div className="text-sm text-gray-600">SUPER_ADMIN</div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Users className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{stats.byRole?.ADMIN || 0}</div>
                <div className="text-sm text-gray-600">ADMIN</div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Kullanıcı ara..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Filter className="w-5 h-5" />
            Filtrele
          </button>
        </div>

        {/* Bulk Actions Bar */}
        {selectedUserIds.length > 0 && (
          <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg mb-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-blue-900">
                {selectedUserIds.length} kullanıcı seçildi
              </span>
              <button
                onClick={handleSelectAll}
                className="text-xs text-blue-600 hover:text-blue-800 underline"
              >
                Seçimi Temizle
              </button>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleBulkAction("activate")}
                disabled={bulkLoading}
                className="px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                Aktif Et
              </button>
              <button
                onClick={() => handleBulkAction("deactivate")}
                disabled={bulkLoading}
                className="px-3 py-1.5 bg-yellow-600 text-white text-sm rounded-lg hover:bg-yellow-700 disabled:opacity-50"
              >
                Pasif Et
              </button>
              <button
                onClick={() => handleBulkAction("delete")}
                disabled={bulkLoading}
                className="px-3 py-1.5 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                {bulkLoading ? "İşleniyor..." : "Sil"}
              </button>
            </div>
          </div>
        )}

        {loading ? (
          <div className="text-center py-12 text-gray-500">Yükleniyor...</div>
        ) : users.length === 0 ? (
          <div className="text-center py-12 text-gray-500">Kullanıcı bulunamadı</div>
        ) : (
          <div className="space-y-3">
            {/* Select All Header */}
            <div className="flex items-center gap-3 p-3 bg-gray-100 rounded-lg">
              <input
                type="checkbox"
                checked={selectedUserIds.length === users.length && users.length > 0}
                onChange={handleSelectAll}
                className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
              />
              <span className="text-sm font-medium text-gray-700">
                {selectedUserIds.length === users.length && users.length > 0
                  ? "Tümünün Seçimini Kaldır"
                  : "Tümünü Seç"}
              </span>
            </div>

            {users.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-red-300 transition-colors"
              >
                <div className="flex items-center gap-4">
                  {/* Checkbox */}
                  <input
                    type="checkbox"
                    checked={selectedUserIds.includes(user.id)}
                    onChange={() => handleSelectUser(user.id)}
                    className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                    onClick={(e) => e.stopPropagation()}
                  />

                  <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                    <Users className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900">{user.email}</h3>
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                        {user.role}
                      </span>
                      {!user.isActive && (
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
                          Pasif
                        </span>
                      )}
                    </div>
                    <div className="flex gap-3 mt-1 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Building2 className="w-4 h-4" />
                        {user.organization?.name || "No Org"}
                      </span>
                      <span>Plan: {user.organization?.plan || "N/A"}</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setSelectedUser(user);
                      setShowDetailModal(true);
                    }}
                    className="p-2 hover:bg-white rounded-lg transition-colors"
                    title="Detayları Görüntüle"
                  >
                    <Eye className="w-4 h-4 text-gray-600" />
                  </button>
                  <button
                    onClick={() => {
                      setSelectedUser(user);
                      setShowEditModal(true);
                    }}
                    className="p-2 hover:bg-white rounded-lg transition-colors"
                    title="Düzenle"
                  >
                    <Edit2 className="w-4 h-4 text-blue-600" />
                  </button>
                  <button
                    onClick={() => {
                      setSelectedUser(user);
                      setShowDeleteModal(true);
                    }}
                    className="p-2 hover:bg-white rounded-lg transition-colors"
                    title="Sil"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      <CreateUserModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={() => {
          loadUsers();
        }}
      />

      <EditUserModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedUser(null);
        }}
        onSuccess={() => {
          loadUsers();
        }}
        user={selectedUser}
      />

      <DeleteUserModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedUser(null);
        }}
        onSuccess={() => {
          loadUsers();
        }}
        user={selectedUser}
      />

      <UserDetailModal
        isOpen={showDetailModal}
        onClose={() => {
          setShowDetailModal(false);
          setSelectedUser(null);
        }}
        user={selectedUser}
      />
    </div>
  );
}

export default withRoleProtection(SuperAdminUsersPage, ["SUPER_ADMIN"]);
