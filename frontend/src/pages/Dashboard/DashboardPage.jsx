import { useAuthStore } from '../../store/authStore';
import { useNavigate } from 'react-router-dom';

function AdminDashboardSection() {
  const navigate = useNavigate();

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold mb-2">Admin Overview</h2>
      <div className="grid gap-3 md:grid-cols-2">
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="font-medium mb-1">User Management</h3>
          <p className="text-xs text-slate-500 mb-2">
            Create, edit, and deactivate users for the POS.
          </p>
          <button
            className="text-xs px-3 py-1 rounded bg-slate-800 text-white"
            onClick={() => navigate('/admin/users')}
          >
            Go to Users
          </button>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="font-medium mb-1">Audit Logs</h3>
          <p className="text-xs text-slate-500 mb-2">
            Review login attempts and user-related actions.
          </p>
          <button
            className="text-xs px-3 py-1 rounded bg-slate-800 text-white"
            onClick={() => navigate('/admin/logs')}
          >
            View Logs
          </button>
        </div>
      </div>
    </div>
  );
}

function CashierDashboardSection() {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">Cashier Dashboard</h2>
      <p className="text-sm text-slate-500">
        This is where quick access to the POS screen and today&apos;s shift
        summary will appear. We&apos;ll hook this up in the POS phase.
      </p>
    </div>
  );
}

function ManagerDashboardSection() {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">Manager Dashboard</h2>
      <p className="text-sm text-slate-500">
        This area will show sales summaries, inventory alerts, and staff
        activity once reporting is implemented.
      </p>
    </div>
  );
}

export default function DashboardPage() {
  const { user, logout } = useAuthStore();

  if (!user) return null;

  let Section = null;

  if (user.roleName === 'Admin') Section = AdminDashboardSection;
  else if (user.roleName === 'Cashier') Section = CashierDashboardSection;
  else if (user.roleName === 'Manager') Section = ManagerDashboardSection;
  else Section = () => (
    <p className="text-sm text-slate-500">
      No dashboard configured for this role yet.
    </p>
  );

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="bg-white shadow px-6 py-3 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Dashboard</h1>
          <p className="text-xs text-slate-500">
            Logged in as {user.username} ({user.roleName})
          </p>
        </div>
        <button
          className="text-sm px-3 py-1 rounded border"
          onClick={logout}
        >
          Logout
        </button>
      </header>

      <main className="p-6">
        <Section />
      </main>
    </div>
  );
}
