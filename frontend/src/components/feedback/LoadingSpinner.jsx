import React from "react";

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function LoadingSpinner({ className, label = "Loading…" }) {
  return (
    <div className={cn("flex items-center gap-2 text-slate-600", className)}>
      <span className="inline-block h-4 w-4 rounded-full border-2 border-slate-300 border-t-slate-600 animate-spin" />
      <span className="text-sm">{label}</span>
    </div>
  );
}
