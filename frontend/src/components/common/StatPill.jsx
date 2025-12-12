import React from "react";

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

const TONES = {
  neutral: "bg-slate-100 text-slate-700 border-slate-200",
  success: "bg-emerald-50 text-emerald-700 border-emerald-200",
  warning: "bg-amber-50 text-amber-800 border-amber-200",
  danger: "bg-red-50 text-red-700 border-red-200",
  info: "bg-sky-50 text-sky-700 border-sky-200",
};

export default function StatPill({ tone = "neutral", label, value, className }) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs",
        TONES[tone] || TONES.neutral,
        className
      )}
    >
      {label ? <span className="uppercase tracking-wide text-[10px] opacity-80">{label}</span> : null}
      <span className="font-semibold">{value}</span>
    </div>
  );
}
