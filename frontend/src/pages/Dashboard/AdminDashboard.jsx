// src/pages/Dashboard/AdminDashboard.jsx
import { useNavigate } from "react-router-dom";
import {
  UsersIcon,
  UserGroupIcon,
  BanknotesIcon,
  ClockIcon,
  ClipboardDocumentListIcon,
  ArchiveBoxIcon,
  ChartBarSquareIcon,
  ShieldCheckIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";

import KpiCard from "../../components/dashboard/KpiCard";
import ModuleCard from "../../components/dashboard/ModuleCard";
import ActivityFeed from "../../components/dashboard/ActivityFeed";
import SystemStatusCard from "../../components/dashboard/SystemStatusCard";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const kpis = {
    totalUsers: 14,
    activeCashiers: 3,
    todaySales: "₱0.00",
    openShifts: 1,
  };

  const modules = [
    {
      title: "User Management",
      description:
        "Create, edit, and deactivate Admin, Manager, and Cashier accounts.",
      actionLabel: "Manage Users",
      icon: UsersIcon,
      pill: "Access",
      path: "/admin/users",
    },
    {
      title: "Audit Logs",
      description:
        "Track logins, failed attempts, and critical system actions.",
      actionLabel: "View Logs",
      icon: ClipboardDocumentListIcon,
      pill: "Security",
      path: "/admin/audit",
    },
    {
      title: "Products",
      description: "Manage product list, prices, categories, and tax settings.",
      actionLabel: "Product Module",
      icon: ArchiveBoxIcon,
      pill: "Catalog",
      path: "/admin/products",
    },
    {
      title: "Promotions",
      description: "Configure discounts, promos, and special pricing rules.",
      actionLabel: "Manage Promotions",
      icon: BanknotesIcon,
      pill: "Promos",
      path: "/admin/products/promotions",
    },
    {
      title: "Inventory",
      description: "Review stock levels, adjustments, and low-stock items.",
      actionLabel: "Inventory Center",
      icon: ShieldCheckIcon,
      pill: "Stock",
      path: "/admin/inventory",
    },
    {
      title: "Sales & Reports",
      description:
        "View daily totals, transaction history, and performance reports.",
      actionLabel: "Open Reports",
      icon: ChartBarSquareIcon,
      pill: "Analytics",
      path: "/admin/reports/sales",
    },
    {
      title: "ROI & Profitability",
      description: "Analyze product, category, and promotion profitability.",
      actionLabel: "Open ROI Dashboard",
      icon: ChartBarSquareIcon,
      pill: "ROI",
      path: "/admin/roi",
    },
    {
      title: "System Settings",
      description:
        "Configure store profile, tax rates, receipt footer, and POS rules.",
      actionLabel: "Open Settings",
      icon: Cog6ToothIcon,
      pill: "Setup",
      path: "/admin/settings",
    },
    {
      title: "Refunds & Voids",
      description:
        "Review and manage refunds, voided sales, and approval history.",
      actionLabel: "Open Refund Center",
      icon: BanknotesIcon,
      pill: "Refunds",
      path: "/admin/refunds",
    },
    {
      title: "Shift & Cash Management",
      description:
        "Monitor shifts, cash drawer openings, closings, and variances.",
      actionLabel: "Open Shift Center",
      icon: ClockIcon,
      pill: "Shifts",
      path: "/admin/shifts",
    },
    {
      title: "Transaction History",
      description:
        "Search and review individual transactions and inspect details.",
      actionLabel: "View Transactions",
      icon: ClipboardDocumentListIcon,
      pill: "Transactions",
      path: "/admin/transactions",
    },
  ];

  const activityItems = [
    { time: "09:00", text: 'Cashier "anna" started shift.' },
    {
      time: "09:12",
      text: 'Admin "owner" updated product "Lucky Me Pancit" price.',
    },
    {
      time: "10:05",
      text: 'Manager "john" viewed daily sales report.',
    },
    {
      time: "10:30",
      text: 'Failed login attempt for user "test".',
      variant: "warning",
    },
  ];

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">Overview</h2>
          <p className="text-[11px] text-slate-500">
            Today · Placeholder data until reporting is wired
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <KpiCard
            label="Total Users"
            value={kpis.totalUsers}
            icon={UsersIcon}
            accent="sky"
          />
          <KpiCard
            label="Active Cashiers"
            value={kpis.activeCashiers}
            icon={UserGroupIcon}
            accent="emerald"
          />
          <KpiCard
            label="Today’s Sales"
            value={kpis.todaySales}
            icon={BanknotesIcon}
            accent="amber"
          />
          <KpiCard
            label="Open Shifts"
            value={kpis.openShifts}
            icon={ClockIcon}
            accent="violet"
          />
        </div>
      </section>

      {/* Quick actions */}
      <section>
        <h2 className="text-lg font-semibold mb-3">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => navigate("/cashier/pos")}
            className="text-xs px-3.5 py-2 rounded-full bg-sky-600 text-white font-medium shadow hover:bg-sky-700 active:scale-[0.98] transition"
          >
            Open POS Terminal
          </button>
          <button
            type="button"
            onClick={() => navigate("/admin/users/create")}
            className="text-xs px-3.5 py-2 rounded-full bg-sky-600 text-white font-medium shadow hover:bg-sky-700 active:scale-[0.98] transition"
          >
            + New User
          </button>
          <button
            type="button"
            onClick={() => navigate("/admin/products/create")}
            className="text-xs px-3.5 py-2 rounded-full bg-sky-600 text-white font-medium shadow hover:bg-sky-700 active:scale-[0.98] transition"
          >
            + New Product
          </button>
          <button
            type="button"
            onClick={() => navigate("/admin/reports/sales")}
            className="text-xs px-3.5 py-2 rounded-full bg-sky-600 text-white font-medium shadow hover:bg-sky-700 active:scale-[0.98] transition"
          >
            View Sales Reports
          </button>
          <button
            type="button"
            onClick={() => navigate("/admin/settings")}
            className="text-xs px-3.5 py-2 rounded-full bg-sky-600 text-white font-medium shadow hover:bg-sky-700 active:scale-[0.98] transition"
          >
            Store Settings
          </button>
        </div>
      </section>

      {/* Admin Modules */}
      <section>
        <h2 className="text-lg font-semibold mb-3">Admin Modules</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {modules.map((mod) => (
            <ModuleCard
              key={mod.title}
              {...mod}
              onClick={() => navigate(mod.path)}
            />
          ))}
        </div>
      </section>

      {/* Activity + System Status */}
      <section className="grid gap-4 md:grid-cols-[minmax(0,2fr)_minmax(0,1.4fr)]">
        <ActivityFeed items={activityItems} />
        <SystemStatusCard />
      </section>
    </div>
  );
}
