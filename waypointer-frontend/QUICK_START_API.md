# Быстрый старт - Интеграция API

## Что было сделано:

✅ Созданы сервисы для работы с 4 API:
- `openTripMapService.js` - достопримечательности
- `geoNamesService.js` - города и географические данные
- `restCountriesService.js` - информация о странах (работает без ключа)
- `nominatimService.js` - геокодирование (работает без ключа)
- `externalAPIService.js` - объединяет все API

✅ Создана тестовая страница `/attraction-search` для проверки API

✅ Добавлен маршрут в App.jsx

## Что нужно сделать:

### 1. Получить API ключи (5 минут):

**OpenTripMap:**
1. Откройте https://opentripmap.io/product
2. Нажмите "Get API Key"
3. Зарегистрируйтесь
4. Скопируйте ключ

**GeoNames:**
1. Откройте http://www.geonames.org/login
2. Создайте аккаунт
3. Подтвердите email
4. Перейдите в "Manage Account" → "Free Web Services"
5. Активируйте "Free Web Services"
6. Ваш username - это ваш логин

### 2. Настроить .env.local:

```bash
cd waypointer-frontend
```

Откройте файл `.env.local` и добавьте ваши ключи:
```
VITE_OPENTRIPMAP_API_KEY=ваш_ключ_opentripmap
VITE_GEONAMES_USERNAME=ваш_username_geonames
VITE_API_URL=http://localhost:8000/api
```

### 3. Перезапустить сервер:

```bash
npm run dev
```

### 4. Протестировать:

Откройте в браузере: http://localhost:5173/attraction-search

Попробуйте найти город (например, "Riga") и посмотреть достопримечательности!

## Как использовать в коде:

```javascript
import externalAPIService from '../services/externalAPIService';

// Поиск достопримечательностей
const result = await externalAPIService.searchAttractionsByCity('Riga', 'Latvia');

// Поиск городов
const cities = await externalAPIService.searchCities('Paris');

// Информация о стране
const country = await externalAPIService.getCountryInfo('LV');

// Детали достопримечательности
const details = await externalAPIService.getAttractionDetails(xid);
```

## Примечание:

- REST Countries и Nominatim уже работают без ключей
- Можете сразу тестировать поиск стран и геокодирование
- OpenTripMap и GeoNames требуют регистрации (бесплатно)

Подробная документация в файле `API_INTEGRATION.md`
