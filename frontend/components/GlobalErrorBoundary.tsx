/**
 * Global Error Boundary
 *
 * MANDATORY FEATURE: Catch all React errors
 * Automatically logs to centralized error logging system
 *
 * Created: 2025-10-27
 * Status: MANDATORY - Wraps entire app
 */

'use client';

import React from 'react';
import { errorLoggingService } from '@/lib/services/errorLoggingService';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorId: string | null;
}

export class GlobalErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorId: null
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorId: `ERR-${Date.now()}`
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // MANDATORY: Log to centralized system
    errorLoggingService.logReactError(error, errorInfo);

    console.error('[GlobalErrorBoundary] Error caught:', {
      error,
      errorInfo,
      errorId: this.state.errorId
    });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorId: null
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>

            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Bir Hata Oluştu
            </h1>

            <p className="text-gray-600 mb-6">
              Üzgünüz, bir şeyler yanlış gitti. Hata otomatik olarak kaydedildi ve ekibimiz bilgilendirildi.
            </p>

            {/* Error ID for support */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
              <p className="text-xs text-gray-500 mb-1">Hata Kodu:</p>
              <p className="text-sm font-mono font-semibold text-gray-900">
                {this.state.errorId}
              </p>
            </div>

            {/* Error message (dev only) */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-left">
                <p className="text-xs font-semibold text-red-900 mb-2">Debug Info:</p>
                <p className="text-xs text-red-700 font-mono break-all">
                  {this.state.error.message}
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={this.handleReset}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Tekrar Dene
              </button>
              <button
                onClick={() => window.location.href = '/dashboard'}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2"
              >
                <Home className="w-4 h-4" />
                Ana Sayfa
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
