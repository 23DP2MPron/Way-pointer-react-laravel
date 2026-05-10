import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import geoNamesService from '../services/geoNamesService';
import cityImageService from '../services/cityImageService';

export default function Cities() {
  const { t } = useTranslation();
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showAllCities, setShowAllCities] = useState(false);
  const [allCitiesLoading, setAllCitiesLoading] = useState(false);
  const [apiError, setApiError] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [cityImages, setCityImages] = useState({});
  const itemsPerPage = 48;

  const handleSearch = async () => {
    if (!search.trim()) {
      setSearchResults([]);
      return;
    }
    
    setLoading(true);
    try {
      console.log('Searching for:', search);
      const results = await geoNamesService.searchCities(search, 100);
      console.log('Search results:', results);
      setSearchResults(results);
    } catch (error) {
      console.error('Error searching cities:', error);
    } finally {
      setLoading(false);
    }
  };

  // Popular cities for initial display
  const popularCities = [
    // Europe
    { name: 'Riga', country: 'Latvia', geonameId: 456172 },
    { name: 'London', country: 'United Kingdom', geonameId: 2643743 },
    { name: 'Paris', country: 'France', geonameId: 2988507 },
    { name: 'Berlin', country: 'Germany', geonameId: 2950159 },
    { name: 'Rome', country: 'Italy', geonameId: 3169070 },
    { name: 'Madrid', country: 'Spain', geonameId: 3117735 },
    { name: 'Amsterdam', country: 'Netherlands', geonameId: 2759794 },
    { name: 'Prague', country: 'Czech Republic', geonameId: 3067696 },
    { name: 'Vienna', country: 'Austria', geonameId: 2761369 },
    { name: 'Stockholm', country: 'Sweden', geonameId: 2673730 },
    { name: 'Copenhagen', country: 'Denmark', geonameId: 2618425 },
    { name: 'Oslo', country: 'Norway', geonameId: 3143244 },
    { name: 'Helsinki', country: 'Finland', geonameId: 658225 },
    { name: 'Warsaw', country: 'Poland', geonameId: 756135 },
    { name: 'Budapest', country: 'Hungary', geonameId: 3054643 },
    { name: 'Athens', country: 'Greece', geonameId: 264371 },
    { name: 'Lisbon', country: 'Portugal', geonameId: 2267057 },
    { name: 'Dublin', country: 'Ireland', geonameId: 2964574 },
    { name: 'Brussels', country: 'Belgium', geonameId: 2800866 },
    { name: 'Zurich', country: 'Switzerland', geonameId: 2657896 },
    
    // Asia
    { name: 'Tokyo', country: 'Japan', geonameId: 1850144 },
    { name: 'Beijing', country: 'China', geonameId: 1816670 },
    { name: 'Shanghai', country: 'China', geonameId: 1796236 },
    { name: 'Hong Kong', country: 'Hong Kong', geonameId: 1819729 },
    { name: 'Singapore', country: 'Singapore', geonameId: 1880252 },
    { name: 'Seoul', country: 'South Korea', geonameId: 1835848 },
    { name: 'Bangkok', country: 'Thailand', geonameId: 1609350 },
    { name: 'Dubai', country: 'United Arab Emirates', geonameId: 292223 },
    { name: 'Mumbai', country: 'India', geonameId: 1275339 },
    { name: 'Delhi', country: 'India', geonameId: 1273294 },
    { name: 'Istanbul', country: 'Turkey', geonameId: 745044 },
    { name: 'Tel Aviv', country: 'Israel', geonameId: 293397 },
    
    // North America
    { name: 'New York', country: 'United States', geonameId: 5128581 },
    { name: 'Los Angeles', country: 'United States', geonameId: 5368361 },
    { name: 'Chicago', country: 'United States', geonameId: 4887398 },
    { name: 'San Francisco', country: 'United States', geonameId: 5391959 },
    { name: 'Miami', country: 'United States', geonameId: 4164138 },
    { name: 'Toronto', country: 'Canada', geonameId: 6167865 },
    { name: 'Vancouver', country: 'Canada', geonameId: 6173331 },
    { name: 'Montreal', country: 'Canada', geonameId: 6077243 },
    { name: 'Mexico City', country: 'Mexico', geonameId: 3530597 },
    
    // South America
    { name: 'São Paulo', country: 'Brazil', geonameId: 3448439 },
    { name: 'Rio de Janeiro', country: 'Brazil', geonameId: 3451190 },
    { name: 'Buenos Aires', country: 'Argentina', geonameId: 3435910 },
    { name: 'Lima', country: 'Peru', geonameId: 3936456 },
    { name: 'Bogotá', country: 'Colombia', geonameId: 3688689 },
    
    // Africa
    { name: 'Cairo', country: 'Egypt', geonameId: 360630 },
    { name: 'Cape Town', country: 'South Africa', geonameId: 3369157 },
    { name: 'Johannesburg', country: 'South Africa', geonameId: 993800 },
    { name: 'Nairobi', country: 'Kenya', geonameId: 184745 },
    { name: 'Marrakech', country: 'Morocco', geonameId: 2542997 },
    
    // Oceania
    { name: 'Sydney', country: 'Australia', geonameId: 2147714 },
    { name: 'Melbourne', country: 'Australia', geonameId: 2158177 },
    { name: 'Auckland', country: 'New Zealand', geonameId: 2193733 },
    { name: 'Wellington', country: 'New Zealand', geonameId: 2179537 }
  ];

  const loadAllCities = async () => {
    setAllCitiesLoading(true);
    setApiError(false);
    try {
      // Load major cities of the world (max 1000 for free API)
      const largeCities = await geoNamesService.searchCities('', 1000);
      if (largeCities.length > 0) {
        setCities(largeCities);
        setShowAllCities(true);
      } else {
        console.warn('No cities loaded from API, using popular cities');
        setShowAllCities(false);
        setApiError(true);
      }
    } catch (error) {
      console.error('Error loading all cities:', error);
      setShowAllCities(false);
      setApiError(true);
    } finally {
      setAllCitiesLoading(false);
    }
  };

  // Automatically load all cities on mount
  useEffect(() => {
    loadAllCities();
  }, []);

  const allCities = searchResults.length > 0 ? searchResults : (showAllCities ? cities : popularCities);
  
  // Sort alphabetically
  const sortedCities = [...allCities].sort((a, b) => a.name.localeCompare(b.name));
  
  // Pagination
  const totalPages = Math.ceil(sortedCities.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayCities = sortedCities.slice(startIndex, endIndex);

  // Preload city images through Pexels
  useEffect(() => {
    const preloadCityImages = async () => {
      const newImages = {};
      for (const city of displayCities) {
        const cacheKey = `${city.name}-${city.countryName || city.country}`;
        // Load image asynchronously (it will be cached)
        const imageUrl = await cityImageService.getCityImageUrl(city.name, city.countryName || city.country);
        newImages[cacheKey] = imageUrl;
      }
      setCityImages(prev => ({ ...prev, ...newImages }));
    };
    
    if (displayCities.length > 0) {
      preloadCityImages();
    }
  }, [displayCities.map(c => c.geonameId).join(',')]);

  // Reset page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search, searchResults]);

  // Scroll to top when page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-display font-bold mb-8">{t('cities.title')}</h1>

      {/* Поиск */}
      <div className="card p-6 mb-8">
        <div className="flex gap-3">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            placeholder={t('cities.searchPlaceholder')}
            className="input flex-1"
          />
          <button onClick={handleSearch} className="btn-primary" disabled={loading}>
            {loading ? t('common.loading') : t('cities.search')}
          </button>
        </div>
        {allCitiesLoading && (
          <p className="text-sm text-gray-500 mt-2">{t('common.loading')}</p>
        )}
        {apiError && (
          <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-2">
            ⚠️ API limit reached. Showing popular cities only. Please configure your own GeoNames API key in .env file.
          </p>
        )}
      </div>

      {/* Список городов */}
      {loading || allCitiesLoading ? (
        <div className="text-center py-20">{t('common.loading')}</div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {displayCities.map((city) => {
              const cacheKey = `${city.name}-${city.countryName || city.country}`;
              const imageUrl = cityImages[cacheKey] || cityImageService.getCityImageWithFallback(city.name, city.countryName || city.country);
              
              return (
                <Link
                  key={city.geonameId}
                  to={`/cities/${city.geonameId}`}
                  state={{ city }}
                  className="card overflow-hidden hover:shadow-xl transition-all group"
                >
                  {/* Изображение города */}
                  <div 
                    className="h-48 bg-cover bg-center relative overflow-hidden group-hover:scale-105 transition-transform duration-300"
                    style={{
                      backgroundImage: `url(${imageUrl})`,
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="text-white font-display font-bold text-xl drop-shadow-lg">
                        {city.name}
                      </h3>
                      <p className="text-white/90 text-sm drop-shadow">
                        {city.countryName || city.country}
                      </p>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <div className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
                      {city.adminName1 && (
                        <div className="flex items-center gap-2">
                          <span className="text-gray-400">📍</span>
                          <span>{city.adminName1}</span>
                        </div>
                      )}
                      {city.population && (
                        <div className="flex items-center gap-2">
                          <span className="text-gray-400">👥</span>
                          <span>{city.population.toLocaleString()}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Пагинация */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-10">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="btn-secondary px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ← {t('common.back')}
              </button>
              
              <div className="flex gap-2 items-center">
                {/* Кнопка первой страницы */}
                {currentPage > 3 && (
                  <>
                    <button
                      onClick={() => setCurrentPage(1)}
                      className="w-10 h-10 rounded-lg font-medium transition-colors btn-secondary flex items-center justify-center"
                    >
                      1
                    </button>
                    {currentPage > 4 && <span className="text-gray-400">...</span>}
                  </>
                )}
                
                {/* Страницы вокруг текущей */}
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  // Пропускаем первую страницу если она уже показана
                  if (currentPage > 3 && pageNum === 1) return null;
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-10 h-10 rounded-lg font-medium transition-colors flex items-center justify-center ${
                        currentPage === pageNum
                          ? 'bg-green-600 text-white'
                          : 'btn-secondary'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="btn-secondary px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t('common.next')} →
              </button>
            </div>
          )}
        </>
      )}

      {sortedCities.length === 0 && search && !loading && (
        <div className="text-center py-16 text-gray-500">
          {t('cities.noResults')}
        </div>
      )}
    </div>
  );
}
