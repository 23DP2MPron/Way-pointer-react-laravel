import { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import geoNamesService from '../services/geoNamesService';
import openTripMapService from '../services/openTripMapService';
import cityImageService from '../services/cityImageService';
import PlaceCard from '../components/PlaceCard';

export default function CityDetails() {
  const { t } = useTranslation();
  const { id } = useParams();
  const location = useLocation();
  const [city, setCity] = useState(location.state?.city || null);
  const [country, setCountry] = useState(location.state?.country || null);
  const [attractions, setAttractions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cityImage, setCityImage] = useState(null);

  useEffect(() => {
    loadCityData();
  }, [id]);

  useEffect(() => {
    if (city) {
      loadCityImage();
    }
  }, [city]);

  const loadCityImage = async () => {
    try {
      const imageUrl = await cityImageService.getCityImageUrl(
        city.name, 
        city.countryName || country?.name || ''
      );
      setCityImage(imageUrl);
    } catch (error) {
      console.error('Error loading city image:', error);
    }
  };

  const loadCityData = async () => {
    setLoading(true);
    try {
      // If city not passed through state, load it
      if (!city) {
        const cityData = await geoNamesService.getPlaceById(id);
        setCity(cityData);
      }

      // Get city attractions
      const lat = city?.lat || location.state?.city?.lat;
      const lon = city?.lng || location.state?.city?.lng;
      
      if (lat && lon) {
        try {
          const attractionsData = await openTripMapService.getPlacesByRadius(lat, lon, 10000, 30);
          setAttractions(attractionsData.filter(a => a.name)); // Only with names
        } catch (error) {
          console.warn('Could not load attractions, API key may be missing');
          setAttractions([]);
        }
      }
    } catch (error) {
      console.error('Error loading city data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-20">{t('common.loading')}</div>;
  }

  if (!city) {
    return <div className="text-center py-20">{t('cities.notFound')}</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* City header */}
      <div className="card p-8 mb-8">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          {/* City image */}
          {cityImage ? (
            <img 
              src={cityImage} 
              alt={city.name}
              className="w-full md:w-80 h-60 object-cover rounded-lg shadow-lg"
            />
          ) : (
            <div className="w-full md:w-80 h-60 bg-gradient-to-br from-green-400 to-teal-500 dark:from-green-600 dark:to-teal-700 rounded-lg flex items-center justify-center shadow-lg">
              <span className="text-white text-6xl font-display font-bold">
                {city.name[0]}
              </span>
            </div>
          )}

          <div className="flex-1">
            <h1 className="text-4xl font-display font-bold mb-4">{city.name}</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500 mb-1">{t('cities.country')}</p>
                <Link 
                  to={`/countries/${country?.code || city.countryCode}`} 
                  className="font-semibold text-green-600 dark:text-teal-400 hover:underline"
                >
                  {city.countryName || country?.name}
                </Link>
              </div>
              <div>
                <p className="text-gray-500 mb-1">{t('cities.region')}</p>
                <p className="font-semibold">{city.adminName1 || 'N/A'}</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">{t('cities.population')}</p>
                <p className="font-semibold">{city.population?.toLocaleString() || 'N/A'}</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">{t('cities.coordinates')}</p>
                <p className="font-semibold">{city.lat}, {city.lng || city.lon}</p>
              </div>
            </div>

            {/* Brief information */}
            {city && (
              <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <h3 className="font-semibold mb-2">{t('cities.about')}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {t('cities.aboutText', {
                    city: city.name,
                    country: city.countryName || country?.name || '',
                    population: city.population ? city.population.toLocaleString() : ''
                  })}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Attractions */}
      <div>
        <h2 className="text-2xl font-display font-bold mb-6">{t('cities.attractions')}</h2>
        {attractions.length === 0 ? (
          <p className="text-gray-500 text-center py-10">{t('cities.noAttractions')}</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {attractions.map((attraction) => {
              // Transform attraction data to PlaceCard format
              const placeData = {
                id: `external-${attraction.xid}`,
                xid: attraction.xid,
                name: attraction.name,
                city: city.name,
                country: city.countryName || country?.name || '',
                description: attraction.kinds?.split(',').slice(0, 3).join(', '),
                type: attraction.kinds?.split(',')[0] || 'attraction',
                category: attraction.kinds?.split(',')[0] || 'attraction',
                rating: 0,
                review_count: 0,
                isExternal: true
              };
              
              return <PlaceCard key={attraction.xid} place={placeData} type="place" />;
            })}
          </div>
        )}
      </div>
    </div>
  );
}
