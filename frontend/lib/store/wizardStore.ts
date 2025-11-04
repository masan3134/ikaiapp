import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface JobPosting {
  id: string;
  title: string;
  department: string;
  details: string;
  notes?: string;
  userId: string;
  createdAt: string;
}

export interface Candidate {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  address: string;
  experience: string;
  education: string;
  generalComment: string;
  sourceFileName: string;
  fileUrl?: string;
  userId: string;
  createdAt: string;
}

export interface NewJobPostingData {
  title: string;
  department: string;
  details: string;
  notes: string;
}

interface WizardState {
  // Navigation
  currentStep: 1 | 2 | 3;

  // Step 1 - Job Posting
  selectedJobPosting: JobPosting | null;
  isNewJobPosting: boolean;
  newJobPostingData: NewJobPostingData;

  // Step 2 - Candidates
  uploadedFiles: File[];
  selectedCandidates: Candidate[];

  // UI State
  isLoading: boolean;
  error: string | null;
  uploadProgress: {
    total: number;
    completed: number;
    failed: number;
  };

  // Actions
  nextStep: () => void;
  prevStep: () => void;
  resetWizard: () => void;
  setJobPosting: (jobPosting: JobPosting | null, isNew: boolean) => void;
  setNewJobPostingData: (data: Partial<NewJobPostingData>) => void;
  addFile: (file: File) => void;
  removeFile: (index: number) => void;
  addCandidate: (candidate: Candidate) => void;
  removeCandidate: (candidateId: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setUploadProgress: (progress: {
    total: number;
    completed: number;
    failed: number;
  }) => void;
  resetUploadProgress: () => void;
  canProceedToStep2: () => boolean;
  canProceedToStep3: () => boolean;
}

const initialJobPostingData: NewJobPostingData = {
  title: "",
  department: "",
  details: "",
  notes: "",
};

export const useWizardStore = create<WizardState>()(
  persist(
    (set, get) => ({
      // Initial state
      currentStep: 1,
      selectedJobPosting: null,
      isNewJobPosting: false,
      newJobPostingData: initialJobPostingData,
      uploadedFiles: [],
      selectedCandidates: [],
      isLoading: false,
      error: null,
      uploadProgress: { total: 0, completed: 0, failed: 0 },

      // Navigation actions
      nextStep: () => {
        const { currentStep } = get();
        if (currentStep < 3) {
          set({ currentStep: (currentStep + 1) as 1 | 2 | 3 });
        }
      },

      prevStep: () => {
        const { currentStep } = get();
        if (currentStep > 1) {
          set({ currentStep: (currentStep - 1) as 1 | 2 | 3 });
        }
      },

      resetWizard: () => {
        set({
          currentStep: 1,
          selectedJobPosting: null,
          isNewJobPosting: false,
          newJobPostingData: initialJobPostingData,
          uploadedFiles: [],
          selectedCandidates: [],
          isLoading: false,
          error: null,
        });
      },

      // Job posting actions
      setJobPosting: (jobPosting, isNew) => {
        set({
          selectedJobPosting: jobPosting,
          isNewJobPosting: isNew,
          error: null,
        });
      },

      setNewJobPostingData: (data) => {
        set((state) => ({
          newJobPostingData: {
            ...state.newJobPostingData,
            ...data,
          },
        }));
      },

      // File actions
      addFile: (file) => {
        set((state) => {
          const totalFiles =
            state.uploadedFiles.length + state.selectedCandidates.length;
          if (totalFiles >= 50) {
            return { error: "Maksimum 50 CV seçebilirsiniz" };
          }
          return {
            uploadedFiles: [...state.uploadedFiles, file],
            error: null,
          };
        });
      },

      removeFile: (index) => {
        set((state) => ({
          uploadedFiles: state.uploadedFiles.filter((_, i) => i !== index),
          error: null,
        }));
      },

      // Candidate actions
      addCandidate: (candidate) => {
        set((state) => {
          const totalCandidates =
            state.uploadedFiles.length + state.selectedCandidates.length;
          if (totalCandidates >= 50) {
            return { error: "Maksimum 50 CV seçebilirsiniz" };
          }

          // Check if already selected
          if (state.selectedCandidates.find((c) => c.id === candidate.id)) {
            return state;
          }

          return {
            selectedCandidates: [...state.selectedCandidates, candidate],
            error: null,
          };
        });
      },

      removeCandidate: (candidateId) => {
        set((state) => ({
          selectedCandidates: state.selectedCandidates.filter(
            (c) => c.id !== candidateId
          ),
          error: null,
        }));
      },

      // UI state actions
      setLoading: (loading) => {
        set({ isLoading: loading });
      },

      setError: (error) => {
        set({ error });
      },

      setUploadProgress: (progress) => {
        set({ uploadProgress: progress });
      },

      resetUploadProgress: () => {
        set({ uploadProgress: { total: 0, completed: 0, failed: 0 } });
      },

      // Validation helpers
      canProceedToStep2: () => {
        const { selectedJobPosting, isNewJobPosting, newJobPostingData } =
          get();

        // If existing job posting is selected
        if (selectedJobPosting && !isNewJobPosting) {
          return true;
        }

        // If creating new job posting, check required fields
        if (isNewJobPosting) {
          return (
            newJobPostingData.title.trim().length > 0 &&
            newJobPostingData.department.trim().length > 0 &&
            newJobPostingData.details.trim().length > 0
          );
        }

        return false;
      },

      canProceedToStep3: () => {
        const { uploadedFiles, selectedCandidates } = get();
        return uploadedFiles.length > 0 || selectedCandidates.length > 0;
      },
    }),
    {
      name: "wizard-storage",
      storage: createJSONStorage(() => localStorage),
      // Don't persist File objects (can't be serialized)
      partialize: (state) => ({
        currentStep: state.currentStep,
        selectedJobPosting: state.selectedJobPosting,
        isNewJobPosting: state.isNewJobPosting,
        newJobPostingData: state.newJobPostingData,
        selectedCandidates: state.selectedCandidates,
        // Skip: uploadedFiles (File objects), isLoading, error
      }),
      // Version for future migrations
      version: 1,
    }
  )
);
