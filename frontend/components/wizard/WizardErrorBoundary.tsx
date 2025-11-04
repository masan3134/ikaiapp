"use client";

import React, { Component, ReactNode } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { useRouter } from "next/navigation";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

class WizardErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log to console in development
    if (process.env.NODE_ENV === "development") {
      console.error("Wizard Error Boundary caught an error:", error, errorInfo);
    }

    // Update state with error details
    this.setState({
      error,
      errorInfo,
    });

    // TODO: Send to error tracking service (Sentry, etc.)
    // logErrorToService(error, errorInfo);
  }

  handleReset = () => {
    // Clear wizard store
    const { useWizardStore } = require("@/lib/store/wizardStore");
    useWizardStore.getState().resetWizard();

    // Reset error boundary state
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="max-w-2xl w-full">
            {/* Error Card */}
            <div className="bg-white rounded-xl shadow-lg border-2 border-red-200 p-8">
              {/* Icon */}
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-10 h-10 text-red-600" />
                </div>
              </div>

              {/* Title */}
              <h1 className="text-3xl font-bold text-gray-900 text-center mb-3">
                Bir Hata Oluştu
              </h1>

              {/* Description */}
              <p className="text-gray-700 text-center mb-6">
                Analiz sihirbazında beklenmeyen bir hata meydana geldi. Lütfen
                sayfayı yenileyin veya ana sayfaya dönün.
              </p>

              {/* Error Details (Development Only) */}
              {process.env.NODE_ENV === "development" && this.state.error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm font-bold text-red-900 mb-2">
                    Hata Detayları (Dev):
                  </p>
                  <p className="text-xs text-red-800 font-mono mb-2">
                    {this.state.error.toString()}
                  </p>
                  {this.state.errorInfo && (
                    <details className="text-xs text-red-700">
                      <summary className="cursor-pointer font-medium mb-1">
                        Stack Trace
                      </summary>
                      <pre className="whitespace-pre-wrap mt-2 p-2 bg-red-100 rounded overflow-x-auto">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </details>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={this.handleReset}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
                >
                  <RefreshCw className="w-5 h-5" />
                  Sihirbazı Sıfırla
                </button>

                <a
                  href="/dashboard"
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-white text-gray-700 border-2 border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                >
                  <Home className="w-5 h-5" />
                  Ana Sayfaya Dön
                </a>
              </div>

              {/* Support Info */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-600 text-center">
                  Sorun devam ederse lütfen destek ekibiyle iletişime geçin.
                </p>
              </div>
            </div>

            {/* Tips Card */}
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">💡 İpuçları:</h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Tarayıcı önbelleğini temizlemeyi deneyin</li>
                <li>• Farklı bir tarayıcı kullanmayı deneyin</li>
                <li>• Sayfayı yenileyip tekrar deneyin</li>
                <li>
                  • Dosya boyutlarının 10MB'ın altında olduğundan emin olun
                </li>
              </ul>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Functional wrapper for router access
export default function WizardErrorBoundaryWrapper({
  children,
}: {
  children: ReactNode;
}) {
  return <WizardErrorBoundary>{children}</WizardErrorBoundary>;
}
