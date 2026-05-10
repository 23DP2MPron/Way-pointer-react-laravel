import axios from 'axios';

const API_KEY = import.meta.env.VITE_PEXELS_API_KEY;
const BASE_URL = 'https://api.pexels.com/v1';

class PexelsService {
  // Поиск фотографий по запросу
  async searchPhotos(query, perPage = 1) {
    try {
      const response = await axios.get(`${BASE_URL}/search`, {
        params: {
          query,
          per_page: perPage,
          orientation: 'landscape'
        },
        headers: {
          'Authorization': API_KEY
        }
      });
      
      if (response.data.photos && response.data.photos.length > 0) {
        return response.data.photos[0].src.large; // Возвращаем URL первого фото
      }
      return null;
    } catch (error) {
      console.error('Pexels API error:', error);
      return null;
    }
  }

  // Получить фото для города
  async getCityPhoto(cityName, countryName) {
    const query = `${cityName} ${countryName} landmark`;
    return await this.searchPhotos(query);
  }

  // Получить фото для места
  async getPlacePhoto(placeName, city) {
    // Сначала пробуем точный поиск по названию места
    let query = `${placeName}`;
    let photo = await this.searchPhotos(query);
    
    // Если не нашли, пробуем с городом
    if (!photo) {
      query = `${placeName} ${city}`;
      photo = await this.searchPhotos(query);
    }
    
    // Если все еще не нашли, пробуем с добавлением "landmark"
    if (!photo) {
      query = `${placeName} landmark`;
      photo = await this.searchPhotos(query);
    }
    
    return photo;
  }

  // Получить фото для institution
  async getInstitutionPhoto(institutionName, category, city) {
    // Сначала пробуем точный поиск по названию
    let query = `${institutionName}`;
    let photo = await this.searchPhotos(query);
    
    // Если не нашли, добавляем город
    if (!photo) {
      query = `${institutionName} ${city}`;
      photo = await this.searchPhotos(query);
    }
    
    // Если все еще не нашли, используем категорию
    if (!photo) {
      const categoryKeywords = {
        'museum': 'museum art',
        'hotel': 'luxury hotel',
        'restaurant': 'restaurant dining',
        'cafe': 'cafe coffee shop',
        'bar': 'bar cocktails',
        'shop': 'store shopping'
      };
      
      const keyword = categoryKeywords[category] || category;
      query = `${keyword} ${city}`;
      photo = await this.searchPhotos(query);
    }
    
    return photo;
  }
}

export default new PexelsService();
