"use client";

import { UserPlus, Shield, Activity, UserMinus } from "lucide-react";
import { Card, CardHeader, CardBody } from "@nextui-org/react";

interface UserManagementWidgetProps {
  data: {
    totalUsers: number;
    activeToday: number;
  };
}

export default function UserManagementWidget({
  data,
}: UserManagementWidgetProps) {
  return (
    <Card className="bg-gradient-to-br from-indigo-50 to-white shadow-sm hover:shadow-md transition-shadow">
      <CardHeader>
        <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
          <UserPlus className="w-5 h-5 text-indigo-600" />
          Kullanıcı Yönetimi
        </h3>
      </CardHeader>
      <CardBody>
        <div className="grid grid-cols-2 gap-3">
          <button className="p-4 bg-white rounded-lg border border-indigo-200 hover:border-indigo-400 hover:bg-indigo-50 transition-all group">
            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center mb-2 mx-auto group-hover:scale-110 transition-transform">
              <UserPlus className="w-5 h-5 text-indigo-600" />
            </div>
            <p className="text-sm font-medium text-slate-800">Davet Et</p>
            <p className="text-xs text-slate-500">Yeni kullanıcı</p>
          </button>

          <button className="p-4 bg-white rounded-lg border border-purple-200 hover:border-purple-400 hover:bg-purple-50 transition-all group">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-2 mx-auto group-hover:scale-110 transition-transform">
              <Shield className="w-5 h-5 text-purple-600" />
            </div>
            <p className="text-sm font-medium text-slate-800">Roller</p>
            <p className="text-xs text-slate-500">Yetki yönetimi</p>
          </button>

          <button className="p-4 bg-white rounded-lg border border-blue-200 hover:border-blue-400 hover:bg-blue-50 transition-all group">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-2 mx-auto group-hover:scale-110 transition-transform">
              <Activity className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-sm font-medium text-slate-800">Aktivite</p>
            <p className="text-xs text-slate-500">Kullanıcı logları</p>
          </button>

          <button className="p-4 bg-white rounded-lg border border-slate-200 hover:border-slate-400 hover:bg-slate-50 transition-all group">
            <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center mb-2 mx-auto group-hover:scale-110 transition-transform">
              <UserMinus className="w-5 h-5 text-slate-600" />
            </div>
            <p className="text-sm font-medium text-slate-800">Deaktif Et</p>
            <p className="text-xs text-slate-500">Erişim kapat</p>
          </button>
        </div>
      </CardBody>
    </Card>
  );
}
