"use client";

import {
  Mail,
  User,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";
import { formatDate } from "@/lib/utils/dateFormat";
import type { TestSubmission } from "../../types";

interface TestDetailModalProps {
  test: TestSubmission;
  onClose: () => void;
}

export default function TestDetailModal({
  test,
  onClose,
}: TestDetailModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="sticky top-0 bg-white border-b-2 border-gray-200 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Test Sonucu Detayı
            </h2>
            <p className="text-sm text-gray-700 font-medium mt-1">
              {test.test?.jobPosting?.title || "N/A"} -{" "}
              {test.test?.jobPosting?.department || "N/A"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-900 text-3xl font-bold"
          >
            ×
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {/* Score Section */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-300 rounded-xl p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Test Skoru</h3>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="text-5xl font-bold text-purple-600">
                  {test.score}
                </div>
                <div className="text-sm font-bold text-gray-700">/ 100</div>
              </div>
              <div className="flex-1 space-y-2">
                <div>
                  <span className="text-sm font-bold text-gray-900">
                    Doğru Cevap:
                  </span>
                  <span className="ml-2 text-base font-bold text-green-700">
                    {test.correctCount} / 10
                  </span>
                </div>
                <div>
                  <span className="text-sm font-bold text-gray-900">
                    Yanlış Cevap:
                  </span>
                  <span className="ml-2 text-base font-bold text-red-700">
                    {10 - test.correctCount} / 10
                  </span>
                </div>
                <div>
                  <span className="text-sm font-bold text-gray-900">
                    Deneme:
                  </span>
                  <span className="ml-2 text-base font-bold text-blue-700">
                    {test.attemptNumber} / 3
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Candidate Info */}
          <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-5">
            <h3 className="text-lg font-bold text-gray-900 mb-3">
              Aday Bilgileri
            </h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-bold text-gray-900">Email:</span>
                <span className="text-sm text-gray-800 font-medium">
                  {test.candidateEmail}
                </span>
              </div>
              {test.candidateName && (
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-bold text-gray-900">
                    Ad Soyad:
                  </span>
                  <span className="text-sm text-gray-800 font-medium">
                    {test.candidateName}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Test Info */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-gray-50 border-2 border-gray-300 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-5 h-5 text-gray-600" />
                <span className="text-sm font-bold text-gray-900">
                  Test Başlangıç
                </span>
              </div>
              <p className="text-base text-gray-800 font-medium">
                {formatDate(test.startedAt)}
              </p>
            </div>
            <div className="bg-gray-50 border-2 border-gray-300 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-sm font-bold text-gray-900">
                  Test Bitiş
                </span>
              </div>
              <p className="text-base text-gray-800 font-medium">
                {formatDate(test.completedAt)}
              </p>
            </div>
          </div>

          {/* Anti-Cheat Stats */}
          {test.metadata && (
            <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-5">
              <h3 className="text-lg font-bold text-gray-900 mb-3">
                🛡️ Güvenlik İstatistikleri
              </h3>
              <div className="grid md:grid-cols-2 gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-gray-900">
                    Tab Değiştirme:
                  </span>
                  <span
                    className={`text-sm font-bold ${
                      test.metadata.tabSwitchCount > 5
                        ? "text-red-600"
                        : "text-green-600"
                    }`}
                  >
                    {test.metadata.tabSwitchCount || 0} kez
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-gray-900">
                    Kopyalama Denemesi:
                  </span>
                  <span
                    className={`text-sm font-bold ${
                      test.metadata.copyAttempts > 0
                        ? "text-red-600"
                        : "text-green-600"
                    }`}
                  >
                    {test.metadata.copyAttempts || 0} kez
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-gray-900">
                    Ekran Görüntüsü:
                  </span>
                  <span
                    className={`text-sm font-bold ${
                      test.metadata.screenshotAttempts > 0
                        ? "text-red-600"
                        : "text-green-600"
                    }`}
                  >
                    {test.metadata.screenshotAttempts || 0} kez
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-gray-900">
                    Yapıştırma Denemesi:
                  </span>
                  <span
                    className={`text-sm font-bold ${
                      test.metadata.pasteAttempts > 0
                        ? "text-red-600"
                        : "text-green-600"
                    }`}
                  >
                    {test.metadata.pasteAttempts || 0} kez
                  </span>
                </div>
                {test.metadata.autoSubmit && (
                  <div className="md:col-span-2 flex items-center gap-2 text-orange-700">
                    <span className="text-sm font-bold">
                      ⚠️ Otomatik Gönderim (Süre Doldu)
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Detailed Questions & Answers */}
          {test.test?.questions && test.answers && (
            <div className="bg-gray-50 border-2 border-gray-300 rounded-lg p-5">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Soru Detayları
              </h3>
              <div className="space-y-4">
                {test.test.questions.map((question, qIdx) => {
                  const userAnswer = test.answers?.find(
                    (a) => a.questionId === question.id
                  );
                  const selectedOption = userAnswer?.selectedOption;
                  const correctOption = question.correctAnswer;
                  const isCorrect = selectedOption === correctOption;
                  const isAnswered =
                    selectedOption !== undefined && selectedOption !== -1;

                  return (
                    <div
                      key={question.id}
                      className={`border-2 rounded-lg p-4 ${
                        isCorrect
                          ? "bg-green-50 border-green-300"
                          : !isAnswered
                            ? "bg-gray-100 border-gray-300"
                            : "bg-red-50 border-red-300"
                      }`}
                    >
                      {/* Question Header */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-gray-900">
                            Soru {qIdx + 1}:
                          </span>
                          <span
                            className={`text-xs px-2 py-1 rounded font-bold ${
                              question.category === "technical"
                                ? "bg-blue-100 text-blue-800"
                                : question.category === "situational"
                                  ? "bg-purple-100 text-purple-800"
                                  : "bg-green-100 text-green-800"
                            }`}
                          >
                            {question.category === "technical"
                              ? "Teknik"
                              : question.category === "situational"
                                ? "Durumsal"
                                : "Deneyim"}
                          </span>
                        </div>
                        {isCorrect ? (
                          <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                        ) : !isAnswered ? (
                          <XCircle className="w-6 h-6 text-gray-500 flex-shrink-0" />
                        ) : (
                          <XCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
                        )}
                      </div>

                      {/* Question Text */}
                      <p className="text-base text-gray-900 font-medium mb-4 leading-relaxed">
                        {question.question}
                      </p>

                      {/* Options */}
                      <div className="space-y-2">
                        {question.options?.map(
                          (option: string, optIdx: number) => {
                            const optionLabel = String.fromCharCode(
                              65 + optIdx
                            ); // A, B, C, D
                            const isUserChoice = selectedOption === optIdx;
                            const isCorrectChoice = correctOption === optIdx;

                            return (
                              <div
                                key={optIdx}
                                className={`flex items-start gap-2 p-3 rounded-lg ${
                                  isCorrectChoice
                                    ? "bg-green-100 border-2 border-green-400"
                                    : isUserChoice
                                      ? "bg-red-100 border-2 border-red-400"
                                      : "bg-white border border-gray-200"
                                }`}
                              >
                                <span
                                  className={`font-bold flex-shrink-0 ${
                                    isCorrectChoice
                                      ? "text-green-700"
                                      : isUserChoice
                                        ? "text-red-700"
                                        : "text-gray-600"
                                  }`}
                                >
                                  {optionLabel})
                                </span>
                                <span
                                  className={`text-sm font-medium ${
                                    isCorrectChoice || isUserChoice
                                      ? "text-gray-900"
                                      : "text-gray-700"
                                  }`}
                                >
                                  {option}
                                </span>
                                {isCorrectChoice && (
                                  <CheckCircle className="w-4 h-4 text-green-600 ml-auto flex-shrink-0" />
                                )}
                                {isUserChoice && !isCorrectChoice && (
                                  <XCircle className="w-4 h-4 text-red-600 ml-auto flex-shrink-0" />
                                )}
                              </div>
                            );
                          }
                        )}
                      </div>

                      {/* Answer Summary */}
                      <div className="mt-3 pt-3 border-t border-gray-300">
                        <div className="flex items-center justify-between text-sm">
                          <div>
                            <span className="font-bold text-gray-900">
                              Adayın Cevabı:{" "}
                            </span>
                            {isAnswered ? (
                              <span
                                className={`font-bold ${
                                  isCorrect ? "text-green-700" : "text-red-700"
                                }`}
                              >
                                Şık {String.fromCharCode(65 + selectedOption)}
                              </span>
                            ) : (
                              <span className="font-bold text-gray-600">
                                Cevapsız
                              </span>
                            )}
                          </div>
                          <div>
                            <span className="font-bold text-gray-900">
                              Doğru Cevap:{" "}
                            </span>
                            <span className="font-bold text-green-700">
                              Şık {String.fromCharCode(65 + correctOption)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Test Expiry */}
          <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-yellow-700" />
              <span className="text-sm font-bold text-gray-900">
                Son Geçerlilik:
              </span>
              <span className="text-sm text-gray-800 font-medium">
                {formatDate(test.test?.expiresAt || "")}
              </span>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t-2 border-gray-200 p-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition shadow-md"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
}
