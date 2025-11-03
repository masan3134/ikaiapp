'use client';

import { useEffect } from 'react';
import { BarChart3, FileText, Users, AlertTriangle, CheckCircle } from 'lucide-react';
import { useAsync } from '@/lib/hooks/useAsync';
import { getOrganizationUsage, UsageData } from '@/lib/services/organizationService';
import { Card } from './ui/Card';
import LoadingSkeleton from './ui/LoadingSkeleton';

interface ProgressBarProps {
  label: string;
  used: number;
  limit: number;
  percentage: number;
  icon: React.ReactNode;
}

function ProgressBar({ label, used, limit, percentage, icon }: ProgressBarProps) {
  // Determine color based on percentage
  const getColor = () => {
    if (percentage >= 100) return 'bg-red-600';
    if (percentage >= 80) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getBgColor = () => {
    if (percentage >= 100) return 'bg-red-50';
    if (percentage >= 80) return 'bg-yellow-50';
    return 'bg-green-50';
  };

  const getTextColor = () => {
    if (percentage >= 100) return 'text-red-700';
    if (percentage >= 80) return 'text-yellow-700';
    return 'text-green-700';
  };

  return (
    <div className={`p-4 rounded-lg ${getBgColor()}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className={getTextColor()}>{icon}</div>
          <span className="text-sm font-medium text-gray-700">{label}</span>
        </div>
        <span className={`text-sm font-semibold ${getTextColor()}`}>
          {used} / {limit}
        </span>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
        <div
          className={`h-2.5 rounded-full transition-all duration-300 ${getColor()}`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>

      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-600">
          {limit - used > 0 ? `${limit - used} kalan` : 'Limit doldu'}
        </span>
        <span className={`text-xs font-medium ${getTextColor()}`}>
          %{percentage}
        </span>
      </div>
    </div>
  );
}

export default function UsageWidget() {
  const { data: usage, loading, error, execute } = useAsync<UsageData>(getOrganizationUsage);

  useEffect(() => {
    execute().catch(err => {
      if (process.env.NODE_ENV === 'development') {
        console.error('Usage fetch error:', err);
      }
    });
  }, []);

  if (loading) {
    return (
      <Card title="Kullanım İstatistikleri" subtitle="Aylık kullanım limitleriniz">
        <LoadingSkeleton variant="grid" rows={1} columns={3} />
      </Card>
    );
  }

  if (error || !usage) {
    return (
      <Card title="Kullanım İstatistikleri" subtitle="Aylık kullanım limitleriniz">
        <div className="text-center py-8">
          <AlertTriangle className="mx-auto h-12 w-12 text-yellow-500 mb-4" />
          <p className="text-sm text-gray-600">Kullanım bilgileri yüklenemedi</p>
          <button
            onClick={() => execute()}
            className="mt-4 text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            Tekrar Dene
          </button>
        </div>
      </Card>
    );
  }

  const hasCriticalWarnings = usage.warnings.some(w => w.severity === 'critical');
  const hasWarnings = usage.warnings.length > 0;

  return (
    <Card
      title="Kullanım İstatistikleri"
      subtitle={`${usage.plan} Plan - Aylık kullanım limitleriniz`}
      actions={
        usage.plan === 'FREE' && hasWarnings ? (
          <a
            href="/settings/billing"
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            Planı Yükselt →
          </a>
        ) : null
      }
    >
      {/* Warnings */}
      {hasWarnings && (
        <div className="mb-4">
          {usage.warnings.map((warning, index) => (
            <div
              key={index}
              className={`flex items-start gap-3 p-3 rounded-lg mb-2 ${
                warning.severity === 'critical'
                  ? 'bg-red-50 border border-red-200'
                  : 'bg-yellow-50 border border-yellow-200'
              }`}
            >
              <AlertTriangle
                className={`flex-shrink-0 mt-0.5 ${
                  warning.severity === 'critical' ? 'text-red-600' : 'text-yellow-600'
                }`}
                size={18}
              />
              <div className="flex-1">
                <p
                  className={`text-sm font-medium ${
                    warning.severity === 'critical' ? 'text-red-800' : 'text-yellow-800'
                  }`}
                >
                  {warning.message}
                </p>
                {warning.severity === 'critical' && usage.plan === 'FREE' && (
                  <a
                    href="/settings/billing"
                    className="text-sm text-red-700 hover:text-red-900 font-medium underline mt-1 inline-block"
                  >
                    PRO plana geçin
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Usage Bars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <ProgressBar
          label="Aylık Analiz"
          used={usage.monthlyAnalysisCount}
          limit={usage.maxAnalysisPerMonth}
          percentage={usage.percentages.analysis}
          icon={<BarChart3 size={18} />}
        />
        <ProgressBar
          label="Aylık CV"
          used={usage.monthlyCvCount}
          limit={usage.maxCvPerMonth}
          percentage={usage.percentages.cv}
          icon={<FileText size={18} />}
        />
        <ProgressBar
          label="Kullanıcılar"
          used={usage.totalUsers}
          limit={usage.maxUsers}
          percentage={usage.percentages.user}
          icon={<Users size={18} />}
        />
      </div>

      {/* Plan Info */}
      {usage.plan === 'PRO' || usage.plan === 'ENTERPRISE' ? (
        <div className="mt-4 flex items-center gap-2 text-green-600 bg-green-50 rounded-lg p-3">
          <CheckCircle size={18} />
          <span className="text-sm font-medium">
            {usage.plan === 'PRO' ? 'PRO Plan aktif' : 'ENTERPRISE Plan aktif'} - Sınırsız kullanım
          </span>
        </div>
      ) : null}
    </Card>
  );
}
