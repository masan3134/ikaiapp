"use client";

import { useState, useEffect } from "react";
import { Search, X, Users, Loader2 } from "lucide-react";
import interviewService, { Candidate } from "@/lib/services/interviewService";

interface Step1Props {
  data: {
    selectedCandidates: Candidate[];
    selectedIds: string[];
  };
  onChange: (data: any) => void;
}

export default function Step1_CandidateSelection({
  data,
  onChange,
}: Step1Props) {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadCandidates();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadCandidates(searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const loadCandidates = async (search?: string) => {
    try {
      setLoading(true);
      setError("");
      const result = await interviewService.getRecentCandidates(search, 10);
      setCandidates(result);
    } catch (err: any) {
      console.error("Failed to load candidates:", err);
      setError(err.response?.data?.error || "Adaylar yüklenemedi");
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = (candidate: Candidate) => {
    const isSelected = data.selectedIds.includes(candidate.id);

    if (isSelected) {
      onChange({
        selectedIds: data.selectedIds.filter((id) => id !== candidate.id),
        selectedCandidates: data.selectedCandidates.filter(
          (c) => c.id !== candidate.id
        ),
      });
    } else {
      onChange({
        selectedIds: [...data.selectedIds, candidate.id],
        selectedCandidates: [...data.selectedCandidates, candidate],
      });
    }
  };

  const handleSelectAll = () => {
    if (data.selectedIds.length === candidates.length) {
      onChange({ selectedIds: [], selectedCandidates: [] });
    } else {
      onChange({
        selectedIds: candidates.map((c) => c.id),
        selectedCandidates: candidates,
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Aday Seçimi</h3>
        <span className="text-sm font-medium text-blue-600">
          {data.selectedIds.length} aday seçildi
        </span>
      </div>

      <div className="relative">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          size={20}
        />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Aday adı, email veya pozisyon ara..."
          className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        )}
      </div>

      {candidates.length > 0 && (
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={
                data.selectedIds.length === candidates.length &&
                candidates.length > 0
              }
              onChange={handleSelectAll}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-700">
              Tümünü Seç
            </span>
          </label>
        </div>
      )}

      <div className="border border-gray-200 rounded-lg divide-y max-h-96 overflow-y-auto">
        {loading ? (
          <div className="p-8 text-center">
            <Loader2
              className="animate-spin mx-auto mb-2 text-blue-600"
              size={32}
            />
            <p className="text-gray-500">Adaylar yükleniyor...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center">
            <p className="text-red-600 mb-2">{error}</p>
            <button
              onClick={() => loadCandidates()}
              className="text-sm text-blue-600 hover:underline"
            >
              Tekrar Dene
            </button>
          </div>
        ) : candidates.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            {searchQuery ? "Aday bulunamadı" : "Henüz aday yok"}
          </div>
        ) : (
          candidates.map((candidate) => {
            const isSelected = data.selectedIds.includes(candidate.id);
            const fullName = `${candidate.firstName} ${candidate.lastName}`;

            return (
              <label
                key={candidate.id}
                className={`flex items-start gap-3 p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                  isSelected ? "bg-blue-50 border-l-4 border-blue-600" : ""
                }`}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => handleToggle(candidate)}
                  className="mt-1 w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                />
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">{fullName}</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    {candidate.phone || "Telefon yok"}
                  </p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                    <span>{candidate.email}</span>
                    <span>•</span>
                    <span>
                      {new Date(candidate.createdAt).toLocaleDateString(
                        "tr-TR"
                      )}
                    </span>
                  </div>
                </div>
              </label>
            );
          })
        )}
      </div>

      {data.selectedIds.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-blue-800">
            <Users size={20} />
            <span className="font-medium">
              {data.selectedIds.length} aday seçildi - Devam etmek için İleri
              butonuna tıklayın
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
