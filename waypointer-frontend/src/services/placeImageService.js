// Сервис для получения фотографий places
class PlaceImageService {
  // Получить изображение через Lorem Picsum с консистентным seed
  getPlaceImageUrl(placeName, category, width = 800, height = 600) {
    const seed = this.generateSeed(placeName);
    return `https://picsum.photos/seed/place-${seed}/${width}/${height}`;
  }

  // Получить URL фото с запасным вариантом
  getPlaceImageWithFallback(placeName, category, city) {
    const seed = this.generateSeed(`${placeName}-${city}`);
    return `https://picsum.photos/seed/place-${seed}/800/600`;
  }

  // Генерируем seed из строки для консистентных изображений
  generateSeed(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash);
  }

  // Получить фото по категории
  getCategoryImage(category, city) {
    const seed = this.generateSeed(`${category}-${city}`);
    return `https://picsum.photos/seed/place-${seed}/800/600`;
  }

  // Получить градиентный фон как запасной вариант
  getGradientBackground(category) {
    const gradients = {
      'landmark': 'from-blue-400 to-blue-600',
      'park': 'from-green-400 to-green-600',
      'museum': 'from-purple-400 to-purple-600',
      'beach': 'from-cyan-400 to-cyan-600',
      'mountain': 'from-gray-400 to-gray-600',
      'historical': 'from-amber-400 to-amber-600',
      'nature': 'from-emerald-400 to-emerald-600',
      'architecture': 'from-slate-400 to-slate-600'
    };
    
    return gradients[category] || 'from-teal-400 to-teal-600';
  }
}

export default new PlaceImageService();
