'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/store/authStore'
import { ROLE_COLORS } from '@/lib/constants/roleColors'
import { StatCards } from './StatCards'
import { getDashboardStats } from '@/lib/services/dashboardService'
import LoadingSkeleton from '@/components/ui/LoadingSkeleton'

export const AdminDashboard = () => {
  const router = useRouter()
  const { user } = useAuthStore()
  const roleColor = ROLE_COLORS.ADMIN.primary
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  async function loadStats() {
    try {
      setLoading(true)
      const data = await getDashboardStats()
      setStats(data)
    } catch (error) {
      console.error('Dashboard stats error:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <LoadingSkeleton variant="grid" rows={3} columns={4} />
  }

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            👋 Günaydın, {user?.name || 'Admin'}!
          </h1>
          <p className="text-sm text-gray-500">
            {user?.organization?.name} • {user?.organization?.plan || 'FREE'} Plan
          </p>
        </div>

        {/* Upgrade CTA (if FREE) */}
        {user?.organization?.plan === 'FREE' && (
          <button
            onClick={() => router.push('/settings/billing')}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-700 text-white rounded-lg font-medium hover:shadow-lg transition-all hover:scale-105"
          >
            🚀 PRO'ya Yükselt
          </button>
        )}
      </div>

      {/* Stat Cards */}
      <StatCards stats={{
        activeJobs: stats?.overview?.totalJobPostings || 0,
        totalCandidates: stats?.overview?.totalCandidates || 0,
        thisMonthAnalyses: stats?.overview?.totalAnalyses || 0,
        usagePercent: 0 // TODO: Add usage tracking API
      }} />

      {/* Candidate Pipeline */}
      <div className="bg-white rounded-xl shadow-sm border-2 p-6" style={{ borderColor: roleColor }}>
        <h2 className="text-lg font-semibold text-gray-900 mb-6">
          Analiz Durumları
        </h2>
        <div className="flex items-center justify-between gap-2 overflow-x-auto">
          {[
            { label: 'Pending', count: stats?.analysisByStatus?.PENDING || 0, color: '#F59E0B' },
            { label: 'Processing', count: stats?.analysisByStatus?.PROCESSING || 0, color: '#3B82F6' },
            { label: 'Completed', count: stats?.analysisByStatus?.COMPLETED || 0, color: '#10B981' },
            { label: 'Failed', count: stats?.analysisByStatus?.FAILED || 0, color: '#EF4444' }
          ].map((stage, index) => (
            <div key={stage.label} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-bold mb-2 transition-transform hover:scale-110"
                  style={{ backgroundColor: stage.color }}
                >
                  {stage.count}
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {stage.label}
                </span>
              </div>
              {index < 4 && (
                <span className="text-2xl text-gray-400 mx-2">→</span>
              )}
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-4 text-center">
          Analiz durum dağılımı
        </p>
      </div>

      {/* Two Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Activity */}
        <div className="bg-white rounded-xl shadow-sm border-2 p-6" style={{ borderColor: roleColor }}>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Son Aktiviteler
          </h2>
          <div className="space-y-3">
            {stats?.recentAnalyses && stats.recentAnalyses.length > 0 ? (
              stats.recentAnalyses.slice(0, 3).map((analysis: any) => (
                <div
                  key={analysis.id}
                  onClick={() => router.push(`/analyses/${analysis.id}`)}
                  className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors cursor-pointer"
                >
                  <span className="text-2xl">📊</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {analysis.jobPostingTitle}
                    </p>
                    <p className="text-xs text-gray-500">
                      {analysis.candidateCount} candidates • {analysis.status}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">Henüz aktivite yok</p>
            )}
          </div>
          <button className="w-full mt-4 text-sm text-purple-600 font-medium hover:text-purple-700 transition-colors">
            Tümünü Gör →
          </button>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border-2 p-6" style={{ borderColor: roleColor }}>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Hızlı İşlemler
          </h2>
          <div className="space-y-3">
            <button
              onClick={() => router.push('/job-postings/new')}
              className="w-full flex items-center gap-3 p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg hover:shadow-md transition-all hover:scale-102"
            >
              <span className="text-2xl">📄</span>
              <span className="text-sm font-medium text-gray-900">
                İş İlanı Oluştur
              </span>
            </button>
            <button
              onClick={() => router.push('/wizard')}
              className="w-full flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg hover:shadow-md transition-all hover:scale-102"
            >
              <span className="text-2xl">📤</span>
              <span className="text-sm font-medium text-gray-900">
                CV Yükle
              </span>
            </button>
            <button
              onClick={() => router.push('/interviews/new')}
              className="w-full flex items-center gap-3 p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg hover:shadow-md transition-all hover:scale-102"
            >
              <span className="text-2xl">📅</span>
              <span className="text-sm font-medium text-gray-900">
                Mülakat Planla
              </span>
            </button>
            <button
              onClick={() => router.push('/team')}
              className="w-full flex items-center gap-3 p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg hover:shadow-md transition-all hover:scale-102"
            >
              <span className="text-2xl">👥</span>
              <span className="text-sm font-medium text-gray-900">
                Kullanıcı Davet Et
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
