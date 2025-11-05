"use client";

import { useState, useEffect } from "react";
import { X, User, Mail, Lock, Shield, Building2 } from "lucide-react";
import apiClient from "@/lib/services/apiClient";
import toast from "react-hot-toast";

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  user: any;
}

export default function EditUserModal({ isOpen, onClose, onSuccess, user }: EditUserModalProps) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    password: "",
    role: "USER",
    organizationId: "",
    isActive: true,
  });
  const [organizations, setOrganizations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingOrgs, setLoadingOrgs] = useState(true);

  const roles = ["USER", "HR_SPECIALIST", "MANAGER", "ADMIN", "SUPER_ADMIN"];

  useEffect(() => {
    if (isOpen && user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        password: "",
        role: user.role || "USER",
        organizationId: user.organizationId || "",
        isActive: user.isActive ?? true,
      });
      loadOrganizations();
    }
  }, [isOpen, user]);

  const loadOrganizations = async () => {
    try {
      setLoadingOrgs(true);
      const res = await apiClient.get("/api/v1/super-admin/organizations");
      if (res.data.success) {
        setOrganizations(res.data.data);
      }
    } catch (error) {
      console.error("Error loading organizations:", error);
      toast.error("Organizasyonlar yüklenemedi");
    } finally {
      setLoadingOrgs(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user?.id) {
      toast.error("Kullanıcı ID bulunamadı");
      return;
    }

    // Password validation if provided
    if (formData.password && formData.password.length < 8) {
      toast.error("Şifre en az 8 karakter olmalıdır");
      return;
    }

    setLoading(true);

    try {
      // Only send password if it's being changed
      const payload: any = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        role: formData.role,
        organizationId: formData.organizationId,
        isActive: formData.isActive,
      };

      if (formData.password) {
        payload.password = formData.password;
      }

      const res = await apiClient.patch(`/api/v1/super-admin/users/${user.id}`, payload);

      if (res.data.success) {
        toast.success("Kullanıcı başarıyla güncellendi!");
        onSuccess();
        onClose();
      } else {
        toast.error(res.data.message || "Kullanıcı güncellenemedi");
      }
    } catch (error: any) {
      console.error("Error updating user:", error);
      toast.error(error.response?.data?.message || "Kullanıcı güncellenirken hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Kullanıcı Düzenle</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Email (Read-only) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                value={user.email}
                disabled
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">Email değiştirilemez</p>
          </div>

          {/* First Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ad
            </label>
            <div className="relative">
              <User className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="İsim"
              />
            </div>
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Soyad
            </label>
            <div className="relative">
              <User className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Soyisim"
              />
            </div>
          </div>

          {/* Password (Optional) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Yeni Şifre (Opsiyonel)
            </label>
            <div className="relative">
              <Lock className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Değiştirmek istiyorsanız girin"
                minLength={8}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">Boş bırakırsanız şifre değişmez</p>
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rol <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Shield className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <select
                required
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                {roles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Organization */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Organizasyon <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Building2 className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <select
                required
                value={formData.organizationId}
                onChange={(e) => setFormData({ ...formData, organizationId: e.target.value })}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                disabled={loadingOrgs}
              >
                <option value="">Organizasyon Seçin</option>
                {organizations.map((org) => (
                  <option key={org.id} value={org.id}>
                    {org.name} ({org.plan})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Active Status */}
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
            />
            <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
              Kullanıcı Aktif
            </label>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              {loading ? "Güncelleniyor..." : "Güncelle"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
