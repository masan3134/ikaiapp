'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Users, Briefcase, FileText, BarChart3, Clock, CheckCircle, XCircle } from 'lucide-react';
import { BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { useAsync } from '@/lib/hooks/useAsync';
import { useToast } from '@/lib/hooks/useToast';
import { getDashboardStats } from '@/lib/services/dashboardService';
import { useAuthStore } from '@/lib/store/authStore';
import { parseApiError } from '@/lib/utils/errorHandler';
import LoadingSkeleton from '@/components/ui/LoadingSkeleton';
import UsageWidget from '@/components/UsageWidget';

export default function DashboardPage() {
  const router = useRouter();
  const toast = useToast();
  const { user } = useAuthStore();
  const { data: stats, loading, error, execute } = useAsync(getDashboardStats);

  useEffect(() => {
    execute().catch(err => {
      if (process.env.NODE_ENV === 'development') {
        console.error('Dashboard stats error:', err);
      }
      toast.error(parseApiError(err));
    });
  }, []);

  // Check if user has required role
  const hasAccess = user?.role === 'ADMIN' || user?.role === 'MANAGER' || user?.role === 'SUPER_ADMIN';

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle size={32} className="text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Erişim Engellendi</h2>
          <p className="text-gray-600 mb-6">
            Dashboard'a erişmek için ADMIN veya MANAGER yetkisine sahip olmanız gerekiyor.
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Mevcut rolünüz: <span className="font-semibold">{user?.role}</span>
          </p>
          <button
            onClick={() => router.push('/job-postings')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            İş İlanlarına Git
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">Sistem genel bakış ve istatistikler</p>
          </div>
          <LoadingSkeleton variant="grid" rows={2} columns={4} />
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle size={32} className="text-yellow-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Veri Yüklenemedi</h2>
          <p className="text-gray-600 mb-6">{error?.message || 'Dashboard verileri yüklenirken bir hata oluştu'}</p>
          <button
            onClick={() => execute()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Tekrar Dene
          </button>
        </div>
      </div>
    );
  }

  const { overview, analysisByStatus, recentAnalyses, userRole } = stats;
  const isAdmin = userRole === 'ADMIN';

  // Prepare chart data
  const statusChartData = [
    { name: 'Tamamlandı', value: analysisByStatus.COMPLETED, color: '#10B981' },
    { name: 'İşleniyor', value: analysisByStatus.PROCESSING, color: '#3B82F6' },
    { name: 'Bekliyor', value: analysisByStatus.PENDING, color: '#F59E0B' },
    { name: 'Başarısız', value: analysisByStatus.FAILED, color: '#EF4444' },
  ].filter(item => item.value > 0);

  const barChartData = [
    { name: 'Tamamlandı', count: analysisByStatus.COMPLETED },
    { name: 'İşleniyor', count: analysisByStatus.PROCESSING },
    { name: 'Bekliyor', count: analysisByStatus.PENDING },
    { name: 'Başarısız', count: analysisByStatus.FAILED },
  ];

  return (
    <>
      <toast.Toaster position="top-right" />

      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">
              Sistem genel bakış ve istatistikler
              {isAdmin && <span className="ml-2 text-sm text-purple-600 font-medium">(Admin Görünümü)</span>}
            </p>
          </div>

          {/* Usage Widget */}
          <div className="mb-8">
            <UsageWidget />
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {isAdmin && overview.totalUsers !== null && (
              <StatCard
                title="Toplam Kullanıcı"
                value={overview.totalUsers}
                icon={<Users />}
                color="purple"
              />
            )}
            <StatCard
              title={isAdmin ? "Toplam Aday" : "Adaylarım"}
              value={isAdmin ? overview.totalCandidates : overview.userCandidates}
              icon={<FileText />}
              color="blue"
            />
            <StatCard
              title={isAdmin ? "Toplam İlan" : "İlanlarım"}
              value={isAdmin ? overview.totalJobPostings : overview.userJobPostings}
              icon={<Briefcase />}
              color="green"
            />
            <StatCard
              title={isAdmin ? "Toplam Analiz" : "Analizlerim"}
              value={isAdmin ? overview.totalAnalyses : overview.userAnalyses}
              icon={<BarChart3 />}
              color="orange"
            />
          </div>

          {/* Charts Section */}
          {overview.totalAnalyses > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Bar Chart */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Analiz Durumları</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={barChartData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#3B82F6" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Pie Chart */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Analiz Dağılımı</h2>
                {statusChartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={statusChartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {statusChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-gray-500">
                    Henüz analiz verisi yok
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Recent Analyses */}
          {recentAnalyses.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Son Analizler</h2>
              <div className="space-y-3">
                {recentAnalyses.map((analysis) => (
                  <div
                    key={analysis.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                    onClick={() => router.push(`/analyses/${analysis.id}`)}
                  >
                    <div className="flex items-center gap-4">
                      <StatusIcon status={analysis.status} />
                      <div>
                        <p className="font-medium text-gray-900">{analysis.jobPostingTitle}</p>
                        <p className="text-sm text-gray-500">
                          {analysis.department} • {analysis.candidateCount} aday
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">
                        {new Date(analysis.createdAt).toLocaleDateString('tr-TR')}
                      </p>
                      <StatusBadge status={analysis.status} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {overview.totalAnalyses === 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <BarChart3 size={64} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Henüz Analiz Yok</h3>
              <p className="text-gray-600 mb-6">
                İlk analizinizi oluşturmak için Analiz Sihirbazı'nı kullanın
              </p>
              <button
                onClick={() => router.push('/wizard')}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Analiz Oluştur
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// Stat Card Component
function StatCard({ title, value, icon, color }: {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: 'purple' | 'blue' | 'green' | 'orange';
}) {
  const colorClasses = {
    purple: 'bg-purple-100 text-purple-600',
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    orange: 'bg-orange-100 text-orange-600',
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-lg ${colorClasses[color]} flex items-center justify-center`}>
          {icon}
        </div>
      </div>
      <p className="text-sm text-gray-600 mb-1">{title}</p>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
    </div>
  );
}

// Status Icon Component
function StatusIcon({ status }: { status: string }) {
  const icons = {
    COMPLETED: <CheckCircle size={24} className="text-green-600" />,
    PROCESSING: <Clock size={24} className="text-blue-600 animate-spin" />,
    PENDING: <Clock size={24} className="text-yellow-600" />,
    FAILED: <XCircle size={24} className="text-red-600" />,
  };

  return icons[status as keyof typeof icons] || <Clock size={24} className="text-gray-600" />;
}

// Status Badge Component
function StatusBadge({ status }: { status: string }) {
  const badges = {
    COMPLETED: 'bg-green-100 text-green-800',
    PROCESSING: 'bg-blue-100 text-blue-800',
    PENDING: 'bg-yellow-100 text-yellow-800',
    FAILED: 'bg-red-100 text-red-800',
  };

  const labels = {
    COMPLETED: 'Tamamlandı',
    PROCESSING: 'İşleniyor',
    PENDING: 'Bekliyor',
    FAILED: 'Başarısız',
  };

  const className = badges[status as keyof typeof badges] || 'bg-gray-100 text-gray-800';
  const label = labels[status as keyof typeof labels] || status;

  return (
    <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${className}`}>
      {label}
    </span>
  );
}
