import React from "react";

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

/**
 * <Tabs value={value} onChange={setValue} tabs={[{ value:'a', label:'A' }]} />
 */
export default function Tabs({ tabs = [], value, onChange, className }) {
  return (
    <div className={cn("inline-flex rounded-xl bg-slate-100 p-1", className)}>
      {tabs.map((t) => {
        const active = t.value === value;
        return (
          <button
            key={t.value}
            type="button"
            onClick={() => onChange?.(t.value)}
            className={cn(
              "px-4 py-2 text-sm rounded-lg transition font-medium",
              active
                ? "bg-white shadow-sm text-slate-900"
                : "text-slate-600 hover:text-slate-900"
            )}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}
