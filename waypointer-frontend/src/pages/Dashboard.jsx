import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

export default function Dashboard() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [stats, setStats] = useState({ routes: 0, favorites: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    Promise.all([
      api.get('/my-routes'),
      api.get('/favorites'),
    ]).then(([routes, favs]) => {
      setStats({
        routes: routes.data.total || 0,
        favorites: Array.isArray(favs.data) ? favs.data.length : 0,
      });
    }).catch((error) => {
      console.error('Error loading dashboard data:', error);
    }).finally(() => {
      setLoading(false);
    });
  }, [user]);

  if (!user) {
    return <div className="text-center py-20">{t('common.loading')}</div>;
  }

  if (loading) {
    return <div className="text-center py-20">{t('common.loading')}</div>;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-display font-bold mb-2">{t('dashboard.welcome')}, {user.name}</h1>
      <p className="text-gray-500 mb-8">{t('dashboard.overview')}</p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        {[
          { label: t('dashboard.myRoutes'), value: stats.routes, icon: '🗺️', href: '/my-routes' },
          { label: t('dashboard.favorites'), value: stats.favorites, icon: '❤️', href: '/favorites' },
          { label: t('dashboard.explore'), value: '∞', icon: '🌍', href: '/explore' },
        ].map(s => (
          <Link key={s.label} to={s.href} className="card p-6 flex items-center gap-4 hover:border-green-300 dark:hover:border-teal-600">
            <span className="text-3xl">{s.icon}</span>
            <div>
              <div className="text-2xl font-display font-bold">{s.value}</div>
              <div className="text-sm text-gray-500">{s.label}</div>
            </div>
          </Link>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        <Link to="/routes/create" className="btn-primary">{t('dashboard.createNewRoute')}</Link>
        <Link to="/explore" className="btn-secondary">{t('dashboard.explorePlaces')}</Link>
      </div>
    </div>
  );
}