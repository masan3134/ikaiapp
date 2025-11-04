'use client';

import { useState, useEffect } from 'react';
import { Users, UserPlus, Search, Filter, Edit, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { useAuthStore } from '@/lib/store/authStore';
import { getTeamMembers, toggleTeamMember, deleteTeamMember, TeamMember } from '@/lib/services/teamService';
import { useToast } from '@/lib/hooks/useToast';
import InviteUserModal from '@/components/team/InviteUserModal';
import EditUserModal from '@/components/team/EditUserModal';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import LoadingSkeleton from '@/components/ui/LoadingSkeleton';
import { withRoleProtection } from '@/lib/hoc/withRoleProtection';
import { RoleGroups } from '@/lib/constants/roles';
import {
  canInviteUsers,
  canManageTeam
} from '@/lib/utils/rbac';

function TeamManagementPage() {
  const { user } = useAuthStore();
  const userRole = user?.role;
  const toast = useToast();

  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  // Check if user has admin access
  const hasAccess = user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN';

  // Fetch team members
  const fetchMembers = async () => {
    setLoading(true);
    try {
      const response = await getTeamMembers(page, 10, search, roleFilter);
      setMembers(response.data.users);
      setTotalPages(response.data.pagination.pages);
    } catch (error: any) {
      toast.error(error.message || 'Takım üyeleri yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (hasAccess) {
      fetchMembers();
    }
  }, [page, search, roleFilter, hasAccess]);

  // Handle toggle active
  const handleToggle = async (member: TeamMember) => {
    try {
      await toggleTeamMember(member.id);
      toast.success(`${member.name} ${!member.isActive ? 'aktif' : 'pasif'} edildi`);
      fetchMembers();
    } catch (error: any) {
      toast.error(error.message || 'Durum değiştirilemedi');
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (!selectedMember) return;
    try {
      await deleteTeamMember(selectedMember.id);
      toast.success('Kullanıcı silindi');
      setDeleteDialogOpen(false);
      fetchMembers();
    } catch (error: any) {
      toast.error(error.message || 'Kullanıcı silinemedi');
    }
  };

  // Access denied
  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <XCircle size={48} className="text-red-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Erişim Engellendi</h2>
          <p className="text-gray-600">Bu sayfaya erişmek için ADMIN yetkisi gerekiyor.</p>
        </div>
      </div>
    );
  }

  const roleLabels: Record<string, string> = {
    ADMIN: 'Yönetici',
    MANAGER: 'Müdür',
    HR_SPECIALIST: 'İK Uzmanı',
    USER: 'Kullanıcı',
    SUPER_ADMIN: 'Süper Admin'
  };

  const roleBadgeColors: Record<string, string> = {
    ADMIN: 'bg-purple-100 text-purple-800',
    MANAGER: 'bg-blue-100 text-blue-800',
    HR_SPECIALIST: 'bg-green-100 text-green-800',
    USER: 'bg-gray-100 text-gray-800',
    SUPER_ADMIN: 'bg-red-100 text-red-800'
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Users size={32} />
                Takım Yönetimi
              </h1>
              <p className="text-gray-600 mt-1">Organizasyon üyelerini yönetin</p>
            </div>
            {canInviteUsers(userRole) && (
              <button
                onClick={() => setInviteModalOpen(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <UserPlus size={20} />
                Yeni Kullanıcı Davet Et
              </button>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="İsim veya email ile ara..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Tüm Roller</option>
              <option value="ADMIN">Yönetici</option>
              <option value="MANAGER">Müdür</option>
              <option value="HR_SPECIALIST">İK Uzmanı</option>
              <option value="USER">Kullanıcı</option>
            </select>
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <LoadingSkeleton variant="table" rows={5} />
        ) : (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kullanıcı</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rol</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Durum</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kayıt Tarihi</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">İşlemler</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {members.map((member) => (
                  <tr key={member.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{member.name}</div>
                        <div className="text-sm text-gray-500">{member.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${roleBadgeColors[member.role]}`}>
                        {roleLabels[member.role]}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {member.isActive ? (
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                          Aktif
                        </span>
                      ) : (
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                          Pasif
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(member.createdAt).toLocaleDateString('tr-TR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => { setSelectedMember(member); setEditModalOpen(true); }}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                        disabled={member.role === 'SUPER_ADMIN'}
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleToggle(member)}
                        className="text-yellow-600 hover:text-yellow-900 mr-3"
                        disabled={member.role === 'SUPER_ADMIN' || member.id === user?.id}
                      >
                        {member.isActive ? <XCircle size={18} /> : <CheckCircle size={18} />}
                      </button>
                      <button
                        onClick={() => { setSelectedMember(member); setDeleteDialogOpen(true); }}
                        className="text-red-600 hover:text-red-900"
                        disabled={member.role === 'SUPER_ADMIN' || member.id === user?.id}
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50"
                >
                  Önceki
                </button>
                <span className="text-sm text-gray-700">
                  Sayfa {page} / {totalPages}
                </span>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50"
                >
                  Sonraki
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      <InviteUserModal
        isOpen={inviteModalOpen}
        onClose={() => setInviteModalOpen(false)}
        onSuccess={fetchMembers}
      />

      <EditUserModal
        isOpen={editModalOpen}
        onClose={() => { setEditModalOpen(false); setSelectedMember(null); }}
        member={selectedMember}
        onSuccess={fetchMembers}
      />

      <ConfirmDialog
        isOpen={deleteDialogOpen}
        onCancel={() => { setDeleteDialogOpen(false); setSelectedMember(null); }}
        onConfirm={handleDelete}
        title="Kullanıcıyı Sil"
        message={`${selectedMember?.name} adlı kullanıcıyı silmek istediğinize emin misiniz?`}
        confirmText="Sil"
        variant="danger"
      />
    </div>
  );
}

export default withRoleProtection(TeamManagementPage, {
  allowedRoles: RoleGroups.ADMINS,
  redirectTo: '/dashboard'
});
