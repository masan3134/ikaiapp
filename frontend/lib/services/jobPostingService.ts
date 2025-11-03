import apiClient from './authService';

export interface JobPosting {
  id: string;
  title: string;
  department: string;
  details: string;
  notes?: string;
  userId: string;
  isDeleted?: boolean;
  deletedAt?: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    email: string;
    role: 'USER' | 'ADMIN';
  };
  _count?: {
    analyses: number;
  };
}

export interface JobPostingsResponse {
  jobPostings: JobPosting[];
  count: number;
}

export interface JobPostingResponse {
  jobPosting: JobPosting;
}

export interface CreateJobPostingData {
  title: string;
  department: string;
  details: string;
  notes?: string;
}

export interface UpdateJobPostingData {
  title?: string;
  department?: string;
  details?: string;
  notes?: string;
}

export interface JobPostingOperationResponse {
  message: string;
  jobPosting: JobPosting;
}

export interface DeleteJobPostingResponse {
  message: string;
  deletedAnalysesCount: number;
}

/**
 * Get all job postings for current user
 */
export async function getJobPostings(): Promise<JobPostingsResponse> {
  try {
    const response = await apiClient.get<JobPostingsResponse>('/api/v1/job-postings');
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { error: 'Network Error', message: 'Failed to fetch job postings' };
  }
}

/**
 * Get job posting by ID
 */
export async function getJobPostingById(id: string): Promise<JobPostingResponse> {
  try {
    const response = await apiClient.get<JobPostingResponse>(`/api/v1/job-postings/${id}`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { error: 'Network Error', message: 'Failed to fetch job posting' };
  }
}

/**
 * Create new job posting
 */
export async function createJobPosting(data: CreateJobPostingData): Promise<JobPostingOperationResponse> {
  try {
    const response = await apiClient.post<JobPostingOperationResponse>('/api/v1/job-postings', data);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { error: 'Network Error', message: 'Failed to create job posting' };
  }
}

/**
 * Update job posting
 */
export async function updateJobPosting(
  id: string,
  data: UpdateJobPostingData
): Promise<JobPostingOperationResponse> {
  try {
    const response = await apiClient.put<JobPostingOperationResponse>(`/api/v1/job-postings/${id}`, data);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { error: 'Network Error', message: 'Failed to update job posting' };
  }
}

/**
 * Delete job posting
 */
export async function deleteJobPosting(id: string): Promise<DeleteJobPostingResponse> {
  try {
    const response = await apiClient.delete<DeleteJobPostingResponse>(`/api/v1/job-postings/${id}`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { error: 'Network Error', message: 'Failed to delete job posting' };
  }
}
