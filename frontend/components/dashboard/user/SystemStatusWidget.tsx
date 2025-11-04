"use client";

import { useState, useEffect } from "react";
import { Server, Database, Wifi } from "lucide-react";

export function SystemStatusWidget() {
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [backendStatus, setBackendStatus] = useState<"online" | "offline">(
    "online"
  );
  const [databaseStatus, setDatabaseStatus] = useState<
    "connected" | "disconnected"
  >("connected");
  const [connectionStatus, setConnectionStatus] = useState<
    "stable" | "unstable"
  >("stable");

  useEffect(() => {
    // Update time every minute
    const timer = setInterval(() => {
      setLastUpdate(new Date());
    }, 60000);

    // Check backend health
    checkBackendHealth();
    const healthCheck = setInterval(checkBackendHealth, 300000); // Every 5 minutes

    return () => {
      clearInterval(timer);
      clearInterval(healthCheck);
    };
  }, []);

  const checkBackendHealth = async () => {
    try {
      const response = await fetch("http://localhost:8102/health", {
        method: "GET",
      });
      const data = await response.json();

      // Backend status
      const isHealthy = response.ok && data.status === "ok";
      setBackendStatus(isHealthy ? "online" : "offline");

      // Database status (from health response)
      const dbStatus =
        data.services?.database === "connected" ? "connected" : "disconnected";
      setDatabaseStatus(dbStatus);

      // Connection status (based on redis or overall health)
      const redisOk = data.services?.redis === "connected";
      setConnectionStatus(redisOk ? "stable" : "unstable");
    } catch (error) {
      setBackendStatus("offline");
      setDatabaseStatus("disconnected");
      setConnectionStatus("unstable");
    }
  };

  const formatLastUpdate = () => {
    return lastUpdate.toLocaleTimeString("tr-TR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2 mb-4">
        <Server className="w-5 h-5 text-slate-600" />
        Sistem Durumu
      </h3>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Server className="w-4 h-4 text-slate-500" />
            <span className="text-sm text-slate-600">Backend</span>
          </div>
          <span
            className={`flex items-center gap-1 text-sm font-medium ${
              backendStatus === "online" ? "text-green-600" : "text-red-600"
            }`}
          >
            <div
              className={`w-2 h-2 rounded-full ${
                backendStatus === "online"
                  ? "bg-green-500 animate-pulse"
                  : "bg-red-500"
              }`}
            />
            {backendStatus === "online" ? "Çalışıyor" : "Çevrimdışı"}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-slate-500" />
            <span className="text-sm text-slate-600">Veritabanı</span>
          </div>
          <span
            className={`flex items-center gap-1 text-sm font-medium ${
              databaseStatus === "connected" ? "text-green-600" : "text-red-600"
            }`}
          >
            <div
              className={`w-2 h-2 rounded-full ${
                databaseStatus === "connected"
                  ? "bg-green-500 animate-pulse"
                  : "bg-red-500"
              }`}
            />
            {databaseStatus === "connected" ? "Bağlı" : "Bağlantı Yok"}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wifi className="w-4 h-4 text-slate-500" />
            <span className="text-sm text-slate-600">Bağlantı</span>
          </div>
          <span
            className={`flex items-center gap-1 text-sm font-medium ${
              connectionStatus === "stable"
                ? "text-green-600"
                : "text-yellow-600"
            }`}
          >
            <div
              className={`w-2 h-2 rounded-full ${
                connectionStatus === "stable"
                  ? "bg-green-500 animate-pulse"
                  : "bg-yellow-500"
              }`}
            />
            {connectionStatus === "stable" ? "Stabil" : "Kararsız"}
          </span>
        </div>

        <div className="pt-3 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500">Son Güncelleme</span>
            <span className="text-xs text-slate-700 font-medium">
              {formatLastUpdate()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
