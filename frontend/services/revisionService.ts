import { getAuthToken } from '@/services/auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const getRevisions = async (offerId: string) => {
  const token = getAuthToken();
  const response = await fetch(`${API_URL}/api/v1/offers/${offerId}/revisions`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!response.ok) throw new Error('Failed to fetch revisions');
  return response.json();
};
