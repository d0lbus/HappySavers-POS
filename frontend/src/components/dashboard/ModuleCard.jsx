// src/components/dashboard/ModuleCard.jsx
import React from "react";

export default function ModuleCard({
  title,
  description,
  actionLabel,
  icon: Icon,
  pill,
  onClick,
}) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-5 border border-slate-100 hover:shadow-md hover:-translate-y-[1px] transition">
      <div className="flex items-start gap-3 mb-3">
        <div className="h-9 w-9 rounded-full bg-slate-100 flex items-center justify-center">
          <Icon className="h-5 w-5 text-slate-700" />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-semibold text-slate-800 text-sm">{title}</h3>
            {pill && (
              <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-[2px] text-[10px] font-medium text-slate-600">
                {pill}
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-1">{description}</p>
        </div>
      </div>

      <button
        type="button"
        onClick={onClick}
        className="text-xs px-3 py-1.5 rounded bg-sky-600 text-white hover:bg-sky-700 transition"
      >
        {actionLabel}
      </button>
    </div>
  );
}
