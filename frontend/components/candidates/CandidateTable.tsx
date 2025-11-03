'use client';

import { Eye, Download, Trash2, Calendar, FileText } from 'lucide-react';
import type { Candidate } from '@/lib/services/candidateService';
import CandidateAvatar from './CandidateAvatar';
import Badge from '@/components/ui/Badge';
import { formatDate } from '@/lib/utils/dateFormat';
import { getFullName, fixFileNameEncoding } from '@/lib/utils/stringUtils';

export interface CandidateTableProps {
  candidates: Candidate[];
  onView: (candidate: Candidate) => void;
  onDelete: (candidate: Candidate) => void;
  onDownload: (candidate: Candidate) => void;
  selectedIds?: string[];
  onToggleSelect?: (id: string) => void;
  onToggleSelectAll?: () => void;
}

export default function CandidateTable({
  candidates,
  onView,
  onDelete,
  onDownload,
  selectedIds = [],
  onToggleSelect,
  onToggleSelectAll
}: CandidateTableProps) {
  const allSelected = selectedIds.length === candidates.length && candidates.length > 0;
  const someSelected = selectedIds.length > 0 && selectedIds.length < candidates.length;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {/* Checkbox Column */}
              {onToggleSelectAll && (
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    ref={input => {
                      if (input) input.indeterminate = someSelected;
                    }}
                    onChange={onToggleSelectAll}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                  />
                </th>
              )}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ad Soyad
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                İletişim
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                CV Dosyası
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Yüklenme Tarihi
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Analiz Sayısı
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Aksiyonlar
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {candidates.map((candidate) => {
              const isSelected = selectedIds.includes(candidate.id);
              return (
                <tr
                  key={candidate.id}
                  className={`hover:bg-gray-50 transition-colors cursor-pointer ${
                    isSelected ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => onView(candidate)}
                >
                  {/* Checkbox Cell */}
                  {onToggleSelect && (
                    <td className="px-6 py-4 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => onToggleSelect(candidate.id)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                      />
                    </td>
                  )}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                    <CandidateAvatar
                      firstName={candidate.firstName}
                      lastName={candidate.lastName}
                      size="md"
                    />
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {getFullName(candidate.firstName, candidate.lastName)}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {candidate.email || <span className="text-gray-400">E-posta yok</span>}
                  </div>
                  <div className="text-sm text-gray-500">
                    {candidate.phone || <span className="text-gray-400">Telefon yok</span>}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm text-gray-900 max-w-xs">
                    <FileText className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
                    <span className="truncate" title={fixFileNameEncoding(candidate.sourceFileName)}>
                      {fixFileNameEncoding(candidate.sourceFileName)}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="w-4 h-4 mr-2" />
                    {formatDate(candidate.createdAt)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge variant="info" size="sm">
                    {candidate._count?.analysisResults || 0} analiz
                  </Badge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onView(candidate);
                      }}
                      className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
                      title="Detayları Gör"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDownload(candidate);
                      }}
                      className="p-1.5 text-green-400 hover:text-green-600 hover:bg-green-50 rounded transition-colors"
                      title="CV İndir"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(candidate);
                      }}
                      className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                      title="Sil"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
