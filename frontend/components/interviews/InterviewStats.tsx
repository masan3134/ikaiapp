'use client';

import { Calendar, Clock, CheckCircle, XCircle } from 'lucide-react';

interface StatsProps {
  total: number;
  scheduled: number;
  completed: number;
  cancelled: number;
}

export default function InterviewStats({ total, scheduled, completed, cancelled }: StatsProps) {
  const stats = [
    { label: 'Toplam', value: total, icon: Calendar, color: 'blue' },
    { label: 'Planlanmış', value: scheduled, icon: Clock, color: 'yellow' },
    { label: 'Tamamlanan', value: completed, icon: CheckCircle, color: 'green' },
    { label: 'İptal Edilen', value: cancelled, icon: XCircle, color: 'red' }
  ];

  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    yellow: 'bg-yellow-100 text-yellow-600',
    green: 'bg-green-100 text-green-600',
    red: 'bg-red-100 text-red-600'
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {stats.map((stat) => {
        const Icon = stat.icon;
        const colorClass = colorClasses[stat.color as keyof typeof colorClasses];
        
        return (
          <div key={stat.label} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 ${colorClass} rounded-lg flex items-center justify-center`}>
                <Icon size={24} />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
            <p className="text-sm text-gray-600">{stat.label}</p>
          </div>
        );
      })}
    </div>
  );
}
