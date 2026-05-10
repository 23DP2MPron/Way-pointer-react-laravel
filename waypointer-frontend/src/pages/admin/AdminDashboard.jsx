import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ users: 0, places: 0, institutions: 0, routes: 0, reviews: 0 });

  useEffect(() => {
    Promise.all([
      api.get('/users'),
      api.get('/places'),
      api.get('/institutions'),
      api.get('/routes'),
      api.get('/reviews'),
    ]).then(([users, places, institutions, routes, reviews]) => {
      setStats({
        users: users.data.total || 0,
        places: places.data.total || 0,
        institutions: institutions.data.total || 0,
        routes: routes.data.total || 0,
        reviews: reviews.data.total || 0,
      });
    }).catch(() => {});
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-display font-bold mb-8">Admin Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-10">
        {[
          { label: 'Users', value: stats.users, icon: '👤', href: '/admin/users' },
          { label: 'Places', value: stats.places, icon: '📍', href: '/admin/places' },
          { label: 'Institutions', value: stats.institutions, icon: '🏛️', href: '/admin/institutions' },
          { label: 'Routes', value: stats.routes, icon: '🗺️', href: '/admin/routes' },
          { label: 'Reviews', value: stats.reviews, icon: '⭐', href: '/admin/reviews' },
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
        <Link to="/admin/places" className="btn-primary">Manage Places</Link>
        <Link to="/admin/institutions" className="btn-primary">Manage Institutions</Link>
        <Link to="/admin/routes" className="btn-primary">Manage Routes</Link>
        <Link to="/admin/users" className="btn-secondary">Manage Users</Link>
        <Link to="/admin/reviews" className="btn-secondary">Manage Reviews</Link>
      </div>
    </div>
  );
}