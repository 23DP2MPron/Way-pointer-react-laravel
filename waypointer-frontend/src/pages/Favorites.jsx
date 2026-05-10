import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../api/axios';
import PlaceCard from '../components/PlaceCard';

export default function Favorites() {
  const { t } = useTranslation();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/favorites')
      .then(r => setFavorites(r.data))
      .catch(error => {
        console.error('Error loading favorites:', error);
        setFavorites([]);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center py-20 text-gray-500">{t('common.loading')}</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-display font-bold mb-8">{t('favorites.title')}</h1>
      {favorites.length === 0 ? (
        <p className="text-gray-500 text-center py-16">{t('favorites.noFavorites')}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map(fav => fav.target_detail && (
            <PlaceCard key={fav.id} place={fav.target_detail} type={fav.target_type} />
          ))}
        </div>
      )}
    </div>
  );
}