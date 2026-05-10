import axios from 'axios';

const USERNAME = import.meta.env.VITE_GEONAMES_USERNAME || 'demo';
const BASE_URL = 'https://secure.geonames.org';

console.log('GeoNames USERNAME:', USERNAME);

class GeoNamesService {
  // Поиск городов по названию
  async searchCities(query, maxRows = 10) {
    try {
      const params = {
        maxRows: maxRows * 3, // Запрашиваем больше для фильтрации
        username: USERNAME,
        featureClass: 'P', // P = populated place (города)
        orderby: 'population'
      };

      // Если есть запрос, добавляем его
      if (query && query.trim() !== '') {
        params.name = query; // Используем name вместо q для более точного поиска
      } else {
        // Для загрузки всех городов - используем cities1000 (города с населением > 1000)
        params.cities = 'cities1000';
        params.maxRows = 1000; // Максимум для бесплатного аккаунта
      }

      console.log('GeoNames API request params:', params);
      const response = await axios.get(`${BASE_URL}/searchJSON`, { params });
      console.log('GeoNames API response:', response.data);
      
      // Проверяем на ошибки API
      if (response.data.status) {
        console.error('GeoNames API error:', response.data.status);
        console.error('Error message:', response.data.status.message);
        return [];
      }
      
      // Фильтруем результаты
      let filtered = (response.data.geonames || [])
        .filter(city => {
          // Исключаем только явные районы
          const excludedFcodes = ['PPLX', 'PPLL', 'PPLQ', 'PPLH'];
          if (excludedFcodes.includes(city.fcode)) return false;
          
          // Для общего списка - показываем только важные города
          if (!query || query.trim() === '') {
            // Столицы и административные центры всех уровней + крупные города
            const importantFcodes = ['PPLC', 'PPLA', 'PPLA2', 'PPLA3', 'PPLA4', 'PPL'];
            if (!importantFcodes.includes(city.fcode)) return false;
            // Минимальное население 10,000 для обычных городов (PPL)
            if (city.fcode === 'PPL' && (city.population || 0) < 10000) return false;
          }
          
          // Если есть поисковый запрос, фильтруем по точному совпадению имени
          if (query && query.trim() !== '') {
            const queryLower = query.toLowerCase();
            const cityNameLower = city.name.toLowerCase();
            // Точное совпадение или начинается с запроса
            return cityNameLower === queryLower || cityNameLower.startsWith(queryLower + ' ');
          }
          
          return true;
        });
      
      // Если есть поисковый запрос, сортируем по релевантности
      if (query && query.trim() !== '') {
        const queryLower = query.toLowerCase();
        filtered.sort((a, b) => {
          const aNameLower = a.name.toLowerCase();
          const bNameLower = b.name.toLowerCase();
          
          // Точное совпадение - наивысший приоритет
          if (aNameLower === queryLower && bNameLower !== queryLower) return -1;
          if (bNameLower === queryLower && aNameLower !== queryLower) return 1;
          
          // Иначе сортируем по населению
          return (b.population || 0) - (a.population || 0);
        });
      }
      
      filtered = filtered.slice(0, maxRows);
      
      console.log('Filtered cities count:', filtered.length);
      return filtered;
    } catch (error) {
      console.error('GeoNames API error:', error);
      return [];
    }
  }

  // Получить информацию о стране
  async getCountryInfo(countryCode) {
    try {
      const response = await axios.get(`${BASE_URL}/countryInfoJSON`, {
        params: {
          country: countryCode,
          username: USERNAME
        }
      });
      return response.data.geonames?.[0] || null;
    } catch (error) {
      console.error('GeoNames API error:', error);
      return null;
    }
  }

  // Получить ближайшие города по координатам
  async findNearbyPlaces(lat, lng, radius = 50) {
    try {
      const response = await axios.get(`${BASE_URL}/findNearbyPlaceNameJSON`, {
        params: {
          lat,
          lng,
          radius,
          maxRows: 10,
          username: USERNAME
        }
      });
      return response.data.geonames || [];
    } catch (error) {
      console.error('GeoNames API error:', error);
      return [];
    }
  }

  // Получить информацию о месте по ID
  async getPlaceById(geonameId) {
    try {
      const response = await axios.get(`${BASE_URL}/getJSON`, {
        params: {
          geonameId,
          username: USERNAME
        }
      });
      return response.data;
    } catch (error) {
      console.error('GeoNames API error:', error);
      return null;
    }
  }

  // Получить список стран
  async getAllCountries() {
    try {
      const response = await axios.get(`${BASE_URL}/countryInfoJSON`, {
        params: {
          username: USERNAME
        }
      });
      return response.data.geonames || [];
    } catch (error) {
      console.error('GeoNames API error:', error);
      return [];
    }
  }

  // Получить города по коду страны
  async getCitiesByCountry(countryCode, maxRows = 20) {
    try {
      const params = {
        country: countryCode,
        maxRows: maxRows * 2,
        username: USERNAME,
        featureClass: 'P',
        orderby: 'population',
        cities: 'cities1000' // Города с населением > 1000
      };

      console.log('GeoNames API request params (by country):', params);
      const response = await axios.get(`${BASE_URL}/searchJSON`, { params });
      console.log('GeoNames API response (by country):', response.data);
      
      if (response.data.status) {
        console.error('GeoNames API error:', response.data.status);
        return [];
      }
      
      // Фильтруем результаты
      const filtered = (response.data.geonames || [])
        .filter(city => {
          // Исключаем районы
          const excludedFcodes = ['PPLX', 'PPLL', 'PPLQ', 'PPLH'];
          if (excludedFcodes.includes(city.fcode)) return false;
          
          // Показываем столицы, админ центры и крупные города
          const importantFcodes = ['PPLC', 'PPLA', 'PPLA2', 'PPLA3', 'PPLA4', 'PPL'];
          if (!importantFcodes.includes(city.fcode)) return false;
          
          // Минимальное население 5,000 для обычных городов
          if (city.fcode === 'PPL' && (city.population || 0) < 5000) return false;
          
          return true;
        })
        .slice(0, maxRows);
      
      console.log('Filtered cities count (by country):', filtered.length);
      return filtered;
    } catch (error) {
      console.error('GeoNames API error:', error);
      return [];
    }
  }
}

export default new GeoNamesService();
