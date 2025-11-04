"use client";

import Link from "next/link";
import {
  Zap,
  Building2,
  UserPlus,
  CreditCard,
  Shield,
  BarChart3,
  ChevronRight,
} from "lucide-react";
import { Card, CardHeader, CardBody } from "@nextui-org/react";

const QUICK_ACTIONS = [
  {
    icon: Building2,
    title: "Organizasyon Bilgileri",
    description: "İsim, logo, sektör",
    path: "/settings/organization",
    color: "purple",
  },
  {
    icon: UserPlus,
    title: "Kullanıcı Davet Et",
    description: "Takıma yeni üye ekle",
    path: "/team",
    color: "indigo",
  },
  {
    icon: CreditCard,
    title: "Faturalandırma",
    description: "Plan ve ödeme",
    path: "/settings/billing",
    color: "blue",
  },
  {
    icon: Shield,
    title: "Güvenlik",
    description: "2FA, oturum yönetimi",
    path: "/settings/security",
    color: "green",
  },
  {
    icon: BarChart3,
    title: "Kullanım Raporları",
    description: "Detaylı analitik",
    path: "/analytics",
    color: "cyan",
  },
];

export default function QuickSettingsWidget() {
  return (
    <Card className="bg-white shadow-sm">
      <CardHeader>
        <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
          <Zap className="w-5 h-5 text-yellow-600" />
          Hızlı Ayarlar
        </h3>
      </CardHeader>
      <CardBody>
        <div className="space-y-2">
          {QUICK_ACTIONS.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.title}
                href={action.path}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors group"
              >
                <div
                  className={`w-10 h-10 bg-${action.color}-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}
                >
                  <Icon className={`w-5 h-5 text-${action.color}-600`} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-800">
                    {action.title}
                  </p>
                  <p className="text-xs text-slate-500">{action.description}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
              </Link>
            );
          })}
        </div>
      </CardBody>
    </Card>
  );
}
