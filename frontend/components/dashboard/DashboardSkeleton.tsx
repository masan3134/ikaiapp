"use client";

export function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-slate-50 p-6 animate-pulse">
      {/* Welcome Header Skeleton */}
      <div className="bg-slate-200 rounded-xl h-24 mb-6" />

      {/* Top 3 Widgets Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-slate-200 rounded-xl h-40" />
        ))}
      </div>

      {/* Middle Section Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 bg-slate-200 rounded-xl h-64" />
        <div className="bg-slate-200 rounded-xl h-64" />
      </div>

      {/* Bottom Section Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-200 rounded-xl h-56" />
        <div className="bg-slate-200 rounded-xl h-56" />
      </div>
    </div>
  );
}

export default DashboardSkeleton;
