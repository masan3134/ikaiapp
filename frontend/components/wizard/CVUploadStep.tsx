"use client";

import { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { useWizardStore } from "@/lib/store/wizardStore";
import type { Candidate } from "@/lib/store/wizardStore";
import axios from "axios";
import { Upload, FileText, X, AlertCircle } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
if (!API_URL) {
  throw new Error("NEXT_PUBLIC_API_URL environment variable is not set");
}

export default function CVUploadStep() {
  const [activeTab, setActiveTab] = useState<"upload" | "existing">("upload");
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);
  const [duplicateCandidate, setDuplicateCandidate] =
    useState<Candidate | null>(null);

  const {
    uploadedFiles,
    selectedCandidates,
    addFile,
    removeFile,
    addCandidate,
    removeCandidate,
    error,
    setError,
  } = useWizardStore();

  useEffect(() => {
    if (activeTab === "existing") {
      fetchCandidates();
    }
  }, [activeTab]);

  const fetchCandidates = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("auth_token");
      const response = await axios.get(`${API_URL}/api/v1/candidates`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCandidates(response.data.candidates);
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error("Fetch candidates error:", error);
      }
      setError("Adaylar yüklenemedi");
    } finally {
      setLoading(false);
    }
  };

  const checkDuplicate = async (fileName: string): Promise<boolean> => {
    try {
      const token = localStorage.getItem("auth_token");
      const response = await axios.post(
        `${API_URL}/api/v1/candidates/check-duplicate`,
        { fileName },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.exists) {
        setDuplicateCandidate(response.data.candidate);
        setShowDuplicateModal(true);
        return true;
      }
      return false;
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error("Check duplicate error:", error);
      }
      return false;
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "application/pdf": [".pdf"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
      "text/html": [".html"],
      "text/plain": [".txt"],
      "text/csv": [".csv"],
    },
    maxSize: 10 * 1024 * 1024,
    onDrop: async (acceptedFiles, rejectedFiles) => {
      if (rejectedFiles.length > 0) {
        const errors = rejectedFiles.map((f) => {
          if (f.errors[0]?.code === "file-too-large")
            return `${f.file.name}: Dosya çok büyük (max 10MB)`;
          if (f.errors[0]?.code === "file-invalid-type")
            return `${f.file.name}: Geçersiz dosya tipi`;
          return f.errors[0]?.message || "Dosya hatası";
        });
        setError(errors.join(", "));
        return;
      }

      for (const file of acceptedFiles) {
        const totalFiles = uploadedFiles.length + selectedCandidates.length;
        if (totalFiles >= 50) {
          setError("Maksimum 50 CV seçebilirsiniz");
          break;
        }

        const isDuplicate = await checkDuplicate(file.name);
        if (!isDuplicate) {
          addFile(file);
        }
      }
    },
  });

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const handleCandidateToggle = (candidate: Candidate) => {
    const isSelected = selectedCandidates.find((c) => c.id === candidate.id);
    if (isSelected) {
      removeCandidate(candidate.id);
    } else {
      const totalCandidates = uploadedFiles.length + selectedCandidates.length;
      if (totalCandidates >= 50) {
        setError("Maksimum 50 CV seçebilirsiniz");
        return;
      }
      addCandidate(candidate);
    }
  };

  // Filter candidates based on search term
  const filteredCandidates = candidates.filter((candidate) => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      candidate.firstName?.toLowerCase().includes(search) ||
      candidate.lastName?.toLowerCase().includes(search) ||
      candidate.email?.toLowerCase().includes(search) ||
      candidate.phone?.toLowerCase().includes(search) ||
      candidate.sourceFileName?.toLowerCase().includes(search)
    );
  });

  // Show only first 5 if no search, otherwise show all filtered results
  const displayedCandidates = searchTerm
    ? filteredCandidates
    : filteredCandidates.slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">CV Yükleme</h2>
        <p className="text-gray-600 mt-1">
          CV dosyalarını yükleyin veya mevcut adaylardan seçin
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab("upload")}
          className={`px-6 py-3 font-medium transition-colors ${
            activeTab === "upload"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Dosya Yükle
        </button>
        <button
          onClick={() => setActiveTab("existing")}
          className={`px-6 py-3 font-medium transition-colors ${
            activeTab === "existing"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Mevcut Adaylardan Seç
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
          <AlertCircle size={20} />
          <span>{error}</span>
          <button onClick={() => setError(null)} className="ml-auto">
            <X size={20} />
          </button>
        </div>
      )}

      {/* Upload Tab */}
      {activeTab === "upload" && (
        <div className="space-y-4">
          {/* Dropzone */}
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300 hover:border-blue-400"
            }`}
          >
            <input {...getInputProps()} />
            <Upload size={48} className="mx-auto text-gray-400 mb-4" />
            {isDragActive ? (
              <p className="text-blue-600 font-medium">
                Dosyaları buraya bırakın...
              </p>
            ) : (
              <>
                <p className="text-gray-700 font-medium mb-2">
                  Dosyaları sürükleyip bırakın veya seçmek için tıklayın
                </p>
                <p className="text-sm text-gray-500">
                  PDF, DOCX, DOC, HTML, TXT, CSV (Maks. 10MB, Toplam 50 dosya)
                </p>
              </>
            )}
          </div>

          {/* Uploaded Files List */}
          {uploadedFiles.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-900">
                Yüklenecek Dosyalar ({uploadedFiles.length}/50)
              </h3>
              {uploadedFiles.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <div className="flex items-center gap-3">
                    <FileText size={20} className="text-blue-600" />
                    <div>
                      <p className="font-medium text-gray-900">{file.name}</p>
                      <p className="text-sm text-gray-500">
                        {formatFileSize(file.size)}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFile(index)}
                    className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50"
                  >
                    <X size={20} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Existing Candidates Tab */}
      {activeTab === "existing" && (
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-600">Yükleniyor...</p>
            </div>
          ) : (candidates?.length || 0) === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <FileText size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600">Henüz aday bulunmuyor</p>
            </div>
          ) : (
            <>
              {/* Search Bar */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Aday ara (ad, soyad, email, telefon)..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 placeholder:text-gray-400"
                />
                <FileText
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

              {/* Results Count */}
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>Seçili: {selectedCandidates.length} / 50</span>
                <span>
                  {searchTerm
                    ? `${displayedCandidates.length} aday bulundu`
                    : `İlk 5 aday gösteriliyor (toplam ${candidates.length})`}
                </span>
              </div>

              <div className="space-y-2">
                {displayedCandidates.map((candidate) => {
                  const isSelected = selectedCandidates.find(
                    (c) => c.id === candidate.id
                  );
                  return (
                    <div
                      key={candidate.id}
                      onClick={() => handleCandidateToggle(candidate)}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        isSelected
                          ? "border-blue-600 bg-blue-50"
                          : "border-gray-200 hover:border-blue-300"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1">
                          <input
                            type="checkbox"
                            checked={!!isSelected}
                            readOnly
                            className="w-4 h-4 text-blue-600 flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900">
                              {candidate.firstName && candidate.lastName
                                ? `${candidate.firstName} ${candidate.lastName}`
                                : candidate.sourceFileName}
                            </p>
                            <div className="flex flex-wrap gap-2 mt-1">
                              {candidate.email && (
                                <p className="text-sm text-gray-600">
                                  📧 {candidate.email}
                                </p>
                              )}
                              {candidate.phone && (
                                <p className="text-sm text-gray-600">
                                  📱 {candidate.phone}
                                </p>
                              )}
                            </div>
                            <p className="text-xs text-gray-400 mt-1">
                              {candidate.sourceFileName} •{" "}
                              {new Date(candidate.createdAt).toLocaleDateString(
                                "tr-TR"
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      )}

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
                  Bu dosya daha önce yüklendi
                </p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <p className="text-sm text-gray-700">
                <span className="font-medium">Dosya Adı:</span>{" "}
                {duplicateCandidate.sourceFileName}
              </p>
              <p className="text-sm text-gray-700 mt-2">
                <span className="font-medium">Yüklenme Tarihi:</span>{" "}
                {new Date(duplicateCandidate.createdAt).toLocaleDateString(
                  "tr-TR"
                )}
              </p>
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
    </div>
  );
}
