// src/components/layout/Topbar.jsx
import React from "react";

export default function Topbar({ title, subtitle }) {
  return (
    <div className="border-b border-slate-200 bg-slate-50/70">
      <div className="max-w-6xl mx-auto px-4 py-3 sm:px-6 flex justify-between items-center">
        <div>
          <h1 className="text-lg font-semibold text-slate-900">{title}</h1>
          {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
        </div>
      </div>
    </div>
  );
}
