"use client";

import { X, User, Mail, Shield, Building2, Calendar, CheckCircle, XCircle } from "lucide-react";

interface UserDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
}

export default function UserDetailModal({ isOpen, onClose, user }: UserDetailModalProps) {
  if (!isOpen || !user) return null;

  const formatDate = (date: string) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleString("tr-TR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <User className="w-5 h-5 text-red-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Kullanıcı Detayları</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Status Badge */}
          <div className="flex items-center justify-center">
            {user.isActive ? (
              <div className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">Aktif Kullanıcı</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg">
                <XCircle className="w-5 h-5" />
                <span className="font-medium">Pasif Kullanıcı</span>
              </div>
            )}
          </div>

          {/* Basic Info */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <h3 className="font-semibold text-gray-900 mb-3">Temel Bilgiler</h3>

            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
              <div className="flex-1">
                <div className="text-sm text-gray-600">Email</div>
                <div className="font-medium text-gray-900">{user.email}</div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <User className="w-5 h-5 text-gray-400 mt-0.5" />
              <div className="flex-1">
                <div className="text-sm text-gray-600">Ad Soyad</div>
                <div className="font-medium text-gray-900">
                  {user.firstName && user.lastName
                    ? `${user.firstName} ${user.lastName}`
                    : user.firstName || user.lastName || "Belirtilmemiş"}
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-gray-400 mt-0.5" />
              <div className="flex-1">
                <div className="text-sm text-gray-600">Rol</div>
                <div>
                  <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                    {user.role}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Organization Info */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <h3 className="font-semibold text-gray-900 mb-3">Organizasyon Bilgileri</h3>

            <div className="flex items-start gap-3">
              <Building2 className="w-5 h-5 text-gray-400 mt-0.5" />
              <div className="flex-1">
                <div className="text-sm text-gray-600">Organizasyon</div>
                <div className="font-medium text-gray-900">
                  {user.organization?.name || "N/A"}
                </div>
              </div>
            </div>

            {user.organization && (
              <>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 mt-0.5" />
                  <div className="flex-1">
                    <div className="text-sm text-gray-600">Plan</div>
                    <div>
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                        user.organization.plan === "ENTERPRISE"
                          ? "bg-purple-100 text-purple-700"
                          : user.organization.plan === "PRO"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-gray-100 text-gray-700"
                      }`}>
                        {user.organization.plan}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 mt-0.5" />
                  <div className="flex-1">
                    <div className="text-sm text-gray-600">Organizasyon Durumu</div>
                    <div className="font-medium text-gray-900">
                      {user.organization.isActive ? (
                        <span className="text-green-600">Aktif</span>
                      ) : (
                        <span className="text-red-600">Pasif</span>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Timestamps */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <h3 className="font-semibold text-gray-900 mb-3">Zaman Bilgileri</h3>

            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
              <div className="flex-1">
                <div className="text-sm text-gray-600">Hesap Oluşturma</div>
                <div className="font-medium text-gray-900">
                  {formatDate(user.createdAt)}
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
              <div className="flex-1">
                <div className="text-sm text-gray-600">Son Güncelleme</div>
                <div className="font-medium text-gray-900">
                  {formatDate(user.updatedAt)}
                </div>
              </div>
            </div>
          </div>

          {/* User ID */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-sm text-gray-600">Kullanıcı ID</div>
            <div className="font-mono text-xs text-gray-500 mt-1 break-all">
              {user.id}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
}
