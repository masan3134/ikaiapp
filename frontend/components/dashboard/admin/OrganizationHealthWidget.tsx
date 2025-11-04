'use client';

import { Heart } from 'lucide-react';
import { Card, CardHeader, CardBody } from '@nextui-org/react';

interface OrganizationHealthWidgetProps {
  data: {
    score: number;
    factors: Array<{
      name: string;
      score: number;
      status: 'good' | 'warning' | 'critical';
    }>;
  };
}

export default function OrganizationHealthWidget({ data }: OrganizationHealthWidgetProps) {
  const healthScore = data.score || 0;
  const healthFactors = data.factors.length > 0 ? data.factors : [
    { name: 'Kullanıcı Aktivitesi', score: 85, status: 'good' as const },
    { name: 'Güvenlik', score: 92, status: 'good' as const },
    { name: 'Kullanım Oranı', score: 78, status: 'good' as const },
    { name: 'Sistem Sağlığı', score: 95, status: 'good' as const }
  ];

  const getHealthLabel = (score: number) => {
    if (score >= 90) return 'Mükemmel';
    if (score >= 70) return 'İyi';
    if (score >= 50) return 'Orta';
    return 'Dikkat Gerekli';
  };

  const getHealthColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-blue-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good':
        return 'bg-green-500';
      case 'warning':
        return 'bg-yellow-500';
      case 'critical':
        return 'bg-red-500';
      default:
        return 'bg-slate-500';
    }
  };

  return (
    <Card className="bg-gradient-to-br from-purple-50 to-white shadow-sm">
      <CardHeader>
        <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
          <Heart className="w-5 h-5 text-purple-600" />
          Organizasyon Sağlığı
        </h3>
      </CardHeader>
      <CardBody>
        <div className="text-center mb-4">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full mb-3">
            <div className="text-center">
              <p className="text-3xl font-bold text-purple-600">{healthScore}</p>
              <p className="text-xs text-purple-700">Skor</p>
            </div>
          </div>
          <p className={`text-sm font-medium ${getHealthColor(healthScore)}`}>
            {getHealthLabel(healthScore)}
          </p>
        </div>

        <div className="space-y-3">
          {healthFactors.map((factor) => (
            <div key={factor.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${getStatusColor(factor.status)}`} />
                <span className="text-sm text-slate-700">{factor.name}</span>
              </div>
              <span className="text-xs text-slate-600">{factor.score}%</span>
            </div>
          ))}
        </div>

        <button className="w-full mt-4 bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg text-sm font-medium transition-colors">
          Detaylı Rapor
        </button>
      </CardBody>
    </Card>
  );
}
