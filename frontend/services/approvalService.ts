import { getAuthToken } from '@/services/auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

/**
 * Request approval for an offer
 */
export async function requestApproval(offerId: string) {
  const token = getAuthToken();

  const response = await fetch(`${API_URL}/api/v1/offers/${offerId}/request-approval`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to request approval');
  }

  return response.json();
}

/**
 * Approve an offer (ADMIN/MANAGER only)
 */
export async function approveOffer(offerId: string, notes?: string) {
  const token = getAuthToken();

  const response = await fetch(`${API_URL}/api/v1/offers/${offerId}/approve`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ notes: notes || '' })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to approve offer');
  }

  return response.json();
}

/**
 * Reject an offer (ADMIN/MANAGER only)
 */
export async function rejectOffer(offerId: string, reason: string) {
  const token = getAuthToken();

  const response = await fetch(`${API_URL}/api/v1/offers/${offerId}/reject`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ reason })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to reject offer');
  }

  return response.json();
}
