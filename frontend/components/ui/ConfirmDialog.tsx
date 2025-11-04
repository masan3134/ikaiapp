"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import Button from "./Button";

export interface ConfirmDialogProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning";
  loading?: boolean;
}

export default function ConfirmDialog({
  isOpen,
  onConfirm,
  onCancel,
  title,
  message,
  confirmText = "Onayla",
  cancelText = "İptal",
  variant = "warning",
  loading = false,
}: ConfirmDialogProps) {
  // Close on ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !loading) onCancel();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
    }

    return () => {
      document.removeEventListener("keydown", handleEsc);
    };
  }, [isOpen, onCancel, loading]);

  if (!isOpen) return null;

  const variantConfig = {
    danger: {
      icon: "bg-red-100 text-red-600",
      button: "danger" as const,
    },
    warning: {
      icon: "bg-yellow-100 text-yellow-600",
      button: "primary" as const,
    },
  };

  const config = variantConfig[variant];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onCancel}
      />

      {/* Dialog */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6 transform transition-all"
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-labelledby="dialog-title"
          aria-describedby="dialog-description"
        >
          {/* Icon */}
          <div
            className={`mx-auto flex items-center justify-center h-12 w-12 rounded-full ${config.icon} mb-4`}
          >
            <AlertTriangle className="h-6 w-6" />
          </div>

          {/* Content */}
          <div className="text-center">
            <h3
              id="dialog-title"
              className="text-lg font-semibold text-gray-900 mb-2"
            >
              {title}
            </h3>
            <p id="dialog-description" className="text-sm text-gray-600">
              {message}
            </p>
          </div>

          {/* Actions */}
          <div className="mt-6 flex gap-3 justify-end">
            <Button variant="ghost" onClick={onCancel} disabled={loading}>
              {cancelText}
            </Button>
            <Button
              variant={config.button}
              onClick={onConfirm}
              loading={loading}
            >
              {confirmText}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
