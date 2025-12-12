import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { createColumnHelper } from "@tanstack/react-table";
import api from "../../../api/client";
import { useNavigate } from "react-router-dom";

import DataTable from "../../../components/tables/DataTable";
import Button from "../../../components/common/Button";

async function fetchLogs() {
  const res = await api.get("/logs");
  return res.data;
}

export default function AuditLogPage() {
  const navigate = useNavigate();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["logs"],
    queryFn: fetchLogs,
  });

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
          return username && name ? `${username} (${name})` : username || name || "System";
        },
      }),
      ch.accessor("action", {
        header: "Action",
        cell: (info) => info.getValue() || "-",
      }),
      ch.accessor("details", {
        header: "Details",
        cell: (info) => (
          <div className="max-w-[400px] whitespace-normal break-words">
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
          <h1 className="text-xl font-semibold text-slate-900">User Audit Logs</h1>
          <p className="text-xs text-slate-500">
            Login attempts, user changes, status updates, etc.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button type="button" variant="outline" onClick={refetch}>
            Refresh
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/admin/users")}
          >
            Back to Users
          </Button>
        </div>
      </header>

      {/* Table */}
      <DataTable
        columns={columns}
        data={data || []}
        isLoading={isLoading}
        error={isError ? true : null}
        emptyText="No logs recorded yet."
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
