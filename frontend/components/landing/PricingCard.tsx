import Link from 'next/link';

interface PricingCardProps {
  plan: string;
  price: string;
  period?: string;
  features: string[];
  highlighted?: boolean;
  ctaText: string;
  ctaLink: string;
}

export default function PricingCard({
  plan,
  price,
  period,
  features,
  highlighted = false,
  ctaText,
  ctaLink,
}: PricingCardProps) {
  return (
    <div
      className={`bg-white rounded-xl p-8 ${
        highlighted
          ? 'border-2 border-indigo-600 shadow-xl scale-105'
          : 'border border-gray-200 shadow-lg'
      } hover:shadow-2xl transition-all duration-300`}
    >
      {highlighted && (
        <div className="bg-indigo-600 text-white text-xs font-semibold py-1 px-3 rounded-full inline-block mb-4">
          POPÜLER
        </div>
      )}
      <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan}</h3>
      <div className="mb-6">
        <span className="text-4xl font-bold text-gray-900">{price}</span>
        {period && <span className="text-gray-600 ml-2">{period}</span>}
      </div>
      <ul className="space-y-3 mb-8">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <svg
              className="w-5 h-5 text-indigo-600 mr-2 mt-0.5 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span className="text-sm text-gray-600">{feature}</span>
          </li>
        ))}
      </ul>
      <Link
        href={ctaLink}
        className={`block text-center py-3 px-6 rounded-lg font-medium transition-colors ${
          highlighted
            ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
            : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
        }`}
      >
        {ctaText}
      </Link>
    </div>
  );
}
