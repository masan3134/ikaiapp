import apiClient from "./authService";

export interface TeamMember {
  id: string;
  email: string;
  name: string;
  role: "USER" | "ADMIN" | "MANAGER" | "HR_SPECIALIST" | "SUPER_ADMIN";
  isActive: boolean;
  isOnboarded: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TeamListResponse {
  success: boolean;
  data: {
    users: TeamMember[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
}

export interface InviteRequest {
  email: string;
  role: string;
  name?: string;
}

export interface UpdateRequest {
  role?: string;
  name?: string;
  isActive?: boolean;
}

/**
 * Get team members list
 */
export async function getTeamMembers(
  page: number = 1,
  limit: number = 10,
  search: string = "",
  role: string = ""
): Promise<TeamListResponse> {
  const params = new URLSearchParams();
  params.append("page", page.toString());
  params.append("limit", limit.toString());
  if (search) params.append("search", search);
  if (role) params.append("role", role);

  const response = await apiClient.get<TeamListResponse>(
    `/api/v1/team?${params.toString()}`
  );
  return response.data;
}

/**
 * Get single team member
 */
export async function getTeamMember(id: string): Promise<TeamMember> {
  const response = await apiClient.get<{ success: boolean; data: TeamMember }>(
    `/api/v1/team/${id}`
  );
  return response.data.data;
}

/**
 * Invite team member
 */
export async function inviteTeamMember(
  data: InviteRequest
): Promise<TeamMember> {
  const response = await apiClient.post<{ success: boolean; data: TeamMember }>(
    "/api/v1/team/invite",
    data
  );
  return response.data.data;
}

/**
 * Update team member
 */
export async function updateTeamMember(
  id: string,
  data: UpdateRequest
): Promise<TeamMember> {
  const response = await apiClient.patch<{
    success: boolean;
    data: TeamMember;
  }>(`/api/v1/team/${id}`, data);
  return response.data.data;
}

/**
 * Toggle team member active status
 */
export async function toggleTeamMember(id: string): Promise<TeamMember> {
  const response = await apiClient.patch<{
    success: boolean;
    data: TeamMember;
  }>(`/api/v1/team/${id}/toggle`);
  return response.data.data;
}

/**
 * Delete team member
 */
export async function deleteTeamMember(id: string): Promise<void> {
  await apiClient.delete(`/api/v1/team/${id}`);
}
