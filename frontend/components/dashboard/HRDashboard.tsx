'use client'

import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/store/authStore'
import { ROLE_COLORS } from '@/lib/constants/roleColors'

export const HRDashboard = () => {
  const router = useRouter()
  const { user } = useAuthStore()
  const roleColor = ROLE_COLORS.HR_SPECIALIST.primary

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          👋 Welcome back, {user?.name || 'HR Specialist'}!
        </h1>
        <p className="text-sm text-gray-500">
          HR Specialist • {user?.organization?.name || 'Your Organization'}
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
          Upload CV (Drag & Drop)
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          Drag your CV file here or click to browse
        </p>
        <button className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-700 text-white rounded-lg font-medium hover:shadow-lg transition-all hover:scale-105">
          Browse Files
        </button>
        <p className="text-xs text-gray-400 mt-3">
          Supports: PDF, DOCX, TXT (max 10MB)
        </p>
      </div>

      {/* Two Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Candidate Pipeline */}
        <div className="bg-white rounded-xl shadow-sm border-2 border-green-500 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Candidate Pipeline
          </h2>
          <div className="space-y-4">
            {[
              { stage: 'New', count: 12, color: '#6B7280' },
              { stage: 'Screening', count: 8, color: '#3B82F6' },
              { stage: 'Interview', count: 5, color: '#F59E0B' },
              { stage: 'Offer', count: 2, color: '#10B981' },
              { stage: 'Hired', count: 1, color: '#A855F7' }
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
                    {item.count} candidates
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
            📅 This Week's Interviews
          </h2>
          <div className="space-y-4">
            <div>
              <div className="text-xs text-gray-500 mb-2">Monday</div>
              <div className="p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                <p className="text-sm font-medium text-gray-900">
                  John Doe
                </p>
                <p className="text-xs text-gray-500">
                  Frontend Developer • 14:00
                </p>
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-2">Wednesday</div>
              <div className="p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                <p className="text-sm font-medium text-gray-900">
                  Jane Smith
                </p>
                <p className="text-xs text-gray-500">
                  Backend Developer • 10:00
                </p>
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-2">Friday</div>
              <div className="p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                <p className="text-sm font-medium text-gray-900">
                  Mike Johnson
                </p>
                <p className="text-xs text-gray-500">
                  QA Engineer • 11:00
                </p>
              </div>
            </div>
          </div>
          <button
            onClick={() => router.push('/interviews')}
            className="w-full mt-4 text-sm text-green-600 font-medium hover:text-green-700 transition-colors"
          >
            View Calendar →
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm border-2 border-green-500 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Recent Activity
        </h2>
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
            <span className="text-2xl">🆕</span>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">
                AHMET YILMAZ - 95% match
              </p>
              <p className="text-xs text-gray-500">2 hours ago</p>
            </div>
            <button
              onClick={() => router.push('/candidates')}
              className="text-sm text-green-600 font-medium hover:text-green-700 transition-colors"
            >
              View →
            </button>
          </div>
          <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
            <span className="text-2xl">📊</span>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">
                Analysis completed: 5 CVs
              </p>
              <p className="text-xs text-gray-500">5 hours ago</p>
            </div>
            <button
              onClick={() => router.push('/analyses')}
              className="text-sm text-blue-600 font-medium hover:text-blue-700 transition-colors"
            >
              Review →
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
