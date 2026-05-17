FROM php:8.2-apache

# Cache bust: 2026-05-10-v7
RUN apt-get update && apt-get install -y \
    git curl libpng-dev libonig-dev libxml2-dev zip unzip && \
    rm -rf /var/lib/apt/lists/*

RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html
COPY . .

RUN composer install --no-dev --optimize-autoloader

RUN chown -R www-data:www-data /var/www/html && \
    chmod -R 775 storage bootstrap/cache

RUN a2enmod rewrite

# Полностью заменяем apache2.conf
RUN echo 'ServerName localhost' >> /etc/apache2/apache2.conf

COPY apache.conf /etc/apache2/sites-available/000-default.conf

RUN echo 'Listen 8080' > /etc/apache2/ports.conf

RUN echo '<?php echo "PHP WORKS";' > /var/www/html/public/test.php

COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

EXPOSE 8080

CMD ["/docker-entrypoint.sh"]
