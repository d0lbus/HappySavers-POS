import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

export default function RoleRedirect() {
  const { user } = useAuthStore();

  if (!user) return <Navigate to="/login" replace />;

  if (user.roleName === "Admin") return <Navigate to="/admin" replace />;
  if (user.roleName === "Manager") return <Navigate to="/manager" replace />;
  if (user.roleName === "Cashier") return <Navigate to="/cashier" replace />;

  return <Navigate to="/login" replace />;
}
