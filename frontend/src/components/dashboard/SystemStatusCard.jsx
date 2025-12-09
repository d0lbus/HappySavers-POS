// src/components/dashboard/SystemStatusCard.jsx
import React from "react";
import {
  ShieldCheckIcon,
  SignalIcon,
  ServerStackIcon,
  ComputerDesktopIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

function StatusRow({ icon: Icon, label, value, color }) {
  const colorMap = {
    emerald: "text-emerald-600",
    amber: "text-amber-500",
    red: "text-red-500",
  };

  return (
    <li className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Icon className={`h-4 w-4 ${colorMap[color] || "text-slate-500"}`} />
        <span className="text-[11px] uppercase tracking-wide text-slate-500">
          {label}
        </span>
      </div>
      <span className="text-xs text-slate-700">{value}</span>
    </li>
  );
}

export default function SystemStatusCard() {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 border border-slate-100">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <ShieldCheckIcon className="h-4 w-4 text-emerald-600" />
          <h3 className="font-semibold text-slate-800 text-sm">
            System Status
          </h3>
        </div>
        <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-[2px] text-[10px] font-medium text-emerald-700">
          Healthy
        </span>
      </div>

      <ul className="mt-2 space-y-2 text-xs text-slate-600">
        <StatusRow
          icon={SignalIcon}
          label="API"
          value="Online"
          color="emerald"
        />
        <StatusRow
          icon={ServerStackIcon}
          label="Database"
          value="Connected"
          color="emerald"
        />
        <StatusRow
          icon={ComputerDesktopIcon}
          label="POS Terminals"
          value="1 offline (placeholder)"
          color="amber"
        />
      </ul>

      <div className="mt-3 flex items-start gap-1.5">
        <ExclamationTriangleIcon className="h-3.5 w-3.5 text-slate-400 mt-[2px]" />
        <p className="text-[11px] text-slate-400 leading-snug">
          These values are placeholders. Connect to real health checks in a later phase.
        </p>
      </div>
    </div>
  );
}
