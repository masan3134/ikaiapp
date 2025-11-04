import apiClient from '@/lib/utils/apiClient';

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
  const response = await apiClient.get('/api/v1/offer-template-categories');
  return response.data;
}

export async function createCategory(data: Partial<OfferTemplateCategory>) {
  const response = await apiClient.post('/api/v1/offer-template-categories', data);
  return response.data;
}

export async function updateCategory(id: string, data: Partial<OfferTemplateCategory>) {
  const response = await apiClient.put(`/api/v1/offer-template-categories/${id}`, data);
  return response.data;
}

export async function deleteCategory(id: string) {
  const response = await apiClient.delete(`/api/v1/offer-template-categories/${id}`);
  return response.data;
}

/**
 * Template API Functions
 */
export async function fetchTemplates(filters?: { categoryId?: string; isActive?: boolean; search?: string }) {
  const params = new URLSearchParams();
  if (filters?.categoryId) params.append('categoryId', filters.categoryId);
  if (filters?.isActive !== undefined) params.append('isActive', filters.isActive.toString());
  if (filters?.search) params.append('search', filters.search);

  const response = await apiClient.get(`/api/v1/offer-templates?${params}`);
  return response.data;
}

export async function fetchTemplateById(id: string) {
  const response = await apiClient.get(`/api/v1/offer-templates/${id}`);
  return response.data;
}

export async function createTemplate(data: Partial<OfferTemplate>) {
  const response = await apiClient.post('/api/v1/offer-templates', data);
  return response.data;
}

export async function updateTemplate(id: string, data: Partial<OfferTemplate>) {
  const response = await apiClient.put(`/api/v1/offer-templates/${id}`, data);
  return response.data;
}

export async function deleteTemplate(id: string) {
  const response = await apiClient.delete(`/api/v1/offer-templates/${id}`);
  return response.data;
}

export async function createOfferFromTemplate(templateId: string, overrides: any) {
  const response = await apiClient.post(`/api/v1/offer-templates/${templateId}/create-offer`, overrides);
  return response.data;
}

/**
 * Activate template
 */
export async function activateTemplate(id: string) {
  const response = await apiClient.patch(`/api/v1/offer-templates/${id}/activate`);
  return response.data;
}

/**
 * Deactivate template
 */
export async function deactivateTemplate(id: string) {
  const response = await apiClient.patch(`/api/v1/offer-templates/${id}/deactivate`);
  return response.data;
}

/**
 * Reorder categories
 */
export async function reorderCategories(categoryIds: string[]) {
  const response = await apiClient.patch('/api/v1/offer-template-categories/reorder', { categoryIds });
  return response.data;
}
