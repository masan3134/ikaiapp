"use client";

import { CheckCircle, Clock, XCircle, AlertCircle } from "lucide-react";
import Badge from "@/components/ui/Badge";

export interface AnalysisStatusBadgeProps {
  status: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";
  hasError?: boolean;
  hasResults?: boolean;
}

export default function AnalysisStatusBadge({
  status,
  hasError,
  hasResults,
}: AnalysisStatusBadgeProps) {
  // Check for partial success
  const isPartialSuccess = status === "COMPLETED" && hasError && hasResults;

  const statusConfig = {
    COMPLETED: {
      variant: isPartialSuccess ? ("warning" as const) : ("success" as const),
      icon: isPartialSuccess ? (
        <AlertCircle className="w-3 h-3" />
      ) : (
        <CheckCircle className="w-3 h-3" />
      ),
      label: isPartialSuccess ? "Kısmi Başarılı" : "Tamamlandı",
    },
    PROCESSING: {
      variant: "info" as const,
      icon: <Clock className="w-3 h-3 animate-spin" />,
      label: "İşleniyor",
    },
    FAILED: {
      variant: "error" as const,
      icon: <XCircle className="w-3 h-3" />,
      label: "Başarısız",
    },
    PENDING: {
      variant: "warning" as const,
      icon: <AlertCircle className="w-3 h-3" />,
      label: "Bekliyor",
    },
  };

  const config = statusConfig[status];

  return (
    <Badge variant={config.variant} icon={config.icon}>
      {config.label}
    </Badge>
  );
}
