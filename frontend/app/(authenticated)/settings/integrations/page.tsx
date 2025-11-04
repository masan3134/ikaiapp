"use client";

import { useState } from "react";
import { Plug, Settings, Check, X, ExternalLink } from "lucide-react";
import { withRoleProtection } from "@/lib/hoc/withRoleProtection";
import { RoleGroups } from "@/lib/constants/roles";

function IntegrationsSettingsPage() {
  const integrations = [
    {
      id: "slack",
      name: "Slack",
      description: "Bildirimlerinizi Slack kanallarına gönderin",
      icon: "💬",
      status: "available",
      connected: false,
      category: "Communication",
    },
    {
      id: "gmail",
      name: "Gmail",
      description: "E-posta entegrasyonu ile otomatik bildirimler",
      icon: "📧",
      status: "available",
      connected: true,
      category: "Email",
    },
    {
      id: "linkedin",
      name: "LinkedIn",
      description: "İlanlarınızı LinkedIn'e otomatik yayınlayın",
      icon: "💼",
      status: "coming_soon",
      connected: false,
      category: "Job Boards",
    },
    {
      id: "google_calendar",
      name: "Google Calendar",
      description: "Mülakatları takvime ekleyin",
      icon: "📅",
      status: "available",
      connected: false,
      category: "Calendar",
    },
    {
      id: "zapier",
      name: "Zapier",
      description: "Binlerce uygulama ile entegrasyon",
      icon: "⚡",
      status: "coming_soon",
      connected: false,
      category: "Automation",
    },
    {
      id: "webhook",
      name: "Webhook",
      description: "Özel webhook entegrasyonları",
      icon: "🔗",
      status: "available",
      connected: false,
      category: "Developer",
    },
  ];

  const [selectedCategory, setSelectedCategory] = useState("all");
  const categories = ["all", "Communication", "Email", "Job Boards", "Calendar", "Automation", "Developer"];

  const filteredIntegrations = integrations.filter(
    (int) => selectedCategory === "all" || int.category === selectedCategory
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Entegrasyonlar</h1>
        <p className="text-gray-600 mt-1">Üçüncü parti uygulamalarla bağlantı kurun</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <Check className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {integrations.filter((i) => i.connected).length}
              </div>
              <div className="text-sm text-gray-600">Aktif Entegrasyon</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Plug className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {integrations.filter((i) => i.status === "available").length}
              </div>
              <div className="text-sm text-gray-600">Kullanılabilir</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Settings className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {integrations.filter((i) => i.status === "coming_soon").length}
              </div>
              <div className="text-sm text-gray-600">Yakında</div>
            </div>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-gray-700">Kategori:</span>
          <div className="flex gap-2 flex-wrap">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? "bg-purple-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {category === "all" ? "Tümü" : category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Integrations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredIntegrations.map((integration) => (
          <div
            key={integration.id}
            className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="text-4xl">{integration.icon}</div>
              {integration.connected && (
                <span className="flex items-center gap-1 px-2.5 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">
                  <Check className="w-3 h-3" />
                  Bağlı
                </span>
              )}
              {integration.status === "coming_soon" && (
                <span className="px-2.5 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
                  Yakında
                </span>
              )}
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{integration.name}</h3>
            <p className="text-sm text-gray-600 mb-4">{integration.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">{integration.category}</span>
              {integration.status === "available" && !integration.connected && (
                <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium">
                  Bağlan
                </button>
              )}
              {integration.connected && (
                <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Ayarlar
                </button>
              )}
              {integration.status === "coming_soon" && (
                <button
                  disabled
                  className="px-4 py-2 bg-gray-100 text-gray-400 rounded-lg cursor-not-allowed text-sm font-medium"
                >
                  Yakında
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Webhook Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-blue-100 rounded-lg">
            <ExternalLink className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Developer API</h2>
            <p className="text-sm text-gray-600">RESTful API ile kendi entegrasyonlarınızı oluşturun</p>
          </div>
        </div>
        <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium">
          API Dokümantasyonu
        </button>
      </div>
    </div>
  );
}

export default withRoleProtection(IntegrationsSettingsPage, RoleGroups.ADMIN_AND_ABOVE);
