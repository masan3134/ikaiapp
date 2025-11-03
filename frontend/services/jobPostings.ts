import { getAuthToken } from '@/services/auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface JobPosting {
  id: string;
  title: string;
  department: string;
  details: string;
  notes?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Fetch all job postings
 */
export async function fetchJobPostings() {
  const token = getAuthToken();

  const response = await fetch(`${API_URL}/api/v1/job-postings`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error('Failed to fetch job postings');
  }

  return response.json();
}

/**
 * Fetch single job posting by ID
 */
export async function fetchJobPostingById(id: string): Promise<JobPosting> {
  const token = getAuthToken();

  const response = await fetch(`${API_URL}/api/v1/job-postings/${id}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error('Failed to fetch job posting');
  }

  const result = await response.json();
  return result.data;
}
