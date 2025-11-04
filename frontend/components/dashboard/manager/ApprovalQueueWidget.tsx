'use client';

import { CheckSquare, CheckCircle, FileText, DollarSign, Calendar } from 'lucide-react';

interface ApprovalQueueWidgetProps {
  data: {
    queue: Array<{
      id: string;
      type: 'OFFER' | 'BUDGET' | 'LEAVE';
      title: string;
      createdAt: string;
    }>;
  } | null;
}

export function ApprovalQueueWidget({ data }: ApprovalQueueWidgetProps) {
  const approvalQueue = data?.queue || [];

  const getApprovalIcon = (type: string) => {
    switch (type) {
      case 'OFFER':
        return <FileText className="w-4 h-4 text-purple-600" />;
      case 'BUDGET':
        return <DollarSign className="w-4 h-4 text-yellow-600" />;
      case 'LEAVE':
        return <Calendar className="w-4 h-4 text-blue-600" />;
      default:
        return <FileText className="w-4 h-4 text-gray-600" />;
    }
  };

  const formatRelativeTime = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);

      if (diffMins < 60) return `${diffMins} dakika önce`;
      if (diffMins < 1440) return `${Math.floor(diffMins / 60)} saat önce`;
      return `${Math.floor(diffMins / 1440)} gün önce`;
    } catch {
      return 'Bilinmiyor';
    }
  };

  return (
    <div className="bg-white shadow-sm rounded-xl">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-blue-600" />
            Onay Kuyruğu
          </h3>
          <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-semibold">
            {approvalQueue.length}
          </span>
        </div>

        {approvalQueue.length === 0 ? (
          <div className="text-center py-8">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
            <p className="text-sm text-slate-500">Tüm işler onaylandı! 🎉</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {approvalQueue.slice(0, 5).map(item => (
              <div
                key={item.id}
                className="p-3 border border-slate-200 rounded-lg hover:border-blue-300 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {getApprovalIcon(item.type)}
                      <span className={`text-xs px-2 py-0.5 rounded ${
                        item.type === 'OFFER' ? 'bg-purple-100 text-purple-700' :
                        item.type === 'BUDGET' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {item.type === 'OFFER' ? 'Teklif' :
                         item.type === 'BUDGET' ? 'Bütçe' : 'İzin'}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-slate-800 line-clamp-1">
                      {item.title}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      {formatRelativeTime(item.createdAt)}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="flex-1 bg-green-600 hover:bg-green-700 text-white py-1.5 rounded text-xs font-medium transition-colors">
                    ✓ Onayla
                  </button>
                  <button className="flex-1 bg-red-600 hover:bg-red-700 text-white py-1.5 rounded text-xs font-medium transition-colors">
                    ✗ Reddet
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
