import React from "react";

interface Revision {
  id: string;
  version: number;
  changeType: string;
  createdAt: string;
  changer?: {
    email?: string;
    firstName?: string;
    lastName?: string;
  };
}

interface RevisionHistoryProps {
  revisions: Revision[];
}

const RevisionHistory: React.FC<RevisionHistoryProps> = ({ revisions }) => {
  if (!revisions || revisions.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
        <p className="text-gray-600">Versiyon geçmişi bulunmuyor.</p>
      </div>
    );
  }

  const getChangeTypeInfo = (changeType: string) => {
    const types: Record<
      string,
      { icon: string; label: string; color: string }
    > = {
      created: {
        icon: "✨",
        label: "Oluşturuldu",
        color: "bg-green-100 text-green-800 border-green-200",
      },
      updated: {
        icon: "✏️",
        label: "Güncellendi",
        color: "bg-blue-100 text-blue-800 border-blue-200",
      },
      status_changed: {
        icon: "🔄",
        label: "Durum Değişti",
        color: "bg-purple-100 text-purple-800 border-purple-200",
      },
      sent: {
        icon: "📧",
        label: "Gönderildi",
        color: "bg-indigo-100 text-indigo-800 border-indigo-200",
      },
      accepted: {
        icon: "✅",
        label: "Kabul Edildi",
        color: "bg-green-100 text-green-800 border-green-200",
      },
      rejected: {
        icon: "❌",
        label: "Reddedildi",
        color: "bg-red-100 text-red-800 border-red-200",
      },
      approved: {
        icon: "👍",
        label: "Onaylandı",
        color: "bg-teal-100 text-teal-800 border-teal-200",
      },
      deleted: {
        icon: "🗑️",
        label: "Silindi",
        color: "bg-gray-100 text-gray-800 border-gray-200",
      },
    };
    return (
      types[changeType] || {
        icon: "📝",
        label: changeType,
        color: "bg-gray-100 text-gray-800 border-gray-200",
      }
    );
  };

  const getChangerName = (changer: Revision["changer"]) => {
    if (!changer) return "Sistem";
    if (changer.firstName && changer.lastName) {
      return `${changer.firstName} ${changer.lastName}`;
    }
    return changer.email || "Bilinmiyor";
  };

  return (
    <div className="space-y-4">
      {revisions.map((item, index) => {
        const typeInfo = getChangeTypeInfo(item.changeType);
        const isLatest = index === 0;

        return (
          <div
            key={item.id}
            className={`
              relative p-5 border-2 rounded-lg bg-white shadow-sm
              ${isLatest ? "border-blue-400 shadow-md" : "border-gray-200"}
            `}
          >
            {isLatest && (
              <div className="absolute -top-3 left-4 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                En Son
              </div>
            )}

            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div
                  className={`px-3 py-1 rounded-lg border-2 ${typeInfo.color} font-medium flex items-center gap-2`}
                >
                  <span>{typeInfo.icon}</span>
                  <span className="text-sm">{typeInfo.label}</span>
                </div>
                <div className="text-sm text-gray-600">
                  Versiyon{" "}
                  <span className="font-bold text-gray-900">
                    {item.version}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-gray-600 mb-1">Değiştiren</p>
                <p className="text-gray-900 font-medium">
                  {getChangerName(item.changer)}
                </p>
              </div>
              <div>
                <p className="text-gray-600 mb-1">Tarih</p>
                <p className="text-gray-900 font-medium">
                  {new Date(item.createdAt).toLocaleString("tr-TR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default RevisionHistory;
