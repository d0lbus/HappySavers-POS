// src/components/layout/ManagerLayout.jsx
import React from "react";
import AppLayout from "./AppLayout";
import { navConfig } from "../../config/navConfig";
import { useAuthStore } from "../../store/authStore";

export default function ManagerLayout() {
  const { user } = useAuthStore();
  return <AppLayout role="Manager" navItems={navConfig.Manager} user={user} />;
}
