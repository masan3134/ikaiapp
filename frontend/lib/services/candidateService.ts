import apiClient from './authService';

export interface Candidate {
  id: string;
  firstName: string;
  lastName: string;
  phone?: string;
  email?: string;
  address?: string;
  experience?: string;
  education?: string;
  generalComment?: string;
  sourceFileName: string;
  fileUrl?: string;
  userId: string;
  isDeleted?: boolean;
  deletedAt?: string;
  createdAt: string;
  updatedAt: string;
  _count?: {
    analysisResults: number;
  };
}

export interface CandidatesResponse {
  candidates: Candidate[];
  count: number;
}

export interface CandidateResponse {
  candidate: Candidate;
}

export interface DuplicateCheckResponse {
  exists: boolean;
  candidate?: Candidate;
}

export interface UploadResponse {
  message: string;
  candidate: Candidate;
}

/**
 * Get all candidates for current user
 */
export async function getCandidates(): Promise<CandidatesResponse> {
  try {
    const response = await apiClient.get<CandidatesResponse>('/api/v1/candidates');
    // Backend returns {candidates: [...], count: ...} format directly
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { error: 'Network Error', message: 'Failed to fetch candidates' };
  }
}

/**
 * Get candidate by ID
 */
export async function getCandidateById(id: string): Promise<CandidateResponse> {
  try {
    const response = await apiClient.get<CandidateResponse>(`/api/v1/candidates/${id}`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { error: 'Network Error', message: 'Failed to fetch candidate' };
  }
}

/**
 * Delete candidate
 */
export async function deleteCandidate(id: string): Promise<{ message: string; deletedAnalysisResultsCount: number }> {
  try {
    const response = await apiClient.delete<{ message: string; deletedAnalysisResultsCount: number }>(
      `/api/v1/candidates/${id}`
    );
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { error: 'Network Error', message: 'Failed to delete candidate' };
  }
}

/**
 * Check if file is duplicate
 */
export async function checkDuplicate(fileName: string): Promise<DuplicateCheckResponse> {
  try {
    const response = await apiClient.post<DuplicateCheckResponse>('/api/v1/candidates/check-duplicate', {
      fileName
    });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { error: 'Network Error', message: 'Failed to check duplicate' };
  }
}

/**
 * Upload CV file
 */
export async function uploadCV(file: File): Promise<UploadResponse> {
  try {
    const formData = new FormData();
    formData.append('cv', file);

    const response = await apiClient.post<UploadResponse>('/api/v1/candidates/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { error: 'Network Error', message: 'Failed to upload CV' };
  }
}

/**
 * Download CV file
 * Uses fileUrl from candidate data (MinIO direct link)
 * Returns blob for file download
 */
export async function downloadCV(id: string): Promise<Blob> {
  try {
    // Get candidate to access fileUrl
    const candidate = await getCandidateById(id);

    if (!candidate.fileUrl) {
      throw new Error('CV file URL not available');
    }

    // Download from MinIO direct URL
    const response = await fetch(candidate.fileUrl);

    if (!response.ok) {
      throw new Error('Failed to fetch CV file');
    }

    return await response.blob();
  } catch (error: any) {
    throw new Error('Failed to download CV');
  }
}
