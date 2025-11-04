/**
 * Axios Error Interceptor
 *
 * MANDATORY FEATURE: Auto-log all API errors
 * Intercepts axios errors and sends to error logging service
 *
 * Created: 2025-10-27
 * Status: MANDATORY
 */

import axios from "axios";
import { errorLoggingService } from "@/lib/services/errorLoggingService";

/**
 * Setup axios error interceptor
 * Call this once in app initialization
 */
export function setupAxiosErrorInterceptor() {
  // Response interceptor
  axios.interceptors.response.use(
    (response) => {
      // Success - pass through
      return response;
    },
    (error) => {
      // Log API error automatically
      const endpoint = error.config?.url || "unknown";

      errorLoggingService.logAPIError(error, endpoint);

      // Pass error along to caller
      return Promise.reject(error);
    }
  );

  console.log("[IKAI] Axios error interceptor configured");
}
