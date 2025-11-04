"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  CheckCircle,
  XCircle,
  Users,
  Briefcase,
  PlusCircle,
  ArrowUpDown,
  Download,
  FileSpreadsheet,
  FileText,
  Mail,
} from "lucide-react";
import {
  getAnalysisById,
  type Analysis,
  type AnalysisResult,
} from "@/lib/services/analysisService";
import { downloadCV } from "@/lib/services/candidateService";
import { useAsync } from "@/lib/hooks/useAsync";
import { useToast } from "@/lib/hooks/useToast";
import { withRoleProtection } from "@/lib/hoc/withRoleProtection";
import { RoleGroups } from "@/lib/constants/roles";
import LoadingSkeleton from "@/components/ui/LoadingSkeleton";
import EmptyState from "@/components/ui/EmptyState";
import AnalysisStatusBadge from "@/components/analyses/AnalysisStatusBadge";
import AnalysisStats from "@/components/analyses/AnalysisStats";
import AnalysisResultCard from "@/components/analyses/AnalysisResultCard";
import AnalysisResultProcessingCard from "@/components/analyses/AnalysisResultProcessingCard";
import PartialSuccessAlert from "@/components/analyses/PartialSuccessAlert";
import { parseApiError } from "@/lib/utils/errorHandler";
import { formatDateTime } from "@/lib/utils/dateFormat";
import { downloadBlob } from "@/lib/utils/fileUtils";
import AddCandidatesModal from "@/components/analyses/AddCandidatesModal";
import EmailExportModal from "@/components/analyses/EmailExportModal";
import BulkTestSendModal from "@/components/analyses/BulkTestSendModal";
import AIChatButton from "@/components/analyses/AIChatButton";

