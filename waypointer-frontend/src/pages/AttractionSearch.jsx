import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import externalAPIService from '../services/externalAPIService';
import PlaceCard from '../components/PlaceCard';

export default function AttractionSearch() {
  const { t } = useTranslation();
  const [cityQuery, setCityQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState(null);
  const [cities, setCities] = useState([]);
  const [attractions, setAttractions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedAttraction, setSelectedAttraction] = useState(null);

  // Search for cities
  const handleSearchCities = async () => {
    if (!cityQuery.trim()) return;
    
    setLoading(true);
    try {
      const results = await externalAPIService.searchCities(cityQuery);
      setCities(results);
    } catch (error) {
      console.error('Error searching cities:', error);
    } finally {
      setLoading(false);
    }
  };

  // Select city and search for attractions
  const handleSelectCity = async (city) => {
    setSelectedCity(city);
    setLoading(true);
    
    try {
      const result = await externalAPIService.searchAttractionsByCity(city.name, city.country);
      setAttractions(result.attractions);
    } catch (error) {
      console.error('Error loading attractions:', error);
    } finally {
      setLoading(false);
    }
  };

  // Get attraction details
  const handleViewDetails = async (attractionId) => {
    setLoading(true);
    
    try {
      const details = await externalAPIService.getAttractionDetails(attractionId);
      setSelectedAttraction(details);
    } catch (error) {
      console.error('Error loading attraction details:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-display font-bold mb-8">Search Attractions</h1>

      {/* Поиск городов */}
      <div className="card p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Search City</h2>
        <div className="flex gap-3">
          <input
            type="text"
            value={cityQuery}
            onChange={(e) => setCityQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearchCities()}
            placeholder="Enter city name..."
            className="input flex-1"
          />
          <button onClick={handleSearchCities} className="btn-primary" disabled={loading}>
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>

        {/* Результаты поиска городов */}
        {cities.length > 0 && (
          <div className="mt-4 space-y-2">
            {cities.map((city) => (
              <button
                key={city.id}
                onClick={() => handleSelectCity(city)}
                className="w-full text-left p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="font-semibold">{city.name}</div>
                <div className="text-sm text-gray-500">
                  {city.adminName && `${city.adminName}, `}{city.country} • Population: {city.population?.toLocaleString()}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Выбранный город */}
      {selectedCity && (
        <div className="mb-8">
          <h2 className="text-2xl font-display font-bold mb-4">
            Attractions in {selectedCity.name}, {selectedCity.country}
          </h2>
        </div>
      )}

      {/* Attraction list */}
      {loading && <div className="text-center py-10">Loading...</div>}
      
      {!loading && attractions.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {attractions.map((attraction) => {
            // Transform attraction data to PlaceCard format
            const placeData = {
              id: `external-${attraction.id}`,
              xid: attraction.id,
              name: attraction.name || 'Unnamed Place',
              city: selectedCity.name,
              country: selectedCity.country,
              description: attraction.kinds?.split(',').slice(0, 3).join(', '),
              type: attraction.kinds?.split(',')[0] || 'attraction',
              category: attraction.kinds?.split(',')[0] || 'attraction',
              rating: 0,
              review_count: 0,
              isExternal: true
            };
            
            return <PlaceCard key={attraction.id} place={placeData} type="place" />;
          })}
        </div>
      )}

      {!loading && selectedCity && attractions.length === 0 && (
        <div className="text-center py-10 text-gray-500">
          No attractions found in this area.
        </div>
      )}

      {/* Модальное окно с деталями */}
      {selectedAttraction && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setSelectedAttraction(null)}>
          <div className="card max-w-2xl w-full p-6 max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-display font-bold">{selectedAttraction.name}</h2>
              <button onClick={() => setSelectedAttraction(null)} className="text-2xl">&times;</button>
            </div>
            
            {selectedAttraction.image && (
              <img src={selectedAttraction.image} alt={selectedAttraction.name} className="w-full h-64 object-cover rounded-lg mb-4" />
            )}
            
            <div className="space-y-4">
              {selectedAttraction.description && (
                <div>
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-gray-600 dark:text-gray-300">{selectedAttraction.description}</p>
                </div>
              )}
              
              {selectedAttraction.address && (
                <div>
                  <h3 className="font-semibold mb-2">Address</h3>
                  <p className="text-gray-600 dark:text-gray-300">{selectedAttraction.address}</p>
                </div>
              )}
              
              {selectedAttraction.kinds && selectedAttraction.kinds.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Categories</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedAttraction.kinds.map((kind, idx) => (
                      <span key={idx} className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-sm">
                        {kind}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {selectedAttraction.wikipedia && (
                <a href={selectedAttraction.wikipedia} target="_blank" rel="noopener noreferrer" className="btn-primary inline-block">
                  Read on Wikipedia
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
