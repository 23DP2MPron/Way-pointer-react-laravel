import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';

export default function ManageRoutes() {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');

  const load = () => {
    setLoading(true);
    api.get('/routes?per_page=100')
      .then(r => setRoutes(r.data.data || []))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const deleteRoute = async (id) => {
    if (!confirm('Delete this route? This action cannot be undone.')) return;
    try {
      await api.delete(`/routes/${id}`);
      setMsg('Route deleted successfully!');
      load();
      setTimeout(() => setMsg(''), 3000);
    } catch (err) {
      setMsg(err.response?.data?.message || 'Error deleting route');
    }
  };

  const togglePublish = async (route) => {
    try {
      await api.put(`/routes/${route.id}`, {
        is_published: !route.is_published
      });
      setMsg(`Route ${!route.is_published ? 'published' : 'unpublished'} successfully!`);
      load();
      setTimeout(() => setMsg(''), 3000);
    } catch (err) {
      setMsg(err.response?.data?.message || 'Error updating route');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-display font-bold mb-8">Manage Routes</h1>

      {msg && (
        <div className={`mb-6 p-4 rounded-lg ${msg.includes('Error') ? 'bg-red-50 dark:bg-red-900/30 text-red-600' : 'bg-green-50 dark:bg-green-900/30 text-green-600'}`}>
          {msg}
        </div>
      )}

      {loading ? (
        <p className="text-gray-500 text-center py-8">Loading routes...</p>
      ) : routes.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No routes yet.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {routes.map(route => (
            <div key={route.id} className="card p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-lg">{route.title}</h3>
                    {route.is_published ? (
                      <span className="text-xs px-2 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
                        Published
                      </span>
                    ) : (
                      <span className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                        Draft
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-2 line-clamp-2 break-words">
                    {route.description || 'No description'}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>👤 {route.user?.name || 'Unknown'}</span>
                    {route.city && route.country && (
                      <span>📍 {route.city}, {route.country}</span>
                    )}
                    {route.duration_days && (
                      <span>📅 {route.duration_days} days</span>
                    )}
                    <span>👁️ {route.view_count || 0} views</span>
                    {route.reviews_avg_rating && (
                      <span>⭐ {parseFloat(route.reviews_avg_rating).toFixed(1)} ({route.reviews_count})</span>
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-2 shrink-0">
                  <Link 
                    to={`/routes/${route.id}`}
                    className="btn-secondary text-xs px-3 py-1.5 text-center"
                  >
                    View
                  </Link>
                  <Link 
                    to={`/routes/${route.id}/edit`}
                    className="btn-secondary text-xs px-3 py-1.5 text-center"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => togglePublish(route)}
                    className="text-xs px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100 transition-colors"
                  >
                    {route.is_published ? 'Unpublish' : 'Publish'}
                  </button>
                  <button
                    onClick={() => deleteRoute(route.id)}
                    className="text-xs px-3 py-1.5 rounded-lg bg-red-50 dark:bg-red-900/30 text-red-600 hover:bg-red-100 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
