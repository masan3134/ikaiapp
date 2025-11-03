'use client';

export interface CardProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  hover?: boolean;
  onClick?: () => void;
  className?: string;
}

export function Card({
  title,
  subtitle,
  children,
  actions,
  hover = false,
  onClick,
  className = ''
}: CardProps) {
  const hoverClasses = hover
    ? 'hover:shadow-md hover:scale-[1.02] cursor-pointer'
    : '';

  return (
    <div
      className={`bg-white rounded-lg shadow-sm border border-gray-200 transition-all duration-200 ${hoverClasses} ${className}`}
      onClick={onClick}
    >
      {(title || subtitle || actions) && (
        <div className="flex items-start justify-between p-6 border-b border-gray-100">
          <div className="flex-1">
            {title && (
              <h3 className="text-lg font-semibold text-gray-900">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-sm text-gray-600 mt-1">
                {subtitle}
              </p>
            )}
          </div>
          {actions && (
            <div className="ml-4">
              {actions}
            </div>
          )}
        </div>
      )}

      <div className="p-6">
        {children}
      </div>
    </div>
  );
}

// Default export for backward compatibility
export default Card;