function AnalysisDetailPage() {
  const params = useParams();
  const router = useRouter();
  const toast = useToast();
  const analysisId = params.id as string;
  const [isModalOpen, setModalOpen] = useState(false);
  const [isEmailModalOpen, setEmailModalOpen] = useState(false);
  const [isTestModalOpen, setTestModalOpen] = useState(false);
  const [showExportDropdown, setShowExportDropdown] = useState(false);
  const [processingCandidateIds, setProcessingCandidateIds] = useState<
    string[]
  >([]);

  // Sorting state
  type SortOption =
    | "score-desc"
    | "score-asc"
    | "name-asc"
    | "name-desc"
    | "date-desc"
    | "date-asc";
  const [sortBy, setSortBy] = useState<SortOption>("score-desc");

  // Fetch analysis data with useAsync
  const {
    data: analysisData,
    loading,
    error,
    execute: loadAnalysis,
  } = useAsync(async () => {
    return await getAnalysisById(analysisId);
  });

  useEffect(() => {
    if (analysisId) {
      loadAnalysis().catch((err) => {
        if (process.env.NODE_ENV === "development") {
          console.error("Failed to load analysis:", err);
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [analysisId]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (showExportDropdown) {
        setShowExportDropdown(false);
      }
    }

    if (showExportDropdown) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [showExportDropdown]);

  // Auto-refresh when analysis is PROCESSING or has processing candidates
  useEffect(() => {
    if (!analysisData?.analysis) return;

    const analysis = analysisData.analysis;

    // Poll if analysis is PROCESSING or if we have candidates being processed
    if (analysis.status === "PROCESSING" || processingCandidateIds.length > 0) {
      const interval = setInterval(() => {
        if (process.env.NODE_ENV === "development") {
          console.log("Polling for analysis updates...", {
            status: analysis.status,
            processingCount: processingCandidateIds.length,
          });
        }
        loadAnalysis().catch((err) => {
          if (process.env.NODE_ENV === "development") {
            console.error("Polling failed:", err);
          }
        });
      }, 5000); // Poll every 5 seconds

      return () => clearInterval(interval);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    analysisData?.analysis?.status,
    processingCandidateIds.length,
    analysisId,
  ]);

  const analysis = analysisData?.analysis;

  // Handle add candidates success
  const handleAddCandidatesSuccess = async (addedIds: string[]) => {
    setProcessingCandidateIds((prev) => [...new Set([...prev, ...addedIds])]);
    await loadAnalysis();
  };

  // Export handlers
  const handleExport = async (format: "xlsx" | "csv" | "html") => {
    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_URL;
      if (!API_BASE) {
        throw new Error("NEXT_PUBLIC_API_URL environment variable is not set");
      }
      const token = localStorage.getItem("auth_token");

      const url = `${API_BASE}/api/v1/analyses/${analysisId}/export/${format}`;

      if (format === "html") {
        // Open HTML in new tab
        window.open(url + `?token=${token}`, "_blank");
        toast.success("HTML raporu yeni sekmede açıldı");
      } else {
        // Download file
        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Export failed");

        const blob = await response.blob();
        const downloadUrl = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = downloadUrl;
        a.download = `analiz-${analysisId}.${format}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(downloadUrl);
        document.body.removeChild(a);

        toast.success(`${format.toUpperCase()} başarıyla indirildi`);
      }
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error("Export error:", error);
      }
      toast.error("Export sırasında hata oluştu");
    }
  };

  // Calculate which candidates are still processing
  const existingResultIds = useMemo(
    () => new Set(analysis?.analysisResults?.map((r) => r.candidateId) || []),
    [analysis?.analysisResults]
  );

  const processingCandidates = useMemo(
    () => processingCandidateIds.filter((id) => !existingResultIds.has(id)),
    [processingCandidateIds, existingResultIds]
  );

  // Auto-clear processing IDs when all results have arrived
  useEffect(() => {
    if (
      processingCandidateIds.length > 0 &&
      processingCandidates.length === 0
    ) {
      if (process.env.NODE_ENV === "development") {
        console.log("All processing candidates completed, clearing list");
      }
      setProcessingCandidateIds([]);
    }
  }, [processingCandidateIds.length, processingCandidates.length]);

  // Sort results based on selected option
  const sortedResults = useMemo(() => {
    const results = [...(analysis?.analysisResults || [])];

    switch (sortBy) {
      case "score-desc":
        return results.sort(
          (a, b) => b.compatibilityScore - a.compatibilityScore
        );
      case "score-asc":
        return results.sort(
          (a, b) => a.compatibilityScore - b.compatibilityScore
        );
      case "name-asc":
        return results.sort((a, b) => {
          const nameA =
            `${a.candidate.firstName} ${a.candidate.lastName}`.toLowerCase();
          const nameB =
            `${b.candidate.firstName} ${b.candidate.lastName}`.toLowerCase();
          return nameA.localeCompare(nameB, "tr");
        });
      case "name-desc":
        return results.sort((a, b) => {
          const nameA =
            `${a.candidate.firstName} ${a.candidate.lastName}`.toLowerCase();
          const nameB =
            `${b.candidate.firstName} ${b.candidate.lastName}`.toLowerCase();
          return nameB.localeCompare(nameA, "tr");
        });
      case "date-desc":
        return results.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      case "date-asc":
        return results.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      default:
        return results;
    }
  }, [analysis?.analysisResults, sortBy]);

  // Handle CV download
  async function handleDownloadCV(result: AnalysisResult) {
    await toast.promise(
      downloadCV(result.candidateId).then((blob) => {
        downloadBlob(blob, result.candidate.sourceFileName);
      }),
      {
        loading: "CV indiriliyor...",
        success: "CV başarıyla indirildi",
        error: "CV indirilemedi",
      }
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <LoadingSkeleton variant="card" />
          <div className="mt-6">
            <LoadingSkeleton variant="table" rows={3} />
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !analysis) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <EmptyState
            icon={<XCircle className="w-16 h-16 text-red-500" />}
            title="Analiz Bulunamadı"
            description={
              error
                ? parseApiError(error)
                : "İstenen analiz bulunamadı veya erişim yetkiniz yok."
            }
            action={{
              label: "Analizlere Dön",
              onClick: () => router.push("/analyses"),
            }}
          />
        </div>
      </div>
    );
  }

  const resultsCount = sortedResults.length;

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Back Button */}
          <button
            onClick={() => router.push("/analyses")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Analizlere Dön</span>
          </button>

          {/* Analysis Header */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold text-gray-900">
                    {analysis.jobPosting.title}
                  </h1>
                  {analysis.jobPosting.isDeleted && (
                    <span className="px-3 py-1 text-sm font-medium bg-gray-200 text-gray-700 rounded-lg">
                      İlan Arşivlenmiş
                    </span>
                  )}
                </div>
                <p className="text-gray-600 mb-4">
                  {analysis.jobPosting.description ||
                    "Detaylı analiz sonuçları"}
                </p>

                {/* Meta Info */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                  {analysis.jobPosting.department && (
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-4 h-4" />
                      <span>{analysis.jobPosting.department}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>
                      Oluşturulma: {formatDateTime(analysis.createdAt)}
                    </span>
                  </div>
                  {analysis.completedAt && (
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      <span>
                        Tamamlanma: {formatDateTime(analysis.completedAt)}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>{resultsCount} Aday Analiz Edildi</span>
                  </div>
                </div>
              </div>

              {/* Status Badge & Actions */}
              <div className="flex-shrink-0">
                <div className="flex flex-col items-end gap-3">
                  <AnalysisStatusBadge
                    status={analysis.status}
                    hasError={!!analysis.errorMessage}
                    hasResults={resultsCount > 0}
                  />

                  {analysis.status === "COMPLETED" && resultsCount > 0 && (
                    <div className="flex gap-3">
                      {/* Add Candidate Button (Left) */}
                      <button
                        onClick={() => setModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-md transition-all"
                      >
                        <PlusCircle className="w-4 h-4" />
                        <span>Aday Ekle</span>
                      </button>

                      {/* Export/Send Dropdown */}
                      <div className="relative">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowExportDropdown(!showExportDropdown);
                          }}
                          className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white bg-green-600 rounded-lg hover:bg-green-700 shadow-md transition-all"
                        >
                          <Download className="w-4 h-4" />
                          <span>Dışa Aktar / Gönder</span>
                          <span className="text-xs">▼</span>
                        </button>

                        {showExportDropdown && (
                          <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border-2 border-gray-200 z-10">
                            <div className="p-2">
                              <div className="text-xs font-bold text-gray-500 px-3 py-2 uppercase">
                                Dışa Aktar
                              </div>
                              <button
                                onClick={() => {
                                  handleExport("html");
                                  setShowExportDropdown(false);
                                }}
                                className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-900 hover:bg-purple-50 rounded transition"
                              >
                                <FileText className="w-4 h-4 text-purple-600" />
                                HTML Rapor
                              </button>
                              <button
                                onClick={() => {
                                  handleExport("xlsx");
                                  setShowExportDropdown(false);
                                }}
                                className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-900 hover:bg-green-50 rounded transition"
                              >
                                <FileSpreadsheet className="w-4 h-4 text-green-600" />
                                Excel
                              </button>
                              <button
                                onClick={() => {
                                  handleExport("csv");
                                  setShowExportDropdown(false);
                                }}
                                className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-900 hover:bg-blue-50 rounded transition"
                              >
                                <Download className="w-4 h-4 text-blue-600" />
                                CSV
                              </button>
                              <div className="border-t border-gray-200 my-2"></div>
                              <div className="text-xs font-bold text-gray-500 px-3 py-2 uppercase">
                                Gönder
                              </div>
                              <button
                                onClick={() => {
                                  setEmailModalOpen(true);
                                  setShowExportDropdown(false);
                                }}
                                className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-900 hover:bg-orange-50 rounded transition"
                              >
                                <Mail className="w-4 h-4 text-orange-600" />
                                Email Gönder
                              </button>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Test Send Button (Purple - Separate) */}
                      <button
                        onClick={() => setTestModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white bg-purple-600 rounded-lg hover:bg-purple-700 shadow-md transition-all"
                      >
                        <FileText className="w-4 h-4" />
                        <span>Test Gönder</span>
                      </button>

                      {/* AI Chat Button */}
                      <AIChatButton
                        analysisId={analysisId}
                        analysisTitle={analysis.jobPosting.title}
                        candidateCount={analysis.analysisResults?.length || 0}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Error Message */}
            {analysis.status === "FAILED" && analysis.errorMessage && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-700">
                  <strong>Hata:</strong> {analysis.errorMessage}
                </p>
              </div>
            )}
          </div>

          {/* Partial Success Alert */}
          {analysis.status === "COMPLETED" &&
            analysis.errorMessage &&
            resultsCount > 0 && (
              <PartialSuccessAlert
                errorMessage={analysis.errorMessage}
                successCount={resultsCount}
              />
            )}

          {/* Results Section */}
          {resultsCount > 0 || processingCandidates.length > 0 ? (
            <>
              {/* Statistics */}
              {resultsCount > 0 && <AnalysisStats results={sortedResults} />}

              {/* Results Header */}
              <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
                <h2 className="text-xl font-bold text-gray-900">
                  Analiz Sonuçları
                </h2>

                {/* Sort Dropdown */}
                <div className="flex items-center gap-2">
                  <ArrowUpDown className="w-4 h-4 text-gray-500" />
                  <label
                    htmlFor="sort-select"
                    className="text-sm font-medium text-gray-700"
                  >
                    Sıralama:
                  </label>
                  <select
                    id="sort-select"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                    className="px-3 py-2 text-sm font-medium text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm cursor-pointer hover:border-gray-400 transition-colors"
                  >
                    <option
                      value="score-desc"
                      className="text-gray-900 bg-white"
                    >
                      Skor (Yüksek → Düşük)
                    </option>
                    <option
                      value="score-asc"
                      className="text-gray-900 bg-white"
                    >
                      Skor (Düşük → Yüksek)
                    </option>
                    <option value="name-asc" className="text-gray-900 bg-white">
                      İsim (A → Z)
                    </option>
                    <option
                      value="name-desc"
                      className="text-gray-900 bg-white"
                    >
                      İsim (Z → A)
                    </option>
                    <option
                      value="date-desc"
                      className="text-gray-900 bg-white"
                    >
                      Tarih (En Yeni)
                    </option>
                    <option value="date-asc" className="text-gray-900 bg-white">
                      Tarih (En Eski)
                    </option>
                  </select>
                </div>
              </div>

              {/* Results List */}
              <div className="space-y-4">
                {processingCandidates.map((id) => (
                  <AnalysisResultProcessingCard key={`proc-${id}`} />
                ))}
                {sortedResults.map((result, index) => (
                  <AnalysisResultCard
                    key={result.id}
                    result={result}
                    rank={index + 1}
                    onDownload={handleDownloadCV}
                    defaultExpanded={index === 0}
                  />
                ))}
              </div>
            </>
          ) : (
            <EmptyState
              icon={<Users className="w-16 h-16" />}
              title="Henüz Sonuç Yok"
              description="Bu analiz için henüz sonuç bulunmuyor."
              action={{
                label: "Analizlere Dön",
                onClick: () => router.push("/analyses"),
              }}
            />
          )}
        </div>
      </div>

      {analysis && (
        <>
          <AddCandidatesModal
            isOpen={isModalOpen}
            onClose={() => setModalOpen(false)}
            analysis={analysis}
            onSuccess={handleAddCandidatesSuccess}
          />

          <EmailExportModal
            isOpen={isEmailModalOpen}
            onClose={() => setEmailModalOpen(false)}
            analysisId={analysisId}
            onSuccess={() => toast.success("Email gönderimi başlatıldı")}
          />

          <BulkTestSendModal
            isOpen={isTestModalOpen}
            onClose={() => setTestModalOpen(false)}
            jobPostingId={analysis.jobPostingId}
            jobTitle={analysis.jobPosting.title}
            candidates={sortedResults}
            analysisId={analysis.id}
          />
        </>
      )}
    </>
  );
}

export default withRoleProtection(AnalysisDetailPage, {
  allowedRoles: RoleGroups.HR_MANAGERS,
});
