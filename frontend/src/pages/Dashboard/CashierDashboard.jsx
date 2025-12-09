// src/pages/Dashboard/CashierDashboard.jsx
import { useNavigate } from 'react-router-dom';

export default function CashierDashboard() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-lg font-semibold mb-2">Cashier Overview</h2>
        <p className="text-sm text-slate-600">
          Start your shift, open the POS screen, and quickly review today&apos;s performance.
        </p>
      </section>

      {/* Quick actions */}
      <section>
        <h3 className="text-sm font-semibold mb-2">Quick Actions</h3>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            className="text-xs px-4 py-2 rounded bg-sky-600 text-white font-medium shadow hover:bg-sky-700 transition"
            onClick={() => navigate('/pos')}
          >
            Open POS Screen
          </button>
          <button
            type="button"
            className="text-xs px-4 py-2 rounded bg-slate-900 text-white font-medium shadow hover:bg-slate-800 transition"
          >
            Start Shift
          </button>
          <button
            type="button"
            className="text-xs px-4 py-2 rounded bg-slate-100 text-slate-800 font-medium border border-slate-200 hover:bg-slate-200 transition"
          >
            Today&apos;s Summary
          </button>
        </div>
      </section>

      {/* Shift & recent transactions – placeholders */}
      <section className="grid gap-4 md:grid-cols-2">
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="font-semibold text-slate-800 mb-2 text-sm">
            Current Shift
          </h3>
          <p className="text-xs text-slate-500 mb-1">Status: Not started</p>
          <p className="text-xs text-slate-500 mb-1">Opening cash: —</p>
          <p className="text-xs text-slate-500">Transactions this shift: 0</p>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="font-semibold text-slate-800 mb-2 text-sm">
            Recent Transactions
          </h3>
          <ul className="space-y-1 text-xs text-slate-600">
            <li>• No transactions yet today.</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
