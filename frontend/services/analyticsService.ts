import { api } from './api'; // Assuming you have a configured axios instance

export const getAnalyticsOverview = async (filters: any = {}) => {
  const response = await api.get('/offers/analytics/overview', { params: filters });
  return response.data.data;
};

export const getAcceptanceRate = async (filters: any = {}) => {
  const response = await api.get('/offers/analytics/acceptance-rate', { params: filters });
  return response.data.data;
};

export const getAverageResponseTime = async (filters: any = {}) => {
  const response = await api.get('/offers/analytics/response-time', { params: filters });
  return response.data.data;
};

export const getByDepartment = async (filters: any = {}) => {
  const response = await api.get('/offers/analytics/by-department', { params: filters });
  return response.data.data;
};
