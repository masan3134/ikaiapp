"use client";

import Link from "next/link";
import { List as ListIcon } from "lucide-react";

interface QueueManagementWidgetProps {
  data: any[];
}

export default function QueueManagementWidget({
  data,
}: QueueManagementWidgetProps) {
  const queueStats = data || [];

  return (
    <div className="bg-white shadow-sm rounded-lg">
      <div className="p-6 border-b border-slate-200">
        <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
          <ListIcon className="w-5 h-5 text-orange-600" />
          Queue Yönetimi
        </h3>
      </div>
      <div className="p-6">
        <div className="space-y-3">
          {queueStats.map((queue: any) => (
            <div
              key={queue.name}
              className="p-3 border border-slate-200 rounded-lg"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-800">
                  {queue.name}
                </span>
                <span
                  className={`text-xs px-2 py-1 rounded ${
                    queue.status === "active"
                      ? "bg-green-100 text-green-700"
                      : queue.status === "paused"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                  }`}
                >
                  {queue.status}
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2 text-xs">
                <div className="text-center">
                  <p className="text-slate-600">Waiting</p>
                  <p className="font-bold text-blue-600">
                    {queue.waiting || 0}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-slate-600">Active</p>
                  <p className="font-bold text-green-600">
                    {queue.active || 0}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-slate-600">Completed</p>
                  <p className="font-bold text-slate-600">
                    {queue.completed || 0}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-slate-600">Failed</p>
                  <p className="font-bold text-red-600">{queue.failed || 0}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Link
          href="/super-admin/queues"
          className="block text-center mt-4 text-sm text-orange-600 hover:text-orange-700 font-medium"
        >
          Queue Dashboard →
        </Link>
      </div>
    </div>
  );
}
