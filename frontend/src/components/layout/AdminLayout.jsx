// src/components/layout/AdminLayout.jsx
import React from "react";
import AppLayout from "./AppLayout";
import { navConfig } from "../../config/navConfig";
import { useAuthStore } from "../../store/authStore";

export default function AdminLayout() {
  const { user } = useAuthStore();
  return <AppLayout role="Admin" navItems={navConfig.Admin} user={user} />;
}
