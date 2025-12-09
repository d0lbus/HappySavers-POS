// src/components/layout/AppLayout.jsx
import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";

export default function AppLayout({ role, navItems, user }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">

      {/* Top header */}
      <Header role={role} user={user} onToggleSidebar={() => setSidebarOpen(true)} />

      <div className="flex flex-1 overflow-hidden">

        {/* Sidebar */}
        <Sidebar
          role={role}
          user={user}
          navItems={navItems}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Main content */}
        <main className="flex-1 overflow-y-auto px-4 py-4 sm:px-6 sm:py-6">
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </main>

      </div>
    </div>
  );
}
