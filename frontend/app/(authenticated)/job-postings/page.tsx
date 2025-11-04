"use client";

import { useEffect, useState } from "react";
import {
  Plus,
  Briefcase,
  Trash2,
  FileSpreadsheet,
  Download,
} from "lucide-react";
import {
  getJobPostings,
  createJobPosting,
  updateJobPosting,
  deleteJobPosting,
  type JobPosting,
  type CreateJobPostingData,
  type UpdateJobPostingData,
} from "@/lib/services/jobPostingService";
import JobPostingTable from "@/components/job-postings/JobPostingTable";
import JobPostingForm from "@/components/job-postings/JobPostingForm";
import JobPostingDetailModal from "@/components/job-postings/JobPostingDetailModal";
import Modal from "@/components/ui/Modal";
import EmptyState from "@/components/ui/EmptyState";
import LoadingSkeleton from "@/components/ui/LoadingSkeleton";
import SearchBar from "@/components/ui/SearchBar";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { parseApiError } from "@/lib/utils/errorHandler";
import { useAsync } from "@/lib/hooks/useAsync";
import { useModal } from "@/lib/hooks/useModal";
import { useToast } from "@/lib/hooks/useToast";
import { withRoleProtection } from "@/lib/hoc/withRoleProtection";
import { RoleGroups } from "@/lib/constants/roles";
import { useAuthStore } from "@/lib/store/authStore";
import {
  canCreateJobPosting,
  canEditJobPosting,
  canDeleteJobPosting,
} from "@/lib/utils/rbac";

