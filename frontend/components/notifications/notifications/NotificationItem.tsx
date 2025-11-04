"use client";

import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import {
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  UserPlusIcon,
  DocumentTextIcon,
  CalendarIcon,
  ExclamationTriangleIcon,
  BellAlertIcon,
} from "@heroicons/react/24/outline";
import type { Notification } from "@/lib/api/notifications";

/**
 * NotificationItem Component
 *
 * Features:
 * - Icon based on notification type
 * - Title + message
 * - Time ago (e.g., "5 dakika önce")
 * - Read/unread styling
 * - Click to mark as read
 *
 * Created by: Worker #2
 * Date: 2025-11-04
 */

interface NotificationItemProps {
  notification: Notification;
  onClick?: (notificationId: string) => void;
  compact?: boolean; // For dropdown vs full page
}

export default function NotificationItem({
  notification,
  onClick,
  compact = false,
}: NotificationItemProps) {
  const { id, type, title, message, read, createdAt, user, organization } =
    notification;

  // Icon mapping
  const iconMap: Record<string, any> = {
    ANALYSIS_STARTED: ClockIcon,
    ANALYSIS_COMPLETED: CheckCircleIcon,
    ANALYSIS_FAILED: XCircleIcon,
    CANDIDATE_UPLOADED: UserPlusIcon,
    OFFER_CREATED: DocumentTextIcon,
    OFFER_SENT: DocumentTextIcon,
    OFFER_ACCEPTED: CheckCircleIcon,
    OFFER_REJECTED: XCircleIcon,
    OFFER_EXPIRED: ExclamationTriangleIcon,
    INTERVIEW_SCHEDULED: CalendarIcon,
    INTERVIEW_COMPLETED: CheckCircleIcon,
    INTERVIEW_CANCELLED: XCircleIcon,
    USER_INVITED: UserPlusIcon,
    USAGE_LIMIT_WARNING: ExclamationTriangleIcon,
    USAGE_LIMIT_REACHED: BellAlertIcon,
  };

  // Color mapping
  const colorMap: Record<string, string> = {
    ANALYSIS_COMPLETED: "text-green-600 bg-green-50",
    OFFER_ACCEPTED: "text-green-600 bg-green-50",
    INTERVIEW_COMPLETED: "text-green-600 bg-green-50",

    ANALYSIS_FAILED: "text-red-600 bg-red-50",
    OFFER_REJECTED: "text-red-600 bg-red-50",
    INTERVIEW_CANCELLED: "text-red-600 bg-red-50",

    ANALYSIS_STARTED: "text-blue-600 bg-blue-50",
    OFFER_CREATED: "text-blue-600 bg-blue-50",
    INTERVIEW_SCHEDULED: "text-blue-600 bg-blue-50",
    CANDIDATE_UPLOADED: "text-blue-600 bg-blue-50",

    USAGE_LIMIT_WARNING: "text-yellow-600 bg-yellow-50",
    USAGE_LIMIT_REACHED: "text-red-600 bg-red-50",
    OFFER_EXPIRED: "text-gray-600 bg-gray-50",

    USER_INVITED: "text-indigo-600 bg-indigo-50",
    OFFER_SENT: "text-indigo-600 bg-indigo-50",
  };

  const IconComponent = iconMap[type] || BellAlertIcon;
  const iconColorClass = colorMap[type] || "text-gray-600 bg-gray-50";

  const timeAgo = formatDistanceToNow(new Date(createdAt), {
    addSuffix: true,
    locale: tr,
  });

  const handleClick = () => {
    if (onClick && !read) {
      onClick(id);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`
        relative p-4 border-b border-gray-200 dark:border-gray-700
        transition-colors
        ${!read ? "bg-blue-50 dark:bg-blue-900/10" : "bg-white dark:bg-gray-800"}
        ${onClick && !read ? "cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/20" : ""}
        ${compact ? "p-3" : "p-4"}
      `}
    >
      <div className="flex gap-3">
        {/* Icon */}
        <div
          className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${iconColorClass}`}
        >
          <IconComponent className="h-5 w-5" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Title */}
          <p
            className={`text-sm font-medium ${!read ? "text-gray-900 dark:text-white" : "text-gray-700 dark:text-gray-300"}`}
          >
            {title}
          </p>

          {/* Message */}
          <p
            className={`mt-1 text-sm ${!read ? "text-gray-700 dark:text-gray-300" : "text-gray-500 dark:text-gray-400"} ${compact ? "line-clamp-1" : "line-clamp-2"}`}
          >
            {message}
          </p>

          {/* Metadata */}
          <div className="mt-2 flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
            <span>{timeAgo}</span>

            {!compact && organization && (
              <span className="flex items-center gap-1">
                <span className="w-1 h-1 bg-gray-400 rounded-full" />
                {organization.name}
              </span>
            )}

            {!compact && user && (
              <span className="flex items-center gap-1">
                <span className="w-1 h-1 bg-gray-400 rounded-full" />
                {user.email}
              </span>
            )}
          </div>
        </div>

        {/* Unread indicator */}
        {!read && (
          <div className="flex-shrink-0">
            <span className="w-2 h-2 bg-blue-600 rounded-full inline-block" />
          </div>
        )}
      </div>
    </div>
  );
}
