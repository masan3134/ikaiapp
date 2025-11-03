import { getAuthToken } from '@/services/auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const getAttachments = async (offerId: string) => {
  const token = getAuthToken();
  const response = await fetch(`${API_URL}/api/v1/offers/${offerId}/attachments`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!response.ok) throw new Error('Failed to fetch attachments');
  return response.json();
};

export const uploadAttachment = async (offerId: string, file: File) => {
  const token = getAuthToken();
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_URL}/api/v1/offers/${offerId}/attachments`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });
  if (!response.ok) throw new Error('Failed to upload attachment');
  return response.json();
};

export const deleteAttachment = async (attachmentId: string) => {
  const token = getAuthToken();
  const response = await fetch(`${API_URL}/api/v1/offers/attachments/${attachmentId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!response.ok) throw new Error('Failed to delete attachment');
  return response.json();
};
