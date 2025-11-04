import apiClient from "@/lib/utils/apiClient";

export interface JobOffer {
  id: string;
  candidateId: string;
  jobPostingId: string;
  templateId?: string;
  title: string;
  department: string;
  position: string;
  salary: number;
  currency: string;
  startDate: string;
  status:
    | "DRAFT"
    | "SENT"
    | "ACCEPTED"
    | "REJECTED"
    | "NEGOTIATING"
    | "WITHDRAWN"
    | "EXPIRED";
  benefits?: string[];
  conditions?: string[];
  sentAt?: string;
  respondedAt?: string;
  expiresAt?: string;
  createdAt: string;
  updatedAt: string;
  jobPosting?: {
    id: string;
    title: string;
    department: string;
  };
}

class OfferService {
  // Get all offers with optional filters
  async getOffers(filters?: any) {
    const response = await apiClient.get(`/api/v1/offers`, {
      params: filters,
    });
    return response.data;
  }

  // Get offer by ID
  async getOfferById(id: string) {
    const response = await apiClient.get(`/api/v1/offers/${id}`);
    return response.data;
  }

  // Create new offer
  async createOffer(data: any) {
    const response = await apiClient.post(`/api/v1/offers`, data);
    return response.data;
  }

  // Update offer
  async updateOffer(id: string, data: any) {
    const response = await apiClient.put(`/api/v1/offers/${id}`, data);
    return response.data;
  }

  // Delete offer
  async deleteOffer(id: string) {
    const response = await apiClient.delete(`/api/v1/offers/${id}`);
    return response.data;
  }

  // Send offer to candidate
  async sendOffer(id: string) {
    const response = await apiClient.post(`/api/v1/offers/${id}/send`);
    return response.data;
  }

  // Approve offer
  async approveOffer(id: string, notes?: string) {
    const response = await apiClient.post(`/api/v1/offers/${id}/approve`, {
      notes,
    });
    return response.data;
  }

  // Reject offer
  async rejectOffer(id: string, notes?: string) {
    const response = await apiClient.post(`/api/v1/offers/${id}/reject`, {
      notes,
    });
    return response.data;
  }
}

export default new OfferService();
