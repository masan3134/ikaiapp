import { ReactNode } from 'react'

interface DashboardCardProps {
  title: string
  value?: string | number
  subtitle?: string
  icon?: ReactNode
  color?: string
  gradient?: string
  onClick?: () => void
  loading?: boolean
  trend?: {
    value: number
    isPositive: boolean
  }
}

export const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  color = '#3B82F6',
  gradient,
  onClick,
  loading,
  trend
}) => {
  return (
    <div
      className={`
        bg-white rounded-xl shadow-sm border-2 p-6
        transition-all duration-300
        hover:shadow-lg hover:-translate-y-1
        ${onClick ? 'cursor-pointer' : ''}
      `}
      style={{ borderColor: color }}
      onClick={onClick}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        {icon && (
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center text-white"
            style={{
              background: gradient || `linear-gradient(135deg, ${color}, ${color}dd)`
            }}
          >
            {icon}
          </div>
        )}
      </div>

      {/* Value */}
      {loading ? (
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-20 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-32"></div>
        </div>
      ) : (
        <>
          <div className="flex items-end gap-2 mb-2">
            <p className="text-3xl font-bold text-gray-900">{value}</p>
            {trend && (
              <span
                className={`text-sm font-medium mb-1 ${
                  trend.isPositive ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-sm text-gray-500">{subtitle}</p>
          )}
        </>
      )}
    </div>
  )
}
