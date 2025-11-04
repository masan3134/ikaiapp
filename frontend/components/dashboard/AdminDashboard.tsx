'use client'

import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/store/authStore'
import { ROLE_COLORS } from '@/lib/constants/roleColors'
import { StatCards } from './StatCards'

export const AdminDashboard = () => {
  const router = useRouter()
  const { user } = useAuthStore()
  const roleColor = ROLE_COLORS.ADMIN.primary

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            👋 Good morning, {user?.name || 'Admin'}!
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
            🚀 Upgrade to PRO
          </button>
        )}
      </div>

      {/* Stat Cards */}
      <StatCards stats={{
        activeJobs: 8,
        totalCandidates: 47,
        thisMonthAnalyses: 12,
        usagePercent: 120 // Over limit!
      }} />

      {/* Candidate Pipeline */}
      <div className="bg-white rounded-xl shadow-sm border-2 p-6" style={{ borderColor: roleColor }}>
        <h2 className="text-lg font-semibold text-gray-900 mb-6">
          Candidate Pipeline
        </h2>
        <div className="flex items-center justify-between gap-2 overflow-x-auto">
          {[
            { label: 'New', count: 12, color: '#6B7280' },
            { label: 'Screening', count: 8, color: '#3B82F6' },
            { label: 'Interview', count: 5, color: '#F59E0B' },
            { label: 'Offer', count: 2, color: '#10B981' },
            { label: 'Hired', count: 1, color: '#A855F7' }
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
      </div>

      {/* Two Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Activity */}
        <div className="bg-white rounded-xl shadow-sm border-2 p-6" style={{ borderColor: roleColor }}>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Today's Activity
          </h2>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
              <span className="text-2xl">🆕</span>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  John Doe applied for Frontend Developer
                </p>
                <p className="text-xs text-gray-500">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
              <span className="text-2xl">📅</span>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  Interview scheduled: Jane Smith
                </p>
                <p className="text-xs text-gray-500">Today at 14:00</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
              <span className="text-2xl">💼</span>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  Offer sent to Mike Johnson
                </p>
                <p className="text-xs text-gray-500">Waiting response</p>
              </div>
            </div>
          </div>
          <button className="w-full mt-4 text-sm text-purple-600 font-medium hover:text-purple-700 transition-colors">
            View All Activity →
          </button>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border-2 p-6" style={{ borderColor: roleColor }}>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Quick Actions
          </h2>
          <div className="space-y-3">
            <button
              onClick={() => router.push('/job-postings/new')}
              className="w-full flex items-center gap-3 p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg hover:shadow-md transition-all hover:scale-102"
            >
              <span className="text-2xl">📄</span>
              <span className="text-sm font-medium text-gray-900">
                Create Job Posting
              </span>
            </button>
            <button
              onClick={() => router.push('/wizard')}
              className="w-full flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg hover:shadow-md transition-all hover:scale-102"
            >
              <span className="text-2xl">📤</span>
              <span className="text-sm font-medium text-gray-900">
                Upload CV
              </span>
            </button>
            <button
              onClick={() => router.push('/interviews/new')}
              className="w-full flex items-center gap-3 p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg hover:shadow-md transition-all hover:scale-102"
            >
              <span className="text-2xl">📅</span>
              <span className="text-sm font-medium text-gray-900">
                Schedule Interview
              </span>
            </button>
            <button
              onClick={() => router.push('/team')}
              className="w-full flex items-center gap-3 p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg hover:shadow-md transition-all hover:scale-102"
            >
              <span className="text-2xl">👥</span>
              <span className="text-sm font-medium text-gray-900">
                Invite Team Member
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
