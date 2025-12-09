// src/components/layout/AuthLayout.jsx
import React from "react";
import { Outlet, Link } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-2xl bg-white p-8 rounded-xl shadow-md border border-slate-200">
        
        <header className="text-center mb-6">
          <div className="h-12 w-12 mx-auto rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-lg">
            HS
          </div>
          <h1 className="text-xl font-bold mt-2 text-slate-800">HappySavers Minimart</h1>
        </header>

        <Outlet />

        <p className="text-center text-xs text-slate-400 mt-6">
          © {new Date().getFullYear()} HappySavers. All rights reserved.
        </p>
      </div>
    </div>
  );
}
