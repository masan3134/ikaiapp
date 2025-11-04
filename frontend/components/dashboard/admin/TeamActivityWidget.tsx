"use client";

import {
  Activity,
  FileText,
  ClipboardCheck,
  Mail,
  Calendar,
} from "lucide-react";
import { Card, CardHeader, CardBody } from "@nextui-org/react";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";

interface TeamActivityWidgetProps {
  data: Array<{
    id: string;
    type: string;
    user: {
      firstName: string;
      lastName: string;
    };
    action: string;
    createdAt: string;
  }>;
}

const getActivityIcon = (type: string) => {
  switch (type) {
    case "CV_UPLOAD":
      return <FileText className="w-4 h-4 text-green-600" />;
    case "ANALYSIS":
      return <ClipboardCheck className="w-4 h-4 text-purple-600" />;
    case "OFFER":
      return <Mail className="w-4 h-4 text-blue-600" />;
    case "INTERVIEW":
      return <Calendar className="w-4 h-4 text-yellow-600" />;
    default:
      return <Activity className="w-4 h-4 text-slate-600" />;
  }
};

const getActivityBgColor = (type: string) => {
  switch (type) {
    case "CV_UPLOAD":
      return "bg-green-100";
    case "ANALYSIS":
      return "bg-purple-100";
    case "OFFER":
      return "bg-blue-100";
    case "INTERVIEW":
      return "bg-yellow-100";
    default:
      return "bg-slate-100";
  }
};

const formatRelativeTime = (dateStr: string) => {
  try {
    return formatDistanceToNow(new Date(dateStr), {
      addSuffix: true,
      locale: tr,
    });
  } catch {
    return "Bilinmiyor";
  }
};

export default function TeamActivityWidget({ data }: TeamActivityWidgetProps) {
  const activities = data.slice(0, 6);

  return (
    <Card className="bg-white shadow-sm">
      <CardHeader>
        <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
          <Activity className="w-5 h-5 text-blue-600" />
          Takım Aktiviteleri
        </h3>
      </CardHeader>
      <CardBody>
        <div className="space-y-3">
          {activities.length > 0 ? (
            activities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <div className="flex-shrink-0">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${getActivityBgColor(activity.type)}`}
                  >
                    {getActivityIcon(activity.type)}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-800">
                    <span className="font-medium">
                      {activity.user.firstName} {activity.user.lastName}
                    </span>{" "}
                    {activity.action}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    {formatRelativeTime(activity.createdAt)}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <Activity className="w-12 h-12 text-slate-300 mx-auto mb-2" />
              <p className="text-sm text-slate-500">Henüz aktivite yok</p>
            </div>
          )}
        </div>
        {activities.length > 0 && (
          <button className="w-full mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors">
            Tüm Aktiviteler →
          </button>
        )}
      </CardBody>
    </Card>
  );
}
