import {
  parseApiError,
  isAuthError,
  isNetworkError,
  isValidationError,
  getValidationErrors,
  ApiError
} from '../errorHandler';

describe('errorHandler', () => {
  describe('ApiError', () => {
    it('should create an ApiError with message', () => {
      const error = new ApiError('Test error');
      expect(error.message).toBe('Test error');
      expect(error.name).toBe('ApiError');
      expect(error.statusCode).toBeUndefined();
      expect(error.errorType).toBeUndefined();
    });

    it('should create an ApiError with status code and type', () => {
      const error = new ApiError('Test error', 404, 'NOT_FOUND');
      expect(error.message).toBe('Test error');
      expect(error.statusCode).toBe(404);
      expect(error.errorType).toBe('NOT_FOUND');
    });
  });

  describe('parseApiError', () => {
    it('should return network error message when no response', () => {
      const error = { message: 'Network Error' };
      expect(parseApiError(error)).toBe('Bağlantı hatası. İnternet bağlantınızı kontrol edin.');
    });

    it('should return custom error message from API', () => {
      const error = {
        response: {
          data: {
            message: 'Kullanıcı bulunamadı'
          }
        }
      };
      expect(parseApiError(error)).toBe('Kullanıcı bulunamadı');
    });

    it('should return 401 unauthorized message', () => {
      const error = {
        response: {
          status: 401
        }
      };
      expect(parseApiError(error)).toBe('Oturum süreniz doldu. Lütfen tekrar giriş yapın.');
    });

    it('should return 404 not found message', () => {
      const error = {
        response: {
          status: 404
        }
      };
      expect(parseApiError(error)).toBe('Kayıt bulunamadı');
    });

    it('should return 500 server error message', () => {
      const error = {
        response: {
          status: 500
        }
      };
      expect(parseApiError(error)).toBe('Sunucu hatası. Lütfen daha sonra tekrar deneyin.');
    });

    it('should return default error message for unknown status', () => {
      const error = {
        response: {
          status: 418 // I'm a teapot
        }
      };
      expect(parseApiError(error)).toBe('Bir hata oluştu. Lütfen tekrar deneyin.');
    });
  });

  describe('isAuthError', () => {
    it('should return true for 401 error', () => {
      const error = {
        response: {
          status: 401
        }
      };
      expect(isAuthError(error)).toBe(true);
    });

    it('should return false for non-401 error', () => {
      const error = {
        response: {
          status: 404
        }
      };
      expect(isAuthError(error)).toBe(false);
    });

    it('should return false for network error', () => {
      const error = { message: 'Network Error' };
      expect(isAuthError(error)).toBe(false);
    });
  });

  describe('isNetworkError', () => {
    it('should return true when no response', () => {
      const error = { message: 'Network Error' };
      expect(isNetworkError(error)).toBe(true);
    });

    it('should return true for ECONNABORTED', () => {
      const error = { code: 'ECONNABORTED' };
      expect(isNetworkError(error)).toBe(true);
    });

    it('should return true for ERR_NETWORK', () => {
      const error = { code: 'ERR_NETWORK' };
      expect(isNetworkError(error)).toBe(true);
    });

    it('should return false for API error with response', () => {
      const error = {
        response: {
          status: 500
        }
      };
      expect(isNetworkError(error)).toBe(false);
    });
  });

  describe('isValidationError', () => {
    it('should return true for 400 error', () => {
      const error = {
        response: {
          status: 400
        }
      };
      expect(isValidationError(error)).toBe(true);
    });

    it('should return true for 422 error', () => {
      const error = {
        response: {
          status: 422
        }
      };
      expect(isValidationError(error)).toBe(true);
    });

    it('should return false for other errors', () => {
      const error = {
        response: {
          status: 500
        }
      };
      expect(isValidationError(error)).toBe(false);
    });
  });

  describe('getValidationErrors', () => {
    it('should extract field validation errors', () => {
      const error = {
        response: {
          data: {
            details: [
              { field: 'email', message: 'Email geçersiz' },
              { field: 'password', message: 'Şifre çok kısa' }
            ]
          }
        }
      };
      const errors = getValidationErrors(error);
      expect(errors).toEqual({
        email: 'Email geçersiz',
        password: 'Şifre çok kısa'
      });
    });

    it('should return empty object when no details', () => {
      const error = {
        response: {
          data: {}
        }
      };
      expect(getValidationErrors(error)).toEqual({});
    });

    it('should return empty object for invalid details format', () => {
      const error = {
        response: {
          data: {
            details: [
              { invalid: 'format' }
            ]
          }
        }
      };
      expect(getValidationErrors(error)).toEqual({});
    });
  });
});
