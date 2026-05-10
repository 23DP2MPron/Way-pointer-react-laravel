// Сервис для получения фотографий institutions
class InstitutionImageService {
  // Получить изображение через Lorem Picsum
  getInstitutionImageUrl(institutionName, category, width = 800, height = 600) {
    const seed = this.generateSeed(`${institutionName}-${category}`);
    return `https://picsum.photos/seed/inst-${seed}/${width}/${height}`;
  }

  // Получить URL фото с запасным вариантом
  getInstitutionImageWithFallback(institutionName, category, city) {
    const seed = this.generateSeed(`${institutionName}-${city}-${category}`);
    return `https://picsum.photos/seed/inst-${seed}/800/600`;
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
    return `https://picsum.photos/seed/inst-${seed}/800/600`;
  }

  // Получить градиентный фон как запасной вариант
  getGradientBackground(category) {
    const gradients = {
      'museum': 'from-purple-400 to-purple-600',
      'hotel': 'from-blue-400 to-blue-600',
      'restaurant': 'from-red-400 to-red-600',
      'cafe': 'from-yellow-400 to-yellow-600',
      'bar': 'from-indigo-400 to-indigo-600',
      'shop': 'from-green-400 to-green-600'
    };
    
    return gradients[category] || 'from-gray-400 to-gray-600';
  }
}

export default new InstitutionImageService();
