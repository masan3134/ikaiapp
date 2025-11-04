/**
 * Error Logging Service (Frontend)
 *
 * MANDATORY FEATURE: Centralized Error Logging
 * Automatically sends all frontend errors to backend
 *
 * Created: 2025-10-27
 * Status: MANDATORY - Must be used in all components
 */

import axios from 'axios';

// Get API URL with browser-side override for Docker internal hostnames
const getAPIURL = () => {
  const envURL = process.env.NEXT_PUBLIC_API_URL;

  // If running in browser and env URL uses Docker internal hostname, use localhost
  if (typeof window !== 'undefined' && envURL?.includes('ikai-backend')) {
    return 'http://localhost:8102';
  }

  // Otherwise use env URL or fallback to localhost:8102
  return envURL || 'http://localhost:8102';
};

const API_BASE_URL = getAPIURL();

interface ErrorData {
  message: string;
  stack?: string;
  url?: string;
  componentStack?: string;
  userAgent?: string;
  metadata?: any;
}

class ErrorLoggingService {
  /**
   * Log error to backend
   * @param error - Error object or string
   * @param metadata - Additional context
   */
  async logError(error: Error | string, metadata: any = {}) {
    try {
      const errorData: ErrorData = {
        message: typeof error === 'string' ? error : error.message,
        stack: typeof error === 'object' ? error.stack : undefined,
        url: typeof window !== 'undefined' ? window.location.href : undefined,
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
        metadata: {
          ...metadata,
          timestamp: new Date().toISOString(),
          userLanguage: typeof navigator !== 'undefined' ? navigator.language : undefined
        }
      };

      // Send to backend (non-blocking, don't await)
      axios.post(`${API_BASE_URL}/api/v1/errors/log`, errorData)
        .then(response => {
          console.log('[ErrorLogging] Error logged:', response.data.errorId);
        })
        .catch(err => {
          // Silently fail - don't break user experience if logging fails
          console.error('[ErrorLogging] Failed to log error:', err.message);
        });

      // Also log to console in development
      if (process.env.NODE_ENV === 'development') {
        console.error('[IKAI Error]', errorData);
      }
    } catch (err) {
      // Ultimate fallback
      console.error('[ErrorLogging] Logging system failed:', err);
    }
  }

  /**
   * Log React component error
   * @param error - Error object
   * @param errorInfo - React error info
   */
  async logReactError(error: Error, errorInfo: { componentStack: string }) {
    await this.logError(error, {
      componentStack: errorInfo.componentStack,
      errorType: 'React Component Error'
    });
  }

  /**
   * Log API error
   * @param error - Axios error
   * @param endpoint - API endpoint
   */
  async logAPIError(error: any, endpoint: string) {
    await this.logError(error, {
      endpoint,
      status: error.response?.status,
      statusText: error.response?.statusText,
      responseData: error.response?.data,
      errorType: 'API Error'
    });
  }

  /**
   * Log unhandled promise rejection
   * @param reason - Rejection reason
   */
  async logUnhandledRejection(reason: any) {
    await this.logError(
      reason instanceof Error ? reason : new Error(String(reason)),
      { errorType: 'Unhandled Promise Rejection' }
    );
  }
}

// Singleton instance
export const errorLoggingService = new ErrorLoggingService();

// Auto-setup global error handlers (browser only)
if (typeof window !== 'undefined') {
  // Catch unhandled errors
  window.addEventListener('error', (event) => {
    errorLoggingService.logError(event.error || event.message, {
      errorType: 'Uncaught Error',
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno
    });
  });

  // Catch unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    errorLoggingService.logUnhandledRejection(event.reason);
  });
}
