import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../api/axios';

export default function MyRoutes() {
  const { t } = useTranslation();
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    api.get('/my-routes')
      .then(r => setRoutes(r.data.data || []))
      .catch(error => {
        console.error('Error loading routes:', error);
        setRoutes([]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const deleteRoute = async (id) => {
    if (!confirm(t('routes.deleteConfirm'))) return;
    await api.delete(`/routes/${id}`);
    load();
  };

  if (loading) return <div className="text-center py-20 text-gray-500">{t('common.loading')}</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-display font-bold">{t('routes.myRoutes')}</h1>
        <Link to="/routes/create" className="btn-primary">{t('routes.newRoute')}</Link>
      </div>
      {routes.length === 0 ? (
        <p className="text-gray-500 text-center py-16">{t('routes.noRoutes')}</p>
      ) : (
        <div className="flex flex-col gap-4">
          {routes.map(r => (
            <div key={r.id} className="card p-5 flex items-center justify-between gap-4">
              <div>
                <h3 className="font-display font-semibold">{r.title}</h3>
                <p className="text-sm text-gray-500">
                  {[r.city, r.country].filter(Boolean).join(', ')}
                  {r.city || r.country ? ' · ' : ''}
                  {r.is_published ? t('routes.published') : t('routes.draft')}
                </p>
                {r.reviews_avg_rating && (
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-yellow-500 text-sm">★</span>
                    <span className="text-sm font-semibold">{parseFloat(r.reviews_avg_rating).toFixed(1)}</span>
                    <span className="text-xs text-gray-500">({r.reviews_count} reviews)</span>
                  </div>
                )}
              </div>
              <div className="flex gap-2 shrink-0">
                <Link to={`/routes/${r.id}`} className="btn-secondary text-xs px-3 py-1.5">{t('routes.view')}</Link>
                <Link to={`/routes/${r.id}/edit`} className="btn-secondary text-xs px-3 py-1.5">{t('routes.edit')}</Link>
                <button onClick={() => deleteRoute(r.id)}
                  className="text-xs px-3 py-1.5 rounded-lg bg-red-50 dark:bg-red-900/30 text-red-600 hover:bg-red-100 transition-colors">
                  {t('routes.delete')}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}