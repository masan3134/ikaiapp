'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/store/authStore'
import {
  canCreateJobPosting,
  canCreateCandidate,
  canScheduleInterview,
  canCreateOffer
} from '@/lib/utils/rbac'
import { ROLE_COLORS } from '@/lib/constants/roleColors'

export const FloatingActionButton = () => {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const { user } = useAuthStore()
  const roleColor = ROLE_COLORS[user?.role as keyof typeof ROLE_COLORS]?.primary || '#3B82F6'

  const actions = [
    {
      label: 'İş İlanı Oluştur',
      icon: '📄',
      href: '/job-postings/new',
      show: canCreateJobPosting(user?.role)
    },
    {
      label: 'CV Yükle',
      icon: '📤',
      href: '/wizard',
      show: canCreateCandidate(user?.role)
    },
    {
      label: 'Aday Ekle',
      icon: '👥',
      href: '/candidates/new',
      show: canCreateCandidate(user?.role)
    },
    {
      label: 'Mülakat Planla',
      icon: '📅',
      href: '/interviews/new',
      show: canScheduleInterview(user?.role)
    },
    {
      label: 'Teklif Oluştur',
      icon: '💼',
      href: '/offers/new',
      show: canCreateOffer(user?.role)
    }
  ]

  const visibleActions = actions.filter(a => a.show)

  if (visibleActions.length === 0) {
    return null // USER role - no actions
  }

  const handleActionClick = (href: string) => {
    router.push(href)
    setIsOpen(false)
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Action Menu */}
      {isOpen && (
        <div
          className="absolute bottom-20 right-0 bg-white rounded-xl shadow-2xl border-2 p-2 min-w-[220px] animate-fade-in"
          style={{ borderColor: roleColor }}
        >
          {visibleActions.map((action) => (
            <button
              key={action.href}
              onClick={() => handleActionClick(action.href)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50 transition-all text-left"
            >
              <span className="text-2xl">{action.icon}</span>
              <span className="text-sm font-medium text-gray-900">
                {action.label}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Main FAB Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 rounded-full text-white text-3xl shadow-2xl hover:scale-110 active:scale-95 transition-all"
        style={{
          background: `linear-gradient(135deg, ${roleColor}, ${roleColor}dd)`
        }}
        title={isOpen ? 'Kapat' : 'Hızlı İşlemler'}
      >
        {isOpen ? '✕' : '+'}
      </button>
    </div>
  )
}
