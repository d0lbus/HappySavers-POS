import { useEffect, useState } from 'react';
import api from '../api/client';

export default function UserForm({ mode, user, onClose, onSuccess }) {
  const isEdit = mode === 'edit';

  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [roleId, setRoleId] = useState('');
  const [status, setStatus] = useState('active');
  const [password, setPassword] = useState('');
  const [pin, setPin] = useState('');
  const [roles, setRoles] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // you can replace this with a proper endpoint /roles
    const loadRoles = async () => {
      try {
        const res = await api.get('/roles'); // create this later in backend
        setRoles(res.data);
      } catch (err) {
        console.error(err);
        setRoles([
          { id: 1, name: 'Admin' },
          { id: 2, name: 'Cashier' },
          { id: 3, name: 'Manager' },
        ]);
      }
    };

    loadRoles();
  }, []);

  useEffect(() => {
    if (isEdit && user) {
      setName(user.name || '');
      setUsername(user.username || '');
      setRoleId(user.roleId || '');
      setStatus(user.status || 'active');
    } else {
      setName('');
      setUsername('');
      setRoleId('');
      setStatus('active');
      setPassword('');
      setPin('');
    }
  }, [isEdit, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      if (isEdit) {
        await api.put(`/users/${user.id}`, {
          name,
          roleId,
          status,
        });
      } else {
        await api.post('/users', {
          name,
          username,
          password,
          pin,
          roleId,
          status,
        });
      }

      onSuccess && onSuccess();
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || 'Failed to save user'
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-20">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">
            {isEdit ? 'Edit User' : 'Create User'}
          </h2>
          <button
            onClick={onClose}
            className="text-sm text-slate-500 hover:text-slate-800"
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="mb-2 text-sm text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs mb-1">Name</label>
            <input
              className="w-full border rounded px-3 py-2 text-sm"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-xs mb-1">Username</label>
            <input
              className="w-full border rounded px-3 py-2 text-sm"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={isEdit}
            />
          </div>

          {!isEdit && (
            <>
              <div>
                <label className="block text-xs mb-1">Password</label>
                <input
                  type="password"
                  className="w-full border rounded px-3 py-2 text-sm"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-xs mb-1">PIN (optional)</label>
                <input
                  type="password"
                  className="w-full border rounded px-3 py-2 text-sm"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  minLength={4}
                  maxLength={6}
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-xs mb-1">Role</label>
            <select
              className="w-full border rounded px-3 py-2 text-sm"
              value={roleId}
              onChange={(e) => setRoleId(e.target.value)}
              required
            >
              <option value="">Select role</option>
              {roles.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs mb-1">Status</label>
            <select
              className="w-full border rounded px-3 py-2 text-sm"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div className="flex justify-end space-x-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1 text-sm border rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-3 py-1 text-sm bg-slate-800 text-white rounded"
            >
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
