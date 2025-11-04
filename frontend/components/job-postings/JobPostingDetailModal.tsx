"use client";

import { Briefcase, Calendar, User, FileText } from "lucide-react";
import type { JobPosting } from "@/lib/services/jobPostingService";
import Modal from "@/components/ui/Modal";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { formatDate } from "@/lib/utils/dateFormat";

export interface JobPostingDetailModalProps {
  jobPosting: JobPosting;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (jobPosting: JobPosting) => void;
  onDelete?: (jobPosting: JobPosting) => void;
}

export default function JobPostingDetailModal({
  jobPosting,
  isOpen,
  onClose,
  onEdit,
  onDelete,
}: JobPostingDetailModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="İş İlanı Detayları"
      size="lg"
      footer={
        <>
          {onEdit && (
            <Button variant="secondary" onClick={() => onEdit(jobPosting)}>
              Düzenle
            </Button>
          )}
          {onDelete && (
            <Button variant="danger" onClick={() => onDelete(jobPosting)}>
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
        {/* Title & Department */}
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">
            {jobPosting.title}
          </h3>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Briefcase className="w-4 h-4" />
              <span>{jobPosting.department}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(jobPosting.createdAt)}</span>
            </div>
            <Badge variant="info" size="sm">
              {jobPosting._count?.analyses || 0} analiz
            </Badge>
          </div>
        </div>

        {/* Details */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <FileText className="w-4 h-4" />
            İş Tanımı
          </h4>
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <p className="text-sm text-gray-700 whitespace-pre-wrap">
              {jobPosting.details}
            </p>
          </div>
        </div>

        {/* Notes */}
        {jobPosting.notes && (
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Notlar</h4>
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <p className="text-sm text-gray-700 whitespace-pre-wrap">
                {jobPosting.notes}
              </p>
            </div>
          </div>
        )}

        {/* User Info */}
        <div className="pt-4 border-t border-gray-200">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <User className="w-3 h-3" />
            <span>Oluşturan: {jobPosting.user?.email}</span>
          </div>
        </div>
      </div>
    </Modal>
  );
}
