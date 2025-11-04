import apiClient from "@/lib/utils/apiClient";

export interface QueueStats {
  name: string;
  waiting: number;
  active: number;
  completed: number;
  failed: number;
  delayed: number;
  total: number;
}

export interface SystemHealth {
  timestamp: string;
  queues: QueueStats[];
  totals: {
    waiting: number;
    active: number;
    completed: number;
    failed: number;
    delayed: number;
  };
  gemini: {
    requestsInWindow: number;
    maxRequests: number;
    windowMs: number;
    minInterval: number;
    availableSlots: number;
  };
  health: {
    status: "healthy" | "degraded";
    activeJobs: number;
    pendingJobs: number;
    failedJobs: number;
  };
}

export async function getQueueStats(): Promise<{ stats: QueueStats[] }> {
  const response = await apiClient.get("/queue/stats");
  return response.data;
}

export async function getSystemHealth(): Promise<SystemHealth> {
  const response = await apiClient.get("/queue/health");
  return response.data;
}

export async function cleanupOldJobs(): Promise<{ results: any[] }> {
  const response = await apiClient.post("/queue/cleanup");
  return response.data;
}
