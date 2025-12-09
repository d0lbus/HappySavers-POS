// src/components/layout/Header.jsx
import React from "react";

export default function Header({ role, user, onToggleSidebar }) {
  return (
    <header className="bg-white border-b border-slate-200 backdrop-blur flex items-center px-4 py-2.5 sm:px-6">
      
      {/* Left section: Logo + Title */}
      <div className="flex items-center gap-3 flex-1">
        
        {/* Mobile Sidebar Toggle */}
        <button
          onClick={onToggleSidebar}
          className="sm:hidden p-2 rounded-lg border border-slate-200 hover:bg-slate-50"
        >
          <svg
            className="w-5 h-5 text-slate-600"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            viewBox="0 0 24 24"
          >
            <line x1="4" y1="6" x2="20" y2="6" />
            <line x1="4" y1="12" x2="20" y2="12" />
            <line x1="4" y1="18" x2="20" y2="18" />
          </svg>
        </button>

        {/* Logo + System Name */}
        <div className="flex items-center gap-2">
          <div className="bg-emerald-600 h-8 w-8 rounded-lg text-white flex items-center justify-center text-xs font-bold">
            HS
          </div>
          <div className="leading-tight">
            <p className="text-sm font-semibold text-slate-900">HappySavers POS</p>
            <p className="text-[11px] text-slate-500">{role} Console</p>
          </div>
        </div>

      </div>

      {/* RIGHT SIDE — now EMPTY (no redundant user capsule) */}
      {/* You may add notifications later if needed */}

    </header>
  );
}
