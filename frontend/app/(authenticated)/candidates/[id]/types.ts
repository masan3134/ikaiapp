export interface Candidate {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  experience?: string;
  education?: string;
  generalComment?: string;
  sourceFileName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Analysis {
  id: string;
  jobPostingId: string;
  status: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";
  createdAt: string;
  completedAt?: string;
  jobPosting: {
    id: string;
    title: string;
    department: string;
  };
  analysisResults?: AnalysisResult[];
}

export interface AnalysisResult {
  id: string;
  candidateId: string;
  compatibilityScore: number;
  experienceScore?: number;
  educationScore?: number;
  technicalScore?: number;
  softSkillsScore?: number;
  extraScore?: number;
  matchLabel?: string;
  positiveComments?: string[];
  negativeComments?: string[];
  strategicSummary?: {
    finalRecommendation: string;
    executiveSummary?: string;
    keyStrengths?: string[];
    keyRisks?: string[];
  };
}

export interface TestSubmission {
  id: string;
  testId: string;
  candidateEmail: string;
  candidateName?: string;
  score: number;
  correctCount: number;
  attemptNumber: number;
  startedAt: string;
  completedAt: string;
  answers?: TestAnswer[];
  metadata?: {
    tabSwitchCount: number;
    copyAttempts: number;
    screenshotAttempts: number;
    pasteAttempts: number;
    autoSubmit?: boolean;
  };
  test?: {
    id: string;
    jobPostingId: string;
    expiresAt: string;
    questions?: TestQuestion[];
    jobPosting?: {
      id: string;
      title: string;
      department: string;
    };
  };
}

export interface TestQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  category: "technical" | "situational" | "experience";
}

export interface TestAnswer {
  questionId: string;
  selectedOption: number;
}

export interface Interview {
  id: string;
  candidateId: string;
  jobPostingId: string;
  date: string;
  time: string;
  duration: number;
  meetLink?: string;
  status: "scheduled" | "completed" | "cancelled" | "no_show";
  notes?: string;
  rating?: number;
  createdAt: string;
  jobPosting?: {
    id: string;
    title: string;
    department: string;
  };
}

export interface JobOffer {
  id: string;
  candidateId: string;
  jobPostingId: string;
  templateId?: string;
  title?: string;
  department: string;
  position: string;
  salary: number;
  currency: string;
  startDate: string;
  status:
    | "draft"
    | "pending_approval"
    | "approved"
    | "sent"
    | "accepted"
    | "rejected"
    | "negotiating"
    | "withdrawn"
    | "expired"
    | "cancelled";
  benefits?: string[];
  conditions?: string[];
  sentAt?: string;
  respondedAt?: string;
  expiresAt?: string;
  createdAt: string;
  updatedAt: string;
  jobPosting?: {
    id: string;
    title: string;
    department: string;
  };
}
