import axios from 'axios';

const API_KEY = import.meta.env.VITE_OPENTRIPMAP_API_KEY;
const BASE_URL = 'https://api.opentripmap.com/0.1/en/places';

class OpenTripMapService {
  // Поиск достопримечательностей по координатам
  async getPlacesByRadius(lat, lon, radius = 5000, limit = 20) {
    try {
      const response = await axios.get(`${BASE_URL}/radius`, {
        params: {
          apikey: API_KEY,
          radius,
          lon,
          lat,
          limit,
          format: 'json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('OpenTripMap API error:', error);
      return [];
    }
  }

  // Получить детальную информацию о месте
  async getPlaceDetails(xid) {
    try {
      const response = await axios.get(`${BASE_URL}/xid/${xid}`, {
        params: {
          apikey: API_KEY
        }
      });
      return response.data;
    } catch (error) {
      console.error('OpenTripMap API error:', error);
      return null;
    }
  }

  // Поиск мест по названию
  async searchPlaces(name, lat, lon, radius = 50000) {
    try {
      const response = await axios.get(`${BASE_URL}/radius`, {
        params: {
          apikey: API_KEY,
          radius,
          lon,
          lat,
          name,
          format: 'json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('OpenTripMap API error:', error);
      return [];
    }
  }

  // Получить достопримечательности по категории
  async getPlacesByCategory(lat, lon, kinds, radius = 5000, limit = 20) {
    try {
      const response = await axios.get(`${BASE_URL}/radius`, {
        params: {
          apikey: API_KEY,
          radius,
          lon,
          lat,
          kinds, // например: 'museums', 'churches', 'theatres_and_entertainments'
          limit,
          format: 'json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('OpenTripMap API error:', error);
      return [];
    }
  }
}

export default new OpenTripMapService();
