import { useQuery } from '@tanstack/react-query';
import api from '../../../api/client';
import { useNavigate } from 'react-router-dom';

async function fetchLogs() {
  const res = await api.get('/logs');
  return res.data;
}

export default function AuditLogPage() {
  const navigate = useNavigate();
  const { data, isLoading, isError } = useQuery({
    queryKey: ['logs'],
    queryFn: fetchLogs,
  });

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="bg-white shadow px-6 py-3 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">User Audit Logs</h1>
          <p className="text-xs text-slate-500">
            Login attempts, user changes, status updates, etc.
          </p>
        </div>
        <button
          className="text-sm px-3 py-1 rounded border"
          onClick={() => navigate('/admin/users')}
        >
          Back to Users
        </button>
      </header>

      <main className="p-6">
        {isLoading && <p>Loading logs...</p>}
        {isError && <p>Error loading logs.</p>}

        {!isLoading && !isError && (
          <div className="bg-white rounded-lg shadow p-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="py-2">Time</th>
                  <th>User</th>
                  <th>Action</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                {data?.map((log) => (
                  <tr key={log.id} className="border-b last:border-0 align-top">
                    <td className="py-2 whitespace-nowrap">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                    <td className="whitespace-nowrap">
                      {log.user
                        ? `${log.user.username} (${log.user.name})`
                        : 'System'}
                    </td>
                    <td className="whitespace-nowrap">{log.action}</td>
                    <td className="max-w-[400px]">
                      {log.details || ''}
                    </td>
                  </tr>
                ))}

                {data?.length === 0 && (
                  <tr>
                    <td
                      colSpan={4}
                      className="py-4 text-center text-slate-500"
                    >
                      No logs recorded yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
