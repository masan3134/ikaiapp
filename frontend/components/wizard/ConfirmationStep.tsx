'use client';

import { useWizardStore } from '@/lib/store/wizardStore';
import { Briefcase, FileText, Edit2, CheckCircle } from 'lucide-react';

export default function ConfirmationStep() {
  const {
    selectedJobPosting,
    isNewJobPosting,
    newJobPostingData,
    uploadedFiles,
    selectedCandidates
  } = useWizardStore();

  const totalCVs = uploadedFiles.length + selectedCandidates.length;

  const handleEditJobPosting = () => {
    useWizardStore.setState({ currentStep: 1 });
  };

  const handleEditCVs = () => {
    useWizardStore.setState({ currentStep: 2 });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Analiz Özeti</h2>
        <p className="text-gray-600 mt-1">Seçimlerinizi kontrol edin ve analizi başlatın</p>
      </div>

      {/* Job Posting Summary */}
      <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Briefcase size={24} className="text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">İş İlanı</h3>
              <p className="text-sm text-gray-500">
                {isNewJobPosting ? 'Yeni İlan (Kaydedilecek)' : 'Mevcut İlan'}
              </p>
            </div>
          </div>
          <button
            onClick={handleEditJobPosting}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            <Edit2 size={16} />
            Düzenle
          </button>
        </div>

        <div className="space-y-2">
          <div>
            <p className="text-sm text-gray-500">Başlık</p>
            <p className="font-medium text-gray-900">
              {selectedJobPosting?.title || newJobPostingData.title || 'Bilgi yok'}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Departman</p>
            <p className="font-medium text-gray-900">
              {selectedJobPosting?.department || newJobPostingData.department || 'Bilgi yok'}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Detaylar</p>
            <p className="text-gray-700 text-sm line-clamp-3">
              {selectedJobPosting?.details || newJobPostingData.details || 'Bilgi yok'}
            </p>
          </div>
        </div>
      </div>

      {/* CVs Summary */}
      <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <FileText size={24} className="text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">CV'ler</h3>
              <p className="text-sm text-gray-500">
                Toplam {totalCVs} CV analiz edilecek
              </p>
            </div>
          </div>
          <button
            onClick={handleEditCVs}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            <Edit2 size={16} />
            Düzenle
          </button>
        </div>

        <div className="space-y-4">
          {/* Uploaded Files */}
          {uploadedFiles.length > 0 && (
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">
                Yüklenecek Dosyalar ({uploadedFiles.length})
              </p>
              <div className="space-y-2">
                {uploadedFiles.map((file, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <FileText size={18} className="text-blue-600" />
                    <span className="text-sm text-gray-700">{file.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Selected Candidates */}
          {selectedCandidates.length > 0 && (
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">
                Seçili Adaylar ({selectedCandidates.length})
              </p>
              <div className="space-y-2">
                {selectedCandidates.map((candidate) => (
                  <div key={candidate.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <FileText size={18} className="text-green-600" />
                    <span className="text-sm text-gray-700">{candidate.sourceFileName}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action Info */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
            <CheckCircle size={20} className="text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Analiz Başlatılacak</h3>
            <p className="text-sm text-gray-700 mb-3">
              "Analizi Başlat" butonuna tıkladığınızda:
            </p>
            <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
              {isNewJobPosting && <li>İş ilanı veritabanına kaydedilecek</li>}
              {uploadedFiles.length > 0 && <li>{uploadedFiles.length} CV dosyası yüklenecek</li>}
              <li>CV'ler Gemini AI tarafından analiz edilecek</li>
              <li>Uyumluluk skorları hesaplanacak</li>
              <li>Sonuçlar "Analizler" sayfasında görüntülenecek</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
