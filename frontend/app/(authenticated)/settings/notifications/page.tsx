"use client";

import { useState, useEffect } from "react";
import {
  getPreferences,
  updatePreferences,
  type NotificationPreference,
} from "@/lib/api/notifications";
import { Card } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import {
  Bell,
  Mail,
  CheckCircle2,
  Info,
  Sparkles,
  Users,
  Briefcase,
  Calendar,
  AlertTriangle,
  Save,
} from "lucide-react";

/**
 * Modern Notification Preferences Page
 * User-friendly toggle-based UI with categories
 */

const notificationTypeLabels: Record<
  string,
  {
    label: string;
    description: string;
    category: string;
    icon: any;
    color: string;
  }
> = {
  // Analysis (3)
  ANALYSIS_STARTED: {
    label: "Analiz Başlatıldı",
    description: "CV analizi başladığında bildirim al",
    category: "CV Analizi",
    icon: Sparkles,
    color: "blue",
  },
  ANALYSIS_COMPLETED: {
    label: "Analiz Tamamlandı",
    description: "CV analizi tamamlandığında sonuçları gör",
    category: "CV Analizi",
    icon: CheckCircle2,
    color: "green",
  },
  ANALYSIS_FAILED: {
    label: "Analiz Başarısız",
    description: "CV analizi başarısız olduğunda bilgilendir",
    category: "CV Analizi",
    icon: AlertTriangle,
    color: "red",
  },

  // Candidate (1)
  CANDIDATE_UPLOADED: {
    label: "Aday Eklendi",
    description: "Yeni aday sisteme eklendiğinde",
    category: "Adaylar",
    icon: Users,
    color: "purple",
  },

  // Offer (5)
  OFFER_CREATED: {
    label: "Teklif Oluşturuldu",
    description: "Yeni iş teklifi oluşturulduğunda",
    category: "İş Teklifleri",
    icon: Briefcase,
    color: "blue",
  },
  OFFER_SENT: {
    label: "Teklif Gönderildi",
    description: "Teklif adaya e-posta ile gönderildiğinde",
    category: "İş Teklifleri",
    icon: Mail,
    color: "purple",
  },
  OFFER_ACCEPTED: {
    label: "Teklif Kabul Edildi",
    description: "Aday teklifi kabul ettiğinde (önemli!)",
    category: "İş Teklifleri",
    icon: CheckCircle2,
    color: "green",
  },
  OFFER_REJECTED: {
    label: "Teklif Reddedildi",
    description: "Aday teklifi reddettiğinde",
    category: "İş Teklifleri",
    icon: AlertTriangle,
    color: "red",
  },
  OFFER_EXPIRED: {
    label: "Teklif Süresi Doldu",
    description: "Teklif 7 gün sonra süresi dolduğunda",
    category: "İş Teklifleri",
    icon: AlertTriangle,
    color: "orange",
  },

  // Interview (3)
  INTERVIEW_SCHEDULED: {
    label: "Mülakat Planlandı",
    description: "Yeni mülakat planlandığında",
    category: "Mülakatlar",
    icon: Calendar,
    color: "blue",
  },
  INTERVIEW_COMPLETED: {
    label: "Mülakat Tamamlandı",
    description: "Mülakat tamamlandığında",
    category: "Mülakatlar",
    icon: CheckCircle2,
    color: "green",
  },
  INTERVIEW_CANCELLED: {
    label: "Mülakat İptal Edildi",
    description: "Mülakat iptal edildiğinde",
    category: "Mülakatlar",
    icon: AlertTriangle,
    color: "red",
  },

  // System (3)
  USER_INVITED: {
    label: "Kullanıcı Davet Edildi",
    description: "Yeni kullanıcı organizasyona davet edildiğinde",
    category: "Sistem",
    icon: Users,
    color: "purple",
  },
  USAGE_LIMIT_WARNING: {
    label: "Limit Uyarısı (%80)",
    description: "Aylık kullanım limitinin %80'ine ulaşıldığında",
    category: "Sistem",
    icon: AlertTriangle,
    color: "orange",
  },
  USAGE_LIMIT_REACHED: {
    label: "Limit Doldu",
    description: "Aylık kullanım limiti dolduğunda (önemli!)",
    category: "Sistem",
    icon: AlertTriangle,
    color: "red",
  },
};

