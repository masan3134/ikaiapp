"use client";

import { useState, useEffect } from "react";
import { Activity } from "lucide-react";
import { usePathname } from "next/navigation";

interface ActivityTodayWidgetProps {
  data?: {
    loginTime?: string;
    currentTime?: string;
  };
}

export function ActivityTodayWidget({ data }: ActivityTodayWidgetProps) {
  const pathname = usePathname();
  const [loginTime, setLoginTime] = useState<string>("--:--");
  const [onlineTime, setOnlineTime] = useState<string>("0dk");
  const [pageViews, setPageViews] = useState<number>(0);

  useEffect(() => {
    // Get login time from localStorage (set during login)
    const storedLoginTime = localStorage.getItem("sessionLoginTime");
    if (storedLoginTime) {
      setLoginTime(storedLoginTime);
    } else {
      // Set current time as login time if not found
      const now = new Date();
      const timeStr = now.toLocaleTimeString("tr-TR", {
        hour: "2-digit",
        minute: "2-digit",
      });
      setLoginTime(timeStr);
      localStorage.setItem("sessionLoginTime", timeStr);
    }

    // Calculate online time
    const updateOnlineTime = () => {
      const loginTimestamp = localStorage.getItem("sessionStartTimestamp");
      if (loginTimestamp) {
        const startTime = parseInt(loginTimestamp);
        const now = Date.now();
        const diffInMinutes = Math.floor((now - startTime) / 60000);

        const hours = Math.floor(diffInMinutes / 60);
        const minutes = diffInMinutes % 60;

        if (hours > 0) {
          setOnlineTime(`${hours}sa ${minutes}dk`);
        } else {
          setOnlineTime(`${minutes}dk`);
        }
      }
    };

    updateOnlineTime();
    const timer = setInterval(updateOnlineTime, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Track page views
    const currentCount = parseInt(
      localStorage.getItem("sessionPageViews") || "0"
    );
    const newCount = currentCount + 1;
    localStorage.setItem("sessionPageViews", newCount.toString());
    setPageViews(newCount);
  }, [pathname]);

  return (
    <div className="bg-gradient-to-br from-green-50 to-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
      <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2 mb-4">
        <Activity className="w-5 h-5 text-green-600" />
        Bugünkü Aktivite
      </h3>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-600">Giriş Saati</span>
          <span className="text-sm font-semibold text-slate-800">
            {loginTime}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-600">Çevrimiçi Süre</span>
          <span className="text-sm font-semibold text-slate-800">
            {onlineTime}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-600">Sayfa Ziyareti</span>
          <span className="text-sm font-semibold text-slate-800">
            {pageViews} sayfa
          </span>
        </div>
      </div>
    </div>
  );
}
