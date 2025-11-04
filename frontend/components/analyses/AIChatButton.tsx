/**
 * AI Chat Button Component
 * Opens analysis-specific AI chat modal
 */

"use client";

import { useState } from "react";
import { MessageSquare } from "lucide-react";
import AIChatModal from "./AIChatModal";

interface AIChatButtonProps {
  analysisId: string;
  analysisTitle: string;
  candidateCount: number;
}

export default function AIChatButton({
  analysisId,
  analysisTitle,
  candidateCount,
}: AIChatButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200 shadow-md hover:shadow-lg"
        title="AI Asistan ile bu analiz hakkında konuşun"
      >
        <MessageSquare className="w-4 h-4" />
        <span className="font-medium">AI Sohbet</span>
      </button>

      {isOpen && (
        <AIChatModal
          analysisId={analysisId}
          analysisTitle={analysisTitle}
          candidateCount={candidateCount}
          onClose={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
