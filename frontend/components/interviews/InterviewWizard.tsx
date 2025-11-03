'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import Step1_CandidateSelection from './steps/Step1_CandidateSelection';
import Step2_InterviewDetails from './steps/Step2_InterviewDetails';
import Step3_GoogleMeetSetup from './steps/Step3_GoogleMeetSetup';
import Step4_EmailTemplate from './steps/Step4_EmailTemplate';
import Step5_Summary from './steps/Step5_Summary';

interface WizardProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function InterviewWizard({ isOpen, onClose, onSuccess }: WizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [wizardData, setWizardData] = useState({
    step1: { selectedCandidates: [], selectedIds: [] },
    step2: { type: 'online', date: '', time: '', duration: 60, location: '' },
    step3: { meetingTitle: '', meetingDescription: '' },
    step4: { emailTemplate: '', additionalNotes: '' }
  });

  if (!isOpen) return null;

  const updateStepData = (step: number, newData: any) => {
    setWizardData(prev => ({
      ...prev,
      [`step${step}`]: { ...prev[`step${step}` as keyof typeof prev], ...newData }
    }));
  };

  const canGoNext = () => {
    switch (currentStep) {
      case 1: return wizardData.step1.selectedIds.length > 0;
      case 2: return wizardData.step2.date && wizardData.step2.time;
      case 3: return wizardData.step2.type !== 'online' || wizardData.step3.meetingTitle;
      case 4: return true;
      case 5: return true;
      default: return false;
    }
  };

  const handleNext = () => {
    if (currentStep === 2 && wizardData.step2.type !== 'online') {
      setCurrentStep(4);
    } else if (canGoNext() && currentStep < 5) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep === 4 && wizardData.step2.type !== 'online') {
      setCurrentStep(2);
    } else if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const stepTitles = [
    'Aday Seçimi',
    'Mülakat Detayları',
    'Google Meet',
    'E-posta Şablonu',
    'Özet'
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Yeni Mülakat Oluştur</h2>
            <p className="text-sm text-gray-600 mt-1">Adım {currentStep}/5: {stepTitles[currentStep - 1]}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X size={24} />
          </button>
        </div>

        <div className="px-6 pt-4 pb-2">
          <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((step) => (
              <div key={step} className={`flex items-center ${step < 5 ? 'flex-1' : ''}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${
                  step < currentStep ? 'bg-green-500 text-white' :
                  step === currentStep ? 'bg-blue-600 text-white' :
                  'bg-gray-200 text-gray-500'
                }`}>
                  {step < currentStep ? '✓' : step}
                </div>
                {step < 5 && (
                  <div className={`h-1 flex-1 mx-2 ${step < currentStep ? 'bg-green-500' : 'bg-gray-200'}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {currentStep === 1 && (
            <Step1_CandidateSelection
              data={wizardData.step1}
              onChange={(d) => updateStepData(1, d)}
            />
          )}
          {currentStep === 2 && (
            <Step2_InterviewDetails
              data={wizardData.step2}
              onChange={(d) => updateStepData(2, d)}
            />
          )}
          {currentStep === 3 && (
            <Step3_GoogleMeetSetup
              data={wizardData.step3}
              onChange={(d) => updateStepData(3, d)}
            />
          )}
          {currentStep === 4 && (
            <Step4_EmailTemplate
              data={wizardData.step4}
              onChange={(d) => updateStepData(4, d)}
              wizardData={wizardData}
            />
          )}
          {currentStep === 5 && (
            <Step5_Summary data={wizardData} onSuccess={onSuccess} />
          )}
        </div>

        <div className="flex justify-between p-6 border-t bg-gray-50">
          <button
            onClick={handleBack}
            disabled={currentStep === 1}
            className="px-6 py-2 text-gray-700 hover:bg-gray-200 rounded-lg disabled:opacity-50"
          >
            ← Geri
          </button>
          <div className="flex gap-3">
            <button onClick={onClose} className="px-6 py-2 text-gray-700 hover:bg-gray-200 rounded-lg">
              İptal
            </button>
            {currentStep < 5 && (
              <button
                onClick={handleNext}
                disabled={!canGoNext()}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                İleri →
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
