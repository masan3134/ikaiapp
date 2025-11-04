"use client";

import {
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  FileText,
  Calendar,
  Download,
} from "lucide-react";
import type { Candidate } from "@/lib/services/candidateService";
import Modal from "@/components/ui/Modal";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import CandidateAvatar from "./CandidateAvatar";
import { formatDate } from "@/lib/utils/dateFormat";
import { getFullName } from "@/lib/utils/stringUtils";

export interface CandidateDetailModalProps {
  candidate: Candidate;
  isOpen: boolean;
  onClose: () => void;
  onDelete?: (candidate: Candidate) => void;
  onDownload?: (candidate: Candidate) => void;
}

export default function CandidateDetailModal({
  candidate,
  isOpen,
  onClose,
  onDelete,
  onDownload,
}: CandidateDetailModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Aday Detayları"
      size="xl"
      footer={
        <>
          {onDownload && (
            <Button
              variant="success"
              onClick={() => onDownload(candidate)}
              icon={<Download className="w-4 h-4" />}
            >
              CV İndir
            </Button>
          )}
          {onDelete && (
            <Button variant="danger" onClick={() => onDelete(candidate)}>
              Sil
            </Button>
          )}
          <Button variant="ghost" onClick={onClose}>
            Kapat
          </Button>
        </>
      }
    >
      <div className="space-y-6">
        {/* Header with Avatar */}
        <div className="flex items-center gap-4 pb-6 border-b border-gray-200">
          <CandidateAvatar
            firstName={candidate.firstName}
            lastName={candidate.lastName}
            size="xl"
          />
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-gray-900">
              {getFullName(candidate.firstName, candidate.lastName)}
            </h3>
            <div className="flex items-center gap-3 mt-2">
              <Badge variant="info" size="sm">
                {candidate._count?.analysisResults || 0} analiz
              </Badge>
              <span className="text-sm text-gray-500 flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {formatDate(candidate.createdAt)}
              </span>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="grid md:grid-cols-2 gap-4">
          {candidate.email && (
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <Mail className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-gray-500 mb-1">E-posta</p>
                <p className="text-sm text-gray-900">{candidate.email}</p>
              </div>
            </div>
          )}

          {candidate.phone && (
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <Phone className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-gray-500 mb-1">Telefon</p>
                <p className="text-sm text-gray-900">{candidate.phone}</p>
              </div>
            </div>
          )}

          {candidate.address && (
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg md:col-span-2">
              <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-gray-500 mb-1">Adres</p>
                <p className="text-sm text-gray-900">{candidate.address}</p>
              </div>
            </div>
          )}
        </div>

        {/* Experience */}
        {candidate.experience && (
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <Briefcase className="w-4 h-4" />
              Deneyim
            </h4>
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <p className="text-sm text-gray-700 whitespace-pre-wrap">
                {candidate.experience}
              </p>
            </div>
          </div>
        )}

        {/* Education */}
        {candidate.education && (
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <GraduationCap className="w-4 h-4" />
              Eğitim
            </h4>
            <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
              <p className="text-sm text-gray-700 whitespace-pre-wrap">
                {candidate.education}
              </p>
            </div>
          </div>
        )}

        {/* General Comment */}
        {candidate.generalComment && (
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Genel Değerlendirme
            </h4>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <p className="text-sm text-gray-700 whitespace-pre-wrap">
                {candidate.generalComment}
              </p>
            </div>
          </div>
        )}

        {/* CV File Info */}
        <div className="pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              <span>CV Dosyası: {candidate.sourceFileName}</span>
            </div>
            {onDownload && (
              <button
                onClick={() => onDownload(candidate)}
                className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
              >
                <Download className="w-3 h-3" />
                İndir
              </button>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}
