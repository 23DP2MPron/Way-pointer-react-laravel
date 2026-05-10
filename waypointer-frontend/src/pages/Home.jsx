import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import PlaceCard from '../components/PlaceCard';

export default function Home() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [places, setPlaces] = useState([]);
  const [routes, setRoutes] = useState([]);

  useEffect(() => {
    api.get('/places?per_page=6&random=1').then(r => setPlaces(r.data.data || []));
    api.get('/routes?per_page=3').then(r => setRoutes(r.data.data || []));
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-green-50 via-white to-teal-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 py-24 px-4">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(134,239,172,0.15),transparent_60%)] pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative">
          <span className="inline-block bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-semibold px-3 py-1 rounded-full mb-4 tracking-wider uppercase">
            {t('home.badge')}
          </span>
          <h1 className="text-5xl sm:text-7xl font-display font-extrabold mb-6 leading-[1.05] tracking-tight">
            {t('home.title')}<br />
            <span className="text-green-600 dark:text-teal-400">{t('home.titleHighlight')}</span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-xl mx-auto mb-8">
            {t('home.subtitle')}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link to="/explore" className="btn-primary text-base px-8 py-3">{t('home.explorePlaces')}</Link>
            {!user && <Link to="/register" className="btn-secondary text-base px-8 py-3">{t('home.getStarted')}</Link>}
          </div>
        </div>
      </section>

      {/* Top Places */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-display font-bold text-gray-600 dark:text-teal-400">{t('home.topRated')}</h2>
          <Link to="/explore" className="text-sm text-green-600 dark:text-teal-400 font-medium hover:underline">{t('home.viewAll')}</Link>
        </div>
        {places.length === 0 ? (
          <p className="text-gray-500">{t('home.noPlaces')}</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {places.map(p => <PlaceCard key={p.id} place={p} />)}
          </div>
        )}
      </section>

      {/* Featured Routes */}
      {routes.length > 0 && (
        <section className="bg-gray-50 dark:bg-gray-900/50 py-16">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-display font-bold text-gray-600 dark:text-teal-400">{t('home.featuredRoutes')}</h2>
              <Link to="/explore" className="text-sm text-green-600 dark:text-teal-400 font-medium hover:underline">{t('home.browseRoutes')}</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {routes.map(r => (
                <Link key={r.id} to={`/routes/${r.id}`} className="card p-5 group">
                  <h3 className="font-display font-semibold group-hover:text-green-600 dark:group-hover:text-teal-400 transition-colors mb-1">{r.title}</h3>
                  <p className="text-xs text-gray-500 mb-2">{t('home.by')} {r.user?.name}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">{r.description}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}