'use client';

import { useState } from 'react';
import { useAuthStore } from '@/lib/store/authStore';
import { useToast } from '@/lib/hooks/useToast';
import { Card } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import {
  Shield, Lock, Key, Monitor, Smartphone, AlertTriangle,
  CheckCircle2, Globe, Clock, LogOut
} from 'lucide-react';

export default function SecurityPage() {
  const { user, logout } = useAuthStore();
  const toast = useToast();
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordForm.newPassword.length < 6) {
      toast.error('Yeni şifre en az 6 karakter olmalıdır');
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('Yeni şifreler eşleşmiyor');
      return;
    }

    setChangingPassword(true);

    try {
      // TODO: Implement password change endpoint
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success('Şifre başarıyla değiştirildi. Lütfen tekrar giriş yapın.');

      setTimeout(() => {
        logout();
      }, 2000);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Şifre değiştirilemedi');
    } finally {
      setChangingPassword(false);
    }
  };

  const mockSessions = [
    {
      id: '1',
      device: 'Chrome on Linux',
      location: 'Istanbul, Turkey',
      ip: '192.168.1.100',
      lastActive: new Date(),
      current: true
    }
  ];

  return (
    <div className="space-y-6">
      {/* Security Status Banner */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-green-100 rounded-lg">
            <Shield className="text-green-600" size={28} />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-green-900 mb-1">Hesabınız Güvende</h3>
            <p className="text-green-700 text-sm">
              Son güvenlik kontrolü: Bugün • Tespit edilen risk: Yok
            </p>
            <div className="flex gap-3 mt-4">
              <div className="flex items-center gap-2 text-xs text-green-700">
                <CheckCircle2 size={14} />
                <span>Güçlü Şifre</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-green-700">
                <CheckCircle2 size={14} />
                <span>Aktif Oturum</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Password Change */}
      <Card>
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
          <div className="p-3 bg-blue-100 rounded-lg">
            <Lock className="text-blue-600" size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Şifre Değiştir</h2>
            <p className="text-sm text-gray-600">Hesap güvenliğiniz için düzenli olarak şifrenizi değiştirin</p>
          </div>
        </div>

        <form onSubmit={handlePasswordChange} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Key size={16} className="inline mr-1" />
              Mevcut Şifre
            </label>
            <input
              type="password"
              value={passwordForm.currentPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Mevcut şifrenizi girin"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Lock size={16} className="inline mr-1" />
                Yeni Şifre
              </label>
              <input
                type="password"
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                required
                minLength={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="En az 6 karakter"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <CheckCircle2 size={16} className="inline mr-1" />
                Yeni Şifre (Tekrar)
              </label>
              <input
                type="password"
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                required
                minLength={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Yeni şifrenizi tekrar girin"
              />
            </div>
          </div>

          {passwordForm.newPassword && (
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-sm font-medium text-gray-900 mb-2">Şifre Gücü:</p>
              <div className="flex gap-1 mb-2">
                {[1, 2, 3, 4].map((level) => (
                  <div
                    key={level}
                    className={`h-2 flex-1 rounded ${
                      passwordForm.newPassword.length >= level * 2
                        ? passwordForm.newPassword.length >= 8
                          ? 'bg-green-500'
                          : passwordForm.newPassword.length >= 6
                          ? 'bg-yellow-500'
                          : 'bg-red-500'
                        : 'bg-gray-200'
                    }`}
                  />
                ))}
              </div>
              <p className="text-xs text-gray-600">
                {passwordForm.newPassword.length < 6 && '❌ Çok zayıf - En az 6 karakter gerekli'}
                {passwordForm.newPassword.length >= 6 && passwordForm.newPassword.length < 8 && '⚠️ Orta - 8+ karakter önerilir'}
                {passwordForm.newPassword.length >= 8 && '✓ Güçlü şifre'}
              </p>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })}
              disabled={changingPassword}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              İptal
            </button>
            <Button
              type="submit"
              loading={changingPassword}
              disabled={changingPassword || !passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword}
            >
              {changingPassword ? 'Değiştiriliyor...' : 'Şifre Değiştir'}
            </Button>
          </div>
        </form>
      </Card>

      {/* Active Sessions */}
      <Card title="Aktif Oturumlar">
        <p className="text-sm text-gray-600 mb-4">
          Hesabınıza bağlı tüm cihazları görün ve yönetin
        </p>

        <div className="space-y-3">
          {mockSessions.map((session) => (
            <div
              key={session.id}
              className="p-4 rounded-lg border border-gray-200 bg-white hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <div className={`p-2 rounded-lg ${session.current ? 'bg-green-100' : 'bg-gray-100'}`}>
                    {session.device.includes('Mobile') ? (
                      <Smartphone className={session.current ? 'text-green-600' : 'text-gray-600'} size={20} />
                    ) : (
                      <Monitor className={session.current ? 'text-green-600' : 'text-gray-600'} size={20} />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-gray-900">{session.device}</h4>
                      {session.current && (
                        <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                          Mevcut Oturum
                        </span>
                      )}
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-600 flex items-center gap-1">
                        <Globe size={14} />
                        {session.location}
                      </p>
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <Clock size={12} />
                        Son aktivite: {session.lastActive.toLocaleString('tr-TR')}
                      </p>
                      <p className="text-xs text-gray-500">IP: {session.ip}</p>
                    </div>
                  </div>
                </div>
                {!session.current && (
                  <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    <LogOut size={18} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-3">
          <AlertTriangle className="text-yellow-600 flex-shrink-0 mt-0.5" size={20} />
          <div className="flex-1">
            <p className="text-sm font-medium text-yellow-900">Güvenlik İpucu</p>
            <p className="text-xs text-yellow-700 mt-1">
              Tanımadığınız bir cihaz görüyorsanız hemen şifrenizi değiştirin ve o oturumu sonlandırın
            </p>
          </div>
        </div>
      </Card>

      {/* Two-Factor Authentication (Future) */}
      <Card title="İki Faktörlü Doğrulama (2FA)">
        <div className="flex items-center justify-between">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-gray-100 rounded-lg">
              <Key className="text-gray-400" size={20} />
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-1">2FA ile Ekstra Güvenlik</h4>
              <p className="text-sm text-gray-600">
                Hesabınıza ek bir güvenlik katmanı ekleyin (Yakında)
              </p>
            </div>
          </div>
          <button
            disabled
            className="px-4 py-2 bg-gray-200 text-gray-500 rounded-lg cursor-not-allowed"
          >
            Yakında
          </button>
        </div>
      </Card>
    </div>
  );
}
