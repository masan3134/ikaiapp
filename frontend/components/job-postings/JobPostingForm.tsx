"use client";

import { useState } from "react";
import type {
  JobPosting,
  CreateJobPostingData,
  UpdateJobPostingData,
} from "@/lib/services/jobPostingService";
import Button from "@/components/ui/Button";

export interface JobPostingFormProps {
  initialData?: JobPosting;
  onSubmit: (data: CreateJobPostingData) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export default function JobPostingForm({
  initialData,
  onSubmit,
  onCancel,
  loading = false,
}: JobPostingFormProps) {
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    department: initialData?.department || "",
    details: initialData?.details || "",
    notes: initialData?.notes || "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  function validateForm(): boolean {
    const newErrors: Record<string, string> = {};

    // Title validation
    if (!formData.title.trim()) {
      newErrors.title = "İş ilanı başlığı zorunludur";
    } else if (formData.title.length < 3) {
      newErrors.title = "Başlık en az 3 karakter olmalıdır";
    } else if (formData.title.length > 200) {
      newErrors.title = "Başlık en fazla 200 karakter olabilir";
    }

    // Department validation
    if (!formData.department.trim()) {
      newErrors.department = "Departman zorunludur";
    } else if (formData.department.length < 2) {
      newErrors.department = "Departman en az 2 karakter olmalıdır";
    } else if (formData.department.length > 100) {
      newErrors.department = "Departman en fazla 100 karakter olabilir";
    }

    // Details validation
    if (!formData.details.trim()) {
      newErrors.details = "İş tanımı zorunludur";
    } else if (formData.details.length < 10) {
      newErrors.details = "İş tanımı en az 10 karakter olmalıdır";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      await onSubmit(formData);
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error("Form submission error:", error);
      }
    }
  }

  function handleChange(field: keyof typeof formData, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title */}
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          İş İlanı Başlığı <span className="text-red-500">*</span>
        </label>
        <input
          id="title"
          type="text"
          value={formData.title}
          onChange={(e) => handleChange("title", e.target.value)}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${
            errors.title ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="Örn: Lojistik Merkezi Müdürü"
          disabled={loading}
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title}</p>
        )}
        <p className="mt-1 text-xs text-gray-500">
          {formData.title.length} / 200 karakter
        </p>
      </div>

      {/* Department */}
      <div>
        <label
          htmlFor="department"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Departman <span className="text-red-500">*</span>
        </label>
        <input
          id="department"
          type="text"
          value={formData.department}
          onChange={(e) => handleChange("department", e.target.value)}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${
            errors.department ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="Örn: Lojistik"
          disabled={loading}
        />
        {errors.department && (
          <p className="mt-1 text-sm text-red-600">{errors.department}</p>
        )}
        <p className="mt-1 text-xs text-gray-500">
          {formData.department.length} / 100 karakter
        </p>
      </div>

      {/* Details */}
      <div>
        <label
          htmlFor="details"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          İş Tanımı <span className="text-red-500">*</span>
        </label>
        <textarea
          id="details"
          value={formData.details}
          onChange={(e) => handleChange("details", e.target.value)}
          rows={6}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none ${
            errors.details ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="İş tanımını detaylı bir şekilde yazın..."
          disabled={loading}
        />
        {errors.details && (
          <p className="mt-1 text-sm text-red-600">{errors.details}</p>
        )}
        <p className="mt-1 text-xs text-gray-500">
          Minimum 10 karakter gerekli
        </p>
      </div>

      {/* Notes (Optional) */}
      <div>
        <label
          htmlFor="notes"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Notlar (Opsiyonel)
        </label>
        <textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => handleChange("notes", e.target.value)}
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
          placeholder="Ek notlar veya gereksinimler..."
          disabled={loading}
        />
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
        <Button
          type="button"
          variant="ghost"
          onClick={onCancel}
          disabled={loading}
        >
          İptal
        </Button>
        <Button type="submit" variant="primary" loading={loading}>
          {initialData ? "Güncelle" : "Oluştur"}
        </Button>
      </div>
    </form>
  );
}
