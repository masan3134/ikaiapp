"use client";

export interface BadgeProps {
  variant: "success" | "warning" | "error" | "info" | "neutral";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

export default function Badge({
  variant,
  size = "md",
  children,
  icon,
  className = "",
}: BadgeProps) {
  const variantClasses = {
    success: "bg-green-100 text-green-800 border-green-200",
    warning: "bg-yellow-100 text-yellow-800 border-yellow-200",
    error: "bg-red-100 text-red-800 border-red-200",
    info: "bg-blue-100 text-blue-800 border-blue-200",
    neutral: "bg-gray-100 text-gray-800 border-gray-200",
  };

  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs gap-1",
    md: "px-2.5 py-0.5 text-sm gap-1.5",
    lg: "px-3 py-1 text-base gap-2",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium border ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </span>
  );
}
