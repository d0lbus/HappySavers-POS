import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../../api/client';
import { useAuthStore } from '../../../store/authStore';
import UserForm from '../../../components/UserForm';

async function fetchUsers() {
  const res = await api.get('/users');
  return res.data;
}

export default function UsersPage() {
  const { logout, user } = useAuthStore();
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });

  const [selectedUser, setSelectedUser] = useState(null);
  const [mode, setMode] = useState('create'); // 'create' or 'edit'
  const [showForm, setShowForm] = useState(false);

  const openCreate = () => {
    setSelectedUser(null);
    setMode('create');
    setShowForm(true);
  };

  const openEdit = (u) => {
    setSelectedUser(u);
    setMode('edit');
    setShowForm(true);
  };

  const handleStatusChange = async (u) => {
    const newStatus = u.status === 'active' ? 'inactive' : 'active';
    try {
      await api.patch(`/users/${u.id}/status`, { status: newStatus });
      await refetch();
    } catch (err) {
      console.error(err);
      alert('Failed to update status');
    }
  };

  const handleFormSuccess = async () => {
    setShowForm(false);
    await refetch();
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="bg-white shadow px-6 py-3 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">User Management</h1>
          <p className="text-xs text-slate-500">
            Logged in as {user?.username}
          </p>
        </div>
        <div className="space-x-3">
          <button
            className="text-sm px-3 py-1 rounded bg-slate-800 text-white"
            onClick={openCreate}
          >
            + New User
          </button>
          <button
            className="text-sm px-3 py-1 rounded border"
            onClick={logout}
          >
            Logout
          </button>
        </div>
      </header>

      <main className="p-6">
        {isLoading && <p>Loading users...</p>}
        {isError && <p>Error loading users.</p>}

        {!isLoading && !isError && (
          <div className="bg-white rounded-lg shadow p-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left">
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
                        className={
                          'px-2 py-1 rounded text-xs ' +
                          (u.status === 'active'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700')
                        }
                      >
                        {u.status}
                      </span>
                    </td>
                    <td className="text-right space-x-2">
                      <button
                        className="text-xs px-2 py-1 border rounded"
                        onClick={() => openEdit(u)}
                      >
                        Edit
                      </button>
                      <button
                        className="text-xs px-2 py-1 border rounded"
                        onClick={() => handleStatusChange(u)}
                      >
                        {u.status === 'active' ? 'Deactivate' : 'Activate'}
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
          </div>
        )}
      </main>

      {showForm && (
        <UserForm
          mode={mode}
          user={selectedUser}
          onClose={() => setShowForm(false)}
          onSuccess={handleFormSuccess}
        />
      )}
    </div>
  );
}
