'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, User, FileText, ClipboardList, Video, Briefcase, Loader2 } from 'lucide-react';
import { getCandidateById } from '@/lib/services/candidateService';
import { useToast } from '@/lib/hooks/useToast';
import CandidateHeader from './components/CandidateHeader';
import GeneralInfoTab from './components/tabs/GeneralInfoTab';
import AnalysesTab from './components/tabs/AnalysesTab';
import TestsTab from './components/tabs/TestsTab';
import InterviewsTab from './components/tabs/InterviewsTab';
import OffersTab from './components/tabs/OffersTab';
import type { Candidate } from './types';

type TabType = 'general' | 'analyses' | 'tests' | 'interviews' | 'offers';

export default function CandidateDetailPage() {
  const params = useParams();
  const router = useRouter();
  const toast = useToast();
  const candidateId = params.id as string;

  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('general');

  useEffect(() => {
    loadCandidate();
  }, [candidateId]);

  async function loadCandidate() {
    try {
      setLoading(true);
      const data = await getCandidateById(candidateId);
      setCandidate(data.candidate);
    } catch (error) {
      toast.error('Aday bilgileri yüklenemedi');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (!candidate) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <button
            onClick={() => router.push('/candidates')}
            className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5" />
            Adaylara Dön
          </button>
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <p className="text-gray-600">Aday bulunamadı</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => router.push('/candidates')}
          className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition"
        >
          <ArrowLeft className="w-5 h-5" />
          Adaylara Dön
        </button>

        {/* Header */}
        <CandidateHeader candidate={candidate} />

        {/* Tabs Container */}
        <div className="bg-white rounded-lg shadow">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200">
            <nav className="flex">
              <button
                onClick={() => setActiveTab('general')}
                className={`px-6 py-3 border-b-2 font-medium transition ${
                  activeTab === 'general'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <User className="w-4 h-4 inline mr-2" />
                Genel Bilgiler
              </button>
              <button
                onClick={() => setActiveTab('analyses')}
                className={`px-6 py-3 border-b-2 font-medium transition ${
                  activeTab === 'analyses'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <FileText className="w-4 h-4 inline mr-2" />
                Analizler
              </button>
              <button
                onClick={() => setActiveTab('tests')}
                className={`px-6 py-3 border-b-2 font-medium transition ${
                  activeTab === 'tests'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <ClipboardList className="w-4 h-4 inline mr-2" />
                Testler
              </button>
              <button
                onClick={() => setActiveTab('interviews')}
                className={`px-6 py-3 border-b-2 font-medium transition ${
                  activeTab === 'interviews'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Video className="w-4 h-4 inline mr-2" />
                Mülakatlar
              </button>
              <button
                onClick={() => setActiveTab('offers')}
                className={`px-6 py-3 border-b-2 font-medium transition ${
                  activeTab === 'offers'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Briefcase className="w-4 h-4 inline mr-2" />
                Teklifler
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'general' && <GeneralInfoTab candidate={candidate} />}
            {activeTab === 'analyses' && <AnalysesTab candidateId={candidateId} />}
            {activeTab === 'tests' && <TestsTab candidateEmail={candidate.email} />}
            {activeTab === 'interviews' && <InterviewsTab candidateId={candidateId} />}
            {activeTab === 'offers' && <OffersTab candidateId={candidateId} />}
          </div>
        </div>
      </div>
    </div>
  );
}
