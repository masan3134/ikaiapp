"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/lib/store/authStore";
import { useToast } from "@/lib/hooks/useToast";
import { Card } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import {
  Shield,
  Lock,
  Key,
  Monitor,
  Smartphone,
  AlertTriangle,
  CheckCircle2,
  Globe,
  Clock,
  LogOut,
  Eye,
  EyeOff,
  Save,
  Info,
} from "lucide-react";
import apiClient from "@/lib/services/apiClient";

export default function SecurityPage() {
  const { user, logout } = useAuthStore();
  const toast = useToast();
  const [changingPassword, setChangingPassword] = useState(false);
  const [sessions, setSessions] = useState<any[]>([]);
  const [loadingSessions, setLoadingSessions] = useState(true);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordForm.newPassword.length < 8) {
      toast.error("Yeni şifre en az 8 karakter olmalıdır");
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("Yeni şifreler eşleşmiyor");
      return;
    }

    setChangingPassword(true);

    try {
      const response = await apiClient.patch("/api/v1/users/me/password", {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });

      const data = response.data;

      if (!data.success) {
        throw new Error(data.message || "Şifre değiştirilemedi");
      }

      toast.success(
        "✅ Şifre başarıyla değiştirildi. Lütfen tekrar giriş yapın."
      );

      setTimeout(() => {
        logout();
      }, 2000);
    } catch (error: any) {
      toast.error(error?.message || "Şifre değiştirilemedi");
    } finally {
      setChangingPassword(false);
    }
  };

  const getPasswordStrength = (password: string) => {
    const length = password.length;
    if (length === 0) return { level: 0, text: "", color: "gray" };
    if (length < 6) return { level: 1, text: "Çok Zayıf", color: "red" };
    if (length < 8) return { level: 2, text: "Zayıf", color: "orange" };
    if (length < 12) return { level: 3, text: "Orta", color: "yellow" };
    return { level: 4, text: "Güçlü", color: "green" };
  };

  const strength = getPasswordStrength(passwordForm.newPassword);

  // Fetch active sessions
  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await apiClient.get("/api/v1/users/me/sessions");
        const result = response.data;
        setSessions(result.data || []);
      } catch (error) {
        console.error("Failed to fetch sessions:", error);
      } finally {
        setLoadingSessions(false);
      }
    };

    fetchSessions();
  }, []);

  return (
    <div className="space-y-8">
      {/* Security Status Banner - ULTRA MODERN */}
      <div className="relative overflow-hidden bg-gradient-to-br from-green-500 via-emerald-500 to-teal-600 rounded-3xl shadow-2xl">
        {/* Pattern Overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMwLTkuOTQtOC4wNi0xOC0xOC0xOCIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9IjEiIG9wYWNpdHk9Ii4xIi8+PC9nPjwvc3ZnPg==')] opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>

        <div className="relative p-8">
          <div className="flex items-start gap-6">
            <div className="p-4 bg-white/20 backdrop-blur-xl rounded-2xl shadow-xl border border-white/30">
              <Shield className="text-white" size={32} />
            </div>
            <div className="flex-1">
              <h3 className="text-3xl font-bold text-white mb-3">
                Hesabınız Güvende ✓
              </h3>
              <p className="text-green-50 mb-4 text-lg">
                Son güvenlik kontrolü: <span className="font-bold">Bugün</span> •
                Tespit edilen risk: <span className="font-bold">Yok</span>
              </p>
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-xl text-sm font-bold text-white border border-white/30 shadow-lg">
                  <CheckCircle2 size={16} />
                  <span>Güçlü Şifre</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-xl text-sm font-bold text-white border border-white/30 shadow-lg">
                  <CheckCircle2 size={16} />
                  <span>Aktif Oturum</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Password Change - GLASSMORPHISM */}
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 p-8">
        <div className="flex items-center gap-4 mb-8 pb-6 border-b-2 border-gray-100">
          <div className="p-4 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl shadow-xl">
            <Lock className="text-white" size={28} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Şifre Değiştir</h2>
            <p className="text-sm text-gray-600 font-medium">
              Hesap güvenliğiniz için düzenli olarak şifrenizi değiştirin
            </p>
          </div>
        </div>

        <form onSubmit={handlePasswordChange} className="space-y-6">
          <div>
            <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
              <Key size={18} className="text-blue-600" />
              Mevcut Şifre
            </label>
            <div className="relative">
              <input
                type={showPasswords.current ? "text" : "password"}
                value={passwordForm.currentPassword}
                onChange={(e) =>
                  setPasswordForm({
                    ...passwordForm,
                    currentPassword: e.target.value,
                  })
                }
                required
                className="w-full px-5 py-4 pr-14 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all hover:border-gray-300 text-gray-900 font-medium"
                placeholder="Mevcut şifrenizi girin"
              />
              <button
                type="button"
                onClick={() =>
                  setShowPasswords({
                    ...showPasswords,
                    current: !showPasswords.current,
                  })
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPasswords.current ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
                <Lock size={18} className="text-purple-600" />
                Yeni Şifre
              </label>
              <div className="relative">
                <input
                  type={showPasswords.new ? "text" : "password"}
                  value={passwordForm.newPassword}
                  onChange={(e) =>
                    setPasswordForm({
                      ...passwordForm,
                      newPassword: e.target.value,
                    })
                  }
                  required
                  minLength={8}
                  className="w-full px-5 py-4 pr-14 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all hover:border-gray-300 text-gray-900 font-medium"
                  placeholder="En az 8 karakter"
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowPasswords({
                      ...showPasswords,
                      new: !showPasswords.new,
                    })
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPasswords.new ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
                <CheckCircle2 size={18} className="text-green-600" />
                Yeni Şifre (Tekrar)
              </label>
              <div className="relative">
                <input
                  type={showPasswords.confirm ? "text" : "password"}
                  value={passwordForm.confirmPassword}
                  onChange={(e) =>
                    setPasswordForm({
                      ...passwordForm,
                      confirmPassword: e.target.value,
                    })
                  }
                  required
                  minLength={8}
                  className="w-full px-5 py-4 pr-14 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all hover:border-gray-300 text-gray-900 font-medium"
                  placeholder="Yeni şifrenizi tekrar girin"
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowPasswords({
                      ...showPasswords,
                      confirm: !showPasswords.confirm,
                    })
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPasswords.confirm ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>
          </div>

          {passwordForm.newPassword && (
            <div
              className={`p-5 rounded-xl border-2 transition-all ${
                strength.color === "green"
                  ? "bg-green-50 border-green-200"
                  : strength.color === "yellow"
                    ? "bg-yellow-50 border-yellow-200"
                    : strength.color === "orange"
                      ? "bg-orange-50 border-orange-200"
                      : "bg-red-50 border-red-200"
              }`}
            >
              <p className="text-sm font-bold text-gray-900 mb-3">
                Şifre Gücü: {strength.text}
              </p>
              <div className="flex gap-1.5 mb-3">
                {[1, 2, 3, 4].map((level) => (
                  <div
                    key={level}
                    className={`h-2.5 flex-1 rounded-full transition-all ${
                      strength.level >= level
                        ? strength.color === "green"
                          ? "bg-gradient-to-r from-green-500 to-green-600 shadow-sm"
                          : strength.color === "yellow"
                            ? "bg-gradient-to-r from-yellow-500 to-yellow-600 shadow-sm"
                            : strength.color === "orange"
                              ? "bg-gradient-to-r from-orange-500 to-orange-600 shadow-sm"
                              : "bg-gradient-to-r from-red-500 to-red-600 shadow-sm"
                        : "bg-gray-200"
                    }`}
                  />
                ))}
              </div>
              <p
                className={`text-xs font-medium ${
                  strength.color === "green"
                    ? "text-green-700"
                    : strength.color === "yellow"
                      ? "text-yellow-700"
                      : strength.color === "orange"
                        ? "text-orange-700"
                        : "text-red-700"
                }`}
              >
                {passwordForm.newPassword.length < 6 &&
                  "❌ Çok zayıf - En az 8 karakter önerili"}
                {passwordForm.newPassword.length >= 6 &&
                  passwordForm.newPassword.length < 8 &&
                  "⚠️ Zayıf - 8+ karakter kullanın"}
                {passwordForm.newPassword.length >= 8 &&
                  passwordForm.newPassword.length < 12 &&
                  "✓ Orta - 12+ karakter daha güvenli"}
                {passwordForm.newPassword.length >= 12 &&
                  "✓✓ Güçlü şifre - Mükemmel!"}
              </p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t-2 border-gray-100">
            <button
              type="button"
              onClick={() =>
                setPasswordForm({
                  currentPassword: "",
                  newPassword: "",
                  confirmPassword: "",
                })
              }
              disabled={changingPassword}
              className="flex items-center justify-center gap-2 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all disabled:opacity-50 font-medium shadow-sm"
            >
              <AlertTriangle size={18} />
              İptal
            </button>
            <Button
              type="submit"
              loading={changingPassword}
              disabled={
                changingPassword ||
                !passwordForm.currentPassword ||
                !passwordForm.newPassword ||
                !passwordForm.confirmPassword
              }
              size="lg"
            >
              {changingPassword ? (
                "Değiştiriliyor..."
              ) : (
                <>
                  <Save size={18} />
                  Şifre Değiştir
                </>
              )}
            </Button>
          </div>
        </form>
      </div>

      {/* Active Sessions - GLASSMORPHISM */}
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 p-8">
        <div className="flex items-center gap-4 mb-8 pb-6 border-b-2 border-gray-100">
          <div className="p-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl shadow-xl">
            <Monitor className="text-white" size={28} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Aktif Oturumlar</h2>
            <p className="text-sm text-gray-600 font-medium">
              Hesabınıza bağlı tüm cihazları görün ve yönetin
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {loadingSessions ? (
            <div className="text-center py-8 text-gray-500">
              <Clock className="inline animate-spin mb-2" size={24} />
              <p>Oturumlar yükleniyor...</p>
            </div>
          ) : sessions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Monitor className="inline mb-2" size={24} />
              <p>Aktif oturum bulunamadı</p>
            </div>
          ) : (
            sessions.map((session) => (
              <div
                key={session.id}
                className={`p-6 rounded-2xl border-2 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                  session.current
                    ? "bg-gradient-to-br from-green-50 to-emerald-50 border-green-300 shadow-lg"
                    : "bg-white/50 backdrop-blur-sm border-gray-200 shadow-md"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div
                      className={`p-2.5 rounded-lg shadow-sm ${
                        session.current ? "bg-green-500" : "bg-gray-200"
                      }`}
                    >
                      {session.device.includes("Mobile") ? (
                        <Smartphone
                          className={
                            session.current ? "text-white" : "text-gray-600"
                          }
                          size={22}
                        />
                      ) : (
                        <Monitor
                          className={
                            session.current ? "text-white" : "text-gray-600"
                          }
                          size={22}
                        />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-bold text-gray-900">
                          {session.device}
                        </h4>
                        {session.current && (
                          <span className="px-2.5 py-1 bg-green-500 text-white text-xs rounded-full font-bold shadow-sm">
                            ✓ Mevcut Oturum
                          </span>
                        )}
                      </div>
                      <div className="space-y-1.5">
                        <p className="text-sm text-gray-600 flex items-center gap-2">
                          <Globe size={14} className="text-blue-500" />
                          <span className="font-medium">
                            {session.location}
                          </span>
                        </p>
                        <p className="text-sm text-gray-600 flex items-center gap-2">
                          <Clock size={14} className="text-purple-500" />
                          Son aktivite:{" "}
                          {session.lastActive.toLocaleString("tr-TR")}
                        </p>
                        <p className="text-xs text-gray-500 font-mono bg-gray-100 inline-block px-2 py-1 rounded">
                          IP: {session.ip}
                        </p>
                      </div>
                    </div>
                  </div>
                  {!session.current && (
                    <button className="p-2.5 text-red-600 hover:bg-red-50 rounded-lg transition-all border-2 border-transparent hover:border-red-200">
                      <LogOut size={18} />
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="mt-4 p-5 bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-xl">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-yellow-500 rounded-lg shadow-sm">
              <AlertTriangle className="text-white" size={20} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-yellow-900 mb-1">
                Güvenlik İpucu
              </p>
              <p className="text-sm text-yellow-700">
                Tanımadığınız bir cihaz görüyorsanız hemen şifrenizi değiştirin
                ve o oturumu sonlandırın
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Two-Factor Authentication - GLASSMORPHISM */}
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 p-8">
        <div className="flex items-center gap-4 mb-8 pb-6 border-b-2 border-gray-100">
          <div className="p-4 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl shadow-xl">
            <Key className="text-white" size={28} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              İki Faktörlü Doğrulama (2FA)
            </h2>
            <p className="text-sm text-gray-600 font-medium">
              Hesabınıza ekstra bir güvenlik katmanı ekleyin
            </p>
          </div>
        </div>

        <div className="p-6 bg-gradient-to-br from-gray-50 to-slate-50 border-2 border-gray-200 rounded-xl">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-gray-200 rounded-lg">
              <Key className="text-gray-500" size={24} />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-gray-900 mb-2">
                2FA ile Ekstra Güvenlik
              </h4>
              <p className="text-sm text-gray-600 mb-4">
                Hesabınıza ek bir güvenlik katmanı ekleyin. SMS veya
                authenticator app ile doğrulama. (Yakında)
              </p>
              <button
                disabled
                className="px-6 py-2.5 bg-gray-300 text-gray-500 rounded-lg cursor-not-allowed font-medium"
              >
                Yakında Aktif Olacak
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Security Tips - ULTRA MODERN */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-500 rounded-3xl shadow-2xl">
        {/* Pattern Overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMwLTkuOTQtOC4wNi0xOC0xOC0xOCIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9IjEiIG9wYWNpdHk9Ii4xIi8+PC9nPjwvc3ZnPg==')] opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>

        <div className="relative p-8">
          <div className="flex gap-6">
            <div className="flex-shrink-0">
              <div className="p-4 bg-white/20 backdrop-blur-xl rounded-2xl shadow-xl border border-white/30">
                <Info className="text-white" size={28} />
              </div>
            </div>
            <div className="flex-1">
              <h4 className="text-2xl font-bold text-white mb-4">Güvenlik Önerileri</h4>
              <ul className="text-sm text-white/90 space-y-3 font-medium">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="flex-shrink-0 mt-0.5" size={18} />
                  <span>
                    Şifrenizi düzenli olarak değiştirin (her 3 ayda bir önerilir)
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="flex-shrink-0 mt-0.5" size={18} />
                  <span>Her hesap için farklı şifre kullanın</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="flex-shrink-0 mt-0.5" size={18} />
                  <span>Şifrenizi kimseyle paylaşmayın</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="flex-shrink-0 mt-0.5" size={18} />
                  <span>
                    Ortak/umumi bilgisayarlarda oturumu her zaman kapatın
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
