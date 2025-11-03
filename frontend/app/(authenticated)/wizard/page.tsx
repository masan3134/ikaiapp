'use client';

import { useRouter } from 'next/navigation';
import { useWizardStore } from '@/lib/store/wizardStore';
import { withRoleProtection } from '@/lib/hoc/withRoleProtection';
import { RoleGroups } from '@/lib/constants/roles';
import JobPostingStep from '@/components/wizard/JobPostingStep';
import CVUploadStep from '@/components/wizard/CVUploadStep';
import ConfirmationStep from '@/components/wizard/ConfirmationStep';
import WizardErrorBoundary from '@/components/wizard/WizardErrorBoundary';
import { saveLastJobPosting } from '@/lib/utils/wizardPreferences';
import { getTurkishErrorMessage } from '@/lib/utils/errorMessages';
import { ChevronLeft, ChevronRight, Wand2 } from 'lucide-react';

function WizardPage() {
  const router = useRouter();
  const {
    currentStep,
    nextStep,
    prevStep,
    resetWizard,
    canProceedToStep2,
    canProceedToStep3,
    isLoading,
    uploadProgress
  } = useWizardStore();

  const steps = [
    { number: 1, title: 'İş İlanı', component: JobPostingStep },
    { number: 2, title: 'CV Yükleme', component: CVUploadStep },
    { number: 3, title: 'Onay', component: ConfirmationStep }
  ];

  const CurrentStepComponent = steps[currentStep - 1].component;

  const canProceed = () => {
    if (currentStep === 1) return canProceedToStep2();
    if (currentStep === 2) return canProceedToStep3();
    return true;
  };

  const handleNext = async () => {
    if (!canProceed()) return;

    const { setLoading, setError } = useWizardStore.getState();
    const token = localStorage.getItem('auth_token');
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    if (!API_URL) {
      throw new Error('NEXT_PUBLIC_API_URL environment variable is not set');
    }

    // Step 1 to Step 2: Create job posting if new
    if (currentStep === 1) {
      const { isNewJobPosting, newJobPostingData, setJobPosting } = useWizardStore.getState();

      if (isNewJobPosting) {
        setLoading(true);
        try {
          const response = await fetch(`${API_URL}/api/v1/job-postings`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(newJobPostingData)
          });

          if (!response.ok) throw new Error('Failed to create job posting');

          const data = await response.json();
          // Backend returns { message, jobPosting }
          const createdJobPosting = data.jobPosting || data;

          // Set as selected job posting and mark as NOT new anymore
          setJobPosting(createdJobPosting, false);

          if (process.env.NODE_ENV === 'development') {
            console.log('✅ Job posting created and set:', createdJobPosting);
          }
        } catch (error) {
          if (process.env.NODE_ENV === 'development') {
            console.error('Create job posting error:', error);
          }
          setError(getTurkishErrorMessage(error));
          setLoading(false);
          return;
        } finally {
          setLoading(false);
        }
      }
    }

    // Step 2 to Step 3: Upload files to backend (PARALLEL)
    if (currentStep === 2) {
      const { uploadedFiles, addCandidate, setUploadProgress, resetUploadProgress } = useWizardStore.getState();

      if (uploadedFiles.length > 0) {
        setLoading(true);
        resetUploadProgress();

        try {
          const totalFiles = uploadedFiles.length;
          setUploadProgress({ total: totalFiles, completed: 0, failed: 0 });

          // Upload all files in parallel
          const uploadPromises = uploadedFiles.map(async (file, index) => {
            try {
              const formData = new FormData();
              formData.append('cv', file);

              const response = await fetch(`${API_URL}/api/v1/candidates/upload`, {
                method: 'POST',
                headers: {
                  Authorization: `Bearer ${token}`
                },
                body: formData
              });

              if (response.ok || response.status === 409) {
                // Successfully uploaded OR duplicate
                const data = await response.json();
                const candidate = data.candidate || data;
                return { success: true, candidate, index };
              } else {
                return { success: false, error: 'Upload failed', index };
              }
            } catch (error) {
              return { success: false, error, index };
            }
          });

          // Wait for all uploads to complete
          const results = await Promise.allSettled(uploadPromises);

          // Process results
          let completed = 0;
          let failed = 0;
          const successfulIndices: number[] = [];

          results.forEach((result, index) => {
            if (result.status === 'fulfilled' && result.value.success) {
              addCandidate(result.value.candidate);
              successfulIndices.push(result.value.index);
              completed++;
            } else {
              failed++;
            }
          });

          // Remove successfully uploaded files (in reverse order to maintain indices)
          successfulIndices.sort((a, b) => b - a).forEach(index => {
            useWizardStore.getState().removeFile(index);
          });

          setUploadProgress({ total: totalFiles, completed, failed });

          if (failed > 0 && process.env.NODE_ENV === 'development') {
            console.warn(`⚠️ ${failed} file(s) failed to upload`);
          }

          if (completed === 0) {
            throw new Error('Tüm dosyalar yüklenemedi');
          }
        } catch (error) {
          if (process.env.NODE_ENV === 'development') {
            console.error('Upload error:', error);
          }
          setError(getTurkishErrorMessage(error));
          setLoading(false);
          return;
        } finally {
          setLoading(false);
        }
      }
    }

    nextStep();
  };

  const handleStartAnalysis = async () => {
    const {
      selectedJobPosting,
      isNewJobPosting,
      newJobPostingData,
      uploadedFiles,
      selectedCandidates,
      setLoading,
      setError,
      resetWizard
    } = useWizardStore.getState();

    // Get job posting ID (from selected or newly created)
    let jobPostingId = selectedJobPosting?.id;

    // If new job posting was created in Step 1, it should be in selectedJobPosting now
    // But double-check with newJobPostingData as fallback
    if (!jobPostingId && isNewJobPosting && newJobPostingData.id) {
      jobPostingId = newJobPostingData.id;
    }

    if (!jobPostingId) {
      alert('İş ilanı bulunamadı. Lütfen Adım 1\'e dönün ve tekrar deneyin.');
      return;
    }

    // Get candidate IDs (from selected existing candidates)
    const candidateIds = selectedCandidates.map(c => c.id);

    const totalCandidates = candidateIds.length + uploadedFiles.length;

    if (totalCandidates === 0) {
      alert('Lütfen en az bir CV seçin veya yükleyin');
      return;
    }

    if (!confirm(`${totalCandidates} aday için analiz başlatılacak. Devam etmek istiyor musunuz?`)) {
      return;
    }

    try {
      setLoading(true);
      const { createAnalysis } = await import('@/lib/services/analysisService');

      const response = await createAnalysis(jobPostingId, candidateIds);

      // Save job posting ID for next time (smart defaults)
      saveLastJobPosting(jobPostingId);

      alert(`✅ ${response.message}\n\nAnaliz ID: ${response.analysis.id}\n\nAnalizler sayfasında görüntüleyebilirsiniz.`);
      resetWizard();
      router.push('/analyses');
    } catch (error: any) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Start analysis error:', error);
      }
      const errorMsg = getTurkishErrorMessage(error);
      setError(errorMsg);
      alert(`❌ Hata: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <WizardErrorBoundary>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Analiz Sihirbazı</h1>
                <p className="text-gray-600 mt-1">
                  CV'leri iş ilanlarıyla eşleştirin ve AI destekli analiz yapın
                </p>
              </div>
              <button
                onClick={() => {
                  if (confirm('Sihirbazdan çıkmak istediğinize emin misiniz? Tüm ilerleme kaybedilecek.')) {
                    resetWizard();
                    router.push('/dashboard');
                  }
                }}
                className="text-gray-600 hover:text-gray-800 text-sm"
              >
                İptal Et
              </button>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.number} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold text-lg transition-colors ${
                        currentStep === step.number
                          ? 'bg-blue-600 text-white'
                          : currentStep > step.number
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {currentStep > step.number ? (
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      ) : (
                        step.number
                      )}
                    </div>
                    <p className="mt-2 text-sm font-medium text-gray-700">{step.title}</p>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`h-1 flex-1 mx-4 rounded transition-colors ${
                        currentStep > step.number ? 'bg-green-500' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
            <p className="text-center text-sm text-gray-500 mt-4">
              Adım {currentStep} / {steps.length}
            </p>
          </div>

          {/* Upload Progress Bar */}
          {isLoading && uploadProgress.total > 0 && (
            <div className="bg-blue-50 border-2 border-blue-300 rounded-xl p-6 mb-8">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">CV'ler Yükleniyor...</h3>
                  <p className="text-sm text-gray-700 mt-1">
                    {uploadProgress.completed} / {uploadProgress.total} dosya tamamlandı
                    {uploadProgress.failed > 0 && ` (${uploadProgress.failed} başarısız)`}
                  </p>
                </div>
                <div className="text-2xl font-bold text-blue-600">
                  {Math.round((uploadProgress.completed / uploadProgress.total) * 100)}%
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${(uploadProgress.completed / uploadProgress.total) * 100}%` }}
                />
              </div>
            </div>
          )}

          {/* Step Content */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
            <CurrentStepComponent />
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className="flex items-center gap-2 px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
            >
              <ChevronLeft size={20} />
              Geri
            </button>

            <div className="flex gap-3">
              {currentStep < 3 ? (
                <button
                  onClick={handleNext}
                  disabled={!canProceed()}
                  className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
                >
                  İleri
                  <ChevronRight size={20} />
                </button>
              ) : (
                <button
                  onClick={handleStartAnalysis}
                  className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition-colors"
                >
                  <Wand2 size={20} />
                  Analizi Başlat
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </WizardErrorBoundary>
  );
}

export default withRoleProtection(WizardPage, {
  allowedRoles: RoleGroups.HR_MANAGERS
});
