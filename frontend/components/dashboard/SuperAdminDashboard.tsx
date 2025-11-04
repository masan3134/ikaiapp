'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { DashboardCard } from './DashboardCard'

export const SuperAdminDashboard = () => {
  const router = useRouter()
  const [selectedOrg, setSelectedOrg] = useState('all')

  return (
    <div className="space-y-6">
      {/* Header with Org Switcher */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            🔴 SUPER ADMIN CONTROL CENTER
          </h1>
          <p className="text-sm text-gray-500">System-wide overview</p>
        </div>

        {/* Organization Switcher */}
        <select
          value={selectedOrg}
          onChange={(e) => setSelectedOrg(e.target.value)}
          className="px-4 py-2 border-2 border-red-500 rounded-lg bg-white text-gray-900 font-medium hover:bg-red-50 transition-colors"
        >
          <option value="all">🌐 All Organizations</option>
          <option value="org1">Test Org Free</option>
          <option value="org2">Test Org Pro</option>
          <option value="org3">Test Org Enterprise</option>
        </select>
      </div>

      {/* System Health */}
      <div className="bg-white rounded-xl shadow-sm border-2 border-red-500 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          System Health
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl mb-1">✅</div>
            <div className="text-sm font-medium text-gray-900">API</div>
            <div className="text-xs text-gray-500">180ms avg</div>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-1">✅</div>
            <div className="text-sm font-medium text-gray-900">Queue</div>
            <div className="text-xs text-gray-500">3ms avg</div>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-1">✅</div>
            <div className="text-sm font-medium text-gray-900">Database</div>
            <div className="text-xs text-gray-500">78GB / 200GB</div>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-1">✅</div>
            <div className="text-sm font-medium text-gray-900">Error Rate</div>
            <div className="text-xs text-gray-500">0.02%</div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard
          title="Total Organizations"
          value={150}
          icon={<span className="text-2xl">🏢</span>}
          color="#EF4444"
          gradient="linear-gradient(135deg, #EF4444, #991B1B)"
        />
        <DashboardCard
          title="Total Users"
          value="2,340"
          icon={<span className="text-2xl">👥</span>}
          color="#EF4444"
          trend={{ value: 8, isPositive: true }}
        />
        <DashboardCard
          title="Total Job Postings"
          value={892}
          icon={<span className="text-2xl">📄</span>}
          color="#EF4444"
        />
        <DashboardCard
          title="Active Analyses"
          value={45}
          subtitle="Processing now"
          icon={<span className="text-2xl">⚙️</span>}
          color="#EF4444"
        />
      </div>

      {/* Organizations by Plan */}
      <div className="bg-white rounded-xl shadow-sm border-2 border-red-500 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Organizations by Plan
        </h2>
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>FREE Plan</span>
              <span className="font-medium">80 orgs (53%)</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gray-500 h-2 rounded-full transition-all duration-500"
                style={{ width: '53%' }}
              ></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>PRO Plan</span>
              <span className="font-medium">50 orgs (33%)</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                style={{ width: '33%' }}
              ></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>ENTERPRISE Plan</span>
              <span className="font-medium">20 orgs (13%)</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-purple-500 h-2 rounded-full transition-all duration-500"
                style={{ width: '13%' }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Events */}
      <div className="bg-white rounded-xl shadow-sm border-2 border-red-500 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Recent System Events
        </h2>
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <span className="text-2xl">🆕</span>
            <div>
              <p className="text-sm font-medium text-gray-900">
                New organization: XYZ Consulting
              </p>
              <p className="text-xs text-gray-500">2 hours ago</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">
            <span className="text-2xl">⚠️</span>
            <div>
              <p className="text-sm font-medium text-gray-900">
                TechStart: Limit exceeded (12/10 analyses)
              </p>
              <p className="text-xs text-gray-500">5 hours ago</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
            <span className="text-2xl">✅</span>
            <div>
              <p className="text-sm font-medium text-gray-900">
                MediCare Analytics upgraded to PRO
              </p>
              <p className="text-xs text-gray-500">1 day ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
