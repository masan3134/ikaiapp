'use client'

import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/store/authStore'

export const UserDashboard = () => {
  const router = useRouter()
  const { user } = useAuthStore()

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Greeting */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          👋 Hi {user?.name || 'there'}!
        </h1>
        <p className="text-gray-500">
          Welcome to your dashboard
        </p>
      </div>

      {/* Your Profile */}
      <div className="bg-white rounded-xl shadow-sm border-2 border-gray-300 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Your Profile
        </h2>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📧</span>
            <span className="text-sm text-gray-700">{user?.email || 'email@example.com'}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-2xl">🏢</span>
            <span className="text-sm text-gray-700">
              {user?.organization?.name || 'Your Organization'}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-2xl">👤</span>
            <span className="text-sm text-gray-700">
              {user?.role?.replace('_', ' ') || 'User'}
            </span>
          </div>
        </div>
        <button
          onClick={() => router.push('/settings/profile')}
          className="w-full mt-6 px-4 py-2 bg-gray-100 text-gray-900 rounded-lg font-medium hover:bg-gray-200 transition-all"
        >
          Edit Profile →
        </button>
      </div>

      {/* Company Snapshot */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border-2 border-gray-300 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Company Snapshot
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900 mb-1">8</div>
            <div className="text-sm text-gray-600">Active Job Postings</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900 mb-1">4</div>
            <div className="text-sm text-gray-600">Team Members</div>
          </div>
        </div>
      </div>

      {/* Need More Access? */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border-2 border-blue-300 p-6 text-center">
        <div className="text-4xl mb-3">💡</div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Need More Access?
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Want to access HR features? Contact your admin to upgrade your role.
        </p>
        <button
          onClick={() => router.push('/settings/overview')}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all hover:scale-105"
        >
          Request Access
        </button>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm border-2 border-gray-300 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Recent Activity
        </h2>
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <span>✏️</span>
            <span>Profile updated</span>
            <span className="ml-auto text-xs">2 days ago</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <span>🔒</span>
            <span>Password changed</span>
            <span className="ml-auto text-xs">1 week ago</span>
          </div>
        </div>
      </div>
    </div>
  )
}
