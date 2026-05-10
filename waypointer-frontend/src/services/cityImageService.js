import pexelsService from './pexelsService';

// Service for getting city photos
class CityImageService {
  // Get city photo URL through Pexels with caching
  async getCityImageUrl(cityName, countryName) {
    const cacheKey = `city-image-${cityName}-${countryName}`;
    const cached = localStorage.getItem(cacheKey);
    
    if (cached) {
      const { url, timestamp } = JSON.parse(cached);
      // Cache for 7 days
      if (Date.now() - timestamp < 7 * 24 * 60 * 60 * 1000) {
        return url;
      }
    }

    // Try to get photo through Pexels
    try {
      const photoUrl = await pexelsService.getCityPhoto(cityName, countryName);
      if (photoUrl) {
        localStorage.setItem(cacheKey, JSON.stringify({
          url: photoUrl,
          timestamp: Date.now()
        }));
        return photoUrl;
      }
    } catch (error) {
      console.warn('Failed to load city photo from Pexels:', error);
    }

    // Fallback to Lorem Picsum
    const seed = this.generateSeed(`${cityName}-${countryName}`);
    return `https://picsum.photos/seed/city-${seed}/800/600`;
  }

  // Get photo URL with fallback (synchronous version for quick loading)
  getCityImageWithFallback(cityName, countryName) {
    const cacheKey = `city-image-${cityName}-${countryName}`;
    const cached = localStorage.getItem(cacheKey);
    
    if (cached) {
      const { url, timestamp } = JSON.parse(cached);
      // Cache for 7 days
      if (Date.now() - timestamp < 7 * 24 * 60 * 60 * 1000) {
        return url;
      }
    }

    // Return Lorem Picsum as temporary solution
    const seed = this.generateSeed(`${cityName}-${countryName}`);
    return `https://picsum.photos/seed/city-${seed}/800/600`;
  }

  // Generate seed from string for consistent images
  generateSeed(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash);
  }

  // Get gradient background as fallback
  getGradientBackground(cityName) {
    const colors = [
      'from-blue-400 to-blue-600',
      'from-green-400 to-green-600',
      'from-purple-400 to-purple-600',
      'from-pink-400 to-pink-600',
      'from-yellow-400 to-yellow-600',
      'from-red-400 to-red-600',
      'from-indigo-400 to-indigo-600',
      'from-teal-400 to-teal-600',
    ];
    const index = cityName.charCodeAt(0) % colors.length;
    return colors[index];
  }
}

export default new CityImageService();
