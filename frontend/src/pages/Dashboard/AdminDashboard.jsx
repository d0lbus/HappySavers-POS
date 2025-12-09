// src/pages/Dashboard/AdminDashboard.jsx
import { useNavigate } from 'react-router-dom';
import {
  UsersIcon,
  UserGroupIcon,
  BanknotesIcon,
  ClockIcon,
  Cog6ToothIcon,
  ClipboardDocumentListIcon,
  ArchiveBoxIcon,
  ChartBarSquareIcon,
  ShieldCheckIcon,
  BellAlertIcon,
  SignalIcon,
  ServerStackIcon,
  ComputerDesktopIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';

export default function AdminDashboard() {
  const navigate = useNavigate();

  // Placeholder values – hook these to real APIs later
  const kpis = {
    totalUsers: 14,
    activeCashiers: 3,
    todaySales: '₱0.00',
    openShifts: 1,
  };

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
          <QuickActionButton onClick={() => navigate('/pos')}>
            Open POS Terminal
          </QuickActionButton>
          <QuickActionButton onClick={() => navigate('/admin/users/new')}>
            + New User
          </QuickActionButton>
          <QuickActionButton onClick={() => navigate('/admin/products/new')}>
            + New Product
          </QuickActionButton>
          <QuickActionButton onClick={() => navigate('/admin/reports')}>
            View Sales Reports
          </QuickActionButton>
          <QuickActionButton onClick={() => navigate('/admin/settings')}>
            Store Settings
          </QuickActionButton>
        </div>
      </section>

      {/* Main admin tools grid */}
      <section>
        <h2 className="text-lg font-semibold mb-3">Admin Modules</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <ModuleCard
            title="User Management"
            description="Create, edit, and deactivate Admin, Manager, and Cashier accounts."
            actionLabel="Manage Users"
            icon={UsersIcon}
            pill="Access"
            onClick={() => navigate('/admin/users')}
          />
          <ModuleCard
            title="Audit Logs"
            description="Track logins, failed attempts, and critical system actions."
            actionLabel="View Logs"
            icon={ClipboardDocumentListIcon}
            pill="Security"
            onClick={() => navigate('/admin/logs')}
          />
          <ModuleCard
            title="Products"
            description="Manage product list, prices, categories, and tax settings."
            actionLabel="Product Module"
            icon={ArchiveBoxIcon}
            pill="Catalog"
            onClick={() => navigate('/admin/products')}
          />
          <ModuleCard
            title="Promotions"
            description="Configure discounts, promos, and special pricing rules."
            actionLabel="Manage Promotions"
            icon={BanknotesIcon}
            pill="Promos"
            onClick={() => navigate('/admin/promotions')}
          />
          <ModuleCard
            title="Inventory"
            description="Review stock levels, adjustments, and low-stock items."
            actionLabel="Inventory Center"
            icon={ShieldCheckIcon}
            pill="Stock"
            onClick={() => navigate('/admin/inventory')}
          />
          <ModuleCard
            title="Sales & Reports"
            description="View daily totals, transaction history, and performance reports."
            actionLabel="Open Reports"
            icon={ChartBarSquareIcon}
            pill="Analytics"
            onClick={() => navigate('/admin/reports')}
          />
          <ModuleCard
            title="ROI & Profitability"
            description="Analyze product, category, and promotion profitability."
            actionLabel="Open ROI Dashboard"
            icon={ChartBarSquareIcon}
            pill="ROI"
            onClick={() => navigate('/admin/roi')}
          />
          <ModuleCard
            title="System Settings"
            description="Configure store profile, tax rates, receipt footer, and POS rules."
            actionLabel="Open Settings"
            icon={Cog6ToothIcon}
            pill="Setup"
            onClick={() => navigate('/admin/settings')}
          />
          <ModuleCard
            title="Refunds & Voids"
            description="Review and manage refunds, voided sales, and approval history."
            actionLabel="Open Refund Center"
            icon={BanknotesIcon}
            pill="Refunds"
            onClick={() => navigate('/admin/refunds')}
          />
          <ModuleCard
            title="Shift & Cash Management"
            description="Monitor shifts, cash drawer openings, closings, and variances."
            actionLabel="Open Shift Center"
            icon={ClockIcon}
            pill="Shifts"
            onClick={() => navigate('/admin/shifts')}
          />
          <ModuleCard
            title="Transaction History"
            description="Search and review individual transactions, reprint receipts, and inspect details."
            actionLabel="View Transactions"
            icon={ClipboardDocumentListIcon}
            pill="Transactions"
            onClick={() => navigate('/admin/transactions')}
          />
        </div>
      </section>

      {/* Activity & system status – improved visuals */}
      <section className="grid gap-4 md:grid-cols-[minmax(0,2fr)_minmax(0,1.4fr)]">
        {/* Recent Activity as a small timeline */}
        <div className="bg-white rounded-lg shadow-sm p-4 border border-slate-100">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <BellAlertIcon className="h-4 w-4 text-sky-600" />
              <h3 className="font-semibold text-slate-800 text-sm">
                Recent Activity
              </h3>
            </div>
            <span className="text-[10px] uppercase tracking-wide text-slate-400">
              Last 24 hours
            </span>
          </div>

          <div className="mt-2 space-y-3">
            <ActivityItem
              time="09:00"
              text='Cashier "anna" started shift.'
            />
            <ActivityItem
              time="09:12"
              text='Admin "owner" updated product "Lucky Me Pancit" price.'
            />
            <ActivityItem
              time="10:05"
              text='Manager "john" viewed daily sales report.'
            />
            <ActivityItem
              time="10:30"
              text='Failed login attempt for user "test".'
              variant="warning"
            />
          </div>
        </div>

        {/* System Status with icons and badge */}
        <div className="bg-white rounded-lg shadow-sm p-4 border border-slate-100">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <ShieldCheckIcon className="h-4 w-4 text-emerald-600" />
              <h3 className="font-semibold text-slate-800 text-sm">
                System Status
              </h3>
            </div>
            <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-[2px] text-[10px] font-medium text-emerald-700">
              Healthy
            </span>
          </div>

          <ul className="mt-2 space-y-2 text-xs text-slate-600">
            <StatusRow
              icon={SignalIcon}
              label="API"
              value="Online"
              color="emerald"
            />
            <StatusRow
              icon={ServerStackIcon}
              label="Database"
              value="Connected"
              color="emerald"
            />
            <StatusRow
              icon={ComputerDesktopIcon}
              label="POS Terminals"
              value="1 offline (placeholder)"
              color="amber"
            />
          </ul>

          <div className="mt-3 flex items-start gap-1.5">
            <ExclamationTriangleIcon className="h-3.5 w-3.5 text-slate-400 mt-[2px]" />
            <p className="text-[11px] text-slate-400 leading-snug">
              These values are placeholders. Connect to real health checks in a later phase.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

/* --- small components --- */

function KpiCard({ label, value, icon: Icon, accent }) {
  const accentClasses = {
    sky: {
      bgSoft: 'bg-sky-50',
      iconBg: 'bg-sky-100',
      iconColor: 'text-sky-600',
    },
    emerald: {
      bgSoft: 'bg-emerald-50',
      iconBg: 'bg-emerald-100',
      iconColor: 'text-emerald-600',
    },
    amber: {
      bgSoft: 'bg-amber-50',
      iconBg: 'bg-amber-100',
      iconColor: 'text-amber-600',
    },
    violet: {
      bgSoft: 'bg-violet-50',
      iconBg: 'bg-violet-100',
      iconColor: 'text-violet-600',
    },
  }[accent || 'sky'];

  return (
    <div
      className={`relative overflow-hidden rounded-xl shadow-sm border border-slate-100 ${accentClasses.bgSoft}`}
    >
      <div className="flex items-center justify-between px-4 py-3">
        <div>
          <p className="text-[11px] uppercase tracking-wide text-slate-500">
            {label}
          </p>
          <p className="text-xl font-semibold text-slate-900 mt-1">
            {value}
          </p>
        </div>
        <div
          className={`h-9 w-9 rounded-full flex items-center justify-center ${accentClasses.iconBg}`}
        >
          <Icon className={`h-5 w-5 ${accentClasses.iconColor}`} />
        </div>
      </div>
    </div>
  );
}

function QuickActionButton({ children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-xs px-3.5 py-2 rounded-full bg-sky-600 text-white font-medium shadow hover:bg-sky-700 active:scale-[0.98] transition"
    >
      {children}
    </button>
  );
}

function ModuleCard({ title, description, actionLabel, icon: Icon, pill, onClick }) {
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

function ActivityItem({ time, text, variant = 'normal' }) {
  const dotColor = variant === 'warning' ? 'bg-amber-400' : 'bg-sky-500';

  return (
    <div className="flex items-start gap-3 text-xs text-slate-700">
      <span className={`mt-1 h-2 w-2 rounded-full ${dotColor}`} />
      <div className="flex flex-col sm:flex-row sm:items-baseline gap-0.5 sm:gap-2">
        <span className="font-semibold text-slate-500">{time}</span>
        <span>{text}</span>
      </div>
    </div>
  );
}

function StatusRow({ icon: Icon, label, value, color }) {
  const colorMap = {
    emerald: 'text-emerald-600',
    amber: 'text-amber-500',
    red: 'text-red-500',
  };

  return (
    <li className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Icon className={`h-4 w-4 ${colorMap[color] || 'text-slate-500'}`} />
        <span className="text-[11px] uppercase tracking-wide text-slate-500">
          {label}
        </span>
      </div>
      <span className="text-xs text-slate-700">{value}</span>
    </li>
  );
}
