// src/components/dashboard/KpiCard.jsx
import React from "react";

const ACCENTS = {
  sky: {
    bgSoft: "bg-sky-50",
    iconBg: "bg-sky-100",
    iconColor: "text-sky-600",
  },
  emerald: {
    bgSoft: "bg-emerald-50",
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
  },
  amber: {
    bgSoft: "bg-amber-50",
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
  },
  violet: {
    bgSoft: "bg-violet-50",
    iconBg: "bg-violet-100",
    iconColor: "text-violet-600",
  },
};

export default function KpiCard({ label, value, icon: Icon, accent = "sky" }) {
  const styles = ACCENTS[accent] || ACCENTS.sky;

  return (
    <div
      className={`relative overflow-hidden rounded-xl shadow-sm border border-slate-100 ${styles.bgSoft}`}
    >
      <div className="flex items-center justify-between px-4 py-3">
        <div>
          <p className="text-[11px] uppercase tracking-wide text-slate-500">
            {label}
          </p>
          <p className="text-xl font-semibold text-slate-900 mt-1">{value}</p>
        </div>
        <div
          className={`h-9 w-9 rounded-full flex items-center justify-center ${styles.iconBg}`}
        >
          <Icon className={`h-5 w-5 ${styles.iconColor}`} />
        </div>
      </div>
    </div>
  );
}
