import { useCallback } from 'react';
import toast, { Toaster } from 'react-hot-toast';

export interface ToastMessages {
  loading: string;
  success: string;
  error: string;
}

export interface UseToastReturn {
  success: (message: string) => void;
  error: (message: string) => void;
  loading: (message: string) => string;
  promise: <T>(promise: Promise<T>, messages: ToastMessages) => Promise<T>;
  dismiss: (toastId?: string) => void;
  Toaster: typeof Toaster;
}

/**
 * Custom hook for displaying toast notifications using react-hot-toast
 *
 * @example
 * const toast = useToast();
 *
 * // Simple notifications
 * toast.success('İşlem başarılı!');
 * toast.error('Bir hata oluştu');
 *
 * // Promise-based notifications
 * await toast.promise(
 *   fetchData(),
 *   {
 *     loading: 'Yükleniyor...',
 *     success: 'Veriler yüklendi',
 *     error: 'Yükleme başarısız'
 *   }
 * );
 *
 * // Add Toaster component to your app
 * <toast.Toaster position="top-right" />
 */
export function useToast(): UseToastReturn {
  const success = useCallback((message: string) => {
    toast.success(message, {
      duration: 3000,
      position: 'top-right'
    });
  }, []);

  const error = useCallback((message: string) => {
    toast.error(message, {
      duration: 4000,
      position: 'top-right'
    });
  }, []);

  const loading = useCallback((message: string) => {
    return toast.loading(message, {
      position: 'top-right'
    });
  }, []);

  const promiseWrapper = useCallback(
    <T,>(promise: Promise<T>, messages: ToastMessages): Promise<T> => {
      return toast.promise(
        promise,
        {
          loading: messages.loading,
          success: messages.success,
          error: messages.error
        },
        {
          position: 'top-right'
        }
      );
    },
    []
  );

  const dismiss = useCallback((toastId?: string) => {
    if (toastId) {
      toast.dismiss(toastId);
    } else {
      toast.dismiss();
    }
  }, []);

  return {
    success,
    error,
    loading,
    promise: promiseWrapper,
    dismiss,
    Toaster
  };
}
