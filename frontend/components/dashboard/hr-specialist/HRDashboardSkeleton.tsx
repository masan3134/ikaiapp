"use client";

export function HRDashboardSkeleton() {
  return (
    <div className="min-h-screen bg-slate-50 p-6 animate-pulse">
      {/* Welcome Header Skeleton */}
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-800 rounded-xl p-6 mb-6">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="h-8 bg-emerald-500 rounded w-48 mb-3"></div>
            <div className="h-5 bg-emerald-500 rounded w-64 mb-4"></div>
            <div className="flex gap-6">
              <div className="h-4 bg-emerald-500 rounded w-24"></div>
              <div className="h-4 bg-emerald-500 rounded w-24"></div>
              <div className="h-4 bg-emerald-500 rounded w-32"></div>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="w-10 h-10 bg-emerald-500 rounded-lg"></div>
            <div className="w-32 h-10 bg-white rounded-lg"></div>
          </div>
        </div>
      </div>

      {/* Top Row: 3 Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl"></div>
              <div className="h-6 bg-slate-200 rounded w-16"></div>
            </div>
            <div className="h-8 bg-slate-200 rounded w-16 mb-2"></div>
            <div className="h-4 bg-slate-200 rounded w-32 mb-4"></div>
            <div className="h-4 bg-slate-200 rounded w-40"></div>
          </div>
        ))}
      </div>

      {/* Middle Row: Pipeline + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
          <div className="h-6 bg-slate-200 rounded w-48 mb-6"></div>
          <div className="h-64 bg-slate-100 rounded"></div>
          <div className="grid grid-cols-4 gap-2 mt-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-16 bg-emerald-50 rounded-lg"></div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="h-6 bg-slate-200 rounded w-32 mb-4"></div>
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-16 bg-slate-100 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row: 3 Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm p-6">
            <div className="h-6 bg-slate-200 rounded w-40 mb-4"></div>
            <div className="space-y-3">
              {[1, 2, 3].map((j) => (
                <div key={j} className="h-20 bg-slate-100 rounded-lg"></div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
