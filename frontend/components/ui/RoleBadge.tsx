import { UserRole } from '@/lib/constants/roles'
import { ROLE_COLORS } from '@/lib/constants/roleColors'

interface RoleBadgeProps {
  role?: UserRole
  size?: 'sm' | 'md' | 'lg'
}

export const RoleBadge: React.FC<RoleBadgeProps> = ({ role, size = 'md' }) => {
  if (!role) return null

  const colors = ROLE_COLORS[role as keyof typeof ROLE_COLORS]
  if (!colors) return null

  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2'
  }

  const roleLabels: Record<string, string> = {
    SUPER_ADMIN: 'Super Admin',
    ADMIN: 'Admin',
    MANAGER: 'Manager',
    HR_SPECIALIST: 'HR Specialist',
    USER: 'User'
  }

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 rounded-full font-medium
        ${sizeClasses[size]}
        transition-all duration-300 hover:scale-105
      `}
      style={{
        backgroundColor: colors.light,
        color: colors.dark,
        border: `2px solid ${colors.primary}`
      }}
    >
      <span>{colors.emoji}</span>
      <span>{roleLabels[role] || role}</span>
    </span>
  )
}