function JobPostingsPage() {
  const toast = useToast();
  const { user } = useAuthStore();
  const userRole = user?.role;
  const [jobPostings, setJobPostings] = useState<JobPosting[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Modals using custom hook
  const createModal = useModal();
  const editModal = useModal();
  const detailModal = useModal();
  const deleteDialog = useModal();
  const bulkDeleteDialog = useModal();

  // Selected item
  const [selectedJobPosting, setSelectedJobPosting] =
    useState<JobPosting | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Data fetching with useAsync
  const { loading, execute: loadJobPostings } = useAsync(async () => {
    const data = await getJobPostings();
    setJobPostings(data.jobPostings || []);
    return data;
  });

  // CRUD operations with useAsync
  const { loading: formLoading, execute: executeCreate } =
    useAsync(createJobPosting);
  const { loading: updateLoading, execute: executeUpdate } =
    useAsync(updateJobPosting);
  const { loading: deleteLoading, execute: executeDelete } =
    useAsync(deleteJobPosting);

  useEffect(() => {
    loadJobPostings().catch((error) => {
      if (process.env.NODE_ENV === "development") {
        console.error("Load job postings error:", error);
      }
      toast.error(parseApiError(error));
    });
  }, []);

  // Filter job postings
  const filteredJobPostings = jobPostings.filter((posting) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      posting.title.toLowerCase().includes(query) ||
      posting.department.toLowerCase().includes(query)
    );
  });

  // Create job posting
  async function handleCreate(data: CreateJobPostingData) {
    try {
      const response = await executeCreate(data);
      if (response) {
        setJobPostings((prev) => [response.jobPosting, ...prev]);
        toast.success(response.message || "İş ilanı oluşturuldu");
        createModal.close();
      }
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error("Create error:", error);
      }
      toast.error(parseApiError(error));
    }
  }

  // Update job posting
  async function handleUpdate(data: UpdateJobPostingData) {
    if (!selectedJobPosting) return;

    try {
      const response = await executeUpdate(selectedJobPosting.id, data);
      if (response) {
        setJobPostings((prev) =>
          prev.map((jp) =>
            jp.id === selectedJobPosting.id ? response.jobPosting : jp
          )
        );
        toast.success(response.message || "İş ilanı güncellendi");
        editModal.close();
        setSelectedJobPosting(null);
      }
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error("Update error:", error);
      }
      toast.error(parseApiError(error));
    }
  }

  // Delete job posting
  async function handleDeleteConfirm() {
    if (!selectedJobPosting) return;

    try {
      const response = await executeDelete(selectedJobPosting.id);
      if (response) {
        setJobPostings((prev) =>
          prev.filter((jp) => jp.id !== selectedJobPosting.id)
        );
        toast.success(response.message || "İş ilanı silindi");
        deleteDialog.close();
        setSelectedJobPosting(null);
      }
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error("Delete error:", error);
      }
      toast.error(parseApiError(error));
    }
  }

  // Handle actions
  function handleView(jobPosting: JobPosting) {
    setSelectedJobPosting(jobPosting);
    detailModal.open();
  }

  function handleEdit(jobPosting: JobPosting) {
    setSelectedJobPosting(jobPosting);
    editModal.open();
  }

  function handleDelete(jobPosting: JobPosting) {
    setSelectedJobPosting(jobPosting);
    deleteDialog.open();
  }

  function handleDetailEdit(jobPosting: JobPosting) {
    detailModal.close();
    editModal.open();
  }

  function handleDetailDelete(jobPosting: JobPosting) {
    detailModal.close();
    deleteDialog.open();
  }

  // Bulk selection handlers
  function toggleSelectAll() {
    if (selectedIds.length === filteredJobPostings.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredJobPostings.map((jp) => jp.id));
    }
  }

  function toggleSelect(id: string) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  // Export handler
  async function handleExport(format: "xlsx" | "csv") {
    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_URL;
      if (!API_BASE) {
        throw new Error("NEXT_PUBLIC_API_URL environment variable is not set");
      }
      const token = localStorage.getItem("auth_token");

      let url = `${API_BASE}/api/v1/job-postings/export/${format}`;
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
      a.download = `is-ilanlari-${Date.now()}.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(downloadUrl);
      document.body.removeChild(a);

      const count =
        selectedIds.length > 0 ? selectedIds.length : jobPostings.length;
      toast.success(
        `${count} iş ilanı ${format.toUpperCase()} olarak indirildi`
      );
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error("Export error:", error);
      }
      toast.error("Export sırasında hata oluştu");
    }
  }

  async function handleBulkDeleteConfirm() {
    try {
      // Delete all selected job postings
      await Promise.all(selectedIds.map((id) => deleteJobPosting(id)));

      setJobPostings((prev) =>
        prev.filter((jp) => !selectedIds.includes(jp.id))
      );
      toast.success(`${selectedIds.length} iş ilanı silindi`);
      setSelectedIds([]);
      bulkDeleteDialog.close();
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error("Bulk delete error:", error);
      }
      toast.error("Toplu silme işlemi başarısız");
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">İş İlanları</h1>
            <p className="text-gray-600 mt-1">İş ilanlarınızı yönetin</p>
          </div>
          <LoadingSkeleton variant="grid" rows={2} columns={3} />
        </div>
      </div>
    );
  }

  return (
    <>
      <toast.Toaster position="top-right" />

      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  İş İlanları
                </h1>
                <p className="text-gray-600 mt-1">
                  İş ilanlarınızı yönetin ve yeni pozisyonlar ekleyin
                </p>
              </div>
              {canCreateJobPosting(userRole) && (
                <button
                  onClick={createModal.open}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-all duration-200 flex items-center gap-2 shadow-sm hover:shadow-md"
                >
                  <Plus className="w-5 h-5" />
                  Yeni İlan Ekle
                </button>
              )}
            </div>
          </div>

          {/* Search & Bulk Actions */}
          {jobPostings.length > 0 && (
            <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="İlan başlığı veya departman ara..."
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
                      ? `${selectedIds.length} seçili ilanı indir`
                      : "Tüm ilanları indir"
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
                      ? `${selectedIds.length} seçili ilanı indir`
                      : "Tüm ilanları indir"
                  }
                >
                  <Download className="w-4 h-4" />
                  CSV {selectedIds.length > 0 && `(${selectedIds.length})`}
                </button>

                {/* Bulk Delete Button */}
                {selectedIds.length > 0 && canDeleteJobPosting(userRole) && (
                  <button
                    onClick={bulkDeleteDialog.open}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                  >
                    <Trash2 className="w-4 h-4" />
                    {selectedIds.length} İlan Sil
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Empty State */}
          {jobPostings.length === 0 && (
            <EmptyState
              icon={<Briefcase className="w-16 h-16" />}
              title="Henüz iş ilanı eklemediniz"
              description="İlk iş ilanınızı oluşturmak için yukarıdaki butona tıklayın"
              action={
                canCreateJobPosting(userRole)
                  ? {
                      label: "İlan Oluştur",
                      onClick: createModal.open,
                    }
                  : undefined
              }
            />
          )}

          {/* No Search Results */}
          {jobPostings.length > 0 && filteredJobPostings.length === 0 && (
            <EmptyState
              icon={<Briefcase className="w-16 h-16" />}
              title="Sonuç bulunamadı"
              description="Arama kriterlerinize uygun iş ilanı bulunamadı"
              action={{
                label: "Aramayı Temizle",
                onClick: () => setSearchQuery(""),
              }}
            />
          )}

          {/* Job Postings Table */}
          {filteredJobPostings.length > 0 && (
            <>
              <JobPostingTable
                jobPostings={filteredJobPostings}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
                selectedIds={selectedIds}
                onToggleSelect={toggleSelect}
                onToggleSelectAll={toggleSelectAll}
              />

              {/* Results Count */}
              <div className="mt-6 text-sm text-gray-600 text-center">
                {searchQuery ? (
                  <span>
                    {filteredJobPostings.length} / {jobPostings.length} iş ilanı
                    gösteriliyor
                  </span>
                ) : (
                  <span>Toplam {jobPostings.length} iş ilanı</span>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Create Modal */}
      {createModal.isOpen && (
        <Modal
          isOpen={createModal.isOpen}
          onClose={createModal.close}
          title="Yeni İş İlanı Oluştur"
          size="lg"
        >
          <JobPostingForm
            onSubmit={handleCreate}
            onCancel={createModal.close}
            loading={formLoading}
          />
        </Modal>
      )}

      {/* Edit Modal */}
      {editModal.isOpen && selectedJobPosting && (
        <Modal
          isOpen={editModal.isOpen}
          onClose={() => {
            editModal.close();
            setSelectedJobPosting(null);
          }}
          title="İş İlanını Düzenle"
          size="lg"
        >
          <JobPostingForm
            initialData={selectedJobPosting}
            onSubmit={handleUpdate}
            onCancel={() => {
              editModal.close();
              setSelectedJobPosting(null);
            }}
            loading={formLoading || updateLoading}
          />
        </Modal>
      )}

      {/* Detail Modal */}
      {detailModal.isOpen && selectedJobPosting && (
        <JobPostingDetailModal
          jobPosting={selectedJobPosting}
          isOpen={detailModal.isOpen}
          onClose={() => {
            detailModal.close();
            setSelectedJobPosting(null);
          }}
          onEdit={handleDetailEdit}
          onDelete={handleDetailDelete}
        />
      )}

      {/* Delete Confirmation */}
      {deleteDialog.isOpen && selectedJobPosting && (
        <ConfirmDialog
          isOpen={deleteDialog.isOpen}
          onCancel={() => {
            deleteDialog.close();
            setSelectedJobPosting(null);
          }}
          onConfirm={handleDeleteConfirm}
          title="İş İlanını Sil"
          message={`"${selectedJobPosting.title}" ilanını silmek istediğinizden emin misiniz?${
            selectedJobPosting._count?.analyses &&
            selectedJobPosting._count.analyses > 0
              ? ` Bu iş ilanı ${selectedJobPosting._count.analyses} adet analizde kullanılmış.`
              : ""
          }`}
          confirmText="Sil"
          cancelText="İptal"
          variant="danger"
          loading={deleteLoading}
        />
      )}

      {/* Bulk Delete Confirmation */}
      {bulkDeleteDialog.isOpen && (
        <ConfirmDialog
          isOpen={bulkDeleteDialog.isOpen}
          onCancel={bulkDeleteDialog.close}
          onConfirm={handleBulkDeleteConfirm}
          title="Toplu Silme"
          message={`${selectedIds.length} iş ilanını silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.`}
          confirmText="Hepsini Sil"
          cancelText="İptal"
          variant="danger"
          loading={false}
        />
      )}
    </>
  );
}

export default withRoleProtection(JobPostingsPage, {
  allowedRoles: RoleGroups.HR_MANAGERS,
  redirectTo: "/dashboard",
});
