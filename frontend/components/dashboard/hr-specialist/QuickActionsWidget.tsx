"use client";

import {
  Zap,
  Upload,
  Wand2,
  Plus,
  Users,
  Calendar,
  ChevronRight,
} from "lucide-react";
import { useRouter } from "next/navigation";

export function QuickActionsWidget() {
  const router = useRouter();

  const handleQuickAction = (action: string) => {
    switch (action) {
      case "upload":
        router.push("/wizard");
        break;
      case "analyze":
        router.push("/wizard?step=analyze");
        break;
      case "create-job":
        router.push("/job-postings/new");
        break;
      case "view-candidates":
        router.push("/candidates");
        break;
      case "schedule":
        router.push("/interviews?action=schedule");
        break;
      default:
        break;
    }
  };

  const actions = [
    {
      icon: <Upload className="w-5 h-5 text-emerald-600" />,
      title: "CV Yükle",
      description: "Toplu CV yükleme",
      action: "upload",
      color: "emerald",
    },
    {
      icon: <Wand2 className="w-5 h-5 text-purple-600" />,
      title: "Yeni Analiz",
      description: "CV analizi başlat",
      action: "analyze",
      color: "purple",
    },
    {
      icon: <Plus className="w-5 h-5 text-blue-600" />,
      title: "İş İlanı Oluştur",
      description: "Yeni ilan yayınla",
      action: "create-job",
      color: "blue",
    },
    {
      icon: <Users className="w-5 h-5 text-slate-600" />,
      title: "Adayları Gör",
      description: "Aday havuzu",
      action: "view-candidates",
      color: "slate",
    },
    {
      icon: <Calendar className="w-5 h-5 text-orange-600" />,
      title: "Mülakat Planla",
      description: "Takvime ekle",
      action: "schedule",
      color: "orange",
    },
  ];

  return (
    <div className="bg-white shadow-sm rounded-xl">
      <div className="p-6">
        <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2 mb-4">
          <Zap className="w-5 h-5 text-yellow-600" />
          Hızlı İşlemler
        </h3>

        <div className="space-y-2">
          {actions.map((action) => (
            <button
              key={action.action}
              onClick={() => handleQuickAction(action.action)}
              className={`w-full flex items-center gap-3 p-3 rounded-lg hover:bg-${action.color}-50 transition-colors group`}
            >
              <div
                className={`flex-shrink-0 w-10 h-10 bg-${action.color}-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}
              >
                {action.icon}
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-medium text-slate-800">
                  {action.title}
                </p>
                <p className="text-xs text-slate-500">{action.description}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
