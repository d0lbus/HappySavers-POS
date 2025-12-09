// src/components/dashboard/ActivityFeed.jsx
import React from "react";
import { BellAlertIcon } from "@heroicons/react/24/outline";

function ActivityItem({ time, text, variant = "normal" }) {
  const dotColor = variant === "warning" ? "bg-amber-400" : "bg-sky-500";

  return (
    <div className="flex items-start gap-3 text-xs text-slate-700">
      <span className={`mt-1 h-2 w-2 rounded-full ${dotColor}`} />
      <div className="flex flex-col sm:flex-row sm:items-baseline gap-0.5 sm:gap-2">
        <span className="font-semibold text-slate-500">{time}</span>
        <span>{text}</span>
      </div>
    </div>
  );
}

export default function ActivityFeed({ items }) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 border border-slate-100">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <BellAlertIcon className="h-4 w-4 text-sky-600" />
          <h3 className="font-semibold text-slate-800 text-sm">
            Recent Activity
          </h3>
        </div>
        <span className="text-[10px] uppercase tracking-wide text-slate-400">
          Last 24 hours
        </span>
      </div>

      <div className="mt-2 space-y-3">
        {items.map((item, idx) => (
          <ActivityItem key={idx} {...item} />
        ))}
      </div>
    </div>
  );
}
