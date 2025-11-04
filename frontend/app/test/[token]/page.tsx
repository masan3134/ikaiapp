"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Send,
  Info,
  XCircle,
  Loader2,
} from "lucide-react";
import {
  getPublicTest,
  submitTest,
  type TestQuestion,
} from "@/lib/services/testService";

type TestStatus =
  | "loading"
  | "start"
  | "quiz"
  | "submitting"
  | "success"
  | "error";

interface ErrorState {
  type: "expired" | "limit_exceeded" | "invalid" | "network" | "unknown";
  message: string;
}

interface SavedProgress {
  currentQuestion: number;
  answers: Record<number, number>;
  startedAt: string;
  candidateEmail: string;
  candidateName: string;
  timeLeft: number;
  testId?: string; // Optional for backward compatibility
  completed?: boolean; // Track if test was completed
}

export default function TestPage() {
  const params = useParams();
  const token = params.token as string;

  // Test data
  const [questions, setQuestions] = useState<TestQuestion[]>([]);
  const [testInfo, setTestInfo] = useState<any>(null);

  // UI state
  const [status, setStatus] = useState<TestStatus>("loading");
  const [error, setError] = useState<ErrorState | null>(null);

  // User info
  const [candidateEmail, setCandidateEmail] = useState("");
  const [candidateName, setCandidateName] = useState("");
  const [emailError, setEmailError] = useState("");

  // Quiz state
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [startedAt, setStartedAt] = useState<string>("");
  const [timeLeft, setTimeLeft] = useState(30 * 60); // 30 minutes in seconds

  // UI flags
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);

  // Anti-cheat tracking
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const [copyAttempts, setCopyAttempts] = useState(0);
  const [screenshotAttempts, setScreenshotAttempts] = useState(0);
  const [pasteAttempts, setPasteAttempts] = useState(0); // NEW

  // Load test on mount
  useEffect(() => {
    loadTest();
  }, [token]);

  // Timer effect
  useEffect(() => {
    if (status !== "quiz") return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        const newTime = prev - 1;

        // Auto-submit when time runs out
        if (newTime <= 0) {
          clearInterval(interval);
          handleAutoSubmit();
          return 0;
        }

        // Save to localStorage
        saveProgress();

        return newTime;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [status, answers, currentQuestion]);

  // Anti-cheat: Tab/Window switch detection
  useEffect(() => {
    if (status !== "quiz") return;

    function handleVisibilityChange() {
      if (document.hidden) {
        setTabSwitchCount((prev) => {
          const newCount = prev + 1;
          if (process.env.NODE_ENV === "development") {
            console.warn(`⚠️ Tab değiştirildi! (${newCount}. kez)`);
          }
          return newCount;
        });
      }
    }

    function handleBlur() {
      setTabSwitchCount((prev) => {
        const newCount = prev + 1;
        if (process.env.NODE_ENV === "development") {
          console.warn(`⚠️ Pencere değiştirildi! (${newCount}. kez)`);
        }
        return newCount;
      });
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleBlur);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleBlur);
    };
  }, [status]);

  // Anti-cheat: Copy prevention
  useEffect(() => {
    if (status !== "quiz") return;

    function handleCopy(e: ClipboardEvent) {
      e.preventDefault();
      setCopyAttempts((prev) => {
        const newCount = prev + 1;
        if (process.env.NODE_ENV === "development") {
          console.warn(`⚠️ Kopyalama engellendi! (${newCount}. deneme)`);
        }
        return newCount;
      });
    }

    document.addEventListener("copy", handleCopy);
    return () => document.removeEventListener("copy", handleCopy);
  }, [status]);

  // Anti-cheat: Paste prevention (NEW)
  useEffect(() => {
    if (status !== "quiz") return;

    function handlePaste(e: ClipboardEvent) {
      e.preventDefault();
      setPasteAttempts((prev) => {
        const newCount = prev + 1;
        if (process.env.NODE_ENV === "development") {
          console.warn(`⚠️ Yapıştırma engellendi! (${newCount}. deneme)`);
        }
        return newCount;
      });
    }

    document.addEventListener("paste", handlePaste);
    return () => document.removeEventListener("paste", handlePaste);
  }, [status]);

  // Anti-cheat: Screenshot detection (keyboard shortcuts)
  useEffect(() => {
    if (status !== "quiz") return;

    function handleKeyDown(e: KeyboardEvent) {
      // Detect common screenshot shortcuts
      const isScreenshot =
        e.key === "PrintScreen" ||
        (e.metaKey && e.shiftKey && (e.key === "3" || e.key === "4")) || // Mac
        (e.metaKey && e.shiftKey && e.key === "s"); // Windows/Linux

      if (isScreenshot) {
        setScreenshotAttempts((prev) => {
          const newCount = prev + 1;
          if (process.env.NODE_ENV === "development") {
            console.warn(`⚠️ Ekran görüntüsü algılandı! (${newCount}. deneme)`);
          }
          return newCount;
        });
      }

      // Prevent F12, Ctrl+Shift+I (DevTools)
      if (e.key === "F12" || (e.ctrlKey && e.shiftKey && e.key === "I")) {
        e.preventDefault();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [status]);

  // Load test from backend
  async function loadTest() {
    try {
      setStatus("loading");

      // Try to restore from localStorage first
      let saved = localStorage.getItem(`test_${token}`);

      // Fetch test from backend
      const response = await getPublicTest(token);

      if (!response.success) {
        throw new Error(response.message || "Test yüklenemedi");
      }

      const { test } = response.data;

      // Debug: Log test info
      if (process.env.NODE_ENV === "development") {
        console.log("📋 Test loaded:", {
          id: test.id,
          token: test.token,
          jobPostingId: test.jobPostingId,
          expiresAt: test.expiresAt,
          maxAttempts: test.maxAttempts,
        });
      }

      setQuestions(test.questions || []);
      setTestInfo(test);

      // Check if test is expired
      if (new Date(test.expiresAt) < new Date()) {
        setError({
          type: "expired",
          message:
            "Bu testin süresi dolmuş. Lütfen İK departmanı ile iletişime geçin.",
        });
        setStatus("error");
        return;
      }

      // Clear localStorage if test ID changed (different test with same token)
      if (saved) {
        try {
          const savedData = JSON.parse(saved);

          if (process.env.NODE_ENV === "development") {
            console.log("💾 Found localStorage data:", {
              savedTestId: savedData.testId,
              currentTestId: test.id,
              savedEmail: savedData.candidateEmail,
              match: savedData.testId === test.id,
            });
          }

          // Test ID changed (new test created for same job, old test expired)
          if (savedData.testId && savedData.testId !== test.id) {
            console.log("🔄 Test ID changed, clearing old localStorage data");
            console.log(`   Old: ${savedData.testId} → New: ${test.id}`);
            localStorage.removeItem(`test_${token}`);
            saved = null; // Clear the saved variable too!
            setStatus("start");
            return;
          }
        } catch (e) {
          console.error("Error parsing saved data:", e);
          localStorage.removeItem(`test_${token}`);
        }
      }

      // Check if test already completed by checking backend
      // This MUST run for ANY localStorage data (even if saved email exists)
      // Because localStorage might be from a DIFFERENT candidate who used same browser
      const savedEmail = saved ? JSON.parse(saved).candidateEmail : null;

      console.log(
        "🔍 Checking completion status. SavedEmail:",
        savedEmail || "none"
      );

      if (savedEmail) {
        console.log(
          "📧 Found saved email, checking backend completion status..."
        );
        try {
          const API_URL = process.env.NEXT_PUBLIC_API_URL;
          if (!API_URL) {
            throw new Error(
              "NEXT_PUBLIC_API_URL environment variable is not set"
            );
          }
          const checkUrl = `${API_URL}/api/v1/tests/public/${token}/check-attempts`;

          console.log("🌐 Calling:", checkUrl, "with email:", savedEmail);

          const attemptCheck = await fetch(checkUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ candidateEmail: savedEmail }),
          });

          if (attemptCheck.ok) {
            const attemptData = await attemptCheck.json();

            console.log("✅ Backend response:", attemptData);

            // This email completed the test
            // BUT: This might be a DIFFERENT user on same browser!
            // Solution: Clear localStorage and let NEW user start fresh
            if (attemptData.completed) {
              console.log("⚠️  COMPLETED TEST DETECTED for email:", savedEmail);
              console.log(
                "🧹 CLEARING localStorage - allowing NEW user to start"
              );
              localStorage.removeItem(`test_${token}`);
              saved = null; // CRITICAL: Clear saved variable so restore doesn't run!
              // Let the user start fresh (they'll enter their own email)
              setStatus("start");
              console.log(
                "✨ Status set to START - user should see email form now"
              );
              return;
            } else {
              console.log("✓ Test NOT completed, continuing...");
            }

            if (attemptData.attemptCount >= test.maxAttempts) {
              setError({
                type: "limit_exceeded",
                message:
                  "Bu teste maksimum deneme sayısına ulaştınız (3 deneme).",
              });
              setStatus("error");
              localStorage.removeItem(`test_${token}`);
              return;
            }
          }
        } catch (err) {
          if (process.env.NODE_ENV === "development") {
            console.error("Attempt check error:", err);
          }
        }
      }

      // Restore saved progress if exists AND not completed
      if (saved) {
        try {
          const progress: SavedProgress = JSON.parse(saved);

          // NEW: Check if user has entered test before (prevent re-entry after exit)
          const hasEntered = localStorage.getItem(
            `test_entered_${token}_${progress.candidateEmail}`
          );

          if (hasEntered && !progress.completed) {
            // User has entered test but not completed - MUST continue
            setCandidateEmail(progress.candidateEmail);
            setCandidateName(progress.candidateName);
            setCurrentQuestion(progress.currentQuestion);
            setAnswers(progress.answers);
            setStartedAt(progress.startedAt);
            setTimeLeft(progress.timeLeft);
            setStatus("quiz");
          } else {
            // First time or completed - go to start screen
            setStatus("start");
          }
        } catch {
          // If restore fails, go to start screen
          setStatus("start");
        }
      } else {
        setStatus("start");
      }
    } catch (err: any) {
      if (process.env.NODE_ENV === "development") {
        console.error("Test load error:", err);
      }

      if (err.response?.status === 404) {
        setError({
          type: "invalid",
          message: "Geçersiz test linki. Lütfen linki kontrol edin.",
        });
      } else if (err.response?.status === 429) {
        setError({
          type: "limit_exceeded",
          message: "Bu teste maksimum deneme sayısına ulaşıldı (3 deneme).",
        });
      } else {
        setError({
          type: "network",
          message:
            "Bağlantı hatası. Lütfen internet bağlantınızı kontrol edin.",
        });
      }

      setStatus("error");
    }
  }

  // Start test
  async function handleStartTest() {
    // Validate email
    if (!candidateEmail || !candidateEmail.includes("@")) {
      setEmailError("Geçerli bir email adresi girin");
      return;
    }

    // Check if this email already completed the test
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL;
      if (!API_URL) {
        throw new Error("NEXT_PUBLIC_API_URL environment variable is not set");
      }
      const checkUrl = `${API_URL}/api/v1/tests/public/${token}/check-attempts`;
      const attemptCheck = await fetch(checkUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ candidateEmail }),
      });

      if (attemptCheck.ok) {
        const attemptData = await attemptCheck.json();

        if (attemptData.completed) {
          setError({
            type: "limit_exceeded",
            message: `Bu testi zaten tamamladınız. Skorunuz: ${attemptData.lastScore}/100`,
          });
          setStatus("error");
          return;
        }

        if (attemptData.attemptCount >= attemptData.maxAttempts) {
          setError({
            type: "limit_exceeded",
            message: "Bu teste maksimum deneme sayısına ulaştınız (3 deneme).",
          });
          setStatus("error");
          return;
        }
      }
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error("Attempt check failed:", error);
      }
      // Continue anyway if check fails
    }

    setEmailError("");
    setStartedAt(new Date().toISOString());

    // NEW: Mark test as entered (prevent re-entry)
    localStorage.setItem(`test_entered_${token}_${candidateEmail}`, "true");

    setStatus("quiz");
    saveProgress();
  }

  // Save progress to localStorage
  function saveProgress() {
    const progress: SavedProgress = {
      currentQuestion,
      answers,
      startedAt,
      candidateEmail,
      candidateName,
      timeLeft,
      testId: testInfo?.id, // Save test ID to detect if test changed
    };

    localStorage.setItem(`test_${token}`, JSON.stringify(progress));
  }

  // Handle answer selection
  function handleAnswerSelect(optionIndex: number) {
    setAnswers({
      ...answers,
      [questions[currentQuestion].id]: optionIndex,
    });
    saveProgress();
  }

  // Navigate to next question
  function handleNext() {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      saveProgress();
    }
  }

  // Navigate to previous question
  function handlePrevious() {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      saveProgress();
    }
  }

  // Check if all questions answered
  function isAllAnswered(): boolean {
    return questions.every((q) => answers[q.id] !== undefined);
  }

  // Handle submit request
  function handleSubmitRequest() {
    if (!isAllAnswered()) {
      setShowSubmitConfirm(true);
    } else {
      handleSubmit();
    }
  }

  // Auto-submit when time runs out
  async function handleAutoSubmit() {
    await handleSubmit(true);
  }

  // Submit test
  async function handleSubmit(isAuto = false) {
    try {
      setShowSubmitConfirm(false);
      setStatus("submitting");

      // Format answers for backend
      const formattedAnswers = questions.map((q) => ({
        questionId: q.id,
        selectedOption: answers[q.id] ?? -1, // -1 for unanswered
      }));

      const response = await submitTest(token, {
        candidateEmail,
        candidateName,
        answers: formattedAnswers,
        startedAt,
        // Anti-cheat metadata
        metadata: {
          tabSwitchCount,
          copyAttempts,
          screenshotAttempts,
          pasteAttempts, // NEW
          autoSubmit: isAuto,
        },
      });

      if (response.success) {
        // Clear localStorage
        localStorage.removeItem(`test_${token}`);
        localStorage.removeItem(`test_entered_${token}_${candidateEmail}`); // NEW: Clear entry flag
        setStatus("success");
      } else {
        throw new Error(response.message || "Test gönderilemedi");
      }
    } catch (err: any) {
      if (process.env.NODE_ENV === "development") {
        console.error("Submit error:", err);
      }

      if (err.response?.status === 429) {
        setError({
          type: "limit_exceeded",
          message: "Maksimum deneme sayısına ulaştınız.",
        });
      } else {
        setError({
          type: "network",
          message: "Test gönderilemedi. Lütfen tekrar deneyin.",
        });
      }

      setStatus("error");
    }
  }

  // Format time for display
  function formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }

  // Get category badge color
  function getCategoryColor(category: string): string {
    switch (category) {
      case "technical":
        return "bg-blue-100 text-blue-700";
      case "situational":
        return "bg-purple-100 text-purple-700";
      case "experience":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  }

  // Get category label
  function getCategoryLabel(category: string): string {
    switch (category) {
      case "technical":
        return "Teknik";
      case "situational":
        return "Durumsal";
      case "experience":
        return "Deneyim";
      default:
        return category;
    }
  }

  // RENDER: Loading
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-xl font-bold text-gray-900">Test yükleniyor...</p>
        </div>
      </div>
    );
  }

  // RENDER: Error
  if (status === "error" && error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-xl border-2 border-red-300 p-8 text-center">
          <XCircle className="w-20 h-20 text-red-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            Test Yüklenemedi
          </h1>
          <p className="text-base text-gray-800 font-medium mb-6">
            {error.message}
          </p>

          {error.type === "network" && (
            <button
              onClick={loadTest}
              className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition shadow-md"
            >
              Tekrar Dene
            </button>
          )}
        </div>
      </div>
    );
  }

  // RENDER: Start Screen
  if (status === "start") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-10 h-10 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Değerlendirme Testi
            </h1>
            <p className="text-gray-600">IKAI HR Platform</p>
          </div>

          {/* Warning if test has submissions */}
          {testInfo?.hasSubmissions && (
            <div className="mb-6 bg-orange-50 border-2 border-orange-300 rounded-lg p-4">
              <p className="text-sm text-orange-900 font-bold text-center">
                ⚠️ Bu teste daha önce cevap verilmiş. Eğer testi zaten
                çözdüyseniz, email adresinizi girin ve engelleneceksiniz.
              </p>
            </div>
          )}

          {/* Test Info */}
          <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-6 mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Info className="w-5 h-5 text-blue-600" />
              Test Bilgileri
            </h2>
            <ul className="space-y-3 text-base text-gray-900">
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <span>
                  <strong className="font-bold">Soru Sayısı:</strong> 10 soru
                  (Çoktan seçmeli)
                </span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <span>
                  <strong className="font-bold">Süre:</strong> 30 dakika
                </span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <span>
                  <strong className="font-bold">Deneme Hakkı:</strong> 3 deneme
                </span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <span>
                  <strong className="font-bold">Kategoriler:</strong> Teknik,
                  Durumsal, Deneyim
                </span>
              </li>
            </ul>
          </div>

          {/* User Form */}
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">
                Email Adresi <span className="text-red-600">*</span>
              </label>
              <input
                type="email"
                value={candidateEmail}
                onChange={(e) => {
                  setCandidateEmail(e.target.value);
                  setEmailError("");
                }}
                className={`w-full px-4 py-3 border-2 rounded-lg text-gray-900 font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  emailError ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="ornek@email.com"
              />
              {emailError && (
                <p className="text-red-600 text-sm font-semibold mt-1">
                  {emailError}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">
                Ad Soyad *
              </label>
              <input
                type="text"
                value={candidateName}
                onChange={(e) => setCandidateName(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-900 font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Adınız Soyadınız"
                required
              />
            </div>
          </div>

          {/* Start Button */}
          <button
            onClick={handleStartTest}
            disabled={!candidateEmail || !candidateName}
            className="w-full py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            Teste Başla
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Footer */}
          <p className="text-sm text-gray-700 font-medium text-center mt-6 bg-gray-100 p-3 rounded-lg">
            Teste başladıktan sonra tarayıcıyı kapatırsanız, kaldığınız yerden
            devam edebilirsiniz.
          </p>
        </div>
      </div>
    );
  }

  // RENDER: Quiz
  if (status === "quiz") {
    const currentQ = questions[currentQuestion];
    const progress = ((currentQuestion + 1) / questions.length) * 100;
    const answeredCount = Object.keys(answers).length;
    const isLastQuestion = currentQuestion === questions.length - 1;

    return (
      <div
        className="min-h-screen bg-gray-50 select-none"
        onContextMenu={(e) => e.preventDefault()}
        style={{ userSelect: "none", WebkitUserSelect: "none" }}
      >
        {/* Header with Timer */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Değerlendirme Testi
                </h1>
                <p className="text-sm font-bold text-gray-700">
                  Soru {currentQuestion + 1} / {questions.length}
                </p>
              </div>

              <div
                className={`flex items-center gap-2 px-5 py-3 rounded-lg border-2 shadow-md ${
                  timeLeft < 300
                    ? "bg-red-100 border-red-400 text-red-800"
                    : "bg-blue-100 border-blue-400 text-blue-800"
                }`}
              >
                <Clock className="w-6 h-6" />
                <span className="font-mono font-bold text-xl">
                  {formatTime(timeLeft)}
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-4">
              <div className="flex items-center justify-between text-sm font-bold text-gray-900 mb-2">
                <div className="flex items-center gap-4">
                  <span>
                    {answeredCount} / {questions.length} cevaplandı
                  </span>
                  {(tabSwitchCount > 0 ||
                    copyAttempts > 0 ||
                    screenshotAttempts > 0) && (
                    <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded font-bold">
                      ⚠️ Uyarı:{" "}
                      {tabSwitchCount + copyAttempts + screenshotAttempts}
                    </span>
                  )}
                </div>
                <span>%{Math.round(progress)}</span>
              </div>
              <div className="w-full bg-gray-300 rounded-full h-3 shadow-inner">
                <div
                  className="bg-blue-600 h-3 rounded-full transition-all duration-300 shadow-sm"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Question Content */}
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-white rounded-xl shadow-lg p-8">
            {/* Category Badge */}
            <div className="mb-6">
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(currentQ.category)}`}
              >
                {getCategoryLabel(currentQ.category)}
              </span>
            </div>

            {/* Question */}
            <h2 className="text-2xl font-bold text-gray-900 mb-8 leading-relaxed">
              {currentQ.question}
            </h2>

            {/* Options */}
            <div className="space-y-4 mb-8">
              {currentQ.options.map((option, index) => {
                const optionLabel = String.fromCharCode(65 + index); // A, B, C, D
                const isSelected = answers[currentQ.id] === index;

                return (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    className={`w-full text-left p-5 rounded-lg border-2 transition-all ${
                      isSelected
                        ? "border-blue-600 bg-blue-50 shadow-md"
                        : "border-gray-300 hover:border-blue-400 hover:bg-gray-50 hover:shadow-sm"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-base ${
                          isSelected
                            ? "bg-blue-600 text-white"
                            : "bg-gray-200 text-gray-900"
                        }`}
                      >
                        {optionLabel}
                      </div>
                      <span className="text-gray-900 pt-2 text-base font-medium leading-relaxed">
                        {option}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-200">
              <button
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
                className="flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <ChevronLeft className="w-5 h-5" />
                Geri
              </button>

              {isLastQuestion ? (
                <button
                  onClick={handleSubmitRequest}
                  className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                >
                  <Send className="w-5 h-5" />
                  Testi Tamamla
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  İleri
                  <ChevronRight className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          {/* Question Grid */}
          <div className="mt-6 bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Sorular</h3>
            <div className="grid grid-cols-5 sm:grid-cols-10 gap-3">
              {questions.map((q, idx) => (
                <button
                  key={q.id}
                  onClick={() => setCurrentQuestion(idx)}
                  className={`aspect-square rounded-lg font-bold text-base transition shadow-sm ${
                    idx === currentQuestion
                      ? "bg-blue-600 text-white shadow-md"
                      : answers[q.id] !== undefined
                        ? "bg-green-500 text-white hover:bg-green-600"
                        : "bg-gray-200 text-gray-900 hover:bg-gray-300"
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Submit Confirmation Modal */}
        {showSubmitConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl border-2 border-orange-300 max-w-md w-full p-8">
              <AlertCircle className="w-16 h-16 text-orange-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 text-center mb-3">
                Emin misiniz?
              </h3>
              <p className="text-base text-gray-800 font-medium text-center mb-6">
                {answeredCount < questions.length && (
                  <>
                    <strong className="text-orange-600 font-bold">
                      {questions.length - answeredCount} soru
                    </strong>{" "}
                    henüz cevaplanmadı. Yine de testi göndermek istiyor musunuz?
                  </>
                )}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowSubmitConfirm(false)}
                  className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-900 font-bold hover:bg-gray-100 transition"
                >
                  İptal
                </button>
                <button
                  onClick={() => handleSubmit()}
                  className="flex-1 px-4 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition shadow-md"
                >
                  Gönder
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // RENDER: Submitting
  if (status === "submitting") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-xl font-bold text-gray-900">
            Cevaplarınız gönderiliyor...
          </p>
        </div>
      </div>
    );
  }

  // RENDER: Success
  if (status === "success") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-xl border-2 border-green-300 p-8 text-center">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-14 h-14 text-green-600" />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Teşekkürler!
          </h1>
          <p className="text-lg text-gray-800 font-medium mb-6">
            Testiniz başarıyla gönderildi. Cevaplarınız değerlendirmeye alındı.
          </p>

          <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-5 mb-6">
            <p className="text-base text-gray-900 font-medium leading-relaxed">
              İK ekibimiz değerlendirme sonucunu en kısa sürede size
              bildirecektir. İlginiz için teşekkür ederiz.
            </p>
          </div>

          <div className="text-sm text-gray-700 font-medium">
            Bu pencereyi kapatabilirsiniz.
          </div>
        </div>
      </div>
    );
  }

  return null;
}
