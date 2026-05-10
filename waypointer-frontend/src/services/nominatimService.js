import axios from 'axios';

const BASE_URL = 'https://nominatim.openstreetmap.org';

class NominatimService {
  // Поиск места по названию (геокодирование)
  async searchPlace(query) {
    try {
      const response = await axios.get(`${BASE_URL}/search`, {
        params: {
          q: query,
          format: 'json',
          addressdetails: 1,
          limit: 10
        },
        headers: {
          'Accept-Language': 'en'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Nominatim API error:', error);
      return [];
    }
  }

  // Поиск локации (алиас для searchPlace)
  async searchLocation(query) {
    return this.searchPlace(query);
  }

  // Обратное геокодирование (координаты -> адрес)
  async reverseGeocode(lat, lon) {
    try {
      const response = await axios.get(`${BASE_URL}/reverse`, {
        params: {
          lat,
          lon,
          format: 'json',
          addressdetails: 1
        },
        headers: {
          'Accept-Language': 'en'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Nominatim API error:', error);
      return null;
    }
  }

  // Получить координаты города или страны
  async getLocationCoordinates(city, country) {
    try {
      const query = city ? `${city}, ${country}` : country;
      const response = await axios.get(`${BASE_URL}/search`, {
        params: {
          q: query,
          format: 'json',
          addressdetails: 1,
          limit: 1
        },
        headers: {
          'Accept-Language': 'en'
        }
      });
      
      if (response.data && response.data.length > 0) {
        const location = response.data[0];
        return {
          lat: parseFloat(location.lat),
          lon: parseFloat(location.lon),
          displayName: location.display_name
        };
      }
      return null;
    } catch (error) {
      console.error('Nominatim API error:', error);
      return null;
    }
  }

  // Поиск достопримечательностей
  async searchAttractions(city, country) {
    try {
      const query = `attractions in ${city}, ${country}`;
      const response = await axios.get(`${BASE_URL}/search`, {
        params: {
          q: query,
          format: 'json',
          addressdetails: 1,
          limit: 20
        },
        headers: {
          'Accept-Language': 'en'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Nominatim API error:', error);
      return [];
    }
  }
}

export default new NominatimService();
