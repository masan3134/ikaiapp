/**
 * AI Chat Message Component
 * Displays individual chat messages
 */

"use client";

import { User, Bot } from "lucide-react";
import type { ChatMessage } from "@/lib/services/analysisChatService";

interface AIChatMessageProps {
  message: ChatMessage;
}

export default function AIChatMessage({ message }: AIChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <div
      className={`flex gap-3 mb-4 ${isUser ? "justify-end" : "justify-start"}`}
    >
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
          <Bot className="w-5 h-5 text-purple-600" />
        </div>
      )}

      <div
        className={`max-w-[75%] rounded-lg px-4 py-3 ${
          isUser
            ? "bg-blue-600 text-white"
            : "bg-gray-100 text-gray-900 border border-gray-200"
        }`}
      >
        <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
          {message.content}
        </p>

        {message.timestamp && (
          <p
            className={`text-xs mt-2 ${isUser ? "text-blue-100" : "text-gray-500"}`}
          >
            {new Date(message.timestamp).toLocaleTimeString("tr-TR", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        )}
      </div>

      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
          <User className="w-5 h-5 text-blue-600" />
        </div>
      )}
    </div>
  );
}
