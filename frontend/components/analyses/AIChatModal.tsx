/**
 * AI Chat Modal Component
 * Analysis-specific AI chatbot interface
 */

"use client";

import { useState, useEffect, useRef } from "react";
import { X, Send, Loader2, Sparkles, AlertCircle } from "lucide-react";
import AIChatMessage from "./AIChatMessage";
import {
  sendChatMessage,
  getChatStats,
  prepareChatContext,
  type ChatMessage,
} from "@/lib/services/analysisChatService";
import { useToast } from "@/lib/hooks/useToast";

interface AIChatModalProps {
  analysisId: string;
  analysisTitle: string;
  candidateCount: number;
  onClose: () => void;
}

export default function AIChatModal({
  analysisId,
  analysisTitle,
  candidateCount,
  onClose,
}: AIChatModalProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [contextLoading, setContextLoading] = useState(true);
  const [contextLoaded, setContextLoaded] = useState(false);
  const [analysisVersion, setAnalysisVersion] = useState<number | null>(null); // Version tracking
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const toast = useToast();

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Check if context is loaded
  useEffect(() => {
    checkContextStatus();
  }, [analysisId]);

  const checkContextStatus = async () => {
    try {
      const stats = await getChatStats(analysisId);

      if (stats.contextLoaded) {
        setContextLoaded(true);
        setContextLoading(false);

        // Welcome message
        setMessages([
          {
            role: "assistant",
            content: `Merhaba! Bu analizde ${candidateCount} aday değerlendirildi.\n\n**${analysisTitle}** pozisyonu için analiz hakkında size nasıl yardımcı olabilirim?\n\n**Örnek sorular:**\n• En iyi 3 adayı karşılaştır\n• [Aday adı]'nın güçlü yönleri neler?\n• Hangi adaylar Node.js biliyor?\n• Genel değerlendirmen nedir?`,
            timestamp: new Date().toISOString(),
          },
        ]);
      } else {
        // Context yüklü değil, hazırla
        await prepareContext();
      }
    } catch (error: any) {
      // Check if service is unavailable (503) - handle first, don't log
      if (error?.response?.status === 503) {
        setContextLoading(false);
        setMessages([
          {
            role: "assistant",
            content:
              "⚠️ AI Chat özelliği şu anda kullanılamıyor.\n\nBu özellik geçici olarak devre dışı bırakılmıştır. Diğer analiz özellikleri normal şekilde çalışmaya devam etmektedir.\n\nDestek için lütfen sistem yöneticisiyle iletişime geçin.",
            timestamp: new Date().toISOString(),
          },
        ]);
        return; // Early return to skip logging
      }

      // Log other unexpected errors
      if (process.env.NODE_ENV === "development") {
        console.error("Context check error:", error);
      }
      setContextLoading(false);
      toast.error("Context kontrol edilemedi");
    }
  };

  const prepareContext = async () => {
    try {
      setContextLoading(true);
      await prepareChatContext(analysisId);
      setContextLoaded(true);

      setMessages([
        {
          role: "assistant",
          content: `Context hazırlandı! ${candidateCount} aday hakkında konuşabiliriz.\n\nNe öğrenmek istersiniz?`,
          timestamp: new Date().toISOString(),
        },
      ]);

      toast.success("AI asistan hazır!");
    } catch (error: any) {
      // Check if service is unavailable (503) - handle first, don't log
      if (error?.response?.status === 503) {
        setMessages([
          {
            role: "assistant",
            content:
              "⚠️ AI Chat özelliği şu anda kullanılamıyor.\n\nBu özellik geçici olarak devre dışı bırakılmıştır. Diğer analiz özellikleri normal şekilde çalışmaya devam etmektedir.\n\nDestek için lütfen sistem yöneticisiyle iletişime geçin.",
            timestamp: new Date().toISOString(),
          },
        ]);
        return; // Early return to skip logging
      }

      // Log other unexpected errors
      if (process.env.NODE_ENV === "development") {
        console.error("Prepare context error:", error);
      }
      toast.error("Context hazırlanamadı");

      setMessages([
        {
          role: "assistant",
          content:
            "Üzgünüm, analiz verilerini yükleyemedim. Lütfen tekrar deneyin.",
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setContextLoading(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage: ChatMessage = {
      role: "user",
      content: input.trim(),
      timestamp: new Date().toISOString(),
    };

    // Add user message
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      // Send to API (with version)
      const response = await sendChatMessage(
        analysisId,
        userMessage.content,
        messages,
        analysisVersion // Current client version
      );

      // Version change detection
      if (response.version) {
        if (analysisVersion && response.version !== analysisVersion) {
          // Version değişti - conversation reset
          toast.info("Analiz güncellendi! Sohbet yenilendi.");
          setMessages([]); // Clear old messages
        }
        setAnalysisVersion(response.version); // Update version
      }

      // Version changed notification
      if (response.versionChanged) {
        const systemNotice: ChatMessage = {
          role: "assistant",
          content: `ℹ️ **Analiz Güncellendi**\n\nYeni versiyon: ${response.version}\nGüncel aday sayısı: ${response.facts?.candidateCount}\n\nÖnceki sohbet temizlendi, güncel verilerle devam ediyoruz.`,
          timestamp: new Date().toISOString(),
        };
        setMessages([systemNotice]);
      }

      // Add AI response
      const aiMessage: ChatMessage = {
        role: "assistant",
        content: response.reply,
        timestamp: response.timestamp,
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error: any) {
      // Check if service is unavailable (503) - handle first, don't log
      if (error?.response?.status === 503) {
        const unavailableMessage: ChatMessage = {
          role: "assistant",
          content:
            "⚠️ AI Chat özelliği şu anda kullanılamıyor.\n\nBu özellik geçici olarak devre dışı bırakılmıştır.",
          timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, unavailableMessage]);
        toast.error("AI Chat kullanılamıyor");
        return; // Early return to skip logging
      }

      // Log other unexpected errors
      if (process.env.NODE_ENV === "development") {
        console.error("Chat error:", error);
      }

      // Error message for unexpected errors
      const errorMessage: ChatMessage = {
        role: "assistant",
        content:
          "Üzgünüm, bir hata oluştu. Lütfen tekrar deneyin.\n\n" +
          (error.response?.data?.details || error.message),
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, errorMessage]);
      toast.error("Mesaj gönderilemedi");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const exampleQuestions = [
    "En iyi 3 adayı karşılaştır",
    "Hangi adayların teknik skorları yüksek?",
    "Genel değerlendirmen nedir?",
    "İşe alım için önerilerin neler?",
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-t-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white bg-opacity-20 flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">AI Asistan</h2>
              <p className="text-sm text-purple-100">
                {analysisTitle} • {candidateCount} aday
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto px-6 py-4 bg-gray-50">
          {contextLoading ? (
            <div className="flex flex-col items-center justify-center h-full gap-4">
              <Loader2 className="w-12 h-12 text-purple-600 animate-spin" />
              <p className="text-gray-600">Analiz verileri hazırlanıyor...</p>
              <p className="text-sm text-gray-500">
                {candidateCount} aday için context oluşturuluyor
              </p>
            </div>
          ) : !contextLoaded ? (
            <div className="flex flex-col items-center justify-center h-full gap-4">
              <AlertCircle className="w-12 h-12 text-amber-500" />
              <p className="text-gray-600">Context hazır değil</p>
              <button
                onClick={prepareContext}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                Hazırla
              </button>
            </div>
          ) : (
            <>
              {messages.map((msg, index) => (
                <AIChatMessage key={index} message={msg} />
              ))}

              {loading && (
                <div className="flex gap-3 mb-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                    <Bot className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="bg-gray-100 rounded-lg px-4 py-3 border border-gray-200">
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin text-purple-600" />
                      <span className="text-sm text-gray-600">
                        Düşünüyor...
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Example Questions (show when no messages yet) */}
        {messages.length === 1 && !loading && (
          <div className="px-6 py-3 border-t border-gray-200 bg-white">
            <p className="text-xs text-gray-500 mb-2">Hızlı sorular:</p>
            <div className="flex flex-wrap gap-2">
              {exampleQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => setInput(question)}
                  className="text-xs px-3 py-1.5 bg-purple-50 text-purple-700 rounded-full hover:bg-purple-100 transition-colors"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="px-6 py-4 border-t border-gray-200 bg-white rounded-b-xl">
          <div className="flex gap-3">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Sorunuzu yazın... (Enter: Gönder, Shift+Enter: Yeni satır)"
              className="flex-1 resize-none rounded-lg border border-gray-300 px-4 py-3 text-gray-900 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500"
              rows={2}
              disabled={loading || !contextLoaded}
            />

            <button
              onClick={handleSend}
              disabled={!input.trim() || loading || !contextLoaded}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200 flex items-center gap-2"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </div>

          <p className="text-xs text-gray-500 mt-2">
            Bu sohbet sadece bu analiz hakkındadır. Gemini 2.0 Flash ile
            desteklenmektedir.
          </p>
        </div>
      </div>
    </div>
  );
}

// Import Bot icon
import { Bot } from "lucide-react";
