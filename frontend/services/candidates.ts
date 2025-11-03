import { getAuthToken } from '@/services/auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

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
  sourceFileName: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Fetch all candidates
 */
export async function fetchCandidates() {
  const token = getAuthToken();

  const response = await fetch(`${API_URL}/api/v1/candidates`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error('Failed to fetch candidates');
  }

  return response.json();
}

/**
 * Fetch single candidate by ID
 */
export async function fetchCandidateById(id: string): Promise<Candidate> {
  const token = getAuthToken();

  const response = await fetch(`${API_URL}/api/v1/candidates/${id}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error('Failed to fetch candidate');
  }

  const result = await response.json();
  return result.data;
}
