import openTripMapService from './openTripMapService';
import geoNamesService from './geoNamesService';
import restCountriesService from './restCountriesService';
import nominatimService from './nominatimService';

class ExternalAPIService {
  // Поиск достопримечательностей по городу
  async searchAttractionsByCity(cityName, countryName) {
    try {
      // 1. Получаем координаты города через Nominatim
      const searchResults = await nominatimService.searchPlace(`${cityName}, ${countryName}`);
      
      if (searchResults.length === 0) {
        return { attractions: [], city: null };
      }

      const cityData = searchResults[0];
      const { lat, lon } = cityData;

      // 2. Получаем достопримечательности через OpenTripMap
      const attractions = await openTripMapService.getPlacesByRadius(lat, lon, 5000, 20);

      return {
        attractions: attractions.map(place => ({
          id: place.xid,
          name: place.name,
          kinds: place.kinds,
          lat: place.point.lat,
          lon: place.point.lon,
          distance: place.dist
        })),
        city: {
          name: cityData.display_name,
          lat,
          lon
        }
      };
    } catch (error) {
      console.error('Error searching attractions:', error);
      return { attractions: [], city: null };
    }
  }

  // Получить детальную информацию о достопримечательности
  async getAttractionDetails(xid) {
    try {
      const details = await openTripMapService.getPlaceDetails(xid);
      
      return {
        name: details.name,
        description: details.wikipedia_extracts?.text || details.info?.descr || 'No description available',
        image: details.preview?.source || details.image || null,
        address: details.address?.road || details.address?.city || '',
        kinds: details.kinds?.split(',') || [],
        wikipedia: details.wikipedia || null,
        lat: details.point?.lat,
        lon: details.point?.lon,
        rating: details.rate || 0
      };
    } catch (error) {
      console.error('Error getting attraction details:', error);
      return null;
    }
  }

  // Поиск городов
  async searchCities(query) {
    try {
      const cities = await geoNamesService.searchCities(query, 10);
      
      return cities.map(city => ({
        id: city.geonameId,
        name: city.name,
        country: city.countryName,
        countryCode: city.countryCode,
        population: city.population,
        lat: city.lat,
        lng: city.lng,
        adminName: city.adminName1
      }));
    } catch (error) {
      console.error('Error searching cities:', error);
      return [];
    }
  }

  // Получить информацию о стране
  async getCountryInfo(countryCode) {
    try {
      const [restCountryData, geoNamesData] = await Promise.all([
        restCountriesService.getCountryByCode(countryCode),
        geoNamesService.getCountryInfo(countryCode)
      ]);

      if (!restCountryData) return null;

      return {
        ...restCountriesService.formatCountryData(restCountryData),
        geonameId: geoNamesData?.geonameId,
        continent: geoNamesData?.continentName
      };
    } catch (error) {
      console.error('Error getting country info:', error);
      return null;
    }
  }

  // Получить все страны
  async getAllCountries() {
    try {
      const countries = await restCountriesService.getAllCountries();
      
      return countries
        .map(country => restCountriesService.formatCountryData(country))
        .sort((a, b) => a.name.localeCompare(b.name));
    } catch (error) {
      console.error('Error getting all countries:', error);
      return [];
    }
  }

  // Получить достопримечательности по категории
  async getAttractionsByCategory(lat, lon, category, radius = 5000) {
    try {
      // Категории OpenTripMap: museums, churches, theatres_and_entertainments, 
      // architecture, historic, natural, sport, tourist_facilities
      const attractions = await openTripMapService.getPlacesByCategory(lat, lon, category, radius, 20);
      
      return attractions.map(place => ({
        id: place.xid,
        name: place.name,
        kinds: place.kinds,
        lat: place.point.lat,
        lon: place.point.lon,
        distance: place.dist
      }));
    } catch (error) {
      console.error('Error getting attractions by category:', error);
      return [];
    }
  }

  // Получить адрес по координатам
  async getAddressByCoordinates(lat, lon) {
    try {
      const result = await nominatimService.reverseGeocode(lat, lon);
      
      if (!result) return null;

      return {
        address: result.display_name,
        city: result.address?.city || result.address?.town || result.address?.village,
        country: result.address?.country,
        countryCode: result.address?.country_code?.toUpperCase(),
        postcode: result.address?.postcode
      };
    } catch (error) {
      console.error('Error getting address:', error);
      return null;
    }
  }
}

export default new ExternalAPIService();
