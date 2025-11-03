import { getAuthToken } from '@/services/auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface OfferTemplateCategory {
  id: string;
  name: string;
  description?: string;
  color?: string;
  icon?: string;
  order: number;
  createdAt: string;
  updatedAt: string;
  _count?: { templates: number };
}

export interface OfferTemplate {
  id: string;
  name: string;
  description?: string;
  categoryId?: string;
  position: string;
  department: string;
  salaryMin: number;
  salaryMax: number;
  currency: string;
  benefits: any;
  workType: string;
  terms: string;
  emailSubject: string;
  emailBody: string;
  isActive: boolean;
  usageCount: number;
  createdAt: string;
  updatedAt: string;
  category?: OfferTemplateCategory;
}

/**
 * Category API Functions
 */
export async function fetchCategories() {
  const token = getAuthToken();
  const response = await fetch(`${API_URL}/api/v1/offer-template-categories`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!response.ok) throw new Error('Failed to fetch categories');
  return response.json();
}

export async function createCategory(data: Partial<OfferTemplateCategory>) {
  const token = getAuthToken();
  const response = await fetch(`${API_URL}/api/v1/offer-template-categories`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  if (!response.ok) throw new Error('Failed to create category');
  return response.json();
}

export async function updateCategory(id: string, data: Partial<OfferTemplateCategory>) {
  const token = getAuthToken();
  const response = await fetch(`${API_URL}/api/v1/offer-template-categories/${id}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  if (!response.ok) throw new Error('Failed to update category');
  return response.json();
}

export async function deleteCategory(id: string) {
  const token = getAuthToken();
  const response = await fetch(`${API_URL}/api/v1/offer-template-categories/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!response.ok) throw new Error('Failed to delete category');
  return response.json();
}

/**
 * Template API Functions
 */
export async function fetchTemplates(filters?: { categoryId?: string; isActive?: boolean; search?: string }) {
  const token = getAuthToken();
  const params = new URLSearchParams();
  if (filters?.categoryId) params.append('categoryId', filters.categoryId);
  if (filters?.isActive !== undefined) params.append('isActive', filters.isActive.toString());
  if (filters?.search) params.append('search', filters.search);

  const response = await fetch(`${API_URL}/api/v1/offer-templates?${params}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!response.ok) throw new Error('Failed to fetch templates');
  return response.json();
}

export async function fetchTemplateById(id: string) {
  const token = getAuthToken();
  const response = await fetch(`${API_URL}/api/v1/offer-templates/${id}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!response.ok) throw new Error('Failed to fetch template');
  return response.json();
}

export async function createTemplate(data: Partial<OfferTemplate>) {
  const token = getAuthToken();
  const response = await fetch(`${API_URL}/api/v1/offer-templates`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  if (!response.ok) throw new Error('Failed to create template');
  return response.json();
}

export async function updateTemplate(id: string, data: Partial<OfferTemplate>) {
  const token = getAuthToken();
  const response = await fetch(`${API_URL}/api/v1/offer-templates/${id}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  if (!response.ok) throw new Error('Failed to update template');
  return response.json();
}

export async function deleteTemplate(id: string) {
  const token = getAuthToken();
  const response = await fetch(`${API_URL}/api/v1/offer-templates/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!response.ok) throw new Error('Failed to delete template');
  return response.json();
}

export async function createOfferFromTemplate(templateId: string, overrides: any) {
  const token = getAuthToken();
  const response = await fetch(`${API_URL}/api/v1/offer-templates/${templateId}/create-offer`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(overrides)
  });
  if (!response.ok) throw new Error('Failed to create offer from template');
  return response.json();
}

/**
 * Activate template
 */
export async function activateTemplate(id: string) {
  const token = getAuthToken();
  const response = await fetch(`${API_URL}/api/v1/offer-templates/${id}/activate`, {
    method: 'PATCH',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!response.ok) throw new Error('Failed to activate template');
  return response.json();
}

/**
 * Deactivate template
 */
export async function deactivateTemplate(id: string) {
  const token = getAuthToken();
  const response = await fetch(`${API_URL}/api/v1/offer-templates/${id}/deactivate`, {
    method: 'PATCH',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!response.ok) throw new Error('Failed to deactivate template');
  return response.json();
}

/**
 * Reorder categories
 */
export async function reorderCategories(categoryIds: string[]) {
  const token = getAuthToken();
  const response = await fetch(`${API_URL}/api/v1/offer-template-categories/reorder`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ categoryIds })
  });
  if (!response.ok) throw new Error('Failed to reorder categories');
  return response.json();
}
