// src/pages/Admin/Users/UsersPage.jsx

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { createColumnHelper } from "@tanstack/react-table";
import api from "../../../api/client";

import DataTable from "../../../components/tables/DataTable";

// Fetch all users
async function fetchUsers() {
  const res = await api.get("/users");
  return res.data;
}

// OPTIONAL: if you have /roles endpoint, this will auto-populate the Role dropdown in the modal
async function fetchRoles() {
  const res = await api.get("/roles");
  return res.data;
}

export default function UsersPage() {
  const {
    data: users,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });

  const {
    data: roles,
    isLoading: rolesLoading,
    isError: rolesError,
  } = useQuery({
    queryKey: ["roles"],
    queryFn: fetchRoles,
    retry: 0,
    staleTime: 5 * 60 * 1000,
  });

  const [mode, setMode] = useState("create"); // create | edit
  const [selectedUser, setSelectedUser] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // Open modal for creating a user
  const openCreate = () => {
    setMode("create");
    setSelectedUser(null);
    setShowForm(true);
  };

  // Open modal for editing a user
  const openEdit = (user) => {
    setMode("edit");
    setSelectedUser(user);
    setShowForm(true);
  };

  // Toggle active/inactive
  const handleStatusChange = async (user) => {
    try {
      const newStatus = user.status === "active" ? "inactive" : "active";
      await api.patch(`/users/${user.id}/status`, { status: newStatus });
      refetch();
    } catch (err) {
      console.error(err);
      alert("Failed to update status");
    }
  };

  // Submit handler (create or edit)
  const handleSubmit = async (formData) => {
    try {
      if (mode === "create") {
        await api.post("/users", formData);
      } else {
        await api.patch(`/users/${selectedUser.id}`, formData);
      }
      setShowForm(false);
      refetch();
    } catch (err) {
      console.error(err);
      alert("Failed to save user");
    }
  };

  const ch = createColumnHelper();

  const columns = useMemo(() => {
    return [
      ch.accessor("id", {
        header: "ID",
        cell: (info) => info.getValue(),
      }),
      ch.accessor("name", {
        header: "Name",
        cell: (info) => info.getValue(),
      }),
      ch.accessor("username", {
        header: "Username",
        cell: (info) => info.getValue(),
      }),
      ch.accessor("role", {
        header: "Role",
        cell: (info) => {
          const row = info.row.original;
          return row.role?.name || row.roleId || "-";
        },
      }),
      ch.accessor("status", {
        header: "Status",
        cell: (info) => {
          const status = info.getValue();
          const isActive = status === "active";
          return (
            <span
              className={[
                "inline-flex items-center rounded px-2 py-1 text-xs font-medium",
                isActive
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-red-100 text-red-700",
              ].join(" ")}
            >
              {status}
            </span>
          );
        },
      }),
      ch.display({
        id: "actions",
        header: () => <div className="text-right">Actions</div>,
        cell: (info) => {
          const u = info.row.original;

          return (
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  openEdit(u);
                }}
                className="text-xs px-2 py-1 border rounded hover:bg-slate-50 dark:hover:bg-gray-900"
              >
                Edit
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleStatusChange(u);
                }}
                className="text-xs px-2 py-1 border rounded hover:bg-slate-50 dark:hover:bg-gray-900"
              >
                {u.status === "active" ? "Deactivate" : "Activate"}
              </button>
            </div>
          );
        },
      }),
    ];
  }, [refetch]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-800 dark:text-gray-100">
          User Management
        </h1>

        <button
          className="px-4 py-2 text-sm font-medium rounded-lg bg-emerald-600 text-white shadow hover:bg-emerald-700 transition"
          onClick={openCreate}
        >
          + New User
        </button>
      </div>

      {/* DataTable */}
      <DataTable
        title={null}
        subtitle={null}
        columns={columns}
        data={users || []}
        isLoading={isLoading}
        error={isError ? true : null}
        emptyText="No users found."
        toolbar={{
          showSearch: true,
          searchPlaceholder: "Search users…",
          showColumnToggle: true,
          showPageSize: true,
          rightSlot: (
            <button
              type="button"
              onClick={refetch}
              className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-200 dark:hover:bg-gray-900"
            >
              Refresh
            </button>
          ),
        }}
        onRowClick={(row) => openEdit(row)}
      />

      {/* Modal Form */}
      {showForm && (
        <UserFormModal
          mode={mode}
          user={selectedUser}
          roles={Array.isArray(roles) ? roles : []}
          rolesLoading={rolesLoading}
          rolesError={rolesError}
          onClose={() => setShowForm(false)}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}

/* -----------------------------------------------------------
   FORM MODAL COMPONENT (Embedded)
----------------------------------------------------------- */

function UserFormModal({
  mode,
  user,
  roles,
  rolesLoading,
  rolesError,
  onClose,
  onSubmit,
}) {
  const [form, setForm] = useState({
    name: user?.name || "",
    username: user?.username || "",
    password: "",
    pin: "",
    roleId: user?.roleId || "",
  });

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    const payload = { ...form };

    // Optional cleanup
    if (mode === "edit" && !payload.password) delete payload.password;
    if (!payload.pin) delete payload.pin;

    onSubmit(payload);
  };

  const canUseRoleSelect = Array.isArray(roles) && roles.length > 0 && !rolesError;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[999] p-4">
      <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-6 dark:bg-gray-950 dark:border dark:border-gray-800">
        <div className="flex items-start justify-between gap-3">
          <h2 className="text-lg font-semibold mb-4 text-slate-900 dark:text-gray-100">
            {mode === "create" ? "Create New User" : "Edit User"}
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="text-sm px-2 py-1 rounded border border-slate-200 hover:bg-slate-50 dark:border-gray-800 dark:hover:bg-gray-900 dark:text-gray-200"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* FORM FIELDS */}
        <div className="space-y-3">
          <InputField
            label="Name"
            value={form.name}
            onChange={(v) => handleChange("name", v)}
          />

          <InputField
            label="Username"
            value={form.username}
            onChange={(v) => handleChange("username", v)}
          />

          <InputField
            label="Password"
            type="password"
            value={form.password}
            onChange={(v) => handleChange("password", v)}
            placeholder={mode === "edit" ? "Leave blank to keep existing" : ""}
          />

          <InputField
            label="PIN"
            type="password"
            value={form.pin}
            onChange={(v) => handleChange("pin", v)}
            placeholder="4-digit PIN"
            maxLength={4}
          />

          {canUseRoleSelect ? (
            <SelectField
              label="Role"
              value={String(form.roleId || "")}
              onChange={(v) => handleChange("roleId", v)}
              options={[
                { value: "", label: "Select a role" },
                ...roles.map((r) => ({
                  value: String(r.id),
                  label: r.name,
                })),
              ]}
              helper={
                rolesLoading
                  ? "Loading roles…"
                  : ""
              }
            />
          ) : (
            <InputField
              label="Role ID"
              value={form.roleId}
              onChange={(v) => handleChange("roleId", v)}
              placeholder={rolesError ? "No /roles endpoint (fallback)" : ""}
            />
          )}
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm rounded-lg border border-slate-300 hover:bg-slate-100 dark:border-gray-800 dark:hover:bg-gray-900 dark:text-gray-200"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

/* -----------------------------------------------------------
   REUSABLE INPUT COMPONENTS
----------------------------------------------------------- */

function InputField({
  label,
  value,
  onChange,
  type = "text",
  placeholder = "",
  maxLength,
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1 dark:text-gray-200">
        {label}
      </label>
      <input
        type={type}
        maxLength={maxLength}
        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-200 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-100"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}

function SelectField({ label, value, onChange, options, helper }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1 dark:text-gray-200">
        {label}
      </label>

      <select
        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-200 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-100"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>

      {helper ? (
        <p className="mt-1 text-xs text-slate-500 dark:text-gray-400">{helper}</p>
      ) : null}
    </div>
  );
}
