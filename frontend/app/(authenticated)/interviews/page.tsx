'use client';

import { useState, useEffect } from 'react';
import { Plus, Search, Filter, AlertCircle } from 'lucide-react';
import InterviewWizard from '@/components/interviews/InterviewWizard';
import InterviewStats from '@/components/interviews/InterviewStats';
import InterviewList from '@/components/interviews/InterviewList';
import interviewService from '@/lib/services/interviewService';

export default function InterviewsPage() {
  const [wizardOpen, setWizardOpen] = useState(false);
  const [stats, setStats] = useState({ total: 0, scheduled: 0, completed: 0, cancelled: 0 });
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    loadData();
  }, [filterStatus]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const filters = filterStatus !== 'all' ? { status: filterStatus } : {};
      
      const [statsData, interviewsData] = await Promise.all([
        interviewService.getStats(),
        interviewService.getInterviews(filters)
      ]);
      
      setStats(statsData);
      setInterviews(interviewsData);
    } catch (err: any) {
      console.error('Error loading interviews:', err);
      setError(err.response?.data?.error || 'Veriler yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleWizardSuccess = () => {
    setWizardOpen(false);
    loadData();
  };

  const handleDeleteInterview = async (id: string) => {
    if (!confirm('Bu mülakatı silmek istediğinize emin misiniz?')) return;
    
    try {
      await interviewService.deleteInterview(id);
      loadData();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Silme işlemi başarısız');
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await interviewService.updateStatus(id, newStatus);
      loadData();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Durum güncelleme başarısız');
    }
  };

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Mülakatlar</h1>
        <p className="text-gray-600">Mülakat planlaması ve yönetimi</p>
      </div>

      {/* Error State */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
          <div>
            <h4 className="font-medium text-red-900">Hata</h4>
            <p className="text-sm text-red-700">{error}</p>
            <button
              onClick={loadData}
              className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
            >
              Tekrar Dene
            </button>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="mb-8">
        <InterviewStats {...stats} />
      </div>

      {/* Actions Bar */}
      <div className="bg-white rounded-xl shadow-sm border p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-4 items-center">
          <div className="flex-1 w-full lg:w-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Aday ara..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex gap-3 w-full lg:w-auto">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              <option value="all">Tümü</option>
              <option value="scheduled">Planlanmış</option>
              <option value="completed">Tamamlanan</option>
              <option value="cancelled">İptal Edilen</option>
            </select>

            <button 
              onClick={() => setWizardOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus size={20} />
              <span>Yeni Mülakat</span>
            </button>
          </div>
        </div>
      </div>

      {/* Interview List */}
      <InterviewList 
        interviews={interviews} 
        loading={loading}
        onDelete={handleDeleteInterview}
        onStatusChange={handleStatusChange}
      />

      {/* Wizard Modal */}
      <InterviewWizard
        isOpen={wizardOpen}
        onClose={() => setWizardOpen(false)}
        onSuccess={handleWizardSuccess}
      />
    </div>
  );
}
