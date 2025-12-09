import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, loading, error, user } = useAuthStore();


  const [username, setUsername] = useState('');
  const [usePin, setUsePin] = useState(true);
  const [password, setPassword] = useState('');
  const [pin, setPin] = useState('');
  const [localError, setLocalError] = useState(null);

  const showError = localError || error;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username.trim()) return setLocalError('Username is required.');
    if (usePin && pin.length !== 4) return setLocalError('Enter a 4-digit PIN.');
    if (!usePin && !password.trim()) return setLocalError('Password is required.');

    setLocalError(null);

    const success = await login({
      username,
      password: usePin ? undefined : password,
      pin: usePin ? pin : undefined,
    });

    if (success) {
      if (user?.roleName === 'Admin') {
        navigate('/admin');
      } else if (user?.roleName === 'Manager') {
        navigate('/manager');
      } else if (user?.roleName === 'Cashier') {
        navigate('/cashier');
      } else {
        navigate('/login'); // fallback if something is weird
      }
    } else {
      setLocalError('Wrong username, password, or PIN.');
    }
  }

  const handlePinKeyPress = (value) => {
    setLocalError(null);
    if (value === 'backspace') return setPin(pin.slice(0, -1));
    if (value === 'clear') return setPin('');
    if (pin.length >= 4) return;
    setPin(pin + value);
  };

  const isSubmitDisabled = () => {
    if (loading) return true;
    if (!username.trim()) return true;
    if (usePin) return pin.length !== 4;
    return password.length === 0;
  };

  return (
    <div className="w-full">
      {/* ERROR */}
      {showError && (
        <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {showError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* USERNAME */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Username
          </label>
          <input
            type="text"
            className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-base outline-none 
                       focus:ring-2 focus:ring-sky-100 focus:border-sky-600"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              setLocalError(null);
            }}
          />
        </div>

        {/* TOGGLE PIN / PASSWORD */}
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs font-medium text-slate-500">Login using</span>

          <div className="inline-flex rounded-full bg-slate-100 p-1 text-sm font-medium">
            <button
              type="button"
              onClick={() => {
                setUsePin(true);
                setPassword('');
                setLocalError(null);
              }}
              className={`px-4 py-1.5 rounded-full transition ${
                usePin ? 'bg-sky-600 text-white shadow-sm' : 'text-slate-700'
              }`}
            >
              PIN
            </button>

            <button
              type="button"
              onClick={() => {
                setUsePin(false);
                setPin('');
                setLocalError(null);
              }}
              className={`px-4 py-1.5 rounded-full transition ${
                !usePin ? 'bg-sky-600 text-white shadow-sm' : 'text-slate-700'
              }`}
            >
              Password
            </button>
          </div>
        </div>

        {/* PIN MODE */}
        {usePin && (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                PIN
              </label>
              <input
                type="password"
                inputMode="numeric"
                maxLength={4}
                className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-2xl 
                           tracking-[0.4em] text-center outline-none focus:ring-2 
                           focus:ring-sky-100 focus:border-sky-600"
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
              />
              <p className="text-xs text-slate-400 mt-1 text-right">4-digit PIN</p>
            </div>

            {/* KEYPAD */}
            <div className="grid grid-cols-3 gap-3">
              {[1,2,3,4,5,6,7,8,9].map((n) => (
                <button
                  key={n}
                  type="button"
                  className="py-3.5 text-lg font-semibold rounded-lg border border-slate-200 
                             bg-slate-50 hover:bg-sky-50 transition"
                  onClick={() => handlePinKeyPress(String(n))}
                >
                  {n}
                </button>
              ))}

              <button
                type="button"
                className="py-3.5 rounded-lg text-sm font-medium border border-slate-200 
                           bg-slate-50 hover:bg-red-50 transition"
                onClick={() => handlePinKeyPress('clear')}
              >
                Clear
              </button>

              <button
                type="button"
                className="py-3.5 text-lg font-semibold rounded-lg border border-slate-200 
                           bg-slate-50 hover:bg-sky-50 transition"
                onClick={() => handlePinKeyPress('0')}
              >
                0
              </button>

              <button
                type="button"
                className="py-3.5 rounded-lg text-sm font-medium border border-slate-200 
                           bg-slate-50 hover:bg-yellow-50 transition"
                onClick={() => handlePinKeyPress('backspace')}
              >
                ⌫
              </button>
            </div>
          </div>
        )}

        {/* PASSWORD MODE */}
        {!usePin && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Password
            </label>
            <input
              type="password"
              className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-base outline-none 
                         focus:ring-2 focus:ring-sky-100 focus:border-sky-600"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        )}

        {/* SUBMIT BUTTON */}
        <button
          type="submit"
          disabled={isSubmitDisabled()}
          className="w-full mt-2 rounded-lg bg-sky-600 text-white py-3 font-semibold 
                     shadow hover:bg-sky-700 disabled:opacity-60 transition"
        >
          {loading ? 'Logging in…' : 'Login'}
        </button>
      </form>
    </div>
  );
}
