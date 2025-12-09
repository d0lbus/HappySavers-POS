// src/pages/Dashboard/DashboardPage.jsx
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

import AdminDashboard from './AdminDashboard';
import CashierDashboard from './CashierDashboard';
import ManagerDashboard from './ManagerDashboard';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  if (!user) return null;

  let DashboardComponent;

  switch (user.roleName) {
    case 'Admin':
      DashboardComponent = AdminDashboard;
      break;
    case 'Cashier':
      DashboardComponent = CashierDashboard;
      break;
    case 'Manager':
      DashboardComponent = ManagerDashboard;
      break;
  }

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

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
          type="button"
          className="text-sm px-3 py-1.5 rounded border border-slate-300 bg-white hover:bg-slate-100 transition"
          onClick={handleLogout}
        >
          Logout
        </button>
      </header>

      <main className="p-6">
        <DashboardComponent />
      </main>
    </div>
  );
}
