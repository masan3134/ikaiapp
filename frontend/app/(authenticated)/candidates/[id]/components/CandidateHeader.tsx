'use client';

import { User, Download } from 'lucide-react';
import { downloadCV } from '@/lib/services/candidateService';
import { useToast } from '@/lib/hooks/useToast';
import type { Candidate } from '../types';

interface CandidateHeaderProps {
  candidate: Candidate;
}

export default function CandidateHeader({ candidate }: CandidateHeaderProps) {
  const toast = useToast();

  async function handleDownloadCV() {
    try {
      const blob = await downloadCV(candidate.id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = candidate.sourceFileName || 'cv.pdf';
      a.click();
      toast.success('CV indirildi');
    } catch (error) {
      toast.error('CV indirilemedi');
    }
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <User className="w-8 h-8 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {candidate.firstName} {candidate.lastName}
            </h1>
            <p className="text-gray-600">{candidate.email}</p>
          </div>
        </div>
        <button
          onClick={handleDownloadCV}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          <Download className="w-4 h-4" />
          CV İndir
        </button>
      </div>
    </div>
  );
}
