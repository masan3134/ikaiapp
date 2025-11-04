"use client";

import { Loader2 } from "lucide-react";

export default function AnalysisResultProcessingCard() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-blue-200 p-4 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
          <div>
            <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-48"></div>
          </div>
        </div>
        <div className="flex items-center gap-2 text-blue-600">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="font-medium text-sm">Isleniyor...</span>
        </div>
      </div>
    </div>
  );
}
