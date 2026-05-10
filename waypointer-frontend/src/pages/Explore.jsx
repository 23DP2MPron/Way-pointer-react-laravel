import { useEffect, useState, useCallback } from 'react';
import { Link, useSearchParams, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../api/axios';
import PlaceCard from '../components/PlaceCard';
import openTripMapService from '../services/openTripMapService';
import nominatimService from '../services/nominatimService';

export default function Explore() {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const { t } = useTranslation();
  
  // Восстанавливаем состояние из sessionStorage при возврате
  const savedState = sessionStorage.getItem('exploreState');
  const initialState = savedState ? JSON.parse(savedState) : {
    tab: searchParams.get('tab') || 'places',
    search: '',
    page: 1
  };
  
  const [tab, setTab] = useState(initialState.tab);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(initialState.search);
  const [page, setPage] = useState(initialState.page);
  const [meta, setMeta] = useState(null);
  const [externalPlaces, setExternalPlaces] = useState([]);
  const [loadingExternal, setLoadingExternal] = useState(false);
  const [showExternalSearch, setShowExternalSearch] = useState(false);

  const handleTabChange = (newTab) => {
    setTab(newTab);
    setPage(1);
  };

  const handleSearchChange = (value) => {
    setSearch(value);
    setPage(1);
  };

  const handleExternalSearch = useCallback(async () => {
    if (!search.trim() || (tab !== 'places' && tab !== 'institutions')) return;
    
    setLoadingExternal(true);
    try {
      // Получаем координаты локации
      const location = await nominatimService.searchLocation(search);
      
      if (location && location.length > 0) {
        const { lat, lon } = location[0];
        
        // Загружаем места из OpenTripMap
        const places = await openTripMapService.getPlacesByRadius(
          parseFloat(lat),
          parseFloat(lon),
          20000, // 20км радиус
          50
        );
        
        // Определяем категории для фильтрации
        let filteredPlaces = places;
        if (tab === 'institutions') {
          // Фильтруем только учреждения (музеи, отели, рестораны, кафе, бары, магазины)
          const institutionKinds = ['museums', 'hotels', 'restaurants', 'cafes', 'bars', 'shops', 'theatres', 'cinemas'];
          filteredPlaces = places.filter(p => {
            const kinds = p.kinds?.toLowerCase() || '';
            return institutionKinds.some(kind => kinds.includes(kind));
          });
        }
        
        // Преобразуем в формат PlaceCard
        const formattedPlaces = filteredPlaces
          .filter(p => p.name)
          .map(p => ({
            id: `external-${p.xid}`,
            name: p.name,
            description: p.kinds?.split(',').join(', ') || (tab === 'institutions' ? 'Institution' : 'Attraction'),
            city: search,
            country: location[0].display_name?.split(',').pop()?.trim() || '',
            rating: p.rate || 0,
            category: p.kinds?.split(',')[0] || (tab === 'institutions' ? 'museum' : 'landmark'),
            latitude: p.point?.lat,
            longitude: p.point?.lon,
            isExternal: true,
            xid: p.xid
          }));
        
        setExternalPlaces(formattedPlaces);
        setShowExternalSearch(true);
      }
    } catch (error) {
      console.error('Error searching external places:', error);
      setExternalPlaces([]);
    } finally {
      setLoadingExternal(false);
    }
  }, [search, tab]);

  const clearExternalSearch = () => {
    setExternalPlaces([]);
    setShowExternalSearch(false);
  };

  useEffect(() => {
    setLoading(true);
    const endpoint = tab === 'places' ? '/places' : tab === 'institutions' ? '/institutions' : '/routes';
    api.get(endpoint, { params: { search, page, per_page: 48 } })
      .then(r => { setData(r.data.data || []); setMeta(r.data); })
      .finally(() => setLoading(false));
  }, [tab, search, page]);

  // Отдельный useEffect для автоматического глобального поиска
  useEffect(() => {
    if ((tab === 'places' || tab === 'institutions') && search.trim().length > 2) {
      const debounceTimer = setTimeout(() => {
        handleExternalSearch();
      }, 800); // Задержка 800мс после ввода
      
      return () => clearTimeout(debounceTimer);
    } else if (search.trim().length <= 2) {
      setExternalPlaces([]);
      setShowExternalSearch(false);
    }
  }, [tab, search, handleExternalSearch]);

  // Прокрутка вверх при изменении страницы
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [page]);

  // Сохраняем состояние при изменении
  useEffect(() => {
    sessionStorage.setItem('exploreState', JSON.stringify({ tab, search, page }));
  }, [tab, search, page]);

  // Восстанавливаем позицию прокрутки при возврате
  useEffect(() => {
    const savedScrollPosition = sessionStorage.getItem('exploreScrollPosition');
    if (savedScrollPosition && !loading) {
      setTimeout(() => {
        window.scrollTo(0, parseInt(savedScrollPosition));
        sessionStorage.removeItem('exploreScrollPosition');
      }, 100);
    }
  }, [loading]);

  // Сохраняем позицию прокрутки перед переходом
  useEffect(() => {
    const handleBeforeUnload = () => {
      sessionStorage.setItem('exploreScrollPosition', window.scrollY.toString());
    };

    // Сохраняем при клике на ссылку
    const links = document.querySelectorAll('a');
    links.forEach(link => {
      link.addEventListener('click', handleBeforeUnload);
    });

    return () => {
      links.forEach(link => {
        link.removeEventListener('click', handleBeforeUnload);
      });
    };
  }, [data]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-display font-bold mb-6">{t('explore.title')}</h1>

      <div className="flex gap-2 mb-6">
        {['places', 'institutions', 'routes'].map(tabName => (
          <button key={tabName} onClick={() => handleTabChange(tabName)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${tab === tabName ? 'bg-green-600 text-white' : 'btn-secondary'}`}>
            {t(`explore.${tabName}`)}
          </button>
        ))}
      </div>

      <div className="mb-8">
        <div className="flex gap-2 items-center">
          <input
            type="search"
            placeholder={
              tab === 'places' 
                ? t('explore.searchPlaces')
                : tab === 'institutions'
                ? t('explore.searchInstitutions')
                : t('explore.searchRoutes')
            }
            value={search}
            onChange={e => handleSearchChange(e.target.value)}
            className="input flex-1 max-w-2xl"
          />
          {loadingExternal && (
            <span className="text-sm text-gray-500">{t('explore.searchingWorldwide')}</span>
          )}
        </div>
      </div>

      {showExternalSearch && externalPlaces.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-display font-semibold mb-4">
            {t('explore.worldwideResults')} ({externalPlaces.length})
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {externalPlaces.map(place => (
              <PlaceCard key={place.id} place={place} type={tab === 'institutions' ? 'institution' : 'place'} />
            ))}
          </div>
          <div className="border-t border-gray-200 dark:border-gray-700 my-8"></div>
        </div>
      )}

      {showExternalSearch && externalPlaces.length > 0 && (
        <h2 className="text-xl font-display font-semibold mb-4">
          {t('explore.localResults')}
        </h2>
      )}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array(8).fill(0).map((_, i) => (
            <div key={i} className="card h-64 animate-pulse bg-gray-100 dark:bg-gray-800" />
          ))}
        </div>
      ) : data.length === 0 ? (
        <p className="text-gray-500 text-center py-16">{t('explore.noResults')}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {data.map(item => (
            tab === 'routes' ? (
              <Link key={item.id} to={`/routes/${item.id}`} className="card p-5 group">
                <h3 className="font-display font-semibold group-hover:text-green-600 transition-colors">{item.title}</h3>
                <p className="text-xs text-gray-500 mt-1">{[item.city, item.country].filter(Boolean).join(', ')}</p>
                {item.reviews_avg_rating && (
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-yellow-500 text-sm">★</span>
                    <span className="text-sm font-semibold">{parseFloat(item.reviews_avg_rating).toFixed(1)}</span>
                    <span className="text-xs text-gray-500">({item.reviews_count})</span>
                  </div>
                )}
                <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3 mt-2">{item.description}</p>
              </Link>
            ) : (
              <PlaceCard key={item.id} place={item} type={tab === 'institutions' ? 'institution' : 'place'} />
            )
          ))}
        </div>
      )}

      {meta && meta.last_page > 1 && (
        <div className="flex justify-center items-center gap-2 mt-10">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="btn-secondary px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ← {t('common.back')}
          </button>
          
          <div className="flex gap-2 items-center">
            {/* Кнопка первой страницы */}
            {page > 3 && (
              <>
                <button
                  onClick={() => setPage(1)}
                  className="w-10 h-10 rounded-lg font-medium transition-colors btn-secondary flex items-center justify-center"
                >
                  1
                </button>
                {page > 4 && <span className="text-gray-400">...</span>}
              </>
            )}
            
            {/* Страницы вокруг текущей */}
            {Array.from({ length: Math.min(5, meta.last_page) }, (_, i) => {
              let pageNum;
              if (meta.last_page <= 5) {
                pageNum = i + 1;
              } else if (page <= 3) {
                pageNum = i + 1;
              } else if (page >= meta.last_page - 2) {
                pageNum = meta.last_page - 4 + i;
              } else {
                pageNum = page - 2 + i;
              }
              
              // Пропускаем первую страницу если она уже показана
              if (page > 3 && pageNum === 1) return null;
              
              // Пропускаем последнюю страницу если она будет показана отдельно
              if (page < meta.last_page - 2 && pageNum === meta.last_page) return null;
              
              return (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  className={`w-10 h-10 rounded-lg font-medium transition-colors flex items-center justify-center ${
                    page === pageNum
                      ? 'bg-green-600 text-white'
                      : 'btn-secondary'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            
            {/* Кнопка последней страницы */}
            {page < meta.last_page - 2 && (
              <>
                {page < meta.last_page - 3 && <span className="text-gray-400">...</span>}
                <button
                  onClick={() => setPage(meta.last_page)}
                  className="w-10 h-10 rounded-lg font-medium transition-colors btn-secondary flex items-center justify-center"
                >
                  {meta.last_page}
                </button>
              </>
            )}
          </div>

          <button
            onClick={() => setPage(p => Math.min(meta.last_page, p + 1))}
            disabled={page === meta.last_page}
            className="btn-secondary px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t('common.next')} →
          </button>
        </div>
      )}
    </div>
  );
}