"use client";

import { useState, useEffect } from "react";
import { BarChart3, TrendingUp, Users, Database, Briefcase, FileText } from "lucide-react";
import { withRoleProtection } from "@/lib/hoc/withRoleProtection";
import apiClient from "@/lib/services/apiClient";

function SuperAdminAnalyticsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get("/api/v1/super-admin/analytics");

      if (res.data.success) {
        setData(res.data.data);
      }
    } catch (error) {
      console.error("Error loading analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sistem Analitikleri</h1>
          <p className="text-gray-600 mt-1">Platform kullanım metrikleri ve raporları</p>
        </div>
        <div className="text-center py-12 text-gray-500">Yükleniyor...</div>
      </div>
    );
  }

  if (!data) return null;

  const { overview, growth, engagement } = data;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Sistem Analitikleri</h1>
        <p className="text-gray-600 mt-1">Platform kullanım metrikleri ve raporları</p>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Genel Bakış</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Database className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{overview.totalOrganizations}</div>
                <div className="text-sm text-gray-600">Toplam Organizasyon</div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Users className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{overview.totalUsers}</div>
                <div className="text-sm text-gray-600">Toplam Kullanıcı</div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Briefcase className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{overview.totalJobPostings}</div>
                <div className="text-sm text-gray-600">Toplam İlan</div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 rounded-lg">
                <FileText className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{overview.totalCandidates}</div>
                <div className="text-sm text-gray-600">Toplam Aday</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Büyüme Metrikleri (Son 30 Gün)</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-gray-600">Yeni Organizasyonlar</span>
            </div>
            <div className="text-3xl font-bold text-blue-600">{growth.newOrganizations}</div>
            <div className="text-sm text-gray-500 mt-1">{growth.period}</div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium text-gray-600">Yeni Kullanıcılar</span>
            </div>
            <div className="text-3xl font-bold text-green-600">{growth.newUsers}</div>
            <div className="text-sm text-gray-500 mt-1">{growth.period}</div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-5 h-5 text-purple-600" />
              <span className="text-sm font-medium text-gray-600">Yeni İlanlar</span>
            </div>
            <div className="text-3xl font-bold text-purple-600">{growth.newJobPostings}</div>
            <div className="text-sm text-gray-500 mt-1">{growth.period}</div>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Etkileşim Metrikleri</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="text-sm text-gray-600 mb-2">Organizasyon Başına Ortalama İlan</div>
            <div className="text-3xl font-bold text-gray-900">{engagement.avgJobsPerOrg}</div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="text-sm text-gray-600 mb-2">Organizasyon Başına Ortalama Kullanıcı</div>
            <div className="text-3xl font-bold text-gray-900">{engagement.avgUsersPerOrg}</div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="text-sm text-gray-600 mb-2">İlan Başına Ortalama Analiz</div>
            <div className="text-3xl font-bold text-gray-900">{engagement.avgAnalysesPerJob}</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Ek İstatistikler</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="text-xs text-gray-600">Aktif Org.</div>
            <div className="text-xl font-bold text-gray-900 mt-1">{overview.activeOrganizations}</div>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="text-xs text-gray-600">Aktif Kullanıcı</div>
            <div className="text-xl font-bold text-gray-900 mt-1">{overview.activeUsers}</div>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="text-xs text-gray-600">Toplam Analiz</div>
            <div className="text-xl font-bold text-gray-900 mt-1">{overview.totalAnalyses}</div>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="text-xs text-gray-600">Aktiflik Oranı</div>
            <div className="text-xl font-bold text-gray-900 mt-1">
              {overview.totalOrganizations > 0
                ? Math.round((overview.activeOrganizations / overview.totalOrganizations) * 100)
                : 0}
              %
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default withRoleProtection(SuperAdminAnalyticsPage, ["SUPER_ADMIN"]);
