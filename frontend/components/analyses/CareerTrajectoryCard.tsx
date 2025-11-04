"use client";

import { TrendingUp } from "lucide-react";

interface CareerTrajectoryProps {
  trajectory: string;
}

/**
 * V7.1: Display career growth pattern analysis
 */
export default function CareerTrajectoryCard({
  trajectory,
}: CareerTrajectoryProps) {
  return (
    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-5 border border-purple-200">
      <div className="flex items-center gap-2 mb-3">
        <TrendingUp className="w-5 h-5 text-purple-600" />
        <h4 className="font-semibold text-purple-900 text-sm">
          Kariyer Gelişimi
        </h4>
      </div>
      <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
        {trajectory}
      </p>
    </div>
  );
}
