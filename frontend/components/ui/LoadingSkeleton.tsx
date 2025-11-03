'use client';

export interface SkeletonProps {
  variant: 'table' | 'card' | 'grid' | 'text';
  rows?: number;
  columns?: number;
}

export default function LoadingSkeleton({
  variant,
  rows = 5,
  columns = 3
}: SkeletonProps) {
  if (variant === 'table') {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="animate-pulse">
          {/* Table Header */}
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
            <div className="flex gap-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-4 bg-gray-200 rounded flex-1" />
              ))}
            </div>
          </div>

          {/* Table Rows */}
          {Array.from({ length: rows }).map((_, rowIdx) => (
            <div key={rowIdx} className="px-6 py-4 border-b border-gray-200">
              <div className="flex gap-4 items-center">
                <div className="h-10 w-10 bg-gray-200 rounded-full flex-shrink-0" />
                {Array.from({ length: 4 }).map((_, colIdx) => (
                  <div key={colIdx} className="h-4 bg-gray-200 rounded flex-1" />
                ))}
                <div className="h-4 w-20 bg-gray-200 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-3/4" />
          <div className="h-4 bg-gray-200 rounded w-1/2" />
          <div className="space-y-2">
            <div className="h-3 bg-gray-200 rounded" />
            <div className="h-3 bg-gray-200 rounded w-5/6" />
            <div className="h-3 bg-gray-200 rounded w-4/6" />
          </div>
          <div className="flex gap-2 pt-4">
            <div className="h-8 w-20 bg-gray-200 rounded" />
            <div className="h-8 w-20 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'grid') {
    return (
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${columns} gap-6`}>
        {Array.from({ length: rows * columns }).map((_, idx) => (
          <div key={idx} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-6 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded" />
                <div className="h-3 bg-gray-200 rounded w-5/6" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'text') {
    return (
      <div className="animate-pulse space-y-3">
        {Array.from({ length: rows }).map((_, idx) => (
          <div key={idx} className="h-4 bg-gray-200 rounded w-full" />
        ))}
      </div>
    );
  }

  return null;
}
