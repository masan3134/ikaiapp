"use client";

import { useState, useEffect } from "react";
import { X, User, Mail, Lock, Shield, Building2 } from "lucide-react";
import apiClient from "@/lib/services/apiClient";
import toast from "react-hot-toast";

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateUserModal({ isOpen, onClose, onSuccess }: CreateUserModalProps) {
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    password: "",
    role: "USER",
    organizationId: "",
  });
  const [organizations, setOrganizations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingOrgs, setLoadingOrgs] = useState(true);

  const roles = ["USER", "HR_SPECIALIST", "MANAGER", "ADMIN", "SUPER_ADMIN"];

  useEffect(() => {
    if (isOpen) {
      loadOrganizations();
    }
  }, [isOpen]);

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

    // Validation
    if (!formData.email || !formData.password || !formData.role || !formData.organizationId) {
      toast.error("Lütfen tüm zorunlu alanları doldurun");
      return;
    }

    if (formData.password.length < 8) {
      toast.error("Şifre en az 8 karakter olmalıdır");
      return;
    }

    setLoading(true);

    try {
      const res = await apiClient.post("/api/v1/super-admin/users", formData);

      if (res.data.success) {
        toast.success("Kullanıcı başarıyla oluşturuldu!");
        setFormData({
          email: "",
          firstName: "",
          lastName: "",
          password: "",
          role: "USER",
          organizationId: "",
        });
        onSuccess();
        onClose();
      } else {
        toast.error(res.data.message || "Kullanıcı oluşturulamadı");
      }
    } catch (error: any) {
      console.error("Error creating user:", error);
      toast.error(error.response?.data?.message || "Kullanıcı oluşturulurken hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Yeni Kullanıcı Oluştur</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Mail className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="user@example.com"
              />
            </div>
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

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Şifre <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Lock className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="••••••••"
                minLength={8}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">En az 8 karakter</p>
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
              {loading ? "Oluşturuluyor..." : "Oluştur"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
