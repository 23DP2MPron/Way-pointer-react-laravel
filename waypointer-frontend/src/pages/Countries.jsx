import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import restCountriesService from '../services/restCountriesService';

export default function Countries() {
  const { t } = useTranslation();
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 48;

  useEffect(() => {
    loadCountries();
  }, []);

  const loadCountries = async () => {
    setLoading(true);
    try {
      console.log('Loading countries...');
      const data = await restCountriesService.getAllCountries();
      console.log('Countries loaded:', data.length);
      const formatted = data.map(country => restCountriesService.formatCountryData(country));
      console.log('Countries formatted:', formatted.length);
      setCountries(formatted);
    } catch (error) {
      console.error('Error loading countries:', error);
    } finally {
      setLoading(false);
    }
  };

  const regions = ['all', 'Africa', 'Americas', 'Asia', 'Europe', 'Oceania'];

  const filteredCountries = countries
    .filter(country => {
      const matchesSearch = country.name.toLowerCase().includes(search.toLowerCase());
      const matchesRegion = selectedRegion === 'all' || country.region === selectedRegion;
      return matchesSearch && matchesRegion;
    })
    .sort((a, b) => a.name.localeCompare(b.name)); // Сортировка по алфавиту

  // Пагинация
  const totalPages = Math.ceil(filteredCountries.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCountries = filteredCountries.slice(startIndex, endIndex);

  // Сброс страницы при изменении фильтров
  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedRegion]);

  if (loading) {
    return <div className="text-center py-20">{t('common.loading')}</div>;
  }

  console.log('Filtered countries:', filteredCountries.length);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-display font-bold mb-8">{t('countries.title')}</h1>

      {/* Фильтры */}
      <div className="card p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="search"
            placeholder={t('countries.searchPlaceholder')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input flex-1"
          />
          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="input md:w-48"
          >
            {regions.map(region => (
              <option key={region} value={region}>
                {region === 'all' ? t('countries.allRegions') : region}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Список стран */}
      {countries.length === 0 && !loading ? (
        <div className="text-center py-16">
          <p className="text-gray-500 mb-4">No countries loaded. Please check console for errors.</p>
          <button onClick={loadCountries} className="btn-primary">
            Retry Loading Countries
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {currentCountries.map((country) => (
          <Link
            key={country.code}
            to={`/countries/${country.code}`}
            className="card p-5 hover:shadow-xl transition-all group"
          >
            <div className="flex items-center gap-3 mb-3">
              <img
                src={country.flag}
                alt={country.name}
                className="w-12 h-8 object-cover rounded shadow-sm"
              />
              <h3 className="font-display font-semibold group-hover:text-green-600 dark:group-hover:text-teal-400 transition-colors">
                {country.name}
              </h3>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
              <p>📍 {country.capital || 'N/A'}</p>
              <p>🗣️ {country.languages && country.languages.length > 0 ? country.languages[0] : 'N/A'}</p>
              <p>👥 {country.population?.toLocaleString() || 'N/A'}</p>
              {country.currencies && country.currencies.length > 0 && (
                <p>💰 {country.currencies[0]}</p>
              )}
            </div>
          </Link>
            ))}
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
              
              <div className="flex gap-2">
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
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-10 h-10 rounded-lg font-medium transition-colors ${
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

      {filteredCountries.length === 0 && countries.length > 0 && (
        <div className="text-center py-16 text-gray-500">
          {t('countries.noResults')}
        </div>
      )}
    </div>
  );
}
