import { useRouter } from "next/navigation";
import { DashboardCard } from "./DashboardCard";
import { useAuthStore } from "@/lib/store/authStore";
import { ROLE_COLORS } from "@/lib/constants/roleColors";

interface StatCardsProps {
  stats: {
    activeJobs?: number;
    totalCandidates?: number;
    thisMonthAnalyses?: number;
    usagePercent?: number;
  };
}

export const StatCards: React.FC<StatCardsProps> = ({ stats }) => {
  const router = useRouter();
  const { user } = useAuthStore();
  const roleColor =
    ROLE_COLORS[user?.role as keyof typeof ROLE_COLORS]?.primary || "#3B82F6";

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Active Jobs */}
      <DashboardCard
        title="Aktif İş İlanları"
        value={stats.activeJobs || 0}
        icon={<span className="text-2xl">📄</span>}
        color={roleColor}
        onClick={() => router.push("/job-postings")}
      />

      {/* Total Candidates */}
      <DashboardCard
        title="Toplam Adaylar"
        value={stats.totalCandidates || 0}
        subtitle="Sistemde"
        icon={<span className="text-2xl">👥</span>}
        color={roleColor}
        trend={{ value: 12, isPositive: true }}
      />

      {/* This Month Analyses */}
      <DashboardCard
        title="Bu Ay Analizler"
        value={`${stats.thisMonthAnalyses || 0}/10`}
        subtitle="CV analiz kotası"
        icon={<span className="text-2xl">📊</span>}
        color={
          stats.usagePercent && stats.usagePercent > 80 ? "#EF4444" : roleColor
        }
      />

      {/* Usage Alert (if over limit) */}
      {stats.usagePercent && stats.usagePercent > 80 && (
        <DashboardCard
          title="⚠️ Kullanım Uyarısı"
          value="Yükselt"
          subtitle="Aylık limitinizi aştınız"
          icon={<span className="text-2xl">🚀</span>}
          color="#EF4444"
          gradient="linear-gradient(135deg, #EF4444, #F59E0B)"
          onClick={() => router.push("/settings/billing")}
        />
      )}
    </div>
  );
};
