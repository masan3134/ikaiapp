"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Briefcase, Save } from "lucide-react";
import { createJobPosting, type CreateJobPostingData } from "@/lib/services/jobPostingService";
import JobPostingForm from "@/components/job-postings/JobPostingForm";
import { useToast } from "@/lib/hooks/useToast";
import { withRoleProtection } from "@/lib/hoc/withRoleProtection";
import { RoleGroups } from "@/lib/constants/roles";
import { parseApiError } from "@/lib/utils/errorHandler";

function NewJobPostingPage() {
  const router = useRouter();
  const toast = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: CreateJobPostingData) => {
    setIsSubmitting(true);
    try {
      await createJobPosting(data);
      toast.success("İlan başarıyla oluşturuldu");
      router.push("/job-postings");
    } catch (error) {
      const message = parseApiError(error);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push("/job-postings");
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={handleCancel}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Geri
        </button>
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-100 rounded-lg">
            <Briefcase className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Yeni İlan Oluştur</h1>
            <p className="text-gray-600">İş ilanı detaylarını doldurun</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <JobPostingForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
}

export default withRoleProtection(NewJobPostingPage, RoleGroups.HR_AND_ABOVE);
