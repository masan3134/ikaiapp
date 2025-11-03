/**
 * Error handling utilities
 */

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public errorType?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Parse API error and return user-friendly message
 */
export function parseApiError(error: any): string {
  // Network error
  if (!error.response) {
    return 'Bağlantı hatası. İnternet bağlantınızı kontrol edin.';
  }

  // API error with message
  if (error.response?.data?.message) {
    return error.response.data.message;
  }

  // HTTP status code messages
  const statusMessages: Record<number, string> = {
    400: 'Geçersiz istek',
    401: 'Oturum süreniz doldu. Lütfen tekrar giriş yapın.',
    403: 'Bu işlem için yetkiniz yok',
    404: 'Kayıt bulunamadı',
    409: 'Bu kayıt zaten mevcut',
    422: 'Gönderilen veriler geçersiz',
    500: 'Sunucu hatası. Lütfen daha sonra tekrar deneyin.',
    503: 'Servis şu anda kullanılamıyor'
  };

  const status = error.response?.status;
  if (status && statusMessages[status]) {
    return statusMessages[status];
  }

  // Default error message
  return 'Bir hata oluştu. Lütfen tekrar deneyin.';
}

/**
 * Check if error is authentication error
 */
export function isAuthError(error: any): boolean {
  return error.response?.status === 401;
}

/**
 * Check if error is network error
 */
export function isNetworkError(error: any): boolean {
  return !error.response || error.code === 'ECONNABORTED' || error.code === 'ERR_NETWORK';
}

/**
 * Check if error is validation error
 */
export function isValidationError(error: any): boolean {
  return error.response?.status === 400 || error.response?.status === 422;
}

/**
 * Extract validation errors from API response
 */
export function getValidationErrors(error: any): Record<string, string> {
  const errors: Record<string, string> = {};

  if (error.response?.data?.details && Array.isArray(error.response.data.details)) {
    error.response.data.details.forEach((detail: any) => {
      if (detail.field && detail.message) {
        errors[detail.field] = detail.message;
      }
    });
  }

  return errors;
}
