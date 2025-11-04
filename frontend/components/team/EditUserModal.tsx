"use client";

import { useState, useEffect } from "react";
import { X, Edit } from "lucide-react";
import { updateTeamMember, TeamMember } from "@/lib/services/teamService";
import { useToast } from "@/lib/hooks/useToast";

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  member: TeamMember | null;
  onSuccess: () => void;
}

export default function EditUserModal({
  isOpen,
  onClose,
  member,
  onSuccess,
}: EditUserModalProps) {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    role: "USER",
  });

  useEffect(() => {
    if (member) {
      setFormData({
        name: member.name,
        role: member.role,
      });
    }
  }, [member]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!member) return;

    setLoading(true);
    try {
      await updateTeamMember(member.id, formData);
      toast.success("Kullanıcı güncellendi");
      onClose();
      onSuccess();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Güncellenemedi");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !member) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Edit size={24} className="text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900">
              Kullanıcı Düzenle
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={member.email}
              disabled
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              İsim *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rol *
            </label>
            <select
              required
              value={formData.role}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="USER">Kullanıcı</option>
              <option value="HR_SPECIALIST">İK Uzmanı</option>
              <option value="MANAGER">Müdür</option>
              <option value="ADMIN">Yönetici</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Kaydediliyor..." : "Kaydet"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
