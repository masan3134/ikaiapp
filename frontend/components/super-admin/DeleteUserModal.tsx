"use client";

import { useState } from "react";
import { X, AlertTriangle } from "lucide-react";
import apiClient from "@/lib/services/apiClient";
import toast from "react-hot-toast";

interface DeleteUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  user: any;
}

export default function DeleteUserModal({ isOpen, onClose, onSuccess, user }: DeleteUserModalProps) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!user?.id) {
      toast.error("Kullanıcı ID bulunamadı");
      return;
    }

    setLoading(true);

    try {
      const res = await apiClient.delete(`/api/v1/super-admin/users/${user.id}`);

      if (res.data.success) {
        toast.success("Kullanıcı başarıyla silindi!");
        onSuccess();
        onClose();
      } else {
        toast.error(res.data.message || "Kullanıcı silinemedi");
      }
    } catch (error: any) {
      console.error("Error deleting user:", error);
      toast.error(error.response?.data?.message || "Kullanıcı silinirken hata oluştu");
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
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Kullanıcıyı Sil</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <p className="text-gray-700">
            <span className="font-semibold">{user.email}</span> kullanıcısını silmek üzeresiniz.
          </p>

          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">
              <strong>Dikkat:</strong> Bu işlem geri alınamaz. Kullanıcının tüm verileri kalıcı olarak silinecektir.
            </p>
          </div>

          {/* User Info */}
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Email:</span>
              <span className="font-medium text-gray-900">{user.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Rol:</span>
              <span className="font-medium text-gray-900">{user.role}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Organizasyon:</span>
              <span className="font-medium text-gray-900">{user.organization?.name || "N/A"}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 p-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            İptal
          </button>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            {loading ? "Siliniyor..." : "Evet, Sil"}
          </button>
        </div>
      </div>
    </div>
  );
}
