// src/components/layout/CashierLayout.jsx
import React from "react";
import AppLayout from "./AppLayout";
import { navConfig } from "../../config/navConfig";
import { useAuthStore } from "../../store/authStore";

export default function CashierLayout() {
  const { user } = useAuthStore();
  return <AppLayout role="Cashier" navItems={navConfig.Cashier} user={user} />;
}
