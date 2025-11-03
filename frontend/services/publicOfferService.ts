const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function getOfferByToken(token: string) {
  const response = await fetch(`${API_URL}/api/v1/offers/public/${token}`);
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch offer');
  }
  return response.json();
}

export async function acceptOffer(token: string) {
  const response = await fetch(`${API_URL}/api/v1/offers/public/${token}/accept`, {
    method: 'PATCH',
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to accept offer');
  }
  return response.json();
}

export async function rejectOffer(token: string, reason: string) {
  const response = await fetch(`${API_URL}/api/v1/offers/public/${token}/reject`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ reason }),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to reject offer');
  }
  return response.json();
}