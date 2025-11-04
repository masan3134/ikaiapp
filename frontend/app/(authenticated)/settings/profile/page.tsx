'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/lib/store/authStore';
import { getCurrentUser, updateCurrentUser, getUserStats, UserProfile, UserStats } from '@/lib/services/userService';
import { useToast } from '@/lib/hooks/useToast';
import { Card } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import {
  User, Mail, Briefcase, Camera, Shield, TrendingUp,
  BarChart3, Users, Calendar, FileText, ArrowRight, Sparkles
} from 'lucide-react';

export default function ProfilePage() {
  const { user: authUser } = useAuthStore();
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    position: '',
    avatar: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [profileData, statsData] = await Promise.all([
        getCurrentUser(),
        getUserStats()
      ]);
      setProfile(profileData);
      setStats(statsData);
      setFormData({
        firstName: profileData.firstName || '',
        lastName: profileData.lastName || '',
        position: profileData.position || '',
        avatar: profileData.avatar || ''
      });
    } catch (error: any) {
      console.error('[PROFILE] Load error:', error);
      toast.error('Profil yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const updated = await updateCurrentUser(formData);
      setProfile(updated);
      toast.success('✓ Profil başarıyla güncellendi!', { duration: 3000 });
    } catch (error: any) {
      console.error('[PROFILE] Update error:', error);
      toast.error(error?.response?.data?.message || '✗ Profil güncellenemedi');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {[1, 2].map((i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm p-6 animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-10 bg-gray-200 rounded mb-3"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  const activityStats = [
    { label: 'Analizler', value: stats?.totalAnalyses || 0, icon: BarChart3, color: 'blue', href: '/analyses' },
    { label: 'Adaylar', value: stats?.totalCandidates || 0, icon: Users, color: 'purple', href: '/candidates' },
    { label: 'İş İlanları', value: stats?.totalJobPostings || 0, icon: Briefcase, color: 'green', href: '/job-postings' },
    { label: 'Mülakatlar', value: stats?.totalInterviews || 0, icon: Calendar, color: 'orange', href: '/interviews' },
    { label: 'Teklifler', value: stats?.totalOffers || 0, icon: FileText, color: 'pink', href: '/offers' },
  ];

  return (
    <div className="space-y-6">
      {/* Profile Header Card */}
      <Card>
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 pb-6 border-b border-gray-200">
          <div className="relative group">
            <div className="w-28 h-28 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center text-white text-4xl font-bold shadow-xl">
              {formData.firstName?.[0]?.toUpperCase() || formData.lastName?.[0]?.toUpperCase() || authUser?.email?.[0]?.toUpperCase() || 'U'}
            </div>
            <button className="absolute bottom-0 right-0 p-2.5 bg-white rounded-full shadow-lg border-2 border-white hover:bg-gray-50 transition-all group-hover:scale-110">
              <Camera size={18} className="text-gray-600" />
            </button>
          </div>
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {formData.firstName || formData.lastName
                ? `${formData.firstName || ''} ${formData.lastName || ''}`.trim()
                : 'İsimsiz Kullanıcı'}
            </h2>
            <p className="text-gray-600 flex items-center gap-2 mb-3">
              <Mail size={18} />
              <span className="text-lg">{profile?.email}</span>
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium shadow-sm ${
                profile?.role === 'SUPER_ADMIN' ? 'bg-purple-100 text-purple-800 ring-1 ring-purple-200' :
                profile?.role === 'ADMIN' ? 'bg-blue-100 text-blue-800 ring-1 ring-blue-200' :
                profile?.role === 'MANAGER' ? 'bg-green-100 text-green-800 ring-1 ring-green-200' :
                'bg-gray-100 text-gray-800 ring-1 ring-gray-200'
              }`}>
                <Shield size={14} />
                {profile?.role}
              </span>
              {profile?.isActive ? (
                <span className="px-3 py-1.5 rounded-full bg-green-100 text-green-800 text-sm font-medium ring-1 ring-green-200">
                  ✓ Aktif
                </span>
              ) : (
                <span className="px-3 py-1.5 rounded-full bg-red-100 text-red-800 text-sm font-medium ring-1 ring-red-200">
                  ✗ Pasif
                </span>
              )}
              {formData.position && (
                <span className="px-3 py-1.5 rounded-full bg-gray-100 text-gray-700 text-sm font-medium ring-1 ring-gray-200">
                  <Briefcase size={14} className="inline mr-1" />
                  {formData.position}
                </span>
              )}
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User size={16} className="inline mr-1" />
                Ad *
              </label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                placeholder="Adınızı girin"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User size={16} className="inline mr-1" />
                Soyad *
              </label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                placeholder="Soyadınızı girin"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Briefcase size={16} className="inline mr-1" />
              Pozisyon
            </label>
            <input
              type="text"
              value={formData.position}
              onChange={(e) => setFormData({ ...formData, position: e.target.value })}
              placeholder="Örn: İK Müdürü, İK Uzmanı, Platform Sahibi"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={loadData}
              disabled={saving}
              className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 font-medium"
            >
              İptal
            </button>
            <Button
              type="submit"
              loading={saving}
              disabled={saving}
            >
              {saving ? 'Kaydediliyor...' : '✓ Profili Kaydet'}
            </Button>
          </div>
        </form>
      </Card>

      {/* Activity Stats */}
      <Card>
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg shadow-md">
            <TrendingUp className="text-white" size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Aktivite İstatistikleriniz</h2>
            <p className="text-sm text-gray-600">Platformdaki toplam aktiviteniz</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {activityStats.map((stat) => {
            const Icon = stat.icon;
            const colorClasses = {
              blue: 'from-blue-500 to-blue-600',
              purple: 'from-purple-500 to-purple-600',
              green: 'from-green-500 to-green-600',
              orange: 'from-orange-500 to-orange-600',
              pink: 'from-pink-500 to-pink-600',
            }[stat.color];

            return (
              <Link
                key={stat.label}
                href={stat.href}
                className="group p-5 rounded-xl border-2 border-gray-200 hover:border-blue-400 hover:shadow-lg transition-all bg-white"
              >
                <div className={`p-2.5 bg-gradient-to-br ${colorClasses} rounded-lg w-fit mb-3 shadow-md group-hover:scale-110 transition-transform`}>
                  <Icon className="text-white" size={20} />
                </div>
                <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
                <p className="text-xs font-medium text-gray-600 flex items-center justify-between">
                  {stat.label}
                  <ArrowRight size={14} className="text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                </p>
              </Link>
            );
          })}
        </div>
      </Card>

      {/* Account Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Hesap Bilgileri">
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">E-posta</span>
              <span className="text-sm font-medium text-gray-900">{profile?.email}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">Kullanıcı ID</span>
              <span className="text-xs font-mono text-gray-500">{profile?.id?.slice(0, 8)}...</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">Kayıt Tarihi</span>
              <span className="text-sm font-medium text-gray-900">
                {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString('tr-TR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                }) : '-'}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">Hesap Durumu</span>
              {profile?.isActive ? (
                <span className="text-sm font-medium text-green-600 flex items-center gap-1">
                  <CheckCircle2 size={16} />
                  Aktif
                </span>
              ) : (
                <span className="text-sm font-medium text-red-600">Pasif</span>
              )}
            </div>
          </div>
        </Card>

        <Card title="Hızlı Bağlantılar">
          <div className="space-y-2">
            <Link
              href="/settings/security"
              className="flex items-center justify-between p-3 rounded-lg hover:bg-blue-50 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <Shield className="text-blue-600" size={20} />
                <span className="font-medium text-gray-900">Güvenlik Ayarları</span>
              </div>
              <ArrowRight className="text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" size={18} />
            </Link>

            <Link
              href="/settings/notifications"
              className="flex items-center justify-between p-3 rounded-lg hover:bg-purple-50 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <Mail className="text-purple-600" size={20} />
                <span className="font-medium text-gray-900">Bildirim Tercihleri</span>
              </div>
              <ArrowRight className="text-gray-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all" size={18} />
            </Link>

            <Link
              href="/settings/organization"
              className="flex items-center justify-between p-3 rounded-lg hover:bg-green-50 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <Briefcase className="text-green-600" size={20} />
                <span className="font-medium text-gray-900">Şirket Ayarları</span>
              </div>
              <ArrowRight className="text-gray-400 group-hover:text-green-600 group-hover:translate-x-1 transition-all" size={18} />
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
