/**
 * Analysis Chat Service
 * API client for analysis-specific AI chat
 */

import apiClient from "./authService";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp?: string;
}

export interface ChatResponse {
  success: boolean;
  reply: string;
  sources: Array<{
    type: string;
    score: number;
    metadata: any;
  }>;
  facts?: {
    analysisId: string;
    version: number;
    candidateCount: number;
    jobTitle: string;
    updatedAt: string;
    status: string;
  };
  version?: number;
  versionChanged?: boolean;
  bypassedLLM?: boolean;
  timestamp: string;
}

export interface ChatStats {
  success: boolean;
  contextLoaded: boolean;
  stats?: {
    analysisId: string;
    totalChunks: number;
    chunkTypes: {
      summary: number;
      job: number;
      candidate: number;
      top_candidates: number;
    };
    lastUpdate: string;
  };
}

export async function sendChatMessage(
  analysisId: string,
  message: string,
  conversationHistory: ChatMessage[] = [],
  clientVersion?: number | null
): Promise<ChatResponse> {
  try {
    const response = await apiClient.post(
      `/api/v1/analyses/${analysisId}/chat`,
      {
        message,
        conversationHistory,
        clientVersion, // Version tracking
      }
    );
    return response.data;
  } catch (error: any) {
    // Mark 503 errors as expected to suppress console noise
    if (error.response?.status === 503) {
      error.isExpectedError = true;
    }
    throw error;
  }
}

/**
 * Prepare chat context (deprecated - context auto-prepares on first chat)
 * Now just checks if chat service is available via stats
 */
export async function prepareChatContext(analysisId: string): Promise<any> {
  try {
    // Just check if chat is ready (getChatStats does the actual check)
    const stats = await getChatStats(analysisId);
    return { success: true, message: "Chat service ready", stats };
  } catch (error: any) {
    // Mark 503 errors as expected (Milvus not available)
    if (error.response?.status === 503) {
      error.isExpectedError = true;
    }
    throw error;
  }
}

export async function getChatStats(analysisId: string): Promise<ChatStats> {
  try {
    const response = await apiClient.get(
      `/api/v1/analyses/${analysisId}/chat-stats`
    );
    return response.data;
  } catch (error: any) {
    // Mark 503 errors as expected to suppress console noise
    if (error.response?.status === 503) {
      error.isExpectedError = true;
    }
    throw error;
  }
}

export async function deleteChatContext(analysisId: string): Promise<any> {
  const response = await apiClient.delete(
    `/api/v1/analyses/${analysisId}/chat-context`
  );
  return response.data;
}
