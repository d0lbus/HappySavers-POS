import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/Auth/LoginPage';
import UsersPage from './pages/Admin/UsersPage';
import AuditLogPage from './pages/Admin/AuditLogPage';
import DashboardPage from './pages/Dashboard/DashboardPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        {/* Admin-only routes */}
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute roles={['Admin']}>
              <UsersPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/logs"
          element={
            <ProtectedRoute roles={['Admin']}>
              <AuditLogPage />
            </ProtectedRoute>
          }
        />

        {/* default route */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
