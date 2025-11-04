"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { UserPlus, Check, Loader2, Upload, X, AlertCircle } from "lucide-react";
import { useToast } from "@/lib/hooks/useToast";
import {
  type Analysis,
  addCandidatesToAnalysis,
} from "@/lib/services/analysisService";
import {
  getCandidates,
  type Candidate,
  uploadCV,
  checkDuplicate,
} from "@/lib/services/candidateService";
import { parseApiError } from "@/lib/utils/errorHandler";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";

interface AddCandidatesModalProps {
  isOpen: boolean;
  onClose: () => void;
  analysis: Analysis;
  onSuccess: (addedCandidateIds: string[]) => Promise<void>;
}

export default function AddCandidatesModal({
  isOpen,
  onClose,
  analysis,
  onSuccess,
}: AddCandidatesModalProps) {
  const toast = useToast();
  const [allCandidates, setAllCandidates] = useState<Candidate[]>([]);
  const [selectedCandidateIds, setSelectedCandidateIds] = useState<Set<string>>(
    new Set()
  );
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // File upload states
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [uploadingFiles, setUploadingFiles] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Duplicate warning states
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);
  const [duplicateCandidate, setDuplicateCandidate] =
    useState<Candidate | null>(null);

  useEffect(() => {
    if (isOpen) {
      async function loadAvailableCandidates() {
        try {
          setLoading(true);
          const response = await getCandidates();
          setAllCandidates(response.candidates || []);
        } catch (error) {
          toast.error("Adaylar yuklenemedi.");
          if (process.env.NODE_ENV === "development") {
            console.error(error);
          }
        } finally {
          setLoading(false);
        }
      }
      loadAvailableCandidates();
    }
  }, [isOpen]);

  const availableCandidates = useMemo(() => {
    const existingIds = new Set(
      analysis.analysisResults?.map((r) => r.candidateId) || []
    );
    return allCandidates.filter((c) => !existingIds.has(c.id));
  }, [allCandidates, analysis.analysisResults]);

  // Filter candidates by search term
  const filteredCandidates = useMemo(() => {
    if (!searchTerm) return availableCandidates;

    const search = searchTerm.toLowerCase();
    return availableCandidates.filter(
      (candidate) =>
        candidate.firstName?.toLowerCase().includes(search) ||
        candidate.lastName?.toLowerCase().includes(search) ||
        candidate.email?.toLowerCase().includes(search) ||
        candidate.phone?.toLowerCase().includes(search) ||
        candidate.sourceFileName?.toLowerCase().includes(search)
    );
  }, [availableCandidates, searchTerm]);

  // Show only first 5 if no search, otherwise show all filtered results
  const displayedCandidates = searchTerm
    ? filteredCandidates
    : filteredCandidates.slice(0, 5);

  const handleToggleCandidate = (candidateId: string) => {
    setSelectedCandidateIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(candidateId)) {
        newSet.delete(candidateId);
      } else {
        newSet.add(candidateId);
      }
      return newSet;
    });
  };

  // File upload handlers
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  const MAX_FILES = 10;

  const addFiles = async (files: File[]) => {
    // Filter only PDFs
    const pdfFiles = files.filter((f) => {
      if (f.type !== "application/pdf") {
        toast.error(`${f.name} gecersiz format (sadece PDF)`);
        return false;
      }
      if (f.size > MAX_FILE_SIZE) {
        toast.error(`${f.name} cok buyuk (max 10MB)`);
        return false;
      }
      return true;
    });

    // Check duplicates in current upload list
    const newFiles = pdfFiles.filter(
      (f) => !uploadedFiles.some((existing) => existing.name === f.name)
    );

    if (newFiles.length < pdfFiles.length) {
      toast.error("Bazi dosyalar zaten eklendi.");
    }

    // Check max limit
    if (uploadedFiles.length + newFiles.length > MAX_FILES) {
      toast.error(`Maksimum ${MAX_FILES} dosya yuklenebilir`);
      return;
    }

    // Check each file against backend for existing candidates
    const filesToAdd: File[] = [];
    for (const file of newFiles) {
      try {
        const duplicateCheck = await checkDuplicate(file.name);
        if (duplicateCheck.exists && duplicateCheck.candidate) {
          // Show duplicate warning
          setDuplicateCandidate(duplicateCheck.candidate);
          setShowDuplicateModal(true);
          toast.warning(`${file.name} zaten sistemde kayitli`);
        } else {
          filesToAdd.push(file);
        }
      } catch (error) {
        if (process.env.NODE_ENV === "development") {
          console.error("Duplicate check failed:", error);
        }
        // If check fails, allow file to be added
        filesToAdd.push(file);
      }
    }

    setUploadedFiles((prev) => [...prev, ...filesToAdd]);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    addFiles(files);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const files = Array.from(e.dataTransfer.files);
    addFiles(files);
  };

  const removeFile = (fileName: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.name !== fileName));
  };

  // Helper: Get total candidates count
  const getTotalCandidatesCount = () => {
    return selectedCandidateIds.size + uploadedFiles.length;
  };

  // Helper: Get dynamic button text
  const getButtonText = () => {
    const total = getTotalCandidatesCount();
    if (total === 0) return "Aday Ekle";

    const selectedCount = selectedCandidateIds.size;
    const uploadCount = uploadedFiles.length;

    if (selectedCount > 0 && uploadCount > 0) {
      return `${total} Aday Ekle (${selectedCount} mevcut + ${uploadCount} yeni)`;
    } else if (selectedCount > 0) {
      return `${selectedCount} Aday Ekle`;
    } else {
      return `${uploadCount} Yeni Aday Ekle`;
    }
  };

  const handleSubmit = async () => {
    // Validation
    const totalCandidates = getTotalCandidatesCount();
    if (totalCandidates === 0) {
      toast.error("En az bir aday secin veya CV yukleyin.");
      return;
    }

    setSubmitting(true);
    const newCandidateIds: string[] = [];
    const failedFiles: string[] = [];

    try {
      // Step 1: Upload new CV files first
      if (uploadedFiles.length > 0) {
        setUploadingFiles(true);

        for (const file of uploadedFiles) {
          try {
            const response = await uploadCV(file);
            newCandidateIds.push(response.candidate.id);
            toast.success(`${file.name} yuklendi`);
          } catch (error) {
            if (process.env.NODE_ENV === "development") {
              console.error(`Upload failed for ${file.name}:`, error);
            }
            failedFiles.push(file.name);
            toast.error(`${file.name} yaklenelemedi`);
            // Continue with other files
          }
        }

        setUploadingFiles(false);
      }

      // Step 2: Combine selected + uploaded candidate IDs
      const allCandidateIds = [
        ...Array.from(selectedCandidateIds),
        ...newCandidateIds,
      ];

      if (allCandidateIds.length === 0) {
        toast.error("Hicbir aday eklenemedi.");
        return;
      }

      // Step 3: Add all candidates to analysis
      await addCandidatesToAnalysis(analysis.id, allCandidateIds);

      const successMsg =
        failedFiles.length > 0
          ? `${allCandidateIds.length} aday eklendi. ${failedFiles.length} dosya basarisiz.`
          : `${allCandidateIds.length} aday analize eklendi. Analiz guncelleniyor...`;

      toast.success(successMsg);
      await onSuccess(allCandidateIds);
      onClose();
    } catch (error) {
      toast.error(parseApiError(error));
    } finally {
      setSubmitting(false);
      setUploadingFiles(false);
    }
  };

  const handleClose = () => {
    // Warn if uploading
    if (uploadingFiles) {
      const confirmed = window.confirm(
        "CV yukleme devam ediyor. Iptal etmek istediginizden emin misiniz?"
      );
      if (!confirmed) {
        return;
      }
    }

    // Reset all state
    setSelectedCandidateIds(new Set());
    setUploadedFiles([]);
    setUploadingFiles(false);
    onClose();
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        title="Analize Aday Ekle"
        size="lg"
      >
        <div className="p-6">
          <p className="text-sm text-gray-600 mb-6">
            Mevcut adaylariniz arasindan secin veya yeni CV yukleyin.
          </p>

          {/* Section 1: Existing Candidates */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <UserPlus className="w-4 h-4" />
              Mevcut Adaylar
            </h3>

            {/* Search Bar */}
            {!loading && availableCandidates.length > 5 && (
              <div className="mb-4 relative">
                <input
                  type="text"
                  placeholder="Aday ara (ad, soyad, email, telefon)..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 placeholder:text-gray-400"
                />
                <UserPlus
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>
            )}

            {/* Results Count */}
            {!loading && availableCandidates.length > 0 && (
              <div className="mb-3 text-sm text-gray-600">
                {searchTerm ? (
                  <span>{displayedCandidates.length} aday bulundu</span>
                ) : (
                  <span>
                    {availableCandidates.length > 5
                      ? `Ilk 5 aday gosteriliyor (toplam ${availableCandidates.length})`
                      : `${availableCandidates.length} aday`}
                  </span>
                )}
              </div>
            )}

            {loading ? (
              <div className="flex justify-center items-center h-48">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              </div>
            ) : displayedCandidates.length > 0 ? (
              <div className="max-h-96 overflow-y-auto border border-gray-200 rounded-lg">
                <ul className="divide-y divide-gray-200">
                  {displayedCandidates.map((candidate) => (
                    <li
                      key={candidate.id}
                      onClick={() => handleToggleCandidate(candidate.id)}
                      className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
                          {selectedCandidateIds.has(candidate.id) ? (
                            <Check className="w-4 h-4 text-blue-600" />
                          ) : (
                            <div className="w-4 h-4 border-2 border-gray-400 rounded-sm"></div>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">
                            {candidate.firstName} {candidate.lastName}
                          </p>
                          <p className="text-sm text-gray-500">
                            {candidate.email}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs text-gray-400">
                        {candidate.sourceFileName}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-lg">
                <UserPlus className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  Eklenecek yeni aday bulunmuyor
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Tum adaylariniz zaten bu analize dahil edilmis.
                </p>
              </div>
            )}
          </div>

          {/* Section 2: Upload New CVs */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <Upload className="w-4 h-4" />
              Yeni CV Yukle
            </h3>

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf"
              onChange={handleFileSelect}
              className="hidden"
            />

            {/* Drag-drop zone */}
            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all"
            >
              <Upload className="mx-auto h-10 w-10 text-gray-400 mb-2" />
              <p className="text-sm text-gray-600">
                Dosyalari buraya surukleyin veya{" "}
                <span className="text-blue-600 font-medium">dosya secin</span>
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Sadece PDF dosyalari (max 10MB, en fazla 10 dosya)
              </p>
            </div>

            {/* Uploaded files list */}
            {uploadedFiles.length > 0 && (
              <div className="mt-4 space-y-2">
                {uploadedFiles.map((file) => (
                  <div
                    key={file.name}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                      <span className="text-sm text-gray-700 truncate">
                        {file.name}
                      </span>
                      <span className="text-xs text-gray-500 flex-shrink-0">
                        ({(file.size / 1024).toFixed(1)} KB)
                      </span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile(file.name);
                      }}
                      className="ml-2 p-1 hover:bg-gray-200 rounded transition-colors"
                      disabled={uploadingFiles}
                    >
                      <X className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3">
          <Button
            variant="secondary"
            onClick={handleClose}
            disabled={submitting}
          >
            Iptal
          </Button>
          <Button
            onClick={handleSubmit}
            loading={submitting || uploadingFiles}
            disabled={loading || getTotalCandidatesCount() === 0}
          >
            {uploadingFiles ? "CV Yukleniyor..." : getButtonText()}
          </Button>
        </div>
      </Modal>

      {/* Duplicate Warning Modal */}
      {showDuplicateModal && duplicateCandidate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <AlertCircle size={24} className="text-yellow-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Dosya Zaten Mevcut
                </h3>
                <p className="text-sm text-gray-600">
                  Bu dosya daha once yuklendi
                </p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <p className="text-sm text-gray-700">
                <span className="font-medium">Dosya Adi:</span>{" "}
                {duplicateCandidate.sourceFileName}
              </p>
              <p className="text-sm text-gray-700 mt-2">
                <span className="font-medium">Yuklenme Tarihi:</span>{" "}
                {new Date(duplicateCandidate.createdAt).toLocaleDateString(
                  "tr-TR"
                )}
              </p>
              {duplicateCandidate.firstName && duplicateCandidate.lastName && (
                <p className="text-sm text-gray-700 mt-2">
                  <span className="font-medium">Aday:</span>{" "}
                  {duplicateCandidate.firstName} {duplicateCandidate.lastName}
                </p>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDuplicateModal(false);
                  setDuplicateCandidate(null);
                }}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
              >
                Tamam
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
