import apiClient from './authService';
import type { JobPosting } from './jobPostingService';
import type { Candidate } from './candidateService';

/**
 * Analysis Service
 *
 * NOTE: This is a PLACEHOLDER for Phase 4-6 implementation
 * Backend Analysis API is not yet implemented
 * These functions will be activated when backend API is ready
 */

export interface Analysis {
  id: string;
  jobPostingId: string;
  userId: string;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  errorMessage?: string;
  completedAt?: string;
  createdAt: string;
  jobPosting: JobPosting;
  user: {
    id: string;
    email: string;
    role: 'USER' | 'ADMIN';
  };
  _count?: {
    analysisResults: number;
  };
  analysisResults?: AnalysisResult[];
}

export interface AnalysisResult {
  id: string;
  analysisId: string;
  candidateId: string;

  // V7.1: Scores (all 0-100)
  experienceScore?: number;     // 0-100
  educationScore?: number;      // 0-100
  technicalScore?: number;      // 0-100
  softSkillsScore?: number;     // V7.1: Soft skills & leadership (0-100)
  extraScore?: number;          // 0-100
  compatibilityScore: number;   // V7.1: Weighted final score (0-100)

  // V7.1: Dynamic scoring profile
  scoringProfile?: {
    experienceWeight: number;
    educationWeight: number;
    technicalWeight: number;
    softSkillsWeight: number;
    extraWeight: number;
    rationale: string;          // Turkish explanation
  };

  // V7.1: Summaries
  experienceSummary?: string;   // Detailed narrative
  educationSummary?: string;    // Detailed narrative
  careerTrajectory?: string;    // Career growth analysis

  // V7.1: Comments (with evidence types)
  positiveComments: string[];   // Format: "... (kanıt_tipi: Doğrudan/Çıkarım, kanıt: ...)"
  negativeComments: string[];   // Format: "Gap: Impact | Mitigation"

  // V7.1: Strategic summary
  strategicSummary?: {
    executiveSummary: string;
    keyStrengths: string[];
    keyRisks: string[];
    interviewQuestions: string[];
    finalRecommendation: string;
    hiringTimeline: string;
  };

  // Legacy (backward compatibility)
  matchLabel?: string;          // Auto-generated or from strategicSummary

  createdAt: string;
  candidate: Candidate;
}

export interface AnalysesResponse {
  analyses: Analysis[];
  count: number;
}

export interface AnalysisResponse {
  analysis: Analysis;
}

export interface AnalysisResultsResponse {
  results: AnalysisResult[];
}

export interface CreateAnalysisRequest {
  jobPostingId: string;
  candidateIds: string[];
}

export interface CreateAnalysisResponse {
  message: string;
  analysis: Analysis;
}

export interface AddCandidatesResponse {
  message: string;
  analysis: Analysis;
}

/**
 * Create new analysis
 */
export async function createAnalysis(
  jobPostingId: string,
  candidateIds: string[]
): Promise<CreateAnalysisResponse> {
  try {
    const response = await apiClient.post<CreateAnalysisResponse>('/api/v1/analyses', {
      jobPostingId,
      candidateIds
    });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { error: 'Network Error', message: 'Failed to create analysis' };
  }
}

/**
 * Get all analyses
 */
export async function getAnalyses(): Promise<AnalysesResponse> {
  try {
    const response = await apiClient.get<AnalysesResponse>('/api/v1/analyses');
    // Backend returns {analyses: [...], count: ...} format
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { error: 'Network Error', message: 'Failed to fetch analyses' };
  }
}

/**
 * Get analyses by candidate ID
 */
/**
 * Get analyses for a specific candidate (with full results)
 * Backend returns analysisResults only for this candidate when candidateId is provided
 */
export async function getAnalysesByCandidate(candidateId: string): Promise<AnalysesResponse> {
  try {
    const response = await apiClient.get<AnalysesResponse>(`/api/v1/analyses?candidateId=${candidateId}`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { error: 'Network Error', message: 'Failed to fetch analyses for candidate' };
  }
}

/**
 * Get analysis by ID with full results
 */
export async function getAnalysisById(id: string): Promise<AnalysisResponse> {
  try {
    const response = await apiClient.get<AnalysisResponse>(`/api/v1/analyses/${id}`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { error: 'Network Error', message: 'Failed to fetch analysis' };
  }
}

/**
 * Delete analysis
 */
export async function deleteAnalysis(id: string): Promise<{ message: string; deletedResultsCount: number }> {
  try {
    const response = await apiClient.delete<{ message: string; deletedResultsCount: number }>(
      `/api/v1/analyses/${id}`
    );
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { error: 'Network Error', message: 'Failed to delete analysis' };
  }
}

/**
 * Add new candidates to an existing analysis
 */
export async function addCandidatesToAnalysis(
  analysisId: string,
  candidateIds: string[]
): Promise<AddCandidatesResponse> {
  try {
    const response = await apiClient.post<AddCandidatesResponse>(
      `/api/v1/analyses/${analysisId}/add-candidates`,
      { candidateIds }
    );
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { error: 'Network Error', message: 'Adaylar analize eklenemedi' };
  }
}
