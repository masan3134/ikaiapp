'use client';

import { getInitials } from '@/lib/utils/stringUtils';

export interface CandidateAvatarProps {
  firstName: string;
  lastName: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export default function CandidateAvatar({
  firstName,
  lastName,
  size = 'md'
}: CandidateAvatarProps) {
  const initials = getInitials(firstName, lastName);

  const sizeClasses = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-12 w-12 text-base',
    xl: 'h-16 w-16 text-xl'
  };

  // Generate consistent color from initials
  const colors = [
    'bg-blue-100 text-blue-600',
    'bg-green-100 text-green-600',
    'bg-purple-100 text-purple-600',
    'bg-pink-100 text-pink-600',
    'bg-indigo-100 text-indigo-600',
    'bg-yellow-100 text-yellow-600',
    'bg-red-100 text-red-600',
    'bg-cyan-100 text-cyan-600'
  ];

  const colorIndex = initials.charCodeAt(0) % colors.length;
  const colorClass = colors[colorIndex];

  return (
    <div
      className={`${sizeClasses[size]} ${colorClass} rounded-full flex items-center justify-center font-semibold flex-shrink-0`}
    >
      {initials}
    </div>
  );
}
