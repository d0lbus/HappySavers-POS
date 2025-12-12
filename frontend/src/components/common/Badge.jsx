import React from "react";

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

const VARIANTS = {
  slate: "bg-slate-100 text-slate-700 border-slate-200",
  emerald: "bg-emerald-50 text-emerald-700 border-emerald-200",
  sky: "bg-sky-50 text-sky-700 border-sky-200",
  amber: "bg-amber-50 text-amber-800 border-amber-200",
  red: "bg-red-50 text-red-700 border-red-200",
  violet: "bg-violet-50 text-violet-700 border-violet-200",
};

export default function Badge({ variant = "slate", className, children, ...props }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-[2px] text-[11px] font-medium",
        VARIANTS[variant] || VARIANTS.slate,
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
