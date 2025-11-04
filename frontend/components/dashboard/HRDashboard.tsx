'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/store/authStore'
import { ROLE_COLORS } from '@/lib/constants/roleColors'
import { getDashboardStats } from '@/lib/services/dashboardService'
import LoadingSkeleton from '@/components/ui/LoadingSkeleton'

export const HRDashboard = () => {
  const router = useRouter()
  const { user } = useAuthStore()
  const roleColor = ROLE_COLORS.HR_SPECIALIST.primary
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
    return <LoadingSkeleton variant="grid" rows={3} columns={2} />
  }

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          👋 Tekrar hoşgeldin, {user?.name || 'İK Uzmanı'}!
        </h1>
        <p className="text-sm text-gray-500">
          İK Uzmanı • {user?.organization?.name || 'Organizasyonunuz'}
        </p>
      </div>

      {/* Today's To-Do */}
      <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl border-2 border-green-500 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          📋 Today's To-Do
        </h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-900">
              ✅ Review 3 CVs
            </span>
            <button
              onClick={() => router.push('/candidates')}
              className="text-sm text-green-600 font-medium hover:text-green-700 transition-colors"
            >
              Start Now →
            </button>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-900">
              📅 2 Interviews today
            </span>
            <button
              onClick={() => router.push('/interviews')}
              className="text-sm text-green-600 font-medium hover:text-green-700 transition-colors"
            >
              View →
            </button>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-900">
              ⏳ 1 Analysis pending (30 min ago)
            </span>
            <button
              onClick={() => router.push('/analyses')}
              className="text-sm text-green-600 font-medium hover:text-green-700 transition-colors"
            >
              Check →
            </button>
          </div>
        </div>
      </div>

      {/* Drag & Drop CV Upload */}
      <div
        onClick={() => router.push('/wizard')}
        className="bg-white rounded-xl shadow-sm border-4 border-dashed border-green-300 p-8 text-center hover:border-green-500 hover:bg-green-50 transition-all cursor-pointer"
      >
        <div className="text-6xl mb-4">📤</div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          CV Yükle (Sürükle Bırak)
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          CV dosyanızı buraya sürükleyin veya göz atmak için tıklayın
        </p>
        <button className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-700 text-white rounded-lg font-medium hover:shadow-lg transition-all hover:scale-105">
          Dosya Seç
        </button>
        <p className="text-xs text-gray-400 mt-3">
          Desteklenen: PDF, DOCX, TXT (max 10MB)
        </p>
      </div>

      {/* Two Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Candidate Pipeline */}
        <div className="bg-white rounded-xl shadow-sm border-2 border-green-500 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Analiz Süreçleri
          </h2>
          <div className="space-y-4">
            {[
              { stage: 'Pending', count: stats?.analysisByStatus?.PENDING || 0, color: '#F59E0B' },
              { stage: 'Processing', count: stats?.analysisByStatus?.PROCESSING || 0, color: '#3B82F6' },
              { stage: 'Completed', count: stats?.analysisByStatus?.COMPLETED || 0, color: '#10B981' },
              { stage: 'Failed', count: stats?.analysisByStatus?.FAILED || 0, color: '#EF4444' }
            ].map((item) => (
              <div key={item.stage} className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold transition-transform hover:scale-110"
                  style={{ backgroundColor: item.color }}
                >
                  {item.count}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900">
                    {item.stage}
                  </div>
                  <div className="text-xs text-gray-500">
                    {item.count} analiz
                  </div>
                </div>
                <span className="text-2xl text-gray-300">↓</span>
              </div>
            ))}
          </div>
        </div>

        {/* This Week's Interviews */}
        <div className="bg-white rounded-xl shadow-sm border-2 border-green-500 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            📊 Analysis Status
          </h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
              <span className="text-sm font-medium text-gray-900">⏳ Pending</span>
              <span className="text-2xl font-bold text-yellow-600">{stats?.analysisByStatus?.PENDING || 0}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <span className="text-sm font-medium text-gray-900">🔄 Processing</span>
              <span className="text-2xl font-bold text-blue-600">{stats?.analysisByStatus?.PROCESSING || 0}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <span className="text-sm font-medium text-gray-900">✅ Completed</span>
              <span className="text-2xl font-bold text-green-600">{stats?.analysisByStatus?.COMPLETED || 0}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
              <span className="text-sm font-medium text-gray-900">❌ Failed</span>
              <span className="text-2xl font-bold text-red-600">{stats?.analysisByStatus?.FAILED || 0}</span>
            </div>
          </div>
          <button
            onClick={() => router.push('/analyses')}
            className="w-full mt-4 text-sm text-green-600 font-medium hover:text-green-700 transition-colors"
          >
            Tüm Analizleri Gör →
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm border-2 border-green-500 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Son Analizler
        </h2>
        <div className="space-y-3">
          {stats?.recentAnalyses && stats.recentAnalyses.length > 0 ? (
            stats.recentAnalyses.slice(0, 3).map((analysis: any) => (
              <div
                key={analysis.id}
                onClick={() => router.push(`/analyses/${analysis.id}`)}
                className="flex items-start gap-3 p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors cursor-pointer"
              >
                <span className="text-2xl">📊</span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {analysis.jobPostingTitle}
                  </p>
                  <p className="text-xs text-gray-500">
                    {analysis.department} • {analysis.candidateCount} candidates
                  </p>
                </div>
                <button className="text-sm text-green-600 font-medium hover:text-green-700 transition-colors">
                  View →
                </button>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500 text-center py-4">No recent analyses</p>
          )}
        </div>
      </div>
    </div>
  )
}