export default function NotificationPreferencesPage() {
  const [preferences, setPreferences] = useState<NotificationPreference[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      setLoading(true);
      const prefs = await getPreferences();
      setPreferences(prefs);
    } catch (err: any) {
      setMessage({ type: "error", text: "Tercihler yüklenemedi" });
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = (type: string, field: "enabled" | "emailEnabled") => {
    setPreferences((prev) =>
      prev.map((pref) =>
        pref.type === type ? { ...pref, [field]: !pref[field] } : pref
      )
    );
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setMessage(null);

      await updatePreferences(preferences);

      setMessage({
        type: "success",
        text: "✅ Bildirim tercihleri başarıyla kaydedildi!",
      });
      setTimeout(() => setMessage(null), 4000);
    } catch (err: any) {
      setMessage({ type: "error", text: "Tercihler kaydedilemedi" });
    } finally {
      setSaving(false);
    }
  };

  const handleResetToDefaults = () => {
    setPreferences((prev) =>
      prev.map((pref) => ({
        ...pref,
        enabled: true,
        emailEnabled: false,
      }))
    );
    setMessage({
      type: "success",
      text: "Varsayılan ayarlara dönüldü. Kaydet butonuna tıklayın.",
    });
  };

  const handleEnableAll = () => {
    setPreferences((prev) =>
      prev.map((pref) => ({
        ...pref,
        enabled: true,
        emailEnabled: true,
      }))
    );
    setMessage({
      type: "success",
      text: "Tüm bildirimler açıldı. Kaydet butonuna tıklayın.",
    });
  };

  const handleDisableAll = () => {
    setPreferences((prev) =>
      prev.map((pref) => ({
        ...pref,
        enabled: false,
        emailEnabled: false,
      }))
    );
    setMessage({
      type: "success",
      text: "Tüm bildirimler kapatıldı. Kaydet butonuna tıklayın.",
    });
  };

  const enabledCount = preferences.filter((p) => p.enabled).length;
  const emailEnabledCount = preferences.filter((p) => p.emailEnabled).length;

  // Group by category
  const categories = [
    "CV Analizi",
    "Adaylar",
    "İş Teklifleri",
    "Mülakatlar",
    "Sistem",
  ];
  const categoryColors: Record<string, string> = {
    "CV Analizi": "blue",
    Adaylar: "purple",
    "İş Teklifleri": "green",
    Mülakatlar: "orange",
    Sistem: "red",
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white rounded-xl shadow-sm p-6 animate-pulse"
            >
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Success/Error Message */}
      {message && (
        <div
          className={`p-4 rounded-xl flex items-center gap-3 shadow-sm animate-in slide-in-from-top duration-300 ${
            message.type === "success"
              ? "bg-green-50 border-2 border-green-200 text-green-800"
              : "bg-red-50 border-2 border-red-200 text-red-800"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle2 className="flex-shrink-0" size={20} />
          ) : (
            <AlertTriangle className="flex-shrink-0" size={20} />
          )}
          <p className="font-medium flex-1">{message.text}</p>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl shadow-sm border-2 border-blue-200 p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-500 rounded-lg shadow-md">
              <Bell className="text-white" size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-blue-700">Uygulama İçi</p>
              <p className="text-3xl font-bold text-blue-900">{enabledCount}</p>
              <p className="text-xs text-blue-600">
                / {preferences.length} bildirim
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-xl shadow-sm border-2 border-purple-200 p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-500 rounded-lg shadow-md">
              <Mail className="text-white" size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-purple-700">E-posta</p>
              <p className="text-3xl font-bold text-purple-900">
                {emailEnabledCount}
              </p>
              <p className="text-xs text-purple-600">
                / {preferences.length} bildirim
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100/50 rounded-xl shadow-sm border-2 border-green-200 p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-500 rounded-lg shadow-md">
              <CheckCircle2 className="text-white" size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-green-700">Kategoriler</p>
              <p className="text-3xl font-bold text-green-900">
                {categories.length}
              </p>
              <p className="text-xs text-green-600">farklı kategori</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={handleEnableAll}
          className="px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-all shadow-sm hover:shadow-md flex items-center gap-2"
        >
          <CheckCircle2 size={16} />
          Hepsini Aç
        </button>
        <button
          onClick={handleDisableAll}
          className="px-4 py-2.5 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-all shadow-sm hover:shadow-md flex items-center gap-2"
        >
          <AlertTriangle size={16} />
          Hepsini Kapat
        </button>
        <button
          onClick={handleResetToDefaults}
          className="px-4 py-2.5 bg-white hover:bg-gray-50 text-gray-700 border-2 border-gray-300 rounded-lg font-medium transition-all shadow-sm hover:shadow-md"
        >
          Varsayılanlara Dön
        </button>
      </div>

      {/* Notification Categories */}
      <div className="space-y-6">
        {categories.map((category) => {
          const categoryPrefs = preferences.filter(
            (p) => notificationTypeLabels[p.type]?.category === category
          );

          if (categoryPrefs.length === 0) return null;

          const color = categoryColors[category] || "gray";
          const colorClasses = {
            blue: "from-blue-500 to-blue-600 border-blue-200",
            purple: "from-purple-500 to-purple-600 border-purple-200",
            green: "from-green-500 to-green-600 border-green-200",
            orange: "from-orange-500 to-orange-600 border-orange-200",
            red: "from-red-500 to-red-600 border-red-200",
            gray: "from-gray-500 to-gray-600 border-gray-200",
          }[color];

          const bgClasses = {
            blue: "bg-blue-50",
            purple: "bg-purple-50",
            green: "bg-green-50",
            orange: "bg-orange-50",
            red: "bg-red-50",
            gray: "bg-gray-50",
          }[color];

          return (
            <Card key={category}>
              {/* Category Header */}
              <div
                className={`flex items-center gap-3 -m-6 p-4 mb-6 rounded-t-xl bg-gradient-to-r ${colorClasses} text-white`}
              >
                <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
                  {category === "CV Analizi" && <Sparkles size={20} />}
                  {category === "Adaylar" && <Users size={20} />}
                  {category === "İş Teklifleri" && <Briefcase size={20} />}
                  {category === "Mülakatlar" && <Calendar size={20} />}
                  {category === "Sistem" && <AlertTriangle size={20} />}
                </div>
                <div>
                  <h3 className="font-bold text-lg">{category}</h3>
                  <p className="text-sm text-white/90">
                    {categoryPrefs.length} bildirim türü
                  </p>
                </div>
              </div>

              {/* Preference Items */}
              <div className="space-y-3">
                {categoryPrefs.map((pref) => {
                  const typeInfo = notificationTypeLabels[pref.type];
                  const Icon = typeInfo?.icon || Bell;

                  return (
                    <div
                      key={pref.type}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        pref.enabled
                          ? `${bgClasses} border-${color}-200 shadow-sm`
                          : "bg-gray-50 border-gray-200"
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        {/* Icon */}
                        <div
                          className={`p-2.5 rounded-lg ${
                            pref.enabled ? `bg-${color}-100` : "bg-gray-200"
                          }`}
                        >
                          <Icon
                            size={20}
                            className={
                              pref.enabled
                                ? `text-${color}-600`
                                : "text-gray-400"
                            }
                          />
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 mb-1">
                            {typeInfo?.label || pref.type}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {typeInfo?.description || ""}
                          </p>
                        </div>

                        {/* Toggles */}
                        <div className="flex items-center gap-4 flex-shrink-0">
                          {/* In-App Toggle */}
                          <div className="flex flex-col items-center gap-1.5">
                            <span className="text-xs font-medium text-gray-600">
                              Uygulama
                            </span>
                            <button
                              onClick={() => handleToggle(pref.type, "enabled")}
                              className={`relative inline-flex h-7 w-12 items-center rounded-full transition-all shadow-inner ${
                                pref.enabled
                                  ? "bg-blue-600 shadow-blue-200"
                                  : "bg-gray-300"
                              }`}
                            >
                              <span
                                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition-transform ${
                                  pref.enabled
                                    ? "translate-x-6"
                                    : "translate-x-1"
                                }`}
                              />
                            </button>
                          </div>

                          {/* Email Toggle */}
                          <div className="flex flex-col items-center gap-1.5">
                            <span className="text-xs font-medium text-gray-600">
                              E-posta
                            </span>
                            <button
                              onClick={() =>
                                handleToggle(pref.type, "emailEnabled")
                              }
                              disabled={!pref.enabled}
                              className={`relative inline-flex h-7 w-12 items-center rounded-full transition-all shadow-inner ${
                                pref.emailEnabled && pref.enabled
                                  ? "bg-purple-600 shadow-purple-200"
                                  : "bg-gray-300"
                              } ${!pref.enabled ? "opacity-40 cursor-not-allowed" : ""}`}
                            >
                              <span
                                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition-transform ${
                                  pref.emailEnabled && pref.enabled
                                    ? "translate-x-6"
                                    : "translate-x-1"
                                }`}
                              />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
        <div className="flex gap-4">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center shadow-md">
              <Info className="text-white" size={20} />
            </div>
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-blue-900 mb-2">
              Bildirim Tercihleri Hakkında
            </h4>
            <ul className="text-sm text-blue-800 space-y-2">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="flex-shrink-0 mt-0.5" size={16} />
                <span>
                  E-posta bildirimleri sadece uygulama içi bildirimi açık olan
                  tipler için gönderilebilir
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="flex-shrink-0 mt-0.5" size={16} />
                <span>
                  Önemli olaylar (Teklif Kabul/Red, Limit Doldu) için e-posta
                  bildirimi önerilir
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="flex-shrink-0 mt-0.5" size={16} />
                <span>
                  Değişiklikler anında uygulanır, yeniden giriş yapmanız
                  gerekmez
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="flex-shrink-0 mt-0.5" size={16} />
                <span>
                  SUPER_ADMIN tüm organizasyonlardan bildirimleri görür
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Save Button - Fixed Bottom */}
      <div className="sticky bottom-6 z-10">
        <div className="bg-white rounded-xl shadow-xl border-2 border-gray-200 p-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-100 rounded-lg">
                <Save size={20} className="text-gray-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">
                  Değişiklikler kaydedilmedi
                </p>
                <p className="text-sm text-gray-600">
                  {enabledCount} uygulama, {emailEnabledCount} e-posta bildirimi
                  aktif
                </p>
              </div>
            </div>
            <Button
              onClick={handleSave}
              loading={saving}
              disabled={saving}
              size="lg"
            >
              {saving ? (
                "Kaydediliyor..."
              ) : (
                <>
                  <CheckCircle2 size={18} />
                  Tercihleri Kaydet
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
