import axios from 'axios';

const BASE_URL = 'https://restcountries.com/v3.1';

class RestCountriesService {
  // Получить все страны
  async getAllCountries() {
    try {
      console.log('Fetching countries from API...');
      // Запрашиваем основные поля включая валюты и языки
      const response = await axios.get(`${BASE_URL}/all?fields=name,cca2,capital,region,population,flags,currencies,languages`);
      console.log('API Response:', response.status, response.data?.length);
      return response.data;
    } catch (error) {
      console.error('REST Countries API error:', error.message);
      console.error('Error details:', error.response?.data || error);
      return [];
    }
  }

  // Получить страну по коду
  async getCountryByCode(code) {
    try {
      const response = await axios.get(`${BASE_URL}/alpha/${code}`);
      return response.data[0];
    } catch (error) {
      console.error('REST Countries API error:', error);
      return null;
    }
  }

  // Поиск стран по названию
  async searchCountries(name) {
    try {
      const response = await axios.get(`${BASE_URL}/name/${name}`);
      return response.data;
    } catch (error) {
      console.error('REST Countries API error:', error);
      return [];
    }
  }

  // Получить страны по региону
  async getCountriesByRegion(region) {
    try {
      const response = await axios.get(`${BASE_URL}/region/${region}`);
      return response.data;
    } catch (error) {
      console.error('REST Countries API error:', error);
      return [];
    }
  }

  // Форматировать данные страны для использования в приложении
  formatCountryData(country) {
    return {
      name: country.name.common,
      officialName: country.name.official || country.name.common,
      code: country.cca2,
      capital: country.capital?.[0] || '',
      region: country.region || '',
      subregion: country.subregion || '',
      population: country.population || 0,
      area: country.area || 0,
      flag: country.flags?.svg || country.flags?.png || '',
      languages: country.languages ? Object.values(country.languages) : [],
      currencies: country.currencies ? Object.values(country.currencies).map(c => c.name) : [],
      timezones: country.timezones || [],
      latlng: country.latlng || []
    };
  }
}

export default new RestCountriesService();
