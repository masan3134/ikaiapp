"use client";

import { useEffect, useState } from "react";
import { User, Upload, Trash2, FileSpreadsheet, Download } from "lucide-react";
import { Toaster, toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import {
  getCandidates,
  deleteCandidate,
  downloadCV,
  type Candidate,
} from "@/lib/services/candidateService";
import CandidateTable from "@/components/candidates/CandidateTable";
import CandidateCard from "@/components/candidates/CandidateCard";
import CandidateDetailModal from "@/components/candidates/CandidateDetailModal";
import EmptyState from "@/components/ui/EmptyState";
import LoadingSkeleton from "@/components/ui/LoadingSkeleton";
import SearchBar from "@/components/ui/SearchBar";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { parseApiError } from "@/lib/utils/errorHandler";
import { downloadBlob } from "@/lib/utils/fileUtils";
import { withRoleProtection } from "@/lib/hoc/withRoleProtection";
import { RoleGroups } from "@/lib/constants/roles";
import { useAuthStore } from "@/lib/store/authStore";
import {
  canCreateCandidate,
  canEditCandidate,
  canDeleteCandidate,
} from "@/lib/utils/rbac";

function CandidatesPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const userRole = user?.role;
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Modals
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showBulkDeleteDialog, setShowBulkDeleteDialog] = useState(false);

  // Selected item
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(
    null
  );
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  function handleViewCandidate(candidate: Candidate) {
    router.push(`/candidates/${candidate.id}`);
  }

  // Loading states
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [bulkDeleteLoading, setBulkDeleteLoading] = useState(false);

  // Load candidates
  async function loadCandidates() {
    try {
      setLoading(true);
      const data = await getCandidates();
      setCandidates(data.candidates || []);
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error("Load candidates error:", error);
      }
      toast.error(parseApiError(error));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCandidates();
  }, []);

  // Filter candidates
  const filteredCandidates = candidates.filter((candidate) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      candidate.firstName.toLowerCase().includes(query) ||
      candidate.lastName.toLowerCase().includes(query) ||
      (candidate.email && candidate.email.toLowerCase().includes(query)) ||
      (candidate.phone && candidate.phone.includes(query)) ||
      candidate.sourceFileName.toLowerCase().includes(query)
    );
  });

  // Handle actions
  function handleView(candidate: Candidate) {
    setSelectedCandidate(candidate);
    setShowDetailModal(true);
  }

  function handleDelete(candidate: Candidate) {
    setSelectedCandidate(candidate);
    setShowDeleteDialog(true);
  }

  async function handleDownload(candidate: Candidate) {
    try {
      setDownloadLoading(true);
      const blob = await downloadCV(candidate.id);
      downloadBlob(blob, candidate.sourceFileName);
      toast.success("CV indirildi");
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error("Download error:", error);
      }
      toast.error("CV indirilemedi");
    } finally {
      setDownloadLoading(false);
    }
  }

  async function confirmDelete() {
    if (!selectedCandidate) return;

    try {
      setDeleteLoading(true);
      const response = await deleteCandidate(selectedCandidate.id);
      setCandidates((prev) =>
        prev.filter((c) => c.id !== selectedCandidate.id)
      );
      toast.success(response.message || "Aday silindi");
      setShowDeleteDialog(false);
      setSelectedCandidate(null);
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error("Delete error:", error);
      }
      toast.error(parseApiError(error));
    } finally {
      setDeleteLoading(false);
    }
  }

  // Bulk selection handlers
  function toggleSelectAll() {
    if (selectedIds.length === filteredCandidates.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredCandidates.map((c) => c.id));
    }
  }

  function toggleSelect(id: string) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  async function confirmBulkDelete() {
    try {
      setBulkDeleteLoading(true);

      // Delete all selected candidates
      await Promise.all(selectedIds.map((id) => deleteCandidate(id)));

      setCandidates((prev) => prev.filter((c) => !selectedIds.includes(c.id)));
      toast.success(`${selectedIds.length} aday silindi`);
      setSelectedIds([]);
      setShowBulkDeleteDialog(false);
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error("Bulk delete error:", error);
      }
      toast.error("Toplu silme işlemi başarısız");
    } finally {
      setBulkDeleteLoading(false);
    }
  }

  function handleUploadClick() {
    router.push("/wizard");
  }

  // Export handler
  async function handleExport(format: "xlsx" | "csv") {
    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_URL;
      if (!API_BASE) {
        throw new Error("NEXT_PUBLIC_API_URL environment variable is not set");
      }
      const token = localStorage.getItem("auth_token");

      // Build URL with optional IDs
      let url = `${API_BASE}/api/v1/candidates/export/${format}`;
      if (selectedIds.length > 0) {
        url += `?ids=${selectedIds.join(",")}`;
      }

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
      a.download = `adaylar-${Date.now()}.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(downloadUrl);
      document.body.removeChild(a);

      const count =
        selectedIds.length > 0 ? selectedIds.length : candidates.length;
      toast.success(`${count} aday ${format.toUpperCase()} olarak indirildi`);
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error("Export error:", error);
      }
      toast.error("Export sırasında hata oluştu");
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Adaylar</h1>
            <p className="text-gray-600 mt-1">Tüm adaylarınızı yönetin</p>
          </div>
          <LoadingSkeleton variant="table" rows={5} />
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
                <h1 className="text-3xl font-bold text-gray-900">Adaylar</h1>
                <p className="text-gray-600 mt-1">
                  Tüm adaylarınızı yönetin ve CV'leri inceleyin
                </p>
              </div>
              {canCreateCandidate(userRole) && (
                <button
                  onClick={handleUploadClick}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-all duration-200 flex items-center gap-2 shadow-sm hover:shadow-md"
                >
                  <Upload className="w-5 h-5" />
                  CV Yükle
                </button>
              )}
            </div>
          </div>

          {/* Search & Bulk Actions */}
          {candidates.length > 0 && (
            <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="İsim, email, telefon veya dosya adı ara..."
                className="max-w-md"
              />

              {/* Bulk Actions */}
              <div className="flex gap-2">
                {/* Export Buttons */}
                <button
                  onClick={() => handleExport("xlsx")}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                  title={
                    selectedIds.length > 0
                      ? `${selectedIds.length} seçili adayı indir`
                      : "Tüm adayları indir"
                  }
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  Excel {selectedIds.length > 0 && `(${selectedIds.length})`}
                </button>
                <button
                  onClick={() => handleExport("csv")}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  title={
                    selectedIds.length > 0
                      ? `${selectedIds.length} seçili adayı indir`
                      : "Tüm adayları indir"
                  }
                >
                  <Download className="w-4 h-4" />
                  CSV {selectedIds.length > 0 && `(${selectedIds.length})`}
                </button>

                {/* Bulk Delete Button */}
                {selectedIds.length > 0 && canDeleteCandidate(userRole) && (
                  <button
                    onClick={() => setShowBulkDeleteDialog(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                  >
                    <Trash2 className="w-4 h-4" />
                    {selectedIds.length} Aday Sil
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Empty State */}
          {candidates.length === 0 && (
            <EmptyState
              icon={<User className="w-16 h-16" />}
              title="Henüz aday eklemediniz"
              description="İlk adayınızı eklemek için analiz sihirbazını kullanın"
              action={
                canCreateCandidate(userRole)
                  ? {
                      label: "Analiz Başlat",
                      onClick: handleUploadClick,
                    }
                  : undefined
              }
            />
          )}

          {/* No Search Results */}
          {candidates.length > 0 && filteredCandidates.length === 0 && (
            <EmptyState
              icon={<User className="w-16 h-16" />}
              title="Sonuç bulunamadı"
              description="Arama kriterlerinize uygun aday bulunamadı"
              action={{
                label: "Aramayı Temizle",
                onClick: () => setSearchQuery(""),
              }}
            />
          )}

          {/* Candidates Table (Desktop) / Cards (Mobile) */}
          {filteredCandidates.length > 0 && (
            <>
              {/* Table View - Hidden on mobile */}
              <div className="hidden md:block">
                <CandidateTable
                  candidates={filteredCandidates}
                  onView={handleViewCandidate}
                  onDelete={handleDelete}
                  onDownload={handleDownload}
                  selectedIds={selectedIds}
                  onToggleSelect={toggleSelect}
                  onToggleSelectAll={toggleSelectAll}
                />
              </div>

              {/* Card View - Visible on mobile */}
              <div className="md:hidden space-y-4">
                {filteredCandidates.map((candidate) => (
                  <CandidateCard
                    key={candidate.id}
                    candidate={candidate}
                    onView={handleViewCandidate}
                    onDelete={handleDelete}
                    onDownload={handleDownload}
                  />
                ))}
              </div>

              {/* Results Count */}
              <div className="mt-4 text-sm text-gray-600">
                {searchQuery ? (
                  <span>
                    {filteredCandidates.length} / {candidates.length} aday
                    gösteriliyor
                  </span>
                ) : (
                  <span>Toplam {candidates.length} aday</span>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedCandidate && (
        <CandidateDetailModal
          candidate={selectedCandidate}
          isOpen={showDetailModal}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedCandidate(null);
          }}
          onDelete={handleDelete}
          onDownload={handleDownload}
        />
      )}

      {/* Delete Confirmation */}
      {showDeleteDialog && selectedCandidate && (
        <ConfirmDialog
          isOpen={showDeleteDialog}
          onCancel={() => {
            setShowDeleteDialog(false);
            setSelectedCandidate(null);
          }}
          onConfirm={confirmDelete}
          title="Adayı Sil"
          message={`"${selectedCandidate.firstName} ${selectedCandidate.lastName}" adayını silmek istediğinizden emin misiniz?${
            selectedCandidate._count?.analysisResults &&
            selectedCandidate._count.analysisResults > 0
              ? ` Bu aday ${selectedCandidate._count.analysisResults} adet analizde kullanılmış.`
              : ""
          }`}
          confirmText="Sil"
          cancelText="İptal"
          variant="danger"
          loading={deleteLoading}
        />
      )}

      {/* Bulk Delete Confirmation */}
      {showBulkDeleteDialog && (
        <ConfirmDialog
          isOpen={showBulkDeleteDialog}
          onCancel={() => {
            setShowBulkDeleteDialog(false);
          }}
          onConfirm={confirmBulkDelete}
          title="Toplu Silme"
          message={`${selectedIds.length} adayı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.`}
          confirmText="Hepsini Sil"
          cancelText="İptal"
          variant="danger"
          loading={bulkDeleteLoading}
        />
      )}
    </>
  );
}

export default withRoleProtection(CandidatesPage, {
  allowedRoles: RoleGroups.HR_MANAGERS,
});
