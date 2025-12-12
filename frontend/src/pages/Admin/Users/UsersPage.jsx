// src/pages/Admin/Users/UsersPage.jsx

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "../../../api/client";

// Fetch all users
async function fetchUsers() {
  const res = await api.get("/users");
  return res.data;
}

export default function UsersPage() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
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

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-800">User Management</h1>

        <button
          className="px-4 py-2 text-sm font-medium rounded-lg bg-emerald-600 text-white shadow hover:bg-emerald-700 transition"
          onClick={openCreate}
        >
          + New User
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
        {isLoading && <p className="text-sm text-slate-500">Loading users…</p>}
        {isError && (
          <p className="text-sm text-red-600">Error loading users.</p>
        )}

        {!isLoading && !isError && (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-slate-600">
                <th className="py-2">ID</th>
                <th>Name</th>
                <th>Username</th>
                <th>Role</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {data?.map((u) => (
                <tr key={u.id} className="border-b last:border-0">
                  <td className="py-2">{u.id}</td>
                  <td>{u.name}</td>
                  <td>{u.username}</td>
                  <td>{u.role?.name || u.roleId}</td>

                  <td>
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        u.status === "active"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {u.status}
                    </span>
                  </td>

                  <td className="text-right space-x-2">
                    <button
                      onClick={() => openEdit(u)}
                      className="text-xs px-2 py-1 border rounded hover:bg-slate-50"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleStatusChange(u)}
                      className="text-xs px-2 py-1 border rounded hover:bg-slate-50"
                    >
                      {u.status === "active" ? "Deactivate" : "Activate"}
                    </button>
                  </td>
                </tr>
              ))}

              {data?.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="py-4 text-center text-slate-500"
                  >
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal Form */}
      {showForm && (
        <UserFormModal
          mode={mode}
          user={selectedUser}
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

function UserFormModal({ mode, user, onClose, onSubmit }) {
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
    onSubmit(form);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[999]">
      <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-6">
        <h2 className="text-lg font-semibold mb-4">
          {mode === "create" ? "Create New User" : "Edit User"}
        </h2>

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

          <InputField
            label="Role ID"
            value={form.roleId}
            onChange={(v) => handleChange("roleId", v)}
          />
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm rounded-lg border border-slate-300 hover:bg-slate-100"
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
   REUSABLE INPUT COMPONENT
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
      <label className="block text-sm font-medium text-slate-700 mb-1">
        {label}
      </label>
      <input
        type={type}
        maxLength={maxLength}
        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-200"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}
