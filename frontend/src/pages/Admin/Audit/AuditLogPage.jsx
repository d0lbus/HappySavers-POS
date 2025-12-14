// src/pages/Admin/Logs/AuditLogPage.jsx

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { createColumnHelper } from "@tanstack/react-table";
import { useNavigate } from "react-router-dom";

import api from "../../../api/client";
import DataTable from "../../../components/tables/DataTable";
import Button from "../../../components/common/Button";
import Tabs from "../../../components/common/Tabs";

/* -------------------------
   Fetch logs
------------------------- */
async function fetchLogs() {
  const res = await api.get("/logs");
  return res.data;
}

/* -------------------------
   Categorization helper
------------------------- */
function categorizeLogs(logs, tab) {
  if (!Array.isArray(logs)) return [];

  if (tab === "all") return logs;

  return logs.filter((log) => {
    const action = String(log.action || "").toUpperCase();

    if (tab === "auth") {
      return (
        action.startsWith("LOGIN") ||
        action.startsWith("LOGOUT") ||
        action.startsWith("AUTH")
      );
    }

    if (tab === "users") {
      return action.startsWith("USER") || action.startsWith("ROLE");
    }

    if (tab === "products") {
      return action.startsWith("PRODUCT");
    }

    // ✅ NEW: Promotions
    if (tab === "promotions") {
      return action.startsWith("PROMOTION");
    }

    if (tab === "system") {
      return (
        !action.startsWith("LOGIN") &&
        !action.startsWith("LOGOUT") &&
        !action.startsWith("AUTH") &&
        !action.startsWith("USER") &&
        !action.startsWith("ROLE") &&
        !action.startsWith("PRODUCT") &&
        !action.startsWith("PROMOTION")
      );
    }

    return true;
  });
}

export default function AuditLogPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("all");

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["logs"],
    queryFn: fetchLogs,
  });

  const filteredLogs = useMemo(() => {
    return categorizeLogs(data || [], tab);
  }, [data, tab]);

  const ch = createColumnHelper();

  const columns = useMemo(() => {
    return [
      ch.accessor("createdAt", {
        header: "Time",
        cell: (info) => {
          const v = info.getValue();
          if (!v) return "-";
          const d = new Date(v);
          return Number.isNaN(d.getTime()) ? String(v) : d.toLocaleString();
        },
      }),
      ch.accessor("user", {
        header: "User",
        cell: (info) => {
          const u = info.getValue();
          if (!u) return "System";
          const username = u.username ?? "";
          const name = u.name ?? "";
          return username && name
            ? `${username} (${name})`
            : username || name || "System";
        },
      }),
      ch.accessor("action", {
        header: "Action",
        cell: (info) => info.getValue() || "-",
      }),
      ch.accessor("details", {
        header: "Details",
        cell: (info) => (
          <div className="max-w-[420px] whitespace-normal break-words">
            {info.getValue() || ""}
          </div>
        ),
      }),
    ];
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Audit Logs</h1>
          <p className="text-xs text-slate-500">
            Authentication, user activity, product and promotion changes, and system events.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={refetch}>
            Refresh
          </Button>

          <Button variant="outline" onClick={() => navigate("/admin/users")}>
            Back to Users
          </Button>
        </div>
      </header>

      {/* Tabs */}
      <Tabs
        value={tab}
        onChange={setTab}
        tabs={[
          { label: "All", value: "all" },
          { label: "Authentication", value: "auth" },
          { label: "User Management", value: "users" },
          { label: "Products", value: "products" },
          { label: "Promotions", value: "promotions" }, // ✅ NEW
          { label: "System", value: "system" },
        ]}
      />

      {/* Table */}
      <DataTable
        columns={columns}
        data={filteredLogs}
        isLoading={isLoading}
        error={isError ? true : null}
        emptyText="No logs found for this category."
        toolbar={{
          showSearch: true,
          searchPlaceholder: "Search logs…",
          showColumnToggle: true,
          showPageSize: true,
        }}
      />
    </div>
  );
}
