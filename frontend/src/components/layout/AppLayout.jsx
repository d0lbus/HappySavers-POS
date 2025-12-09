// src/components/layout/AppLayout.jsx
import React, { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function AppLayout({ role, navItems, user }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  const closeSidebar = () => setSidebarOpen(false);

  // Auto-detect title based on navConfig
  const pageTitle =
    navItems
      ?.flatMap((section) => section.items)
      ?.find((item) => item.to === location.pathname)?.label || "Dashboard";

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <Header role={role} user={user} onToggleSidebar={toggleSidebar} />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          role={role}
          user={user}
          navItems={navItems}
          isOpen={sidebarOpen}
          onClose={closeSidebar}
        />

        <div className="flex-1 flex flex-col overflow-hidden">
          <Topbar title={pageTitle} subtitle={`${role} Panel`} />

          <main className="flex-1 overflow-y-auto px-4 py-4 sm:px-6 sm:py-6">
            <div className="max-w-6xl mx-auto">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
