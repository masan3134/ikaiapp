"use client";

import Link from "next/link";
import { Shield, ShieldCheck } from "lucide-react";
import { Card, CardHeader, CardBody } from "@nextui-org/react";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";

interface SecurityOverviewWidgetProps {
  data: {
    twoFactorUsers: number;
    activeSessions: number;
    lastSecurityEvent: string | null;
    complianceScore: number;
  };
  organization: any;
}

export default function SecurityOverviewWidget({
  data,
  organization,
}: SecurityOverviewWidgetProps) {
  const totalUsers = organization?.totalUsers || 1;
  const twoFactorPercent = Math.round((data.twoFactorUsers / totalUsers) * 100);

  const formatRelativeTime = (dateStr: string | null) => {
    if (!dateStr) return "Yok";
    try {
      return formatDistanceToNow(new Date(dateStr), {
        addSuffix: true,
        locale: tr,
      });
    } catch {
      return "Bilinmiyor";
    }
  };

  return (
    <Card className="bg-white shadow-sm">
      <CardHeader>
        <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
          <Shield className="w-5 h-5 text-green-600" />
          Güvenlik Durumu
        </h3>
      </CardHeader>
      <CardBody>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-800">2FA Aktif</p>
                <p className="text-xs text-slate-500">
                  {data.twoFactorUsers}/{totalUsers} kullanıcı
                </p>
              </div>
            </div>
            <span className="text-lg font-bold text-green-600">
              {twoFactorPercent}%
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600">Aktif Oturumlar</span>
              <span className="font-semibold text-blue-600">
                {data.activeSessions}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600">Son Güvenlik Olayı</span>
              <span className="font-semibold text-slate-800">
                {formatRelativeTime(data.lastSecurityEvent)}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600">Uyumluluk Skoru</span>
              <span className="font-semibold text-green-600">
                {data.complianceScore}%
              </span>
            </div>
          </div>

          <Link
            href="/settings/security"
            className="block text-center mt-4 text-sm text-green-600 hover:text-green-700 font-medium transition-colors"
          >
            Güvenlik Ayarları →
          </Link>
        </div>
      </CardBody>
    </Card>
  );
}
