// src/pages/Dashboard/ManagerDashboard.jsx
export default function ManagerDashboard() {
  return (
    <div className="space-y-6">
      {/* KPIs */}
      <section>
        <h2 className="text-lg font-semibold mb-3">Manager Overview</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Kpi label="Today’s Sales" value="₱0.00" />
          <Kpi label="Transactions" value="0" />
          <Kpi label="Top Category" value="—" />
          <Kpi label="Low Stock Items" value="9" />
        </div>
      </section>

      {/* Management sections */}
      <section className="grid gap-4 md:grid-cols-2">
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="font-semibold text-slate-800 mb-2 text-sm">
            Sales & Performance
          </h3>
          <p className="text-xs text-slate-600 mb-2">
            Later: attach charts for daily sales, hourly peaks, and cashier performance.
          </p>
          <ul className="space-y-1 text-xs text-slate-600">
            <li>• Today vs yesterday: —</li>
            <li>• Top 5 products: —</li>
            <li>• Avg. basket size: —</li>
          </ul>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="font-semibold text-slate-800 mb-2 text-sm">
            Team & Shifts
          </h3>
          <p className="text-xs text-slate-600 mb-2">
            Monitor which cashiers are on duty and shift discrepancies.
          </p>
          <ul className="space-y-1 text-xs text-slate-600">
            <li>• Active cashiers: 0</li>
            <li>• Pending shift close: 0</li>
            <li>• Variance alerts: 0</li>
          </ul>
        </div>
      </section>
    </div>
  );
}

function Kpi({ label, value }) {
  return (
    <div className="bg-white rounded-xl shadow p-4 border border-slate-100">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="text-xl font-semibold text-slate-900 mt-1">{value}</p>
    </div>
  );
}
