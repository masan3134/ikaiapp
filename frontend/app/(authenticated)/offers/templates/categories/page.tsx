'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import * as templateService from '@/services/templateService';
import { withRoleProtection } from '@/lib/hoc/withRoleProtection';
import { RoleGroups } from '@/lib/constants/roles';

function CategoriesPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: '#3B82F6',
    icon: ''
  });

  useEffect(() => {
    loadCategories();
  }, []);

  async function loadCategories() {
    try {
      setLoading(true);
      const res = await templateService.fetchCategories();
      setCategories(res.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      if (editingId) {
        await templateService.updateCategory(editingId, formData);
        alert('Kategori güncellendi');
      } else {
        await templateService.createCategory(formData);
        alert('Kategori oluşturuldu');
      }
      resetForm();
      loadCategories();
    } catch (error: any) {
      alert(error.message);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Bu kategoriyi silmek istediğinizden emin misiniz?')) return;

    try {
      await templateService.deleteCategory(id);
      alert('Kategori silindi');
      loadCategories();
    } catch (error: any) {
      alert(error.message);
    }
  }

  async function handleMoveUp(index: number) {
    if (index === 0) return;
    const newOrder = [...categories];
    [newOrder[index - 1], newOrder[index]] = [newOrder[index], newOrder[index - 1]];
    await saveOrder(newOrder);
  }

  async function handleMoveDown(index: number) {
    if (index === categories.length - 1) return;
    const newOrder = [...categories];
    [newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]];
    await saveOrder(newOrder);
  }

  async function saveOrder(newOrder: any[]) {
    try {
      const categoryIds = newOrder.map(c => c.id);
      await templateService.reorderCategories(categoryIds);
      setCategories(newOrder);
    } catch (error: any) {
      alert(error.message);
      loadCategories(); // Reload on error
    }
  }

  function handleEdit(category: any) {
    setFormData({
      name: category.name,
      description: category.description || '',
      color: category.color || '#3B82F6',
      icon: category.icon || ''
    });
    setEditingId(category.id);
    setShowForm(true);
  }

  function resetForm() {
    setFormData({ name: '', description: '', color: '#3B82F6', icon: '' });
    setEditingId(null);
    setShowForm(false);
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <button onClick={() => router.back()} className="text-blue-600 hover:text-blue-800 mb-2">
            ← Geri
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Şablon Kategorileri</h1>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          {showForm ? 'İptal' : '+ Yeni Kategori'}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {editingId ? 'Kategori Düzenle' : 'Yeni Kategori'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Kategori Adı *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full border rounded-lg px-4 py-2"
                placeholder="Örn: Yazılım"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Açıklama</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={2}
                className="w-full border rounded-lg px-4 py-2"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Renk</label>
                <input
                  type="color"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  className="w-full border rounded-lg px-2 py-1 h-10"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Icon</label>
                <input
                  type="text"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  className="w-full border rounded-lg px-4 py-2"
                  placeholder="💼"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50 text-gray-700"
              >
                İptal
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {editingId ? 'Güncelle' : 'Oluştur'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Categories List */}
      {loading ? (
        <div className="text-center py-8 text-gray-700">Yükleniyor...</div>
      ) : (
        <div className="bg-white rounded-lg shadow">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Sıra</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Kategori</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Şablon Sayısı</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Renk</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Aksiyonlar</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {categories.map((cat, index) => (
                <tr key={cat.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleMoveUp(index)}
                        disabled={index === 0}
                        className="px-2 py-1 text-gray-600 hover:text-gray-900 disabled:opacity-30"
                        title="Yukarı taşı"
                      >
                        ▲
                      </button>
                      <button
                        onClick={() => handleMoveDown(index)}
                        disabled={index === categories.length - 1}
                        className="px-2 py-1 text-gray-600 hover:text-gray-900 disabled:opacity-30"
                        title="Aşağı taşı"
                      >
                        ▼
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {cat.icon && <span>{cat.icon}</span>}
                      <div>
                        <div className="font-medium text-gray-900">{cat.name}</div>
                        {cat.description && (
                          <div className="text-sm text-gray-600">{cat.description}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {cat._count?.templates || 0} şablon
                  </td>
                  <td className="px-6 py-4">
                    {cat.color && (
                      <div
                        className="w-8 h-8 rounded"
                        style={{ backgroundColor: cat.color }}
                      />
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm space-x-2">
                    <button
                      onClick={() => handleEdit(cat)}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Düzenle
                    </button>
                    <button
                      onClick={() => handleDelete(cat.id)}
                      className="text-red-600 hover:text-red-800 font-medium"
                    >
                      Sil
                    </button>
                  </td>
                </tr>
              ))}

              {categories.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-600">
                    Henüz kategori yok. Yeni kategori oluşturun.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default withRoleProtection(CategoriesPage, {
  allowedRoles: RoleGroups.HR_MANAGERS,
  redirectTo: '/dashboard'
});
