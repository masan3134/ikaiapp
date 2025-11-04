import apiClient from "@/lib/utils/apiClient";

export interface TestQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface TestSubmission {
  id: string;
  testId: string;
  candidateId?: string;
  candidateEmail: string;
  candidateName?: string;
  answers: any[];
  score: number;
  correctCount: number;
  attemptNumber: number;
  startedAt: string;
  completedAt: string;
  metadata?: any;
}

// Get public test by token (for candidates)
export async function getPublicTest(token: string) {
  const response = await apiClient.get(`/api/v1/tests/public/${token}`);
  return response.data;
}

// Submit test answers (public)
export async function submitTest(
  token: string,
  data: {
    candidateEmail: string;
    candidateName?: string;
    answers: any[];
    startedAt: string;
  }
) {
  const response = await apiClient.post(
    `/api/v1/tests/public/${token}/submit`,
    data
  );
  return response.data;
}

// Get test submissions by email
export async function getTestSubmissionsByEmail(candidateEmail: string) {
  const response = await apiClient.get(`/api/v1/tests/submissions`, {
    params: { candidateEmail },
  });
  return response.data;
}

// Generate test (for analysis wizard)
export async function generateTest(data: {
  jobPostingId: string;
  analysisId?: string;
}) {
  const response = await apiClient.post(`/api/v1/tests/generate`, data);
  return response.data;
}

// Send test email
export async function sendTestEmail(
  testId: string,
  data: { recipientEmail: string; recipientName?: string }
) {
  const response = await apiClient.post(
    `/api/v1/tests/${testId}/send-email`,
    data
  );
  return response.data;
}
