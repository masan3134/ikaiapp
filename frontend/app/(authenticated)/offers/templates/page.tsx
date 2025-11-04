"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import * as templateService from "@/services/templateService";
import { withRoleProtection } from "@/lib/hoc/withRoleProtection";
import { UserRole } from "@/lib/constants/roles";

function TemplatesPage() {
  const router = useRouter();
  const [templates, setTemplates] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState("");

  useEffect(() => {
    loadData();
  }, [categoryFilter]);

  async function loadData() {
    try {
      setLoading(true);
      const [templatesRes, categoriesRes] = await Promise.all([
        templateService.fetchTemplates({
          categoryId: categoryFilter || undefined,
          isActive: true,
        }),
        templateService.fetchCategories(),
      ]);
      setTemplates(templatesRes.data || []);
      setCategories(categoriesRes.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Bu şablonu silmek istediğinizden emin misiniz?")) return;

    try {
      await templateService.deleteTemplate(id);
      alert("Şablon silindi");
      loadData();
    } catch (err: any) {
      alert(err.message);
    }
  }

  async function handleToggleActive(id: string, currentStatus: boolean) {
    try {
      if (currentStatus) {
        await templateService.deactivateTemplate(id);
        alert("Şablon pasif edildi");
      } else {
        await templateService.activateTemplate(id);
        alert("Şablon aktif edildi");
      }
      loadData();
    } catch (err: any) {
      alert(err.message);
    }
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Teklif Şablonları</h1>
        <div className="flex gap-2">
          <button
            onClick={() => router.push("/offers/templates/categories")}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            📁 Kategoriler
          </button>
          <button
            onClick={() => router.push("/offers/templates/new")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            + Yeni Şablon
          </button>
        </div>
      </div>

      {/* Category Filter */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Kategori Filtrele
        </label>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2"
        >
          <option value="">Tümü</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Templates Grid */}
      {loading ? (
        <div className="text-center py-8 text-gray-700">Yükleniyor...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <div
              key={template.id}
              className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-lg text-gray-900">
                    {template.name}
                  </h3>
                  {template.category && (
                    <span className="text-sm text-gray-600">
                      {template.category.name}
                    </span>
                  )}
                </div>
                <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                  {template.usageCount} kullanım
                </span>
              </div>

              <div className="space-y-2 text-sm text-gray-700 mb-4">
                <p>
                  <strong>Pozisyon:</strong> {template.position}
                </p>
                <p>
                  <strong>Departman:</strong> {template.department}
                </p>
                <p>
                  <strong>Maaş:</strong> ₺{template.salaryMin.toLocaleString()}{" "}
                  - ₺{template.salaryMax.toLocaleString()}
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() =>
                    router.push(`/offers/templates/${template.id}`)
                  }
                  className="flex-1 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                >
                  Görüntüle
                </button>
                <button
                  onClick={() =>
                    handleToggleActive(template.id, template.isActive)
                  }
                  className={`px-3 py-2 rounded text-sm ${
                    template.isActive
                      ? "bg-gray-600 hover:bg-gray-700 text-white"
                      : "bg-green-600 hover:bg-green-700 text-white"
                  }`}
                  title={template.isActive ? "Pasif Et" : "Aktif Et"}
                >
                  {template.isActive ? "⏸" : "▶"}
                </button>
                <button
                  onClick={() => handleDelete(template.id)}
                  className="px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                >
                  🗑
                </button>
              </div>
            </div>
          ))}

          {templates.length === 0 && (
            <div className="col-span-3 text-center py-12 text-gray-500">
              Henüz şablon yok. Yeni şablon oluşturun.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default withRoleProtection(TemplatesPage, {
  allowedRoles: [UserRole.MANAGER, UserRole.ADMIN, UserRole.SUPER_ADMIN],
});
