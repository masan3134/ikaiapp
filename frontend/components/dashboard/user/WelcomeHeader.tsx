"use client";

import { useState, useEffect } from "react";

interface WelcomeHeaderProps {
  user: {
    firstName?: string;
    lastName?: string;
    email?: string;
  } | null;
}

export function WelcomeHeader({ user }: WelcomeHeaderProps) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDate = () => {
    return currentTime.toLocaleDateString("tr-TR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = () => {
    return currentTime.toLocaleTimeString("tr-TR", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  return (
    <div className="bg-gradient-to-r from-slate-600 to-slate-800 rounded-xl p-6 mb-6 text-white shadow-lg">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            👋 Hoş geldin, {user?.firstName || "Kullanıcı"}!
          </h1>
          <p className="text-slate-200 text-sm md:text-base">
            {formatDate()} • {formatTime()}
          </p>
          {user?.email && (
            <p className="text-slate-300 text-xs mt-2">{user.email}</p>
          )}
        </div>
      </div>
    </div>
  );
}
