import { getAuthToken } from '@/services/auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface JobOffer {
  id: string;
  candidateId: string;
  jobPostingId: string;
  createdBy: string;
  position: string;
  department: string;
  salary: number;
  currency: string;
  startDate: string;
  workType: string;
  benefits: any;
  terms: string;
  status: string;
  sentAt?: string;
  respondedAt?: string;
  expiresAt: string;
  acceptanceToken: string;
  acceptanceUrl?: string;
  emailSent: boolean;
  emailSentAt?: string;
  viewCount: number;
  lastViewedAt?: string;
  createdAt: string;
  updatedAt: string;
  candidate?: any;
  jobPosting?: any;
  creator?: any;
  approver?: any;
}

export interface CreateOfferData {
  candidateId: string;
  jobPostingId: string;
  position: string;
  department: string;
  salary: number;
  currency?: string;
  startDate: string;
  workType: string;
  benefits: any;
  terms: string;
}

export interface OfferFilters {
  status?: string;
  candidateId?: string;
  createdBy?: string;
  page?: number;
  limit?: number;
}

/**
 * Fetch all offers with filters
 * Feature #5: Teklif Listeleme
 */
export async function fetchOffers(filters: OfferFilters = {}) {
  const token = getAuthToken();
  const queryParams = new URLSearchParams();

  if (filters.status) queryParams.append('status', filters.status);
  if (filters.candidateId) queryParams.append('candidateId', filters.candidateId);
  if (filters.createdBy) queryParams.append('createdBy', filters.createdBy);
  if (filters.page) queryParams.append('page', filters.page.toString());
  if (filters.limit) queryParams.append('limit', filters.limit.toString());

  const url = `${API_URL}/api/v1/offers?${queryParams.toString()}`;

  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error('Failed to fetch offers');
  }

  return response.json();
}

/**
 * Fetch single offer by ID
 * Feature #6: Teklif Detay Görüntüleme
 */
export async function fetchOfferById(id: string): Promise<JobOffer> {
  const token = getAuthToken();

  const response = await fetch(`${API_URL}/api/v1/offers/${id}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error('Failed to fetch offer');
  }

  const result = await response.json();
  return result.data;
}

/**
 * Create new offer
 * Feature #1: Teklif Oluşturma
 */
export async function createOffer(data: CreateOfferData): Promise<JobOffer> {
  const token = getAuthToken();

  const response = await fetch(`${API_URL}/api/v1/offers`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create offer');
  }

  const result = await response.json();
  return result.data;
}

/**
 * Update offer
 */
export async function updateOffer(id: string, data: Partial<CreateOfferData>): Promise<JobOffer> {
  const token = getAuthToken();

  const response = await fetch(`${API_URL}/api/v1/offers/${id}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to update offer');
  }

  const result = await response.json();
  return result.data;
}

/**
 * Delete offer
 */
export async function deleteOffer(id: string): Promise<void> {
  const token = getAuthToken();

  const response = await fetch(`${API_URL}/api/v1/offers/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to delete offer');
  }
}

/**
 * Send offer email
 * Features #2 + #3: PDF + Email
 */
export async function sendOffer(id: string) {
  const token = getAuthToken();

  const response = await fetch(`${API_URL}/api/v1/offers/${id}/send`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to send offer');
  }

  return response.json();
}

/**
 * Preview PDF in browser
 * Feature #2: PDF Oluşturma
 */
export async function previewPdf(id: string): Promise<Blob> {
  const token = getAuthToken();

  const response = await fetch(`${API_URL}/api/v1/offers/${id}/preview-pdf`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    throw new Error('Failed to preview PDF');
  }

  return response.blob();
}

/**
 * Download PDF
 */
export async function downloadPdf(id: string): Promise<Blob> {
  const token = getAuthToken();

  const response = await fetch(`${API_URL}/api/v1/offers/${id}/download-pdf`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    throw new Error('Failed to download PDF');
  }

  return response.blob();
}

/**
 * Bulk send offers
 * Feature #19: Toplu Teklif Gönderme
 */
export async function bulkSendOffers(offerIds: string[]) {
  const token = getAuthToken();

  const response = await fetch(`${API_URL}/api/v1/offers/bulk-send`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ offerIds })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Toplu gönderme başarısız');
  }

  return response.json();
}

/**
 * Bulk delete offers
 */
export async function bulkDeleteOffers(offerIds: string[]): Promise<void> {
  const token = getAuthToken();

  // Delete işlemlerini paralel olarak yap
  const deletePromises = offerIds.map(id =>
    fetch(`${API_URL}/api/v1/offers/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }).then(response => {
      if (!response.ok) {
        throw new Error(`Failed to delete offer ${id}`);
      }
      return response.json();
    })
  );

  await Promise.all(deletePromises);
}
