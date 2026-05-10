FROM php:8.2-cli-alpine

# Устанавливаем нужные расширения
RUN apk add --no-cache libpng-dev libxml2-dev libzip-dev oniguruma-dev zip unzip git curl
RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html
COPY . .

# Установка зависимостей Laravel
RUN composer install --no-dev --optimize-autoloader
RUN chown -R www-data:www-data storage bootstrap/cache

# Запуск. Флаг -t public говорит PHP искать index.php/index.html в папке public
CMD sh -c "php -S 0.0.0.0:$PORT -t public"