'use client';

import { useAuthStore } from '@/lib/store/authStore';
import { SuperAdminDashboard } from '@/components/dashboard/SuperAdminDashboard';
import { AdminDashboard } from '@/components/dashboard/AdminDashboard';
import { ManagerDashboard } from '@/components/dashboard/ManagerDashboard';
import { HRDashboard } from '@/components/dashboard/HRDashboard';
import { UserDashboard } from '@/components/dashboard/UserDashboard';
import UserDashboardNew from './user-dashboard'; // New USER dashboard
import LoadingSkeleton from '@/components/ui/LoadingSkeleton';

export default function DashboardPage() {
  const { user } = useAuthStore();

  // Loading state
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <LoadingSkeleton variant="grid" rows={2} columns={4} />
        </div>
      </div>
    );
  }

  // Role-based dashboard routing
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {user.role === 'SUPER_ADMIN' && <SuperAdminDashboard />}
        {user.role === 'ADMIN' && <AdminDashboard />}
        {user.role === 'MANAGER' && <ManagerDashboard />}
        {user.role === 'HR_SPECIALIST' && <HRDashboard />}
        {user.role === 'USER' && <UserDashboardNew />}
      </div>
    </div>
  );
}
