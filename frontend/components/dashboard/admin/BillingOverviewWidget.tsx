"use client";

import Link from "next/link";
import { CreditCard } from "lucide-react";
import { Card, CardHeader, CardBody } from "@nextui-org/react";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

interface BillingOverviewWidgetProps {
  organization: any;
  usage: any;
  billing: {
    monthlyAmount: number;
    nextBillingDate: string;
  };
}

const PLAN_PRICES: Record<string, number> = {
  FREE: 0,
  PRO: 99,
  ENTERPRISE: 0, // Custom pricing
};

export default function BillingOverviewWidget({
  organization,
  usage,
  billing,
}: BillingOverviewWidgetProps) {
  const plan = organization?.plan || "FREE";
  const monthlyAmount = PLAN_PRICES[plan] || 0;
  const nextBillingDate = billing?.nextBillingDate
    ? new Date(billing.nextBillingDate)
    : new Date();

  const formatDate = (date: Date) => {
    return format(date, "d MMMM yyyy", { locale: tr });
  };

  return (
    <Card className="bg-gradient-to-br from-purple-50 to-white shadow-sm hover:shadow-md transition-shadow border-l-4 border-purple-500">
      <CardHeader>
        <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-purple-600" />
          Faturalandırma
        </h3>
      </CardHeader>
      <CardBody>
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-600">Mevcut Plan</span>
            <span
              className={`text-sm font-bold px-3 py-1 rounded-full ${
                plan === "ENTERPRISE"
                  ? "bg-purple-100 text-purple-700"
                  : plan === "PRO"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-slate-100 text-slate-700"
              }`}
            >
              {plan}
            </span>
          </div>

          <div className="bg-purple-50 rounded-lg p-4 mb-4">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-purple-600">
                ₺{monthlyAmount}
              </span>
              <span className="text-sm text-slate-600">/ay</span>
            </div>
            {plan !== "FREE" && (
              <p className="text-xs text-slate-500 mt-1">
                Sonraki fatura: {formatDate(nextBillingDate)}
              </p>
            )}
            {plan === "FREE" && (
              <p className="text-xs text-slate-500 mt-1">Ücretsiz plan</p>
            )}
          </div>

          <div className="space-y-2">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-600">Analiz Kullanımı</span>
                <span className="font-semibold">
                  {usage?.analysisPercentage || 0}%
                </span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${
                    (usage?.analysisPercentage || 0) >= 90
                      ? "bg-red-500"
                      : (usage?.analysisPercentage || 0) >= 75
                        ? "bg-yellow-500"
                        : "bg-green-500"
                  }`}
                  style={{
                    width: `${Math.min(usage?.analysisPercentage || 0, 100)}%`,
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-600">CV Kullanımı</span>
                <span className="font-semibold">
                  {usage?.cvPercentage || 0}%
                </span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${
                    (usage?.cvPercentage || 0) >= 90
                      ? "bg-red-500"
                      : (usage?.cvPercentage || 0) >= 75
                        ? "bg-yellow-500"
                        : "bg-green-500"
                  }`}
                  style={{
                    width: `${Math.min(usage?.cvPercentage || 0, 100)}%`,
                  }}
                />
              </div>
            </div>
          </div>

          <Link
            href="/settings/billing"
            className="block mt-4 text-center text-sm text-purple-600 hover:text-purple-700 font-medium"
          >
            Planı Yönet →
          </Link>
        </div>
      </CardBody>
    </Card>
  );
}
