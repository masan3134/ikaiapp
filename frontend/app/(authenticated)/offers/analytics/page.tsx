'use client';

import { useState, useEffect } from 'react';
import * as analyticsService from '@/services/analyticsService';
import { OverviewChart, AcceptanceRatePieChart } from '@/components/offers/OfferAnalyticsCharts';
import { withRoleProtection } from '@/lib/hoc/withRoleProtection';
import { RoleGroups } from '@/lib/constants/roles';

function OfferAnalyticsPage() {
  const [overview, setOverview] = useState<any>(null);
  const [acceptanceRate, setAcceptanceRate] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      setLoading(true);
      const [overviewData, acceptanceRateData] = await Promise.all([
        analyticsService.getAnalyticsOverview(),
        analyticsService.getAcceptanceRate(),
      ]);
      setOverview(overviewData);
      setAcceptanceRate(acceptanceRateData);
    } catch (error) {
      console.error("Failed to fetch analytics data", error);
    } finally {
      setLoading(false);
    }
  }

  const overviewChartData = overview ? [
    { name: 'Kabul Edildi', value: overview.accepted },
    { name: 'Reddedildi', value: overview.rejected },
    { name: 'Beklemede', value: overview.pending_approval },
    { name: 'Süresi Doldu', value: overview.expired },
  ] : [];

  const acceptanceRateChartData = acceptanceRate ? [
    { name: 'Kabul Edildi', value: acceptanceRate.accepted },
    { name: 'Reddedildi', value: acceptanceRate.rejected },
  ] : [];

  if (loading) {
    return <div>Analitik verileri yükleniyor...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Teklif Analitikleri</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-lg font-semibold mb-4">Genel Bakış</h2>
          {overview && <OverviewChart data={overviewChartData} />}
        </div>
        <div>
          <h2 className="text-lg font-semibold mb-4">Kabul Oranı</h2>
          {acceptanceRate && <AcceptanceRatePieChart data={acceptanceRateChartData} />}
        </div>
      </div>
    </div>
  );
}

export default withRoleProtection(OfferAnalyticsPage, {
  allowedRoles: RoleGroups.ANALYTICS_VIEWERS
});
