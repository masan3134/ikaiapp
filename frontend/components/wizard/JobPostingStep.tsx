"use client";

import { useState, useEffect } from "react";
import { useWizardStore } from "@/lib/store/wizardStore";
import type { JobPosting } from "@/lib/store/wizardStore";
import { getLastJobPosting } from "@/lib/utils/wizardPreferences";
import axios from "axios";
import { Briefcase, Plus, Search } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
if (!API_URL) {
  throw new Error("NEXT_PUBLIC_API_URL environment variable is not set");
}

export default function JobPostingStep() {
  const [activeTab, setActiveTab] = useState<"existing" | "new">("existing");
  const [jobPostings, setJobPostings] = useState<JobPosting[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    selectedJobPosting,
    isNewJobPosting,
    newJobPostingData,
    setJobPosting,
    setNewJobPostingData,
    setError,
  } = useWizardStore();

  useEffect(() => {
    if (activeTab === "existing") {
      fetchJobPostings();
    }
  }, [activeTab]);

  const fetchJobPostings = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("auth_token");
      const response = await axios.get(`${API_URL}/api/v1/job-postings`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const jobs = response.data.jobPostings;
      setJobPostings(jobs);

      // Smart default: Auto-select last used job posting if nothing selected
      if (!selectedJobPosting && !isNewJobPosting) {
        const lastJobId = getLastJobPosting();
        if (lastJobId) {
          const lastJob = jobs.find((j: JobPosting) => j.id === lastJobId);
          if (lastJob) {
            setJobPosting(lastJob, false);
            if (process.env.NODE_ENV === "development") {
              console.log(
                "✅ Auto-selected last used job posting:",
                lastJob.title
              );
            }
          }
        }
      }
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error("Fetch job postings error:", error);
      }
      setError("İş ilanları yüklenemedi");
    } finally {
      setLoading(false);
    }
  };

  const filteredJobPostings = jobPostings.filter((job) =>
    job.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Show only last 5 if not searching
  const displayedJobPostings = searchTerm
    ? filteredJobPostings
    : filteredJobPostings.slice(0, 5);

  const handleSelectJobPosting = (job: JobPosting) => {
    setJobPosting(job, false);
  };

  const handleNewJobPostingChange = (field: string, value: string) => {
    setNewJobPostingData({ [field]: value });
    // Automatically set isNewJobPosting to true when user fills the form
    if (!isNewJobPosting) {
      setJobPosting(null, true);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">İş İlanı Seçimi</h2>
        <p className="text-gray-600 mt-1">
          Analiz için bir iş ilanı seçin veya yeni oluşturun
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab("existing")}
          className={`px-6 py-3 font-medium transition-colors ${
            activeTab === "existing"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Mevcut İlan Seç
        </button>
        <button
          onClick={() => setActiveTab("new")}
          className={`px-6 py-3 font-medium transition-colors ${
            activeTab === "new"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Yeni İlan Oluştur
        </button>
      </div>

      {/* Existing Job Postings Tab */}
      {activeTab === "existing" && (
        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="İş ilanı ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400 bg-white"
            />
          </div>

          {/* Job Postings Grid */}
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-600">Yükleniyor...</p>
            </div>
          ) : displayedJobPostings.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <Briefcase size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600">
                {searchTerm
                  ? "Arama sonucu bulunamadı"
                  : "Henüz iş ilanı bulunmuyor"}
              </p>
              <button
                onClick={() =>
                  searchTerm ? setSearchTerm("") : setActiveTab("new")
                }
                className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
              >
                {searchTerm ? "Aramayı Temizle" : "Yeni İlan Oluştur"}
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {displayedJobPostings.map((job) => (
                  <div
                    key={job.id}
                    onClick={() => handleSelectJobPosting(job)}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedJobPosting?.id === job.id && !isNewJobPosting
                        ? "border-blue-600 bg-blue-50"
                        : "border-gray-200 hover:border-blue-300"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">
                          {job.title}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {job.department}
                        </p>
                        <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                          {job.details}
                        </p>
                      </div>
                      {selectedJobPosting?.id === job.id &&
                        !isNewJobPosting && (
                          <div className="ml-3">
                            <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                              <svg
                                className="w-4 h-4 text-white"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </div>
                          </div>
                        )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Show more info if not searching and there are more items */}
              {!searchTerm && filteredJobPostings.length > 5 && (
                <div className="text-center py-3 text-sm text-gray-600">
                  Son 5 ilan gösteriliyor. Daha fazlası için arama yapın.
                  <span className="ml-1 text-gray-500">
                    (Toplam {filteredJobPostings.length} ilan)
                  </span>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* New Job Posting Tab */}
      {activeTab === "new" && (
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Plus size={20} className="text-blue-600 mt-0.5" />
              <div>
                <p className="text-sm text-blue-900 font-medium">
                  Yeni İş İlanı
                </p>
                <p className="text-sm text-blue-700 mt-1">
                  İlan veritabanına kaydedilecektir
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                İş İlanı Başlığı <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={newJobPostingData.title}
                onChange={(e) =>
                  handleNewJobPostingChange("title", e.target.value)
                }
                placeholder="örn: Senior Full Stack Developer"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder:text-gray-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Departman <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={newJobPostingData.department}
                onChange={(e) =>
                  handleNewJobPostingChange("department", e.target.value)
                }
                placeholder="örn: Yazılım Geliştirme"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder:text-gray-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                İş İlanı Detayları <span className="text-red-500">*</span>
              </label>
              <textarea
                value={newJobPostingData.details}
                onChange={(e) =>
                  handleNewJobPostingChange("details", e.target.value)
                }
                placeholder="İş tanımı, aranan özellikler, gereksinimler..."
                rows={6}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-gray-900 placeholder:text-gray-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notlar (Opsiyonel)
              </label>
              <textarea
                value={newJobPostingData.notes}
                onChange={(e) =>
                  handleNewJobPostingChange("notes", e.target.value)
                }
                placeholder="Ekstra notlar, özel talepler..."
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-gray-900 placeholder:text-gray-400"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
