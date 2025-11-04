import { create } from "zustand";

// Types
export type CreationMode = "template" | "scratch" | null;
export type WorkType = "office" | "hybrid" | "remote";
export type SendMode = "draft" | "direct";

export interface Benefits {
  insurance: boolean;
  meal: number;
  transportation: boolean;
  gym: boolean;
  education: boolean;
}

export interface OfferTemplate {
  id: string;
  name: string;
  description?: string;
  categoryId?: string;
  position: string;
  department: string;
  salaryMin: number;
  salaryMax: number;
  currency: string;
  benefits: Benefits;
  workType: WorkType;
  terms: string;
  emailSubject: string;
  emailBody: string;
  usageCount: number;
}

export interface Candidate {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  experience: string;
  education: string;
  generalComment: string;
}

export interface JobPosting {
  id: string;
  title: string;
  department: string;
  details: string;
  notes?: string;
}

export interface OfferFormData {
  position: string;
  department: string;
  salary: number;
  currency: string;
  startDate: string;
  workType: WorkType;
  benefits: Benefits;
  terms: string;
}

interface OfferWizardState {
  // Wizard state
  currentStep: number;
  creationMode: CreationMode;
  sendMode: SendMode;

  // Selections
  selectedTemplate: OfferTemplate | null;
  selectedCandidate: Candidate | null;
  selectedJobPosting: JobPosting | null;

  // Form data
  formData: OfferFormData;

  // UI state
  loading: boolean;
  error: string;

  // Actions
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;

  setCreationMode: (mode: CreationMode) => void;
  setSendMode: (mode: SendMode) => void;

  setTemplate: (template: OfferTemplate | null) => void;
  setCandidate: (candidate: Candidate | null) => void;
  setJobPosting: (jobPosting: JobPosting | null) => void;

  updateFormData: (data: Partial<OfferFormData>) => void;
  setFormData: (data: OfferFormData) => void;

  setLoading: (loading: boolean) => void;
  setError: (error: string) => void;

  canProceedToStep2: () => boolean;
  canProceedToStep3: () => boolean;

  resetWizard: () => void;
}

const defaultBenefits: Benefits = {
  insurance: false,
  meal: 0,
  transportation: false,
  gym: false,
  education: false,
};

const defaultFormData: OfferFormData = {
  position: "",
  department: "",
  salary: 0,
  currency: "TRY",
  startDate: "",
  workType: "office",
  benefits: { ...defaultBenefits },
  terms: "",
};

export const useOfferWizardStore = create<OfferWizardState>((set, get) => ({
  // Initial state
  currentStep: 1,
  creationMode: null,
  sendMode: "draft",

  selectedTemplate: null,
  selectedCandidate: null,
  selectedJobPosting: null,

  formData: { ...defaultFormData },

  loading: false,
  error: "",

  // Navigation actions
  nextStep: () => {
    const { currentStep } = get();
    if (currentStep < 3) {
      set({ currentStep: currentStep + 1, error: "" });
    }
  },

  prevStep: () => {
    const { currentStep } = get();
    if (currentStep > 1) {
      set({ currentStep: currentStep - 1, error: "" });
    }
  },

  goToStep: (step: number) => {
    if (step >= 1 && step <= 3) {
      set({ currentStep: step, error: "" });
    }
  },

  // Mode setters
  setCreationMode: (mode: CreationMode) => {
    set({ creationMode: mode });

    // If switching to scratch mode, clear template
    if (mode === "scratch") {
      set({ selectedTemplate: null });
    }
  },

  setSendMode: (mode: SendMode) => {
    set({ sendMode: mode });
  },

  // Selection setters
  setTemplate: (template: OfferTemplate | null) => {
    set({ selectedTemplate: template });

    // Auto-fill form from template
    if (template) {
      const { formData } = get();
      set({
        formData: {
          ...formData,
          position: template.position,
          department: template.department,
          salary: template.salaryMin,
          currency: template.currency,
          workType: template.workType,
          benefits: { ...template.benefits },
          terms: template.terms,
        },
        creationMode: "template",
      });
    }
  },

  setCandidate: (candidate: Candidate | null) => {
    set({ selectedCandidate: candidate });
  },

  setJobPosting: (jobPosting: JobPosting | null) => {
    set({ selectedJobPosting: jobPosting });

    // Auto-fill position and department from job posting
    if (jobPosting) {
      const { formData } = get();
      set({
        formData: {
          ...formData,
          position: jobPosting.title || formData.position,
          department: jobPosting.department || formData.department,
        },
      });
    }
  },

  // Form data actions
  updateFormData: (data: Partial<OfferFormData>) => {
    const { formData } = get();
    set({
      formData: {
        ...formData,
        ...data,
      },
    });
  },

  setFormData: (data: OfferFormData) => {
    set({ formData: data });
  },

  // UI actions
  setLoading: (loading: boolean) => {
    set({ loading });
  },

  setError: (error: string) => {
    set({ error });
  },

  // Validation
  canProceedToStep2: () => {
    const { creationMode, selectedCandidate } = get();

    // Must have creation mode selected and candidate selected
    return creationMode !== null && selectedCandidate !== null;
  },

  canProceedToStep3: () => {
    const { formData, selectedCandidate } = get();

    // Must have all required fields
    return (
      selectedCandidate !== null &&
      formData.position.trim().length >= 3 &&
      formData.department.trim().length >= 2 &&
      formData.salary > 0 &&
      formData.startDate.length > 0
    );
  },

  // Reset
  resetWizard: () => {
    set({
      currentStep: 1,
      creationMode: null,
      sendMode: "draft",
      selectedTemplate: null,
      selectedCandidate: null,
      selectedJobPosting: null,
      formData: { ...defaultFormData },
      loading: false,
      error: "",
    });
  },
}));
