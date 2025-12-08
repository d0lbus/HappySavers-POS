import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, loading, error } = useAuthStore();

  const [username, setUsername] = useState('');
  const [usePin, setUsePin] = useState(false);
  const [password, setPassword] = useState('');
  const [pin, setPin] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const success = await login({
      username,
      password: usePin ? undefined : password,
      pin: usePin ? pin : undefined,
    });

    if (success) {
        navigate('/dashboard');  
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-semibold mb-4 text-center">
          HappySavers POS – Login
        </h1>

        {error && (
          <div className="mb-3 text-red-600 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Username</label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2 text-sm"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="flex items-center justify-between text-sm">
            <span>Login using:</span>
            <div className="space-x-3">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  checked={!usePin}
                  onChange={() => setUsePin(false)}
                />
                <span className="ml-1">Password</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  checked={usePin}
                  onChange={() => setUsePin(true)}
                />
                <span className="ml-1">PIN</span>
              </label>
            </div>
          </div>

          {!usePin && (
            <div>
              <label className="block text-sm mb-1">Password</label>
              <input
                type="password"
                className="w-full border rounded px-3 py-2 text-sm"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          )}

          {usePin && (
            <div>
              <label className="block text-sm mb-1">PIN</label>
              <input
                type="password"
                className="w-full border rounded px-3 py-2 text-sm"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                minLength={4}
                maxLength={6}
                required
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-slate-800 text-white py-2 rounded text-sm font-medium hover:bg-slate-900 disabled:opacity-60"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}
