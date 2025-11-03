import apiClient from '@/lib/utils/apiClient';


export interface Candidate {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  desiredPosition: string;
  createdAt: string;
}

export interface Interview {
  id: string;
  type: string;
  date: string;
  time: string;
  duration: number;
  location?: string;
  meetLink?: string;
  status: string;
  candidates: any[];
  interviewer: any;
}

export interface InterviewFormData {
  candidateIds: string[];
  type: 'phone' | 'online' | 'in-person';
  date: string;
  time: string;
  duration?: number;
  location?: string;
  interviewerId?: string;
  notes?: string;
  emailTemplate?: string;
  meetingTitle?: string;
}

class InterviewService {
  
  // Step 1: Get recent candidates
  async getRecentCandidates(search?: string, limit = 10) {
    const response = await apiClient.get(`/api/v1/interviews/candidates/recent`, {
      params: { search, limit }
    });
    return response.data.data;
  }

  // Step 2: Check conflicts
  async checkConflicts(date: string, time: string) {
    const response = await apiClient.post(`/api/v1/interviews/check-conflicts`, {
      date, time
    });
    return response.data.data;
  }

  // Create interview
  async createInterview(data: InterviewFormData) {
    const response = await apiClient.post(`/api/v1/interviews`, data);
    return response.data;
  }

  // Get all interviews
  async getInterviews(filters?: any) {
    const response = await apiClient.get(`/api/v1/interviews`, {
      params: filters
    });
    return response.data.data;
  }

  // Get interview stats
  async getStats() {
    const response = await apiClient.get(`/api/v1/interviews/stats`);
    return response.data.data;
  }

  // Update interview status
  async updateStatus(id: string, status: string) {
    const response = await apiClient.patch(`/api/v1/interviews/${id}/status`, {
      status
    });
    return response.data;
  }

  // Delete interview
  async deleteInterview(id: string) {
    const response = await apiClient.delete(`/api/v1/interviews/${id}`);
    return response.data;
  }
}

export default new InterviewService();
