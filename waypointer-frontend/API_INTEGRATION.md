# Интеграция внешних API

Этот проект использует несколько бесплатных API для получения информации о городах, странах и достопримечательностях.

## Необходимые API ключи

### 1. OpenTripMap API (Достопримечательности)
**Бесплатно: 1000 запросов/день**

1. Перейдите на https://opentripmap.io/product
2. Нажмите "Get API Key"
3. Зарегистрируйтесь (email + пароль)
4. Скопируйте ваш API ключ
5. Добавьте в `.env.local`:
   ```
   VITE_OPENTRIPMAP_API_KEY=ваш_ключ_здесь
   ```

### 2. GeoNames API (Города и географические данные)
**Бесплатно с регистрацией**

1. Перейдите на http://www.geonames.org/login
2. Создайте аккаунт
3. Подтвердите email
4. Перейдите в "Manage Account" → "Free Web Services"
5. Активируйте "Free Web Services"
6. Ваш username - это ваш логин
7. Добавьте в `.env.local`:
   ```
   VITE_GEONAMES_USERNAME=ваш_username_здесь
   ```

### 3. REST Countries API (Информация о странах)
**Полностью бесплатно, без регистрации**
- Не требует API ключа
- Уже настроено и работает

### 4. Nominatim (OpenStreetMap - Геокодирование)
**Полностью бесплатно, без регистрации**
- Не требует API ключа
- Уже настроено и работает

## Установка

1. Скопируйте `.env.local` в корень `waypointer-frontend`:
   ```bash
   cd waypointer-frontend
   cp .env.local.example .env.local
   ```

2. Добавьте ваши API ключи в `.env.local`

3. Перезапустите dev сервер:
   ```bash
   npm run dev
   ```

## Использование сервисов

### Пример 1: Поиск достопримечательностей по городу
```javascript
import externalAPIService from './services/externalAPIService';

const result = await externalAPIService.searchAttractionsByCity('Riga', 'Latvia');
console.log(result.attractions);
```

### Пример 2: Поиск городов
```javascript
const cities = await externalAPIService.searchCities('Paris');
console.log(cities);
```

### Пример 3: Получить информацию о стране
```javascript
const country = await externalAPIService.getCountryInfo('LV');
console.log(country);
```

### Пример 4: Получить детали достопримечательности
```javascript
const details = await externalAPIService.getAttractionDetails('xid_здесь');
console.log(details);
```

## Доступные категории достопримечательностей

OpenTripMap поддерживает следующие категории:
- `museums` - Музеи
- `churches` - Церкви
- `theatres_and_entertainments` - Театры и развлечения
- `architecture` - Архитектура
- `historic` - Исторические места
- `natural` - Природные объекты
- `sport` - Спортивные объекты
- `tourist_facilities` - Туристические объекты

## Лимиты API

- **OpenTripMap**: 1000 запросов/день
- **GeoNames**: 20,000 запросов/день (бесплатный аккаунт)
- **REST Countries**: Без лимитов
- **Nominatim**: Максимум 1 запрос/секунду (соблюдайте!)

## Тестовая страница

Создана тестовая страница для проверки API:
- Путь: `/attraction-search`
- Компонент: `src/pages/AttractionSearch.jsx`

Добавьте маршрут в `App.jsx`:
```javascript
<Route path="/attraction-search" element={<AttractionSearch />} />
```

## Примечания

- Nominatim требует указания User-Agent (уже настроено)
- Соблюдайте лимиты запросов
- Кэшируйте результаты где возможно
- Для production рекомендуется добавить rate limiting
