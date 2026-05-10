import { useEffect, useState } from 'react';
import api from '../../api/axios';

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    api.get('/users').then(r => setUsers(r.data.data || [])).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const toggleRole = async (user) => {
    await api.put(`/users/${user.id}`, { role: user.role === 'admin' ? 'user' : 'admin' });
    load();
  };

  const del = async (id) => {
    if (!confirm('Delete this user?')) return;
    await api.delete(`/users/${id}`);
    load();
  };

  if (loading) return <div className="text-center py-20 text-gray-500">Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-display font-bold mb-8">Manage Users</h1>
      <div className="flex flex-col gap-3">
        {users.length === 0 && <p className="text-gray-500 text-center py-8">No users found.</p>}
        {users.map(u => (
          <div key={u.id} className="card p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-green-600 dark:bg-teal-500 text-white flex items-center justify-center font-bold text-sm shrink-0">
                {u.name?.[0]?.toUpperCase()}
              </div>
              <div>
                <p className="font-semibold">{u.name}</p>
                <p className="text-sm text-gray-500">
                  {u.email} ·{' '}
                  <span className={u.role === 'admin' ? 'text-green-600 dark:text-teal-400 font-medium' : 'text-gray-400'}>
                    {u.role}
                  </span>
                </p>
              </div>
            </div>
            <div className="flex gap-2 shrink-0">
              <button onClick={() => toggleRole(u)} className="btn-secondary text-xs px-3 py-1.5">
                {u.role === 'admin' ? 'Demote' : 'Make Admin'}
              </button>
              <button onClick={() => del(u.id)} className="text-xs px-3 py-1.5 rounded-lg bg-red-50 dark:bg-red-900/30 text-red-600 hover:bg-red-100 transition-colors">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}