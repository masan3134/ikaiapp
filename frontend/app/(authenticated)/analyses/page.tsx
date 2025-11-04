"use client";

import { useEffect, useState } from "react";
import { Clock, Plus } from "lucide-react";
import { Toaster, toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import {
  getAnalyses,
  deleteAnalysis,
  type Analysis,
} from "@/lib/services/analysisService";
import AnalysisCard from "@/components/analyses/AnalysisCard";
import EmptyState from "@/components/ui/EmptyState";
import LoadingSkeleton from "@/components/ui/LoadingSkeleton";
import SearchBar from "@/components/ui/SearchBar";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { parseApiError } from "@/lib/utils/errorHandler";
import { withRoleProtection } from "@/lib/hoc/withRoleProtection";
import { RoleGroups } from "@/lib/constants/roles";
import { useAuthStore } from "@/lib/store/authStore";
import { canCreateAnalysis, canDeleteAnalysis } from "@/lib/utils/rbac";

function AnalysesPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const userRole = user?.role;
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Modals
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Selected item
  const [selectedAnalysis, setSelectedAnalysis] = useState<Analysis | null>(
    null
  );

  // Loading states
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Load analyses
  async function loadAnalyses() {
    try {
      setLoading(true);
      const data = await getAnalyses();
      setAnalyses(data.analyses || []);
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error("Load analyses error:", error);
      }
      toast.error(parseApiError(error));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAnalyses();
  }, []);

  // Auto-refresh when any analysis is PROCESSING
  useEffect(() => {
    const hasProcessing = analyses.some((a) => a.status === "PROCESSING");

    if (hasProcessing) {
      const interval = setInterval(() => {
        if (process.env.NODE_ENV === "development") {
          console.log("Polling for analysis list updates...");
        }
        loadAnalyses();
      }, 5000); // Poll every 5 seconds

      return () => clearInterval(interval);
    }
  }, [analyses]);

  // Filter analyses
  const filteredAnalyses = analyses.filter((analysis) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      analysis.jobPosting.title.toLowerCase().includes(query) ||
      analysis.jobPosting.department.toLowerCase().includes(query)
    );
  });

  // Calculate stats
  const stats = {
    total: analyses.length,
    completed: analyses.filter((a) => a.status === "COMPLETED").length,
    processing: analyses.filter((a) => a.status === "PROCESSING").length,
    failed: analyses.filter((a) => a.status === "FAILED").length,
  };

  // Handle actions
  function handleView(analysis: Analysis) {
    router.push(`/analyses/${analysis.id}`);
  }

  function handleDelete(analysis: Analysis) {
    setSelectedAnalysis(analysis);
    setShowDeleteDialog(true);
  }

  async function confirmDelete() {
    if (!selectedAnalysis) return;

    try {
      setDeleteLoading(true);
      const response = await deleteAnalysis(selectedAnalysis.id);
      setAnalyses((prev) => prev.filter((a) => a.id !== selectedAnalysis.id));
      toast.success(response.message || "Analiz silindi");
      setShowDeleteDialog(false);
      setSelectedAnalysis(null);
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error("Delete error:", error);
      }
      toast.error(parseApiError(error));
    } finally {
      setDeleteLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Analizler</h1>
            <p className="text-gray-600 mt-1">
              CV analiz sonuçlarınızı görüntüleyin
            </p>
          </div>
          <LoadingSkeleton variant="card" rows={3} />
        </div>
      </div>
    );
  }

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          success: {
            style: {
              background: "#10B981",
              color: "#fff",
            },
          },
          error: {
            style: {
              background: "#EF4444",
              color: "#fff",
            },
          },
        }}
      />

      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Analizler</h1>
                <p className="text-gray-600 mt-1">
                  Tüm CV analiz işlemlerinizi görüntüleyin
                </p>
              </div>
              {canCreateAnalysis(userRole) && (
                <button
                  onClick={() => router.push("/wizard")}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-all duration-200 flex items-center gap-2 shadow-sm hover:shadow-md"
                >
                  <Plus className="w-5 h-5" />
                  Yeni Analiz
                </button>
              )}
            </div>
          </div>

          {/* Statistics */}
          {analyses.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <p className="text-sm text-gray-600">Toplam</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.total}
                </p>
              </div>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <p className="text-sm text-gray-600">Tamamlanan</p>
                <p className="text-2xl font-bold text-green-600">
                  {stats.completed}
                </p>
              </div>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <p className="text-sm text-gray-600">İşleniyor</p>
                <p className="text-2xl font-bold text-blue-600">
                  {stats.processing}
                </p>
              </div>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <p className="text-sm text-gray-600">Başarısız</p>
                <p className="text-2xl font-bold text-red-600">
                  {stats.failed}
                </p>
              </div>
            </div>
          )}

          {/* Search */}
          {analyses.length > 0 && (
            <div className="mb-6">
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="İş ilanı veya departman ara..."
                className="max-w-md"
              />
            </div>
          )}

          {/* Empty State */}
          {analyses.length === 0 && (
            <EmptyState
              icon={<Clock className="w-16 h-16" />}
              title="Henüz analiz yapmadınız"
              description="İlk analizinizi başlatmak için sihirbazı kullanın"
              action={
                canCreateAnalysis(userRole)
                  ? {
                      label: "Analiz Başlat",
                      onClick: () => router.push("/wizard"),
                    }
                  : undefined
              }
            />
          )}

          {/* No Search Results */}
          {analyses.length > 0 && filteredAnalyses.length === 0 && (
            <EmptyState
              icon={<Clock className="w-16 h-16" />}
              title="Sonuç bulunamadı"
              description="Arama kriterlerinize uygun analiz bulunamadı"
              action={{
                label: "Aramayı Temizle",
                onClick: () => setSearchQuery(""),
              }}
            />
          )}

          {/* Analyses List */}
          {filteredAnalyses.length > 0 && (
            <>
              <div className="space-y-4">
                {filteredAnalyses.map((analysis) => (
                  <AnalysisCard
                    key={analysis.id}
                    analysis={analysis}
                    onView={handleView}
                    onDelete={handleDelete}
                  />
                ))}
              </div>

              {/* Results Count */}
              <div className="mt-6 text-sm text-gray-600 text-center">
                {searchQuery ? (
                  <span>
                    {filteredAnalyses.length} / {analyses.length} analiz
                    gösteriliyor
                  </span>
                ) : (
                  <span>Toplam {analyses.length} analiz</span>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Delete Confirmation */}
      {showDeleteDialog && selectedAnalysis && (
        <ConfirmDialog
          isOpen={showDeleteDialog}
          onCancel={() => {
            setShowDeleteDialog(false);
            setSelectedAnalysis(null);
          }}
          onConfirm={confirmDelete}
          title="Analizi Sil"
          message={`"${selectedAnalysis.jobPosting.title}" analizini silmek istediğinizden emin misiniz?${
            selectedAnalysis._count?.analysisResults &&
            selectedAnalysis._count.analysisResults > 0
              ? ` Bu analiz ${selectedAnalysis._count.analysisResults} adet sonuç içeriyor.`
              : ""
          }`}
          confirmText="Sil"
          cancelText="İptal"
          variant="danger"
          loading={deleteLoading}
        />
      )}
    </>
  );
}

export default withRoleProtection(AnalysesPage, {
  allowedRoles: RoleGroups.HR_MANAGERS,
});
