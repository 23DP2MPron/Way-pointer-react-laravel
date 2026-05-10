import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import restCountriesService from '../services/restCountriesService';
import geoNamesService from '../services/geoNamesService';
import cityImageService from '../services/cityImageService';

export default function CountryDetails() {
  const { t } = useTranslation();
  const { code } = useParams();
  const [country, setCountry] = useState(null);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCountryData();
  }, [code]);

  const loadCountryData = async () => {
    setLoading(true);
    try {
      // Получаем информацию о стране
      const countryData = await restCountriesService.getCountryByCode(code);
      if (countryData) {
        const formatted = restCountriesService.formatCountryData(countryData);
        setCountry(formatted);

        // Получаем топ городов этой страны по коду страны
        const countryCities = await geoNamesService.getCitiesByCountry(code.toUpperCase(), 20);
        setCities(countryCities);
      }
    } catch (error) {
      console.error('Error loading country data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-20">{t('common.loading')}</div>;
  }

  if (!country) {
    return <div className="text-center py-20">{t('countries.notFound')}</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Заголовок страны */}
      <div className="card p-8 mb-8">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <img
            src={country.flag}
            alt={country.name}
            className="w-full md:w-64 h-40 object-cover rounded-lg shadow-lg"
          />
          <div className="flex-1">
            <h1 className="text-4xl font-display font-bold mb-4">{country.name}</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500 mb-1">{t('countries.officialName')}</p>
                <p className="font-semibold">{country.officialName}</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">{t('countries.capital')}</p>
                <p className="font-semibold">{country.capital || 'N/A'}</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">{t('countries.languages')}</p>
                <p className="font-semibold">{country.languages?.join(', ') || 'N/A'}</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">{t('countries.population')}</p>
                <p className="font-semibold">{country.population?.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">{t('countries.area')}</p>
                <p className="font-semibold">{country.area?.toLocaleString()} km²</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">{t('countries.currencies')}</p>
                <p className="font-semibold">{country.currencies?.join(', ') || 'N/A'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Топ городов */}
      <div className="mb-8">
        <h2 className="text-2xl font-display font-bold mb-6">{t('countries.topCities')}</h2>
        {cities.length === 0 ? (
          <p className="text-gray-500 text-center py-10">{t('countries.noCities')}</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {cities.map((city) => (
              <Link
                key={city.geonameId}
                to={`/cities/${city.geonameId}`}
                state={{ city, country }}
                className="card overflow-hidden hover:shadow-xl transition-all group"
              >
                {/* Изображение города (placeholder с градиентом) */}
                <div 
                  className="h-48 bg-cover bg-center relative overflow-hidden group-hover:scale-105 transition-transform duration-300"
                  style={{
                    backgroundImage: `url(${cityImageService.getCityImageWithFallback(city.name, country.name)})`,
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-white font-display font-bold text-xl drop-shadow-lg">
                      {city.name}
                    </h3>
                    {city.population && (
                      <p className="text-white/90 text-sm drop-shadow">
                        👥 {city.population.toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
                    {city.adminName1 && city.adminName1 !== city.name && (
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400">📍</span>
                        <span>{city.adminName1}</span>
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
