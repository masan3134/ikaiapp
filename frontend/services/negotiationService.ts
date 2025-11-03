import { getAuthToken } from '@/services/auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const getNegotiations = async (offerId: string) => {
  const token = getAuthToken();
  const response = await fetch(`${API_URL}/api/v1/offers/${offerId}/negotiations`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!response.ok) throw new Error('Failed to fetch negotiations');
  return response.json();
};

export const createNegotiation = async (offerId: string, data: any) => {
  const token = getAuthToken();
  const response = await fetch(`${API_URL}/api/v1/offers/${offerId}/negotiations`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to create negotiation');
  return response.json();
};

export const respondToNegotiation = async (negotiationId: string, data: any) => {
  const token = getAuthToken();
  const response = await fetch(`${API_URL}/api/v1/negotiations/${negotiationId}/respond`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to respond to negotiation');
  return response.json();
};
